'use strict';

const showroomGuides = {
  'product-catalog':{problem:'Bantu pelanggan memilih produk sebelum menghubungi admin.',how:['Cari pakaian atau pilih kategori.','Pilih ukuran dan jumlah.','Buka tas untuk melihat total dan draf pesanan.'],benefit:'Informasi produk tersedia dalam satu tautan.',business:['retail','kuliner','jasa'],needs:['produk'],service:'Website Katalog Produk'},
  workflow:{problem:'Lihat bagaimana chat, pesanan, dan catatan stok menjadi tugas yang bisa diperiksa tim.',how:['Pilih pekerjaan dan salah satu kasus contoh.','Jalankan pemeriksaan atau coba kasus dengan data yang belum lengkap.','Tinjau hasilnya, minta revisi, atau bahas alur tersebut untuk usaha Anda.'],benefit:'Pemilik bisa melihat data yang dibutuhkan, aturan kerja, dan siapa yang memeriksa hasilnya.',business:['retail','kuliner','jasa'],needs:['admin','laporan'],service:'Automasi Workflow'},
  landing:{problem:'Tunjukkan apa yang bisa dipesan, dijadwalkan, atau ditanyakan pelanggan.',how:['Pilih jenis usaha dan tujuan halaman.','Buka desain lalu pilih salah satu penawaran.','Bawa desain pilihan ke konsultasi WhatsApp.'],benefit:'Pelanggan bisa melihat pilihan dan menyiapkan pertanyaan sebelum menghubungi Anda.',business:['retail','kuliner','jasa'],needs:['promosi'],service:'Landing Page'},
  chatbot:{problem:'Siapkan jawaban untuk pertanyaan yang berulang.',how:['Pilih jenis usaha.','Kirim pertanyaan atau pilih balasan cepat.','Tambahkan kata kunci dan coba responsnya.'],benefit:'Pisahkan pertanyaan rutin dari kebutuhan bantuan admin.',business:['retail','kuliner','jasa'],needs:['admin','produk'],service:'Chatbot WhatsApp'},
  calculator:{problem:'Tentukan harga jual, hitung target penjualan, atau perkirakan kapan perlu pesan stok.',how:['Pilih perhitungan dan contoh usaha.','Ubah satu angka untuk melihat dampaknya.','Buka cara menghitung atau bahas kalkulator pilihanmu lewat WhatsApp.'],benefit:'Lihat angka dan asumsi yang dibutuhkan untuk keputusan sehari-hari.',business:['retail','kuliner','jasa'],needs:['laporan','produk'],service:'Tool/Calculator Online'},
  dashboard:{problem:'Cek kas toko, tindak lanjut penawaran, belanja stok, atau hasil iklan.',how:['Pilih pertanyaan yang paling dekat dengan kegiatan usahamu.','Tambah transaksi atau ubah skenario, lalu lihat angka yang ikut berubah.','Unduh tabel atau diskusikan laporan pilihan lewat WhatsApp.'],benefit:'Gunakan contoh laporan untuk memilih angka yang perlu kamu pantau di Excel atau Google Sheets.',business:['retail','kuliner','jasa'],needs:['laporan'],service:'Dashboard Excel'},
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
  if (target === 'workflow' && typeof updateWorkflowInquiry === 'function') updateWorkflowInquiry();
  if (target === 'calculator' && typeof updateCalculatorInquiry === 'function') updateCalculatorInquiry();
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
