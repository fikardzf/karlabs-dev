'use strict';

const workflowCatalog = {
  lead: {
    icon:'message-circle', label:'Pertanyaan pelanggan', title:'Dari chat ke daftar tindak lanjut',
    short:'Siapa yang perlu dihubungi kembali?', basic:true, editableDraft:true, output:'Catatan calon pelanggan',
    intro:'Coba dua jenis pertanyaan. Admin mendapat ringkasan kebutuhan dan draf pertanyaan berikutnya.',
    input:'Pesan pelanggan', tools:'Chat atau formulir → catatan pelanggan → draf balasan',
    required:'Kontak balasan', issue:'Admin perlu tahu lewat mana pelanggan bisa dihubungi kembali.',
    nodes:[
      {title:'Baca pesan', output:'Ambil kebutuhan dan saluran balasan dari pertanyaan pelanggan.'},
      {title:'Catat kebutuhan', output:'Pisahkan pertanyaan menu dari permintaan pesanan acara agar tindak lanjutnya sesuai.'},
      {title:'Susun tindak lanjut', output:'Siapkan pertanyaan berikutnya untuk diperiksa admin.'}
    ],
    samples:[
      {id:'cafe', label:'Kedai kopi · Pilihan susu', code:'CHAT-014', from:'Chat kedai', message:'Kopi susu bisa dibuat pakai oat? Ada pilihan yang tidak terlalu manis?', need:'Pilihan susu dan gula', contact:'Chat kedai', assignment:'Admin kedai', reply:'Terima kasih sudah bertanya. Mau lihat pilihan susu oat dan tingkat gula untuk minuman dingin atau panas?'},
      {id:'bakery', label:'Toko roti · Konsumsi rapat', code:'CHAT-022', from:'Form toko roti', message:'Kami perlu roti untuk rapat 25 orang. Bisa pilih dua isian?', need:'Paket rapat untuk 25 orang', contact:'Email pada formulir', assignment:'Admin pesanan acara', reply:'Untuk rapat 25 orang, kapan roti dibutuhkan dan isian apa yang ingin dipilih? Kami bisa siapkan rincian paketnya.'}
    ],
    build(s) {
      return {fields:[['Kebutuhan',s.need],['Kontak balasan',s.contact]], finding:`Pertanyaan tentang ${s.need.toLowerCase()} masuk ke daftar ${s.assignment.toLowerCase()}.`,
        title:'Draf balasan pelanggan', draft:s.reply, reviewers:[s.assignment]};
    }
  },
  'order-basic': {
    icon:'receipt', label:'Pencatatan pesanan', title:'Dari pesan singkat ke nota pesanan',
    short:'Apa yang harus disiapkan hari ini?', basic:true, output:'Nota untuk admin toko',
    intro:'Ubah jumlah pesanan. Lihat barang, total, dan jadwal ambil yang akan diterima admin dalam satu catatan.',
    input:'Form pesanan', tools:'Form pesanan → buku pesanan → nota admin',
    required:'Jadwal ambil', issue:'Barang sudah diketahui, tetapi tim belum tahu kapan pesanan harus siap.',
    amount:{label:'Jumlah pesanan', key:'quantity', min:1, max:999},
    nodes:[
      {title:'Terima pesanan', output:'Baca produk, jumlah, harga satuan, dan jadwal ambil.'},
      {title:'Periksa nota', output:'Periksa jadwal ambil dan kalikan jumlah barang dengan harga satuan.'},
      {title:'Siapkan nota', output:'Tampilkan catatan yang bisa ditinjau admin sebelum diteruskan ke tim toko.'}
    ],
    samples:[
      {id:'cafe', label:'Kedai kopi · Kopi susu', code:'PS-018', from:'Form kedai', item:'kopi susu', quantity:2, price:22000, pickup:'Hari ini, 15.30', message:'Saya mau ambil kopi susu di kedai sore ini.'},
      {id:'bakery', label:'Toko roti · Croissant', code:'PS-026', from:'Form toko roti', item:'croissant', quantity:3, price:24000, pickup:'Besok, 08.00', message:'Tolong siapkan croissant untuk saya ambil besok pagi.'}
    ],
    build(s, quantity) {
      const total = quantity*s.price;
      return {fields:[['Pesanan',`${quantity} ${s.item}`],['Harga satuan',fmtRp(s.price)],['Jadwal ambil',s.pickup]],
        finding:`${quantity} × ${fmtRp(s.price)} = ${fmtRp(total)}. Jadwal pengambilan sudah tersedia.`,
        title:'Nota pengambilan', draft:`${s.code} · ${quantity} ${s.item} · Total ${fmtRp(total)}. Pengambilan: ${s.pickup}. Periksa nota sebelum menyiapkan pesanan.`, reviewers:['Admin toko']};
    }
  },
  email: {
    icon:'mail', label:'Balasan email', title:'Dari kotak masuk ke meja yang tepat',
    short:'Email mana yang perlu ditangani dulu?', editableDraft:true, output:'Draf balasan dan petugas',
    intro:'Bandingkan pertanyaan reseller dengan keluhan barang. Isi email menentukan petugas dan draf balasannya.',
    input:'Email masuk', tools:'Kotak masuk → kategori email → draf untuk petugas',
    required:'Judul email', issue:'Lengkapi judul agar petugas bisa mengenali percakapan yang harus ditinjau.',
    nodes:[
      {title:'Baca email', output:'Ambil judul dan isi dari kotak masuk contoh.'},
      {title:'Tentukan petugas', output:'Pertanyaan harga grosir diteruskan ke penjualan. Keluhan barang ditandai untuk layanan pelanggan.'},
      {title:'Siapkan balasan', output:'Tampilkan draf jawaban sesuai topik dan serahkan ke petugas untuk ditinjau.'}
    ],
    samples:[
      {id:'reseller', label:'Penawaran reseller', code:'EM-012', from:'Email toko', subject:'Daftar harga reseller', message:'Kami ingin menjual kembali produk Anda. Berapa minimal pembelian grosir?', kind:'grosir'},
      {id:'return', label:'Keluhan barang rusak', code:'EM-019', from:'Email layanan', subject:'Kemasan pesanan rusak', message:'Kemasan pesanan saya rusak saat diterima. Bagaimana cara meminta pemeriksaan?', kind:'keluhan'}
    ],
    build(s) {
      const complaint = s.kind === 'keluhan';
      const owner = complaint ? 'Layanan pelanggan' : 'Tim penjualan';
      return {fields:[['Judul email',s.subject],['Kotak masuk',s.from]], finding:complaint ? 'Keluhan ditandai untuk pemeriksaan petugas sebelum ada keputusan penggantian barang.' : 'Permintaan harga grosir masuk antrean tim penjualan.',
        title:`Draf email · ${owner}`, draft:complaint ? 'Terima kasih sudah memberi tahu kami. Boleh kirim nomor pesanan dan foto kemasannya agar tim dapat memeriksa kondisi barang?' : 'Terima kasih atas minat menjadi reseller. Produk dan kisaran jumlah berapa yang ingin dipesan? Tim kami akan menyiapkan penawaran grosir yang sesuai.',
        reviewers:[owner]};
    }
  },
  order: {
    icon:'package-check', label:'Kesiapan pengiriman', title:'Dari pesanan masuk ke daftar kemas',
    short:'Pesanan mana yang siap dikemas?', output:'Daftar kemas atau catatan penundaan',
    intro:'Coba pesanan lunas, stok kurang, atau pembayaran tertunda. Gudang hanya mendapat daftar kemas saat barang dan pembayaran siap.',
    input:'Pesanan toko pakaian', tools:'Buku pesanan → pemeriksaan pembayaran dan stok → tugas admin atau gudang',
    required:'Varian barang', issue:'Ukuran harus tercatat supaya stok yang diperiksa sesuai dengan pesanan.',
    amount:{label:'Stok tersedia (potong)', key:'stock', min:0, max:9999},
    nodes:[
      {title:'Buka pesanan', output:'Cocokkan nomor pesanan dengan varian yang diminta.'},
      {title:'Cek kesiapan', output:'Periksa pembayaran terlebih dahulu, lalu bandingkan jumlah pesanan dengan stok varian.'},
      {title:'Susun tugas', output:'Pesanan siap masuk daftar kemas. Sisanya menjadi tugas pemeriksaan atau pengadaan.'}
    ],
    samples:[
      {id:'ready', label:'Kemeja linen · Lunas', code:'KR-041', from:'Pesanan toko', item:'Kemeja linen', size:'M', qty:3, stock:8, paid:true, message:'Pesanan kemeja linen untuk dikirim dalam satu paket.'},
      {id:'short', label:'Celana chino · Lunas', code:'KR-047', from:'Pesanan toko', item:'Celana chino', size:'L', qty:5, stock:2, paid:true, message:'Pelanggan meminta lima celana chino dengan ukuran yang sama.'},
      {id:'pending', label:'Kaos polos · Transfer perlu diperiksa', code:'KR-052', from:'Pesanan toko', item:'Kaos polos', size:'XL', qty:2, stock:12, paid:false, message:'Pembeli sudah membuat pesanan. Pembayaran masih menunggu pemeriksaan.'}
    ],
    build(s, stock) {
      const fields = [['Varian barang',`${s.item} · ${s.size}`],['Dipesan',`${s.qty} potong`],['Stok',`${stock} potong`],['Pembayaran',s.paid?'Lunas':'Menunggu pemeriksaan']];
      if (!s.paid) return {fields, finding:'Pembayaran belum terverifikasi. Pengemasan ditahan.', title:'Tugas pemeriksaan pembayaran', draft:`Admin keuangan perlu mencocokkan pembayaran ${s.code} sebelum gudang menyiapkan ${s.qty} ${s.item.toLowerCase()}.`, reviewers:['Admin keuangan']};
      if (stock<s.qty) return {fields, finding:`Stok kurang ${s.qty-stock} potong untuk memenuhi seluruh pesanan.`, title:'Catatan kekurangan stok', draft:`Tahan ${s.code}. Konfirmasi ketersediaan ${s.qty-stock} ${s.item.toLowerCase()} ukuran ${s.size} lagi sebelum menentukan jadwal kirim.`, reviewers:['Admin stok']};
      return {fields, finding:`Pembayaran lunas dan ${stock} potong tersedia untuk pesanan ${s.qty} potong.`, title:'Daftar kemas', draft:`Siapkan ${s.qty} ${s.item.toLowerCase()} ukuran ${s.size} untuk ${s.code}. Cocokkan varian sebelum menutup paket.`, reviewers:['Petugas gudang']};
    }
  },
  approval: {
    icon:'clipboard-check', label:'Persetujuan belanja', title:'Dari permintaan belanja ke keputusan',
    short:'Siapa yang perlu menyetujui biaya?', output:'Lembar keputusan belanja',
    intro:'Ubah nominal belanja dan coba jadi pemeriksanya. Pada aturan contoh ini, pengajuan di atas Rp1 juta juga memerlukan persetujuan pemilik.',
    input:'Form pengajuan', tools:'Form belanja → aturan nominal → catatan persetujuan',
    required:'Bukti penawaran', issue:'Pemeriksa memerlukan penawaran pemasok sebagai dasar pengajuan.',
    amount:{label:'Nominal pengajuan (Rp)', key:'cost', min:1, max:100000000},
    nodes:[
      {title:'Buka pengajuan', output:'Baca kebutuhan, nominal belanja, dan lampiran penawaran.'},
      {title:'Tentukan pemeriksa', output:'Semua pengajuan melalui supervisor. Di atas Rp1.000.000, pemilik ikut meninjau.'},
      {title:'Minta keputusan', output:'Catat keputusan setiap pemeriksa atau kembalikan pengajuan untuk revisi.'}
    ],
    samples:[
      {id:'boxes', label:'Kemasan untuk toko roti', code:'BL-008', from:'Bagian produksi', item:'Kotak roti', cost:450000, proof:'Penawaran kotak roti', message:'Stok kemasan menipis. Tim produksi mengajukan pembelian kotak roti.'},
      {id:'printer', label:'Printer label untuk gudang', code:'BL-011', from:'Bagian gudang', item:'Printer label', cost:2400000, proof:'Penawaran printer label', message:'Gudang mengajukan printer label untuk meja pengemasan.'}
    ],
    build(s, amount) {
      const reviewers = amount>1000000 ? ['Supervisor','Pemilik usaha'] : ['Supervisor'];
      return {fields:[['Kebutuhan',s.item],['Nominal',fmtRp(amount)],['Bukti penawaran',s.proof]],
        finding:`${fmtRp(amount)} ${amount>1000000?'melewati':'masih dalam'} batas persetujuan supervisor. ${reviewers.length} pemeriksa diperlukan.`,
        title:'Lembar persetujuan belanja', draft:`${s.code} · ${s.item} · ${fmtRp(amount)}. Urutan pemeriksaan: ${reviewers.join(' → ')}.`, reviewers};
    }
  },
  inventory: {
    icon:'boxes', label:'Pengingat stok', title:'Dari hitungan rak ke daftar beli',
    short:'Barang apa yang perlu dipesan ulang?', output:'Usulan pembelian atau catatan stok',
    intro:'Masukkan jumlah yang tersisa di rak. Alur menghitung apakah stok cukup sampai kiriman berikutnya tiba.',
    input:'Catatan stok', tools:'Catatan rak → titik pesan → usulan pembelian',
    required:'Waktu kirim', issue:'Titik pesan belum bisa dihitung sebelum waktu kirim pemasok diketahui.',
    amount:{label:'Stok di rak (unit)', key:'stock', min:0, max:9999},
    nodes:[
      {title:'Baca kartu stok', output:'Ambil stok tersedia, pemakaian harian, waktu kirim, dan cadangan.'},
      {title:'Hitung titik pesan', output:'Titik pesan = pemakaian harian × waktu kirim + cadangan. Contoh ini mengasumsikan tidak ada kiriman dalam perjalanan.'},
      {title:'Susun daftar beli', output:'Pada atau di bawah titik pesan, isi kembali hingga titik pesan ditambah kebutuhan tiga hari.'}
    ],
    samples:[
      {id:'cups', label:'Kedai · Gelas kertas', code:'ST-032', from:'Rak kemasan', item:'Gelas kertas', daily:12, days:4, reserve:12, stock:36, message:'Gelas kertas dipakai setiap hari untuk pesanan bawa pulang.'},
      {id:'labels', label:'Toko roti · Label produk', code:'ST-037', from:'Rak kemasan', item:'Label roti', daily:8, days:3, reserve:10, stock:80, message:'Tim pengemasan selesai menghitung label yang tersisa di rak.'}
    ],
    build(s, stock) {
      const threshold = s.daily*s.days+s.reserve;
      const toBuy = stock<=threshold ? threshold+s.daily*3-stock : 0;
      return {fields:[['Barang',s.item],['Di rak',`${stock} unit`],['Pemakaian',`${s.daily} unit/hari`],['Waktu kirim',`${s.days} hari`],['Cadangan',`${s.reserve} unit`]],
        finding:`Titik pesan ${threshold} unit (${s.daily} × ${s.days} + ${s.reserve}). Stok di rak ${stock} unit.`,
        title:toBuy?'Usulan pembelian':'Catatan stok cukup', draft:toBuy ? `Usulkan ${toBuy} unit ${s.item.toLowerCase()}. Jumlah di rak ditambah usulan ini menjadi ${threshold+s.daily*3} unit sebelum pemakaian berikutnya. Periksa usulan sebelum memesan ke pemasok.` : `${s.item} masih di atas titik pesan. Catat hasil pengecekan hari ini.`,
        reviewers:['Admin pembelian']};
    }
  },
  ads: {
    icon:'megaphone', label:'Rekap iklan', title:'Dari biaya iklan ke catatan harian',
    short:'Kampanye mana yang perlu diperiksa?', output:'Ringkasan untuk pemilik usaha',
    intro:'Bandingkan belanja iklan dengan batas harian. Hasilnya menunjukkan sisa anggaran dan biaya per pesanan dari data contoh.',
    input:'Rekap kampanye', tools:'Ekspor iklan → cek anggaran → ringkasan harian',
    required:'Batas harian', issue:'Isi batas harian agar belanja kampanye bisa dibandingkan dengan anggarannya.',
    amount:{label:'Belanja iklan (Rp)', key:'spend', min:0, max:100000000},
    nodes:[
      {title:'Baca rekap', output:'Ambil nama kampanye, pengeluaran, jumlah pesanan, dan anggaran harian.'},
      {title:'Cek anggaran', output:'Bandingkan belanja dengan batas harian. Hitung biaya per pesanan hanya jika ada pesanan.'},
      {title:'Susun ringkasan', output:'Siapkan catatan untuk pemilik. Perubahan pada kampanye memerlukan keputusan pengelola iklan.'}
    ],
    samples:[
      {id:'launch', label:'Peluncuran koleksi linen', code:'IK-015', from:'Ekspor iklan toko', name:'Koleksi linen', spend:180000, budget:250000, orders:6, message:'Tim toko merangkum pengeluaran iklan peluncuran koleksi linen.'},
      {id:'promo', label:'Promo akhir pekan', code:'IK-018', from:'Ekspor iklan toko', name:'Promo akhir pekan', spend:320000, budget:300000, orders:0, message:'Pemilik ingin memeriksa belanja promo sebelum kampanye dilanjutkan.'}
    ],
    build(s, spend) {
      const delta=s.budget-spend;
      const position=delta<0 ? `Lewat batas harian ${fmtRp(-delta)}` : delta===0 ? 'Tepat di batas harian' : `Sisa anggaran ${fmtRp(delta)}`;
      return {fields:[['Kampanye',s.name],['Belanja',fmtRp(spend)],['Batas harian',fmtRp(s.budget)],['Pesanan',String(s.orders)]],
        finding:`${position}. ${s.orders ? 'Biaya per pesanan '+fmtRp(spend/s.orders)+'.' : 'Belum ada pesanan untuk menghitung biaya per pesanan.'}`,
        title:delta<=0?'Catatan pemeriksaan anggaran':'Rekap belanja hari ini',
        draft:`${s.name} · ${fmtRp(spend)} dari ${fmtRp(s.budget)} · ${s.orders} pesanan. ${delta<=0 ? 'Periksa hasil kampanye sebelum menambah anggaran.' : 'Catat pemakaian anggaran untuk rekap pemilik.'}`, reviewers:['Pengelola iklan']};
    }
  }
};


