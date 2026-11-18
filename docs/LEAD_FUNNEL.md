# Alur konsultasi dan event lead KAR Labs

Tanggal: 18 November 2026. Implementasi statis pada branch `feat/homepage-umkm-leads`. Tidak ada commit, push, atau deploy.

## Audit sebelum perubahan

- Form sudah menyiapkan teks WhatsApp ber-encoding dan mempertahankan konteks paket.
- CTA layanan homepage sudah memilih layanan, tetapi link yang dibuka di tab baru belum membawa konteks form melalui URL.
- Submit langsung menavigasi ke WhatsApp. Belum ada langkah tinjau pesan atau alternatif tab yang sama.
- Validasi memakai `reportValidity()` dan hanya memeriksa nama/kontak kosong. Belum ada ringkasan error, format email/nomor, atau feedback inline.
- Jenis usaha dan kebutuhan belum wajib; budget dan target waktu belum tersedia.
- Belum ada interface event lead bersama untuk homepage dan katalog.

## Form yang diterapkan

Pembaruan logo/light theme dan paket baru ada di `LIGHT_THEME_REVIEW.md`. Pilihan paket kini memuat nama serta harga resmi dari `config/packages.json`/`public/packages.js`; pesan Premium menyertakan batas maksimal satu workflow sederhana yang disepakati. Harga, styling dan ketentuan komersial yang disebut sebagai baseline historis dalam dokumen ini bukan penawaran aktif terbaru.

Lima isian utama: nama, email/nomor WhatsApp, jenis usaha, layanan, dan ringkasan kebutuhan. Anggaran serta target waktu opsional dalam disclosure agar form awal tetap singkat. Tidak ada wizard atau akun baru.

| Isian | Validasi |
| --- | --- |
| Nama | Wajib, tidak hanya spasi, maksimal 100 karakter |
| Email / WhatsApp | Wajib; pola email lengkap atau nomor 8 sampai 15 digit, dengan format plus/spasi/kurung/titik/tanda hubung yang umum; maksimal 150 karakter |
| Jenis usaha | Wajib, tidak hanya spasi, maksimal 150 karakter |
| Layanan | Wajib; tersedia pilihan “Belum yakin, minta arahan” |
| Kebutuhan | Wajib, tidak hanya spasi, maksimal 2.000 karakter |
| Anggaran / target waktu | Opsional, dipilih dari opsi form; bukan komitmen harga atau waktu pengerjaan |

Validasi kontak memeriksa format untuk membantu pengisian, bukan memverifikasi kepemilikan email atau nomor. Error berupa teks, `aria-invalid`, deskripsi yang terhubung ke field, dan ringkasan dengan link untuk memfokuskan isian. Pesan error tidak menyalin data pribadi. Ringkasan tidak dibangun ulang pada setiap keystroke jika daftar field invalid belum berubah.

## Konteks layanan dan paket

- Homepage memakai CTA dengan `data-inquiry-service` dan `data-inquiry-package`. Klik biasa memilih konteks tanpa memuat ulang atau menghapus deskripsi yang sudah diketik.
- URL CTA juga berfungsi ketika dibuka di tab baru. Contoh: `index.html?service=workflow#contact-form`, `index.html?service=product-catalog#contact-form`, atau `index.html?package=professional#contact-form`. Fragment ini langsung menuju form; anchor kontak lama tetap tersedia.
- Katalog menyediakan **Isi ringkasan kebutuhan** di dekat konsultasi WhatsApp langsung. Pilihan layanan dibawa dalam query `service`.
- ID layanan: `product-catalog`, `workflow`, `landing`, `chatbot`, `calculator`, `dashboard`, `pos`, `scraping`, `help`, dan `other`. Label/value yang dikenal pada form juga diterima.
- Paket yang dikenal: `starter`, `professional`, dan `premium`. Paket bersifat multi-layanan, sehingga pilihan layanan yang sudah ada dipertahankan. Jika belum ada pilihan, form memilih **minta arahan**, bukan menebak isi paket atau menjanjikan layanan tertentu.
- Pilihan CTA layanan baru menghapus konteks paket sebelumnya. Pengunjung juga dapat menghapus paket secara eksplisit.
- Nilai URL tidak dikenal diabaikan. Nama, kontak, deskripsi, budget, dan target waktu tidak diambil dari URL atau ditambahkan ke URL halaman oleh aplikasi.

## Handoff yang eksplisit

