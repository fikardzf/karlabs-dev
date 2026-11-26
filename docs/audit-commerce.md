# Katalog pakaian, kasir, dan ekstraksi produk

Audit pada build statis 26 November 2026. Setiap alur dapat dibuka dari `/portfolio/<slug>/` dan dari `/catalog.html#<slug>`. Seluruh data contoh berasal dari berkas JavaScript lokal. Memuat ulang halaman memulai sesi baru.

## Inventaris dan matriks pengujian

Keterangan awal “Belum diuji” berarti penerimaan belum diasumsikan dari hasil inspeksi sumber. Keterangan akhir “Lulus” berlaku untuk fungsi dan masukan dalam kolom hasil, pada browser yang disebut dalam laporan pengujian.

| Demo, kontrol dan maksud | Handler, data dan state | Hasil yang diharapkan dan diperiksa | Awal → akhir |
|---|---|---|---|
| Katalog · enam kartu dan gambar, pencarian, kategori, urutan harga, hapus filter | `render`, array `collection`, filter input/select | Enam WebP dimuat. Harga minimum Kaos Boxy, maksimum Jeans Straight. Istilah denim bersama kategori Celana menemukan Jeans Straight. Pencarian kosong hasil memberi aksi pemulihan dan mengembalikan fokus. | Sebagian · denim gagal → diperbaiki |
| Katalog · detail, ukuran, jumlah, ringkasan dan konsultasi | `openDetail/updateChoice`, pilihan produk, select varian dan jumlah | 3 Jeans Straight ukuran 32 menghasilkan Rp777.000. Isi tautan WhatsApp berisi produk, ukuran, jumlah dan subtotal sebagai contoh konsultasi. Tutup dan Escape mengembalikan pengguna ke katalog. | Sebagian · tautan mengabaikan varian/jumlah → diperbaiki |
| Katalog · tambah, gabungkan atau hapus varian, total tas, reset | `bag` berupa Map dengan kunci produk/ukuran, `renderBag` | Penambahan berulang ukuran sama menjadi 4 item satu baris, ukuran lain terpisah. Menghapus varian mengurangi total menjadi Rp259.000. Reset mengosongkan tas. | Belum diuji → lulus |
| Katalog · hilang gambar dan perpindahan rute saat dialog aktif | HTML alt, dialog native dan router katalog | Permintaan foto linen sengaja diblokir. Nama, teks alternatif, harga dan ringkasan tetap tersedia. Saat hash berganti, dialog produk dilepas agar kasir dapat digunakan. | Sebagian · dialog memblokir panel berikut → perbaikan router bersama |
| POS · pencarian, tambah, tambah/kurang unit, stok, lompat ke pesanan pada ponsel | `renderPosProducts`, `addPosProduct/updatePosQty`, enam `posDemoProducts` | Filter tanpa hasil dapat dipulihkan. Dua cheesecake menghabiskan stok dua. Penurunan ke nol menghapus baris, fokus kembali ke kolom pencarian ketika kartu tersaring. | Sebagian · fokus hilang → diperbaiki |
| POS · tahan, lanjutkan, reset pesanan, ganti pelanggan | `heldOrders`, `holdOrder/resumeOrder`, `resetPos` | Urutan FIFO terjaga. Pesanan aktif mencegah penggantian diam-diam. Dua cheesecake yang tertahan juga menghabiskan kuota untuk pesanan baru. Memulai sesi baru mengosongkan pesanan aktif. | Sebagian · stok dapat dipakai dua pesanan sekaligus → diperbaiki |
| POS · diskon, pajak demo, pembayaran, kembalian, struk, transaksi baru | `posTotals`, `cashReceived`, `renderTender`, `openPosReceipt` | Dua latte dan satu croissant Rp102.000 menghasilkan diskon 5% Rp5.100, pajak simulasi Rp10.659 dan total Rp107.559. Tunai Rp110.000 memberikan kembalian Rp2.441. Angka cacat, pembayaran kurang, keranjang kosong dan transaksi baru diuji. Kartu/transfer memiliki struk tanpa baris tunai. | Belum diuji → lulus |
| Ekstraksi · pilih sumber/jumlah halaman, jalankan, progres, reset, ganti sumber saat berjalan | `sourceRows/simulateScraping/resetScrape`, timer dan dua dataset statis | Satu halaman kedai menghasilkan dua menu. Sepuluh halaman pakaian menghasilkan 88 produk dan sepuluh log. Reset/ubah sumber menghentikan run. Mengubah jumlah halaman setelah selesai menyembunyikan hasil lama. | Sebagian · pilihan sepuluh halaman masih menampilkan keluaran tiga halaman → diperbaiki |
| Ekstraksi · pilih ukuran halaman, berikut/kembali, lima urutan, pencarian | `selectedScrapeRows/renderScrapeTable`, urutan, halaman, query | Halaman kedua 21–40 dari 88. Klik kolom mengurutkan dan kembali ke halaman pertama. Filter Hoodie memberi lima produk. Tanpa kecocokan, ekspor dan navigasi halaman dinonaktifkan. | Sebagian · urutan baru dimulai di tengah tabel → diperbaiki |
| Ekstraksi · pratinjau, unduh CSV, salin JSON, kegagalan izin | `exportRows/downloadCSV`, peramban, Clipboard API | Berkas unduhan sungguhan diperiksa nama, lima kolom, lima baris, urutan, harga, stok, rating serta kecocokan tiga baris pratinjau. Mock clipboard menangkap payload JSON lengkap. Penolakan izin menawarkan unduh CSV. | Belum diuji → lulus |
| Katalog · tombol coba lagi pada galat inisialisasi | `retryProductDemo/initProductCatalog` | Fixture gagal satu kali saat browser mengisi daftar. Pemberitahuan muncul; tombol muat ulang memulihkan enam kartu dan menyembunyikan pemberitahuan. Diuji di Chromium dan WebKit, 390 serta 1440 piksel. | Belum diuji → lulus |
| Konsultasi dan pemenuhan transaksi | URL WhatsApp dari pilihan produk/proyek; aksi lokal | Tujuan dan isi URL diuji. Pengiriman WhatsApp, pembayaran nyata, reservasi inventori permanen dan ekstraksi dari situs eksternal tidak termasuk operasi demo. | Memerlukan layanan eksternal untuk pengiriman |

