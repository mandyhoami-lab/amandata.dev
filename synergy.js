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
      <p class="creations-intro">a programming language where the only keywords are corporate buzzwords.<br>write a standup, run a program.</p>
    </div>
    <div class="section__body">
      <div class="syn-wrap">
        <textarea id="syn-src" spellcheck="false" aria-label="synergy program"></textarea>
        <div class="syn-row">
          <button id="syn-run" type="button">run the meeting</button>
          <button id="syn-hi" type="button" class="syn-ghost">hello world</button>
        </div>
        <pre id="syn-out" aria-live="polite">(output appears here)</pre>
        <div class="syn-cheat">
          <b>move the needle</b> +1 &middot; <b>take a step back</b> &minus;1 &middot; <b>pivot</b> &rarr; &middot; <b>deep dive</b> &larr;<br>
          <b>share out</b> print &middot; <b>gather feedback</b> read input &middot; <b>sync up</b> / <b>circle back</b> loop<br>
          <b>hit a bottleneck</b> halt &middot; <b>per my last email</b> starts a comment line
        </div>
        <p class="games-note"><a href="/creations.html">&larr; Back to Creations</a></p>
      </div>
    </div>
  </section>

</main>`;
    var HI_PROGRAM = null;
    function hiProgram() {
        if (HI_PROGRAM)
            return HI_PROGRAM;
        // "Hi": 8x9=72='H', then +33=105='i'
        var bf = "++++++++[>+++++++++<-]>.+++++++++++++++++++++++++++++++++.";
        var phrases = window.Synergy.fromBrainfuck(bf).split(". ");
        var lines = ["per my last email, just saying hi", ""];
        for (var i = 0; i < phrases.length; i += 5) {
            lines.push(phrases.slice(i, i + 5).join(", ") + ".");
        }
        lines.push("", "hit a bottleneck.");
        HI_PROGRAM = lines.join("\n");
        return HI_PROGRAM;
    }
    var src = document.getElementById("syn-src");
    var out = document.getElementById("syn-out");
    var runBtn = document.getElementById("syn-run");
    var hiBtn = document.getElementById("syn-hi");
    src.value = hiProgram();
    runBtn.addEventListener("click", function () {
        try {
            out.textContent = window.Synergy.run(src.value) || "(no output \u2014 the meeting could have been an email)";
        }
        catch (e) {
            out.textContent = "the meeting went off the rails: " + (e instanceof Error ? e.message : String(e));
        }
    });
    hiBtn.addEventListener("click", function () {
        src.value = hiProgram();
        runBtn.click();
    });
})();
