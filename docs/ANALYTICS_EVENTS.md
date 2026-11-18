# KAR Labs — taksonomi dan adapter event

18 November 2026. Berlaku pada kedua entrypoint static: `index.html` dan `catalog.html`. Modul `public/lead-events.js` memperluas fondasi empat event sebelumnya, tanpa mengganti nama event lama atau memasang SDK/provider.

## Hasil audit dan batas pengukuran

Sebelumnya tersedia event WhatsApp langsung, mulai form, handoff form, dan pemilihan layanan. Validasi sudah membatalkan handoff yang tidak valid, preview bukan pengiriman, dan data pribadi tidak masuk payload. Celahnya adalah belum ada view katalog, interaksi demo, CTA menuju form, konfigurasi adapter, atau perlindungan terhadap pemuatan modul ganda.

Kini ada tujuh event. Tanpa konfigurasi, event hanya berupa `CustomEvent` lokal. Tidak ada provider analytics, ID akun, request tracking, cookie aplikasi, antrean event, atau penyimpanan event/form pada storage browser. Tidak ada dashboard, angka pengunjung, angka lead, atau hasil konversi yang dibuat.

Tidak ada event yang membuktikan WhatsApp terbuka, pesan terkirim, percakapan selesai, calon pelanggan memenuhi syarat, transaksi terjadi, atau penjualan berhasil. Untuk hasil bisnis tersebut diperlukan sumber verifikasi lain yang belum diintegrasikan.

## Taksonomi

| Event | Pemicu | Frekuensi / makna |
| --- | --- | --- |
| `catalog_viewed` | Modul event diinisialisasi pada dokumen katalog | Sekali per pemuatan dokumen, termasuk tab background. Bukan pengunjung unik atau bukti pengunjung membaca halaman. Hash, pemilihan layanan, dan inisialisasi modul ulang tidak menambah view. |
| `service_selected` | Pilihan form, picker/link katalog, CTA layanan atau prefill URL yang dikenal | Per aksi/prefill yang ditangani. `context` membedakan prefill otomatis dari input pengguna. Bukan mulai mengisi form. |
| `demo_interacted` | Kontrol demo yang didukung dipakai | Interaksi pertama per layanan per dokumen. Ada `action` enum untuk menjelaskan kontrol pertama; bukan demo selesai. Reset/pindah panel tidak menghapus deduplikasi. |
| `consultation_cta_clicked` | Klik tautan internal menuju `#contact-form`, termasuk CTA layanan/pricing yang ditangani form controller | Per klik intent. Klik biasa yang dicegat untuk scroll/prefill dicatat controller; delegasi tidak mencatatnya lagi. Klik dengan modifier/middle click memakai jalur native dan delegasi. |
| `contact_form_started` | Input/change pertama pada form | Sekali per pemuatan dokumen. Prefill dan menyiapkan preview tanpa perubahan input tidak dihitung. |
| `whatsapp_cta_clicked` | Klik link HTTPS `wa.me/6285777345985` langsung | Per klik, tanpa link handoff form. Link dinamis ikut tercakup. Klik kiri/keyboard/modifier dan middle click didukung. |
| `contact_form_handoff_clicked` | Klik link handoff form yang lolos validasi/kecocokan preview | Per klik. Tidak menghasilkan event WhatsApp langsung tambahan. Menekan “Siapkan Pesan WhatsApp” tidak memicu event ini. |

Klik yang sudah dibatalkan sebelum listener link berjalan, tombol mouse kanan, maupun tujuan lain tidak menghasilkan intent tautan. Interaksi demo dicatat pada capture phase sebelum handler yang dapat mengganti DOM/menghentikan bubbling; artinya niat menggunakan kontrol, bukan keberhasilan proses. Tombol disabled dan kontrol di panel tidak aktif diabaikan. Listener Enter chatbot menghormati auto-repeat.

Kunjungan ulang/reload membuat hitungan dokumen baru. Tidak ada identitas pengguna/session atau deduplikasi lintas halaman/perangkat. Dua jenis event berbeda dari satu tindakan dapat sah, misalnya input pertama pada pilihan layanan menghasilkan `contact_form_started` dan `service_selected`; itu dua tahap berbeda, bukan dua lead.

## Kontrak payload

```json
{
  "event": "demo_interacted",
  "page": "catalog",
  "service": "workflow",
  "placement": "catalog",
  "action": "workflow_guide"
}
```

