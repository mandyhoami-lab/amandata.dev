/* blog reader — pulls posts from Supabase */
(function () {
  "use strict";

  var cfg = window.SUPABASE_CONFIG || {};
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
    var text = String(body).replace(/[#>*`_~|-]/g, "").replace(/\n+/g, " ").trim();
    return text.length > 160 ? text.slice(0, 160) + "…" : text;
  }

  function cardHtml(p) {
    return '<a class="post-card" href="/blog.html?p=' + encodeURIComponent(p.slug) + '">' +
      '<h3 class="post-card__title">' + escapeHtml(p.title) + "</h3>" +
      '<span class="post-card__date">' + fmtDate(p.created_at) + "</span>" +
      '<p class="post-card__excerpt">' + escapeHtml(excerpt(p.body)) + "</p></a>";
  }

  function renderList() {
    var q = searchEl ? (searchEl.value || "").trim().toLowerCase() : "";
    var matches = !q ? allPosts : allPosts.filter(function (p) {
      return (p.title + " " + p.body).toLowerCase().indexOf(q) !== -1;
    });
    if (!matches.length) {
      listEl.innerHTML = q ? "<p>no posts match — try another search.</p>"
                           : "<p>no posts yet — check back soon.</p>";
      return;
    }
    listEl.innerHTML = matches.map(cardHtml).join("");
  }

  function showList(client) {
    client.from("posts")
      .select("title,slug,body,created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .then(function (res) {
        if (res.error || !res.data || !res.data.length) {
          listEl.innerHTML = "<p>no posts yet — check back soon.</p>";
          if (searchEl) searchEl.hidden = true;
          return;
        }
        allPosts = res.data;
        if (searchEl) searchEl.hidden = false;
        renderList();
      }, function () {
        listEl.innerHTML = "<p>couldn't load posts — try refreshing.</p>";
        if (searchEl) searchEl.hidden = true;
      });
  }

  function showPost(client, slug) {
    listView.hidden = true;
    postView.hidden = false;
    client.from("posts")
      .select("title,body,created_at")
      .eq("slug", slug)
      .eq("published", true)
      .single()
      .then(function (res) {
        if (res.error || !res.data) {
          document.getElementById("post-title").textContent = "not found";
          document.getElementById("post-body").innerHTML = "<p>that post doesn't exist.</p>";
          return;
        }
        document.title = res.data.title + " — Amanda Ta";
        document.getElementById("post-title").textContent = res.data.title;
        document.getElementById("post-date").textContent = fmtDate(res.data.created_at);
        var html = marked.parse(res.data.body || "");
        document.getElementById("post-body").innerHTML = DOMPurify.sanitize(html);
      }, function () {
        document.getElementById("post-body").innerHTML = "<p>couldn't load the post — try refreshing.</p>";
      });
  }

  if (!cfg.SUPABASE_URL || cfg.SUPABASE_URL.indexOf("YOUR_") === 0) {
    listEl.innerHTML = "<p>blog is waking up — check back soon.</p>";
    return;
  }

  var client = supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
  var slug = new URLSearchParams(location.search).get("p");
  if (searchEl) {
    searchEl.addEventListener("input", renderList);
  }
  if (slug) showPost(client, slug);
  else showList(client);
})();
