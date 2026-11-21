// @ts-check
/** @typedef {'website'|'tools'|'automation'|'dashboard'} Category */
/** @typedef {{slug:string, title:string, category:Category, description:string, inquiryLabel:string, artworkAlt:string, capabilities:[string,string,string], module:string, init:string, modal?:string, charts?:boolean}} Project */

/** @type {Record<Category,string>} */
const categories = { website: 'Website', tools: 'Alat bisnis', automation: 'Automasi', dashboard: 'Dashboard' };

/** @type {readonly Project[]} */
const projects = [
  {
    slug: 'product-catalog', inquiryLabel: 'Diskusikan katalog saya', title: 'Website Katalog Produk', artworkAlt: 'Menu contoh dengan secangkir Americano seharga Rp28.000', category: 'website',
    description: 'Pilih menu, lihat harga, lalu susun contoh pesan untuk penjual.',
    capabilities: ['Pencarian menu', 'Filter kategori', 'Varian dan pratinjau pesan'],
    module: 'product', init: 'initProductCatalog', modal: 'product'
  },
  {
    slug: 'workflow', inquiryLabel: 'Konsultasikan alur usaha', title: 'Business Automation', artworkAlt: 'Sampul alur kerja pesanan usaha', category: 'automation',
    description: 'Ikuti perjalanan satu pesanan, dari data masuk sampai tindak lanjut admin.',
    capabilities: ['Pilihan skenario usaha', 'Simulasi langkah demi langkah', 'Pemeriksaan data yang belum lengkap'],
    module: 'workflow', init: 'initWorkflow'
  },
  {
    slug: 'pos', inquiryLabel: 'Diskusikan sistem kasir', title: 'Point of Sales', artworkAlt: 'Detail struk kasir dari transaksi simulasi', category: 'tools',
    description: 'Jalankan transaksi kasir dari pilihan menu sampai struk pembayaran contoh.',
    capabilities: ['Keranjang dan jumlah pesanan', 'Diskon dan metode pembayaran', 'Struk simulasi'],
    module: 'pos', init: 'initPosDemo', modal: 'pos'
  },
  {
    slug: 'landing', inquiryLabel: 'Diskusikan desain website', title: 'Landing Page', artworkAlt: 'Pratinjau landing page Warteg Ami', category: 'website',
    description: 'Bandingkan cara usaha kuliner, toko, dan jasa memperkenalkan penawaran mereka.',
    capabilities: ['Filter jenis usaha', 'Pilihan tata letak', 'Pratinjau halaman penuh'],
    module: 'landing', init: 'initLanding', modal: 'landing'
  },
  {
    slug: 'dashboard', inquiryLabel: 'Diskusikan laporan usaha', title: 'Dashboard Usaha', artworkAlt: 'Visualisasi data dashboard contoh', category: 'dashboard',
    description: 'Baca arus kas dan penjualan, lalu lihat dampak transaksi contoh pada ringkasan usaha.',
    capabilities: ['Grafik dan indikator', 'Input transaksi contoh', 'Ekspor tabel CSV'],
    module: 'dashboard', init: 'initDashboard', modal: 'dashboard', charts: true
  },
  {
    slug: 'chatbot', inquiryLabel: 'Diskusikan balasan pelanggan', title: 'Chatbot WhatsApp', artworkAlt: 'Percakapan contoh dengan balasan otomatis', category: 'automation',
    description: 'Coba percakapan pelanggan dan susun jawaban untuk pertanyaan yang sering muncul.',
    capabilities: ['Skenario percakapan', 'Balasan cepat', 'Aturan kata kunci'],
    module: 'chatbot', init: 'initChat'
  },
  {
    slug: 'calculator', inquiryLabel: 'Diskusikan kalkulator usaha', title: 'Kalkulator Bisnis', artworkAlt: 'Ilustrasi perhitungan biaya usaha', category: 'tools',
    description: 'Ubah biaya dan harga jual untuk melihat berapa unit yang perlu terjual agar impas.',
    capabilities: ['Simulasi titik impas', 'Estimasi biaya iklan', 'Perhitungan persediaan'],
    module: 'calculators', init: 'initCalculators', charts: true
  },
  {
    slug: 'scraping', inquiryLabel: 'Diskusikan kebutuhan data', title: 'Web Scraping', artworkAlt: 'Data produk contoh disusun sebagai tabel', category: 'automation',
    description: 'Ikuti simulasi pengambilan data produk hingga hasilnya siap dibaca di spreadsheet.',
    capabilities: ['Dataset simulasi lokal', 'Pencarian dan pengurutan', 'Unduhan CSV'],
    module: 'scraping', init: 'initScraping'
  }
];

module.exports = { categories, projects };

