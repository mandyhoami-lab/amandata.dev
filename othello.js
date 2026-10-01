/* =========================================================
   amandata.dev — playable Othello vs. the robot.
   No levels, no limits: a teachable robot that's easy to beat
   (you choose black or white). Optional all-time scoreboard
   with usernames (localStorage), plus a how-to-play panel.
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

  /* ---------------- robot ----------------
     A teachable, beatable robot. Each game it samples a "mood":
     a blunder rate between 60% and 92%. Most moves it just picks
     a random legal square (easy to beat, easy to learn against),
     but when it focuses it plays a real 1-ply positional game with
     a mobility term — so you still see what good Othello looks like.
     Some games it goofs off, some games it locks in: expect a mix
     of wins and losses, no two games alike. */
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

  function aiChooseMove(g, moves, ai, rnd, blunder) {
    rnd = rnd || Math.random;
    blunder = (typeof blunder === 'number') ? blunder : 0.75;
    if (!moves.length) return null;
    /* goof-off move: any legal square, great for learning against */
    if (rnd() < blunder) return moves[(rnd() * moves.length) | 0];
    /* focused move: 1-ply positional play with a little wobble */
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

  var grid, turn, aiThinking = false, lastMove = null, gameLive = true, aiBlunder = 0.75;
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
    ['player', 'vs robot'].forEach(function (h) {
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
      var tdS = document.createElement('td');
      tdS.textContent = st.w + ' \u2013 ' + st.l + ' \u2013 ' + st.d;
      tr.appendChild(tdS);
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

  /* -------- pixel-art disc sprites (generated at runtime) -------- */
  var sprites = {};
  function makeDiscSprite(color) {
    var S = 16;
    var cv = document.createElement('canvas');
    cv.width = S; cv.height = S;
    var ctx = cv.getContext('2d');
    if (!ctx) return '';
    var main  = color === 'b' ? '#1a1611' : '#f4efe1';
    var edge  = color === 'b' ? '#000000'  : '#8f8874';
    var shine = color === 'b' ? '#57503f'  : '#ffffff';
    for (var y = 0; y < S; y++) for (var x = 0; x < S; x++) {
      var dx = x - 7.5, dy = y - 7.5;
      var d = Math.sqrt(dx * dx + dy * dy);
      if (d > 7) continue;
      var col = main;
      if (d > 5.8) col = edge;
      else if (dx < -1.5 && dy < -1.5 && d < 5) col = shine;
      ctx.fillStyle = col;
      ctx.fillRect(x, y, 1, 1);
    }
    return cv.toDataURL();
  }
  function spriteFor(color) {
    return sprites[color] ? 'url(' + sprites[color] + ')' : '';
  }
  function reducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* stepped flip: squash to zero, swap sprite halfway, expand */
  function animateFlips(flips, newColor, oldColor) {
    if (!flips || !flips.length || reducedMotion()) return;
    flips.forEach(function (pos) {
      var cell = boardEl.children[pos[0] * N + pos[1]];
      var disc = cell && cell.querySelector('.othello-disc');
      if (!disc) return;
      disc.style.backgroundImage = spriteFor(oldColor);
      void disc.offsetWidth;
      disc.classList.add('othello-disc--flipping');
      setTimeout(function () { disc.style.backgroundImage = spriteFor(newColor); }, 110);
      setTimeout(function () { disc.classList.remove('othello-disc--flipping'); }, 240);
    });
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
      disc.style.backgroundImage = spriteFor(v);
    }
    var n = countDiscs(grid);
    youEl.textContent = human === 'b' ? n.b : n.w;
    aiEl.textContent = ai === 'b' ? n.b : n.w;
    youDiscEl.className = 'mini-disc mini-disc--' + human;
    aiDiscEl.className = 'mini-disc mini-disc--' + ai;
    youDiscEl.style.backgroundImage = spriteFor(human);
    aiDiscEl.style.backgroundImage = spriteFor(ai);
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
    /* the robot's mood this game: 60-92% goof-off moves */
    aiBlunder = 0.60 + Math.random() * 0.32;
    markColorButtons();
    if (turn === human) {
      render(legalMoves(grid, human));
      setStatus('Your move — you play ' + colorName(human) + '.');
    } else {
      render(null);
      aiThinking = true;
      setStatus('Robot opens as ' + colorName(ai) + '…');
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
    var oldColor = other(human);
    applyMove(grid, mv, human);
    lastMove = [r, c];
    advance();
    animateFlips(mv.flips, human, oldColor);
  }

  function advance() {
    var next = other(turn);
    var nextMoves = legalMoves(grid, next);
    if (nextMoves.length) {
      turn = next;
    } else {
      if (!legalMoves(grid, turn).length) { gameOver(); return; }
      setStatus((next === ai ? 'Robot' : 'You') + ' has no moves — pass.');
    }
    if (turn === ai) {
      aiThinking = true;
      render(null);
      setStatus('Robot is thinking…');
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
    var mv = aiChooseMove(grid, legalMoves(grid, ai), ai, Math.random, aiBlunder);
    if (mv) {
      var oldColor = other(ai);
      applyMove(grid, mv, ai);
      lastMove = [mv.r, mv.c];
      aiThinking = false;
      advance();
      animateFlips(mv.flips, ai, oldColor);
    } else {
      aiThinking = false;
      advance();
    }
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
      setStatus('Robot wins ' + an + '–' + hn + who + '. Run it back.');
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
  sprites.b = makeDiscSprite('b');
  sprites.w = makeDiscSprite('w');
  buildBoard();
  renderScores();
  newGame();
})();