let currentPreset = 'lead';
let workflowStep = -1;
let workflowReviews = 0;
let workflowBlocked = false;
let workflowRevision = false;
let workflowEditingDraft = false;
let workflowEditedDraft = '';

function updateWorkflowInquiry() {
  const flow = workflowCatalog[currentPreset];
  const href = 'https://wa.me/'+WA_NUMBER+'?text='+encodeURIComponent(
    `Halo KAR Labs, saya mencoba Business Automation bagian ${flow.label}. Saya ingin membahas alur dari ${flow.input.toLowerCase()} hingga ${flow.output.toLowerCase()} untuk usaha saya. Data dan alat apa yang perlu disiapkan?`);
  for (const link of $$('.project-inquiry a[data-lead-service="workflow"], .studio-header .consult-link[data-lead-service="workflow"], #cta-workflow a.btn-primary, #serviceGuide a[data-lead-service="workflow"]')) {
    link.href = href;
    if (!link.closest('.studio-header, #serviceGuide')) link.textContent = 'Bahas alur '+flow.label.toLowerCase()+' ↗';
  }
}

function workflowSample() {
  return workflowCatalog[currentPreset].samples.find(item=>item.id === $('#workflowSample').value);
}

function renderWorkflowCase() {
  const flow = workflowCatalog[currentPreset];
  const sample = workflowSample();
  const amountInput = $('#workflowAmount');
  const validAmount = !flow.amount || amountInput.validity.valid;
  const result = validAmount ? flow.build(sample,amountInput.valueAsNumber) : null;
  const missing = $('#workflowDataState').value === 'missing';
  const started = workflowStep >= 0;
  const lastStep = flow.nodes.length-1;
  const hasDraft = workflowStep === lastStep;
  const approved = hasDraft && workflowReviews === result.reviewers.length;
  const html = escapeCatalogHtml;

  $('#workflowSample').disabled = started;
  $('#workflowDataState').disabled = workflowStep > 0;
  amountInput.readOnly = started;
  $('#workflowMessage').textContent = sample.message;
  $('#workflowSource').textContent = sample.from+' · '+sample.code;
  $('#workflowFields').innerHTML = (result?.fields || []).map(([label,value])=>{
    const absent = missing && label === flow.required;
    return `<div><dt>${html(label)}</dt><dd${absent ? ' class="field-missing"' : ''}>${absent ? 'Belum diisi' : html(value)}</dd></div>`;
  }).join('');

  $('#workflowProgress').innerHTML = flow.nodes.map((node,i)=>{
    const current = i === workflowStep;
    const done = i < workflowStep || approved;
    return `<li${current && !approved ? ' aria-current="step"' : ''} class="${done ? 'is-done' : ''}"><span aria-hidden="true">${done ? '✓' : i+1}</span>${html(node.title)}</li>`;
  }).join('');
  $('#workflowGuideError').hidden = !workflowBlocked;
  $('#workflowErrorMessage').textContent = workflowBlocked ? `${flow.required} belum diisi. ${flow.issue}` : '';
  $('#repairWorkflowData').textContent = 'Lengkapi '+flow.required.toLowerCase()+' dari contoh';

  let status = 'Hasil yang akan disiapkan: '+flow.output.toLowerCase()+'.';
  if (!validAmount) status = `Isi ${flow.amount.label.toLowerCase()} dengan bilangan bulat dari ${fmtNum(flow.amount.min)} sampai ${fmtNum(flow.amount.max)}.`;
  else if (workflowRevision) status = 'Dikembalikan untuk revisi. Periksa masukan, lalu jalankan ulang.';
  else if (workflowStep === 0) status = workflowBlocked ? 'Proses menunggu data yang diperlukan.' : `${sample.code} diterima. Lanjutkan ke pemeriksaan.`;
  else if (workflowStep === 1) status = result.finding;
  else if (hasDraft) status = approved ? 'Pemeriksaan simulasi selesai.' : 'Hasil siap ditinjau oleh '+result.reviewers[workflowReviews]+'.';
  $('#workflowGuideStatus').textContent = status;

  $('#startWorkflowGuide').hidden = started;
  $('#startWorkflowGuide').textContent = workflowRevision ? 'Jalankan setelah revisi' : 'Mulai simulasi';
  $('#nextWorkflowStep').hidden = !started || hasDraft;
  $('#nextWorkflowStep').disabled = workflowBlocked;
  if (started && !hasDraft) $('#nextWorkflowStep').textContent = flow.nodes[workflowStep+1].title;
  $('#resetWorkflowGuide').hidden = !started && !workflowRevision;
  $('#workflowRecord').hidden = !hasDraft;
  if (hasDraft) {
    $('#workflowResultCode').textContent = 'Hasil simulasi · '+sample.code;
    $('#workflowResultTitle').textContent = result.title;
    const draft = $('#workflowOutputText');
    draft.textContent = workflowEditedDraft || result.draft;
    draft.hidden = workflowEditingDraft;
    $('#workflowDraftEditor').hidden = !workflowEditingDraft;
    const reviewed = result.reviewers.slice(0,workflowReviews);
    const approval = currentPreset === 'approval';
    const receipt = reviewed.length ? (approval ? 'Disetujui oleh ' : 'Ditinjau oleh ')+reviewed.join(' dan ')+'. ' : '';
    $('#workflowReviewStatus').textContent = receipt+(approved ? 'Tercatat dalam simulasi ini.' : 'Menunggu '+result.reviewers[workflowReviews]+'.');
    $('#workflowApprove').hidden = approved || workflowEditingDraft;
    $('#workflowRevise').hidden = approved || workflowEditingDraft;
    $('#workflowRevise').textContent = flow.editableDraft ? 'Sunting draf' : 'Minta revisi';
    if (!approved) $('#workflowApprove').textContent = (approval ? 'Setujui sebagai ' : 'Tinjau sebagai ')+result.reviewers[workflowReviews];
  }
}

