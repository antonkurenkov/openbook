(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const translations = {
    ru: {
      skip: 'Перейти к содержанию', brand: 'ЗЕЛЁНАЯ ДВЕРЬ', brandAria: 'ЗЕЛЁНАЯ ДВЕРЬ — наверх', navAria: 'Навигация', langAria: 'Переключение языка', navCycle: 'Цикл', navContainer: 'Контейнер', navBooks: 'Книги', navCovers: 'Обложки', heroTitle: 'ЗЕЛЁНАЯ<br>ДВЕРЬ', heroLead: 'Научно-футуристический цикл о человеке, памяти и выборе в мире, где почти всё можно заменить.', primaryLinksAria: 'Основные ссылки', ctaOpenbook: 'Открыть openbook', ctaFirstBook: 'Первая книга', heroAlt: 'Лайнарт-композиция: зелёная дверь, геометрия и порог', cycleKicker: 'цикл', cycleTitle: 'Дверь здесь важнее стены.', cycleText: '«Зелёная дверь» — это дуга книг о личности, связи и выборе. Технологии не отменяют человеческое; они только резче показывают, что именно нельзя заменить без потери смысла.', containerTitle: 'Открытое издание как ветвящийся контейнер', containerText: 'Openbook — не витрина с одной финальной сборкой. Это контейнер, где рядом живут исходники, Markdown-версии, обложки, ветки, форки и будущие траектории чтения.', containerAlt: 'Абстрактная схема ветвящегося контейнера', booksTitle: 'Семь книг в одной дуге', bookOneText: 'Архив, память, стёртые связи и первая дверь в корпус цикла.', bookTwoText: 'Дерево изгнания, предел милосердия и дверь как ответственность.', bookFourTitle: 'ЗЕЛЁНАЯ ДВЕРЬ', bookFourText: 'Книга-порог: точка, где частная память, ветка архива и выбор сходятся в один знак.', openLink: 'Открыть', repoLink: 'Репозиторий', coversTitle: 'Три обложки', coverOneAria: 'Открыть Oblivio Duorum крупно', coverTwoAria: 'Открыть Arbor Exilii крупно', coverFourAria: 'Открыть обложку Зелёной двери крупно', coverOneAlt: 'Обложка Oblivio Duorum в чёрно-белом лайнарт-стиле', coverTwoAlt: 'Обложка Arbor Exilii в высоком ключе', coverFourAlt: 'Обложка книги Зелёная дверь', coverFourCaption: 'ЗЕЛЁНАЯ ДВЕРЬ', finalTitle: 'Читать, хранить, ветвить', finalText: 'Сайт ведёт к трём точкам: общий репозиторий цикла, отдельное издание первой книги и папка второй книги.', toTop: 'Наверх', lightboxAria: 'Просмотр изображения', closeAria: 'Закрыть'
    },
    en: {
      skip: 'Skip to content', brand: 'THE GREEN DOOR', brandAria: 'THE GREEN DOOR — back to top', navAria: 'Navigation', langAria: 'Language switcher', navCycle: 'Cycle', navContainer: 'Container', navBooks: 'Books', navCovers: 'Covers', heroTitle: 'THE<br>GREEN<br>DOOR', heroLead: 'A science-futurist cycle about memory, personhood, and choice in a world where almost everything can be replaced.', primaryLinksAria: 'Primary links', ctaOpenbook: 'Open openbook', ctaFirstBook: 'First book', heroAlt: 'Line-art composition: a green door, geometry, and threshold', cycleKicker: 'cycle', cycleTitle: 'The door matters more than the wall.', cycleText: 'The Green Door is a book cycle about identity, connection, and choice. Technology does not cancel the human; it only makes clearer what cannot be replaced without losing meaning.', containerTitle: 'An open edition as a branching container', containerText: 'Openbook is not a showcase for one final build. It is a container where source files, Markdown editions, covers, branches, forks, and future reading paths can coexist.', containerAlt: 'Abstract diagram of a branching container', booksTitle: 'Seven books in one arc', bookOneText: 'Archive, memory, erased bonds, and the first door into the body of the cycle.', bookTwoText: 'The tree of exile, the limit of mercy, and the door as responsibility.', bookFourTitle: 'THE GREEN DOOR', bookFourText: 'A threshold book: the point where private memory, an archival branch, and choice converge into one sign.', openLink: 'Open', repoLink: 'Repository', coversTitle: 'Three covers', coverOneAria: 'Open Oblivio Duorum cover', coverTwoAria: 'Open Arbor Exilii cover', coverFourAria: 'Open The Green Door cover', coverOneAlt: 'Oblivio Duorum cover in black-and-white line-art style', coverTwoAlt: 'Arbor Exilii cover in high-key line art', coverFourAlt: 'The Green Door book cover', coverFourCaption: 'THE GREEN DOOR', finalTitle: 'Read, preserve, branch', finalText: 'The site points to three places: the cycle repository, the standalone first-book edition, and the second-book folder.', toTop: 'Back to top', lightboxAria: 'Image preview', closeAria: 'Close'
    }
  };
  const getLang = () => {
    const saved = localStorage.getItem('green-door-lang');
    if (saved === 'ru' || saved === 'en') return saved;
    return (navigator.language || '').toLowerCase().startsWith('en') ? 'en' : 'ru';
  };
  const setLanguage = (lang) => {
    const dictionary = translations[lang] || translations.ru;
    root.lang = lang;
    root.dataset.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((element) => { const key = element.dataset.i18n; if (dictionary[key] !== undefined) element.innerHTML = dictionary[key]; });
    document.querySelectorAll('[data-i18n-alt]').forEach((element) => { const key = element.dataset.i18nAlt; if (dictionary[key] !== undefined) element.alt = dictionary[key]; });
    document.querySelectorAll('[data-i18n-aria]').forEach((element) => { const key = element.dataset.i18nAria; if (dictionary[key] !== undefined) element.setAttribute('aria-label', dictionary[key]); });
    document.querySelectorAll('[data-lang-button]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.langButton === lang)));
    localStorage.setItem('green-door-lang', lang);
  };
  document.querySelectorAll('[data-lang-button]').forEach((button) => button.addEventListener('click', () => setLanguage(button.dataset.langButton)));
  setLanguage(getLang());
  const revealItems = document.querySelectorAll('.reveal');
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => { entries.forEach((entry) => { if (!entry.isIntersecting) return; entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }); }, { threshold: 0.16 });
    revealItems.forEach((item) => observer.observe(item));
  } else { revealItems.forEach((item) => item.classList.add('is-visible')); }
  const navLinks = Array.from(document.querySelectorAll('.main-nav a[href^="#"]'));
  const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length > 0) {
    const navObserver = new IntersectionObserver((entries) => {
      const activeEntry = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!activeEntry) return;
      const activeId = `#${activeEntry.target.id}`;
      navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === activeId));
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
      if (!dialog || !dialogImage || typeof dialog.showModal !== 'function') { window.open(src, '_blank', 'noopener,noreferrer'); return; }
      dialogImage.src = src;
      dialogImage.alt = preview ? preview.alt : '';
      dialog.showModal();
    });
  });
  if (dialog && closeButton && dialogImage) {
    const closeDialog = () => { dialog.close(); dialogImage.removeAttribute('src'); dialogImage.alt = ''; };
    closeButton.addEventListener('click', closeDialog);
    dialog.addEventListener('click', (event) => { if (event.target === dialog) closeDialog(); });
    dialog.addEventListener('cancel', () => { dialogImage.removeAttribute('src'); dialogImage.alt = ''; });
  }
})();
