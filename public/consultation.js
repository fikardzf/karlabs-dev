'use strict';

(() => {
    const form = document.getElementById('contact-form');
    if (!form) return;
    const byId = id => document.getElementById(id);
    const service = byId('jasa');
    const description = byId('pesan');
    const defaultHint = description.placeholder;
    const preview = byId('whatsapp-preview');
    const messageView = byId('whatsapp-message');
    const feedback = byId('consultation-feedback');
    const errorSummary = byId('consultation-errors');
    const handoffLinks = [byId('whatsapp-handoff'), byId('whatsapp-handoff-same-tab')];
    const fields = [
        { id: 'nama', error: 'nama-error', label: 'Nama' },
        { id: 'kontak-calon-client', error: 'kontak-error', label: 'Email / WhatsApp' },
        { id: 'usaha', error: 'usaha-error', label: 'Jenis usaha' },
        { id: 'jasa', error: 'jasa-error', label: 'Layanan yang dibutuhkan' },
        { id: 'pesan', error: 'pesan-error', label: 'Kebutuhan project' },
        { id: 'anggaran', error: 'anggaran-error', label: 'Kisaran anggaran' },
        { id: 'target-waktu', error: 'target-waktu-error', label: 'Target waktu' }
    ];
    const packageData = window.KARLabsPackages || {};
    const packages = new Map(Object.entries(packageData).map(([id, value]) => [id, value.name]));
    let selectedPackage = '';
    let attempted = false;
    let started = false;
    let lastInvalidFields = '';
    const track = (name, placement) => window.KARLabsLeadEvents?.emit(name, { service: service.selectedOptions[0]?.dataset.leadService, placement });

    function invalidatePreview() {
        if (!preview.hidden) feedback.textContent = 'Isian berubah. Siapkan pesan lagi untuk meninjau pembaruannya.';
        preview.hidden = true;
        handoffLinks.forEach(link => link.removeAttribute('href'));
    }
    function updateHint() {
        const hints = {
            'Website Katalog Produk': 'Produk apa yang dijual, kira-kira berapa banyak, dan bagaimana pelanggan memesan saat ini?',
            'Automasi Workflow': 'Pekerjaan admin apa yang berulang? Ceritakan proses saat ini dan aplikasi yang digunakan.'
        };
        description.placeholder = hints[service.value] || defaultHint;
    }
    function setPackage(value) {
        selectedPackage = packages.get(String(value).toLowerCase()) || '';
        const info = Object.values(packageData).find(item => item.name === selectedPackage);
        byId('inquiry-package').textContent = info ? info.name + ' · ' + info.formattedStartingPrice : '';
        byId('inquiry-package-limit').textContent = info?.automationLimit === 1 ? 'Premium mencakup maksimal 1 workflow sederhana yang dinilai layak dan disepakati tertulis. ERP, CRM lengkap, AI kompleks dan fitur di luar scope melalui penawaran terpisah.' : '';
        byId('inquiry-context').hidden = !selectedPackage;
        invalidatePreview();
    }
    function selectService(value, placement) {
        const normalized = String(value || '').trim().toLowerCase();
        const option = Array.from(service.options).find(item => item.value && [item.value, item.textContent, item.dataset.leadService].some(label => label?.toLowerCase() === normalized));
        if (!option) return false;
        service.value = option.value;
        updateHint();
        invalidatePreview();
        track('service_selected', placement);
        return true;
    }
    function validationMessage(field) {
        const input = byId(field.id);
        const value = input.value.trim();
        if (input.required && !value) return `Isi ${field.label.toLowerCase()}.`;
        if (input.maxLength > 0 && value.length > input.maxLength) return `Batasi ${field.label.toLowerCase()} hingga ${input.maxLength} karakter.`;
        if (input.tagName === 'SELECT' && value && !Array.from(input.options).some(option => option.value === value)) return 'Pilih salah satu opsi yang tersedia.';
        if (field.id === 'kontak-calon-client' && value) {
            const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            const digits = value.replace(/\D/g, '');
            const phone = /^\+?[\d\s().-]+$/.test(value) && digits.length >= 8 && digits.length <= 15;
            if (!email && !phone) return 'Gunakan email lengkap atau nomor WhatsApp dengan 8 sampai 15 digit.';
        }
        return '';
    }
    function validate(focusSummary = false) {
        const invalid = [];
        fields.forEach(field => {
            const input = byId(field.id);
            const message = validationMessage(field);
            if (byId(field.error).textContent !== message) byId(field.error).textContent = message;
            byId(field.error).hidden = !message;
            if (message) { input.setAttribute('aria-invalid', 'true'); invalid.push(field); }
            else input.removeAttribute('aria-invalid');
        });
        const invalidFields = invalid.map(field => field.id).join(',');
        if (invalidFields !== lastInvalidFields) {
            const list = byId('consultation-error-list');
            list.replaceChildren();
            invalid.forEach(field => {
                const li = document.createElement('li');
                const link = document.createElement('a');
                link.href = '#' + field.id;
                link.textContent = field.label;
                link.onclick = event => { event.preventDefault(); byId(field.id).focus(); };
                li.appendChild(link); list.appendChild(li);
            });
            lastInvalidFields = invalidFields;
        }
        errorSummary.hidden = !invalid.length;
        if (focusSummary && invalid.length) errorSummary.focus();
        return !invalid.length;
    }
    function buildMessage() {
        const info = Object.values(packageData).find(item => item.name === selectedPackage);
        return [
            'Halo KAR Labs, saya ingin konsultasi kebutuhan usaha.',
            'Nama: ' + byId('nama').value.trim(),
            'Kontak: ' + byId('kontak-calon-client').value.trim(),
            'Jenis usaha: ' + byId('usaha').value.trim(),
            'Layanan: ' + service.value,
            info ? 'Paket yang ingin dibahas: ' + info.name + ' — ' + info.formattedStartingPrice : '',
            info ? 'Harga awal: ' + info.formattedStartingPrice + '. ' + info.priceNotice : '',
            info?.automationLimit === 1 ? 'Batas Premium: maksimal 1 workflow automasi sederhana yang dinilai layak dan disepakati bersama. ERP, CRM lengkap, integrasi AI kompleks dan fitur di luar scope ditawarkan terpisah.' : '',
            'Kebutuhan: ' + description.value.trim(),
            byId('anggaran').value ? 'Kisaran anggaran: ' + byId('anggaran').value : '',
            byId('target-waktu').value ? 'Target waktu yang diinginkan: ' + byId('target-waktu').value : '',
            'Mohon bantu bahas scope, estimasi biaya, dan tahapan pengerjaannya.'
        ].filter(Boolean).join('\n');
    }
    function changed() {
        if (!started) { started = true; track('contact_form_started', 'contact'); }
        invalidatePreview();
        if (attempted) validate();
    }
    form.addEventListener('input', changed);
    form.addEventListener('change', changed);
    service.addEventListener('change', () => { updateHint(); track('service_selected', 'contact'); });
    form.addEventListener('submit', event => {
        event.preventDefault();
        attempted = true;
        if (!validate(true)) { invalidatePreview(); feedback.textContent = 'Lengkapi isian yang ditandai. Pesan belum disiapkan.'; return; }
        const message = buildMessage();
        messageView.textContent = message;
        handoffLinks.forEach(link => {
            link.href = 'https://wa.me/6285777345985?text=' + encodeURIComponent(message);
            link.dataset.leadService = service.selectedOptions[0].dataset.leadService;
        });
        preview.hidden = false;
        feedback.textContent = 'Pesan siap ditinjau, belum dikirim. Pilih Buka WhatsApp setelah detailnya sesuai.';
        preview.focus();
    });
    handoffLinks.forEach(link => link.addEventListener('click', event => {
        if (!validate(true) || messageView.textContent !== buildMessage()) {
            event.preventDefault();
            invalidatePreview();
            feedback.textContent = 'Isian berubah. Siapkan pesan lagi sebelum membuka WhatsApp.';
        }
    }));
    document.querySelectorAll('[data-inquiry-service], [data-inquiry-package]').forEach(link => {
        link.addEventListener('click', event => {
            if (event.button > 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            if (link.dataset.inquiryService) { setPackage(''); selectService(link.dataset.inquiryService, 'service'); }
            if (link.dataset.inquiryPackage) {
                setPackage(link.dataset.inquiryPackage);
                if (!service.value) selectService('help', 'pricing');
            }
            track('consultation_cta_clicked', link.dataset.inquiryPackage ? 'pricing' : 'service');
            if (attempted) validate();
            form.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
            form.focus({ preventScroll: true });
        });
    });
    byId('clear-inquiry-package').addEventListener('click', () => { setPackage(''); service.focus(); });

    const context = new URLSearchParams(location.search);
    const hasService = selectService(context.get('service'), 'context');
    if (packages.has((context.get('package') || '').toLowerCase())) {
        setPackage(context.get('package'));
        if (!hasService && !service.value) selectService('help', 'context');
    }
    updateHint();
    form.noValidate = true;
    form.querySelector('button[type="submit"]').disabled = false;
})();
