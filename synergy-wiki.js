"use strict";
/* Synergy wiki v2 — named counters. */
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
          <tr><th>Memory system</th><td>named counters</td></tr>
          <tr><th>Dimensions</th><td>n/a (no tape)</td></tr>
          <tr><th>Computational class</th><td>Turing complete</td></tr>
          <tr><th>File extension(s)</th><td><code>.synergy</code></td></tr>
        </table>

        <p><b>Synergy</b> is an esoteric programming language where the only keywords are corporate buzzwords. Every program reads like a standup meeting, and the computer runs it.</p>

        <h3>Contents</h3>
        <ol class="wiki-toc">
          <li><a href="#wiki-overview">Language overview</a></li>
          <li><a href="#wiki-history">History</a></li>
          <li><a href="#wiki-compare">Synergy vs brainfuck</a></li>
          <li><a href="#wiki-examples">Examples</a></li>
          <li><a href="#wiki-memory">Memory</a></li>
          <li><a href="#wiki-issues">Issues and limitations</a></li>
          <li><a href="#wiki-related">Related languages</a></li>
          <li><a href="#wiki-seealso">See also</a></li>
        </ol>

        <h3 id="wiki-overview">Language overview</h3>
        <p>Synergy runs on <b>named counters</b>: integer variables with names like <code>headcount</code> or <code>budget</code>. Every counter starts at 0 and holds an unbounded integer. There is no tape and no pointer. The commands are:</p>

        <table class="wiki-cmds">
          <tr><th>Command</th><th>Description</th></tr>
          <tr><td><code>hire x</code> / <code>move the needle on x</code></td><td>Add 1 to x</td></tr>
          <tr><td><code>layoff x</code></td><td>Subtract 1 from x</td></tr>
          <tr><td><code>increase x by 40</code></td><td>Add 40 to x (any integer)</td></tr>
          <tr><td><code>decrease x by 40</code></td><td>Subtract 40 from x</td></tr>
          <tr><td><code>set x to 72</code></td><td>Set x to 72</td></tr>
          <tr><td><code>while x is nonzero</code></td><td>Jump past the matching <code>circle back</code> if x is 0</td></tr>
          <tr><td><code>circle back</code></td><td>Jump back to the matching <code>while</code> if x is nonzero</td></tr>
          <tr><td><code>share out x</code></td><td>Output x as a character (ASCII)</td></tr>
          <tr><td><code>report x</code></td><td>Output x as a number</td></tr>
          <tr><td><code>gather feedback into x</code></td><td>Read a character into x</td></tr>
          <tr><td><code>hit a bottleneck</code></td><td>Halt the program</td></tr>
        </table>

        <p>Any line starting with <code>per my last email</code> is a comment and ignored. Commands are separated by commas, periods, or newlines. Numbers are also letters: 72 is H, 105 is i, 32 is a space, that's ASCII, the standard pretty much all computers use.</p>

        <h3 id="wiki-history">History</h3>
        <p>Synergy was created in 2026 as a satire of corporate meeting culture and a teaching tool. The first version mapped one-to-one onto <a href="https://esolangs.org/wiki/Brainfuck">brainfuck</a>: a tape of cells, a pointer, and eight buzzwords standing in for <code>+ - &gt; &lt; . , [ ]</code>.</p>
        <p>Version 2 dropped the tape. Brainfuck's tape fits poorly with corporate speak: it's one anonymous pointer moving through identical cells, and you add 5 by writing the increment five times. Standup language is good at names and quantities, which the tape can't use. So v2 runs on named counters instead. Two counters with increment, decrement, and a zero-test are already Turing complete (a Minsky machine), so nothing is lost. Programs read like a standup because the names carry meaning: <code>hire headcount</code>, <code>increase budget by 40</code>, <code>while backlog is nonzero</code>.</p>
        <p>The v1 tape interpreter is preserved in git history. The <a href="https://github.com/mandyhoami-lab/synergy">repo</a> documents the translation.</p>

        <h3 id="wiki-compare">Synergy vs brainfuck</h3>
        <table class="wiki-cmds">
          <tr><th></th><th>brainfuck</th><th>Synergy v2</th></tr>
          <tr><td>Memory</td><td>Tape of cells, one pointer</td><td>Named counters, no pointer</td></tr>
          <tr><td>Cell size</td><td>Usually 8-bit, wraps at 256</td><td>Unbounded integers</td></tr>
          <tr><td>Increment</td><td><code>+</code> (repeat N times)</td><td><code>hire x</code>, or <code>increase x by N</code></td></tr>
          <tr><td>Decrement</td><td><code>-</code></td><td><code>layoff x</code>, or <code>decrease x by N</code></td></tr>
          <tr><td>Move</td><td><code>&gt;</code> <code>&lt;</code></td><td>n/a, variables are named</td></tr>
          <tr><td>Output char</td><td><code>.</code></td><td><code>share out x</code></td></tr>
          <tr><td>Output number</td><td>n/a (must build it)</td><td><code>report x</code></td></tr>
          <tr><td>Input</td><td><code>,</code></td><td><code>gather feedback into x</code></td></tr>
          <tr><td>Loop</td><td><code>[</code> … <code>]</code></td><td><code>while x is nonzero</code> … <code>circle back</code></td></tr>
          <tr><td>Set to N</td><td>n/a (must count up)</td><td><code>set x to N</code></td></tr>
          <tr><td>Comment</td><td>Any non-command char</td><td><code>per my last email</code></td></tr>
        </table>

        <h3 id="wiki-examples">Examples</h3>

        <h4>Hello, World!</h4>
        <p>With named counters and <code>set</code>, hello world is short:</p>
        <pre class="wiki-code">per my last email, hello world

