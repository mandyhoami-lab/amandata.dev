"use strict";
/* Synergy wiki shell — vignette + main, injected so the .html file stays a thin shell. */
(function () {
    "use strict";
    var mount = document.getElementById("page-mount");
    if (!mount)
        return;
    mount.outerHTML = `<div class="vignette" aria-hidden="true"></div>

<main>

  <section class="section" id="synergy-wiki">
    <div class="section__head">
      <p class="section__tag">esolang</p>
      <h2 class="section__title">Synergy</h2>
    </div>
    <div class="section__body">
      <div class="wiki-wrap">

        <table class="wiki-infobox">
          <tr><th>Paradigm(s)</th><td>imperative</td></tr>
          <tr><th>Designed by</th><td>mandy</td></tr>
          <tr><th>Appeared in</th><td>2026</td></tr>
          <tr><th>Memory system</th><td>cell-based</td></tr>
          <tr><th>Dimensions</th><td>one-dimensional</td></tr>
          <tr><th>Computational class</th><td>Turing complete</td></tr>
          <tr><th>File extension(s)</th><td><code>.synergy</code></td></tr>
        </table>

        <p><b>Synergy</b> is an esoteric programming language where the only keywords are corporate buzzwords. Every program reads like a standup meeting, and the computer runs it.</p>

        <h3>Language overview</h3>
        <p>Synergy operates on an array of memory cells (the <b>tape</b>), each initially set to zero. There is a pointer, initially pointing at the first cell. The commands are:</p>

        <table class="wiki-cmds">
          <tr><th>Command</th><th>Description</th></tr>
          <tr><td><code>move the needle</code></td><td>Increment the memory cell at the pointer</td></tr>
          <tr><td><code>take a step back</code></td><td>Decrement the memory cell at the pointer</td></tr>
          <tr><td><code>pivot</code></td><td>Move the pointer to the right</td></tr>
          <tr><td><code>deep dive</code></td><td>Move the pointer to the left</td></tr>
          <tr><td><code>share out</code></td><td>Output the character signified by the cell at the pointer</td></tr>
          <tr><td><code>double-click on that</code></td><td>Output the numeric value of the cell at the pointer</td></tr>
          <tr><td><code>run it up the flagpole</code></td><td>Output the numeric values of every cell on the tape</td></tr>
          <tr><td><code>gather feedback</code></td><td>Input a character and store it in the cell at the pointer</td></tr>
          <tr><td><code>sync up</code></td><td>Jump past the matching <code>circle back</code> if the cell at the pointer is 0</td></tr>
          <tr><td><code>circle back</code></td><td>Jump back to the matching <code>sync up</code> if the cell at the pointer is nonzero</td></tr>
          <tr><td><code>low-hanging fruit</code></td><td>Set the cell at the pointer to 0</td></tr>
          <tr><td><code>herding cats</code></td><td>Set the cell at the pointer to a random value</td></tr>
          <tr><td><code>put a pin in it</code></td><td>Save a snapshot of the tape and pointer</td></tr>
          <tr><td><code>pull the pin</code></td><td>Restore the most recent snapshot</td></tr>
          <tr><td><code>hit a bottleneck</code></td><td>Halt the program</td></tr>
        </table>

        <p>Any line starting with <code>per my last email</code> is a comment and ignored. Numbers are also letters. 72 is H, 105 is i, 32 is a space.</p>

        <h3>Examples</h3>
        <h4>Hello, World!</h4>
        <p>This program prints out the words <i>Hello World!</i>:</p>
        <pre class="wiki-code">per my last email, here are the action items from standup

move the needle, move the needle, move the needle, move the needle,
move the needle, move the needle, move the needle, move the needle,
sync up, pivot, move the needle, move the needle, move the needle,
move the needle, deep dive, take a step back, circle back, pivot,
share out, pivot, take a step back, take a step back, take a step back,
share out, move the needle, move the needle, move the needle,
move the needle, move the needle, move the needle, move the needle,
share out, share out, move the needle, move the needle, move the needle,
share out, pivot, pivot, share out, deep dive, take a step back,
share out, deep dive, share out, move the needle, move the needle,
move the needle, share out, take a step back, take a step back,
take a step back, take a step back, take a step back, take a step back,
share out, take a step back, take a step back, take a step back,
take a step back, take a step back, take a step back, take a step back,
take a step back, share out, pivot, pivot, move the needle, share out,
pivot, move the needle, move the needle, share out.

hit a bottleneck.</pre>

        <h4>Try it</h4>
        <p>The <a href="/synergy.html">Synergy console</a> runs every command above — type a buzzword, hit enter, and watch the tape debugger show what changed.</p>

        <p class="games-note"><a href="/creations.html">&larr; Back to Creations</a></p>
      </div>
    </div>
  </section>

</main>`;
})();
