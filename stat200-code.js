/* R code runner via WebR (R compiled to WebAssembly). Lazy-loads on first use.
   window.StatCode.init(container) */
(function () {
  'use strict';

  var webr = null, loading = null;

  function loadWebR(statusEl) {
    if (webr) return Promise.resolve(webr);
    if (loading) return loading;
    statusEl.textContent = 'loading R (one-time download, ~15MB)…';
    loading = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.type = 'module';
      s.textContent =
        "import { WebR } from 'https://webr.r-wasm.org/v0.4.2/webr.mjs';" +
        "window.__webrReady(new WebR());";
      window.__webrReady = function (w) {
        w.init().then(function () {
          webr = w;
          resolve(w);
        }).catch(reject);
        delete window.__webrReady;
      };
      s.onerror = function () { reject(new Error('could not load WebR')); };
      document.head.appendChild(s);
    });
    return loading;
  }

  function init(container) {
    container.innerHTML =
      '<div class="code-wrap">' +
      '<p class="code-note">try <code>1 + 1</code>, then <code>x &lt;- c(1,2,3); mean(x)</code>.</p>' +
      '<textarea class="code-input" spellcheck="false" rows="6" placeholder="x <- c(2, 4, 6)\nmean(x)"></textarea>' +
      '<div class="code-row"><button type="button" class="code-btn code-run">run</button></div>' +
      '<pre class="code-out" aria-live="polite">(output appears here)</pre>' +
      '</div>';

    var input = container.querySelector('.code-input');
    var out = container.querySelector('.code-out');
    container.querySelector('.code-run').addEventListener('click', function () {
      var code = input.value;
      if (!code.trim()) return;
      out.textContent = 'starting R…';
      loadWebR(out).then(function (w) {
        out.textContent = 'running…';
        return w.evalR(code);
      }).then(function (result) {
        return result.toJs();
      }).then(function (js) {
        out.textContent = formatR(js);
      }).catch(function (e) {
        out.textContent = 'could not run: ' + (e && e.message ? e.message : e) +
          '\n(check your connection and try again)';
      });
    });
  }

  function formatR(v) {
    if (v === null || v === undefined) return 'NULL';
    if (Array.isArray(v)) {
      if (v.length === 0) return 'numeric(0)';
      return '[1] ' + v.map(function (x) {
        return typeof x === 'number' ? (Math.round(x * 1000) / 1000) : String(x);
      }).join(' ');
    }
    return String(v);
  }

  window.StatCode = { init: init };
})();
