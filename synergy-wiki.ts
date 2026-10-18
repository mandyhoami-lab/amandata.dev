/* Synergy wiki shell — vignette + main, injected so the .html file stays a thin shell. */
(function () {
  "use strict";
  var mount = document.getElementById("page-mount");
  if (!mount) return;
  mount.outerHTML = `<div class="vignette" aria-hidden="true"></div>

<main>

  <section class="section" id="synergy-wiki">
    <div class="section__head">
      <p class="section__tag">esolang</p>
      <h2 class="section__title">Synergy Wiki</h2>
      <p class="creations-intro">every buzzword, in plain language.</p>
    </div>
    <div class="section__body">
      <div class="wiki-wrap">

        <h3>How it works</h3>
        <p>Synergy has a row of numbered boxes called the <b>tape</b>. Each box (a <b>cell</b>) holds one number, from 0 to 255. You're always pointing at one cell. Every buzzword does one small thing: change the number, move the pointer, print something, or repeat.</p>
        <p>Numbers are secretly letters. 72 is H, 105 is i, 32 is a space — that's just how computers do it. So counting a cell up to 72 and printing it gives you H.</p>

        <h3>Changing numbers</h3>
        <dl class="wiki-dl">
          <dt><b>move the needle</b></dt><dd>Add 1 to the cell you're pointing at.</dd>
          <dt><b>take a step back</b></dt><dd>Subtract 1 from the cell you're pointing at.</dd>
          <dt><b>low-hanging fruit</b></dt><dd>Set the current cell to 0. The easy win.</dd>
          <dt><b>herding cats</b></dt><dd>Set the current cell to a random number. Chaos mode.</dd>
        </dl>

        <h3>Moving around</h3>
        <dl class="wiki-dl">
          <dt><b>pivot</b></dt><dd>Point at the next cell to the right.</dd>
          <dt><b>deep dive</b></dt><dd>Point at the previous cell to the left.</dd>
        </dl>

        <h3>Input and output</h3>
        <dl class="wiki-dl">
          <dt><b>share out</b></dt><dd>Print the current cell as a letter.</dd>
          <dt><b>double-click on that</b></dt><dd>Print the current cell as a number instead of a letter.</dd>
          <dt><b>run it up the flagpole</b></dt><dd>Print the whole tape — every cell's number, all at once.</dd>
          <dt><b>gather feedback</b></dt><dd>Read a typed letter into the current cell.</dd>
        </dl>

        <h3>Loops</h3>
        <dl class="wiki-dl">
          <dt><b>sync up</b> … <b>circle back</b></dt><dd>Repeat everything between the two, until the current cell hits zero. They always come in pairs, on the same line in the console.</dd>
        </dl>

        <h3>Saving your place</h3>
        <dl class="wiki-dl">
          <dt><b>put a pin in it</b></dt><dd>Save a snapshot of the tape — where you are and every number. You can pin more than once; they stack.</dd>
          <dt><b>pull the pin</b></dt><dd>Go back to the most recent pin. The tape jumps back to exactly how it was.</dd>
        </dl>

        <h3>Stopping and ignoring</h3>
        <dl class="wiki-dl">
          <dt><b>hit a bottleneck</b></dt><dd>Stop the program. Every corporate program ends at a bottleneck.</dd>
          <dt><b>per my last email</b></dt><dd>A comment. Anything on the line after this is ignored by the computer.</dd>
        </dl>

        <h3>Try it</h3>
        <p>The best way to learn is the <a href="/synergy.html">Synergy console</a> — type a buzzword, hit enter, and watch the tape debugger show you what changed.</p>

        <p class="games-note"><a href="/creations.html">&larr; Back to Creations</a></p>
      </div>
    </div>
  </section>

</main>`;
})();
