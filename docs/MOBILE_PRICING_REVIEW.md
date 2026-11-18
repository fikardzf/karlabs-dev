# KAR Labs - harga awal dan tampilan mobile

18 November 2026. Perubahan dilakukan di branch `feat/homepage-umkm-leads`, di atas workspace tahap logo/light theme. Angka dasar, isi paket dan batas maksimal satu workflow Premium dipertahankan. Tidak ada commit, push atau deploy.

## Temuan dan perubahan

- Grid harga memakai `align-items: start`, sehingga tinggi kartu 1440 px berbeda: Starter sekitar 735 px, Professional 889 px, Premium 1028 px. Grid sekarang memakai stretch dan flex dengan margin otomatis sebelum rincian. Kartu serta CTA mempunyai posisi bawah yang sama, tanpa tinggi piksel tetap. Rincian yang dibuka tetap dapat memperbesar baris grid tanpa clipping.
- Tiga kolom dimulai pada 1024 px. Di bawahnya kartu ditumpuk agar teks paket tidak terjepit. Pada ponsel, kartu mengikuti tinggi kontennya sendiri, bukan tinggi Premium.
- Setiap harga memiliki badge kecil `Start From`. Ada penjelasan Bahasa Indonesia bahwa harga akhir dapat lebih tinggi mengikuti kebutuhan, kompleksitas dan scope. Bukan diskon, harga final atau janji fitur tambahan.
- Harga mulai diselaraskan pada kartu layanan utama, tabel perbandingan, ringkasan katalog, FAQ, konteks form dan pesan WhatsApp. Semua tetap bersumber pada `config/packages.json`; `public/packages.js` adalah output generate.
- Metadata Offer menggunakan `priceSpecification.minPrice`, bukan fixed `price` atau batas maksimum rekaan. `minPrice` adalah batas bawah harga dalam [Schema.org PriceSpecification](https://schema.org/PriceSpecification). Tidak diklaim sebagai validasi Google rich results.

## Pemadatan mobile

Ruang terbesar sebelumnya berada pada padding section 80 px, gap antarkomponen, timeline proses, header paket dan panduan katalog yang panjang. Perubahan berfokus pada padding/gap, ukuran heading, line-height dan padding kartu; informasi paket, penjelasan Premium dan fungsi demo tidak dipotong atau disembunyikan.

Hero dan CTA lebih dekat ke bagian atas layar. Offer/demo/problem cards, timeline, pricing, FAQ, kontak dan footer mengikuti spacing mobile yang lebih rapat. Katalog juga dipadatkan pada hero, discovery, panduan dan kartu produk. Input tetap minimal 16 px, kontrol utama minimal 44 px, fokus terlihat, serta reduced motion tetap berlaku. Tabel perbandingan tetap memiliki scroll lokal dan fokus keyboard.

Pengukuran pada Chromium, viewport 390 px dengan konten/default state yang sama:

| Halaman | Tinggi sebelum | Tinggi sesudah |
| --- | ---: | ---: |
| Homepage | 15.939 px | 14.064 px |
| Katalog | 6.357 px | 6.001 px |

Ini pengukuran layout, bukan statistik bisnis atau skor performa. Font/browser/perubahan state dapat memengaruhi tinggi aktual. Pada 1440 px tiga kartu mempunyai tinggi yang sama sekitar 1.035 px dan garis bawah CTA identik; penambahan badge tetap tercakup.

## File dan verifikasi

File production/source: `config/packages.json`, `scripts/build-content.cjs`, `scripts/check-packages.cjs`, `public/site.css`, `public/consultation.js`, kedua HTML serta `public/packages.js` hasil generate. README dan laporan ini mendokumentasikan perubahan. `public/tailwind.css` dibangun ulang dan identik dengan baseline tahap ini. Tidak mengubah logo, provider analytics, Netlify, atau legacy `src/`.

- `npm.cmd run check`: lulus source, data paket, privacy event, static SEO/link, build dan dist checks. Guard memastikan tiga badge, penjelasan harga mulai, angka dasar yang benar, metadata minimum dan tanpa harga maksimum rekaan.
- Enam kelompok tes browser khusus: badge/alignment (termasuk detail terbuka), enam lebar viewport dan pesan WhatsApp, metadata, keyboard/reduced motion, fallback tanpa JavaScript, serta ukuran halaman yang berkurang. Enam scan axe pada desktop/mobile dan state form/menu tidak menemukan pelanggaran otomatis. Tidak mengklaim sertifikasi aksesibilitas.
- Lebar: 360, 390, 430, 768, 1024 dan 1440 px. Tidak ada overflow dokumen; field tetap 16 px dan submit minimal 44 px. Nama/harga paket dan penjelasan bahwa harga bisa meningkat tetap terbawa ke pesan ter-encode; Premium tetap menyertakan batas workflow.
- Regresi showroom, funnel dan event dijalankan pada build terbaru. Navigasi WhatsApp diintersep lokal; tidak mengirim data uji ke WhatsApp atau provider analytics.
- Screenshot desktop menunjukkan seluruh tepi bawah kartu dan tombol sejajar. Screenshot mobile sebelum/sesudah diperiksa untuk hierarki, whitespace, keterbacaan dan akses CTA.

Artefak lokal: `node_modules/.cache/karlabs-compact-review/`, termasuk baseline, before/results JSON, screenshot dan diff tahap ini. `npm run dev` aktif pada `http://localhost:5173/`; smoke test production menggunakan preview `http://localhost:4173/`.

Design Read tetap ENERGY 1 / RHYTHM 2 / MOTION 1. Badge mempunyai fungsi harga minimum yang diminta pengguna. Gate scope ini lulus pada state yang diuji: tidak ada scope dihilangkan, tidak ada metrik/testimoni baru, kontrol dan error tetap berfungsi, mobile tetap terbaca dan seluruh kartu desktop sejajar.

Belum diuji di perangkat fisik, Safari/Firefox, pembaca layar nyata atau Node 20. Tidak ada commit, push atau deploy.
