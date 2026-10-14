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

  var dropdowns: Element[] = Array.prototype.slice.call(
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
    /* These exist in the markup for every dropdown; asserted non-null so a
       missing element fails the same way the original JS did. The
       `if (!toggle || !menu)` guard below still runs at runtime. */
    const toggle = dd.querySelector('.nav__toggle') as HTMLElement;
    const menu = dd.querySelector('.nav__menu') as HTMLElement;
    if (!toggle || !menu) return;
    var links: HTMLElement[] = Array.prototype.slice.call(
      menu.querySelectorAll('.nav__menu-link')
    );

    function open() {
      closeAll();
      dd.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      var nav = navEl();
      if (nav) nav.classList.add('nav--menu-open');
      /* The panel is position:fixed (see styles.css) so the mobile scroll
         strip can stay a scroll container and still not clip it. Place it
         under the toggle, right-aligned when it would otherwise spill past
         the right edge, and never past the left edge. */
      var r = toggle.getBoundingClientRect();
      var w = menu.offsetWidth || 240;
      var left = r.left;
      if (left + w > window.innerWidth - 8) left = r.right - w;
      left = Math.max(8, Math.min(left, window.innerWidth - 8 - w));
      menu.style.setProperty('--menu-top', Math.round(r.bottom + 9) + 'px');
      menu.style.setProperty('--menu-left', Math.round(left) + 'px');
    }

    function close(refocus: boolean): void {
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
      var i = links.indexOf(document.activeElement as HTMLElement);
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
    var t = e.target as Element | null;
    if (!t || !t.closest || !t.closest('.nav__dropdown')) closeAll();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll();
  });

  /* a resize can move the toggle; don't leave a panel stranded mid-air */
  window.addEventListener('resize', function () { closeAll(); });

  /* the panel is pinned to the viewport, so swiping the mobile link strip
     would leave it detached from its toggle */
  var strip = document.querySelector('.nav__links');
  if (strip) strip.addEventListener('scroll', function () { closeAll(); }, { passive: true });

  /* a menu link navigating away should not leave the panel stuck open */
  document.addEventListener('focusin', function (e) {
    var t = e.target as Element | null;
    if (!t || !t.closest || !t.closest('.nav__dropdown')) closeAll();
  });
})();
