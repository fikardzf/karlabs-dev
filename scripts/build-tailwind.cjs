const fs = require('fs');
const path = require('path');
const { compile } = require('../vendor/tailwindcss/lib.js');
const config = require('../tailwind.config.js');

const root = process.cwd();
const outputFile = path.join(root, 'public', 'tailwind.css');

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function expandContentEntry(entry) {
  if (!entry.includes('*')) return [entry.replace(/^\.\//, '')];
  const normalized = entry.replace(/^\.\//, '');
  const dir = path.dirname(normalized);
  const pattern = path.basename(normalized);
  const ext = pattern.startsWith('*.') ? pattern.slice(1) : null;
  if (!ext) throw new Error(`Unsupported Tailwind content glob: ${entry}`);
  return fs.readdirSync(path.join(root, dir), { withFileTypes: true })
    .filter((item) => item.isFile() && item.name.endsWith(ext))
    .map((item) => path.join(dir, item.name));
}

function extractCandidates(text) {
  // Tailwind's compiler safely ignores non-utility tokens. Using a broad token
  // extraction here intentionally catches utilities in HTML, template strings,
  // className assignments, and classList operations without needing a runtime scanner.
  const candidates = new Set();
  const parts = text.split(/[\s"'`<>{}=;]+/g);
  for (let token of parts) {
    token = token.trim();
    token = token.replace(/^[,&|+!?]+|[,&|+!?]+$/g, '');
    if (!token || token.length > 260) continue;
    if (!/[A-Za-z]/.test(token)) continue;
    candidates.add(token);
  }
  return candidates;
}

async function main() {
  const files = [...new Set(config.content.flatMap(expandContentEntry))];
  const candidates = new Set(config.safelist || []);
  for (const file of files) {
    if (!fs.existsSync(path.join(root, file))) {
      throw new Error(`Tailwind content source missing: ${file}`);
    }
    for (const token of extractCandidates(read(file))) candidates.add(token);
  }

  const theme = read('vendor/tailwindcss/theme.css');
  const preflight = read('vendor/tailwindcss/preflight.css');
  const overrides = read('styles/tailwind-theme.css');
  const source = `${theme}\n${overrides}\n${preflight}\n@tailwind utilities;\n`;
  const compiler = await compile(source);
  const css = compiler.build([...candidates].sort());

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, css, 'utf8');
  console.log(`Tailwind production CSS built: ${path.relative(root, outputFile)} (${Buffer.byteLength(css)} bytes, ${candidates.size} scanned candidates)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
