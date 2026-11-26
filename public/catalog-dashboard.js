'use strict';

let financeBar, financePie;
let currentDashboard = 'finance';
let currentDashboardRows = [];

const reportTransactions = [
  {tanggal:'2024-01-01', kategori:'Penjualan', deskripsi:'Pesanan kaos', jumlah:350000, tipe:'masuk'},
  {tanggal:'2024-01-02', kategori:'Bahan', deskripsi:'Beli bahan baku', jumlah:150000, tipe:'keluar'},
  {tanggal:'2024-01-03', kategori:'Penjualan', deskripsi:'Pesanan celana jeans', jumlah:500000, tipe:'masuk'},
  {tanggal:'2024-01-04', kategori:'Promosi', deskripsi:'Iklan Instagram', jumlah:100000, tipe:'keluar'},
  {tanggal:'2024-01-05', kategori:'Penjualan', deskripsi:'Pesanan hoodie', jumlah:275000, tipe:'masuk'},
  {tanggal:'2024-01-06', kategori:'Utilitas', deskripsi:'Listrik dan internet', jumlah:350000, tipe:'keluar'},
  {tanggal:'2024-01-07', kategori:'Penjualan', deskripsi:'Pesanan kaos premium', jumlah:450000, tipe:'masuk'},
  {tanggal:'2024-01-08', kategori:'Gaji', deskripsi:'Upah paruh waktu', jumlah:500000, tipe:'keluar'},
  {tanggal:'2024-01-09', kategori:'Penjualan', deskripsi:'Pesanan paket pakaian', jumlah:650000, tipe:'masuk'},
  {tanggal:'2024-01-10', kategori:'Kemasan', deskripsi:'Kantong dan kardus', jumlah:85000, tipe:'keluar'},
  {tanggal:'2024-01-11', kategori:'Penjualan', deskripsi:'Pesanan jaket denim', jumlah:725000, tipe:'masuk'},
  {tanggal:'2024-01-12', kategori:'Promosi', deskripsi:'Iklan marketplace', jumlah:200000, tipe:'keluar'}
];

const inventoryItems = [
  {sku:'Karpet mobil', stock:42, daily:8, lead:14, buffer:35, cost:18500000, averageStockValue:7300000},
  {sku:'Kamera dasbor', stock:92, daily:3, lead:21, buffer:18, cost:24000000, averageStockValue:9200000},
  {sku:'Adaptor CarPlay', stock:110, daily:2, lead:30, buffer:15, cost:26500000, averageStockValue:11000000},
  {sku:'Wiper hibrida', stock:115, daily:12, lead:5, buffer:15, cost:9800000, averageStockValue:4100000},
  {sku:'Kit perawatan cat', stock:125, daily:4, lead:18, buffer:20, cost:13600000, averageStockValue:5400000}
];

const adChannels = [
  {name:'Meta Ads', spend:5200000, revenue:21400000, orders:68, margin:48},
  {name:'Google Search', spend:3100000, revenue:17600000, orders:54, margin:45},
  {name:'TikTok Ads', spend:2800000, revenue:9800000, orders:38, margin:42},
  {name:'Shopee Ads', spend:4400000, revenue:22600000, orders:102, margin:38}
];

