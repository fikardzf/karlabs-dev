/* KAR Labs v2.6.0 - Web scraping demo and CSV export */
'use strict';
  const baseProducts=['Kaos Hitam Premium','Celana Jeans Slim','Hoodie Oversize','Topi Bucket Hat','Kemeja Flanel','Jaket Denim','Sweater Rajut','Shorts Cargo','Sneakers Putih','Sling Bag Nylon','Dress Casual','Sandal Kulit','Jam Tangan Sport','Tas Laptop','Polo Shirt','Kaos Oversized','Rok Plisket','Outer Kimono','Dompet Pria','Kacamata Fashion']; const scrapingResult=Array.from({length:88},(_,i)=>({nama:baseProducts[i%baseProducts.length]+' '+String(i+1).padStart(2,'0'),harga:[89000,150000,200000,45000,120000,250000,175000,95000][i%8]+(i*7000),rating:Number((4.1+(i%9)*0.09).toFixed(1)),stok:8+(i*7)%55})); let scrapeData=[],scrapeSort={key:'no',dir:1},scrapePage=1;
  const cafeSamples = posDemoProducts.map((p, i) => ({nama:p.name, harga:p.price, stok:p.stock, rating:[4.6,4.8,4.7,4.5,4.2,4.9][i]}));
  function sourceRows() { return $('#scrapeSource').value === 'cafe' ? cafeSamples : scrapingResult; }
  function exportRows(rows) {
    return rows.map((x,i) => ({No:i+1, Nama:x.nama, Harga:x.harga, Rating:x.rating, Stok:x.stok}));
  }
  function initScraping(){
    showScrapeSamples(sourceRows().slice(0, 3));
    $('#startScraping').onclick=simulateScraping;
    $('#downloadScrapeCsv').onclick=()=>downloadCSV(exportRows(scrapeData),'scraping_result.csv');
    $('#copyScrape').onclick=async()=>{
      if(!scrapeData.length){toast('Belum ada data contoh. Jalankan simulasi terlebih dahulu.');return;}
      try{await navigator.clipboard.writeText(JSON.stringify(scrapeData,null,2));toast('Data contoh berhasil disalin.');}
      catch{toast('Browser tidak mengizinkan salin data. Gunakan Unduh CSV sebagai alternatif.');}
    };
    function resetScrape(){
      clearInterval(window.__scrapeTimer);
      $('#startScraping').disabled = false;
      $('#scrapePages').disabled = false;
      $('#sampleTitle').textContent = 'Cuplikan katalog sumber';
      showScrapeSamples(sourceRows().slice(0, 3));
      scrapeData=[];scrapePage=1;scrapeSort={key:'no',dir:1};
      $('#scrapeSearch').value='';
      $('#scrapeProgressBox').classList.add('hidden');$('#scrapeResultBox').classList.add('hidden');
      $('#scrapeLogs').replaceChildren();$('#scrapeTable').replaceChildren();
    }
    $('#resetScrapingDemo').onclick = () => { resetScrape(); toast('Simulasi direset. Pilih halaman untuk mulai lagi.'); };
    $('#scrapeSource').onchange = () => {
      const cafe = $('#scrapeSource').value === 'cafe';
      $('#scrapePages').replaceChildren(...(cafe ? [1,2,3] : [3,5,10]).map(n => new Option(String(n), String(n))));
      $('#scrapePages').value = cafe ? '3' : '5';
      $('#scrapePageHint').textContent = cafe ? 'Tiap halaman berisi dua menu kedai.' : 'Tiap halaman berisi hingga sembilan produk toko.';
      resetScrape();
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
  function showScrapeSamples(products) {
    $('#scrapeSamples').innerHTML = products.map(product =>
      `<li><b>${product.nama}</b><span>${fmtRp(product.harga)}</span></li>`).join('');
  }
  function simulateScraping() {
    clearInterval(window.__scrapeTimer);
    const pages = Number($('#scrapePages').value);
    const source = sourceRows();
    let page = 0;
    scrapeData = [];
    scrapePage = 1;
    $('#scrapeSearch').value = '';
    $('#startScraping').disabled = true;
    $('#scrapePages').disabled = true;
    $('#scrapeTotalPages').textContent = pages;
    $('#scrapeProgressBox').classList.remove('hidden');
    $('#scrapeResultBox').classList.add('hidden');
    $('#scrapeLogs').replaceChildren();
    $('#scrapeState').textContent = 'Membaca halaman contoh';
    function readPage() {
      page++;
      const end = source === cafeSamples ? page * 2 : page * 9 - Math.floor(page / 5);
      const batch = source.slice(scrapeData.length, end);
      scrapeData.push(...batch);
      $('#sampleTitle').textContent = 'Baru dibaca · halaman ' + page;
      showScrapeSamples(batch.slice(-3));
      addLog(`Halaman ${page} · ${batch.length} produk ditambahkan`);
      const pct = Math.round(page / pages * 100);
      $('#scrapeProgressFill').style.width = pct + '%';
      $('#scrapeProgressText').textContent = pct + '%';
      $('#scrapePageNow').textContent = page;
      $('#scrapeCount').textContent = scrapeData.length;
      if (page === pages) {
        clearInterval(window.__scrapeTimer);
        $('#startScraping').disabled = false;
        $('#scrapePages').disabled = false;
        $('#scrapeState').textContent = 'Tabel siap diperiksa';
        $('#scrapeResultBox').classList.remove('hidden');
        $('#scrapeTotalResult').textContent = scrapeData.length;
        const sample = exportRows(scrapeData.slice(0, 3));
        $('#scrapeCsvPreview').textContent = [Object.keys(sample[0]), ...sample.map(Object.values)]
          .map(row => row.map(csvCell).join(',')).join('\n');
        renderScrapeTable();
        toast(`${scrapeData.length} produk contoh siap diunduh.`);
      }
    }
    window.__scrapeTimer = setInterval(readPage, 470);
    readPage();
  }
  function renderScrapeTable(){
    const term=$('#scrapeSearch').value.toLowerCase();
    const data=scrapeData.filter(x=>x.nama.toLowerCase().includes(term));
    data.sort((a,b)=>{const key=scrapeSort.key,av=key==='no'?scrapeData.indexOf(a):a[key],bv=key==='no'?scrapeData.indexOf(b):b[key];return av===bv?0:av>bv?scrapeSort.dir:-scrapeSort.dir;});
    const size=Number($('#scrapePageSize').value),totalPages=Math.max(1,Math.ceil(data.length/size));
    scrapePage=Math.min(scrapePage,totalPages);const start=(scrapePage-1)*size;
    $('#scrapeTable').innerHTML=data.slice(start,start+size).map((x,i)=>`<tr class="border-t border-dark-border hover:bg-accent/5"><td class="p-3">${scrapeData.indexOf(x)+1}</td><td class="p-3">${x.nama}</td><td class="p-3 text-right">${fmtNum(x.harga)}</td><td class="p-3 text-right">${x.rating}</td><td class="p-3 text-right">${x.stok}</td></tr>`).join('')||'<tr><td colspan="5" class="p-3">Tidak ada data yang cocok. Hapus pencarian untuk melihat hasil contoh.</td></tr>';
    $('#scrapePrev').disabled=scrapePage<=1;$('#scrapeNext').disabled=scrapePage>=totalPages;
    $('#scrapePageInfo').textContent=`Page ${scrapePage} / ${totalPages}`;
    $$('.sortable').forEach(th=>th.setAttribute('aria-sort',th.dataset.sort===scrapeSort.key?(scrapeSort.dir===1?'ascending':'descending'):'none'));
  }
