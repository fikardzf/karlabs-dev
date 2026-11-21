# KAR Labs.dev — Static Production Site

Production website KAR Labs.dev menggunakan **static HTML, compiled CSS, dan Vanilla JavaScript**. Build production tidak bergantung pada Vite/React dan tidak lagi menjalankan Tailwind di browser. Tema aktif adalah light theme dengan logo resmi yang diberikan pengguna.

## Development

```bash
npm run dev
```

`npm run dev` merender konten paket dari konfigurasi, menjalankan compile Tailwind lokal, lalu membuka static dev server. Setelah mengubah konfigurasi paket, jalankan `npm run build:content` atau mulai ulang dev server; tidak ada watcher framework.

Default local URL:

```text
http://localhost:5173/
http://localhost:5173/catalog.html
```

## Galeri dan halaman demo

Rute, hasil pengujian dan tangkapan layar tersedia dalam [laporan serah terima showroom](docs/PORTFOLIO_HANDOFF.md).

Hasil per persona, scorecard sebelum dan sesudah, serta cara menjalankan uji Chromium dan WebKit tersedia dalam [audit pengalaman final](docs/AUDIT_PENGALAMAN_FINAL.md).

Beranda menampilkan galeri. Jalur `/portfolio/` membuka indeks dan `/portfolio/<slug>/` membuka satu demo. URL menyimpan kategori aktif melalui `?filter=` dan pilihan galeri melalui `?project=`.

Urutan, kategori, teks, nama modul dan fungsi inisialisasi berasal dari `config/portfolio.cjs`. Untuk menambahkan demo, daftarkan panel dari `catalog.html` dan modulnya, lalu simpan sampul 4:3 di `public/portfolio-art/<slug>.webp`. Jika ada dialog terpisah, tandai bloknya dengan komentar `canvas-dialog:<nama>` seperti contoh POS. Jalankan `npm run build:content`. Generator mengisi blok galeri pada beranda dan menghasilkan direktori `portfolio/` dari `templates/project.html`. Edit sumber panel atau templat untuk mengubah hasilnya.

## Production checks

Sebelum deploy jalankan:

```bash
npm run check
```

Flow `npm run check`:

1. Render konten paket (`npm run build:content`), lalu validasi source, SEO, dependency hardening, dan Tailwind production setup (`scripts/check.cjs`)
2. Validasi privasi event lead (`scripts/check-leads.cjs`), SEO/link/security helpers (`scripts/check-quality.cjs`), serta harga/scope/brand (`scripts/check-packages.cjs`)
3. `npm run build`
   - render paket HTML dan data WhatsApp dari `config/packages.json`
   - compile utility Tailwind menjadi `public/tailwind.css`
   - copy static production files ke `dist/`
4. Validasi output `dist/` (`scripts/check-dist.cjs`, `scripts/check-quality.cjs dist`, dan `scripts/check-packages.cjs dist`)

Build manual:

```bash
npm run build
```

Compile CSS saja:

```bash
npm run build:css
```

Output production: `dist/`.

## Production architecture

- `index.html` — galeri demo, harga dan formulir konsultasi
- `catalog.html` — katalog interaktif dan tautan hash lama
- `public/tailwind.css` — generated Tailwind production CSS
- `public/index.js` — interaction script homepage yang cacheable
- `public/home.css` — styling komponen homepage, diekstrak dari inline CSS
- `public/site.css` / `public/site.js` — token light theme, branding, accessibility dan motion ringan bersama
- `config/packages.json` — harga resmi dan scope tiga paket
- `scripts/build-content.cjs` — renderer blok paket/FAQ/perbandingan/metadata dalam HTML statis; jangan menulis harga duplikat di luar konfigurasi
- `public/packages.js` — data paket untuk konsultasi, hasil generate; jangan edit manual
- `public/catalog.css` — custom styling katalog
- `public/catalog-*.js` — module Vanilla JS katalog per fitur
- `styles/tailwind-theme.css` — custom KAR Labs Tailwind design tokens
- `tailwind.config.js` — production content manifest + safelist
- `scripts/build-tailwind.cjs` — local Tailwind compiler step
- `vendor/tailwindcss/` — compiler core yang dipin ke 4.1.10 untuk deterministic build tanpa npm dependency tambahan
- `scripts/build.cjs` — static copy build ke `dist/`
- `scripts/check.cjs` — source integrity checks
- `scripts/check-dist.cjs` — production output checks
- `robots.txt` / `sitemap.xml` — technical SEO
- `netlify.toml` — Netlify build + security/cache headers

Folder `src/`, konfigurasi Vite/TypeScript/PostCSS, dan scaffold terkait masih dipertahankan sebagai legacy reference tetapi **bukan bagian dari production build**. Jangan memindahkan production kembali ke Vite/React tanpa keputusan arsitektur terpisah.

`public/catalog-tailwind-config.js` juga tetap ada di source untuk compatibility saat overwrite patch lama, tetapi **sudah tidak direferensikan dan tidak ikut ke `dist/`** sejak v2.9.0.

## External dependencies

Runtime website sekarang memakai CDN hanya untuk:

