'use strict';

const landingTemplates = [
  {
    id: "resto",
    title: "Warteg Ami",
    category: "Kuliner",
    goal: "Pesanan",
    layout: "menu",
    paper: "#fbf0d6",
    ink: "#351e17",
    accent: "#934124",
    pitch: "Pelanggan bisa melihat harga per porsi atau memilih sepuluh kotak sekaligus untuk makan siang tim.",
    headline: "Hari ini makan apa?",
    lead: "Ayam kecap, telur balado, atau tumis tempe. Pilih lauk sebelum jam makan siang tiba.",
    section: "Pilih bekal siangmu",
    offers: [
      {name: "Paket ayam kecap", meta: "Rp25.000 / porsi", detail: "Nasi hangat, ayam kecap, tumis buncis, dan sambal terpisah."},
      {name: "Telur balado", meta: "Rp18.000 / porsi", detail: "Telur berbumbu cabai merah dengan sayur bening dan nasi."},
      {name: "Paket sekantor", meta: "10 kotak", detail: "Satu pilihan lauk per kotak. Tentukan jumlah dan jam pengambilan."}
    ],
    inquiry: "Saya ingin memesan {offer}. Bisa saya ambil menjelang makan siang?"
  },
  {
    id: "fashion",
    title: "MODE.STORE",
    category: "Mode",
    goal: "Pesanan",
    layout: "editorial",
    paper: "#f7ede1",
    ink: "#31241e",
    accent: "#884531",
    pitch: "Tunjukkan cara memadukan pakaian untuk kerja dan akhir pekan. Pembeli bisa memilih gaya sebelum menanyakan ukuran.",
    headline: "Satu kemeja, tiga agenda.",
    lead: "Mulai dari potongan yang mudah dipadukan. Pilih tampilan untuk bekerja, akhir pekan, atau bepergian.",
    section: "Pilih tampilanmu",
    offers: [
      {name: "Ke kantor", meta: "Kemeja & chino", detail: "Kemeja berpotongan lurus dengan celana chino warna pasir."},
      {name: "Akhir pekan", meta: "Kaos & denim", detail: "Kaos longgar dipadukan dengan jeans lurus dan manset terlipat."},
      {name: "Perjalanan singkat", meta: "Lapis luar", detail: "Kemeja ringan sebagai luaran untuk dua kombinasi pakaian."}
    ],
    inquiry: "Saya suka tampilan {offer}. Boleh lihat panduan ukuran dan pilihan warnanya?"
  },
  {
    id: "property",
    title: "Vista Residence",
    category: "Properti",
    goal: "Reservasi",
    layout: "editorial",
    paper: "#f4f1e3",
    ink: "#24382e",
    accent: "#365d45",
    pitch: "Perlihatkan perbedaan ruang dan halaman agar calon pembeli tahu rumah mana yang ingin mereka kunjungi.",
    headline: "Lihat ruangnya sebelum berkunjung.",
    lead: "Mulai dari cara Anda tinggal. Telusuri ruang kerja, halaman, dan akses masuk sebelum memilih unit untuk dilihat.",
    section: "Apa yang ingin Anda survei?",
    offers: [
      {name: "Rumah kompak", meta: "Dua kamar", detail: "Denah satu lantai dengan ruang keluarga yang menyatu dengan meja makan."},
      {name: "Rumah tumbuh", meta: "Halaman belakang", detail: "Ruang terbuka untuk berkebun atau menambah teras."},
      {name: "Kunjungan lokasi", meta: "Survei langsung", detail: "Tinjau akses jalan, arah cahaya, dan jarak antarunit."}
    ],
    inquiry: "Saya tertarik dengan {offer}. Kapan saya bisa melihat lokasinya?"
  },
  {
    id: "event",
    title: "StageUp Event",
    category: "Acara",
    goal: "Pendaftaran",
    layout: "stage",
    paper: "#201b31",
    ink: "#fff7ed",
    accent: "#ffa458",
    pitch: "Jadwal panggung dan pilihan tiket dalam satu halaman. Pengunjung bisa menentukan sesi sebelum mendaftar.",
    headline: "Datang untuk musiknya. Tinggal untuk sesi malam.",
    lead: "Sore dimulai dengan akustik di pelataran. Seusai jeda, panggung utama mengambil alih.",
    section: "Susun agenda malammu",
    offers: [
      {name: "Sesi pelataran", meta: "16.00", detail: "Set akustik pembuka dengan tempat duduk terbuka."},
      {name: "Panggung utama", meta: "19.00", detail: "Penampilan band dan area berdiri di depan panggung."},
      {name: "Akses sehari", meta: "Dua sesi", detail: "Ikuti kedua sesi dan ambil jeda di area komunitas."}
    ],
    inquiry: "Saya ingin ikut {offer}. Bagaimana cara mendaftar dan mengambil tiket?"
  },
  {
    id: "clinic",
    title: "Klinik Sehat",
    category: "Kesehatan",
    goal: "Reservasi",
    layout: "guide",
    paper: "#eff7f3",
    ink: "#183b35",
    accent: "#276451",
    pitch: "Pasien bisa memilih konsultasi pertama atau kontrol, lalu menanyakan jadwal ke resepsionis.",
    headline: "Rencanakan kunjungan Anda.",
    lead: "Pilih jenis kunjungan dan tanyakan waktu yang tersedia. Resepsionis akan membantu menyiapkan jadwal.",
    section: "Jenis kunjungan",
    offers: [
      {name: "Konsultasi umum", meta: "Kunjungan pertama", detail: "Tanyakan jam praktik dan dokumen yang perlu dibawa."},
      {name: "Konsultasi gigi", meta: "Janji temu", detail: "Pilih hari yang sesuai lalu konfirmasi jadwal ke resepsionis."},
      {name: "Kunjungan lanjutan", meta: "Kontrol", detail: "Sebutkan hari kunjungan sebelumnya saat menanyakan jadwal."}
    ],
    inquiry: "Saya ingin menjadwalkan {offer}. Hari dan jam apa yang tersedia?"
  },
  {
    id: "photographer",
    title: "Raka Visuals",
    category: "Portofolio",
    goal: "Reservasi",
    layout: "stage",
    paper: "#191d1c",
    ink: "#f4efe4",
    accent: "#f0c08f",
    pitch: "Tampilkan sesi potret, foto produk, dan liputan usaha agar klien bisa menjelaskan foto yang mereka butuhkan.",
    headline: "Cahaya yang pas untuk ceritamu.",
    lead: "Untuk potret diri, produk pertama, atau keseharian di studio. Mulai dengan memilih apa yang ingin difoto.",
    section: "Pilih sesi foto",
    offers: [
      {name: "Potret studio", meta: "Personal", detail: "Satu latar dan satu pilihan busana untuk potret profil."},
      {name: "Produk meja", meta: "Katalog", detail: "Susun daftar produk dan pilih warna latar yang sesuai."},
      {name: "Cerita usaha", meta: "Di lokasi", detail: "Dokumentasikan tempat kerja, proses, dan orang di balik produk."}
    ],
    inquiry: "Saya ingin menjadwalkan {offer}. Bisa bantu menyiapkan brief dan pilihan tanggal?"
  },
  {
    id: "coffee",
    title: "Atap Temu",
    category: "Kuliner",
    goal: "Reservasi",
    layout: "stage",
    paper: "#30211e",
    ink: "#fff6e7",
    accent: "#f1ba8b",
    pitch: "Biarkan tamu memilih meja tepi teras untuk berdua atau meja panjang untuk rombongan sebelum reservasi.",
    headline: "Meja sore di atas kota.",
    lead: "Mulai dengan kopi dingin saat langit masih terang. Pilih tempat untuk berdua atau satu meja panjang bersama teman.",
    section: "Pilih suasana",
    offers: [
      {name: "Tepi teras", meta: "Untuk dua orang", detail: "Kursi menghadap langit sore di area terbuka."},
      {name: "Meja bersama", meta: "Untuk rombongan", detail: "Satu meja panjang untuk berbagi kudapan dan mengobrol."},
      {name: "Sudut teduh", meta: "Semi-indoor", detail: "Tempat duduk beratap jika cuaca berubah."}
    ],
    inquiry: "Saya ingin memesan {offer}. Apakah ada meja untuk sore ini?"
  },
  {
    id: "bakery",
    title: "Golden Crust Bakery",
    category: "Kuliner",
    goal: "Pesanan",
    layout: "menu",
    paper: "#fff4cf",
    ink: "#42281e",
    accent: "#8c4328",
    pitch: "Perlihatkan isi dan jumlah roti per kotak agar pembeli bisa memilih sarapan kecil atau hadiah untuk dibawa pulang.",
    headline: "Bawa pulang satu kotak hangat.",
    lead: "Lapisan croissant, roti susu, dan pilihan kotak untuk dibagi. Tentukan isinya sebelum memesan.",
    section: "Isi kotakmu",
    offers: [
      {name: "Croissant mentega", meta: "Isi 2", detail: "Dua croissant klasik dalam kantong kertas."},
      {name: "Kotak sarapan", meta: "Isi 4", detail: "Roti susu dan croissant untuk meja sarapan."},
      {name: "Kotak hadiah", meta: "Isi 6", detail: "Campuran roti pilihan dengan ruang untuk kartu ucapan."}
    ],
    inquiry: "Saya ingin memesan {offer}. Bisa diambil pada tanggal pilihan saya?"
  },
  {
    id: "kartika-beauty",
    title: "Kartika Beauty Studio",
    category: "Kecantikan",
    goal: "Reservasi",
    layout: "editorial",
    paper: "#fff2ee",
    ink: "#4a2931",
    accent: "#884554",
    pitch: "Pasangkan tiap perawatan dengan durasinya. Pelanggan bisa memilih sesi yang muat di sela hari kerja.",
    headline: "Sisihkan waktu untuk dirimu.",
    lead: "Pilih sesi yang muat di sela hari kerja atau jadwalkan persiapan untuk acara khusus.",
    section: "Lihat menu studio",
    offers: [
      {name: "Perawatan wajah", meta: "45 menit", detail: "Sesi perawatan dasar dengan konsultasi singkat sebelum mulai."},
      {name: "Tata alis", meta: "30 menit", detail: "Diskusikan bentuk yang diinginkan dengan terapis."},
      {name: "Rias acara", meta: "90 menit", detail: "Bawa referensi busana dan warna riasan untuk acara Anda."}
    ],
    inquiry: "Saya ingin reservasi {offer}. Apakah ada jadwal kosong akhir pekan ini?"
  },
  {
    id: "luxefashion",
    title: "LUXE Atelier",
    category: "Mode",
    goal: "Reservasi",
    layout: "stage",
    paper: "#262221",
    ink: "#fff6e5",
    accent: "#e9c99c",
    pitch: "Ajak calon pembeli melihat koleksi, mencoba gaun, atau membicarakan busana pesanan dalam sesi pribadi.",
    headline: "Sebelum gaun itu dijahit.",
    lead: "Rasakan jatuhnya kain dan bicarakan siluetnya di atelier. Mulailah dari jenis pertemuan yang Anda butuhkan.",
    section: "Pertemuan di atelier",
    offers: [
      {name: "Lihat koleksi", meta: "Sesi pribadi", detail: "Bandingkan bahan dan siluet dari koleksi studio."},
      {name: "Fitting awal", meta: "Pengukuran", detail: "Bawa sepatu dan referensi potongan untuk pembahasan awal."},
      {name: "Konsultasi busana", meta: "Pesanan khusus", detail: "Ceritakan acara, pilihan kain, dan waktu pemakaian."}
    ],
    inquiry: "Saya ingin membuat janji untuk {offer}. Apa yang perlu saya siapkan?"
  },
  {
    id: "streetwear",
    title: "DROP CTRL",
    category: "Mode",
    goal: "Pesanan",
    layout: "poster",
    paper: "#dbf752",
    ink: "#161d28",
    accent: "#263ba8",
    pitch: "Kenalkan koleksi baru lewat warna dan potongan. Pembeli bisa menunjuk barang yang ingin mereka pesan.",
    headline: "Pilih warna drop berikutnya.",
    lead: "Topi enam panel, kaos lebar, dan lapisan luar ringan. Lihat potongannya sebelum menitipkan pilihan.",
    section: "Lihat koleksi drop",
    offers: [
      {name: "Six-panel cap", meta: "Biru kobalt", detail: "Topi dengan tali belakang yang dapat disesuaikan."},
      {name: "Box tee", meta: "Putih tulang", detail: "Kaos berpotongan lebar dengan garis bahu turun."},
      {name: "Coach jacket", meta: "Hijau lumut", detail: "Luaran ringan dengan kancing depan dan dua saku."}
    ],
    inquiry: "Saya tertarik dengan {offer}. Tolong kabari pilihan ukuran dan cara pesannya."
  },
  {
    id: "course",
    title: "SkillUp Academy",
    category: "Pendidikan",
    goal: "Pendaftaran",
    layout: "guide",
    paper: "#f5f1ff",
    ink: "#302447",
    accent: "#65468d",
    pitch: "Tunjukkan apa yang akan dibuat peserta di setiap modul, dari membaca brief sampai menyiapkan poster cetak.",
    headline: "Bikin poster pertamamu dari brief acara.",
    lead: "Belajar membaca brief, menyusun tipografi, dan menyiapkan berkas poster. Pilih tahap yang ingin kamu pelajari.",
    section: "Jalur belajar",
    offers: [
      {name: "Baca brief", meta: "Modul 1", detail: "Ubah kebutuhan acara menjadi daftar isi dan hierarki pesan."},
      {name: "Susun poster", meta: "Modul 2", detail: "Padukan judul, foto, dan ruang kosong dalam satu komposisi."},
      {name: "Siapkan berkas", meta: "Modul 3", detail: "Periksa margin dan ekspor versi cetak serta layar."}
    ],
    inquiry: "Saya tertarik dengan kelas desain, terutama modul {offer}. Kapan kelas berikutnya dibuka?"
  },
  {
    id: "saas",
    title: "FlowDesk AI",
    category: "Teknologi",
    goal: "Konsultasi",
    layout: "guide",
    paper: "#e7f5ed",
    ink: "#153c32",
    accent: "#226248",
    pitch: "Biarkan calon pengguna memilih bagian yang ingin mereka lihat saat demo, dari kotak masuk tim sampai rekap mingguan.",
    headline: "Satu tempat untuk melihat giliran kerja.",
    lead: "Ikuti contoh permintaan pelanggan sejak masuk, ditetapkan ke anggota tim, hingga selesai ditindaklanjuti.",
    section: "Pilih bagian demo",
    offers: [
      {name: "Kotak masuk", meta: "Penerimaan", detail: "Lihat contoh daftar permintaan baru dengan topik dan waktu masuk."},
      {name: "Pembagian kerja", meta: "Penugasan", detail: "Tentukan siapa yang memegang setiap permintaan dalam contoh tim."},
      {name: "Rekap mingguan", meta: "Pelaporan", detail: "Bandingkan pekerjaan yang sudah selesai dan yang perlu diteruskan."}
    ],
    inquiry: "Saya ingin melihat demo {offer} dengan contoh alur tim saya."
  },
  {
    id: "aiagency",
    title: "NeuralWorks Studio",
    category: "Teknologi",
    goal: "Konsultasi",
    layout: "poster",
    paper: "#bce3ff",
    ink: "#172e44",
    accent: "#254d7b",
    pitch: "Ajak pemilik usaha memilih satu pekerjaan berulang sebagai bahan konsultasi, dari mencatat pesanan sampai menyusun laporan.",
    headline: "Pekerjaan mana yang terus kamu ulang?",
    lead: "Mulai dari satu tugas harian. Petakan sumber data, aturan pengecekan, dan langkah yang masih memerlukan keputusan orang.",
    section: "Pilih titik awal",
    offers: [
      {name: "Catat pesanan", meta: "Data masuk", detail: "Petakan sumber pesanan dan kolom yang perlu dicatat."},
      {name: "Ingatkan tim", meta: "Tindak lanjut", detail: "Tentukan pemicu pengingat dan siapa yang menerimanya."},
      {name: "Susun rekap", meta: "Laporan", detail: "Tentukan data yang dibutuhkan pemilik usaha di akhir pekan."}
    ],
    inquiry: "Saya ingin membahas alur {offer}. Informasi proses apa yang perlu saya siapkan?"
  },
  {
    id: "cybertech",
    title: "SecureOps Cloud",
    category: "Teknologi",
    goal: "Konsultasi",
    layout: "stage",
    paper: "#192936",
    ink: "#edf5fa",
    accent: "#9ce3da",
    pitch: "Bantu tim memilih topik untuk sesi pengenalan, seperti alur notifikasi atau isi laporan pemantauan.",
    headline: "Saat ada peringatan, siapa yang melihatnya?",
    lead: "Lihat contoh pembagian peran saat tim menerima pemberitahuan. Pilih topik yang ingin dibahas dalam sesi pengenalan.",
    section: "Topik pengenalan",
    offers: [
      {name: "Ringkasan aset", meta: "Inventaris", detail: "Tinjau kelompok layanan dan penanggung jawab masing-masing."},
      {name: "Alur notifikasi", meta: "Koordinasi", detail: "Bahas siapa yang perlu menerima ringkasan peringatan."},
      {name: "Laporan bulanan", meta: "Evaluasi", detail: "Pilih informasi yang dibutuhkan pengelola dan pemilik bisnis."}
    ],
    inquiry: "Saya ingin mengenal bagian {offer}. Bisa jadwalkan sesi pengenalan untuk tim kami?"
  },
  {
    id: "portfolio",
    title: "Aksa Portfolio",
    category: "Portofolio",
    goal: "Konsultasi",
    layout: "poster",
    paper: "#efe4ff",
    ink: "#2b2044",
    accent: "#6840a0",
    pitch: "Tampilkan contoh kebutuhan desain agar pemilik usaha bisa memilih identitas merek, poster, atau kemasan untuk dibahas.",
    headline: "Dari sketsa menjadi wajah sebuah usaha.",
    lead: "Jelajahi tiga bentuk kerja studio. Pilih kebutuhan yang paling dekat dengan proyek yang sedang kamu rencanakan.",
    section: "Bidang kerja",
    offers: [
      {name: "Identitas kedai", meta: "Merek", detail: "Eksplorasi huruf dan warna untuk papan nama dan kemasan."},
      {name: "Poster acara", meta: "Kampanye", detail: "Susun identitas acara yang terbaca di jalan dan di layar."},
      {name: "Label produk", meta: "Kemasan", detail: "Rancang hierarki nama, varian, dan informasi pada satu label."}
    ],
    inquiry: "Saya ingin membahas proyek {offer}. Boleh minta daftar bahan untuk brief awal?"
  },
  {
    id: "consultant",
    title: "Nara Consulting",
    category: "Jasa",
    goal: "Konsultasi",
    layout: "guide",
    paper: "#f0f1e8",
    ink: "#2d3728",
    accent: "#445f3d",
    pitch: "Beri calon klien pilihan untuk memulai konsultasi dari harga jual, pembagian kerja, atau laporan usaha.",
    headline: "Mulai dari satu keputusan yang tertunda.",
    lead: "Bawa satu persoalan yang paling sering muncul di usaha Anda. Kita dapat mulai dari harga, pembagian kerja, atau cara membaca laporan.",
    section: "Topik pertemuan",
    offers: [
      {name: "Susun harga", meta: "Penawaran", detail: "Petakan biaya dan pilihan paket yang saat ini ditawarkan."},
      {name: "Bagi tanggung jawab", meta: "Operasional", detail: "Lihat pekerjaan harian dan titik serah yang sering terlewat."},
      {name: "Baca laporan", meta: "Keuangan usaha", detail: "Tentukan pertanyaan bisnis yang ingin dijawab oleh rekap bulanan."}
    ],
    inquiry: "Saya ingin membahas topik {offer}. Catatan usaha apa yang sebaiknya saya bawa?"
  }
];

