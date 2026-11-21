/* KAR Labs v2.6.0 - Workflow automation demo */
'use strict';
  const workflowCatalog = {
    email:{
      icon:'📧', label:'Balasan email', title:'Email masuk hingga draft balasan', short:'Tinjau contoh pengelompokan email, draft jawaban, dan persetujuan admin.', complexity:'Medium', tools:['Gmail','AI','Sheets','CRM'],
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
      icon:'📦', label:'Pemrosesan pesanan', title:'Pesanan hingga pembaruan status', short:'Tinjau contoh pemeriksaan pembayaran, stok, dan pemberitahuan pesanan.', complexity:'Advanced', tools:['Shopify','WhatsApp','Sheets','Warehouse'],
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
      icon:'🎯', label:'Prioritas calon pelanggan', title:'Pencatatan hingga pembagian tindak lanjut', short:'Contoh pencatatan kebutuhan, pemeriksaan data, dan penentuan tindak lanjut.', complexity:'Advanced', tools:['Form','WhatsApp','CRM','Sheets'],
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
      icon:'✅', label:'Persetujuan pengajuan', title:'Pengajuan hingga persetujuan', short:'Tinjau contoh validasi, persetujuan berjenjang, dan pengingat pengajuan.', complexity:'Advanced', tools:['Form','Lark','Email','Sheets'],
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
      icon:'📦', label:'Pengingat stok', title:'Data stok hingga daftar pemesanan', short:'Tinjau contoh perhitungan kebutuhan stok dan draft daftar pembelian.', complexity:'Advanced', tools:['Sheets','ERP/OMS','Email','WhatsApp'],
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
      icon:'📣', label:'Laporan iklan', title:'Data iklan hingga ringkasan laporan', short:'Tinjau contoh pengolahan biaya, hasil iklan, dan pengingat anggaran.', complexity:'Medium-Advanced', tools:['Meta Ads','Sheets','Email','Dashboard'],
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
  }; let currentPreset='lead';
  Object.assign(workflowCatalog, {
    lead:{label:'Pertanyaan pelanggan',icon:'💬',title:'Pertanyaan pelanggan menjadi catatan follow-up',short:'Ikuti perubahan pertanyaan contoh menjadi catatan calon pelanggan dan draft tindak lanjut.',complexity:'Alur dasar',tools:['Form','Catatan lead','Draft follow-up'],outcomes:['Kebutuhan pelanggan dicatat secara terstruktur.','Admin dapat memeriksa kontak sebelum tindak lanjut.','Pesan follow-up disiapkan untuk ditinjau.'],nodes:[
      {title:'Pertanyaan masuk',sub:'Terima kebutuhan',type:'Trigger',platform:'Form atau chat sesuai scope',config:'Terima kebutuhan dari data contoh.',condition:'Ada pertanyaan baru.',output:'Kebutuhan katalog dicatat sebagai input.'},
      {title:'Catat calon pelanggan',sub:'Periksa kontak',type:'Action',platform:'Catatan atau spreadsheet sesuai scope',config:'Periksa kelengkapan kontak dan kebutuhan.',condition:'Kontak contoh sudah lengkap.',output:'Catatan lead siap ditinjau admin.'},
      {title:'Siapkan follow-up',sub:'Tinjau draft',type:'Output',platform:'Draft untuk admin',config:'Susun tindak lanjut dari kebutuhan yang dicatat.',condition:'Admin memeriksa isi sebelum mengirim.',output:'Draft pertanyaan lanjutan tersedia. Tidak ada pesan dikirim.'}
    ]},
    'order-basic':{label:'Pencatatan order',icon:'📦',title:'Order masuk, data dicatat, admin diberi tahu',short:'Lihat contoh pemeriksaan data order hingga draft pemberitahuan untuk admin.',complexity:'Alur dasar',tools:['Form order','Catatan order','Draft notifikasi'],outcomes:['Detail order memiliki satu catatan acuan.','Data yang belum lengkap diperiksa sebelum proses lanjut.','Admin mempunyai draft pembaruan untuk ditinjau.'],nodes:[
      {title:'Order diterima',sub:'Terima data',type:'Trigger',platform:'Form atau platform usaha sesuai scope',config:'Baca pesanan contoh dari browser.',condition:'Ada data order contoh.',output:'Input order tersedia.'},
      {title:'Periksa dan catat',sub:'Validasi data',type:'Action',platform:'Catatan order sesuai scope',config:'Periksa kontak sebelum mencatat status order.',condition:'Data order contoh lengkap.',output:'Order contoh tercatat dalam simulasi.'},
      {title:'Siapkan notifikasi',sub:'Tinjau hasil',type:'Output',platform:'Draft notifikasi',config:'Siapkan pemberitahuan untuk admin.',condition:'Catatan contoh sudah diperiksa.',output:'Draft pemberitahuan tersedia. Tidak ada pesan dikirim.'}
    ]}
  });
  let workflowGuideStep=-1;
  function renderWorkflowCatalog(){
    const entries=Object.entries(workflowCatalog).sort(([a],[b])=>Number(!['lead','order-basic'].includes(a))-Number(!['lead','order-basic'].includes(b)));
    $('#workflowCatalog').innerHTML=entries.map(([key,w])=>`<button type="button" data-preset="${key}" aria-pressed="${key===currentPreset}" class="workflow-catalog-card text-left glass rounded-3xl p-5 border border-dark-border hover:border-accent/70 transition-all">
      <div class="flex items-start justify-between gap-3 mb-4"><span class="workflow-reference-icon" aria-hidden="true">${w.icon || '⚙️'}</span><span class="text-[11px] border border-dark-border rounded-full px-2 py-1 text-gray-400">${w.complexity==='Alur dasar'?'Alur dasar':'Referensi lanjutan'}</span></div>
      <h4 class="font-heading text-lg font-bold mb-2">${w.label}</h4><p class="text-sm text-gray-400 leading-relaxed mb-4">${w.short}</p>
      <div class="flex flex-wrap gap-2">${w.tools.slice(0,3).map(t=>`<span class="text-[11px] rounded-full bg-black/35 border border-dark-border px-2 py-1 text-gray-400">${t}</span>`).join('')}</div>
    </button>`).join('');
    $$('.workflow-catalog-card').forEach(card=>card.onclick=()=>{currentPreset=card.dataset.preset;renderWorkflowAll();$(`#workflowCatalog [data-preset="${currentPreset}"]`).focus({preventScroll:true});});
    const picker=$('#workflowScenario');
    picker.innerHTML=entries.map(([key,w])=>`<option value="${key}">${w.label}</option>`).join('');
    picker.value=currentPreset;
    picker.onchange=()=>{currentPreset=picker.value;renderWorkflowAll();};
  }
  function renderWorkflowSummary(){
    const w=workflowCatalog[currentPreset];
    $('#workflowSummary').innerHTML=`<p>${w.short}</p><p class="showroom-note">Contoh alat: ${w.tools.join(', ')}. Tanpa integrasi aktif; pilihan platform mengikuti penawaran.</p>`;
  }
  function renderWorkflowUseCases(){
    const w=workflowCatalog[currentPreset];
    $('#workflowUseCases').innerHTML=`<h4>Contoh tujuan alur</h4><ul>${w.outcomes.map(item=>`<li>${item}</li>`).join('')}</ul>`;
  }
  function renderWorkflow(){
    const w=workflowCatalog[currentPreset]; const nodes=w.nodes;
    $('#workflowTitle').textContent=w.title;
    $('#workflowComplexity').innerHTML=`<span class="landing-pill">${w.complexity==='Alur dasar'?'Alur dasar':'Referensi lanjutan'}</span><span class="landing-pill">${nodes.length} langkah</span>`;
    $('#workflowViz').innerHTML=nodes.map((n,i)=>`<button type="button" class="workflow-node" data-i="${i}" aria-pressed="false"><span class="workflow-step-number">Langkah ${i+1}</span><b>${n.title}</b><span>${n.sub}</span></button>`).join('');
    $$('.workflow-node').forEach(n=>{n.setAttribute('aria-controls','nodeDetail');n.onclick=()=>showNode(Number(n.dataset.i));}); showNode(0);
  }
  function showNode(i){
    $$('.workflow-node').forEach(n=>{n.classList.remove('active');n.setAttribute('aria-pressed','false');}); const node=$$('.workflow-node')[i]; if(node){node.classList.add('active');node.setAttribute('aria-pressed','true');} const n={icon:'',...workflowCatalog[currentPreset].nodes[i]};
    $('#nodeDetail').innerHTML=`<div class="flex justify-between gap-4 mb-4"><div><p class="text-accent text-sm font-bold">Langkah ${i+1}</p><h4 class="font-heading text-2xl font-bold"><span aria-hidden="true">${n.icon}</span> ${n.title}</h4></div><button id="closeNode" class="text-gray-500 hover:text-white"><i data-lucide="x" class="w-5 h-5"></i></button></div><div class="space-y-4 text-sm"><div><p class="text-gray-500">Platform</p><b>${n.platform}</b></div><div><p class="text-gray-500">Cara kerja</p><p class="text-gray-300">${n.config}</p></div><div><p class="text-gray-500">Syarat</p><p class="text-gray-300">${n.condition}</p></div><div><p class="text-gray-500">Hasil contoh</p><p class="text-gray-300">${n.output||'-'}</p></div></div>`; refreshIcons(); $('#closeNode').onclick=()=>{$('#nodeDetail').innerHTML='<p class="text-gray-500">Detail ditutup. Pilih langkah untuk membukanya kembali.</p>';$('.workflow-node.active')?.focus({preventScroll:true});};
    $('#closeNode').setAttribute('aria-label','Tutup detail langkah');
  }
  function renderWorkflowRecord(){
    const started=workflowGuideStep>=0;
    const order=currentPreset.startsWith('order');
    const status=workflowGuideStep<0?'Belum dimulai':workflowGuideStep===0?'Data contoh diterima':workflowGuideStep===1?'Catatan contoh diperiksa':'Draft tindak lanjut tersedia';
    const workflow=workflowCatalog[currentPreset];
    $('#workflowProgress').innerHTML = workflow.nodes.map((step, i) =>
      `<li class="${i <= workflowGuideStep ? 'filled' : ''}"${i === workflowGuideStep ? ' aria-current="step"' : ''}><span aria-hidden="true">${i < workflowGuideStep ? '✓' : i + 1}</span>${step.title}</li>`).join('');
    const basic=currentPreset==='lead'||currentPreset==='order-basic';
    $('#workflowSampleLabel').hidden = !basic;
    $('#workflowSample').disabled = started;
    const bakery = $('#workflowSample').value === 'bakery';
    const shop = bakery ? 'Toko roti contoh' : 'Kedai kopi contoh';
    const request = order ? (bakery ? '3 croissant' : '2 kopi susu') : (bakery ? 'Daftar roti dan pilihan isian' : 'Daftar minuman dan pilihan susu');
    const draft = order ? `Pesanan ${request} tercatat untuk ${shop}. Mohon periksa sebelum disiapkan.` : `Terima kasih sudah bertanya tentang ${request.toLowerCase()}. Pilihan mana yang ingin Anda lihat?`;
    const node=workflow.nodes[workflowGuideStep];
    const fields=basic?`<div><dt>Usaha</dt><dd>${shop}</dd></div><div><dt>Kebutuhan</dt><dd>${request}</dd></div><div><dt>Status</dt><dd>${status}</dd></div>`:started?`<div><dt>Alur</dt><dd>${workflow.label}</dd></div><div><dt>Langkah saat ini</dt><dd>${node.title}</dd></div><div><dt>Hasil contoh</dt><dd>${escapeCatalogHtml(node.output)}</dd></div>`:'';
    $('#workflowRecord').innerHTML=started?`<h4>${basic?'Catatan '+(order?'order':'calon pelanggan')+' contoh':'Catatan simulasi'}</h4><dl>${fields}</dl>${basic && workflowGuideStep===workflow.nodes.length-1 ? `<blockquote class="workflow-draft">${draft}</blockquote>` : ''}<p class="showroom-note">${workflowGuideStep===workflow.nodes.length-1?'Selesai di browser. Draft belum dikirim ke siapa pun.':'Lanjutkan untuk melihat perubahan catatan.'}</p>`:'<p>Belum ada catatan contoh. Tekan Mulai panduan untuk melihat alurnya.</p>';
    $('#nextWorkflowStep').disabled=!started||workflowGuideStep>=workflowCatalog[currentPreset].nodes.length-1;
    $('#startWorkflowGuide').disabled=started;
  }
  function resetWorkflowGuide(){
    workflowGuideStep=-1;
    $('#workflowGuideError').hidden=true;
    $('#workflowDataState').value='valid';
    $('#workflowGuideStatus').textContent='Pilih skenario dan mulai panduan, atau buka langkah untuk melihat detail.';
    renderWorkflowRecord();
    showNode(0);
  }
  function renderWorkflowAll(){ renderWorkflowCatalog(); renderWorkflowSummary(); renderWorkflowUseCases(); renderWorkflow(); resetWorkflowGuide(); }
  function initWorkflow(){
    renderWorkflowAll();
    $('#startWorkflowGuide').onclick=()=>{workflowGuideStep=0;showNode(0);renderWorkflowRecord();$('#workflowGuideStatus').textContent='Data contoh diterima. Lanjutkan untuk memeriksa catatan.';};
    $('#nextWorkflowStep').onclick=()=>{
      if(workflowGuideStep<0||workflowGuideStep>=workflowCatalog[currentPreset].nodes.length-1)return;
      if(workflowGuideStep===0&&$('#workflowDataState').value==='missing'){
        $('#workflowGuideError').hidden=false;
        $('#workflowGuideStatus').textContent='Proses berhenti sebelum pencatatan karena kontak contoh belum lengkap.';
        return;
      }
      workflowGuideStep++;
      $('#workflowGuideError').hidden=true;
      showNode(workflowGuideStep);renderWorkflowRecord();
      $('#workflowGuideStatus').textContent=`Langkah ${workflowGuideStep+1} dari ${workflowCatalog[currentPreset].nodes.length}: ${workflowCatalog[currentPreset].nodes[workflowGuideStep].title}.`;
    };
    $('#repairWorkflowData').onclick=()=>{$('#workflowDataState').value='valid';$('#workflowGuideError').hidden=true;$('#workflowGuideStatus').textContent='Kontak contoh sudah dilengkapi. Tekan Langkah berikutnya untuk mencoba lagi.';$('#nextWorkflowStep').focus();};
    $('#resetWorkflowGuide').onclick=resetWorkflowGuide;
  }
