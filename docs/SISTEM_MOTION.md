# Sistem motion showroom KAR Labs.dev

23 November 2026 · Build statis lokal dari branch `feat/interactive-portfolio-gallery`.

Pengukuran dan durasi di bawah mencatat implementasi pada `a168e3b`. Komposisi, koreografi pemilihan karya, dan hasil pengujian iterasi berikutnya tercatat di [audit forensik showroom](AUDIT_FORENSIK_SHOWROOM.md).

## Hasil audit

Beranda, indeks, delapan canvas, dan katalog lama menggunakan HTML statis dan JavaScript browser. Perpindahan halaman mengikuti navigasi dokumen. React/Vite ada di sumber lama. Branch kerja sudah berisi penyempurnaan demo beserta dependensi GSAP, Motion, dan Lenis. Riwayat pembandingan ZIP, GitHub, dan situs Netlify tercatat di [audit showroom](REFINEMENT_SHOWROOM.md).

Drag semula membaca lebar panggung dan menulis posisi panel untuk setiap event pointer. Pada input rapat, beberapa posisi ditulis sebelum browser sempat menggambar satu frame. Efek masuk halaman, animasi angka KPR, dan animasi berulang pada kelompok hasil juga bersaing dengan perubahan yang ingin dilihat pengunjung. Semua artwork berbagi satu nama transisi sehingga dua proyek berbeda dapat saling berubah bentuk ketika pengguna memilih proyek berikutnya.

## Pembagian tanggung jawab

| Bagian | Penggerak dan batasnya |
| --- | --- |
| Kamera horizontal | Pointer Events mengukur lebar sekali di awal gesture. Event berikutnya menyimpan posisi terakhir. Satu penjadwal menggambar panel melalui variabel CSS pada elemen tautan. Spring memakai kekakuan 210, redaman 26, dan langkah waktu maksimum 25 ms. Penjadwal melepaskan callback setelah posisi stabil. |
| Perhatian setelah memilih | Pada desktop dengan mouse dan lebar minimal 851 px, GSAP menggerakkan bingkai, judul, lalu deskripsi. Jeda antarelemen 35 ms dan durasi 220–280 ms. Pilihan, URL, dan tautan demo langsung berubah. Pergantian cepat membatalkan timeline lama. Pada jalur ringan, Web Animations API menggerakkan bingkai dan keterangan selama 300 ms. |
| Kedalaman saat meninggalkan galeri | Satu ScrollTrigger mengikuti gulir dokumen. Dinding bergeser hingga 2,5% dan jalur karya mengecil hingga 97,8%. Panggung tetap mengikuti aliran halaman. ResizeObserver menjadwalkan pengukuran ulang setelah rincian paket mengubah tinggi konten. |
| Pergantian halaman | CSS View Transitions menghubungkan sampul galeri dan sampul canvas berdasarkan slug. Tombol Kembali, histori browser, filter, dan URL langsung memakai navigasi biasa. Browser yang mendukung transisi dapat memasangkan gambar proyek yang sama. |
| Demo dan paket | CSS menangani umpan balik kontrol. Chart.js menguasai animasi grafik. Daftar paket ponsel memakai scroll-snap asli. Elemen induk panel, bingkai, dan jalur karya memiliki pemilik transform masing-masing. |

GSAP dan ScrollTrigger disalin dari distribusi npm terkunci ke aset lokal saat build. Modul galeri memintanya setelah halaman siap, hanya jika media cocok. Dengan scene aktif, kamera memakai ticker GSAP. Pada jalur ringan, kamera memakai `requestAnimationFrame` selama bergerak. Ketika halaman tersembunyi, ditinggalkan, atau kondisi media berubah, kamera berhenti, timeline dikembalikan ke keadaan awal, observer dilepas dan trigger dibersihkan. Memulihkan halaman atau mengaktifkan kembali motion membuat satu scene. Jika aset gagal dimuat, tautan dan navigasi galeri tetap tersedia.

Motion dan adaptor GSAP untuk React tetap di luar runtime produksi. Keduanya cocok untuk komponen React yang punya siklus mount/unmount. Halaman aktif sudah memiliki gesture native dan spring yang bekerja. Lenis juga tetap di luar runtime. Scroll vertikal dokumen, tautan jangkar, riwayat, dan swipe horizontal paket menggunakan browser. Jumlah instance Lenis, callback RAF Lenis, dan sambungan Lenis–ScrollTrigger adalah nol.

## Konvensi dan penerapan pada demo

Token CSS menyediakan **160 ms** untuk konfirmasi tindakan, **240 ms** untuk kemunculan hasil, dan **420 ms** untuk perpindahan ruang. Easing CSS memakai `cubic-bezier(.2,.75,.3,1)`; timeline GSAP memakai `power2.out`. Stagger digunakan pada pilihan karya. Navigasi tetap bisa dilakukan selama animasi. Dalam mode pengurangan gerakan, pilihan langsung menetap, transform scroll dilepas, dan grafik aktif mengikuti perubahan preferensi sistem.

| Demo | Apa yang terlihat saat dipakai |
| --- | --- |
| Katalog produk | Foto detail masuk ketika dialog dibuka. Variasi, jumlah, harga, dan draf pesan segera mengikuti pilihan. |
| Kasir | Penanda jumlah menyorot produk yang baru berubah. Struk masuk saat transaksi contoh selesai. |
| Dashboard | Grafik memakai durasi 240 ms dengan preferensi standar. Angka laporan dan tabel tersedia saat periode berubah. |
| Chatbot | Gelembung baru masuk dengan gerak pendek. Indikator mengetik hanya hadir selama balasan disiapkan. |
| Automasi | Penanda bergerak pada langkah yang sedang aktif. Nama tahap dan tanda selesai tetap terbaca dalam mode gerak terbatas. |
| Kalkulator | Lima nilai KPR langsung menampilkan hasil perhitungan. Grafik mengikuti pengaturan bersama dashboard. |
| Scraping | Panjang indikator mengikuti halaman contoh yang selesai dibaca melalui `scaleX`. Persentase, hitungan, dan log menyampaikan hasil yang sama. |
| Landing page | Filter dan pembukaan pratinjau tetap langsung. Efek saturasi hover pada pratinjau dilepas. Contoh desain tetap dapat dibuka dan dicoba. |

