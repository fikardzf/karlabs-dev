/* KAR Labs v2.8.0 - Catalog routing, lazy feature initialization, and application startup */
'use strict';
  let calculatorsInitialized=false;
  let dashboardInitialized=false;
  let landingInitialized=false;

  async function ensureChartFeature(target){
    if(target!=='dashboard') return;
    const status=$('#chartFeatureStatus'), retry=$('#retryChartFeature');
    status.hidden=false;retry.hidden=true;
    $('#chartFeatureMessage').textContent='Memuat grafik demo. Fitur lain tetap dapat dipilih.';
    const panel = document.getElementById(target);
    panel.inert = !dashboardInitialized;
    panel.setAttribute('aria-busy','true');
    try{
      await ensureChartJs();
      if(target==='dashboard' && !dashboardInitialized){ initDashboard(); dashboardInitialized=true; }
      panel.inert=false;
      if(!document.getElementById(target).hidden)status.hidden=true;
    }catch(err){
      if(!document.getElementById(target).hidden){
        status.hidden=false;
        $('#chartFeatureMessage').textContent='Grafik belum bisa dimuat. Periksa koneksi lalu coba lagi, atau pilih demo lainnya.';
        retry.hidden=false;
      }
      throw err;
    }finally{
      document.getElementById(target).setAttribute('aria-busy','false');
    }
  }

  function initTabs(){
    const aliases={pointofsales:'pos',kasir:'pos',point_of_sales:'pos',tool:'calculator',calc:'calculator',kalkulator:'calculator',katalog:'product-catalog',produk:'product-catalog',catalog:'product-catalog',excel:'dashboard',automasi:'workflow',automation:'workflow',scrape:'scraping'};
    const valid=serviceCatalog.map(item=>item.id);
    function targetFromHash(){
      const clean=String(location.hash||'').replace('#','').trim().toLowerCase();
      return valid.includes(clean) ? clean : aliases[clean] || 'product-catalog';
    }
    let navigation=0;
    async function activateTarget(shouldScroll=true){
      const token=++navigation;
      const target=targetFromHash();
      $$('.service-panel').forEach(panel=>{panel.classList.toggle('active',panel.id===target);panel.hidden=panel.id!==target;});
      $$('[data-service-link]').forEach(link=>link.classList.toggle('active',link.dataset.serviceLink===target));
      const activeService=serviceCatalog.find(item=>item.id===target);
      if(activeService && location.hash) document.title = `${activeService.label} Demo - KAR Labs.dev`;
      updateShowroom(target);
      $('#chartFeatureStatus').hidden=true;
      if(target==='landing'&&!landingInitialized){initLanding();landingInitialized=true;}

      if(target==='calculator' && !calculatorsInitialized){ initCalculators(); calculatorsInitialized=true; }
      if(target==='dashboard'){
        try{ await ensureChartFeature(target); } catch(_){}
      }
      if(token!==navigation)return;
      if(target==='dashboard' && dashboardInitialized) setTimeout(()=>{ if(financeBar)financeBar.resize(); if(financePie)financePie.resize(); updateDashboard(); },120);
      if(shouldScroll){
        const el=document.getElementById('serviceGuide');
        if(el) el.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
      }
    }
    activateTarget(false);
    window.addEventListener('hashchange',()=>{
      document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
      document.querySelectorAll('.modal.open, .pos-receipt.open').forEach(modal => modal.classList.remove('open'));
      if(location.hash==='#serviceDiscovery'){navigation++;return;}
      activateTarget(true);
    });
    $('#retryChartFeature').onclick=()=>{const target=targetFromHash();if(target==='dashboard')activateTarget(false);};
  }

  function initShared(){ createCtas();initShowroom();const top=$('#backTop');window.addEventListener('scroll',()=>top.classList.toggle('show',window.scrollY>300),{passive:true});top.onclick=()=>window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}); }
  document.addEventListener('DOMContentLoaded',()=>{
    const safeInit=(name,fn)=>{ try{ fn(); } catch(err){ console.error('[KAR Labs init error]', name, err); } };
    safeInit('icons', refreshIcons);
    safeInit('shared', initShared);
    safeInit('tabs', initTabs);
    safeInit('product-catalog', initProductCatalog);
    safeInit('chat', initChat);
    safeInit('pos', initPosDemo);
    safeInit('workflow', initWorkflow);
    safeInit('scraping', initScraping);
  });