const dashboardReports = {
  finance: {
    name:'Arus kas', source:'Toko pakaian · Buku kas', title:'Kas toko selama periode ini',
    intro:'Pilih periode atau catat satu transaksi. Lihat apakah penjualan cukup untuk menutup pembayaran toko.',
    brief:'mencatat uang masuk, pengeluaran per kategori, dan perubahan kas harian',
    build:buildCashReport
  },
  sales: {
    name:'Penjualan', source:'Percetakan · Rekap penawaran', title:'Dari tanya harga sampai bayar',
    intro:'Satu kelompok pelanggan menelusuri katalog cetak hingga membayar. Coba lihat hasilnya jika beberapa penawaran lagi disetujui dan dibayar.',
    prompt:'Penawaran tambahan yang dibayar', options:[[0,'Kondisi awal'],[5,'5 penawaran lagi'],[15,'15 penawaran lagi']],
    brief:'melacak penawaran yang sudah dikirim dan berapa yang menjadi pesanan dibayar',
    build:buildSalesReport
  },
  inventory: {
    name:'Persediaan', source:'Toko aksesori mobil · Kartu stok', title:'Urutan belanja ke pemasok',
    intro:'Bandingkan stok di rak dengan kebutuhan selama menunggu kiriman. Coba mundurkan waktu tiba untuk melihat barang yang ikut mendesak.',
    prompt:'Waktu kiriman pemasok', options:[[0,'Sesuai jadwal'],[3,'Terlambat 3 hari'],[7,'Terlambat 7 hari']],
    brief:'menandai barang yang perlu dipesan berdasarkan penjualan harian dan waktu kirim pemasok',
    build:buildStockReport
  },
  marketing: {
    name:'Iklan', source:'Toko online · Rekap kampanye', title:'Apa yang tersisa setelah biaya iklan?',
    intro:'Bandingkan empat kanal dari omzet hingga sisa margin. Coba potong margin produk untuk melihat kanal yang paling terdampak.',
    prompt:'Margin produk per kanal', options:[[0,'Margin awal'],[5,'Turun 5 poin persentase'],[15,'Turun 15 poin persentase']],
    brief:'membandingkan biaya iklan, pesanan, dan sisa margin per kanal',
    build:buildAdReport
  }
};

const reportScenarios = {sales:0, inventory:0, marketing:0};
const reportDecimal = n => n.toLocaleString('id-ID', {maximumFractionDigits:1});
const reportPercent = n => reportDecimal(n) + '%';
const reportFraction = (n, total) => total ? n / total * 100 : 0;
const reportDate = date => new Date(date + 'T12:00:00').toLocaleDateString('id-ID', {day:'numeric',month:'short',year:'numeric'});
const sumField = (rows, key) => rows.reduce((sum, row) => sum + row[key], 0);

function cashPeriodRows() {
  const sorted = [...reportTransactions].sort((a,b) => a.tanggal.localeCompare(b.tanggal));
  if (!sorted.length) return [];
  const period = $('#financePeriod').value;
  const weekStart = Date.parse(sorted.at(-1).tanggal) - 6 * 86400000;
  return sorted.filter(t => period === 'week' ? Date.parse(t.tanggal) >= weekStart : t.tanggal.startsWith(period));
}

