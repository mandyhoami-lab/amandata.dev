/* =========================================================
   amandata.dev — vanilla JS behavior, no build step.

   Three rules (carried over from the old amandata.dev):
   1. Everything fails open. The hidden pre-reveal state only
      exists because this script adds `js-on` to <html> — a JS
      error or disabled JS leaves the page fully readable.
   2. prefers-reduced-motion lands every effect in its final
      state instantly instead of animating.
   3. Nothing flashes faster than 3Hz. The caret blinks at ~1Hz
      and the EEG trace is continuous motion, no flicker.
   ========================================================= */
(function () {
  'use strict';

  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) { /* fail open */ }

  /* Mark JS as working — this is what arms the hidden states in CSS. */
  document.documentElement.classList.add('js-on');

  /* ---------------- EEG trace ----------------
     A scrolling trace: sum of a few incommensurate sines plus
     low-amplitude noise, with an occasional smooth biphasic
     deflection. Shaped to read as a trace — it is not derived
     from real data and is not labelled as though it were. */
  (function eeg() {
    var canvas = document.getElementById('eeg');
    if (!canvas) return;
    var ctx = canvas.getContext && canvas.getContext('2d');
    if (!ctx) return;

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0;

    function size() {
      var r = canvas.getBoundingClientRect();
      W = Math.max(1, Math.floor(r.width));
      H = Math.max(1, Math.floor(r.height));
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    window.addEventListener('resize', size);

    var N = 220;              // samples across the width
    var buf = new Array(N).fill(0);
    var t = 0;
    var countdown = 140;      // frames until next deflection
    var deflect = -1;         // progress through deflection, -1 = none

    function sample(x) {
      var v = Math.sin(x * 0.055) * 0.42
            + Math.sin(x * 0.131 + 1.7) * 0.24
            + Math.sin(x * 0.311 + 0.6) * 0.12
            + (Math.random() - 0.5) * 0.10;
      if (deflect >= 0) {
        // smooth biphasic bump: up then down, sine-windowed
        var p = deflect / 26;
        v += Math.sin(p * Math.PI * 2) * Math.sin(p * Math.PI) * 0.9;
        deflect++;
        if (deflect > 26) deflect = -1;
      } else if (--countdown <= 0) {
        deflect = 0;
        countdown = 120 + Math.floor(Math.random() * 160);
      }
      return v;
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      var mid = H / 2, amp = H * 0.38;
      ctx.beginPath();
      for (var i = 0; i < N; i++) {
        var x = (i / (N - 1)) * W;
        var y = mid - buf[i] * amp;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#39C5BB';
      ctx.lineWidth = 1.6;
      ctx.shadowColor = 'rgba(57,197,187,0.7)';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;
      // faint baseline
      ctx.beginPath();
      ctx.moveTo(0, mid); ctx.lineTo(W, mid);
      ctx.strokeStyle = 'rgba(242,242,242,0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    if (reduceMotion) {
      // one static frame, fully drawn — no animation loop
      for (var i = 0; i < N; i++) { buf[i] = sample(t++); }
      draw();
      return;
    }

    var last = 0;
    function frame(now) {
      if (now - last > 33) {          // ~30fps is plenty for a trace
        last = now;
        buf.push(sample(t++));
        buf.shift();
        draw();
      }
      requestAnimationFrame(frame);
    }
    for (var j = 0; j < N; j++) { buf[j] = sample(t++); }
    requestAnimationFrame(frame);
  })();

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
      document.querySelectorAll('main .section')
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

  /* ---------------- email: assembled from parts, not scraped ---------------- */
  (function email() {
    var a = document.getElementById('email-link');
    if (!a) return;
    var u = a.getAttribute('data-user');
    var d = a.getAttribute('data-domain');
    if (u && d) a.setAttribute('href', 'mailto:' + u + '@' + d);
  })();
})();
