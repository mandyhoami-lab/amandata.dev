"use strict";
/* color theme cycler — dark / light / pink / blue.
   The initial theme is set by a tiny inline script in <head>
   (before first paint); this wires the button. */
(function () {
    "use strict";
    var THEMES = ["dark", "light", "pink", "blue"];
    function current() {
        var t = document.documentElement.dataset.theme;
        return (t !== undefined && THEMES.indexOf(t) !== -1) ? t : "dark";
    }
    function label(btn) {
        /* names the theme a click will switch to */
        var next = THEMES[(THEMES.indexOf(current()) + 1) % THEMES.length];
        btn.textContent = next.charAt(0).toUpperCase() + next.slice(1);
    }
    /* Othello landing icon follows the theme — one gif variant per theme. */
    var DEMO_GIFS = {
        dark: "/assets/images/othello-demo.gif",
        light: "/assets/images/othello-demo-light.gif",
        pink: "/assets/images/othello-demo-pink.gif",
        blue: "/assets/images/othello-demo-blue.gif"
    };
    function syncDemoGif() {
        var img = document.getElementById("mode-demo-gif");
        if (!img)
            return;
        var src = DEMO_GIFS[current()] || DEMO_GIFS.dark;
        if (img.getAttribute("src") !== src)
            img.setAttribute("src", src);
    }
    syncDemoGif();
    /* Non-null after the guard below (which still runs at runtime). */
    const btn = document.getElementById("theme-toggle");
    if (!btn)
        return;
    /* normalize anything stale to a known theme */
    if (THEMES.indexOf(document.documentElement.dataset.theme || "") === -1) {
        document.documentElement.dataset.theme = "dark";
    }
    label(btn);
    btn.addEventListener("click", function () {
        var next = THEMES[(THEMES.indexOf(current()) + 1) % THEMES.length];
        document.documentElement.dataset.theme = next;
        try {
            localStorage.setItem("amandata-theme", next);
        }
        catch (e) { }
        label(btn);
        syncDemoGif();
    });
    /* catch theme changes from any other source */
    try {
        var mo = new MutationObserver(function () { syncDemoGif(); });
        mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    }
    catch (e) { /* fail open */ }
})();
