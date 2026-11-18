const fs = require('node:fs');
const assert = require('node:assert/strict');
const data = require('../config/packages.json');
const money = value => 'Rp' + new Intl.NumberFormat('id-ID').format(value);
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const list = items => '<ul>' + items.map(item => '<li>' + escape(item) + '</li>').join('') + '</ul>';
assert.deepEqual(data.packages.map(p => p.id), ['starter', 'professional', 'premium']);
assert.equal(data.premiumAutomationLimit, 1);
for (const p of data.packages) assert(Number.isSafeInteger(p.price) && p.price > 0);

function cards() {
  return '<div class="package-grid">' + data.packages.map(p => `<article class="package-card${p.id === 'premium' ? ' package-premium' : ''}" data-package="${p.id}" aria-labelledby="package-${p.id}-title">
    <div class="package-overview"><header><p class="package-tier">${escape(p.name)}</p><h3 id="package-${p.id}-title">${escape(p.positioning)}</h3><p class="package-price"><span class="package-start-label" lang="en">${escape(data.priceLabel)}</span><span>${money(p.price)}</span></p><p>${escape(p.target)}</p></header>
    <h4>Cakupan paket</h4>${list(p.included)}
    <p class="${p.id === 'premium' ? 'premium-limit' : 'package-limit'}">${escape(p.automation)}.</p>
    </div><details class="package-details" name="package-options"><summary>Fitur opsional dan batas paket</summary><div class="package-details-body">${p.id === 'premium' ? '<p class="premium-limit">' + escape(data.premiumNotice) + '</p>' : ''}<h4>Opsional · penawaran terpisah</h4>${list(p.optional)}<h4>Tidak otomatis termasuk</h4>${list(p.excluded)}</div></details>
    <a class="pricing-package-cta btn-primary-theme" href="index.html?package=${p.id}#contact-form" data-inquiry-package="${p.name}">Bahas Paket ${p.name}</a>
  </article>`).join('') + '</div>';
}
function comparison() {
  const rows = [
    ['Harga mulai dari', ...data.packages.map(p => 'Mulai ' + money(p.price))],
    ['Kebutuhan utama', 'Presentasi website / produk dasar', 'Website dan katalog lebih lengkap', 'Website personal dan fungsi terpilih'],
    ['Kategori, pencarian / filter', 'Informasi produk standar', 'Bila sesuai data dan kebutuhan', 'Custom sesuai proposal'],
    ['Workflow automasi', 'Tidak termasuk', 'Penawaran terpisah', 'Maksimal 1 workflow sederhana yang disepakati'],
    ['ERP, CRM lengkap, AI kompleks', 'Penawaran terpisah', 'Penawaran terpisah', 'Penawaran terpisah; bukan isi otomatis paket'],
    ['Integrasi / fitur tambahan', 'Penawaran terpisah', 'Penawaran terpisah', 'Integrasi dasar terpilih bila layak; sisanya ditawarkan terpisah'],
    ['Domain, hosting, lisensi dan API', 'Konfirmasi pada penawaran', 'Konfirmasi pada penawaran', 'Konfirmasi pada penawaran'],
    ['Revisi, jadwal dan support', 'Disepakati tertulis', 'Disepakati tertulis', 'Disepakati tertulis; bukan unlimited / seumur hidup'],
    ['Maintenance dan monitoring', 'Perjanjian terpisah', 'Perjanjian terpisah', 'Perjanjian terpisah']
  ];
  return `<div class="package-comparison" role="region" aria-label="Perbandingan paket, geser tabel pada layar kecil" tabindex="0"><table><caption>Perbandingan paket</caption><thead><tr><th scope="col">Cakupan</th>${data.packages.map(p => '<th scope="col">' + p.name + '</th>').join('')}</tr></thead><tbody>${rows.map(row => '<tr><th scope="row">' + escape(row[0]) + '</th>' + row.slice(1).map(cell => '<td>' + escape(cell) + '</td>').join('') + '</tr>').join('')}</tbody></table></div>`;
}
function faq() {
  const items = [
    ['Apa perbedaan setiap paket?', `Starter mulai ${money(data.packages[0].price)} untuk website dasar. Professional mulai ${money(data.packages[1].price)} untuk katalog lebih lengkap. Premium mulai ${money(data.packages[2].price)} untuk website khusus dan maksimal 1 workflow sederhana yang disepakati. ${data.priceNotice}`],
    ['Apakah harga termasuk domain dan hosting?', 'Domain, hosting, lisensi, API, dan langganan pihak ketiga belum otomatis termasuk. Pilihan layanan, kepemilikan akun, biaya awal dan perpanjangan dikonfirmasi pada penawaran.'],
    ['Apakah Premium termasuk ERP atau CRM?', 'ERP, CRM lengkap, backend kompleks, database skala besar, aplikasi mobile, payment gateway kompleks, dan autentikasi enterprise memerlukan penawaran terpisah.'],
    ['Apakah paket Premium termasuk integrasi AI?', 'AI agent kompleks, training atau fine-tuning model, dan integrasi AI API tingkat lanjut tidak otomatis termasuk. Jika dibutuhkan, kelayakan teknis, izin, biaya API, dan scope dibahas melalui penawaran terpisah.'],
    ['Berapa workflow automasi yang termasuk?', 'Premium mencakup maksimal 1 workflow sederhana yang dinilai layak: satu pemicu, aksi berurutan, pemetaan data standar, dan integrasi yang didukung. Alurnya didokumentasikan dan disetujui tertulis. Automasi untuk Starter dan Professional ditawarkan terpisah.'],
    ['Bagaimana jika membutuhkan fitur tambahan?', data.additionalNotice],
    ['Bagaimana biaya maintenance?', 'Maintenance, pemantauan automasi, pembaruan konten, dan perpanjangan layanan belum otomatis termasuk. Biaya, periode, serta cakupan dukungan mengikuti perjanjian terpisah.'],
    ['Bagaimana ketentuan revisi dan pengerjaan?', 'Cakupan, hasil, revisi, jadwal, pembayaran, dan dukungan disepakati tertulis. Perbaikan bug dibedakan dari perubahan kebutuhan. Revisi dan dukungan memiliki batas sesuai kesepakatan.'],
    ['Apakah demo terhubung ke sistem nyata?', 'Demo memakai data contoh di browser. Integrasi nyata membutuhkan layanan yang mendukung, akses akun, izin, dan pembahasan biaya tambahan.']
  ];
  return '<div class="faq-list">' + items.map(([question, answer]) => `<div class="faq-item"><h3><button class="faq-trigger"><span>${escape(question)}</span><i data-lucide="chevron-down" class="accordion-icon w-5 h-5" aria-hidden="true"></i></button></h3><div class="accordion-content"><p>${escape(answer)}</p></div></div>`).join('') + '</div>';
}
function replaceBlock(html, marker, content) {
  const pattern = new RegExp(`(<!-- ${marker}:start -->)[\\s\\S]*?(<!-- ${marker}:end -->)`);
  assert(pattern.test(html), `Missing content block: ${marker}`);
  return html.replace(pattern, (_, start, end) => start + '\n' + content + '\n' + end);
}

