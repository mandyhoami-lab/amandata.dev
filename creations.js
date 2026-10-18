"use strict";
/* Creations shell — vignette + main, injected so the .html file stays a thin shell.
   Markup is byte-identical to what the .html file used to ship. */
(function () {
    "use strict";
    var mount = document.getElementById("page-mount");
    if (!mount)
        return; /* shell already present (pre-conversion HTML) */
    mount.outerHTML = `<div class="vignette" aria-hidden="true"></div>

<!-- ================= NAV ================= -->

<main>

  <!-- ================= CREATIONS ================= -->
  <section class="section" id="creations">
    <div class="section__head">
      <h2 class="section__title">Creations</h2>
      <span class="section__tag">playground</span>
    </div>
    <div class="section__body">

      <p class="creations-intro">hi i build these things for people to play around with</p>

      <div class="creation-grid">
        <a class="creation-btn" href="/othello.html">
          <span class="creation-btn__icon" aria-hidden="true"><span class="creation-btn__board"><span class="creation-btn__cell"></span><span class="creation-btn__cell"></span><span class="creation-btn__cell"></span><span class="creation-btn__cell"></span><span class="creation-btn__cell"></span><span class="creation-btn__cell creation-btn__cell--w"></span><span class="creation-btn__cell creation-btn__cell--b"></span><span class="creation-btn__cell"></span><span class="creation-btn__cell"></span><span class="creation-btn__cell creation-btn__cell--b"></span><span class="creation-btn__cell creation-btn__cell--w"></span><span class="creation-btn__cell"></span><span class="creation-btn__cell"></span><span class="creation-btn__cell"></span><span class="creation-btn__cell"></span><span class="creation-btn__cell"></span></span></span>
          <span class="creation-btn__label">Othello</span>
          <span class="creation-btn__sub">reversi, beginner + advanced</span>
        </a>
        <a class="creation-btn" href="/psy410-flashcards/">
          <span class="creation-btn__icon" aria-hidden="true"><span class="creation-btn__cards"><i></i><i></i></span></span>
          <span class="creation-btn__label">Myers Exp. Psych</span>
          <span class="creation-btn__sub">Ch. 1–16 · 118 terms</span>
        </a>
        <a class="creation-btn" href="/synergy.html">
          <span class="creation-btn__icon" aria-hidden="true"><span class="creation-btn__bars"><i></i><i></i><i></i></span></span>
          <span class="creation-btn__label">Synergy</span>
          <span class="creation-btn__sub">the corporate esolang</span>
        </a>
        <a class="creation-btn" href="/stat200-practice.html">
          <span class="creation-btn__icon" aria-hidden="true"><span class="creation-btn__bars"><i></i><i></i><i></i></span></span>
          <span class="creation-btn__label">STAT 200 Practice</span>
          <span class="creation-btn__sub">R drills, quizzes + console</span>
        </a>
      </div>

      <p class="games-note">More toys eventually. Requests welcome.</p>

    </div>
  </section>

</main>`;
})();
