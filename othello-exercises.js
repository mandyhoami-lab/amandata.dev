/* =========================================================
   amandata.dev — beginner Othello exercises.
   A find-the-best-move deck teaching concepts from Brian Rose's
   "Othello: A Minute to Learn… A Lifetime to Master".
   Lazy-inits on first Exercises-button click. Black to play in
   every position; every best move is engine-verified.
   No animations: everything updates instantly.
   ========================================================= */
(function () {
  'use strict';

  var BOOK_URL = 'https://eothello.com/pdf/othello-book-Brian-Rose.pdf';

  /* rows: 8 strings, '.'=empty, 'b'/'w'=discs, row 0 at TOP.
     best: engine-best square. trap: {sq, refute, msg} — a tempting
     blunder, demonstrated live with White's refutation. */
  var EXERCISES = [
    {
      title: 'Take the corner',
      rows: ['........', 'w.......', 'b.......', '...wb...', '...bw...', '........', '........', '........'],
      side: 'b', best: 'a1', trap: null, greedy: null,
      why: 'a1 is a corner — once taken, it can never be flipped.',
      wrongMsg: 'Legal — but the corner is right there. Try again.'
    },
    {
      title: 'Dodge the X-square',
      rows: ['........', '........', '.ww.....', '.b..wb..', '...bw...', '........', '........', '........'],
      side: 'b', best: 'f3',
      trap: { sq: 'b2', refute: 'a1', msg: 'b2 is the X-square — the diagonal neighbor of the corner. White takes a1 next.' },
      greedy: null,
      why: 'f3 develops quietly while b2 hands White the corner. Never play the X-square early.',
      wrongMsg: 'Legal — but there is a stronger square. Try again.'
    },
    {
      title: 'Dodge the C-square',
      rows: ['..w.....', '.w......', '.b......', '...wb...', '...bw...', '........', '........', '........'],
      side: 'b', best: 'f5',
      trap: { sq: 'b1', refute: 'a1', msg: 'b1 is the C-square — with the corner exposed, White takes a1 on the spot.' },
      greedy: null,
      why: 'f5 keeps developing while b1 gifts the corner. Respect the C-square.',
      wrongMsg: 'Legal — but there is a stronger square. Try again.'
    },
    {
      title: 'Play quiet',
      rows: ['........', '........', '........', '..wwwb..', '...wb...', '...bw...', '........', '........'],
      side: 'b', best: 'f6', trap: null, greedy: 'b4',
      why: 'f6 flips a single disc. Quiet moves keep your options open — b4 grabs three and hands White new squares.',
      wrongMsg: 'Legal — but there is a quieter square. Try again.'
    },
    {
      title: 'Corner beats greed',
      rows: ['........', 'w.......', 'b.......', '..wwwwb.', '...bw...', '........', '........', '........'],
      side: 'b', best: 'a1', trap: null, greedy: 'b4',
      why: 'Four discs now versus a disc that is yours forever. Take the corner.',
      wrongMsg: 'Legal — but greed loses to the corner. Try again.'
    },
    {
      title: 'Punish their C-square',
      rows: ['.wb.....', '........', '........', '...wb...', '...bw...', '........', '........', '........'],
      side: 'b', best: 'a1', trap: null, greedy: null,
      why: "White's C-square handed you the corner — take it.",
      wrongMsg: 'Legal — but White handed you a corner. Try again.'
    }
  ];

  /* expose the deck for node testing */
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EXERCISES: EXERCISES, BOOK_URL: BOOK_URL };
  }

  var E = (typeof window !== 'undefined') ? window.OthelloEngine : null;
  var boardEl = (typeof document !== 'undefined') ? document.getElementById('ex-board') : null;
  var exBtn = (typeof document !== 'undefined') ? document.getElementById('othello-ex-btn') : null;
  if (!E || !boardEl || !exBtn) return;

  var promptEl = document.getElementById('ex-prompt');
  var feedbackEl = document.getElementById('ex-feedback');
  var barFill = document.getElementById('ex-barfill');
  var ptext = document.getElementById('ex-ptext');
  var answerBtn = document.getElementById('ex-answer-btn');
  var tryAgainBtn = document.getElementById('ex-tryagain-btn');
  var nextBtn = document.getElementById('ex-next-btn');
  var restartBtn = document.getElementById('ex-restart-btn');
  var shuffleBtn = document.getElementById('ex-shuffle-btn');

  var order = [], idx = 0, nailed = {}, review = {};
  var tries = 0, revealed = false, resolved = false, started = false;
  var grid = null, legal = [], current = null;

  var sprites = {};
  function spriteFor(color) {
    if (!sprites[color]) sprites[color] = E.discSprite(color);
    return sprites[color] ? 'url(' + sprites[color] + ')' : '';
  }

  function parseRows(rows) {
    return rows.map(function (r) {
      return r.split('').map(function (ch) { return ch === '.' ? null : ch; });
    });
  }
  function findMove(name, moves) {
    for (var i = 0; i < moves.length; i++) {
      if (E.moveName(moves[i]) === name) return moves[i];
    }
    return null;
  }

  function setFeedback(text, kind) {
    feedbackEl.textContent = text;
    feedbackEl.className = 'ex-feedback' + (kind ? ' ex-feedback--' + kind : '');
  }

  function renderBoard() {
    boardEl.innerHTML = '';
    var hintSet = {};
    legal.forEach(function (m) { hintSet[m.r * 8 + m.c] = true; });
    for (var r = 0; r < 8; r++) for (var c = 0; c < 8; c++) {
      (function (rr, cc) {
        var cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'othello-cell';
        cell.setAttribute('aria-label', 'row ' + (rr + 1) + ' column ' + (cc + 1));
        if (hintSet[rr * 8 + cc]) cell.classList.add('othello-cell--hint');
        var v = grid[rr][cc];
        if (v) {
          var disc = document.createElement('span');
          disc.className = 'othello-disc';
          disc.style.backgroundImage = spriteFor(v);
          cell.appendChild(disc);
        }
        cell.addEventListener('click', function () { onCell(rr, cc); });
        boardEl.appendChild(cell);
      })(r, c);
    }
  }

  function markCell(mv, cls) {
    if (!mv) return;
    var cell = boardEl.children[mv.r * 8 + mv.c];
    if (cell) cell.classList.add(cls);
  }

  function updateProgress() {
    var total = order.length, n = 0, k;
    for (k in nailed) n++;
    var m = 0;
    for (k in review) m++;
    barFill.style.width = total ? (idx / total * 100) + '%' : '0%';
    ptext.textContent = total
      ? 'exercise ' + Math.min(idx + 1, total) + ' of ' + total + ' · ' + n + ' nailed · ' + m + ' to review'
      : 'no exercises';
  }

  /* restore the current position fresh (keeps tries) */
  function setupPosition() {
    grid = parseRows(current.rows);
    legal = E.legalMoves(grid, current.side);
    resolved = false;
    renderBoard();
    setFeedback('', '');
    answerBtn.removeAttribute('hidden');
    tryAgainBtn.setAttribute('hidden', '');
    nextBtn.setAttribute('hidden', '');
  }

  function renderEx() {
    current = EXERCISES[order[idx]];
    tries = 0;
    revealed = false;
    promptEl.textContent = current.title + ' — Black to play, find the best move.';
    setupPosition();
    updateProgress();
  }

  function resolveGood() {
    resolved = true;
    var bestMv = findMove(current.best, legal);
    markCell(bestMv, 'ex-cell--good');
    setFeedback(current.why, 'good');
    answerBtn.setAttribute('hidden', '');
    tryAgainBtn.setAttribute('hidden', '');
    nextBtn.removeAttribute('hidden');
  }

  function revealAnswer() {
    setupPosition();
    revealed = true;
    resolveGood();
  }

  function trapDemo(mv) {
    tries++;
    /* play the trap, then White's refutation, live on the board */
    E.applyMove(grid, mv, current.side);
    var whiteMoves = E.legalMoves(grid, E.other(current.side));
    var refuteMv = current.trap ? findMove(current.trap.refute, whiteMoves) : null;
    if (refuteMv) E.applyMove(grid, refuteMv, E.other(current.side));
    legal = [];
    renderBoard();
    markCell(mv, 'ex-cell--bad');
    markCell(refuteMv, 'ex-cell--bad');
    setFeedback(current.trap.msg, 'bad');
    tryAgainBtn.removeAttribute('hidden');
    if (tries >= 2) revealAnswer();
  }

  function onCell(r, c) {
    if (resolved) return;
    var mv = null;
    for (var i = 0; i < legal.length; i++) {
      if (legal[i].r === r && legal[i].c === c) { mv = legal[i]; break; }
    }
    if (!mv) return;
    var name = E.moveName(mv);
    if (name === current.best) { resolveGood(); return; }
    if (current.trap && name === current.trap.sq) { trapDemo(mv); return; }
    tries++;
    setFeedback(current.wrongMsg, 'bad');
  }

  function counts() {
    var n = 0, m = 0, k;
    for (k in nailed) n++;
    for (k in review) m++;
    return { n: n, m: m };
  }

  function showDone() {
    var c = counts();
    barFill.style.width = '100%';
    ptext.textContent = 'deck complete · ' + c.n + ' nailed · ' + c.m + ' to review';
    promptEl.textContent = '';
    setFeedback('', '');
    boardEl.innerHTML =
      '<div class="ex-done">' +
      '<div class="ex-done__big">★</div>' +
      '<div class="ex-done__title">Deck complete!</div>' +
      '<div class="ex-done__sub">' + c.n + ' nailed · ' + c.m + ' to review<br><br>reshuffle or restart to drill again</div>' +
      '</div>';
    answerBtn.setAttribute('hidden', '');
    tryAgainBtn.setAttribute('hidden', '');
    nextBtn.setAttribute('hidden', '');
  }

  function next() {
    if (idx >= order.length) return;
    if (!revealed && tries === 0) nailed[order[idx]] = 1;
    else review[order[idx]] = 1;
    idx++;
    if (idx >= order.length) showDone();
    else renderEx();
  }

  function resetDeck() {
    nailed = {};
    review = {};
    idx = 0;
    renderEx();
  }

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function init() {
    if (started) return;
    started = true;
    sprites.b = E.discSprite('b');
    sprites.w = E.discSprite('w');
    order = [0, 1, 2, 3, 4, 5];
    answerBtn.addEventListener('click', revealAnswer);
    tryAgainBtn.addEventListener('click', function () { setupPosition(); });
    nextBtn.addEventListener('click', next);
    restartBtn.addEventListener('click', resetDeck);
    shuffleBtn.addEventListener('click', function () {
      shuffle(order);
      resetDeck();
    });
    renderEx();
  }

  exBtn.addEventListener('click', init);
})();
