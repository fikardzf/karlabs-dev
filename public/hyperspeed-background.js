(() => {
  'use strict';

  const CONFIG = {
    length: 400,
    roadWidth: 10,
    islandWidth: 2,
    lanesPerRoad: 4,
    fov: 90,
    speedUp: 2,
    totalSideLightSticks: 36,
    lightPairsPerRoadWay: 48,
    carLightsFade: 0.4,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.12, 0.5],
    lightStickHeight: [1.3, 1.7],
    movingAwaySpeed: [60, 80],
    movingCloserSpeed: [-120, -160],
    carLightsLength: [400 * 0.03, 400 * 0.2],
    carLightsRadius: [0.05, 0.14],
    carWidthPercentage: [0.3, 0.5],
    carShiftX: [-0.8, 0.8],
    carFloorSeparation: [0, 5],
    colors: {
      roadColor: '#080808',
      islandColor: '#0a0a0a',
      background: '#000000',
      shoulderLines: '#131318',
      brokenLines: '#131318',
      leftCars: ['#d856bf', '#6750a2', '#c247ac'],
      rightCars: ['#03b3c3', '#0e5ea5', '#324555'],
      sticks: '#03b3c3',
      accent: '#22C55E'
    }
  };

  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia?.('(max-width: 767px)').matches;
  const rand = (min, max) => min + Math.random() * (max - min);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const lerp = (a, b, t) => a + (b - a) * t;

  function initHyperspeedBackground() {
    if (document.getElementById('hyperspeed-background')) return;

    const root = document.createElement('div');
    root.id = 'hyperspeed-background';
    root.setAttribute('aria-hidden', 'true');

    const canvas = document.createElement('canvas');
    root.appendChild(canvas);
    document.body.prepend(root);

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const state = {
      width: 1,
      height: 1,
      dpr: 1,
      time: 0,
      speedBoost: 0,
      targetBoost: 0,
      lines: [],
      cars: [],
      sticks: [],
      stars: [],
      raf: 0,
      last: performance.now()
    };

    function resetScene() {
      const carCount = isMobile ? 38 : CONFIG.lightPairsPerRoadWay * 2;
      const stickCount = isMobile ? 28 : CONFIG.totalSideLightSticks;
      const starCount = isMobile ? 70 : 120;
      state.cars = Array.from({ length: carCount }, (_, i) => makeCar(i));
      state.sticks = Array.from({ length: stickCount }, (_, i) => makeStick(i));
      state.stars = Array.from({ length: starCount }, makeStar);
    }

    function resize() {
      const w = Math.max(1, window.innerWidth);
      const h = Math.max(1, window.innerHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      state.width = w;
      state.height = h;
      state.dpr = dpr;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      resetScene();
    }

    function makeStar() {
      return {
        x: rand(-0.3, 1.3),
        y: rand(0.02, 0.62),
        z: rand(0, 1),
        alpha: rand(0.08, 0.36),
        size: rand(0.5, 1.8)
      };
    }

    function makeCar(index) {
      const side = index % 2 === 0 ? -1 : 1;
      const lane = Math.floor(Math.random() * CONFIG.lanesPerRoad);
      const palette = side < 0 ? CONFIG.colors.leftCars : CONFIG.colors.rightCars;
      return {
        side,
        lane,
        z: rand(0, 1),
        xShift: rand(CONFIG.carShiftX[0], CONFIG.carShiftX[1]),
        width: rand(CONFIG.carWidthPercentage[0], CONFIG.carWidthPercentage[1]),
        length: rand(CONFIG.carLightsLength[0], CONFIG.carLightsLength[1]) / CONFIG.length,
        radius: rand(CONFIG.carLightsRadius[0], CONFIG.carLightsRadius[1]),
        speed: side < 0 ? rand(CONFIG.movingAwaySpeed[0], CONFIG.movingAwaySpeed[1]) : Math.abs(rand(CONFIG.movingCloserSpeed[0], CONFIG.movingCloserSpeed[1])),
        color: pick(palette),
        alpha: rand(0.38, 0.92)
      };
    }

    function makeStick(index) {
      return {
        side: index % 2 === 0 ? -1 : 1,
        z: index / Math.max(1, CONFIG.totalSideLightSticks - 1),
        width: rand(CONFIG.lightStickWidth[0], CONFIG.lightStickWidth[1]),
        height: rand(CONFIG.lightStickHeight[0], CONFIG.lightStickHeight[1]),
        alpha: rand(0.35, 0.95),
        offset: rand(-0.08, 0.08)
      };
    }

    function perspective(z) {
      const w = state.width;
      const h = state.height;
      const horizon = h * (isMobile ? 0.34 : 0.40);
      const depth = Math.pow(1 - z, 2.25);
      const y = lerp(horizon, h * 1.12, depth);
      const scale = clamp(depth, 0.015, 1);
      const roadHalf = lerp(w * (isMobile ? 0.05 : 0.07), w * (isMobile ? 0.70 : 0.54), scale);
      const center = w * 0.5 + Math.sin((state.time * 0.00035) + z * 5.0) * w * 0.04 * scale;
      return { x: center, y, scale, roadHalf, horizon };
    }

    function roadX(progress, normalizedX) {
      const p = perspective(progress);
      return p.x + normalizedX * p.roadHalf;
    }

    function drawBackground() {
      const { width: w, height: h } = state;
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#00170d');
      g.addColorStop(0.30, '#000906');
      g.addColorStop(1, '#000000');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      const radial = ctx.createRadialGradient(w * 0.5, h * 0.42, 0, w * 0.5, h * 0.42, Math.max(w, h) * 0.72);
      radial.addColorStop(0, 'rgba(34,197,94,0.17)');
      radial.addColorStop(0.42, 'rgba(3,179,195,0.05)');
      radial.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (const s of state.stars) {
        const drift = (state.time * 0.000012 * (0.5 + s.z)) % 1;
        const x = ((s.x + drift) % 1.6 - 0.3) * w;
        const y = s.y * h;
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = CONFIG.colors.accent;
        ctx.fillRect(x, y, s.size, s.size);
      }
      ctx.restore();
    }

    function drawRoad() {
      const { width: w, height: h } = state;
      const steps = 72;
      const left = [];
      const right = [];
      const islandLeft = [];
      const islandRight = [];
      for (let i = 0; i <= steps; i++) {
        const z = i / steps;
        const p = perspective(z);
        left.push([p.x - p.roadHalf, p.y]);
        right.push([p.x + p.roadHalf, p.y]);
        const island = p.roadHalf * 0.095;
        islandLeft.push([p.x - island, p.y]);
        islandRight.push([p.x + island, p.y]);
      }

      const roadGrad = ctx.createLinearGradient(0, h * 0.38, 0, h);
      roadGrad.addColorStop(0, 'rgba(2, 9, 7, 0.06)');
      roadGrad.addColorStop(1, 'rgba(3, 7, 7, 0.72)');
      ctx.fillStyle = roadGrad;
      ctx.beginPath();
      left.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      right.slice().reverse().forEach(([x, y]) => ctx.lineTo(x, y));
      ctx.closePath();
      ctx.fill();

      const islandGrad = ctx.createLinearGradient(0, h * 0.4, 0, h);
      islandGrad.addColorStop(0, 'rgba(10,10,10,0.05)');
      islandGrad.addColorStop(1, 'rgba(10,10,10,0.80)');
      ctx.fillStyle = islandGrad;
      ctx.beginPath();
      islandLeft.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      islandRight.slice().reverse().forEach(([x, y]) => ctx.lineTo(x, y));
      ctx.closePath();
      ctx.fill();

      drawRoadLine(-1);
      drawRoadLine(1);
      for (let lane = 1; lane < CONFIG.lanesPerRoad; lane++) {
        const offset = -1 + (lane / CONFIG.lanesPerRoad) * 2;
        drawDashedRoadLine(offset * 0.82);
      }
    }

    function drawRoadLine(xNorm) {
      ctx.save();
      ctx.strokeStyle = 'rgba(34,197,94,0.18)';
      ctx.lineWidth = isMobile ? 1 : 1.4;
      ctx.beginPath();
      for (let i = 0; i <= 56; i++) {
        const z = i / 56;
        const p = perspective(z);
        const x = p.x + xNorm * p.roadHalf * 0.96;
        if (i === 0) ctx.moveTo(x, p.y);
        else ctx.lineTo(x, p.y);
      }
      ctx.stroke();
      ctx.restore();
    }

    function drawDashedRoadLine(xNorm) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.09)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 26; i++) {
        const z1 = ((i / 26) + (state.time * 0.00018)) % 1;
        const z2 = Math.min(1, z1 + 0.022);
        const p1 = perspective(z1);
        const p2 = perspective(z2);
        const x1 = p1.x + xNorm * p1.roadHalf;
        const x2 = p2.x + xNorm * p2.roadHalf;
        ctx.globalAlpha = clamp(p1.scale * 1.7, 0, 0.5);
        ctx.beginPath();
        ctx.moveTo(x1, p1.y);
        ctx.lineTo(x2, p2.y);
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawLightTrail(car) {
      const boost = 1 + state.speedBoost * 0.65;
      const z = car.side < 0 ? (car.z + state.time * 0.000018 * car.speed * boost) % 1 : (car.z + state.time * 0.000025 * car.speed * boost) % 1;
      const p = perspective(z);
      if (p.y < p.horizon || p.scale < 0.02) return;

      const laneWidth = 1.65 / CONFIG.lanesPerRoad;
      const laneCenter = -0.82 + laneWidth * car.lane + laneWidth / 2;
      const xNorm = laneCenter + car.xShift * laneWidth * 0.45;
      const pairGap = p.roadHalf * laneWidth * car.width * 0.22;
      const x = p.x + xNorm * p.roadHalf;
      const trailLength = car.length * state.height * (0.65 + p.scale * 1.9);
      const radius = Math.max(1.3, car.radius * 18 * p.scale);
      const y2 = p.y;
      const y1 = car.side < 0 ? p.y - trailLength : p.y + trailLength * 0.32;
      const alpha = clamp(car.alpha * p.scale * 1.9, 0, 0.85);

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (const dx of [-pairGap, pairGap]) {
        const grad = ctx.createLinearGradient(x + dx, y1, x + dx, y2);
        if (car.side < 0) {
          grad.addColorStop(0, 'rgba(0,0,0,0)');
          grad.addColorStop(0.45, `${hexToRgba(car.color, alpha * 0.35)}`);
          grad.addColorStop(1, `${hexToRgba(car.color, alpha)}`);
        } else {
          grad.addColorStop(0, `${hexToRgba(car.color, alpha)}`);
          grad.addColorStop(1, 'rgba(0,0,0,0)');
        }
        ctx.strokeStyle = grad;
        ctx.lineWidth = radius;
        ctx.lineCap = 'round';
        ctx.shadowColor = car.color;
        ctx.shadowBlur = 16 * p.scale + 4;
        ctx.beginPath();
        ctx.moveTo(x + dx, y1);
        ctx.lineTo(x + dx, y2);
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawStick(stick) {
      const speed = 0.00018 * (1 + state.speedBoost * 0.3);
      const z = (stick.z + state.time * speed + stick.offset) % 1;
      const p = perspective(z);
      if (p.scale < 0.03) return;
      const sideX = p.x + stick.side * p.roadHalf * 1.10;
      const height = stick.height * state.height * p.scale * 0.12;
      const width = stick.width * 10 * p.scale;
      const alpha = clamp(stick.alpha * p.scale * 1.9, 0, 0.8);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.shadowColor = CONFIG.colors.sticks;
      ctx.shadowBlur = 18 * p.scale + 4;
      ctx.fillStyle = hexToRgba(CONFIG.colors.sticks, alpha);
      ctx.fillRect(sideX - width / 2, p.y - height, Math.max(1, width), height);
      ctx.restore();
    }

    function hexToRgba(hex, alpha) {
      const n = parseInt(hex.replace('#', ''), 16);
      const r = (n >> 16) & 255;
      const g = (n >> 8) & 255;
      const b = n & 255;
      return `rgba(${r},${g},${b},${alpha})`;
    }

    function draw(now) {
      const delta = Math.min(50, now - state.last);
      state.last = now;
      state.time += prefersReducedMotion ? delta * 0.12 : delta;
      state.speedBoost = lerp(state.speedBoost, state.targetBoost, 0.08);

      drawBackground();
      drawRoad();
      for (const stick of state.sticks) drawStick(stick);
      for (const car of state.cars) drawLightTrail(car);

      state.raf = requestAnimationFrame(draw);
    }

    function setBoost(value) {
      state.targetBoost = value;
    }

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointerdown', () => setBoost(CONFIG.speedUp), { passive: true });
    window.addEventListener('pointerup', () => setBoost(0), { passive: true });
    window.addEventListener('pointercancel', () => setBoost(0), { passive: true });
    window.addEventListener('blur', () => setBoost(0));

    resize();
    state.raf = requestAnimationFrame(draw);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHyperspeedBackground, { once: true });
  } else {
    initHyperspeedBackground();
  }
})();
