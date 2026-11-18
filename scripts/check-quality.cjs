const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = process.argv[2] || '.';
const origin = 'https://karlabs-dev.netlify.app';
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, 'i'))?.[1];
const pages = ['index.html', 'catalog.html'];
for (const file of pages) {
  const html = read(file);
  const canonical = origin + (file === 'index.html' ? '/' : '/catalog.html');
  assert(!html.includes('https://karlabs.dev'), `${file}: retired domain reference`);
  assert.equal((html.match(/<h1\b/gi) || []).length, 1, `${file}: one primary heading`);
  assert.match(html, /<html lang="id"/);
  assert.match(html, /<main\b/);
  const tags = [...html.matchAll(/<(?:a|link|img|script|meta)\b[^>]*>/gi)].map(m => m[0]);
  const meta = name => attribute(tags.find(t => attribute(t, 'property') === name || attribute(t, 'name') === name) || '', 'content');
  assert.equal(meta('og:url'), canonical);
  for (const name of ['description', 'og:title', 'og:description', 'og:image:alt', 'twitter:title', 'twitter:description', 'twitter:image:alt']) assert(meta(name), `${file}: ${name}`);
  for (const name of ['og:image', 'twitter:image']) {
    const image = new URL(meta(name));
    assert.equal(image.origin + image.pathname, origin + '/public/karlabs-social-preview.png');
    assert([...image.searchParams].every(([key, value]) => key === 'v' && /^[a-z0-9.-]+$/.test(value)), `${file}: unexpected social image query`);
  }
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
  assert.equal(schemas.length, 1);
  assert.equal(schemas[0]['@context'], 'https://schema.org');
  assert.equal(schemas[0].url, canonical);
  assert.equal(schemas[0]['@type'], file === 'index.html' ? 'Organization' : 'WebPage');
  if (schemas[0].isPartOf) assert.equal(schemas[0].isPartOf.url, origin + '/');
  for (const tag of tags) {
    const target = attribute(tag, 'target');
    if (target === '_blank') {
      const rel = (attribute(tag, 'rel') || '').split(/\s+/);
      assert(rel.includes('noopener') && rel.includes('noreferrer'), `${file}: unsafe new tab`);
    }
    if (/^<img\b/i.test(tag)) for (const name of ['alt', 'width', 'height']) assert(attribute(tag, name), `${file}: image ${name}`);
    if (/^<script\b/i.test(tag) && attribute(tag, 'src')) {
      assert.match(tag, /\bdefer\b/, `${file}: script should defer`);
      if (attribute(tag, 'src').startsWith('https://')) {
        assert.match(attribute(tag, 'integrity') || '', /^sha384-[A-Za-z0-9+/]+=*$/);
        assert.equal(attribute(tag, 'crossorigin'), 'anonymous');
      }
    }
    const reference = attribute(tag, /^<(?:script|img)\b/i.test(tag) ? 'src' : 'href');
    if (reference && !/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(reference)) {
      const url = new URL(reference, origin + '/' + file);
      const localFile = decodeURIComponent(url.pathname.slice(1)) || 'index.html';
      assert(fs.existsSync(path.join(root, localFile)), `${file}: missing local target ${reference}`);
      if (url.hash && localFile.endsWith('.html')) {
        const ids = [...read(localFile).matchAll(/\bid=["']([^"']+)["']/g)].map(m => m[1]);
        assert(ids.includes(decodeURIComponent(url.hash.slice(1))), `${file}: missing fragment ${reference}`);
      }
    }
    const ref = attribute(tag, 'href') || attribute(tag, 'src');
    if (!ref || /^(?:https?:|mailto:|data:)/i.test(ref)) continue;
    assert(!/^(?:javascript:|\/\/)/i.test(ref), `${file}: unsafe reference`);
    const url = new URL(ref, origin + '/' + file);
    const destination = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
    assert(fs.existsSync(path.join(root, destination)), `${file}: missing ${destination}`);
    if (url.hash) assert(read(destination).includes(`id="${url.hash.slice(1)}"`), `${file}: missing anchor ${ref}`);
  }
}
assert(read('robots.txt').includes(origin + '/sitemap.xml'));
const locations = [...read('sitemap.xml').matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
assert.deepEqual(locations, [origin + '/', origin + '/catalog.html']);

const context = vm.createContext({});
vm.runInContext(read('public/catalog-core.js'), context);
assert.equal(vm.runInContext('escapeCatalogHtml(\'<img src=x onerror="bad()">&\')', context), '&lt;img src=x onerror=&quot;bad()&quot;&gt;&amp;');
vm.runInContext(read('public/catalog-scraping.js'), context);
for (const value of ['=1+1', '+SUM(A1)', '-1+2', '@SUM(A1)', '\t=1+1', '\r=1+1', '\n=1+1', '  =1+1']) {
  context.csvProbe = value;
  assert(vm.runInContext('csvCell(csvProbe)', context).startsWith('"\''), 'Formula-like CSV text must be neutralized');
}
assert.equal(vm.runInContext('csvCell(-1200)', context), '"-1200"');
assert.equal(vm.runInContext('csvCell(\'kopi "susu", enak\')', context), '"kopi ""susu"", enak"');
console.log(`SEO, static links, SRI markup, DOM escaping, and CSV checks passed (${root}).`);
