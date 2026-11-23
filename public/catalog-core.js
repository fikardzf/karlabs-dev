/* KAR Labs v2.8.0 - Catalog core helpers, lazy vendor loading, service metadata, CTA rendering, and icon refresh */
'use strict';
  const WA_NUMBER = '6285777345985'; // Nomor WhatsApp KAR Labs.dev
  const $ = (q, root=document) => root.querySelector(q);
  const $$ = (q, root=document) => Array.from(root.querySelectorAll(q));
  const fmtRp = n => 'Rp ' + Math.round(Number(n)||0).toLocaleString('id-ID');
  const fmtNum = n => Math.round(Number(n)||0).toLocaleString('id-ID');
  const parseRp = v => Number(String(v).replace(/[^0-9]/g,'')) || 0;
  const escapeCatalogHtml = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const toast = (msg) => { const el=$('#toast'); el.textContent=msg; el.classList.add('show'); clearTimeout(window.__toast); window.__toast=setTimeout(()=>el.classList.remove('show'),3000); };
  let __chartJsPromise = null;
  function configureChartMotion(Chart) {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const normal = {...Chart.defaults.animation, duration:240};
    function applyPreference() {
      Chart.defaults.animation = preference.matches ? false : normal;
      for (const chart of Object.values(Chart.instances)) {
        chart.stop();
        chart.update('none');
      }
    }
    applyPreference();
    preference.addEventListener('change', applyPreference);
    return Chart;
  }
  function ensureChartJs(){
    if(__chartJsPromise) return __chartJsPromise;
    if(window.Chart) return __chartJsPromise = Promise.resolve(configureChartMotion(window.Chart));
    __chartJsPromise = new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      const timer=setTimeout(()=>{script.remove();reject(new Error('Chart.js load timed out'));},15000);
      script.src='https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js';
      script.integrity='sha384-jb8JQMbMoBUzgWatfe6COACi2ljcDdZQ2OxczGA3bGNeWe+6DChMTBJemed7ZnvJ';
      script.crossOrigin='anonymous';
      script.async=true;
      script.dataset.karlabsVendor='chartjs';
      script.onload=()=>{clearTimeout(timer);window.Chart ? resolve(window.Chart) : reject(new Error('Chart.js loaded without global Chart'));};
      script.onerror=()=>{clearTimeout(timer);script.remove();reject(new Error('Chart.js failed to load'));};
      document.head.appendChild(script);
    }).then(configureChartMotion).catch(error=>{__chartJsPromise=null;throw error;});
    return __chartJsPromise;
  }
  const serviceMessages = {
    'Landing Page':'Halo, saya tertarik membuat landing page seperti contoh katalog di website KAR Labs.dev. Saya ingin konsultasi untuk bisnis saya.',
    'Website Katalog Produk':'Halo KAR Labs, saya ingin konsultasi Website Katalog Produk untuk usaha saya. Jenis usaha: ',
    'Chatbot WhatsApp':'Halo, saya tertarik membuat chatbot WhatsApp dengan keyword response dan quick reply seperti demo KAR Labs.dev.',
    'Tool/Calculator Online':'Halo, saya tertarik membuat tool/kalkulator online interaktif seperti demo KAR Labs.dev.',
    'Dashboard Excel':'Halo, saya ingin konsultasi dashboard Excel/Google Sheets untuk monitoring data bisnis saya.',
    'Automasi Workflow':'Halo, saya ingin konsultasi automasi workflow untuk proses bisnis saya.',
    'Web Scraping Demo':'Halo, saya tertarik dengan layanan web scraping/data extraction seperti demo KAR Labs.dev.'
  };
  const waLink = service => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Layanan: '+service+'\n'+(serviceMessages[service] || 'Halo KAR Labs, saya ingin membahas layanan ini untuk usaha saya.'))}`;

  const serviceCatalog = [
    {id:'landing', icon:'🧩', label:'Landing Page', desc:'Preview website bisnis modern'},
    {id:'product-catalog', icon:'🛍️', label:'Website Katalog Produk', desc:'Brand filter, produk, mobile slider, CTA WhatsApp'},
    {id:'chatbot', icon:'💬', label:'Chatbot WhatsApp', desc:'Keyword response dan quick reply'},
    {id:'calculator', icon:'🧮', label:'Kalkulator Bisnis', desc:'Harga jual, titik impas, iklan, persediaan, dan ongkir'},
    {id:'dashboard', icon:'📊', label:'Dashboard Usaha', desc:'Arus kas, penjualan, persediaan, dan iklan'},
    {id:'pos', icon:'🧾', label:'Point Of Sales', desc:'Kasir, cart, payment, stok, receipt'},
    {id:'workflow', icon:'⚙️', label:'Automasi Workflow', desc:'Visual alur automation'},
    {id:'scraping', icon:'🕷️', label:'Web Scraping', desc:'Simulasi scraping data'}
  ];

  const serviceDetails = {
    'Landing Page':{
      fit:['UMKM dengan penawaran khusus','Usaha yang membutuhkan profil online','Promosi produk atau acara'],
      custom:['Warna dan tipografi brand','Produk, FAQ, dan form','Konten, SEO dasar, dan tombol kontak'],
      output:['Satu halaman responsif','Struktur konten usaha','Tautan WhatsApp atau form kontak'],
      note:'Contoh arah visual. Konten dan struktur akhir mengikuti produk serta target pelanggan.'
    },
    'Website Katalog Produk':{
      fit:['Dealer dengan banyak varian produk','Toko yang melayani pertanyaan melalui WhatsApp','Usaha yang membutuhkan katalog mandiri'],
      custom:['Kategori dan filter sesuai data','Gambar, harga, dan informasi produk','Kalkulator atau form sesuai penawaran'],
      output:['Website katalog responsif','Alur kategori dan detail produk','Tautan WhatsApp atau form pertanyaan'],
      note:'Struktur produk dan alur WhatsApp mengikuti data serta kebutuhan usaha. Checkout, pembayaran, dan sinkronisasi stok memerlukan pembahasan terpisah.'
    },
    'Chatbot WhatsApp':{
      fit:['Usaha dengan pertanyaan rutin','Tim admin layanan pelanggan','Toko, restoran, klinik, atau dealer'],
      custom:['Kata kunci dan jawaban','Pilihan balasan cepat','Pengalihan ke admin'],
      output:['Rancangan menu chatbot','Aturan balasan','Skenario pengujian percakapan'],
      note:'Kata kunci dan pengalihan ke admin disusun dari pertanyaan rutin pelanggan.'
    },
    'Tool/Calculator Online':{
      fit:['Penjual yang menghitung harga per produk','Usaha yang memantau biaya iklan dan waktu pesan stok','Toko yang membuat estimasi ongkir'],
      custom:['Rumus dan input','Hasil, grafik, dan tombol kontak','Validasi angka dan format keluaran'],
      output:['Kalkulator responsif','Perhitungan dan visualisasi','Dokumentasi rumus serta penggunaan'],
      note:'Rumus, asumsi, dan batas estimasi disepakati sebelum pengembangan.'
    },
    'Dashboard Excel':{
      fit:['Pemilik usaha yang membutuhkan rekap','Tim penjualan atau keuangan','Pemantauan stok dan operasional'],
      custom:['Indikator usaha','Grafik dan tabel','Warna serta format ekspor'],
      output:['Template Excel atau Google Sheets','Ringkasan dan grafik','Format input data'],
      note:'Indikator dan laporan disusun dari sumber data yang disepakati.'
    },
    'Point Of Sales':{
      fit:['Toko, showroom, dan usaha kuliner','Usaha dengan pencatatan stok','Tim yang membutuhkan riwayat transaksi'],
      custom:['Produk, pelanggan, diskon, dan pajak','Hak akses, struk, dan aturan stok','Laporan penjualan serta operasional'],
      output:['Tampilan kasir responsif','Alur transaksi dan struk','Stok, riwayat, dan laporan sesuai cakupan'],
      note:'Perangkat kasir, cabang, pembayaran, dan pengelolaan stok mengikuti kebutuhan serta penawaran.'
    },
    'Automasi Workflow':{
      fit:['Administrasi dengan input berulang','Pencatatan pesanan dan pengingat','Tindak lanjut calon pelanggan'],
      custom:['Pemicu, aksi, dan jeda','Integrasi yang didukung platform','Aturan serta catatan aktivitas'],
      output:['Pemetaan proses','Prototipe automasi sederhana','Dokumentasi alur dan aturan'],
      note:'Mulai dari satu alur sederhana dengan pemicu, aturan, dan hasil yang jelas.'
    },
    'Web Scraping Demo':{
      fit:['Riset harga dari sumber publik','Pengumpulan informasi produk publik','Peninjauan katalog sesuai izin sumber'],
      custom:['Sumber dan kolom data','Format tabel dan CSV','Filter dan pengurutan'],
      output:['Alur pengumpulan sesuai cakupan','Tabel hasil','Ekspor CSV atau Sheets'],
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
      box.innerHTML = `<details class="reference-details"><summary>Rincian implementasi</summary><p class="showroom-note">${detail.note} Cakupan, integrasi, dan biaya pihak ketiga mengikuti penawaran. Fitur demo tidak otomatis termasuk paket. Premium maksimal 1 workflow sederhana yang dinilai layak dan disepakati tertulis. ERP, CRM lengkap, AI kompleks, dan fitur tambahan ditawarkan terpisah.</p><div class="value-grid mb-8">
        <div class="value-card"><h4>Cocok untuk</h4><ul class="value-list">${listHtml(detail.fit)}</ul></div>
        <div class="value-card"><h4>Penyesuaian</h4><ul class="value-list">${listHtml(detail.custom)}</ul></div>
        <div class="value-card"><h4>Hasil yang dibahas</h4><ul class="value-list">${listHtml(detail.output)}</ul></div>
      </div></details>
      <div id="cta-${activeId}" class="cta-card rounded-3xl p-6 md:p-8 mt-6"><h3 class="service-cta-title font-heading text-2xl md:text-3xl font-bold mb-3">Bahas ${service}.</h3><p class="text-gray-400 max-w-2xl mb-5">Konsultasikan alur dan fitur untuk usaha Anda. <a href="index.html#harga" class="text-link">Lihat paket dan cakupan</a>.</p><div class="mobile-safe-actions"><a class="btn-primary" target="_blank" rel="noopener noreferrer" href="${waLink(service)}">Konsultasi WhatsApp</a><a class="btn-outline" href="index.html?service=${activeId}#contact-form">Isi kebutuhan</a><a class="text-link" href="#serviceDiscovery">Pilih demo lain</a></div></div>`;
    });
  }



  function refreshIcons(){
    if(window.lucide && typeof window.lucide.createIcons === 'function'){
      window.lucide.createIcons();
    }
  }

  const posDemoProducts=[
    {id:'coffee',name:'Americano',category:'Beverage',price:28000,stock:14,icon:'coffee'},
    {id:'latte',name:'Cafe Latte',category:'Beverage',price:35000,stock:9,icon:'cup-soda'},
    {id:'croissant',name:'Butter Croissant',category:'Bakery',price:32000,stock:5,icon:'sandwich'},
    {id:'rice',name:'Rice Bowl Chicken',category:'Food',price:48000,stock:7,icon:'utensils'},
    {id:'bottle',name:'Mineral Water',category:'Beverage',price:12000,stock:18,icon:'droplet'},
    {id:'cake',name:'Cheesecake Slice',category:'Dessert',price:42000,stock:2,icon:'cake-slice'}
  ];

  function chartColors(){return ['#006847','#06B6D4','#F97316','#A855F7','#EF4444','#EAB308'];}

  function csvCell(value){
    let text=String(value ?? '');
    // Spreadsheet apps may execute formula-like text even inside quoted CSV cells.
    if(typeof value==='string' && /^\s*[=+@-]|^[\t\r\n]/.test(text))text="'"+text;
    return '"'+text.replace(/"/g,'""')+'"';
  }
  function downloadCSV(data,filename){ if(!data.length){toast('Tidak ada data untuk di-export'); return;} const headers=Object.keys(data[0]); const rows=data.map(row=>headers.map(h=>csvCell(row[h])).join(',')); const csv=[headers.map(csvCell).join(','),...rows].join('\n'); const blob=new Blob([csv],{type:'text/csv;charset=utf-8'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url); toast('CSV berhasil di-download!'); }
