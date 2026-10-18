/* STAT 200 practice hub — unit selector + mode tabs.
   Modes: flashcards (flip viewer), typing drills, quizzes, code lab (WebR), etymology. */
(function () {
  "use strict";

  var mount = document.getElementById("page-mount");
  if (!mount) return;
  mount.outerHTML = `<div class="vignette" aria-hidden="true"></div>
<main>
  <section class="section" id="s2">
    <div class="section__head">
      <p class="section__tag">stat 200</p>
      <h2 class="section__title">R Practice Hub</h2>
      <p class="creations-intro">drills, quizzes, and a real R console — by unit.</p>
    </div>
    <div class="section__body">
      <div class="s2-wrap">
        <div class="s2-units" id="s2-units"></div>
        <div class="s2-modes" id="s2-modes">
          <button type="button" class="s2-mode is-active" data-mode="flash">Flashcards</button>
          <button type="button" class="s2-mode" data-mode="typing">Typing drills</button>
          <button type="button" data-mode="quiz" class="s2-mode">Quiz</button>
          <button type="button" class="s2-mode" data-mode="code">Code lab</button>
          <button type="button" class="s2-mode" data-mode="etym">Etymology</button>
        </div>
        <div class="s2-stage" id="s2-stage"></div>
        <p class="games-note"><a href="/creations.html">&larr; Back to Creations</a></p>
      </div>
    </div>
  </section>
</main>`;

  var unitsEl = document.getElementById("s2-units") as HTMLElement;
  var stage = document.getElementById("s2-stage") as HTMLElement;
  var currentUnit = 0;
  var currentMode = "flash";

  function esc(s: string): string {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function renderUnits(): void {
    unitsEl.innerHTML = "";
    window.STAT200.units.forEach(function (u: any, i: number) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "s2-unit" + (i === currentUnit ? " is-active" : "");
      b.textContent = u.title;
      b.addEventListener("click", function () { currentUnit = i; renderUnits(); renderStage(); });
      unitsEl.appendChild(b);
    });
  }

  function renderStage(): void {
    var unit = window.STAT200.units[currentUnit];
    if (currentMode === "flash") renderFlash(unit);
    else if (currentMode === "typing") window.StatDrills.init(stage, unit.typing);
    else if (currentMode === "quiz") window.StatQuiz.init(stage, unit.quiz);
    else if (currentMode === "code") window.StatCode.init(stage);
    else if (currentMode === "etym") renderEtym(unit);
  }

  /* compact flip-card viewer */
  function renderFlash(unit: any): void {
    var cards = unit.flashcards.slice();
    for (var i = cards.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = cards[i]; cards[i] = cards[j]; cards[j] = t;
    }
    var idx = 0, flipped = false;
    stage.innerHTML =
      '<div class="fc-wrap"><div class="fc-head"><h1 class="fc-title">' + esc(unit.title) + '</h1>' +
      '<div class="fc-sub">' + cards.length + ' cards · tap to flip</div></div>' +
      '<div class="fc-progress"><div class="fc-bar"><div style="width:0%"></div></div>' +
      '<div class="fc-ptext"></div></div>' +
      '<div class="fc-deck"><div class="fc-card" tabindex="0"><div class="fc-inner">' +
      '<div class="fc-face"><div class="fc-tag"></div><div class="fc-term"></div></div>' +
      '<div class="fc-face back"><div class="fc-def"></div></div>' +
      '</div></div></div>' +
      '<div class="fc-grade"><button type="button" data-nav="prev">&larr; prev</button>' +
      '<button type="button" data-nav="next">next &rarr;</button></div></div>';

    var card = stage.querySelector(".fc-card") as HTMLElement;
    var tag = stage.querySelector(".fc-tag") as HTMLElement;
    var front = stage.querySelector(".fc-term") as HTMLElement;
    var back = stage.querySelector(".fc-def") as HTMLElement;
    var fill = stage.querySelector(".fc-bar > div") as HTMLElement;
    var ptext = stage.querySelector(".fc-ptext") as HTMLElement;

    function show(): void {
      card.classList.remove("flipped");
      tag.textContent = cards[idx].tag;
      front.textContent = cards[idx].term;
      back.textContent = cards[idx].def;
      fill.style.width = ((idx + 1) / cards.length * 100) + "%";
      ptext.textContent = "card " + (idx + 1) + " of " + cards.length;
    }
    card.addEventListener("click", function () {
      card.classList.toggle("flipped");
    });
    var prevBtn = stage.querySelector('[data-nav="prev"]') as HTMLElement;
    var nextBtn2 = stage.querySelector('[data-nav="next"]') as HTMLElement;
    prevBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      idx = (idx - 1 + cards.length) % cards.length; show();
    });
    nextBtn2.addEventListener("click", function (e) {
      e.stopPropagation();
      idx = (idx + 1) % cards.length; show();
    });
    show();
  }

  function renderEtym(unit: any): void {
    var html = '<table class="etym-table"><tr><th>term</th><th>origin</th><th>note</th></tr>';
    unit.etymology.forEach(function (e: any) {
      html += "<tr><td>" + esc(e.term) + "</td><td>" + esc(e.origin) + "</td><td>" + esc(e.note) + "</td></tr>";
    });
    stage.innerHTML = html + "</table>";
  }

  var modeBtns = document.querySelectorAll(".s2-mode");
  modeBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      modeBtns.forEach(function (x) { x.classList.remove("is-active"); });
      b.classList.add("is-active");
      currentMode = (b as HTMLElement).getAttribute("data-mode") || "flash";
      renderStage();
    });
  });

  // flashcards.css provides .fc-* styles
  renderUnits();
  renderStage();
})();
