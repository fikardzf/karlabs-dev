'use strict';

let kprChart, bmiGauge;

function mortgagePrice() {
  const text = $('#kprHarga').value.trim();
  if (!/^(?:\d+|\d{1,3}(?:\.\d{3})+)$/.test(text)) return null;
  const price = Number(text.replace(/\./g,''));
  return price >= 1 && price <= 999999999999999 ? price : null;
}

function updateKPR() {
  const price = mortgagePrice();
  const downPercent = Number($('#kprDp').value);
  const years = Number($('#kprTenor').value);
  const rate = Number($('#kprBunga').value);
  $('#dpLabel').textContent = downPercent+'%';
  $('#tenorLabel').textContent = years+' tahun';
  $('#bungaLabel').textContent = calcDecimal(rate)+'%';
  $('#kprHarga').setAttribute('aria-invalid',String(price === null));
  $('#kprFeedback').textContent = price === null ? 'Isi harga Rp1 sampai Rp999.999.999.999.999, misalnya 500.000.000.' : '';
  if (price === null) {
    for (const key of ['Dp','Loan','Monthly','Interest','Total']) $('#kpr'+key+'Result').textContent = '—';
    kprChart?.destroy();
    kprChart = null;
    return;
  }
  const down = price * downPercent / 100;
  const loan = price - down;
  const months = years * 12;
  const monthlyRate = rate / 1200;
  const monthly = monthlyRate ? loan * monthlyRate / -Math.expm1(-months * Math.log1p(monthlyRate)) : loan / months;
  const total = monthly * months;
  const interest = total - loan;
  for (const [key,amount] of Object.entries({Dp:down,Loan:loan,Monthly:monthly,Interest:interest,Total:total})) {
    $('#kpr'+key+'Result').textContent = fmtRp(amount);
  }
  if (!window.Chart) return;
  const data = [loan,interest];
  if (kprChart) {
    kprChart.data.datasets[0].data = data;
    kprChart.update();
  } else {
    kprChart = new Chart($('#kprChart'),{type:'pie',data:{labels:['Pokok pinjaman','Total bunga'],
      datasets:[{data,backgroundColor:['#006847','#06B6D4'],borderColor:'#fff'}]},options:{plugins:{legend:{labels:{color:'#334155'}}}}});
  }
}

function updateBMI() {
  const read = id => {
    const text = $('#'+id).value.trim();
    return /^\d+(?:[.,]\d{1,2})?$/.test(text) ? Number(text.replace(',','.')) : NaN;
  };
  const weight = read('bmiWeight'), heightCm = read('bmiHeight'), age = read('healthAge');
  const ranges = {bmiWeight:weight >= 1 && weight <= 600, bmiHeight:heightCm >= 50 && heightCm <= 300,
    healthAge:Number.isInteger(age) && age >= 18 && age <= 120};
  for (const [id,valid] of Object.entries(ranges)) $('#'+id).setAttribute('aria-invalid',String(!valid));
  const bmr = 10*weight + 6.25*heightCm - 5*age + ($('#healthGender').value === 'male' ? 5 : -161);
  if (Object.values(ranges).includes(false) || bmr <= 0) {
    for (const id of ['bmiValue','bmrValue','tdeeValue','idealWeight']) $('#'+id).textContent = '—';
    $('#bmiStatus').textContent = bmr <= 0 && !Object.values(ranges).includes(false)
      ? 'Kombinasi angka ini di luar jangkauan rumus contoh.'
      : 'Rentang simulasi dewasa: usia 18–120 tahun, berat 1–600 kg, tinggi 50–300 cm.';
    $('#bmiPointer').hidden = true;
    bmiGauge?.destroy();
    bmiGauge = null;
    return;
  }
  const height = heightCm / 100, bmi = weight / (height*height);
  const [status,color] = bmi < 18.5 ? ['Underweight','#92400e'] : bmi < 25 ? ['Normal','#006847']
    : bmi < 30 ? ['Overweight','#9a3412'] : ['Obese','#b42318'];
  $('#bmiValue').textContent = bmi.toFixed(1);
  $('#bmiStatus').textContent = 'Status: '+status;
  $('#bmiStatus').style.color = color;
  $('#bmrValue').textContent = fmtNum(bmr);
  $('#tdeeValue').textContent = fmtNum(bmr*Number($('#activityLevel').value));
  $('#bmiPointer').hidden = false;
  $('#bmiPointer').style.left = Math.max(0,Math.min(100,(bmi-12)/28*100))+'%';
  $('#idealWeight').textContent = Math.round(18.5*height*height)+'–'+Math.round(24.9*height*height)+' kg';
  if (!window.Chart) return;
  const data = [Math.min(bmi,40),Math.max(0,40-bmi)];
  if (bmiGauge) {
    bmiGauge.data.datasets[0].data = data;
    bmiGauge.data.datasets[0].backgroundColor = [color,'#dbe5e1'];
    bmiGauge.update();
  } else {
    bmiGauge = new Chart($('#bmiGauge'),{type:'doughnut',data:{labels:['BMI','Sisa'],datasets:[{
      data,backgroundColor:[color,'#dbe5e1'],borderWidth:0,circumference:180,rotation:270
    }]},options:{plugins:{legend:{display:false}},cutout:'70%'}});
  }
}

