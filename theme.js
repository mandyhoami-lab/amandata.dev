/* color theme cycler — dark / light / pink / blue.
   The initial theme is set by a tiny inline script in <head>
   (before first paint); this wires the button. */
(function () {
  "use strict";

  var THEMES = ["dark", "light", "pink", "blue"];

  function current() {
    var t = document.documentElement.dataset.theme;
    return THEMES.indexOf(t) === -1 ? "dark" : t;
  }

  function label(btn) {
    /* names the theme a click will switch to */
    btn.textContent = THEMES[(THEMES.indexOf(current()) + 1) % THEMES.length];
  }

  var btn = document.getElementById("theme-toggle");
  if (!btn) return;
  /* normalize anything stale to a known theme */
  if (THEMES.indexOf(document.documentElement.dataset.theme) === -1) {
    document.documentElement.dataset.theme = "dark";
  }
  label(btn);

  btn.addEventListener("click", function () {
    var next = THEMES[(THEMES.indexOf(current()) + 1) % THEMES.length];
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("amandata-theme", next); } catch (e) {}
    label(btn);
  });
})();
