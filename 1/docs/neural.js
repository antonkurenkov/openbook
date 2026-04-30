(() => {
  const canvas = document.getElementById('neural-field');
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  const pointer = { x: 0, y: 0, active: false };
  let width = 0;
  let height = 0;
  let dpr = 1;
  let nodes = [];
  let rafId = 0;

  const config = { density: 0.000055, maxNodes: 92, minNodes: 42, linkDistance: 148, pointerDistance: 180, speed: 0.22 };

  function makeNode() {
    return { x: Math.random() * width, y: Math.random() * height, vx: (Math.random() - 0.5) * config.speed, vy: (Math.random() - 0.5) * config.speed, r: 1.2 + Math.random() * 1.8, phase: Math.random() * Math.PI * 2 };
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const target = Math.max(config.minNodes, Math.min(config.maxNodes, Math.floor(width * height * config.density)));
    nodes = Array.from({ length: target }, makeNode);
  }

  function drawGrid() {
    ctx.save();
    ctx.globalAlpha = 0.28;
    ctx.strokeStyle = 'rgba(7, 27, 56, 0.085)';
    ctx.lineWidth = 1;
    const step = 72;
    const offset = (window.scrollY || 0) * 0.03;
    for (let x = -step; x < width + step; x += step) { ctx.beginPath(); ctx.moveTo(x + (offset % step), 0); ctx.lineTo(x + (offset % step), height); ctx.stroke(); }
    for (let y = -step; y < height + step; y += step) { ctx.beginPath(); ctx.moveTo(0, y + (offset % step)); ctx.lineTo(width, y + (offset % step)); ctx.stroke(); }
    ctx.restore();
  }

  function drawNode(node, time) {
    const pulse = Math.sin(time * 0.001 + node.phase) * 0.45 + 0.55;
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.r + pulse * 0.8, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(18, 62, 122, ${0.12 + pulse * 0.11})`;
    ctx.fill();
  }

  function drawLinks() {
    for (let i = 0; i < nodes.length; i += 1) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j += 1) {
        const b = nodes[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance > config.linkDistance) continue;
        const alpha = (1 - distance / config.linkDistance) * 0.12;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(7, 27, 56, ${alpha})`;
        ctx.lineWidth = 1; ctx.stroke();
      }
      if (pointer.active) {
        const distance = Math.hypot(a.x - pointer.x, a.y - pointer.y);
        if (distance < config.pointerDistance) {
          const alpha = (1 - distance / config.pointerDistance) * 0.22;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(pointer.x, pointer.y);
          ctx.strokeStyle = `rgba(85, 184, 255, ${alpha})`;
          ctx.lineWidth = 1; ctx.stroke();
        }
      }
    }
  }

  function updateNodes() {
    nodes.forEach((node) => {
      node.x += node.vx; node.y += node.vy;
      if (node.x < -20) node.x = width + 20;
      if (node.x > width + 20) node.x = -20;
      if (node.y < -20) node.y = height + 20;
      if (node.y > height + 20) node.y = -20;
    });
  }

  function frame(time) {
    ctx.clearRect(0, 0, width, height);
    drawGrid(); drawLinks(); nodes.forEach((node) => drawNode(node, time)); updateNodes();
    rafId = requestAnimationFrame(frame);
  }

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', (event) => { pointer.x = event.clientX; pointer.y = event.clientY; pointer.active = true; }, { passive: true });
  window.addEventListener('pointerleave', () => { pointer.active = false; }, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAnimationFrame(rafId); else rafId = requestAnimationFrame(frame); });
  resize(); rafId = requestAnimationFrame(frame);
})();

(() => {
  const target = document.querySelector('[data-title-neural]');
  if (!target) return;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { alpha: true });
  let nodes = [];
  let active = false;
  let rafId = 0;
  let lastTexture = 0;
  let width = 900;
  let height = 180;

  function resize() {
    const rect = target.getBoundingClientRect();
    width = Math.max(420, Math.floor(rect.width * 1.2));
    height = Math.max(140, Math.floor(rect.height * 1.7));
    canvas.width = width;
    canvas.height = height;
    nodes = Array.from({ length: 42 }, () => ({ x: Math.random() * width, y: Math.random() * height, vx: (Math.random() - 0.5) * 0.9, vy: (Math.random() - 0.5) * 0.9, r: 1.4 + Math.random() * 2.5, phase: Math.random() * Math.PI * 2 }));
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);
    const glow = ctx.createRadialGradient(width * .55, height * .45, 0, width * .55, height * .45, width * .72);
    glow.addColorStop(0, 'rgba(85,184,255,.58)');
    glow.addColorStop(.38, 'rgba(126,108,255,.28)');
    glow.addColorStop(1, 'rgba(7,27,56,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    const lineDistance = Math.min(170, width * .22);
    for (let i = 0; i < nodes.length; i += 1) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j += 1) {
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d > lineDistance) continue;
        const alpha = (1 - d / lineDistance) * .68;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(180,235,255,${alpha})`;
        ctx.lineWidth = 1.1; ctx.stroke();
      }
    }

    nodes.forEach((node) => {
      const pulse = Math.sin(time * .003 + node.phase) * .5 + .5;
      ctx.beginPath(); ctx.arc(node.x, node.y, node.r + pulse * 1.1, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245,251,255,${.48 + pulse * .42})`;
      ctx.fill();
      node.x += node.vx; node.y += node.vy;
      if (node.x < -10) node.x = width + 10;
      if (node.x > width + 10) node.x = -10;
      if (node.y < -10) node.y = height + 10;
      if (node.y > height + 10) node.y = -10;
    });

    if (time - lastTexture > 70) {
      target.style.setProperty('--title-neural-texture', `url(${canvas.toDataURL('image/png')})`);
      lastTexture = time;
    }
  }
  function frame(time) { if (!active) return; draw(time); rafId = requestAnimationFrame(frame); }
  function start() { if (prefersReducedMotion || active) return; active = true; resize(); rafId = requestAnimationFrame(frame); }
  function stop() { active = false; cancelAnimationFrame(rafId); }
  target.addEventListener('pointerenter', start, { passive: true });
  target.addEventListener('focus', start, { passive: true });
  target.addEventListener('pointerleave', stop, { passive: true });
  target.addEventListener('blur', stop, { passive: true });
  window.addEventListener('resize', resize, { passive: true });
  resize();
})();
