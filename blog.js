"use strict";
/* blog reader — posts are plain markdown files in /posts/ (see posts/index.json).
   To publish: add posts/<slug>.md and one line in posts/index.json. No database. */
/* NOTE: compiled by GitHub Actions on push — edit this file from anywhere. */
(function () {
    "use strict";
    /* Page shell — vignette + main, injected so the .html file stays a thin shell.
       Markup is byte-identical to what the .html file used to ship. */
    (function () {
        var mount = document.getElementById("page-mount");
        if (!mount)
            return; /* shell already present (pre-conversion HTML) */
        var style = document.createElement("style");
        style.textContent = `  .post-card{display:block;text-decoration:none;margin-bottom:1.5rem;padding:1.1rem 1.1rem 1.1rem 1.2rem;background:var(--card-bg);border:1px solid var(--line);border-left:3px solid var(--green);border-radius:4px;box-shadow:var(--card-shadow);transition:border-color 0.2s ease}
  .post-card:hover{border-left-color:var(--sand)}
  .post-card__title{font-family:var(--micro);font-size:1.5rem;letter-spacing:0.04em;color:var(--ink);margin:0 0 0.3rem}
  .post-card__date{font-family:var(--micro);font-size:1rem;letter-spacing:0.08em;color:var(--dim)}
  .post-card__excerpt{color:var(--body-text);font-size:0.95rem;margin:0.6rem 0 0}
  .back-link{display:inline-block;margin-bottom:1.5rem;font-family:var(--micro);font-size:1.2rem;letter-spacing:0.06em;color:var(--green);text-decoration:none}
  .back-link:hover{color:var(--sand)}
  #post-body h1,#post-body h2,#post-body h3{font-family:var(--micro);letter-spacing:0.04em;color:var(--ink);line-height:1.4}
  #post-body pre{background:var(--panel);border:1px solid var(--line);border-radius:4px;padding:1rem;overflow-x:auto}
  #post-body code{font-size:0.9em}
  #post-body blockquote{border-left:3px solid var(--green);margin:1.2rem 0;padding:0.2rem 0 0.2rem 1rem;color:var(--dim)}
  #post-body img{max-width:100%;border-radius:4px}
  .post-search{display:block;width:100%;max-width:26rem;margin:0 0 1.25rem;padding:0.55rem 0.9rem;background:var(--card-bg);border:1px solid var(--line);border-radius:4px;color:var(--ink);font-family:var(--micro);font-size:1.15rem;letter-spacing:0.05em}
  .post-search::placeholder{color:var(--dim)}
  .post-search:focus{outline:none;border-color:var(--green)}
  .post-search[hidden]{display:none}
  .post-count{font-family:var(--micro);font-size:1rem;letter-spacing:0.05em;color:var(--dim);margin:-0.7rem 0 1rem}
  .post-count[hidden]{display:none}
  .post-card mark{background:var(--sand);color:#1a1a1a;padding:0 0.1em;border-radius:2px}`;
        document.head.appendChild(style);
        mount.outerHTML = `<div class="vignette" aria-hidden="true"></div>

<!-- ================= NAV ================= -->

<main>

  <!-- ================= POST LIST ================= -->
  <section class="section" id="view-list">
    <div class="section__head">
      <h2 class="section__title">Blog</h2>
      <span class="section__tag">Notes &amp; essays</span>
    </div>
    <div class="section__body">
      <input type="search" id="post-search" class="post-search" placeholder="Search posts…" aria-label="Search posts" autocomplete="off" hidden>
      <p id="post-count" class="post-count" hidden></p>
      <div id="post-list"><p>Loading…</p></div>
    </div>
  </section>

  <!-- ================= SINGLE POST ================= -->
  <section class="section" id="view-post" hidden>
    <div class="post-toprow"><a class="back-link" href="/blog.html">&larr; all posts</a><button type="button" class="copy-link-btn" id="copy-link">copy link</button></div>
    <div class="section__head">
      <h2 class="section__title" id="post-title"></h2>
    </div>
    <p class="contact__intro" id="post-date"></p>
    <div id="post-body" class="section__body"></div>
  </section>

</main>`;
    })();
    var listEl = document.getElementById("post-list");
    var searchEl = document.getElementById("post-search");
    var listView = document.getElementById("view-list");
    var postView = document.getElementById("view-post");
    var allPosts = [];
    function fmtDate(iso) {
        return new Date(iso).toLocaleDateString(undefined, {
            year: "numeric", month: "long", day: "numeric"
        });
    }
    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }
    function excerpt(body) {
        var text = String(body)
            .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1") /* images -> alt text */
            .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") /* links -> link text */
            .replace(/[#>*`_~|-]/g, "")
            .replace(/\[|\]|\(|\)/g, "")
            .replace(/\n+/g, " ").trim();
        return text.length > 160 ? text.slice(0, 160) + "…" : text;
    }
    function highlight(text, q) {
        var esc = escapeHtml(text);
        if (!q)
            return esc;
        var qesc = escapeHtml(q).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return esc.replace(new RegExp("(" + qesc + ")", "gi"), "<mark>$1</mark>");
    }
    function cardHtml(p, q) {
        return '<a class="post-card" href="/blog.html?p=' + encodeURIComponent(p.slug) + '">' +
            '<h3 class="post-card__title">' + highlight(p.title, q) + "</h3>" +
            '<span class="post-card__date">' + fmtDate(p.date) + "</span>" +
            '<p class="post-card__excerpt">' + highlight(excerpt(p.body), q) + "</p></a>";
    }
    function renderList() {
        var q = searchEl ? (searchEl.value || "").trim().toLowerCase() : "";
        var matches = !q ? allPosts : allPosts.filter(function (p) {
            return (p.title + " " + p.body).toLowerCase().indexOf(q) !== -1;
        });
        var countEl = document.getElementById("post-count");
        if (countEl) {
            if (!q || !matches.length) {
                countEl.hidden = true;
            }
            else {
                countEl.hidden = false;
                countEl.textContent = matches.length === 1
                    ? "1 of " + allPosts.length + " posts"
                    : matches.length + " of " + allPosts.length + " posts";
            }
        }
        if (!matches.length) {
            listEl.innerHTML = q ? "<p>no posts match — try another search.</p>"
                : "<p>no posts yet — check back soon.</p>";
            return;
        }
        listEl.innerHTML = matches.map(function (p) { return cardHtml(p, q); }).join("");
    }
    /* Load the post manifest, then each markdown file (for excerpts + search). */
    function loadPosts() {
        return fetch("posts/index.json")
            .then(function (res) {
            if (!res.ok)
                throw new Error("index request failed");
            return res.json();
        })
            .then(function (index) {
            return Promise.all(index.map(function (meta) {
                return fetch("posts/" + meta.slug + ".md")
                    .then(function (res) {
                    if (!res.ok)
                        throw new Error("post request failed");
                    return res.text();
                })
                    .then(function (body) {
                    return { slug: meta.slug, title: meta.title, date: meta.date, body: body };
                });
            }));
        });
    }
    /* Lazy-load a script on demand. marked + DOMPurify are only needed for a
       single-post view, so the list page never downloads them. */
    function loadScript(src) {
        return new Promise(function (resolve, reject) {
            var s = document.createElement("script");
            s.src = src;
            s.onload = function () { resolve(); };
            s.onerror = function () { reject(new Error("failed to load " + src)); };
            document.head.appendChild(s);
        });
    }
    /* Show/hide the pixelated top loading bar while posts load. */
    function setLoading(on) {
        if (window.SiteLoading) {
            if (on)
                window.SiteLoading.show();
            else
                window.SiteLoading.hide();
        }
    }
    function showList() {
        setLoading(true);
        loadPosts()
            .then(function (data) {
            if (!data || !data.length) {
                listEl.innerHTML = "<p>no posts yet — check back soon.</p>";
                if (searchEl)
                    searchEl.hidden = true;
                return;
            }
            allPosts = data;
            if (searchEl)
                searchEl.hidden = false;
            renderList();
        })
            .catch(function () {
            listEl.innerHTML = "<p>couldn't load posts — try refreshing.</p>";
            if (searchEl)
                searchEl.hidden = true;
        })
            .finally(function () { setLoading(false); });
    }
    function showPost(slug) {
        listView.hidden = true;
        postView.hidden = false;
        setLoading(true);
        loadPosts()
            .then(function (data) {
            var post = null;
            for (var i = 0; i < data.length; i++) {
                if (data[i].slug === slug) {
                    post = data[i];
                    break;
                }
            }
            if (!post) {
                document.getElementById("post-title").textContent = "not found";
                document.getElementById("post-body").innerHTML = "<p>that post doesn't exist.</p>";
                return;
            }
            return Promise.all([
                loadScript("https://cdn.jsdelivr.net/npm/marked/marked.min.js"),
                loadScript("https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.min.js")
            ]).then(function () {
                document.title = post.title + " — Amanda Ta";
                document.getElementById("post-title").textContent = post.title;
                document.getElementById("post-date").textContent = fmtDate(post.date);
                var html = marked.parse(post.body || "");
                document.getElementById("post-body").innerHTML = DOMPurify.sanitize(html);
                /* Headings need ids for the in-post #anchor TOC links to work —
                   marked doesn't add them by default. */
                (function () {
                    var body = document.getElementById("post-body");
                    var seen = {};
                    var heads = body.querySelectorAll("h1,h2,h3,h4,h5,h6");
                    for (var i = 0; i < heads.length; i++) {
                        var h = heads[i];
                        if (h.id)
                            continue;
                        var slug = (h.textContent || "").toLowerCase().trim()
                            .replace(/[^\w\s-]/g, "")
                            .replace(/[\s_]+/g, "-")
                            .replace(/-+/g, "-");
                        if (!slug)
                            continue;
                        if (seen[slug] !== undefined) {
                            seen[slug]++;
                            slug = slug + "-" + seen[slug];
                        }
                        else {
                            seen[slug] = 0;
                        }
                        h.id = slug;
                    }
                })();
            });
        })
            .catch(function () {
            document.getElementById("post-body").innerHTML = "<p>couldn't load the post — try refreshing.</p>";
        })
            .finally(function () { setLoading(false); });
    }
    var slug = new URLSearchParams(location.search).get("p");
    if (searchEl) {
        searchEl.addEventListener("input", renderList);
    }
    if (slug) {
        /* These two posts live under "This Site" in the nav, not "Me" —
           move the highlight accordingly (blog.html hardcodes data-nav="me"). */
        var sitePosts = [
            "making-amandata-dev",
            "building-the-reversi-coach-turning-the-othello-bot-into-a-learning-system"
        ];
        if (sitePosts.indexOf(slug) !== -1) {
            document.body.setAttribute("data-nav", "site");
            var meToggle = document.getElementById("nav-toggle-me");
            var siteToggle = document.getElementById("nav-toggle-site");
            if (meToggle)
                meToggle.classList.remove("is-active");
            if (siteToggle)
                siteToggle.classList.add("is-active");
            var wideLinks = document.querySelectorAll(".nav__link--wide");
            for (var wi = 0; wi < wideLinks.length; wi++) {
                var wa = wideLinks[wi];
                if (wa.getAttribute("href") === "/blog.html")
                    wa.classList.remove("is-active");
            }
        }
        showPost(slug);
    }
    else
        showList();
    /* copy-link button */
    var copyBtn = document.getElementById("copy-link");
    if (copyBtn) {
        copyBtn.addEventListener("click", function () {
            var url = window.location.href;
            function done(ok) {
                copyBtn.textContent = ok ? "copied!" : "copy failed";
                setTimeout(function () { copyBtn.textContent = "copy link"; }, 1500);
            }
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url).then(function () { done(true); }, function () { done(false); });
            }
            else {
                var ta = document.createElement("textarea");
                ta.value = url;
                document.body.appendChild(ta);
                ta.select();
                try {
                    done(document.execCommand("copy"));
                }
                catch (e) {
                    done(false);
                }
                document.body.removeChild(ta);
            }
        });
    }
})();
