/* KAR Labs v2.6.0 - Web scraping demo and CSV export */
'use strict';
  const baseProducts=['Kaos Hitam Premium','Celana Jeans Slim','Hoodie Oversize','Topi Bucket Hat','Kemeja Flanel','Jaket Denim','Sweater Rajut','Shorts Cargo','Sneakers Putih','Sling Bag Nylon','Dress Casual','Sandal Kulit','Jam Tangan Sport','Tas Laptop','Polo Shirt','Kaos Oversized','Rok Plisket','Outer Kimono','Dompet Pria','Kacamata Fashion']; const scrapingResult=Array.from({length:44},(_,i)=>({nama:baseProducts[i%baseProducts.length]+' '+String(i+1).padStart(2,'0'),harga:[89000,150000,200000,45000,120000,250000,175000,95000][i%8]+(i*7000),rating:Number((4.1+(i%9)*0.09).toFixed(1)),stok:8+(i*7)%55})); let scrapeData=[],scrapeSort={key:'no',dir:1},scrapePage=1;
  function initScraping(){
    $('#startScraping').onclick=simulateScraping;
    $('#downloadScrapeCsv').onclick=()=>downloadCSV(scrapeData.map((x,i)=>({No:i+1,Nama:x.nama,Harga:x.harga,Rating:x.rating,Stok:x.stok})),'scraping_result.csv');
    $('#copyScrape').onclick=async()=>{
      if(!scrapeData.length){toast('Belum ada data contoh. Jalankan simulasi terlebih dahulu.');return;}
      try{await navigator.clipboard.writeText(JSON.stringify(scrapeData,null,2));toast('Data contoh berhasil disalin.');}
      catch{toast('Browser tidak mengizinkan salin data. Gunakan Unduh CSV sebagai alternatif.');}
    };
    $('#resetScrapingDemo').onclick=()=>{
      clearInterval(window.__scrapeTimer);
      scrapeData=[];scrapePage=1;scrapeSort={key:'no',dir:1};
      $('#scrapeSearch').value='';
      $('#scrapeProgressBox').classList.add('hidden');$('#scrapeResultBox').classList.add('hidden');
      $('#scrapeLogs').replaceChildren();$('#scrapeTable').replaceChildren();
      toast('Simulasi direset. Tekan Mulai Scraping untuk mencoba lagi.');
    };
    $('#scrapeSearch').oninput=()=>{scrapePage=1;renderScrapeTable()};
    $('#scrapePageSize').onchange=()=>{scrapePage=1;renderScrapeTable()};
    $('#scrapePrev').onclick=()=>{scrapePage=Math.max(1,scrapePage-1);renderScrapeTable()};
    $('#scrapeNext').onclick=()=>{scrapePage++;renderScrapeTable()};
    $$('.sortable').forEach(th=>{
      const button=document.createElement('button');button.type='button';button.textContent=th.textContent;th.replaceChildren(button);
      button.onclick=()=>{const k=th.dataset.sort;scrapeSort.dir=scrapeSort.key===k?-scrapeSort.dir:1;scrapeSort.key=k;renderScrapeTable();};
    });
  }
  function addLog(msg){ const d=document.createElement('div'); d.textContent=msg; $('#scrapeLogs').appendChild(d); $('#scrapeLogs').scrollTop=$('#scrapeLogs').scrollHeight; }
  function simulateScraping(){ let progress=0,currentPage=1,totalPages=Number($('#scrapePages').value); scrapeData=[]; $('#scrapeTotalPages').textContent=totalPages; $('#scrapeProgressBox').classList.remove('hidden'); $('#scrapeResultBox').classList.add('hidden'); $('#scrapeLogs').innerHTML=''; addLog('> Connecting to toko-contoh.com...'); clearInterval(window.__scrapeTimer); window.__scrapeTimer=setInterval(()=>{ progress+=Math.random()*15+5; if(progress>=100){progress=100; clearInterval(window.__scrapeTimer); scrapeData=scrapingResult; addLog('> Done. Data saved to local table.'); $('#scrapeResultBox').classList.remove('hidden'); $('#scrapeTotalResult').textContent=scrapeData.length; scrapePage=1; renderScrapeTable(); toast('Scraping selesai!'); } currentPage=Math.min(totalPages,Math.max(1,Math.ceil(progress/100*totalPages))); const collected=Math.floor(progress/100*scrapingResult.length); $('#scrapeProgressFill').style.width=progress+'%'; $('#scrapeProgressText').textContent=Math.round(progress)+'%'; $('#scrapePageNow').textContent=currentPage; $('#scrapeCount').textContent=collected; if(Math.random()>.45)addLog(`> Page ${currentPage}: ${Math.floor(Math.random()*10)+5} items found`); },500); }
  function renderScrapeTable(){
    const term=$('#scrapeSearch').value.toLowerCase();
    const data=scrapeData.filter(x=>x.nama.toLowerCase().includes(term));
    data.sort((a,b)=>{const key=scrapeSort.key,av=key==='no'?scrapeData.indexOf(a):a[key],bv=key==='no'?scrapeData.indexOf(b):b[key];return av===bv?0:av>bv?scrapeSort.dir:-scrapeSort.dir;});
    const size=Number($('#scrapePageSize').value),totalPages=Math.max(1,Math.ceil(data.length/size));
    scrapePage=Math.min(scrapePage,totalPages);const start=(scrapePage-1)*size;
    $('#scrapeTable').innerHTML=data.slice(start,start+size).map((x,i)=>`<tr class="border-t border-dark-border hover:bg-accent/5"><td class="p-3">${start+i+1}</td><td class="p-3">${x.nama}</td><td class="p-3 text-right">${fmtNum(x.harga)}</td><td class="p-3 text-right">${x.rating}</td><td class="p-3 text-right">${x.stok}</td></tr>`).join('')||'<tr><td colspan="5" class="p-3">Tidak ada data yang cocok. Hapus pencarian untuk melihat hasil contoh.</td></tr>';
    $('#scrapePrev').disabled=scrapePage<=1;$('#scrapeNext').disabled=scrapePage>=totalPages;
    $('#scrapePageInfo').textContent=`Page ${scrapePage} / ${totalPages}`;
    $$('.sortable').forEach(th=>th.setAttribute('aria-sort',th.dataset.sort===scrapeSort.key?(scrapeSort.dir===1?'ascending':'descending'):'none'));
  }
  function csvCell(value){
    let text=String(value??'');
    // Spreadsheet applications can execute formulas even inside quoted CSV cells.
    if(typeof value!=='number' && /^[\s\u0000-\u001f]*[=+@-]/.test(text))text="'"+text;
    return '"'+text.replace(/"/g,'""')+'"';
  }
  function csvCell(value){
    let text=String(value ?? '');
    // Spreadsheet apps may execute formula-like text even inside quoted CSV cells.
    if(typeof value==='string' && /^\s*[=+@-]|^[\t\r\n]/.test(text))text="'"+text;
    return '"'+text.replace(/"/g,'""')+'"';
  }
  function downloadCSV(data,filename){ if(!data.length){toast('Tidak ada data untuk di-export'); return;} const headers=Object.keys(data[0]); const rows=data.map(row=>headers.map(h=>csvCell(row[h])).join(',')); const csv=[headers.map(csvCell).join(','),...rows].join('\n'); const blob=new Blob([csv],{type:'text/csv;charset=utf-8'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url); toast('CSV berhasil di-download!'); }
