# Mengapa showroom sebelumnya terlihat serupa

23 November 2026 · Pembanding awal adalah checkout bersih `a168e3b`. Hasil akhir adalah build lokal pada branch `feat/interactive-portfolio-gallery`.

**Penyebab yang terverifikasi adalah cakupan perubahan visual pada dua iterasi terakhir.** Penjadwalan drag, pemulihan histori, aksesibilitas, dan kegagalan pemuatan aset mendapat perbaikan nyata. Namun tiga elemen terbesar yang menentukan kesan pertama masih sama saat halaman diam. Judul tetap berada di atas, karya tetap dalam satu pita horizontal, dan informasi proyek tetap di bawah. CSS dan JavaScript galeri versi itu juga ditemukan di produksi.

## A–D. Repositori, framework, dependensi, dan skill

- Beranda statis, katalog lama, indeks, dan delapan canvas membentuk 11 rute. Generator memakai registry proyek dan panel demo yang sama untuk rute mandiri. HTML, CSS perspektif, Pointer Events, dan GSAP sudah mendukung rancangan berikutnya. Instruksi lama yang mengarahkan pekerjaan ke React/Vite sudah diperbaiki.
- Audit membandingkan ZIP v2.9, GitHub main, branch fitur, dan respons Netlify. Klasifikasi root A–J membedakan sumber, konfigurasi, dokumentasi, arsip, data yang perlu dilindungi, dan hasil build. Matriks paket mencatat versi, pemanggil, status kompatibilitas, bobot distribusi, dan tindakan per paket. [Audit fondasi dan matriks dependensi](AUDIT_FONDASI.md)
- Seluruh 26 instruksi skill lokal dibaca. Tujuh skill anti-slop dan kelompok motion memiliki jejak pada laporan terdahulu. Tidak semua skill relevan untuk situs statis. Ponytail digunakan untuk menelusuri pemanggil, memakai kembali generator, membatasi tambahan runtime, dan menyertakan pengujian regresi. Inventaris mencatat hasil pemeriksaan serta batas bukti pemanggilan setiap skill. [Inventaris dan evaluasi 26 skill](AUDIT_SKILL.md)

## E. Pemeriksaan delapan hipotesis

| Hipotesis | Hasil | Bukti |
| --- | --- | --- |
| A. Perubahan terdahulu kecil secara visual | Didukung untuk komposisi awal | Antara `1791e04` dan `a168e3b`, diff `public/portfolio.css` berisi 8 baris tambahan dan 5 penghapusan. Aturan geometri panggung, bingkai, dan panel tetap sama. |
| B. Skill hanya tersimpan | Sebagian dapat diuji | Repositori memuat bukti perubahan fokus, target sentuh, dan cleanup motion. Log invokasi per skill tidak tersedia. Menyimpan skill atau lockfile sendiri tidak mengubah halaman. |
| C. Engine animasi saling bertabrakan | Tidak didukung pada galeri aktif | GSAP menggerakkan bingkai/keterangan, ScrollTrigger menggerakkan dinding dan jalur, kamera menulis posisi tautan. Motion dan Lenis terpasang tanpa pemanggil runtime produksi. |
| D. Kode baru tidak aktif | Risiko pemeliharaan ditemukan | Scaffold React dan beberapa modul efek lama berada di luar jalur render. Pemeriksaan HTTP dan browser menemukan scene GSAP pada rute beranda aktif. Tidak ada bukti bahwa desain terdahulu yang dilaporkan telah diimplementasikan di React. |
| E. Deploy yang salah | Aset baseline cocok | Hash galeri cocok. Pada beranda dan katalog, teks serta tag cocok setelah normalisasi tautan dan serialisasi HTML. SHA deploy dan pilihan branch internal memerlukan akses dashboard Netlify. |
| F. Ruang perubahan terlalu sempit | Konsisten dengan diff | Iterasi terdahulu memprioritaskan penyempurnaan motion pada komposisi yang sudah disetujui pengguna. Alasan pribadi pembuat atau persepsi pengunjung tidak dapat diturunkan dari Git. |
| G. Hierarki demo belum membantu eksplorasi | Didukung untuk kasus teramati | Pada ponsel, judul, keterangan, dan kontrol menghabiskan ruang sebelum foto produk pertama. Di kasir, pengunjung harus melihat keranjang untuk mengetahui total aktif. |
| H. Gerak dibatasi preferensi dan breakpoint | Terverifikasi, disengaja | Efek desktop memerlukan pointer presisi, hover, lebar paling sedikit 851 px, dan izin motion. Kamera ringan, link langsung, serta desain diam tetap tersedia di ponsel dan reduced motion. Saat audit ditemukan pula deklarasi judul katalog lama yang menimpa font demo. Konflik spesifisitas itu diperbaiki. |

