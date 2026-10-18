"use strict";
/* Projects page shell — vignette + main, injected so the .html file stays a thin shell.
   Project list mirrors the homepage (index.ts). */
/* NOTE: compiled by GitHub Actions on push. */
(function () {
    "use strict";
    var mount = document.getElementById("page-mount");
    if (!mount)
        return; /* shell already present (pre-conversion HTML) */
    mount.outerHTML = `<!-- CRT vignette overlay -->
<div class="vignette" aria-hidden="true"></div>

<main>

  <!-- ================= PROJECTS ================= -->
  <section class="section" id="work">
    <div class="section__head">
      <h2 class="section__title">Projects</h2>
      <span class="section__tag">cool stuff I've made</span>
    </div>
    <div class="section__body">
    <div class="proj-grid">
      <a class="proj-box" href="/othello.html">
        <span class="proj-box__title">Othello Reversi Coach</span>
        <span class="proj-box__desc">Beginner robot · Advanced study mode · Engine-graded moves</span>
      </a>
      <a class="proj-box" href="/psy410-flashcards/">
        <span class="proj-box__title">Myers Experimental Psychology Flashcards</span>
        <span class="proj-box__desc">118 terms · Myers Exp. Psych Ch. 1–16</span>
      </a>
      <a class="proj-box" href="/synergy.html">
        <span class="proj-box__title">Synergy</span>
        <span class="proj-box__desc">The corporate-buzzword esolang · Brainfuck-complete</span>
      </a>
      <a class="proj-box" href="/stat200-practice.html">
        <span class="proj-box__title">R Practice Hub</span>
        <span class="proj-box__desc">STAT 200 drills, quizzes + a real R console</span>
      </a>
      <a class="proj-box" href="/blog.html">
        <span class="proj-box__title">@tarotams — The amandata.dev Blog</span>
        <span class="proj-box__desc">Essays · Process notes</span>
      </a>
      <a class="proj-box" href="https://amandata.org/" target="_blank" rel="noopener">
        <span class="proj-box__title">amandata.org</span>
        <span class="proj-box__desc">Research portfolio · Rebuilt from Carrd in clean HTML/CSS/JS</span>
      </a>
      <a class="proj-box" href="https://mandyhoami-lab.github.io/tgupsd.org/" target="_blank" rel="noopener">
        <span class="proj-box__title">tgupsd.org</span>
        <span class="proj-box__desc">Nonprofit site · Rebuilt from Carrd in clean HTML/CSS/JS</span>
      </a>
      <a class="proj-box" href="/">
        <span class="proj-box__title">amandata.dev</span>
        <span class="proj-box__desc">This site · Hand-built, pixel-art, always evolving</span>
      </a>
    </div>
  </div>
  </section>

</main>`;
})();
