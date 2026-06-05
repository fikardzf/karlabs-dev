# Customization Guide

Gunakan file ini sebagai panduan singkat untuk mengubah tampilan dan informasi website tanpa merusak animasi template asli.

## 1. Basic Information

Buka `index.html`, lalu cari bagian berikut.

### Website title

Cari:

```html
<title>KAR Labs.dev - Jasa Website, Chatbot, Dashboard & Automasi Bisnis</title>
```

Ganti dengan judul brand kamu.

### Meta description

Cari:

```html
<meta name="description" content="...">
```

Ganti dengan deskripsi singkat bisnis kamu.

### Open Graph

Cari:

```html
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:url" content="...">
```

Ini memengaruhi preview saat link dibagikan ke WhatsApp, Facebook, atau LinkedIn.

## 2. Warna utama

Cari konfigurasi Tailwind CDN di bagian atas `index.html`:

```js
accent: {
  DEFAULT: '#22C55E',
  hover: '#16A34A',
}
```

Ganti value hex-nya jika ingin mengubah warna utama. Jangan hapus class seperti `gradient-text`, `fade-in-up`, `float`, `glow`, atau `accordion-content`, karena class tersebut menjaga animasi template.

## 3. Hero Section

Cari:

```html
<section id="hero"
```

Area ini mengatur headline, subheadline, CTA, statistik, dan mockup code editor di kanan.

## 4. Services / Layanan

Cari:

```html
<section id="layanan"
```

Ubah nama layanan, deskripsi, dan harga awal di card layanan.

## 5. Pricing / Harga

Cari:

```html
<section id="harga"
```

Ubah paket harga dan benefit. Pertahankan class `pricing-highlight` jika ingin tetap ada paket yang terlihat paling menonjol.

## 6. FAQ

Cari:

```html
<section id="faq"
```

Ubah pertanyaan dan jawaban. Jangan hapus class `faq-trigger`, `accordion-content`, dan `accordion-icon`, karena dipakai oleh JavaScript accordion.

## 7. Contact Form

Cari:

```html
<form id="contact-form"
```

Field form akan diarahkan ke WhatsApp lewat script di bawah file. Ganti nomor WhatsApp pada variable:

```js
const waNumber = '6285777345985';
```

## 8. Jangan ubah bagian ini jika tidak perlu

Agar animasi tetap hidup, hindari menghapus:

```css
.gradient-text
.fade-in-up
.float
.glow
.glow-hover
.code-editor
.code-line
.cursor-blink
.timeline-connector
.accordion-content
.mobile-menu
.nav-link
```

Dan hindari menghapus JavaScript di bawah file yang mengatur:

- `lucide.createIcons()`
- navbar scroll effect
- smooth scroll
- mobile menu
- intersection observer
- active nav link
- FAQ accordion
- contact form
