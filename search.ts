/* Site search page shell — vignette + main, injected so the .html file stays a thin shell. */
(function () {
  "use strict";
  var mount = document.getElementById("page-mount");
  if (!mount) return; /* shell already present (pre-conversion HTML) */
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

  interface SitePage { url: string; title: string; desc: string; keys: string; }

  /* searchable site pages */
  var PAGES: SitePage[] = [
    { url: "/index.html", title: "Home", desc: "mandy's space", keys: "home welcome start" },
    { url: "/about.html", title: "About", desc: "who i am", keys: "about me bio who" },
    { url: "/projects.html", title: "Projects", desc: "research + code projects", keys: "projects work research" },
    { url: "/cv.html", title: "CV", desc: "curriculum vitae", keys: "cv resume curriculum vitae academic" },
    { url: "/contact.html", title: "Contact", desc: "get in touch", keys: "contact email reach message" },
    { url: "/commissions.html", title: "Commissions", desc: "hire me for a build", keys: "commissions hire freelance work" },
    { url: "/blog.html", title: "Blog", desc: "posts and essays", keys: "blog posts writing essays" },
    { url: "/creations.html", title: "Creations", desc: "things i build to play with", keys: "creations play games playground" },
    { url: "/othello.html", title: "Othello", desc: "reversi, beginner + advanced", keys: "othello reversi game board play coach" },
    { url: "/psy410.html", title: "PSY 410 Resources", desc: "myers exp psych study hub", keys: "psy410 psychology myers study flashcards resources" },
    { url: "/psy410-flashcards/", title: "Myers Flashcards", desc: "170-card exp psych deck", keys: "flashcards myers psychology study cards" },
    { url: "/synergy.html", title: "Synergy", desc: "the corporate buzzword esolang", keys: "synergy esolang programming language code buzzword corporate" },
    { url: "/stat200-practice.html", title: "R Practice Hub", desc: "stat 200 drills, quizzes + console", keys: "stat200 r practice drills quiz console statistics" },
    { url: "/coding-projects.html", title: "Coding projects", desc: "othello, r hub, synergy", keys: "coding projects code software" },
    { url: "/website-management.html", title: "Website management", desc: "amandata.dev, tgupsd.org, amandata.org", keys: "website management sites web" },
    { url: "/research-activity.html", title: "Research activity", desc: "cv + linkedin", keys: "research activity lab academic" },
    { url: "/repository.html", title: "Repository", desc: "this site's source", keys: "repository source code github repo" }
  ];

  function escapeHtml(s: string): string {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function doSearch(q: string): void {
    var resultsEl = document.getElementById("search-results") as HTMLElement;
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
  var input = document.getElementById("search-input") as HTMLInputElement | null;
  if (input) {
    input.value = q;
    input.addEventListener("input", function () { doSearch((document.getElementById("search-input") as HTMLInputElement).value); });
  }
  doSearch(q);
})();