| Field | Nilai yang diterima |
| --- | --- |
| `event` | Tujuh nama pada tabel taksonomi; nama lain ditolak |
| `page` | Ditentukan modul: `home` atau `catalog`, tidak diambil dari caller/query |
| `service` | Opsional: `product-catalog`, `workflow`, `landing`, `chatbot`, `calculator`, `dashboard`, `pos`, `scraping`, `help`, `other`. Nilai lain dibuang. |
| `placement` | `header`, `hero`, `mobile`, `service`, `pricing`, `catalog`, `contact`, `footer`, `context`, `unknown`. Nilai lain menjadi `unknown`. |
| `action` | Hanya `demo_interacted`, harus cocok dengan layanan di tabel berikut. Tidak diterima pada event lain. |

| Layanan | Kontrol yang dipantau / `action` |
| --- | --- |
| Katalog produk | Detail produk → `product_detail`; input pencarian/perubahan kategori → `product_filter` |
| Automation | Mulai/langkah panduan → `workflow_guide`; perubahan picker skenario → `workflow_preset` |
| Landing page | Tombol preview besar → `landing_preview` |
| Chatbot | Tombol kirim, quick reply, atau Enter → `chat_send`; klik kirim kosong tetap intent, bukan percakapan |
| Calculator | Change input/select → `calculator_input`; tombol hitung → `calculator_calculate` |
| Dashboard | Pilih tema/mode atau tombol tambah transaksi → `dashboard_control` |
| POS | Tombol tambah produk → `pos_product` |
| Scraping | Tombol mulai simulasi → `scraping_start` |

Penghitungan pertama berarti jika pencarian produk sudah memicu event, membuka detail sesudahnya tidak menghasilkan event kedua untuk layanan tersebut. Kontrol lain seperti scroll, hover, pembukaan panduan, reset dan inspeksi node workflow tidak dilacak. Tidak semua klik UI merupakan event bisnis.

Tidak pernah diteruskan: nama/kontak, jenis usaha, deskripsi, budget/timeline, paket, isi chat, istilah pencarian, nilai kalkulator, nama/ID produk, teks tombol, pesan WhatsApp, `href`, query/hash, referrer, title, ID pengguna, atau field tambahan lain. Hanya enum di atas yang keluar dari sanitizer. Payload dan object API dibekukan.

## Adapter provider yang nonaktif secara default

API lama tetap tersedia:

```js
window.KARLabsLeadEvents.emit(name, properties);
```

`emit()` mengembalikan `true` jika event lokal diterbitkan; `false` jika ditolak/dideduplikasi. Nilai `true` bukan bukti provider menerima data atau konversi terjadi. Caller tetap opsional pada form sehingga pemblokiran modul event tidak mematikan konsultasi.

Konfigurasi saat runtime:

```js
window.KARLabsLeadEvents.configure({ enabled: false });
```

Konfigurasi awal opsional, ditetapkan oleh file konfigurasi yang disetujui **sebelum** `lead-events.js` berjalan:

```js
window.KARLabsAnalyticsConfig = Object.freeze({
  enabled: false,
  adapter: null
});
```

Tidak ada file provider/config eksternal seperti itu yang dipasang saat ini. `configure({ enabled: true, adapter: fn })` meneruskan payload aman ke satu callback. Konfigurasi invalid mematikan adapter; request enable tanpa fungsi mengembalikan `false`. Flag harus boolean `true`. Pemanggilan ulang mengganti callback, bukan menambah subscription.

Callback melempar error atau menolak Promise tidak boleh membatalkan form/navigasi. Tidak ada retry, fallback provider, antrean, atau replay. Jika provider baru siap setelah view/klik terjadi, event sebelumnya hilang secara sengaja. Jika view awal perlu diukur setelah tracking diizinkan, siapkan konfigurasi/callback sebelum modul berjalan; jangan mengarang ulang view untuk pengunjung yang belum mengizinkan tracking.

Penerusan ke provider memakai `configure()`. Jangan sekaligus menambahkan listener `karlabs:lead-event` yang mengirim ke provider yang sama, GTM trigger ganda, atau hook di setiap demo. Event DOM tetap tersedia untuk debug/observasi lokal. Adapter adalah kode tepercaya: sanitizer hanya melindungi argumen yang diberikan, tidak dapat mencegah SDK/kode adapter lain membaca DOM sendiri.

## Integrasi GA4 berikutnya — belum diaktifkan