let activeLandingFilter = 'Semua';
let activeLandingTemplate = landingTemplates[0];

function landingArtwork(design) {
  return new URL('/public/landing-art/' + design.id + '.webp', location.origin).href;
}

function landingStylesheet() {
  return new URL('/public/landing-preview.css?v=1', location.origin).href;
}

function landingPalette(design) {
  return `--design-paper:${design.paper}; --design-ink:${design.ink}; --design-accent:${design.accent}`;
}

function landingHtml(design) {
  const html = escapeCatalogHtml;
  const offers = design.offers.map(offer => `
    <details class="example-action" name="offer">
      <summary><strong>${html(offer.name)}</strong><span>${html(offer.meta)}</span></summary>
      <div class="offer-body"><p>${html(offer.detail)}</p>
        <div class="draft"><small>Contoh pesan pelanggan</small><p>${html(design.inquiry.replace('{offer}', '“' + offer.name + '”'))}</p></div>
      </div>
    </details>`).join('');
  return `<!doctype html><html lang="id"><head><meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${html(design.title)} · Contoh Landing Page</title>
    <link rel="stylesheet" href="${landingStylesheet()}"></head>
    <body class="design layout-${design.layout}" style="${landingPalette(design)}"><main>
      <header class="wordmark"><b>${html(design.title)}</b><span>Contoh desain KAR Labs</span></header>
      <section class="hero"><img src="${landingArtwork(design)}" alt="">
        <div class="intro"><h1>${html(design.headline)}</h1><p>${html(design.lead)}</p></div>
      </section>
      <section class="offers"><header><h2>${html(design.section)}</h2>
        <p>Pilih untuk melihat rincian dan contoh pesan.</p></header><div class="offer-list">${offers}</div>
      </section>
    </main></body></html>`;
}

