// amandata.dev — vanilla JS behavior

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- hero disc: click to flip ---------- */
  const heroDisc = document.getElementById('hero-disc');
  if (heroDisc) {
    heroDisc.addEventListener('click', () => {
      heroDisc.classList.toggle('is-flipped');
    });
    // flip once on load to announce the theme, after a short delay
    window.setTimeout(() => heroDisc.classList.add('is-flipped'), 900);
  }

  /* ---------- nav: smooth scroll + active-section disc flip ---------- */
  const navButtons = Array.from(document.querySelectorAll('.nav__disc'));
  const sections = navButtons
    .map(btn => document.getElementById(btn.dataset.target))
    .filter(Boolean);

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navButtons.forEach(btn => {
            btn.classList.toggle('is-active', btn.dataset.target === entry.target.id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(sec => spy.observe(sec));
  }

  /* ---------- stat counters: count up when scrolled into view ---------- */
  const statNums = document.querySelectorAll('.stat__num');
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 900;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window && statNums.length) {
    const statObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    statNums.forEach(el => statObserver.observe(el));
  } else {
    statNums.forEach(el => { el.textContent = el.dataset.count; });
  }

  /* ---------- email: build from data attributes to deter scraping ---------- */
  const emailLink = document.getElementById('email-link');
  if (emailLink) {
    const user = emailLink.dataset.user;
    const domain = emailLink.dataset.domain;
    if (user && domain) {
      emailLink.setAttribute('href', `mailto:${user}@${domain}`);
    }
  }
});