## Reproduksi dan batasan

Build lokal lulus pada Chromium dan WebKit untuk tiga demo × dua pintu masuk × dua ukuran perangkat per engine (24 perjalanan). Pemeriksaan pemulihan gambar/riwayat dan inisialisasi dilakukan terpisah dari hitungan perjalanan tersebut. Tidak ada galat runtime JavaScript atau respons HTTP lokal 4xx/5xx yang tak diharapkan.

Jalankan `npm run check`, kemudian `npm run preview`. Dengan Python Playwright dan browser terpasang:

```sh
python -X utf8 scripts/test-commerce.py
python -X utf8 scripts/test-commerce.py --browser webkit
```

Masing-masing perintah menguji desktop 1440 × 900 dan emulasi iPhone 13, pada katalog lama dan canvas. Tes memblokir permintaan HTTPS eksternal, memeriksa galat JavaScript dan respons HTTP lokal, serta memeriksa overflow. Pemeriksaan unduhan memakai berkas yang dihasilkan browser. Uji salin memakai izin berhasil dan ditolak yang disimulasikan, bukan verifikasi clipboard OS. Tidak ada pesan pelanggan yang dikirim.

Sumber yang diperbaiki adalah `public/catalog-product.js`, `public/catalog-pos.js`, dan `public/catalog-scraping.js`. Suite baru adalah `scripts/test-commerce.py`. Perbaikan router dan pembaruan versi aset berada di perubahan bersama. Katalog dan POS memakai nilai transaksi lokal; memulai transaksi kasir baru melepaskan kuota contoh. Nama produk dan data yang dirender berasal dari array statis; teks pencarian dipakai sebagai filter. Tidak ada endpoint order, stok, harga atau pembayaran yang ditulis oleh ketiga modul.
