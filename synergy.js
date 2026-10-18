"use strict";
/* Synergy console shell — vignette + main, injected so the .html file stays a thin shell. */
(function () {
    "use strict";
    var mount = document.getElementById("page-mount");
    if (!mount)
        return;
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
        <p class="syn-hello">Hello &mdash; you can find the blogpost on this <a href="/blog.html?p=synergy-corporate-buzzword-esolang">here</a>.</p>
        <p class="syn-explain">Type buzzwords below and hit enter — the console runs each line and shows you what changed. This is how you learn the syntax.</p>
        <div class="syn-presets">
          <button type="button" data-preset="hi"><b>Say hi</b><span>prints "Hi"</span></button>
          <button type="button" data-preset="count"><b>Count to 5</b><span>prints 12345</span></button>
          <button type="button" data-preset="hello"><b>Hello world</b><span>the classic, in Synergy</span></button>
        </div>
        <div class="syn-debug" id="syn-debug" aria-label="tape inspector"></div>
        <div class="syn-console" id="syn-console" aria-live="polite"></div>
        <div class="syn-inputrow">
          <span class="syn-prompt" aria-hidden="true">&gt;</span>
          <input id="syn-input" type="text" spellcheck="false" autocomplete="off" aria-label="type synergy code" placeholder="move the needle">
        </div>
        <div class="syn-row">
          <button id="syn-reset" type="button">reset the meeting</button>
        </div>
        <div class="syn-cheat">
          <p class="syn-cheat__head">Buzzwords key</p>
          <b>move the needle</b> — count up by one &middot;
          <b>take a step back</b> — count down by one<br>
          <b>pivot</b> / <b>deep dive</b> — move to the next / previous slot<br>
          <b>share out</b> — print the current slot as a letter &middot;
          <b>gather feedback</b> — read a typed letter in<br>
          <b>sync up</b> … <b>circle back</b> — repeat everything between, until the slot hits zero<br>
          <b>hit a bottleneck</b> — stop &middot;
          <b>per my last email</b> — a comment, the computer ignores the line
        </div>
        <p class="games-note"><a href="/creations.html">&larr; Back to Creations</a></p>
      </div>
    </div>
  </section>

</main>`;
    var PRESETS = {};
    function fmtProgram(phrases, comment) {
        var lines = [comment, ""];
        for (var i = 0; i < phrases.length; i += 5) {
            lines.push(phrases.slice(i, i + 5).join(", ") + ".");
        }
        lines.push("", "hit a bottleneck.");
        return lines.join("\n");
    }
    function getPreset(name) {
        if (PRESETS[name])
            return PRESETS[name];
        var prog;
        if (name === "count") {
            var bf = "";
            for (var i = 0; i < 49; i++)
                bf += "+";
            bf += ".+.+.+.+.";
            prog = fmtProgram(window.Synergy.fromBrainfuck(bf).split(". "), "per my last email, counting to five");
        }
        else if (name === "hello") {
            var helloBf = "++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.";
            prog = fmtProgram(window.Synergy.fromBrainfuck(helloBf).split(". "), "per my last email, here are the action items from standup");
        }
        else {
            var hiBf = "++++++++[>+++++++++<-]>.";
            for (var j = 0; j < 33; j++)
                hiBf += "+";
            hiBf += ".";
            prog = fmtProgram(window.Synergy.fromBrainfuck(hiBf).split(". "), "per my last email, just saying hi");
        }
        PRESETS[name] = prog;
        return prog;
    }
    var session = window.Synergy.createSession();
    var con = document.getElementById("syn-console");
    var debug = document.getElementById("syn-debug");
    var input = document.getElementById("syn-input");
    var resetBtn = document.getElementById("syn-reset");
    function esc(s) {
        return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    /* debug: show the tape with the pointer highlighted */
    function renderDebug() {
        var st = session.state();
        var cells = [];
        var n = Math.max(st.tape.length, 6);
        for (var i = 0; i < n; i++) {
            var v = st.tape[i] || 0;
            var cls = i === st.ptr ? "syn-cell syn-cell--ptr" : "syn-cell";
            /* show printable chars too, so share out makes sense */
            var ch = v >= 32 && v < 127 ? " '" + String.fromCharCode(v) + "'" : "";
            cells.push('<span class="' + cls + '">' + v + ch + "</span>");
        }
        debug.innerHTML = '<span class="syn-debug__label">tape</span>' + cells.join("");
    }
    function logLine(html, cls) {
        var div = document.createElement("div");
        div.className = "syn-line" + (cls ? " " + cls : "");
        div.innerHTML = html;
        con.appendChild(div);
        con.scrollTop = con.scrollHeight;
    }
    function printable(out) {
        /* show control chars as codes so learners see what share out actually did */
        return out.split("").map(function (c) {
            var code = c.charCodeAt(0);
            return code >= 32 && code < 127 ? c : "&#9000;" + code;
        }).join("");
    }
    function submit(src) {
        var line = src.trim();
        if (!line)
            return;
        logLine('<span class="syn-echo">&gt; ' + esc(line) + "</span>");
        try {
            var out = session.exec(line);
            if (out)
                logLine('<span class="syn-out">' + printable(esc(out)) + "</span>");
            var st = session.state();
            logLine('<span class="syn-state">cell[' + st.ptr + "] = " + (st.tape[st.ptr] || 0) + "</span>", "syn-line--dim");
        }
        catch (e) {
            logLine('<span class="syn-err">the meeting went off the rails: ' + esc(e instanceof Error ? e.message : String(e)) + "</span>");
        }
        renderDebug();
    }
    input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            submit(input.value);
            input.value = "";
        }
    });
    resetBtn.addEventListener("click", function () {
        session.reset();
        con.innerHTML = "";
        renderDebug();
        logLine('<span class="syn-state">fresh meeting. tape cleared.</span>', "syn-line--dim");
        input.focus();
    });
    var presetBtns = document.querySelectorAll(".syn-presets button");
    for (var k = 0; k < presetBtns.length; k++) {
        (function (btn) {
            btn.addEventListener("click", function () {
                var name = btn.getAttribute("data-preset") || "hi";
                session.reset();
                con.innerHTML = "";
                submit(getPreset(name));
                input.focus();
            });
        })(presetBtns[k]);
    }
    renderDebug();
    logLine('<span class="syn-state">welcome to the synergy console. type a buzzword and hit enter.</span>', "syn-line--dim");
    input.focus();
})();
