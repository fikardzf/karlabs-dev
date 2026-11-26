# Verifikasi kalkulator dan dashboard

Lingkup berupa aplikasi statis pada branch `audit/full-demo-functionality`, melalui `/portfolio/calculator/`, `/portfolio/dashboard/`, serta `/catalog.html#calculator` dan `#dashboard`. Lima lembar usaha, KPR, dan BMI menghitung di browser. Empat laporan dashboard menggunakan contoh transaksi, stok, kampanye, dan penawaran dalam memori tab. Tombol konsultasi membuka draf WhatsApp. Pengujian memeriksa tujuan dan isi tautannya.

## Inventaris dan matriks fungsi

Nama handler merujuk ke `public/catalog-calculators.js` atau `public/catalog-dashboard.js`. Kolom akhir menunjukkan bukti yang dieksekusi di `scripts/test-numbers.py` dan `scripts/test-showroom.py`. Status fungsional berlaku untuk representasi lokal dan kasus yang diuji.

| Kontrol dan tujuan | Handler, state dan input | Hasil yang diperiksa | Awal → hasil |
|---|---|---|---|
| Pilih alat, contoh usaha, pulihkan angka, lihat hasil, buka cara menghitung | `initCalculators`, `wireCalculatorSheet`; satu set kolom per alat, baseline mengikuti contoh aktif | 15 preset, panel terpilih, fokus ke hasil di ponsel, selisih dari baseline dan tautan konsultasi per alat | Belum diverifikasi → fungsional |
| Titik impas dan target laba | `businessCalculations.bep`; harga, biaya variabel, tetap, dan target; slider harga dan masukan manual | Tiga contoh menghasilkan 116/120/100 unit. Harga di bawah atau sama dengan biaya variabel menampilkan batas impas. Harga yang digeser dengan keyboard konsisten dengan input | Belum diverifikasi → fungsional |
| Harga jual marketplace | `pricing`; modal, kemasan, margin, potongan | Harga minimum tiga contoh Rp115.385/Rp60.000/Rp62.500. Persen gabungan 100% dan isian kosong ditangani | Belum diverifikasi → fungsional |
| Iklan | `ads`; omzet, biaya, margin dan pesanan | Sisa laba contoh Rp1.825.000, −Rp150.000, Rp340.000. Margin desimal koma serta nol pesanan diuji | Belum diverifikasi → fungsional |
| Persediaan dan kapan memesan | `inventory`; permintaan harian dan tahunan, waktu kirim, stok aman dan biaya pesan/simpan | Ambang tiga contoh 162/180/140 unit. Pembulatan 0,07 × 100 menghasilkan 7 unit. Biaya simpan nol tetap memberi ambang tanpa EOQ | Sebagian → diperbaiki dan diuji |
| Ongkir dan berat volume | `ongkir`; dua kota, kurir, berat, tiga ukuran | Tiga contoh ditagih 1/7/1 kg, ongkir Rp18.000/Rp97.200/Rp18.000. Mengubah kota dan kurir bekerja, berat nol mengosongkan hasil | Belum diverifikasi → fungsional sebagai simulasi tarif |
| KPR | `updateKPR`; harga, DP, bunga, tenor, tombol Hitung, grafik pokok/bunga opsional | Anuitas dibandingkan perhitungan Python. Harga negatif, tidak lengkap, teks, atau di luar batas memberi pesan, membersihkan hasil dan grafik; pulih setelah diperbaiki | Sebagian → diperbaiki dan diuji |
| BMI dan energi | `updateBMI`; berat, tinggi, usia dewasa, jenis kelamin, aktivitas, tombol Hitung | 70 kg/170 cm → BMI 24,2. Estimasi energi dibandingkan rumus contoh. Infinity, berat negatif, usia anak, atau isian kosong mengosongkan keluaran | Sebagian → diperbaiki dan diuji sebagai contoh edukasi |
| Buku kas, periode, tambah transaksi, tutup atau batalkan | `initDashboard`, `buildCashReport`; daftar transaksi memori, filter semua/pekan/bulan | Dua belas transaksi dengan kas Rp1.565.000, tujuh baris pada periode sepekan. Saldo akhir CSV sama dengan pemasukan dikurangi pengeluaran dan selisih seri grafik. Transaksi baru pindah ke periode yang sesuai, disimpan satu kali; muat ulang memulihkan data contoh | Sebagian → diperbaiki dan diuji |
| Laporan penjualan | `buildSalesReport`; tambahan 0/5/15 pembayaran | Jumlah 88/93/103 pesanan dari 260 penawaran, seri batang dan lingkaran konsisten dengan CSV | Belum diverifikasi → fungsional |
| Laporan stok | `buildStockReport`; keterlambatan 0/3/7 hari | Setiap ambang, saran beli, dan total diperiksa ulang dari kolom hasil ekspor. Penundaan tujuh hari menghasilkan tiga barang yang perlu dipesan dan saran 376 unit | Belum diverifikasi → fungsional |
| Laporan iklan | `buildAdReport`; margin turun 0/5/15 poin | Kontribusi setiap kanal dihitung ulang dari omzet, margin dan biaya. Pada −15 poin, total Rp4.686.000 dan satu nilai negatif −Rp154.000 | Belum diverifikasi → fungsional |
| Warna, rumus, tabel dan ekspor dashboard, konsultasi | `updateDashboard`, `drawDashboardChart`, `downloadCSV`; laporan/tema/periode/skenario aktif | Perubahan tema diterapkan ke lembar, rumus terbuka, klik legenda menyembunyikan/mengembalikan seri, tooltip desktop sesuai Rp350.000. File CSV dibaca parser. Koma, tanda kutip, ampersand dan nilai negatif tetap benar. Permintaan konsultasi menyebut laporan pilihan | Sebagian (klik ekspor) → diperbaiki dan diuji |
| Buku kas tanpa data sumber | `cashPeriodRows`, `buildCashReport`; fixture kosong buatan tes | Tidak ada tanggal invalid atau exception, penjelasan keadaan kosong tampil dan CSV dinonaktifkan. Mengisi ulang halaman memulihkan laporan | Akses tanggal pada array kosong → diperbaiki dan diuji dengan fixture |

