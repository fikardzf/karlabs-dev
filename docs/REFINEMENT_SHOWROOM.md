# Audit dan penyempurnaan showroom KAR Labs.dev

23 November 2026 · Branch `feat/interactive-portfolio-gallery` · Pratinjau lokal dari `dist/`

## Basis pekerjaan

Branch bersih saat audit dimulai pada `1791e04`. GitHub `main` saat diperiksa berada di `dbc8d84`. Hash berkas `index.html`, `catalog.html`, `package.json`, registry proyek, dan generator portfolio pada kedua commit sama. ZIP historis memuat kompilasi Tailwind lokal. Branch showroom sudah memakai alur itu dan menambahkan generator delapan canvas. Netlify mengembalikan HTTP 200, judul galeri, dan markup panggung. Pemeriksaan publik tersebut tidak mengidentifikasi SHA deployment.

Arah desain mengikuti galeri editorial untuk pemilik UMKM. Sampul menjadi pusat perhatian di beranda. Di dalam canvas, pesanan, transaksi, percakapan, atau desain contoh mengambil peran itu. Dalam istilah skill, arahnya ENERGY 2, RHYTHM 3, MOTION 2. Bingkai dan bayangan membedakan kedalaman di galeri. Gerak memberi umpan balik saat berpindah karya. Form dan tabel mengutamakan keterbacaan.

## Tiga temuan utama

| Prioritas | Bukti sebelum perubahan | Hasil |
| --- | --- | --- |
| P0 · Data demo berubah makna | Margin iklan 32,5% terbaca 325%. Menahan pesanan anggota meninggalkan nama anggota di keranjang berikutnya. Form laporan menerima nominal negatif sekalipun arah uang sudah dipilih terpisah. | Dengan omzet contoh Rp100.000, margin 32,5% menghasilkan laba kotor Rp32.500. Pelanggan, diskon dan pembayaran pulih saat pesanan dilanjutkan. Form menerima nilai rupiah bulat positif. |
| P1 · Pengunjung kehilangan konteks | Filter satu demo masih meminta pengunjung menggeser. Lima isian transaksi mengandalkan placeholder atau nama aksesibel dari JS. Pada rotasi WebKit, grafik sempat melampaui layar 1024 px hingga 88 px. Menutup modal setelah mengetuk tombol dapat mengembalikan fokus ke halaman. | Petunjuk mengikuti jumlah demo. Form memiliki lima label permanen. Grafik mengikuti lebar induknya selama perubahan ukuran. Tombol pembuka kembali menerima fokus. |
| P2 · Penjelasan menutupi produk | Empat kartu fitur mendahului pilihan desain. Pada emulasi Pixel 7, tepi atas tombol desain pertama berjarak 1.238 px dari awal area demo. | Pengunjung melihat filter, jumlah hasil, dan contoh halaman lebih awal. Pada pengukuran yang sama, jaraknya **636 px**. |

P3 yang dipertimbangkan adalah penambahan gerak kamera. Drag, spring dan transisi karya sudah memberi umpan balik. Pengujian mengarahkan perubahan ke petunjuk, fokus, dan perilaku saat hanya satu karya tersedia.

[Tampilan landing page sebelum dan sesudah](portfolio-preview/refinement-landing.webp) · [Form transaksi sebelum dan sesudah](portfolio-preview/refinement-form.webp). Pada kedua gambar, versi awal berada di kiri.

## Perjalanan pengunjung dan delapan demo

Beranda, indeks, canvas dan tautan hash lama diperiksa melalui preview hasil build. Filter tetap mengikuti pengunjung saat membuka demo dan kembali ke galeri. Paket tetap bisa digeser dari Starter hingga Premium di ponsel. Draf konsultasi kini menampilkan harga awal sekali, dengan cakupan Premium tetap tercantum. Uji konsultasi berhenti setelah memeriksa isi dan tujuan tautan WhatsApp.

