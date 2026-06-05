const fs = require('fs');
const path = require('path');

const root = process.cwd();
const dist = path.join(root, 'dist');
const filesToCopy = ['index.html', 'catalog.html'];
const dirsToCopy = ['public'];

function rmDir(target) {
  if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true });
}

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, destPath);
    else copyFile(srcPath, destPath);
  }
}

rmDir(dist);
fs.mkdirSync(dist, { recursive: true });

for (const file of filesToCopy) {
  const src = path.join(root, file);
  if (!fs.existsSync(src)) throw new Error(`Missing required file: ${file}`);
  copyFile(src, path.join(dist, file));
}

for (const dir of dirsToCopy) {
  copyDir(path.join(root, dir), path.join(dist, dir));
}

// Put favicon at dist root if available, so existing links keep working.
const favicon = path.join(root, 'public', 'favicon.svg');
if (fs.existsSync(favicon)) copyFile(favicon, path.join(dist, 'favicon.svg'));

console.log('Build complete. Static production files are in dist/');
console.log('Deploy dist/ to Vercel, Netlify, Cloudflare Pages, GitHub Pages, or any static hosting.');
