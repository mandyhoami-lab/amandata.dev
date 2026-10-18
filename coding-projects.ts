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
      <h2 class="section__title">Web projects</h2>
    </div>
    <div class="section__body">
      <div class="proj-grid">
        <div class="proj-box">
          <a class="proj-box__title" href="/othello.html">Othello Reversi Coach</a>
          <span class="proj-box__desc">Study interface inspired by <a href="https://apps.apple.com/us/app/piyo-reversi/id1197944711" target="_blank" rel="noopener">Hiyoko Reversi</a> (ひよこリバーシ); post-game analysis and eval graph</span>
          <span class="proj-box__links"><a class="proj-btn" href="/othello.html">play</a><a class="proj-btn" href="https://github.com/mandyhoami-lab/reversi-coach" target="_blank" rel="noopener">repo</a></span>
        </div>
        <div class="proj-box">
          <a class="proj-box__title" href="/stat200-practice.html">R Practice Hub</a>
          <span class="proj-box__desc">Flashcards · Typing drills · Quizzes · R console · Etymology</span>
          <span class="proj-box__links"><a class="proj-btn" href="/stat200-practice.html">practice</a><a class="proj-btn" href="https://github.com/mandyhoami-lab/r-practice-hub" target="_blank" rel="noopener">repo</a></span>
        </div>
        <div class="proj-box">
          <a class="proj-box__title" href="/synergy.html">Synergy Console</a>
          <span class="proj-box__desc">The corporate-buzzword esolang</span>
          <span class="proj-box__links"><a class="proj-btn" href="/synergy.html">try it</a><a class="proj-btn" href="/synergy-wiki.html">wiki</a><a class="proj-btn" href="https://github.com/mandyhoami-lab/synergy" target="_blank" rel="noopener">repo</a><a class="proj-btn" href="/blog.html?p=synergy-corporate-buzzword-esolang">blog</a></span>
        </div>
      </div>
      <p class="games-note"><a href="/">← Back to Home</a></p>
    </div>
  </section>

</main>`;
})();
