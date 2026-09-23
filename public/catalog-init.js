/* KAR Labs v2.8.0 - Catalog routing, lazy feature initialization, and application startup */
'use strict';
  let calculatorsInitialized=false;
  let dashboardInitialized=false;

  async function ensureChartFeature(target){
    if(target!=='calculator' && target!=='dashboard') return;
    try{
      await ensureChartJs();
      if(target==='calculator' && !calculatorsInitialized){ initCalculators(); calculatorsInitialized=true; }
      if(target==='dashboard' && !dashboardInitialized){ initDashboard(); dashboardInitialized=true; }
    }catch(err){
      console.error('[KAR Labs vendor load error]', err);
      toast('Chart.js gagal dimuat. Coba refresh atau cek koneksi internet.');
      throw err;
    }
  }

  function initTabs(){
    const aliases={pointofsales:'pos',kasir:'pos',point_of_sales:'pos',tool:'calculator',calc:'calculator',kalkulator:'calculator',katalog:'product-catalog',produk:'product-catalog',catalog:'product-catalog',excel:'dashboard',automasi:'workflow',automation:'workflow',scrape:'scraping'};
    const valid=serviceCatalog.map(item=>item.id);
    function targetFromHash(){
      const clean=String(location.hash||'').replace('#','').trim().toLowerCase();
      return valid.includes(clean) ? clean : aliases[clean] || 'landing';
    }
    async function activateTarget(shouldScroll=true){
      const target=targetFromHash();
      $$('.service-panel').forEach(panel=>panel.classList.toggle('active',panel.id===target));
      $$('[data-service-link]').forEach(link=>link.classList.toggle('active',link.dataset.serviceLink===target));
      const activeService=serviceCatalog.find(item=>item.id===target);
      if(activeService) document.title = `${activeService.label} Demo - KAR Labs.dev`;

      if(target==='calculator' || target==='dashboard'){
        try{ await ensureChartFeature(target); } catch(_){}
      }
      if(target==='calculator' && calculatorsInitialized) setTimeout(()=>{ [kprChart,bmiGauge,bepChart,adsChart,inventoryChart].filter(Boolean).forEach(c=>c.resize()); const active=document.querySelector('.sub-tab-btn.active'); if(active) refreshCalculator(active.dataset.calc); },120);
      if(target==='dashboard' && dashboardInitialized) setTimeout(()=>{ if(financeBar)financeBar.resize(); if(financePie)financePie.resize(); updateDashboard(); },120);
      if(shouldScroll){
        const el=document.getElementById(target);
        if(el) setTimeout(()=>el.scrollIntoView({behavior:'smooth',block:'start'}),80);
      }
    }
    activateTarget(false);
    window.addEventListener('hashchange',()=>activateTarget(true));
  }

  function initShared(){ createCtas(); const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12}); $$('.fade-in-up').forEach(el=>obs.observe(el)); const top=$('#backTop'); window.addEventListener('scroll',()=>top.classList.toggle('show',window.scrollY>300)); top.onclick=()=>window.scrollTo({top:0,behavior:'smooth'}); }
  document.addEventListener('DOMContentLoaded',()=>{
    const safeInit=(name,fn)=>{ try{ fn(); } catch(err){ console.error('[KAR Labs init error]', name, err); } };
    safeInit('icons', refreshIcons);
    safeInit('shared', initShared);
    safeInit('tabs', initTabs);
    safeInit('landing', initLanding);
    safeInit('chat', initChat);
    safeInit('pos', initPosDemo);
    safeInit('workflow', initWorkflow);
    safeInit('scraping', initScraping);
  });