## F. Galeri, canvas, dan navigasi

Pada desktop, judul, filter, nama karya terpilih, dan tombol buka kini menempati kolom di samping panggung. Lengkung plafon, bukaan cahaya, batas dinding, serta alas di bawah karya memberi acuan kedalaman yang terlihat sejak render pertama. Karya tetangga mengecil dan berputar mengikuti posisi kamera. Memilih thumbnail membawa kamera ke karya melalui lintasan melingkar terpendek. Memilih satu kategori membatasi thumbnail dan tautan tujuan pada kategori tersebut.

Di ponsel, urutan baca menjadi judul, filter, panggung, identitas proyek dengan tombol buka, lalu kontrol navigasi. Thumbnail aktif mengikuti pilihan di dalam relnya. Gulir halaman tetap native. Delapan miniatur WebP bersumber dari artwork asli, berukuran total **11.282 byte** sebelum overhead jaringan, dan diminta dengan prioritas rendah. Proyek baru tanpa miniatur khusus menggunakan sampul dari registry.

Di canvas, sampul terpilih berpindah ke bidang berwarna sesuai karya. Nama, kegunaan, dan tombol menuju demo berada di sisi sampul. Seluruh canvas memakai satu templat dengan identitas transisi per slug. Pada desktop, GSAP mengoordinasikan kedatangan bingkai dan keterangan. Pada pengurangan gerakan, perubahan pilihan dan tautan tetap langsung terlihat. [Implementasi galeri](../public/portfolio-gallery.js) · [Templat canvas](../templates/project.html)

## G. Perubahan pada delapan demo

| Demo | Perubahan yang bisa dicoba pengunjung |
| --- | --- |
| Katalog produk | Pilih kategori, urutkan harga, lalu buka foto dan variasi produk untuk menyusun pesan. Foto pertama pada bukti 390 px terlihat sekitar 244 px lebih awal. |
| Kasir | Tambahkan latte, periksa total di tampilan kasir, lalu masukkan nominal tunai. Kekurangan dana terlihat sebelum struk dibuka. Struk tunai memuat uang diterima dan kembaliannya. |
| Dashboard | Pilih satu dari empat laporan sejak awal. Pengaturan tema dan penjelasan rumus dapat dibuka saat diperlukan. Form transaksi serta filter periode tetap tersedia. |
| Chatbot | Pilih skenario usaha. Petunjuk masukan mengikuti skenario aktif. Percakapan, aturan kata kunci, dan alur handoff tetap dapat diuji. |
| Automasi | Coba simulasi dahulu, lalu telusuri indeks alur. Kontrol penutup detail langkah memiliki nama aksesibel. |
| Landing page | Buka suatu desain dan pilih konsultasi. Nama desain ikut masuk ke draf WhatsApp pada pratinjau desktop maupun ponsel. |
| Kalkulator | Pemilih alat langsung muncul setelah pengantar ringkas. Pemilihan menyampaikan alat aktif ke teknologi bantu. Perhitungan memakai fungsi yang sudah ada. |
| Scraping | Filter dan urutkan hasil simulasi. Jumlah pilihan, pratinjau CSV, unduhan CSV, serta salinan JSON kini memakai pilihan baris yang sama. |

Semua transaksi, hasil ekstraksi, dan percakapan di atas memakai data contoh. Uji konsultasi memeriksa tujuan dan isi draf tautan tanpa mengirim pesan.