function buildCashReport() {
  const expenses = new Map();
  const days = new Map();
  let income = 0, outflow = 0;
  const rows = cashPeriodRows().map(t => {
    const day = days.get(t.tanggal) || {masuk:0, keluar:0};
    day[t.tipe] += t.jumlah;
    days.set(t.tanggal, day);
    if (t.tipe === 'masuk') income += t.jumlah;
    else {
      outflow += t.jumlah;
      expenses.set(t.kategori, (expenses.get(t.kategori) || 0) + t.jumlah);
    }
    return {Tanggal:t.tanggal, Kategori:t.kategori, Deskripsi:t.deskripsi, Jumlah:t.jumlah, Tipe:t.tipe, Saldo:income-outflow};
  });
  const balance = income - outflow;
  const largest = [...expenses].sort((a,b) => b[1]-a[1])[0];
  const dates = [...days.keys()];
  const note = largest ? `Pengeluaran terbesar ada pada kategori ${largest[0]} (${fmtRp(largest[1])}).` : 'Belum ada pengeluaran yang dicatat pada periode ini.';
  const sales = rows.reduce((sum,row)=>sum + (row.Tipe === 'masuk' && row.Kategori.toLowerCase() === 'penjualan' ? row.Jumlah : 0),0);
  const operatingCategories = ['gaji','utilitas','promosi','kemasan'];
  const operatingCost = rows.reduce((sum,row)=>sum + (row.Tipe === 'keluar' && operatingCategories.includes(row.Kategori.toLowerCase()) ? row.Jumlah : 0),0);
  const grossMargin = .58;
  return {
    label:balance < 0 ? 'Pengeluaran melebihi pemasukan' : 'Perubahan kas dalam periode',
    finding:fmtRp(balance), note,
    cards:[['Uang masuk',fmtRp(income)],['Uang keluar',fmtRp(outflow)],['Transaksi tercatat',fmtNum(rows.length)]],
    formulas:['Perubahan kas = jumlah uang masuk − jumlah uang keluar. Pembelian bahan dicatat sekali saat dibayar.',
      'Saldo berjalan dimulai dari nol pada awal periode pilihan. Perhitungan ini tidak memakai saldo pembukaan toko.',
      `Model laba terpisah memakai transaksi masuk berkategori Penjualan (${fmtRp(sales)}) dan asumsi modal barang 42%. Margin kotor model 58%. Pembayaran bahan sudah diwakili asumsi modal tersebut.`,
      `Dengan anggaran gaji, utilitas, promosi, dan kemasan dianggap tetap sebesar ${fmtRp(operatingCost)}, estimasi hasil setelah biaya itu ${fmtRp(sales * grossMargin - operatingCost)}. Omzet impas model = anggaran tersebut ÷ 58% = ${fmtRp(operatingCost/grossMargin)}. Kategori lain hanya masuk buku kas.`],
    table:'Catatan kas harian', tableNote:dates.length
      ? `${reportDate(dates[0])} – ${reportDate(dates.at(-1))}. Saldo berjalan dimulai dari nol untuk periode ini.`
      : 'Belum ada transaksi dalam periode ini. Pilih periode lain atau tambahkan transaksi contoh.',
    rows, columns:[['Tanggal',reportDate],['Kategori'],['Deskripsi'],['Tipe'],['Jumlah',fmtRp],['Saldo',fmtRp]],
    bar:{title:'Uang masuk dan keluar per hari', labels:dates.map(reportDate), series:[['Masuk',[...days.values()].map(d=>d.masuk)],['Keluar',[...days.values()].map(d=>d.keluar)]], money:true},
    second:{title:largest ? 'Pembagian pengeluaran' : 'Belum ada pengeluaran pada periode ini', labels:[...expenses.keys()], values:[...expenses.values()], money:true}
  };
}

function buildSalesReport(extra) {
  const quotes = 260, basePaid = 88, averageOrder = 1700000;
  const paid = basePaid + extra;
  const stages = ['Kunjungan katalog','Pertanyaan masuk','Permintaan siap ditawar','Penawaran terkirim','Pesanan dibayar'];
  const counts = [12400,1240,520,quotes,paid];
  const stageValues = [null,null,null,338000000,paid*averageOrder];
  const rows = stages.map((stage,i) => ({
    Tahap:stage, Jumlah:counts[i], 'Dari tahap sebelumnya (%)':i ? +reportFraction(counts[i],counts[i-1]).toFixed(1) : null,
    'Dari seluruh kunjungan (%)':+reportFraction(counts[i],counts[0]).toFixed(1), 'Nilai tahap (Rp)':stageValues[i]
  }));
  return {
    label:'Pesanan dibayar', finding:`${paid} dari ${quotes} penawaran`,
    note:extra ? `Tambahan ${extra} pembayaran memberi omzet simulasi ${fmtRp(extra * averageOrder)} jika nilai rata-rata pesanan tetap.`
      : `${quotes-paid} penawaran belum menghasilkan pembayaran. Coba ubah jumlah yang berhasil ditindaklanjuti.`,
    cards:[['Penawaran jadi pesanan',reportPercent(reportFraction(paid,quotes))],['Rata-rata per pesanan',fmtRp(averageOrder)],['Omzet pesanan dibayar',fmtRp(paid*averageOrder)]],
    formulas:['Persentase per tahap = jumlah pada tahap ini ÷ jumlah pada tahap sebelumnya × 100.',
      'Simulasi memindahkan penawaran yang sudah ada ke tahap dibayar. Nilai pesanan contoh tetap Rp 1.700.000 per pembayaran.',
      `Jika 35% dari ${quotes-paid} penawaran yang masih terbuka akhirnya dibayar pada nilai rata-rata yang sama, tambahan omzet proyeksi ${fmtRp((quotes-paid)*averageOrder*.35)}. Proyeksi ini terpisah dari omzet pesanan dibayar.`],
    table:'Perjalanan calon pembeli', tableNote:'Satu orang dapat tercatat di beberapa tahap. Jumlah antartahap tidak dijumlahkan.',
    rows, columns:[['Tahap'],['Jumlah',fmtNum],['Dari tahap sebelumnya (%)',n=>n===null ? '—' : reportPercent(n)],['Dari seluruh kunjungan (%)',reportPercent],['Nilai tahap (Rp)',n=>n===null ? '—' : fmtRp(n)]],
    bar:{title:'Jumlah pada tiap tahap',labels:stages,series:[['Jumlah',counts]],horizontal:true},
    second:{title:'Status penawaran terkirim',labels:['Dibayar','Belum dibayar'],values:[paid,quotes-paid]}
  };
}

