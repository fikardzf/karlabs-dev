# NPM Error Fix Guide

## Error yang kamu lihat

```bash
npm error Exit handler never called!
'vite' is not recognized as an internal or external command
```

Artinya `npm install` gagal, sehingga dependency `vite` tidak pernah masuk ke `node_modules`. Karena itu saat `npm run dev`, Windows tidak mengenali command `vite`.

## Patch ini sudah dibuat lebih aman

Versi ini tidak lagi membutuhkan Vite, React, TypeScript, atau dependency npm lain untuk menjalankan development.

Cukup jalankan:

```bash
npm run dev
```

Lalu buka:

```bash
http://localhost:5173/
http://localhost:5173/catalog.html
```

Untuk build production:

```bash
npm run build
```

Hasil production ada di folder:

```bash
dist/
```

## Apakah masih perlu `npm install`?

Tidak wajib. Project ini tidak punya dependency npm.

Kalau tetap ingin menjalankan:

```bash
npm install
```

seharusnya cepat selesai karena tidak ada package eksternal yang diinstall.

## Jika npm masih error

Biasanya ini masalah cache/npm lokal. Jalankan:

```bash
npm cache clean --force
```

Lalu coba:

```bash
npm run dev
```

Kalau masih bermasalah, cek versi:

```bash
node -v
npm -v
```

Rekomendasi: gunakan Node.js LTS.
