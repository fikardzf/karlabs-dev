'use strict';

(() => {
  const toolbar = document.querySelector('.index-filters');
  const buttons = [...toolbar.querySelectorAll('[data-filter]')];
  const panels = [...document.querySelectorAll('.collection-grid .exhibit')];
  const back = document.querySelector('.collection-main .canvas-crumb');
  function filterBy(category) {
    const search = category === 'all' ? '' : '?filter=' + encodeURIComponent(category);
    for (const panel of panels) {
      panel.hidden = category !== 'all' && panel.dataset.category !== category;
      panel.href = '/portfolio/' + panel.dataset.slug + '/' + search;
    }
    for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.filter === category));
    back.href = '/' + search;
    document.querySelector('.studio-brand').href = back.href;
    history.replaceState(history.state, '', '/portfolio/' + search);
  }
  const current = new URLSearchParams(location.search).get('filter');
  filterBy(buttons.find(b => b.dataset.filter === current)?.dataset.filter || 'all');
  buttons.forEach(button => button.addEventListener('click', () => filterBy(button.dataset.filter)));
  toolbar.hidden = false;
})();

