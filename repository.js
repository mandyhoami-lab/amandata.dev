/* =========================================================
   amandata.dev — repository file browser.

   Client-side browser for the public GitHub repo
   mandyhoami-lab/amandata.dev via the GitHub contents API.
   Fail-open: if the API can't be reached, the page still links
   straight to the repo on github.com.
   ========================================================= */
(function () {
  'use strict';

  var OWNER = 'mandyhoami-lab';
  var REPO = 'amandata.dev';
  var REPO_URL = 'https://github.com/' + OWNER + '/' + REPO;

  var crumbsEl = document.getElementById('repo-crumbs');
  var listEl = document.getElementById('repo-list');
  if (!crumbsEl || !listEl) return;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function fmtSize(bytes) {
    if (!bytes && bytes !== 0) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

  function fail(msg) {
    listEl.innerHTML =
      '<p class="repo-status">' + esc(msg) + ' ' +
      'Browse it directly on <a class="repo-link" href="' + REPO_URL +
      '" target="_blank" rel="noopener">GitHub</a>.</p>';
  }

  function renderCrumbs(path) {
    var html = '<a class="repo-crumb" href="#" data-path="">' + esc(REPO) + '</a>';
    if (path) {
      var parts = path.split('/');
      var acc = '';
      parts.forEach(function (part, i) {
        acc += (i ? '/' : '') + part;
        html += ' <span class="repo-sep" aria-hidden="true">/</span> ' +
          '<a class="repo-crumb" href="#" data-path="' + esc(acc) + '">' + esc(part) + '</a>';
      });
    }
    crumbsEl.innerHTML = html;
  }

  function renderList(path, items) {
    if (!items.length) {
      listEl.innerHTML = '<p class="repo-status">This folder is empty.</p>';
      return;
    }
    items.sort(function (a, b) {
      if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    var html = items.map(function (it) {
      var isDir = it.type === 'dir';
      var sub = isDir ? '' : ' <span class="repo-size">' + esc(fmtSize(it.size)) + '</span>';
      return (
        '<div class="repo-row">' +
        (isDir
          ? '<a class="repo-name repo-dir" href="#" data-path="' + esc(it.path) + '"><span class="repo-icon" aria-hidden="true">\u25b8</span> ' + esc(it.name) + '</a>'
          : '<a class="repo-name" href="' + esc(it.html_url) + '" target="_blank" rel="noopener">' + esc(it.name) + '</a>') +
        sub +
        '</div>'
      );
    }).join('');
    listEl.innerHTML = html;
  }

  function load(path) {
    renderCrumbs(path);
    listEl.innerHTML = '<p class="repo-status">Loading files&hellip;</p>';
    var url = 'https://api.github.com/repos/' + OWNER + '/' + REPO + '/contents/' +
      path.split('/').map(encodeURIComponent).join('/');
    fetch(url, { headers: { 'Accept': 'application/vnd.github.v3+json' } })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        renderList(path, Array.isArray(data) ? data : []);
      })
      .catch(function () {
        fail('Couldn\u2019t reach the GitHub API right now.');
      });
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-path]');
    if (!t || !crumbsEl.contains(t) && !listEl.contains(t)) return;
    if (!t.classList.contains('repo-crumb') && !t.classList.contains('repo-dir')) return;
    e.preventDefault();
    load(t.getAttribute('data-path') || '');
  });

  load('');
})();
