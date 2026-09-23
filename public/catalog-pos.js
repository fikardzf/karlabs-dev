/* KAR Labs v2.6.0 - Point of Sales demo */
'use strict';
  const posDemoProducts=[
    {id:'coffee',name:'Americano',category:'Beverage',price:28000,stock:14,icon:'coffee'},
    {id:'latte',name:'Cafe Latte',category:'Beverage',price:35000,stock:9,icon:'cup-soda'},
    {id:'croissant',name:'Butter Croissant',category:'Bakery',price:32000,stock:5,icon:'sandwich'},
    {id:'rice',name:'Rice Bowl Chicken',category:'Food',price:48000,stock:7,icon:'utensils'},
    {id:'bottle',name:'Mineral Water',category:'Beverage',price:12000,stock:18,icon:'bottle'},
    {id:'cake',name:'Cheesecake Slice',category:'Dessert',price:42000,stock:2,icon:'cake-slice'}
  ];
  let posCart=[],posPayment='Cash',posOrderSequence=1,posHeldOrders=0;
  const posFmt=n=>'Rp '+Math.round(n).toLocaleString('id-ID');
  function posCartQty(id){return posCart.find(x=>x.id===id)?.qty||0}
  function renderPosProducts(){
    const grid=$('#posProductGrid'); if(!grid)return;
    const term=($('#posSearch')?.value||'').toLowerCase();
    grid.innerHTML=posDemoProducts.filter(p=>p.name.toLowerCase().includes(term)||p.category.toLowerCase().includes(term)).map(p=>{
      const remaining=p.stock-posCartQty(p.id), state=remaining<=0?'out':remaining<=3?'low':'';
      return `<button class="pos-product-card" data-pos-add="${p.id}" ${remaining<=0?'disabled':''}><div class="pos-product-icon"><i data-lucide="${p.icon}" class="w-5 h-5"></i></div><b class="block text-sm">${p.name}</b><span class="block text-accent font-bold text-sm mt-1">${posFmt(p.price)}</span><span class="pos-stock ${state}">${remaining<=0?'Stok habis':`Stok ${remaining}`}</span></button>`;
    }).join('') || '<div class="col-span-full text-center text-gray-500 py-10">Produk tidak ditemukan.</div>';
    $$('[data-pos-add]').forEach(btn=>btn.onclick=()=>addPosProduct(btn.dataset.posAdd)); refreshIcons();
  }
  function addPosProduct(id){
    const product=posDemoProducts.find(p=>p.id===id); if(!product)return;
    const item=posCart.find(x=>x.id===id); const qty=item?.qty||0;
    if(qty>=product.stock){toast('Stok produk demo tidak mencukupi.');return;}
    if(item)item.qty++; else posCart.push({...product,qty:1}); renderPos();
  }
  function updatePosQty(id,delta){
    const item=posCart.find(x=>x.id===id); if(!item)return;
    if(delta>0 && item.qty>=item.stock){toast('Jumlah sudah mencapai stok tersedia.');return;}
    item.qty+=delta; if(item.qty<=0)posCart=posCart.filter(x=>x.id!==id); renderPos();
  }
  function posTotals(){
    const subtotal=posCart.reduce((sum,x)=>sum+x.price*x.qty,0), rate=Number($('#posDiscount')?.value||0)/100, discount=Math.round(subtotal*rate), taxable=Math.max(0,subtotal-discount), tax=Math.round(taxable*.11), total=taxable+tax;
    return{subtotal,discount,tax,total};
  }
  function renderPosCart(){
    const box=$('#posCartItems'); if(!box)return;
    if(!posCart.length)box.innerHTML='<div class="pos-demo-empty"><div><i data-lucide="shopping-cart" class="w-9 h-9"></i><b class="block text-sm text-zinc-400">Cart masih kosong</b><p class="text-xs mt-1">Klik produk di sebelah kiri untuk mulai simulasi.</p></div></div>';
    else box.innerHTML=posCart.map(x=>`<div class="pos-cart-item"><div><b class="block text-sm">${x.name}</b><span class="text-xs text-gray-500">${posFmt(x.price)} / item</span><div class="pos-qty"><button data-pos-minus="${x.id}">−</button><span>${x.qty}</span><button data-pos-plus="${x.id}">+</button></div></div><b class="text-sm">${posFmt(x.price*x.qty)}</b></div>`).join('');
    $$('[data-pos-minus]').forEach(b=>b.onclick=()=>updatePosQty(b.dataset.posMinus,-1)); $$('[data-pos-plus]').forEach(b=>b.onclick=()=>updatePosQty(b.dataset.posPlus,1)); refreshIcons();
  }
  function renderPosTotals(){const t=posTotals(); if(!$('#posSubtotal'))return; $('#posSubtotal').textContent=posFmt(t.subtotal);$('#posDiscountValue').textContent='- '+posFmt(t.discount);$('#posTax').textContent=posFmt(t.tax);$('#posTotal').textContent=posFmt(t.total)}
  function renderPos(){renderPosProducts();renderPosCart();renderPosTotals()}
  function resetPos(showMessage=false){posCart=[];posPayment='Cash'; if($('#posDiscount'))$('#posDiscount').value='0'; if($('#posSearch'))$('#posSearch').value=''; $$('.pos-payment-btn').forEach(b=>b.classList.toggle('active',b.dataset.posPayment==='Cash')); renderPos(); if(showMessage)toast('Transaksi demo di-reset.');}
  function openPosReceipt(){
    if(!posCart.length){toast('Tambahkan produk ke cart terlebih dahulu.');return;}
    const t=posTotals(), modal=$('#posReceiptModal'); if(!modal)return;
    $('#posReceiptOrder').textContent='#DEMO-'+String(posOrderSequence++).padStart(4,'0'); $('#posReceiptCustomer').textContent=$('#posCustomer')?.value||'Walk-in Customer'; $('#posReceiptPayment').textContent=posPayment; $('#posReceiptTime').textContent=new Date().toLocaleString('id-ID',{dateStyle:'medium',timeStyle:'short'});
    $('#posReceiptItems').innerHTML=posCart.map(x=>`<div class="pos-receipt-line"><span>${x.qty}× ${x.name}</span><span>${posFmt(x.price*x.qty)}</span></div>`).join(''); $('#posReceiptSubtotal').textContent=posFmt(t.subtotal);$('#posReceiptDiscount').textContent='- '+posFmt(t.discount);$('#posReceiptTax').textContent=posFmt(t.tax);$('#posReceiptTotal').textContent=posFmt(t.total); modal.classList.add('open');modal.setAttribute('aria-hidden','false');
  }
  function closePosReceipt(reset=false){const modal=$('#posReceiptModal');if(modal){modal.classList.remove('open');modal.setAttribute('aria-hidden','true')} if(reset)resetPos(false)}
  function initPosDemo(){
    if(!$('#posProductGrid'))return; renderPos(); $('#posSearch').oninput=renderPosProducts; $('#posDiscount').onchange=renderPosTotals; $('#posCustomer').onchange=()=>{$('#posCustomerLabel').textContent=$('#posCustomer').value}; $('#posReset').onclick=()=>resetPos(true); $$('.pos-payment-btn').forEach(b=>b.onclick=()=>{posPayment=b.dataset.posPayment;$$('.pos-payment-btn').forEach(x=>x.classList.toggle('active',x===b))}); $('#posCheckout').onclick=openPosReceipt; $('#posHold').onclick=()=>{if(!posCart.length){toast('Cart masih kosong.');return;}posHeldOrders++;resetPos(false);toast(`Order ditahan. Pending demo: ${posHeldOrders}`)}; $('#posReceiptClose').onclick=()=>closePosReceipt(false); $('#posReceiptNew').onclick=()=>closePosReceipt(true); $('#posReceiptModal').addEventListener('click',e=>{if(e.target.id==='posReceiptModal')closePosReceipt(false)});
  }
