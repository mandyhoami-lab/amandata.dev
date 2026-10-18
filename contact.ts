/* Contact page shell, vignette + main, injected so the .html file stays a thin shell.
   Section markup copied verbatim from the homepage (index.ts). */
(function () {
  "use strict";
  var mount = document.getElementById("page-mount");
  if (!mount) return; /* shell already present (pre-conversion HTML) */
  mount.outerHTML = `<!-- CRT vignette overlay -->
<div class="vignette" aria-hidden="true"></div>

<main>

  <!-- ================= CONTACT ================= -->
  <section class="section" id="contact">
    <div class="section__head">
      <h2 class="section__title">Contact</h2>
      <span class="section__tag">all welcome</span>
    </div>
    <p class="contact__intro">All welcome, I&rsquo;ll get to your message soon.</p>
    <ul class="contact__list">
      <li><a class="contact__link" id="email-link" href="#" data-user="ata3958" data-domain="sdsu.edu"><span class="blink"></span>Email</a></li>
      <li><a class="contact__link" href="https://www.linkedin.com/in/amandahoamita" target="_blank" rel="noopener"><span class="blink"></span>LinkedIn</a></li>
      <li><a class="contact__link" href="https://github.com/mandyhoami-lab" target="_blank" rel="noopener"><span class="blink"></span>GitHub</a></li>
    </ul>
  </section>

</main>`;
})();
