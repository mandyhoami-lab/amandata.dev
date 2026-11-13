/* blog reader, posts are plain markdown files in /posts/ (see posts/index.json).
   To publish: add posts/<slug>.md and one line in posts/index.json. No database. */
/* NOTE: compiled by GitHub Actions on push, edit this file from anywhere. */

(function () {
  "use strict";

  /* Page shell, vignette + main, injected so the .html file stays a thin shell.
     Markup is byte-identical to what the .html file used to ship. */
  (function () {
    var mount = document.getElementById("page-mount");
    if (!mount) return; /* shell already present (pre-conversion HTML) */
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
  .post-card mark{background:var(--sand);color:#1a1a1a;padding:0 0.1em;border-radius:2px}
  .post-comments{margin-top:2rem;border-top:1px solid var(--line);padding-top:1.25rem}
  .post-comments h3{font-family:var(--micro);letter-spacing:0.04em;color:var(--ink);margin:0 0 0.75rem}
  .reactions{display:flex;flex-wrap:wrap;gap:0.5rem;margin:0 0 1.25rem}
  .reaction-btn{background:var(--card-bg);border:1px solid var(--line);border-radius:20px;padding:0.35rem 0.75rem;font-size:1rem;color:var(--ink);cursor:pointer;font-family:var(--micro);letter-spacing:0.03em}
  .reaction-btn:hover{border-color:var(--green)}
  .reaction-btn.is-active{border-color:var(--green);background:var(--panel)}
  .reaction-btn:disabled{opacity:0.6;cursor:default}
  .comment-list{list-style:none;margin:0 0 1.25rem;padding:0}
  .comment{padding:0.8rem 0;border-bottom:1px solid var(--line)}
  .comment__meta{font-family:var(--micro);font-size:1rem;letter-spacing:0.05em;color:var(--dim);margin-bottom:0.3rem}
  .comment__body{color:var(--body-text);margin:0;white-space:pre-wrap;overflow-wrap:break-word}
  .comment-form input,.comment-form textarea{display:block;width:100%;box-sizing:border-box;margin-bottom:0.6rem;padding:0.55rem 0.9rem;background:var(--card-bg);border:1px solid var(--line);border-radius:4px;color:var(--ink);font-family:var(--micro);font-size:1.1rem;letter-spacing:0.03em}
  .comment-form textarea{min-height:5rem;resize:vertical}
  .comment-form input:focus,.comment-form textarea:focus{outline:none;border-color:var(--green)}
  .comment-form button{background:var(--green);color:#fff;border:none;border-radius:4px;padding:0.55rem 1.1rem;font-family:var(--micro);font-size:1.1rem;letter-spacing:0.05em;cursor:pointer}
  .comment-form button:disabled{opacity:0.6;cursor:default}
  .comment-note{font-size:0.9rem;color:var(--dim);margin:0.5rem 0 0}
  .comment-status{color:var(--dim);font-size:0.95rem;margin:0 0 0.75rem}
  #post-body h2[id],#post-body h3[id],#post-body h4[id]{scroll-margin-top:4.5rem}
  .heading-link{margin-left:0.4rem;padding:0 0.3rem;background:none;border:1px solid transparent;border-radius:4px;color:var(--dim);font:inherit;font-size:0.85em;cursor:pointer;opacity:0;transition:opacity 0.15s ease}
  #post-body h2:hover .heading-link,#post-body h3:hover .heading-link,#post-body h4:hover .heading-link,.heading-link:focus-visible{opacity:1}
  .heading-link:hover{color:var(--green);border-color:var(--line)}
  @media (hover:none){.heading-link{opacity:0.6}}
  .code-wrap{position:relative}
  .code-wrap pre{padding-right:4.5rem}
  .code-copy{position:absolute;top:0.4rem;right:0.4rem;padding:0.15rem 0.6rem;background:var(--card-bg);border:1px solid var(--line);border-radius:4px;color:var(--dim);font-family:var(--micro);font-size:1rem;letter-spacing:0.04em;cursor:pointer}
  .code-copy:hover{border-color:var(--green);color:var(--green)}
  @media (prefers-reduced-motion:reduce){.heading-link{transition:none}}`;
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

    <!-- ================= COMMENTS + REACTIONS ================= -->
    <section id="post-comments" class="post-comments" hidden>
      <h3>Reactions</h3>
      <div class="reactions" id="reactions"></div>
      <h3>Comments</h3>
      <p class="comment-status" id="comment-status">Loading comments…</p>
      <ul class="comment-list" id="comment-list"></ul>
      <form class="comment-form" id="comment-form">
        <input type="text" id="comment-name" maxlength="50" placeholder="Your name (pick any display name)" aria-label="Your display name" autocomplete="off">
        <textarea id="comment-body" maxlength="2000" placeholder="Leave a comment…" aria-label="Your comment"></textarea>
        <button type="submit" id="comment-submit">Post comment</button>
      </form>
      <p class="comment-note">No sign-in needed — just pick a display name. It shows next to your comment.</p>
    </section>
  </section>

</main>`;
  })();


  var listEl = document.getElementById("post-list") as HTMLElement;
  var searchEl = document.getElementById("post-search") as HTMLInputElement | null;
  var listView = document.getElementById("view-list") as HTMLElement;
  var postView = document.getElementById("view-post") as HTMLElement;
  var allPosts: any[] = [];

  /* Comments + reactions (Supabase, amandata-blog project). No sign-in:
     anyone can read and post with a display name; RLS allows anon SELECT +
     INSERT only, no update/delete. The config script is loaded by blog.html;
     until the blog_comments / blog_reactions tables exist, the section
     stays hidden. */
  var SB = window.SUPABASE_CONFIG;
  var COMMENTS_ON = !!(SB && SB.SUPABASE_URL && SB.SUPABASE_ANON_KEY);
  var REACTION_EMOJIS = ["👍", "❤️", "🎉", "🤔"];
  var currentSlug = "";

  interface PostMeta { slug: string; title: string; date: string; }

  function fmtDate(iso: string): string {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric", month: "long", day: "numeric"
    });
  }

  function escapeHtml(s: string): string {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function excerpt(body: string): string {
    var text = String(body)
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")  /* images -> alt text */
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")   /* links -> link text */
      .replace(/[#>*`_~|-]/g, "")
      .replace(/\[|\]|\(|\)/g, "")
      .replace(/\n+/g, " ").trim();
    return text.length > 160 ? text.slice(0, 160) + "…" : text;
  }

  function highlight(text: string, q: string): string {
    var esc = escapeHtml(text);
    if (!q) return esc;
    var qesc = escapeHtml(q).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return esc.replace(new RegExp("(" + qesc + ")", "gi"), "<mark>$1</mark>");
  }

  function readTime(body: string): string {
    var words = String(body).trim().split(/\s+/).length;
    var mins = Math.max(1, Math.round(words / 200));
    return mins + " min";
  }

  function cardHtml(p: any, q: string): string {
    return '<a class="post-card" href="/blog.html?p=' + encodeURIComponent(p.slug) + '">' +
      '<h3 class="post-card__title">' + highlight(p.title, q) + "</h3>" +
      '<span class="post-card__date">' + fmtDate(p.date) + " · " + readTime(p.body) + "</span>" +
      '<p class="post-card__excerpt">' + highlight(excerpt(p.body), q) + "</p></a>";
  }

  function renderList(): void {
    var q = searchEl ? (searchEl.value || "").trim().toLowerCase() : "";
    var matches = !q ? allPosts : allPosts.filter(function (p: any) {
      return (p.title + " " + p.body).toLowerCase().indexOf(q) !== -1;
    });
    var countEl = document.getElementById("post-count");
    if (countEl) {
      if (!q || !matches.length) { countEl.hidden = true; }
      else {
        countEl.hidden = false;
        countEl.textContent = matches.length === 1
          ? "1 of " + allPosts.length + " posts"
          : matches.length + " of " + allPosts.length + " posts";
      }
    }
    if (!matches.length) {
      listEl.innerHTML = q ? "<p>no posts match, try another search.</p>"
                           : "<p>no posts yet, check back soon.</p>";
      return;
    }
    listEl.innerHTML = matches.map(function (p) { return cardHtml(p, q); }).join("");
  }

  /* Load the post manifest, then each markdown file (for excerpts + search). */
  function loadPosts(): Promise<any[]> {
    return fetch("posts/index.json")
      .then(function (res) {
        if (!res.ok) throw new Error("index request failed");
        return res.json();
      })
      .then(function (index: PostMeta[]) {
        return Promise.all(index.map(function (meta) {
          return fetch("posts/" + meta.slug + ".md")
            .then(function (res) {
              if (!res.ok) throw new Error("post request failed");
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
  function loadScript(src: string): Promise<void> {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error("failed to load " + src)); };
      document.head.appendChild(s);
    });
  }

  /* Show/hide the pixelated top loading bar while posts load. */
  function setLoading(on: boolean): void {
    if (window.SiteLoading) {
      if (on) window.SiteLoading.show(); else window.SiteLoading.hide();
    }
  }

  function showList(): void {
    setLoading(true);
    loadPosts()
      .then(function (data: any) {
        if (!data || !data.length) {
          listEl.innerHTML = "<p>no posts yet, check back soon.</p>";
          if (searchEl) searchEl.hidden = true;
          return;
        }
        allPosts = data;
        if (searchEl) searchEl.hidden = false;
        renderList();
      })
      .catch(function () {
        listEl.innerHTML = "<p>couldn't load posts, try refreshing.</p>";
        if (searchEl) searchEl.hidden = true;
      })
      .finally(function () { setLoading(false); });
  }

  function showPost(slug: string): void {
    listView.hidden = true;
    postView.hidden = false;
    setLoading(true);
    loadPosts()
      .then(function (data: any) {
        var post: any = null;
        for (var i = 0; i < data.length; i++) {
          if (data[i].slug === slug) { post = data[i]; break; }
        }
        if (!post) {
          (document.getElementById("post-title") as HTMLElement).textContent = "not found";
          (document.getElementById("post-body") as HTMLElement).innerHTML = "<p>that post doesn't exist.</p>";
          return;
        }
        return Promise.all([
          loadScript("https://cdn.jsdelivr.net/npm/marked/marked.min.js"),
          loadScript("https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.min.js")
        ]).then(function () {
          document.title = post.title + ", Amanda Ta";
          (document.getElementById("post-title") as HTMLElement).textContent = post.title;
          (document.getElementById("post-date") as HTMLElement).textContent = fmtDate(post.date) + " · " + readTime(post.body);
          var html = marked.parse(post.body || "");
          (document.getElementById("post-body") as HTMLElement).innerHTML = DOMPurify.sanitize(html);
          /* Headings need ids for the in-post #anchor TOC links to work:
             marked doesn't add them by default. */
          (function (): void {
            var body = document.getElementById("post-body") as HTMLElement;
            var seen: { [k: string]: number } = {};
            var heads = body.querySelectorAll("h1,h2,h3,h4,h5,h6");
            for (var i = 0; i < heads.length; i++) {
              var h = heads[i] as HTMLElement;
              if (h.id) continue;
              var slug = (h.textContent || "").toLowerCase().trim()
                .replace(/[^\w\s-]/g, "")
                .replace(/[\s_]+/g, "-")
                .replace(/-+/g, "-");
              if (!slug) continue;
              if (seen[slug] !== undefined) { seen[slug]++; slug = slug + "-" + seen[slug]; }
              else { seen[slug] = 0; }
              h.id = slug;
            }
          })();
          readingTools();
          initComments(slug);
        });
      })
      .catch(function () {
        (document.getElementById("post-body") as HTMLElement).innerHTML = "<p>couldn't load the post, try refreshing.</p>";
      })
      .finally(function () { setLoading(false); });
  }

  /* ---------- reading tools (borrowed from korikosmos.dev) ----------
     After a post renders: a # button on each heading that copies a link to
     that section, a copy button on code blocks, and a progress strip under
     the nav that tracks the article. */

  function copyText(text: string): Promise<boolean> {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return false; });
    }
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return Promise.resolve(ok);
  }

  /* Swap a button's label briefly to report the copy result. */
  function flash(btn: HTMLElement, ok: boolean, idle: string): void {
    btn.textContent = ok ? "copied!" : "copy failed";
    setTimeout(function () { btn.textContent = idle; }, 1500);
  }

  function readingTools(): void {
    var body = document.getElementById("post-body") as HTMLElement;

    /* "#" buttons: copy a link straight to that section. */
    var linkable = body.querySelectorAll("h2[id],h3[id],h4[id]");
    for (var j = 0; j < linkable.length; j++) {
      (function (h: HTMLElement): void {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "heading-link";
        btn.textContent = "#";
        btn.setAttribute("aria-label", "Copy link to section: " + (h.textContent || ""));
        btn.addEventListener("click", function () {
          var url = location.href.split("#")[0] + "#" + h.id;
          try { history.replaceState(null, "", url); } catch (e) { /* file:// etc. */ }
          copyText(url).then(function (ok) {
            btn.textContent = ok ? "\u2713" : "!";
            setTimeout(function () { btn.textContent = "#"; }, 1500);
          });
        });
        h.appendChild(btn);
      })(linkable[j] as HTMLElement);
    }

    /* Copy buttons on code blocks. */
    var blocks = body.querySelectorAll("pre");
    for (var k = 0; k < blocks.length; k++) {
      (function (pre: HTMLElement): void {
        var wrap = document.createElement("div");
        wrap.className = "code-wrap";
        pre.parentNode!.insertBefore(wrap, pre);
        wrap.appendChild(pre);
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "code-copy";
        btn.textContent = "copy";
        btn.setAttribute("aria-label", "Copy code");
        btn.addEventListener("click", function () {
          copyText(pre.textContent || "").then(function (ok) { flash(btn, ok, "copy"); });
        });
        wrap.appendChild(btn);
      })(blocks[k] as HTMLElement);
    }

    postProgress();

    /* The post renders after load, so the browser's own jump to #section
       already missed. Do it now that the heading exists. */
    if (location.hash) {
      var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) target.scrollIntoView();
    }
  }

  /* Progress strip under the sticky nav, tracking the article (title to the
     end of the post body), not the comments below it. */
  var progressBound = false;
  function postProgress(): void {
    var nav = document.querySelector(".nav");
    if (!nav || progressBound) return;
    progressBound = true;
    var bar = document.createElement("div");
    bar.className = "progress";
    bar.setAttribute("aria-hidden", "true");
    nav.appendChild(bar);
    var article = document.getElementById("post-body") as HTMLElement;
    var queued = false;
    function update(): void {
      queued = false;
      var rect = article.getBoundingClientRect();
      var start = postView.getBoundingClientRect().top + window.scrollY;
      var end = rect.bottom + window.scrollY - window.innerHeight;
      var span = end - start;
      var pct = span > 0 ? (window.scrollY - start) / span : 1;
      bar.style.width = Math.max(0, Math.min(1, pct)) * 100 + "%";
    }
    function request(): void {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    }
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    update();
  }

  /* ---------- comments + reactions ---------- */

  function sbHeaders(): { [k: string]: string } {
    return {
      "apikey": SB!.SUPABASE_ANON_KEY,
      "Authorization": "Bearer " + SB!.SUPABASE_ANON_KEY,
      "Content-Type": "application/json"
    };
  }

  function sbGet(table: string, query: string): Promise<any[]> {
    return fetch(SB!.SUPABASE_URL + "/rest/v1/" + table + "?" + query, { headers: sbHeaders() })
      .then(function (res) {
        if (!res.ok) throw new Error("request failed");
        return res.json();
      });
  }

  function sbPost(table: string, row: any): Promise<any[]> {
    var headers = sbHeaders();
    headers["Prefer"] = "return=representation";
    return fetch(SB!.SUPABASE_URL + "/rest/v1/" + table, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(row)
    }).then(function (res) {
      if (!res.ok) throw new Error("request failed");
      return res.json();
    });
  }

  function setCommentStatus(text: string): void {
    var statusEl = document.getElementById("comment-status") as HTMLElement;
    statusEl.textContent = text;
    statusEl.hidden = !text;
  }

  function commentHtml(c: any): string {
    return '<li class="comment"><div class="comment__meta">' + escapeHtml(c.author_name) +
      " · " + fmtDate(c.created_at) + '</div><p class="comment__body">' +
      escapeHtml(c.body).replace(/\n/g, "<br>") + "</p></li>";
  }

  function loadComments(slug: string): void {
    var section = document.getElementById("post-comments") as HTMLElement;
    var listEl = document.getElementById("comment-list") as HTMLElement;
    sbGet("blog_comments", "select=id,author_name,body,created_at&post_slug=eq." +
      encodeURIComponent(slug) + "&order=created_at.asc")
      .then(function (rows) {
        listEl.innerHTML = rows.map(commentHtml).join("");
        if (!rows.length) setCommentStatus("No comments yet — be the first.");
        else setCommentStatus("");
        section.hidden = false;
        loadReactions(slug);
      })
      .catch(function () { section.hidden = true; });
  }

  function loadReactions(slug: string): void {
    sbGet("blog_reactions", "select=emoji&post_slug=eq." + encodeURIComponent(slug))
      .then(function (rows) {
        var counts: { [k: string]: number } = {};
        rows.forEach(function (r: any) { counts[r.emoji] = (counts[r.emoji] || 0) + 1; });
        renderReactions(counts);
      })
      .catch(function () { renderReactions({}); });
  }

  function renderReactions(counts: { [k: string]: number }): void {
    var box = document.getElementById("reactions") as HTMLElement;
    var reacted: string[] = [];
    try { reacted = JSON.parse(localStorage.getItem("amandata-reacted-" + currentSlug) || "[]"); } catch (e) { /* ignore */ }
    box.innerHTML = REACTION_EMOJIS.map(function (em) {
      var n = counts[em] || 0;
      var active = reacted.indexOf(em) !== -1;
      return '<button type="button" class="reaction-btn' + (active ? " is-active" : "") +
        '" data-emoji="' + em + '"' + (active ? " disabled" : "") + ">" + em + " " + n + "</button>";
    }).join("");
  }

  function initComments(slug: string): void {
    if (!COMMENTS_ON) return;
    currentSlug = slug;
    var nameInput = document.getElementById("comment-name") as HTMLInputElement;
    try {
      var saved = localStorage.getItem("amandata-comment-name");
      if (saved && nameInput) nameInput.value = saved;
    } catch (e) { /* private mode */ }
    loadComments(slug);
  }

  /* Reaction taps: one per emoji per browser (soft guard via localStorage). */
  var reactionsBox = document.getElementById("reactions") as HTMLElement | null;
  if (reactionsBox) {
    reactionsBox.addEventListener("click", function (ev) {
      var btn = (ev.target as HTMLElement).closest(".reaction-btn") as HTMLButtonElement | null;
      if (!btn || btn.disabled || !COMMENTS_ON || !currentSlug) return;
      var emoji = btn.getAttribute("data-emoji") || "";
      var clickedBtn = btn;
      clickedBtn.disabled = true;
      sbPost("blog_reactions", { post_slug: currentSlug, emoji: emoji })
        .then(function () {
          try {
            var reacted: string[] = JSON.parse(localStorage.getItem("amandata-reacted-" + currentSlug) || "[]");
            reacted.push(emoji);
            localStorage.setItem("amandata-reacted-" + currentSlug, JSON.stringify(reacted));
          } catch (e) { /* private mode */ }
          clickedBtn.classList.add("is-active");
          var n = parseInt((clickedBtn.textContent || "").replace(/[^\d]/g, ""), 10) || 0;
          clickedBtn.textContent = emoji + " " + (n + 1);
        })
        .catch(function () { clickedBtn.disabled = false; });
    });
  }

  /* Comment submit: display name + text, no account. Name is remembered
     on this device so repeat commenters don't retype it. */
  var commentForm = document.getElementById("comment-form") as HTMLFormElement | null;
  if (commentForm) {
    commentForm.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!COMMENTS_ON || !currentSlug) return;
      var nameEl = document.getElementById("comment-name") as HTMLInputElement;
      var bodyEl = document.getElementById("comment-body") as HTMLTextAreaElement;
      var submitEl = document.getElementById("comment-submit") as HTMLButtonElement;
      var name = (nameEl.value || "").trim();
      var body = (bodyEl.value || "").trim();
      if (!name) { setCommentStatus("Add a display name first."); nameEl.focus(); return; }
      if (!body) { setCommentStatus("Write a comment first."); bodyEl.focus(); return; }
      submitEl.disabled = true;
      sbPost("blog_comments", { post_slug: currentSlug, author_name: name, body: body })
        .then(function (rows) {
          try { localStorage.setItem("amandata-comment-name", name); } catch (e) { /* private mode */ }
          bodyEl.value = "";
          setCommentStatus("");
          var listEl = document.getElementById("comment-list") as HTMLElement;
          if (rows && rows.length) {
            listEl.insertAdjacentHTML("beforeend", commentHtml(rows[0]));
          } else {
            loadComments(currentSlug);
          }
        })
        .catch(function () { setCommentStatus("Couldn't post — try again in a bit."); })
        .finally(function () { submitEl.disabled = false; });
    });
  }

  var slug = new URLSearchParams(location.search).get("p");
  var qParam = new URLSearchParams(location.search).get("q");
  if (searchEl) {
    searchEl.addEventListener("input", renderList);
    /* nav search passes ?q=, pre-fill so renderList filters on load */
    if (qParam) searchEl.value = qParam;
  }
  if (slug) {
    /* These two posts live under "This Site" in the nav, not "Me":
       move the highlight accordingly (blog.html hardcodes data-nav="me"). */
    var sitePosts = [
      "making-amandata-dev",
      "building-the-reversi-coach-turning-the-othello-bot-into-a-learning-system"
    ];
    if (sitePosts.indexOf(slug) !== -1) {
      document.body.setAttribute("data-nav", "site");
      var meToggle = document.getElementById("nav-toggle-me");
      var siteToggle = document.getElementById("nav-toggle-site");
      if (meToggle) meToggle.classList.remove("is-active");
      if (siteToggle) siteToggle.classList.add("is-active");
      var wideLinks = document.querySelectorAll(".nav__link--wide");
      for (var wi = 0; wi < wideLinks.length; wi++) {
        var wa = wideLinks[wi] as HTMLAnchorElement;
        if (wa.getAttribute("href") === "/blog.html") wa.classList.remove("is-active");
      }
    }
    showPost(slug);
  }
  else showList();

  /* copy-link button */
  var copyBtn = document.getElementById("copy-link") as HTMLButtonElement | null;
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      copyText(window.location.href).then(function (ok) { flash(copyBtn!, ok, "copy link"); });
    });
  }
})();
