# KAR Labs.dev Static Preserved UI + Interactive Catalog

Versi ini dibuat untuk meminimalisir error development sampai production. Website tetap mempertahankan CSS styling, animation, glow, gradient, dan feel template asli, tetapi sekarang bisa berjalan tanpa dependency framework.

## Jalankan di localhost

```bash
npm run dev
```

Buka:

```bash
http://localhost:5173/
http://localhost:5173/catalog.html
```

## Build production

```bash
npm run build
```

Hasil production ada di folder `dist/`.

## Package tambahan

Tidak ada package npm tambahan. Semua fitur demo memakai CDN di dalam HTML:

- Tailwind CSS CDN
- Chart.js CDN
- Lucide Icons CDN
- Google Fonts

## File utama

- `index.html` — website utama
- `catalog.html` — halaman katalog/demo interaktif
- `scripts/dev-server.cjs` — local static server tanpa Vite
- `scripts/build.cjs` — copy file production ke `dist/`

---

# KAR Labs.dev Landing Page — Production-ready static version

Versi ini mempertahankan CSS styling, layout, gradient, animation, floating code editor, accordion, mobile menu, dan feel UI/UX dari template asli. Perubahan hanya difokuskan untuk membuat project lebih aman dijalankan dari development sampai production.

## Cara menjalankan di localhost

Pastikan terminal berada di folder yang berisi `package.json`, lalu jalankan:

```bash
npm install
npm run dev
```

Buka URL yang muncul di terminal, biasanya:

```bash
http://localhost:5173/
```

## Cara cek sebelum production

```bash
npm run check
```

Command ini menjalankan:

1. `npm run typecheck`
2. `npm run lint`
3. `npm run build`

Jika berhasil, hasil production ada di folder:

```bash
dist/
```

## File utama untuk customize UI/UX dan basic information

Edit file:

```bash
index.html
```

Bagian yang paling sering diubah:

- `<title>` untuk judul website
- `<meta name="description">` untuk SEO description
- `og:title`, `og:description`, `og:url` untuk preview link
- Logo teks di navbar dan footer
- Hero headline dan subheadline
- Section layanan
- Section harga
- FAQ
- Email, Instagram, dan nomor WhatsApp

## Ganti nomor WhatsApp

Cari di `index.html`:

```js
const waNumber = '6285777345985';
```

Ganti dengan nomor asli tanpa `+`, tanpa spasi, dan tanpa angka `0` di depan.

Contoh:

```js
const waNumber = '6281234567890';
```

## Menghapus watermark / branding bawaan

Folder `.bolt` dan badge README dari template sudah dihapus pada versi ini.

Jika ingin mengganti branding KAR Labs.dev, gunakan fitur search di VS Code:

```text
Ctrl + Shift + F
```

Cari dan ganti keyword berikut:

```text
KAR Labs.dev
KAR Labs
karlabs.dev
karlabs.dev@gmail.com
@karlabs.dev
```

## Catatan struktur

Project ini tetap memakai Vite agar bisa dijalankan dengan `npm run dev` dan dibuild dengan `npm run build`.

Landing page utama tetap berada di:

```bash
index.html
```

Folder `src/` dibiarkan sebagai fallback bawaan Vite/React, tetapi UI utama tidak dipindahkan ke React agar styling dan animasi asli tidak berubah.

## Update Patch: Interactive Catalog Demo

Patch ini menambahkan halaman baru `catalog.html` yang mempertahankan feel UI template utama: dark background, accent green, rounded cards, glow effect, fade transition, dan responsive behavior.

### Isi `catalog.html`

- 7 tab demo layanan:
  1. Landing Page Preview
  2. Chatbot WhatsApp dengan quick reply buttons
  3. Tool/Calculator Online: KPR, BMI, Ongkir
  4. Dashboard Excel Preview interaktif
  5. Desain AI Gallery dengan masonry grid dan lightbox
  6. Automasi Workflow dengan clickable node
  7. Web Scraping Demo dengan progress, table, sort, search, pagination, CSV, copy
- Shared components:
  - Back to top button
  - Skeleton loading saat ganti tab
  - Toast notification
  - CTA WhatsApp di setiap tab

### Package Tambahan

Tidak ada package npm tambahan yang wajib di-install untuk patch ini.

`catalog.html` memakai CDN agar bisa dibuka langsung di browser tanpa build step:

- Tailwind CDN
- Chart.js CDN
- Lucide Icons CDN

Untuk development project tetap gunakan command standar:

```bash
npm install
npm run dev
```

Untuk production:

```bash
npm run check
```

`vite.config.ts` sudah di-update agar `catalog.html` ikut masuk ke hasil `dist/` saat `npm run build`.
