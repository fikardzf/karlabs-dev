'use strict';
(() => {
    const catalogMenu = document.querySelector('[data-catalog-menu]');
    if (catalogMenu) {
        catalogMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { catalogMenu.open = false; }));
        document.addEventListener('click', event => {
            if (!catalogMenu.contains(event.target)) catalogMenu.open = false;
        });
        document.addEventListener('keydown', event => {
            if (event.key !== 'Escape' || !catalogMenu.open) return;
            catalogMenu.open = false;
            catalogMenu.querySelector('summary').focus();
        });
        window.matchMedia('(min-width:1024px)').addEventListener('change', event => {
            if (event.matches) catalogMenu.open = false;
        });
    }
    const overviews = [...document.querySelectorAll('.package-overview')];
    const grid = document.querySelector('.package-grid');
    function alignPackages() {
        overviews.forEach(element => element.style.minHeight = '');
        if (!window.matchMedia('(min-width:1024px)').matches) return;
        const height = Math.max(...overviews.map(element => element.getBoundingClientRect().height));
        overviews.forEach(element => element.style.minHeight = `${height}px`);
    }
    if (grid) {
        // Equalize only the overview so opening details never stretches adjacent cards.
        alignPackages();
        document.fonts?.ready.then(alignPackages);
        if ('ResizeObserver' in window) {
            let width = 0;
            new ResizeObserver(entries => {
                const nextWidth = entries[0].contentRect.width;
                if (nextWidth === width) return;
                width = nextWidth;
                alignPackages();
            }).observe(grid);
        } else window.addEventListener('resize', alignPackages);
    }
    if (!('IntersectionObserver' in window)) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const targets = [...document.querySelectorAll('.pricing-intro, .consultation-strip, .process-card, .catalog-hero')];
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('reveal-visible');
        entry.target.classList.remove('reveal-pending');
        observer.unobserve(entry.target);
    }), { threshold: .12 });
    function reveal() {
        targets.forEach(element => {
            if (motion.matches || element.getBoundingClientRect().top < innerHeight) {
                element.classList.remove('reveal-pending');
                element.classList.add('reveal-visible');
                observer.unobserve(element);
            } else if (!element.classList.contains('reveal-visible')) {
                element.classList.add('reveal-ready', 'reveal-pending');
                observer.observe(element);
            }
        });
    }
    reveal();
    motion.addEventListener('change', reveal);
    window.addEventListener('pagehide', () => {
        observer.disconnect();
        targets.forEach(element => element.classList.remove('reveal-pending'));
    });
    window.addEventListener('pageshow', reveal);
})();
