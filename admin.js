/* admin — magic-link sign in + publish posts to Supabase */
(function () {
  "use strict";

  var cfg = window.SUPABASE_CONFIG || {};
  var loginView = document.getElementById("login-view");
  var editorView = document.getElementById("editor-view");
  var loginForm = document.getElementById("login-form");
  var loginMsg = document.getElementById("login-msg");
  var postForm = document.getElementById("post-form");
  var postStatus = document.getElementById("post-status");
  var postsList = document.getElementById("posts-list");
  var submitBtn = document.getElementById("post-submit-btn");
  var cancelEditBtn = document.getElementById("cancel-edit-btn");
  var editingId = null;
  var editingSlug = null;

  if (!cfg.SUPABASE_URL || cfg.SUPABASE_URL.indexOf("YOUR_") === 0) {
    loginMsg.className = "form-error";
    loginMsg.textContent = "blog backend isn't connected yet.";
    loginForm.querySelector("button").disabled = true;
    return;
  }

  var client = supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);

  function showEditor() {
    loginView.hidden = true;
    editorView.hidden = false;
    loadPosts();
  }

  function loadPosts() {
    if (!postsList) return;
    postsList.innerHTML = "<li><span>loading…</span></li>";
    client.from("posts").select("id,title,slug,published").then(function (res) {
      if (res.error || !res.data) {
        postsList.innerHTML = "<li><span>couldn't load posts.</span></li>";
        return;
      }
      if (!res.data.length) {
        postsList.innerHTML = "<li><span>no posts yet.</span></li>";
        return;
      }
      postsList.innerHTML = "";
      res.data.forEach(function (p) {
        var li = document.createElement("li");
        var label = document.createElement("span");
        label.textContent = p.title + (p.published ? "" : " (draft)");
        var edit = document.createElement("button");
        edit.type = "button";
        edit.className = "ghost";
        edit.textContent = "Edit";
        edit.addEventListener("click", function () { startEdit(p.id); });
        li.appendChild(label);
        li.appendChild(edit);
        postsList.appendChild(li);
      });
    });
  }

  function startEdit(id) {
    postStatus.className = "";
    postStatus.textContent = "loading…";
    client.from("posts").select("id,title,slug,body,published").eq("id", id).single().then(function (res) {
      if (res.error || !res.data) {
        postStatus.className = "form-error";
        postStatus.textContent = "couldn't load that post.";
        return;
      }
      var p = res.data;
      editingId = p.id;
      editingSlug = p.slug;
      document.getElementById("post-title").value = p.title;
      document.getElementById("post-body").value = p.body;
      document.getElementById("post-published").checked = !!p.published;
      submitBtn.textContent = "Save changes";
      cancelEditBtn.hidden = false;
      postStatus.className = "";
      postStatus.textContent = "editing: " + p.title;
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function cancelEdit() {
    editingId = null;
    editingSlug = null;
    document.getElementById("post-title").value = "";
    document.getElementById("post-body").value = "";
    document.getElementById("post-published").checked = true;
    submitBtn.textContent = "Publish post";
    cancelEditBtn.hidden = true;
    postStatus.className = "";
    postStatus.textContent = "";
  }

  if (cancelEditBtn) cancelEditBtn.addEventListener("click", cancelEdit);

  // supabase-js picks up the session from the magic-link redirect automatically
  client.auth.getSession().then(function (res) {
    if (res.data && res.data.session) showEditor();
  });
  client.auth.onAuthStateChange(function (event) {
    if (event === "SIGNED_IN") showEditor();
  });

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    loginMsg.className = "";
    loginMsg.textContent = "sending…";
    var email = document.getElementById("login-email").value.trim();
    client.auth.signInWithOtp({
      email: email,
      options: { emailRedirectTo: "https://amandata.dev/admin.html" }
    }).then(function (res) {
      if (res.error) {
        loginMsg.className = "form-error";
        loginMsg.textContent = "couldn't send the link — is this the right email?";
        return;
      }
      loginMsg.className = "form-ok";
      loginMsg.textContent = "check your inbox for the sign-in link.";
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
    postStatus.textContent = "saving…";
    var title = document.getElementById("post-title").value.trim();
    var body = document.getElementById("post-body").value;
    var published = document.getElementById("post-published").checked;

    // edit mode: update the existing post, keep its slug (URL stays the same)
    if (editingId) {
      client.from("posts").update({ title: title, body: body, published: published })
        .eq("id", editingId).select("id").then(function (res) {
          if (res.error) {
            postStatus.className = "form-error";
            postStatus.textContent = "couldn't save: " + (res.error.message || "unknown error");
            return;
          }
          postStatus.className = "form-ok";
          postStatus.innerHTML = 'saved ✓ <a href="/blog.html?p=' +
            encodeURIComponent(editingSlug) + '">view it</a>';
          cancelEdit();
          loadPosts();
        });
      return;
    }

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
        loadPosts();
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
