/* KAR Labs v2.6.0 - Workflow automation demo */
'use strict';
  const workflowCatalog = {
    email:{
      icon:'📧', label:'Auto Reply Email AI', title:'Auto Reply Email + Lead Classification', short:'Balas email masuk, klasifikasikan intent, lalu simpan log dan draft follow-up.', complexity:'Medium', time:'± 3-5 hari kerja', tools:['Gmail','AI','Sheets','CRM'],
      metrics:[['Response time','< 1 menit'],['Manual follow-up','-60%'],['Log data','Otomatis']],
      outcomes:['Email urgent diprioritaskan','Pertanyaan umum dibalas otomatis','Tim tetap punya kontrol approval'],
      nodes:[
        {icon:'📧',title:'Email Masuk',sub:'Trigger',type:'Trigger',platform:'Gmail / Lark Mail',config:'Subject/body contains keyword seperti "harga", "kerja sama", "support", atau "complaint".',condition:'Setiap email baru masuk ke inbox atau label tertentu.',output:'Email masuk ditangkap sebagai data mentah.'},
        {icon:'🧠',title:'AI Klasifikasi',sub:'Analyze',type:'Action',platform:'OpenAI / AI Model',config:'AI membaca intent, urgency, nama client, nomor kontak, dan kebutuhan utama.',condition:'Email bukan spam dan memiliki isi yang valid.',output:'Kategori lead, urgency score, dan ringkasan email.'},
        {icon:'📝',title:'Draft Response',sub:'Generate',type:'Action',platform:'Gmail Draft',config:'Generate draft balasan sesuai kategori: sales, support, partnership, complaint.',condition:'Confidence AI di atas threshold yang ditentukan.',output:'Draft email siap review admin.'},
        {icon:'✅',title:'Approval Rule',sub:'Validation',type:'Decision',platform:'Rule Engine',config:'Jika kategori complaint/high value, minta approval manual. Jika FAQ umum, auto-send.',condition:'Berdasarkan kategori dan urgency score.',output:'Menentukan auto-send atau review manual.'},
        {icon:'📤',title:'Reply / Assign',sub:'Output',type:'Output',platform:'Gmail + CRM',config:'Kirim balasan atau assign ke PIC sales/support.',condition:'Draft disetujui rule atau admin.',output:'Client mendapat respon cepat dan PIC mendapat task.'},
        {icon:'📊',title:'Log & Report',sub:'Archive',type:'Output',platform:'Google Sheets / Airtable',config:'Simpan email, kategori, SLA, status, dan PIC follow-up.',condition:'Setelah workflow selesai.',output:'Dashboard performa CS/sales otomatis terisi.'}
      ]
    },
    order:{
      icon:'📦', label:'Order Notification', title:'Order Notification + Fulfillment Tracker', short:'Notifikasi order, validasi pembayaran, update stok, dan reminder fulfillment.', complexity:'Advanced', time:'± 5-8 hari kerja', tools:['Shopify','WhatsApp','Sheets','Warehouse'],
      metrics:[['Missed order','Turun'],['Update stok','Realtime'],['Fulfillment','Terlacak']],
      outcomes:['Customer otomatis dapat update','Tim gudang melihat prioritas order','Admin punya log status order'],
      nodes:[
        {icon:'🛒',title:'Order Masuk',sub:'Trigger',type:'Trigger',platform:'Shopify / Website Form',config:'Trigger saat order paid, partially paid, COD confirmed, atau draft order completed.',condition:'Order memiliki nomor HP dan status valid.',output:'Data order masuk ke workflow.'},
        {icon:'💳',title:'Validasi Payment',sub:'Decision',type:'Decision',platform:'Payment Gateway / Rule',config:'Cek paid, unpaid, partially paid, manual transfer, atau marketplace order.',condition:'Status pembayaran berubah.',output:'Menentukan order siap proses atau perlu follow-up.'},
        {icon:'📦',title:'Cek Stok',sub:'Validation',type:'Action',platform:'Inventory Sheet / OMS',config:'Cek SKU, varian, lokasi stok, dan estimasi kesiapan fulfillment.',condition:'SKU tersedia di data inventory.',output:'Status ready, partial, atau PO/backorder.'},
        {icon:'📱',title:'WA Customer',sub:'Action',type:'Action',platform:'WhatsApp API',config:'Kirim template order diterima, estimasi proses, atau request data tambahan.',condition:'Nomor WA valid dan customer opt-in.',output:'Customer mendapat update otomatis.'},
        {icon:'🏷️',title:'Assign Gudang',sub:'Action',type:'Action',platform:'Sheets / Task Board',config:'Buat task picking/packing dengan prioritas dan lokasi barang.',condition:'Order siap diproses.',output:'Tim gudang tahu order yang harus dikerjakan.'},
        {icon:'📊',title:'Update Tracker',sub:'Output',type:'Output',platform:'Google Sheets / Dashboard',config:'Update status: paid, picking, packed, shipped, delivered, issue.',condition:'Setiap status berubah.',output:'Dashboard fulfillment otomatis terupdate.'}
      ]
    },
    lead:{
      icon:'🎯', label:'Lead Scoring CRM', title:'Lead Capture + Scoring + Sales Assignment', short:'Tangkap leads dari form/WA, beri score, lalu assign otomatis ke sales yang tepat.', complexity:'Advanced', time:'± 5-7 hari kerja', tools:['Form','WhatsApp','CRM','Sheets'],
      metrics:[['Lead response','Lebih cepat'],['Prioritas sales','Otomatis'],['Duplicate lead','Terdeteksi']],
      outcomes:['Lead panas tidak tertinggal','Sales follow-up sesuai prioritas','Data prospect lebih bersih'],
      nodes:[
        {icon:'📝',title:'Form / WA Masuk',sub:'Trigger',type:'Trigger',platform:'Landing Page Form / WhatsApp',config:'Ambil nama, nomor HP, kebutuhan, budget, kota, dan sumber campaign.',condition:'User submit form atau chat keyword tertentu.',output:'Lead baru tercatat.'},
        {icon:'🧹',title:'Clean Data',sub:'Validation',type:'Action',platform:'Formatter',config:'Normalize nomor HP, kota, nama, dan cek format data wajib.',condition:'Ada data yang perlu dibersihkan.',output:'Data lead siap diproses.'},
        {icon:'🔎',title:'Duplicate Check',sub:'Decision',type:'Decision',platform:'CRM / Sheets Lookup',config:'Cek nomor HP/email sudah pernah masuk atau belum.',condition:'Nomor HP/email tersedia.',output:'Lead baru atau existing lead.'},
        {icon:'🔥',title:'Lead Scoring',sub:'Analyze',type:'Action',platform:'Rule + AI',config:'Score berdasarkan budget, urgency, kota, source, dan intent chat.',condition:'Data kebutuhan tersedia.',output:'Hot, warm, cold lead.'},
        {icon:'👤',title:'Assign Sales',sub:'Action',type:'Action',platform:'CRM / Lark / Sheets',config:'Assign lead ke sales sesuai region, produk, atau kapasitas follow-up.',condition:'Lead punya score dan kategori.',output:'Sales menerima task follow-up.'},
        {icon:'📱',title:'Follow-up WA',sub:'Output',type:'Output',platform:'WhatsApp API',config:'Kirim pesan pembuka otomatis sesuai kebutuhan lead.',condition:'Lead valid dan belum dihubungi.',output:'Prospect mendapat respon cepat.'}
      ]
    },
    approval:{
      icon:'✅', label:'Approval Request', title:'Approval Request + SLA Escalation', short:'Alur pengajuan internal dengan approval berjenjang, SLA, dan eskalasi otomatis.', complexity:'Advanced', time:'± 5-9 hari kerja', tools:['Form','Lark','Email','Sheets'],
      metrics:[['SLA approval','Terukur'],['Reminder','Otomatis'],['Audit trail','Rapi']],
      outcomes:['Request tidak hilang di chat','Approval punya jejak audit','Manager mendapat reminder otomatis'],
      nodes:[
        {icon:'📥',title:'Request Dibuat',sub:'Trigger',type:'Trigger',platform:'Lark Form / Google Form',config:'User submit request: overtime, purchase, reimbursement, cuti, atau approval campaign.',condition:'Form lengkap dan submit valid.',output:'Nomor request otomatis dibuat.'},
        {icon:'🧾',title:'Validasi Form',sub:'Validation',type:'Action',platform:'Rule Engine',config:'Cek field wajib, nominal, lampiran, department, dan approver.',condition:'Request baru diterima.',output:'Request valid atau butuh revisi.'},
        {icon:'👔',title:'Approval Level 1',sub:'Decision',type:'Decision',platform:'Manager Approval',config:'Manager approve/reject/revise melalui link atau status form.',condition:'Request valid.',output:'Status level 1 tercatat.'},
        {icon:'⏰',title:'SLA Reminder',sub:'Delay',type:'Delay',platform:'Scheduler',config:'Jika belum approve dalam 12/24 jam, kirim reminder otomatis.',condition:'Status masih pending.',output:'Approver mendapat reminder.'},
        {icon:'🏢',title:'Approval Level 2',sub:'Decision',type:'Decision',platform:'HR / Finance / Director',config:'Approval lanjutan sesuai nominal, jenis request, atau divisi.',condition:'Level 1 approved dan butuh approval lanjutan.',output:'Final approve/reject.'},
        {icon:'📊',title:'Audit Log',sub:'Output',type:'Output',platform:'Sheets / Dashboard',config:'Simpan request, approver, waktu approve, SLA, status, dan catatan.',condition:'Setiap status berubah.',output:'Dashboard approval dan audit trail siap dipakai.'}
      ]
    },
    inventory:{
      icon:'📦', label:'Inventory Alert', title:'Inventory Reorder + PO Alert Automation', short:'Pantau stok, PO, sales velocity, dan kirim alert reorder otomatis sebelum stok habis.', complexity:'Advanced', time:'± 5-10 hari kerja', tools:['Sheets','ERP/OMS','Email','WhatsApp'],
      metrics:[['Stockout risk','Terdeteksi'],['PO visibility','Lebih jelas'],['Reorder alert','Otomatis']],
      outcomes:['Tim tahu barang yang harus dipesan','PO dan stok lebih sinkron','Forecast lebih mudah dibaca'],
      nodes:[
        {icon:'📊',title:'Sync Stock Data',sub:'Trigger',type:'Trigger',platform:'ERP / Shopify / Sheets',config:'Ambil stok on hand, incoming PO, reserved stock, dan sales 7/14/30 hari.',condition:'Jadwal harian atau data berubah.',output:'Snapshot stok terbaru.'},
        {icon:'🧮',title:'Hitung ROP',sub:'Action',type:'Action',platform:'Formula Engine',config:'Reorder Point = demand harian × lead time + safety stock.',condition:'Data lead time dan sales tersedia.',output:'ROP per SKU.'},
        {icon:'⚠️',title:'Risk Detection',sub:'Decision',type:'Decision',platform:'Rule Engine',config:'Tandai SKU risk jika stock cover < threshold atau incoming PO belum cukup.',condition:'Stok lebih rendah dari ROP.',output:'SKU masuk daftar alert.'},
        {icon:'📩',title:'Alert PIC',sub:'Action',type:'Action',platform:'Email / WhatsApp / Lark',config:'Kirim alert ke purchasing/product PIC dengan SKU, qty rekomendasi, dan PO gap.',condition:'Ada SKU risk.',output:'PIC mendapat notifikasi tindakan.'},
        {icon:'🧾',title:'Draft PO List',sub:'Output',type:'Output',platform:'Google Sheets',config:'Buat daftar rekomendasi pembelian: SKU, varian, qty, supplier, prioritas.',condition:'Alert valid.',output:'Draft PO siap review.'},
        {icon:'📈',title:'Dashboard Update',sub:'Output',type:'Output',platform:'Dashboard Excel/Sheets',config:'Update days cover, inventory turnover, PO gap, dan risk score.',condition:'Setiap sync selesai.',output:'Dashboard stock monitoring terbarui.'}
      ]
    },
    ads:{
      icon:'📣', label:'Ads Report Automation', title:'Ads Performance Report + Budget Alert', short:'Tarik data iklan, hitung ROAS/CAC/profit, lalu kirim summary dan alert budget otomatis.', complexity:'Medium-Advanced', time:'± 5-8 hari kerja', tools:['Meta Ads','Sheets','Email','Dashboard'],
      metrics:[['ROAS monitor','Otomatis'],['Budget pacing','Terkontrol'],['Report time','Lebih singkat']],
      outcomes:['Tim marketing cepat melihat campaign bermasalah','Budget tidak kebablasan','Report meeting lebih siap'],
      nodes:[
        {icon:'📥',title:'Fetch Ads Data',sub:'Trigger',type:'Trigger',platform:'Meta/TikTok/Shopee Ads Export',config:'Ambil spend, clicks, revenue, orders, campaign, adset, dan product/category.',condition:'Jadwal harian atau export file masuk.',output:'Data iklan mentah masuk.'},
        {icon:'🧹',title:'Normalize Data',sub:'Validation',type:'Action',platform:'Data Formatter',config:'Samakan nama campaign, tanggal, channel, product code, dan format currency.',condition:'Ada data baru.',output:'Data siap dihitung.'},
        {icon:'🧮',title:'Hitung KPI',sub:'Action',type:'Action',platform:'Formula Engine',config:'Hitung ROAS, CAC, CPC, CVR, profit ads, dan budget pacing.',condition:'Spend dan revenue tersedia.',output:'KPI per campaign.'},
        {icon:'🚦',title:'Campaign Health',sub:'Decision',type:'Decision',platform:'Rule Engine',config:'Tandai campaign: scale, maintain, watch, atau stop berdasarkan KPI threshold.',condition:'KPI sudah dihitung.',output:'Rekomendasi aksi campaign.'},
        {icon:'📩',title:'Kirim Summary',sub:'Output',type:'Output',platform:'Email / Lark / WhatsApp',config:'Kirim daily digest: top campaign, low performer, overspend, dan next action.',condition:'Jadwal laporan aktif.',output:'Tim mendapat ringkasan otomatis.'},
        {icon:'📊',title:'Update Dashboard',sub:'Output',type:'Output',platform:'Google Sheets / Looker Studio',config:'Update trend spend, ROAS, CAC, profit, dan product performance.',condition:'Setelah report selesai.',output:'Dashboard marketing terupdate.'}
      ]
    }
  }; let currentPreset='email';
  function borderByType(t){return t==='Trigger'?'border-green-500/70':t==='Action'?'border-blue-500/70':t==='Delay'?'border-orange-500/70':t==='Decision'?'border-yellow-500/70':'border-purple-500/70'}
  function typeBadge(t){ const m={Trigger:'bg-green-500/10 text-green-300 border-green-500/30',Action:'bg-blue-500/10 text-blue-300 border-blue-500/30',Decision:'bg-yellow-500/10 text-yellow-200 border-yellow-500/30',Delay:'bg-orange-500/10 text-orange-300 border-orange-500/30',Output:'bg-purple-500/10 text-purple-300 border-purple-500/30'}; return m[t]||'bg-white/5 text-gray-300 border-white/10'; }
  function renderWorkflowCatalog(){
    const entries=Object.entries(workflowCatalog);
    $('#workflowCatalog').innerHTML=entries.map(([key,w])=>`<button data-preset="${key}" class="workflow-catalog-card text-left glass rounded-3xl p-5 border border-dark-border hover:border-accent/70 transition-all ${key===currentPreset?'border-accent bg-accent/10':''}">
      <div class="flex items-start justify-between gap-3 mb-4"><div class="w-11 h-11 rounded-2xl bg-accent/10 text-2xl flex items-center justify-center">${w.icon}</div><span class="text-[11px] border border-dark-border rounded-full px-2 py-1 text-gray-400">${w.complexity}</span></div>
      <h4 class="font-heading text-lg font-bold mb-2">${w.label}</h4><p class="text-sm text-gray-400 leading-relaxed mb-4">${w.short}</p>
      <div class="flex flex-wrap gap-2">${w.tools.slice(0,3).map(t=>`<span class="text-[11px] rounded-full bg-black/35 border border-dark-border px-2 py-1 text-gray-400">${t}</span>`).join('')}</div>
    </button>`).join('');
    $$('.workflow-catalog-card').forEach(card=>card.onclick=()=>{currentPreset=card.dataset.preset; renderWorkflowAll(); document.getElementById('workflowSummary')?.scrollIntoView({behavior:'smooth',block:'nearest'});});
  }
  function renderWorkflowTabs(){
    $('#workflowPresetTabs').innerHTML=Object.entries(workflowCatalog).map(([key,w])=>`<button data-preset="${key}" class="preset-btn ${key===currentPreset?'active btn-primary':'btn-outline'} py-2 px-4 whitespace-nowrap">${w.icon} ${w.label}</button>`).join('');
    $$('.preset-btn').forEach(b=>b.onclick=()=>{currentPreset=b.dataset.preset; renderWorkflowAll();});
  }
  function renderWorkflowSummary(){
    const w=workflowCatalog[currentPreset];
    $('#workflowSummary').innerHTML=`<div class="grid lg:grid-cols-[1.15fr_.85fr] gap-5 items-start">
      <div><p class="text-accent text-xs font-bold uppercase tracking-wider mb-2">Selected Workflow</p><h4 class="font-heading text-2xl md:text-3xl font-bold mb-3">${w.icon} ${w.title}</h4><p class="text-gray-400 leading-relaxed">${w.short}</p><div class="flex flex-wrap gap-2 mt-4">${w.tools.map(t=>`<span class="landing-pill">${t}</span>`).join('')}</div></div>
      <div class="grid grid-cols-3 gap-3">${w.metrics.map(([k,v])=>`<div class="bg-dark border border-dark-border rounded-2xl p-3 text-center"><p class="text-[11px] text-gray-500 mb-1">${k}</p><b class="text-accent text-sm">${v}</b></div>`).join('')}<div class="bg-dark border border-dark-border rounded-2xl p-3 text-center col-span-3"><p class="text-[11px] text-gray-500 mb-1">Estimasi setup</p><b class="text-white text-sm">${w.time}</b></div></div>
    </div>`;
  }
  function renderWorkflowUseCases(){
    const w=workflowCatalog[currentPreset];
    $('#workflowUseCases').innerHTML=w.outcomes.map((item,i)=>`<div class="glass rounded-2xl p-4 border border-dark-border"><div class="text-accent font-heading font-bold mb-2">0${i+1}</div><p class="text-sm text-gray-300 leading-relaxed">${item}</p></div>`).join('');
  }
  function renderWorkflow(){
    const w=workflowCatalog[currentPreset]; const nodes=w.nodes;
    $('#workflowTitle').textContent=w.title;
    $('#workflowComplexity').innerHTML=`<span class="landing-pill">${w.complexity}</span><span class="landing-pill">${nodes.length} steps</span>`;
    $('#workflowViz').innerHTML=nodes.map((n,i)=>`<div class="flex flex-col md:flex-row items-center justify-center gap-4 w-full md:w-auto"><div class="workflow-node bg-dark border ${borderByType(n.type)} rounded-2xl p-4 w-full max-w-[210px] md:w-36 text-center" data-i="${i}"><div class="text-3xl mb-2">${n.icon}</div><b class="block text-sm md:text-base leading-tight">${n.title}</b><span class="inline-flex mt-2 text-[11px] border rounded-full px-2 py-1 ${typeBadge(n.type)}">${n.sub}</span></div>${i<nodes.length-1?'<div class="connector"><span class="flow-dot"></span></div>':''}</div>`).join('');
    $$('.workflow-node').forEach(n=>n.onclick=()=>showNode(Number(n.dataset.i))); showNode(0);
  }
  function showNode(i){
    $$('.workflow-node').forEach(n=>n.classList.remove('active')); const node=$$('.workflow-node')[i]; if(node)node.classList.add('active'); const n=workflowCatalog[currentPreset].nodes[i];
    $('#nodeDetail').innerHTML=`<div class="flex justify-between gap-4 mb-4"><div><p class="text-accent text-sm font-bold">${n.type.toUpperCase()}</p><h4 class="font-heading text-2xl font-bold">${n.icon} ${n.title}</h4></div><button id="closeNode" class="text-gray-500 hover:text-white"><i data-lucide="x" class="w-5 h-5"></i></button></div><div class="space-y-4 text-sm"><div><p class="text-gray-500">Platform</p><b>${n.platform}</b></div><div><p class="text-gray-500">Konfigurasi</p><p class="text-gray-300">${n.config}</p></div><div><p class="text-gray-500">Condition</p><p class="text-gray-300">${n.condition}</p></div><div><p class="text-gray-500">Output</p><p class="text-gray-300">${n.output||'-'}</p></div></div>`; refreshIcons(); $('#closeNode').onclick=()=>$('#nodeDetail').innerHTML='<p class="text-gray-500">Panel ditutup. Klik node untuk membuka detail lagi.</p>';
  }
  function renderWorkflowAll(){ renderWorkflowCatalog(); renderWorkflowTabs(); renderWorkflowSummary(); renderWorkflowUseCases(); renderWorkflow(); }
  function initWorkflow(){ renderWorkflowAll(); }
