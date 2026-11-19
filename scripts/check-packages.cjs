const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const data = require('../config/packages.json');
const root = process.argv[2] || '.';
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const money = n => 'Rp' + new Intl.NumberFormat('id-ID').format(n);
assert.deepEqual(data.packages.map(p => p.price), [500000, 1500000, 3000000]);
assert.equal(data.premiumAutomationLimit, 1);
assert.equal(data.priceLabel, 'Start From');
const context = { window: {} };
vm.runInNewContext(read('public/packages.js'), context);
const packages = context.window.KARLabsPackages;
assert(Object.isFrozen(packages));
for (const p of data.packages) {
  assert.equal(packages[p.id].price, p.price);
  assert.equal(packages[p.id].formattedPrice, money(p.price));
  assert.equal(packages[p.id].formattedStartingPrice, 'Mulai ' + money(p.price));
  assert.equal(packages[p.id].priceNotice, data.priceNotice);
  assert(Object.isFrozen(packages[p.id]));
}
assert.equal(packages.premium.automationLimit, 1);
for (const file of ['index.html', 'catalog.html']) {
  const html = read(file);
  for (const p of data.packages) assert(html.includes(money(p.price)), `${file}: missing ${p.id} price`);
  assert(html.includes(data.premiumNotice.replace(/&/g, '&amp;')), `${file}: premium limits missing`);
  assert(html.includes(data.priceNotice), `${file}: starting-price explanation missing`);
  for (const invalid of [/Rp\s*(?:100|150|200|300)\.000\b/, /Selesai [\d-]+ hari/, /Support (?:7|30) hari/]) assert(!invalid.test(html), `${file}: stale commercial term ${invalid}`);
  assert(!html.includes('data-lucide="braces"'), `${file}: old primary logo remains`);
  assert(/<img[^>]+alt="KAR Labs"/.test(html));
  assert(html.includes('apple-touch-icon'));
  assert(html.includes('public/site.css?v='));
  assert(html.includes('public/site.js?v='));
}
const home = read('index.html');
const schema = JSON.parse(home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
assert.deepEqual(schema.makesOffer.map(offer => offer.priceSpecification.minPrice), data.packages.map(p => p.price));
assert(schema.makesOffer.every(offer => !('price' in offer) && !('maxPrice' in offer.priceSpecification)));
assert.equal((home.match(/class="package-start-label"/g) || []).length, 3);
assert.equal((home.match(/name="package-options"/g) || []).length, 3);
assert.equal((home.match(/class="package-overview"/g) || []).length, 3);
assert(home.includes('<p class="commercial-notice premium-scope-notice">' + data.premiumNotice), 'Core Premium limitations must remain outside optional package details');
assert(schema.logo.endsWith('/public/brand/karlabs-logo-384.webp'));
assert(home.indexOf('public/packages.js') < home.indexOf('public/consultation.js'));
assert(read('public/consultation.js').includes('info.formattedStartingPrice'));
assert(read('public/consultation.js').includes('info?.automationLimit === 1'));
for (const name of ['karlabs-logo-96.webp', 'karlabs-logo-192.webp', 'karlabs-logo-384.webp', 'karlabs-logo-512.webp', 'apple-touch-icon.png']) assert(fs.existsSync(path.join(root, 'public/brand', name)));
if (root === '.') {
  const original = fs.readFileSync('assets/brand/karlabs-logo-original.png');
  assert.equal(crypto.createHash('sha256').update(original).digest('hex'), '6a32518ee134f141ca927b9ad74e10830eb866210cb2eb98e83f4218cd0af4f8');
}
assert(!fs.existsSync(path.join(root, 'assets')) || root === '.', 'Original source assets should not ship in dist');
console.log(`Approved packages, scope, branding and light-theme checks passed (${root}).`);