const calculatorSamples = {
  bep: {
    'Roti rumahan': {bepPrice:'25.000', bepVariable:'15.000', bepFixed:'1.200.000', bepTarget:'600.000'},
    'Jasa sablon': {bepPrice:'45.000', bepVariable:'25.000', bepFixed:'2.000.000', bepTarget:'1.000.000'}
  },
  pricing: {
    'Kue kering dalam stoples': {priceCost:'30.000', pricePack:'6.000', priceFee:'10', priceMargin:'30'},
    'Kaos di toko sendiri': {priceCost:'48.000', pricePack:'2.000', priceFee:'0', priceMargin:'20'}
  },
  ads: {
    'Promo akhir pekan': {adsSpend:'450.000', adsRevenue:'1.000.000', adsOrders:'10', adsMargin:'30'},
    'Iklan pesanan kue': {adsSpend:'300.000', adsRevenue:'1.600.000', adsOrders:'16', adsMargin:'40'}
  },
  inventory: {
    'Kemasan roti': {invDaily:'30', invLead:'4', invSafety:'60', invDemand:'9000', invOrderCost:'30.000', invHolding:'800'},
    'Kain dari luar kota': {invDaily:'5', invLead:'21', invSafety:'35', invDemand:'1500', invOrderCost:'120.000', invHolding:'6.000'}
  },
  ongkir: {
    'Dus jaket tebal': {destCity:'Surabaya', shipWeight:'1500', shipLength:'45', shipWidth:'35', shipHeight:'25'},
    'Paket aksesori': {originCity:'Bandung', destCity:'Jakarta', shipWeight:'250', shipLength:'15', shipWidth:'10', shipHeight:'8'}
  }
};

const calculatorLocations = {Jakarta:[-6.2,106.8], Bandung:[-6.9,107.6], Surabaya:[-7.3,112.7], Semarang:[-7,110.4], Yogyakarta:[-7.8,110.4]};
const calculatorCouriers = {
  'JNE Regular': {base:9000, perKg:9000, estimate:'2–3 hari'},
  'JNE YES': {base:15000, perKg:15000, estimate:'1 hari'},
  'J&T Express': {base:10000, perKg:8500, estimate:'2–4 hari'},
  'SiCepat': {base:9500, perKg:8000, estimate:'1–3 hari'}
};

