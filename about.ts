/* About page shell, vignette + main, injected so the .html file stays a thin shell.
   Section markup copied verbatim from the homepage (index.ts). */
(function () {
  "use strict";
  var mount = document.getElementById("page-mount");
  if (!mount) return; /* shell already present (pre-conversion HTML) */
  mount.outerHTML = `<!-- CRT vignette overlay -->
<div class="vignette" aria-hidden="true"></div>

<main>

  <!-- ================= ABOUT ================= -->
  <section class="section" id="about">
    <div class="section__head">
      <h2 class="section__title">About me</h2>
      <span class="section__tag">Background</span>
    </div>

    <div class=\"section__body\">
      ${window.ABOUT_BIO_HTML}
      <p class="games-note"><a href="/">← Back to Home</a></p>
    </div>
  </section>

</main>`;
})();
