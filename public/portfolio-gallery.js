'use strict';

(() => {
  const room = document.querySelector('.gallery-room');
  function revealImage(panel) {
    const template = panel.querySelector('.art-frame template');
    if (template) template.replaceWith(template.content);
  }
  if (!window.CSS?.supports('perspective', '1px')) {
    room.querySelectorAll('.exhibit').forEach(revealImage);
    return;
  }
  const stage = room.querySelector('.gallery-stage');
  const panels = [...stage.querySelectorAll('.exhibit')];
  const filters = [...room.querySelectorAll('[data-filter]')];
  const descriptions = JSON.parse(document.querySelector('#exhibit-descriptions').textContent);
  const action = room.querySelector('#open-project');
  const caption = room.querySelector('.selection');
  const steps = [...room.querySelectorAll('[data-step]')];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const params = new URL(location.href).searchParams;
  const wrap = (n, length) => ((n % length) + length) % length;
  let filter = filters.find(f => f.dataset.filter === params.get('filter'))?.dataset.filter || 'all';
  let visible = [], camera = 0, target = 0, velocity = 0, frame = 0, lastTime = 0;
  let drag = null, suppressClick = false;
  let wheelTime = 0, wheelDistance = 0, wheelStepped = false;
  let arrivals = [];

  function paint() {
    const count = visible.length;
    visible.forEach((panel, i) => {
      let d = wrap(i - camera + count / 2, count) - count / 2;
      if (count === 2) d = i - camera;
      const depth = Math.abs(d);
      const visibility = depth > 2.45 ? 'hidden' : 'visible';
      if (visibility === 'hidden' && panel.style.visibility === 'hidden') return;
      panel.style.visibility = visibility;
      panel.style.setProperty('--offset', String(d));
      panel.style.setProperty('--turn', Math.max(-42, Math.min(42, -d * 28)) + 'deg');
      panel.style.setProperty('--depth', Math.min(depth, 2).toFixed(3));
      panel.style.zIndex = String(Math.round(100 - depth * 10));
    });
  }
  function animate(now) {
    const dt = Math.min((now - lastTime) / 1000, .025);
    lastTime = now;
    velocity += ((target - camera) * 210 - velocity * 26) * dt;
    camera += velocity * dt;
    if (Math.abs(camera - target) < .001 && Math.abs(velocity) < .015) {
      camera = target;
      velocity = 0;
      frame = 0;
      paint();
      return;
    }
    paint();
    frame = requestAnimationFrame(animate);
  }
  function settle(immediate = false) {
    if (immediate || motion.matches) {
      cancelAnimationFrame(frame);
      frame = 0;
      velocity = 0;
      camera = target;
      paint();
    } else if (!frame) {
      lastTime = performance.now();
      frame = requestAnimationFrame(animate);
    }
  }
  function select(next, immediate = false, updateUrl = true) {
    const direction = Math.sign(next - target);
    target = visible.length === 2 ? wrap(next, 2) : next;
    const index = wrap(target, visible.length);
    const active = visible[index];
    const changed = !active.hasAttribute('data-selected');
    revealImage(active);
    for (const panel of panels) {
      panel.tabIndex = panel === active ? 0 : -1;
      panel.toggleAttribute('data-selected', panel === active);
    }
    room.querySelector('#selected-title').textContent = active.querySelector('.art-name').textContent;
    room.querySelector('#selected-desc').textContent = descriptions[active.dataset.slug];
    room.querySelector('output .sr-only').textContent = active.querySelector('.art-name').textContent + ', ';
    room.querySelector('.gallery-count').textContent = [index + 1, visible.length].map(n => String(n).padStart(2, '0')).join(' / ');
    action.href = active.href;
    action.setAttribute('aria-label', 'Buka demo ' + active.querySelector('.art-name').textContent);
    arrivals.forEach(animation => animation.cancel());
    arrivals = [];
    if (changed && !immediate && !motion.matches && caption.animate) {
      const timing = { duration: 300, easing: 'cubic-bezier(.2,.75,.3,1)' };
      arrivals.push(active.querySelector('.art-frame').animate([
        { transform: 'translateY(4px) scale(.99)' }, { transform: 'none' }
      ], timing), caption.animate([
        { transform: 'translateX(' + direction * 8 + 'px)', opacity: .74 },
        { transform: 'none', opacity: 1 }
      ], timing));
    }
    if (updateUrl) {
      const url = new URL(location.href);
      if (filter === 'all') url.searchParams.delete('filter');
      else url.searchParams.set('filter', filter);
      url.searchParams.set('project', active.dataset.slug);
      history.replaceState(history.state, '', url);
    }
    settle(immediate);
  }
  function applyFilter(value, slug, updateUrl = true) {
    filter = value;
    document.querySelector('.index-link').href = value === 'all' ? '/portfolio/' : '/portfolio/?filter=' + value;
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === value)));
    visible = panels.filter(panel => {
      const match = value === 'all' || panel.dataset.category === value;
      panel.hidden = !match;
      const url = new URL('/portfolio/' + panel.dataset.slug + '/', location.origin);
      if (value !== 'all') url.searchParams.set('filter', value);
      panel.href = url;
      return match;
    });
    steps.forEach(button => button.disabled = visible.length < 2);
    select(Math.max(0, visible.findIndex(p => p.dataset.slug === slug)), true, updateUrl);
  }
  room.classList.add('is-ready');
  applyFilter(filter, params.get('project'), false);
  if ('IntersectionObserver' in window) {
    const artworkObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        revealImage(entry.target);
        artworkObserver.unobserve(entry.target);
      }
    }, { root:stage, rootMargin:'0px 3%' });
    panels.filter(panel => panel.querySelector('template')).forEach(panel => artworkObserver.observe(panel));
  } else {
    panels.forEach(revealImage);
  }
  filters.forEach(button => button.addEventListener('click', () => applyFilter(button.dataset.filter)));
  steps.forEach(button => button.addEventListener('click', () => select(target + Number(button.dataset.step))));
  stage.addEventListener('keydown', e => {
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(e.key) || visible.length < 2) return;
    e.preventDefault();
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? visible.length - 1 : target + (e.key === 'ArrowLeft' ? -1 : 1);
    select(next);
    if (e.target.closest('.exhibit')) visible[wrap(next, visible.length)].focus({ preventScroll:true });
  });
  stage.addEventListener('dragstart', e => e.preventDefault());
  stage.addEventListener('pointerdown', e => {
    if (!e.isPrimary || e.button !== 0) return;
    suppressClick = false;
    drag = { id:e.pointerId, x:e.clientX, y:e.clientY, start:camera, time:performance.now(), active:false };
  });
  const finePointer = matchMedia('(hover:hover) and (pointer:fine)');
  stage.addEventListener('pointerleave', () => stage.style.removeProperty('--look'));
  stage.addEventListener('pointermove', e => {
    if (!drag && finePointer.matches && !motion.matches) {
      const box = stage.getBoundingClientRect();
      stage.style.setProperty('--look', (0.5 - (e.clientX - box.left) / box.width) * 9 + 'px');
    }
    if (!drag || e.pointerId !== drag.id || visible.length < 2) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.active) {
      if (Math.abs(dx) < 7) return;
      if (Math.abs(dy) > Math.abs(dx)) { drag = null; return; }
      velocity = 0;
      stage.setPointerCapture(e.pointerId);
      drag.active = true;
      suppressClick = true;
      cancelAnimationFrame(frame);
      frame = 0;
      stage.classList.add('is-dragging');
    }
    const position = drag.start - dx / Math.min(stage.clientWidth * .72, 500);
    camera = visible.length === 2 ? Math.max(0, Math.min(1, position)) : position;
    paint();
  });
  function release(e) {
    if (!drag || e.pointerId !== drag.id) return;
    if (drag.active) {
      const travel = camera - drag.start;
      const boost = Math.min(1.4, 260 / Math.max(80, performance.now() - drag.time));
      const next = e.type === 'pointercancel' ? target : Math.round(camera + travel * boost);
      select(visible.length === 2 ? Math.max(0, Math.min(1, next)) : next);
      stage.classList.remove('is-dragging');
    }
    drag = null;
  }
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);
  stage.addEventListener('click', e => {
    if (suppressClick && e.detail) { e.preventDefault(); suppressClick = false; return; }
    const index = visible.indexOf(e.target.closest('.exhibit'));
    if (index < 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    select(index, true);
  });
  stage.addEventListener('wheel', e => {
    const dx = e.shiftKey && !e.deltaX ? e.deltaY : e.deltaX;
    if (e.ctrlKey || visible.length < 2 || !dx || (!e.shiftKey && Math.abs(dx) <= Math.abs(e.deltaY))) return;
    e.preventDefault();
    const now = performance.now();
    if (now - wheelTime > 160 || Math.sign(dx) !== Math.sign(wheelDistance)) {
      wheelDistance = 0;
      wheelStepped = false;
    }
    wheelTime = now;
    wheelDistance += dx * (e.deltaMode === 1 ? 16 : 1);
    if (!wheelStepped && Math.abs(wheelDistance) >= 18) {
      select(target + Math.sign(wheelDistance));
      wheelStepped = true;
    }
  }, { passive:false });
  motion.addEventListener('change', () => {
    arrivals.forEach(animation => animation.cancel());
    settle(true);
  });
})();

