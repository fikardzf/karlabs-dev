# KAR Labs — light theme, branding dan paket

Pembaruan berikutnya: ketiga nominal kini ditampilkan sebagai harga awal (Start From), bukan harga final. Pemadatan mobile dan penyelarasan kartu dijelaskan di [MOBILE_PRICING_REVIEW.md](MOBILE_PRICING_REVIEW.md).

Brief lengkap dan harga baru disetujui pengguna pada sesi ini. Basis: branch `feat/homepage-umkm-leads`, HEAD `952adbd` dengan perubahan lokal tahap sebelumnya. Snapshot ZIP v2.9 dan compiler Tailwind lokal dipertahankan; GitHub/main serta deployment yang diaudit sebelumnya masih memakai flow lama. Tidak ada push/deploy.

## Design contract sebelum implementasi

- Tujuan: pemilik UMKM dapat memahami katalog/automasi, membandingkan scope dan meminta konsultasi WhatsApp.
- Identitas: logo PNG resmi 1024 × 1024 dari pengguna, tanpa tracing, crop atau desain pengganti. Hijau mengikuti logo; putih dan abu netral menjaga keterbacaan. Logo lengkap tidak dipaksakan menjadi favicon 16px yang tidak terbaca.
- Token utama: putih `#ffffff`, surface `#f8fafc`, surface alternatif `#f1f5f9`, teks `#0f172a`, teks sekunder `#475569`, hijau `#006847`, hover `#005036`. Border kontrol lebih kuat daripada border dekoratif.
- Tipografi: Inter yang sudah dipakai; heading title case agar penawaran panjang mudah dibaca. Lettering dalam logo tidak diubah.
- Struktur: hero penawaran dan preview nyata, dua layanan utama, demo berlabel, proses, paket/perbandingan, FAQ, form. Navigasi dan identitas ringkas, tanpa perubahan arsitektur.
- ENERGY 1 / RHYTHM 2 / MOTION 1. Reveal singkat satu kali untuk beberapa blok; feedback hover/pressed dan FAQ. Konten tetap terlihat tanpa JavaScript dan saat reduced motion. Glow/canvas pricing diganti interaksi ringan untuk mendukung tema terang dan mengurangi kerja rendering.

## Komersial yang disetujui

Starter Rp500.000; Professional Rp1.500.000; Premium Rp3.000.000. Sumber kebenaran: `config/packages.json`, dirender ke HTML statis dan data runtime untuk pesan WhatsApp. Premium maksimal satu workflow sederhana setelah feasibility dan persetujuan tertulis. ERP/CRM lengkap, AI kompleks, sistem enterprise dan pekerjaan di luar scope memerlukan penawaran terpisah.

Klaim lama tentang kuota/periode revisi, timeline pasti, support 7/30 hari, hosting/domain, revisi unlimited dan perbaikan bug gratis tidak dianggap terverifikasi. Brief baru meminta detail yang belum dikonfirmasi dibahas saat konsultasi. Perubahan tersebut dilaporkan; tidak ditambahkan kuota, periode, atau janji pengganti.

Hasil dan batas verifikasi dicatat di bawah.


## Hasil implementasi

### A. Harga dan B. Scope paket

Harga di bawah merupakan harga paket yang disetujui. Angka pada kalkulator/POS/dashboard tetap data simulasi, bukan tarif jasa. Harga standalone lama pada kartu layanan diganti arahan scope/penawaran; tidak ada harga jasa lama yang dipertahankan sebagai penawaran aktif.

#### Starter - Rp500.000

Mulai Digitalisasi Bisnis. Usaha mikro dan kecil yang membutuhkan kehadiran online profesional serta presentasi produk dasar.

Termasuk:

- Website atau presentasi katalog produk dasar
- Tampilan responsif untuk ponsel dan desktop
- Informasi produk standar dari materi usaha
- Tautan kontak WhatsApp
- Konfigurasi dasar sesuai ruang lingkup tertulis

Opsional, melalui penawaran terpisah:

- Penambahan materi, halaman, atau produk di luar jumlah yang disepakati melalui penawaran terpisah

