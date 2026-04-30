(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const navLinks = [...document.querySelectorAll('.main-nav a')];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${visible.target.id}`);
      });
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0.12, 0.3, 0.6] });

    sections.forEach((section) => navObserver.observe(section));
  }

  const dialog = document.querySelector('[data-lightbox-dialog]');
  const dialogImage = document.querySelector('[data-lightbox-image]');
  const closeButton = document.querySelector('[data-lightbox-close]');

  document.querySelectorAll('[data-lightbox]').forEach((button) => {
    button.addEventListener('click', () => {
      const src = button.getAttribute('data-lightbox');
      const image = button.querySelector('img');
      if (!src || !dialog || !dialogImage) {
        window.open(src, '_blank', 'noopener,noreferrer');
        return;
      }

      dialogImage.src = src;
      dialogImage.alt = image ? image.alt : '';
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        window.open(src, '_blank', 'noopener,noreferrer');
      }
    });
  });

  if (dialog && closeButton) {
    closeButton.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  }

  if (prefersReduced) return;

  const canvas = document.querySelector('[data-line-canvas]');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const state = {
    width: 0,
    height: 0,
    dpr: Math.min(window.devicePixelRatio || 1, 2),
    points: [],
    pointer: { x: -9999, y: -9999, active: false }
  };

  function resize() {
    const rect = canvas.getBoundingClientRect();
    state.width = rect.width;
    state.height = rect.height;
    canvas.width = Math.floor(rect.width * state.dpr);
    canvas.height = Math.floor(rect.height * state.dpr);
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

    const count = Math.max(34, Math.floor((state.width * state.height) / 26000));
    state.points = Array.from({ length: count }, () => ({
      x: Math.random() * state.width,
      y: Math.random() * state.height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: 1 + Math.random() * 1.8
    }));
  }

  function movePoint(point) {
    point.x += point.vx;
    point.y += point.vy;

    if (point.x < -20) point.x = state.width + 20;
    if (point.x > state.width + 20) point.x = -20;
    if (point.y < -20) point.y = state.height + 20;
    if (point.y > state.height + 20) point.y = -20;

    if (state.pointer.active) {
      const dx = state.pointer.x - point.x;
      const dy = state.pointer.y - point.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 220 && dist > 1) {
        const pull = (1 - dist / 220) * 0.045;
        point.x += dx * pull;
        point.y += dy * pull;
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, state.width, state.height);
    ctx.lineWidth = 1;

    for (let i = 0; i < state.points.length; i += 1) {
      const a = state.points[i];
      movePoint(a);

      for (let j = i + 1; j < state.points.length; j += 1) {
        const b = state.points[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 150) {
          ctx.globalAlpha = (1 - dist / 150) * 0.22;
          ctx.strokeStyle = '#0a3d32';
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = state.pointer.active ? 0.72 : 0.46;
      ctx.fillStyle = '#2f795f';
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  canvas.addEventListener('pointermove', (event) => {
    const rect = canvas.getBoundingClientRect();
    state.pointer.x = event.clientX - rect.left;
    state.pointer.y = event.clientY - rect.top;
    state.pointer.active = true;
  });

  canvas.addEventListener('pointerleave', () => {
    state.pointer.active = false;
  });

  window.addEventListener('resize', resize, { passive: true });
  resize();
  draw();
})();
