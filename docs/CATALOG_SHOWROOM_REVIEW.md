# Katalog KAR Labs: audit dan implementasi showroom

Tanggal: 18 November 2026. Basis: working tree pada branch `feat/homepage-umkm-leads`, termasuk perbaikan homepage sebelumnya. Tidak ada commit, push, atau deploy.

## Temuan awal

| Area | Kondisi awal | Perubahan |
| --- | --- | --- |
| Penemuan layanan | Default landing page; pilihan layanan berulang dalam slider di bawah tiap panel | Default katalog produk, dropdown seluruh layanan, rekomendasi berdasarkan kendala dan jenis usaha |
| Panduan | Penjelasan tersebar di tiap panel dan CTA | Panduan aktif berisi masalah, cara mencoba, contoh penggunaan, manfaat yang dibahas, serta scope implementasi |
| Website katalog | Screenshot dan penjelasan fitur, tanpa pencarian atau detail produk yang bisa dicoba | Katalog kuliner dari produk contoh POS yang sudah ada, pencarian, kategori, detail, reset, dan CTA konsultasi |
| Automasi | Node bisa diklik, tetapi belum ada progres data; metrik ilustratif tampil seperti klaim hasil | Dua alur dasar berpanduan, catatan contoh, validasi gagal, perbaikan, langkah lanjut, dan reset; metrik performa tidak ditampilkan |
| Loader grafik | Gagal sekali dapat meninggalkan promise gagal tanpa pemulihan | Status loading, timeout, error yang dapat dipulihkan, dan tombol coba lagi tanpa reload |
| Navigasi | Panel inaktif dan ID CTA dinamis belum ditangani konsisten | Panel inaktif memakai `hidden`, CTA ber-ID unik, anchor pemilihan dipisahkan dari route layanan |
| Aksesibilitas | Node berupa div; dialog lama belum punya trap fokus dan Escape yang konsisten | Node native button, kontrol minimal 44 px, fokus terlihat, Escape dan pengembalian fokus dialog |
| Scraping | Hasil kosong berupa tabel kosong; penolakan clipboard tidak ditangani; tidak ada cancel/reset | Empty state, pagination disabled pada batas, sort lewat keyboard, fallback CSV, reset yang menghentikan timer |
| Loading halaman | Galeri landing menyiapkan semua iframe saat startup | Galeri diinisialisasi saat pertama dipilih; kalkulator/dashboard tetap lazy-init |

## Kontrak desain

Membaca halaman ini sebagai showroom demo untuk pemilik UMKM Indonesia, dengan identitas gelap-hijau KAR Labs dan interaksi yang tenang. Dial: **ENERGY 2 / RHYTHM 2 / MOTION 1**. Arah berasal dari brief dan UI KAR Labs yang sudah ada; tidak ada logo, foto, atau identitas pelanggan baru.

| Keputusan | Alasan |
| --- | --- |
| Base `#000000`, surface `#09090b`/`#111113` | Menjaga identitas homepage tanpa membuat sistem tema baru |
| Accent `#006847`, tint `#74c7a9` | Hijau utama untuk tindakan; tint untuk teks dan indikator pilihan dengan kontras yang lebih terbaca |
| Teks `#fafafa`, secondary `#b5b5be` | Memisahkan hierarki baca tanpa abu-abu yang terlalu redup |
| Oswald untuk judul, Inter untuk isi | Mengikuti tipografi KAR Labs; judul memberi identitas, isi menjaga keterbacaan instruksi |
| Satu pilihan demo aktif | Menjaga konteks dan menghindari menu delapan layanan yang memenuhi layar |
| Filter rekomendasi dalam disclosure | Pilihan langsung tetap terlihat; penyaringan kebutuhan tersedia tanpa memanjangkan menu awal |
| Cards untuk produk dan node workflow | Keduanya adalah objek yang dapat dipilih; instruksi dan scope memakai teks/disclosure agar tidak semua konten menjadi card |
| Angka langkah hanya pada proses | Menyatakan urutan tindakan, bukan statistik atau bukti hasil |
| Data produk dari `posDemoProducts` | Menggunakan fixture yang sudah ada; harga ditandai sebagai harga contoh, bukan penawaran produk KAR Labs |
| Gerakan hanya akibat tindakan | Tidak ada autoplay baru; routing dan grafik menghormati reduced motion |
| Screenshot kendaraan tetap di referensi | Mempertahankan aset autentik repo tanpa menyiratkan proyek pelanggan baru |

## Batas simulasi dan komersial

- Pencarian dan kategori bekerja pada data lokal. Tidak ada checkout, pembayaran, server stok, atau order sungguhan.
- CTA detail produk menghubungi KAR Labs untuk pembuatan katalog. Pesannya menjelaskan bahwa pengunjung tidak sedang membeli produk contoh.
- Workflow memproses catatan contoh hanya di memori browser. Tidak ada akun platform terhubung, biaya API, atau notifikasi dikirim.
- Metrik peningkatan performa dan estimasi setup tidak ditampilkan pada ringkasan workflow. Sasaran implementasi adalah bahan diskusi, bukan hasil pelanggan.
- Rincian berbayar mengikuti metadata layanan yang sudah ada. Jumlah data, platform, integrasi, izin akses, dan biaya pihak ketiga harus dikonfirmasi dalam penawaran.
- Kalkulator, POS, chatbot, dashboard, dan scraping tetap berupa demo. Angka yang ada adalah fixture atau hasil perhitungan simulasi sesuai brief, bukan bukti penjualan atau rekomendasi profesional.

## Keadaan yang diuji