Tidak otomatis termasuk:

- Backend custom, ERP, CRM, dan database kompleks
- Workflow automasi dan integrasi AI
- Integrasi sistem pihak ketiga khusus

Batas workflow: Tidak termasuk workflow automasi.

#### Professional - Rp1.500.000

Optimalkan Kehadiran Digital Bisnis. UMKM yang berkembang dan membutuhkan website serta katalog dengan susunan yang lebih lengkap.

Termasuk:

- Website dan presentasi katalog yang lebih lengkap
- Kategori produk sesuai struktur data usaha
- Pencarian atau filter bila sesuai kebutuhan dan data
- Penyesuaian visual dan alur pertanyaan pelanggan
- Section tambahan sesuai kebutuhan yang disepakati

Opsional, melalui penawaran terpisah:

- Fitur tambahan di luar proposal dinilai dan ditawarkan terpisah

Tidak otomatis termasuk:

- ERP atau CRM lengkap
- Automasi proses bisnis tingkat lanjut dan integrasi AI kompleks
- Fitur custom atau integrasi pihak ketiga tanpa batas

Batas workflow: Workflow automasi dibahas melalui penawaran terpisah.

#### Premium - Rp3.000.000

Solusi Digital & Automasi Bisnis Terarah. Usaha yang membutuhkan pengalaman website lebih personal dan automasi praktis dengan scope terbatas.

Termasuk:

- Website dan penyesuaian katalog sesuai kebutuhan bisnis
- Fungsi khusus yang dipilih dalam proposal
- Maksimal 1 workflow automasi sederhana, setelah dinilai layak
- Integrasi dasar menggunakan alat yang didukung bila memungkinkan
- Alur, output, dan batas pekerjaan disepakati tertulis sebelum mulai

Opsional, melalui penawaran terpisah:

- Workflow tambahan, fitur khusus, dan integrasi lain melalui analisis kebutuhan dan penawaran terpisah

Tidak otomatis termasuk:

- ERP, CRM lengkap, backend custom, infrastruktur kompleks, atau dashboard enterprise
- AI agent kompleks, training/fine-tuning model, dan integrasi AI API tingkat lanjut
- Automasi lintas departemen, banyak workflow mandiri, atau integrasi API tanpa batas
- Aplikasi mobile custom, database skala besar, payment gateway kompleks, atau autentikasi enterprise
- Monitoring automasi terus-menerus, revisi unlimited, atau support seumur hidup

Batas workflow: Maksimal 1 workflow sederhana yang disepakati bersama.

### C. Batas Premium

Termasuk maksimal 1 workflow automasi sederhana sesuai kebutuhan dan ruang lingkup yang disepakati. Pengembangan sistem ERP, CRM lengkap, integrasi AI kompleks, atau fitur khusus di luar scope akan dikenakan biaya tambahan berdasarkan penawaran.

Fitur tambahan di luar paket akan melalui analisis kebutuhan dan penawaran terpisah.

Satu workflow berarti satu trigger yang jelas dengan beberapa aksi berurutan dan pemetaan standar pada integrasi yang didukung. Contoh inquiry ke spreadsheet lalu notifikasi hanya ilustrasi; bukan integrasi live atau janji implementasi tertentu sebelum pemeriksaan akses, izin, alat dan biaya. Pilihan beberapa skenario pada showroom adalah demo referensi; tidak berarti semuanya termasuk Premium.

### D. Branding

Logo resmi dipakai di navbar homepage, menu mobile, footer homepage, header katalog, footer katalog, Apple touch icon, JSON-LD Organization.logo, dan gambar sosial. Teks alternatif gambar adalah KAR Labs. Tidak ada crop, stretching, recoloring, tracing, atau logo baru.

Sumber asli 1024 x 1024 disimpan di assets/brand/karlabs-logo-original.png, identik byte demi byte dengan lampiran. SHA-256: `6a32518ee134f141ca927b9ad74e10830eb866210cb2eb98e83f4218cd0af4f8`. Sumber asli tidak ikut dist. WebP 96 px 6.464 byte dan 192 px 17.782 byte melayani header 1x/2x. Varian 384/512 px untuk pemakaian lebih besar; Apple icon PNG 180 px. Tidak ada download logo asli 1,43 MB pada halaman.

