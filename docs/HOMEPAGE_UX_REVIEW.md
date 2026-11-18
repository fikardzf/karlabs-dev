# KAR Labs — Homepage UX/CRO review

Tanggal: 17 November 2026. Basis: working tree pada branch `feat/homepage-umkm-leads`, setelah implementasi homepage sebelumnya. Audit ini menilai source lokal; bukan klaim bahwa perubahan sudah tersedia di Netlify.

## Audit sebelum perubahan tahap ini

| Aspek | Sudah diimplementasikan | Celah yang perlu dilengkapi |
| --- | --- | --- |
| Value proposition | Eyebrow menyebut katalog, automasi, dan UMKM; copy menjelaskan manfaat | H1 masih generik: “Produk mudah dipilih. Bisnis lebih rapi dikelola.” Nama layanan dan target perlu masuk ke headline |
| Hierarki visual | Hero dua kolom, preview WebP asli yang sudah tersedia, dua kartu layanan unggulan | Preview hanya gambar; pilihan antara katalog dan automasi belum terlihat pada preview |
| Trust | Testimoni dan angka yang belum terverifikasi sudah diganti contoh berlabel | Badge “POPULER” pada paket belum didukung bukti; perlu diganti label deskriptif |
| Prioritas layanan | Website Katalog Produk dan Business Automation ditonjolkan; layanan lain ada dalam disclosure | Konteks masalah harian UMKM belum dipetakan secara eksplisit ke solusi |
| Mobile | CTA bawah, safe-area spacing, menu dengan pengelolaan fokus, layout responsif | Perlu uji ulang untuk headline, preview, dan scope harga baru; CTA bawah sebaiknya memberi ruang saat form difokuskan |
| Friksi konversi | Konsultasi langsung via WhatsApp dan form dengan konteks usaha | Klik paket belum membawa nama paket ke pesan; pengunjung perlu mengingat atau mengetik ulang |
| CTA | CTA tersebar di header, hero, kartu layanan, form, dan mobile | Label konsultasi belum konsisten; hero hanya mengarahkan demo ke katalog produk |
| Arsitektur informasi | Layanan → demo → proses → harga → FAQ → kontak | Batas scope, biaya pihak ketiga, serah terima, dan maintenance belum dijelaskan sebagai hal yang perlu dikonfirmasi |

## Perubahan yang diimplementasikan

- H1 menyebut **Website Katalog Produk & Automasi Bisnis untuk UMKM**. Jalur utama adalah **Konsultasi Gratis via WhatsApp**; jalur eksplorasi adalah **Lihat Demo Interaktif**.
- Preview hero memakai gambar katalog yang sudah ada dan ilustrasi alur order. Pengunjung dapat memilih keduanya menggunakan pointer, keyboard, atau touch. Tautan menuju `catalog.html` tetap tersedia. Tidak ada koneksi akun atau pemrosesan order pada ilustrasi.
- Dua kartu layanan unggulan dan disclosure layanan pendukung dipertahankan. Empat kartu masalah–solusi ditambahkan di section layanan yang sama, bukan membuat daftar layanan unggulan baru.
- Sasaran evaluasi berupa jumlah pertanyaan produk, langkah input ulang, waktu proses order/rekap, kelengkapan status, dan konsistensi follow-up. Tidak ada persentase peningkatan atau hasil penjualan yang diklaim.
- CTA setelah demo membantu pengunjung melanjutkan konsultasi. CTA mobile tetap tersedia, tetapi disembunyikan ketika fokus berada di form agar tidak mengganggu pengisian.
- Harga, deliverables, jumlah revisi, timeline, dan durasi support yang sudah tertulis dipertahankan. Badge popularitas diganti label nama paket.
- Disclosure pricing menjelaskan hal yang perlu dikonfirmasi: deliverables, batas scope, biaya pihak ketiga, pengecualian, materi, serah terima, revisi, support, dan maintenance. Tidak menetapkan kebijakan komersial baru.
- Klik paket menampilkan konteks paket pada form dan menyertakannya pada pesan WhatsApp. Pengunjung dapat menghapus pilihan. Memilih CTA layanan lain membersihkan konteks paket sebelumnya tanpa menghapus pesan yang sudah diketik.
- URL CSS dan JavaScript homepage diberi versi tahap ini agar sesuai dengan cache asset Netlify yang sudah ada.

## Alasan UX/CRO

Headline eksplisit membantu pengunjung mengenali jenis layanan dan kecocokan bisnis sebelum membaca detail. Dua jalur CTA melayani pengunjung yang siap berdiskusi maupun yang masih ingin melihat contoh. Prioritas dua layanan dipertahankan untuk membatasi beban pilihan.

Masalah–solusi memakai bahasa operasional UMKM agar calon pelanggan dapat menyampaikan kebutuhan yang lebih konkret. Sasaran evaluasi menjadi bahan diskusi scope, bukan janji hasil. Contoh berlabel dan rincian penawaran membantu membangun kepercayaan tanpa testimoni atau bukti pelanggan buatan.

Konteks paket mengurangi kebutuhan mengulang informasi saat berpindah dari harga ke form. Peningkatan conversion rate belum diukur; tidak ada analytics atau pengumpulan data baru yang ditambahkan.

## Validasi

- `npm.cmd run check` menjalankan source checks, compile Tailwind, build statis, dan dist checks.
- Smoke test Chromium melalui preview produksi mencakup homepage dan katalog, navigasi keyboard, preview, form, CTA, scope harga, serta kondisi tanpa JavaScript dan reduced motion.
- Hasil: 18 kelompok smoke test lulus, tanpa uncaught JavaScript error atau permintaan jaringan yang gagal pada pengujian tersebut.
- Lebar viewport: 320, 360, 390, 768, 1024, dan 1440 px. Pemeriksaan mencakup overflow dokumen dan clipping elemen utama.
- Seluruh navigasi WhatsApp dari form dicegat lokal saat pengujian. Tidak ada pesan atau data uji yang dikirim ke WhatsApp.
- Perbandingan terhadap baseline memeriksa bahwa harga dan rincian komersial paket tidak berubah.
- Screenshot, hasil terperinci, dan diff tahap ini tersedia di `node_modules/.cache/karlabs-homepage-phase2/` sebagai artefak lokal yang diabaikan Git.

## Hal yang masih perlu ditindaklanjuti

- Pemilik bisnis perlu memastikan domain canonical `karlabs.dev` sebelum deployment, sesuai temuan audit sebelumnya. Canonical tidak diubah pada tahap homepage ini.
- Penawaran aktual perlu merinci cakupan biaya pihak ketiga, maintenance, “revisi unlimited”, dan “scraping ongoing”. Istilah serta komitmen paket yang sudah ada tidak ditafsirkan ulang sepihak.
- Beberapa demo katalog memuat metrik ilustratif. Audit label dan copy demo secara menyeluruh masih menjadi pekerjaan terpisah; metrik tersebut tidak dipakai sebagai bukti hasil pada homepage.
- Belum diuji pada perangkat fisik, Safari/Firefox, maupun Node 20. Pemeriksaan otomatis memakai Chromium dan Node 24. Belum ada audit WCAG atau Lighthouse lengkap, maupun pengukuran conversion rate produksi.
- Dokumentasi legacy seperti `DEVELOPMENT_GUIDE.md` masih perlu sinkronisasi terpisah. Acuan build tahap ini adalah README dan source production saat ini.

Tidak ada commit, push, atau deployment pada tahap ini.
