# Audit fungsional KAR Labs.dev · 26 November 2026

Delapan demo menjalani pengujian browser pada build statis lokal. Defek yang memengaruhi hasil hitung, konteks konsultasi, stok, progres, navigasi, dan pemulihan diperbaiki. Penilaian kesiapan di bawah berlaku untuk demo publik dengan data contoh. Tiga lampiran memuat matriks per fungsi, termasuk kontrol, handler, data awal, perubahan state, keluaran yang diperiksa, cacat sebelum perbaikan, dan batas verifikasi.

## Matriks kesiapan dan hasil per demo

| Canvas di bawah `/portfolio/` | Jenis dan hasil yang diamati | Kesiapan |
|---|---|---|
| `product-catalog/` | Katalog fungsional. Tiga Jeans Straight ukuran 32 menghasilkan Rp777.000 di detail dan draf konsultasi. Varian dapat digabung, dihapus, dan direset. | Siap untuk demo publik |
| `pos/` | Simulasi kasir. Dua latte dan satu croissant setelah diskon 5% serta pajak contoh berjumlah Rp107.559. Pembayaran contoh Rp110.000 menyisakan Rp2.441. Stok pesanan tertahan diperhitungkan. | Siap untuk demo publik |
| `scraping/` | Simulasi ekstraksi dua dataset lokal. Sepuluh halaman contoh menghasilkan 88 produk pakaian. Isi CSV dibaca kembali dan dibandingkan dengan baris terfilter. | Siap untuk demo publik sebagai simulasi |
| `workflow/` | Simulasi tujuh alur dengan 15 kasus. Data kurang dapat diperbaiki. Satu klik ganda tidak lagi memberikan dua persetujuan. | Siap untuk demo publik sebagai simulasi |
| `chatbot/` | Lima skenario percakapan berbasis aturan. Pilihan biaya kursus memberi jawaban biaya, balasan melekat pada pesan yang benar, dan reset membatalkan respons tertunda. | Siap untuk demo publik sebagai simulasi |
| `landing/` | Koleksi fungsional dengan 17 desain dan 51 penawaran. Pratinjau terpisah dapat dimuat ulang. Desain yang tidak dikenal punya jalan kembali. | Siap untuk demo publik |
| `calculator/` | Lima alat usaha, 15 preset, serta KPR dan BMI. Pembulatan ambang stok, validasi, serta pemulihan input diuji. | Siap dengan batas eksplisit pada asumsi rumus, estimasi ongkir, KPR, dan BMI |
| `dashboard/` | Empat laporan contoh. KPI, grafik, dan CSV dibandingkan dengan baris sumber. Chart.js membutuhkan CDN atau salinan vendor; kegagalan dapat dicoba ulang. | Siap dengan batas eksplisit pada data simulasi dan ketersediaan grafik |

**Rincian per kontrol dan laporan cacat** tersedia untuk [katalog, kasir, dan ekstraksi](audit-commerce.md), [kalkulator dan dashboard](audit-numbers.md), serta [chatbot, otomasi, dan desain landing page](audit-studio.md). Status “lulus” pada matriks berarti aksi dilakukan dan hasil diperiksa dalam kondisi yang disebutkan.

## Inventaris rute dan matriks fungsi bersama

Sumber produksi menggunakan HTML statis, Tailwind terkompilasi, dan JavaScript vanilla. Generator membaca delapan entri di `config/portfolio.cjs`, mengekstrak panel dari `catalog.html`, dan membangun canvas terpisah dari `templates/project.html`. Komponen React/Vite di `src/` merupakan referensi lama. Pemilihan galeri tersimpan di query URL, pemilihan layanan katalog di hash, sementara transaksi, percakapan, perhitungan, dan contoh laporan hidup di memori dokumen.

