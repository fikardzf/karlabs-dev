# Audit technical quality KAR Labs — 18 November 2026

Catatan tindak lanjut: setelah audit ini, pengguna menyetujui brief logo, light theme dan harga paket baru. Temuan komersial/visual di bawah adalah snapshot audit sebelumnya. Status terbaru dan validasi perubahan ada di `LIGHT_THEME_REVIEW.md`; harga aktif bersumber pada `config/packages.json`.

Audit dan perbaikan dilakukan pada workspace static production di branch `feat/homepage-umkm-leads`, berdasarkan HEAD `952adbd` beserta perubahan lokal dari tahap sebelumnya. Tidak ada commit, push, deploy, perubahan DNS, atau perubahan setting hosting. Arsip patch notes yang sudah terhapus sebelum audit tidak dipulihkan. `src/` legacy tidak diubah.

## Prioritas dan hasil

| Prioritas | Temuan | Tindakan / status |
| --- | --- | --- |
| P1 | Canonical, OG/Twitter image URL, JSON-LD, sitemap dan robots menunjuk `karlabs.dev`, berbeda dari website yang diberikan | Pemilik mengonfirmasi `https://karlabs-dev.netlify.app/` pada sesi ini. Semua URL production terkait dan pemeriksaan source diselaraskan. Tidak mengubah nama brand `.dev`, email, atau histori audit. |
| P1 | Deployment publik masih memakai Tailwind Play CDN, berbeda dari compiler lokal v2.9 | Dipertahankan basis workspace v2.9 beserta perbaikan sebelumnya. Deployment tetap belum berubah; publikasi memerlukan persetujuan terpisah. |
| P1 | Revisi unlimited, jadwal pengerjaan dan bug fix gratis belum memiliki bukti/kebijakan operasional di repo | **Perlu konfirmasi pemilik sebelum publikasi.** Harga, jumlah revisi, durasi support dan ketentuan pembayaran tidak diubah. |
| P1 | Input kategori/deskripsi transaksi dashboard dirangkai ke HTML | Nilai dari form di-escape saat dirender. Pengujian payload HTML menunjukkan teks literal, tanpa elemen gambar atau eksekusi handler. Sumber input saat ini hanya pengguna browser sendiri; tidak diklaim sebagai eksploit remote yang terkonfirmasi. |
| P1 | Ekspor dashboard menerima teks yang menyerupai formula spreadsheet | Helper CSV mengutip sel/header dan memberi awalan apostrof pada teks dengan prefix formula/kontrol yang dikenal. Nilai angka negatif tetap berupa angka. Diuji melalui file unduhan. |
| P2 | Pricing card menjadi tombol berisi link; footer dan sejumlah kontrol demo kurang aksesibel | Semantik tombol pada kartu dihapus, CTA tetap native link. Fokus CTA juga mengaktifkan dekorasi. Label/nama kontrol, target sentuh, kontras, heading footer, fokus textarea dan isolasi background dialog diperbaiki. |
| P2 | Animasi border terus menjadwalkan frame ketika reduced motion aktif atau kartu tidak terlihat | Loop berhenti saat reduced motion, tab tersembunyi, kartu di luar viewport, atau dijeda. Ada tombol jeda/lanjut. Noise path dihitung sekali untuk tiga stroke dan rendering dibatasi sekitar 30 fps. Efek tetap tersedia. |
| P2 | Script vendor dipin tetapi tanpa integrity; Lucide memakai distribusi tidak diminifikasi | Versi tidak berubah. Lucide memakai varian minified, kedua vendor diberi SHA-384 SRI dan CORS anonymous. Chart tetap lazy dan dapat retry. Tidak ada dependency production baru. |
| P2 | Pengisian rekomendasi dan pergantian panel awal mengubah layout katalog | Dua rekomendasi utama dan heading panduan sudah ada dalam HTML. Panel awal langsung katalog produk; JavaScript memperkaya konten dan tetap menangani hash. |
| P2 | `ProfessionalService` merupakan tipe schema yang deprecated | Homepage memakai `Organization` dengan fakta yang sudah terlihat di situs. Tidak mengarang alamat, rating, review, harga dalam schema, atau eligibility rich result. Katalog tetap `WebPage`. |
| P2 | Referensi BUDS dan desain landing dapat dianggap bukti pelanggan | BUDS diberi penjelasan bahwa hubungan pelanggan dan izin publikasi belum diverifikasi. Setiap preview desain, termasuk tab baru, memiliki banner bahwa nama/orang/angka adalah ilustrasi. Label “Proof point” diganti. |
| P2 | Preview tab baru mempertahankan opener dan melarang zoom pada mobile | Opener diputus segera setelah jendela dibuat; `maximum-scale=1` dihapus. Jika popup diblokir, feedback yang sudah ada tetap berlaku. |
| P3 | Header belum memiliki CSP | Ditambahkan CSP dasar `base-uri 'self'; object-src 'none'; frame-ancestors 'none'`. Header keamanan dan caching yang sudah ada dipertahankan. Ini belum merupakan allowlist script/style yang lengkap. |