- Chart.js **4.5.1 pinned + lazy-loaded** — baru di-download ketika Calculator/Dashboard dibuka
- Lucide Icons **1.47.0**, minified dengan SRI. Beranda memuatnya saat pengunjung membuka informasi paket, FAQ, atau konsultasi.
- Galeri, indeks dan identitas canvas memakai sans-serif sistem. Katalog lama dan beberapa pratinjau landing page masih menggunakan Google Fonts.

**Tailwind Play CDN sudah dihapus dari runtime sejak v2.9.0.** Tailwind utility CSS di-compile secara lokal menjadi `public/tailwind.css` saat `npm run dev`, `npm run build:css`, atau `npm run build` dijalankan.

Chart.js juga memakai SRI pada lazy loader. Tidak ada dependency tracking eksternal yang diaktifkan.

Fondasi event funnel memakai `public/lead-events.js`, dengan adapter provider nonaktif secara default dan tanpa antrean/persistence. Taksonomi tujuh event, konfigurasi, contoh integrasi GA4 yang belum diaktifkan, serta verifikasi browser tersedia di [`docs/ANALYTICS_EVENTS.md`](docs/ANALYTICS_EVENTS.md).

Canonical resmi dikonfirmasi pemilik pada 18 November 2026: **https://karlabs-dev.netlify.app/**. Canonical, metadata sosial, JSON-LD, robots, sitemap, dan pemeriksaan build memakai domain ini. `.dev` pada nama brand dan alamat email tetap dipertahankan.

Laporan audit dan batas verifikasi: [`docs/TECHNICAL_QUALITY_REVIEW.md`](docs/TECHNICAL_QUALITY_REVIEW.md). Implementasi logo, light theme dan paket baru: [`docs/LIGHT_THEME_REVIEW.md`](docs/LIGHT_THEME_REVIEW.md).

Sumber logo resmi disimpan utuh di `assets/brand/karlabs-logo-original.png` (tidak ikut `dist/`). Turunan WebP 96/192/384/512 px di `public/brand/` hanya di-resize dan di-encode tanpa crop, tracing, atau perubahan desain. Apple touch icon memakai PNG 180 px. Favicon SVG kecil lama dipertahankan sambil menunggu varian ikon resmi yang terbaca pada 16 px. Kartu sosial `styles/social-preview.svg` menyertakan logo resmi; PNG 1200 × 630 dirender dengan Chromium pada skala 1. Ketika logo berubah, regenerasi turunan dan PNG sosial dari sumber yang disetujui, bukan dengan desain/logo baru.

Harga awal (Start From): Starter **mulai Rp500.000**, Professional **mulai Rp1.500.000**, Premium **mulai Rp3.000.000**. Nilai akhir dapat lebih tinggi sesuai kebutuhan, kompleksitas dan scope yang disepakati. Premium maksimum satu workflow sederhana yang dinilai layak dan disepakati tertulis. Rincian revisi, jadwal, domain/hosting, API/langganan, maintenance dan support harus dikonfirmasi dalam penawaran. Konten paket, comparison, FAQ, offers JSON-LD dan data WhatsApp diperbarui oleh `npm run build:content` agar konsisten. Jangan edit blok HTML di antara marker generate untuk mengubah ketentuan paket; gunakan konfigurasi atau renderer.

Penyempurnaan mobile, badge harga awal, dan tinggi kartu sejajar: [`docs/MOBILE_PRICING_REVIEW.md`](docs/MOBILE_PRICING_REVIEW.md).

Audit UX 19 November 2026, perbaikan ikon workflow, navigasi katalog mobile, dan penyederhanaan konten: [`docs/UX_REVIEW_2026-11-19.md`](docs/UX_REVIEW_2026-11-19.md).

Asset lokal di `/public/*` memakai cache browser 1 hari + `stale-while-revalidate` 7 hari. HTML tetap `must-revalidate` agar deploy baru tidak tertahan cache browser.

## Deployment

Production flow:

```text
GitHub main
  -> Netlify
  -> npm run build
  -> build:content (package configuration to static HTML/data)
  -> build:css (local Tailwind compiler)
  -> static copy
  -> dist/
```

Netlify publish directory: `dist`. Node version: `20`.

Tidak ada `npm install` tambahan untuk Tailwind v2.9.0 karena compiler production yang diperlukan sudah dipin di repo.

## Version notes

### v2.6.0 — Catalog Modularization
`catalog.html` dipisah menjadi CSS dan module JavaScript per fitur tanpa mengubah static build architecture.

### v2.7.0 — Production Hardening & SEO Foundation
Menambahkan source/dist validation, SEO metadata, canonical URLs, robots/sitemap, social preview, pinned Chart.js/Lucide versions, Netlify security headers, modal HTML/accessibility cleanup, dan chatbot DOM escaping.

### v2.8.0 — Frontend Asset Optimization
Memindahkan JavaScript homepage dari inline ke asset cacheable, lazy-load Chart.js hanya pada fitur yang membutuhkan chart, pin Tailwind CDN, defer Lucide, WebP + lazy decoding untuk preview BUDS Motor, serta cache policy Netlify yang aman.

### v2.9.0 — Tailwind Production Build Migration
Menghapus Tailwind Play CDN dari runtime dan menggantinya dengan local deterministic compiler + generated `public/tailwind.css`. Build, dev, source checks, dan dist checks sekarang menjaga agar runtime Tailwind CDN tidak kembali masuk ke production.
