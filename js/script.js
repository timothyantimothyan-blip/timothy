(function () {
  const root = document.documentElement;

  // Mobile nav toggle
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const menu = document.querySelector('[data-nav-menu]');
  function closeMenu() {
    header && header.classList.remove('nav-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }
  function openMenu() {
    header && header.classList.add('nav-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
  }
  toggle && toggle.addEventListener('click', function () {
    if (header && header.classList.contains('nav-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });
  menu && menu.addEventListener('click', function (e) {
    const target = e.target;
    if (target && target.tagName === 'A') {
      closeMenu();
    }
  });

  // Intersection reveal
  const revealEls = document.querySelectorAll('.reveal');
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12 }) : null;
  revealEls.forEach((el) => {
    if (io) io.observe(el);
    else el.classList.add('in-view');
  });

  // Smooth scroll offset for sticky header
  function smoothScrollToHash(hash) {
    const el = document.querySelector(hash);
    if (!el) return;
    const headerHeight = (document.querySelector('.site-header')?.getBoundingClientRect().height) || 0;
    const y = el.getBoundingClientRect().top + window.scrollY - (headerHeight + 8);
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
  document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;
    const url = new URL(link.href);
    // Only intercept in-page anchors
    if (url.pathname === window.location.pathname) {
      e.preventDefault();
      smoothScrollToHash(hash);
      history.pushState(null, '', hash);
    }
  });

  // Contact form (demo)
  const form = document.querySelector('[data-contact-form]');
  const formStatus = document.querySelector('[data-form-status]');
  form && form.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!form) return;
    const data = new FormData(form);
    const name = (data.get('name') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const type = (data.get('type') || '').toString().trim();
    const message = (data.get('message') || '').toString().trim();
    if (!name || !email || !type || !message) {
      if (formStatus) formStatus.textContent = 'Please complete all fields.';
      return;
    }
    if (formStatus) formStatus.textContent = 'Sending…';
    // Simulate request
    await new Promise((r) => setTimeout(r, 900));
    if (formStatus) formStatus.textContent = 'Thanks! We will reach out shortly.';
    form.reset();
  });

  // Footer year
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();

