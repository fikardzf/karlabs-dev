const fs = require('fs');

const requiredFiles = [
  'index.html', 'catalog.html', 'package.json', 'netlify.toml', 'robots.txt', 'sitemap.xml',
  'public/index.js',
  'public/catalog.css', 'public/catalog-tailwind-config.js', 'public/catalog-core.js',
  'public/catalog-landing.js', 'public/catalog-chatbot.js', 'public/catalog-calculators.js',
  'public/catalog-dashboard.js', 'public/catalog-workflow.js', 'public/catalog-pos.js',
  'public/catalog-scraping.js', 'public/catalog-init.js', 'public/karlabs-social-preview.png',
  'public/case-studies/buds-motor-catalog-preview.webp'
];
let ok = true;
function fail(message) { console.error(`CHECK FAILED: ${message}`); ok = false; }
for (const file of requiredFiles) if (!fs.existsSync(file)) fail(`Missing required file: ${file}`);

function read(file) { return fs.readFileSync(file, 'utf8'); }
function validateHtml(file, canonical) {
  const html = read(file);
  const head = (html.match(/<head[\s\S]*?<\/head>/i) || [''])[0];
  if (!head) fail(`${file}: missing <head>`);
  if (/<(?:div|main|section|footer|nav)\b/i.test(head)) fail(`${file}: body content found inside <head>`);
  if (!html.includes(`<link rel="canonical" href="${canonical}"`)) fail(`${file}: canonical URL missing/wrong`);
  for (const token of ['name="description"','name="robots"','property="og:title"','property="og:description"','property="og:image"','name="twitter:card"','application/ld+json']) {
    if (!head.includes(token)) fail(`${file}: missing SEO token ${token}`);
  }
  const blankAnchors = [...html.matchAll(/<a\b[^>]*target=["']_blank["'][^>]*>/gi)].map(m=>m[0]);
  for (const tag of blankAnchors) if (!/rel=["'][^"']*noopener[^"']*noreferrer[^"']*["']/i.test(tag)) fail(`${file}: target=_blank without noopener noreferrer`);
  if (!head.includes('https://cdn.tailwindcss.com/3.4.17')) fail(`${file}: Tailwind CDN is not pinned to 3.4.17`);
  if (/src=["']https:\/\/cdn\.tailwindcss\.com["']/i.test(head)) fail(`${file}: unpinned Tailwind CDN URL found`);
  if (!/lucide@1\.47\.0[^>]+\bdefer\b/i.test(head)) fail(`${file}: Lucide should stay pinned and defer-loaded`);
}
validateHtml('index.html','https://karlabs.dev/');
validateHtml('catalog.html','https://karlabs.dev/catalog.html');

const indexHtml = read('index.html');
const catalogHtml = read('catalog.html');
const coreJs = read('public/catalog-core.js');
const initJs = read('public/catalog-init.js');
const netlify = read('netlify.toml');
const allText = ['index.html','catalog.html',...requiredFiles.filter(f=>f.endsWith('.js'))].filter(fs.existsSync).map(read).join('\n');

if (/lucide@latest/i.test(allText)) fail('Unpinned Lucide dependency found');
if (/cdn\.jsdelivr\.net\/npm\/chart\.js(?:["'/?]|$)/i.test(allText)) fail('Unpinned Chart.js dependency found');
if (/chart\.js@4\.5\.1[^"']*["'][^>]*><\/script>/i.test(catalogHtml)) fail('Chart.js must not be eager-loaded in catalog.html');
if (!coreJs.includes('function ensureChartJs()') || !coreJs.includes('chart.js@4.5.1')) fail('Lazy Chart.js loader missing from catalog-core.js');
if (!initJs.includes('ensureChartFeature') || initJs.includes("safeInit('calculators', initCalculators)") || initJs.includes("safeInit('dashboard', initDashboard)")) fail('Calculator/Dashboard should initialize lazily');
if (!indexHtml.includes('<script src="./public/index.js" defer></script>')) fail('Homepage cacheable JS asset missing');
if (!catalogHtml.includes('buds-motor-catalog-preview.webp') || !catalogHtml.includes('loading="lazy"') || !catalogHtml.includes('decoding="async"')) fail('Optimized BUDS preview image markup missing');
if (!netlify.includes('for = "/public/*"') || !netlify.includes('stale-while-revalidate=604800')) fail('Static asset cache policy missing');
if (!netlify.includes('for = "/*.html"') || !netlify.includes('max-age=0, must-revalidate')) fail('HTML revalidation cache policy missing');
if (!read('robots.txt').includes('https://karlabs.dev/sitemap.xml')) fail('robots.txt does not reference sitemap');
if (!read('sitemap.xml').includes('https://karlabs.dev/catalog.html')) fail('sitemap.xml missing catalog URL');

if (!ok) process.exit(1);
console.log('Static project source checks passed.');