Favicon SVG kecil sebelumnya tetap digunakan, sesuai fallback yang diizinkan dalam brief. Logo lengkap kehilangan keterbacaan pada 16 px; varian ikon resmi yang lebih sederhana belum tersedia. Tidak dibuat simbol pengganti tanpa persetujuan.

### E. Design system

Tema light diterapkan pada seluruh antarmuka homepage/katalog, navigasi/menu, form, FAQ, perbandingan, demo controls, dropdown, notifications, chart surfaces dan modal. Warna/tipografi disatukan lewat public/site.css dan styles/tailwind-theme.css. Nama utility dark dipertahankan untuk kompatibilitas; nilainya sekarang surface terang. CSS homepage diekstrak dari HTML ke public/home.css agar dapat di-cache. Inter menjadi font antarmuka tanpa menambah keluarga font baru.

Gambar referensi BUDS Motor dan art direction di dalam contoh template landing tetap seperti materi demo aslinya; tidak direkayasa menjadi proyek pelanggan atau diubah demi menyeragamkan gambar. Chrome preview, termasuk tab preview mobile, memakai tema terang. Contoh tetap berlabel simulasi.

### F. Motion

Reveal satu kali pada beberapa blok (450 ms, 14 px), hover kartu 2-3 px, pressed feedback, focus ring hijau, transisi sticky navbar, dan expand FAQ ringan. Background/text kontrol berubah langsung agar tidak melewati warna antara yang sulit dibaca. FAQ memakai gerak kecil tanpa menurunkan opacity teks.

Canvas/glow pricing tidak lagi dimuat: diganti border dan hover CSS yang tenang. View Transitions API dicoba tetapi memunculkan error pembatalan saat navigasi cepat di Chromium pengujian; final memakai fade-in main CSS 180 ms dan navigasi native. Unsupported browser tetap bernavigasi biasa. Seluruh motion baru nonaktif pada prefers-reduced-motion. Tanpa JavaScript tidak ada kelas reveal-pending dan semua harga/FAQ tetap terbaca.

### G. File yang diubah/dibuat

- `README.md`
- `catalog.html`
- `docs/KAR_LABS_CONTEXT.md`
- `docs/LEAD_FUNNEL.md`
- `docs/TECHNICAL_QUALITY_REVIEW.md`
- `index.html`
- `package.json`
- `public/catalog-calculators.js`
- `public/catalog-core.js`
- `public/catalog-dashboard.js`
- `public/catalog-landing.js`
- `public/catalog-showroom.js`
- `public/catalog.css`
- `public/consultation.js`
- `public/index.js`
- `public/karlabs-social-preview.png`
- `public/tailwind.css`
- `scripts/check-dist.cjs`
- `scripts/check-quality.cjs`
- `scripts/check.cjs`
- `styles/social-preview.svg`
- `styles/tailwind-theme.css`

File baru:

- `config/packages.json`
- `scripts/build-content.cjs`
- `scripts/check-packages.cjs`
- `public/packages.js`
- `public/home.css`
- `public/site.css`
- `public/site.js`
- `docs/LIGHT_THEME_REVIEW.md`
- `assets/brand/karlabs-logo-original.png`
- `public/brand/apple-touch-icon.png`
- `public/brand/karlabs-logo-192.webp`
- `public/brand/karlabs-logo-384.webp`
- `public/brand/karlabs-logo-512.webp`
- `public/brand/karlabs-logo-96.webp`

public/tailwind.css dan public/packages.js adalah hasil generator. dist hanya output build. src/ legacy, netlify.toml, canonical domain, header keamanan, dan mekanisme analytics tidak diubah. Perubahan uncommitted dari tahap sebelumnya tetap dipertahankan.

### H. Verifikasi

- npm.cmd run check lulus: generator konten, source checks, privacy/event tests, quality checks, package/brand guard, build CSS/static, serta pemeriksaan dist.