function buildStockReport(delay) {
  const rows = inventoryItems.map(item => {
    const lead = item.lead + delay;
    const threshold = item.daily * lead + item.buffer;
    const order = item.stock <= threshold ? threshold + item.daily * 7 - item.stock : 0;
    return {Barang:item.sku, 'Stok di rak':item.stock, 'Laku per hari':item.daily, 'Waktu kirim (hari)':lead, 'Cadangan':item.buffer,
      'Titik pesan':threshold, 'Saran beli':order, 'Sisa hari':+(item.stock/item.daily).toFixed(1),
      'Perputaran stok':+(item.cost/item.averageStockValue).toFixed(1)};
  }).sort((a,b)=>b['Saran beli']-a['Saran beli'] || a['Sisa hari']-b['Sisa hari']);
  const urgent = rows.filter(row => row['Stok di rak'] <= row['Titik pesan']);
  const first = urgent[0];
  const newlyUrgent = urgent.filter(row=>row['Stok di rak'] > row['Titik pesan'] - row['Laku per hari'] * delay);
  const stockNote = newlyUrgent.length
    ? `${newlyUrgent.map(row=>row.Barang).join(' dan ')} ikut perlu dipesan ketika kiriman mundur ${delay} hari.`
    : first ? `${first.Barang} perlu diprioritaskan. Di rak ada ${first['Stok di rak']} unit, saran beli ${first['Saran beli']} unit.` : 'Seluruh barang masih berada di atas titik pemesanan.';
  return {
    label:'Perlu dipesan ulang', finding:`${urgent.length} dari ${rows.length} jenis barang`,
    note:stockNote,
    cards:[['Total saran beli',fmtNum(sumField(rows,'Saran beli'))+' unit'],['Di atas titik pesan',(rows.length-urgent.length)+' jenis'],['Tambahan waktu kirim',delay+' hari']],
    formulas:['Titik pesan = jumlah laku per hari × waktu kirim + stok cadangan.',
      'Saat stok menyentuh atau melewati batas bawah, saran beli mengisi rak sampai titik pesan ditambah kebutuhan tujuh hari. Kiriman dalam perjalanan diasumsikan nol.',
      'Perputaran stok contoh = harga pokok penjualan periode ÷ rata-rata nilai persediaan pada periode yang sama.'],
    table:'Daftar belanja pemasok', tableNote:'Diurutkan dari jumlah saran beli terbesar. Semua jumlah barang dalam unit.',
    rows, columns:[['Barang'],['Stok di rak'],['Titik pesan'],['Saran beli'],['Laku per hari'],['Waktu kirim (hari)'],['Cadangan'],['Sisa hari',reportDecimal],['Perputaran stok',v=>reportDecimal(v)+'×']],
    bar:{title:'Stok di rak dan titik pesan',labels:rows.map(r=>r.Barang),series:[['Stok di rak',rows.map(r=>r['Stok di rak'])],['Titik pesan',rows.map(r=>r['Titik pesan'])]],horizontal:true},
    second:{title:'Kesiapan stok per jenis barang',labels:['Perlu dipesan','Masih cukup'],values:[urgent.length,rows.length-urgent.length]}
  };
}