function filteredLandingTemplates() {
  const goal = $('#landingGoal').value;
  return landingTemplates.filter(design =>
    (activeLandingFilter === 'Semua' || design.category === activeLandingFilter) &&
    (!goal || design.goal === goal));
}

function renderLandingTemplates() {
  const grid = $('#landingTemplateGrid');
  const designs = filteredLandingTemplates();
  $('#landingCount').textContent = designs.length + ' contoh desain';
  for (const button of $$('#landingIndustryFilters button')) {
    const selected = button.dataset.filter === activeLandingFilter;
    button.setAttribute('aria-pressed', String(selected));
    button.classList.toggle('active', selected);
  }
  if (!designs.length) {
    grid.innerHTML = '<div class="landing-empty"><p>Belum ada contoh untuk kombinasi jenis usaha dan tujuan ini.</p><button type="button" data-clear-filters>Tampilkan semua desain</button></div>';
    return;
  }
  const html = escapeCatalogHtml;
  grid.innerHTML = designs.map(design => `
    <article class="landing-template-card">
      <div aria-hidden="true" class="landing-cover cover-${design.layout}" style="${landingPalette(design)}">
        <img src="${landingArtwork(design)}" loading="lazy" decoding="async" alt="">
        <span>${html(design.headline)}</span>
      </div>
      <div class="landing-design-caption"><p>${html(design.category)} · ${html(design.goal)}</p>
        <h4>${html(design.title)}</h4><p>${html(design.pitch)}</p>
        <button type="button" class="preview-landing-btn" data-template="${design.id}" aria-label="Buka desain ${html(design.title)}">Coba desain <span aria-hidden="true">↗</span></button>
      </div>
    </article>`).join('');
}

