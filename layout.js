"use strict";
/* Shared page chrome for amandata.dev.
   Injects (in order): ambient canvas, nav, footer.
   Runs FIRST among body scripts so theme.js / nav.js / page scripts
   find the elements they expect. Per-page config comes from
   <body data-nav="...">:
     home       -> mark links to #top, no active item, progress bar on
     blog       -> Blog link active
     learn      -> Learn dropdown active (learn.html, othello.html, othello-advanced.html)
     psy410     -> PSY 410 link active
     me         -> Me dropdown active (commissions.html)
     site       -> This Site dropdown active (repository.html)
     (anything else, e.g. admin) -> no active item
   No-JS fallback: each page ships a <noscript> link row; this script
   only runs when JS is available, so nothing is duplicated. */
(function () {
    "use strict";
    var body = document.body;
    if (!body)
        return;
    var page = body.getAttribute("data-nav") || "";
    var DROPDOWNS = [
        { key: "me", label: "Me", links: [
                ["/#about", "About"],
                ["/#cv", "CV"],
                ["/#contact", "Contact"],
                ["/commissions.html", "Commissions"]
            ] },
        { key: "site", label: "This Site", links: [
                ["/blog.html?p=making-amandata-dev", "Making amandata.dev"],
                ["/blog.html?p=building-the-reversi-coach-turning-the-othello-bot-into-a-learning-system", "Building the Reversi Coach"],
                ["/repository.html", "Repository"],
                ["/#changelog", "Changelog"]
            ] },
        { key: "learn", label: "Learn", links: [
                ["/learn.html", "Games"],
                ["/othello.html", "Othello"],
                ["/psy410-flashcards/", "Myers flashcards"]
            ] }
    ];
    var LINKS = [
        { key: "blog", href: "/blog.html", label: "Blog" },
        { key: "othello", href: "/othello.html", label: "Play Othello" },
        { key: "psy410", href: "/psy410.html", label: "PSY 410 Resources" }
    ];
    function dropdown(d) {
        var active = page === d.key ? " is-active" : "";
        var items = d.links.map(function (l) {
            return '<a class="nav__menu-link" role="menuitem" href="' + l[0] + '">' + l[1] + "</a>";
        }).join("");
        return '<div class="nav__item nav__dropdown">' +
            '<button class="nav__toggle' + active + '" type="button" aria-expanded="false" aria-haspopup="true" ' +
            'aria-controls="nav-menu-' + d.key + '" id="nav-toggle-' + d.key + '">' + d.label +
            ' <span class="nav__caret" aria-hidden="true">\u25be</span></button>' +
            '<div class="nav__menu" id="nav-menu-' + d.key + '" role="menu" aria-labelledby="nav-toggle-' + d.key + '">' +
            items + "</div></div>";
    }
    function plainLink(l) {
        var active = page === l.key ? " is-active" : "";
        return '<div class="nav__item"><a class="nav__link' + active + '" href="' + l.href + '">' + l.label + "</a></div>";
    }
    var markHref = page === "home" ? "#top" : "/";
    var navHtml = '<nav class="nav">' +
        '<a class="nav__mark" href="' + markHref + '" aria-label="Home">' +
        '<svg class="nav__home" viewBox="0 0 16 14" width="26" height="23" aria-hidden="true" shape-rendering="crispEdges">' +
        '<rect class="hm" x="5" y="0" width="1" height="1"/>' +
        '<rect class="hm" x="9" y="0" width="1" height="1"/>' +
        '<rect class="hm" x="5" y="1" width="5" height="1"/>' +
        '<rect class="hm-door" x="6" y="1" width="1" height="1"/>' +
        '<rect class="hm-door" x="8" y="1" width="1" height="1"/>' +
        '<rect class="hm" x="5" y="2" width="5" height="1"/>' +
        '<rect class="hm" x="5" y="3" width="5" height="3"/>' +
        '<rect class="hm" x="4" y="6" width="8" height="1"/>' +
        '<rect class="hm" x="3" y="7" width="10" height="1"/>' +
        '<rect class="hm" x="3" y="8" width="10" height="5"/>' +
        '<rect class="hm-door" x="7" y="10" width="2" height="3"/>' +
        '</svg>' +
        '</a>' +
        '<div class="nav__links">' +
        DROPDOWNS.map(dropdown).join("") +
        LINKS.map(plainLink).join("") +
        "</div>" +
        '<div class="theme-picker">' +
        '<button class="theme-toggle" id="theme-toggle" type="button" aria-expanded="false" aria-haspopup="true">Change Theme <span class="nav__caret" aria-hidden="true">▾</span></button>' +
        '<div class="theme-menu" id="theme-menu" role="menu" aria-label="Color theme" hidden>' +
        '<button class="theme-opt" type="button" role="menuitemradio" data-theme-name="dark"><span class="theme-swatches" aria-hidden="true"><i style="background:#0A0C0A"></i><i style="background:#1DA05B"></i><i style="background:#D9BE7A"></i></span>Dark</button>' +
        '<button class="theme-opt" type="button" role="menuitemradio" data-theme-name="light"><span class="theme-swatches" aria-hidden="true"><i style="background:#F7F3E9"></i><i style="background:#2E7B3E"></i><i style="background:#9A7B2D"></i></span>Light</button>' +
        '<button class="theme-opt" type="button" role="menuitemradio" data-theme-name="pink"><span class="theme-swatches" aria-hidden="true"><i style="background:#FAF3EA"></i><i style="background:#C96F8E"></i><i style="background:#934A66"></i></span>Pink</button>' +
        '<button class="theme-opt" type="button" role="menuitemradio" data-theme-name="blue"><span class="theme-swatches" aria-hidden="true"><i style="background:#0A1220"></i><i style="background:#5AA9E6"></i><i style="background:#D9BE7A"></i></span>Blue</button>' +
        '</div>' +
        '</div>' +
        (page === "home" ? '<div class="progress" id="progress" aria-hidden="true"></div>' : "") +
        "</nav>";
    var footerHtml = '<footer class="footer"><p>\u00a9 2026 Amanda Ta \u00b7 amandata.dev</p></footer>';
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
})();
