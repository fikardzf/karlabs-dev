/* KAR Labs v2.6.0 - Landing page preview catalog and rendering */
'use strict';
  const landingTemplates = [
    {
        "id": "resto",
        "layout": "fb-editorial",
        "icon": "🍜",
        "title": "Warteg Ami",
        "category": "Restoran & Café",
        "tone": "Editorial menu",
        "badge": "Menu Harian Favorit",
        "hero": "Masakan Rumahan Warteg Ami, Lebih Mudah Dipesan",
        "desc": "Landing page warteg modern untuk menampilkan menu harian, paket makan siang, lokasi, jam buka, dan tombol pesan cepat ke WhatsApp.",
        "cta": "Pesan Makan Sekarang",
        "stats": [
            "Menu Harian",
            "Paket Hemat",
            "Pesan via WA"
        ],
        "features": [
            "Menu harian",
            "Paket hemat",
            "Pesan cepat"
        ],
        "palette": [
            "#2b170c",
            "#fff7ed",
            "#f97316"
        ],
        "visual": "food editorial",
        "sections": [
            "Menu hari ini",
            "Paket lauk",
            "Pesan WhatsApp",
            "Lokasi & jam buka"
        ]
    },
    {
        "id": "coffee",
        "layout": "coffee-ambient",
        "icon": "☕",
        "title": "Atap Temu",
        "category": "Restoran & Café",
        "tone": "Lifestyle café",
        "badge": "Rooftop Coffee Space",
        "hero": "Tempat Ngopi, Ketemu, dan Nikmati Sore dari Atap Temu",
        "desc": "Landing page café rooftop untuk menonjolkan ambience, menu kopi, event kecil, reservasi tempat, dan konten visual yang terasa hangat.",
        "cta": "Reservasi Tempat",
        "stats": [
            "Rooftop Space",
            "Event Sore",
            "Manual Brew"
        ],
        "features": [
            "Rooftop gallery",
            "Event sore",
            "Reservasi CTA"
        ],
        "palette": [
            "#120b06",
            "#fff7ed",
            "#d97706"
        ],
        "visual": "warm cafe gallery",
        "sections": [
            "Gallery rooftop",
            "Menu kopi",
            "Jadwal event",
            "Reservasi"
        ]
    },
    {
        "id": "bakery",
        "layout": "bakery-shelf",
        "icon": "🥐",
        "title": "Golden Crust Bakery",
        "category": "Restoran & Café",
        "tone": "Artisan shelf",
        "badge": "Fresh From Oven",
        "hero": "Katalog Bakery yang Menjual Freshness, Hampers, dan Pre-Order dengan Visual Manis",
        "desc": "Didesain untuk bakery/dessert/hampers agar produk terlihat premium, mudah dipilih, dan langsung mengarah ke WhatsApp order.",
        "cta": "Pre-Order Hari Ini",
        "stats": [
            "Fresh Daily",
            "Hampers Ready",
            "Delivery Area"
        ],
        "features": [
            "Product shelf",
            "Hampers block",
            "Pre-order CTA"
        ],
        "palette": [
            "#fffbeb",
            "#7c2d12",
            "#f59e0b"
        ],
        "visual": "pastry shelf",
        "sections": [
            "Best seller shelf",
            "Hampers package",
            "Delivery notice",
            "Pre-order flow"
        ]
    },
    {
        "id": "clinic",
        "layout": "medical-trust",
        "icon": "🩺",
        "title": "Klinik Sehat",
        "category": "Klinik & Healthcare",
        "tone": "Medical booking",
        "badge": "Booking Konsultasi",
        "hero": "Perawatan Lebih Tenang, Jadwal Lebih Mudah, Trust Lebih Cepat Terbangun",
        "desc": "Untuk klinik umum, dokter gigi, fisioterapi, atau layanan kesehatan yang butuh jadwal dokter, trust badge, dan appointment form.",
        "cta": "Buat Janji",
        "stats": [
            "12 Dokter",
            "08-21 WIB",
            "Telekonsultasi"
        ],
        "features": [
            "Doctor profile",
            "Appointment card",
            "Trust section"
        ],
        "palette": [
            "#eff6ff",
            "#0f766e",
            "#14b8a6"
        ],
        "visual": "clinical trust",
        "sections": [
            "Doctor profile",
            "Appointment booking",
            "Service cards",
            "Patient trust"
        ]
    },
    {
        "id": "kartika-beauty",
        "layout": "beauty-studio",
        "icon": "💆‍♀️",
        "title": "Kartika Beauty Studio",
        "category": "Klinik & Healthcare",
        "tone": "Beauty studio",
        "badge": "Beauty Treatment Booking",
        "hero": "Tampilan Beauty Studio yang Elegan, Bersih, dan Siap Mengubah Followers Jadi Booking",
        "desc": "Contoh landing page beauty studio dengan nuansa soft premium: treatment menu, before-after highlight, paket promo, testimoni, dan CTA booking WhatsApp.",
        "cta": "Booking Treatment",
        "stats": [
            "Facial Treatment",
            "Eyelash & Brow",
            "Promo Member"
        ],
        "features": [
            "Treatment menu",
            "Before-after block",
            "Booking WhatsApp"
        ],
        "palette": [
            "#fff1f2",
            "#7f1d1d",
            "#fb7185"
        ],
        "visual": "soft blush beauty",
        "sections": [
            "Treatment menu",
            "Before-after result",
            "Promo package",
            "Booking form"
        ]
    },
    {
        "id": "fashion",
        "layout": "fashion-magazine",
        "icon": "👕",
        "title": "MODE.STORE",
        "category": "Fashion & Online Shop",
        "tone": "Magazine commerce",
        "badge": "New Editorial Drop",
        "hero": "Koleksi Baru yang Terasa Seperti Halaman Majalah Fashion",
        "desc": "Untuk fashion, beauty, aksesoris, atau produk visual yang butuh lookbook editorial, katalog produk, promo, dan CTA checkout.",
        "cta": "Shop The Look",
        "stats": [
            "50% Sale",
            "COD Ready",
            "Free Return"
        ],
        "features": [
            "Magazine hero",
            "Lookbook tiles",
            "Product CTA"
        ],
        "palette": [
            "#fafafa",
            "#111827",
            "#db2777"
        ],
        "visual": "fashion magazine",
        "sections": [
            "Lookbook hero",
            "Product tiles",
            "Promo banner",
            "Checkout CTA"
        ]
    },
    {
        "id": "luxefashion",
        "layout": "luxury-lookbook",
        "icon": "👜",
        "title": "LUXE Atelier",
        "category": "Fashion & Online Shop",
        "tone": "Luxury editorial",
        "badge": "Private Collection",
        "hero": "Luxury Pieces dengan Storytelling Visual yang Lebih Premium",
        "desc": "Untuk butik premium, jewelry, perfume, bag, atau beauty brand yang ingin terasa eksklusif dengan campaign story dan private order.",
        "cta": "Book Private Viewing",
        "stats": [
            "Limited Pieces",
            "Premium Material",
            "Private Order"
        ],
        "features": [
            "Luxury split",
            "Campaign story",
            "Private CTA"
        ],
        "palette": [
            "#09090b",
            "#fafafa",
            "#a855f7"
        ],
        "visual": "luxury editorial",
        "sections": [
            "Collection story",
            "Private viewing",
            "Material detail",
            "Inquiry CTA"
        ]
    },
    {
        "id": "streetwear",
        "layout": "street-drop",
        "icon": "🧢",
        "title": "DROP CTRL",
        "category": "Fashion & Online Shop",
        "tone": "Streetwear drop",
        "badge": "Drop Countdown",
        "hero": "Limited Drop yang Membuat Audience Siap Checkout Sebelum Kehabisan",
        "desc": "Untuk streetwear, sneakers, merchandise, atau brand anak muda dengan sistem drop, waitlist, limited stock, dan hype campaign.",
        "cta": "Join Waitlist",
        "stats": [
            "Limited Drop",
            "Waitlist Open",
            "Fast Checkout"
        ],
        "features": [
            "Brutalist layout",
            "Countdown drop",
            "Waitlist CTA"
        ],
        "palette": [
            "#050505",
            "#ffffff",
            "#f43f5e"
        ],
        "visual": "streetwear drop",
        "sections": [
            "Countdown drop",
            "Stock alert",
            "Waitlist form",
            "Fast checkout"
        ]
    },
    {
        "id": "property",
        "layout": "property-broker",
        "icon": "🏡",
        "title": "Vista Residence",
        "category": "Properti & Real Estate",
        "tone": "Property lead page",
        "badge": "Unit Terbatas",
        "hero": "Showcase Properti yang Membantu Customer Paham Unit, Lokasi, dan Jadwal Survey",
        "desc": "Untuk developer, agen rumah, apartemen, villa, atau kost premium dengan fokus galeri unit, fasilitas, lokasi, dan lead form survey.",
        "cta": "Jadwalkan Survey",
        "stats": [
            "5 Menit Tol",
            "24/7 Security",
            "DP Fleksibel"
        ],
        "features": [
            "Unit gallery",
            "Fasilitas",
            "Lead form"
        ],
        "palette": [
            "#f8fafc",
            "#0f172a",
            "#b45309"
        ],
        "visual": "real estate showcase",
        "sections": [
            "Unit gallery",
            "Facilities grid",
            "Location map",
            "Survey lead form"
        ]
    },
    {
        "id": "course",
        "layout": "course-roadmap",
        "icon": "🎓",
        "title": "SkillUp Academy",
        "category": "Course & Education",
        "tone": "Learning roadmap",
        "badge": "Batch Baru Dibuka",
        "hero": "Landing Page Kelas Online dengan Roadmap yang Membuat Peserta Paham Value-nya",
        "desc": "Untuk course, bootcamp, webinar, mentoring, atau komunitas belajar dengan kurikulum, mentor, benefit, dan CTA daftar batch.",
        "cta": "Daftar Kelas",
        "stats": [
            "8 Modul",
            "Mentor Aktif",
            "Sertifikat"
        ],
        "features": [
            "Roadmap section",
            "Mentor card",
            "Batch CTA"
        ],
        "palette": [
            "#eef2ff",
            "#312e81",
            "#6366f1"
        ],
        "visual": "education roadmap",
        "sections": [
            "Learning roadmap",
            "Mentor profile",
            "Batch schedule",
            "Registration CTA"
        ]
    },
    {
        "id": "saas",
        "layout": "saas-product",
        "icon": "⚡",
        "title": "FlowDesk AI",
        "category": "SaaS & Tech Startup",
        "tone": "Product dashboard",
        "badge": "AI Productivity Tool",
        "hero": "Demo Produk SaaS yang Menjelaskan Fitur Lewat Dashboard, Bukan Teks Panjang",
        "desc": "Untuk SaaS, aplikasi internal, dashboard, AI product, atau startup yang ingin tampil kredibel, teknikal, dan siap demo.",
        "cta": "Coba Demo",
        "stats": [
            "99.9% Uptime",
            "Realtime Sync",
            "AI Assist"
        ],
        "features": [
            "App preview",
            "Feature matrix",
            "Pricing CTA"
        ],
        "palette": [
            "#020617",
            "#fafafa",
            "#006847"
        ],
        "visual": "dashboard app",
        "sections": [
            "App preview",
            "Feature matrix",
            "Integration list",
            "Pricing CTA"
        ]
    },
    {
        "id": "aiagency",
        "layout": "ai-orbit",
        "icon": "🤖",
        "title": "NeuralWorks Studio",
        "category": "SaaS & Tech Startup",
        "tone": "AI agency landing",
        "badge": "AI Implementation Partner",
        "hero": "Bantu Bisnis Menggunakan AI Tanpa Ribet Teknis",
        "desc": "Untuk AI consultant, software house, automation agency, atau tech service yang ingin menjelaskan solusi, proses kerja, dan lead form konsultasi.",
        "cta": "Audit Workflow",
        "stats": [
            "AI Automation",
            "System Audit",
            "Custom Build"
        ],
        "features": [
            "Solution orbit",
            "Process cards",
            "Audit CTA"
        ],
        "palette": [
            "#ecfeff",
            "#0f172a",
            "#06b6d4"
        ],
        "visual": "AI solution orbit",
        "sections": [
            "Solution orbit",
            "Process cards",
            "Use cases",
            "Audit CTA"
        ]
    },
    {
        "id": "cybertech",
        "layout": "cyber-terminal",
        "icon": "🛡️",
        "title": "SecureOps Cloud",
        "category": "SaaS & Tech Startup",
        "tone": "Cybersecurity SaaS",
        "badge": "Security Monitoring",
        "hero": "Pantau Risiko Digital Sebelum Menjadi Masalah Besar",
        "desc": "Untuk cybersecurity, cloud service, IT managed service, atau B2B tech product dengan dashboard risk, trust metric, dan demo request.",
        "cta": "Request Security Demo",
        "stats": [
            "24/7 Monitor",
            "Risk Alert",
            "Audit Report"
        ],
        "features": [
            "SOC terminal",
            "Risk cards",
            "Demo CTA"
        ],
        "palette": [
            "#020617",
            "#e2e8f0",
            "#38bdf8"
        ],
        "visual": "security terminal",
        "sections": [
            "SOC terminal",
            "Risk cards",
            "Compliance badge",
            "Demo CTA"
        ]
    },
    {
        "id": "event",
        "layout": "event-stage",
        "icon": "🎤",
        "title": "StageUp Event",
        "category": "Event & Community",
        "tone": "Bold countdown",
        "badge": "Early Bird Ticket",
        "hero": "Event Page yang Membuat Audience Merasa Waktunya Terbatas dan Harus Daftar",
        "desc": "Untuk konser, seminar, workshop, komunitas, wedding organizer, atau event organizer yang butuh countdown, lineup, rundown, dan tiket.",
        "cta": "Ambil Tiket",
        "stats": [
            "12 Speaker",
            "500 Seats",
            "Live Streaming"
        ],
        "features": [
            "Countdown hero",
            "Lineup cards",
            "Ticket CTA"
        ],
        "palette": [
            "#111827",
            "#ffffff",
            "#f97316"
        ],
        "visual": "event stage",
        "sections": [
            "Countdown",
            "Lineup",
            "Rundown",
            "Ticket CTA"
        ]
    },
    {
        "id": "portfolio",
        "layout": "portfolio-case",
        "icon": "🧑‍💻",
        "title": "Aksa Portfolio",
        "category": "Personal Brand & Portfolio",
        "tone": "Case study portfolio",
        "badge": "Available for Project",
        "hero": "Portfolio Personal yang Menjelaskan Value, Bukan Hanya Menaruh Karya",
        "desc": "Untuk freelancer, creator, consultant, designer, atau talent yang ingin menampilkan karya, pengalaman, proses, dan kontak dengan rapi.",
        "cta": "Lihat Karya",
        "stats": [
            "24 Projects",
            "8 Clients",
            "3 Years"
        ],
        "features": [
            "Case study cards",
            "Service section",
            "Contact CTA"
        ],
        "palette": [
            "#f5f3ff",
            "#111827",
            "#7c3aed"
        ],
        "visual": "case study",
        "sections": [
            "Profile hero",
            "Case study",
            "Service list",
            "Contact CTA"
        ]
    },
    {
        "id": "photographer",
        "layout": "photo-masonry",
        "icon": "📸",
        "title": "Raka Visuals",
        "category": "Personal Brand & Portfolio",
        "tone": "Visual creator grid",
        "badge": "Commercial Photographer",
        "hero": "Galeri Visual yang Membuat Karya Terlihat Siap Dipilih Brand",
        "desc": "Untuk fotografer, videografer, creative director, atau studio visual yang ingin menampilkan galeri, paket jasa, dan booking inquiry.",
        "cta": "Book Session",
        "stats": [
            "Brand Shoot",
            "Event Photo",
            "Product Visual"
        ],
        "features": [
            "Masonry gallery",
            "Package cards",
            "Booking CTA"
        ],
        "palette": [
            "#0f172a",
            "#f8fafc",
            "#94a3b8"
        ],
        "visual": "photo masonry",
        "sections": [
            "Masonry gallery",
            "Package cards",
            "Client logos",
            "Booking CTA"
        ]
    },
    {
        "id": "consultant",
        "layout": "consultant-board",
        "icon": "💼",
        "title": "Nara Consulting",
        "category": "Personal Brand & Portfolio",
        "tone": "Consultant authority",
        "badge": "Business Advisor",
        "hero": "Bangun Kepercayaan dengan Insight, Bukti, dan Ajakan Konsultasi",
        "desc": "Untuk consultant, coach, trainer, speaker, atau expert yang ingin menampilkan framework, kredibilitas, insight, dan CTA konsultasi.",
        "cta": "Book Consultation",
        "stats": [
            "Strategy Audit",
            "Client Results",
            "Workshop"
        ],
        "features": [
            "Authority layout",
            "Framework cards",
            "Consult CTA"
        ],
        "palette": [
            "#f8fafc",
            "#0f172a",
            "#006847"
        ],
        "visual": "consulting framework",
        "sections": [
            "Framework",
            "Proof points",
            "Workshop offer",
            "Consult CTA"
        ]
    }
];

  let activeLandingTemplate = landingTemplates[0];
  let activeLandingFilter = 'Semua';
  const landingFilters = ['Semua','F&B','Healthcare','Fashion','Property','Education','Tech','Event','Portfolio'];
  const landingFilterMap = { 'F&B':['Restoran & Café'], Healthcare:['Klinik & Healthcare'], Fashion:['Fashion & Online Shop'], Property:['Properti & Real Estate'], Education:['Course & Education'], Tech:['SaaS & Tech Startup'], Event:['Event & Community'], Portfolio:['Personal Brand & Portfolio'] };

  function miniItems(items){ return (items||[]).map(x=>`<span>${x}</span>`).join(''); }
  function landingHtml(t){
    const esc=v=>String(v||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    const palette=t.palette||['#000000','#FAFAFA','#006847'];
    const bg=palette[0], fg=palette[1], accent=palette[2];
    const soft=layout=>layout==='beauty-studio' || layout==='bakery-shelf' || layout==='medical-trust' || layout==='property-broker' || layout==='course-roadmap' || layout==='consultant-board' || layout==='portfolio-case' || layout==='fashion-magazine';
    const dark=!soft(t.layout);
    const statCards=(items)=>items.map(s=>`<div class="stat"><b>${esc(s)}</b><span>Proof point</span></div>`).join('');
    const sectionCards=(items)=>items.map((s,i)=>`<div class="section-card"><span>0${i+1}</span><b>${esc(s)}</b><small>Customizable section</small></div>`).join('');
    const featurePills=(items)=>items.map(f=>`<span>${esc(f)}</span>`).join('');
    const productCards=(items,icons=['🍜','☕','🥐','🍰'])=>items.map((f,i)=>`<div class="product"><div class="pic">${icons[i%icons.length]}</div><b>${esc(f)}</b><small>Showcase</small></div>`).join('');
    const vars=`--bg:${bg};--fg:${fg};--accent:${accent};--muted:${dark?'#B8B8B8':'#64748B'};--paper:${dark?'rgba(255,255,255,.07)':'#FFFFFF'};--line:${dark?'rgba(255,255,255,.14)':'rgba(15,23,42,.12)'};`;
    const base=`*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,sans-serif;background:var(--bg);color:var(--fg)}.font{font-family:'Space Grotesk',Inter,sans-serif}.nav{height:72px;display:flex;align-items:center;justify-content:space-between;padding:0 7%;position:relative;z-index:2}.logo{font-family:'Space Grotesk';font-weight:900;font-size:22px;letter-spacing:-.04em}.links{display:flex;gap:22px;color:var(--muted);font-size:13px}.badge{display:inline-flex;padding:9px 14px;border-radius:999px;background:color-mix(in srgb,var(--accent) 14%,transparent);border:1px solid color-mix(in srgb,var(--accent) 38%,transparent);color:var(--accent);font-weight:900;font-size:11px;text-transform:uppercase;letter-spacing:.11em}.h1{font-family:'Space Grotesk';font-size:clamp(40px,7vw,84px);line-height:.92;margin:18px 0;letter-spacing:-.07em}.desc{font-size:17px;line-height:1.72;color:var(--muted);max-width:660px}.btns{display:flex;gap:12px;flex-wrap:wrap;margin-top:28px}.btn{border:0;border-radius:999px;padding:14px 22px;font-weight:900;background:var(--accent);color:white;box-shadow:0 18px 50px color-mix(in srgb,var(--accent) 22%,transparent)}.btn.alt{background:transparent;color:var(--fg);border:1px solid var(--line);box-shadow:none}.stat,.section-card,.product{padding:18px;border-radius:24px;background:var(--paper);border:1px solid var(--line)}.stat b,.section-card b,.product b{display:block}.stat span,.section-card small,.product small{font-size:12px;color:var(--muted)}.section-card span{display:inline-grid;place-items:center;width:34px;height:34px;border-radius:12px;background:color-mix(in srgb,var(--accent) 16%,transparent);color:var(--accent);font-weight:900;margin-bottom:12px}.pills{display:flex;gap:9px;flex-wrap:wrap}.pills span{border-radius:999px;padding:8px 11px;background:color-mix(in srgb,var(--accent) 14%,transparent);color:var(--accent);font-weight:800;font-size:12px}.mini-note{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.12em;font-weight:900}.footer{padding:24px 7%;color:var(--muted);border-top:1px solid var(--line);font-size:12px}.asset{position:relative;overflow:hidden;border:1px solid var(--line);background:var(--paper)}.asset:before{content:'';position:absolute;inset:-40%;background:radial-gradient(circle at 25% 20%,color-mix(in srgb,var(--accent) 38%,transparent),transparent 28%),radial-gradient(circle at 85% 80%,rgba(255,255,255,.22),transparent 22%);filter:blur(8px)}.asset>*{position:relative}.proof-strip{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.section-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.ribbon{border-radius:28px;padding:24px;background:color-mix(in srgb,var(--accent) 14%,transparent);border:1px solid color-mix(in srgb,var(--accent) 28%,transparent)}@media(max-width:780px){.links{display:none}.hero,.split,.proof-strip,.section-grid{grid-template-columns:1fr!important}.h1{font-size:42px}.desc{font-size:15px}.nav{padding:0 5%}}`;
    const wrapper=(css,html)=>`<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet"><style>:root{${vars}}${base}${css}</style></head><body>${html}<footer class="footer">Preview profesional dari KAR Labs.dev — asset, warna, copywriting, section, dan CTA dapat disesuaikan untuk brand client.</footer></body></html>`;
    const commonNav=(links=['Home','Benefit','Pricing','Contact'])=>`<nav class="nav"><div class="logo">${esc(t.title)}</div><div class="links">${links.map(l=>`<span>${esc(l)}</span>`).join('')}</div></nav>`;
    const heroText=`<div class="copy"><span class="badge">${esc(t.badge)}</span><h1 class="h1">${esc(t.hero)}</h1><p class="desc">${esc(t.desc)}</p><div class="pills">${featurePills(t.features)}</div><div class="btns"><button class="btn">${esc(t.cta)}</button><button class="btn alt">Lihat Detail</button></div></div>`;
    const layouts={
      'fb-editorial':()=>wrapper(`.hero{padding:60px 7%;display:grid;grid-template-columns:1fr .9fr;gap:42px;align-items:center}.menu-board{background:#2b170c;color:#fff7ed;border-radius:42px;padding:30px;box-shadow:18px 18px 0 var(--accent);transform:rotate(-2deg)}.menu-row{display:flex;justify-content:space-between;border-bottom:1px dashed rgba(255,255,255,.25);padding:14px 0}.plate{height:180px;border-radius:34px;background:linear-gradient(135deg,#f59e0b,#7c2d12);display:grid;place-items:center;font-size:72px;margin-bottom:18px}.story{padding:0 7% 72px;display:grid;grid-template-columns:1.1fr .9fr;gap:18px}.story>div{border-radius:30px;padding:24px;background:#fff7ed;color:#2b170c;border:1px solid #fed7aa}`,`${commonNav(['Menu','Cerita','Lokasi','Reservasi'])}<section class="hero">${heroText}<div class="menu-board"><div class="plate">🍽️</div><h2 class="font">Menu Warteg Ami</h2><div class="menu-row"><b>Paket Nasi + Ayam</b><span>25K</span></div><div class="menu-row"><b>Telur Balado + Sayur</b><span>18K</span></div><div class="menu-row"><b>Paket Hemat Kantor</b><span>Mulai 20K</span></div></div></section><section class="story"><div><p class="mini-note">Brand storytelling</p><h2 class="font">Membantu menu harian terlihat jelas, mudah dipilih, dan langsung bisa dipesan lewat WhatsApp.</h2></div><div class="proof-strip">${statCards(t.stats)}</div></section>`),
      'coffee-ambient':()=>wrapper(`body{background:#120b06}.hero{padding:52px 7% 70px;display:grid;grid-template-columns:.88fr 1.12fr;gap:36px;align-items:center}.photo-wall{display:grid;grid-template-columns:1fr 1fr;gap:14px}.shot{min-height:170px;border-radius:34px;background:linear-gradient(135deg,#3f1d0b,#d97706);display:grid;place-items:center;font-size:54px;box-shadow:0 22px 70px rgba(217,119,6,.18)}.shot.tall{grid-row:span 2;min-height:360px;background:linear-gradient(180deg,#78350f,#1c120a)}.eventbar{margin:0 7% 70px;border-radius:30px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);padding:22px;display:flex;justify-content:space-between;gap:14px;align-items:center}@media(max-width:780px){.photo-wall{grid-template-columns:1fr}.shot.tall{min-height:190px}.eventbar{display:block}}`,`${commonNav(['Coffee','Seasonal','Events','Member'])}<section class="hero">${heroText}<div class="photo-wall"><div class="shot tall">🌇</div><div class="shot">☕</div><div class="shot">🎶</div></div></section><div class="eventbar"><div><p class="mini-note">Ambience-driven page</p><b>Ngopi Sore, Rooftop Vibe, dan Event Kecil</b><p style="color:var(--muted)">Area untuk menu kopi, reservasi, event komunitas, dan konten ambience.</p></div><button class="btn">${esc(t.cta)}</button></div>`),
      'bakery-shelf':()=>wrapper(`body{background:#fffbeb;color:#7c2d12}.hero{padding:58px 7%;display:grid;grid-template-columns:1fr .94fr;gap:38px;align-items:center}.shelf{background:#fff7ed;border:1px solid #fcd9a5;border-radius:44px;padding:24px}.shelf-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}.pic{height:90px;border-radius:22px;background:#fde68a;display:grid;place-items:center;font-size:38px}.banner{margin:0 7% 70px;background:#7c2d12;color:#fffbeb;border-radius:34px;padding:28px;display:flex;justify-content:space-between;align-items:center}@media(max-width:780px){.shelf-grid{grid-template-columns:1fr}.banner{display:block}}`,`${commonNav(['Best Seller','Hampers','Delivery','Pre-Order'])}<section class="hero">${heroText}<div class="shelf"><p class="mini-note">Product shelf</p><h2 class="font">Fresh From Oven</h2><div class="shelf-grid">${productCards(t.features,['🥐','🍰','🍞','🎁'])}</div></div></section><div class="banner"><div><h2 class="font">Hampers & Pre-Order Ready</h2><p>Client bisa langsung pesan lewat WhatsApp dari katalog produk.</p></div><button class="btn">${esc(t.cta)}</button></div>`),
      'medical-trust':()=>wrapper(`body{background:#eff6ff;color:#0f172a}.hero{padding:64px 7%;display:grid;grid-template-columns:1fr .95fr;gap:38px;align-items:center}.booking{background:white;color:#0f172a;border-radius:38px;padding:26px;box-shadow:0 28px 80px rgba(13,148,136,.18)}.doctor{display:flex;gap:14px;align-items:center;padding:16px;border-radius:22px;background:#f0fdfa;margin:12px 0}.avatar{width:56px;height:56px;border-radius:18px;background:var(--accent);display:grid;place-items:center;color:white;font-size:24px}.trust{padding:0 7% 70px}`,`${commonNav(['Layanan','Dokter','Jadwal','Booking'])}<section class="hero">${heroText}<div class="booking"><p class="mini-note">Appointment ready</p><h2 class="font">Booking Appointment</h2><div class="doctor"><div class="avatar">👩‍⚕️</div><div><b>Dr. Maya</b><p style="margin:4px 0;color:#64748b">Dermatology • 10:00 - 14:00</p></div></div><div class="doctor"><div class="avatar">🦷</div><div><b>Dr. Andini</b><p style="margin:4px 0;color:#64748b">Dental Care • 15:00 - 20:00</p></div></div><button class="btn">${esc(t.cta)}</button></div></section><section class="trust"><div class="proof-strip">${statCards(t.stats)}</div></section>`),
      'beauty-studio':()=>wrapper(`body{background:#fff1f2;color:#4c0519}.nav{backdrop-filter:blur(16px)}.hero{padding:58px 7% 40px;display:grid;grid-template-columns:.94fr 1.06fr;gap:42px;align-items:center}.beauty-card{border-radius:46px;background:linear-gradient(145deg,#fff,#ffe4e6);border:1px solid rgba(190,18,60,.12);padding:22px;box-shadow:0 30px 90px rgba(244,63,94,.18)}.beauty-visual{min-height:420px;border-radius:36px;background:radial-gradient(circle at 30% 20%,#fecdd3,transparent 28%),linear-gradient(145deg,#fff7f7,#fb7185);display:grid;place-items:center;font-size:92px;position:relative;overflow:hidden}.beauty-visual:after{content:'before  •  treatment  •  after';position:absolute;bottom:20px;left:20px;right:20px;background:rgba(255,255,255,.75);border:1px solid rgba(190,18,60,.12);border-radius:999px;padding:12px;text-align:center;text-transform:uppercase;letter-spacing:.12em;font-size:11px;font-weight:900}.treatments{padding:0 7% 72px;display:grid;grid-template-columns:1fr 1fr;gap:18px}.treatment-menu{background:white;border-radius:34px;padding:24px;border:1px solid rgba(190,18,60,.12)}.treatment-row{display:flex;justify-content:space-between;gap:20px;padding:14px 0;border-bottom:1px solid #ffe4e6}.result-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.result{min-height:145px;border-radius:28px;background:linear-gradient(135deg,#fecdd3,#fff);display:grid;place-items:center;font-size:38px;border:1px solid rgba(190,18,60,.10)}@media(max-width:780px){.treatments{grid-template-columns:1fr}.beauty-visual{min-height:300px}}`,`${commonNav(['Treatment','Result','Promo','Booking'])}<section class="hero">${heroText}<div class="beauty-card"><div class="beauty-visual">✨</div></div></section><section class="treatments"><div class="treatment-menu"><p class="mini-note">Treatment menu</p><h2 class="font">Signature Treatment</h2><div class="treatment-row"><b>Glow Facial</b><span>From 150K</span></div><div class="treatment-row"><b>Eyelash / Brow</b><span>Booking</span></div><div class="treatment-row"><b>Beauty Package</b><span>Promo</span></div><button class="btn" style="margin-top:18px">${esc(t.cta)}</button></div><div class="treatment-menu"><p class="mini-note">Result showcase</p><h2 class="font">Before / After Highlight</h2><div class="result-grid"><div class="result">Before</div><div class="result">After</div></div><p style="color:var(--muted);line-height:1.6">Area ini membantu calon customer beauty studio melihat hasil, testimoni, dan langsung booking via WhatsApp.</p></div></section>`),
      'fashion-magazine':()=>wrapper(`body{background:#fafafa;color:#111827}.hero{padding:48px 7% 30px;display:grid;grid-template-columns:.82fr 1.18fr;gap:34px;align-items:end}.cover{min-height:520px;background:linear-gradient(135deg,#111827,#db2777);border-radius:44px;display:grid;place-items:center;color:white;font-size:92px}.headline{border-top:8px solid var(--fg);border-bottom:8px solid var(--fg);padding:26px 0}.lookgrid{padding:0 7% 70px;display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.tile{min-height:210px;border-radius:28px;background:#fff;border:1px solid #e5e7eb;padding:18px;display:flex;flex-direction:column;justify-content:end}@media(max-width:780px){.lookgrid{grid-template-columns:1fr 1fr}.cover{min-height:300px}}`,`${commonNav(['Lookbook','Collection','Sale','Cart'])}<section class="hero"><div class="cover">👗</div><div class="headline">${heroText}</div></section><section class="lookgrid">${t.features.concat(t.stats).slice(0,4).map(x=>`<div class="tile"><b>${esc(x)}</b><small>Shop the look</small></div>`).join('')}</section>`),
      'luxury-lookbook':()=>wrapper(`body{background:#09090b;color:#fafafa}.hero{padding:70px 7%;display:grid;grid-template-columns:1fr 1fr;gap:50px;align-items:center}.portrait{min-height:540px;border-radius:999px 999px 42px 42px;background:linear-gradient(180deg,#f5d0fe,#581c87);box-shadow:0 35px 100px rgba(168,85,247,.25);display:grid;place-items:center;font-size:98px}.quote{font-family:'Space Grotesk';font-size:26px;line-height:1.3;color:#d8b4fe}.details{padding:0 7% 72px}@media(max-width:780px){.portrait{min-height:320px}}`,`${commonNav(['Campaign','Collection','Private','Contact'])}<section class="hero"><div>${heroText}<p class="quote">“Luxury page harus terasa tenang, spacious, dan curated.”</p></div><div class="portrait">👜</div></section><section class="details"><div class="proof-strip">${statCards(t.stats)}</div></section>`),
      'street-drop':()=>wrapper(`body{background:#050505;color:#fff}.nav,.hero,.dropzone{border-bottom:3px solid #fff}.hero{padding:58px 7%;display:grid;grid-template-columns:1.1fr .9fr;gap:28px;align-items:center}.poster{min-height:430px;background:repeating-linear-gradient(45deg,#111 0 18px,#f43f5e 18px 36px);border:3px solid #fff;box-shadow:12px 12px 0 var(--accent);display:grid;place-items:center;font-size:92px}.dropzone{padding:30px 7% 70px;display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.dropcard{border:3px solid #fff;padding:22px;min-height:160px;background:#111}@media(max-width:780px){.dropzone{grid-template-columns:1fr}}`,`${commonNav(['Drop','Waitlist','Stock','Checkout'])}<section class="hero">${heroText}<div class="poster">🧢</div></section><section class="dropzone">${t.stats.map(s=>`<div class="dropcard"><h2 class="font">${esc(s)}</h2><p>Hype block untuk limited campaign.</p></div>`).join('')}</section>`),
      'property-broker':()=>wrapper(`body{background:#f8fafc;color:#0f172a}.hero{padding:52px 7%;display:grid;grid-template-columns:1.1fr .9fr;gap:30px}.property-card{border-radius:42px;overflow:hidden;background:white;box-shadow:0 30px 80px rgba(15,23,42,.12)}.photo{height:310px;background:linear-gradient(135deg,#d6d3d1,#92400e);display:grid;place-items:center;font-size:86px}.lead{padding:24px}.map{margin:0 7% 70px;border-radius:36px;background:#e2e8f0;min-height:260px;display:grid;place-items:center;color:#64748b}`,`${commonNav(['Unit','Fasilitas','Lokasi','Survey'])}<section class="hero">${heroText}<div class="property-card"><div class="photo">🏡</div><div class="lead"><p class="mini-note">Lead form survey</p><b>Nama, budget, jadwal survey, dan unit pilihan.</b><div class="proof-strip" style="margin-top:18px">${statCards(t.stats)}</div></div></div></section><div class="map">Interactive location / facilities preview</div>`),
      'course-roadmap':()=>wrapper(`body{background:#eef2ff;color:#1e1b4b}.hero{padding:62px 7%;display:grid;grid-template-columns:1fr .85fr;gap:36px;align-items:center}.roadmap{background:white;border-radius:40px;padding:26px;box-shadow:0 25px 80px rgba(79,70,229,.14)}.step{display:grid;grid-template-columns:42px 1fr;gap:14px;margin:18px 0}.num{width:42px;height:42px;border-radius:16px;background:var(--accent);color:white;display:grid;place-items:center;font-weight:900}.mentor{padding:0 7% 70px;display:grid;grid-template-columns:1fr 1fr;gap:16px}`,`${commonNav(['Kurikulum','Mentor','Batch','Daftar'])}<section class="hero">${heroText}<div class="roadmap"><p class="mini-note">Learning roadmap</p><h2 class="font">Alur Belajar</h2>${t.features.map((f,i)=>`<div class="step"><div class="num">${i+1}</div><div><b>${esc(f)}</b><p style="color:var(--muted);margin:4px 0">Materi disusun bertahap.</p></div></div>`).join('')}</div></section><section class="mentor"><div class="stat"><b>Mentor & Support</b><span>Profil mentor dan benefit belajar.</span></div><div class="stat"><b>Batch Information</b><span>Jadwal, kuota, dan harga.</span></div></section>`),
      'saas-product':()=>wrapper(`body{background:#020617;color:#fafafa}.hero{padding:62px 7%;display:grid;grid-template-columns:.9fr 1.1fr;gap:38px;align-items:center}.app{border-radius:34px;background:#0f172a;border:1px solid rgba(255,255,255,.12);padding:18px;box-shadow:0 30px 100px rgba(0,104,71,.18)}.top{height:44px;border-radius:16px;background:#111827;margin-bottom:14px}.dash{display:grid;grid-template-columns:.72fr 1.28fr;gap:14px}.side,.chart{border-radius:22px;background:rgba(255,255,255,.06);padding:16px}.bars{height:220px;display:flex;gap:10px;align-items:end}.bar{flex:1;border-radius:10px 10px 0 0;background:var(--accent)}.matrix{padding:0 7% 70px}@media(max-width:780px){.dash{grid-template-columns:1fr}}`,`${commonNav(['Features','Demo','Pricing','Login'])}<section class="hero">${heroText}<div class="app"><div class="top"></div><div class="dash"><div class="side"><b>AI Menu</b><p>Inbox</p><p>Workflow</p><p>Reports</p></div><div class="chart"><b>Automation Chart</b><div class="bars">${[45,72,58,88,66,96].map(h=>`<div class="bar" style="height:${h}%"></div>`).join('')}</div></div></div></div></section><section class="matrix"><div class="proof-strip">${statCards(t.stats)}</div></section>`),
      'ai-orbit':()=>wrapper(`body{background:#ecfeff;color:#0f172a}.hero{padding:64px 7%;display:grid;grid-template-columns:1fr 1fr;gap:38px;align-items:center}.orbit{position:relative;min-height:480px;border-radius:50%;background:radial-gradient(circle,#fff 0 22%,#cffafe 23% 62%,transparent 63%);display:grid;place-items:center}.center{width:150px;height:150px;border-radius:50%;background:var(--accent);color:white;display:grid;place-items:center;font-size:58px}.node{position:absolute;background:white;border:1px solid #a5f3fc;border-radius:999px;padding:12px 16px;font-weight:900}.n1{top:12%;left:35%}.n2{right:4%;top:45%}.n3{bottom:12%;left:20%}.process{padding:0 7% 72px}@media(max-width:780px){.orbit{min-height:320px}}`,`${commonNav(['Audit','Solusi','Proses','Konsultasi'])}<section class="hero">${heroText}<div class="orbit"><div class="center">🤖</div><div class="node n1">Audit</div><div class="node n2">Build</div><div class="node n3">Automate</div></div></section><section class="process"><div class="proof-strip">${statCards(t.stats)}</div></section>`),
      'cyber-terminal':()=>wrapper(`body{background:#020617;color:#e2e8f0}.hero{padding:62px 7%;display:grid;grid-template-columns:1fr 1fr;gap:34px;align-items:center}.terminal{background:#020617;border:1px solid #38bdf8;border-radius:28px;box-shadow:0 0 60px rgba(56,189,248,.2);overflow:hidden}.terminal .head{height:46px;background:#0f172a;display:flex;align-items:center;gap:8px;padding:0 16px}.head span{width:10px;height:10px;background:#38bdf8;border-radius:50%}.log{padding:22px;font-family:monospace;line-height:1.8}.risk{padding:0 7% 70px}`,`${commonNav(['Monitor','Risk','Report','Demo'])}<section class="hero">${heroText}<div class="terminal"><div class="head"><span></span><span></span><span></span></div><div class="log">$ scan --risk<br>&gt; Authentication: secure<br>&gt; Endpoint alert: 2 medium<br>&gt; Weekly report: ready<br>&gt; demo_request: enabled</div></div></section><section class="risk"><div class="proof-strip">${statCards(t.stats)}</div></section>`),
      'event-stage':()=>wrapper(`body{background:#111827;color:#fff}.hero{padding:70px 7%;display:grid;grid-template-columns:1fr .9fr;gap:40px;align-items:center;background:radial-gradient(circle at 80% 15%,rgba(249,115,22,.45),transparent 28%)}.stage{min-height:420px;border-radius:42px;background:linear-gradient(180deg,rgba(255,255,255,.14),rgba(255,255,255,.03));display:grid;place-items:center;font-size:110px;border:1px solid rgba(255,255,255,.14)}.count{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:24px}.count div{text-align:center;border-radius:18px;background:rgba(255,255,255,.08);padding:16px}.lineup{padding:0 7% 70px}@media(max-width:780px){.count{grid-template-columns:repeat(2,1fr)}}`,`${commonNav(['Lineup','Rundown','Venue','Ticket'])}<section class="hero"><div>${heroText}<div class="count"><div><b>12</b><br><small>Hari</small></div><div><b>08</b><br><small>Jam</small></div><div><b>45</b><br><small>Menit</small></div><div><b>20</b><br><small>Detik</small></div></div></div><div class="stage">🎤</div></section><section class="lineup"><div class="proof-strip">${statCards(t.stats)}</div></section>`),
      'portfolio-case':()=>wrapper(`body{background:#f5f3ff;color:#111827}.hero{padding:70px 7%;display:grid;grid-template-columns:.8fr 1.2fr;gap:42px;align-items:center}.profile{min-height:440px;border-radius:38px;background:linear-gradient(135deg,#ddd6fe,#7c3aed);display:grid;place-items:center;font-size:96px}.case{padding:0 7% 70px;display:grid;grid-template-columns:1.2fr .8fr;gap:16px}.panel{background:white;border-radius:30px;padding:24px;border:1px solid #ddd6fe}@media(max-width:780px){.case{grid-template-columns:1fr}}`,`${commonNav(['About','Works','Service','Contact'])}<section class="hero"><div class="profile">🧑‍💻</div>${heroText}</section><section class="case"><div class="panel"><p class="mini-note">Featured case study</p><h2 class="font">Project dijelaskan seperti cerita: problem, proses, hasil.</h2><p style="color:var(--muted)">${esc(t.desc)}</p></div><div class="panel">${statCards(t.stats)}</div></section>`),
      'photo-masonry':()=>wrapper(`body{background:#0f172a;color:#f8fafc}.hero{padding:52px 7%;display:grid;grid-template-columns:.95fr 1.05fr;gap:34px;align-items:center}.masonry{columns:2;column-gap:14px}.photo{break-inside:avoid;border-radius:28px;margin:0 0 14px;background:linear-gradient(135deg,#475569,#cbd5e1);height:140px;display:grid;place-items:center;font-size:42px}.photo.tall{height:240px}.packages{padding:0 7% 70px}@media(max-width:780px){.masonry{columns:1}}`,`${commonNav(['Gallery','Packages','Clients','Booking'])}<section class="hero">${heroText}<div class="masonry"><div class="photo tall">📸</div><div class="photo">🎞️</div><div class="photo">✨</div><div class="photo tall">🖼️</div></div></section><section class="packages"><div class="proof-strip">${statCards(t.stats)}</div></section>`),
      'consultant-board':()=>wrapper(`body{background:#f8fafc;color:#0f172a}.hero{padding:62px 7%;display:grid;grid-template-columns:1fr 1fr;gap:36px;align-items:center}.board{background:white;border:1px solid #e2e8f0;border-radius:36px;padding:26px;box-shadow:0 25px 80px rgba(15,23,42,.08)}.framework{display:grid;gap:14px}.fw{padding:18px;border-radius:22px;background:#ecfdf5;border-left:5px solid var(--accent)}.proof{padding:0 7% 70px}`,`${commonNav(['Framework','Results','Workshop','Consult'])}<section class="hero">${heroText}<div class="board"><p class="mini-note">Consulting framework</p><h2 class="font">Metode kerja yang mudah dipahami client.</h2><div class="framework">${t.features.map((f,i)=>`<div class="fw"><b>0${i+1}. ${esc(f)}</b><p style="margin:5px 0;color:var(--muted)">Area untuk menjelaskan metode kerja.</p></div>`).join('')}</div></div></section><section class="proof"><div class="proof-strip">${statCards(t.stats)}</div></section>`)
    };
    return (layouts[t.layout]||layouts['fb-editorial'])();
  }

  function renderLandingFilters(){
    const holder=$('#landingIndustryFilters'); if(!holder)return;
    holder.innerHTML = landingFilters.map(f=>`<button class="landing-filter-btn ${f===activeLandingFilter?'active':''}" data-filter="${f}">${f}</button>`).join('');
    $$('.landing-filter-btn',holder).forEach(btn=>btn.onclick=()=>{ activeLandingFilter=btn.dataset.filter; renderLandingTemplates(); });
  }
  function filteredLandingTemplates(){
    if(activeLandingFilter==='Semua') return landingTemplates;
    const cats=landingFilterMap[activeLandingFilter] || [];
    return landingTemplates.filter(t=>cats.includes(t.category));
  }
  function renderLandingTemplates(){
    const grid=$('#landingTemplateGrid'); if(!grid)return;
    renderLandingFilters();
    const data=filteredLandingTemplates();
    grid.innerHTML=data.map(t=>`<article class="landing-template-card glass rounded-3xl p-4 glow-hover transition-all duration-300 hover:-translate-y-1"><div class="landing-mini-browser mb-4"><iframe title="${t.title}" loading="lazy"></iframe></div><div class="flex items-start justify-between gap-3 mb-2"><div><p class="text-accent text-xs font-bold uppercase tracking-wider">${t.category}</p><h5 class="font-heading text-xl font-bold mt-1">${t.icon} ${t.title}</h5></div><span class="text-[11px] text-gray-500 border border-dark-border rounded-full px-2 py-1 whitespace-nowrap">${t.tone}</span></div><p class="text-gray-400 text-sm leading-relaxed mb-4">${t.desc}</p><div class="flex flex-wrap gap-2 mb-4">${t.features.map(f=>`<span class="text-[11px] bg-dark border border-dark-border rounded-full px-2.5 py-1 text-gray-400">${f}</span>`).join('')}</div><div class="landing-card-actions"><button type="button" class="btn-primary landing-preview-btn preview-landing-btn" data-template="${t.id}" aria-label="Lihat preview besar ${t.title}">Lihat Preview Besar</button></div></article>`).join('');
    $$('#landingTemplateGrid iframe').forEach((frame,i)=>{ frame.srcdoc=landingHtml(data[i]); });
    // Event delegation lebih stabil untuk card yang di-render ulang saat filter industri berubah.
    grid.onclick=(event)=>{
      const btn=event.target.closest('.preview-landing-btn');
      if(!btn || !grid.contains(btn)) return;
      event.preventDefault();
      event.stopPropagation();
      openLandingPreview(btn.dataset.template);
    };
    refreshIcons();
  }
  function isMobileViewport(){
    return window.matchMedia && window.matchMedia('(max-width: 767px)').matches;
  }
  function mobilePreviewShell(t){
    const doc = landingHtml(t);
    const title = `${t.icon || ''} ${t.title || 'Landing Page Preview'}`.trim();
    return `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1"><title>${title} - Mobile Preview</title><style>*{box-sizing:border-box}html,body{margin:0;min-height:100%;background:#050505;color:#fafafa;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;overflow:hidden}.preview-shell{width:100vw;height:100dvh;display:flex;flex-direction:column;background:#050505}.preview-bar{height:52px;flex:0 0 auto;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 14px;border-bottom:1px solid rgba(255,255,255,.1);background:rgba(5,5,5,.94);backdrop-filter:blur(12px)}.preview-title{min-width:0;font-size:13px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.preview-meta{font-size:11px;color:#006847;font-weight:800}.preview-open{border:1px solid rgba(0,104,71,.45);background:rgba(0,104,71,.12);color:#74C7A9;border-radius:999px;padding:8px 10px;text-decoration:none;font-size:11px;font-weight:900;white-space:nowrap}.preview-frame-wrap{flex:1;min-height:0;width:100%;max-width:430px;margin:0 auto;background:#fff;box-shadow:0 0 0 1px rgba(255,255,255,.08)}iframe{display:block;width:100%;height:100%;border:0;background:#fff}@media(min-width:768px){.preview-frame-wrap{height:100%;border-left:1px solid rgba(255,255,255,.1);border-right:1px solid rgba(255,255,255,.1)}}<\/style></head><body><main class="preview-shell"><div class="preview-bar"><div style="min-width:0"><div class="preview-meta">Mobile Preview</div><div class="preview-title">${title}</div></div><a class="preview-open" href="javascript:window.print()">Simpan</a></div><div class="preview-frame-wrap"><iframe id="mobileLandingPreview" title="${title}"></iframe></div></main><script>document.getElementById('mobileLandingPreview').srcdoc = ${JSON.stringify(doc)};<\/script></body></html>`;
  }
  function openLandingPreviewInNewTab(template){
    const win=window.open('', '_blank');
    if(!win){toast('Popup diblokir browser');return false;}
    win.document.open();
    win.document.write(mobilePreviewShell(template));
    win.document.close();
    return true;
  }
  function openLandingPreview(id){
    activeLandingTemplate = landingTemplates.find(t=>t.id===id) || landingTemplates[0];
    if(isMobileViewport()){
      openLandingPreviewInNewTab(activeLandingTemplate);
      return;
    }
    const modal=$('#landingPreviewModal');
    const title=$('#landingPreviewTitle');
    const meta=$('#landingPreviewMeta');
    const frame=$('#landingPreviewFrame');
    if(!modal || !title || !meta || !frame){ toast('Preview belum siap dimuat. Coba refresh halaman.'); return; }
    title.textContent = `${activeLandingTemplate.icon} ${activeLandingTemplate.title}`;
    meta.textContent = `${activeLandingTemplate.category} • ${activeLandingTemplate.tone}`;
    frame.srcdoc = landingHtml(activeLandingTemplate);
    modal.classList.add('open');
    document.body.style.overflow='hidden';
  }
  window.openLandingPreview = openLandingPreview;
  function closeLandingPreview(){
    const modal=$('#landingPreviewModal');
    if(modal) modal.classList.remove('open');
    document.body.style.overflow='';
  }
  function initLanding(){
    renderLandingTemplates();
    const closeBtn=$('#closeLandingPreview'); if(closeBtn) closeBtn.onclick=closeLandingPreview;
    const modal=$('#landingPreviewModal');
    if(modal){ modal.addEventListener('click',e=>{ if(e.target.id==='landingPreviewModal') closeLandingPreview(); }); }
    const openNew=$('#openLandingNewTab');
    if(openNew){
      openNew.onclick=()=>{
        const template = activeLandingTemplate || landingTemplates[0];
        const win=window.open('', '_blank');
        if(!win){toast('Popup diblokir browser');return;}
        win.document.open();
        if(isMobileViewport()){
          win.document.write(mobilePreviewShell(template));
        }else{
          win.document.write(landingHtml(template));
        }
        win.document.close();
      };
    }
    document.addEventListener('keydown',e=>{ const m=$('#landingPreviewModal'); if(e.key==='Escape' && m && m.classList.contains('open')) closeLandingPreview(); });
  }
