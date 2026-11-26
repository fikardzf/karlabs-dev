'use strict';

function initProductCatalog() {
  const collection = [
    {id:'linen', name:'Kemeja Linen', category:'Baju', color:'Gading', price:189000, sizes:['S','M','L','XL']},
    {id:'garis', name:'Kemeja Garis', category:'Baju', color:'Biru kobalt', price:179000, sizes:['S','M','L','XL']},
    {id:'kaos', name:'Kaos Boxy', category:'Baju', color:'Terakota', price:99000, sizes:['S','M','L','XL']},
    {id:'chino', name:'Celana Chino', category:'Celana', color:'Pasir', price:219000, sizes:['28','30','32','34']},
    {id:'denim', name:'Jeans Straight', category:'Celana', color:'Indigo', price:259000, sizes:['28','30','32','34']},
    {id:'lipit', name:'Celana Lipit', category:'Celana', color:'Arang', price:229000, sizes:['S','M','L','XL']}
  ];
  const grid = $('#productDemoGrid');
  const search = $('#productSearch');
  const category = $('#productCategory');
  const sort = $('#productSort');
  const dialog = $('#productDetailDialog');
  const size = $('#productSize');
  const quantity = $('#productQuantity');
  const bag = new Map();
  const bagPanel = $('#fashionBag');
  let selected;

  function photo(product, cssClass) {
    return `<img class="${cssClass}" src="/public/fashion/${product.id}.webp" width="480" height="480" loading="lazy" alt="${product.name}, warna ${product.color.toLowerCase()}">`;
  }

  function render() {
    const term = search.value.trim().toLocaleLowerCase('id-ID');
    const products = collection.filter(p => (!category.value || p.category === category.value) &&
      [p.id,p.name,p.color,p.category].join(' ').toLocaleLowerCase('id-ID').includes(term));
    if (sort.value === 'asc') products.sort((a,b) => a.price - b.price);
    if (sort.value === 'desc') products.sort((a,b) => b.price - a.price);
    grid.innerHTML = products.map(p => `<article class="product-demo-card">${photo(p, 'fashion-photo')}
      <div class="fashion-caption"><p>${p.category} / ${p.color}</p><h4>${p.name}</h4>
      <p class="product-demo-price">${fmtRp(p.price)}</p>
      <button type="button" data-product-detail="${p.id}" aria-label="Pilih ukuran ${p.name}">Pilih ukuran</button></div></article>`).join('');
    $('#productEmpty').hidden = products.length > 0;
    $('#productResultStatus').textContent = `${products.length} produk contoh`;
  }

  function renderBag() {
    let total = 0, count = 0;
    const lines = [];
    const list = $('#bagItems');
    list.replaceChildren();
    for (const [key, item] of bag) {
      const subtotal = item.product.price * item.qty;
      total += subtotal;
      count += item.qty;
      const label = `${item.qty} × ${item.product.name} (${item.size})`;
      const row = document.createElement('li');
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = 'Hapus';
      remove.setAttribute('aria-label', 'Hapus ' + label);
      remove.onclick = () => {
        bag.delete(key);
        renderBag();
        bagPanel.querySelector('summary').focus();
      };
      row.append(label + ' · ' + fmtRp(subtotal), remove);
      list.append(row);
      lines.push(label);
    }
    $('#bagCount').textContent = count + ' item';
    $('#bagDraft').textContent = count ? `Draf pesanan: Halo, saya ingin memesan ${lines.join(', ')}. Total ${fmtRp(total)}. Apakah tersedia?` : 'Tas masih kosong.';
  }

  function updateChoice() {
    const summary = `${quantity.value} × ${selected.name}, ukuran ${size.value} · ${fmtRp(selected.price * Number(quantity.value))}`;
    $('#productMessage').textContent = summary;
    $('#productDetailWhatsApp').href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Halo KAR Labs, saya ingin membuat katalog usaha dengan pilihan produk seperti contoh ini: ' + summary + '.')}`;
  }

  function openDetail(product) {
    selected = product;
    $('#productDetailTitle').textContent = product.name;
    $('#productDetailBody').innerHTML = photo(product, 'fashion-detail-photo') +
      `<p class="fashion-detail-meta">${product.color} · ${fmtRp(product.price)}</p>`;
    size.replaceChildren(...product.sizes.map(value => new Option(value, value)));
    quantity.selectedIndex = 0;
    updateChoice();
    dialog.showModal();
  }

  function resetFilters() {
    search.value = '';
    category.value = '';
    sort.value = 'featured';
    render();
  }

  $('#retryProductDemo').onclick = initProductCatalog;
  try {
    category.replaceChildren(new Option('Semua',''), ...['Baju','Celana'].map(value => new Option(value,value)));
    search.oninput = category.onchange = sort.onchange = render;
    size.onchange = quantity.onchange = updateChoice;
    grid.onclick = event => {
      const button = event.target.closest('[data-product-detail]');
      if (button) openDetail(collection.find(p => p.id === button.dataset.productDetail));
    };
    $('#addToFashionBag').onclick = () => {
      const key = selected.id + '/' + size.value;
      const qty = (bag.get(key)?.qty || 0) + Number(quantity.value);
      bag.set(key, {product:selected, size:size.value, qty});
      renderBag();
      dialog.close();
      bagPanel.open = true;
      bagPanel.querySelector('summary').focus();
    };
    $('#resetProductDemo').onclick = () => { bag.clear(); renderBag(); bagPanel.open = false; resetFilters(); };
    $('#clearProductFilters').onclick = () => { resetFilters(); search.focus(); };
    $('#closeProductDetail').onclick = () => dialog.close();
    dialog.onclick = event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    };
    $('#productDemoError').hidden = true;
    renderBag();
    render();
  } catch (error) {
    grid.replaceChildren();
    $('#productResultStatus').textContent = 'Produk contoh belum tersedia.';
    $('#productDemoError').hidden = false;
    console.error('[KAR Labs product demo]', error);
  }
}
