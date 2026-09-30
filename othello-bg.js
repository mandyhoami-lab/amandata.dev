/* =========================================================
   amandata.dev — abstract othello backdrop.
   A quiet, graphic othello study behind the page: thin grid
   lines, flat discs (solid vs. ring), a live game cycling
   through think → place → flip. No physical board, no notes —
   the content stays the focus.
   ========================================================= */
(function () {
  'use strict';

  var canvas = document.getElementById('othello-bg');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) { /* fail open */ }

  /* ---------------- palette (per theme) ---------------- */
  var PALETTES = {
    dark:  { grid: 'rgba(237,230,210,0.16)', solid: 'rgba(237,230,210,0.85)',
             ring: 'rgba(150,160,180,0.80)', cand: 'rgba(237,230,210,0.35)' },
    light: { grid: 'rgba(24,28,22,0.14)',   solid: 'rgba(46,123,62,0.80)',
             ring: 'rgba(24,28,22,0.70)',   cand: 'rgba(46,123,62,0.40)' },
    pink:  { grid: 'rgba(122,30,63,0.16)',   solid: 'rgba(194,37,92,0.80)',
             ring: 'rgba(122,30,63,0.70)',   cand: 'rgba(194,37,92,0.40)' },
    blue:  { grid: 'rgba(233,239,247,0.16)', solid: 'rgba(90,169,230,0.85)',
             ring: 'rgba(233,239,247,0.75)', cand: 'rgba(90,169,230,0.45)' }
  };
  function palette() {
    var t = document.documentElement.dataset.theme || 'dark';
    return PALETTES[t] || PALETTES.dark;
  }

  /* ---------------- deterministic PRNG ---------------- */
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------------- othello engine ---------------- */
  var N = 8;
  var DIRS = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  function onBoard(r, c) { return r >= 0 && r < N && c >= 0 && c < N; }
  function other(p) { return p === 'b' ? 'w' : 'b'; }

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
  function aiChoose(moves, rnd) {
    var corners = moves.filter(function (m) {
      return (m.r === 0 || m.r === 7) && (m.c === 0 || m.c === 7);
    });
    if (corners.length && rnd() < 0.92) return corners[0];
    var scored = moves.map(function (m) { return { m: m, s: m.flips.length + rnd() * 2.2 }; });
    scored.sort(function (a, b) { return b.s - a.s; });
    return scored[0].m;
  }

  /* ---------------- board ---------------- */
  function makeBoard(spec, seed) {
    var b = {
      cx: spec.cx, cy: spec.cy, s: spec.s, alpha: spec.alpha, delay: spec.delay || 0,
      OX: 0, OY: 0, S: 0, rnd: mulberry32(seed),
      grid: null, turn: 'b', moves: [], state: 'think', stateT: 0,
      cur: null, flips: [], startedAt: 0, moveCount: 0
    };
    resetGame(b);
    return b;
  }
  function resetGame(b) {
    b.grid = [];
    for (var r = 0; r < N; r++) { b.grid.push([]); for (var c = 0; c < N; c++) b.grid[r].push(null); }
    b.grid[3][3] = 'w'; b.grid[3][4] = 'b'; b.grid[4][3] = 'b'; b.grid[4][4] = 'w';
    b.turn = 'b'; b.moveCount = 0;
    b.moves = legalMoves(b.grid, b.turn);
    b.state = 'think'; b.stateT = 0; b.cur = null; b.flips = [];
  }

  function layoutBoard(b, W, H) {
    var m = Math.min(W, H);
    b.S = m * b.s;
    b.OX = W * b.cx - b.S / 2;
    b.OY = H * b.cy - b.S / 2;
  }

  function stepBoard(b, dt) {
    b.stateT += dt;
    if (b.state === 'think' && b.stateT > 1500) {
      if (!b.moves.length) { // pass or game over
        var om = legalMoves(b.grid, other(b.turn));
        if (!om.length || b.moveCount > 40) { resetGame(b); return; }
        b.turn = other(b.turn); b.moves = om; b.stateT = 0; return;
      }
      b.cur = aiChoose(b.moves, b.rnd);
      b.state = 'place'; b.stateT = 0;
    } else if (b.state === 'place' && b.stateT > 420) {
      applyMove(b.grid, b.cur, b.turn);
      b.flips = b.cur.flips.slice();
      b.state = 'flip'; b.stateT = 0;
    } else if (b.state === 'flip' && b.stateT > 480) {
      b.turn = other(b.turn);
      b.moves = legalMoves(b.grid, b.turn);
      b.moveCount++;
      b.cur = null; b.flips = [];
      b.state = 'think'; b.stateT = 0;
    }
  }

  /* ---------------- abstract drawing ---------------- */
  function cellXY(b, r, c) {
    var cell = b.S / N;
    return [b.OX + (c + 0.5) * cell, b.OY + (r + 0.5) * cell, cell];
  }
  function easeOutBack(t) {
    var c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  function drawAbstractBoard(b, pal, now) {
    var cell = b.S / N;
    ctx.save();
    ctx.globalAlpha = b.alpha;

    /* thin outer border */
    ctx.strokeStyle = pal.grid;
    ctx.lineWidth = Math.max(1, cell * 0.03);
    ctx.strokeRect(b.OX, b.OY, b.S, b.S);

    /* grid lines */
    ctx.strokeStyle = pal.grid;
    ctx.lineWidth = Math.max(1, cell * 0.018);
    ctx.beginPath();
    for (var i = 1; i < N; i++) {
      ctx.moveTo(b.OX + i * cell, b.OY); ctx.lineTo(b.OX + i * cell, b.OY + b.S);
      ctx.moveTo(b.OX, b.OY + i * cell); ctx.lineTo(b.OX + b.S, b.OY + i * cell);
    }
    ctx.stroke();

    /* star points */
    ctx.fillStyle = pal.grid;
    [[1,1],[1,6],[6,1],[6,6]].forEach(function (p) {
      var xy = cellXY(b, p[0], p[1]);
      ctx.beginPath(); ctx.arc(xy[0], xy[1], cell * 0.045, 0, Math.PI * 2); ctx.fill();
    });

    /* candidate rings while thinking */
    if (b.state === 'think' && b.moves.length) {
      ctx.strokeStyle = pal.cand;
      ctx.lineWidth = Math.max(1, cell * 0.025);
      ctx.setLineDash([cell * 0.10, cell * 0.10]);
      b.moves.forEach(function (mv) {
        var xy = cellXY(b, mv.r, mv.c);
        ctx.beginPath(); ctx.arc(xy[0], xy[1], cell * 0.30, 0, Math.PI * 2); ctx.stroke();
      });
      ctx.setLineDash([]);
    }

    /* discs — flat: solid dot vs ring */
    for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) {
      var v = b.grid[r][c];
      if (!v) continue;
      var xy = cellXY(b, r, c), x = xy[0], y = xy[1];
      var sc = 1, sx = 1;
      if (b.cur && b.state === 'place' && b.cur.r === r && b.cur.c === c) {
        sc = 0.3 + 0.7 * easeOutBack(Math.min(b.stateT / 420, 1));
      }
      if (b.state === 'flip') {
        for (var f = 0; f < b.flips.length; f++) {
          if (b.flips[f][0] === r && b.flips[f][1] === c) {
            var fp = Math.min(b.stateT / 480, 1);
            sx = Math.max(Math.abs(Math.cos(fp * Math.PI)), 0.15);
          }
        }
      }
      var rad = cell * 0.34 * sc;
      ctx.save();
      ctx.translate(x, y); ctx.scale(sx, 1);
      ctx.beginPath(); ctx.arc(0, 0, rad, 0, Math.PI * 2);
      if (v === 'b') { ctx.fillStyle = pal.solid; ctx.fill(); }
      else { ctx.strokeStyle = pal.ring; ctx.lineWidth = Math.max(1.2, cell * 0.07); ctx.stroke(); }
      ctx.restore();
    }

    ctx.restore();
  }

  /* ---------------- setup & loop ---------------- */
  var W = 0, H = 0, DPR = 1, boards = [];

  function layoutSpec() {
    if (W < 720) return [{ cx: 0.50, cy: 0.74, s: 0.44, alpha: 0.50, delay: 300 }];
    return [
      { cx: 0.10, cy: 0.80, s: 0.34, alpha: 0.30, delay: 300 },
      { cx: 0.90, cy: 0.28, s: 0.40, alpha: 0.36, delay: 1400 }
    ];
  }

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    var specs = layoutSpec();
    boards = specs.map(function (sp, i) {
      var b = makeBoard(sp, 1234 + i * 777);
      layoutBoard(b, W, H);
      b.startedAt = performance.now() + sp.delay;
      return b;
    });
    if (reduceMotion) boards.forEach(function (b) {
      // settle into a static mid-game position
      for (var k = 0; k < 14; k++) {
        var mv = b.moves.length ? aiChoose(b.moves, b.rnd) : null;
        if (!mv) break;
        applyMove(b.grid, mv, b.turn);
        b.turn = other(b.turn);
        b.moves = legalMoves(b.grid, b.turn);
        if (!b.moves.length) { b.turn = other(b.turn); b.moves = legalMoves(b.grid, b.turn); }
      }
      b.state = 'idle';
    });
  }

  var last = 0, rT = null;
  window.addEventListener('resize', function () {
    clearTimeout(rT);
    rT = setTimeout(resize, 200);
  });

  function frame(now) {
    var dt = Math.min(now - last, 100);
    last = now;
    var pal = palette();
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < boards.length; i++) {
      var b = boards[i];
      if (now < b.startedAt) continue;
      /* fade while scrolling so content stays the focus */
      var fade = 1;
      try { fade = Math.max(0.25, 1 - (window.scrollY || 0) / (H * 0.9)); } catch (e) {}
      var a0 = b.alpha; b.alpha = a0 * fade;
      if (!reduceMotion) stepBoard(b, dt);
      drawAbstractBoard(b, pal, now);
      b.alpha = a0;
    }
    if (!reduceMotion) requestAnimationFrame(frame);
  }

  /* theme changes re-tint automatically via palette() each frame */
  resize();
  last = performance.now();
  if (reduceMotion) {
    var p0 = palette();
    ctx.clearRect(0, 0, W, H);
    boards.forEach(function (b) { drawAbstractBoard(b, p0, 0); });
  } else {
    requestAnimationFrame(frame);
  }
})();