function buildAdReport(drop) {
  const rows = adChannels.map(c => {
    const margin = c.margin - drop;
    return {Kanal:c.name, 'Biaya iklan':c.spend, Omzet:c.revenue, Pesanan:c.orders, 'Margin produk (%)':margin,
      'Biaya per pesanan':Math.round(c.spend / c.orders), 'Omzet per Rp1 iklan':+(c.revenue/c.spend).toFixed(2),
      'Sisa kontribusi':Math.round(c.revenue * margin / 100 - c.spend)};
  }).sort((a,b)=>b['Sisa kontribusi']-a['Sisa kontribusi']);
  const best = rows[0], losses = rows.filter(r=>r['Sisa kontribusi']<0);
  return {
    label:'Sisa margin setelah iklan', finding:fmtRp(sumField(rows,'Sisa kontribusi')),
    note:losses.length ? losses.map(row=>`${row.Kanal} masih kurang ${fmtRp(-row['Sisa kontribusi'])} untuk menutup biaya iklan.`).join(' ')
      : `${best.Kanal} menyisakan kontribusi terbesar (${fmtRp(best['Sisa kontribusi'])}) sebelum biaya operasional lain.`,
    cards:[['Belanja iklan',fmtRp(sumField(rows,'Biaya iklan'))],['Pesanan dari iklan',fmtNum(sumField(rows,'Pesanan'))],['Kanal di bawah nol',`${losses.length} dari ${rows.length}`]],
    formulas:['Sisa kontribusi = omzet × persentase margin produk − belanja iklan. Biaya operasional lain belum diperhitungkan.',
      'Penurunan margin memakai poin persentase. Dari 48% ke 43% berarti turun 5 poin. Omzet, pesanan, dan biaya iklan tetap dalam simulasi.',
      'Biaya per pesanan = belanja iklan ÷ jumlah pesanan. Omzet per Rp1 iklan = omzet ÷ belanja iklan.'],
    table:'Perbandingan kanal iklan', tableNote:'Diurutkan dari kontribusi tertinggi. Nilai negatif berarti biaya iklan melebihi margin dari penjualan.',
    rows, columns:[['Kanal'],['Sisa kontribusi',fmtRp],['Biaya iklan',fmtRp],['Omzet',fmtRp],['Margin produk (%)',reportPercent],['Pesanan'],['Biaya per pesanan',fmtRp],['Omzet per Rp1 iklan',n=>n.toLocaleString('id-ID')+'×']],
    bar:{title:'Omzet dan biaya iklan',labels:rows.map(r=>r.Kanal),series:[['Omzet',rows.map(r=>r.Omzet)],['Biaya iklan',rows.map(r=>r['Biaya iklan'])]],money:true},
    second:{title:'Sisa kontribusi per kanal',labels:rows.map(r=>r.Kanal),series:[['Kontribusi',rows.map(r=>r['Sisa kontribusi'])]],money:true,horizontal:true}
  };
}


function drawDashboardChart(canvas, model, accent) {
  const number = model.money ? fmtRp : fmtNum;
  const legend = {position:'bottom', labels:{usePointStyle:true, boxWidth:8, padding:14, color:'#31423e'}};
  const options = {
    responsive:true, maintainAspectRatio:false,
    plugins:{legend, tooltip:{callbacks:{label:ctx=>{
      const value = typeof ctx.raw === 'number' ? ctx.raw : 0;
      return (model.series ? ctx.dataset.label : ctx.label) + ': ' + number(value);
    }}}}
  };
  if (!model.series) {
    return new Chart(canvas,{type:'doughnut', data:{labels:model.labels,
      datasets:[{data:model.values, backgroundColor:[accent,'#9db1b0','#ce924d','#8276a1','#b56352','#a4a361'], borderWidth:1, borderColor:'#fff'}]},
      options:{...options, cutout:'61%'}});
  }
  const valueAxis = model.horizontal ? 'x' : 'y';
  options.indexAxis = model.horizontal ? 'y' : 'x';
  legend.display = model.series.length > 1;
  const compact = new Intl.NumberFormat('id-ID', {notation:'compact',maximumFractionDigits:1});
  options.scales = {
    [valueAxis]:{beginAtZero:true, ticks:{maxTicksLimit:5, callback:v=>compact.format(v)}, title:{display:!!model.money, text:'Rupiah'}, grid:{color:'#dde4df'}},
    [model.horizontal ? 'y' : 'x']:{grid:{display:false}, ticks:{color:'#404d46'}}
  };
  return new Chart(canvas,{type:'bar',data:{labels:model.labels, datasets:model.series.map(([label,data],i)=>({
    label, data, backgroundColor:data.some(v=>v<0) ? data.map(v=>v<0 ? '#a04635' : accent) : (i ? '#a38761' : accent),
    borderRadius:3, maxBarThickness:32
  }))},options});
}

