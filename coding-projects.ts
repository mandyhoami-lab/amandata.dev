/* Coding projects page — like the projects page, but only Othello, R hub, Synergy.
   Each card links the live page, the repo, and the blog post if one exists. */
(function () {
  "use strict";
  var mount = document.getElementById("page-mount");
  if (!mount) return;
  mount.outerHTML = `<div class="vignette" aria-hidden="true"></div>

<main>

  <section class="section" id="coding-projects">
    <div class="section__head">
      <p class="section__tag">code</p>
      <h2 class="section__title">Coding projects</h2>
    </div>
    <div class="section__body">
      <div class="proj-grid">
        <div class="proj-box">
          <span class="proj-box__title">Othello Reversi Coach</span>
          <span class="proj-box__desc">Study interface inspired by Hiyoko Reversi (ひよこリバーシ) for post-game analysis and eval graph</span>
          <span class="proj-box__links"><a href="/othello.html">play</a> · <a href="https://github.com/mandyhoami-lab/reversi-coach" target="_blank" rel="noopener">repo</a></span>
        </div>
        <div class="proj-box">
          <span class="proj-box__title">R Practice Hub</span>
          <span class="proj-box__desc">Flashcards · Typing drills · Quizzes · R console · Etymology</span>
          <span class="proj-box__links"><a href="/stat200-practice.html">practice</a> · <a href="https://github.com/mandyhoami-lab/r-practice-hub" target="_blank" rel="noopener">repo</a></span>
        </div>
        <div class="proj-box">
          <span class="proj-box__title">Synergy</span>
          <span class="proj-box__desc">The corporate-buzzword esolang · Brainfuck-complete</span>
          <span class="proj-box__links"><a href="/synergy.html">try it</a> · <a href="https://github.com/mandyhoami-lab/synergy" target="_blank" rel="noopener">repo</a> · <a href="/blog.html?p=synergy-corporate-buzzword-esolang">blog</a></span>
        </div>
      </div>
      <p class="games-note"><a href="/creations.html">&larr; Back to Creations</a></p>
    </div>
  </section>

</main>`;
})();
