"use strict";
/* CV page shell — vignette + main, injected so the .html file stays a thin shell.
   Section markup copied verbatim from the homepage (index.ts). */
(function () {
    "use strict";
    var mount = document.getElementById("page-mount");
    if (!mount)
        return; /* shell already present (pre-conversion HTML) */
    mount.outerHTML = `<!-- CRT vignette overlay -->
<div class="vignette" aria-hidden="true"></div>

<main>

  <!-- ================= CV ================= -->
  <section class="section" id="cv">
    <div class="section__head">
      <h2 class="section__title">Curriculum Vitae</h2>
      <span class="section__tag">the record</span>
    </div>
    <div class="btn-center"><a class="btn" href="/Amanda-Ta-CV.pdf" target="_blank" rel="noopener">View Academic CV</a></div>

    <!-- stat row -->
    <div class="stats" role="list" id="cv-stats"></div>

    <div id="cv-blocks"></div>
  </section>

</main>`;
})();
