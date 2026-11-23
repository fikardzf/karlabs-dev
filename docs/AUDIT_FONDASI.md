# Audit fondasi showroom

23 November 2026 · Pemeriksaan sumber produksi, distribusi, dan checkout sebelum perubahan visual.

## Artefak yang benar-benar tayang

Checkout awal bersih pada `feat/interactive-portfolio-gallery`, commit `a168e3b5a6617c84d929591d927fdfe1d8d17f98`. `git ls-remote` menunjukkan SHA yang persis sama pada branch fitur publik dan `44cb3ab6b28333461a6088d9d6f7e39ced5a266b` pada GitHub main. Referensi lokal `origin/main` masih di `952adbd`. Delapan berkas pada SHA main yang diambil dari GitHub sama dengan commit fitur setelah normalisasi CRLF, meliputi beranda, katalog, manifest dan lock npm, registry proyek, JS galeri, generator portfolio, serta konfigurasi Netlify. [Commit main yang diperiksa](https://github.com/fikardzf/karlabs-dev/commit/44cb3ab6b28333461a6088d9d6f7e39ced5a266b).

`karlabs.zip` menyimpan generasi v2.9 yang sudah mencakup `scripts/build-tailwind.cjs`, vendor Tailwind 4.1.10, dan salinan dist. SHA-256 beranda ZIP diawali `3343f24f9eff`. ZIP mendahului registry serta generator canvas. Checkout menyertakan kompilasi lokal itu sekaligus delapan demo dan galeri yang lebih baru.

| Endpoint publik | HTTP | Awalan SHA-256 publik dan pembandingan baseline |
| --- | --- | --- |
| `/` | 200 | `61002b51fd948f1d`, lokal `55d0a9da3cc770e0` |
| `/catalog.html` | 200 | `fec20ea2c85ea892`, lokal `891d548874eaaad1` |
| `/portfolio/` | 200 | `5e8a0524edb5b490`, cocok |
| `/portfolio/product-catalog/` | 200 | `c0ce5aa99e5bf59c`, cocok |
| `/public/portfolio-gallery.js?v=6` | 200 | `ae874d46c7d1038a`, cocok |
| `/public/portfolio.css?v=6` | 200 | `5409193d84189fe1`, cocok |
| `/public/gallery-scene.mjs?v=1` | 200 | `0c371a4e46286bff`, cocok |
| `/public/motion-vendor/gsap.min.js?v=3.15.1` | 200 | `3d1bea374ab1b703`, cocok |

Pemeriksaan menggunakan GET publik dan normalisasi akhir baris sebelum hashing. Untuk dua HTML dengan hash berbeda, parser membandingkan teks, urutan tag pembuka, nama/nilai atribut dan tujuan tautan setelah menormalkan `index.html#...` atau `index.html?...` ke bentuk `/#...` atau `/?...`. Seluruh 486 tag beranda dan 1.025 tag katalog serta teks keduanya cocok. Tujuh canvas lain mengembalikan 200. `/home` mengembalikan 301 ke `/index.html` dan satu slug uji yang tidak terdaftar menghasilkan 404. [Beranda produksi](https://karlabs-dev.netlify.app/) · [Indeks publik](https://karlabs-dev.netlify.app/portfolio/).

`netlify.toml` menetapkan Node 20, `npm run build`, dan publikasi `dist/`. HTML yang diuji memakai `public,max-age=0,must-revalidate`. Aset `/public/*` memakai `public,max-age=86400,stale-while-revalidate=604800`. URL versi memisahkan aset lama dan baru di cache. Tidak ditemukan registrasi service worker pada sumber aktif. Dashboard dan log Netlify tidak diakses, sehingga branch produksi terpilih, SHA deploy internal, pengaturan lingkungan efektif selain header yang tampak, dan status build terakhir di dashboard belum terverifikasi. Kesamaan isi pada dua branch membuat SHA asal deploy tidak dapat ditentukan dari HTTP. Bukti publik langsung mendukung bahwa **CSS dan runtime galeri iterasi sebelumnya memang tayang**.

## Klasifikasi root

Baseline berisi 369 jalur terlacak. Pemeriksaan memakai manifest Git, isi berkas aktif, referensi lintas berkas, dan aturan ignore. Isi rahasia, database, histori internal Git dan isi cache tidak dicetak.

| Kelas | Berkas dan status | Alasan |
| --- | --- | --- |
| A · Produksi | `index.html`, `catalog.html`, `public/`, `config/packages.json`, `config/portfolio.cjs`, `templates/project.html`, `styles/tailwind-theme.css`, `robots.txt`, `sitemap.xml`, terlacak | Entry HTML dan katalog hash lama disalin oleh build. Generator merender indeks dan delapan direktori slug nyata. Panel dan modal diambil dari katalog. Modul tiap demo dimuat melalui nama dari registry. Aset WebP, CSS, ikon, utilitas DOM, kontrol lead dan modul kalkulasi berada di public. |
| B · Pengembangan | `scripts/`, `docs/`, `README.md`, `assets/brand/`, `styles/social-preview.svg`, `vendor/tailwindcss/`, terlacak | Build konten, compiler dengan lisensi, penyalinan statis, server pratinjau, pemeriksaan kualitas, dua uji Playwright dan materi desain asli. Sebagian berkas di sini juga diperlukan saat build produksi. |
| C · Konfigurasi | `package.json`, `package-lock.json` v3, `tailwind.config.js`, `netlify.toml`, `.gitignore`, `AGENTS.md`, `skills-lock.json`, terlacak | Menetapkan dependensi, skrip dan target hosting. Manifest Tailwind menentukan input untuk compiler lokal. `.git/` menyimpan metadata kontrol versi. |
| D · Instruksi lokal | `.agents/` berisi 214 jalur terlacak termasuk 26 SKILL.md pada baseline. Direktori `.agnets/skills/` tidak ditemukan | Instruksi dipakai dalam sesi pengembangan dan berada di luar pohon dist. Kecocokan nama dengan lockfile tidak otomatis membuktikan pemakaian skill. |
| E · Kandidat arsip | `karlabs.zip`, `BUDS_MOTOR_CATALOG_HIGHLIGHT_UPDATE.md`, `PRODUCT_CATALOG_COPY_SIMPLIFIED.md`, `PRODUCT_CATALOG_LAYOUT_COMPACT.md`, `PRODUCT_CATALOG_SERVICE_UPDATE.md`, `PRODUCTION_NETLIFY_CHECKLIST.md`, terlacak | ZIP berfungsi sebagai bukti rekonsiliasi. Catatan produk menjelaskan riwayat keputusan, checklist masih berguna saat rilis. Build mengecualikan semuanya. |
| F · Representasi ganda | Resolusi WebP, logo sumber/derivatif, PNG dan WebP BUDS, favicon yang disalin juga ke root dist | Memiliki kegunaan berbeda untuk pemilihan resolusi, kompatibilitas, atau pengolahan ulang. Hash konten pada sumber tersisa di public, assets dan styles tidak menghasilkan pasangan byte-identik. |
| G · Hasil generate | `public/tailwind.css`, `public/packages.js` dan blok generator di HTML terlacak. `dist/`, `portfolio/`, `public/motion-vendor/`, `node_modules/` termasuk `.cache/` diabaikan | Dihasilkan oleh build atau instalasi. Pengujian memakai hasil dist. Jangan mengubah dist sebagai sumber. |
| H · Sisa implementasi | Tujuh berkas `src/` termasuk `App.tsx`, `siteConfig.ts`, `components/PixelBlast.*`, serta `vite.config.ts`, `eslint.config.js`, `postcss.config.js` dan tiga `tsconfig*.json`, terlacak | Entry React me-render satu placeholder. Konfigurasi lint hanya menarget TypeScript/TSX lama. Skrip npm aktif memakai Node CommonJS tanpa tahap Vite, PostCSS atau mount React. Instruksi proyek menetapkan source lama sebagai referensi. |
| I · Sementara | `debug.log` lokal diabaikan. `public_placeholder` terlacak dan kosong | Log pengguna tetap lokal. Placeholder kosong dihapus setelah pemeriksaan referensi. |
| J · Perlindungan | Nama jalur terlacak diperiksa untuk `.env`, kunci privat, dan basis data umum. `src/vite-env.d.ts` merupakan deklarasi tipe | Ignore lingkungan sekarang mencakup `.env.*` dan mengizinkan `.env.example`. Tidak ada data sensitif yang dibuka atau dihapus dalam pemeriksaan ini. |

## Matriks dependensi

Kolom versi mencatat pohon sebelum/sesudah implementasi. Distribusi npm yang diperiksa menggunakan endpoint resmi `/latest` pada tanggal audit. Versi latest memberi konteks pemeliharaan. Kebutuhan upgrade tetap bergantung pada kompatibilitas dan pengujian. [Registry npm](https://registry.npmjs.org/gsap/latest) · [Dokumentasi distribusi GSAP](https://gsap.com/docs/v3/Installation/).

| Paket dan versi terkunci | Pemakaian dan kompatibilitas | Masalah, bukti, keputusan |
| --- | --- | --- |
| gsap 3.15.1 dan ScrollTrigger dalam distribusi sama | Modul galeri memuat dua classic script lokal, lalu mendaftarkan plugin. JS browser biasa didukung. | **KEEP**. Build menyalin 73.357 dan 44.683 byte sebelum kompresi. Baseline membatasi permintaan ini pada desktop yang memenuhi media query. Versi sesuai latest. |
| @gsap/react 2.1.2 | Hook untuk React. Terpasang langsung, peer GSAP dan React terselesaikan. Tidak diimpor oleh entry aktif. | **KEEP** sebagai toolkit pilihan pemilik pada commit terakhir. Tidak dikirim oleh penyalin aset statis. Versi sesuai latest. |
| motion 14.14.0, framer-motion 14.14.0 | Motion memasang framer-motion secara transitif. Tidak ada import runtime di produksi. | **KEEP** pada instalasi pengembangan yang dipertahankan. Keduanya sesuai latest. Dua nama ini merupakan relasi paket, bukan dua penggerak gesture yang berjalan. |
| motion-dom 14.14.0, motion-utils 14.7.0, tslib 2.9.1 | Transitif dari Motion. `npm ls` menunjukkan deduplikasi motion-utils dan tslib. | **KEEP** melalui lockfile. Tidak masuk distribusi situs. |
| lenis 1.3.27 | Terpasang langsung, versi sesuai latest. Tidak ada inisialisasi Lenis atau listener scroll Lenis di entry produksi. | **KEEP** sebagai toolkit. Galeri dan paket menggunakan input pointer/scroll asli. Peer Vue dan Nuxt opsional sesuai metadata npm. |
| react 19.3.1 | Peer terpasang sekali dan deduplikasi oleh npm. Entry lama mengimpor React dan react-dom/client. | **KEEP** sebagai peer terkunci. Sesuai latest. React DOM tidak terpasang. Menjalankan purwarupa lama secara terpisah memerlukan dependensi tambahan. |
| @studio-freight/lenis, three, @react-three/fiber, @react-three/drei | Tidak terpasang dan tidak memiliki import aktif. PixelBlast adalah elemen placeholder. | **KEEP** arsitektur CSS perspektif dan transform. Tidak ada dependensi WebGL yang diperlukan oleh source aktif. |
| tailwindcss 4.1.10 vendored | `build-tailwind.cjs` membaca compiler, preflight, theme, dan manifest lokal. | **INVESTIGATE** pembaruan terpisah. Latest 4.3.5. Perubahan compiler dapat mengubah CSS keluaran. Pertahankan alur lokal yang terkunci. |
| chart.js 4.5.1 dari CDN | Modul core memuat Chart UMD pada route yang membutuhkannya, memeriksa kegagalan dan reduced motion. | **INVESTIGATE** upgrade terpisah ke 4.6.1. Versi, SRI dan fixture uji harus cocok. |
| lucide 1.47.0 dari CDN | Classic script deferred dan SRI di HTML. Ikon dipakai di katalog/form. | **INVESTIGATE** upgrade terpisah. Latest 1.77.0. `check.cjs` dan fixture memverifikasi pin yang dipakai. |
| Vite, React DOM, plugin React Vite, ESLint/TS lint, PostCSS/autoprefixer | Direferensikan oleh scaffold historis. Tidak menjadi bagian manifest build statis. | **KEEP** alur produksi. Tidak ada skrip lint npm. Meterai lulus `npm run check` menilai suite statis dan build proyek. |

Tidak ada kebutuhan paket produksi baru yang ditemukan. Pencarian referensi mencakup skrip tag, `require`, module URL yang dibentuk generator, import dinamis scene, CDN, dan build copy. Paket eksperimen yang sudah dipasang pemilik dipertahankan karena tidak menambah transfer browser. Tidak ditemukan dua versi fisik GSAP atau dua controller scroll yang berebut properti.

## Pembersihan dan perbaikan petunjuk

- Dihapus `public/hyperspeed-background.js`, `public/hyperspeed-background.css`, `public/hyperspeed-lite-background.js`, `public/hyperspeed-lite-background.css`, `public/electric-border-pricing.js`, dan `public/electric-border-pricing.css`. Keenam berkas terlacak mewakili 37.596 byte isi Git dengan LF. Skrip dan stylesheet lama hanya ada di distribusi karena penyalinan seluruh public. Pencarian pada kedua entry, generator, registry, tes, deklarasi aset dinamis, skill, dan konfigurasi deploy tidak menemukan pengguna. Dua aturan gaya yatim di `public/home.css` ikut dilepas. Pengurangan ukuran ini berlaku pada jumlah berkas yang dikirim ke hosting. Browser sebelumnya juga tidak memintanya melalui entry aktif.
- Dihapus `public_placeholder` (0 byte). Sumber dapat dipulihkan dari Git. Tidak ada referensi atau data pengguna.
- Dipertahankan `public/catalog-tailwind-config.js` karena didokumentasikan untuk kompatibilitas patch historis, dan build/check secara eksplisit memastikan berkas ini tidak ikut distribusi.
- `DEVELOPMENT_GUIDE.md` sebelumnya mengarahkan editor ke `src/App.tsx` dan Vite. `CUSTOMIZATION_GUIDE.md` menyarankan edit harga langsung di HTML serta warna pada Tailwind CDN. `NPM_ERROR_FIX_GUIDE.md` menyatakan tidak ada paket npm. Ketiganya sekarang merujuk ke sumber statis dan alur instalasi yang benar. Komentar PixelBlast yang mengklaim Three.js terpasang juga diperbaiki. Petunjuk lama dapat membuat edit berikutnya tidak terlihat atau tertimpa generator. Riwayat commit saja tidak membuktikan kesalahan itu terjadi pada iterasi sebelumnya.

Pemeriksaan akhir UI dan pengujian build atas perubahan terintegrasi dilaporkan bersama bukti sebelum/sesudah pada laporan audit pengalaman.