function refreshCashPeriods() {
  const select = $('#financePeriod');
  const selected = select.value;
  const months = [...new Set(reportTransactions.map(t=>t.tanggal.slice(0,7)))].sort();
  const monthName = date => new Date(date+'-01T12:00:00').toLocaleDateString('id-ID',{month:'long',year:'numeric'});
  select.replaceChildren(new Option('Seluruh transaksi',''),new Option('7 hari terakhir dalam data','week'),
    ...months.map(month=>new Option(monthName(month),month)));
  select.value = selected;
}

function updateDashboard() {
  const def = dashboardReports[currentDashboard];
  const isCash = currentDashboard === 'finance';
  const report = def.build(reportScenarios[currentDashboard]);
  const shell = $('#dashboardShell');
  const html = escapeCatalogHtml;
  $$('.dashboard-mode-btn').forEach(btn=>{
    const selected = btn.dataset.dashboard === currentDashboard;
    btn.classList.toggle('active',selected);
    btn.setAttribute('aria-pressed',String(selected));
  });
  $$('.theme-btn',shell).forEach(btn=>btn.setAttribute('aria-pressed',String(shell.classList.contains(btn.dataset.theme))));
  $('#financePeriodLabel').hidden = !isCash;
  $('#addTransaction').hidden = !isCash;
  $('#reportScenarioLabel').hidden = isCash;
  if (!isCash) {
    $('#reportScenarioPrompt').textContent = def.prompt;
    const select = $('#reportScenario');
    if (select.dataset.report !== currentDashboard) {
      select.replaceChildren(...def.options.map(([value,label])=>new Option(label,value)));
      select.dataset.report = currentDashboard;
    }
    select.value = reportScenarios[currentDashboard];
  }
  $('#dashboardCategory').textContent = def.source;
  $('#dashboardTitle').textContent = def.title;
  $('#dashboardSubtitle').textContent = def.intro;
  $('#reportFindingLabel').textContent = report.label;
  $('#reportFinding').textContent = report.finding;
  $('#dashboardInsights').textContent = report.note;
  $('#dashCards').innerHTML = report.cards.map(([label,value])=>
    `<div><dt>${html(label)}</dt><dd>${html(value)}</dd></div>`).join('');
  $('#dashFormulaChips').innerHTML = report.formulas.map(formula=>`<li>${html(formula)}</li>`).join('');
  $('#dashboardTableTitle').textContent = report.table;
  $('#dashboardTableNote').textContent = report.tableNote;
  $('#financeHead').innerHTML = '<tr>'+report.columns.map(([key])=>`<th scope="col">${html(key)}</th>`).join('')+'</tr>';
  $('#financeTable').innerHTML = report.rows.map(row=>'<tr>'+report.columns.map(([key,format])=>
    `<td>${html(format ? format(row[key]) : row[key])}</td>`).join('')+'</tr>').join('');
  currentDashboardRows = report.rows.map(row=>Object.fromEntries(report.columns.map(([key])=>[key,row[key] ?? ''])));
  $('#exportFinanceCsv').disabled = !currentDashboardRows.length;
  $('#chartOneTitle').textContent = report.bar.title;
  $('#chartTwoTitle').textContent = report.second.title;
  financeBar?.destroy();
  financePie?.destroy();
  const accent = getComputedStyle(shell).getPropertyValue('--dash-accent').trim();
  financeBar = drawDashboardChart($('#financeBar'),report.bar,accent);
  const secondHasData = !!(report.second.series || report.second.values.length);
  $('#financePie').hidden = !secondHasData;
  $('#financePie').parentElement.hidden = !secondHasData;
  financePie = secondHasData ? drawDashboardChart($('#financePie'),report.second,accent) : null;

  const inquiry = 'https://wa.me/'+WA_NUMBER+'?text='+encodeURIComponent(
    `Halo KAR Labs, saya mencoba Dashboard Usaha bagian ${def.name}. Saya ingin ${def.brief} untuk usaha saya. Bisa kita bahas format laporan dan data yang dibutuhkan?`);
  for (const link of $$('.project-inquiry a[data-lead-service="dashboard"], .studio-header .consult-link[data-lead-service="dashboard"], #cta-dashboard a.btn-primary, #serviceGuide a[data-lead-service="dashboard"]')) {
    link.href = inquiry;
    if (!link.closest('.studio-header, #serviceGuide')) link.textContent = 'Diskusikan laporan '+def.name.toLowerCase()+' ↗';
  }
}