function landingInquiryUrl(design) {
  const message = `Halo KAR Labs, saya tertarik dengan contoh Landing Page ${design.title} (${design.category}). Tujuan halaman saya: ${design.goal.toLowerCase()}. Bisa kita bahas penawaran dan isi halaman untuk usaha saya?`;
  return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(message);
}

function openLandingPreviewInNewTab(design) {
  const win = window.open('', '_blank');
  if (!win) return false;
  win.opener = null;
  win.location.replace('/public/landing-preview.html?design='+encodeURIComponent(design.id));
  return true;
}

function initStandaloneLanding() {
  const shell = document.querySelector('.preview-shell');
  if (!shell) return;
  const design = landingTemplates.find(item => item.id === new URLSearchParams(location.search).get('design'));
  if (!design) return;
  document.title = design.title + ' · Demo KAR Labs';
  shell.querySelector('header b').textContent = design.title;
  shell.querySelector('[data-unavailable]').hidden = true;
  const link = shell.querySelector('[data-design-inquiry]');
  link.href = landingInquiryUrl(design);
  link.hidden = false;
  const back = shell.querySelector('button');
  back.hidden = false;
  back.onclick = () => {
    window.close();
    if (!window.closed) location.replace('/portfolio/landing/#canvas-demo');
  };
  const frame = shell.querySelector('iframe');
  frame.title = 'Contoh halaman '+design.title;
  frame.srcdoc = landingHtml(design);
  frame.hidden = false;
}