- Guard paket membandingkan konfigurasi, HTML, data runtime dan makesOffer JSON-LD, memeriksa batas Premium, urutan script, aset/alt/logo, serta menolak harga/ketentuan lama yang tidak lagi berlaku. Generator diuji idempotent.

- Preview production di http://localhost:4173/. Sembilan scan axe awal (home dan delapan panel) bersih, ditambah 13 scan state lanjutan bersih: Premium form, paket/layanan terbuka, semua FAQ, empat tema dashboard, dialog transaksi, detail produk, chat, POS/cart, receipt, dan menu mobile. Ini bukan sertifikasi WCAG.

- Delapan kelompok finish test lulus: tiga harga dan pesan ter-encode, Premium max satu workflow, FAQ keyboard, brand/table/responsive, chart/modal, percakapan/POS, motion/menu, dan fallback tanpa JS.

- Regresi: 13 kelompok funnel, 15 kelompok showroom, sembilan kelompok analytics event lulus. Data pribadi tetap tidak masuk analytics; provider eksternal tetap nonaktif. WhatsApp diintersep lokal, tidak ada pesan nyata.

- Lebar utama 360, 390, 430, 768, 1024 dan 1440 px tanpa overflow dokumen. Regresi showroom juga mencakup 320 px. Tabel perbandingan scroll secara lokal, focusable dan memiliki nama region. Logo mempertahankan aspect ratio dan object-fit contain.

- Emulasi mobile CPU 4x pada Chromium lokal: menu, pilihan Premium dan fokus validasi lulus. Satu sampel tanpa throttling jaringan mencatat LCP 1.232 ms dan CLS 0,0347. Ini bukan skor Lighthouse, bukan data lapangan, dan bukan bukti perbaikan kausal terhadap versi sebelumnya.

- Screenshot hero desktop/mobile, katalog dan pricing diperiksa. Kartu sosial akhir memakai logo asli dan copy tanpa separator rusak. git diff --check lulus.

- Toolchain pengujian Node 24.19.0. Netlify tetap dikonfigurasi Node 20; Node 20 tidak tersedia untuk diuji dalam sesi ini. Tidak mengubah hosting atau deploy.

### I. Keputusan yang masih perlu dikonfirmasi

- Jumlah halaman/produk/data, detail fungsi dan integrasi, materi yang disediakan, serah terima serta feasibility workflow.

- Jadwal pengerjaan, kuota/periode revisi, dukungan/perbaikan bug, tahapan/metode pembayaran dan maintenance. Tidak dijanjikan angka atau periode baru. Klaim lama 1-3/2-5/5-14 hari, revisi 2x/5x/unlimited dan support 7/30 hari tidak dipublikasikan sebagai komitmen baru.

- Domain/hosting, lisensi, API/layanan WhatsApp, langganan pihak ketiga dan biaya perpanjangan tidak otomatis termasuk; harus tercantum dalam penawaran.

- Varian favicon resmi yang tetap terbaca pada ukuran kecil. Fallback yang ada dipertahankan.

- Belum diuji di perangkat fisik, Safari/Firefox, pembaca layar nyata, Node 20, atau pengiriman WhatsApp/integrasi bisnis nyata. Tidak ada klaim kepatuhan aksesibilitas menyeluruh atau pengukuran konversi.

## Finish gate

Arah yang disetujui diterapkan: white surfaces, aksen hijau dari logo, struktur katalog/automasi jelas, harga/scope jujur. Tidak ada testimoni/angka bisnis rekaan. Semua CTA dan demo yang disentuh bekerja pada state yang diuji; error, fokus, fallback, reduced motion dan navigasi diperiksa. Motion diubah ketika pengujian menunjukkan masalah. Gate lulus untuk scope/state yang diverifikasi.

Artefak lokal: node_modules/.cache/karlabs-light-review/ berisi baseline tahap ini, brand manifest, hasil inspeksi/finish/regresi, emulasi CPU, screenshot, daftar file dan light-theme.diff. Tidak ada commit, push atau deploy.
