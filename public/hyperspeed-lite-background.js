(function () {
  'use strict';

  if (window.__karHyperspeedLiteMounted) return;
  window.__karHyperspeedLiteMounted = true;

  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.matchMedia && window.matchMedia('(max-width: 767px)').matches;
  var dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.25);
  var targetFps = prefersReduced ? 8 : (isMobile ? 18 : 30);
  var frameInterval = 1000 / targetFps;

  var root = document.createElement('div');
  root.id = 'hyperspeed-lite-bg';
  root.setAttribute('aria-hidden', 'true');

  var canvas = document.createElement('canvas');
  root.appendChild(canvas);
  document.body.prepend(root);

  var ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  var width = 1;
  var height = 1;
  var lanes = [];
  var streaks = [];
  var sticks = [];
  var lastFrame = 0;
  var running = true;

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function resetStreak(item, towardCamera) {
    item.z = towardCamera ? rand(0.08, 0.9) : rand(0.04, 0.98);
    item.side = towardCamera ? 1 : -1;
    item.lane = rand(-0.92, 0.92);
    item.speed = towardCamera ? rand(0.00095, 0.00155) : rand(0.00035, 0.00065);
    item.len = towardCamera ? rand(0.11, 0.28) : rand(0.04, 0.13);
    item.radius = rand(1.2, 2.5);
    item.color = towardCamera ? pick(['#22C55E', '#06B6D4', '#4ADE80']) : pick(['#B453FF', '#22C55E', '#0EA5E9']);
    item.alpha = rand(0.42, 0.82);
  }

  function resetStick(item) {
    item.z = rand(0.03, 1);
    item.side = Math.random() > 0.5 ? 1 : -1;
    item.speed = rand(0.0003, 0.00072);
    item.height = rand(14, 44);
    item.alpha = rand(0.22, 0.58);
  }

  function setupObjects() {
    lanes = [-0.48, 0, 0.48];
    var streakCount = isMobile ? 26 : 46;
    var stickCount = isMobile ? 16 : 30;
    streaks = Array.from({ length: streakCount }, function (_, i) {
      var item = {};
      resetStreak(item, i % 2 === 0);
      return item;
    });
    sticks = Array.from({ length: stickCount }, function () {
      var item = {};
      resetStick(item);
      return item;
    });
  }

  function resize() {
    var nextW = Math.max(1, window.innerWidth);
    var nextH = Math.max(1, window.innerHeight);
    isMobile = window.matchMedia && window.matchMedia('(max-width: 767px)').matches;
    dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.25);
    width = nextW;
    height = nextH;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    setupObjects();
  }

  function roadWidthAt(z) {
    var p = z * z;
    return width * (0.06 + p * (isMobile ? 0.72 : 0.88));
  }

  function yAt(z) {
    var horizon = height * (isMobile ? 0.28 : 0.33);
    return horizon + z * z * height * 0.86;
  }

  function xAt(lane, z) {
    var center = width * 0.5;
    var curve = Math.sin(z * 2.1) * width * 0.018;
    return center + lane * roadWidthAt(z) + curve;
  }

  function drawGlowLine(x1, y1, x2, y2, color, alpha, widthLine) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = widthLine;
    ctx.lineCap = 'round';
    ctx.shadowColor = color;
    ctx.shadowBlur = widthLine * 6;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }

  function drawRoad(now) {
    var horizon = height * (isMobile ? 0.28 : 0.33);
    var bottomY = height * 1.08;
    var leftBottom = xAt(-1.18, 1.08);
    var rightBottom = xAt(1.18, 1.08);
    var leftHorizon = xAt(-0.06, 0.02);
    var rightHorizon = xAt(0.06, 0.02);

    var roadGrad = ctx.createLinearGradient(0, horizon, 0, bottomY);
    roadGrad.addColorStop(0, 'rgba(9, 14, 11, 0.08)');
    roadGrad.addColorStop(1, 'rgba(5, 8, 6, 0.78)');
    ctx.fillStyle = roadGrad;
    ctx.beginPath();
    ctx.moveTo(leftHorizon, horizon);
    ctx.lineTo(rightHorizon, horizon);
    ctx.lineTo(rightBottom, bottomY);
    ctx.lineTo(leftBottom, bottomY);
    ctx.closePath();
    ctx.fill();

    [-1.06, 1.06].forEach(function (edge) {
      drawGlowLine(xAt(edge * 0.04, 0.02), horizon, xAt(edge, 1.02), height, '#22C55E', 0.12, 1.2);
    });

    lanes.forEach(function (lane, idx) {
      var phase = ((now * 0.00022) + idx * 0.18) % 1;
      for (var i = 0; i < 20; i++) {
        var z = (i / 20 + phase) % 1;
        if (z < 0.08) continue;
        var y = yAt(z);
        var y2 = yAt(Math.min(1, z + 0.028 + z * 0.025));
        var x = xAt(lane, z);
        var x2 = xAt(lane, Math.min(1, z + 0.03));
        var a = 0.04 + z * 0.22;
        drawGlowLine(x, y, x2, y2, '#1DD05D', a, 0.7 + z * 1.6);
      }
    });
  }

  function drawSticks(delta) {
    sticks.forEach(function (s) {
      s.z += s.speed * delta;
      if (s.z > 1.04) resetStick(s);
      var z = s.z;
      var x = xAt(s.side * 1.22, z);
      var y = yAt(z);
      var h = s.height * (0.2 + z * 1.15);
      var color = s.side > 0 ? '#06B6D4' : '#22C55E';
      drawGlowLine(x, y, x, y - h, color, s.alpha * z, 1 + z * 2);
    });
  }

  function drawStreaks(delta) {
    streaks.forEach(function (c) {
      c.z += c.speed * delta;
      if (c.z > 1.05) resetStreak(c, c.side > 0);
      var z1 = c.z;
      var z2 = Math.max(0.04, c.z - c.len);
      var offset = c.lane * 0.5 + (c.side > 0 ? 0.25 : -0.25);
      var x1 = xAt(offset, z1);
      var y1 = yAt(z1);
      var x2 = xAt(offset, z2);
      var y2 = yAt(z2);
      drawGlowLine(x1, y1, x2, y2, c.color, c.alpha * (0.15 + z1), c.radius * (0.35 + z1));
    });
  }

  function drawGrid(now) {
    ctx.save();
    ctx.globalAlpha = isMobile ? 0.06 : 0.08;
    ctx.strokeStyle = '#22C55E';
    ctx.lineWidth = 1;
    var step = isMobile ? 42 : 34;
    var offset = (now * 0.012) % step;
    for (var y = -step; y < height + step; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y + offset);
      ctx.lineTo(width, y + offset);
      ctx.stroke();
    }
    for (var x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    ctx.restore();
  }

  function draw(now) {
    var delta = Math.min(48, now - (lastFrame || now));
    ctx.clearRect(0, 0, width, height);

    var bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, '#020403');
    bg.addColorStop(0.42, '#041009');
    bg.addColorStop(1, '#020302');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    drawGrid(now);
    drawRoad(now);
    if (!prefersReduced) {
      drawSticks(delta);
      drawStreaks(delta);
    }

    var vignette = ctx.createRadialGradient(width * 0.5, height * 0.44, 0, width * 0.5, height * 0.44, Math.max(width, height) * 0.75);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(0.72, 'rgba(0,0,0,0.36)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.82)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  }

  function loop(now) {
    if (!running) {
      requestAnimationFrame(loop);
      return;
    }
    if (!lastFrame || now - lastFrame >= frameInterval) {
      draw(now);
      lastFrame = now;
    }
    requestAnimationFrame(loop);
  }

  document.addEventListener('visibilitychange', function () {
    running = !document.hidden;
  });

  window.addEventListener('resize', resize, { passive: true });
  resize();
  requestAnimationFrame(loop);
})();
