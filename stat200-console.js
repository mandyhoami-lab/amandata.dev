// hand-written, not compiled from .ts
/* Full R console via webR's Console helper (a real REPL: >, +, readline).
   Lazy-loads on "start R". Install any CRAN package with webr::install(),
   e.g. swirl, and run interactive lessons — swirl() prompts come through
   the same input line. Plots draw to the canvas below the output. */
(function () {
  'use strict';

  var mount = document.getElementById('rcon');
  if (!mount) return;

  mount.innerHTML =
    '<div class="rcon-wrap">' +
    '<p class="rcon-note">a real R session in your browser. start R, then install packages ' +
    'with <code>webr::install("swirl")</code> and run lessons with <code>library(swirl); swirl()</code>.</p>' +
    '<div class="rcon-row">' +
    '<button type="button" class="rcon-btn rcon-start">start R</button>' +
    '<button type="button" class="rcon-btn rcon-swirl" disabled>install swirl</button>' +
    '<button type="button" class="rcon-btn rcon-clear" disabled>clear</button>' +
    '<button type="button" class="rcon-btn rcon-stop" disabled>interrupt</button>' +
    '<span class="rcon-status">R is not started yet</span>' +
    '</div>' +
    '<div class="rcon-out" aria-live="polite"></div>' +
    '<canvas class="rcon-canvas" width="600" height="360" hidden></canvas>' +
    '<div class="rcon-input-row">' +
    '<span class="rcon-prompt" aria-hidden="true">&gt;</span>' +
    '<input class="rcon-input" type="text" spellcheck="false" autocomplete="off" ' +
    'placeholder="type R code here, Enter to run" disabled>' +
    '</div>' +
    '<p class="rcon-hint">swirl: <code>webr::install("swirl")</code> &rarr; <code>library(swirl)</code> &rarr; <code>swirl()</code>. ' +
    'answer its questions on this same line. up/down arrows recall earlier lines.</p>' +
    '</div>';

  var out = mount.querySelector('.rcon-out');
  var input = mount.querySelector('.rcon-input');
  var statusEl = mount.querySelector('.rcon-status');
  var startBtn = mount.querySelector('.rcon-start');
  var swirlBtn = mount.querySelector('.rcon-swirl');
  var clearBtn = mount.querySelector('.rcon-clear');
  var stopBtn = mount.querySelector('.rcon-stop');
  var canvas = mount.querySelector('.rcon-canvas');
  var ctx = canvas.getContext('2d');

  var con = null;
  var starting = null;
  var history = [];
  var hIdx = -1;

  function print(text) {
    out.textContent += text;
    out.scrollTop = out.scrollHeight;
  }

  function setStatus(text) {
    statusEl.textContent = text;
  }

  function setReady(ready) {
    input.disabled = !ready;
    swirlBtn.disabled = !ready;
    clearBtn.disabled = !ready;
    stopBtn.disabled = !ready;
    if (ready) input.focus();
  }

  function start() {
    if (con) return Promise.resolve(con);
    if (starting) return starting;
    setStatus('loading R (one-time download, ~15MB)…');
    startBtn.disabled = true;
    starting = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.type = 'module';
      s.textContent =
        "import { Console } from 'https://webr.r-wasm.org/v0.4.2/webr.mjs';" +
        "window.__rconReady(new Console({" +
        "  stdout: function (line) { window.__rconOut(line + '\\n'); }," +
        "  stderr: function (line) { window.__rconOut(line + '\\n'); }," +
        "  prompt: function (p) { window.__rconPrompt(p); }," +
        "  canvasImage: function (img) { window.__rconPlot(img); }," +
        "  canvasNewPage: function () { window.__rconPlotClear(); }" +
        "}));";
      window.__rconOut = function (line) { print(line); };
      window.__rconPrompt = function (p) {
        print(p);
        setStatus('R is ready');
        setReady(true);
      };
      window.__rconPlot = function (img) {
        canvas.hidden = false;
        ctx.drawImage(img, 0, 0);
      };
      window.__rconPlotClear = function () { ctx.clearRect(0, 0, canvas.width, canvas.height); };
      window.__rconReady = function (c) {
        con = c;
        delete window.__rconReady;
        c.run();
        // plots draw at half the canvas size; echo the line so the
        // transcript reads normally (it consumes the first prompt)
        print('options(device=webr::canvas(300, 180))\n');
        c.stdin('options(device=webr::canvas(300, 180))');
        resolve(c);
      };
      s.onerror = function () {
        setStatus('could not load R — check your connection and try again');
        startBtn.disabled = false;
        starting = null;
        reject(new Error('could not load WebR'));
      };
      document.head.appendChild(s);
    });
    return starting;
  }

  function sendLine(line) {
    if (!con) return;
    print(line + '\n');
    history.push(line);
    hIdx = history.length;
    con.stdin(line);
  }

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      var v = input.value;
      if (!v.trim()) return;
      input.value = '';
      sendLine(v);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length && hIdx > 0) {
        hIdx -= 1;
        input.value = history[hIdx];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (hIdx < history.length - 1) {
        hIdx += 1;
        input.value = history[hIdx];
      } else {
        hIdx = history.length;
        input.value = '';
      }
    }
  });

  startBtn.addEventListener('click', function () {
    print('starting R…\n');
    start().catch(function (e) {
      print('could not start R: ' + (e && e.message ? e.message : e) + '\n');
    });
  });

  swirlBtn.addEventListener('click', function () {
    if (!con) return;
    setStatus('installing swirl — this takes a bit…');
    sendLine('webr::install("swirl")');
  });

  clearBtn.addEventListener('click', function () {
    out.textContent = '';
  });

  stopBtn.addEventListener('click', function () {
    if (con) con.interrupt();
  });
})();
