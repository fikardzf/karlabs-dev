'use strict';

const showroomGuides = {
  'product-catalog':{problem:'Bantu pelanggan memilih produk sebelum menghubungi admin.',how:['Cari produk atau pilih kategori.','Buka detail produk.','Lihat contoh pertanyaan WhatsApp.'],benefit:'Informasi produk tersedia dalam satu tautan.',business:['retail','kuliner','jasa'],needs:['produk'],service:'Website Katalog Produk'},
  workflow:{problem:'Susun pencatatan dan tindak lanjut dalam satu alur.',how:['Pilih skenario dan mulai panduan.','Ikuti perubahan data setiap langkah.','Coba data tidak lengkap, lalu perbaiki.'],benefit:'Alur data, status, dan persetujuan admin lebih mudah ditinjau.',business:['retail','kuliner','jasa'],needs:['admin','laporan'],service:'Automasi Workflow'},
  landing:{problem:'Tampilkan usaha dan penawaran dalam satu halaman.',how:['Pilih kategori usaha.','Buka pratinjau tampilan.','Bandingkan susunan konten dan tombol kontak.'],benefit:'Informasi usaha mudah dibagikan kepada calon pelanggan.',business:['retail','kuliner','jasa'],needs:['promosi'],service:'Landing Page'},
  chatbot:{problem:'Siapkan jawaban untuk pertanyaan yang berulang.',how:['Pilih jenis usaha.','Kirim pertanyaan atau pilih balasan cepat.','Tambahkan kata kunci dan coba responsnya.'],benefit:'Pisahkan pertanyaan rutin dari kebutuhan bantuan admin.',business:['retail','kuliner','jasa'],needs:['admin','produk'],service:'Chatbot WhatsApp'},
  calculator:{problem:'Hitung estimasi dengan input yang konsisten.',how:['Pilih jenis kalkulator.','Ubah nilai input.','Tinjau hasil dan grafik.'],benefit:'Uji kebutuhan rumus. Hasil simulasi bukan nasihat profesional atau tarif resmi.',business:['retail','jasa'],needs:['laporan','produk'],service:'Tool/Calculator Online'},
  dashboard:{problem:'Baca ringkasan usaha dari data yang terstruktur.',how:['Pilih jenis dashboard.','Tinjau grafik dan indikator contoh.','Tambah transaksi atau unduh CSV.'],benefit:'Tentukan indikator dan format laporan yang dibutuhkan.',business:['retail','kuliner','jasa'],needs:['laporan'],service:'Dashboard Excel'},
  pos:{problem:'Coba alur kasir dari produk hingga struk.',how:['Tambahkan produk ke keranjang.','Atur jumlah, diskon, dan pembayaran.','Buka struk simulasi atau reset transaksi.'],benefit:'Tinjau alur kasir. Demo tidak memproses pembayaran atau menyimpan transaksi.',business:['retail','kuliner'],needs:['kasir'],service:'Point Of Sales'},
  scraping:{problem:'Susun data publik menjadi tabel yang dapat ditinjau.',how:['Mulai simulasi data.','Saring atau urutkan hasil.','Unduh contoh CSV.'],benefit:'Tinjau format data. Demo tidak mengakses URL; implementasi harus mengikuti izin dan aturan situs.',business:['retail','jasa'],needs:['laporan'],service:'Web Scraping Demo'}
};

function updateShowroom(target) {
  const guide=showroomGuides[target];
  if(!guide) return;
  const service=serviceCatalog.find(item=>item.id===target);
  $('#servicePicker').value=target;
  const detail=serviceDetails[guide.service];
  $('#serviceGuide').innerHTML=`<div class="showroom-heading"><div><h2 id="serviceGuideTitle">${target==='workflow'?'Business Automation':service.label}</h2><p class="guide-problem">${guide.problem}</p></div><div class="guide-actions"><a class="btn-primary" href="${waLink(guide.service)}" target="_blank" rel="noopener noreferrer">Konsultasi WhatsApp</a><a class="text-link" href="index.html?service=${target}#contact-form">Isi kebutuhan</a></div></div><details class="guide-instructions"><summary>Cara mencoba demo</summary><ol>${guide.how.map(step=>`<li>${step}</li>`).join('')}</ol><div class="guide-context"><p><b>Manfaat</b>${guide.benefit}</p><p><b>Contoh penggunaan</b>${detail.fit.slice(0,2).join('; ')}.</p></div><p class="showroom-note">Data simulasi, tanpa integrasi aktif. Rincian implementasi tersedia di bawah demo. <a href="index.html#harga" class="text-link">Lihat paket</a>.</p></details>`;
  const directLink=$('#serviceGuide a');
  directLink.dataset.leadService=target;
  directLink.dataset.leadPlacement='catalog';
  $$('[data-service-link]').forEach(link=>{
    const active=link.dataset.serviceLink===target;
    link.classList.toggle('active',active);
    if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
  });
}

function initShowroom() {
  const problem=$('#discoveryProblem'), business=$('#discoveryBusiness');
  function recommend() {
    const order=['product-catalog','workflow','chatbot','dashboard','pos','landing','calculator','scraping'];
    const filtered=order.filter(id=>(!problem.value||showroomGuides[id].needs.includes(problem.value))&&(!business.value||showroomGuides[id].business.includes(business.value)));
    const picks=problem.value||business.value?filtered:order.slice(0,2);
    $('#resetDiscovery').hidden=!problem.value&&!business.value;
    $('#discoveryResults').innerHTML=picks.length?`<p class="showroom-note">${problem.value||business.value?'Rekomendasi demo':'Mulai dari layanan utama'}</p><ul class="discovery-links">${picks.map(id=>`<li><a href="#${id}" data-service-link="${id}"><b>${id==='workflow'?'Business Automation':serviceCatalog.find(s=>s.id===id).label}</b><span>${showroomGuides[id].problem}</span></a></li>`).join('')}</ul>`:'<p class="showroom-status">Belum ada demo yang sesuai. Hapus filter atau pilih demo langsung.</p>';
    const current=$('.service-panel.active');
    if(current) $$('[data-service-link]').filter(link=>link.dataset.serviceLink===current.id).forEach(link=>link.setAttribute('aria-current','page'));
  }
  problem.onchange=recommend;
  business.onchange=recommend;
  $('#resetDiscovery').onclick=()=>{problem.value='';business.value='';recommend();problem.focus();};
  $('#servicePicker').onchange=event=>{location.hash=event.target.value;};
  recommend();
  installCatalogDialogBehavior();
}