## Cacat dan keputusan

- **P1.** Harga KPR `-100.000` sebelumnya diam-diam menjadi Rp100.000 dan menghasilkan pinjaman Rp80.000. Sekarang parser memeriksa format rupiah sebelum normalisasi saat blur, menandai input yang salah, dan memberi contoh perbaikan.
- **P1.** Kalkulator BMI menerima `Infinity` sebagai berat dan menampilkan BMI 0,0 serta energi tak hingga. Pemeriksaan format, rentang simulasi dewasa, dan hasil rumus mendahului pembaruan angka maupun grafik.
- **P1.** Ambang stok dengan penjualan 0,07 unit/hari selama 100 hari, tanpa cadangan, sebelumnya 8 unit. Penghitungan permintaan dalam perseratus unit sebelum pembagian menghindari pembulatan biner ke unit berikutnya.
- **P1.** Buku kas menerima kategori/keterangan berisi spasi dan menambahkan transaksi tanpa identitas ke total. Validasi sesudah trim sekarang menahan dialog dan menandai isian. Akumulasi per jenis transaksi juga harus tetap dalam rentang integer aman; tanggal mengikuti format tahun empat digit yang digunakan oleh filter dan grafik.
- **P2.** Periode tanpa pengeluaran sudah memiliki pesan dan menyembunyikan grafik pembagiannya. Untuk sumber transaksi kosong keseluruhan, pemilihan tanggal terakhir sebelumnya mengakses anggota yang belum ada. Pesan kosong serta keadaan ekspor sekarang konsisten.
- **P2.** Pada katalog mobile Chromium, posisi tombol unduh bisa berosilasi dua piksel ketika perubahan panjang hasil iklan menempatkan tepi tombol tepat di bawah pointer. Klik ekspor gagal berulang pada skenario margin turun 15 poin. Menonaktifkan perpindahan posisi saat hover untuk tombol ini mempertahankan warna fokus dan memungkinkan ekspor pada skenario yang sama.
- Tidak ada basis data atau transaksi keuangan di dua demo ini. Skenario kalkulator, data transaksi yang dimasukkan dan laporan hanya berada di memori halaman. Unduhan memakai Blob lokal. CSV saldo/keterangan diperiksa sebagai file, bukan sekadar memeriksa toast. Kalkulator tidak mempunyai tombol ekspor. Dashboard tidak menyediakan filter kategori, pengurutan manual atau pemilihan rentang tanggal bebas.

## Pengulangan dan lingkup hasil

Hasil `test-numbers.py` pada build lokal: Chromium 1440/canvas dan 390/katalog lulus untuk dua demo. WebKit 1440/canvas dan 390/katalog juga lulus. Delapan perjalanan tersebut memakai fixture CDN yang dipastikan integritasnya, tanpa exception halaman dan tanpa overflow horizontal. Tes mencakup klik legenda, tooltip desktop, unduhan tiap periode/skenario dan pengisian ulang formulir yang semula salah.

Jalankan `npm run check` lalu `npm run preview`. Gunakan `python -B scripts/test-numbers.py --browser chromium` serta `--browser webkit`. Opsi `--base` memilih preview build lain. Opsi `--fixture-dir` memakai salinan lokal Chart.js dan Lucide yang lolos pemeriksaan integritas dari suite showroom. `scripts/test-showroom.py` melengkapi pemeriksaan keyboard dialog, reset dan konsultasi.

Pengujian membandingkan keluaran dari kontrol publik dan unduhan, termasuk percobaan yang ditolak. Satu uji khusus menyuntikkan dataset kosong ke memori dan diberi label di suite. Perhitungan BMI dan anuitas diuji sebagai implementasi rumus contoh, tanpa validasi klinis atau penawaran kredit. Tarif contoh ongkir tidak dikonfirmasi ke kurir. Grafik dashboard memerlukan Chart.js dari CDN saat dipakai publik. Aplikasi tidak mengirim data ke bank, kurir, layanan kesehatan atau penyedia dashboard. Perangkat fisik dan pembaca layar tidak diuji di suite ini.

| Demo | Putusan dan batas |
|---|---|
| Kalkulator Bisnis | Siap sebagai demo publik dengan batas simulasi yang dinyatakan. Lima alat usaha berjalan lokal. KPR dan BMI dapat menghitung tanpa grafik opsional, dan memakai batas format serta rentang masukan contoh. |
| Dashboard Usaha | Siap dengan batas eksplisit. Laporan memakai data simulasi dan memerlukan Chart.js. Mode, tema, periode, penambahan transaksi dan nilai hasil ekspor diperiksa. Data tambahan berakhir saat halaman dimuat ulang. |
