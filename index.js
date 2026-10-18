"use strict";
/* Homepage shell — vignette + main, injected so the .html file stays a thin shell.
   Markup is byte-identical to what the .html file used to ship. */
/* NOTE: compiled by GitHub Actions on push. */
(function () {
    "use strict";
    var mount = document.getElementById("page-mount");
    if (!mount)
        return; /* shell already present (pre-conversion HTML) */
    mount.outerHTML = `<!-- CRT vignette overlay -->
<div class="vignette" aria-hidden="true"></div>

<!-- ================= NAV ================= -->

<!-- ================= HERO ================= -->
<header class="hero" id="top">
  <div class="ribbons" aria-hidden="true"></div>
  <h1 class="hero__title">aman<span class="hero__data">data</span><span class="hero__dev">.dev<span class="hero__cat" aria-hidden="true"><svg class="hero__cat-svg" viewBox="0 0 22 13" shape-rendering="crispEdges" aria-hidden="true"><rect class="pxf" x="7" y="0" width="1" height="1"/><rect class="pxf" x="8" y="0" width="1" height="1"/><rect class="pxf" x="12" y="0" width="1" height="1"/><rect class="pxf" x="13" y="0" width="1" height="1"/><rect class="pxf" x="6" y="1" width="1" height="1"/><rect class="pxp" x="7" y="1" width="1" height="1"/><rect class="pxp" x="8" y="1" width="1" height="1"/><rect class="pxf" x="9" y="1" width="1" height="1"/><rect class="pxf" x="12" y="1" width="1" height="1"/><rect class="pxp" x="13" y="1" width="1" height="1"/><rect class="pxp" x="14" y="1" width="1" height="1"/><rect class="pxf" x="15" y="1" width="1" height="1"/><rect class="pxf" x="6" y="2" width="1" height="1"/><rect class="pxf" x="7" y="2" width="1" height="1"/><rect class="pxf" x="8" y="2" width="1" height="1"/><rect class="pxf" x="9" y="2" width="1" height="1"/><rect class="pxf" x="10" y="2" width="1" height="1"/><rect class="pxf" x="11" y="2" width="1" height="1"/><rect class="pxf" x="12" y="2" width="1" height="1"/><rect class="pxf" x="13" y="2" width="1" height="1"/><rect class="pxf" x="14" y="2" width="1" height="1"/><rect class="pxf" x="15" y="2" width="1" height="1"/><rect class="pxf" x="5" y="3" width="1" height="1"/><rect class="pxf" x="6" y="3" width="1" height="1"/><rect class="pxf" x="7" y="3" width="1" height="1"/><rect class="pxf" x="8" y="3" width="1" height="1"/><rect class="pxf" x="9" y="3" width="1" height="1"/><rect class="pxf" x="10" y="3" width="1" height="1"/><rect class="pxf" x="11" y="3" width="1" height="1"/><rect class="pxf" x="12" y="3" width="1" height="1"/><rect class="pxf" x="13" y="3" width="1" height="1"/><rect class="pxf" x="14" y="3" width="1" height="1"/><rect class="pxf" x="15" y="3" width="1" height="1"/><rect class="pxf" x="16" y="3" width="1" height="1"/><rect class="pxf" x="5" y="4" width="1" height="1"/><rect class="pxd" x="6" y="4" width="1" height="1"/><rect class="pxd" x="7" y="4" width="1" height="1"/><rect class="pxf" x="8" y="4" width="1" height="1"/><rect class="pxf" x="9" y="4" width="1" height="1"/><rect class="pxf" x="10" y="4" width="1" height="1"/><rect class="pxf" x="11" y="4" width="1" height="1"/><rect class="pxf" x="12" y="4" width="1" height="1"/><rect class="pxf" x="13" y="4" width="1" height="1"/><rect class="pxd" x="14" y="4" width="1" height="1"/><rect class="pxd" x="15" y="4" width="1" height="1"/><rect class="pxf" x="16" y="4" width="1" height="1"/><rect class="pxf" x="5" y="5" width="1" height="1"/><rect class="pxf" x="6" y="5" width="1" height="1"/><rect class="pxf" x="7" y="5" width="1" height="1"/><rect class="pxe" x="8" y="5" width="1" height="1"/><rect class="pxe" x="9" y="5" width="1" height="1"/><rect class="pxf" x="10" y="5" width="1" height="1"/><rect class="pxf" x="11" y="5" width="1" height="1"/><rect class="pxf" x="12" y="5" width="1" height="1"/><rect class="pxf" x="13" y="5" width="1" height="1"/><rect class="pxf" x="14" y="5" width="1" height="1"/><rect class="pxe" x="15" y="5" width="1" height="1"/><rect class="pxe" x="16" y="5" width="1" height="1"/><rect class="pxf" x="5" y="6" width="1" height="1"/><rect class="pxf" x="6" y="6" width="1" height="1"/><rect class="pxf" x="7" y="6" width="1" height="1"/><rect class="pxf" x="8" y="6" width="1" height="1"/><rect class="pxf" x="9" y="6" width="1" height="1"/><rect class="pxf" x="10" y="6" width="1" height="1"/><rect class="pxp" x="11" y="6" width="1" height="1"/><rect class="pxf" x="12" y="6" width="1" height="1"/><rect class="pxf" x="13" y="6" width="1" height="1"/><rect class="pxf" x="14" y="6" width="1" height="1"/><rect class="pxf" x="15" y="6" width="1" height="1"/><rect class="pxf" x="16" y="6" width="1" height="1"/><rect class="pxf" x="5" y="7" width="1" height="1"/><rect class="pxf" x="6" y="7" width="1" height="1"/><rect class="pxf" x="7" y="7" width="1" height="1"/><rect class="pxf" x="8" y="7" width="1" height="1"/><rect class="pxf" x="9" y="7" width="1" height="1"/><rect class="pxf" x="10" y="7" width="1" height="1"/><rect class="pxf" x="11" y="7" width="1" height="1"/><rect class="pxf" x="12" y="7" width="1" height="1"/><rect class="pxf" x="13" y="7" width="1" height="1"/><rect class="pxf" x="14" y="7" width="1" height="1"/><rect class="pxf" x="15" y="7" width="1" height="1"/><rect class="pxf" x="16" y="7" width="1" height="1"/><rect class="pxf" x="3" y="8" width="1" height="1"/><rect class="pxf" x="4" y="8" width="1" height="1"/><rect class="pxd" x="5" y="8" width="1" height="1"/><rect class="pxd" x="6" y="8" width="1" height="1"/><rect class="pxf" x="7" y="8" width="1" height="1"/><rect class="pxf" x="8" y="8" width="1" height="1"/><rect class="pxd" x="9" y="8" width="1" height="1"/><rect class="pxd" x="10" y="8" width="1" height="1"/><rect class="pxf" x="11" y="8" width="1" height="1"/><rect class="pxf" x="12" y="8" width="1" height="1"/><rect class="pxd" x="13" y="8" width="1" height="1"/><rect class="pxd" x="14" y="8" width="1" height="1"/><rect class="pxf" x="15" y="8" width="1" height="1"/><rect class="pxf" x="16" y="8" width="1" height="1"/><rect class="pxf" x="17" y="8" width="1" height="1"/><rect class="pxf" x="18" y="8" width="1" height="1"/><rect class="pxf" x="19" y="8" width="1" height="1"/><rect class="pxf" x="2" y="9" width="1" height="1"/><rect class="pxf" x="3" y="9" width="1" height="1"/><rect class="pxf" x="4" y="9" width="1" height="1"/><rect class="pxf" x="5" y="9" width="1" height="1"/><rect class="pxf" x="6" y="9" width="1" height="1"/><rect class="pxf" x="7" y="9" width="1" height="1"/><rect class="pxf" x="8" y="9" width="1" height="1"/><rect class="pxf" x="9" y="9" width="1" height="1"/><rect class="pxf" x="10" y="9" width="1" height="1"/><rect class="pxf" x="11" y="9" width="1" height="1"/><rect class="pxf" x="12" y="9" width="1" height="1"/><rect class="pxf" x="13" y="9" width="1" height="1"/><rect class="pxf" x="14" y="9" width="1" height="1"/><rect class="pxf" x="15" y="9" width="1" height="1"/><rect class="pxf" x="16" y="9" width="1" height="1"/><rect class="pxf" x="17" y="9" width="1" height="1"/><rect class="pxf" x="18" y="9" width="1" height="1"/><rect class="pxf" x="19" y="9" width="1" height="1"/><rect class="pxf" x="20" y="9" width="1" height="1"/><rect class="pxd" x="21" y="9" width="1" height="1"/><rect class="pxf" x="2" y="10" width="1" height="1"/><rect class="pxf" x="3" y="10" width="1" height="1"/><rect class="pxl" x="4" y="10" width="1" height="1"/><rect class="pxl" x="5" y="10" width="1" height="1"/><rect class="pxf" x="6" y="10" width="1" height="1"/><rect class="pxf" x="7" y="10" width="1" height="1"/><rect class="pxf" x="8" y="10" width="1" height="1"/><rect class="pxf" x="9" y="10" width="1" height="1"/><rect class="pxf" x="10" y="10" width="1" height="1"/><rect class="pxf" x="11" y="10" width="1" height="1"/><rect class="pxf" x="12" y="10" width="1" height="1"/><rect class="pxf" x="13" y="10" width="1" height="1"/><rect class="pxf" x="14" y="10" width="1" height="1"/><rect class="pxf" x="15" y="10" width="1" height="1"/><rect class="pxf" x="16" y="10" width="1" height="1"/><rect class="pxl" x="17" y="10" width="1" height="1"/><rect class="pxl" x="18" y="10" width="1" height="1"/><rect class="pxf" x="19" y="10" width="1" height="1"/><rect class="pxf" x="20" y="10" width="1" height="1"/><rect class="pxl" x="21" y="10" width="1" height="1"/><rect class="pxf" x="2" y="11" width="1" height="1"/><rect class="pxf" x="3" y="11" width="1" height="1"/><rect class="pxf" x="4" y="11" width="1" height="1"/><rect class="pxf" x="5" y="11" width="1" height="1"/><rect class="pxf" x="6" y="11" width="1" height="1"/><rect class="pxf" x="7" y="11" width="1" height="1"/><rect class="pxf" x="8" y="11" width="1" height="1"/><rect class="pxf" x="9" y="11" width="1" height="1"/><rect class="pxf" x="10" y="11" width="1" height="1"/><rect class="pxf" x="11" y="11" width="1" height="1"/><rect class="pxf" x="12" y="11" width="1" height="1"/><rect class="pxf" x="13" y="11" width="1" height="1"/><rect class="pxf" x="14" y="11" width="1" height="1"/><rect class="pxf" x="15" y="11" width="1" height="1"/><rect class="pxf" x="16" y="11" width="1" height="1"/><rect class="pxf" x="17" y="11" width="1" height="1"/><rect class="pxf" x="18" y="11" width="1" height="1"/><rect class="pxf" x="19" y="11" width="1" height="1"/><rect class="pxf" x="20" y="11" width="1" height="1"/><rect class="pxf" x="3" y="12" width="1" height="1"/><rect class="pxf" x="4" y="12" width="1" height="1"/><rect class="pxf" x="5" y="12" width="1" height="1"/><rect class="pxf" x="6" y="12" width="1" height="1"/><rect class="pxf" x="7" y="12" width="1" height="1"/><rect class="pxf" x="8" y="12" width="1" height="1"/><rect class="pxf" x="9" y="12" width="1" height="1"/><rect class="pxf" x="10" y="12" width="1" height="1"/><rect class="pxf" x="11" y="12" width="1" height="1"/><rect class="pxf" x="12" y="12" width="1" height="1"/><rect class="pxf" x="13" y="12" width="1" height="1"/><rect class="pxf" x="14" y="12" width="1" height="1"/><rect class="pxf" x="15" y="12" width="1" height="1"/><rect class="pxf" x="16" y="12" width="1" height="1"/><rect class="pxf" x="17" y="12" width="1" height="1"/><rect class="pxf" x="18" y="12" width="1" height="1"/><rect class="pxf" x="19" y="12" width="1" height="1"/></svg><span class="cat-z">z</span><span class="cat-z">z</span><span class="cat-z">z</span></span></span></h1>
  <p class="hero__tagline">
    <span id="typewriter">Social science enthusiast, researcher, web development. Welcome to my space.</span><span class="caret" aria-hidden="true"></span>
  </p>
  <nav class="hero__hubs" aria-label="hubs">
    <a class="hero__hub" href="/coding-projects.html">Web projects</a>
    <a class="hero__hub" href="/website-management.html">Website management</a>
    <a class="hero__hub" href="/research-activity.html">Research activity</a>
  </nav>
  <p class="hero__scroll">Scroll <span class="hero__scroll-arrow" aria-hidden="true">↓</span></p>
</header>

<main>

  <!-- ================= ABOUT + PROJECTS (two columns on desktop) ================= -->
  <div class="home-cols">
  <!-- ================= ABOUT ================= -->
  <section class="section" id="about">
    <div class="section__head">
      <h2 class="section__title">About me</h2>
      <span class="section__tag">Background</span>
    </div>

    <div class="section__body">
      ${window.ABOUT_BIO_HTML}
    </div>
  </section>

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
      <a class="proj-box" href="/blog.html">
        <span class="proj-box__title">@tarotams — The amandata.dev Blog</span>
        <span class="proj-box__desc">Essays · Process notes · Written as tarotams</span>
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
  </div>

  <!-- ================= RESEARCH ACTIVITY (short CV) ================= -->
  <section class="section" id="research">
    <div class="section__head">
      <h2 class="section__title">Research Activity</h2>
      <span class="section__tag">the record</span>
    </div>

    <!-- stat row -->
    <div class="stats" role="list" id="cv-stats"></div>

    <div class="toolkit">
      <h3 class="toolkit__title">Toolkit</h3>
      <div class="skills-grid">
        <div class="skills-col"><h4>Software</h4><p><strong>R</strong>, SPSS, JavaScript, PyCorder, Overleaf, Excel</p></div>
        <div class="skills-col"><h4>Statistics</h4><p>Descriptive statistics, t-tests, ANOVA, correlation, linear regression</p></div>
        <div class="skills-col"><h4>Methodology</h4><p>EEG data acquisition, qualitative coding (thematic analysis), survey &amp; interview design, database development</p></div>
      </div>
    </div>

    <div class="research-pubs">
      <h3 class="cv-block__title">Academic Presentations</h3>
      <ul class="cv-list">
        <li><strong>Ta, A.</strong>, Matt, G. E., Wooldridge, G., &amp; Greiner, L. (2026). <em>Smoking and vaping policies in newly constructed, state-funded multiunit housing in California</em> [Poster presentation]. Third Annual Research Symposium on Tobacco and the Environment, Southeast Live Well Center, San Diego, CA.</li>
        <li><strong>Ta, A.</strong>, Matt, G. E., Wooldridge, G., &amp; Greiner, L. (2026). <em>Smoking and vaping policies in newly constructed, state-funded multiunit housing in California</em> [Poster presentation]. SDSU Student Symposium (S3), San Diego State University, San Diego, CA.</li>
      </ul>
    </div>

    <div class="btn-center"><a class="btn" href="/cv.html">See: Academic CV</a></div>
  </section>

  <!-- ================= BLOG + CONTACT (two columns on desktop) ================= -->
  <div class="home-cols">
  <section class="section" id="blog-preview">
    <div class="section__head">
      <h2 class="section__title">Blog</h2>
      <span class="section__tag">Notes &amp; essays</span>
    </div>
    <div class="section__body">
      <div id="home-posts" class="home-posts"><p>Loading…</p></div>
      <p class="home-posts__more"><a href="/blog.html">all posts &rarr;</a></p>
    </div>
  </section>

  <section class="section contact--compact" id="contact">
    <div class="section__head">
      <h2 class="section__title">Contact</h2>
      <span class="section__tag">all welcome</span>
    </div>
    <ul class="contact__list">
      <li><a class="contact__link" id="email-link" href="#" data-user="ata3958" data-domain="sdsu.edu"><span class="blink"></span>Email</a></li>
      <li><a class="contact__link" href="https://www.linkedin.com/in/amandahoamita" target="_blank" rel="noopener"><span class="blink"></span>LinkedIn</a></li>
      <li><a class="contact__link" href="https://github.com/mandyhoami-lab" target="_blank" rel="noopener"><span class="blink"></span>GitHub</a></li>
    </ul>
  </section>
  </div>

  <!-- ================= CHANGELOG ================= -->
  <section class="section" id="changelog">
    <div class="section__head">
      <h2 class="section__title">Changelog</h2>
      <span class="section__tag">Site updates</span>
    </div>
    <div class="section__body">
      <ul class="cv-list" id="changelog-list"></ul>
      <p>Full history in the repo's <a href="https://github.com/mandyhoami-lab/amandata.dev/blob/main/CHANGELOG.md" target="_blank" rel="noopener">CHANGELOG.md</a>.</p>
    </div>
  </section>


</main>`;
})();
/* Homepage blog preview — latest 3 published posts from Supabase. */
(function () {
    "use strict";
    var mount = document.getElementById("home-posts");
    if (!mount)
        return;
    var cfg = window.SUPABASE_CONFIG || {};
    function esc(s) {
        return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }
    function fallback(html) { mount.innerHTML = html; }
    if (!cfg.SUPABASE_URL || cfg.SUPABASE_URL.indexOf("YOUR_") === 0) {
        fallback('<p><a href="/blog.html">visit the blog &rarr;</a></p>');
        return;
    }
    var url = cfg.SUPABASE_URL.replace(/\/$/, "") +
        "/rest/v1/posts?select=title,slug,created_at&published=eq.true&order=created_at.desc&limit=3";
    fetch(url, { headers: { "apikey": cfg.SUPABASE_ANON_KEY, "Authorization": "Bearer " + cfg.SUPABASE_ANON_KEY } })
        .then(function (res) { if (!res.ok)
        throw new Error("posts failed"); return res.json(); })
        .then(function (posts) {
        if (!posts || !posts.length) {
            fallback('<p>no posts yet — <a href="/blog.html">visit the blog</a>.</p>');
            return;
        }
        fallback(posts.map(function (p) {
            var d = new Date(p.created_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
            return '<a class="home-post" href="/blog.html?p=' + encodeURIComponent(p.slug) + '">' +
                '<span class="home-post__title">' + esc(p.title) + "</span>" +
                '<span class="home-post__date">' + esc(d) + "</span></a>";
        }).join(""));
    })
        .catch(function () { fallback('<p><a href="/blog.html">visit the blog &rarr;</a></p>'); });
})();
