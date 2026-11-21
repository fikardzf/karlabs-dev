'use strict';

const iconSource = document.querySelector('#consultation-icons').content.querySelector('script');
let iconsRequested = false;
function loadConsultationIcons() {
    if (iconsRequested || !document.querySelector('.studio-disclosure[open]')) return;
    iconsRequested = true;
    const script = document.createElement('script');
    script.src = iconSource.src;
    script.integrity = iconSource.integrity;
    script.crossOrigin = iconSource.crossOrigin;
    script.onload = () => window.lucide?.createIcons();
    script.onerror = () => { iconsRequested = false; script.remove(); };
    document.head.appendChild(script);
}
document.querySelectorAll('.studio-disclosure').forEach(section => {
    section.addEventListener('toggle', loadConsultationIcons);
});
loadConsultationIcons();

const picker = document.querySelector('.package-picker');
const rail = document.querySelector('.package-grid');
const choices = [...picker.querySelectorAll('button')];
const offers = choices.map(button => document.getElementById(button.getAttribute('aria-controls')));
const mobilePackages = matchMedia('(max-width: 767px)');
let activeOffer;

function syncPackagePicker() {
    const mobile = mobilePackages.matches;
    picker.hidden = !mobile;
    if (mobile && !rail.clientWidth) return;
    const stride = offers.length > 1 ? offers[1].offsetLeft - offers[0].offsetLeft : 0;
    const index = mobile && stride ? Math.min(offers.length - 1, Math.max(0, Math.round(rail.scrollLeft / stride))) : 0;
    const current = mobile ? offers[index] : null;
    if (activeOffer === current) return;
    activeOffer = current;
    offers.forEach((offer, i) => {
        offer.inert = mobile && offer !== current;
        choices[i].setAttribute('aria-pressed', String(offer === current));
    });
}

choices.forEach((button, i) => button.addEventListener('click', () => {
    rail.scrollTo({ left: offers[i].offsetLeft - offers[0].offsetLeft });
}));
picker.addEventListener('keydown', event => {
    const i = choices.indexOf(event.target);
    if (i < 0 || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const last = choices.length - 1;
    const next = { ArrowLeft: Math.max(0, i - 1), ArrowRight: Math.min(last, i + 1), Home: 0, End: last }[event.key];
    choices[next].focus();
    choices[next].click();
});
rail.addEventListener('scroll', syncPackagePicker, { passive: true });
rail.closest('details').addEventListener('toggle', syncPackagePicker);
mobilePackages.addEventListener('change', syncPackagePicker);
syncPackagePicker();

// Answers remain readable when JavaScript is unavailable.
document.querySelectorAll('.faq-trigger').forEach((button, index) => {
    const content = button.closest('.faq-item')?.querySelector('.accordion-content') || button.nextElementSibling;
    if (!content) return;
    const icon = button.querySelector('.accordion-icon');
    content.id = 'faq-answer-' + (index + 1);
    content.hidden = true;
    button.type = 'button';
    button.setAttribute('aria-controls', content.id);
    button.setAttribute('aria-expanded', 'false');
    if (icon) icon.setAttribute('aria-hidden', 'true');
    button.addEventListener('click', () => {
        const expanded = button.getAttribute('aria-expanded') !== 'true';
        button.setAttribute('aria-expanded', String(expanded));
        content.hidden = !expanded;
        if (icon) icon.classList.toggle('open', expanded);
    });
});

function revealLinkedSection() {
    const target = document.getElementById(location.hash.slice(1));
    const disclosure = target?.closest('.studio-disclosure');
    if (disclosure && !disclosure.open) {
        disclosure.open = true;
        target.scrollIntoView({ block: 'start' });
    }
}
window.addEventListener('hashchange', revealLinkedSection);
revealLinkedSection();