function shippingDistance(origin, destination) {
  const [lat, lon] = calculatorLocations[origin];
  const [toLat, toLon] = calculatorLocations[destination];
  const rad = Math.PI / 180;
  const a = Math.sin((toLat-lat)*rad/2)**2
    + Math.cos(lat*rad)*Math.cos(toLat*rad)*Math.sin((toLon-lon)*rad/2)**2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

const calcDecimal = n => n.toLocaleString('id-ID', {maximumFractionDigits:2});
const calcUnits = n => fmtNum(n) + ' unit';
const calcKg = n => (n > 0 && n < 0.01 ? '< 0,01' : calcDecimal(n)) + ' kg';

const businessCalculations = {
  bep({bepPrice:price, bepVariable:cost, bepFixed:fixed, bepTarget:target}) {
    const contribution = price - cost;
    const needed = amount => amount === 0 ? 0 : contribution > 0 ? Math.ceil(amount / contribution) : null;
    const units = needed(fixed);
    const targetUnits = needed(fixed + target);
    const revenueAt = count => count === null ? '—' : 'Rp ' + (BigInt(count) * BigInt(price)).toLocaleString('id-ID');
    return {primary:units,
      reading: units === null ? 'Setiap penjualan belum menyisakan uang untuk membayar biaya tetap. Coba ubah harga atau biaya per unit.'
        : fixed === 0 ? 'Tidak ada biaya tetap dalam contoh ini.' : 'Pada jumlah ini, sisa penjualan sudah menutup biaya tetap bulan tersebut.',
      values: {bepUnits:units === null ? 'Belum tercapai' : calcUnits(units), bepContribution:fmtRp(contribution),
        bepMarginRatio:price ? calcDecimal(100 * contribution / price) + '%' : '—',
        bepRevenue:revenueAt(units), bepTargetUnits:targetUnits === null ? 'Belum tercapai' : calcUnits(targetUnits),
        bepTargetRevenue:revenueAt(targetUnits)},
      bars:[['Harga jual per unit',price],['Biaya per unit',cost]]
    };
  },
  pricing({priceCost, pricePack, priceFee, priceMargin}) {
    const cost = priceCost + pricePack;
    const available = 10000 - Math.round(priceFee*100) - Math.round(priceMargin*100);
    if (available <= 0 || cost === 0) return {
      reading: available <= 0 ? 'Jumlah potongan platform dan target margin harus di bawah 100% agar harga bisa menutup biaya.' : 'Isi modal atau kemasan untuk menghitung harga jual.',
      values:{priceResult:'Belum tersedia', priceBase:fmtRp(cost), priceFeeResult:'—', priceProfit:'—'}
    };
    const price = Math.ceil(cost * 10000 / available);
    const fee = price * priceFee / 100;
    const profit = price - cost - fee;
    return {primary:price, reading:'Harga ini menyisakan margin ' + calcDecimal(priceMargin) + '% atau lebih setelah modal, kemasan, dan biaya platform.',
      values:{priceResult:fmtRp(price),priceBase:fmtRp(cost),priceFeeResult:fmtRp(fee),priceProfit:fmtRp(profit)},
      bars:[['Harga jual',price],['Modal dan kemasan',cost]]};
  },
  ads({adsSpend:spend, adsRevenue:revenue, adsOrders:orders, adsMargin:margin}) {
    const gross = revenue * margin / 100;
    const net = gross - spend;
    return {primary:net,
      reading: net < 0 ? 'Laba kotor dari penjualan ini masih kurang ' + fmtRp(-net) + ' untuk menutup biaya iklan.'
        : net > 0 ? 'Ini sisa dari penjualan kampanye untuk menutup biaya usaha lainnya.' : 'Laba kotor dan biaya iklan sama besar.',
      values:{adsNetProfit:fmtRp(net),adsGrossProfit:fmtRp(gross),adsCac:orders ? fmtRp(spend/orders) : 'Belum ada pesanan',
        adsRoas:spend ? calcDecimal(revenue/spend) + '×' : '—',adsMinRevenue:spend === 0 ? fmtRp(0) : margin ? fmtRp(Math.ceil(spend*100/margin)) : 'Belum tercapai'},
      bars:[['Laba kotor',gross],['Biaya iklan',spend]]
    };
  },
  inventory({invDemand:demand, invOrderCost:orderCost, invHolding:holding, invLead:lead, invDaily:daily, invSafety:safety}) {
    const waiting = Math.round(daily * 100) * lead / 100;
    const lot = holding > 0 && demand > 0 && orderCost > 0 ? Math.max(1,Math.round(Math.sqrt(2*demand*orderCost/holding))) : 0;
    return {primary:Math.ceil(waiting+safety), reading:lot ? 'Ambang ini mencakup penjualan selama ' + fmtNum(lead) + ' hari menunggu pemasok dan ' + calcUnits(safety) + ' cadangan.'
      : 'Ambang stok tetap bisa dihitung. Untuk jumlah ekonomis, isi kebutuhan tahunan, biaya pesan, dan biaya simpan di atas nol.',
      values:{invRop:calcUnits(Math.ceil(waiting+safety)),invLeadDemand:calcDecimal(waiting)+' unit',
        invEoq:lot ? calcUnits(lot) : '—',invOrdersYear:lot ? calcDecimal(demand/lot) + ' kali per tahun' : '—'},
      bars:[['Penjualan saat menunggu',waiting],['Stok cadangan',safety]],unit:'unit'};
  },
  ongkir({originCity, destCity, shipWeight, shipLength, shipWidth, shipHeight, shipService}) {
    const actual = shipWeight/1000;
    const volume = shipLength*shipWidth*shipHeight/6000;
    const weight = Math.max(1, Math.ceil(actual), Math.ceil(volume));
    const distance = shippingDistance(originCity, destCity);
    const zone = distance > 700 ? 1.7 : distance > 350 ? 1.35 : distance > 120 ? 1.15 : 1;
    const courier = calculatorCouriers[shipService];
    const charge = Math.round((courier.base+courier.perKg*weight)*zone);
    return {primary:charge, reading: (volume > actual ? 'Ukuran dus menentukan berat tagihan.' : 'Berat timbangan menentukan berat tagihan.') + ' Tarif dan waktu tempuh merupakan contoh simulasi.',
      values:{shipCost:fmtRp(charge),shipRoute:originCity+' → '+destCity,shipKg:calcDecimal(weight)+' kg',
        shipVolumetric:calcKg(volume),shipEstimate:courier.estimate},
      bars:[['Timbangan',actual],['Ukuran dus',volume]],unit:'kg'};
  }
};

function calcNumber(field) {
  const raw = field.value.trim();
  const kind = field.dataset.kind;
  if (kind === 'choice') return raw;
  const patterns = {money:/^(?:\d+|\d{1,3}(?:\.\d{3})+)$/, decimal:/^\d+(?:[.,]\d{1,2})?$/, whole:/^\d+$/};
  if (!patterns[kind].test(raw)) return null;
  const number = Number(kind === 'money' ? raw.replace(/\./g,'') : raw.replace(',','.'));
  const unit = field.parentElement.querySelector('small').textContent;
  const max = unit === '%' ? 100 : unit === 'cm' ? 1000 : kind === 'money' ? 999999999 : 1000000;
  if (number > max || (field.id.startsWith('ship') && number <= 0)) return null;
  return number;
}

function refreshBusinessCalculator(name) {
  const panel = $('#calc-'+name);
  const values = {};
  let problem;
  for (const field of $$('[data-kind]', panel)) {
    const value = calcNumber(field);
    field.setAttribute('aria-invalid', String(value === null));
    if (value === null && !problem) problem = field;
    values[field.id] = value;
  }
  const result = problem ? null : businessCalculations[name](values);
  const receipt = $('.calc-receipt',panel);
  if (problem) {
    for (const output of $$('[id]',receipt)) output.textContent = '—';
    const label = problem.labels[0].firstElementChild.textContent;
    const unit = problem.parentElement.querySelector('small').textContent;
    const range = unit === '%' ? '0–100%' : unit === 'cm' ? '0,01–1.000 cm' : problem.dataset.kind === 'money' ? '0–999.999.999 rupiah'
      : problem.id.startsWith('ship') ? '0,01–1.000.000' : '0–1.000.000';
    $('[data-calc-reading]',panel).textContent = 'Periksa kolom “'+label+'”. Masukkan angka dalam rentang '+range+'.';
  } else {
    for (const [id, value] of Object.entries(result.values)) $('#'+id).textContent = value;
    $('[data-calc-reading]',panel).textContent = result.reading;
  }
  const comparison = $('[data-calc-comparison]',panel);
  const delta = Math.round(result?.primary - Number(panel.dataset.baseline));
  comparison.hidden = !Number.isFinite(result?.primary) || !Number.isFinite(delta) || delta === 0;
  if (!comparison.hidden) {
    const units = name === 'bep' || name === 'inventory';
    const difference = (units ? calcUnits : fmtRp)(Math.abs(delta));
    const sample = $('[data-calc-example]',panel).selectedOptions[0].textContent;
    const direction = units ? (delta > 0 ? 'lebih banyak' : 'lebih sedikit') : (delta > 0 ? 'lebih tinggi' : 'lebih rendah');
    comparison.textContent = difference + ' ' + direction + ' dari contoh ' + sample + '.';
  }
  const bars = $('[data-calc-bars]',panel);
  bars.hidden = !result?.bars;
  if (!bars.hidden) {
    const max = Math.max(1,...result.bars.map(([,value])=>value));
    bars.replaceChildren(...result.bars.map(([label,value])=>{
      const row = document.createElement('div');
      const caption = document.createElement('span');
      caption.textContent = label;
      const number = document.createElement('b');
      number.textContent = result.unit === 'kg' ? calcKg(value) : result.unit ? calcDecimal(value)+' '+result.unit : fmtRp(value);
      const line = document.createElement('i');
      line.style.width = (value/max*100)+'%';
      row.append(caption,number,line);
      return row;
    }));
  }
  if (name === 'bep' && values.bepPrice !== null) {
    const dial = $('#bepDial');
    if (document.activeElement !== dial) dial.max = Math.max(300000,values.bepPrice);
    dial.step = values.bepPrice % 1000 ? 1 : 1000;
    dial.value = values.bepPrice;
    dial.setAttribute('aria-valuetext',fmtRp(values.bepPrice));
  }
}

function wireCalculatorSheet(name) {
  const panel = $('#calc-'+name);
  const select = $('[data-calc-example]',panel);
  for (const label of Object.keys(calculatorSamples[name])) select.add(new Option(label,label));
  function applySample() {
    const sample = calculatorSamples[name][select.value] || {};
    const values = {};
    for (const field of $$('[data-kind]',panel)) {
      const initial = field.tagName === 'SELECT' ? field.options[0].value : field.defaultValue;
      field.value = sample[field.id] ?? initial;
      values[field.id] = calcNumber(field);
    }
    panel.dataset.baseline = businessCalculations[name](values).primary;
    refreshBusinessCalculator(name);
  }
  select.onchange = applySample;
  $('[data-calc-reset]',panel).onclick = applySample;
  $('[data-calc-to-result]',panel).onclick = ()=>$('.calc-primary',panel).focus();
  for (const field of $$('[data-kind]',panel)) {
    field.addEventListener('input',()=>refreshBusinessCalculator(name));
    if (field.dataset.kind === 'money') field.addEventListener('blur',()=>{
      const value = calcNumber(field);
      if (value !== null) field.value = fmtNum(value);
    });
  }
  applySample();
}

function updateCalculatorInquiry() {
  const selected = $('#calculator [data-calc][aria-pressed="true"]');
  if (!selected) return;
  const title = (selected.querySelector('b') || selected).textContent;
  const href = 'https://wa.me/'+WA_NUMBER+'?text='+encodeURIComponent('Halo KAR Labs, saya mencoba Kalkulator Bisnis untuk '+title.toLowerCase()+'. Saya ingin membahas rumus dan isian yang sesuai untuk usaha saya.');
  for (const link of $$('.project-inquiry a[data-lead-service="calculator"], .studio-header .consult-link[data-lead-service="calculator"], #cta-calculator a.btn-primary, #serviceGuide a[data-lead-service="calculator"]')) {
    link.href = href;
    if (link.closest('.project-inquiry, #cta-calculator')) link.textContent = 'Bahas kalkulator ' + title.toLowerCase() + ' ↗';
  }
}

function initCalculators() {
  for (const name of Object.keys(calculatorSamples)) wireCalculatorSheet(name);
  $('#bepDial').oninput = event=>{
    $('#bepPrice').value = fmtNum(Number(event.target.value));
    refreshBusinessCalculator('bep');
  };
  for (const id of ['bmiWeight','bmiHeight']) {
    const input = $('#'+id);
    input.type = 'text';
    input.inputMode = 'decimal';
  }
  const housePrice = $('#kprHarga');
  housePrice.inputMode = 'numeric';
  housePrice.maxLength = 19;
  const feedback = document.createElement('p');
  feedback.id = 'kprFeedback';
  feedback.setAttribute('role','status');
  housePrice.closest('label').after(feedback);
  housePrice.setAttribute('aria-describedby',feedback.id);
  housePrice.addEventListener('blur',()=>{
    const amount = mortgagePrice();
    if (amount !== null) housePrice.value = fmtNum(amount);
  });
  for (const id of ['kprHarga','kprDp','kprTenor','kprBunga']) $('#'+id).addEventListener('input',updateKPR);
  $('#kprHitung').onclick = updateKPR;
  for (const id of ['bmiWeight','bmiHeight','healthGender','healthAge','activityLevel']) $('#'+id).addEventListener('input',updateBMI);
  $('#bmiHitung').onclick = updateBMI;
  const buttons = $$('#calculator [data-calc]');
  function activate(button) {
    for (const item of buttons) {
      const selected = item === button;
      item.setAttribute('aria-pressed',String(selected));
      const panel = $('#calc-'+item.dataset.calc);
      panel.hidden = !selected;
      panel.classList.remove('hidden');
    }
    updateCalculatorInquiry();
    const name = button.dataset.calc;
    if (businessCalculations[name]) {
      refreshBusinessCalculator(name);
      return;
    }
    const update = name === 'kpr' ? updateKPR : updateBMI;
    const container = $('#calc-'+name+' canvas').parentElement;
    container.hidden = !window.Chart;
    update();
    if (!window.Chart) ensureChartJs().then(()=>{
      container.hidden = false;
      if (button.getAttribute('aria-pressed') === 'true') update();
    }).catch(()=>{ container.hidden = true; });
  }
  for (const button of buttons) button.onclick = ()=>activate(button);
  activate(buttons[0]);
}
