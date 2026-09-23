# KAR Labs v2.8.0 — Frontend Asset Optimization

## Status
PATCH CREATED — PENDING USER ACCEPTANCE

Baseline: v2.7.0 — Production Hardening & SEO Foundation (ACCEPTED)

## Goal
Mengurangi pekerjaan runtime browser dan request yang tidak perlu tanpa redesign, tanpa perubahan framework, dan tanpa mengubah flow GitHub -> Netlify.

## Scope
- Tailwind Play CDN dipin eksplisit ke `3.4.17` pada homepage dan catalog untuk menghilangkan redirect/version drift.
- Lucide tetap pinned `1.47.0` dan diubah menjadi `defer`.
- Chart.js `4.5.1` tidak lagi eager-loaded di `<head>` catalog.
- Chart.js sekarang di-load on-demand hanya ketika user membuka Calculator atau Dashboard.
- Calculator/Dashboard initialization ikut lazy setelah Chart.js tersedia.
- JavaScript homepage dipindahkan dari inline block ke `public/index.js` agar dapat di-cache browser.
- Preview BUDS Motor mendapat WebP 47 KB (PNG fallback tetap dipertahankan), `loading="lazy"`, `decoding="async"`, dan intrinsic width/height.
- Netlify cache policy ditambahkan untuk `/public/*`, HTML, robots.txt, dan sitemap.xml.
- Resource hint `preconnect` ditambahkan untuk Tailwind CDN dan Unpkg.
- Source/dist checks diperluas agar optimasi di atas tidak regress.

## Important Tailwind note
Tailwind Play CDN belum dipindahkan ke compiled/static CSS pada patch ini. Versi sudah dipin ke 3.4.17 untuk kestabilan dan menghilangkan redirect/version drift, tetapi runtime compiler masih ada. Migrasi compiled Tailwind sebaiknya dilakukan sebagai patch terisolasi karena perlu build dependency dan visual regression test seluruh utility class/dynamic class catalog.

## Files changed
- `index.html`
- `catalog.html`
- `netlify.toml`
- `README.md`
- `public/catalog-core.js`
- `public/catalog-init.js`
- `scripts/check.cjs`
- `scripts/check-dist.cjs`

## Files added
- `public/index.js`
- `public/case-studies/buds-motor-catalog-preview.webp`
- `PATCH_NOTES_KAR_LABS_FRONTEND_ASSET_OPTIMIZATION_v2.8.0.md`

## Migration / install requirement
Tidak ada migration database.
Tidak ada npm dependency baru.
Tidak perlu `npm install` tambahan.

## Required tests
```bash
npm run dev
npm run check
npm run build
```

Manual smoke test:
- `/`
- `/catalog.html`
- `/catalog.html#calculator` (Chart.js harus muncul setelah feature dibuka)
- `/catalog.html#dashboard`
- `/catalog.html#pos`
- BUDS Motor preview image

## Deployment compatibility
Tetap static HTML/CSS/Vanilla JS.
Netlify build command tetap `npm run build` dan publish directory tetap `dist`.
