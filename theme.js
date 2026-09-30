/* dark/light theme toggle — the initial theme is set by a tiny
   inline script in <head> (before first paint); this wires the button. */
(function () {
  "use strict";

  function current() {
    return document.documentElement.dataset.theme === "light" ? "light" : "dark";
  }

  function label(btn) {
    btn.textContent = current() === "dark" ? "light" : "dark";
  }

  var btn = document.getElementById("theme-toggle");
  if (!btn) return;
  label(btn);

  btn.addEventListener("click", function () {
    var next = current() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("amandata-theme", next); } catch (e) {}
    label(btn);
  });
})();
