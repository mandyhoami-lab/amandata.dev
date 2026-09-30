/* admin — sign in + publish posts to Supabase */
(function () {
  "use strict";

  var cfg = window.SUPABASE_CONFIG || {};
  var loginView = document.getElementById("login-view");
  var editorView = document.getElementById("editor-view");
  var loginForm = document.getElementById("login-form");
  var loginError = document.getElementById("login-error");
  var postForm = document.getElementById("post-form");
  var postStatus = document.getElementById("post-status");

  if (!cfg.SUPABASE_URL || cfg.SUPABASE_URL.indexOf("YOUR_") === 0) {
    loginError.textContent = "blog backend isn't connected yet.";
    loginForm.querySelector("button").disabled = true;
    return;
  }

  var client = supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);

  function showEditor() {
    loginView.hidden = true;
    editorView.hidden = false;
  }

  client.auth.getSession().then(function (res) {
    if (res.data && res.data.session) showEditor();
  });

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    loginError.textContent = "";
    var email = document.getElementById("login-email").value.trim();
    var password = document.getElementById("login-pass").value;
    client.auth.signInWithPassword({ email: email, password: password }).then(function (res) {
      if (res.error) {
        loginError.textContent = "couldn't sign in — check your email and password.";
        return;
      }
      document.getElementById("login-pass").value = "";
      showEditor();
    });
  });

  function slugify(title) {
    return title.toLowerCase().trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "post";
  }

  postForm.addEventListener("submit", function (e) {
    e.preventDefault();
    postStatus.className = "";
    postStatus.textContent = "publishing…";
    var title = document.getElementById("post-title").value.trim();
    var body = document.getElementById("post-body").value;
    var published = document.getElementById("post-published").checked;
    var base = slugify(title);

    function attempt(slug, retried) {
      client.from("posts").insert({
        title: title, slug: slug, body: body, published: published
      }).then(function (res) {
        if (res.error) {
          // slug taken — retry once with a short suffix
          if (res.error.code === "23505" && !retried) {
            attempt(base + "-" + Date.now().toString(36).slice(-4), true);
            return;
          }
          postStatus.className = "form-error";
          postStatus.textContent = "couldn't publish: " + (res.error.message || "unknown error");
          return;
        }
        postStatus.className = "form-ok";
        postStatus.innerHTML = 'published ✓ <a href="/blog.html?p=' +
          encodeURIComponent(slug) + '">view it</a>';
        document.getElementById("post-title").value = "";
        document.getElementById("post-body").value = "";
      });
    }
    attempt(base, false);
  });

  document.getElementById("logout-btn").addEventListener("click", function () {
    client.auth.signOut().then(function () {
      editorView.hidden = true;
      loginView.hidden = false;
    });
  });
})();