## Trust dan komitmen komersial

Tidak ditemukan testimoni pelanggan atau statistik hasil bisnis yang disajikan sebagai fakta pada homepage terbaru. Data dashboard, POS, workflow dan scraping merupakan simulasi, dengan penjelasan global dan panduan per layanan. Aset katalog kendaraan yang ada di repo bukan bukti hubungan pelanggan atau hasil penjualan; penjelasan baru menyatakan batas tersebut. Tidak ada proyek pelanggan baru yang dibuat.

Yang masih perlu disetujui pemilik sebagai kebijakan bisnis:

- Starter Rp150.000, Professional Rp500.000, Premium Rp1.500.000; katalog mulai Rp500.000 dan workflow mulai Rp300.000. Tidak dilakukan pembuktian kelayakan harga.
- “Selesai 1–3 hari”, “2–5 hari”, “5–14 hari”: konfirmasikan titik mulai, kelengkapan materi, antrian dan ketergantungan integrasi.
- “Revisi unlimited”: definisikan batas scope dan periode revisi.
- Support 7/30 hari serta FAQ “Jika ada bug, kami perbaiki tanpa biaya tambahan”: tentukan cakupan bug, pengecualian, periode dan waktu respons. Saat ini kalimat FAQ dapat dibaca lebih luas dari durasi paket.
- Metode pembayaran yang tercantum dan skema 50% di awal/50% setelah selesai: belum diverifikasi melalui sumber selain copy yang sudah ada.

Tidak mengubah komitmen ini secara mandiri. Penjelasan scope dan biaya pihak ketiga dari tahap sebelumnya tetap ada.

## SEO, media dan loading

- Kedua halaman memiliki judul dan deskripsi berbeda, satu H1, `lang=id`, main landmark, canonical tunggal, robots, OG dan Twitter. Judul katalog kini menonjolkan katalog produk dan automasi. Judul runtime tanpa hash mempertahankan judul SEO; pemilihan demo dengan hash tetap memperbarui judul.
- JSON-LD dapat di-parse dan URL-nya konsisten dengan canonical. `Organization` dipilih tanpa mengarang alamat untuk memenuhi persyaratan LocalBusiness. Rich Results Test/Search Console belum dijalankan.
- Sitemap memuat dua URL canonical. Robots tetap mengizinkan crawling dan menunjuk sitemap yang benar. Tidak ditambahkan tanggal `lastmod` yang tidak terverifikasi. Semua tautan lokal statis dan fragmennya diperiksa terhadap file/ID tujuan.
- Hero mempertahankan WebP 1234 × 788, prioritas tinggi dan decoding async; gambar katalog tetap lazy, mempunyai dimensi dan fallback PNG. WebP yang sudah ada 47.386 byte, PNG fallback 271.372 byte. Tidak dilakukan kompresi ulang yang berisiko merusak gambar.
- Kartu sosial PNG 1200 × 630 kini dirender dari sumber SVG lokal, dengan fokus katalog/automasi dan domain resmi. Tidak memerlukan font eksternal atau dependency build. Favicon SVG yang sudah ada dipakai konsisten.
- CSS Tailwind tetap dikompilasi lokal, tanpa runtime framework. Source dan dist checks mencegah Play CDN masuk kembali. CSS hasil compile tetap 45.427 byte pada audit ini.
- Seluruh script katalog ditunda dengan `defer` dan urutannya dipertahankan. Chart tetap dimuat hanya ketika dibutuhkan. Placeholder ikon diberi box inline agar ukuran kelas CSS berlaku sebelum SVG vendor tiba.
- Distribusi Lucide yang diunduh untuk pemeriksaan: 659.979 → 442.433 byte, sebelum kompresi HTTP. Ini bukan pengukuran penghematan transfer pengguna. Versi tetap 1.47.0.
- Google Fonts tetap memakai preconnect dan `display=swap`; ini masih dapat menggeser teks pada koneksi lambat. Tidak menghapus identitas Oswald/Inter atau mengganti kebijakan font tanpa pengukuran lanjutan. CSS tema lama masih memiliki override berulang; konsolidasi besar ditunda agar tidak merusak delapan demo. Script background lama yang tidak direferensikan tidak dieksekusi oleh kedua entrypoint.