1. Isi form dan pilih **Siapkan Pesan WhatsApp**.
2. Jika valid, pesan Indonesia ditampilkan sebagai teks biasa untuk ditinjau. Pada tahap ini tidak ada navigasi atau permintaan WhatsApp.
3. Pilih **Buka WhatsApp dengan Pesan Ini**, sebuah anchor native dengan `target="_blank"` dan `rel="noopener noreferrer"`.
4. Jika tab baru tidak terbuka, gunakan tautan **buka WhatsApp di tab ini**. Tidak ada upaya mendeteksi popup dari nilai balik `window.open()` atau menavigasi otomatis.
5. Pengunjung masih perlu menekan Kirim di WhatsApp. Situs tidak mengetahui apakah percakapan terjadi atau pesan terkirim.

Message dibangun dari nilai field yang sudah divalidasi, kemudian seluruh message di-encode melalui `encodeURIComponent`. Nilai Unicode, baris baru, `&`, `+`, `%`, `#`, serta tanda HTML dipertahankan. Preview memakai `textContent`, bukan `innerHTML`.

Mengubah isian atau konteks menghapus href handoff dan menyembunyikan preview lama. Saat link dipilih, validasi dan kecocokan pesan diperiksa lagi agar detail yang kedaluwarsa tidak diteruskan.

CTA WhatsApp langsung tetap tersedia sebagai jalur cepat tanpa form. Jika JavaScript tidak aktif, submit form tetap disabled dan tautan WhatsApp langsung tersedia. Jika modul event diblokir, form tetap dapat menyiapkan pesan.

## Privasi

- Tidak ada penyimpanan isian pada storage browser, cookie aplikasi, antrean analytics, atau server baru.
- Tidak ada API key, layanan berbayar, SDK analytics, endpoint tracking, atau adapter eksternal yang ditambahkan.
- Field dan preview berada di DOM/memori halaman. Browser dapat memiliki autofill atau pemulihan form sesuai pengaturan pengguna; aplikasi tidak menambah mekanisme penyimpanan tersebut.
- Isian hanya menjadi bagian tautan WhatsApp setelah pengguna menyiapkan pesan. Navigasi keluar memerlukan klik eksplisit pada link handoff, disertai penjelasan pada form.
- Membuka WhatsApp adalah niat handoff, bukan konversi percakapan yang terkonfirmasi.

## Interface event lokal

File: `public/lead-events.js`. API: `window.KARLabsLeadEvents.emit(name, properties)` dan `configure(options)`. Event DOM: `karlabs:lead-event` pada `window`. Tidak ada buffer, persistence, logging otomatis, atau transport jaringan bawaan. Taksonomi, konfigurasi adapter nonaktif secara default, dan instruksi browser terbaru ada pada [ANALYTICS_EVENTS.md](ANALYTICS_EVENTS.md).

| Event | Arti |
| --- | --- |
| `whatsapp_cta_clicked` | Klik CTA WhatsApp langsung, tidak termasuk link handoff form |
| `contact_form_started` | Input/change pertama pada form per pemuatan halaman; prefill konteks tidak dihitung sebagai mulai mengisi |
| `contact_form_handoff_clicked` | Klik eksplisit link handoff form yang valid, baik tab baru maupun tab yang sama |
| `service_selected` | Layanan dipilih melalui form, CTA, katalog, atau konteks URL; `placement` membedakan sumbernya |
| `consultation_cta_clicked` | Klik CTA menuju form; bukan mulai mengisi atau lead terkonfirmasi |
| `catalog_viewed` | Dokumen katalog diinisialisasi sekali per pemuatan; bukan pengunjung unik |
| `demo_interacted` | Interaksi pertama dengan kontrol demo yang didukung, sekali per layanan per pemuatan; bukan demo selesai |

Contoh payload:

```json
{
  "event": "contact_form_handoff_clicked",
  "page": "home",
  "service": "workflow",
  "placement": "contact"
}
```

Payload hanya menerima nama event yang dikenal, halaman `home`/`catalog`, ID layanan allowlist, serta `placement` allowlist (`header`, `hero`, `mobile`, `service`, `pricing`, `catalog`, `contact`, `footer`, `context`, `unknown`). Hanya `demo_interacted` menerima tambahan `action` dari enum yang cocok dengan layanan. Service tidak dikenal dibuang; placement tidak dikenal menjadi `unknown`. Object payload dibekukan.

Nama, kontak, ringkasan, anggaran, target waktu, paket, URL, query, dan message tidak dimasukkan ke event. Link dinamis katalog memakai delegasi event sehingga tetap tercatat setelah panel berubah. Klik yang dibatalkan validasi tidak menghasilkan event handoff. Pengiriman form untuk menyiapkan preview juga tidak dihitung sebagai handoff.

Tidak ada event “conversation completed” atau “confirmed conversion”. Klik berulang adalah niat berulang, bukan jumlah pelanggan unik. Interface ini tidak mengukur hasil percakapan.

