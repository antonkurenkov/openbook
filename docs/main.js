(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealItems = document.querySelectorAll('.reveal');
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16 });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const navLinks = Array.from(document.querySelectorAll('.main-nav a[href^="#"]'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length > 0) {
    const navObserver = new IntersectionObserver((entries) => {
      const activeEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!activeEntry) return;
      const activeId = `#${activeEntry.target.id}`;
      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === activeId);
      });
    }, { rootMargin: '-26% 0px -58% 0px', threshold: [0.14, 0.34, 0.58] });

    sections.forEach((section) => navObserver.observe(section));
  }

  const dialog = document.querySelector('[data-lightbox-dialog]');
  const dialogImage = document.querySelector('[data-lightbox-image]');
  const closeButton = document.querySelector('[data-lightbox-close]');

  document.querySelectorAll('[data-lightbox]').forEach((button) => {
    button.addEventListener('click', () => {
      const src = button.getAttribute('data-lightbox');
      const preview = button.querySelector('img');
      if (!src) return;

      if (!dialog || !dialogImage || typeof dialog.showModal !== 'function') {
        window.open(src, '_blank', 'noopener,noreferrer');
        return;
      }

      dialogImage.src = src;
      dialogImage.alt = preview ? preview.alt : '';
      dialog.showModal();
    });
  });

  if (dialog && closeButton && dialogImage) {
    const closeDialog = () => {
      dialog.close();
      dialogImage.removeAttribute('src');
      dialogImage.alt = '';
    };

    closeButton.addEventListener('click', closeDialog);
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) closeDialog();
    });
    dialog.addEventListener('cancel', () => {
      dialogImage.removeAttribute('src');
      dialogImage.alt = '';
    });
  }
})();
