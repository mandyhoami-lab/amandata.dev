/* =========================================================
   amandata.dev — playable Othello vs. a leveling AI.
   You play black and move first. Win and the AI levels up
   (saved in localStorage), maxing out at level 5 — which is
   sharp but still very beatable. No animations by request:
   everything updates instantly.
   ========================================================= */
(function () {
  'use strict';

  /* ---------------- engine (pure, testable) ---------------- */
  var N = 8;
  var DIRS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

  function onBoard(r, c) { return r >= 0 && r < N && c >= 0 && c < N; }
  function other(p) { return p === 'b' ? 'w' : 'b'; }

  function newGrid() {
    var g = [];
    for (var r = 0; r < N; r++) { g.push([]); for (var c = 0; c < N; c++) g[r].push(null); }
    g[3][3] = 'w'; g[3][4] = 'b';
    g[4][3] = 'b'; g[4][4] = 'w';
    return g;
  }

  function legalMoves(g, p) {
    var o = other(p), moves = [];
    for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) {
      if (g[r][c]) continue;
      var flips = [];
      for (var d = 0; d < DIRS.length; d++) {
        var line = [], rr = r + DIRS[d][0], cc = c + DIRS[d][1];
        while (onBoard(rr, cc) && g[rr][cc] === o) { line.push([rr, cc]); rr += DIRS[d][0]; cc += DIRS[d][1]; }
        if (line.length && onBoard(rr, cc) && g[rr][cc] === p) flips = flips.concat(line);
      }
      if (flips.length) moves.push({ r: r, c: c, flips: flips });
    }
    return moves;
  }

  function applyMove(g, mv, p) {
    g[mv.r][mv.c] = p;
    for (var i = 0; i < mv.flips.length; i++) g[mv.flips[i][0]][mv.flips[i][1]] = p;
  }

  function countDiscs(g) {
    var b = 0, w = 0;
    for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) {
      if (g[r][c] === 'b') b++; else if (g[r][c] === 'w') w++;
    }
    return { b: b, w: w };
  }

  /* ---------------- AI ----------------
     Level 1 "sleepy"   — random legal move
     Level 2 "curious"  — greedy: most flips
     Level 3 "focused"  — 1-ply with positional weights
     Level 4 "sharp"    — 2-ply minimax, weights + mobility
     Level 5 "tryhard"  — 3-ply minimax, weights + mobility
     Deliberately no opening book or endgame solver: even at
     max level a thoughtful human wins regularly.           */
  var MAX_LEVEL = 5;
  var LEVEL_NAMES = { 1: 'sleepy', 2: 'curious', 3: 'focused', 4: 'sharp', 5: 'tryhard' };

  var WEIGHTS = [
    120, -20,  20,   5,   5,  20, -20, 120,
    -20, -40,  -5,  -5,  -5,  -5, -40, -20,
     20,  -5,  15,   3,   3,  15,  -5,  20,
      5,  -5,   3,   3,   3,   3,  -5,   5,
      5,  -5,   3,   3,   3,   3,  -5,   5,
     20,  -5,  15,   3,   3,  15,  -5,  20,
    -20, -40,  -5,  -5,  -5,  -5, -40, -20,
    120, -20,  20,   5,   5,  20, -20, 120
  ];

  function evaluate(g, p) {
    var o = other(p), score = 0;
    for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) {
      if (g[r][c] === p) score += WEIGHTS[r * N + c];
      else if (g[r][c] === o) score -= WEIGHTS[r * N + c];
    }
    /* mobility: having moves is worth something */
    var pm = legalMoves(g, p).length, om = legalMoves(g, o).length;
    score += (pm - om) * 6;
    return score;
  }

  function cloneGrid(g) {
    return g.map(function (row) { return row.slice(); });
  }

  function minimax(g, turn, depth, ai, alpha, beta) {
    var moves = legalMoves(g, turn);
    if (!moves.length) {
      var om = legalMoves(g, other(turn));
      if (!om.length || depth === 0) return evaluate(g, ai);
      return minimax(g, other(turn), depth, ai, alpha, beta); /* pass, no depth cost */
    }
    if (depth === 0) return evaluate(g, ai);
    if (turn === ai) {
      var best = -Infinity;
      for (var i = 0; i < moves.length; i++) {
        var ng = cloneGrid(g);
        applyMove(ng, moves[i], turn);
        var v = minimax(ng, other(turn), depth - 1, ai, alpha, beta);
        if (v > best) best = v;
        if (best > alpha) alpha = best;
        if (beta <= alpha) break;
      }
      return best;
    }
    var worst = Infinity;
    for (var j = 0; j < moves.length; j++) {
      var ng2 = cloneGrid(g);
      applyMove(ng2, moves[j], turn);
      var v2 = minimax(ng2, other(turn), depth - 1, ai, alpha, beta);
      if (v2 < worst) worst = v2;
      if (worst < beta) beta = worst;
      if (beta <= alpha) break;
    }
    return worst;
  }

  function aiChoose(g, moves, level, ai, rnd) {
    rnd = rnd || Math.random;
    if (level <= 1 || !moves.length) {
      return moves[Math.floor(rnd() * moves.length)] || null;
    }
    var scored = moves.map(function (mv) {
      var s;
      if (level === 2) {
        s = mv.flips.length + rnd() * 3;
      } else {
        var ng = cloneGrid(g);
        applyMove(ng, mv, ai);
        var depth = level === 3 ? 0 : level === 4 ? 1 : 2;
        /* level 3 is 1-ply: evaluate right after our move */
        s = depth === 0 ? evaluate(ng, ai)
                        : minimax(ng, other(ai), depth, ai, -Infinity, Infinity);
        s += rnd() * (level === 5 ? 4 : 8); /* a little human wobble */
      }
      return { mv: mv, s: s };
    });
    scored.sort(function (a, b) { return b.s - a.s; });
    return scored[0].mv;
  }

  /* expose engine for node testing */
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { newGrid: newGrid, legalMoves: legalMoves, applyMove: applyMove,
      countDiscs: countDiscs, evaluate: evaluate, aiChoose: aiChoose, other: other,
      MAX_LEVEL: MAX_LEVEL, LEVEL_NAMES: LEVEL_NAMES };
    return;
  }

  /* ---------------- UI ---------------- */
  var boardEl = document.getElementById('othello-board');
  if (!boardEl) return;

  var statusEl = document.getElementById('othello-status');
  var youEl = document.getElementById('othello-you');
  var aiEl = document.getElementById('othello-ai');
  var levelEl = document.getElementById('othello-level');
  var newBtn = document.getElementById('othello-new');

  var HUMAN = 'b', AI = 'w';
  var LEVEL_KEY = 'amandata-othello-level';

  var grid, turn, aiThinking = false, lastMove = null, gameLive = true;

  function getLevel() {
    try {
      var l = parseInt(localStorage.getItem(LEVEL_KEY), 10);
      if (l >= 1 && l <= MAX_LEVEL) return l;
    } catch (e) {}
    return 1;
  }
  function setLevel(l) {
    try { localStorage.setItem(LEVEL_KEY, String(l)); } catch (e) {}
  }
  var level = getLevel();

  function levelLabel() {
    return 'ai: ' + LEVEL_NAMES[level] + ' · lv ' + level + '/' + MAX_LEVEL;
  }

  function buildBoard() {
    boardEl.innerHTML = '';
    for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) {
      (function (rr, cc) {
        var cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'othello-cell';
        cell.setAttribute('aria-label', 'row ' + (rr + 1) + ' column ' + (cc + 1));
        cell.addEventListener('click', function () { onCell(rr, cc); });
        cell.dataset.r = rr; cell.dataset.c = cc;
        boardEl.appendChild(cell);
      })(r, c);
    }
  }

  function render(humanMoves) {
    var cells = boardEl.children;
    var hintSet = {};
    if (humanMoves) humanMoves.forEach(function (m) { hintSet[m.r * N + m.c] = true; });
    for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) {
      var cell = cells[r * N + c];
      cell.classList.toggle('othello-cell--hint', !!hintSet[r * N + c]);
      var disc = cell.querySelector('.othello-disc');
      var v = grid[r][c];
      if (!v) { if (disc) disc.remove(); continue; }
      if (!disc) {
        disc = document.createElement('span');
        disc.className = 'othello-disc';
        cell.appendChild(disc);
      }
      disc.className = 'othello-disc othello-disc--' + v +
        (lastMove && lastMove[0] === r && lastMove[1] === c ? ' othello-disc--last' : '');
    }
    var n = countDiscs(grid);
    youEl.textContent = n.b;
    aiEl.textContent = n.w;
    levelEl.textContent = levelLabel();
  }

  function setStatus(t) { statusEl.textContent = t; }

  function newGame() {
    grid = newGrid();
    turn = HUMAN;
    aiThinking = false;
    lastMove = null;
    gameLive = true;
    render(legalMoves(grid, HUMAN));
    setStatus('Your move — you play black.');
  }

  function onCell(r, c) {
    if (!gameLive || aiThinking || turn !== HUMAN) return;
    var moves = legalMoves(grid, HUMAN);
    var mv = null;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].r === r && moves[i].c === c) { mv = moves[i]; break; }
    }
    if (!mv) return;
    applyMove(grid, mv, HUMAN);
    lastMove = [r, c];
    advance();
  }

  function advance() {
    var next = other(turn);
    var nextMoves = legalMoves(grid, next);
    if (nextMoves.length) {
      turn = next;
    } else {
      var curMoves = legalMoves(grid, turn);
      if (!curMoves.length) { gameOver(); return; }
      setStatus((next === AI ? 'AI' : 'You') + ' has no moves — pass.');
      /* turn stays with current player */
    }
    if (turn === AI) {
      aiThinking = true;
      render(null);
      setStatus('AI (' + LEVEL_NAMES[level] + ') is thinking…');
      setTimeout(aiMove, 450);
    } else {
      aiThinking = false;
      var hm = legalMoves(grid, HUMAN);
      render(hm);
      if (gameLive) {
        var s = statusEl.textContent;
        if (s.indexOf('pass') === -1) setStatus('Your move.');
      }
    }
  }

  function aiMove() {
    if (!gameLive) return;
    var moves = legalMoves(grid, AI);
    if (moves.length) {
      var mv = aiChoose(grid, moves, level, AI, Math.random);
      applyMove(grid, mv, AI);
      lastMove = [mv.r, mv.c];
    }
    aiThinking = false;
    advance();
  }

  function gameOver() {
    gameLive = false;
    aiThinking = false;
    render(null);
    var n = countDiscs(grid);
    if (n.b > n.w) {
      if (level < MAX_LEVEL) {
        level++;
        setLevel(level);
        setStatus('You win ' + n.b + '–' + n.w + '! The AI leveled up: now ' +
          LEVEL_NAMES[level] + ' (lv ' + level + ').');
      } else {
        setStatus('You win ' + n.b + '–' + n.w + '! The AI is maxed out — it fears you.');
      }
    } else if (n.w > n.b) {
      setStatus('AI wins ' + n.w + '–' + n.b + '. It stays ' + LEVEL_NAMES[level] + ' — run it back.');
    } else {
      setStatus('Draw, ' + n.b + '–' + n.w + '. Nobody levels up.');
    }
    render(null);
  }

  newBtn.addEventListener('click', newGame);

  buildBoard();
  newGame();
})();
