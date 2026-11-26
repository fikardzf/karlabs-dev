# Verifikasi chatbot, Business Automation, dan Landing Page

Audit 26 November 2026. Semua pengujian berinteraksi dengan DOM melalui Playwright. Canvas menguji seluruh kelompok fungsi di bawah. Katalog lama menjalankan uji sambungan pada masing-masing panel. Data percakapan, penawaran, dan kasus operasional disiapkan lokal.

## Inventaris dan hasil

| Rute / fungsi | Kontrol, handler dan sumber keadaan | Ekspektasi dan hasil browser | Sebelum → sesudah | Bukti |
|---|---|---|---|---|
| /portfolio/chatbot/ dan /catalog.html#chatbot · percakapan | chatScenarioSelect, quickReplies, chatSend, Enter → loadScenario, sendMsg, botReply. Lima daftar aturan dan riwayat DOM per halaman | Tiap balasan cepat memberi jawaban topik yang dipilih. Biaya Course kini menampilkan Rp299.000. Pesan yang mengandung potongan kata tanpa kata kunci utuh mendapat balasan bantuan | Salah topik pada sebagian pertanyaan → berfungsi dalam simulasi | test-studio.py, chat |
| Percakapan beruntun, pergantian, reset | Set timer, indikator Mengetik, tombol Mulai ulang chat | Dua pesan berurutan menghasilkan pasangan pengguna–bot dalam urutan masukan. Reset membatalkan jawaban tertunda dan mengembalikan salam. Kata kunci buatan tetap tersedia pada skenario semula | Urutan ambigu → berfungsi | chat, test-showroom.py |
| Coba aturan dan pengalihan | keywordRuleList, tambah aturan, lihat ringkasan, kembali ke bot | Semua tombol aturan bawaan dijalankan. Form kosong memfokuskan kolom, karakter khusus tampil sebagai teks, aturan khusus terisolasi per skenario. Antrean admin simulasi memuat topik percakapan | Jalur normal telah ada, uji aturan saat dialihkan bisa memberi ringkasan → aturan kini dicoba langsung | chat |
| /portfolio/workflow/ dan /catalog.html#workflow · pemilihan dan input | workflowCatalog/picker → selectWorkflow. workflowSample, workflowAmount, workflowDataState → renderWorkflowCase. Tujuh dataset berisi total 15 kasus | Semua kasus ditelusuri lewat baca, periksa, pulihkan data yang kurang, hasil, tinjau dan reset. Bilangan kosong, negatif, pecahan serta di atas maksimum menahan proses. Nilai minimum dapat dijalankan | Belum terverifikasi seluas ini → berfungsi dalam simulasi | test-studio.py, workflow |
| Hasil per cabang | flow.build(sample, amount), panel finding, workflowRecord, review dan sunting | Chat membuat draf kebutuhan, nota menghitung jumlah × harga, email membedakan grosir/keluhan, gudang menghasilkan daftar kemas/penundaan/kekurangan, stok membedakan beli/cukup, iklan mengidentifikasi biaya melewati batas. Uji kasus nota 3 × Rp24.000 menghasilkan Rp72.000 dan usulan gelas sebesar 60 unit | Hasil lokal dapat ditinjau dan diulang | workflow, test-showroom.py |
| Persetujuan berjenjang | workflowApprove → workflowReviews, batas pengajuan Rp1.000.000 | Printer Rp2.400.000 memerlukan dua keputusan. Setelah klik ganda pada supervisor, tampilan masih menunggu pemilik. Pada Rp1.000.000 cukup satu pemeriksa. Revisi mengembalikan masukan, sunting lalu batal mempertahankan draf | Klik ganda menyetujui dua peran → berfungsi | workflow, test-showroom.py |
| /portfolio/landing/ dan /catalog.html#landing · pilihan desain | filter industri, landingGoal → filteredLandingTemplates, renderLandingTemplates | 17 desain. Jumlah dan kartu cocok untuk 11 pilihan industri termasuk Semua × 5 pilihan tujuan termasuk Semua. Kombinasi kosong dapat dipulihkan. Semua gambar hero dapat didekode dan semua 51 penawaran dapat dibuka dengan draf menyebut nama pilihan | Belum diverifikasi per desain → berfungsi | test-studio.py, landing |
| Pratinjau modal | tombol kartu, landingSwitch, tombol Desktop/Ponsel, buka tab, Escape, tutup | Identitas desain, URL konsultasi, judul iframe dan isi berubah bersama. Mode ponsel maksimal 390 px, desktop kembali lebih lebar. Menutup modal mengembalikan fokus ke kartu | Berfungsi | landing, test-showroom.py |
| /public/landing-preview.html?design=… · tab khusus | openLandingPreviewInNewTab, initStandaloneLanding, query ID yang dicocokkan dengan registry | Memuat ulang tab mempertahankan desain beserta penawaran; opener kosong. ID tak dikenal menyediakan tautan pemulihan. Tombol kembali menutup popup atau mengarahkan kembali ke koleksi. Ketika popup diblokir, tersedia modal | Tab kosong setelah reload → URL statis dapat dibuka ulang | landing, test-showroom.py |
| Konsultasi | Tautan dari canvas, workflow terpilih dan dialog landing | URL WhatsApp memuat layanan, nama alur atau desain yang dipilih. Pengujian memeriksa tujuan dan parameter | Draf tautan berfungsi. Penyerahan ke WhatsApp memerlukan layanan eksternal | workflow, landing, test-showroom.py |

