const fs = require('fs');
const required = [
  'dist/index.html','dist/catalog.html','dist/robots.txt','dist/sitemap.xml','dist/favicon.svg',
  'dist/public/index.js','dist/public/catalog.css','dist/public/catalog-init.js','dist/public/catalog-pos.js',
  'dist/public/karlabs-social-preview.png','dist/public/case-studies/buds-motor-catalog-preview.png',
  'dist/public/case-studies/buds-motor-catalog-preview.webp'
];
let ok = true;
for (const file of required) {
  if (!fs.existsSync(file)) { console.error(`DIST CHECK FAILED: Missing ${file}`); ok = false; }
}
if (fs.existsSync('dist/src')) { console.error('DIST CHECK FAILED: legacy src/ leaked into production'); ok = false; }
if (fs.existsSync('dist/catalog.html')) {
  const html = fs.readFileSync('dist/catalog.html','utf8');
  if (/chart\.js@4\.5\.1[^"']*["'][^>]*><\/script>/i.test(html)) { console.error('DIST CHECK FAILED: Chart.js is eager-loaded in catalog HTML'); ok = false; }
  if (!html.includes('buds-motor-catalog-preview.webp')) { console.error('DIST CHECK FAILED: optimized WebP preview not referenced'); ok = false; }
}
if (!ok) process.exit(1);
console.log('Production dist checks passed.');
