// hand-written, not compiled from .ts
/* Typing drills — type the R code from a plain-English prompt.
   window.StatDrills.init(container, items)
   items: [{ prompt, answer, hint }] */
(function () {
  'use strict';

  function normalize(s) {
    return String(s).replace(/\s+/g, ' ').trim();
  }

  function init(container, items) {
    var idx = 0, correct = 0, done = 0;
    var order = items.map(function (_, i) { return i; });

    container.innerHTML =
      '<div class="drill-wrap">' +
      '<div class="drill-progress"><div class="drill-bar"><div class="drill-fill"></div></div>' +
      '<div class="drill-ptext"></div></div>' +
      '<div class="drill-prompt"></div>' +
      '<input class="drill-input" type="text" spellcheck="false" autocomplete="off" placeholder="type the R code…">' +
      '<div class="drill-hint" hidden></div>' +
      '<div class="drill-row">' +
      '<button class="drill-btn drill-check" type="button">check</button>' +
      '<button class="drill-btn drill-show-hint" type="button">hint</button>' +
      '<button class="drill-btn drill-skip" type="button">skip</button>' +
      '</div>' +
      '<div class="drill-feedback"></div>' +
      '<button class="drill-btn drill-next" type="button" hidden>next &rarr;</button>' +
      '</div>';

    var fill = container.querySelector('.drill-fill');
    var ptext = container.querySelector('.drill-ptext');
    var promptEl = container.querySelector('.drill-prompt');
    var input = container.querySelector('.drill-input');
    var hintEl = container.querySelector('.drill-hint');
    var feedback = container.querySelector('.drill-feedback');
    var nextBtn = container.querySelector('.drill-next');

    function render() {
      var item = items[order[idx]];
      promptEl.textContent = item.prompt;
      input.value = '';
      hintEl.hidden = true;
      hintEl.textContent = item.hint || '';
      feedback.textContent = '';
      feedback.className = 'drill-feedback';
      nextBtn.hidden = true;
      input.disabled = false;
      input.focus();
      updateProgress();
    }

    function updateProgress() {
      fill.style.width = (done / items.length * 100) + '%';
      ptext.textContent = 'drill ' + Math.min(done + 1, items.length) + ' of ' + items.length +
        ' · ' + correct + ' nailed';
    }

    function check() {
      var item = items[order[idx]];
      var got = normalize(input.value);
      var want = normalize(item.answer);
      done++;
      if (got === want) {
        correct++;
        feedback.textContent = '✓ nailed it';
        feedback.className = 'drill-feedback drill-good';
      } else {
        feedback.textContent = '✗ not quite — answer: ' + item.answer;
        feedback.className = 'drill-feedback drill-bad';
      }
      input.disabled = true;
      nextBtn.hidden = false;
      updateProgress();
      if (done >= items.length) {
        nextBtn.textContent = 'see score';
      }
    }

    function next() {
      if (done >= items.length) {
        container.innerHTML = '<div class="drill-done"><h3>' + correct + ' / ' + items.length + '</h3>' +
          '<p>' + (correct === items.length ? 'flawless. the syntax is yours.' :
            correct >= items.length * 0.7 ? 'solid — drill the ones you missed.' :
            'keep going — repetition builds it.') + '</p>' +
          '<button class="drill-btn" type="button" data-restart>drill again</button></div>';
        container.querySelector('[data-restart]').addEventListener('click', function () {
          init(container, items);
        });
        return;
      }
      idx = (idx + 1) % items.length;
      // skip already-done items by advancing to next undone... simple: just go sequential
      render();
    }

    container.querySelector('.drill-check').addEventListener('click', check);
    container.querySelector('.drill-show-hint').addEventListener('click', function () {
      hintEl.hidden = !hintEl.hidden;
    });
    container.querySelector('.drill-skip').addEventListener('click', function () {
      done++;
      feedback.textContent = 'skipped — answer: ' + items[order[idx]].answer;
      feedback.className = 'drill-feedback';
      input.disabled = true;
      nextBtn.hidden = false;
      updateProgress();
      if (done >= items.length) nextBtn.textContent = 'see score';
    });
    nextBtn.addEventListener('click', next);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !input.disabled) check();
    });

    // shuffle order
    for (var i = order.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = order[i]; order[i] = order[j]; order[j] = t;
    }
    render();
  }

  window.StatDrills = { init: init };
})();
