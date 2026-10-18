/* Research activity page — CV + LinkedIn. */
(function () {
  "use strict";
  var mount = document.getElementById("page-mount");
  if (!mount) return;
  mount.outerHTML = `<div class="vignette" aria-hidden="true"></div>

<main>

  <section class="section" id="research-activity">
    <div class="section__head">
      <p class="section__tag">research</p>
      <h2 class="section__title">Research activity</h2>
    </div>
    <div class="section__body">
      <div class="proj-grid">
        <div class="proj-box">
          <span class="proj-box__title">Academic CV</span>
          <span class="proj-box__desc">Education · Research experience · Presentations</span>
          <span class="proj-box__links"><a href="/cv.html">view</a></span>
        </div>
        <div class="proj-box">
          <span class="proj-box__title">LinkedIn</span>
          <span class="proj-box__desc">Professional profile · Connect</span>
          <span class="proj-box__links"><a href="https://www.linkedin.com/in/amandahoamita" target="_blank" rel="noopener">visit</a></span>
        </div>
      </div>
      <p class="games-note"><a href="/">&larr; Back home</a></p>
    </div>
  </section>

</main>`;
})();