| Demo | Perubahan yang dialami pengunjung | Interaksi yang diperiksa |
| --- | --- | --- |
| Katalog produk | Pilih jumlah dan penyajian. Draf pertanyaan ke penjual menampilkan total dan tetap terpisah dari konsultasi ke KAR Labs. | Dua latte dingin menghasilkan Rp70.000. Berpindah ke roti menyembunyikan pilihan penyajian. Pencarian kosong bisa dipulihkan. |
| Automasi | Kontak contoh bisa diperbaiki dari pemilih data. Setelah pencatatan, pilihan itu dikunci agar hasil langkah sebelumnya tetap konsisten. | Pesanan roti dengan kontak kosong berhenti, diperbaiki, lalu menghasilkan draf tiga croissant. |
| Kasir | Ada akses ke keranjang dari atas menu di ponsel. Struk yang dibuka kembali memakai nomor yang sama. Label pembayaran dan transaksi memakai bahasa kasir. | Tahan, mulai keranjang bersih, lanjutkan pesanan anggota, periksa diskon, metode bayar dan struk. Hapus pencarian mengembalikan fokus. |
| Landing page | Filter jenis usaha dan pratinjau mengambil tempat kartu promosi. Pengunjung dapat kembali dari tab ponsel. Modal tersedia jika browser memblokir tab baru. | Filter Kuliner menampilkan tiga desain. CTA di dalam contoh bekerja. Tab ponsel, modal desktop dan fallback pembatasan popup diuji. |
| Dashboard | Label pemasukan, estimasi laba, asumsi modal, dan periode lebih jelas. Form transaksi dapat digulir dalam orientasi lanskap. Periode tanpa pengeluaran menjelaskan grafik yang kosong. | Tambah transaksi, tolak nominal negatif, cek tabel dan grafik per periode, ganti laporan, tutup dialog dengan Escape. |
| Chatbot | Aturan tambahan disimpan per skenario selama halaman terbuka. Pengunjung dapat memulai percakapan baru sambil mempertahankan aturan yang dibuatnya. | Uji aturan garansi, pindah ke restoran, kembali ke toko, lalu periksa balasan. Handoff dan ringkasan admin juga diuji. |
| Kalkulator | Kolom ukuran dan persentase mendukung pecahan. Input desimal menerima titik atau koma. Kolom rupiah tetap memakai aturan tersendiri. | Cek hasil margin 32,5%, nol pesanan iklan, titik impas, reset contoh dan tinggi badan kosong. |
| Simulasi pengambilan data | Tabel menampilkan rentang hasil pencarian. Tombol membedakan unduhan CSV dari salinan JSON. | Jalankan dataset kedai, cocokkan tiga baris pratinjau dengan CSV, cari latte, lalu ganti dataset. |

Semua canvas memakai status pemuatan dan tombol coba lagi dari shell bersama. Jalur kegagalan diuji dengan memblokir Chart.js sekali dan mencoba kembali. Simulasi pembayaran, balasan admin, dan pemrosesan katalog memakai data lokal. Setiap tautan konsultasi canvas diperiksa terhadap nama proyeknya.

## Matriks penerapan skill

Ketujuh berkas instruksi berhasil dibaca. Direktori yang ditemukan adalah `.agents/skills/`. Pemeriksaan lokasi `.agnets` tidak menemukan direktori. Referensi pendukung yang ditinjau mencakup playbook audit, pola aksesibilitas, ringkasan WCAG, baseline web, dan panduan pengukuran performa.

| Skill dan lokasi | Aturan yang diterapkan dan lingkup | Verifikasi dan keputusan |
| --- | --- | --- |
| [anti-ui-slop](../.agents/skills/anti-ui-slop/SKILL.md) | Playbook `reference/audit.md` meminta temuan yang tampak, prioritas dan koreksi terkecil. Digunakan pada hierarki desain, galeri dan kondisi gagal. | Perbandingan visual dan jarak ke desain pertama. Referensi berbayar bersifat opsional. Bukti dari produk sendiri cukup untuk keputusan ini. |
| [antislop](../.agents/skills/antislop/SKILL.md) | Uji fungsi tiap elemen dan alasan untuk dekorasi. Hilangkan badge “Online” pada kasir lokal dan empat kartu pengantar. | Uji klik, keyboard, isi pesan dan perbandingan sebelum/sesudah. Tiga paket dipertahankan karena berasal dari penawaran bisnis. Brief sudah meminta implementasi langsung. |
| [antislop-code](../.agents/skills/antislop-code/SKILL.md) | Hanya menilai komentar. Komentar naratif pada handler pratinjau dihapus. Komentar singkat menjelaskan alasan pemulihan fokus WebKit. | Diff komentar diperiksa. Perubahan logika memiliki dasar tersendiri pada reproduksi browser. Penanda generator HTML, dokumentasi tipe dan catatan kontrak dipertahankan. |
| [antislop-copywriting](../.agents/skills/antislop-copywriting/SKILL.md) | Gunakan kata kerja yang menjelaskan hasil. Terapkan pada filter industri, pesan produk, keranjang, laporan, CSV dan draf konsultasi. | Periksa teks hasil dan tautan WhatsApp. Nama proyek, istilah teknis yang menentukan format, harga dan ketentuan komersial digunakan sesuai sumbernya. |
| [antislop-human](../.agents/skills/antislop-human/SKILL.md) | Label terlihat, pilihan aktif terpapar ke pembaca layar, fokus kembali, dan ada jalan keluar dari kegagalan. | Uji ketuk, Escape, input salah, popup diblokir dan axe. Pemeriksa kontras skill menghasilkan 7,02:1 untuk teks deskripsi pada kertas serta 10,48:1 untuk label form pada putih. |
| [antislop-layoutmobile](../.agents/skills/antislop-layoutmobile/SKILL.md) | Periksa target sentuh, lebar konten, operasi tanpa hover dan rotasi. | Profil sentuh Pixel 7 dan iPhone 13, tujuh lebar, form lanskap dan navigasi pesanan. Geser horizontal tetap tersedia di galeri, pilihan paket dan tabel yang memang memerlukannya. |
| [antislop-ui](../.agents/skills/antislop-ui/SKILL.md) | Tampilkan objek yang dijelajahi, kurangi pengulangan kartu, pertahankan penekanan pada pilihan aktif dan muat pratinjau sesuai kedekatan dengan viewport. | Inspeksi tampilan ponsel dan desktop, jumlah dokumen pratinjau, serta mode reduced motion. Warna khas tiap demo dan bayangan bingkai galeri punya fungsi visual. |

