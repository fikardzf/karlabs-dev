# Showroom KAR Labs.dev

Serah terima Phase 6–12 · 21 November 2026 · branch `feat/interactive-portfolio-gallery`

## 1. Hasil

Pengunjung bisa langsung membuka demo yang sedang dipamerkan. Untuk memilih dari seluruh koleksi, buka **Indeks demo**, lalu pilih satu proyek. Di setiap canvas, **Buat Project Seperti Ini** membuka WhatsApp KAR Labs dengan nama proyek dalam draf pesan.

Galeri memakai sans-serif sistem, latar putih hangat, teks gelap, dan hijau dari identitas KAR Labs untuk pilihan aktif. Tujuh gambar konsep menjadi acuan bingkai individual, lengkungan dinding, ruang kosong, dan kedalaman panel tetangga. Pada desktop, judul dan pengantar berbagi satu baris. Pada ponsel, pengantar berada di atas karya, sudut panel samping lebih landai, dan tombol utama berada di bawah keterangan proyek. [Desktop](portfolio-preview/galeri-desktop.webp) · [Ponsel](portfolio-preview/galeri-ponsel.webp) · [Canvas katalog](portfolio-preview/canvas-katalog.webp)

Setelah galeri, pengunjung melihat tiga langkah pengerjaan. Harga awal Starter muncul langsung pada ringkasan paket. Rincian mencantumkan Starter mulai Rp500.000, Professional mulai Rp1.500.000, dan Premium mulai Rp3.000.000. Premium mencakup maksimal satu workflow sederhana yang dinilai layak dan disepakati tertulis. Fitur tambahan, ERP, CRM lengkap, AI kompleks, biaya platform dan pemeliharaan mengikuti batas dan ketentuan dalam penawaran. [Sumber harga dan cakupan](../config/packages.json)

## 2. File baru sepanjang transformasi

| File | Kegunaan |
| --- | --- |
| `config/portfolio.cjs` | Registry bertipe JSDoc untuk urutan, kategori, deskripsi, kemampuan dan modul demo |
| `scripts/build-portfolio.cjs`, `templates/project.html` | Generator beranda, indeks, sitemap dan halaman proyek |
| `public/portfolio.css` | Tipografi showroom, perspektif, kontrol dan tata letak responsif |
| `public/portfolio-gallery.js`, `public/portfolio-index.js`, `public/portfolio-canvas.js` | Interaksi galeri, filter indeks, navigasi dan pemuatan demo |
| `public/catalog-dialogs.js` | Perilaku dialog dan pengembalian fokus untuk katalog dan canvas |
| `public/portfolio-art/` | Delapan sampul WebP. Setiap slug pada tabel demo memiliki `<slug>.webp` (960 px), `<slug>-640.webp` dan `<slug>-480.webp` |
| `docs/portfolio-preview/`, `docs/PORTFOLIO_HANDOFF.md` | Tiga tangkapan layar dan laporan ini |

## 3. File yang diubah sepanjang transformasi

| Area | File |
| --- | --- |
| Halaman, paket, dan SEO | `index.html`, `catalog.html`, `sitemap.xml` |
| Beranda dan konsultasi | `public/index.js`, `public/consultation.js`, `public/lead-events.js` |
| Demo dan fungsi bersama | `public/catalog-core.js`, `public/catalog-calculators.js`, `public/catalog-dashboard.js`, `public/catalog-landing.js`, `public/catalog-pos.js`, `public/catalog-product.js`, `public/catalog-scraping.js`, `public/catalog-showroom.js`, `public/catalog.css` |
| Build dan pemeriksaan | `package.json`, `scripts/build.cjs`, `scripts/check-quality.cjs`, `public/tailwind.css` (hasil kompilasi) |
| Panduan dan output lokal | `README.md`, `.gitignore` |

Perubahan khusus Phase 6–12 meliputi tipografi dan sudut galeri, ringkasan harga, gambar responsif, pemuatan modul mendekati viewport, pemulihan dari kegagalan jaringan, fokus keyboard dashboard, dan pengujian ulang. Direktori `portfolio/` dan `dist/` dihasilkan oleh build. Aset QA di `docs/` berada di luar output publik.