function resetWorkflowCase(restoreInputs) {
  workflowStep = -1;
  workflowReviews = 0;
  workflowBlocked = false;
  workflowRevision = !restoreInputs;
  workflowEditingDraft = false;
  workflowEditedDraft = '';
  $('#workflowDraftText').value = '';
  $('#workflowOutputText').textContent = '';
  if (restoreInputs) {
    $('#workflowDataState').value = 'valid';
    const amount = workflowCatalog[currentPreset].amount;
    if (amount) $('#workflowAmount').value = workflowSample()[amount.key];
  }
  renderWorkflowCase();
}

function selectWorkflow(preset) {
  currentPreset = preset;
  const flow = workflowCatalog[preset];
  $('#workflowScenario').value = preset;
  $$('#workflowCatalog button').forEach(button=>button.setAttribute('aria-pressed', String(button.dataset.preset === preset)));
  $('#workflowTitle').textContent = flow.title;
  $('#workflowComplexity').textContent = flow.basic ? 'Simulasi · Alur dasar' : 'Simulasi · Alur lanjutan';
  $('#workflowSummary').textContent = flow.intro;
  $('#workflowInputTitle').textContent = flow.input;
  $('#workflowTools').textContent = flow.tools;
  $('#workflowStepNotes').innerHTML = flow.nodes.map(node=>`<li><b>${escapeCatalogHtml(node.title)}</b><p>${escapeCatalogHtml(node.output)}</p></li>`).join('');
  $('#workflowSample').replaceChildren(...flow.samples.map(s=>new Option(s.label,s.id)));
  $('#workflowDataState').options[1].textContent = flow.required+' belum diisi';
  $('#workflowAmountLabel').hidden = !flow.amount;
  $('#workflowAmount').disabled = !flow.amount;
  if (flow.amount) {
    $('#workflowAmountPrompt').textContent = flow.amount.label;
    $('#workflowAmount').min = flow.amount.min;
    $('#workflowAmount').max = flow.amount.max;
  }
  resetWorkflowCase(true);
  updateWorkflowInquiry();
}

