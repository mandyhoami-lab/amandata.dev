/* ambient background: quiet games of othello playing themselves
   at the edges of the page — small, blurred, never over the text.
   green vs gold. placement "blips" are visual pulse rings (no audio). */
(function () {
  "use strict";

  var canvas = document.getElementById("othello-bg");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");

  var N = 8;
  /* piece colors follow the active theme */
  function pieceColors() {
    var t = document.documentElement.dataset.theme || "dark";
    if (t === "pink")  return { a: "#C2255C", b: "#D9A441", ring: "194,37,92" };
    if (t === "blue")  return { a: "#5AA9E6", b: "#D9BE7A", ring: "90,169,230" };
    if (t === "light") return { a: "#2E7B3E", b: "#C2A14E", ring: "46,123,62" };
    return { a: "#1DA05B", b: "#D9BE7A", ring: "29,160,91" };
  }
  var DIRS = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];

  var W = 0, H = 0;
  var boards = [];
  var last = 0;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* board placement: fractions of the viewport, kept at the edges */
  function layoutSpec() {
    if (W < 720) return [{ cx: 0.84, cy: 0.10, s: 0.46, delay: 400 }];
    return [
      { cx: 0.10, cy: 0.20, s: 0.32, delay: 300 },
      { cx: 0.90, cy: 0.80, s: 0.32, delay: 1500 }
    ];
  }

  function resize() {
    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    buildBoards();
  }

  function buildBoards() {
    for (var i = 0; i < boards.length; i++) {
      if (boards[i].timer) clearTimeout(boards[i].timer);
    }
    boards = layoutSpec().map(function (spec) {
      var b = {
        cx: spec.cx, cy: spec.cy, s: spec.s,
        grid: null, turn: 1, anims: [],
        fade: 1, fading: 0, timer: null,
        S: 0, OX: 0, OY: 0
      };
      layoutBoard(b);
      newGame(b);
      if (!reduceMotion) b.timer = setTimeout(function () { step(b); }, spec.delay);
      return b;
    });
  }

  function layoutBoard(b) {
    var m = Math.min(W, H);
    b.S = m * b.s;
    b.OX = W * b.cx - b.S / 2;
    b.OY = H * b.cy - b.S / 2;
  }

  function newGame(b) {
    b.grid = [];
    for (var r = 0; r < N; r++) b.grid.push([0,0,0,0,0,0,0,0]);
    b.grid[3][3] = -1; b.grid[4][4] = -1;
    b.grid[3][4] = 1;  b.grid[4][3] = 1;
    b.turn = 1;
    b.anims = [];
  }

  /* all cells this move would flip */
  function flips(g, r, c, p) {
    if (g[r][c] !== 0) return [];
    var out = [];
    for (var d = 0; d < DIRS.length; d++) {
      var dr = DIRS[d][0], dc = DIRS[d][1];
      var line = [], i = r + dr, j = c + dc;
      while (i >= 0 && i < N && j >= 0 && j < N && g[i][j] === -p) {
        line.push([i, j]); i += dr; j += dc;
      }
      if (line.length && i >= 0 && i < N && j >= 0 && j < N && g[i][j] === p)
        out = out.concat(line);
    }
    return out;
  }

  function legalMoves(g, p) {
    var m = [];
    for (var r = 0; r < N; r++)
      for (var c = 0; c < N; c++)
        if (flips(g, r, c, p).length) m.push([r, c]);
    return m;
  }

  /* greedy with a little noise — plays sensibly, not perfectly */
  function pickMove(b, moves, p) {
    var best = moves[0], bestScore = -1;
    for (var k = 0; k < moves.length; k++) {
      var s = flips(b.grid, moves[k][0], moves[k][1], p).length + Math.random() * 2.5;
      if (s > bestScore) { bestScore = s; best = moves[k]; }
    }
    return best;
  }

  function step(b) {
    var moves = legalMoves(b.grid, b.turn);
    if (!moves.length) {
      b.turn = -b.turn;
      moves = legalMoves(b.grid, b.turn);
      if (!moves.length) { b.fading = -1; return; } // game over: fade out, restart
    }
    var mv = pickMove(b, moves, b.turn);
    var f = flips(b.grid, mv[0], mv[1], b.turn);
    b.grid[mv[0]][mv[1]] = b.turn;
    b.anims.push({ type: "place", r: mv[0], c: mv[1], p: b.turn, t: 0 });
    b.anims.push({ type: "ring", r: mv[0], c: mv[1], t: 0 });
    for (var i = 0; i < f.length; i++) {
      b.grid[f[i][0]][f[i][1]] = b.turn;
      b.anims.push({ type: "flip", r: f[i][0], c: f[i][1], p: b.turn, t: -i * 0.08 });
    }
    b.turn = -b.turn;
    b.timer = setTimeout(function () { step(b); }, 1050);
  }

  function easeOutBack(t) {
    var c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  function cellXY(b, r, c) {
    var cell = b.S / N;
    return [b.OX + c * cell + cell / 2, b.OY + r * cell + cell / 2, cell];
  }

  function roundRectPath(x, y, w, h, rad) {
    ctx.beginPath();
    ctx.moveTo(x + rad, y);
    ctx.arcTo(x + w, y, x + w, y + h, rad);
    ctx.arcTo(x + w, y + h, x, y + h, rad);
    ctx.arcTo(x, y + h, x, y, rad);
    ctx.arcTo(x, y, x + w, y, rad);
    ctx.closePath();
  }

  function drawPiece(x, y, cell, color, sx, sy) {
    var rad = cell * 0.40;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(Math.max(sx, 0.001), Math.max(sy, 0.001));
    ctx.beginPath();
    ctx.arc(0, 0, rad, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.beginPath(); // soft inner highlight
    ctx.arc(-rad * 0.25, -rad * 0.28, rad * 0.55, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.20)";
    ctx.fill();
    ctx.restore();
  }

  function drawBoard(b, lineColor) {
    var pc = pieceColors(), GREEN = pc.a, GOLD = pc.b;
    var cell = b.S / N, i, r, c;
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;
    roundRectPath(b.OX - 8, b.OY - 8, b.S + 16, b.S + 16, 12);
    ctx.stroke();
    ctx.beginPath();
    for (i = 0; i <= N; i++) {
      ctx.moveTo(b.OX + i * cell, b.OY);
      ctx.lineTo(b.OX + i * cell, b.OY + b.S);
      ctx.moveTo(b.OX, b.OY + i * cell);
      ctx.lineTo(b.OX + b.S, b.OY + i * cell);
    }
    ctx.stroke();

    /* advance animations, index by cell */
    var active = {};
    for (var a = 0; a < b.anims.length; a++) {
      var an = b.anims[a];
      an.t += b._dt;
      var key = an.r + "," + an.c;
      (active[key] = active[key] || []).push(an);
    }
    b.anims = b.anims.filter(function (x) {
      if (x.type === "place") return x.t < 0.45;
      if (x.type === "flip") return x.t < 0.40;
      return x.t < 0.8;
    });

    for (r = 0; r < N; r++) {
      for (c = 0; c < N; c++) {
        var v = b.grid[r][c];
        if (!v) continue;
        var xy = cellXY(b, r, c);
        var list = active[r + "," + c];
        var drawn = false;
        var base = v === 1 ? GREEN : GOLD;
        if (list) {
          for (var li = 0; li < list.length; li++) {
            var m = list[li];
            if (m.type === "place" && m.t >= 0) {
              var s = easeOutBack(Math.min(m.t / 0.38, 1));
              drawPiece(xy[0], xy[1], cell, base, s, s);
              drawn = true;
            } else if (m.type === "flip" && m.t >= 0) {
              var ft = Math.min(m.t / 0.32, 1);
              var fx = Math.max(Math.abs(Math.cos(Math.PI * ft)), 0.08);
              var fc = ft < 0.5 ? (m.p === 1 ? GOLD : GREEN) : base;
              drawPiece(xy[0], xy[1], cell, fc, fx, 1);
              drawn = true;
            }
          }
        }
        if (!drawn) drawPiece(xy[0], xy[1], cell, base, 1, 1);
      }
    }

    /* placement blips */
    for (var gi = 0; gi < b.anims.length; gi++) {
      var rg = b.anims[gi];
      if (rg.type !== "ring" || rg.t < 0) continue;
      var rt = Math.min(rg.t / 0.7, 1);
      var rp = cellXY(b, rg.r, rg.c);
      ctx.beginPath();
      ctx.arc(rp[0], rp[1], cell * (0.42 + 0.38 * rt), 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(" + pc.ring + "," + (0.45 * (1 - rt)).toFixed(3) + ")";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  function frame(ts) {
    var dt = Math.min((ts - last) / 1000, 0.1);
    last = ts;
    var _t = document.documentElement.dataset.theme || "dark";
    var dark = _t === "dark" || _t === "blue";
    var lineColor = dark ? "rgba(242,236,220,0.09)" : "rgba(24,28,22,0.10)";

    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < boards.length; i++) {
      var b = boards[i];
      b._dt = dt;
      if (b.fading !== 0) {
        b.fade += b.fading * dt / 1.4;
        if (b.fade <= 0) { b.fade = 0; newGame(b); b.fading = 1; }
        else if (b.fade >= 1) {
          b.fade = 1; b.fading = 0;
          b.timer = setTimeout((function (bb) { return function () { step(bb); }; })(b), 600);
        }
      }
      ctx.globalAlpha = b.fade;
      drawBoard(b, lineColor);
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }

  var resizeTimer = null;
  window.addEventListener("resize", function () {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  });

  resize();

  if (reduceMotion) {
    /* one still frame per board, no game loop */
    var dark0 = document.documentElement.dataset.theme !== "light";
    var lc0 = dark0 ? "rgba(242,236,220,0.09)" : "rgba(24,28,22,0.10)";
    for (var k = 0; k < boards.length; k++) {
      boards[k]._dt = 0;
      drawBoard(boards[k], lc0);
    }
    return;
  }

  last = performance.now();
  requestAnimationFrame(frame);
})();
