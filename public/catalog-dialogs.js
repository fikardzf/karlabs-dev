'use strict';

function openCatalogDialog(modal, opener) {
  // WebKit can leave focus on the page when a button is tapped.
  if (!modal.classList.contains('open')) opener?.focus({preventScroll:true});
  modal.classList.add('open');
}

function installCatalogDialogBehavior() {
  const modals=$$('.modal, .pos-receipt');
  const background=$$('header.studio-header, nav:not(header nav), main, footer, .catalog-skip, #backTop');
  let active=null, returnFocus=null;
  modals.forEach(modal=>{
    modal.setAttribute('role','dialog');
    modal.setAttribute('aria-modal','true');
    modal.setAttribute('aria-hidden','true');
    if(!modal.hasAttribute('aria-label')&&!modal.hasAttribute('aria-labelledby'))modal.setAttribute('aria-label','Preview demo');
    new MutationObserver(()=>{
      const open=modal.classList.contains('open');
      modal.setAttribute('aria-hidden',String(!open));
      if(open&&active!==modal){
        returnFocus=document.activeElement;
        active=modal;
        background.forEach(element=>{element.inert=true;});
        document.body.style.overflow='hidden';
        modal.querySelector('button, input, select, [href]')?.focus();
      }else if(!open&&active===modal){
        active=null;
        background.forEach(element=>{element.inert=false;});
        document.body.style.overflow='';
        if(returnFocus?.isConnected)returnFocus.focus();
      }
    }).observe(modal,{attributes:true,attributeFilter:['class']});
  });
  document.addEventListener('keydown',event=>{
    if(!active)return;
    if(event.key==='Escape'){
      if(active.id==='posReceiptModal')closePosReceipt(false);
      else if(active.id==='landingPreviewModal')closeLandingPreview();
      else active.classList.remove('open');
    }
    if(event.key==='Tab'){
      const items=$$('button, [href], input, select, textarea, iframe',active).filter(el=>!el.disabled&&el.getClientRects().length);
      const first=items[0],last=items[items.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
    }
  });
}