## 4. Struktur URL

| URL | Tujuan |
| --- | --- |
| `/` | Galeri, proses, paket, FAQ dan konsultasi |
| `/portfolio/` | Indeks semua demo |
| `/portfolio/<slug>/` | Halaman HTML mandiri dengan satu panel dan modul demo yang sesuai |
| `/catalog.html#<slug>` | Katalog lama yang tetap dapat dibuka melalui tautan hash |
| `/?project=<slug>&filter=<kategori>` | Kembali ke pilihan dan kategori sebelumnya |
| `/#harga`, `/?package=premium#contact-form` | Buka rincian paket atau formulir konsultasi dengan konteks paket |

Setiap rute proyek memiliki `index.html` fisik dan canonical sendiri. Pengunjung bisa menyegarkan halaman atau membuka tautan dari luar situs. Build Netlify menggunakan `npm run build` dan memublikasikan `dist/`.

## 5. Cara kerja galeri

Posisi kamera menentukan jarak setiap panel dari pusat galeri. CSS mengubah posisi, sudut, dan skala berdasarkan jarak itu. Setelah drag atau swipe, kecepatan gestur memengaruhi pilihan akhir. Pegas teredam pada `requestAnimationFrame` menggerakkan kamera ke panel tersebut dan berhenti saat posisinya stabil. Ambang drag mencegah pelepasan jari membuka proyek secara tidak sengaja.

Tombol arah, keyboard, dan gerakan trackpad horizontal menggunakan pilihan aktif yang sama. Gulir vertikal tetap menggulir halaman. Filter dan pilihan aktif disimpan di URL. Pada browser pendukung, View Transitions menghubungkan gambar terpilih dengan sampul canvas. Preferensi pengurangan gerak menerapkan perpindahan langsung.

## 6. Demo yang dipertahankan dan diuji

| Slug | Demo | Interaksi yang diverifikasi |
| --- | --- | --- |
| `product-catalog` | Website Katalog Produk | Cari latte, buka detail produk, tutup dialog dengan Escape |
| `workflow` | Business Automation | Mulai panduan, lanjutkan langkah, baca catatan proses |
| `pos` | Point of Sales | Tambah produk, tahan dan lanjutkan pesanan, checkout simulasi, tutup struk |
| `landing` | Landing Page | Buka template, ubah pratinjau ke 390 px, buka template Warteg Ami pada tampilan mobile |
| `dashboard` | Dashboard Usaha | Pilih mode penjualan, ekspor CSV, tambahkan transaksi contoh pada mode keuangan |
| `chatbot` | Chatbot WhatsApp | Kirim balasan cepat dan terima respons simulasi |
| `calculator` | Kalkulator Bisnis | Ubah harga jual dan hitung titik impas |
| `scraping` | Web Scraping | Jalankan simulasi lokal hingga 44 baris, cari produk, unduh CSV |

## 7. Performa dan aksesibilitas

Galeri memprioritaskan gambar pusat. Pada pengujian awal layar ponsel, browser mengambil tiga sampul yang terlihat. Sampul lain dimuat ketika mendekati bidang pandang atau dipilih. Atribut `srcset`, `sizes`, serta dimensi intrinsik membantu browser memilih ukuran dan menyediakan ruang sebelum gambar selesai diunduh.

Beranda menggunakan font lokal. Ikon dekoratif untuk informasi bisnis dimuat saat salah satu bagian dibuka. Pada canvas, modul demo dimuat saat pengunjung mendekati panel atau memilih **Coba Demo**. Kalkulator dan dashboard memuat Chart.js sesuai kebutuhan. Tombol coba lagi diuji untuk kegagalan modul dan grafik.

Indeks tetap menyediakan tautan proyek ketika JavaScript dinonaktifkan. Galeri menyediakan navigasi keyboard, fokus terlihat, indikator posisi, serta kontrol yang berfungsi tanpa hover. Area rumus dan tabel dashboard dapat menerima fokus untuk gulir horizontal. Layout memperhitungkan tinggi viewport kecil dan safe area.