## Pengukuran sebelum/sesudah

Chromium headless melalui Playwright dan CDP, viewport 390 × 844, CPU 4× slowdown, latency 150 ms, download 1,6 Mbps, tiga context baru per halaman. Font/CDN eksternal tetap digunakan; cache jaringan di luar context dan kondisi host tidak sepenuhnya terkendali. Angka di bawah adalah median lab lokal, **bukan Lighthouse score atau Core Web Vitals lapangan**.

| Metrik | Sebelum | Sesudah |
| --- | ---: | ---: |
| Homepage LCP | 2.316 ms | 2.076 ms |
| Katalog LCP | 2.140 ms | 2.132 ms |
| Homepage CLS | 0,0055 | 0,0129 |
| Katalog CLS | 0,0594 | 0,0431 |

Seluruh run LCP: homepage sebelum `[4528, 2316, 2072]` ms, sesudah `[2076, 2020, 2152]` ms; katalog sebelum `[2592, 2140, 2096]` ms, sesudah `[2404, 2000, 2132]` ms. Rentang ini tidak mendukung janji peningkatan performa secara umum; selisih LCP katalog sangat kecil dan CLS homepage justru naik, meskipun keduanya tetap kecil pada pengujian ini.

Event Timing untuk interaksi menu homepage merekam durasi sekitar 88–120 ms sebelum dan 72–104 ms sesudah. Sampel ini bukan INP halaman, bukan data pengguna nyata, dan bukan bukti efek kausal. INP lapangan belum tersedia. Lighthouse CLI tidak terpasang; tidak ada skor Lighthouse yang dilaporkan.

## Verifikasi yang benar-benar dijalankan

| Pemeriksaan | Hasil dan batas |
| --- | --- |
| `npm.cmd run check` | Lulus: source, privasi event, quality checks, build CSS/static, dist dan quality checks pada dist. `npm.cmd` dipakai karena shell PowerShell. |
| `npm.cmd run preview` | Menyajikan `dist/` di `http://localhost:4173/`; seluruh browser smoke memakai output production ini. |
| axe-core 4.10.3 | Sembilan tampilan awal: homepage dan delapan panel demo. Sebelum 64 kemunculan rule/elemen, termasuk temuan footer yang berulang antar panel; sesudah 0. Tag WCAG 2 A/AA, 2.1 AA, 2.2 AA dan best practice. |
| State lanjutan | 11 scan bersih: layanan/pricing/FAQ terbuka, form error, preview pesan, empat tema dashboard, dialog transaksi, POS berisi item, struk, menu mobile. Tidak membuktikan seluruh state atau kepatuhan WCAG penuh. |
| Browser quality | 9 kelompok lulus: validasi/form, animasi/jeda/reduced motion/offscreen, semantik CTA, input HTML, CSV, inert/Escape/fokus dialog, popup demo/zoom/opener, overflow, dan viewport ekuivalen zoom 200%. |
| Responsive | Home/POS/workflow pada 320, 360, 390, 768, 1024 dan 1440 px; regresi showroom juga memeriksa semua panel di tujuh lebar 320–1440 px. Tidak ada overflow dokumen. Pengujian 200% memakai ekuivalen layout viewport, bukan zoom manual pada perangkat fisik. |
| Regresi funnel | 13 kelompok lulus: prefill, encoding Unicode/newline, inline error, keyboard, user-initiated handoff, fallback popup/tab, no-JS dan privasi event. WhatsApp diintersep lokal; tidak ada pesan nyata. |
| Regresi showroom | 15 kelompok lulus: discovery, produk, workflow, delapan layanan, chart lazy/error/retry, calculator, dashboard, chatbot, POS, scraping/CSV/clipboard/reset, preview dan reduced motion. |
| Security browser | 3 lulus: CSP dasar disisipkan ke response lokal untuk tes kompatibilitas, script Chart.js yang dimodifikasi ditolak SRI, retry ke vendor asli berhasil. Header baru belum terpasang di Netlify. |
| Review diff | `git diff --check` lulus; tidak ada staging, commit, push atau deploy. |

