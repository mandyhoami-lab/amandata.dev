/* admin — email+password sign in (owner only) + publish/edit posts in Supabase */
(function () {
  "use strict";

  var OWNER_EMAIL = "mandyhoami@gmail.com";
  var MAX_ATTEMPTS = 5;
  var LOCKOUT_MS = 60000;
  var THROTTLE_KEY = "admin-login-throttle";

  var cfg = window.SUPABASE_CONFIG || {};
  var loginView = document.getElementById("login-view");
  var editorView = document.getElementById("editor-view");
  var loginForm = document.getElementById("login-form");
  var loginBtn = document.getElementById("login-btn");
  var forgotBtn = document.getElementById("forgot-btn");
  var forgotForm = document.getElementById("forgot-form");
  var newpassForm = document.getElementById("newpass-form");
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

  /* ---- login brute-force throttle (per device) ---- */
  function throttleState() {
    try { return JSON.parse(localStorage.getItem(THROTTLE_KEY) || "{}"); }
    catch (e) { return {}; }
  }
  function saveThrottle(s) {
    try { localStorage.setItem(THROTTLE_KEY, JSON.stringify(s)); } catch (e) {}
  }
  function isLockedOut() {
    var s = throttleState();
    return !!(s.lockedUntil && Date.now() < s.lockedUntil);
  }
  function lockoutMsg() {
    var s = throttleState();
    var secs = Math.max(1, Math.ceil(((s.lockedUntil || 0) - Date.now()) / 1000));
    return "too many tries — wait " + secs + "s, then try again.";
  }
  function recordFailure() {
    var s = throttleState();
    s.count = (s.count || 0) + 1;
    if (s.count >= MAX_ATTEMPTS) { s.lockedUntil = Date.now() + LOCKOUT_MS; s.count = 0; }
    saveThrottle(s);
  }
  function clearThrottle() { saveThrottle({}); }

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

  /* ---- session + recovery ---- */
  client.auth.getSession().then(function (res) {
    if (res.data && res.data.session) showEditor();
  });
  client.auth.onAuthStateChange(function (event) {
    if (event === "SIGNED_IN") { showEditor(); return; }
    if (event === "PASSWORD_RECOVERY") {
      loginForm.hidden = true;
      forgotForm.hidden = true;
      if (forgotBtn) forgotBtn.hidden = true;
      newpassForm.hidden = false;
      loginMsg.className = "";
      loginMsg.textContent = "choose a new password.";
    }
  });

  /* ---- password sign in (owner email only) ---- */
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (isLockedOut()) {
      loginMsg.className = "form-error";
      loginMsg.textContent = lockoutMsg();
      return;
    }
    var email = document.getElementById("login-email").value.trim().toLowerCase();
    var password = document.getElementById("login-password").value;
    if (email !== OWNER_EMAIL) {
      recordFailure();
      loginMsg.className = "form-error";
      loginMsg.textContent = isLockedOut() ? lockoutMsg() : "wrong email or password.";
      return;
    }
    loginMsg.className = "";
    loginMsg.textContent = "signing in…";
    loginBtn.disabled = true;
    client.auth.signInWithPassword({ email: email, password: password }).then(function (res) {
      loginBtn.disabled = false;
      if (res.error) {
        recordFailure();
        loginMsg.className = "form-error";
        loginMsg.textContent = isLockedOut() ? lockoutMsg() : "wrong email or password.";
        return;
      }
      clearThrottle();
      /* SIGNED_IN event shows the editor */
    });
  });

  /* ---- forgot password: email a reset link, then set a new password here ---- */
  if (forgotBtn) forgotBtn.addEventListener("click", function () {
    forgotForm.hidden = !forgotForm.hidden;
    loginMsg.className = "";
    loginMsg.textContent = "";
  });
  forgotForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById("forgot-email").value.trim().toLowerCase();
    loginMsg.className = "";
    loginMsg.textContent = "sending…";
    if (email !== OWNER_EMAIL) {
      /* generic reply either way — don't reveal which emails have accounts */
      loginMsg.className = "form-ok";
      loginMsg.textContent = "if that email has an account, a reset link is on its way.";
      return;
    }
    client.auth.resetPasswordForEmail(email, {
      redirectTo: "https://amandata.dev/admin.html"
    }).then(function (res) {
      loginMsg.className = res.error ? "form-error" : "form-ok";
      loginMsg.textContent = res.error
        ? "couldn't send the reset email — try again in a bit."
        : "check your inbox for the reset link, then set a new password here.";
    });
  });
  newpassForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var p1 = document.getElementById("newpass-1").value;
    var p2 = document.getElementById("newpass-2").value;
    if (p1.length < 8) {
      loginMsg.className = "form-error";
      loginMsg.textContent = "password needs at least 8 characters.";
      return;
    }
    if (p1 !== p2) {
      loginMsg.className = "form-error";
      loginMsg.textContent = "the two passwords don't match.";
      return;
    }
    loginMsg.className = "";
    loginMsg.textContent = "saving…";
    client.auth.updateUser({ password: p1 }).then(function (res) {
      if (res.error) {
        loginMsg.className = "form-error";
        loginMsg.textContent = "couldn't save — reopen the reset link and try again.";
        return;
      }
      loginMsg.className = "form-ok";
      loginMsg.textContent = "password saved.";
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
