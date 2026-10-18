/* Synergy wiki — full esolangs-style reference. */
(function () {
  "use strict";
  var mount = document.getElementById("page-mount");
  if (!mount) return;
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

        <h3>Contents</h3>
        <ol class="wiki-toc">
          <li><a href="#wiki-overview">Language overview</a></li>
          <li><a href="#wiki-history">History</a></li>
          <li><a href="#wiki-examples">Examples</a>
            <ol>
              <li><a href="#wiki-hello">Hello, World!</a></li>
              <li><a href="#wiki-move">Move value</a></li>
              <li><a href="#wiki-cat">Cat</a></li>
              <li><a href="#wiki-cellsize">Cell size</a></li>
              <li><a href="#wiki-loop">Looping counter</a></li>
              <li><a href="#wiki-truth">Truth machine</a></li>
            </ol>
          </li>
          <li><a href="#wiki-memory">Memory</a></li>
          <li><a href="#wiki-algs">Algorithms</a></li>
          <li><a href="#wiki-issues">Issues and limitations</a></li>
          <li><a href="#wiki-related">Related languages</a></li>
          <li><a href="#wiki-seealso">See also</a></li>
        </ol>

        <h3 id="wiki-overview">Language overview</h3>
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

        <p>Any line starting with <code>per my last email</code> is a comment and ignored. Commands are separated by commas, periods, or newlines. Numbers are also letters. 72 is H, 105 is i, 32 is a space.</p>

        <h3 id="wiki-history">History</h3>
        <p>Synergy was created in 2026 as a satire of corporate meeting culture and a teaching tool. Each buzzword maps one-to-one onto a <a href="https://esolangs.org/wiki/Brainfuck">brainfuck</a> operation, so anything brainfuck can compute, Synergy can compute, but the source reads like meeting notes.</p>

        <h3 id="wiki-examples">Examples</h3>

        <h4 id="wiki-hello">Hello, World!</h4>
        <p>This program prints out the words <i>Hello World!</i>:</p>
        <pre class="wiki-code">per my last email, hello world action items

move the needle (x8),
sync up, pivot, move the needle (x4),
sync up, pivot, move the needle (x2), pivot,
move the needle (x3), pivot, move the needle (x3),
pivot, move the needle, deep dive (x4),
take a step back, circle back,
pivot, move the needle, pivot, move the needle,
pivot, take a step back, pivot (x2), move the needle,
sync up, deep dive, circle back, deep dive,
take a step back, circle back,
pivot (x2), share out,
pivot, take a step back (x3), share out,
move the needle (x7), share out, share out,
move the needle (x3), share out,
pivot (x2), share out,
deep dive, take a step back, share out,
deep dive, share out,
move the needle (x3), share out,
take a step back (x6), share out,
take a step back (x8), share out,
pivot (x2), move the needle, share out,
pivot, move the needle (x2), share out.

hit a bottleneck.</pre>
        <p>It sets up a few cells with a multiplication trick (the nested loops), then nudges each one to the letter it needs and prints it with <code>share out</code>.</p>

        <h4 id="wiki-move">Move value</h4>
        <p>This moves the value of the current cell two cells to the right:</p>
        <pre class="wiki-code">pivot, pivot,
low-hanging fruit,
deep dive, deep dive,
sync up,
  take a step back,
  pivot, pivot,
  move the needle,
  deep dive, deep dive,
circle back.</pre>

        <h4 id="wiki-cat">Cat</h4>
        <p>A cat program copies its input straight to its output:</p>
        <pre class="wiki-code">per my last email, the cat program

sync up,
  gather feedback,
  share out,
circle back.</pre>
        <figure class="wiki-fig">
          <img src="/assets/images/synergy-cat.png" alt="Cat ascii art" loading="lazy">
          <figcaption>Fig. 1: the Synergy cat, drawn by the <a href="/synergy.html">console</a></figcaption>
        </figure>

        <h4 id="wiki-cellsize">Cell size</h4>
        <p>This program outputs the cell width of the interpreter:</p>
        <pre class="wiki-code">per my last email, how big are the cells

move the needle (x8),
sync up, pivot, move the needle (x8), deep dive, take a step back, circle back,
pivot,
sync up, deep dive, move the needle (x4), pivot, take a step back, circle back,
pivot, deep dive,
sync up, pivot, take a step back, deep dive, circle back,
deep dive,
sync up, pivot, take a step back, circle back,
pivot,
move the needle (x10),
sync up, pivot, move the needle (x5), deep dive, take a step back, circle back,
pivot, move the needle, share out, take a step back, share out,
low-hanging fruit, deep dive.</pre>
        <p>If it prints <code>50</code> then <code>56</code>, the cells are 8-bit.</p>

        <h4 id="wiki-loop">Looping counter</h4>
        <p>Counts down from 10, printing each number:</p>
        <pre class="wiki-code">pivot, pivot,
move the needle (x10),
sync up, sync up,
  deep dive, move the needle, deep dive (x2),
  move the needle (x4), pivot,
circle back,
deep dive, move the needle (x2),
sync up, deep dive, circle back,
sync up, pivot, share out, pivot, share out,
deep dive, take a step back, circle back.</pre>

        <h4 id="wiki-truth">Truth machine</h4>
        <p>Takes a single input. If it is <code>1</code>, prints <code>1</code> forever, otherwise prints <code>0</code> once:</p>
        <pre class="wiki-code">per my last email, the truth machine

gather feedback,
take a step back (x48),
sync up,
  share out,
circle back,
move the needle (x48),
share out.</pre>

        <figure class="wiki-fig">
          <img src="/assets/images/synergy-frog.png" alt="Frog ascii art" loading="lazy">
          <figcaption>Fig. 2: frog, dithered</figcaption>
        </figure>

        <h4>Try it</h4>
        <p>The <a href="/synergy.html">Synergy console</a> runs every command above. You can type one of the buzzwords from the key, hit enter, and watch the tape debugger show what changed.</p>

        <p><img src="/assets/images/synergy-typing.gif" alt="Synergy code being typed into the console" width="400" height="120" loading="lazy"></p>

        <h3 id="wiki-memory">Memory</h3>
        <p>The tape starts with 6 cells, all zero, and grows to the right as the pointer moves. The pointer starts at cell 0. There is no fixed upper bound in the reference interpreter. Each cell holds an integer; <code>share out</code> interprets it as a character code.</p>

        <h3 id="wiki-algs">Algorithms</h3>
        <p>Common patterns, in Synergy terms:</p>
        <ul>
          <li><b>Clear a cell:</b> <code>low-hanging fruit</code>, or the classic <code>sync up, take a step back, circle back</code>.</li>
          <li><b>Multiply:</b> nested <code>sync up</code> / <code>circle back</code> loops, as in the Hello World setup.</li>
          <li><b>Copy:</b> see <a href="#wiki-move">Move value</a> above.</li>
          <li><b>Snapshot and restore:</b> <code>put a pin in it</code> before a risky section, <code>pull the pin</code> to undo.</li>
        </ul>

        <h3 id="wiki-issues">Issues and limitations</h3>
        <ul>
          <li><b>Line-by-line console:</b> the web console runs one line at a time, so a <code>sync up</code> without its <code>circle back</code> on the same line will fail. Multi-line programs belong in the full-page runner.</li>
          <li><b>Step cap:</b> the console stops a line after 1,000,000 steps to keep the page responsive. Infinite loops halt with an error instead of hanging the tab.</li>
          <li><b><code>herding cats</code> is nondeterministic:</b> programs using it cannot be replayed exactly.</li>
          <li><b>No functions or named variables:</b> like brainfuck, all state lives on the tape.</li>
        </ul>

        <h3 id="wiki-related">Related languages</h3>
        <ul>
          <li><a href="https://esolangs.org/wiki/Brainfuck">brainfuck</a> — the 8-command language Synergy maps onto, one buzzword per operation.</li>
          <li><a href="https://esolangs.org/wiki/Shakespeare">Shakespeare</a> — programs written as plays; the same satirical impulse, applied to theatre instead of meetings.</li>
          <li><a href="https://esolangs.org/wiki/Corporate">Corporate</a> — another meeting-themed esolang on the wiki, if it exists when you read this.</li>
        </ul>

        <h3 id="wiki-seealso">See also</h3>
        <ul>
          <li><a href="/synergy.html">Synergy console</a> — run it in your browser</li>
          <li><a href="/blog.html?p=synergy-corporate-buzzword-esolang">Blog post</a> — how and why it was built</li>
          <li><a href="https://github.com/mandyhoami-lab/synergy">Repo</a> — interpreter source</li>
          <li><a href="https://esolangs.org/wiki/Esoteric_programming_language">esolangs.org</a> — the wiki for esoteric programming languages</li>
        </ul>

        <p class="games-note"><a href="/creations.html">&larr; Back to Creations</a></p>
        <p class="wiki-credit">Wiki format inspired by <a href="https://esolangs.org/wiki/Esoteric_programming_language">esolangs.org</a>, the wiki for esoteric programming languages.</p>
      </div>
    </div>
  </section>

</main>`;
})();