Integrasi provider berikutnya harus memakai satu callback adapter melalui `configure({enabled:true, adapter})` setelah provider, konfigurasi, dan izin tracking disepakati. Event DOM tetap untuk observasi/debug; jangan sekaligus meneruskannya ke provider yang sama agar tidak ganda. Tidak ada SDK provider atau koneksi eksternal bawaan. Guard tes tetap melarang penyimpanan dan pemanggilan tracking jaringan dalam dua modul funnel. Menonaktifkan adapter tidak otomatis menghentikan SDK provider yang mungkin ditambahkan kemudian; lihat panduan integrasi.

## Validasi dan gate desain

- `npm.cmd run check`: source guard, tes event privacy/intent, build CSS/statis, dan dist guard.
- `scripts/check-leads.cjs`: tujuh jenis event, allowlist, pembuangan PII dan URL, deduplikasi view/demo, konfigurasi dan isolasi kegagalan adapter, payload immutable, serta klik handoff vs klik yang dibatalkan.
- Uji Chromium: validasi inline dan keyboard, prefill homepage/katalog/URL, preview, encoding, optional fields, new-tab/noopener, fallback same-tab, event intent, keadaan tanpa JavaScript atau event module, dan tidak adanya storage aplikasi.
- Reflow diperiksa pada 360, 390, 768, 1024, dan 1440 px. Dua kolom mengikuti lebar form melalui container query, bukan hanya lebar viewport.
- Perbandingan baseline memastikan harga dan komitmen paket tidak berubah.
- Hasil: 13 kelompok smoke test funnel dan 15 kelompok regresi showroom lulus. Navigasi WhatsApp pada tes dicegat lokal, tanpa mengirim pesan atau data uji.

## Berkas yang berubah

- `index.html`: form, feedback/preview, optional fields, konteks URL CTA, dan styling yang mengikuti lebar form.
- `public/index.js`: logika form dipisahkan; preview dan navigasi homepage dipertahankan.
- `public/consultation.js` (baru): konteks, validasi, preview, dan handoff.
- `public/lead-events.js` (baru): event lokal dengan allowlist dan delegasi klik.
- `catalog.html`, `public/catalog-core.js`, `public/catalog-showroom.js`: event module bersama dan tautan konsultasi dengan layanan terpilih.
- `package.json`, `scripts/check.cjs`, `scripts/check-dist.cjs`, `scripts/check-leads.cjs` (baru): validasi sumber, privacy/intent, dan hasil build.
- `public/tailwind.css`: hasil compile; tidak diedit manual.
- `docs/LEAD_FUNNEL.md`: audit, kontrak event, perilaku privasi, dan laporan validasi.

Arah desain tetap KAR Labs: Oswald/Inter, dasar gelap, tindakan hijau. Dial **ENERGY 1 / RHYTHM 2 / MOTION 1**. Tidak ada aset identitas baru atau animasi tambahan. Disclosure dipakai hanya untuk dua field opsional, preview sebagai teks untuk memudahkan pemeriksaan isi, dan error memakai teks plus fokus agar tidak mengandalkan warna.

| Gate | Hasil dan bukti |
| --- | --- |
| Kejelasan tindakan | PASS: siapkan pesan, tinjau, dan buka WhatsApp dibedakan; tidak ada klaim pesan terkirim |
| Privasi dan kejujuran | PASS: unit test menolak field pribadi/URL pada payload, tidak ada transport/persistence atau event konversi terkonfirmasi |
| Fungsi dan recovery | PASS: form invalid tidak membuka WhatsApp; preview kedaluwarsa dibatalkan; link same-tab dan fallback tanpa event module diuji |
| Keyboard/mobile | PASS: fokus ringkasan error, link field, urutan handoff, lima ukuran viewport, dan reduced motion diuji |
| Kontras | PASS: teks error pada surface gelap 9,94:1; putih pada tombol hijau 4,70:1; fokus mint dan batas input mengikuti pasangan yang sudah diperiksa |
| Scope dan identitas | PASS: arsitektur statis, desain sebelumnya, dan harga dipertahankan; perubahan dibatasi pada funnel dan CTA terkait |

Artefak lokal: `node_modules/.cache/karlabs-leads-review/` berisi hasil tes, screenshot data sintetis, dan diff terhadap baseline tahap ini. Navigasi WhatsApp dalam tes dicegat dan tidak mengirim pesan/data uji ke layanan tersebut.

Belum diuji pada perangkat fisik, Safari/Firefox, atau Node 20. Tidak ada audit WCAG penuh atau pengukuran konversi produksi. Pelacakan percakapan WhatsApp nyata membutuhkan integrasi terpisah yang belum diaktifkan.
