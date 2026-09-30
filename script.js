/* =========================================================
   amandata.dev — vanilla JS behavior, no build step.

   Three rules (carried over from the old amandata.dev):
   1. Everything fails open. The hidden pre-reveal state only
      exists because this script adds `js-on` to <html> — a JS
      error or disabled JS leaves the page fully readable.
   2. prefers-reduced-motion lands every effect in its final
      state instantly instead of animating.
   3. Nothing flashes faster than 3Hz. The caret blinks at ~1Hz.
   ========================================================= */
(function () {
  'use strict';

  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) { /* fail open */ }

  /* Mark JS as working — this is what arms the hidden states in CSS. */
  document.documentElement.classList.add('js-on');

  /* ---------------- typewriter tagline ---------------- */
  (function typewriter() {
    var el = document.getElementById('typewriter');
    if (!el) return;
    var full = el.textContent;
    if (reduceMotion) return; // text already complete
    el.textContent = '';
    var i = 0;
    var timer = setInterval(function () {
      el.textContent = full.slice(0, ++i);
      if (i >= full.length) clearInterval(timer);
    }, 55);
  })();

  /* ---------------- staggered section reveals ---------------- */
  (function reveals() {
    var sections = Array.prototype.slice.call(
      document.querySelectorAll('main .section:not(.section--static)')
    );
    if (!sections.length) return;

    sections.forEach(function (sec) {
      var kids = Array.prototype.filter.call(sec.children, function (el) {
        return el.tagName !== 'SCRIPT';
      });
      kids.forEach(function (child, i) {
        child.classList.add('reveal');
        child.style.setProperty('--d', Math.min(i * 70, 560) + 'ms');
      });
      // key terms light up together per paragraph, after the reveal
      var paras = sec.querySelectorAll('p');
      paras.forEach(function (p, pi) {
        p.querySelectorAll('mark.key').forEach(function (m, mi) {
          m.style.setProperty('--d', (350 + pi * 90 + mi * 55) + 'ms');
        });
      });
    });

    function play(sec) {
      sec.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('in');
      });
      sec.querySelectorAll('mark.key').forEach(function (el) {
        el.classList.add('in');
      });
    }

    if (reduceMotion || !('IntersectionObserver' in window)) {
      sections.forEach(play); // final state, instantly
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          play(en.target);
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    sections.forEach(function (s) { io.observe(s); });
  })();

  /* ---------------- reading progress bar ---------------- */
  (function progress() {
    var bar = document.getElementById('progress');
    if (!bar) return;
    function update() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();

  /* ---------------- nav: active section highlight ---------------- */
  (function navSpy() {
    var links = Array.prototype.slice.call(
      document.querySelectorAll('.nav__link')
    );
    var map = {};
    links.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var sec = document.getElementById(id);
      if (sec) map[id] = a;
    });
    var ids = Object.keys(map);
    if (!ids.length || !('IntersectionObserver' in window)) return;
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) {
            a.classList.toggle('is-active', a === map[en.target.id]);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    ids.forEach(function (id) {
      spy.observe(document.getElementById(id));
    });
  })();

  /* ---------------- stat count-up ---------------- */
  (function stats() {
    var nums = document.querySelectorAll('.stat__num');
    if (!nums.length) return;
    function countUp(el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      if (reduceMotion) { el.textContent = target; return; }
      var dur = 900, start = null;
      function step(now) {
        if (!start) start = now;
        var p = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    if (!('IntersectionObserver' in window)) {
      nums.forEach(countUp);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          countUp(en.target);
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.5 });
    nums.forEach(function (el) { io.observe(el); });
  })();

  /* ---------------- nav scroll hint: fade edges when links overflow ---------------- */
  (function navFade() {
    var links = document.querySelector('.nav__links');
    if (!links) return;
    function update() {
      var can = links.scrollWidth > links.clientWidth + 2;
      var more = can && links.scrollLeft + links.clientWidth < links.scrollWidth - 2;
      var prev = can && links.scrollLeft > 2;
      links.classList.toggle('has-more', more);
      links.classList.toggle('has-prev', prev);
    }
    links.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();

  /* ---------------- email: assembled from parts, not scraped ---------------- */
  (function email() {
    var a = document.getElementById('email-link');
    if (!a) return;
    var u = a.getAttribute('data-user');
    var d = a.getAttribute('data-domain');
    if (u && d) a.setAttribute('href', 'mailto:' + u + '@' + d);
  })();
})();
