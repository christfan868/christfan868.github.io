(() => {
  'use strict';
  document.getElementById('year').textContent = String(new Date().getFullYear());

  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('mobile-nav');
  const closeMenu = () => {
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
  };
  toggle.addEventListener('click', () => {
    const opening = toggle.getAttribute('aria-expanded') !== 'true';
    menu.hidden = !opening;
    toggle.setAttribute('aria-expanded', String(opening));
    toggle.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
  });
  menu.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) { closeMenu(); toggle.focus(); }
  });
  document.addEventListener('click', (event) => {
    if (!menu.hidden && !event.target.closest('.site-header')) closeMenu();
  });
  const desktop = window.matchMedia('(min-width: 901px)');
  desktop.addEventListener('change', (event) => { if (event.matches) closeMenu(); });

  const config = window.CORNERSTONE_CONFIG || {};
  const email = typeof config.contactEmail === 'string' ? config.contactEmail.trim() : '';
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const href = `mailto:${encodeURIComponent(email).replace(/%40/g, '@')}?subject=${encodeURIComponent(config.contactSubject || 'Cornerstone enquiry')}`;
    document.querySelectorAll('[data-contact-link]').forEach((link) => {
      link.href = href;
      link.querySelector('[data-contact-label]').textContent = 'Let’s talk';
    });
    const address = document.getElementById('contact-address');
    address.href = href;
    address.textContent = email;
    address.hidden = false;
  }

  // The page and navigation remain available if WebGL or the module cannot load.
  import('./empire.js').then(({ initEmpire }) => initEmpire()).catch((error) => {
    console.info('Cornerstone: the decorative scene is unavailable.', error);
    document.getElementById('journey-controls').hidden = true;
    document.getElementById('empire-scene').style.opacity = '0';
  });
})();