## Berkas yang berubah

- `index.html`, `catalog.html`, `templates/project.html`, dan `scripts/build-portfolio.cjs` memuat markup bersama serta versi aset untuk cache browser.
- `public/portfolio-gallery.js`, `public/portfolio.css`, dan `public/demo-studio.css` mengatur perilaku galeri, tata letak canvas, kontrol sentuh, dan ruang modal.
- Delapan modul `public/catalog-{product,workflow,pos,landing,dashboard,chatbot,calculators,scraping}.js` dan `public/catalog-dialogs.js` memuat perubahan perilaku di atas. `public/consultation.js` menyusun draf konsultasi.
- `public/tailwind.css` dihasilkan oleh build. `scripts/test-showroom.py` memuat uji regresi yang dapat diulang di kedua mesin browser.
- Laporan ini, dua perbandingan visual di `docs/portfolio-preview/`, dan tautan README melengkapi dokumentasi.

## Validasi dan batas bukti

| Pemeriksaan | Hasil |
| --- | --- |
| Build dan pemeriksaan repositori | `npm run check` lulus, termasuk dengan Node 20.20.2. Mencakup validasi source dan dist, konten paket, SEO, tautan, integritas aset CDN, dan pemeriksaan event kontak. |
| Kualitas kode | `node --check` pada 35 berkas JS/CJS produksi dan build, pemeriksaan tipe ketat registry `config/portfolio.cjs`, serta `git diff --check` lulus. Proyek produksi tidak memiliki skrip npm lint. |
| Uji penerimaan | Chromium dan WebKit menjalankan delapan perjalanan demo melalui server `npm run preview`. Uji mencakup status hasil dan isi berkas CSV. Dua pustaka CDN dilayani dari salinan dengan SHA-384 yang diperiksa. |
| Navigasi | Jalur langsung, delapan URL hash lama, indeks terfilter, riwayat browser, sentuh, drag, roda horizontal, scroll vertikal, keyboard, reduced motion dan navigasi dasar tanpa JavaScript diuji. |
| Responsif | 11 rute pada 320, 375, 390, 430, 768, 1024 dan 1440 px diperiksa pada Chromium dan WebKit. Form tetap dapat diselesaikan setelah rotasi. Pengujian menggunakan emulasi perangkat. |
| Performa | Satu pengukuran lokal Chromium pada 390 × 844 dengan latensi simulasi 150 ms menghasilkan LCP 1,28 detik dan CLS 0. Tombol buka demo berakhir pada posisi 751 px. Pada tampilan awal pustaka desain desktop, enam dari 17 dokumen pratinjau dimuat. Angka ini hanya mewakili kondisi uji tersebut. |
| Aksesibilitas | axe tidak melaporkan pelanggaran pada pemindaian 11 rute untuk tag WCAG 2 A, AA dan 2.1 AA yang dipilih. Ada satu peringatan preload saat audit katalog lama. Uji kondisi interaktif melengkapi pemindaian halaman awal. |

Untuk mengulang uji utama, jalankan `npm run check`, aktifkan `npm run preview`, lalu jalankan `python scripts/test-showroom.py` dan `python scripts/test-showroom.py --browser webkit` dengan browser Playwright terpasang. Opsi `--fixture-dir` menerima direktori salinan lokal Lucide dan Chart.js yang cocok dengan hash aplikasi.

**Penilaian akhir.** Identitas showroom terlihat pada bingkai karya dan perpindahan antarproyek. Identitas tiap demo terlihat dari pekerjaan yang bisa diselesaikan di dalamnya. Bukti terkuatnya adalah pengguna bisa memilih dua latte dan melihat total yang benar, melanjutkan transaksi pelanggan yang tepat, serta membuka desain pertama dengan lebih sedikit guliran. Dampak pada jumlah calon klien perlu data penggunaan setelah peluncuran. Pengujian ini belum mencakup perangkat fisik, sesi pembaca layar manusia, atau pengiriman pesan nyata. Perubahan tersedia di branch lokal.
