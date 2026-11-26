'use strict';

const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { projects, categories } = require('../config/portfolio.cjs');

const motionVendor = path.join('public', 'motion-vendor');
fs.mkdirSync(motionVendor, {recursive:true});
for (const name of ['gsap.min.js', 'ScrollTrigger.min.js']) {
  fs.copyFileSync(require.resolve('gsap/dist/' + name), path.join(motionVendor, name));
}

const read = file => fs.readFileSync(file, 'utf8');
const catalog = read('catalog.html');
const template = read('templates/project.html');
const origin = 'https://karlabs-dev.netlify.app';
const number = n => String(n).padStart(2, '0');
const url = project => '/portfolio/' + project.slug + '/';
const artVersion = project => project.artworkVersion || 'pratinjau-ui';
const art = project => '/public/portfolio-art/' + project.slug + '.webp?v=' + artVersion(project);
const escape = value => String(value).replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
const header = `<header class="studio-header">
  <a class="studio-brand" href="/" aria-label="KAR Labs.dev — Beranda"><img src="/public/brand/karlabs-logo-96.webp" alt="KAR Labs" width="42" height="42"><span>KAR Labs<span>.dev</span></span></a>
  <nav aria-label="Navigasi utama"><a class="price-link" href="/#harga">Paket &amp; harga</a></nav>
  <a class="consult-link" data-lead-placement="header" href="https://wa.me/6285777345985" target="_blank" rel="noopener noreferrer">Konsultasi Gratis</a>
</header>`;
const icons = catalog.match(/<script src="https:\/\/unpkg\.com\/lucide[^>]*><\/script>/)[0];
const routes = projects.map(p => ({ slug:p.slug, title:p.title, category:p.category }));
const filters = Object.entries({ all:'Semua', ...categories }).map(([id, label]) =>
  `<button type="button" data-filter="${id}" aria-pressed="${id === 'all'}">${label}</button>`).join('\n');
assert.equal(new Set(projects.map(p => p.slug)).size, projects.length, 'Duplicate portfolio route');

function artSources(p, sizes, preload = false) {
  const variants = [480, 640].map(width => ({width, file:`public/portfolio-art/${p.slug}-${width}.webp`}))
    .filter(({file}) => fs.existsSync(file)).map(({file,width}) => `/${file}?v=${artVersion(p)} ${width}w`);
  if (!variants.length) return '';
  variants.push(art(p) + ' 960w');
  const prefix = preload ? 'image' : '';
  return `${prefix}srcset="${variants.join(', ')}" ${prefix}sizes="${sizes}"`;
}

const gallerySizes = '(max-width: 650px) 65vw, (max-width: 850px) 44vw, min(37vw, 58svh, 640px)';
const indexSizes = '(max-width: 850px) 45vw, (min-width: 1500px) 320px, 22vw';

function panelLink(p, i, sizes, { deferImage = false, numbered = true } = {}) {
  const image = `<img src="${art(p)}" ${artSources(p, sizes)} alt="${escape(p.artworkAlt)}" draggable="false" width="960" height="720" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
  return `<a class="exhibit" href="${url(p)}" data-slug="${p.slug}" data-category="${p.category}" style="--artwork-transition:art-${p.slug}" aria-label="Buka demo ${escape(p.title)}">
    <span class="art-frame">${deferImage ? '<template>' + image + '</template>' : image}</span>
    <span class="art-label">${numbered ? '<span class="art-number">' + number(i+1) + '</span>' : ''}<span class="art-name">${escape(p.title)}</span><span class="art-category">${categories[p.category]}</span></span>
  </a>`;
}

const gallery = `<noscript><a class="quiet-button" href="/portfolio/">Pilih demo dari daftar</a></noscript><div class="room-toolbar"><div class="filter-bar" aria-label="Filter demo" role="group">${filters}</div></div>
  <div class="gallery-stage" tabindex="0" role="region" aria-label="Galeri proyek">
    <div class="room-wall" aria-hidden="true"></div><div class="room-ceiling" aria-hidden="true"></div>
    <div class="gallery-track">${projects.map((p,i) => panelLink(p,i,gallerySizes,{numbered:false, deferImage:i > 1 && i < projects.length - 1})).join('\n')}</div>
  </div>
  <div class="gallery-desk">
    <div class="selection"><p class="folio-meta"><i aria-hidden="true"></i> Demo terpilih</p><h2 id="selected-title" aria-live="polite" aria-atomic="true">${escape(projects[0].title)}</h2><p id="selected-desc">${escape(projects[0].description)}</p></div>
    <a id="open-project" class="ink-button" href="${url(projects[0])}">Buka demo <span aria-hidden="true">↗</span></a>
  </div>
  <script type="application/json" id="exhibit-descriptions">${JSON.stringify(Object.fromEntries(projects.map(p=>[p.slug,p.description]))).replace(/</g,'\\u003c')}</script>`;

function replaceBlock(html, key, content) {
  const pattern = new RegExp(`(<!-- ${key}:start -->)[\\s\\S]*?(<!-- ${key}:end -->)`);
  assert(pattern.test(html), 'Missing block: ' + key);
  return html.replace(pattern, (_, start, end) => start + '\n' + content + '\n' + end);
}
function writePage(route, html) {
  fs.mkdirSync(route, { recursive:true });
  fs.writeFileSync(path.join(route, 'index.html'), html);
}
let home = replaceBlock(read('index.html'), 'portfolio-header', header);
const first = projects[0];
home = replaceBlock(home, 'portfolio-preload', `<link rel="preload" as="image" href="${art(first)}" ${artSources(first,gallerySizes,true)} fetchpriority="high">`);
home = replaceBlock(home, 'portfolio-gallery', gallery);
fs.writeFileSync('index.html', home);
writePage('portfolio', `<!doctype html><html lang="id"><head>
  <style>@media (prefers-reduced-motion:no-preference) { @view-transition { navigation:auto; } }</style><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Indeks Demo | KAR Labs.dev</title><meta name="description" content="Pilih demo website, alat bisnis, dashboard, dan automasi untuk usaha Anda."><link rel="canonical" href="${origin}/portfolio/"><link rel="icon" href="/public/favicon.svg"><link rel="stylesheet" href="/public/portfolio.css?v=9"></head>
<body class="collection-page"><a class="skip-link" href="#collection">Lewati ke indeks</a>${header}<main class="collection-main" id="collection"><a href="/" class="canvas-crumb">Kembali ke galeri</a><h1>Indeks demo.</h1>
<div class="filter-bar index-filters" role="group" aria-label="Filter indeks" hidden>${filters}</div>
<div class="collection-grid">${projects.map((p,i) => panelLink(p,i,indexSizes)).join('\n')}</div></main><script src="/public/portfolio-index.js?v=1" defer></script></body></html>`);

for (const [i, p] of projects.entries()) {
  assert(/^[a-z0-9-]+$/.test(p.slug) && categories[p.category] && p.capabilities.length >= 3);
  const match = catalog.match(new RegExp(`<section id="${p.slug}" class="service-panel[^"]*"[^>]*>([\\s\\S]*?)</section>`));
  assert(match, 'Missing demo section: ' + p.slug);
  const panel = `<section id="${p.slug}" class="service-panel active">${match[1]}</section>`.replace(/(src|srcset|href)="public\//g, '$1="/public/');
  let modal = '';
  if (p.modal) {
    const fragment = catalog.match(new RegExp(`<!-- canvas-dialog:${p.modal} -->([\\s\\S]*?)<!-- /canvas-dialog:${p.modal} -->`));
    assert(fragment, 'Missing dialog: ' + p.modal);
    modal = fragment[1].trim();
  }
  const previous = projects[(i + projects.length - 1) % projects.length], next = projects[(i+1) % projects.length];
  const inquiry = 'https://wa.me/6285777345985?text=' + encodeURIComponent(`Halo KAR Labs, saya tertarik membuat proyek seperti demo ${p.title}. Bisa konsultasi?`);
  const values = {
    header:header.replace('href="https://wa.me/6285777345985"', `href="${inquiry}" data-lead-service="${p.slug}"`), icons, panel, modal, title:escape(p.title), description:escape(p.description), slug:p.slug, canonical:origin+url(p),
    art:art(p), artSources:artSources(p,'(max-width: 650px) 28vw, (min-width: 1500px) 360px, 24vw'),
    artworkAlt:escape(p.artworkAlt), category:categories[p.category], number:number(i+1)+' / '+number(projects.length), init:p.init, charts:String(!!p.charts),
    moduleUrl:'/public/catalog-' + p.module + '.js?v=20261126-audit',
    inquiry, inquiryLabel:escape(p.inquiryLabel),
    capabilities:p.capabilities.map(c=>`<li>${escape(c)}</li>`).join(''), prevTitle:escape(previous.title), nextTitle:escape(next.title),
    prevUrl:url(previous), nextUrl:url(next), routes:JSON.stringify(routes).replace(/</g,'\\u003c'),
    scripts:['lead-events','catalog-core','catalog-dialogs','portfolio-canvas'].map(name=>`<script src="/public/${name}.js?v=20261123-koleksi" defer></script>`).join('\n  ')
  };
  writePage(path.join('portfolio',p.slug), template.replace(/\{\{(\w+)\}\}/g, (_, key) => { assert(key in values, key); return values[key]; }));
}
const urls = ['/', '/catalog.html', '/portfolio/', ...projects.map(url)];
fs.writeFileSync('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.map(p => {
  const metadata = p === '/' || p === '/catalog.html' ? `<changefreq>monthly</changefreq><priority>${p === '/' ? '1.0' : '0.8'}</priority>` : '';
  return `  <url><loc>${origin}${p}</loc>${metadata}</url>`;
}).join('\n') + '\n</urlset>\n');