| Rute, tujuan dan kontrol | Handler, masukan → keluaran | Awal → hasil dan bukti |
|---|---|---|
| `/`, galeri. Filter, panel, tombol buka, drag, keyboard dan riwayat | `applyFilter/select/release`, registry dan posisi kamera → panel terpilih, judul, URL demo | Belum diuji pada build ini → lulus; pergantian filter, End/panah, wrap, riwayat, drag, serta fallback motion diuji di `test-motion.py` dan `test-showroom.py`. Gambar gagal tetap menyisakan judul dan tautan yang berfungsi dalam `test-shared.py`. |
| `/#harga`, pilihan paket dan rincian | `syncPackagePicker`, rail dan tiga paket → kartu aktif di ponsel, rincian opsional, konteks harga | Belum diuji → lulus; keyboard menuju Premium, rincian terbuka, CTA mengisi paket di formulir. |
| FAQ dan konsultasi di `/#contact-form` | `index.js`, `consultation.js`; toggle, validasi, anggaran/tenggat opsional, data paket → jawaban atau draf | Belum diuji → lulus; semua tombol FAQ dibuka/ditutup, tautan galat memfokuskan kolom, kontak invalid ditolak, dua URL handoff berisi draf yang sama. Menghapus paket membatalkan tautan lama. Uji memakai identitas sintetis. |
| `/portfolio/`, index dan filter | `filterBy`, kategori dan registry → himpunan kartu dan URL terfilter | Belum diuji → lulus; kategori keliru kembali ke semua proyek. Semua kartu dalam setiap kategori dikunjungi dari indeks. |
| `/portfolio/<slug>/`, buka demo, berikut/sebelumnya, kembali ke galeri, reload | `portfolio-canvas.js` membaca kategori, urutan registry, modul per proyek → satu panel aktif dan tujuan navigasi | Belum diuji → lulus; kedua arah per kategori, halaman tunggal menyembunyikan panah, reload serta kembali ke proyek yang sama. Kegagalan modul satu kali dipulihkan lewat tombol coba lagi. |
| `/catalog.html#<slug>`, penemuan layanan | `initTabs/updateShowroom/recommend`, picker, kebutuhan, jenis usaha, hash/alias → panel aktif, rekomendasi dan instruksi | Belum diuji → lulus; alias kasir, kombinasi kosong, reset, tautan rekomendasi, menu ponsel/Escape, rincian layanan, dan tombol kembali ke atas. |
| Katalog lama, navigasi saat dialog terbuka | `hashchange`, dialog native dan overlay → pengguna dapat berinteraksi dengan tujuan riwayat | **P1 rusak → diperbaiki.** Dialog produk sebelumnya menutupi panel berikutnya. Router menutup dialog pada perpindahan hash. `test-shared.py` dan `test-commerce.py` memeriksa kembali ke kasir. |
| Katalog lama, dashboard saat Chart.js gagal | `ensureChartFeature`, promise vendor dan atribut inert → pesan gagal, tombol ulang, hasil kas | **P1 sebagian → diperbaiki.** Kontrol semula aktif sebelum handler tersedia. Uji memblokir vendor sekali, memeriksa panel terkunci, mengklik ulang, dan memperoleh kas Rp1.565.000. [Tampilan pemulihan](portfolio-preview/audit-dashboard-retry-390.jpg) |
| Tab desain `/public/landing-preview.html` | ID desain, shell statis dan iframe sandbox → halaman desain, draf dan tautan kembali | **P1 rusak → diperbaiki.** Preview semula kosong setelah reload tab. ID valid, ID salah, tombol kembali dan muat ulang diuji di `test-studio.py`. |
| `/home`, robots, sitemap, canonical | Redirect Netlify dan metadata build → beranda dan URL yang dapat diindeks | Konfigurasi diperiksa; sitemap dan canonical diperiksa otomatis. Pengalihan hosting berada di luar perilaku server preview lokal. |

Keputusan UX yang berdampak langsung adalah mempertahankan fokus saat item kasir hilang, menjelaskan input yang perlu diperbaiki, membungkus pesan panjang, dan mempertahankan konteks desain maupun variasi produk sampai CTA. [Contoh struk dari pengujian browser 390 piksel](portfolio-preview/audit-pos-receipt-390.jpg)

## Data, privasi, dan batas verifikasi

- Review sumber meliputi form, URL keluar, iframe, pemuatan vendor, pembuatan CSV, timer demo, dan pengelolaan data di browser. Pemeriksaan build mencakup escaping teks, proteksi nilai mirip formula pada CSV, integritas vendor berkunci versi, struktur tautan, serta skema dan privasi event lead. Pemindaian terbatas pada pola kunci privat dan token umum dalam sumber publik tidak menemukan kecocokan. Ini tidak memverifikasi seluruh histori Git, pengaturan akun, atau rahasia di luar repositori.
- Draf konsultasi tampil sebelum membuka WhatsApp. Uji membaca host dan query kedua tautan lalu membandingkan pesannya dengan tampilan. Tidak ada pesan, transaksi, permintaan scraping, persetujuan organisasi, atau pemesanan yang dikirim ke pihak luar. Tautan email dan WhatsApp membutuhkan aplikasi atau layanan eksternal untuk pengiriman.
- Unduhan CSV benar-benar terjadi di browser pengujian. Keberhasilan dan penolakan clipboard diuji dengan pengganti Clipboard API. Lucide dan Chart.js pada suite ber-fixture adalah byte vendor yang dicocokkan SHA-384. Pengujian blokir jaringan, data kosong, dan kegagalan satu kali diberi label sebagai kondisi uji.
- Server pengembangan kini memakai batas direktori berbasis path relatif dan menangani URL yang tidak dapat didekode. Uji biasa memeriksa halaman sah, berkas hilang, nama Unicode, dan permintaan berikutnya. Server ini tidak ikut dalam hasil deploy.
- Chromium dan WebKit dijalankan pada komputer dengan viewport desktop dan emulasi ponsel. Perangkat fisik, Firefox, pembaca layar, pengiriman langsung WhatsApp/email, tarif kurir aktual, dan reliabilitas CDN publik tidak mendapat status terverifikasi. Pengujian berbasis skenario tidak membuktikan seluruh kombinasi input atau seluruh urutan gestur pengguna. Tidak ada integrasi produksi yang memperoleh label *Live Integration* dari audit ini.
- Saat tes segera meninggalkan canvas sebelum modul selesai dimuat, WebKit mencatat pembatalan sebagai galat pemuatan pada halaman yang ditinggalkan. Navigasi kembali tetap berhasil. Pada perjalanan yang menunggu panel siap, pemeriksaan konsol aplikasi dan respons HTTP lokal lulus. Uji jaringan lambat juga menahan permintaan modul kasir, memeriksa panel terkunci, kemudian melepaskan permintaan dan memeriksa keenam produk tampil.

