/* =========================================================
   amandata.dev — playable Othello vs. the AI.
   No levels, no limits: one honest AI, you choose black or
   white. Optional all-time scoreboard with usernames
   (localStorage), plus a how-to-play panel.
   No animations: everything updates instantly.
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
     One fixed strength: 1-ply search with positional weights
     and a mobility term, plus a little random wobble so it
     doesn't play like a machine. Sensible, beatable. */
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
    score += (legalMoves(g, p).length - legalMoves(g, o).length) * 6;
    return score;
  }

  function cloneGrid(g) {
    return g.map(function (row) { return row.slice(); });
  }

  function aiChooseMove(g, moves, ai, rnd) {
    rnd = rnd || Math.random;
    if (!moves.length) return null;
    var scored = moves.map(function (mv) {
      var ng = cloneGrid(g);
      applyMove(ng, mv, ai);
      return { mv: mv, s: evaluate(ng, ai) + rnd() * 8 };
    });
    scored.sort(function (a, b) { return b.s - a.s; });
    return scored[0].mv;
  }

  /* expose engine for node testing */
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { newGrid: newGrid, legalMoves: legalMoves, applyMove: applyMove,
      countDiscs: countDiscs, evaluate: evaluate, aiChooseMove: aiChooseMove, other: other };
    return;
  }

  /* ---------------- UI ---------------- */
  var boardEl = document.getElementById('othello-board');
  if (!boardEl) return;

  var statusEl = document.getElementById('othello-status');
  var youEl = document.getElementById('othello-you');
  var aiEl = document.getElementById('othello-ai');
  var youDiscEl = document.getElementById('othello-you-disc');
  var aiDiscEl = document.getElementById('othello-ai-disc');
  var newBtn = document.getElementById('othello-new');
  var scoresBtn = document.getElementById('othello-scores-btn');
  var helpBtn = document.getElementById('othello-help-btn');
  var scoresPanel = document.getElementById('othello-scores-panel');
  var helpPanel = document.getElementById('othello-help-panel');
  var colorB = document.getElementById('othello-color-b');
  var colorW = document.getElementById('othello-color-w');
  var nameInput = document.getElementById('othello-name');
  var addBtn = document.getElementById('othello-add');
  var scoreList = document.getElementById('othello-score-list');

  var COLOR_KEY = 'amandata-othello-color';
  var SCORE_KEY = 'amandata-othello-scores-v1';

  var grid, turn, aiThinking = false, lastMove = null, gameLive = true;
  var human = 'b', ai = 'w';

  function loadColor() {
    try {
      var c = localStorage.getItem(COLOR_KEY);
      if (c === 'w' || c === 'b') return c;
    } catch (e) {}
    return 'b';
  }
  function saveColor(c) {
    try { localStorage.setItem(COLOR_KEY, c); } catch (e) {}
  }

  /* -------- scoreboard -------- */
  function loadScores() {
    try {
      var s = JSON.parse(localStorage.getItem(SCORE_KEY));
      if (s && s.players) return s;
    } catch (e) {}
    return { players: {}, active: null };
  }
  function saveScores(s) {
    try { localStorage.setItem(SCORE_KEY, JSON.stringify(s)); } catch (e) {}
  }
  var scores = loadScores();

  function renderScores() {
    scoreList.innerHTML = '';
    var names = Object.keys(scores.players).sort();
    if (!names.length) {
      var p = document.createElement('p');
      p.className = 'score-empty';
      p.textContent = 'No players yet — add a username above and your results get tracked.';
      scoreList.appendChild(p);
      return;
    }
    var table = document.createElement('table');
    table.className = 'score-table';
    var head = document.createElement('tr');
    ['player', 'w', 'l', 'd'].forEach(function (h) {
      var th = document.createElement('th');
      th.textContent = h;
      head.appendChild(th);
    });
    table.appendChild(head);
    names.forEach(function (name) {
      var st = scores.players[name];
      var tr = document.createElement('tr');
      if (name === scores.active) tr.className = 'score-row--active';
      tr.title = 'Click to track as ' + name;
      var tdN = document.createElement('td');
      tdN.textContent = name + (name === scores.active ? ' ●' : '');
      tr.appendChild(tdN);
      [st.w, st.l, st.d].forEach(function (v) {
        var td = document.createElement('td');
        td.textContent = v;
        tr.appendChild(td);
      });
      tr.addEventListener('click', function () {
        scores.active = name;
        saveScores(scores);
        renderScores();
        setStatus('Tracking scores as ' + name + '.');
      });
      table.appendChild(tr);
    });
    scoreList.appendChild(table);
  }

  function addPlayer() {
    var name = (nameInput.value || '').trim().slice(0, 16);
    if (!name) return;
    if (!scores.players[name]) scores.players[name] = { w: 0, l: 0, d: 0 };
    scores.active = name;
    saveScores(scores);
    nameInput.value = '';
    renderScores();
    setStatus('Tracking scores as ' + name + '.');
  }

  function recordResult(result) {
    if (!scores.active || !scores.players[scores.active]) return;
    var st = scores.players[scores.active];
    if (result === 'win') st.w++;
    else if (result === 'loss') st.l++;
    else st.d++;
    saveScores(scores);
    renderScores();
  }

  /* -------- board -------- */
  function buildBoard() {
    boardEl.innerHTML = '';
    for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) {
      (function (rr, cc) {
        var cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'othello-cell';
        cell.setAttribute('aria-label', 'row ' + (rr + 1) + ' column ' + (cc + 1));
        cell.addEventListener('click', function () { onCell(rr, cc); });
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
    youEl.textContent = human === 'b' ? n.b : n.w;
    aiEl.textContent = ai === 'b' ? n.b : n.w;
    youDiscEl.className = 'mini-disc mini-disc--' + human;
    aiDiscEl.className = 'mini-disc mini-disc--' + ai;
  }

  function setStatus(t) { statusEl.textContent = t; }

  function colorName(c) { return c === 'b' ? 'black' : 'white'; }

  function markColorButtons() {
    colorB.classList.toggle('othello-seg--active', human === 'b');
    colorW.classList.toggle('othello-seg--active', human === 'w');
    colorB.setAttribute('aria-pressed', human === 'b' ? 'true' : 'false');
    colorW.setAttribute('aria-pressed', human === 'w' ? 'true' : 'false');
  }

  function newGame() {
    grid = newGrid();
    turn = 'b';
    aiThinking = false;
    lastMove = null;
    gameLive = true;
    markColorButtons();
    if (turn === human) {
      render(legalMoves(grid, human));
      setStatus('Your move — you play ' + colorName(human) + '.');
    } else {
      render(null);
      aiThinking = true;
      setStatus('AI opens as ' + colorName(ai) + '…');
      setTimeout(aiMove, 500);
    }
  }

  function setHumanColor(c) {
    if (human === c && gameLive) { newGame(); return; }
    human = c;
    ai = other(c);
    saveColor(c);
    newGame();
  }

  function onCell(r, c) {
    if (!gameLive || aiThinking || turn !== human) return;
    var moves = legalMoves(grid, human);
    var mv = null;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].r === r && moves[i].c === c) { mv = moves[i]; break; }
    }
    if (!mv) return;
    applyMove(grid, mv, human);
    lastMove = [r, c];
    advance();
  }

  function advance() {
    var next = other(turn);
    var nextMoves = legalMoves(grid, next);
    if (nextMoves.length) {
      turn = next;
    } else {
      if (!legalMoves(grid, turn).length) { gameOver(); return; }
      setStatus((next === ai ? 'AI' : 'You') + ' has no moves — pass.');
    }
    if (turn === ai) {
      aiThinking = true;
      render(null);
      setStatus('AI is thinking…');
      setTimeout(aiMove, 450);
    } else {
      aiThinking = false;
      var hm = legalMoves(grid, human);
      render(hm);
      if (gameLive && statusEl.textContent.indexOf('pass') === -1) setStatus('Your move.');
    }
  }

  function aiMove() {
    if (!gameLive) return;
    var mv = aiChooseMove(grid, legalMoves(grid, ai), ai, Math.random);
    if (mv) {
      applyMove(grid, mv, ai);
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
    var hn = human === 'b' ? n.b : n.w;
    var an = ai === 'b' ? n.b : n.w;
    var who = scores.active ? ' (' + scores.active + ')' : '';
    if (hn > an) {
      recordResult('win');
      setStatus('You win ' + hn + '–' + an + who + '! New game?');
    } else if (an > hn) {
      recordResult('loss');
      setStatus('AI wins ' + an + '–' + hn + who + '. Run it back.');
    } else {
      recordResult('draw');
      setStatus('Draw, ' + hn + '–' + an + who + '.');
    }
  }

  /* -------- wiring -------- */
  newBtn.addEventListener('click', newGame);
  colorB.addEventListener('click', function () { setHumanColor('b'); });
  colorW.addEventListener('click', function () { setHumanColor('w'); });
  scoresBtn.addEventListener('click', function () {
    var open = scoresPanel.hasAttribute('hidden');
    scoresPanel.toggleAttribute('hidden');
    if (open) helpPanel.setAttribute('hidden', '');
  });
  helpBtn.addEventListener('click', function () {
    var open = helpPanel.hasAttribute('hidden');
    helpPanel.toggleAttribute('hidden');
    if (open) scoresPanel.setAttribute('hidden', '');
  });
  addBtn.addEventListener('click', addPlayer);
  nameInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') addPlayer();
  });

  human = loadColor();
  ai = other(human);
  buildBoard();
  renderScores();
  newGame();
})();