| Kontrol atau keadaan | Bukti perilaku |
| --- | --- |
| Filter kebutuhan/usaha | Rekomendasi berubah; kombinasi tanpa hasil menampilkan petunjuk pemulihan; reset mengembalikan dua layanan utama |
| Pilihan delapan layanan | Panel, judul, panduan, dan konsultasi sesuai layanan; URL hash lama tetap digunakan |
| Produk | Pencarian Latte dan kategori Food menyaring data; detail terbuka; Escape menutup dan mengembalikan fokus; hasil kosong dapat direset |
| WhatsApp | Nama layanan terdapat pada delapan pesan; tautan detail produk benar-benar dibuka dengan respons yang dicegat lokal |
| Workflow | Mulai, lanjut, validasi kontak tidak lengkap, perbaiki data, selesai tanpa pengiriman, reset, dan ganti skenario |
| Kalkulator/dashboard | Chart.js lazy-load, input KPR memperbarui hasil, dashboard terisi; kegagalan jaringan dapat dicoba ulang |
| Dialog dashboard/POS | Dialog terbuka, Escape menutup, fokus kembali ke pemicu |
| Chatbot/POS | Balasan chatbot dan reset; tambah produk POS, checkout, struk, dan reset keranjang |
| Scraping | Progress, hasil, CSV, pencarian kosong, sort keyboard, penolakan clipboard, reset hasil, dan cancel proses |
| Landing | Galeri tetap tersedia, preview terbuka dan dapat ditutup |
| Mobile/tablet | Delapan panel diperiksa pada 320, 360, 390, 600, 768, 1024, dan 1440 px; tidak ada overflow dokumen atau clipping kontrol showroom |
| Reduced motion | Scroll auto dan panel tanpa animasi; Chart.js mematikan animasi saat mode tersebut aktif |
| Homepage | Headline dan preview interaktif hasil pekerjaan sebelumnya tetap bekerja |

## Delivery gate antislop

Gate ini mencakup perubahan showroom dan regresi yang tercatat, bukan sertifikasi seluruh konten lama atau audit WCAG lengkap.

| Aturan | Status dan bukti |
| --- | --- |
| R-02, R-15, R-16 | PASS: copy baru memakai bahasa tindakan, tanpa em dash atau buzzword klaim hasil |
| R-03 | PASS: tujuh lebar viewport dan delapan panel diuji; overflow galeri tablet yang ditemukan sudah diperbaiki |
| R-17, R-18, R-36, R-38 | PASS: data simulasi diizinkan brief dan berlabel; tidak ada testimoni, pelanggan, atau klaim hasil baru |
| R-23, R-37 | PASS: arah memakai identitas KAR Labs yang sudah disetujui; tidak membuat aset identitas baru |
| R-24, R-26 | PASS: route delapan layanan dan anchor pemilihan berfungsi; CTA WhatsApp diuji dengan intersepsi lokal |
| R-25 | PASS untuk pasangan warna baru: secondary text 9,27:1; accent text 9,93:1; putih pada tombol hijau 6,84:1; batas kontrol 3,90:1 melampaui ambang non-text 3:1 |
| R-27 | PASS: empty produk/filter/scraping, loading grafik, validasi workflow, serta error grafik dan clipboard memiliki jalur pemulihan |
| R-28 | PASS: tidak menambahkan FAQ generik |
| R-32, R-39 | PASS pada kontrol yang ditambah/diubah: native button/select/dialog, label, fokus terlihat, Escape, kontrol disabled, dan reduced motion diuji |
| R-33 | PASS: fitur ditulis langsung pada source, tanpa helper yang menulis ulang UI saat runtime |
| R-34 | PASS: tidak menambah theme toggle; tema dashboard lama tetap tersedia dan terinisialisasi |
| R-35 | PASS: build dan click-through per komponen tercatat pada tabel pengujian dan artefak browser |
| R-40 | PASS: dimensi dan lazy image referensi dipertahankan; Chart.js dan galeri tetap dimuat sesuai kebutuhan; tidak melaporkan skor performa yang tidak diukur |
| Purpose gate | PASS: alasan warna, tipografi, spacing, card produk, diagram, dan aset ditulis pada kontrak desain; tidak menambah dekorasi atau motion tanpa fungsi |
| Liveliness dan quality locks | PASS: objek produk, catatan lead/order, pilihan layanan, dan hierarki satu demo aktif membentuk UI khusus kebutuhan UMKM; screenshot desktop/mobile diperiksa |

## Validasi dan batas pengujian

`npm.cmd run check` lulus. Pemeriksaan syntax dan `git diff --check` lulus. Sebanyak 15 kelompok smoke test Chromium lulus, termasuk seluruh preset workflow dan tema dashboard. Screenshot dan hasil terperinci tersimpan di `node_modules/.cache/karlabs-showroom-review/`, bersama diff terhadap baseline tahap ini.

Source yang diubah: `catalog.html`, `public/catalog.css`, `public/catalog-core.js`, `public/catalog-init.js`, `public/catalog-workflow.js`, `public/catalog-scraping.js`, dan `scripts/check.cjs`. Modul baru: `public/catalog-product.js` dan `public/catalog-showroom.js`. `public/tailwind.css` diregenerasi melalui build. Homepage dan file legacy `src/` tidak diedit pada tahap ini.

Tautan WhatsApp dicegat lokal; tidak ada data uji atau pesan dikirim. Belum diuji pada perangkat fisik, Safari/Firefox, atau Node 20. Belum ada audit WCAG penuh, Lighthouse, atau pengukuran konversi produksi. Konten template landing dan detail demo lama tetap perlu review editorial tersendiri sebelum dipakai sebagai portofolio pelanggan.
