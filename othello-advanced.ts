/* Othello Advanced — study mode.
   Hiyoko Reversi-inspired teaching UI: the engine grades every human
   move the moment it is played, with coordinates, a move list,
   undo/redo, and an evaluation graph. Engine + sprites come from
   othello.js (window.OthelloEngine). */
(function () {
  'use strict';
  var E = window.OthelloEngine;
  if (!E) return;

  var boardEl = document.getElementById('adv-board') as HTMLElement | null;
  if (!boardEl) return;
  var coachEl = document.getElementById('adv-coach') as HTMLElement;
  var youEl = document.getElementById('adv-you') as HTMLElement;
  var aiEl = document.getElementById('adv-ai') as HTMLElement;
  var movenoEl = document.getElementById('adv-moveno') as HTMLElement;
  var movesEl = document.getElementById('adv-moves') as HTMLElement;
  var graphPanel = document.getElementById('adv-graph-panel') as HTMLElement;
  var graphBtn = document.getElementById('adv-graph-btn') as HTMLElement;
  var graphCanvas = document.getElementById('adv-graph') as HTMLCanvasElement;
  var undoBtn = document.getElementById('adv-undo') as HTMLButtonElement;
  var redoBtn = document.getElementById('adv-redo') as HTMLButtonElement;
  var newBtn = document.getElementById('adv-new') as HTMLElement;
  var colorB = document.getElementById('adv-color-b') as HTMLElement;
  var colorW = document.getElementById('adv-color-w') as HTMLElement;

  var COLOR_KEY = 'amandata-othello-adv-color';
  var GRADE_DEPTH = 3;   /* how hard the coach looks at your move */
  var ROBOT_DEPTH = 3;   /* full-strength opponent, no goofing off */
  var GRAPH_DEPTH = 2;   /* eval sampling for the graph */

  interface AdvMove { by: string; name: string; tag?: string | null; tagCls?: string | null; }
  interface FlipCell { r: number; c: number; old: OthelloPlayer; nw: OthelloPlayer; }
  interface HistEntry {
    g: OthelloGrid; t: OthelloPlayer; lm: number[] | null; mv: AdvMove[]; ev: number[];
  }

  var grid: OthelloGrid, turn: OthelloPlayer, human: OthelloPlayer = 'b', ai: OthelloPlayer = 'w';
  var gameLive = true, aiThinking = false, lastMove: number[] | null = null, gameId = 0;
  var moves: AdvMove[] = [];        /* {by:'you'|'robot', name:'d3', tag, tagCls} */
  var evals: number[] = [];        /* engine eval from your perspective after each ply */
  var history: HistEntry[] = [];      /* snapshots for undo/redo */
  var histIdx = -1;
  var stickyVerdict: string | null = null;  /* last coaching verdict, kept until your next move */
  var stickyCls: string | null = null;

  function cloneGrid(g: OthelloGrid): OthelloGrid { return g.map(function (row) { return row.slice(); }); }
  function reducedMotion(): boolean {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  /* cells that changed color between two grids (not the newly placed disc) */
  function flippedCells(before: OthelloGrid, after: OthelloGrid): FlipCell[] {
    var out: FlipCell[] = [];
    for (var r = 0; r < 8; r++) for (var c = 0; c < 8; c++) {
      var a = before[r][c], b = after[r][c];
      if ((a === 'b' || a === 'w') && (b === 'b' || b === 'w') && a !== b) {
        out.push({ r: r, c: c, old: a, nw: b });
      }
    }
    return out;
  }
  /* stepped flip: set old sprite, squash, swap sprite halfway, expand —
     same feel as the beginner board */
  function animateFlips(list: FlipCell[]): void {
    if (!list || !list.length || reducedMotion()) return;
    list.forEach(function (fc) {
      var cell = cells[fc.r * 8 + fc.c];
      var disc = cell && cell.querySelector('.othello-disc') as HTMLElement | null;
      if (!disc) return;
      disc.style.backgroundImage = 'url(' + E.discSprite(fc.old) + ')';
      void disc.offsetWidth;
      disc.classList.add('othello-disc--flipping');
      setTimeout(function () { disc!.style.backgroundImage = 'url(' + E.discSprite(fc.nw) + ')'; }, 110);
      setTimeout(function () { disc!.classList.remove('othello-disc--flipping'); }, 240);
    });
  }
  function loadColor(): OthelloPlayer {
    try {
      var c = localStorage.getItem(COLOR_KEY);
      if (c === 'w' || c === 'b') return c;
    } catch (e) {}
    return 'b';
  }
  function saveColor(c: OthelloPlayer): void {
    try { localStorage.setItem(COLOR_KEY, c); } catch (e) {}
  }
  function colorName(c: OthelloPlayer): string { return c === 'b' ? 'black' : 'white'; }
  function setCoach(t: string, cls?: string | null): void {
    coachEl.textContent = t;
    coachEl.className = 'adv-coach' + (cls ? ' adv-coach--' + cls : '');
  }

  /* ---------- history ---------- */
  function copyMoves(ms: AdvMove[]): AdvMove[] {
    return ms.map(function (m) {
      return { by: m.by, name: m.name, tag: m.tag || null, tagCls: m.tagCls || null };
    });
  }
  function pushHist(): void {
    history.length = histIdx + 1;
    history.push({
      g: cloneGrid(grid), t: turn,
      lm: lastMove ? lastMove.slice() : null,
      mv: copyMoves(moves), ev: evals.slice()
    });
    histIdx = history.length - 1;
    syncHistButtons();
  }
  function restore(i: number): void {
    var h = history[i];
    grid = cloneGrid(h.g);
    turn = h.t;
    lastMove = h.lm ? h.lm.slice() : null;
    moves = copyMoves(h.mv);
    evals = h.ev.slice();
    histIdx = i;
    gameLive = true;
    aiThinking = false;
    stickyVerdict = null;
    stickyCls = null;
    gameId++;
    render(null);
    if (turn === human && E.legalMoves(grid, human).length) {
      render(E.legalMoves(grid, human));
    }
    renderMoves();
    updateHud();
    drawGraph();
    syncHistButtons();
    setCoach(turn === human ? 'Your move.' : 'Robot to move.', null);
    if (turn === ai) robotTurn();
  }
  function syncHistButtons(): void {
    undoBtn.disabled = histIdx <= 0 || aiThinking;
    redoBtn.disabled = histIdx >= history.length - 1 || aiThinking;
  }

  /* ---------- board ---------- */
  var cells: HTMLElement[] = [];
  function buildBoard(): void {
    boardEl!.innerHTML = '';
    cells = [];
    for (var r = 0; r < 8; r++) {
      for (var c = 0; c < 8; c++) {
        (function (rr: number, cc: number) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'othello-cell';
          b.setAttribute('role', 'gridcell');
          b.addEventListener('click', function () { onCell(rr, cc); });
          boardEl!.appendChild(b);
          cells.push(b);
        })(r, c);
      }
    }
  }
  function render(humanMoves: OthelloMove[] | null): void {
    var hintSet: { [k: number]: boolean } = {};
    if (humanMoves) humanMoves.forEach(function (m) { hintSet[m.r * 8 + m.c] = true; });
    for (var r = 0; r < 8; r++) {
      for (var c = 0; c < 8; c++) {
        var cell = cells[r * 8 + c];
        var v = grid[r][c];
        var nm = E.moveName({ r: r, c: c, flips: [] });
        cell.classList.toggle('othello-cell--hint', !!hintSet[r * 8 + c]);
        cell.classList.toggle('adv-cell--last', !!lastMove && lastMove[0] === r && lastMove[1] === c);
        var old = cell.querySelector('.othello-disc');
        if (old) cell.removeChild(old);
        if (v === 'b' || v === 'w') {
          var d = document.createElement('div');
          d.className = 'othello-disc';
          d.style.backgroundImage = 'url(' + E.discSprite(v) + ')';
          cell.appendChild(d);
          cell.setAttribute('aria-label', nm + ', ' + colorName(v) + ' disc');
        } else {
          cell.setAttribute('aria-label', hintSet[r * 8 + c] ? nm + ', legal move' : nm + ', empty');
        }
      }
    }
  }
  function updateHud(): void {
    var n = E.countDiscs(grid);
    youEl.textContent = String(human === 'b' ? n.b : n.w);
    aiEl.textContent = String(ai === 'b' ? n.b : n.w);
    movenoEl.textContent = 'No. ' + (moves.length + 1);
  }

  /* ---------- move list ---------- */
  function renderMoves(): void {
    movesEl.innerHTML = '';
    for (var i = 0; i < moves.length; i += 2) {
      var li = document.createElement('li');
      var no = document.createElement('span');
      no.className = 'adv-moves__no';
      no.textContent = (i / 2 + 1) + '.';
      li.appendChild(no);
      li.appendChild(moveSpan(moves[i]));
      if (moves[i + 1]) {
        var sep = document.createElement('span');
        sep.className = 'adv-moves__sep';
        sep.textContent = '·';
        li.appendChild(sep);
        li.appendChild(moveSpan(moves[i + 1]));
      }
      movesEl.appendChild(li);
    }
    movesEl.scrollTop = movesEl.scrollHeight;
  }
  function moveSpan(m: AdvMove): HTMLElement {
    var s = document.createElement('span');
    s.className = 'adv-moves__mv adv-moves__mv--' + m.by;
    s.textContent = (m.by === 'you' ? 'you ' : 'robot ') + m.name;
    if (m.tag) {
      var tag = document.createElement('span');
      tag.className = 'adv-tag adv-tag--' + m.tagCls;
      tag.textContent = m.tag;
      s.appendChild(document.createTextNode(' '));
      s.appendChild(tag);
    }
    return s;
  }

  /* ---------- coaching ---------- */
  function verdictFor(gr: { best: OthelloMove; diff: number; playedBest: boolean }, mv: OthelloMove): { text: string; tag: string; cls: string } {
    var nm = E.moveName(mv);
    if (gr.playedBest || gr.diff < 1) return { text: nm + ' — best move!', tag: 'best', cls: 'best' };
    if (gr.diff < 25) return { text: nm + ' — good move.', tag: 'good', cls: 'good' };
    if (gr.diff < 70) return { text: nm + ' — okay, but ' + E.moveName(gr.best) + ' was a little stronger.', tag: 'ok', cls: 'ok' };
    if (gr.diff < 150) return { text: nm + ' — risky, ' + E.moveName(gr.best) + ' was stronger.', tag: 'risky', cls: 'risky' };
    return { text: nm + ' — blunder, ' + E.moveName(gr.best) + ' was much stronger.', tag: 'blunder', cls: 'blunder' };
  }
  function gradeHumanMove(gridBefore: OthelloGrid, mv: OthelloMove, id: number): void {
    /* async so the board updates first */
    setTimeout(function () {
      if (id !== gameId || !gameLive) return;
      var gr = E.gradeMove(gridBefore, mv, human, GRADE_DEPTH);
      if (!gr || id !== gameId) return;
      var v = verdictFor(gr, mv);
      for (var i = moves.length - 1; i >= 0; i--) {
        if (moves[i].by === 'you' && moves[i].name === E.moveName(mv) && !moves[i].tag) {
          moves[i].tag = v.tag; moves[i].tagCls = v.cls; break;
        }
      }
      renderMoves();
      stickyVerdict = v.text;
      stickyCls = v.cls;
      setCoach(v.text, v.cls);
    }, 30);
  }
  function pushEval(): void {
    try {
      var s = E.searchMove(grid, human, GRAPH_DEPTH).score;
      evals.push(Math.max(-800, Math.min(800, s)));
    } catch (e) { evals.push(0); }
  }

  /* ---------- eval graph ---------- */
  function drawGraph(): void {
    var ctx = graphCanvas.getContext('2d');
    if (!ctx) return;
    var W = graphCanvas.width, H = graphCanvas.height;
    ctx.clearRect(0, 0, W, H);
    var dark = document.documentElement.dataset.theme !== 'light';
    ctx.strokeStyle = dark ? '#3a4436' : '#c9d4c2';
    ctx.lineWidth = 1;
    /* zero line */
    ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke();
    /* move gridlines every 10 */
    ctx.strokeStyle = dark ? '#2c352a' : '#dde5d8';
    for (var m = 10; m < 60; m += 10) {
      var x = (m / 60) * W;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    if (evals.length < 2) {
      ctx.fillStyle = dark ? '#8a937f' : '#6b7263';
      ctx.font = '20px sans-serif';
      ctx.fillText('play a few moves…', 16, H / 2 - 12);
      return;
    }
    ctx.strokeStyle = '#7fc97f';
    ctx.lineWidth = 3;
    ctx.lineJoin = 'miter';
    ctx.beginPath();
    for (var i = 0; i < evals.length; i++) {
      var px = (Math.min(i, 60) / 60) * W;
      var py = H / 2 - (evals[i] / 800) * (H / 2 - 8);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    /* endpoint dot */
    var li = evals.length - 1;
    ctx.fillStyle = '#7fc97f';
    ctx.fillRect((Math.min(li, 60) / 60) * W - 3, H / 2 - (evals[li] / 800) * (H / 2 - 8) - 3, 6, 6);
  }

  /* ---------- game flow ---------- */
  function markColorButtons(): void {
    colorB.classList.toggle('othello-seg--active', human === 'b');
    colorW.classList.toggle('othello-seg--active', human === 'w');
    colorB.setAttribute('aria-pressed', human === 'b' ? 'true' : 'false');
    colorW.setAttribute('aria-pressed', human === 'w' ? 'true' : 'false');
  }
  function newGame(): void {
    gameId++;
    grid = E.newGrid();
    turn = 'b';
    gameLive = true;
    aiThinking = false;
    lastMove = null;
    moves = [];
    evals = [];
    history = [];
    histIdx = -1;
    stickyVerdict = null;
    stickyCls = null;
    markColorButtons();
    pushHist();
    render(null);
    renderMoves();
    updateHud();
    drawGraph();
    if (turn === human) {
      render(E.legalMoves(grid, human));
      setCoach('Your move — you play ' + colorName(human) + '.');
    } else {
      robotTurn();
    }
  }
  function onCell(r: number, c: number): void {
    if (!gameLive || aiThinking || turn !== human) return;
    var ms = E.legalMoves(grid, human);
    var mv: OthelloMove | null = null;
    for (var i = 0; i < ms.length; i++) {
      if (ms[i].r === r && ms[i].c === c) { mv = ms[i]; break; }
    }
    if (!mv) return;
    var gridBefore = cloneGrid(grid);
    var id = gameId;
    pushHist();
    stickyVerdict = null;
    stickyCls = null;
    E.applyMove(grid, mv, human);
    lastMove = [r, c];
    moves.push({ by: 'you', name: E.moveName(mv) });
    pushEval();
    renderMoves();
    updateHud();
    setCoach('Played ' + E.moveName(mv) + ' — checking…');
    gradeHumanMove(gridBefore, mv, id);
    var flips = flippedCells(gridBefore, grid);
    advance();
    animateFlips(flips);
  }
  function advance(): void {
    render(null);
    updateHud();
    var next = E.other(turn);
    var passed = false;
    if (E.legalMoves(grid, next).length) {
      turn = next;
    } else if (!E.legalMoves(grid, turn).length) {
      gameOver();
      return;
    } else {
      passed = true;
      setCoach((next === ai ? 'Robot' : 'You') + ' has no moves — pass.', null);
    }
    if (turn === ai) {
      robotTurn();
    } else {
      aiThinking = false;
      syncHistButtons();
      if (!passed) setCoach(stickyVerdict || 'Your move.', stickyVerdict ? stickyCls : null);
      render(E.legalMoves(grid, human));
    }
  }
  function robotTurn(): void {
    aiThinking = true;
    syncHistButtons();
    render(null);
    setCoach('Robot is thinking…');
    var id = gameId;
    setTimeout(function () {
      if (id !== gameId || !gameLive) return;
      pushHist();
      var gridBefore = cloneGrid(grid);
      var r = E.searchMove(grid, ai, ROBOT_DEPTH);
      if (r.mv) {
        E.applyMove(grid, r.mv, ai);
        lastMove = [r.mv.r, r.mv.c];
        moves.push({ by: 'robot', name: E.moveName(r.mv) });
        pushEval();
      }
      aiThinking = false;
      renderMoves();
      var flips = flippedCells(gridBefore, grid);
      advance();
      animateFlips(flips);
    }, 450);
  }
  function gameOver(): void {
    gameLive = false;
    aiThinking = false;
    render(null);
    updateHud();
    drawGraph();
    syncHistButtons();
    var n = E.countDiscs(grid);
    var hn = human === 'b' ? n.b : n.w;
    var an = ai === 'b' ? n.b : n.w;
    graphPanel.removeAttribute('hidden');
    graphBtn.setAttribute('aria-expanded', 'true');
    if (hn > an) setCoach('You win ' + hn + '–' + an + '! Check the graph for the turning point.', 'best');
    else if (an > hn) setCoach('Robot wins ' + an + '–' + hn + '. The graph shows where it slipped away.', 'risky');
    else setCoach('Draw, ' + hn + '–' + an + '.', 'good');
  }

  /* ---------- wiring ---------- */
  newBtn.addEventListener('click', newGame);
  undoBtn.addEventListener('click', function () {
    if (aiThinking || histIdx <= 0) return;
    restore(histIdx - 1);
  });
  redoBtn.addEventListener('click', function () {
    if (aiThinking || histIdx >= history.length - 1) return;
    restore(histIdx + 1);
  });
  graphBtn.addEventListener('click', function () {
    var open = graphPanel.hasAttribute('hidden');
    graphPanel.toggleAttribute('hidden');
    graphBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) drawGraph();
  });
  colorB.addEventListener('click', function () {
    if (human === 'b') { newGame(); return; }
    human = 'b'; ai = 'w'; saveColor('b'); newGame();
  });
  colorW.addEventListener('click', function () {
    if (human === 'w') { newGame(); return; }
    human = 'w'; ai = 'b'; saveColor('w'); newGame();
  });

  human = loadColor();
  ai = E.other(human);
  buildBoard();
  newGame();

  /* redraw the graph in the new palette when the theme cycles */
  var themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    setTimeout(drawGraph, 60);
  });
})();
