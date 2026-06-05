export const siteConfig = {
  brandName: 'KAR Labs.dev',
  shortName: 'KAR Labs',
  tagline: 'Website, chatbot, dashboard, katalog, dan automasi yang rapi, ringan, dan siap dipakai.',
  whatsappNumber: '6285777345985',
  email: 'karlabs.dev@gmail.com',
  instagram: '@karlabs.dev',
  instagramUrl: 'https://www.instagram.com/karlabs.dev/',
  location: 'Jakarta, Indonesia (Remote)',
  year: '2026',
  navItems: [
    { label: 'Layanan', href: '#layanan' },
    { label: 'Proses', href: '#proses' },
    { label: 'Harga', href: '#harga' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Kontak', href: '#kontak' },
  ],
  hero: {
    eyebrow: 'KAR Labs Digital Partner',
    headline: 'Bikin bisnis tampil lebih profesional, tanpa ribet.',
    description:
      'Kami bantu membuat landing page, chatbot WhatsApp, dashboard, katalog, dan workflow automasi yang jelas secara fungsi, profesional secara tampilan, dan mudah dipakai.',
    primaryCta: 'Konsultasi via WhatsApp',
    secondaryCta: 'Lihat Layanan',
  },
  stats: [
    { value: '1-7 Hari', label: 'Estimasi pengerjaan awal' },
    { value: 'Responsive', label: 'Desktop, tablet, mobile' },
    { value: 'Production', label: 'Siap deploy kapan saja' },
  ],
  services: [
    {
      title: 'Landing Page & Website Bisnis',
      description: 'Halaman promosi, company profile, katalog sederhana, dan website campaign yang cepat dibuka dan mudah diedit.',
      price: 'Mulai Rp150rb',
      icon: 'layout',
    },
    {
      title: 'Dashboard & Reporting',
      description: 'Dashboard operasional, sales monitoring, rekap data, dan tampilan report yang lebih rapi untuk kebutuhan internal.',
      price: 'By scope',
      icon: 'chart',
    },
    {
      title: 'Chatbot & WhatsApp Flow',
      description: 'Alur tanya jawab, pre-qualification leads, katalog layanan, dan template follow-up untuk admin.',
      price: 'Mulai Rp200rb',
      icon: 'message',
    },
    {
      title: 'Automation Workflow',
      description: 'Bantu kurangi pekerjaan repetitif dengan integrasi form, spreadsheet, email, atau sistem lain sesuai kebutuhan.',
      price: 'Custom',
      icon: 'zap',
    },
  ],
  process: [
    { title: 'Brief', description: 'Kita kumpulkan kebutuhan, objective, referensi, dan target user.' },
    { title: 'Structure', description: 'Konten, flow halaman, dan prioritas fitur disusun agar tidak melebar.' },
    { title: 'Build', description: 'UI/UX, code, dan konfigurasi dibuat dengan struktur yang bersih.' },
    { title: 'Review', description: 'Testing responsive, form, CTA, copywriting, dan bug fixing sebelum deploy.' },
    { title: 'Launch', description: 'Project siap dipublish ke Vercel, Netlify, Cloudflare Pages, atau hosting pilihan.' },
  ],
  pricing: [
    {
      name: 'Starter',
      price: 'Rp150rb+',
      description: 'Untuk kebutuhan sederhana dan cepat live.',
      features: ['1 landing page', 'Responsive layout', 'Basic SEO', 'WhatsApp CTA', '1x revisi minor'],
      highlighted: false,
    },
    {
      name: 'Business',
      price: 'Rp1,5jt+',
      description: 'Untuk website bisnis dengan struktur lebih lengkap.',
      features: ['Multi-section website', 'Copywriting structure', 'Form/CTA optimization', 'Deploy assistance', '2x revisi minor'],
      highlighted: true,
    },
    {
      name: 'Custom System',
      price: 'By request',
      description: 'Untuk dashboard, chatbot, automasi, atau kebutuhan khusus.',
      features: ['Scope discussion', 'Custom workflow', 'Database optional', 'Integration optional', 'Documentation handover'],
      highlighted: false,
    },
  ],
  faqs: [
    {
      question: 'Apakah website ini bisa langsung dipakai production?',
      answer: 'Bisa. Struktur project sudah memakai Vite, React, TypeScript, dan Tailwind agar ringan saat development dan aman untuk build production.',
    },
    {
      question: 'Bagian mana yang harus saya edit untuk basic information?',
      answer: 'Mayoritas informasi bisnis ada di src/siteConfig.ts. Kamu bisa mengganti nama brand, nomor WhatsApp, email, layanan, harga, FAQ, dan isi konten dari satu file tersebut.',
    },
    {
      question: 'Apakah ada watermark bawaan template?',
      answer: 'Tidak. Branding bawaan template lama sudah dihapus dari tampilan dan source utama. Kamu tinggal ganti identitas brand sesuai kebutuhan.',
    },
    {
      question: 'Bisa deploy ke mana?',
      answer: 'Bisa ke Vercel, Netlify, Cloudflare Pages, atau static hosting lain. Build command: npm run build. Output directory: dist.',
    },
  ],
};

export type ServiceIcon = 'layout' | 'chart' | 'message' | 'zap';
