'use strict';

(() => {
  const demo = document.querySelector('#canvas-demo');
  const status = demo.querySelector('#demo-status');
  const retry = status.querySelector('button');
  const routes = JSON.parse(document.querySelector('#project-routes').textContent);
  const project = routes.find(p => p.slug === demo.querySelector('.service-panel').id);
  const filter = new URL(location.href).searchParams.get('filter');
  if (filter === project.category) {
    document.querySelector('.index-link').href = '/portfolio/?filter=' + encodeURIComponent(filter);
    document.querySelector('.studio-brand').href = '/?filter=' + encodeURIComponent(filter) + '&project=' + project.slug;
    const group = routes.filter(p => p.category === filter);
    const i = group.indexOf(project);
    for (const link of document.querySelectorAll('[data-gallery-back]')) {
      const url = new URL(link.href);
      url.searchParams.set('filter', filter);
      link.href = url;
    }
    for (const [selector, step] of [['[data-prev]',-1],['[data-next]',1]]) {
      const link = document.querySelector(selector);
      link.hidden = group.length === 1;
      const neighbor = group[(i + step + group.length) % group.length];
      link.href = '/portfolio/' + neighbor.slug + '/?filter=' + encodeURIComponent(filter);
      link.querySelector('b').textContent = neighbor.title;
    }
  }
  installCatalogDialogBehavior();
  const panel = demo.querySelector('.service-panel');
  let started = false;
  function loadModule() {
    if (typeof window[demo.dataset.init] === 'function') return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = demo.dataset.module;
      script.onload = resolve;
      script.onerror = () => {
        script.remove();
        reject(new Error('Modul demo gagal dimuat.'));
      };
      document.head.appendChild(script);
    });
  }
  async function start() {
    if (started) return;
    started = true;
    panel.inert = true;
    retry.hidden = true;
    status.hidden = false;
    status.querySelector('p').textContent = 'Memuat demo…';
    panel.setAttribute('aria-busy', 'true');
    try {
      await loadModule();
      if (demo.dataset.charts === 'true') {
        status.hidden = false;
        status.querySelector('p').textContent = 'Memuat grafik demo…';
        await ensureChartJs();
      }
      window[demo.dataset.init]();
      refreshIcons();
      panel.inert = false;
      status.hidden = true;
    } catch (error) {
      started = false;
      status.hidden = false;
      status.querySelector('p').textContent = 'Demo belum berhasil dimuat. Periksa koneksi lalu coba lagi.';
      retry.hidden = false;
      console.error('Demo gagal dimuat:', project.slug, error);
    } finally {
      panel.setAttribute('aria-busy', 'false');
    }
  }
  retry.addEventListener('click', start);
  document.querySelectorAll('a[href="#canvas-demo"]').forEach(link => link.addEventListener('click', start));
  if ('IntersectionObserver' in window && location.hash !== '#canvas-demo') {
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      start();
    }, {rootMargin:'160px'});
    observer.observe(demo);
  } else {
    start();
  }
})();

