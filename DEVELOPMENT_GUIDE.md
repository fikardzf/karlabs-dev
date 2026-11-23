# Menjalankan showroom secara lokal

Gunakan Node 20 dan buka terminal di direktori yang memuat `package-lock.json`. Pada checkout baru jalankan `npm ci`, lalu `npm run dev`. Buka [beranda lokal](http://localhost:5173/).

Server pengembangan menyajikan berkas statis. Segarkan browser setelah mengubah CSS atau JavaScript. Setelah mengubah templat, isi paket, atau konfigurasi galeri, jalankan `npm run build:content`. Untuk memeriksa keluaran yang akan diterima Netlify, jalankan `npm run check`, lalu `npm run preview`.

Lihat daftar entry point, aturan generator, dan alamat pratinjau di [README](README.md).
