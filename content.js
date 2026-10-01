/* Renders SITE_DATA (content-data.js) into the changelog and CV sections.
   Runs on index.html only; no-ops everywhere else. Data is authored
   in-house, so innerHTML is safe here. */
(function () {
  "use strict";
  var D = window.SITE_DATA;
  if (!D) return;

  var cl = document.getElementById("changelog-list");
  if (cl && D.changelog) {
    cl.innerHTML = D.changelog.map(function (e) {
      return "<li><strong>" + e.d + "</strong> \u2014 " + e.h + "</li>";
    }).join("");
  }

  var stats = document.getElementById("cv-stats");
  if (stats && D.cv && D.cv.stats) {
    stats.innerHTML = D.cv.stats.map(function (s) {
      return '<div class="stat" role="listitem">' +
        '<span class="stat__num" data-count="' + s.n + '">' + s.n + "</span>" +
        '<span class="stat__label">' + s.label + "</span></div>";
    }).join("");
  }

  var blocks = document.getElementById("cv-blocks");
  if (blocks && D.cv && D.cv.blocks) {
    blocks.innerHTML = D.cv.blocks.map(function (b) {
      var inner = "";
      if (b.kind === "list") {
        inner = '<ul class="cv-list">' + b.items.map(function (i) {
          return "<li>" + i + "</li>";
        }).join("") + "</ul>";
      } else if (b.kind === "entries") {
        inner = b.entries.map(function (e) {
          return '<div class="cv-entry">' +
            '<div class="cv-entry__meta"><span>' + e.meta[0] + "</span><span>" + e.meta[1] + "</span></div>" +
            '<p class="cv-entry__role">' + e.role + "</p>" +
            '<p class="cv-entry__lab">' + e.lab + "</p>" +
            '<p class="cv-entry__mentor">' + e.mentor + "</p>" +
            e.body.map(function (p) { return "<p>" + p + "</p>"; }).join("") +
            "</div>";
        }).join("");
      } else if (b.kind === "skills") {
        inner = '<div class="skills-grid">' + b.cols.map(function (c) {
          return '<div class="skills-col"><h4>' + c.h + "</h4><p>" + c.p + "</p></div>";
        }).join("") + "</div>";
      }
      return '<div class="cv-block"><h3 class="cv-block__title">' + b.title + "</h3>" + inner + "</div>";
    }).join("");
  }
})();
