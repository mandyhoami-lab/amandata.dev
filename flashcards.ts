/* Shared flashcard deck engine.
   Each deck page sets window.FLASHCARD_DECK before loading this file:
     { title, sub, backHref, backLabel, cards: [{tag, term, def}, ...] }
   Features: tag filter, shuffle, missed-only drill, progress bar,
   click/space flip, arrow-key grading, done screen. */
(function () {
  'use strict';
  /* Non-null: the `if (!D ...)` guard below still runs at runtime exactly
     as before; the cast only tells TS the value is set afterwards. */
  const D = window.FLASHCARD_DECK as FlashcardDeck;
  if (!D || !D.cards) return;

  var deckEl = document.getElementById('fc-deck');
  /* These elements live on the same deck page as fc-deck; assert non-null
     so a missing element fails the same way the original JS did. */
  var filterEl = document.getElementById('fc-filter') as HTMLSelectElement;
  var shuffleBtn = document.getElementById('fc-shuffle') as HTMLButtonElement;
  var missOnlyBtn = document.getElementById('fc-missonly') as HTMLButtonElement;
  var barFill = document.getElementById('fc-barfill') as HTMLElement;
  var ptext = document.getElementById('fc-ptext') as HTMLElement;
  var missBtn = document.getElementById('fc-miss') as HTMLButtonElement;
  var gotBtn = document.getElementById('fc-got') as HTMLButtonElement;
  if (!deckEl) return;

  document.title = D.title + ' — Amanda Ta';
  (document.getElementById('fc-title') as HTMLElement).textContent = D.title;
  (document.getElementById('fc-sub') as HTMLElement).textContent = D.sub;

  var tags: string[] = [];
  D.cards.forEach(function (c) { if (tags.indexOf(c.tag) < 0) tags.push(c.tag); });
  tags.forEach(function (t) {
    var o = document.createElement('option');
    o.value = t; o.textContent = t;
    filterEl.appendChild(o);
  });

  var queue: number[] = [], idx = 0;
  var got: { [k: number]: number } = {}, missed: { [k: number]: number } = {};
  var missOnly = false;

  function buildQueue(): void {
    var pool: number[] = [];
    for (var i = 0; i < D.cards.length; i++) {
      if (filterEl.value !== 'all' && D.cards[i].tag !== filterEl.value) continue;
      if (missOnly && !missed[i]) continue;
      pool.push(i);
    }
    queue = pool; idx = 0;
  }
  function shuffle(a: number[]): number[] {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function esc(s: string): string {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function counts(): { g: number; m: number } {
    var g = 0, m = 0, k: string;
    for (k in got) g++;
    for (k in missed) m++;
    return { g: g, m: m };
  }
  function updateProgress(): void {
    var total = queue.length, c = counts();
    barFill.style.width = total ? (idx / total * 100) + '%' : '0%';
    ptext.textContent = total
      ? 'card ' + Math.min(idx + 1, total) + ' of ' + total + ' · ' + c.g + ' nailed · ' + c.m + ' to review'
      : 'no cards in this view';
  }
  function render(): void {
    if (idx >= queue.length) { showDone(); return; }
    var c = D.cards[queue[idx]];
    deckEl!.innerHTML =
      '<div class="fc-card" id="fc-card" role="button" tabindex="0" aria-label="flashcard: ' + esc(c.term) + '. activate to flip.">' +
      '<div class="fc-inner">' +
      '<div class="fc-face front"><div class="fc-tag">' + esc(c.tag) + '</div>' +
      '<div class="fc-term">' + esc(c.term) + '</div>' +
      '<div class="fc-hint">tap to flip</div></div>' +
      '<div class="fc-face back"><div class="fc-tag">' + esc(c.tag) + '</div>' +
      '<div class="fc-def">' + esc(c.def) + '</div>' +
      '<div class="fc-hint">tap to flip back</div></div>' +
      '</div></div>';
    var card = document.getElementById('fc-card') as HTMLElement;
    card.addEventListener('click', flip);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); }
    });
    updateProgress();
  }
  function flip(): void {
    var card = document.getElementById('fc-card');
    if (card) card.classList.toggle('flipped');
  }
  function showDone(): void {
    updateProgress();
    var c = counts();
    deckEl!.innerHTML =
      '<div class="fc-face fc-done" style="position:static">' +
      '<div class="big">★</div>' +
      '<div class="fc-term">Deck complete!</div>' +
      '<div class="fc-hint">' + c.g + ' nailed · ' + c.m + ' still learning<br><br>reshuffle or switch topics to keep drilling</div></div>';
  }
  function grade(known: boolean): void {
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
  missOnlyBtn.addEventListener('click', function (this: HTMLButtonElement) {
    missOnly = !missOnly;
    this.textContent = 'Missed only: ' + (missOnly ? 'on' : 'off');
    buildQueue(); idx = 0; render();
  });
  filterEl.addEventListener('change', function () { buildQueue(); idx = 0; render(); });
  document.addEventListener('keydown', function (e) {
    var t = e.target as Element | null;
    if (t && (t.tagName === 'SELECT' || t.tagName === 'INPUT')) return;
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