## 8. Hasil QA

Lighthouse 12.8.2 dijalankan pada preview lokal dari `dist/`, memakai profil mobile atau desktop dan browser Chromium. Angka berikut merupakan hasil lab per halaman. LCP mengukur waktu tampil elemen konten terbesar dan CLS mengukur pergeseran tata letak.

| Halaman dan profil | Performa | Aksesibilitas | LCP | CLS |
| --- | ---: | ---: | ---: | ---: |
| Beranda mobile sebelum penyempurnaan Phase 6–12 | 87 | 100 | 3,9 detik | 0 |
| Beranda mobile setelah penyempurnaan | 96 | 100 | 2,2 detik | 0 |
| Beranda desktop setelah penyempurnaan | 100 | 100 | 0,5 detik | 0 |
| Canvas Katalog Produk mobile | 99 | 100 | 2,0 detik | 0,025 |

- **Build dan kode.** `npm run check` lulus, termasuk build produksi, pemeriksaan SEO dan tautan, harga, cakupan paket, serta event lead. Build juga lulus dengan Node 20.20.2 sesuai keluarga runtime Netlify. TypeScript memeriksa registry dalam mode strict. `node --check` memeriksa sintaks JS/CJS produksi dan build. Proyek tidak menyediakan perintah npm lint terpisah.
- **Navigasi.** Rute langsung untuk kedelapan proyek, indeks, hash katalog lama, filter, pilihan tunggal, Back/Forward, serta transisi sampul pergi dan kembali berhasil. Pengujian mencakup swipe sentuh, drag, roda horizontal, panah keyboard, gulir vertikal, dan reduced motion.
- **Responsif.** Beranda, indeks dan delapan canvas diperiksa pada lebar 320, 375, 390, 430, 768, 1024 dan 1440 px. Lebar dokumen berada dalam viewport. Header indeks pada 320 px diperbaiki setelah pemeriksaan visual.
- **Aksesibilitas dan konsol.** Pemindaian axe untuk aturan WCAG A/AA pada beranda, indeks, katalog lama dan delapan canvas menghasilkan nol pelanggaran terdeteksi pada tampilan yang dipindai. Dalam sesi penelusuran biasa, konsol bersih dari error dan warning. Saat audit katalog lama, alat axe sendiri melaporkan satu peringatan preload.
- **Konversi dan jaringan.** Nomor tujuan dan nama proyek dalam tautan WhatsApp diperiksa pada delapan canvas. Pilihan paket, validasi browser atas alur formulir, dan draf pesan diuji sampai tahap pratinjau. Pengujian fungsional memakai salinan Lucide dan Chart.js dengan SHA-384 yang diverifikasi. Uji kegagalan terpisah memblokir satu permintaan modul atau grafik, lalu memverifikasi pemulihan dan interaksi.

## 9. Batas verifikasi

Rekaman video referensi tidak tersedia. Komposisi diperiksa terhadap tujuh gambar yang diberikan. Tempo kamera merupakan keputusan desain. Pengujian sentuh dilakukan melalui emulasi Chromium. Safari di iPhone fisik, performa pengguna produksi, laju bingkai pada perangkat kelas menengah, dan pengiriman pesan WhatsApp sampai penerima belum diukur. Hasil axe berlaku pada tampilan yang diuji dan belum mencakup audit pembaca layar manual.

Rekonsiliasi awal menggunakan ZIP dengan alur Tailwind v2.9. GitHub `main` yang diperiksa menunjuk `2ad2315`, dengan tree yang sebelumnya dicocokkan dengan basis lokal `2920889`. Aset JavaScript beranda Netlify cocok dengan basis itu pada pemeriksaan 21 November. Hasil showroom berada di branch lokal.

## 10. Peningkatan opsional

Uji berikut yang paling bernilai adalah mencoba galeri di Safari pada iPhone fisik, terutama saat toolbar browser berubah tinggi dan pengguna kembali dari WhatsApp. Setelah pemilik menyetujui deploy preview, ulangi Lighthouse pada URL Netlify untuk mengukur pengaruh kompresi, cache dan latensi layanan sebenarnya.