## H–I. Pembersihan dan berkas utama

Enam berkas JS/CSS untuk efek Hyperspeed dan Electric Border lama, dua aturan CSS tanpa pemakai, serta satu placeholder kosong dihapus. Build terdahulu menyalin enam berkas itu ke dist meskipun halaman aktif tidak memintanya. ZIP, skill, catatan keputusan, aset bisnis, manifest, dan lock npm dipertahankan. Bukti penelusuran serta daftar per berkas tersedia di [audit fondasi](AUDIT_FONDASI.md).

| Bagian | Berkas |
| --- | --- |
| Halaman dan galeri | `index.html`, `templates/project.html`, `scripts/build-portfolio.cjs`, `public/portfolio.css`, `public/portfolio-gallery.js`, `public/gallery-scene.mjs`, `public/portfolio-art/mini/` |
| Demo | `catalog.html`, `public/demo-studio.css`, modul `public/catalog-{product,pos,calculators,chatbot,workflow,landing,scraping}.js`. Tata letak dashboard berubah di HTML bersama. |
| Pemeliharaan | `.gitignore`, `public/home.css`, `src/components/PixelBlast.jsx` (komentar), tiga panduan root, README, catatan audit, serta `public/tailwind.css` yang dikompilasi ulang |
| Pengujian | `scripts/test-motion.py`, `scripts/test-showroom.py`, dan 16 screenshot pembanding di `docs/portfolio-preview/` |

## J–K. Verifikasi dan batas hasil

- **Build.** `npm run check` lulus pada Node 20.20.2, mencakup generator, kompilasi CSS, harga, scope, tautan, metadata, dan pemeriksaan distribusi. Pemeriksaan tipe registry, sintaks JS, dan whitespace diff dijalankan terpisah. Repo menyediakan pemeriksaan proyek sendiri dan tidak mendefinisikan skrip npm lint.
- **Interaksi.** Playwright Chromium dan WebKit memeriksa galeri, pilihan langsung, filter, keyboard, kembali/maju, buka canvas, perubahan preferensi gerak, pelepasan ScrollTrigger, fallback saat GSAP diblokir, dan alur delapan demo. Pengujian tambahan memeriksa kegagalan/pemulihan grafik, navigasi tanpa JavaScript dan rel paket di ponsel.
- **Layar dan aksesibilitas.** Pemeriksaan overflow meliputi 11 rute pada lebar 320, 375, 390, 430, 768, 1024, dan 1440 px, dengan pemeriksaan rotasi form dan pengembalian fokus. Pemindaian axe pada keadaan awal 11 rute menghasilkan nol pelanggaran untuk tag WCAG 2 A/AA dan 2.1 AA yang diperiksa. Satu peringatan preload tercatat saat pemindaian katalog lama. Aset CDN yang diperlukan tes demo memakai salinan lokal dengan hash SRI yang diverifikasi.
- **Batas bukti.** Ini hasil browser lokal dan emulasi. Skor keterlibatan, selera visual pelanggan, konversi konsultasi, kelancaran pada ponsel fisik, serta dampak pada Core Web Vitals pengunjung belum diukur. Versi yang diperiksa secara publik adalah baseline. Perubahan baru berada di workspace.

Pada profil Chromium lokal 390 × 844 dengan simulasi latensi 150 ms dan unduhan 200.000 byte/detik, build akhir mencatat LCP **1.256 ms**, CLS **0**, transfer resource **228.457 byte**, dan batas bawah tombol Buka demo di **y=658 px**. Pengukuran baseline terdokumentasi dengan pengaturan yang sama mencatat 1.232 ms, 0, 207.243 byte, dan y=751 px. Pilihan langsung menambah aset ke halaman, sementara tombol utama berada 93 px lebih tinggi. Angka LCP masing-masing berasal dari satu pengukuran. Uji terpisah dengan 48 pointermove dalam satu burst pada desktop mencatat 5 penulisan sinkron posisi panel, total 10 setelah dua frame, dan dispatch 2,8 ms. Kedua hasil ini tidak mengukur FPS perangkat fisik. [Metode dan baseline](SISTEM_MOTION.md)