## Cacat yang direproduksi

- P1. Pencarian substring pertama memilih aturan Program sebelum Biaya untuk tombol Biaya Course, juga menganggap “sekelasnya” pertanyaan kelas. Pencocokan judul penuh didahulukan dan pencarian kata menggunakan batas kata. Klik pada tombol uji aturan meneruskan aturan yang dipilih.
- P2. Jawaban timer selalu ditambahkan di akhir percakapan. Kini balasan menempati posisi indikator masing-masing, termasuk saat pengunjung mengirim beberapa pesan sebelum bot selesai. Teks tanpa spasi yang panjang juga membungkus di area percakapan.
- P1. Satu klik ganda pada tombol persetujuan sebelumnya mengesahkan dua pemeriksa. Klik beruntun dalam satu gestur dan pengulangan tombol keyboard ditahan. Keputusan sengaja berikutnya dapat dilanjutkan.
- P1. Dokumen popup dibuat di about:blank dan kosong setelah refresh. Pratinjau kini memakai halaman statis dengan ID desain, kode rendering yang sama, dan pesan pemulihan untuk ID yang keliru.

## Batas dan cara reproduksi

| Demo | Kesiapan untuk pengunjung | Bukti eksekusi |
|---|---|---|
| Chatbot WhatsApp | Ready for Public Demo · simulasi percakapan lokal | Chromium dan WebKit lulus lima skenario, semua tombol aturan serta handoff contoh |
| Business Automation | Ready for Public Demo · simulasi lokal | Chromium dan WebKit lulus tujuh alur, 15 kasus, tahap masukan tidak lengkap dan tinjauan |
| Landing Page | Ready for Public Demo · contoh interaktif | Chromium dan WebKit lulus 55 kombinasi filter, 17 desain, 51 penawaran serta pemulihan URL |

Chatbot dan workflow menjalankan **simulasi lokal**. Reset chat menghapus percakapan dan mempertahankan aturan tambahan di memori per skenario sepanjang kunjungan. Tidak ada akun WhatsApp, petugas sungguhan, SMTP, spreadsheet produksi, atau kampanye iklan yang terhubung. Landing Page adalah **demo fungsional** berisi pilihan penawaran dan contoh draf pelanggan. Tidak mengirim reservasi atau pembayaran. Iframe memakai sandbox kosong, isi draf menampilkan teks yang di-escape, dan tab desain menerima ID dari registry. Pengujian tidak mengirim data pelanggan atau mengukur keterkiriman WhatsApp.

Jalankan dari root setelah build dan npm run preview. Jalankan masing-masing perintah dengan Python Playwright serta browser yang sesuai. Opsi fixture memakai salinan vendor lokal yang diperiksa integritasnya oleh test-showroom.py. Tanpa cache, hilangkan opsi tersebut dan izinkan pemuatan dua vendor yang dikunci versinya.

```powershell
python -B scripts/test-studio.py --browser chromium --fixture-dir node_modules/.cache/karlabs-technical-review
python -B scripts/test-studio.py --browser webkit --fixture-dir node_modules/.cache/karlabs-technical-review
```

Berkas produksi yang diubah adalah public/catalog-chatbot.js, public/catalog-workflow.js, public/catalog-landing.js, public/landing-preview.html, dan aturan pembungkusan chat pada public/demo-studio.css. Validasi mobile memakai viewport browser, tanpa perangkat fisik atau aplikasi WhatsApp asli.
