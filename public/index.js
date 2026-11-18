/* KAR Labs - Static homepage navigation and WhatsApp inquiries. */
'use strict';

if (window.lucide) window.lucide.createIcons();

// Enhance the existing preview; its catalog image and link also work without JS.
const previewTabs = document.querySelector('.preview-tabs');
if (previewTabs) {
    const tabs = Array.from(previewTabs.querySelectorAll('[role="tab"]'));
    function activatePreview(tab, moveFocus = false) {
        tabs.forEach(item => {
            const selected = item === tab;
            item.setAttribute('aria-selected', String(selected));
            item.tabIndex = selected ? 0 : -1;
            const panel = document.getElementById(item.getAttribute('aria-controls'));
            panel.hidden = !selected;
            panel.setAttribute('aria-labelledby', item.id);
        });
        if (moveFocus) tab.focus();
    }
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => activatePreview(tab));
        tab.addEventListener('keydown', event => {
            let next;
            if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
            else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
            else if (event.key === 'Home') next = 0;
            else if (event.key === 'End') next = tabs.length - 1;
            else return;
            event.preventDefault();
            activatePreview(tabs[next], true);
        });
    });
    activatePreview(tabs[0]);
    previewTabs.hidden = false;
}

const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const closeMenuBtn = document.getElementById('close-menu');
const overlay = document.getElementById('overlay');
const pageContent = document.querySelectorAll('main, footer, .mobile-lead-bar');

function openMobileMenu() {
    document.body.classList.add('mobile-menu-open');
    mobileMenu.classList.add('open');
    mobileMenu.inert = false;
    mobileMenu.setAttribute('aria-hidden', 'false');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    pageContent.forEach(element => { element.inert = true; });
    closeMenuBtn.focus();
}

function closeMobileMenu(restoreFocus = true) {
    const wasOpen = mobileMenu.classList.contains('open');
    document.body.classList.remove('mobile-menu-open');
    mobileMenu.classList.remove('open');
    mobileMenu.inert = true;
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
    pageContent.forEach(element => { element.inert = false; });
    if (wasOpen && restoreFocus) mobileMenuBtn.focus();
}

mobileMenuBtn.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) closeMobileMenu();
    else openMobileMenu();
});
closeMenuBtn.addEventListener('click', () => closeMobileMenu());
overlay.addEventListener('click', () => closeMobileMenu());
mobileMenu.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', () => closeMobileMenu(false));
});
document.addEventListener('keydown', event => {
    if (!mobileMenu.classList.contains('open')) return;
    if (event.key === 'Escape') closeMobileMenu();
    if (event.key !== 'Tab') return;
    const items = Array.from(mobileMenu.querySelectorAll('a[href], button:not([disabled])'));
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
});
window.matchMedia('(min-width: 1024px)').addEventListener('change', event => {
    if (event.matches) closeMobileMenu(false);
});
// Native anchor navigation keeps URL history and respects reduced-motion CSS.
const sections = document.querySelectorAll('main > section[id]');
const navLinks = document.querySelectorAll('.nav-link');
let scrollPending = false;
function updateNavigation() {
    navbar.classList.toggle('nav-scrolled', window.scrollY > 50);
    const position = window.scrollY + navbar.offsetHeight + 32;
    let activeSection = '';
    sections.forEach(section => {
        if (section.offsetTop <= position) activeSection = section.id;
    });
    navLinks.forEach(link => {
        const active = link.getAttribute('href') === '#' + activeSection;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
    });
    scrollPending = false;
}
window.addEventListener('scroll', () => {
    if (scrollPending) return;
    scrollPending = true;
    window.requestAnimationFrame(updateNavigation);
}, { passive: true });
updateNavigation();

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
