/* =========================================================
   amandata.dev — nav dropdown behavior (shared by all pages)

   Follows the site's fail-open rule: without JS the dropdown
   menus render as plain stacked links (see styles.css), so every
   destination stays reachable. This script only arms the
   floating-panel behavior by adding `js-on` to <html>.
   ========================================================= */
(function () {
  'use strict';

  document.documentElement.classList.add('js-on');

  var dropdowns = Array.prototype.slice.call(
    document.querySelectorAll('.nav__dropdown')
  );
  if (!dropdowns.length) return;

  function navEl() { return document.querySelector('.nav'); }

  function closeAll() {
    var anyOpen = false;
    dropdowns.forEach(function (dd) {
      if (dd.classList.contains('open')) anyOpen = true;
      dd.classList.remove('open');
      var t = dd.querySelector('.nav__toggle');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
    var nav = navEl();
    if (nav) nav.classList.remove('nav--menu-open');
    return anyOpen;
  }

  dropdowns.forEach(function (dd) {
    var toggle = dd.querySelector('.nav__toggle');
    var menu = dd.querySelector('.nav__menu');
    if (!toggle || !menu) return;
    var links = Array.prototype.slice.call(
      menu.querySelectorAll('.nav__menu-link')
    );

    function open() {
      closeAll();
      dd.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      var nav = navEl();
      if (nav) nav.classList.add('nav--menu-open');
    }

    function close(refocus) {
      dd.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      var nav = navEl();
      if (nav && !document.querySelector('.nav__dropdown.open')) {
        nav.classList.remove('nav--menu-open');
      }
      if (refocus) toggle.focus();
    }

    function isOpen() { return dd.classList.contains('open'); }

    toggle.addEventListener('click', function () {
      if (isOpen()) close(false); else open();
    });

    toggle.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
        if (links[0]) links[0].focus();
      } else if (e.key === 'Escape') {
        close(false);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        open();
        if (links.length) links[links.length - 1].focus();
      }
    });

    menu.addEventListener('keydown', function (e) {
      var i = links.indexOf(document.activeElement);
      if (e.key === 'Escape') {
        e.preventDefault();
        close(true);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        links[(i + 1) % links.length].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        links[(i - 1 + links.length) % links.length].focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        links[0].focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        links[links.length - 1].focus();
      } else if (e.key === 'Tab') {
        close(false);
      }
    });
  });

  /* click outside any dropdown closes the open one */
  document.addEventListener('click', function (e) {
    if (!e.target.closest || !e.target.closest('.nav__dropdown')) closeAll();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll();
  });

  /* a menu link navigating away should not leave the panel stuck open */
  document.addEventListener('focusin', function (e) {
    if (!e.target.closest || !e.target.closest('.nav__dropdown')) closeAll();
  });
})();
