"use strict";
/* Othello Advanced — study mode.
   Hiyoko Reversi-inspired teaching UI: the engine grades every human
   move the moment it is played, with coordinates, a move list,
   undo/redo, and an evaluation graph. Engine + sprites come from
   othello.js (window.OthelloEngine). */
(function () {
    'use strict';
    /* Page shell — vignette + main, injected so the .html file stays a thin shell.
       Markup is byte-identical to what the .html file used to ship. */
    (function () {
        var mount = document.getElementById("page-mount");
        if (!mount)
            return; /* shell already present (pre-conversion HTML) */
        mount.outerHTML = `<div class="vignette" aria-hidden="true"></div>

<!-- ================= NAV ================= -->

<main>

  <!-- ================= OTHELLO ADVANCED ================= -->
  <section class="section" id="othello-advanced">
    <div class="section__head">
      <h2 class="section__title">Othello</h2>
      <span class="section__tag">advanced · study mode</span>
    </div>
    <div class="section__body">

      <p class="games-note"><a href="/creations.html">&larr; Back to Creations</a> · <a href="/othello.html">Beginner mode</a></p>

      <div class="game-card">
        <h3 class="game-card__title">Advanced</h3>
        <p class="game-card__desc">For players with a few games under their belt. The engine grades every move the moment you play it — good, shaky, or blunder — and the eval graph shows exactly where the game swung.</p>

        <div class="othello-controls">
          <div class="othello-seg" role="group" aria-label="Play as">
            <span class="othello-seg__label">Play as</span>
            <button class="othello-seg__btn" id="adv-color-b" type="button" aria-pressed="true">Black</button>
            <button class="othello-seg__btn" id="adv-color-w" type="button" aria-pressed="false">White</button>
          </div>
        </div>

        <div class="adv-board-wrap">
          <div class="adv-coords adv-coords--top" aria-hidden="true"><span></span><span>a</span><span>b</span><span>c</span><span>d</span><span>e</span><span>f</span><span>g</span><span>h</span></div>
          <div class="adv-board-row">
            <div class="adv-coords adv-coords--side" aria-hidden="true"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span></div>
            <div class="othello-board adv-board" id="adv-board" role="grid" aria-label="Othello board"></div>
          </div>
        </div>

        <div class="othello-hud">
          <span class="adv-move-no" id="adv-moveno">No. 1</span>
          <div class="othello-score" aria-live="polite">
            <span>you</span>
            <span id="adv-you">2</span>
            <span class="othello-sep">&ndash;</span>
            <span id="adv-ai">2</span>
            <span>robot</span>
          </div>
        </div>

        <p class="adv-coach" id="adv-coach" aria-live="polite">Your move.</p>

        <div class="othello-actions">
          <button class="othello-btn" id="adv-new" type="button">New game</button>
          <button class="othello-btn" id="adv-undo" type="button">Undo</button>
          <button class="othello-btn" id="adv-redo" type="button">Redo</button>
          <button class="othello-btn" id="adv-graph-btn" type="button" aria-expanded="false">Eval graph</button>
        </div>

        <div class="othello-panel" id="adv-graph-panel" hidden>
          <h4 class="othello-panel__title">Evaluation</h4>
          <canvas class="adv-graph" id="adv-graph" width="640" height="220" aria-label="Evaluation graph"></canvas>
          <p class="score-note">Engine eval from your perspective after each move. Up = you're ahead, down = the robot is.</p>
        </div>

        <div class="othello-panel">
          <h4 class="othello-panel__title">Moves</h4>
          <ol class="adv-moves" id="adv-moves" aria-live="polite"></ol>
        </div>

        <p class="adv-credit">Study interface inspired by <strong>Hiyoko Reversi</strong> (ひよこリバーシ) — its post-game analysis and eval graph taught me what a teaching UI should do.</p>
      </div>

    </div>
  </section>

</main>`;
    })();
    var E = window.OthelloEngine;
    if (!E)
        return;
    var boardEl = document.getElementById('adv-board');
    if (!boardEl)
        return;
    var coachEl = document.getElementById('adv-coach');
    var youEl = document.getElementById('adv-you');
    var aiEl = document.getElementById('adv-ai');
    var movenoEl = document.getElementById('adv-moveno');
    var movesEl = document.getElementById('adv-moves');
    var graphPanel = document.getElementById('adv-graph-panel');
    var graphBtn = document.getElementById('adv-graph-btn');
    var graphCanvas = document.getElementById('adv-graph');
    var undoBtn = document.getElementById('adv-undo');
    var redoBtn = document.getElementById('adv-redo');
    var newBtn = document.getElementById('adv-new');
    var colorB = document.getElementById('adv-color-b');
    var colorW = document.getElementById('adv-color-w');
    var COLOR_KEY = 'amandata-othello-adv-color';
    var GRADE_DEPTH = 3; /* how hard the coach looks at your move */
    var ROBOT_DEPTH = 3; /* full-strength opponent, no goofing off */
    var GRAPH_DEPTH = 2; /* eval sampling for the graph */
    var grid, turn, human = 'b', ai = 'w';
    var gameLive = true, aiThinking = false, lastMove = null, gameId = 0;
    var moves = []; /* {by:'you'|'robot', name:'d3', tag, tagCls} */
    var evals = []; /* engine eval from your perspective after each ply */
    var history = []; /* snapshots for undo/redo */
    var histIdx = -1;
    var stickyVerdict = null; /* last coaching verdict, kept until your next move */
    var stickyCls = null;
    function cloneGrid(g) { return g.map(function (row) { return row.slice(); }); }
    function reducedMotion() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    /* cells that changed color between two grids (not the newly placed disc) */
    function flippedCells(before, after) {
        var out = [];
        for (var r = 0; r < 8; r++)
            for (var c = 0; c < 8; c++) {
                var a = before[r][c], b = after[r][c];
                if ((a === 'b' || a === 'w') && (b === 'b' || b === 'w') && a !== b) {
                    out.push({ r: r, c: c, old: a, nw: b });
                }
            }
        return out;
    }
    /* stepped flip: set old sprite, squash, swap sprite halfway, expand —
       same feel as the beginner board */
    function animateFlips(list) {
        if (!list || !list.length || reducedMotion())
            return;
        list.forEach(function (fc) {
            var cell = cells[fc.r * 8 + fc.c];
            var disc = cell && cell.querySelector('.othello-disc');
            if (!disc)
                return;
            disc.style.backgroundImage = 'url(' + E.discSprite(fc.old) + ')';
            void disc.offsetWidth;
            disc.classList.add('othello-disc--flipping');
            setTimeout(function () { disc.style.backgroundImage = 'url(' + E.discSprite(fc.nw) + ')'; }, 110);
            setTimeout(function () { disc.classList.remove('othello-disc--flipping'); }, 240);
        });
    }
    function loadColor() {
        try {
            var c = localStorage.getItem(COLOR_KEY);
            if (c === 'w' || c === 'b')
                return c;
        }
        catch (e) { }
        return 'b';
    }
    function saveColor(c) {
        try {
            localStorage.setItem(COLOR_KEY, c);
        }
        catch (e) { }
    }
    function colorName(c) { return c === 'b' ? 'black' : 'white'; }
    function setCoach(t, cls) {
        coachEl.textContent = t;
        coachEl.className = 'adv-coach' + (cls ? ' adv-coach--' + cls : '');
    }
    /* ---------- history ---------- */
    function copyMoves(ms) {
        return ms.map(function (m) {
            return { by: m.by, name: m.name, tag: m.tag || null, tagCls: m.tagCls || null };
        });
    }
    function pushHist() {
        history.length = histIdx + 1;
        history.push({
            g: cloneGrid(grid), t: turn,
            lm: lastMove ? lastMove.slice() : null,
            mv: copyMoves(moves), ev: evals.slice()
        });
        histIdx = history.length - 1;
        syncHistButtons();
    }
    function restore(i) {
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
        if (turn === ai)
            robotTurn();
    }
    function syncHistButtons() {
        undoBtn.disabled = histIdx <= 0 || aiThinking;
        redoBtn.disabled = histIdx >= history.length - 1 || aiThinking;
    }
    /* ---------- board ---------- */
    var cells = [];
    function buildBoard() {
        boardEl.innerHTML = '';
        cells = [];
        for (var r = 0; r < 8; r++) {
            for (var c = 0; c < 8; c++) {
                (function (rr, cc) {
                    var b = document.createElement('button');
                    b.type = 'button';
                    b.className = 'othello-cell';
                    b.setAttribute('role', 'gridcell');
                    b.addEventListener('click', function () { onCell(rr, cc); });
                    boardEl.appendChild(b);
                    cells.push(b);
                })(r, c);
            }
        }
    }
    function render(humanMoves) {
        var hintSet = {};
        if (humanMoves)
            humanMoves.forEach(function (m) { hintSet[m.r * 8 + m.c] = true; });
        for (var r = 0; r < 8; r++) {
            for (var c = 0; c < 8; c++) {
                var cell = cells[r * 8 + c];
                var v = grid[r][c];
                var nm = E.moveName({ r: r, c: c, flips: [] });
                cell.classList.toggle('othello-cell--hint', !!hintSet[r * 8 + c]);
                cell.classList.toggle('adv-cell--last', !!lastMove && lastMove[0] === r && lastMove[1] === c);
                var old = cell.querySelector('.othello-disc');
                if (old)
                    cell.removeChild(old);
                if (v === 'b' || v === 'w') {
                    var d = document.createElement('div');
                    d.className = 'othello-disc';
                    d.style.backgroundImage = 'url(' + E.discSprite(v) + ')';
                    cell.appendChild(d);
                    cell.setAttribute('aria-label', nm + ', ' + colorName(v) + ' disc');
                }
                else {
                    cell.setAttribute('aria-label', hintSet[r * 8 + c] ? nm + ', legal move' : nm + ', empty');
                }
            }
        }
    }
    function updateHud() {
        var n = E.countDiscs(grid);
        youEl.textContent = String(human === 'b' ? n.b : n.w);
        aiEl.textContent = String(ai === 'b' ? n.b : n.w);
        movenoEl.textContent = 'No. ' + (moves.length + 1);
    }
    /* ---------- move list ---------- */
    function renderMoves() {
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
    function moveSpan(m) {
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
    function verdictFor(gr, mv) {
        var nm = E.moveName(mv);
        if (gr.playedBest || gr.diff < 1)
            return { text: nm + ' — best move!', tag: 'best', cls: 'best' };
        if (gr.diff < 25)
            return { text: nm + ' — good move.', tag: 'good', cls: 'good' };
        if (gr.diff < 70)
            return { text: nm + ' — okay, but ' + E.moveName(gr.best) + ' was a little stronger.', tag: 'ok', cls: 'ok' };
        if (gr.diff < 150)
            return { text: nm + ' — risky, ' + E.moveName(gr.best) + ' was stronger.', tag: 'risky', cls: 'risky' };
        return { text: nm + ' — blunder, ' + E.moveName(gr.best) + ' was much stronger.', tag: 'blunder', cls: 'blunder' };
    }
    function gradeHumanMove(gridBefore, mv, id) {
        /* async so the board updates first */
        setTimeout(function () {
            if (id !== gameId || !gameLive)
                return;
            var gr = E.gradeMove(gridBefore, mv, human, GRADE_DEPTH);
            if (!gr || id !== gameId)
                return;
            var v = verdictFor(gr, mv);
            for (var i = moves.length - 1; i >= 0; i--) {
                if (moves[i].by === 'you' && moves[i].name === E.moveName(mv) && !moves[i].tag) {
                    moves[i].tag = v.tag;
                    moves[i].tagCls = v.cls;
                    break;
                }
            }
            renderMoves();
            stickyVerdict = v.text;
            stickyCls = v.cls;
            setCoach(v.text, v.cls);
        }, 30);
    }
    function pushEval() {
        try {
            var s = E.searchMove(grid, human, GRAPH_DEPTH).score;
            evals.push(Math.max(-800, Math.min(800, s)));
        }
        catch (e) {
            evals.push(0);
        }
    }
    /* ---------- eval graph ---------- */
    function drawGraph() {
        var ctx = graphCanvas.getContext('2d');
        if (!ctx)
            return;
        var W = graphCanvas.width, H = graphCanvas.height;
        ctx.clearRect(0, 0, W, H);
        var dark = document.documentElement.dataset.theme !== 'light';
        ctx.strokeStyle = dark ? '#3a4436' : '#c9d4c2';
        ctx.lineWidth = 1;
        /* zero line */
        ctx.beginPath();
        ctx.moveTo(0, H / 2);
        ctx.lineTo(W, H / 2);
        ctx.stroke();
        /* move gridlines every 10 */
        ctx.strokeStyle = dark ? '#2c352a' : '#dde5d8';
        for (var m = 10; m < 60; m += 10) {
            var x = (m / 60) * W;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, H);
            ctx.stroke();
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
            if (i === 0)
                ctx.moveTo(px, py);
            else
                ctx.lineTo(px, py);
        }
        ctx.stroke();
        /* endpoint dot */
        var li = evals.length - 1;
        ctx.fillStyle = '#7fc97f';
        ctx.fillRect((Math.min(li, 60) / 60) * W - 3, H / 2 - (evals[li] / 800) * (H / 2 - 8) - 3, 6, 6);
    }
    /* ---------- game flow ---------- */
    function markColorButtons() {
        colorB.classList.toggle('othello-seg--active', human === 'b');
        colorW.classList.toggle('othello-seg--active', human === 'w');
        colorB.setAttribute('aria-pressed', human === 'b' ? 'true' : 'false');
        colorW.setAttribute('aria-pressed', human === 'w' ? 'true' : 'false');
    }
    function newGame() {
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
        }
        else {
            robotTurn();
        }
    }
    function onCell(r, c) {
        if (!gameLive || aiThinking || turn !== human)
            return;
        var ms = E.legalMoves(grid, human);
        var mv = null;
        for (var i = 0; i < ms.length; i++) {
            if (ms[i].r === r && ms[i].c === c) {
                mv = ms[i];
                break;
            }
        }
        if (!mv)
            return;
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
    function advance() {
        render(null);
        updateHud();
        var next = E.other(turn);
        var passed = false;
        if (E.legalMoves(grid, next).length) {
            turn = next;
        }
        else if (!E.legalMoves(grid, turn).length) {
            gameOver();
            return;
        }
        else {
            passed = true;
            setCoach((next === ai ? 'Robot' : 'You') + ' has no moves — pass.', null);
        }
        if (turn === ai) {
            robotTurn();
        }
        else {
            aiThinking = false;
            syncHistButtons();
            if (!passed)
                setCoach(stickyVerdict || 'Your move.', stickyVerdict ? stickyCls : null);
            render(E.legalMoves(grid, human));
        }
    }
    function robotTurn() {
        aiThinking = true;
        syncHistButtons();
        render(null);
        setCoach('Robot is thinking…');
        var id = gameId;
        setTimeout(function () {
            if (id !== gameId || !gameLive)
                return;
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
    function gameOver() {
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
        if (hn > an)
            setCoach('You win ' + hn + '–' + an + '! Check the graph for the turning point.', 'best');
        else if (an > hn)
            setCoach('Robot wins ' + an + '–' + hn + '. The graph shows where it slipped away.', 'risky');
        else
            setCoach('Draw, ' + hn + '–' + an + '.', 'good');
    }
    /* ---------- wiring ---------- */
    newBtn.addEventListener('click', newGame);
    undoBtn.addEventListener('click', function () {
        if (aiThinking || histIdx <= 0)
            return;
        restore(histIdx - 1);
    });
    redoBtn.addEventListener('click', function () {
        if (aiThinking || histIdx >= history.length - 1)
            return;
        restore(histIdx + 1);
    });
    graphBtn.addEventListener('click', function () {
        var open = graphPanel.hasAttribute('hidden');
        graphPanel.toggleAttribute('hidden');
        graphBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open)
            drawGraph();
    });
    colorB.addEventListener('click', function () {
        if (human === 'b') {
            newGame();
            return;
        }
        human = 'b';
        ai = 'w';
        saveColor('b');
        newGame();
    });
    colorW.addEventListener('click', function () {
        if (human === 'w') {
            newGame();
            return;
        }
        human = 'w';
        ai = 'b';
        saveColor('w');
        newGame();
    });
    human = loadColor();
    ai = E.other(human);
    buildBoard();
    newGame();
    /* redraw the graph in the new palette when the theme cycles */
    var themeBtn = document.getElementById('theme-toggle');
    if (themeBtn)
        themeBtn.addEventListener('click', function () {
            setTimeout(drawGraph, 60);
        });
})();
