# Development Guide

## 1. Buka folder yang benar di VS Code

Pastikan folder yang dibuka langsung berisi file berikut:

```bash
package.json
index.html
src
vite.config.ts
```

Jika `npm install` error `ENOENT package.json`, berarti terminal belum berada di folder project yang benar.

Cek isi folder:

```bash
dir
```

Cari `package.json`:

```bash
dir /s package.json
```

Masuk ke folder yang berisi `package.json`, lalu jalankan ulang:

```bash
npm install
npm run dev
```

## 2. Workflow ringan saat development

Gunakan hanya:

```bash
npm run dev
```

Lalu edit file sesuai kebutuhan. Browser akan update otomatis.

## 3. File penting

| Kebutuhan | File |
|---|---|
| Ubah nama brand, WA, layanan, harga, FAQ | `src/siteConfig.ts` |
| Ubah layout dan section | `src/App.tsx` |
| Ubah style global | `src/index.css` |
| Ubah warna brand dan font Tailwind | `tailwind.config.js` |
| Ubah title dan meta SEO dasar | `index.html` |

## 4. Production check

Sebelum deploy, jalankan:

```bash
npm run check
```

Jika ada error lint/typecheck, perbaiki dulu sebelum upload production.

## 5. Watermark / branding bawaan

Branding lama dari template awal sudah dihapus dari UI utama. Jika ingin memastikan tidak ada sisa teks, gunakan search di VS Code:

```bash
Ctrl + Shift + F
```

Cari:

```bash
nama brand lama
Made with
Powered by
Watermark
```

## 6. Deploy

Rekomendasi paling mudah: Vercel.

Setting:

```bash
Framework: Vite
Build command: npm run build
Output directory: dist
```
