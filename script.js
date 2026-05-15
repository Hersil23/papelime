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

  // ── Form de contacto (fake submit)
  function setupContactForm() {
    var form = document.querySelector('.form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.classList.add('is-sent');
      var btn = form.querySelector('button[type="submit"]');
      if (btn) btn.textContent = '✓ Mensaje enviado';
    });
  }

  // ── Año dinámico en el footer
  function setFooterYear() {
    var el = document.querySelector('[data-year]');
    if (el) el.textContent = new Date().getFullYear();
  }

  // init
  document.addEventListener('DOMContentLoaded', function () {
    setActiveNav();
    setupNavToggle();
    setupContactForm();
    setFooterYear();
  });
})();