Audit browser tidak menghasilkan uncaught JavaScript error. axe tidak menggantikan pengujian screen reader, target sentuh fisik, kombinasi browser/AT, atau semua kondisi visual. Safari, Firefox, perangkat nyata, Google Rich Results Test, indexing/Search Console dan runtime Node 20 Netlify belum diuji.

## Keamanan dan privasi yang dipertahankan

Pinned vendor versions, escaping chatbot, encoding WhatsApp, native handoff `noopener noreferrer`, cache policy, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy dan HSTS dipertahankan. Semua external script yang digunakan memiliki SRI. Tidak ada API key, provider analytics, paid service, atau dependency production baru. Data form tetap tidak disimpan dalam localStorage/analytics; event hanya mencatat intent aman dari tahap sebelumnya.

CSP baru membatasi base URL, embedding object dan framing; belum membatasi semua sumber script/style. Allowlist lengkap harus memperhitungkan stylesheet inline, Google Fonts, lazy Chart, dan dokumen preview `srcdoc`/tab baru. Tidak disajikan sebagai perlindungan XSS yang lengkap. Pembaruan vendor memerlukan verifikasi versi dan hash baru. Tidak dilakukan penetration test, exploit terhadap deployment, atau klaim bahwa seluruh dependency bebas kerentanan.

GET read-only ke deployment pada tanggal audit menemukan halaman 200 dan header keamanan sebelumnya aktif; canonical masih domain lama dan Tailwind Play CDN masih ada. GitHub `main` masih memiliki `build: node scripts/build.cjs`; ZIP memiliki `build: npm run build:css && node scripts/build.cjs`. Bukti tersimpan lokal di cache audit. Ini memverifikasi perbedaan flow, bukan nomor versi release deployment secara pasti.

## File tahap ini dan bukti

| Kelompok | File |
| --- | --- |
| Halaman, SEO, demo disclosures | `index.html`, `catalog.html` |
| URL crawler / header | `robots.txt`, `sitemap.xml`, `netlify.toml` |
| Runtime dan aksesibilitas | `public/catalog.css`, `public/catalog-core.js`, `public/catalog-init.js`, `public/catalog-showroom.js`, `public/catalog-landing.js`, `public/catalog-calculators.js`, `public/catalog-dashboard.js`, `public/catalog-pos.js`, `public/catalog-scraping.js`, `public/electric-border-pricing.js`, `public/electric-border-pricing.css` |
| Kartu sosial | `styles/social-preview.svg` (baru), `public/karlabs-social-preview.png` |
| Guardrails | `scripts/check-quality.cjs` (baru), `scripts/check.cjs`, `package.json` |
| Dokumentasi | `README.md`, `docs/KAR_LABS_CONTEXT.md`, dokumen ini (baru) |

`public/tailwind.css` diregenerasi melalui compiler dan identik dengan baseline tahap ini; tidak diedit manual. `dist/` hanya hasil build. Tidak ada framework/dependency baru atau perubahan file legacy.

Artefak lokal, diabaikan Git: `node_modules/.cache/karlabs-technical-review/`. Termasuk baseline per file, diff khusus tahap ini (`technical-quality.diff`), `before.json`, `after.json`, `quality-results.json`, `security-results.json`, serta skrip reproduksi. Hasil regresi ada pada cache `karlabs-leads-review` dan `karlabs-showroom-review`.

Design Read tetap ENERGY 1 / RHYTHM 2 / MOTION 1: identitas gelap/hijau dipertahankan, teks dan kontrol dibuat terbaca, motion pricing tetap opsional. Finish gate perubahan ini lulus pada state yang diuji: tidak menambah klaim pelanggan, tidak ada CTA kosong yang baru, fokus dan keyboard berjalan, error/preview jelas, gerak dapat dihentikan. Klaim AA menyeluruh ditahan sampai pengujian manual AT dan perangkat selesai.

## Rujukan teknis

- [Google: canonical dan konsistensi sitemap](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
- [Schema.org: status deprecated ProfessionalService](https://schema.org/ProfessionalService).
- [W3C: pause, stop, hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide).
- [MDN: SRI dan persyaratan CORS](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity).
- [web.dev: font-display dan risiko layout shift](https://web.dev/articles/reduce-webfont-size).
