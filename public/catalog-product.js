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
      coffee:'Kopi tanpa susu. Contoh informasi menu dan pilihan penyajian.',
      latte:'Kopi dengan susu. Contoh penjelasan varian sebelum pemesanan.',
      croissant:'Produk roti. Contoh informasi komposisi dan ukuran.',
      rice:'Menu makanan. Contoh detail penyajian dan pemesanan.',
      bottle:'Minuman kemasan. Contoh pilihan ukuran produk.',
      cake:'Menu pencuci mulut. Contoh informasi porsi dan varian.'
    };
    category.innerHTML = '<option value="">Semua kategori</option>' + [...new Set(posDemoProducts.map(p=>p.category))].map(value=>`<option value="${value}">${labels[value]}</option>`).join('');
    function render() {
      const term = search.value.trim().toLocaleLowerCase('id-ID');
      const products = posDemoProducts.filter(p=>(!category.value || p.category===category.value) && (p.name+' '+labels[p.category]).toLocaleLowerCase('id-ID').includes(term));
      grid.innerHTML = products.map(p=>`<article class="product-demo-card"><p class="showroom-overline">${labels[p.category]}</p><h4>${p.name}</h4><p class="product-demo-price">${posFmt(p.price)} <span>harga contoh</span></p><p>${descriptions[p.id]}</p><button type="button" data-product-detail="${p.id}" class="btn-outline" aria-label="Lihat detail ${p.name}">Lihat detail</button></article>`).join('');
      $('#productEmpty').hidden = products.length>0;
      $('#productResultStatus').textContent = `${products.length} produk contoh`;
      $$('[data-product-detail]',grid).forEach(button=>button.onclick=()=>openDetail(button.dataset.productDetail));
    }
    function openDetail(id) {
      const product = posDemoProducts.find(p=>p.id===id);
      if (!product) return;
      $('#productDetailTitle').textContent = product.name;
      $('#productDetailBody').innerHTML = `<p class="showroom-note">Produk simulasi, bukan produk yang dijual KAR Labs.</p><dl class="product-specs"><div><dt>Kategori</dt><dd>${labels[product.category]}</dd></div><div><dt>Harga ilustrasi</dt><dd>${posFmt(product.price)}</dd></div><div><dt>Informasi produk</dt><dd>${descriptions[id]}</dd></div><div><dt>Untuk katalog usaha Anda</dt><dd>Foto, varian, harga, dan kontak admin menggunakan data usaha. Stok dan integrasi tambahan mengikuti penawaran.</dd></div></dl>`;
      $('#productDetailWhatsApp').href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Halo KAR Labs, saya ingin konsultasi Website Katalog Produk dengan alur seperti produk contoh '+product.name+'. Saya ingin membahas katalog untuk usaha saya, bukan membeli produk demo. Jenis usaha saya: ')}`;
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
