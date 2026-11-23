// @ts-check
/** @typedef {'website'|'tools'|'automation'|'dashboard'} Category */
/** @typedef {{slug:string, title:string, category:Category, description:string, inquiryLabel:string, artworkAlt:string, artworkVersion?:string, capabilities:[string,string,string], module:string, init:string, modal?:string, charts?:boolean}} Project */

/** @type {Record<Category,string>} */
const categories = { website: 'Website', tools: 'Alat bisnis', automation: 'Automasi', dashboard: 'Dashboard' };

/** @type {readonly Project[]} */
const projects = [
  {
    slug: 'product-catalog', inquiryLabel: 'Diskusikan katalog saya', title: 'Website Katalog Produk', artworkVersion: 'editorial-1', artworkAlt: 'Kemeja Garis biru kobalt dengan harga, pilihan ukuran, dan Jeans Straight dari koleksi pakaian', category: 'website',
    description: 'Jelajahi baju dan celana, pilih ukuran, lalu susun pesanan di tas belanja.',
    capabilities: ['Pencarian dan filter pakaian', 'Pilihan ukuran', 'Tas belanja dan draf pesanan'],
    module: 'product', init: 'initProductCatalog', modal: 'product'
  },
  {
    slug: 'workflow', inquiryLabel: 'Konsultasikan alur usaha', title: 'Business Automation', artworkAlt: 'Alur pesanan dari pemeriksaan data hingga pembuatan nota croissant', category: 'automation',
    description: 'Coba tujuh pekerjaan admin, dari mencatat pesanan sampai memeriksa stok. Ubah data contoh dan lihat tugas yang sampai ke tim.',
    capabilities: ['Pilih kasus usaha', 'Uji aturan dan perbaiki data', 'Tinjau hasil sebagai admin'],
    module: 'workflow', init: 'initWorkflow'
  },
  {
    slug: 'pos', inquiryLabel: 'Diskusikan sistem kasir', title: 'Point of Sales', artworkVersion: 'editorial-1', artworkAlt: 'Menu Cafe Latte dan Butter Croissant di samping struk kasir dengan total Rp74.370', category: 'tools',
    description: 'Jalankan transaksi kasir dari pilihan menu sampai struk pembayaran contoh.',
    capabilities: ['Keranjang dan jumlah pesanan', 'Diskon dan metode pembayaran', 'Struk simulasi'],
    module: 'pos', init: 'initPosDemo', modal: 'pos'
  },
  {
    slug: 'landing', inquiryLabel: 'Diskusikan desain website', title: 'Landing Page', artworkAlt: 'Halaman Atap Temu dengan foto teras saat senja dan tombol pilih meja', category: 'website',
    description: 'Coba bagaimana pelanggan memilih menu, memesan sesi foto, atau mendaftar kelas lewat satu halaman.',
    capabilities: ['Filter jenis usaha dan tujuan', 'Coba penawaran dari sisi pelanggan', 'Diskusi desain pilihan via WhatsApp'],
    module: 'landing', init: 'initLanding', modal: 'landing'
  },
  {
    slug: 'dashboard', inquiryLabel: 'Diskusikan laporan usaha', title: 'Dashboard Usaha', artworkAlt: 'Laporan arus kas dengan grafik uang masuk dan keluar serta daftar transaksi', category: 'dashboard',
    description: 'Coba empat laporan UMKM. Catat pengeluaran, uji hasil penawaran, atau lihat dampak kiriman terlambat dan margin iklan yang turun.',
    capabilities: ['Catat arus kas', 'Uji skenario penjualan, stok, dan iklan', 'Unduh laporan pilihan dalam CSV'],
    module: 'dashboard', init: 'initDashboard', modal: 'dashboard', charts: true
  },
  {
    slug: 'chatbot', inquiryLabel: 'Diskusikan balasan pelanggan', title: 'Chatbot WhatsApp', artworkAlt: 'Percakapan asisten toko tentang ukuran kemeja dengan pilihan warna dan balasan cepat', category: 'automation',
    description: 'Coba percakapan pelanggan dan susun jawaban untuk pertanyaan yang sering muncul.',
    capabilities: ['Skenario percakapan', 'Balasan cepat', 'Aturan kata kunci'],
    module: 'chatbot', init: 'initChat'
  },
  {
    slug: 'calculator', inquiryLabel: 'Diskusikan kalkulator usaha', title: 'Kalkulator Bisnis', artworkAlt: 'Kalkulator titik impas dengan kolom biaya, harga jual, grafik, dan hasil dalam unit', category: 'tools',
    description: 'Coba harga jual setelah potongan marketplace, hitung target penjualan, atau cek kapan harus pesan stok lagi.',
    capabilities: ['Titik impas dan target laba', 'Harga jual setelah biaya platform', 'Hasil iklan per pesanan', 'Stok dan ongkir paket'],
    module: 'calculators', init: 'initCalculators'
  },
  {
    slug: 'scraping', inquiryLabel: 'Diskusikan kebutuhan data', title: 'Web Scraping', artworkVersion: 'editorial-1', artworkAlt: 'Lima baris hasil ekstraksi katalog dengan nama produk, harga, dan stok dalam berkas CSV', category: 'automation',
    description: 'Ikuti simulasi pengambilan data produk hingga hasilnya siap dibaca di spreadsheet.',
    capabilities: ['Dataset simulasi lokal', 'Pencarian dan pengurutan', 'Unduhan CSV'],
    module: 'scraping', init: 'initScraping'
  }
];

module.exports = { categories, projects };

