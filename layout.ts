/* Shared page chrome for amandata.dev.
   Injects (in order): ambient canvas, nav, footer.
   Runs FIRST among body scripts so theme.js / nav.js / page scripts
   find the elements they expect. Per-page config comes from
   <body data-nav="...">:
     home       -> mark links to #top, mark underlined active, progress bar on
     me         -> Me dropdown active (about.html, projects.html, cv.html,
                   contact.html, commissions.html, blog.html)
     creations  -> Creations dropdown active (creations.html, othello.html,
                   othello-advanced.html, psy410.html)
     site       -> This Site dropdown active (repository.html)
     (anything else, e.g. admin) -> no active item
   No-JS fallback: each page ships a <noscript> link row; this script
   only runs when JS is available, so nothing is duplicated. */
(function () {
  "use strict";

  var body = document.body;
  if (!body) return;
  var page = body.getAttribute("data-nav") || "";

  interface NavDropdown { key: string; label: string; links: string[][]; }

  var DROPDOWNS: NavDropdown[] = [
    { key: "me", label: "Me", links: [
      ["/about.html", "About"],
      ["/projects.html", "Projects"],
      ["/cv.html", "CV"],
      ["/contact.html", "Contact"],
      ["/commissions.html", "Commissions"],
      ["/blog.html", "Blog"]
    ] },
    { key: "site", label: "This Site", links: [
      ["/blog.html?p=making-amandata-dev", "Making amandata.dev"],
      ["/blog.html?p=building-the-reversi-coach-turning-the-othello-bot-into-a-learning-system", "Building the Reversi Coach"],
      ["/repository.html", "Repository"],
      ["/#changelog", "Changelog"]
    ] },
    { key: "creations", label: "Creations", links: [
      ["/othello.html", "Othello"],
      ["/psy410-flashcards/", "Myers flashcards"],
      ["/synergy.html", "Synergy esoslang"],
      ["/stat200-practice.html", "R Practice Hub"],
      ["/psy410.html", "PSY 410 Resources"]
    ] }
  ];

  function fullMenu(): string {
    var home = '<a class="nav__full-link nav__full-home" href="/">Home</a>';
    var groups = DROPDOWNS.map(function (d: NavDropdown) {
      var items = d.links.map(function (l: string[]) {
        return '<a class="nav__full-link" href="' + l[0] + '">' + l[1] + "</a>";
      }).join("");
      return '<div class="nav__full-group"><span class="nav__full-label">' + d.label + "</span>" + items + "</div>";
    }).join("");
    return home + groups;
  }

  var navHtml =
    '<nav class="nav">' +
      '<button class="nav__burger" id="nav-burger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="nav-fullmenu">' +
        '<span></span><span></span><span></span>' +
      '</button>' +
      '<div class="nav__fullmenu" id="nav-fullmenu" hidden>' + fullMenu() + "</div>" +
      '<form class="nav__search" id="nav-search" role="search" action="/search.html" method="get" autocomplete="off">' +
        '<input type="search" name="q" id="nav-search-input" placeholder="search" aria-label="search site pages">' +
        '<div class="nav__suggest" id="nav-suggest" hidden></div>' +
      '</form>' +
      '<div class="theme-picker">' +
        '<button class="theme-toggle" id="theme-toggle" type="button" aria-expanded="false" aria-haspopup="true">Change Theme <span class="nav__caret" aria-hidden="true"></span></button>' +
        '<div class="theme-menu" id="theme-menu" role="menu" aria-label="Color theme" hidden>' +
          '<button class="theme-opt" type="button" role="menuitemradio" data-theme-name="white"><span class="theme-swatches" aria-hidden="true"><i style="background:#FFFFFF"></i><i style="background:#2563EB"></i><i style="background:#111111"></i></span>White</button>' +
          '<button class="theme-opt" type="button" role="menuitemradio" data-theme-name="dark"><span class="theme-swatches" aria-hidden="true"><i style="background:#0A0C0A"></i><i style="background:#1DA05B"></i><i style="background:#D9BE7A"></i></span>Dark</button>' +
          '<button class="theme-opt" type="button" role="menuitemradio" data-theme-name="light"><span class="theme-swatches" aria-hidden="true"><i style="background:#F7F3E9"></i><i style="background:#2E7B3E"></i><i style="background:#9A7B2D"></i></span>Light</button>' +
          '<button class="theme-opt" type="button" role="menuitemradio" data-theme-name="pink"><span class="theme-swatches" aria-hidden="true"><i style="background:#FAF3EA"></i><i style="background:#C96F8E"></i><i style="background:#934A66"></i></span>Pink</button>' +
          '<button class="theme-opt" type="button" role="menuitemradio" data-theme-name="blue"><span class="theme-swatches" aria-hidden="true"><i style="background:#0A1220"></i><i style="background:#5AA9E6"></i><i style="background:#D9BE7A"></i></span>Blue</button>' +
        '</div>' +
      '</div>' +
      (page === "home" ? '<div class="progress" id="progress" aria-hidden="true"></div>' : "") +
    "</nav>";

  var footerHtml =
    '<footer class="footer"><p>\u00a9 2026 Amanda Ta \u00b7 amandata.dev</p></footer>';

  /* canvas first (fixed background), nav right after it, footer last */
  var canvas = document.createElement("canvas");
  canvas.className = "othello-bg";
  canvas.id = "othello-bg";
  canvas.setAttribute("aria-hidden", "true");
  body.insertBefore(canvas, body.firstChild);
  canvas.insertAdjacentHTML("afterend", navHtml);
  body.insertAdjacentHTML("beforeend", footerHtml);

  /* Pixelated loading bar (fixed top strip, hidden until shown).
     Pages with async loads (blog) toggle it via window.SiteLoading. */
  var loadingBar = document.createElement("div");
  loadingBar.className = "site-loading";
  loadingBar.setAttribute("aria-hidden", "true");
  loadingBar.innerHTML = '<div class="site-loading__fill"></div>';
  body.insertBefore(loadingBar, body.firstChild);
  window.SiteLoading = {
    show: function () { loadingBar.classList.add("on"); },
    hide: function () { loadingBar.classList.remove("on"); }
  };

  /* Hamburger menu toggle */
  (function () {
    var btn = document.getElementById("nav-burger") as HTMLButtonElement | null;
    var menu = document.getElementById("nav-fullmenu") as HTMLElement | null;
    if (!btn || !menu) return;
    function close(): void {
      menu!.hidden = true;
      btn!.setAttribute("aria-expanded", "false");
      btn!.classList.remove("is-open");
    }
    btn.addEventListener("click", function (e: Event) {
      e.stopPropagation();
      var open = menu!.hidden;
      if (open) {
        menu!.hidden = false;
        btn!.setAttribute("aria-expanded", "true");
        btn!.classList.add("is-open");
      } else close();
    });
    document.addEventListener("click", function (e: Event) {
      if (!(e.target as HTMLElement).closest("#nav-fullmenu")) close();
    });
    document.addEventListener("keydown", function (e: KeyboardEvent) {
      if (e.key === "Escape") close();
    });
  })();

  /* Nav search autocomplete — up to 5 page suggestions as you type. */
  (function () {
    var input = document.getElementById("nav-search-input") as HTMLInputElement | null;
    var box = document.getElementById("nav-suggest") as HTMLElement | null;
    if (!input || !box) return;
    function esc(s: string): string {
      return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }
    function suggest(): void {
      var q = input!.value.trim().toLowerCase();
      var pages: any[] = (window as any).SITE_INDEX || [];
      if (!q || !pages.length) { box!.hidden = true; box!.innerHTML = ""; return; }
      var words = q.split(/\s+/);
      var hits = pages.filter(function (p: any) {
        var hay = (p.title + " " + p.desc + " " + p.keys).toLowerCase();
        return words.every(function (w: string) { return hay.indexOf(w) !== -1; });
      }).slice(0, 5);
      if (!hits.length) { box!.hidden = true; box!.innerHTML = ""; return; }
      box!.innerHTML = hits.map(function (p: any) {
        return '<a class="nav__suggest-item" href="' + p.url + '"><span class="nav__suggest-title">' +
          esc(p.title) + '</span><span class="nav__suggest-desc">' + esc(p.desc) + "</span></a>";
      }).join("");
      box!.hidden = false;
    }
    input.addEventListener("input", suggest);
    input.addEventListener("focus", suggest);
    input.addEventListener("keydown", function (e: KeyboardEvent) {
      if (e.key === "Escape") { box!.hidden = true; input!.blur(); }
    });
    document.addEventListener("click", function (e: Event) {
      if (!(e.target as HTMLElement).closest("#nav-search")) { box!.hidden = true; }
    });
  })();
})();
