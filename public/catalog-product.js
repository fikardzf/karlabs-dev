'use strict';

function initProductCatalog() {
  const grid = $('#productDemoGrid');
  const search = $('#productSearch');
  const category = $('#productCategory');
  const dialog = $('#productDetailDialog');
  $('#retryProductDemo').onclick = initProductCatalog;
  try {
    if (!Array.isArray(posDemoProducts) || !posDemoProducts.length) throw new Error('Missing example products');
    const labels = {Beverage:'Minuman', Bakery:'Roti', Food:'Makanan', Dessert:'Dessert'};
    const descriptions = {
      coffee:'Espresso dan air, tanpa susu.',
      latte:'Espresso dengan susu. Pilih penyajian panas atau dingin.',
      croissant:'Pastri mentega berlapis, satu potong per porsi.',
      rice:'Semangkuk nasi dengan ayam dan sayuran.',
      bottle:'Air mineral, satu botol per pesanan.',
      cake:'Sepotong kue keju dengan topping stroberi.'
    };
    category.innerHTML = '<option value="">Semua kategori</option>' + [...new Set(posDemoProducts.map(p=>p.category))].map(value=>`<option value="${value}">${labels[value]}</option>`).join('');
    function render() {
      const term = search.value.trim().toLocaleLowerCase('id-ID');
      const products = posDemoProducts.filter(p=>(!category.value || p.category===category.value) && (p.name+' '+labels[p.category]).toLocaleLowerCase('id-ID').includes(term));
      grid.innerHTML = products.map(p=>`<article class="product-demo-card"><img class="menu-photo" src="/public/demo-menu/${p.id}.webp" width="480" height="480" loading="lazy" alt=""><p class="showroom-overline">${labels[p.category]}</p><h4>${p.name}</h4><p class="product-demo-price">${fmtRp(p.price)} <span>harga contoh</span></p><p>${descriptions[p.id]}</p><button type="button" data-product-detail="${p.id}" class="btn-outline" aria-label="Lihat detail ${p.name}">Lihat detail</button></article>`).join('');
      $('#productEmpty').hidden = products.length>0;
      $('#productResultStatus').textContent = `${products.length} produk contoh`;
      $$('[data-product-detail]',grid).forEach(button=>button.onclick=()=>openDetail(button.dataset.productDetail));
    }
    function openDetail(id) {
      const product = posDemoProducts.find(p=>p.id===id);
      if (!product) return;
      $('#productDetailTitle').textContent = product.name;
      $('#productDetailBody').innerHTML = `<img class="menu-detail-photo" src="/public/demo-menu/${id}.webp" width="480" height="480" alt=""><p class="showroom-note">Menu dan harga contoh.</p><dl class="product-specs"><div><dt>Kategori</dt><dd>${labels[product.category]}</dd></div><div><dt>Harga ilustrasi</dt><dd>${fmtRp(product.price)}</dd></div><div><dt>Informasi produk</dt><dd>${descriptions[id]}</dd></div></dl>`;
      const hasServing = id === 'coffee' || id === 'latte';
      const serving = $('#productServing');
      $('#servingLabel').hidden = !hasServing;
      serving.selectedIndex = 0;
      const quantity = $('#productQuantity');
      quantity.selectedIndex = 0;
      function previewMessage() {
        const item = product.name + (hasServing ? ' (' + serving.value.toLowerCase() + ')' : '');
        $('#productMessage').textContent = `Halo, saya ingin pesan ${quantity.value} ${item}. Apakah masih tersedia? Totalnya ${fmtRp(product.price * Number(quantity.value))}, ya?`;
      }
      serving.onchange = quantity.onchange = previewMessage;
      previewMessage();
      $('#productDetailWhatsApp').href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Halo KAR Labs, saya mencoba katalog dan melihat detail '+product.name+'. Saya ingin membuat katalog untuk usaha saya. Jenis usaha saya: ')}`;
      dialog.showModal();
    }
    function reset() {
      search.value=''; category.value='';
      if (dialog.open) dialog.close();
      render();
    }
    search.oninput=render;
    category.onchange=render;
    $('#resetProductDemo').onclick=reset;
    $('#clearProductFilters').onclick=()=>{reset();search.focus();};
    $('#closeProductDetail').onclick=()=>dialog.close();
    dialog.onclick=event=>{if(event.target===dialog && (event.clientX<dialog.getBoundingClientRect().left || event.clientX>dialog.getBoundingClientRect().right || event.clientY<dialog.getBoundingClientRect().top || event.clientY>dialog.getBoundingClientRect().bottom)) dialog.close();};
    $('#productDemoError').hidden=true;
    render();
  } catch (error) {
    grid.replaceChildren();
    $('#productResultStatus').textContent='Produk contoh belum tersedia.';
    $('#productDemoError').hidden=false;
    console.error('[KAR Labs product demo]',error);
  }
}