let home = fs.readFileSync('index.html', 'utf8');
home = replaceBlock(home, 'packages', `<p class="package-price-notice">${escape(data.priceNotice)}</p>` + cards() + comparison() + `<p class="commercial-notice">${escape(data.additionalNotice)}</p><p class="commercial-notice">${escape(data.commercialNotice)}</p>`);
home = replaceBlock(home, 'package-faq', faq());
let catalog = fs.readFileSync('catalog.html', 'utf8');
catalog = replaceBlock(catalog, 'package-summary', `<section class="catalog-packages" aria-labelledby="catalog-packages-title"><h2 id="catalog-packages-title">Paket implementasi</h2><div class="catalog-package-links">${data.packages.map(p => `<a href="index.html?package=${p.id}#contact-form" data-inquiry-package="${p.name}"><span>${p.name}</span><strong>Mulai ${money(p.price)}</strong></a>`).join('')}</div><p>${escape(data.priceNotice)} <a href="index.html#harga">Bandingkan cakupan paket</a>.</p><p class="premium-limit">${escape(data.premiumNotice)}</p></section>`);
for (const p of data.packages) {
  const pattern = new RegExp(`(<span data-package-price="${p.id}">)[^<]*(</span>)`, 'g');
  home = home.replace(pattern, (_, start, end) => start + money(p.price) + end);
}
home = home.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/, (_, value) => {
  const schema = JSON.parse(value);
  schema.makesOffer = data.packages.map(p => ({
    '@type': 'Offer', name: p.name,
    priceSpecification: { '@type': 'PriceSpecification', minPrice: p.price, priceCurrency: data.currency },
    url: schema.url + '#harga',
    description: data.priceNotice + ' ' + p.target + ' ' + p.automation + '. ' + data.commercialNotice,
    itemOffered: { '@type': 'Service', name: p.positioning }
  }));
  return '<script type="application/ld+json">\n' + JSON.stringify(schema, null, 2).replace(/</g, '\\u003c') + '\n</script>';
});
fs.writeFileSync('index.html', home);
fs.writeFileSync('catalog.html', catalog);
const client = Object.fromEntries(data.packages.map(p => [p.id, { name: p.name, price: p.price, formattedPrice: money(p.price), formattedStartingPrice: 'Mulai ' + money(p.price), priceNotice: data.priceNotice, automationLimit: p.id === 'premium' ? 1 : 0 }]));
fs.writeFileSync('public/packages.js', "// Generated from config/packages.json by npm run build:content.\n'use strict';\nwindow.KARLabsPackages = Object.freeze(Object.fromEntries(Object.entries(" + JSON.stringify(client) + ").map(([id, value]) => [id, Object.freeze(value)])));\n");
console.log('Package content built from config/packages.json.');