initStandaloneLanding();

function openLandingPreview(id, opener) {
  const design = landingTemplates.find(item => item.id === id);
  const modal = $('#landingPreviewModal');
  if (!design || !modal) return;
  activeLandingTemplate = design;
  if (!modal.classList.contains('open') && matchMedia('(max-width: 767px)').matches && openLandingPreviewInNewTab(design)) return;
  const switcher = $('#landingSwitch');
  switcher.replaceChildren(...filteredLandingTemplates().map(item => new Option(item.title, item.id)));
  switcher.value = design.id;
  $('#landingPreviewTitle').textContent = design.title;
  $('#landingPreviewMeta').textContent = design.category + ' · ' + design.goal;
  $('#landingInquiry').href = landingInquiryUrl(design);
  const frame = $('#landingPreviewFrame');
  frame.title = 'Contoh halaman ' + design.title;
  frame.srcdoc = landingHtml(design);
  openCatalogDialog(modal, opener);
}

function closeLandingPreview() {
  $('#landingPreviewModal')?.classList.remove('open');
}

function initLanding() {
  const filters = $('#landingIndustryFilters');
  if (!filters) return;
  const categories = ['Semua', ...new Set(landingTemplates.map(design => design.category))];
  filters.replaceChildren(...categories.map(category => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'landing-filter-btn';
    button.dataset.filter = category;
    button.textContent = category;
    return button;
  }));
  filters.onclick = event => {
    const button = event.target.closest('button[data-filter]');
    if (!button) return;
    activeLandingFilter = button.dataset.filter;
    renderLandingTemplates();
  };
  $('#landingGoal').onchange = renderLandingTemplates;
  $('#landingTemplateGrid').onclick = event => {
    const reset = event.target.closest('[data-clear-filters]');
    if (reset) {
      activeLandingFilter = 'Semua';
      $('#landingGoal').value = '';
      renderLandingTemplates();
      filters.querySelector('button').focus();
      return;
    }
    const opener = event.target.closest('.preview-landing-btn');
    if (opener) openLandingPreview(opener.dataset.template, opener);
  };
  renderLandingTemplates();
  $('#landingSwitch').onchange = event => openLandingPreview(event.target.value);
  const widths = $$('[data-preview-width]');
  for (const button of widths) {
    button.onclick = () => {
      $('#landingPreviewFrame').style.maxWidth = button.dataset.previewWidth === 'phone' ? '390px' : '';
      widths.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    };
  }
  $('#closeLandingPreview').onclick = closeLandingPreview;
  $('#landingPreviewModal').onclick = event => {
    if (event.target === event.currentTarget) closeLandingPreview();
  };
  $('#openLandingNewTab').onclick = () => {
    if (!openLandingPreviewInNewTab(activeLandingTemplate)) toast('Izinkan tab baru di browser untuk membuka desain.');
  };
}
