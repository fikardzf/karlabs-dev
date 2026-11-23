/* KAR Labs v2.6.0 - Interactive calculators */
'use strict';
  let kprChart,bmiGauge,bepChart,adsChart,inventoryChart;
  function hitungKPR(hargaRumah, dpPersen, tenorTahun, bungaPersen){ const dp=hargaRumah*(dpPersen/100); const pinjaman=hargaRumah-dp; const tenorBulan=tenorTahun*12; const bungaBulanan=bungaPersen/100/12; let cicilan=pinjaman/tenorBulan; if(bungaBulanan>0){ cicilan=pinjaman*(bungaBulanan*Math.pow(1+bungaBulanan,tenorBulan))/(Math.pow(1+bungaBulanan,tenorBulan)-1); } const totalBayar=cicilan*tenorBulan; const totalBunga=totalBayar-pinjaman; return {dp,pinjaman,cicilan,totalBunga,totalBayar}; }
  function readMoney(id){ return parseRp($('#'+id).value); }
  function blurMoney(id){ const el=$('#'+id); if(el) el.addEventListener('blur',e=>e.target.value=fmtNum(parseRp(e.target.value))); }
  function updateKPR(){ const harga=parseRp($('#kprHarga').value); const dp=Number($('#kprDp').value), tenor=Number($('#kprTenor').value), bunga=Number($('#kprBunga').value); $('#dpLabel').textContent=dp+'%'; $('#tenorLabel').textContent=tenor+' tahun'; $('#bungaLabel').textContent=bunga+'%'; const r=hitungKPR(harga,dp,tenor,bunga); $('#kprDpResult').textContent=fmtRp(r.dp); $('#kprLoanResult').textContent=fmtRp(r.pinjaman); $('#kprMonthlyResult').textContent=fmtRp(r.cicilan); $('#kprInterestResult').textContent=fmtRp(r.totalBunga); $('#kprTotalResult').textContent=fmtRp(r.totalBayar); const data=[r.pinjaman,Math.max(r.totalBunga,0)]; if(kprChart){ kprChart.data.datasets[0].data=data; kprChart.update(); } else { kprChart=new Chart($('#kprChart'),{type:'pie',data:{labels:['Pokok Pinjaman','Total Bunga'],datasets:[{data,backgroundColor:['#006847','#06B6D4'],borderColor:'#ffffff'}]},options:{plugins:{legend:{labels:{color:'#334155'}}}}}); } }
  function updateBMI(){ const w=Number($('#bmiWeight').value), hCm=Number($('#bmiHeight').value), h=hCm/100, age=Number($('#healthAge').value), gender=$('#healthGender').value, activity=Number($('#activityLevel').value||1.2); if (!(w > 0 && hCm > 0 && age > 0)) {
      for (const id of ['bmiValue','bmrValue','tdeeValue','idealWeight']) $('#'+id).textContent = '—';
      $('#bmiStatus').textContent = 'Isi usia, berat, dan tinggi di atas nol.';
      $('#bmiPointer').hidden = true;
      if (bmiGauge) { bmiGauge.destroy(); bmiGauge = null; }
      return;
    }
    $('#bmiPointer').hidden = false;
    const bmi=w/(h*h); let status='Normal ✅', color='#006847'; if(bmi<18.5){status='Underweight ⚠️'; color='#92400e'} else if(bmi>=25&&bmi<30){status='Overweight ⚠️'; color='#9a3412'} else if(bmi>=30){status='Obese ⚠️'; color='#b42318'} $('#bmiValue').textContent=(isFinite(bmi)?bmi:0).toFixed(1); $('#bmiStatus').textContent='Status: '+status; $('#bmiStatus').style.color=color; const s=gender==='male'?5:-161; const bmr=(10*w)+(6.25*hCm)-(5*age)+s; const tdee=bmr*activity; $('#bmrValue').textContent=fmtNum(bmr); $('#tdeeValue').textContent=fmtNum(tdee); const pos=Math.max(0,Math.min(100,((bmi-12)/(40-12))*100)); $('#bmiPointer').style.left=pos+'%'; const min=18.5*h*h,max=24.9*h*h; $('#idealWeight').textContent=Math.round(min)+'-'+Math.round(max)+' kg'; if(bmiGauge){ bmiGauge.data.datasets[0].data=[Math.min(bmi,40),Math.max(0,40-bmi)]; bmiGauge.data.datasets[0].backgroundColor=[color,'#dbe5e1']; bmiGauge.update(); } else { bmiGauge=new Chart($('#bmiGauge'),{type:'doughnut',data:{labels:['BMI','Sisa'],datasets:[{data:[Math.min(bmi,40),Math.max(0,40-bmi)],backgroundColor:[color,'#dbe5e1'],borderWidth:0,circumference:180,rotation:270}]},options:{plugins:{legend:{display:false}},cutout:'70%'}}); } }
  const kota={Jakarta:{lat:-6.2,lng:106.8},Bandung:{lat:-6.9,lng:107.6},Surabaya:{lat:-7.3,lng:112.7},Semarang:{lat:-7.0,lng:110.4},Yogyakarta:{lat:-7.8,lng:110.4}};
  const couriers={'JNE Regular':{base:9000,perKg:9000,est:'2-3 hari'},'JNE YES':{base:15000,perKg:15000,est:'1 hari'},'J&T Express':{base:10000,perKg:8500,est:'2-4 hari'},'SiCepat':{base:9500,perKg:8000,est:'1-3 hari'}}; let selectedCourier='JNE Regular';
  function jarak(a,b){ const R=6371, p=Math.PI/180; const dLat=(b.lat-a.lat)*p,dLng=(b.lng-a.lng)*p; const x=Math.sin(dLat/2)**2+Math.cos(a.lat*p)*Math.cos(b.lat*p)*Math.sin(dLng/2)**2; return 2*R*Math.atan2(Math.sqrt(x),Math.sqrt(1-x)); }
  function updateOngkir(){ const o=$('#originCity').value,d=$('#destCity').value; const actualKg=Math.max(1,Math.ceil(Number($('#shipWeight').value||1000)/1000)); const volKg=Math.max(1,Math.ceil((Number($('#shipLength').value||0)*Number($('#shipWidth').value||0)*Number($('#shipHeight').value||0))/6000)); const berat=Math.max(actualKg,volKg); const km=jarak(kota[o],kota[d]); const c=couriers[selectedCourier]; const zone=km>700?1.7:km>350?1.35:km>120?1.15:1; const cost=(c.base+c.perKg*berat)*zone; $('#shipCourier').textContent=selectedCourier; $('#shipRoute').textContent=o+' → '+d; $('#shipDistance').textContent=Math.round(km)+' km'; $('#shipKg').textContent=berat+' kg'; $('#shipVolumetric').textContent=volKg+' kg'; $('#shipEstimate').textContent=c.est; $('#shipCost').textContent=fmtRp(cost); }
  function updateBEP(){
    const price = readMoney('bepPrice'), variable = readMoney('bepVariable');
    const fixed = readMoney('bepFixed'), target = readMoney('bepTarget');
    const contribution = price - variable;
    const units = fixed === 0 ? 0 : contribution > 0 ? Math.ceil(fixed / contribution) : null;
    const targetUnits = fixed + target === 0 ? 0 : contribution > 0 ? Math.ceil((fixed + target) / contribution) : null;
    const dial = $('#bepDial');
    if (document.activeElement !== dial || price > Number(dial.max)) dial.max = Math.max(300000, price);
    dial.min = 0;
    dial.step = price % 1000 ? 1 : 1000;
    dial.value = price;
    dial.setAttribute('aria-valuetext', fmtRp(price));
    $('#bepAdvice').textContent = units === null ? 'Harga jual perlu melebihi modal per unit untuk menutup biaya tetap.'
      : `Dengan harga ${fmtRp(price)}, biaya tetap tertutup setelah ${fmtNum(units)} unit terjual.`;
    $('#bepContribution').textContent = fmtRp(contribution);
    $('#bepMarginRatio').textContent = price ? Math.round(contribution / price * 100) + '%' : '—';
    $('#bepUnits').textContent = units === null ? 'Belum tercapai' : fmtNum(units) + ' unit';
    $('#bepRevenue').textContent = units === null ? '—' : fmtRp(units * price);
    $('#bepTargetUnits').textContent = targetUnits === null ? 'Belum tercapai' : fmtNum(targetUnits) + ' unit';
    $('#bepTargetRevenue').textContent = targetUnits === null ? '—' : fmtRp(targetUnits * price);
    const labels=['Fixed Cost','Gross Profit @BEP','Target Profit']; const data=[fixed,units === null ? null : units*contribution,target]; if(bepChart){bepChart.data.datasets[0].data=data; bepChart.update();} else {bepChart=new Chart($('#bepChart'),{type:'bar',data:{labels,datasets:[{label:'Rp',data,backgroundColor:chartColors()}]},options:{plugins:{legend:{display:false}},scales:{x:{ticks:{color:'#475569'},grid:{color:'#dbe5e1'}},y:{ticks:{color:'#475569'},grid:{color:'#dbe5e1'}}}}});} }
  function updateAds(){ const spend=readMoney('adsSpend'), revenue=readMoney('adsRevenue'), orders=Number($('#adsOrders').value), margin=Number($('#adsMargin').value||0)/100; const roas=spend?revenue/spend:0, cac=orders>0?spend/orders:null, gross=revenue*margin, net=gross-spend; $('#adsRoas').textContent=spend?roas.toFixed(2)+'x':'—'; $('#adsCac').textContent=cac===null?'Belum ada pesanan':fmtRp(cac); $('#adsGrossProfit').textContent=fmtRp(gross); $('#adsNetProfit').textContent=fmtRp(net); $('#adsNetProfit').className='text-3xl font-heading font-bold '+(net>=0?'text-accent':'text-red-400'); const labels=['Budget','Gross Profit','Net Profit']; const data=[spend,gross,net]; if(adsChart){adsChart.data.datasets[0].data=data; adsChart.update();} else {adsChart=new Chart($('#adsChart'),{type:'bar',data:{labels,datasets:[{data,backgroundColor:['#94a3b8','#06B6D4',net>=0?'#006847':'#EF4444']} ]},options:{plugins:{legend:{display:false}},scales:{x:{ticks:{color:'#475569'},grid:{color:'#dbe5e1'}},y:{ticks:{color:'#475569'},grid:{color:'#dbe5e1'}}}}});} }
  function updateInventory(){ const D=Number($('#invDemand').value||0), S=readMoney('invOrderCost'), H=readMoney('invHolding'), lead=Number($('#invLead').value||0), daily=Number($('#invDaily').value||0), safety=Number($('#invSafety').value||0); const eoq=H?Math.sqrt((2*D*S)/H):0; const rop=(daily*lead)+safety; const orders=eoq?D/eoq:0; $('#invEoq').textContent=fmtNum(eoq)+' unit'; $('#invRop').textContent=fmtNum(rop)+' unit'; $('#invOrdersYear').textContent=orders.toFixed(1)+'x / tahun'; const data=[daily*lead,safety,eoq]; if(inventoryChart){inventoryChart.data.datasets[0].data=data; inventoryChart.update();} else {inventoryChart=new Chart($('#inventoryChart'),{type:'doughnut',data:{labels:['Demand saat lead time','Safety stock','EOQ'],datasets:[{data,backgroundColor:chartColors(),borderWidth:0}]},options:{plugins:{legend:{labels:{color:'#334155'}}},cutout:'62%'}});} }

  function bindStrictNumericInput(id, opts={}){ const el=$('#'+id); if(!el)return; const allowDecimal=!!opts.decimal, allowThousands=!!opts.money; el.setAttribute('inputmode', allowDecimal?'decimal':'numeric'); el.setAttribute('autocomplete','off'); const clean=()=>{ const raw=String(el.value||''); let cleaned=raw.replace(allowDecimal?/[^0-9.,]/g:/[^0-9.]/g,''); if(!allowThousands && !allowDecimal) cleaned=cleaned.replace(/[^0-9]/g,''); if(allowThousands && !allowDecimal) cleaned=cleaned.replace(/[^0-9.]/g,''); if(allowDecimal){ const parts=cleaned.replace(/,/g,'.').split('.'); cleaned=parts.shift()+ (parts.length?'.'+parts.join(''):''); } if(cleaned!==raw) el.value=cleaned; }; el.addEventListener('beforeinput',e=>{ if(e.data && !/[0-9.,]/.test(e.data)) e.preventDefault(); }); el.addEventListener('input',clean); el.addEventListener('paste',()=>setTimeout(clean,0)); clean(); }
  function setupCalculatorNumericGuards() {
    ['kprHarga','bepPrice','bepVariable','bepFixed','bepTarget','adsSpend','adsRevenue','invOrderCost','invHolding'].forEach(id => bindStrictNumericInput(id,{money:true}));
    ['healthAge','adsOrders','invDemand','invLead','invSafety'].forEach(id => bindStrictNumericInput(id));
    for (const id of ['bmiWeight','bmiHeight','shipWeight','shipLength','shipWidth','shipHeight','adsMargin','invDaily']) {
      const field = $('#'+id);
      field.type = 'text';
      bindStrictNumericInput(id,{decimal:true});
    }
  }

  function initCalculators(){
    $('#resetBep').onclick = () => {
      for (const id of ['bepPrice', 'bepVariable', 'bepFixed', 'bepTarget']) {
        const field = $('#' + id);
        field.value = field.defaultValue;
      }
      updateBEP();
    };
    $('#bepDial').oninput = e => {
      $('#bepPrice').value = fmtNum(Number(e.target.value));
      updateBEP();
    };
    setupCalculatorNumericGuards(); $$('.sub-tab-btn').forEach(b=>b.onclick=()=>{ $$('.sub-tab-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active'); $$('.calc-panel').forEach(p=>p.classList.add('hidden')); $('#calc-'+b.dataset.calc).classList.remove('hidden'); refreshCalculator(b.dataset.calc); }); ['kprHarga','kprDp','kprTenor','kprBunga'].forEach(id=>$('#'+id).addEventListener('input',updateKPR)); ['kprHarga','bepPrice','bepVariable','bepFixed','bepTarget','adsSpend','adsRevenue','invOrderCost','invHolding'].forEach(blurMoney); $('#kprHitung').onclick=updateKPR; ['bmiWeight','bmiHeight','healthGender','healthAge','activityLevel'].forEach(id=>$('#'+id).addEventListener('input',updateBMI)); $('#bmiHitung').onclick=updateBMI; $('#courierChoices').innerHTML=Object.keys(couriers).map((c,i)=>`<label class="border border-dark-border rounded-xl px-3 py-3 flex items-center gap-2 cursor-pointer hover:border-accent"><input name="courier" type="radio" value="${c}" ${i===0?'checked':''}> ${c}</label>`).join(''); $$('input[name="courier"]').forEach(r=>r.onchange=()=>{selectedCourier=r.value; updateOngkir();}); ['originCity','destCity','shipWeight','shipLength','shipWidth','shipHeight'].forEach(id=>$('#'+id).addEventListener('input',updateOngkir)); $('#ongkirHitung').onclick=updateOngkir; ['bepPrice','bepVariable','bepFixed','bepTarget'].forEach(id=>$('#'+id).addEventListener('input',updateBEP)); $('#bepHitung').onclick=updateBEP; ['adsSpend','adsRevenue','adsOrders','adsMargin'].forEach(id=>$('#'+id).addEventListener('input',updateAds)); $('#adsHitung').onclick=updateAds; ['invDemand','invOrderCost','invHolding','invLead','invDaily','invSafety'].forEach(id=>$('#'+id).addEventListener('input',updateInventory)); $('#inventoryHitung').onclick=updateInventory; refreshCalculator($('.sub-tab-btn.active').dataset.calc); }
  function refreshCalculator(name){ if(name==='kpr')updateKPR(); if(name==='health')updateBMI(); if(name==='ongkir')updateOngkir(); if(name==='bep')updateBEP(); if(name==='ads')updateAds(); if(name==='inventory')updateInventory(); }

