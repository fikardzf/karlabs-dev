const fs = require('fs');
const required = [
  'dist/public/gallery-scene.mjs', 'dist/public/motion-vendor/gsap.min.js', 'dist/public/motion-vendor/ScrollTrigger.min.js',
  'dist/index.html','dist/catalog.html','dist/robots.txt','dist/sitemap.xml','dist/favicon.svg',
  'dist/public/tailwind.css','dist/public/index.js','dist/public/lead-events.js','dist/public/consultation.js','dist/public/catalog.css','dist/public/catalog-init.js','dist/public/catalog-pos.js',
  'dist/public/packages.js','dist/public/site.css','dist/public/site.js','dist/public/home.css','dist/public/brand/apple-touch-icon.png',
  'dist/public/karlabs-social-preview.png','dist/public/case-studies/buds-motor-catalog-preview.png',
  'dist/public/case-studies/buds-motor-catalog-preview.webp'
];
let ok = true;
for (const file of required) {
  if (!fs.existsSync(file)) { console.error(`DIST CHECK FAILED: Missing ${file}`); ok = false; }
}
if (fs.existsSync('dist/src')) { console.error('DIST CHECK FAILED: legacy src/ leaked into production'); ok = false; }
if (fs.existsSync('dist/public/catalog-tailwind-config.js')) { console.error('DIST CHECK FAILED: retired runtime Tailwind config leaked into production'); ok = false; }
for (const htmlFile of ['dist/index.html','dist/catalog.html']) {
  if (!fs.existsSync(htmlFile)) continue;
  const html = fs.readFileSync(htmlFile,'utf8');
  if (/cdn\.tailwindcss\.com/i.test(html)) { console.error(`DIST CHECK FAILED: Tailwind Play CDN found in ${htmlFile}`); ok = false; }
  if (!/href=["'](?:\.\/)?public\/tailwind\.css(?:\?v=[a-z0-9.-]+)?["']/i.test(html)) { console.error(`DIST CHECK FAILED: compiled Tailwind CSS missing in ${htmlFile}`); ok = false; }
}
if (fs.existsSync('dist/catalog.html')) {
  const html = fs.readFileSync('dist/catalog.html','utf8');
  if (/chart\.js@4\.5\.1[^"']*["'][^>]*><\/script>/i.test(html)) { console.error('DIST CHECK FAILED: Chart.js is eager-loaded in catalog HTML'); ok = false; }
  if (!html.includes('buds-motor-catalog-preview.webp')) { console.error('DIST CHECK FAILED: optimized WebP preview not referenced'); ok = false; }
}
if (fs.existsSync('dist/public/tailwind.css')) {
  const css = fs.readFileSync('dist/public/tailwind.css','utf8');
  if (css.length < 20000 || !css.includes('.text-accent')) { console.error('DIST CHECK FAILED: Tailwind CSS output is incomplete'); ok = false; }
}
if (!ok) process.exit(1);
console.log('Production dist checks passed.');
