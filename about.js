"use strict";
/* About page shell — vignette + main, injected so the .html file stays a thin shell.
   Section markup copied verbatim from the homepage (index.ts). */
(function () {
    "use strict";
    var mount = document.getElementById("page-mount");
    if (!mount)
        return; /* shell already present (pre-conversion HTML) */
    mount.outerHTML = `<!-- CRT vignette overlay -->
<div class="vignette" aria-hidden="true"></div>

<main>

  <!-- ================= ABOUT ================= -->
  <section class="section" id="about">
    <div class="section__head">
      <h2 class="section__title">About me</h2>
      <span class="section__tag">Background</span>
    </div>

    <div class="section__body">
      <p>Hi, it&rsquo;s Amanda. You can call me Mandy.</p>

      <p>Big fan of the internet, Othello, and humans. I also skate, and create and manage websites for fun.</p>

      <p>Currently I&rsquo;m a psychology undergrad at SDSU. I&rsquo;m a research volunteer across a few labs&mdash; <a href="https://business.sdsu.edu/centers-institutes/ai" target="_blank" rel="noopener">JSBCAI</a>, the <a href="https://emilykappenman.org" target="_blank" rel="noopener">Kappenman lab</a>, and the <a href="https://cte.sdsu.edu/" target="_blank" rel="noopener">Center for Tobacco and the Environment</a>; looking at how public health, artificial intelligence, and neuroimaging play a role in clinical psychology and mental health.</p>

      <p>I also enjoy social science history and theory, abstract strategy board games (Othello/Reversi), LLMs, statistics, personality models, psychometrics, neuroimaging, and humans in general. My influences include my mentors; <a href="https://psychology.sdsu.edu/people/georg-matt/" target="_blank" rel="noopener">Dr. Georg Matt</a>, <a href="https://policycte.sdsu.edu/lydia-greiner-drph-aprn/" target="_blank" rel="noopener">Dr. Lydia Greiner</a>, and <a href="https://emilykappenman.org" target="_blank" rel="noopener">Dr. Emily Kappenman</a>, along with other various cyber/internet science folk; <a href="https://www.penguinrandomhouse.com/authors/226907/mary-aiken" target="_blank" rel="noopener">Mary Aiken</a>, <a href="https://en.wikipedia.org/wiki/Hank_Green" target="_blank" rel="noopener">Hank Green</a>, and <a href="https://en.wikipedia.org/wiki/Alok_Kanojia" target="_blank" rel="noopener">Alok Kanojia</a> (or, HealthyGamerGG).</p>

      <p>You can also call me Mandy. Education is for everyone.</p>

      <p><strong>Toolkit:</strong> R &middot; HTML &middot; JavaScript &middot; SPSS</p>
    </div>
  </section>

</main>`;
})();
