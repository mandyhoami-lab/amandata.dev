/* Synergy console v2 — named counters. */
(function () {
  "use strict";
  var mount = document.getElementById("page-mount");
  if (!mount) return;
  mount.outerHTML = `<div class="vignette" aria-hidden="true"></div>

<main>

  <section class="section" id="synergy">
    <div class="section__head">
      <p class="section__tag">esolang</p>
      <h2 class="section__title">Synergy</h2>
      <p class="creations-intro">programming language made of office buzzwords.<br>
      every program reads like a standup meeting, and the computer runs it.</p>
    </div>
    <div class="section__body">
      <div class="syn-wrap">
        <p class="syn-hello">Hello, you can find the blogpost on this <a href="/blog.html?p=synergy-corporate-buzzword-esolang">here</a>.</p>
        <p class="syn-hello">You can find the full wiki on this language <a href="/synergy-wiki.html">here</a>.</p>
        <div class="syn-row">
          <button id="syn-howto-btn" type="button">how to use this console</button>
        </div>
        <div class="syn-howto" id="syn-howto" hidden>
          <p><b>1.</b> Type a buzzword (or a few, separated by commas) into the box and hit enter.</p>
          <p><b>2.</b> The console runs it right away. The variable inspector above always shows your named counters.</p>
          <p><b>3.</b> Try <i>hire headcount</i> three times, watch headcount go up.</p>
          <p><b>4.</b> <i>share out headcount</i> prints it as a letter, numbers are also letters (72 is H, that's ASCII).</p>
          <p><b>5.</b> Loops need <i>while x is nonzero</i> … <i>circle back</i> on the same line. The preset buttons run full programs.</p>
        </div>
        <p class="syn-explain">Type buzzwords below and hit enter, the console runs each line and shows you what changed.</p>
        <div class="syn-examples-wrap">
          <p class="syn-examples__label">example programs</p>
          <div class="syn-examples" id="syn-examples" role="group" aria-label="example programs"></div>
        </div>
        <div class="syn-debug" id="syn-debug" aria-label="variable inspector"></div>
        <p class="syn-examples__label">output</p>
        <div class="syn-console" id="syn-console" aria-live="polite"></div>
        <div class="syn-inputrow">
          <span class="syn-prompt" aria-hidden="true">&gt;</span>
          <input id="syn-input" type="text" spellcheck="false" autocomplete="off" aria-label="type synergy code">
        </div>
        <div class="syn-row">
          <button id="syn-reset" type="button">reset the meeting</button>
        </div>
        <div class="syn-cheat">
          <p class="syn-cheat__head">Buzzwords key</p>
          <p class="syn-cheat__intro">Synergy runs on named counters. Pick names like <i>headcount</i> or <i>budget</i>, they start at 0.</p>
          <b>hire x</b>, add 1 to x &middot;
          <b>move the needle on x</b>, same as hire<br>
          <b>layoff x</b>, subtract 1 from x<br>
          <b>increase x by 40</b>, add 40 to x &middot;
          <b>decrease x by 40</b>, subtract 40<br>
          <b>set x to 72</b>, set x to 72<br>
          <b>while x is nonzero</b> … <b>circle back</b>, loop while x is not 0<br>
          <b>share out x</b>, print x as a letter &middot;
          <b>report x</b>, print x as a number<br>
          <b>gather feedback into x</b>, read a character into x<br>
          <b>hit a bottleneck</b>, stop the program<br>
          <b>per my last email</b>, a comment, ignored
        </div>
      </div>
    </div>
  </section>

</main>`;

  var input = document.getElementById("syn-input") as HTMLInputElement;
  var resetBtn = document.getElementById("syn-reset") as HTMLButtonElement;
  var howtoBtn = document.getElementById("syn-howto-btn") as HTMLButtonElement | null;
  var howto = document.getElementById("syn-howto") as HTMLElement | null;
  if (howtoBtn && howto) {
    howtoBtn.addEventListener("click", function () {
      howto!.hidden = !howto!.hidden;
    });
  }
  var con = document.getElementById("syn-console") as HTMLElement;
  var debug = document.getElementById("syn-debug") as HTMLElement;
  var examplesEl = document.getElementById("syn-examples") as HTMLElement;

  var EXAMPLES: { id: string; label: string; desc: string }[] = [
    { id: "hi", label: "Say hi", desc: 'prints "Hi"' },
    { id: "count", label: "Count to 5", desc: "prints 1 2 3 4 5" },
    { id: "add", label: "Add 3 + 4", desc: "prints 7" },
    { id: "loop", label: "Countdown", desc: "5 4 3 2 1" },
  ];

  var PRESETS: { [k: string]: string } = {};
  function getPreset(name: string): string {
    if (PRESETS[name]) return PRESETS[name];
    var prog: string;
    if (name === "hi") {
      prog = "per my last email, just saying hi\n\nset h to 72, share out h, set i to 105, share out i.\n\nhit a bottleneck.";
    } else if (name === "count") {
      prog = "per my last email, counting to five\n\nset n to 1, while n is nonzero, report n, hire n, decrease n by 0, circle back.\n\nper my last email, that loops forever, so instead:\n\nset n to 5, set i to 1, while i is nonzero, report i, hire i, layoff n, circle back.\n\nhit a bottleneck.";
    } else if (name === "add") {
      prog = "per my last email, adding 3 and 4\n\nset a to 3, set b to 4, increase a by 4, report a.\n\nhit a bottleneck.";
    } else if (name === "loop") {
      prog = "per my last email, counting down\n\nset n to 5, while n is nonzero, report n, layoff n, circle back.\n\nhit a bottleneck.";
    } else {
      prog = "per my last email, just saying hi\n\nset h to 72, share out h, set i to 105, share out i.\n\nhit a bottleneck.";
    }
    PRESETS[name] = prog;
    return prog;
  }

  var session = window.Synergy.createSession();

  /* debug: show named variables as a grid */
  function renderDebug(): void {
    var st = session.state();
    var names = Object.keys(st.vars).sort();
    var cells: string[] = [];
    if (names.length === 0) {
      debug.innerHTML = '<span class="syn-debug__label">variables</span><span class="syn-debug__empty">no counters yet, try <i>hire headcount</i></span>';
      return;
    }
    names.forEach(function (name) {
      var v = st.vars[name];
      var ch = v >= 32 && v < 127 ? String.fromCharCode(v) : " ";
      cells.push('<div class="syn-cell">' +
        '<span class="syn-cell__idx">' + esc(name) + "</span>" +
        '<span class="syn-cell__val">' + v + "</span>" +
        '<span class="syn-cell__char">' + esc(ch) + "</span>" +
        "</div>");
    });
    debug.innerHTML = '<span class="syn-debug__label">variables</span><div class="syn-grid">' + cells.join("") + "</div>";
  }

  function esc(s: string): string {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function logLine(html: string, cls?: string): void {
    var div = document.createElement("div");
    div.className = "syn-line" + (cls ? " " + cls : "");
    div.innerHTML = html;
    con.appendChild(div);
    con.scrollTop = con.scrollHeight;
  }

  function printable(out: string): string {
    return out.split("").map(function (c) {
      var code = c.charCodeAt(0);
      if (code === 10 || code === 13 || code === 9) return c;
      return code >= 32 && code < 127 ? c : "&#9000;" + code;
    }).join("");
  }

  function submit(src: string): void {
    var line = src.trim();
    if (!line) return;
    logLine('<span class="syn-echo">&gt; ' + esc(line) + "</span>");
    try {
      var out = session.exec(line);
      if (out) logLine('<span class="syn-out">' + printable(esc(out)) + "</span>");
      var st = session.state();
      var names = Object.keys(st.vars).sort();
      var summary = names.map(function (n) { return n + "=" + st.vars[n]; }).join(", ") || "no variables";
      logLine('<span class="syn-state">' + esc(summary) + "</span>", "syn-line--dim");
    } catch (e) {
      var msg = e instanceof Error ? e.message : String(e);
      logLine('<span class="syn-err">that didn\u2019t run: ' + esc(msg) + "</span>");
      var hint = "";
      if (msg.indexOf("circle back without while") >= 0) hint = "every circle back needs a while before it.";
      else if (msg.indexOf("while without circle back") >= 0) hint = "every while needs a circle back after it.";
      else if (msg.indexOf("I don't know") === 0) hint = "check the buzzwords key below for the exact phrasing.";
      if (hint) logLine('<span class="syn-hint">try this: ' + esc(hint) + "</span>");
    }
    renderDebug();
  }

  input.addEventListener("keydown", function (e: KeyboardEvent) {
    if (e.key === "Enter") {
      submit(input.value);
      input.value = "";
    }
  });
  resetBtn.addEventListener("click", function () {
    session.reset();
    con.innerHTML = "";
    logLine('<span class="syn-state">fresh meeting. counters cleared.</span>', "syn-line--dim");
    renderDebug();
  });

  function renderExamples(): void {
    EXAMPLES.forEach(function (ex) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "syn-example";
      b.innerHTML = "<b>" + ex.label + "</b><span>" + ex.desc + "</span>";
      b.addEventListener("click", function () {
        session.reset();
        con.innerHTML = "";
        submit(getPreset(ex.id));
      });
      examplesEl.appendChild(b);
    });
  }
  renderExamples();

  renderDebug();
  logLine('<span class="syn-state">welcome to the synergy console. type a buzzword and hit enter.</span>', "syn-line--dim");
})();
