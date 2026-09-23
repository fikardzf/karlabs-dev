# KAR Labs.dev — Static Production Site

Production website KAR Labs.dev menggunakan **static HTML, CSS, dan Vanilla JavaScript**. Build production tidak bergantung pada Vite/React.

## Development

```bash
npm run dev
```

Default local URL:

```text
http://localhost:5173/
http://localhost:5173/catalog.html
```

## Production checks

Sebelum deploy jalankan:

```bash
npm run check
```

Flow `npm run check`:

1. Validasi source dan SEO/hardening (`scripts/check.cjs`)
2. Build static production (`scripts/build.cjs`)
3. Validasi output `dist/` (`scripts/check-dist.cjs`)

Build manual tetap tersedia:

```bash
npm run build
```

Output production: `dist/`.

## Production architecture

- `index.html` — landing page utama
- `catalog.html` — katalog/demo interaktif
- `public/index.js` — interaction script homepage yang cacheable
- `public/catalog.css` — styling katalog
- `public/catalog-*.js` — module Vanilla JS katalog per fitur
- `scripts/build.cjs` — static copy build ke `dist/`
- `scripts/check.cjs` — source integrity checks
- `scripts/check-dist.cjs` — production output checks
- `robots.txt` / `sitemap.xml` — technical SEO
- `netlify.toml` — Netlify build + security headers

Folder `src/`, konfigurasi Vite/TypeScript/PostCSS, dan scaffold terkait masih dipertahankan sebagai legacy reference tetapi **bukan bagian dari production build**. Jangan memindahkan production kembali ke Vite/React tanpa keputusan arsitektur terpisah.

## External dependencies

Website masih memakai CDN untuk:

- Tailwind CSS Play CDN **3.4.17 pinned** — masih menjadi legacy production dependency; static compilation tetap menjadi technical debt terpisah agar migrasinya bisa diuji visual secara khusus
- Chart.js **4.5.1 pinned + lazy-loaded** — baru di-download ketika Calculator/Dashboard dibuka
- Lucide Icons **1.47.0 pinned + defer-loaded**
- Google Fonts — tetap memakai satu request gabungan dengan `preconnect` dan `display=swap`

Asset lokal di `/public/*` memakai cache browser 1 hari + `stale-while-revalidate` 7 hari. HTML tetap `must-revalidate` agar deploy baru tidak tertahan cache browser.

## Deployment

Production flow:

```text
GitHub main -> Netlify -> npm run build -> dist/
```

Netlify publish directory: `dist`. Node version: `20`.

## Version notes

### v2.6.0 — Catalog Modularization
`catalog.html` dipisah menjadi CSS dan module JavaScript per fitur tanpa mengubah static build architecture.

### v2.7.0 — Production Hardening & SEO Foundation
Menambahkan source/dist validation, SEO metadata, canonical URLs, robots/sitemap, social preview, pinned Chart.js/Lucide versions, Netlify security headers, modal HTML/accessibility cleanup, dan chatbot DOM escaping.

### v2.8.0 — Frontend Asset Optimization
Memindahkan JavaScript homepage dari inline ke asset cacheable, lazy-load Chart.js hanya pada fitur yang membutuhkan chart, pin Tailwind CDN ke 3.4.17, defer Lucide, menambahkan resource preconnect, WebP + lazy decoding untuk preview BUDS Motor, dan cache policy Netlify yang aman untuk asset non-fingerprinted.
