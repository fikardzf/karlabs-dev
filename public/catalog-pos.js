/* KAR Labs v2.6.0 - Point of Sales demo */
'use strict';
  let posCart=[],posPayment='Cash',posOrderSequence=0,receiptNumber=null;
  const heldOrders=[];
  function posCartQty(id){return posCart.find(x=>x.id===id)?.qty||0}
  function renderPosProducts(){
    const grid=$('#posProductGrid'); if(!grid)return;
    const term=($('#posSearch')?.value||'').trim().toLowerCase();
    grid.innerHTML=posDemoProducts.filter(p=>p.name.toLowerCase().includes(term)||p.category.toLowerCase().includes(term)).map(p=>{
      const remaining=p.stock-posCartQty(p.id), state=remaining<=0?'out':remaining<=3?'low':'';
      return `<button class="pos-product-card" data-pos-add="${p.id}" ${remaining<=0?'disabled':''}><img class="pos-menu-photo" src="/public/demo-menu/${p.id}.webp" width="480" height="480" loading="lazy" alt="">${posCartQty(p.id) ? `<span class="pos-picked">${posCartQty(p.id)} dipilih</span>` : ''}<b class="block text-sm">${p.name}</b><span class="block text-accent font-bold text-sm mt-1">${fmtRp(p.price)}</span><span class="pos-stock ${state}">${remaining<=0?'Stok habis':`Stok ${remaining}`}</span></button>`;
    }).join('') || '<div class="col-span-full text-center text-gray-500 py-10">Menu tidak ditemukan. <button type="button" id="posClearSearch" class="quiet-search">Hapus pencarian</button></div>';
    const clear = $('#posClearSearch');
    if (clear) clear.onclick = () => {
      $('#posSearch').value = '';
      renderPosProducts();
      $('#posSearch').focus();
    };
    $$('[data-pos-add]').forEach(btn=>btn.onclick=()=>addPosProduct(btn.dataset.posAdd)); refreshIcons();
  }
  function addPosProduct(id){
    const product=posDemoProducts.find(p=>p.id===id); if(!product)return;
    const item=posCart.find(x=>x.id===id); const qty=item?.qty||0;
    if(qty>=product.stock){toast('Stok produk demo tidak mencukupi.');return;}
    const restoreFocus = document.activeElement?.dataset.posAdd === id;
    if(item)item.qty++; else posCart.push({...product,qty:1}); renderPos(id);
    if (restoreFocus) {
      const next = $(`[data-pos-add="${id}"]:not(:disabled)`) || $('[data-pos-add]:not(:disabled)') || $('#posCheckout');
      next.focus({preventScroll:true});
    }
  }
  function updatePosQty(id,delta){
    const item=posCart.find(x=>x.id===id); if(!item)return;
    if(delta>0 && item.qty>=item.stock){toast('Jumlah sudah mencapai stok tersedia.');return;}
    const control = delta > 0 ? 'plus' : 'minus';
    const restoreFocus = document.activeElement === $(`[data-pos-${control}="${id}"]`);
    item.qty+=delta; if(item.qty<=0)posCart=posCart.filter(x=>x.id!==id); renderPos(id);
    if (restoreFocus) ($(`[data-pos-${control}="${id}"]`) || $(`[data-pos-add="${id}"]`))?.focus({preventScroll:true});
  }
  function posTotals(){
    const subtotal=posCart.reduce((sum,x)=>sum+x.price*x.qty,0), rate=Number($('#posDiscount')?.value||0)/100, discount=Math.round(subtotal*rate), taxable=Math.max(0,subtotal-discount), tax=Math.round(taxable*.11), total=taxable+tax;
    return{subtotal,discount,tax,total};
  }
  function renderPosCart(){
    const box=$('#posCartItems'); if(!box)return;
    $('#posItemCount').textContent = posCart.reduce((sum, item) => sum + item.qty, 0) + ' item';
    if(!posCart.length)box.innerHTML='<div class="pos-demo-empty"><div><i data-lucide="shopping-cart" class="w-9 h-9"></i><b class="block text-sm text-zinc-400">Keranjang masih kosong</b><p class="text-xs mt-1">Pilih menu untuk memulai transaksi contoh.</p></div></div>';
    else box.innerHTML=posCart.map(x=>`<div class="pos-cart-item"><div><b class="block text-sm">${x.name}</b><span class="text-xs text-gray-500">${fmtRp(x.price)} / item</span><div class="pos-qty"><button type="button" aria-label="Kurangi jumlah ${x.name}" data-pos-minus="${x.id}">−</button><span>${x.qty}</span><button type="button" aria-label="Tambah jumlah ${x.name}" data-pos-plus="${x.id}">+</button></div></div><b class="text-sm">${fmtRp(x.price*x.qty)}</b></div>`).join('');
    $$('[data-pos-minus]').forEach(b=>b.onclick=()=>updatePosQty(b.dataset.posMinus,-1)); $$('[data-pos-plus]').forEach(b=>b.onclick=()=>updatePosQty(b.dataset.posPlus,1)); refreshIcons();
  }
  function cashReceived(total) {
    const value = $('#posCash').value.trim();
    if (!value) return total;
    return /^(?:\d+|\d{1,3}(?:\.\d{3})+)$/.test(value) ? Number(value.replace(/\./g,'')) : NaN;
  }
  function renderTender(total = posTotals().total) {
    $('#posOrderDisplay').textContent = fmtRp(total);
    const visible = posPayment === 'Cash' && posCart.length > 0;
    $('#posTender').hidden = !visible;
    if (!visible) return;
    const change = cashReceived(total) - total;
    $('#posCash').setAttribute('aria-invalid', String(!Number.isFinite(change) || change < 0));
    $('#posChange').textContent = !Number.isFinite(change) ? 'Masukkan jumlah rupiah bulat.'
      : change < 0 ? 'Masih kurang ' + fmtRp(-change) : 'Kembalian ' + fmtRp(change);
  }
  function renderPosTotals(){const t=posTotals(); if(!$('#posSubtotal'))return; $('#posSubtotal').textContent=fmtRp(t.subtotal);$('#posDiscountValue').textContent='- '+fmtRp(t.discount);$('#posTax').textContent=fmtRp(t.tax);$('#posTotal').textContent=fmtRp(t.total);renderTender(t.total)}
  function renderPos(changedProduct){
    renderPosProducts();renderPosCart();renderPosTotals();
    if (changedProduct) $(`[data-pos-add="${changedProduct}"]`)?.classList.add('pos-updated');
  }
  function selectPayment(method) {
    posPayment = method;
    for (const button of document.querySelectorAll('.pos-payment-btn')) {
      const selected = button.dataset.posPayment === method;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    }
    renderTender();
  }
  function resetPos(showMessage=false) {
    posCart = [];
    receiptNumber = null;
    $('#posCash').value = '';
    selectPayment('Cash');
    $('#posDiscount').value = '0';
    $('#posSearch').value = '';
    $('#posCustomer').selectedIndex = 0;
    $('#posCustomerLabel').textContent = $('#posCustomer').value;
    renderPos();
    if (showMessage) toast('Pesanan aktif dikosongkan.');
  }
  function openPosReceipt(){
    if(!posCart.length){toast('Pilih menu sebelum membuka struk.');return;}
    const t=posTotals(), modal=$('#posReceiptModal'); if(!modal)return;
    const cash = cashReceived(t.total);
    $('#posReceiptCashLines').hidden = posPayment !== 'Cash';
    if (posPayment === 'Cash') {
      if (!Number.isFinite(cash) || cash < t.total) { $('#posCash').focus(); return; }
      $('#posReceiptCash').textContent = fmtRp(cash);
      $('#posReceiptChange').textContent = fmtRp(cash-t.total);
    }
    receiptNumber ??= ++posOrderSequence;
    $('#posReceiptOrder').textContent='#DEMO-'+String(receiptNumber).padStart(4,'0'); $('#posReceiptCustomer').textContent=$('#posCustomer')?.value||'Pelanggan umum'; $('#posReceiptPayment').textContent=$('.pos-payment-btn.active').textContent.trim(); $('#posReceiptTime').textContent=new Date().toLocaleString('id-ID',{dateStyle:'medium',timeStyle:'short'});
    $('#posReceiptItems').innerHTML=posCart.map(x=>`<div class="pos-receipt-line"><span>${x.qty}× ${x.name}</span><span>${fmtRp(x.price*x.qty)}</span></div>`).join(''); $('#posReceiptSubtotal').textContent=fmtRp(t.subtotal);$('#posReceiptDiscount').textContent='- '+fmtRp(t.discount);$('#posReceiptTax').textContent=fmtRp(t.tax);$('#posReceiptTotal').textContent=fmtRp(t.total); openCatalogDialog(modal, $('#posCheckout'));
  }
  function closePosReceipt(reset=false){const modal=$('#posReceiptModal');if(modal){modal.classList.remove('open');modal.setAttribute('aria-hidden','true')} if(reset)resetPos(false)}
  function updateHeldOrders() {
    const resume = $('#posResume');
    resume.hidden = !heldOrders.length;
    resume.textContent = 'Lanjutkan pesanan tertahan (' + heldOrders.length + ')';
  }
  function holdOrder() {
    if (!posCart.length) { toast('Tambahkan produk sebelum menahan pesanan.'); return; }
    heldOrders.push({ receiptNumber, cart:posCart, payment:posPayment, cash:$('#posCash').value, discount:$('#posDiscount').value, customer:$('#posCustomer').value });
    resetPos(false);
    updateHeldOrders();
    toast('Pesanan ditahan selama halaman ini terbuka.');
  }
  function resumeOrder() {
    if (posCart.length) { toast('Selesaikan atau tahan pesanan aktif terlebih dahulu.'); return; }
    const order = heldOrders.shift();
    if (!order) return;
    posCart = order.cart;
    receiptNumber = order.receiptNumber;
    $('#posCash').value = order.cash;
    selectPayment(order.payment);
    $('#posDiscount').value = order.discount;
    $('#posCustomer').value = order.customer;
    $('#posCustomerLabel').textContent = order.customer;
    renderPos();
    updateHeldOrders();
    toast('Pesanan tertahan kembali ke kasir.');
  }
  function initPosDemo(){
    if (!$('#posProductGrid')) return;
    renderPos();
    selectPayment(posPayment);
    $('#posSearch').oninput = renderPosProducts;
    $('#posDiscount').onchange = renderPosTotals;
    $('#posCash').oninput = () => renderTender();
    $('#posCustomer').onchange = () => { $('#posCustomerLabel').textContent = $('#posCustomer').value; };
    $('#posReset').onclick = () => resetPos(true);
    $('#posViewOrder').onclick = () => {
      $('#posCartItems').scrollIntoView({block:'center'});
      $('#posCartItems').focus({preventScroll:true});
    };
    $$('.pos-payment-btn').forEach(button => { button.onclick = () => selectPayment(button.dataset.posPayment); });
    $('#posCheckout').onclick = openPosReceipt;
    $('#posHold').onclick = holdOrder;
    $('#posResume').onclick=resumeOrder; $('#posReceiptClose').onclick=()=>closePosReceipt(false); $('#posReceiptNew').onclick=()=>closePosReceipt(true); $('#posReceiptModal').addEventListener('click',e=>{if(e.target.id==='posReceiptModal')closePosReceipt(false)});
  }