function initWorkflow() {
  const picker = $('#workflowScenario');
  const directory = $('#workflowCatalog');
  const entries = Object.entries(workflowCatalog);
  picker.replaceChildren(...entries.map(([id,flow])=>new Option(flow.label,id)));
  directory.innerHTML = entries.map(([id,flow])=>`
    <button type="button" data-preset="${id}" aria-controls="workflowCase" aria-pressed="false">
      <span class="automation-menu-icon" aria-hidden="true"><i data-lucide="${flow.icon}"></i></span>
      <span><b>${escapeCatalogHtml(flow.label)}</b><small>${escapeCatalogHtml(flow.short)}</small></span>
    </button>`).join('');
  refreshIcons();
  directory.onclick = event=>{
    const button = event.target.closest('button[data-preset]');
    if (!button || button.dataset.preset === currentPreset) return;
    picker.value = button.dataset.preset;
    picker.dispatchEvent(new Event('change',{bubbles:true}));
  };
  picker.onchange = ()=>selectWorkflow(picker.value);
  $('#workflowSample').onchange = ()=>resetWorkflowCase(true);
  $('#workflowAmount').oninput = renderWorkflowCase;
  $('#workflowDataState').onchange = ()=>{
    workflowBlocked = false;
    renderWorkflowCase();
  };
  $('#startWorkflowGuide').onclick = ()=>{
    if (workflowStep !== -1) return;
    if (workflowCatalog[currentPreset].amount && !$('#workflowAmount').reportValidity()) return;
    workflowRevision = false;
    workflowStep = 0;
    renderWorkflowCase();
    $('#nextWorkflowStep').focus({preventScroll:true});
  };
  $('#nextWorkflowStep').onclick = ()=>{
    const flow = workflowCatalog[currentPreset];
    if (workflowStep < 0 || workflowStep >= flow.nodes.length-1) return;
    if (workflowStep === 0 && $('#workflowDataState').value === 'missing') {
      workflowBlocked = true;
      renderWorkflowCase();
      $('#repairWorkflowData').focus();
      return;
    }
    workflowStep++;
    renderWorkflowCase();
    if (workflowStep === flow.nodes.length-1) $('#workflowResultTitle').focus();
  };
  $('#repairWorkflowData').onclick = ()=>{
    $('#workflowDataState').value = 'valid';
    workflowBlocked = false;
    renderWorkflowCase();
    $('#workflowGuideStatus').textContent = workflowCatalog[currentPreset].required+' sudah dilengkapi. Pemeriksaan bisa dilanjutkan.';
    $('#nextWorkflowStep').focus();
  };
  $('#workflowApprove').onclick = ()=>{
    if ($('#workflowApprove').hidden || workflowStep !== workflowCatalog[currentPreset].nodes.length-1) return;
    workflowReviews++;
    renderWorkflowCase();
    if ($('#workflowApprove').hidden) $('#workflowReviewStatus').focus({preventScroll:true});
  };
  $('#workflowRevise').onclick = ()=>{
    if (workflowCatalog[currentPreset].editableDraft) {
      const input = $('#workflowDraftText');
      input.value = $('#workflowOutputText').textContent;
      input.setCustomValidity('');
      workflowEditingDraft = true;
      renderWorkflowCase();
      input.focus();
      return;
    }
    resetWorkflowCase(false);
    (workflowCatalog[currentPreset].amount ? $('#workflowAmount') : $('#workflowSample')).focus();
  };
  $('#workflowDraftText').oninput = event=>event.target.setCustomValidity('');
  $('#workflowDraftEditor').onsubmit = event=>{
    event.preventDefault();
    const input = $('#workflowDraftText');
    const text = input.value.trim();
    if (!text) {
      input.setCustomValidity('Tulis isi balasan sebelum menyimpan draf.');
      input.reportValidity();
      return;
    }
    workflowEditedDraft = text;
    workflowEditingDraft = false;
    renderWorkflowCase();
    $('#workflowApprove').focus();
  };
  $('#cancelWorkflowEdit').onclick = ()=>{
    workflowEditingDraft = false;
    renderWorkflowCase();
    $('#workflowRevise').focus();
  };
  $('#resetWorkflowGuide').onclick = ()=>{
    resetWorkflowCase(true);
    $('#startWorkflowGuide').focus();
  };
  selectWorkflow(currentPreset);
}
