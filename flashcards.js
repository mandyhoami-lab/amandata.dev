/* Shared flashcard deck engine.
   Each deck page sets window.FLASHCARD_DECK before loading this file:
     { title, sub, backHref, backLabel, cards: [{tag, term, def}, ...] }
   Features: tag filter, shuffle, missed-only drill, progress bar,
   click/space flip, arrow-key grading, done screen. */
(function () {
  'use strict';
  var D = window.FLASHCARD_DECK;
  if (!D || !D.cards) return;

  var deckEl = document.getElementById('fc-deck');
  var filterEl = document.getElementById('fc-filter');
  var shuffleBtn = document.getElementById('fc-shuffle');
  var missOnlyBtn = document.getElementById('fc-missonly');
  var barFill = document.getElementById('fc-barfill');
  var ptext = document.getElementById('fc-ptext');
  var missBtn = document.getElementById('fc-miss');
  var gotBtn = document.getElementById('fc-got');
  if (!deckEl) return;

  document.title = D.title + ' — Amanda Ta';
  document.getElementById('fc-title').textContent = D.title;
  document.getElementById('fc-sub').textContent = D.sub;

  var tags = [];
  D.cards.forEach(function (c) { if (tags.indexOf(c.tag) < 0) tags.push(c.tag); });
  tags.forEach(function (t) {
    var o = document.createElement('option');
    o.value = t; o.textContent = t;
    filterEl.appendChild(o);
  });

  var queue = [], idx = 0, got = {}, missed = {}, missOnly = false;

  function buildQueue() {
    var pool = [];
    for (var i = 0; i < D.cards.length; i++) {
      if (filterEl.value !== 'all' && D.cards[i].tag !== filterEl.value) continue;
      if (missOnly && !missed[i]) continue;
      pool.push(i);
    }
    queue = pool; idx = 0;
  }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function counts() {
    var g = 0, m = 0, k;
    for (k in got) g++;
    for (k in missed) m++;
    return { g: g, m: m };
  }
  function updateProgress() {
    var total = queue.length, c = counts();
    barFill.style.width = total ? (idx / total * 100) + '%' : '0%';
    ptext.textContent = total
      ? 'card ' + Math.min(idx + 1, total) + ' of ' + total + ' · ' + c.g + ' nailed · ' + c.m + ' to review'
      : 'no cards in this view';
  }
  function render() {
    if (idx >= queue.length) { showDone(); return; }
    var c = D.cards[queue[idx]];
    deckEl.innerHTML =
      '<div class="fc-card" id="fc-card" role="button" tabindex="0" aria-label="flashcard: ' + esc(c.term) + '. activate to flip.">' +
      '<div class="fc-inner">' +
      '<div class="fc-face front"><div class="fc-tag">' + esc(c.tag) + '</div>' +
      '<div class="fc-term">' + esc(c.term) + '</div>' +
      '<div class="fc-hint">tap to flip</div></div>' +
      '<div class="fc-face back"><div class="fc-tag">' + esc(c.tag) + '</div>' +
      '<div class="fc-def">' + esc(c.def) + '</div>' +
      '<div class="fc-hint">tap to flip back</div></div>' +
      '</div></div>';
    var card = document.getElementById('fc-card');
    card.addEventListener('click', flip);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); }
    });
    updateProgress();
  }
  function flip() {
    var card = document.getElementById('fc-card');
    if (card) card.classList.toggle('flipped');
  }
  function showDone() {
    updateProgress();
    var c = counts();
    deckEl.innerHTML =
      '<div class="fc-face fc-done" style="position:static">' +
      '<div class="big">★</div>' +
      '<div class="fc-term">Deck complete!</div>' +
      '<div class="fc-hint">' + c.g + ' nailed · ' + c.m + ' still learning<br><br>reshuffle or switch topics to keep drilling</div></div>';
  }
  function grade(known) {
    if (idx >= queue.length) return;
    var i = queue[idx];
    if (known) { got[i] = 1; delete missed[i]; }
    else { missed[i] = 1; delete got[i]; }
    idx++;
    render();
  }

  missBtn.addEventListener('click', function () { grade(false); });
  gotBtn.addEventListener('click', function () { grade(true); });
  shuffleBtn.addEventListener('click', function () {
    buildQueue(); shuffle(queue); idx = 0; got = {}; missed = {}; render();
  });
  missOnlyBtn.addEventListener('click', function () {
    missOnly = !missOnly;
    this.textContent = 'Missed only: ' + (missOnly ? 'on' : 'off');
    buildQueue(); idx = 0; render();
  });
  filterEl.addEventListener('change', function () { buildQueue(); idx = 0; render(); });
  document.addEventListener('keydown', function (e) {
    if (e.target && (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT')) return;
    if (e.code === 'Space') {
      var card = document.getElementById('fc-card');
      if (card && document.activeElement !== missBtn && document.activeElement !== gotBtn) {
        e.preventDefault(); flip();
      }
    }
    else if (e.key === 'ArrowRight') grade(true);
    else if (e.key === 'ArrowLeft') grade(false);
  });

  buildQueue(); shuffle(queue); render();
})();