Integrasi memerlukan persetujuan pemilik, konfigurasi provider/data stream, dan keputusan privasi/consent. `enabled: true` pada API bukan bukti persetujuan. Gunakan file konfigurasi deployment yang terpisah, default `enabled: false`, `measurementId: ''`, serta ID public property yang benar ketika disetujui. Jangan menanam ID dalam HTML, modul demo, atau helper event. Tidak membutuhkan API secret di browser.

Sesudah integrasi disetujui:

1. Muat SDK hanya melalui jalur izin yang disepakati. Untuk menahan semua koneksi sebelum izin, Google mendokumentasikan basic consent mode yang menahan pemuatan tag; jangan menganggap mode denied pada SDK yang sudah dimuat berarti tidak ada traffic. [Dokumentasi consent Google](https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic).
2. Nonaktifkan pengukuran otomatis halaman/history, outbound clicks, form interactions, site search, dan pengumpulan data pengguna yang dapat menduplikasi event atau menangkap URL WhatsApp. Google menyebutkan history measurement dapat tetap mengirim `page_view` meski `send_page_view:false`; periksa pengaturan Enhanced Measurement pada data stream. [Dokumentasi page views](https://developers.google.com/analytics/devguides/collection/ga4/views).
3. Tetapkan page context bersih saat konfigurasi dan pengiriman, tanpa query/hash/referrer atau nilai DOM. Jangan hanya mengandalkan redaction email. URL/title dan input dapat membawa PII. [Panduan PII Google](https://support.google.com/analytics/answer/6366371?hl=en).
4. Gunakan callback di bawah sebagai pola adapter setelah `gtag` yang disetujui tersedia. Tidak ada loader, ID aktif, atau pemanggilan `gtag` dalam runtime proyek saat ini.

Contoh untuk file integrasi **masa depan**, bukan kode yang diaktifkan dalam build sekarang:

```js
const config = Object.freeze({
  enabled: false,
  measurementId: '',
  siteOrigin: 'https://karlabs-dev.netlify.app',
  debug: false
});

function connectApprovedGa4(analyticsAllowed) {
  const api = window.KARLabsLeadEvents;
  if (!api) return;
  if (!config.enabled || analyticsAllowed !== true ||
      !/^G-[A-Z0-9]+$/.test(config.measurementId) ||
      typeof window.gtag !== 'function') {
    api.configure({ enabled: false });
    return;
  }

  const safeContext = page => ({
    page_location: new URL(page === 'catalog' ? '/catalog.html' : '/', config.siteOrigin).href,
    page_referrer: '',
    page_title: page === 'catalog' ? 'Demo KAR Labs' : 'KAR Labs'
  });
  const page = /\/catalog(?:\.html)?\/?$/.test(location.pathname) ? 'catalog' : 'home';
  window.gtag('config', config.measurementId, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    ...safeContext(page)
  });
  api.configure({
    enabled: true,
    adapter({ event, ...parameters }) {
      window.gtag('event', event, {
        ...parameters,
        ...safeContext(parameters.page),
        send_to: config.measurementId,
        debug_mode: config.debug
      });
    }
  });
}
```

Fungsi ini sengaja tidak memuat SDK, mengatur CMP, menyimpan pilihan consent, atau mengaktifkan provider. Bila izin dicabut, matikan adapter **dan** hentikan collection/tag di integrasi provider sesuai mekanismenya; menonaktifkan callback saja tidak menghentikan SDK yang sudah berjalan. SDK dapat memiliki metadata/session/cookie di luar payload custom; verifikasi juga itu sebelum mengaktifkan tracking.

Nama event dapat dipertahankan di GA4. Jangan otomatis memetakan handoff ke `generate_lead`, menandai percakapan completed, atau menjumlahkan tujuh event sebagai jumlah lead. Jika memilih platform lain, gunakan callback yang sama dan provider API yang disetujui; pengaturan auto-capture harus ditinjau ulang untuk platform tersebut.

## Verifikasi browser

Jalankan `npm run check`, lalu `npm run preview`. Pada Windows PowerShell sesi ini digunakan `npm.cmd`. Preview production: `http://localhost:4173/`.

Untuk observasi interaksi sesudah halaman selesai dimuat, tempel di console DevTools:

```js
window.addEventListener('karlabs:lead-event', ({ detail }) => console.log(detail));
```

View awal sudah terjadi sebelum snippet console ini dipasang. Untuk mengujinya, pasang listener pada document-start melalui Playwright `context.add_init_script()` atau pause sebelum modul event di DevTools. Jangan memanggil `emit()` untuk mengarang ulang view sebenarnya.

Adapter uji lokal, **tanpa provider/network**:

```js
window.KARLabsLeadEvents.configure({
  enabled: true,
  adapter: detail => console.log('LOCAL TEST', detail)
});
// Selesai debug:
window.KARLabsLeadEvents.configure({ enabled: false });
```

Gunakan data sintetis, lalu periksa:

1. Klik CTA layanan/pricing: satu `consultation_cta_clicked`, layanan/paket pada form benar, belum ada `contact_form_started`. Prefill dapat memicu `service_selected` dengan sumber yang sesuai.
2. Input/change pertama: satu form-start. Mengetik lagi tidak menambah form-start. Klik submit invalid dan pembuatan preview valid tidak menghasilkan handoff.
3. Klik link handoff valid: satu handoff, tanpa event WhatsApp langsung tambahan. Feedback tetap menyatakan pesan belum dikirim. Batalkan/invalidasi preview dan pastikan link kedaluwarsa tidak dihitung.
4. CTA WhatsApp langsung: satu direct-click. Gunakan keyboard dan mobile 390 px juga. Jangan mengirim pesan nyata untuk tes analytics.
5. Buka katalog: satu view. Berpindah hash/picker tidak menambah view. Coba detail/filter produk, workflow, landing, chatbot, calculator, dashboard, POS dan scraping; setiap layanan menghasilkan maksimal satu demo-interaction per pemuatan, walau direset atau dicoba lagi.
6. Muat file event dua kali: tidak ada view/listener ganda. Pasang adapter uji, ganti/matikan, atau buat callback melempar error/reject Promise; form dan navigasi tetap berfungsi. Tidak ada replay event lama.
7. Isi nama/email/deskripsi/search/chat dengan penanda sintetis unik. Periksa payload hanya punya `event`, `page`, `service`, `placement`, dan `action` khusus demo. Query/hash/referrer tidak ikut masuk. Storage aplikasi tetap kosong dan Network tidak memuat provider analytics.
8. Untuk integrasi GA4 masa depan, verifikasi request `collect` dan DebugView pada property uji: tidak ada URL/message/PII, tidak ada auto-event ganda, konfigurasi denied/disabled tidak memuat tag, dan tidak ada key event yang mengklaim percakapan selesai. Integrasi nyata itu belum diuji atau disetujui pada tahap ini.

## Hasil tahap ini dan file

- `npm.cmd run check`: lulus source, taksonomi/privacy/adapter checks, build dan dist quality checks.
- Browser Chromium: 10 kelompok lulus; termasuk semua delapan demo, deduplikasi, keyboard/mobile, form/handoff, konfigurasi saat boot, isolasi error adapter, host request yang sudah ada, dan tidak adanya storage/PII event. WhatsApp dicegat lokal. Tidak ada error JavaScript yang tidak ditangani.
- Pengujian Node memeriksa enum, field privat yang dibuang, payload immutable, konfigurasi invalid/off, tanpa replay, adapter sync/async error, view/demo dedupe, modul ganda, klik dibatalkan dan middle click.
- Regresi funnel dan diff akhir dicatat dalam artefak lokal `node_modules/.cache/karlabs-events-review/`. Skrip browser dan hasil JSON di sana hanya untuk pengujian, bukan runtime production.
- Hasil akhir: sembilan kelompok browser event, dua tes Ctrl/middle-click dengan tab background native, dan 13 kelompok regresi funnel lulus. Tidak ditemukan error JavaScript; request browser terbatas pada localhost, CDN/font yang sudah dipakai, serta WhatsApp yang diintersep lokal. Tidak ada request ke provider analytics.

File production: `public/lead-events.js`, `public/consultation.js`, serta versi cache kedua HTML. Guard: `scripts/check-leads.cjs`. Dokumentasi: dokumen ini, `docs/LEAD_FUNNEL.md`, dan `README.md`. Tidak mengubah harga, layanan, layout, canonical/domain, header, dependency, atau legacy `src/`. Tailwind hanya dibangun ulang dan hasilnya identik dengan baseline tahap ini.

Tidak ada commit/push/deploy. Provider asli, penerimaan data di GA4/DebugView, consent manager, browser lain, perangkat fisik, serta konversi produksi belum diuji.
