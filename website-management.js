"use strict";
/* Website management page — the sites she runs, same card layout as coding projects. */
(function () {
    "use strict";
    var mount = document.getElementById("page-mount");
    if (!mount)
        return;
    mount.outerHTML = `<div class="vignette" aria-hidden="true"></div>

<main>

  <section class="section" id="website-management">
    <div class="section__head">
      <p class="section__tag">sites</p>
      <h2 class="section__title">Website management</h2>
    </div>
    <div class="section__body">
      <div class="proj-grid">
        <div class="proj-box">
          <span class="proj-box__title">amandata.dev</span>
          <span class="proj-box__desc">This site · Hand-built, pixel-art, always evolving</span>
          <span class="proj-box__links"><a href="/">visit</a> · <a href="/blog.html">blog</a> · <a href="https://github.com/mandyhoami-lab/amandata.dev" target="_blank" rel="noopener">repo</a></span>
        </div>
        <div class="proj-box">
          <span class="proj-box__title">tgupsd.org</span>
          <span class="proj-box__desc">The Ground Up Project: San Diego · Nonprofit site</span>
          <span class="proj-box__links"><a href="https://mandyhoami-lab.github.io/tgupsd.org/" target="_blank" rel="noopener">visit</a> · <a href="https://github.com/mandyhoami-lab/tgupsd.org" target="_blank" rel="noopener">repo</a></span>
        </div>
        <div class="proj-box">
          <span class="proj-box__title">amandata.org</span>
          <span class="proj-box__desc">Research portfolio · Professional site</span>
          <span class="proj-box__links"><a href="https://amandata.org/" target="_blank" rel="noopener">visit</a> · <a href="https://github.com/mandyhoami-lab/amandata.org" target="_blank" rel="noopener">repo</a></span>
        </div>
      </div>
      <p class="games-note"><a href="/creations.html">&larr; Back to Creations</a></p>
    </div>
  </section>

</main>`;
})();
