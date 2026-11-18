const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('public/lead-events.js', 'utf8');
const plain = value => JSON.parse(JSON.stringify(value));
function setup(pathname = '/', config) {
    const listeners = {}, emitted = [];
    const sandbox = {
        URL, location: { pathname, origin: 'https://karlabs-dev.netlify.app' },
        document: { addEventListener(type, listener, capture = false) { (listeners[type] ||= []).push({ listener, capture }); } },
        window: { KARLabsAnalyticsConfig: config, dispatchEvent(event) { emitted.push(event); } },
        CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } }
    };
    vm.createContext(sandbox); vm.runInContext(source, sandbox);
    return { sandbox, listeners, emitted, api: sandbox.window.KARLabsLeadEvents };
}
function click(fixture, link, options = {}) {
    fixture.listeners.click.filter(item => !item.capture).forEach(({ listener }) => listener({
        defaultPrevented: false, button: 0, target: { closest() { return link; } }, ...options
    }));
}
function link(href, dataset = {}, handoff = false) {
    return { href, dataset, hasAttribute(name) { return name === 'data-lead-handoff' && handoff; }, closest() { return null; } };
}
async function main() {
    const home = setup(), { api, emitted } = home;
    for (const rejected of ['confirmed_conversion', 'generate_lead', 'catalog_viewed']) assert.equal(api.emit(rejected), false);
    assert.equal(emitted.length, 0);
    const privateFields = {
        name: 'Private name', contact: 'private@example.test', description: 'Private project', budget: 'Private budget',
        timeline: 'Private date', url: 'https://wa.me/?text=private', package: 'Private value', action: 'Private value',
        query: 'private', referrer: 'private', title: 'private', user_id: 'private'
    };
    for (const name of ['whatsapp_cta_clicked', 'contact_form_started', 'contact_form_handoff_clicked', 'service_selected', 'consultation_cta_clicked']) {
        assert(api.emit(name, { ...privateFields, service: 'workflow', placement: 'contact' }));
        assert.equal(emitted.at(-1).type, 'karlabs:lead-event');
        assert.deepEqual(plain(emitted.at(-1).detail), { event: name, page: 'home', service: 'workflow', placement: 'contact' });
        assert(Object.isFrozen(emitted.at(-1).detail));
    }
    api.emit('service_selected', { service: 'private@example.test', placement: 'private@example.test' });
    assert.deepEqual(plain(emitted.at(-1).detail), { event: 'service_selected', page: 'home', placement: 'unknown' });
    api.emit('contact_form_started', null);
    assert.equal(emitted.at(-1).detail.placement, 'unknown');

    const delivered = [];
    api.configure({ enabled: false, adapter: event => delivered.push(event) });
    api.emit('service_selected'); assert.equal(delivered.length, 0);
    assert(api.configure({ enabled: true, adapter: event => delivered.push(event) }));
    api.emit('whatsapp_cta_clicked', { ...privateFields, service: 'workflow', placement: 'hero' });
    assert.equal(delivered.length, 1); // Earlier events are never replayed.
    assert.deepEqual(plain(delivered[0]), { event: 'whatsapp_cta_clicked', page: 'home', service: 'workflow', placement: 'hero' });
    assert(Object.isFrozen(delivered[0]));
    assert.equal(api.configure({ enabled: true, adapter: 'bad' }), false);
    api.emit('service_selected'); assert.equal(delivered.length, 1);
    assert.equal(api.configure(null), false);
    api.configure({ enabled: true, adapter() { throw Error('Provider unavailable'); } });
    assert.doesNotThrow(() => api.emit('contact_form_started'));
    api.configure({ enabled: true, adapter() { return Promise.reject(Error('Provider unavailable')); } });
    api.emit('contact_form_started');
    await new Promise(resolve => setImmediate(resolve));
    api.configure({ enabled: false });

    const wa = link('https://wa.me/6285777345985?text=private%40example.test', { leadService: 'workflow', leadPlacement: 'contact' }, true);
    click(home, wa);
    assert.equal(emitted.at(-1).detail.event, 'contact_form_handoff_clicked');
    assert(!JSON.stringify(emitted.at(-1).detail).includes('private'));
    const count = emitted.length;
    click(home, wa, { defaultPrevented: true }); click(home, wa, { button: 2 });
    click(home, link('https://example.test/?private=contact'));
    assert.equal(emitted.length, count);
    home.listeners.auxclick[0].listener({ button: 1, target: { closest() { return wa; } } });
    assert.equal(emitted.length, count + 1);
    click(home, link('https://karlabs-dev.netlify.app/index.html?service=workflow&name=private#contact-form'));
    assert.deepEqual(plain(emitted.at(-1).detail), { event: 'consultation_cta_clicked', page: 'home', service: 'workflow', placement: 'service' });

    const catalog = setup('/catalog.html');
    assert.deepEqual(plain(catalog.emitted[0].detail), { event: 'catalog_viewed', page: 'catalog', placement: 'catalog' });
    assert.equal(catalog.api.emit('catalog_viewed'), false);
    assert.equal(catalog.api.emit('demo_interacted', { service: 'workflow', action: 'private' }), false);
    assert.equal(catalog.api.emit('demo_interacted', { service: 'workflow', action: 'pos_product' }), false);
    assert(catalog.api.emit('demo_interacted', { ...privateFields, service: 'workflow', placement: 'catalog', action: 'workflow_guide' }));
    assert.deepEqual(plain(catalog.emitted.at(-1).detail), { event: 'demo_interacted', page: 'catalog', service: 'workflow', placement: 'catalog', action: 'workflow_guide' });
    assert.equal(catalog.api.emit('demo_interacted', { service: 'workflow', action: 'workflow_preset' }), false);
    assert(catalog.api.emit('demo_interacted', { service: 'pos', action: 'pos_product' }));
    assert.equal(api.emit('demo_interacted', { service: 'pos', action: 'pos_product' }), false);
    const registrations = Object.values(catalog.listeners).reduce((sum, list) => sum + list.length, 0);
    vm.runInContext(source, catalog.sandbox);
    assert.equal(registrations, Object.values(catalog.listeners).reduce((sum, list) => sum + list.length, 0));
    assert.equal(catalog.emitted.filter(event => event.detail.event === 'catalog_viewed').length, 1);
    const ready = [];
    setup('/catalog.html', { enabled: true, adapter: event => ready.push(event) });
    assert.equal(ready[0].event, 'catalog_viewed');
    assert(Object.isFrozen(api));
    for (const file of ['public/lead-events.js', 'public/consultation.js']) {
        assert.doesNotMatch(fs.readFileSync(file, 'utf8'), /\b(?:localStorage|sessionStorage|fetch|XMLHttpRequest|sendBeacon|gtag|dataLayer)\b/, `${file} must not store fields or activate an external tracker`);
    }
    console.log('Lead taxonomy, privacy, deduplication, adapter isolation, and intent checks passed.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
