/* KAR Labs v2.6.0 - Chatbot demo */
'use strict';
  function initChat(){
    const area=$('#chatArea'), input=$('#chatInput'), quick=$('#quickReplies');
    let currentScenario='ecommerce';
    let customRules=[];
    const scenarioMap={
      ecommerce:{
        label:'Toko Online',
        menu:'Halo! Saya KAR Labs Assistant untuk demo toko online. Kamu bisa tanya tentang katalog, harga, promo, order, ongkir, atau admin.',
        quick:['📦 Katalog Produk','💰 Cek Harga','🎁 Promo Hari Ini','👤 Hubungi Admin'],
        rules:[
          {keys:['katalog','produk','barang'],title:'Katalog Produk',reply:'Ini contoh katalog otomatis:\n• Hoodie Oversize - Rp 199.000\n• Kaos Premium - Rp 89.000\n• Celana Jeans - Rp 179.000\n• Tote Bag - Rp 59.000\n\nKetik “harga” untuk lihat range harga atau “order” untuk cara beli.'},
          {keys:['harga','price','berapa'],title:'Cek Harga',reply:'Range harga produk:\n• Kaos: Rp 89.000 - Rp 129.000\n• Hoodie: Rp 179.000 - Rp 229.000\n• Celana: Rp 159.000 - Rp 249.000\n\nBot bisa disambungkan ke katalog asli agar harga selalu update.'},
          {keys:['promo','diskon','voucher'],title:'Promo',reply:'Promo hari ini:\n🎁 Beli 2 item gratis ongkir\n🔥 Diskon 10% untuk order pertama\n⚡ Flash sale jam 19.00 - 21.00\n\nKetik “order” untuk lanjut checkout.'},
          {keys:['order','beli','checkout'],title:'Cara Order',reply:'Cara order:\n1. Pilih produk dan ukuran\n2. Kirim nama + alamat + pesanan\n3. Admin/bot hitung total dan ongkir\n4. Transfer pembayaran\n5. Pesanan diproses dan nomor resi dikirim otomatis.'},
          {keys:['ongkir','pengiriman','kurir'],title:'Ongkir',reply:'Untuk cek ongkir, bot bisa minta kota tujuan dan berat produk. Contoh integrasi: JNE, J&T, SiCepat, atau tarif internal toko.'},
          {keys:['admin','cs','customer service'],title:'Hubungi Admin',reply:'Baik, saya arahkan ke admin.\nJam kerja: Senin - Sabtu, 09:00 - 21:00.\nDi versi asli, bot bisa otomatis meneruskan chat ke admin saat pertanyaan butuh handling manusia.'}
        ]
      },
      restaurant:{
        "label": "Restoran / Café",
        "menu": "Halo! Ini demo chatbot untuk restoran/café. Kamu bisa tanya menu, reservasi meja, promo paket, jam buka, lokasi, delivery, atau hubungi admin.",
        "quick": [
                "🍽️ Lihat Menu",
                "📅 Reservasi Meja",
                "🎁 Promo Paket",
                "🛵 Delivery / Takeaway"
        ],
        "rules": [
                {
                        "keys": [
                                "menu",
                                "makanan",
                                "minuman",
                                "katalog"
                        ],
                        "title": "Lihat Menu",
                        "reply": "Contoh menu populer:\n• Nasi Ayam Sambal Matah - Rp 38.000\n• Beef Rice Bowl - Rp 45.000\n• Pasta Creamy Mushroom - Rp 52.000\n• Kopi Susu Aren - Rp 24.000\n• Lychee Tea - Rp 22.000\n\nBot bisa dibuat menampilkan kategori menu, rekomendasi best seller, dan stok menu harian."
                },
                {
                        "keys": [
                                "reservasi",
                                "booking",
                                "meja",
                                "reserve"
                        ],
                        "title": "Reservasi Meja",
                        "reply": "Untuk reservasi meja, kirim format:\nNama:\nTanggal:\nJam datang:\nJumlah orang:\nArea pilihan: indoor/outdoor\n\nBot bisa bantu cek slot reservasi dan meneruskan data ke admin restoran."
                },
                {
                        "keys": [
                                "promo",
                                "paket",
                                "diskon",
                                "voucher"
                        ],
                        "title": "Promo Paket",
                        "reply": "Promo restoran hari ini:\n🍱 Lunch package mulai Rp 55.000\n☕ Buy 2 coffee get 1 pastry 50%\n🎂 Birthday package by request\n👨‍👩‍👧 Family set untuk 4 orang\n\nPromo bisa disesuaikan dengan campaign mingguan atau seasonal menu."
                },
                {
                        "keys": [
                                "delivery",
                                "takeaway",
                                "gofood",
                                "grabfood",
                                "shopeefood",
                                "pesan antar"
                        ],
                        "title": "Delivery / Takeaway",
                        "reply": "Pesanan bisa melalui:\n• Takeaway langsung ke outlet\n• GoFood / GrabFood / ShopeeFood\n• Delivery internal untuk area tertentu\n\nBot bisa mengarahkan customer ke link platform atau mencatat pesanan manual."
                },
                {
                        "keys": [
                                "jam",
                                "buka",
                                "operasional",
                                "open"
                        ],
                        "title": "Jam Operasional",
                        "reply": "Jam operasional contoh:\nSenin - Jumat: 10.00 - 22.00\nSabtu - Minggu: 09.00 - 23.00\n\nBot bisa otomatis memberi info last order, jam ramai, dan ketersediaan meja."
                },
                {
                        "keys": [
                                "lokasi",
                                "alamat",
                                "maps",
                                "parkir"
                        ],
                        "title": "Lokasi Restoran",
                        "reply": "Bot bisa mengirim Google Maps, info parkir, patokan lokasi, dan cabang terdekat. Cocok untuk restoran dengan beberapa outlet."
                },
                {
                        "keys": [
                                "event",
                                "ulang tahun",
                                "private",
                                "catering"
                        ],
                        "title": "Event / Private Dining",
                        "reply": "Untuk acara khusus, bot bisa menanyakan:\n• Jenis acara\n• Jumlah tamu\n• Tanggal & jam\n• Budget estimasi\n• Kebutuhan dekorasi/catering\n\nSetelah itu admin tinggal follow up dengan paket yang sesuai."
                },
                {
                        "keys": [
                                "admin",
                                "cs",
                                "manager"
                        ],
                        "title": "Hubungi Admin",
                        "reply": "Baik, saya arahkan ke admin restoran.\nJam kerja: Senin - Sabtu, 09:00 - 21:00.\nDi versi asli, bot bisa meneruskan chat ke admin outlet sesuai lokasi customer."
                }
        ]
},
      clinic:{
        label:'Klinik',
        menu:'Halo! Ini demo chatbot klinik. Kamu bisa tanya jadwal dokter, layanan, biaya konsultasi, booking, atau lokasi.',
        quick:['🩺 Layanan Klinik','👨‍⚕️ Jadwal Dokter','📅 Booking Janji','📍 Lokasi Klinik'],
        rules:[
          {keys:['layanan','service','perawatan'],title:'Layanan Klinik',reply:'Layanan tersedia:\n• Konsultasi umum\n• Pemeriksaan gigi\n• Konsultasi kulit\n• Medical check-up\n\nBot bisa menanyakan keluhan awal sebelum diarahkan ke layanan yang tepat.'},
          {keys:['jadwal','dokter','doctor'],title:'Jadwal Dokter',reply:'Contoh jadwal dokter:\n• Dr. Raka - Umum: Senin/Rabu/Jumat\n• Dr. Maya - Kulit: Selasa/Kamis\n• Dr. Andini - Gigi: Sabtu\n\nDi versi asli, jadwal bisa dibuat mengikuti data klinik.'},
          {keys:['booking','janji','daftar'],title:'Booking Janji',reply:'Untuk booking, kirim format:\nNama lengkap:\nKeluhan:\nDokter/layanan:\nTanggal pilihan:\n\nBot bisa bantu validasi slot sebelum admin follow up.'},
          {keys:['biaya','harga','tarif'],title:'Biaya Konsultasi',reply:'Estimasi biaya:\n• Konsultasi umum mulai Rp 75.000\n• Konsultasi spesialis mulai Rp 150.000\n• Treatment mengikuti tindakan\n\nHarga bisa disesuaikan dengan daftar layanan klinik.'},
          {keys:['lokasi','alamat','maps'],title:'Lokasi',reply:'Lokasi klinik bisa dikirim otomatis melalui Google Maps link. Bot juga bisa memberi arahan parkir, jam buka, dan kontak resepsionis.'}
        ]
      },
      course:{
        label:'Course',
        menu:'Halo! Ini demo chatbot untuk course/kelas. Kamu bisa tanya program, jadwal kelas, harga, daftar, atau benefit.',
        quick:['📚 Program Kelas','🗓️ Jadwal Batch','💳 Biaya Course','✅ Cara Daftar'],
        rules:[
          {keys:['program','kelas','course'],title:'Program Kelas',reply:'Program tersedia:\n• Basic Web Design\n• Excel Dashboard\n• AI Content Workflow\n• Automation untuk Bisnis\n\nBot bisa memberi rekomendasi kelas sesuai level user.'},
          {keys:['jadwal','batch','mulai'],title:'Jadwal Batch',reply:'Contoh jadwal batch:\n• Batch malam: Senin & Rabu 19.00\n• Batch weekend: Sabtu 10.00\n• Private class: by request\n\nBot bisa menampilkan slot yang masih tersedia.'},
          {keys:['biaya','harga','payment'],title:'Biaya Course',reply:'Biaya course mulai Rp 299.000 per program.\nTersedia opsi cicilan/manual transfer jika dibutuhkan.\nBot bisa mengirim detail paket dan benefit otomatis.'},
          {keys:['daftar','registrasi','join'],title:'Cara Daftar',reply:'Cara daftar:\n1. Pilih program\n2. Isi nama dan nomor WhatsApp\n3. Pilih batch\n4. Lakukan pembayaran\n5. Link kelas dikirim otomatis.'},
          {keys:['benefit','sertifikat','materi'],title:'Benefit',reply:'Benefit peserta:\n• Modul belajar\n• Recording kelas\n• Template siap pakai\n• Sertifikat\n• Grup diskusi dan support mentor.'}
        ]
      },
      motorDealer:{
        label:'Dealer Motor',
        menu:'Halo! Ini demo chatbot untuk dealer motor. Kamu bisa tanya stok unit, simulasi kredit, test ride, promo DP, trade-in, atau booking service.',
        quick:['🏍️ Cek Stok Unit','💳 Simulasi Kredit','🛵 Booking Test Ride','🔧 Booking Service'],
        rules:[
          {keys:['stok','unit','motor','ready'],title:'Cek Stok Unit',reply:'Contoh stok unit hari ini:\n• Vario 160 CBS - Ready 3 unit\n• Beat Deluxe - Ready 5 unit\n• PCX 160 ABS - Ready 2 unit\n• Scoopy Prestige - Indent 7-14 hari\n\nBot bisa dibuat terhubung ke data stok showroom agar informasi selalu update.'},
          {keys:['kredit','cicilan','dp','angsuran'],title:'Simulasi Kredit',reply:'Contoh simulasi kredit:\n• DP mulai Rp 2.000.000\n• Tenor 11 / 23 / 35 bulan\n• Estimasi cicilan menyesuaikan tipe motor dan leasing\n\nBot bisa menanyakan tipe motor, DP, dan tenor lalu memberi estimasi cicilan awal sebelum sales follow up.'},
          {keys:['promo','diskon','cashback','bonus'],title:'Promo Dealer',reply:'Promo bulan ini:\n🎁 Cashback sampai Rp 750.000 untuk tipe tertentu\n🪖 Bonus helm dan jaket\n📄 Bantuan proses STNK/BPKB\n⚡ Promo DP ringan untuk unit ready stock\n\nPromo bisa disesuaikan per cabang dan periode campaign.'},
          {keys:['test ride','tes ride','coba motor'],title:'Booking Test Ride',reply:'Untuk booking test ride, kirim format:\nNama:\nNo. HP:\nTipe motor yang ingin dicoba:\nTanggal & jam pilihan:\nCabang showroom:\n\nBot bisa bantu kumpulkan data customer sebelum dijadwalkan oleh sales.'},
          {keys:['trade in','tukar tambah','jual motor lama'],title:'Trade-in / Tukar Tambah',reply:'Bisa tukar tambah motor lama. Bot dapat meminta:\n• Merk & tipe motor lama\n• Tahun kendaraan\n• Kilometer\n• Foto STNK dan kondisi motor\n\nSetelah itu, tim dealer bisa memberi estimasi harga awal.'},
          {keys:['service','servis','booking service','bengkel'],title:'Booking Service',reply:'Untuk booking service, pilih kebutuhan:\n• Service ringan\n• Ganti oli\n• Cek rem/ban\n• Keluhan mesin\n\nBot bisa mencatat nomor plat, tipe motor, keluhan, dan jadwal kunjungan.'},
          {keys:['alamat','lokasi','cabang','maps'],title:'Lokasi Showroom',reply:'Bot bisa mengirim lokasi showroom via Google Maps, jam buka, nomor sales, dan rute terdekat. Cocok untuk dealer dengan banyak cabang.'},
          {keys:['admin','sales','cs'],title:'Hubungi Sales',reply:'Baik, saya arahkan ke sales/admin dealer.\nJam kerja: Senin - Sabtu, 09:00 - 21:00.\nDi versi asli, chat bisa diteruskan otomatis ke sales berdasarkan cabang atau tipe motor yang diminati.'}
        ]
      }

    };
    function activeRules(){ return [...scenarioMap[currentScenario].rules,...customRules]; }
    function escapeHtml(value){ return String(value).replace(/[&<>\"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[ch])); }
    function now(){ return new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'}); }
    function bubble(text,type='bot',meta=''){
      const wrap=document.createElement('div'); wrap.className='flex '+(type==='user'?'justify-end':'justify-start');
      const div=document.createElement('div'); div.className='chat-bubble '+type;
      div.innerHTML=`${meta?`<div class="text-[10px] uppercase tracking-wide opacity-60 font-bold mb-1">${escapeHtml(meta)}</div>`:''}${escapeHtml(text).replace(/\n/g,'<br>')}<div class="text-[10px] opacity-55 mt-2 text-right">${now()}</div>`;
      wrap.appendChild(div); area.appendChild(wrap); area.scrollTop=area.scrollHeight;
    }
    function typing(){ const el=document.createElement('div'); el.id='typingBubble'; el.className='flex justify-start'; el.innerHTML='<div class="chat-bubble bot"><span class="inline-flex gap-1"><span class="animate-pulse">●</span><span class="animate-pulse" style="animation-delay:.12s">●</span><span class="animate-pulse" style="animation-delay:.24s">●</span></span></div>'; area.appendChild(el); area.scrollTop=area.scrollHeight; }
    function showQuick(){ const q=scenarioMap[currentScenario].quick; quick.innerHTML=q.map(r=>`<button class="quick-reply" data-msg="${r}">${r}</button>`).join(''); $$('.quick-reply',quick).forEach(b=>b.onclick=()=>sendMsg(b.dataset.msg)); }
    function findAnswer(msg){ const m=String(msg).toLowerCase(); const matched=activeRules().find(rule=>rule.keys.some(k=>m.includes(k.toLowerCase())) || m.includes(rule.title.toLowerCase())); return matched || null; }
    function botReply(msg){ typing(); setTimeout(()=>{ const t=$('#typingBubble'); if(t)t.remove(); const matched=findAnswer(msg); if(matched){ bubble(matched.reply,'bot','Keyword: '+matched.keys[0]); } else { bubble('Saya belum menemukan keyword yang cocok. Coba klik keyword aktif di panel kanan, atau tambahkan custom keyword sendiri untuk melihat bagaimana bot bisa dikustom sesuai bisnis.','bot','Fallback response'); } showQuick(); },650); }
    function sendMsg(msg){ if(!String(msg).trim())return; bubble(msg,'user'); input.value=''; quick.innerHTML=''; botReply(msg); }
    function renderRules(){
      const list=$('#keywordRuleList');
      list.innerHTML=activeRules().map((rule,i)=>`<button class="text-left border border-dark-border bg-black/30 rounded-2xl p-3 hover:border-accent hover:bg-accent/5 transition" data-rule-index="${i}"><div class="flex items-start justify-between gap-2"><b class="text-sm text-white">${escapeHtml(rule.title)}</b><span class="text-[10px] px-2 py-1 rounded-full bg-accent/10 text-accent">test</span></div><p class="text-xs text-gray-500 mt-2">${rule.keys.map(k=>'#'+escapeHtml(k)).join(' ')}</p></button>`).join('');
      $$('[data-rule-index]',list).forEach(btn=>btn.onclick=()=>{ const rule=activeRules()[Number(btn.dataset.ruleIndex)]; sendMsg(rule.keys[0]); });
    }
    function loadScenario(name){ currentScenario=name; customRules=[]; area.innerHTML=''; $('#chatScenarioBadge').textContent=scenarioMap[name].label; const select=$('#chatScenarioSelect'); if(select) select.value=name; bubble(scenarioMap[name].menu,'bot','Menu utama'); showQuick(); renderRules(); }
    const scenarioSelect=$('#chatScenarioSelect'); if(scenarioSelect) scenarioSelect.addEventListener('change',e=>loadScenario(e.target.value));
    $('#addKeywordRule').onclick=()=>{ const key=$('#customKeyword').value.trim(); const res=$('#customResponse').value.trim(); if(!key||!res){toast('Isi keyword dan balasannya dulu.'); return;} customRules.push({keys:[key],title:'Custom: '+key,reply:res}); $('#customKeyword').value=''; $('#customResponse').value=''; renderRules(); toast('Custom keyword berhasil ditambahkan!'); sendMsg(key); };
    $('#resetChatDemo').onclick=()=>loadScenario(currentScenario);
    $('#chatSend').onclick=()=>sendMsg(input.value); input.addEventListener('keydown',e=>{if(e.key==='Enter')sendMsg(input.value)});
    loadScenario('ecommerce');
  }
