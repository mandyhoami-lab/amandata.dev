"use strict";
/* Site search page shell — vignette + main, injected so the .html file stays a thin shell. */
(function () {
    "use strict";
    var mount = document.getElementById("page-mount");
    if (!mount)
        return; /* shell already present (pre-conversion HTML) */
    mount.outerHTML = `<!-- CRT vignette overlay -->
<div class="vignette" aria-hidden="true"></div>

<main>

  <!-- ================= SEARCH ================= -->
  <section class="section" id="search">
    <div class="section__head">
      <h2 class="section__title">Search</h2>
      <span class="section__tag">find a page</span>
    </div>
    <div class="section__body">
      <form id="search-form" role="search" action="/search.html" method="get">
        <input type="search" id="search-input" name="q" placeholder="search" aria-label="search site pages" autocomplete="off">
      </form>
      <div id="search-results" style="margin-top:1.2rem"></div>
    </div>
  </section>

</main>`;
})();
(function () {
    "use strict";
    /* shared index lives in site-index.js */
    var PAGES = window.SITE_INDEX || [];
    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }
    function doSearch(q) {
        var resultsEl = document.getElementById("search-results");
        q = (q || "").trim().toLowerCase();
        if (!q) {
            resultsEl.innerHTML = '<p style="color:var(--dim)">type something above to search the site.</p>';
            return;
        }
        var words = q.split(/\s+/);
        var hits = PAGES.filter(function (p) {
            var hay = (p.title + " " + p.desc + " " + p.keys).toLowerCase();
            return words.every(function (w) { return hay.indexOf(w) !== -1; });
        });
        if (!hits.length) {
            resultsEl.innerHTML = '<p style="color:var(--dim)">nothing found for "' + escapeHtml(q) + '".</p>';
            return;
        }
        resultsEl.innerHTML = hits.map(function (p) {
            return '<a class="post-card" href="' + p.url + '">' +
                '<h3 class="post-card__title">' + escapeHtml(p.title) + "</h3>" +
                '<p class="post-card__excerpt">' + escapeHtml(p.desc) + "</p></a>";
        }).join("");
    }
    var q = new URLSearchParams(location.search).get("q") || "";
    var input = document.getElementById("search-input");
    if (input) {
        input.value = q;
        input.addEventListener("input", function () { doSearch(document.getElementById("search-input").value); });
    }
    doSearch(q);
})();
