(() => {
  const COLOR = '#22C55E';
  const SPEED = 0.5;
  const CHAOS = 0.15;
  const BORDER_RADIUS = 16;
  const BORDER_OFFSET = 42;
  const DISPLACEMENT = 42;
  const THICKNESS = 2;

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const random = (x) => {
    const value = Math.sin(x * 12.9898) * 43758.5453;
    return value - Math.floor(value);
  };

  const noise2D = (x, y) => {
    const i = Math.floor(x);
    const j = Math.floor(y);
    const fx = x - i;
    const fy = y - j;

    const a = random(i + j * 57);
    const b = random(i + 1 + j * 57);
    const c = random(i + (j + 1) * 57);
    const d = random(i + 1 + (j + 1) * 57);

    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);

    return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
  };

  const octavedNoise = (x, time, seed) => {
    const octaves = 10;
    const lacunarity = 1.6;
    const gain = 0.7;
    const baseFrequency = 10;
    const baseFlatness = 0;
    let y = 0;
    let amplitude = CHAOS;
    let frequency = baseFrequency;

    for (let i = 0; i < octaves; i += 1) {
      let octaveAmplitude = amplitude;
      if (i === 0) octaveAmplitude *= baseFlatness;
      y += octaveAmplitude * noise2D(frequency * x + seed * 100, time * frequency * 0.3);
      frequency *= lacunarity;
      amplitude *= gain;
    }

    return y;
  };

  const getCornerPoint = (centerX, centerY, radius, startAngle, arcLength, progress) => {
    const angle = startAngle + progress * arcLength;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  const getRoundedRectPoint = (t, left, top, width, height, radius) => {
    const straightWidth = Math.max(width - 2 * radius, 1);
    const straightHeight = Math.max(height - 2 * radius, 1);
    const cornerArc = (Math.PI * radius) / 2;
    const totalPerimeter = 2 * straightWidth + 2 * straightHeight + 4 * cornerArc;
    const distance = t * totalPerimeter;
    let accumulated = 0;

    if (distance <= accumulated + straightWidth) {
      const progress = (distance - accumulated) / straightWidth;
      return { x: left + radius + progress * straightWidth, y: top };
    }
    accumulated += straightWidth;

    if (distance <= accumulated + cornerArc) {
      const progress = (distance - accumulated) / cornerArc;
      return getCornerPoint(left + width - radius, top + radius, radius, -Math.PI / 2, Math.PI / 2, progress);
    }
    accumulated += cornerArc;

    if (distance <= accumulated + straightHeight) {
      const progress = (distance - accumulated) / straightHeight;
      return { x: left + width, y: top + radius + progress * straightHeight };
    }
    accumulated += straightHeight;

    if (distance <= accumulated + cornerArc) {
      const progress = (distance - accumulated) / cornerArc;
      return getCornerPoint(left + width - radius, top + height - radius, radius, 0, Math.PI / 2, progress);
    }
    accumulated += cornerArc;

    if (distance <= accumulated + straightWidth) {
      const progress = (distance - accumulated) / straightWidth;
      return { x: left + width - radius - progress * straightWidth, y: top + height };
    }
    accumulated += straightWidth;

    if (distance <= accumulated + cornerArc) {
      const progress = (distance - accumulated) / cornerArc;
      return getCornerPoint(left + radius, top + height - radius, radius, Math.PI / 2, Math.PI / 2, progress);
    }
    accumulated += cornerArc;

    if (distance <= accumulated + straightHeight) {
      const progress = (distance - accumulated) / straightHeight;
      return { x: left, y: top + height - radius - progress * straightHeight };
    }
    accumulated += straightHeight;

    const progress = (distance - accumulated) / cornerArc;
    return getCornerPoint(left + radius, top + radius, radius, Math.PI, Math.PI / 2, progress);
  };

  const createLayer = (card) => {
    if (card.__electricLayer) return card.__electricLayer;

    const wrap = document.createElement('div');
    wrap.className = 'electric-border-canvas-wrap';
    wrap.setAttribute('aria-hidden', 'true');

    const canvas = document.createElement('canvas');
    canvas.className = 'electric-border-canvas';
    wrap.appendChild(canvas);
    card.appendChild(wrap);

    const layer = {
      wrap,
      canvas,
      ctx: canvas.getContext('2d'),
      width: 0,
      height: 0,
      dpr: 1,
      time: 0,
      lastTime: 0
    };

    card.__electricLayer = layer;
    return layer;
  };

  const resizeLayer = (card, layer) => {
    const rect = card.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, rect.width + BORDER_OFFSET * 2);
    const height = Math.max(1, rect.height + BORDER_OFFSET * 2);

    if (layer.width === width && layer.height === height && layer.dpr === dpr) return;

    layer.width = width;
    layer.height = height;
    layer.dpr = dpr;
    layer.canvas.width = Math.round(width * dpr);
    layer.canvas.height = Math.round(height * dpr);
    layer.canvas.style.width = `${width}px`;
    layer.canvas.style.height = `${height}px`;
  };

  const draw = (card, layer, currentTime) => {
    if (!layer.ctx) return;
    resizeLayer(card, layer);

    const ctx = layer.ctx;
    const dpr = layer.dpr;
    const delta = layer.lastTime ? (currentTime - layer.lastTime) / 1000 : 0;
    layer.lastTime = currentTime;
    layer.time += delta * SPEED;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
    ctx.scale(dpr, dpr);

    const left = BORDER_OFFSET;
    const top = BORDER_OFFSET;
    const borderWidth = layer.width - BORDER_OFFSET * 2;
    const borderHeight = layer.height - BORDER_OFFSET * 2;
    const radius = Math.min(BORDER_RADIUS, borderWidth / 2, borderHeight / 2);
    const approximatePerimeter = 2 * (borderWidth + borderHeight) + 2 * Math.PI * radius;
    const sampleCount = Math.max(140, Math.floor(approximatePerimeter / 2));

    const tracePath = () => {
      ctx.beginPath();
      for (let i = 0; i <= sampleCount; i += 1) {
        const progress = i / sampleCount;
        const point = getRoundedRectPoint(progress, left, top, borderWidth, borderHeight, radius);
        const xNoise = octavedNoise(progress * 8, layer.time, 0);
        const yNoise = octavedNoise(progress * 8, layer.time, 1);
        const x = point.x + xNoise * DISPLACEMENT;
        const y = point.y + yNoise * DISPLACEMENT;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    tracePath();
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.18)';
    ctx.lineWidth = THICKNESS + 8;
    ctx.shadowBlur = 24;
    ctx.shadowColor = 'rgba(34, 197, 94, 0.45)';
    ctx.stroke();

    tracePath();
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.48)';
    ctx.lineWidth = THICKNESS + 3;
    ctx.shadowBlur = 14;
    ctx.shadowColor = 'rgba(34, 197, 94, 0.6)';
    ctx.stroke();

    tracePath();
    ctx.strokeStyle = COLOR;
    ctx.lineWidth = THICKNESS;
    ctx.shadowBlur = 6;
    ctx.shadowColor = 'rgba(34, 197, 94, 0.9)';
    ctx.stroke();
  };

  document.addEventListener('DOMContentLoaded', () => {
    const cards = Array.from(document.querySelectorAll('#harga .pricing-electric-card'));
    if (!cards.length) return;

    let activeCard = null;
    let rafId = 0;

    const deactivateAll = () => {
      cards.forEach((card) => {
        card.classList.remove('is-electric-active');
        card.setAttribute('aria-pressed', 'false');
      });
    };

    const loop = (time) => {
      if (!activeCard) {
        rafId = 0;
        return;
      }

      if (!prefersReducedMotion) {
        const layer = createLayer(activeCard);
        draw(activeCard, layer, time);
      }

      rafId = requestAnimationFrame(loop);
    };

    const activate = (card) => {
      if (!card || activeCard === card) return;
      deactivateAll();
      activeCard = card;
      card.classList.add('is-electric-active');
      card.setAttribute('aria-pressed', 'true');
      createLayer(card);
      if (!rafId) rafId = requestAnimationFrame(loop);
    };

    cards.forEach((card) => {
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-pressed', 'false');

      card.addEventListener('click', (event) => {
        if (event.target.closest('.pricing-package-cta')) return;
        activate(card);
      });

      card.addEventListener('keydown', (event) => {
        if (event.target.closest('.pricing-package-cta')) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          activate(card);
        }
      });
    });

    window.addEventListener('resize', () => {
      if (activeCard?.__electricLayer) {
        activeCard.__electricLayer.width = 0;
        activeCard.__electricLayer.height = 0;
      }
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      } else if (!document.hidden && activeCard && !rafId) {
        rafId = requestAnimationFrame(loop);
      }
    });
  });
})();
