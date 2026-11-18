# Penyederhanaan copy dan showroom

18 November 2026. Perubahan lokal; tidak ada commit, push, atau deployment.

## Arah dan batas perubahan

Halaman penawaran dan showroom untuk pemilik UMKM, dengan bahasa Indonesia yang ringkas dan profesional. Arah visual mengikuti tema terang, logo, Inter, dan hijau KAR Labs yang sudah disetujui. ENERGY 1 / RHYTHM 2 / MOTION 1: demo menjadi fokus, informasi tambahan dapat dibuka, dan motion hanya memberi respons ringan pada interaksi.

Harga awal tetap Starter Rp500.000, Professional Rp1.500.000, Premium Rp3.000.000. Premium tetap maksimal satu workflow sederhana yang dinilai layak dan disepakati tertulis. Batas integrasi, biaya tambahan, serta maintenance tetap dijelaskan. Tidak ada klaim hasil pelanggan baru atau ketentuan komersial baru.

## Perubahan

- Homepage: ringkas penawaran, masalah dan solusi, proses kerja, paket, FAQ, serta konsultasi. Ganti istilah promosi dan sapaan yang tidak konsisten dengan bahasa yang lebih langsung.
- Demo homepage: perjelas tindakan pada setiap kartu. Kartu katalog kini menggambarkan demo produk yang benar-benar terbuka melalui tautannya; referensi kendaraan tetap tersedia di dalam katalog.
- Showroom: sejajarkan pilihan layanan dan rekomendasi di desktop; susun vertikal di ponsel. Penanda layanan aktif tetap terlihat dan nama delapan layanan tetap tersedia pada select.
- Panduan: judul, tujuan, dan konsultasi tetap terlihat. Langkah, manfaat, serta contoh penggunaan tersedia melalui “Cara mencoba demo”; rincian implementasi tetap tersedia di bawah setiap demo.
- Katalog produk: singkat deskripsi dan tombol detail; nama produk tetap ada pada accessible name tombol. Pertahankan pencarian, kategori, jumlah hasil, dialog, reset, empty/error state, serta WhatsApp konsultasi.
- Harga: samakan tinggi ringkasan kartu di desktop, lalu biarkan bagian opsional tumbuh sendiri. Native details dengan nama grup yang sama membuka satu paket pada satu waktu. Kartu tetangga tetap pada tinggi awal.
- Animasi: isi dropdown muncul selama 200 ms dengan pergeseran 6 px. Pengaturan reduced motion menonaktifkannya. Penutupan memakai perilaku native.

## File utama

`index.html`, `catalog.html`, `config/packages.json`, `scripts/build-content.cjs`, `scripts/check-packages.cjs`, `public/site.css`, `public/site.js`, `public/catalog-core.js`, `public/catalog-showroom.js`, `public/catalog-product.js`, dan hasil generate `public/packages.js`.

Tidak mengubah arsitektur static, legacy src, domain, dependency production, atau adapter analytics. HTML paket dan data browser tetap dihasilkan dari konfigurasi; Tailwind tetap dikompilasi.

## Validasi

- `npm.cmd run check`: source, privasi event, SEO/link/SRI/security helpers, harga/brand/scope, build CSS, build static, serta pemeriksaan dist lulus.
- Chromium melalui Playwright: kartu tertutup dan tombol sejajar, hanya kartu terpilih memanjang, satu dropdown terbuka, Enter/Space, ukuran ulang 1024/1440, dan reduced motion.
- Home serta delapan demo diperiksa pada 360, 390, 430, 768, 1024, dan 1440 px; regresi showroom juga mencakup 320 px.
- Regresi showroom meliputi pencarian/detail produk, workflow, kalkulator, dashboard, chatbot, POS, scraping, referensi landing page, kegagalan Chart.js/retry, reset, serta fokus dialog.
- Regresi funnel memeriksa validasi, konteks paket/layanan, Unicode, encoding URL, preview, handoff eksplisit, popup dan fallback, serta privasi. Tautan WhatsApp diintersep lokal; tidak mengirim pesan.
- Regresi analytics memeriksa event, sanitasi, deduplikasi, dan adapter tanpa provider eksternal.
- Axe pada dropdown harga, panduan terbuka, dan dialog produk: lihat hasil browser di folder artefak untuk temuan aktual. Pengujian otomatis bukan pernyataan kesesuaian WCAG menyeluruh.

Skrip regresi showroom disesuaikan karena rincian implementasi kini berada di bawah demo. Skrip funnel lama disesuaikan dengan label harga awal dan opsi anggaran yang sudah ada sebelum tugas ini; validasi pengiriman dan privasi tidak dilonggarkan.

Artefak lokal: `node_modules/.cache/karlabs-copy-review/`. Folder ini diabaikan Git. Baseline disimpan sebelum perubahan agar diff tugas ini tidak bercampur dengan perubahan sesi sebelumnya.

## Delivery gate untuk perubahan ini

- Hard gate PASS: tidak menambah aset atau bukti pelanggan, tautan dan kontrol tetap berfungsi; build, pemeriksaan overflow, keyboard, dan pemindaian aksesibilitas dijalankan pada perubahan.
- Purpose gate PASS: detail yang dapat dibuka mengurangi teks sebelum demo; warna aktif membantu navigasi; tinggi ringkasan menjaga perbandingan paket tanpa memanjangkan kartu lain.
- Liveliness PASS: identitas KAR Labs dipertahankan, hierarki penawaran dan interaksi lebih jelas, motion dibatasi pada umpan balik pembukaan dropdown.
- Craft PASS: harga dari satu konfigurasi, delapan demo dan fallback dipertahankan, perubahan diuji pada output dist.

Belum diuji pada perangkat fisik, Safari/Firefox, pembaca layar, atau WhatsApp nyata. Tanpa JavaScript, details dan konten harga tetap tersedia; penyamaan tinggi ringkasan desktop memakai JavaScript. Browser lama yang belum mendukung exclusive details mungkin mengizinkan beberapa dropdown dibuka manual, tetapi tidak membuka kartu lain secara otomatis.