set h to 72, share out h,
set e to 101, share out e,
set l to 108, share out l, share out l,
set o to 111, share out o,
set space to 32, share out space,
set w to 87, share out w,
share out o, share out l,
set d to 100, share out d,
set bang to 33, share out bang.

hit a bottleneck.</pre>

        <h4>Countdown</h4>
        <pre class="wiki-code">per my last email, counting down from five

set n to 5,
while n is nonzero,
  report n,
  layoff n,
circle back.

hit a bottleneck.</pre>
        <p>Prints <code>5 4 3 2 1</code>.</p>

        <h4>Add 3 + 4</h4>
        <pre class="wiki-code">set a to 3,
increase a by 4,
report a.

hit a bottleneck.</pre>
        <p>Prints <code>7</code>.</p>

        <h4>Try it</h4>
        <p>The <a href="/synergy.html">Synergy console</a> runs every command above. You can type one of the buzzwords from the key, hit enter, and watch the variable inspector show what changed.</p>

        <p><img src="/assets/images/synergy-typing.gif" alt="Synergy code being typed into the console" width="400" height="120" loading="lazy"></p>

        <figure class="wiki-fig">
          <img src="/assets/images/synergy-frog.png" alt="Dithered frog" loading="lazy">
          <figcaption>Fig. 1: frog, dithered</figcaption>
        </figure>

        <h3 id="wiki-memory">Memory</h3>
        <p>Counters are created the first time they are named and start at 0. They hold unbounded integers (no wrapping). There is no fixed set of variables; any lowercase name works. <code>share out</code> wraps the value to a byte for character output.</p>

        <h3 id="wiki-issues">Issues and limitations</h3>
        <ul>
          <li><b>Line-by-line console:</b> the web console runs one line at a time, so a <code>while</code> without its <code>circle back</code> on the same line will fail.</li>
          <li><b>Step cap:</b> the console stops after 1,000,000 steps to keep the page responsive.</li>
          <li><b>No functions or arrays:</b> all state lives in flat named counters.</li>
          <li><b>v1 programs don't run on v2:</b> the tape model was replaced, not extended. The v1 interpreter is in git history.</li>
        </ul>

        <h3 id="wiki-related">Related languages</h3>
        <ul>
          <li><a href="https://esolangs.org/wiki/Brainfuck">brainfuck</a> — the 8-command tape language v1 mapped onto.</li>
          <li><a href="https://esolangs.org/wiki/Shakespeare">Shakespeare</a> — programs written as plays; the same satirical impulse, applied to theatre instead of meetings.</li>
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