Dengan server `npm run preview` aktif, dua uji yang disimpan bersama kode dapat diulang menggunakan `python scripts/test-motion.py` dan `python scripts/test-showroom.py`. Tambahkan `--browser webkit` untuk engine kedua. Uji demo menerima `--fixture-dir` untuk skrip CDN yang sudah dicocokkan hash-nya.

## L. Bukti sebelum dan sesudah

Screenshot Chromium diambil pada viewport, rute, dan keadaan pilihan yang sama. Galeri dimulai dari Katalog Produk. Sebelum maupun sesudah, tombol berikutnya memilih Business Automation dan menyimpan `?project=workflow`. Versi baru juga memungkinkan memilih karya jauh melalui thumbnail. Screenshot demo menu dan POS menampilkan keadaan di dalam demo, sedangkan screenshot canvas menunjukkan halaman saat dibuka.

| Tampilan | Sebelum | Sesudah |
| --- | --- | --- |
| Galeri 1440 × 900 | [Awal](portfolio-preview/forensic-gallery-1440-before.webp) | [Hasil](portfolio-preview/forensic-gallery-1440-after.webp) |
| Galeri 390 × 844 | [Awal](portfolio-preview/forensic-gallery-390-before.webp) | [Hasil](portfolio-preview/forensic-gallery-390-after.webp) |
| Canvas katalog 1440 × 900 | [Awal](portfolio-preview/forensic-canvas-1440-before.webp) | [Hasil](portfolio-preview/forensic-canvas-1440-after.webp) |
| Canvas katalog 390 × 844 | [Awal](portfolio-preview/forensic-canvas-390-before.webp) | [Hasil](portfolio-preview/forensic-canvas-390-after.webp) |
| Menu 1440 × 900 | [Awal](portfolio-preview/forensic-product-catalog-1440-before.webp) | [Hasil](portfolio-preview/forensic-product-catalog-1440-after.webp) |
| Menu 390 × 844 | [Awal](portfolio-preview/forensic-product-catalog-390-before.webp) | [Hasil](portfolio-preview/forensic-product-catalog-390-after.webp) |
| Kasir 1440 × 900 | [Awal](portfolio-preview/forensic-pos-1440-before.webp) | [Hasil](portfolio-preview/forensic-pos-1440-after.webp) |
| Kasir 390 × 844 | [Awal](portfolio-preview/forensic-pos-390-before.webp) | [Hasil](portfolio-preview/forensic-pos-390-after.webp) |

## Keputusan pada pemeriksaan akhir

| Pertanyaan brief | Kesimpulan |
| --- | --- |
| 1–2. Skill diperiksa dan diterapkan? | 26 dari 26 diperiksa. Matriks skill membedakan penerapan yang bisa ditunjukkan, penggunaan untuk audit, dan skill yang disimpan. |
| 3–4. Dependensi dan kesesuaian stack? | Tidak ditemukan dependensi yang hilang pada entry aktif. GSAP aktif di desktop. Adaptor React, Motion, dan Lenis tidak turut menggerakkan galeri. Delapan canvas dan transisi berjalan pada build statis. |
| 5–7. Sebab, perubahan yang terlihat, dan kedalaman? | Diff, HTTP, dan screenshot menghubungkan hasil lama dengan komposisinya. Pasangan galeri menunjukkan perpindahan informasi ke samping panggung, lengkung ruang, alas, dan navigator langsung. Kesan imersif menurut pelanggan belum diteliti. |
| 8–9. Nilai demo dan pengalaman ponsel? | Uji memeriksa hasil tindakan, antara lain nominal kurang, kembalian, serta isi ekspor. Tampilan ponsel memperlihatkan produk lebih awal. Pengujian sentuh menggunakan emulasi. |
| 10–12. Cleanup, build, dan status deployment? | Tujuh berkas tanpa pemakai dihapus dengan riwayat Git tersedia. Build Node 20 dan suite proyek lulus. Audit HTTP memverifikasi baseline produksi. Perubahan akhir belum diterbitkan. |
