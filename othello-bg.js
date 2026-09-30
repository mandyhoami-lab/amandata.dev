/* ambient background: a quiet game of othello playing itself.
   green vs gold, low and slow — a backdrop, never the focus.
   placement "blips" are visual pulse rings (no audio). */
(function () {
  "use strict";

  var canvas = document.getElementById("othello-bg");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");

  var N = 8;
  var GREEN = "#1DA05B";
  var GOLD = "#D9BE7A";
  var INK_LINE = "rgba(24,28,22,0.10)";

  var board, turn, anims;
  var W = 0, H = 0, S = 0, OX = 0, OY = 0;
  var fade = 1, fading = 0, timer = null, last = 0;

  var DIRS = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];

  function resize() {
    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    S = Math.min(W, H) * 0.88;
    OX = (W - S) / 2;
    OY = (H - S) / 2;
  }

  function newGame() {
    board = [];
    for (var r = 0; r < N; r++) board.push([0,0,0,0,0,0,0,0]);
    board[3][3] = -1; board[4][4] = -1;
    board[3][4] = 1;  board[4][3] = 1;
    turn = 1;
    anims = [];
  }

  /* all cells this move would flip */
  function flips(b, r, c, p) {
    if (b[r][c] !== 0) return [];
    var out = [];
    for (var d = 0; d < DIRS.length; d++) {
      var dr = DIRS[d][0], dc = DIRS[d][1];
      var line = [], i = r + dr, j = c + dc;
      while (i >= 0 && i < N && j >= 0 && j < N && b[i][j] === -p) {
        line.push([i, j]); i += dr; j += dc;
      }
      if (line.length && i >= 0 && i < N && j >= 0 && j < N && b[i][j] === p)
        out = out.concat(line);
    }
    return out;
  }

  function legalMoves(b, p) {
    var m = [];
    for (var r = 0; r < N; r++)
      for (var c = 0; c < N; c++)
        if (flips(b, r, c, p).length) m.push([r, c]);
    return m;
  }

  /* greedy with a little noise — plays sensibly, not perfectly */
  function pickMove(moves, p) {
    var best = moves[0], bestScore = -1;
    for (var k = 0; k < moves.length; k++) {
      var s = flips(board, moves[k][0], moves[k][1], p).length + Math.random() * 2.5;
      if (s > bestScore) { bestScore = s; best = moves[k]; }
    }
    return best;
  }

  function step() {
    var moves = legalMoves(board, turn);
    if (!moves.length) {
      turn = -turn;
      moves = legalMoves(board, turn);
      if (!moves.length) { fading = -1; return; } // game over: fade out, restart
    }
    var mv = pickMove(moves, turn);
    var f = flips(board, mv[0], mv[1], turn);
    board[mv[0]][mv[1]] = turn;
    anims.push({ type: "place", r: mv[0], c: mv[1], p: turn, t: 0 });
    anims.push({ type: "ring", r: mv[0], c: mv[1], t: 0 });
    for (var i = 0; i < f.length; i++) {
      board[f[i][0]][f[i][1]] = turn;
      anims.push({ type: "flip", r: f[i][0], c: f[i][1], p: turn, t: -i * 0.08 });
    }
    turn = -turn;
    timer = setTimeout(step, 1050);
  }

  function easeOutBack(t) {
    var c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  function cellXY(r, c) {
    var cell = S / N;
    return [OX + c * cell + cell / 2, OY + r * cell + cell / 2, cell];
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

  function drawBoard() {
    var cell = S / N, i, r, c;
    ctx.strokeStyle = INK_LINE;
    ctx.lineWidth = 1;
    roundRectPath(OX - 10, OY - 10, S + 20, S + 20, 14);
    ctx.stroke();
    ctx.beginPath();
    for (i = 0; i <= N; i++) {
      ctx.moveTo(OX + i * cell, OY);
      ctx.lineTo(OX + i * cell, OY + S);
      ctx.moveTo(OX, OY + i * cell);
      ctx.lineTo(OX + S, OY + i * cell);
    }
    ctx.stroke();
    for (r = 0; r < N; r++) for (c = 0; c < N; c++) {
      if (!board[r][c]) continue;
      var xy = cellXY(r, c);
      drawPiece(xy[0], xy[1], cell, board[r][c] === 1 ? GREEN : GOLD, 1, 1);
    }
  }

  function frame(ts) {
    var dt = Math.min((ts - last) / 1000, 0.1);
    last = ts;

    if (fading !== 0) {
      fade += fading * dt / 1.4;
      if (fade <= 0) { fade = 0; newGame(); fading = 1; }
      else if (fade >= 1) { fade = 1; fading = 0; timer = setTimeout(step, 600); }
    }

    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = fade;

    var cell = S / N, r, c, a, an, key;

    ctx.strokeStyle = INK_LINE;
    ctx.lineWidth = 1;
    roundRectPath(OX - 10, OY - 10, S + 20, S + 20, 14);
    ctx.stroke();
    ctx.beginPath();
    for (var i = 0; i <= N; i++) {
      ctx.moveTo(OX + i * cell, OY);
      ctx.lineTo(OX + i * cell, OY + S);
      ctx.moveTo(OX, OY + i * cell);
      ctx.lineTo(OX + S, OY + i * cell);
    }
    ctx.stroke();

    /* advance animations, index by cell */
    var active = {};
    for (a = 0; a < anims.length; a++) {
      an = anims[a];
      an.t += dt;
      key = an.r + "," + an.c;
      (active[key] = active[key] || []).push(an);
    }
    anims = anims.filter(function (x) {
      if (x.type === "place") return x.t < 0.45;
      if (x.type === "flip") return x.t < 0.40;
      return x.t < 0.8;
    });

    /* pieces */
    for (r = 0; r < N; r++) {
      for (c = 0; c < N; c++) {
        var v = board[r][c];
        if (!v) continue;
        var xy = cellXY(r, c);
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
    for (var gi = 0; gi < anims.length; gi++) {
      var rg = anims[gi];
      if (rg.type !== "ring" || rg.t < 0) continue;
      var rt = Math.min(rg.t / 0.7, 1);
      var rp = cellXY(rg.r, rg.c);
      ctx.beginPath();
      ctx.arc(rp[0], rp[1], cell * (0.42 + 0.38 * rt), 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(29,160,91," + (0.45 * (1 - rt)).toFixed(3) + ")";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener("resize", resize);
  newGame();

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    drawBoard(); // one still frame, no game loop
    return;
  }

  last = performance.now();
  timer = setTimeout(step, 800);
  requestAnimationFrame(frame);
})();
