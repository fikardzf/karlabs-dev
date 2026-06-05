const http = require('http');
const fs = require('fs');
const path = require('path');

const rootArg = process.argv[2];
const portArg = process.argv[3];
const root = path.resolve(process.cwd(), rootArg || '.');
const port = Number(portArg || process.env.PORT || 5173);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8'
};

function safeResolve(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split('?')[0]).replace(/^\/+/, '');
  const target = path.resolve(root, cleanPath || 'index.html');
  if (!target.startsWith(root)) return null;
  return target;
}

const server = http.createServer((req, res) => {
  let filePath = safeResolve(req.url || '/');
  if (!filePath) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  try {
    const stat = fs.existsSync(filePath) ? fs.statSync(filePath) : null;
    if (stat && stat.isDirectory()) filePath = path.join(filePath, 'index.html');

    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('File not found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Server error: ${error.message}`);
  }
});

server.listen(port, () => {
  console.log(`\nStatic dev server running:`);
  console.log(`  Local: http://localhost:${port}/`);
  console.log(`  Catalog: http://localhost:${port}/catalog.html`);
  console.log(`\nServing folder: ${root}`);
  console.log('Press Ctrl + C to stop.\n');
});
