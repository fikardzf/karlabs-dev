# Memeriksa instalasi npm

Buka terminal pada folder yang berisi `package.json` dan `package-lock.json`. Periksa versi dengan `node -v` dan `npm -v`. Konfigurasi Netlify proyek menggunakan Node 20.

Jika build melaporkan bahwa `gsap/dist/gsap.min.js` tidak ditemukan, jalankan `npm ci` dari folder proyek untuk memulihkan versi terkunci. Lalu jalankan `npm run check`. Kesalahan yang menyebut Vite saat menjalankan `npm run dev` perlu diperiksa terhadap skrip dalam `package.json` pada branch dan folder kerja aktif.

[Rujukan pengembangan dan build](README.md)
