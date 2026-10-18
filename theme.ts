/* Theme picker, solid "Change Theme" button; each theme listed under it.
   The initial theme is set by a tiny inline script in <head>
   (before first paint); this wires the picker. */
(function () {
  "use strict";

  var THEMES: string[] = ["dark", "light", "white", "pink", "blue"];

  function current(): string {
    var t: string | undefined = document.documentElement.dataset.theme;
    return (t !== undefined && THEMES.indexOf(t) !== -1) ? t : "dark";
  }

  /* theme-color meta (overscroll / browser chrome on mobile) follows the theme bg */
  var THEME_BGS: { [theme: string]: string } = {
    white: "#FFFFFF",
    dark: "#0A0C0A",
    light: "#F7F3E9",
    pink: "#F5F4F2",
    blue: "#0A1220"
  };
  function syncThemeColor(): void {
    var m = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    if (m) m.setAttribute("content", THEME_BGS[current()] || THEME_BGS.dark);
  }

  /* Othello landing icon follows the theme, one gif variant per theme. */
  var DEMO_GIFS: { [theme: string]: string } = {
    white: "/assets/images/othello-demo-white.gif",
    dark: "/assets/images/othello-demo.gif",
    light: "/assets/images/othello-demo-light.gif",
    pink: "/assets/images/othello-demo-pink.gif",
    blue: "/assets/images/othello-demo-blue.gif"
  };
  function syncDemoGif(): void {
    var img = document.getElementById("mode-demo-gif") as HTMLImageElement | null;
    if (!img) return;
    var src = DEMO_GIFS[current()] || DEMO_GIFS.dark;
    if (img.getAttribute("src") !== src) img.setAttribute("src", src);
  }

  syncDemoGif();

  /* Non-null after the guard below (which still runs at runtime). */
  const btn = document.getElementById("theme-toggle") as HTMLElement | null;
  const menu = document.getElementById("theme-menu") as HTMLElement | null;
  if (!btn || !menu) return;
  /* Non-null inside closures below (TS does not narrow captured consts). */
  const btnEl: HTMLElement = btn;
  const menuEl: HTMLElement = menu;
  /* normalize anything stale to a known theme */
  if (THEMES.indexOf(document.documentElement.dataset.theme || "") === -1) {
    document.documentElement.dataset.theme = "dark";
  }

  var opts: HTMLElement[] = Array.prototype.slice.call(
    menuEl.querySelectorAll("[data-theme-name]")
  );

  function markCurrent(): void {
    var c = current();
    opts.forEach(function (o) {
      if (o.getAttribute("data-theme-name") === c) o.setAttribute("aria-current", "true");
      else o.removeAttribute("aria-current");
    });
  }

  function setTheme(name: string): void {
    if (THEMES.indexOf(name) === -1) return;
    document.documentElement.dataset.theme = name;
    try { localStorage.setItem("amandata-theme", name); } catch (e) {}
    markCurrent();
    syncDemoGif();
    syncThemeColor();
  }

  function isOpen(): boolean { return !menuEl.hasAttribute("hidden"); }
  function open(): void {
    menuEl.removeAttribute("hidden");
    btnEl.setAttribute("aria-expanded", "true");
  }
  function close(): void {
    menuEl.setAttribute("hidden", "");
    btnEl.setAttribute("aria-expanded", "false");
  }

  markCurrent();
  syncThemeColor();

  btnEl.addEventListener("click", function (e) {
    e.stopPropagation();
    if (isOpen()) close(); else open();
  });
  opts.forEach(function (o) {
    o.addEventListener("click", function () {
      setTheme(o.getAttribute("data-theme-name") || "");
      close();
      btnEl.focus();
    });
  });
  document.addEventListener("click", function (e) {
    var t = e.target as HTMLElement | null;
    if (isOpen() && t && !menuEl.contains(t)) close();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen()) { close(); btnEl.focus(); }
  });

  /* catch theme changes from any other source */
  try {
    var mo = new MutationObserver(function () { markCurrent(); syncDemoGif(); syncThemeColor(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  } catch (e) { /* fail open */ }
})();
