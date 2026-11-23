# Mengubah konten showroom

| Kebutuhan | Sumber yang diedit |
| --- | --- |
| Identitas, headline beranda, dan metadata beranda | `index.html` di luar blok hasil generator |
| Judul, kategori, kemampuan dan urutan proyek | `config/portfolio.cjs` |
| Harga, ruang lingkup dan isi paket | `config/packages.json` |
| Isi dan kontrol demo | Panel yang sesuai di `catalog.html` beserta modul `public/catalog-*.js` |
| Layout canvas dan identitas halaman proyek | `templates/project.html` dan `scripts/build-portfolio.cjs` |
| Gaya galeri, token umum dan demo | `public/portfolio.css`, `public/site.css`, `public/demo-studio.css` |
| Tema utility Tailwind | `styles/tailwind-theme.css` dan `tailwind.config.js` |
| Alur konsultasi | `public/consultation.js`, definisi tautan di generator dan berkas data paket |

Jalankan `npm run check` untuk merender ulang konten dan memeriksa hasil produksi. Petunjuk menambahkan proyek dan menguji alur konsultasi tersedia di [README](README.md).
