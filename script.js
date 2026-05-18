/* ─────────────────────────────────────────────────────────────
 * Papelime — script.js
 * Vanilla JS. Solo lo necesario: mobile menu, active nav,
 * form de contacto y mejoras menores.
 * ───────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  // ── Active nav link (basado en el nombre del archivo actual)
  function setActiveNav() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    var links = document.querySelectorAll('.nav__link');
    for (var i = 0; i < links.length; i++) {
      var href = (links[i].getAttribute('href') || '').split('/').pop();
      if (href === path) links[i].classList.add('is-active');
    }
  }

  // ── Mobile menu toggle
  function setupNavToggle() {
    var btn = document.querySelector('.nav__toggle');
    var menu = document.querySelector('.nav__links');
    if (!btn || !menu) return;
    btn.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // close on link click (mobile)
    var links = menu.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        menu.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      });
    }
  }

  // ── WhatsApp config
  var WA_NUMBER = '15712539605'; // +1 571-253-9605 (Northern Virginia)
  var WA_BASE   = 'https://wa.me/' + WA_NUMBER + '?text=';

  // ── Form de contacto → abre WhatsApp con el mensaje prellenado
  function setupContactForm() {
    var form = document.querySelector('.form');
    if (!form) return;
    var reasonLabels = {
      wholesale:    'Consulta mayorista / punto de venta',
      press:        'Prensa & medios',
      partnerships: 'Alianzas',
      other:        'Solo un saludo'
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name    = (data.get('name')    || '').toString().trim();
      var email   = (data.get('email')   || '').toString().trim();
      var reason  = (data.get('reason')  || '').toString().trim();
      var message = (data.get('message') || '').toString().trim();
      var text =
        'Hola Papelime! 👋\n\n' +
        'Soy ' + (name || '(sin nombre)') + '.\n' +
        'Motivo: ' + (reasonLabels[reason] || reason || '—') + '\n' +
        'Email: ' + (email || '—') + '\n\n' +
        'Mensaje:\n' + (message || '—');
      form.classList.add('is-sent');
      var btn = form.querySelector('button[type="submit"]');
      if (btn) btn.textContent = '✓ Abriendo WhatsApp…';
      window.open(WA_BASE + encodeURIComponent(text), '_blank', 'noopener');
    });
  }

  // ── Botón flotante de WhatsApp (todas las páginas)
  function setupWhatsappFab() {
    if (document.querySelector('.wa-fab')) return;
    var a = document.createElement('a');
    a.className = 'wa-fab';
    a.href = WA_BASE + encodeURIComponent('Hola Papelime! 👋 Quiero más información.');
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', 'Chatear por WhatsApp');

    var SVG_NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 32 32');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    var path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('fill', 'currentColor');
    path.setAttribute('d', 'M16.001 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.26.6 4.46 1.74 6.4L3.2 28.8l6.59-1.72a12.74 12.74 0 0 0 6.21 1.59h.01c7.06 0 12.8-5.73 12.8-12.8 0-3.42-1.33-6.63-3.75-9.05A12.71 12.71 0 0 0 16 3.2zm0 23.31h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-3.91 1.02 1.04-3.81-.25-.4a10.6 10.6 0 0 1-1.62-5.61c0-5.88 4.78-10.66 10.66-10.66 2.85 0 5.52 1.11 7.53 3.12a10.59 10.59 0 0 1 3.12 7.54c0 5.88-4.78 10.66-10.78 10.66zm5.84-7.98c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59a9.66 9.66 0 0 1-1.78-2.22c-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.72-.98-2.35-.26-.62-.52-.54-.71-.55l-.61-.01c-.21 0-.56.08-.85.4-.29.32-1.11 1.08-1.11 2.64s1.14 3.06 1.3 3.27c.16.21 2.24 3.42 5.42 4.79.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.89-.77 2.16-1.52.27-.74.27-1.38.19-1.51-.08-.13-.29-.21-.61-.37z');
    svg.appendChild(path);
    a.appendChild(svg);
    document.body.appendChild(a);

    // Ocultar cuando el footer entra al viewport (anti-choque con footer)
    var footer = document.querySelector('.footer');
    if (footer && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          a.classList.toggle('is-hidden', entries[i].isIntersecting);
        }
      }, { rootMargin: '0px 0px -40px 0px', threshold: 0 });
      io.observe(footer);
    }
  }

  // ── Año dinámico en el footer
  function setFooterYear() {
    var el = document.querySelector('[data-year]');
    if (el) el.textContent = new Date().getFullYear();
  }

  // ── De-obfuscate contact links (anti-scraper)
  function setupObfuscatedContacts() {
    var mailLinks = document.querySelectorAll('[data-mailto]');
    for (var i = 0; i < mailLinks.length; i++) {
      var parts = (mailLinks[i].getAttribute('data-mailto') || '').split(':');
      if (parts.length === 2) {
        var addr = parts[0] + '@' + parts[1];
        mailLinks[i].setAttribute('href', 'mailto:' + addr);
        // Replace placeholder text with the real email after JS runs
        // (HTML source stays obfuscated against scrapers)
        if (mailLinks[i].dataset.keep !== 'true') mailLinks[i].textContent = addr;
      }
    }
    var telLinks = document.querySelectorAll('[data-tel]');
    for (var j = 0; j < telLinks.length; j++) {
      var num = telLinks[j].getAttribute('data-tel') || '';
      var digits = num.replace(/[^0-9]/g, '');
      telLinks[j].setAttribute('href', 'tel:' + digits);
    }
  }

  // ── Trigger bar animations when in view (set --bar-w from data-pct)
  function setupBarAnimations() {
    var bars = document.querySelectorAll('.bar-row__fill[data-pct]');
    for (var i = 0; i < bars.length; i++) {
      bars[i].style.setProperty('--bar-w', bars[i].getAttribute('data-pct') + '%');
      bars[i].style.setProperty('--bar-delay', (i * 80) + 'ms');
    }
  }

  // init
  document.addEventListener('DOMContentLoaded', function () {
    setActiveNav();
    setupNavToggle();
    setupContactForm();
    setFooterYear();
    setupWhatsappFab();
    setupObfuscatedContacts();
    setupBarAnimations();
  });
})();