## Menjalankan kembali pengujian

Jalankan `npm run check` kemudian `npm run preview` di terminal terpisah. Server membaca `dist/` pada port 4173. Gunakan Python dengan Playwright serta binari Chromium dan WebKit yang cocok. Tidak ada penambahan dependensi produksi.

Empat suite memakai dua fixture di direktori yang dipilih. Pada checkout bersih, simpan [Lucide berkunci versi](https://unpkg.com/lucide@1.47.0/dist/umd/lucide.min.js) sebagai `lucide.min.js` dan [Chart.js berkunci versi](https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js) sebagai `chart.js` di direktori tersebut. Suite memeriksa hash sebelum menggunakan file. Jika binari WebKit berada di cache tersendiri, tentukan `PLAYWRIGHT_BROWSERS_PATH` untuk proses WebKit.

```powershell
$fixtureDir = 'node_modules/.cache/karlabs-technical-review'
foreach ($browser in 'chromium','webkit') {
    foreach ($suite in 'test-showroom','test-shared','test-numbers','test-studio') {
        python -B -X utf8 "scripts/$suite.py" --browser $browser --fixture-dir $fixtureDir
        if ($LASTEXITCODE -ne 0) { throw "$suite gagal pada $browser" }
    }
    foreach ($suite in 'test-motion','test-commerce') {
        python -B -X utf8 "scripts/$suite.py" --browser $browser
        if ($LASTEXITCODE -ne 0) { throw "$suite gagal pada $browser" }
    }
}
```

| Pemeriksaan | Bukti dan lingkup |
|---|---|
| `npm run check` | Lulus untuk sumber dan dist, mencakup build, rute statis, CTA, paket, dan validasi escaping/CSV. |
| `test-showroom.py` | Alur lintas delapan demo dan inquiry paket, Chromium dan WebKit. |
| `test-motion.py` | Riwayat, perubahan viewport, reduced motion, drag, keyboard, fallback vendor, dan pembersihan ScrollTrigger pada kedua engine. |
| `test-shared.py` | Formulir, paket, indeks, delapan rute, penemuan layanan, dialog dan percobaan ulang, 1440 dan 390 piksel pada kedua engine. |
| `test-commerce.py` | 24 perjalanan utama meliputi tiga demo × dua rute × dua ukuran × dua engine, ditambah fixture gagal dan pemulihan. |
| `test-numbers.py` | Dua demo × dua pasangan rute/ukuran × dua engine. Pemeriksaan independen angka, isi CSV, tooltip dan legenda grafik. |
| `test-studio.py` | Lima skenario percakapan, tujuh alur, 17 desain dan 51 penawaran, kedua engine. Matriks rinci dan variasi viewport ada di lampiran. |

## Dasar versi dan berkas yang berubah

Branch audit dimulai bersih pada `audit/full-demo-functionality`, commit `e36b5bc`. ZIP lama berisi compiler Tailwind dan mendahului generator portfolio. Referensi GitHub main yang dibaca pada audit adalah `931fe9fd88e822dcf6b76fcbeecebf86a68c87e1`. GET indeks Netlify mengembalikan 200 dan memuat delapan karya serta versi sampul editorial. Hash HTML indeks publik dan lokal berbeda. SHA deploy internal tidak disimpulkan dari HTML. Uji tulis dan perjalanan browser seluruhnya dilakukan secara lokal.

- **Produksi:** delapan `public/catalog-*.js` khusus demo, router `public/catalog-init.js`, `public/demo-studio.css`, shell baru `public/landing-preview.html`, serta versi aset pada `catalog.html`, `templates/project.html`, dan `scripts/build-portfolio.cjs`.
- **Server lokal:** `scripts/dev-server.cjs`.
- **Tes baru:** `scripts/test-shared.py`, `scripts/test-commerce.py`, `scripts/test-numbers.py`, dan `scripts/test-studio.py`. Suite showroom dan motion yang sudah ada digunakan kembali.
- **Bukti:** laporan ini, tiga lampiran matriks, dan dua tangkapan layar di `docs/portfolio-preview/`.

Panduan skill ditemukan di `.agents/skills/`; direktori alternatif `.agnets/skills/` tidak ada. Webapp Testing dipakai untuk aksi browser dan assertion, panduan human/mobile untuk fokus dan overflow, dan prinsip Ponytail untuk perubahan lokal. Untuk GSAP, perilaku yang diperiksa adalah lifecycle, fallback, serta preferensi reduced motion. Lenis, React Motion, dan proses desain ulang tidak diperlukan oleh implementasi statis ini.
