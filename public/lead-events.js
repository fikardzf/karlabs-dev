'use strict';

(() => {
    if (window.KARLabsLeadEvents) return;
    const events = new Set(['whatsapp_cta_clicked', 'contact_form_started', 'contact_form_handoff_clicked', 'service_selected', 'consultation_cta_clicked', 'catalog_viewed', 'demo_interacted']);
    const services = new Set(['product-catalog', 'workflow', 'landing', 'chatbot', 'calculator', 'dashboard', 'pos', 'scraping', 'help', 'other']);
    const placements = new Set(['header', 'hero', 'mobile', 'service', 'pricing', 'catalog', 'contact', 'footer', 'context', 'unknown']);
    const page = /\/catalog(?:\.html)?\/?$/.test(location.pathname) ? 'catalog' : 'home';
    const demoActions = new Map([
        ['product_detail', 'product-catalog'], ['product_filter', 'product-catalog'],
        ['workflow_guide', 'workflow'], ['workflow_preset', 'workflow'],
        ['landing_preview', 'landing'], ['chat_send', 'chatbot'],
        ['calculator_input', 'calculator'], ['calculator_calculate', 'calculator'],
        ['dashboard_control', 'dashboard'], ['pos_product', 'pos'], ['scraping_start', 'scraping']
    ]);
    const demoSeen = new Set();
    let catalogViewed = false;
    let adapter = null;

    function configure(options) {
        adapter = null;
        if (!options || typeof options !== 'object') return false;
        if (options.enabled !== true) return true;
        if (typeof options.adapter !== 'function') return false;
        adapter = options.adapter;
        return true;
    }

    function emit(name, properties = {}) {
        if (!events.has(name)) return false;
        if (!properties || typeof properties !== 'object') properties = {};
        if (name === 'catalog_viewed') {
            if (page !== 'catalog' || catalogViewed) return false;
            catalogViewed = true;
        }
        if (name === 'demo_interacted') {
            if (page !== 'catalog' || !demoActions.has(properties.action) || demoActions.get(properties.action) !== properties.service || demoSeen.has(properties.service)) return false;
            demoSeen.add(properties.service);
        }
        const detail = { event: name, page };
        if (services.has(properties.service)) detail.service = properties.service;
        detail.placement = placements.has(properties.placement) ? properties.placement : 'unknown';
        if (name === 'demo_interacted') detail.action = properties.action;
        // Only public enums reach listeners; never retain fields, message text, or destination URLs.
        Object.freeze(detail);
        window.dispatchEvent(new CustomEvent('karlabs:lead-event', { detail }));
        if (adapter) {
            try {
                const delivery = adapter(detail);
                if (delivery && typeof delivery.catch === 'function') delivery.catch(() => {});
            } catch { /* Analytics failure must not interrupt navigation or handoff. */ }
        }
        return true;
    }
    window.KARLabsLeadEvents = Object.freeze({ emit, configure });
    configure(window.KARLabsAnalyticsConfig);

    function trackLink(event) {
        if (event.defaultPrevented) return;
        const link = event.target?.closest?.('a[href]');
        if (!link) return;
        let destination;
        try { destination = new URL(link.href); } catch { return; }
        const placement = link.dataset.leadPlacement ||
            (page === 'catalog' ? 'catalog' :
            link.hasAttribute('data-inquiry-package') ? 'pricing' :
            link.closest('.mobile-lead-bar') ? 'mobile' :
            link.closest('nav') ? 'header' :
            link.closest('#hero') ? 'hero' :
            link.closest('#kontak') ? 'contact' :
            link.closest('footer') ? 'footer' : 'service');
        if (destination.protocol === 'https:' && destination.hostname === 'wa.me' && destination.pathname === '/6285777345985') {
            emit(link.hasAttribute('data-lead-handoff') ? 'contact_form_handoff_clicked' : 'whatsapp_cta_clicked', {
                service: link.dataset.leadService || link.closest('.service-panel')?.id, placement
            });
        } else if (destination.origin === location.origin && ['/', '/index.html'].includes(destination.pathname) && destination.hash === '#contact-form') {
            emit('consultation_cta_clicked', { service: destination.searchParams.get('service'), placement });
        }
        if (link.hasAttribute('data-service-link')) emit('service_selected', { service: link.dataset.serviceLink, placement: 'catalog' });
    }
    document.addEventListener('click', event => { if (!event.button) trackLink(event); });
    document.addEventListener('auxclick', event => { if (event.button === 1) trackLink(event); });
    document.addEventListener('change', event => {
        if (event.target?.id === 'servicePicker') emit('service_selected', { service: event.target.value, placement: 'catalog' });
    });

    // Capture control intent before demo handlers replace cards or stop propagation.
    const demoControls = [
        ['click', '[data-product-detail]', 'product_detail'],
        ['input', '#productSearch', 'product_filter'], ['change', '#productCategory', 'product_filter'],
        ['click', '#startWorkflowGuide, #nextWorkflowStep', 'workflow_guide'], ['change', '#workflowScenario', 'workflow_preset'],
        ['click', '.preview-landing-btn', 'landing_preview'], ['click', '#chatSend, #chatbot .quick-reply', 'chat_send'],
        ['change', '#calculator input, #calculator select', 'calculator_input'],
        ['click', '#kprHitung, #bmiHitung, #ongkirHitung, #bepHitung, #adsHitung, #inventoryHitung', 'calculator_calculate'],
        ['click', '#dashboard .theme-btn, #dashboard .dashboard-mode-btn, #addTransaction', 'dashboard_control'],
        ['click', '[data-pos-add]', 'pos_product'], ['click', '#startScraping', 'scraping_start']
    ];
    for (const type of ['click', 'input', 'change']) document.addEventListener(type, event => {
        if (event.defaultPrevented || event.button > 0) return;
        const control = demoControls.find(([kind, selector]) => kind === type && event.target?.closest?.(selector));
        if (!control) return;
        const element = event.target.closest(control[1]);
        if (element.disabled || !element.closest('.service-panel.active')) return;
        emit('demo_interacted', { service: demoActions.get(control[2]), action: control[2], placement: 'catalog' });
    }, true);
    document.addEventListener('keydown', event => {
        if (event.target?.id === 'chatInput' && event.key === 'Enter' && !event.repeat) emit('demo_interacted', { service: 'chatbot', action: 'chat_send', placement: 'catalog' });
    });
    if (page === 'catalog') emit('catalog_viewed', { placement: 'catalog' });
})();
