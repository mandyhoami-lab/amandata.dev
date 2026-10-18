/* Multiple-choice quizzes — midterm-style.
   window.StatQuiz.init(container, items)
   items: [{ q, choices[4], correct (0-3), explain }] */
(function () {
  'use strict';

  function init(container, items) {
    var idx = 0, correct = 0;
    var order = items.map(function (_, i) { return i; });
    for (var i = order.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = order[i]; order[i] = order[j]; order[j] = t;
    }

    function render() {
      if (idx >= order.length) {
        var pct = Math.round(correct / items.length * 100);
        container.innerHTML = '<div class="quiz-done"><h3>' + correct + ' / ' + items.length +
          ' (' + pct + '%)</h3><p>' +
          (pct >= 90 ? 'midterm-ready.' : pct >= 70 ? 'close — review the ones you missed.' : 'hit the flashcards and drills, then try again.') +
          '</p><button class="quiz-btn" type="button" data-restart>retake</button></div>';
        container.querySelector('[data-restart]').addEventListener('click', function () {
          init(container, items);
        });
        return;
      }
      var item = items[order[idx]];
      var html = '<div class="quiz-wrap">' +
        '<div class="quiz-progress">question ' + (idx + 1) + ' of ' + items.length +
        ' · ' + correct + ' correct</div>' +
        '<div class="quiz-q">' + escapeHtml(item.q) + '</div><div class="quiz-choices">';
      item.choices.forEach(function (c, ci) {
        html += '<button type="button" class="quiz-choice" data-ci="' + ci + '">' +
          escapeHtml(c) + '</button>';
      });
      html += '</div><div class="quiz-feedback" hidden></div>' +
        '<button type="button" class="quiz-btn quiz-next" hidden>next &rarr;</button></div>';
      container.innerHTML = html;

      var answered = false;
      var choices = container.querySelectorAll('.quiz-choice');
      var feedback = container.querySelector('.quiz-feedback');
      var nextBtn = container.querySelector('.quiz-next');
      choices.forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (answered) return;
          answered = true;
          var picked = parseInt(btn.getAttribute('data-ci'), 10);
          var good = picked === item.correct;
          if (good) correct++;
          choices.forEach(function (b2) {
            var ci2 = parseInt(b2.getAttribute('data-ci'), 10);
            if (ci2 === item.correct) b2.classList.add('quiz-right');
            else if (ci2 === picked) b2.classList.add('quiz-wrong');
            b2.disabled = true;
          });
          feedback.hidden = false;
          feedback.className = 'quiz-feedback ' + (good ? 'quiz-good' : 'quiz-bad');
          feedback.textContent = (good ? '✓ ' : '✗ ') + (item.explain || '');
          nextBtn.hidden = false;
        });
      });
      nextBtn.addEventListener('click', function () { idx++; render(); });
    }

    function escapeHtml(s) {
      return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    render();
  }

  window.StatQuiz = { init: init };
})();
