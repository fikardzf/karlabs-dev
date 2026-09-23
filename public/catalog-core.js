/* KAR Labs v2.8.0 - Catalog core helpers, lazy vendor loading, service metadata, CTA rendering, and icon refresh */
'use strict';
  const WA_NUMBER = '6285777345985'; // Nomor WhatsApp KAR Labs.dev
  const $ = (q, root=document) => root.querySelector(q);
  const $$ = (q, root=document) => Array.from(root.querySelectorAll(q));
  const fmtRp = n => 'Rp ' + Math.round(Number(n)||0).toLocaleString('id-ID');
  const fmtNum = n => Math.round(Number(n)||0).toLocaleString('id-ID');
  const parseRp = v => Number(String(v).replace(/[^0-9]/g,'')) || 0;
  const toast = (msg) => { const el=$('#toast'); el.textContent=msg; el.classList.add('show'); clearTimeout(window.__toast); window.__toast=setTimeout(()=>el.classList.remove('show'),3000); };
  let __chartJsPromise = null;
  function ensureChartJs(){
    if(window.Chart) return Promise.resolve(window.Chart);
    if(__chartJsPromise) return __chartJsPromise;
    __chartJsPromise = new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      script.src='https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js';
      script.async=true;
      script.dataset.karlabsVendor='chartjs';
      script.onload=()=>window.Chart ? resolve(window.Chart) : reject(new Error('Chart.js loaded without global Chart'));
      script.onerror=()=>reject(new Error('Chart.js failed to load'));
      document.head.appendChild(script);
    });
    return __chartJsPromise;
  }
  const serviceMessages = {
    'Landing Page':'Halo, saya tertarik membuat landing page seperti contoh katalog di website KAR Labs.dev. Saya ingin konsultasi untuk bisnis saya.',
    'Website Katalog Produk':'Halo, saya tertarik membuat website katalog produk interaktif seperti BUDS Motor: pilih brand/kategori, katalog produk, simulasi, dan CTA WhatsApp.',
    'Chatbot WhatsApp':'Halo, saya tertarik membuat chatbot WhatsApp dengan keyword response dan quick reply seperti demo KAR Labs.dev.',
    'Tool/Calculator Online':'Halo, saya tertarik membuat tool/kalkulator online interaktif seperti demo KAR Labs.dev.',
    'Dashboard Excel':'Halo, saya ingin konsultasi dashboard Excel/Google Sheets untuk monitoring data bisnis saya.',
    'Automasi Workflow':'Halo, saya ingin konsultasi automasi workflow untuk proses bisnis saya.',
    'Web Scraping Demo':'Halo, saya tertarik dengan layanan web scraping/data extraction seperti demo KAR Labs.dev.'
  };
  const waLink = service => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(serviceMessages[service] || ('Halo, saya tertarik dengan jasa '+service+' setelah melihat demo di website.'))}`;

  const serviceCatalog = [
    {id:'landing', icon:'🧩', label:'Landing Page', desc:'Preview website bisnis modern'},
    {id:'product-catalog', icon:'🛍️', label:'Website Katalog Produk', desc:'Brand filter, produk, mobile slider, CTA WhatsApp'},
    {id:'chatbot', icon:'💬', label:'Chatbot WhatsApp', desc:'Keyword response dan quick reply'},
    {id:'calculator', icon:'🧮', label:'Tool/Calculator', desc:'Finance, health, ads, ongkir, inventory'},
    {id:'dashboard', icon:'📊', label:'Dashboard Excel', desc:'Preview finance dashboard'},
    {id:'pos', icon:'🧾', label:'Point Of Sales', desc:'Kasir, cart, payment, stok, receipt'},
    {id:'workflow', icon:'⚙️', label:'Automasi Workflow', desc:'Visual alur automation'},
    {id:'scraping', icon:'🕷️', label:'Web Scraping', desc:'Simulasi scraping data'}
  ];

  const serviceDetails = {
    'Landing Page':{
      fit:['UMKM yang butuh halaman promosi cepat','Brand yang ingin terlihat lebih profesional','Campaign produk/event dengan CTA WhatsApp'],
      custom:['Warna, font, dan tone brand','Section produk, testimoni, FAQ, form','Copywriting, SEO basic, dan CTA'],
      output:['1 halaman landing page responsive','Struktur konten siap deploy','Integrasi link WhatsApp/contact form'],
      note:'Preview ini hanya contoh arah visual. Struktur final akan disesuaikan dengan target market, produk, dan cara closing bisnis kamu.'
    },
    'Website Katalog Produk':{
      fit:['Dealer/showroom yang punya banyak produk dan varian','Bisnis retail yang ingin customer memilih produk dulu sebelum chat','Brand yang butuh katalog online tanpa marketplace dependency'],
      custom:['Filter brand dan kategori sesuai struktur produk','Card produk dengan gambar, harga, badge, dan CTA','Tools tambahan seperti simulasi kredit, estimator harga, atau form lead'],
      output:['Website katalog responsive siap deploy','Flow pilih brand → kategori → produk','CTA WhatsApp sales dan form inquiry yang bisa dikustom'],
      note:'Contoh flow katalog bisa dibuat agar user memilih brand, kategori, lalu melihat varian dalam tampilan mobile slider dan lanjut ke chatbot atau WhatsApp sales.'
    },
    'Chatbot WhatsApp':{
      fit:['Bisnis yang sering menerima pertanyaan berulang','Admin yang ingin respon customer lebih cepat','Toko/restoran/klinik/dealer yang butuh menu otomatis'],
      custom:['Keyword dan jawaban otomatis','Quick reply sesuai skenario bisnis','Handoff ke admin/sales'],
      output:['Flow menu chatbot','Rule keyword response','Script simulasi percakapan untuk testing'],
      note:'Bot bisa dibuat sederhana dulu, lalu dikembangkan bertahap sesuai pola chat customer yang paling sering masuk.'
    },
    'Tool/Calculator Online':{
      fit:['Bisnis yang ingin memberi estimasi otomatis sebelum admin follow up','Website edukatif/finance/health yang butuh interactive tool','Lead magnet seperti KPR, BMI + kalori, ongkir, ROAS, BEP, inventory'],
      custom:['Rumus dan input sesuai kebutuhan bisnis','Output hasil, chart, insight, dan CTA setelah perhitungan','Validasi angka, format rupiah, export/lead capture jika dibutuhkan'],
      output:['Kalkulator responsive siap embed','Formula logic + visualisasi Chart.js','Dokumentasi rumus dan flow penggunaan'],
      note:'Tool interaktif membuat website terasa lebih berguna: pengunjung tidak hanya membaca, tapi bisa menghitung kebutuhan mereka sendiri sebelum menghubungi admin.'
    },
    'Dashboard Excel':{
      fit:['Owner bisnis yang ingin membaca data lebih cepat','Tim sales/finance yang masih pakai sheet manual','Monitoring transaksi, stok, target, atau operasional'],
      custom:['KPI card sesuai bisnis','Chart dan tabel transaksi','Theme warna dan format export'],
      output:['Template Excel/Google Sheets','Dashboard summary + chart','Format input data yang lebih rapi'],
      note:'Dashboard bukan sekadar chart. Tujuannya membantu owner/tim membaca kondisi bisnis lebih cepat dari data harian.'
    },
    'Point Of Sales':{
      fit:['Retail, showroom, F&B, dan bisnis dengan transaksi kasir','Bisnis yang ingin stok dan penjualan terhubung','Owner yang butuh histori transaksi dan laporan lebih rapi'],
      custom:['Alur produk, kategori, customer, diskon, pajak, dan payment','Role kasir/admin, receipt, hold order, dan stock rule','Dashboard penjualan, customer, cashier, serta laporan operasional'],
      output:['POS responsive sesuai workflow bisnis','Flow transaksi + payment + receipt','Inventory, order history, dan reporting sesuai scope'],
      note:'Demo ini disederhanakan dari alur KAR Labs POS. Implementasi client dapat dibuat lebih lengkap sesuai jenis toko, jumlah cabang, metode pembayaran, printer, dan kebutuhan inventory.'
    },
    'Automasi Workflow':{
      fit:['Proses kerja yang masih repetitif/manual','Notifikasi order, reminder, auto reply, sync data','Bisnis yang ingin mengurangi pekerjaan admin rutin'],
      custom:['Trigger, action, delay, dan output','Integrasi Gmail/Sheets/WhatsApp/form','Log aktivitas dan kondisi workflow'],
      output:['Mapping workflow bisnis','Prototype automasi sederhana','Dokumentasi alur dan rule'],
      note:'Automasi yang baik dimulai dari alur kecil yang jelas, lalu diperluas setelah benar-benar membantu operasional.'
    },
    'Web Scraping Demo':{
      fit:['Riset harga kompetitor','Pengumpulan data produk/listing publik','Monitoring katalog, rating, atau stok'],
      custom:['Target data yang ingin diambil','Format tabel dan export CSV','Filter, sorting, dan pagination'],
      output:['Script/flow scraping simulatif atau real sesuai scope','Tabel hasil data','Export CSV/Sheets'],
      note:'Scraping harus mengikuti aturan website target dan scope data yang aman. Demo ini menunjukkan alur dan output akhirnya.'
    }
  };

  function listHtml(items){ return items.map(item=>`<li>${item}</li>`).join(''); }
  function createCtas(){
    $$('[data-service-cta]').forEach(box=>{
      const service=box.dataset.serviceCta;
      const detail=serviceDetails[service] || serviceDetails['Landing Page'];
      const section=box.closest('.service-panel');
      const activeId=section ? section.id : '';
      const slider = serviceCatalog.map(item=>`<a href="catalog.html#${item.id}" class="service-slide ${item.id===activeId?'active':''}" data-service-link="${item.id}"><div class="text-2xl mb-3">${item.icon}</div><b class="block mb-1">${item.label}</b><p class="text-sm text-gray-500 leading-relaxed">${item.desc}</p></a>`).join('');
      box.innerHTML = `<div class="grid lg:grid-cols-[1fr_.92fr] gap-5 mb-6">
        <div class="trust-note"><b class="text-accent">Catatan untuk client:</b> ${detail.note}</div>
        <div class="trust-note"><b class="text-accent">Cara kerja:</b> Kamu cukup ceritakan kebutuhan bisnis, contoh referensi, dan targetnya. KAR Labs.dev bantu susun struktur, tampilan, flow, dan output yang siap dipakai.</div>
      </div>
      <div class="value-grid mb-8">
        <div class="value-card"><h4>Cocok untuk</h4><ul class="value-list">${listHtml(detail.fit)}</ul></div>
        <div class="value-card"><h4>Yang bisa dikustom</h4><ul class="value-list">${listHtml(detail.custom)}</ul></div>
        <div class="value-card"><h4>Output yang didapat</h4><ul class="value-list">${listHtml(detail.output)}</ul></div>
      </div>
      <div class="service-switcher"><div class="flex items-end justify-between gap-4 mb-4"><div><p class="text-accent text-sm font-bold uppercase tracking-wider mb-1">Lihat layanan lainnya</p><h3 class="font-heading text-2xl md:text-3xl font-bold">Pilih demo sesuai kebutuhan</h3></div><span class="hidden md:inline text-xs text-gray-500">Geser slider →</span></div><div class="service-rail">${slider}</div></div>
      <div id="cta" class="cta-card rounded-3xl p-6 md:p-8 text-center mt-6"><span class="copy-consistency-badge mb-4"><i data-lucide="sparkles" class="w-4 h-4"></i> Katalog Preview</span><h3 class="service-cta-title font-heading text-2xl md:text-3xl font-bold mb-3">Tertarik membuat ${service} yang disesuaikan dengan bisnis kamu?</h3><p class="text-gray-400 max-w-2xl mx-auto mb-5">Klik konsultasi, lalu ceritakan kebutuhan singkatnya. Saya akan bantu arahkan scope, fitur, dan estimasi pengerjaan yang paling masuk akal.</p><div class="mobile-safe-actions"><a class="btn-primary" target="_blank" rel="noopener noreferrer" href="${waLink(service)}">💬 Konsultasi ${service}</a><a class="btn-outline" href="index.html#layanan">← Kembali ke Layanan</a></div></div>`;
    });
  }



  function refreshIcons(){
    if(window.lucide && typeof window.lucide.createIcons === 'function'){
      window.lucide.createIcons();
    }
  }