## Skill yang diperiksa

Semua nama berikut memiliki berkas `.agents/skills/<nama>/SKILL.md` di checkout ini.

| Skill | Penggunaan |
| --- | --- |
| `gsap-core`, `gsap-timeline` | Pemilihan properti, easing, urutan tiga elemen, pembatalan dan pengembalian style. |
| `gsap-scrolltrigger`, `gsap-performance`, `gsap-utils` | Scroll native dengan scrub, pembatasan target ke ruang galeri, pembaruan per frame, dan pengukuran ulang setelah perubahan layout. |
| `gsap-react`, `karlabs-motion`, `karlabs-lenis` | Pemeriksaan kecocokan framework, pemilik gesture, perilaku scroll, preferensi pengguna, dan biaya penjadwal tambahan. |
| `anti-ui-slop`, `antislop`, `antislop-ui` | Membandingkan tampilan terpilih, gerakan berulang, dan keterbacaan hasil. |
| `antislop-layoutmobile`, `antislop-human` | Memeriksa alur sentuh, keyboard, target tombol, rotasi, fokus, serta pengurangan gerakan. |
| `antislop-code`, `antislop-copywriting` | Menjaga komentar implementasi singkat serta label tindakan dan status tetap jelas. |

## Pengukuran dan verifikasi

| Pemeriksaan | Hasil lokal |
| --- | --- |
| Drag desktop | Satu burst sintetis berisi 48 pointermove. Sebelum perubahan, ada 235 penulisan sinkron ke `--offset` dan waktu dispatch 46,8 ms. Pada build akhir, 0 penulisan sinkron, 5 penulisan setelah dua frame, dan waktu dispatch 0,6 ms. Penghitungan ini hanya mencakup variabel posisi tersebut dan waktu dispatch JavaScript. |
| Beranda ponsel | Chromium 390 × 844, latensi simulasi 150 ms, unduhan 200.000 byte/detik. Pada satu pengukuran akhir, LCP 1.232 ms, CLS 0, transfer resource 207.243 byte. Batas bawah tombol Buka demo berada di y=751 px. Tidak ada permintaan vendor motion saat halaman pertama dibuka pada lebar tersebut maupun dengan reduced motion. |
| Build dan analisis statis | `npm run check` lulus dengan Node 20.20.2, termasuk kompilasi Tailwind, pemeriksaan tautan, metadata, paket, dan berkas distribusi. Sintaks JavaScript dan pemeriksaan tipe ketat registry juga lulus. Proyek tidak menyediakan skrip lint tersendiri. |
| Chromium dan WebKit | Pengujian browser meliputi scroll-linked depth, slide, seleksi dengan keyboard, kembali/maju di histori, ubah preferensi saat scene aktif, resize, kegagalan memuat GSAP, delapan alur demo, dan konsultasi paket. Aset Chart.js dan Lucide pada pengujian demo memakai salinan dengan hash yang diverifikasi. |
| Responsif dan aksesibilitas | Pemeriksaan 11 rute pada tujuh lebar 320–1440 px meliputi overflow, rotasi formulir, dan pemulihan fokus. Axe melaporkan nol pelanggaran pada pemindaian awal 11 rute untuk tag WCAG A/AA yang dipilih. Satu peringatan preload muncul pada katalog lama. Perubahan preferensi grafik juga diuji pada dashboard, kalkulator, dan katalog lama. |

Untuk mengulang pengujian utama, jalankan `npm ci`, `npm run check`, lalu `npm run preview`. Dengan Python Playwright dan browser uji terpasang, jalankan perintah berikut dari terminal kedua.

```text
python scripts/test-motion.py
python scripts/test-motion.py --browser webkit
python scripts/test-showroom.py
python scripts/test-showroom.py --browser webkit
```

Jika akses CDN terbatas, `test-showroom.py` menerima `--fixture-dir` berisi `lucide.min.js` dan `chart.js` sesuai hash yang diperiksa skrip. Profil lokal dan emulasi tidak mengukur FPS pada ponsel fisik, Core Web Vitals pengunjung, atau dampak bisnis. Dukungan transisi antardokumen mengikuti browser yang digunakan.

## Berkas implementasi

| Area | Berkas |
| --- | --- |
| Galeri dan canvas | `public/portfolio-gallery.js`, `public/gallery-scene.mjs`, `public/portfolio.css`, `index.html`, `templates/project.html` |
| Sistem visual dan demo | `public/site.css`, `public/demo-studio.css`, `catalog.html`, `public/catalog-core.js`, `public/catalog-init.js`, `public/portfolio-canvas.js`, `public/catalog-pos.js`, `public/catalog-calculators.js`, `public/catalog-scraping.js` |
| Build dan pratinjau | `scripts/build-portfolio.cjs`, `scripts/check-dist.cjs`, `scripts/dev-server.cjs`, `.gitignore`. CSS Tailwind dan halaman portofolio dihasilkan lewat build. |
| Pengujian dan panduan | `scripts/test-motion.py`, `README.md`, `docs/SISTEM_MOTION.md`. Uji perjalanan demo memakai `scripts/test-showroom.py` yang sudah tersedia. |
