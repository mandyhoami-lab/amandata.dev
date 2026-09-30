/* Physical othello board playing itself behind the page,
   with coach-style strategy annotations over it.
   Wood frame, green felt, 3D black/white discs.
   Black moves first. Respects prefers-reduced-motion. */
(function () {
  "use strict";

  var canvas = document.getElementById("othello-bg");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");

  var N = 8;
  var DIRS = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  var FONT = '"Silkscreen", "Micro 5", monospace';
  var CORNERS = [[0,0],[0,7],[7,0],[7,7]];

  var NOTES = [
    "corners win games",
    "mobility > greed",
    "don't gift the X-square",
    "quiet moves build options",
    "stable discs never flip",
    "watch the parity",
    "edges are traps early",
    "force their hand"
  ];

  function theme() { return document.documentElement.dataset.theme || "dark"; }
  function accent() {
    var t = theme();
    if (t === "pink") return "#C2255C";
    if (t === "blue") return "#5AA9E6";
    if (t === "light") return "#2E7B3E";
    return "#1DA05B";
  }
  function noteRGB() {
    var t = theme();
    if (t === "light") return "24,32,26";
    if (t === "pink") return "166,30,77";
    return "242,236,220";
  }
  function hexA(hex, a) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);
    return "rgba(" + r + "," + g + "," + b + "," + a.toFixed(3) + ")";
  }

  var W = 0, H = 0, scrollFade = 1;
  var boards = [];
  var last = 0;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* one strong board, roughly behind the hero; fades as you scroll */
  function layoutSpec() {
    if (W < 720) return [{ cx: 0.50, cy: 0.34, s: 0.66, alpha: 0.60, delay: 300 }];
    return [{ cx: 0.70, cy: 0.46, s: 0.60, alpha: 0.95, delay: 300 }];
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
        cx: spec.cx, cy: spec.cy, s: spec.s, alpha: spec.alpha,
        grid: null, turn: 1, anims: [], notes: [],
        candidates: null, thinking: false, phaseT: 0,
        moveCount: 0, lastNote: -1, score: { b: 2, w: 2 },
        fade: 1, fading: 0, timer: null,
        S: 0, OX: 0, OY: 0, pad: 0, _dt: 0
      };
      layoutBoard(b);
      newGame(b);
      if (!reduceMotion) {
        b.timer = setTimeout(function () { think(b); }, spec.delay);
      }
      return b;
    });
  }

  function layoutBoard(b) {
    var m = Math.min(W, H);
    b.S = m * b.s;
    b.OX = W * b.cx - b.S / 2;
    b.OY = H * b.cy - b.S / 2;
    b.pad = (b.S / N) * 0.55;
  }

  function newGame(b) {
    b.grid = [];
    for (var r = 0; r < N; r++) b.grid.push([0,0,0,0,0,0,0,0]);
    b.grid[3][3] = -1; b.grid[4][4] = -1;  /* white */
    b.grid[3][4] = 1;  b.grid[4][3] = 1;  /* black */
    b.turn = 1;
    b.anims = [];
    b.notes = [];
    b.candidates = null;
    b.thinking = false;
    b.moveCount = 0;
    b.score = { b: 2, w: 2 };
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

  /* "thinking" phase: show top candidate moves before committing */
  function think(b) {
    var scored = legalMoves(b.grid, b.turn).map(function (mv) {
      return { r: mv[0], c: mv[1], n: flips(b.grid, mv[0], mv[1], b.turn).length };
    }).sort(function (a, c) { return c.n - a.n; });
    if (!scored.length) {
      b.turn = -b.turn;
      scored = legalMoves(b.grid, b.turn).map(function (mv) {
        return { r: mv[0], c: mv[1], n: flips(b.grid, mv[0], mv[1], b.turn).length };
      }).sort(function (a, c) { return c.n - a.n; });
      if (!scored.length) { b.fading = -1; return; } /* game over */
    }
    b.candidates = scored.slice(0, 3);
    b.thinking = true;
    b.phaseT = 0;
    b.timer = setTimeout(function () { resolveMove(b); }, 1400);
  }

  function resolveMove(b) {
    var c = b.candidates || [];
    var pick = c[0];
    if (c.length > 1 && Math.random() < 0.22) pick = c[1]; /* occasional flair */
    var f = flips(b.grid, pick.r, pick.c, b.turn);
    b.grid[pick.r][pick.c] = b.turn;
    b.anims.push({ type: "place", r: pick.r, c: pick.c, t: 0 });
    for (var i = 0; i < f.length; i++) {
      b.grid[f[i][0]][f[i][1]] = b.turn;
      b.anims.push({ type: "flip", r: f[i][0], c: f[i][1], toWhite: b.turn === -1, t: -i * 0.07 });
    }
    var sb = 0, sw = 0, r, cc;
    for (r = 0; r < N; r++) for (cc = 0; cc < N; cc++) {
      if (b.grid[r][cc] === 1) sb++; else if (b.grid[r][cc] === -1) sw++;
    }
    b.score = { b: sb, w: sw };
    b.candidates = null;
    b.thinking = false;
    b.moveCount++;

    var isCorner = CORNERS.some(function (k) { return k[0] === pick.r && k[1] === pick.c; });
    if (isCorner) {
      var xy = cellXY(b, pick.r, pick.c);
      var ax = xy[0] + (pick.c < 4 ? -1 : 1) * xy[2] * 1.7;
      var ay = xy[1] + (pick.r < 4 ? -1 : 1) * xy[2] * 1.7;
      b.notes.push({ kind: "arrow", x1: ax, y1: ay, x2: xy[0], y2: xy[1], t: 0, dur: 2.4 });
      pushNote(b, "corner secured!", xy[0], xy[1] - xy[2] * 1.2, 2.4);
    } else if (b.moveCount % 4 === 0) {
      var ni;
      do { ni = Math.floor(Math.random() * NOTES.length); } while (ni === b.lastNote);
      b.lastNote = ni;
      pushNote(b, NOTES[ni], b.OX + b.S / 2, b.OY - b.pad - 18, 2.8);
    }
    b.turn = -b.turn;
    b.timer = setTimeout(function () { think(b); }, 1500);
  }

  function pushNote(b, text, x, y, dur) {
    if (b.notes.length > 3) b.notes.shift();
    b.notes.push({ kind: "note", text: text, x: x, y: y, t: 0,
                   dur: dur || 2.6, rot: (Math.random() - 0.5) * 0.06 });
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

  /* ---------- physical board ---------- */

  function drawPhysicalBoard(b) {
    var cell = b.S / N;
    var pad = cell * 0.55;
    b.pad = pad;
    var ox = b.OX - pad, oy = b.OY - pad, S = b.S + pad * 2;
    var cx = b.OX + b.S / 2, cy = b.OY + b.S / 2;

    /* drop shadow */
    ctx.save();
    roundRectPath(ox + 5, oy + 10, S, S, 14);
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fill();
    ctx.restore();

    /* wood frame */
    var wood = ctx.createLinearGradient(ox, oy, ox + S, oy + S);
    wood.addColorStop(0, "#a06b3a");
    wood.addColorStop(0.45, "#7d5027");
    wood.addColorStop(1, "#59371b");
    roundRectPath(ox, oy, S, S, 14);
    ctx.fillStyle = wood;
    ctx.fill();
    /* sheen */
    var sheen = ctx.createLinearGradient(ox, oy, ox, oy + S);
    sheen.addColorStop(0, "rgba(255,255,255,0.10)");
    sheen.addColorStop(0.28, "rgba(255,255,255,0)");
    roundRectPath(ox, oy, S, S, 14);
    ctx.fillStyle = sheen;
    ctx.fill();
    /* inner bevel */
    roundRectPath(b.OX - 3, b.OY - 3, b.S + 6, b.S + 6, 6);
    ctx.strokeStyle = "rgba(0,0,0,0.45)";
    ctx.lineWidth = 3;
    ctx.stroke();

    /* green felt */
    var felt = ctx.createRadialGradient(cx, cy, S * 0.08, cx, cy, S * 0.72);
    felt.addColorStop(0, "#339e52");
    felt.addColorStop(0.7, "#267f40");
    felt.addColorStop(1, "#1c6330");
    ctx.fillStyle = felt;
    ctx.fillRect(b.OX, b.OY, b.S, b.S);

    /* grid lines */
    ctx.strokeStyle = "rgba(0,0,0,0.38)";
    ctx.lineWidth = Math.max(1, cell * 0.028);
    ctx.beginPath();
    for (var i = 0; i <= N; i++) {
      ctx.moveTo(b.OX + i * cell, b.OY);
      ctx.lineTo(b.OX + i * cell, b.OY + b.S);
      ctx.moveTo(b.OX, b.OY + i * cell);
      ctx.lineTo(b.OX + b.S, b.OY + i * cell);
    }
    ctx.stroke();

    /* star points */
    ctx.fillStyle = "rgba(0,0,0,0.38)";
    var pts = [[1,1],[1,5],[5,1],[5,5]];
    for (var s = 0; s < pts.length; s++) {
      var xy = cellXY(b, pts[s][0], pts[s][1]);
      ctx.beginPath();
      ctx.arc(xy[0], xy[1], cell * 0.045, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawDisc(x, y, r, white) {
    /* soft shadow */
    ctx.save();
    ctx.globalAlpha *= 0.30;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.ellipse(x + r * 0.10, y + r * 0.16, r * 0.92, r * 0.78, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    /* 3D body */
    var g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.40, r * 0.12, x, y, r);
    if (white) {
      g.addColorStop(0, "#ffffff");
      g.addColorStop(0.65, "#ece7db");
      g.addColorStop(1, "#b3ac9d");
    } else {
      g.addColorStop(0, "#565660");
      g.addColorStop(0.55, "#1b1b1f");
      g.addColorStop(1, "#000000");
    }
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = white ? "rgba(0,0,0,0.28)" : "rgba(255,255,255,0.14)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function drawPieces(b) {
    var cell = b.S / N, r, c;
    var active = {};
    for (var a = 0; a < b.anims.length; a++) {
      var an = b.anims[a];
      an.t += b._dt;
      var key = an.r + "," + an.c;
      (active[key] = active[key] || []).push(an);
    }
    b.anims = b.anims.filter(function (x) {
      if (x.type === "place") return x.t < 0.5;
      return x.t < 0.6;
    });
    for (r = 0; r < N; r++) {
      for (c = 0; c < N; c++) {
        var v = b.grid[r][c];
        if (!v) continue;
        var xy = cellXY(b, r, c);
        var white = v === -1;
        var list = active[r + "," + c];
        var drawn = false;
        if (list) {
          for (var li = 0; li < list.length; li++) {
            var m = list[li];
            if (m.type === "place" && m.t >= 0) {
              var p = Math.min(m.t / 0.38, 1);
              var yOff = -cell * 0.7 * (1 - p) * (1 - p);
              var s = 0.55 + 0.45 * easeOutBack(Math.min(p * 1.5, 1));
              drawDisc(xy[0], xy[1] + yOff, cell * 0.40 * s, white);
              drawn = true;
            } else if (m.type === "flip" && m.t >= 0) {
              var fp = Math.min(m.t / 0.30, 1);
              var sx = Math.max(Math.abs(Math.cos(fp * Math.PI)), 0.06);
              ctx.save();
              ctx.translate(xy[0], xy[1]);
              ctx.scale(sx, 1);
              ctx.translate(-xy[0], -xy[1]);
              drawDisc(xy[0], xy[1], cell * 0.40, fp < 0.5 ? !m.toWhite : m.toWhite);
              ctx.restore();
              drawn = true;
            }
          }
        }
        if (!drawn) drawDisc(xy[0], xy[1], cell * 0.40, white);
      }
    }
  }

  /* ---------- strategy annotations ---------- */

  function drawCandidates(b) {
    if (!b.thinking || !b.candidates) return;
    var acc = accent();
    var pulse = 0.5 + 0.5 * Math.sin(b.phaseT * 7);
    ctx.save();
    ctx.textAlign = "center";
    ctx.font = "11px " + FONT;
    for (var i = 0; i < b.candidates.length; i++) {
      var cd = b.candidates[i];
      var xy = cellXY(b, cd.r, cd.c);
      ctx.setLineDash([6, 5]);
      ctx.lineWidth = 2;
      ctx.strokeStyle = hexA(acc, 0.35 + 0.45 * pulse);
      ctx.beginPath();
      ctx.arc(xy[0], xy[1], xy[2] * (0.40 + 0.03 * pulse), 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = hexA(acc, 0.95);
      ctx.fillText("+" + cd.n, xy[0], xy[1] - xy[2] * 0.52);
    }
    ctx.restore();
  }

  function drawArrow(a) {
    var acc = accent();
    var fade = Math.min(a.t / 0.4, 1) * Math.min((a.dur - a.t) / 0.5, 1);
    if (fade <= 0) return;
    var mx = (a.x1 + a.x2) / 2, my = (a.y1 + a.y2) / 2;
    var dx = a.x2 - a.x1, dy = a.y2 - a.y1;
    var len = Math.hypot(dx, dy) || 1;
    var qx = mx - dy / len * 26, qy = my + dx / len * 26;
    ctx.save();
    ctx.globalAlpha *= Math.max(fade, 0);
    ctx.strokeStyle = acc;
    ctx.fillStyle = acc;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(a.x1, a.y1);
    ctx.quadraticCurveTo(qx, qy, a.x2, a.y2);
    ctx.stroke();
    var ang = Math.atan2(a.y2 - qy, a.x2 - qx);
    ctx.beginPath();
    ctx.moveTo(a.x2, a.y2);
    ctx.lineTo(a.x2 - 11 * Math.cos(ang - 0.42), a.y2 - 11 * Math.sin(ang - 0.42));
    ctx.lineTo(a.x2 - 11 * Math.cos(ang + 0.42), a.y2 - 11 * Math.sin(ang + 0.42));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawNote(n) {
    var fade = Math.min(n.t / 0.35, 1) * Math.min((n.dur - n.t) / 0.5, 1);
    if (fade <= 0) return;
    ctx.save();
    ctx.globalAlpha *= Math.max(fade, 0);
    ctx.translate(n.x, n.y);
    ctx.rotate(n.rot || 0);
    ctx.font = "12px " + FONT;
    var w = ctx.measureText(n.text).width;
    var pw = w + 22, ph = 27;
    roundRectPath(-pw / 2, -ph / 2, pw, ph, 8);
    ctx.fillStyle = "rgba(8,10,9,0.72)";
    ctx.fill();
    ctx.strokeStyle = hexA(accent(), 0.85);
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(n.text, 0, 1);
    ctx.restore();
  }

  function drawScore(b) {
    ctx.save();
    ctx.font = "11px " + FONT;
    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(" + noteRGB() + ",0.75)";
    ctx.fillText("● " + b.score.b + "   ○ " + b.score.w,
                b.OX + b.S, b.OY + b.S + b.pad * 0.62);
    ctx.restore();
  }

  /* ---------- main loop ---------- */

  function frame(ts) {
    var dt = Math.min((ts - last) / 1000, 0.1);
    last = ts;
    scrollFade = Math.max(0.22, 1 - window.scrollY / (H * 0.7));
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < boards.length; i++) {
      var b = boards[i];
      b._dt = dt;
      if (b.thinking) b.phaseT += dt;
      var q;
      for (q = 0; q < b.notes.length; q++) b.notes[q].t += dt;
      b.notes = b.notes.filter(function (n) { return n.t < n.dur; });
      if (b.fading !== 0) {
        b.fade += b.fading * dt / 1.4;
        if (b.fade <= 0) {
          b.fade = 0; newGame(b); b.fading = 1;
        } else if (b.fade >= 1) {
          b.fade = 1; b.fading = 0;
          (function (bb) {
            bb.timer = setTimeout(function () { think(bb); }, 600);
          })(b);
        }
      }
      ctx.globalAlpha = b.fade * b.alpha * scrollFade;
      drawPhysicalBoard(b);
      drawPieces(b);
      drawCandidates(b);
      for (var k = 0; k < b.notes.length; k++) {
        var nn = b.notes[k];
        if (nn.kind === "arrow") drawArrow(nn); else drawNote(nn);
      }
      drawScore(b);
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
    /* one still frame: a mid-game position, no animation */
    for (var k = 0; k < boards.length; k++) {
      var b = boards[k];
      b._dt = 0;
      for (var m = 0; m < 12; m++) {
        var mv = legalMoves(b.grid, b.turn);
        if (!mv.length) {
          b.turn = -b.turn;
          mv = legalMoves(b.grid, b.turn);
          if (!mv.length) break;
        }
        var pk = mv[Math.floor(Math.random() * mv.length)];
        var fl = flips(b.grid, pk[0], pk[1], b.turn);
        b.grid[pk[0]][pk[1]] = b.turn;
        for (var fi = 0; fi < fl.length; fi++) b.grid[fl[fi][0]][fl[fi][1]] = b.turn;
        b.turn = -b.turn;
      }
      ctx.globalAlpha = b.alpha * 0.9;
      drawPhysicalBoard(b);
      drawPieces(b);
    }
    ctx.globalAlpha = 1;
    return;
  }

  last = performance.now();
  requestAnimationFrame(frame);
})();
