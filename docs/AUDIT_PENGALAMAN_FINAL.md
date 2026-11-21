# Audit pengalaman KAR Labs.dev

22 November 2026 · Cabang lokal `feat/interactive-portfolio-gallery`

## Ringkasan

Pengunjung kini bisa mengikuti peran pelanggan sampai memperoleh hasil yang bisa diperiksa. Di kedai contoh, pilihan latte dingin menghasilkan draf pertanyaan ke penjual. Di workflow, pesanan tiga croissant menghasilkan draf untuk admin. Sesudah setiap demo ada tautan konsultasi yang membawa nama proyek ke WhatsApp. Di header canvas, pengunjung yang sudah siap berdiskusi mendapat konteks yang sama.

Audit memakai build lokal sebelum dan sesudah perubahan pada sesi ini. Beranda Netlify mengembalikan HTTP 200, dengan judul “Website Katalog Produk & Automasi UMKM | KAR Labs.dev” dan tanpa penanda galeri showroom. Itu membuktikan perbedaan beranda, tetapi belum mengidentifikasi commit deploy. ZIP lokal berisi `build:css` dengan kompiler Tailwind lokal. Rekonsiliasi GitHub pada pemeriksaan sebelumnya tercatat dalam laporan serah terima. [Beranda publik](https://karlabs-dev.netlify.app/) · [Riwayat rekonsiliasi](PORTFOLIO_HANDOFF.md)

## Cakupan teknis dan rute

Produksi memakai HTML statis, Tailwind hasil kompilasi, CSS komponen, dan JavaScript per demo. Galeri memakai perspektif CSS, pointer events, dan pegas melalui `requestAnimationFrame`. Build menghasilkan indeks dan satu HTML fisik per proyek dari registry bertipe, templat canvas, dan panel di katalog. React/Vite berada di jalur legacy. Netlify memakai Node 20, `npm run build`, dan direktori `dist/`. [Registry](../config/portfolio.cjs) · [Generator](../scripts/build-portfolio.cjs) · [Konfigurasi Netlify](../netlify.toml)

Pintu masuk publik yang diaudit mencakup `/`, `/#harga`, `/#contact-form`, `/portfolio/`, delapan rute canvas pada tabel demo, dan `/catalog.html#<slug>` untuk tautan lama. Konfigurasi juga mengarahkan `/home` ke `/index.html`. Pemeriksaan sumber mencakup navigasi, CSS dan aset, registry, pengisian formulir, metadata, batas paket, pemuatan modul/grafik, preferensi gerakan, serta skrip pemeriksaan source dan build.

## Perjalanan pelanggan yang diuji

| Pengunjung dan tujuan | Hambatan pada baseline | Perubahan dan hasil pengujian |
|---|---|---|
| Pemilik UMKM mencari katalog dan perkiraan biaya | Judul pembuka berbahasa Inggris. Tautan paket di bawah galeri belum memperlihatkan harga. | Judul dan pengantar kini berbahasa Indonesia. Tautan menampilkan harga awal Starter dari sumber paket. Pada ponsel, memilih Premium lalu menekan CTA mengisi konteks Premium di formulir. |
| Penjual online ingin mencoba alur pembeli | Pencarian, kategori, dan harga berfungsi. Dari detail menu, satu-satunya tindakan lanjutan adalah konsultasi studio. | Pencarian latte, pilihan dingin, harga Rp35.000, dan isi pesan cocok. Filter roti menyembunyikan pilihan penyajian. Pencarian kosong bisa dipulihkan. Draf pembeli berada di browser dan tautan konsultasi terpisah mengarah ke KAR Labs. |
| Pengelola operasional ingin menguji proses admin | Status workflow selesai tanpa isi draf yang bisa dibaca. Laporan keuangan selalu mencakup seluruh transaksi. | Kontak yang kurang menghentikan alur. Setelah diperbaiki, contoh pesanan toko roti menghasilkan draf yang menyebut tiga croissant. Periode tujuh hari menampilkan tujuh transaksi contoh. Untuk bulan uji baru, KPI, tabel, dan grafik menunjukkan Rp25.000 dari transaksi yang sama. |
| Pengusaha yang membandingkan desain | Galeri sudah memiliki kedalaman dan filter. Di dalam desain landing page, CTA terlihat seperti tombol tetapi hanya berupa teks. | CTA membuka contoh pesan, dan rincian membuka bagian desain. Pemilih desain dan ukuran bekerja di desktop. Pratinjau ponsel membuka desain yang dipilih. Empat gestur berurutan juga menguji kedua batas galeri dua proyek. |
| Pengunjung dari media sosial memakai ponsel | Saat selesai mencoba demo, jalur konsultasi utama berada di atas. Nomor pada penghitung galeri kurang menjelaskan pilihan kepada pengguna teknologi bantu. | CTA setelah hasil memuat judul demo. Penghitung kini menyertakan nama pilihan untuk teknologi bantu. Filter dan proyek terpilih bertahan saat kembali. Pada pengukuran 390 × 844, tepi bawah tombol pembuka demo berada pada 751 px. |

## Hasil per demo

Semua rute pada kolom pertama berada di bawah `/portfolio/`. Implementasi yang sama juga dipakai oleh rute hash katalog lama.

| Canvas | Hasil yang dapat diperiksa pengunjung | Pemeriksaan |
|---|---|---|
| `product-catalog/` | Cari, saring, pilih penyajian kopi, lalu baca draf WhatsApp beserta harga. | Latte dingin dan produk tanpa varian menghasilkan draf berbeda. Dialog dan pemulihan pencarian kosong diuji. |
| `landing/` | Bandingkan contoh tata letak dan buka penawaran atau rincian di dalam halaman. Contoh desain diberi label ilustrasi. | Desktop berganti desain dan ukuran. Di ponsel, penawaran terbuka di pratinjau terisolasi. Pratinjau kecil dimuat saat mendekati viewport. |
| `pos/` | Ubah jumlah barang dan diskon, lalu periksa total pada struk contoh. | Dua latte Rp35.000 dengan diskon 10% dan pajak **simulasi** 11% menghasilkan Rp69.930. Fokus keyboard tetap di kontrol jumlah. Tahan dan lanjutkan pesanan juga diuji. |
| `chatbot/` | Coba pertanyaan pelanggan, alihkan percakapan ke antrean admin contoh, baca ringkasan topik, lalu kembali ke bot. | Pertanyaan katalog masuk ke ringkasan pengalihan. Balasan tertunda dari skenario lama dibatalkan ketika skenario diganti. |
| `workflow/` | Tentukan skenario dan catatan usaha. Lihat tahap yang tertahan, perbaiki input, lalu periksa isi draf. | Cabang order toko roti berhasil sampai hasil. Reset mengembalikan progres ke awal. |
| `dashboard/` | Saring periode transaksi dan lihat angka yang sama pada KPI, tabel, grafik, dan data ekspor keuangan. | Periode diuji sebelum dan sesudah menambah transaksi. Pada mode penjualan, diagram menunjukkan 88 pesanan dan 172 penawaran lain dari total 260. |
| `calculator/` | Geser atau ketik harga, lihat unit titik impas, lalu pulihkan angka contoh. | Harga sama dengan modal memberi “Belum tercapai”. Reset menghasilkan 116 unit. Nol pesanan dan tinggi badan kosong menghasilkan keterangan yang sesuai. Grafik kalkulator lain menunggu tabnya dibuka. |
| `scraping/` | Pilih toko pakaian atau kedai kopi lokal, jalankan simulasi, lalu periksa hasil dan cuplikan CSV. | Tiga halaman kedai menghasilkan enam menu. Pencarian latte menghasilkan satu baris. Empat baris pratinjau, termasuk header, cocok dengan awal unduhan. Pergantian sumber membersihkan hasil lama. |

## Galeri, konversi, dan batas komersial

Pada koleksi dua proyek, kamera berhenti di batas seretan dan inersia lama dibersihkan saat jari atau pointer mengambil alih. Panel yang tetap di luar pandangan melewati pembaruan transform berulang. Penempatan pertama tetap dilakukan agar pemuat gambar mengenali panel yang benar. Bingkai terpilih mendapat garis yang lebih tegas. Panah, swipe, drag, roda horizontal, gulir vertikal, keyboard, reduced motion, dan indeks alternatif tetap tersedia.

Di canvas, **Coba demo** menjadi tindakan utama saat masuk. Sesudah mencoba, pengunjung bisa memilih tindakan spesifik seperti **Diskusikan sistem kasir**. Tautan berisi nama proyek dan draf konsultasi. Data yang diketik di simulator tidak dimasukkan ke pesan ini. Alur paket dan formulir tetap tersedia bagi pengunjung yang memerlukan penawaran lebih rinci.

Harga awal Starter Rp500.000, Professional Rp1.500.000, dan Premium Rp3.000.000. Premium mencakup maksimal satu workflow sederhana yang layak dan disepakati tertulis. Fitur tambahan, ERP/CRM kompleks, hosting, lisensi, dan pemeliharaan mengikuti ketentuan penawaran. Pemeriksaan harga, cakupan, dan metadata dilakukan pada source dan hasil build. [Sumber komersial](../config/packages.json)

## Scorecard UX

Skor merupakan penilaian evaluator atas perilaku yang diamati. Nilai 7 berarti alur utama berfungsi dengan hambatan nyata, 8 berarti tujuan dapat diselesaikan dengan umpan balik yang jelas, dan 9 berarti alur utama serta pemulihan yang relevan teruji lintas mesin browser. Skor ini tidak mengukur kepuasan pelanggan atau konversi penjualan.

| Aspek | Sebelum | Sesudah | Bukti atau batas penilaian |
|---|---:|---:|---|
| Kesan pertama | 7 | 8 | Bahasa pembuka menyebut katalog, kasir, dan automasi. Tombol terlihat di viewport ponsel uji. |
| Desain visual | 8 | 8 | Ruang galeri, karya, dan identitas canvas konsisten. Dialog menu lebih ringkas di ponsel. Preferensi estetika pelanggan belum diuji. |
| Pengalaman 3D | 7 | 8 | Kedua batas koleksi dua proyek lolos uji seret. Pilihan tengah tetap terbaca. |
| Gerakan dan umpan balik | 8 | 8 | Gerak pegas kamera tetap halus pada pemeriksaan visual. Saat pengguna mulai menyeret karya, galeri menghentikan inersia sebelumnya. Laju bingkai ponsel fisik belum diukur. |
| Kejelasan navigasi | 8 | 8 | Aksi buka, coba, diskusi, dan kembali terpisah; URL langsung, filter, dan Back/Forward diuji. |
| Interaktivitas demo | 7 | 9 | Kedelapan alur berhasil di Chromium dan WebKit, termasuk hasil, reset, fallback, serta kasus input yang kurang. |
| Kejelasan manfaat bisnis | 7 | 8 | Pesan produk, draf admin, dan laporan per periode menunjukkan hasil konkret. Pemahaman calon klien belum diukur lewat wawancara. |
| Kenyamanan mobile | 7 | 8 | Pilihan paket, pratinjau desain, fokus kontrol, dan konsultasi sesudah hasil diuji pada viewport ponsel. |
| Performa | 8 | 8 | Beban awal pratinjau landing turun dari 17 dokumen menjadi 4 pada viewport desktop uji. Profil beranda tetap sebanding. |
| Pengalaman konsultasi | 7 | 9 | CTA header dan sesudah hasil membawa konteks proyek; pilihan paket mengisi formulir. Batas verifikasi adalah draf dan tujuan tautan. |

## Pengukuran dan validasi

- **Profil beranda.** Chromium lokal, viewport 390 × 844, latensi 150 ms dan batas unduh 200.000 byte/detik. Satu pengambilan sebelum dan sesudah menghasilkan LCP 1.268 ms dan 1.224 ms, masing-masing dengan CLS 0. Total `transferSize` subresource 205.566 dan 206.413 byte. Selisih LCP terlalu kecil untuk menyimpulkan peningkatan kecepatan. Ini hasil laboratorium; data lapangan, INP populasi, dan CDN produksi belum terverifikasi.
- **Pemuatan.** Pada viewport desktop 1440 px di awal canvas landing, 17 desain tetap tersedia, dengan empat iframe berisi dokumen saat sampel akhir diambil. Pada uji ponsel pendek, galeri meminta tiga gambar WebP ukuran 480. Ikon konsultasi serta grafik dan modul demo ditunda sampai dibutuhkan. Pemblokiran permintaan modul/grafik diikuti percobaan ulang yang berhasil.
- **Build dan kode.** `npm run check` lulus, termasuk build, source/dist, harga, SEO, tautan, SRI dan event lead. Alur pemeriksaan juga lulus dengan Node 20.20.2. Registry lulus TypeScript strict dengan `--checkJs --noEmit`. `node --check` lulus untuk 35 berkas JS/CJS. Proyek tidak menyediakan skrip npm lint produksi.
- **Browser dan aksesibilitas.** Pengujian otomatis mencakup Chromium dan WebKit di Windows, navigasi keyboard dan sentuh yang diemulasikan, reduced motion, semua canvas, delapan hash lama, refresh URL, riwayat, kegagalan jaringan, konten kosong, dan jalur tanpa JavaScript ke indeks. Pemeriksaan lebar mencakup 320, 375, 390, 430, 768, 1024, dan 1440 px. axe tidak mendeteksi pelanggaran pada aturan WCAG A/AA yang diperiksa di 11 halaman dan dialog produk terbuka. Pada katalog lama, alat axe sendiri memberi satu peringatan preload. Uji fungsional menggunakan salinan Lucide dan Chart.js yang hash-nya cocok dengan SRI proyek.
- **Reproduksi.** Jalankan `npm run check` dan `npm run preview`. Dengan Python Playwright dan browser uji tersedia, jalankan `python scripts/test-showroom.py`, lalu ulangi dengan `--browser webkit`. Untuk lingkungan tanpa akses CDN, `--fixture-dir` menerima salinan `lucide.min.js` dan `chart.js`; skrip memeriksa SHA-384 sebelum memakainya. [Skrip penerimaan](../scripts/test-showroom.py)

**Bukti visual.** [Ponsel sebelum](portfolio-preview/ux-before-mobile.webp) · [Ponsel sesudah](portfolio-preview/ux-final-mobile.webp) · [Galeri desktop](portfolio-preview/ux-final-desktop.webp) · [Draf pesan produk](portfolio-preview/ux-product-result.webp) · [Hasil workflow pada tablet](portfolio-preview/ux-tablet-result.webp)

## Berkas dalam pass ini

- Beranda dan galeri di `index.html`, `public/portfolio-gallery.js`, dan `public/portfolio.css`.
- Metadata, pembuatan halaman, dan tindakan konsultasi di `config/portfolio.cjs`, `scripts/build-portfolio.cjs`, dan `templates/project.html`.
- Panel sumber di `catalog.html`, gaya di `public/demo-studio.css`, dan delapan modul `public/catalog-{product,landing,pos,chatbot,workflow,dashboard,calculators,scraping}.js`.
- Tambahan berupa skrip uji penerimaan, laporan ini, lima tangkapan layar, dan tautan laporan di README. Build menghasilkan ulang CSS Tailwind serta halaman statis. Tidak ada penghapusan rute, dependensi produksi baru, push, atau deploy.

## Lima keputusan akhir

1. **Kesan studio kreatif.** Secara visual, ya menurut evaluasi desain: karya berbingkai dan karya terpilih langsung terlihat pada bukti desktop dan ponsel. Persepsi “premium” oleh pengunjung nyata **belum terverifikasi**.
2. **Eksplorasi galeri.** Navigasi dan pemulihan posisi lulus uji. Kenyamanan gestur dan kesenangan pengguna pada iPhone atau Android fisik **belum terverifikasi**.
3. **Nilai delapan demo.** Ya untuk skenario uji. Setiap demo menghasilkan sesuatu yang dapat diperiksa, dari pesan pelanggan atau struk sampai grafik dan CSV.
4. **Penemuan solusi.** Ya pada perjalanan persona yang disimulasikan. Pengunjung dapat menemukan katalog melalui filter, mencobanya, melihat harga awal, dan memilih paket. Kemudahan bagi pemilik UMKM yang benar-benar baru perlu uji tugas dengan orang nyata.
5. **Memulai konsultasi.** Ya sampai tahap inisiasi. Sesudah mencoba, satu ketukan membuka WhatsApp dengan konteks demo. Pengiriman ke penerima, tingkat respons, dan perubahan konversi produksi **belum terverifikasi**.
