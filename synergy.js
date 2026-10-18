"use strict";
/* Synergy playground shell — vignette + main, injected so the .html file stays a thin shell. */
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
      <p class="creations-intro">Hello, you can find the blogpost <a href="/blog.html?p=synergy-corporate-buzzword-esolang">here</a>.</p>
    </div>
    <div class="section__body">
      <div class="syn-wrap">
        <p class="syn-explain">Pick an example to see the syntax, or try writing your own code below.</p>
        <div class="syn-presets">
          <button type="button" data-preset="hi"><b>Say hi</b><span>prints "Hi"</span></button>
          <button type="button" data-preset="count"><b>Count to 5</b><span>prints 12345</span></button>
          <button type="button" data-preset="hello"><b>Hello world</b><span>the classic, as meeting notes</span></button>
        </div>
        <textarea id="syn-src" spellcheck="false" aria-label="synergy program"></textarea>
        <div class="syn-row">
          <button id="syn-run" type="button">run the meeting</button>
        </div>
        <pre id="syn-out" aria-live="polite">(output appears here)</pre>
        <div class="syn-cheat">
          <p class="syn-cheat__head">what the buzzwords mean</p>
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
            // '1' is code 49, then +1 and print four more times -> 12345
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
            // "Hi": 8x9=72='H', then +33=105='i'
            var hiBf = "++++++++[>+++++++++<-]>.";
            for (var j = 0; j < 33; j++)
                hiBf += "+";
            hiBf += ".";
            prog = fmtProgram(window.Synergy.fromBrainfuck(hiBf).split(". "), "per my last email, just saying hi");
        }
        PRESETS[name] = prog;
        return prog;
    }
    var src = document.getElementById("syn-src");
    var out = document.getElementById("syn-out");
    var runBtn = document.getElementById("syn-run");
    function runIt() {
        try {
            out.textContent = window.Synergy.run(src.value) || "(no output \u2014 the meeting could have been an email)";
        }
        catch (e) {
            out.textContent = "the meeting went off the rails: " + (e instanceof Error ? e.message : String(e));
        }
    }
    src.value = getPreset("hi");
    runBtn.addEventListener("click", runIt);
    var presetBtns = document.querySelectorAll(".syn-presets button");
    for (var k = 0; k < presetBtns.length; k++) {
        (function (btn) {
            btn.addEventListener("click", function () {
                var name = btn.getAttribute("data-preset") || "hi";
                src.value = getPreset(name);
                runIt();
                src.scrollIntoView({ block: "nearest", behavior: "smooth" });
            });
        })(presetBtns[k]);
    }
})();