function initDashboard() {
  refreshCashPeriods();
  $('#financePeriod').onchange = updateDashboard;
  $('#reportScenario').onchange = event=>{
    reportScenarios[currentDashboard] = Number(event.target.value);
    updateDashboard();
  };
  $$('.dashboard-mode-btn').forEach(button=>{
    button.onclick = ()=>{
      currentDashboard = button.dataset.dashboard;
      updateDashboard();
    };
  });
  const themes = $$('.theme-btn',$('#dashboardShell'));
  themes.forEach(button=>{
    button.onclick = ()=>{
      const shell = $('#dashboardShell');
      shell.classList.remove(...themes.map(b=>b.dataset.theme));
      shell.classList.add(button.dataset.theme);
      updateDashboard();
    };
  });
  const modal = $('#transactionModal');
  $('#addTransaction').onclick = ()=>openCatalogDialog(modal,$('#addTransaction'));
  $('.close-modal',modal).onclick = ()=>modal.classList.remove('open');
  $('#transactionForm').oninput = event=>{
    for (const control of event.currentTarget.elements) control.setCustomValidity('');
  };
  $('#transactionForm').onsubmit = event=>{
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    const amount = Number(fields.get('jumlah'));
    for (const name of ['kategori','deskripsi']) {
      form.elements[name].setCustomValidity(fields.get(name).trim() ? '' : 'Isi teks yang menjelaskan transaksi.');
    }
    const recorded = sumField(reportTransactions.filter(t=>t.tipe === fields.get('tipe')), 'jumlah');
    form.elements.jumlah.setCustomValidity(Number.isSafeInteger(recorded + amount) ? '' : 'Jumlah melebihi batas ketelitian laporan.');
    form.elements.tanggal.setCustomValidity(/^\d{4}-\d{2}-\d{2}$/.test(fields.get('tanggal')) ? '' : 'Gunakan tahun empat digit.');
    if (!form.reportValidity()) return;
    const date = fields.get('tanggal');
    const period = $('#financePeriod');
    reportTransactions.push({tanggal:date, tipe:fields.get('tipe'), kategori:fields.get('kategori').trim(),
      deskripsi:fields.get('deskripsi').trim(), jumlah:amount});
    refreshCashPeriods();
    if (period.value && !cashPeriodRows().some(t=>t.tanggal===date)) period.value = '';
    modal.classList.remove('open');
    form.reset();
    updateDashboard();
    toast('Transaksi contoh masuk ke laporan.');
  };
  $('#exportFinanceCsv').onclick = ()=>{
    const scenario = reportScenarios[currentDashboard];
    const suffix = scenario ? '_simulasi_'+scenario : '';
    downloadCSV(currentDashboardRows,'dashboard_'+currentDashboard+suffix+'.csv');
  };
  updateDashboard();
}
