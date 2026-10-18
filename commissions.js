"use strict";
/* Commissions shell, vignette + main, injected so the .html file stays a thin shell.
   Markup is byte-identical to what the .html file used to ship. */
(function () {
    "use strict";
    var mount = document.getElementById("page-mount");
    if (!mount)
        return; /* shell already present (pre-conversion HTML) */
    mount.outerHTML = `<div class="vignette" aria-hidden="true"></div>

<!-- ================= NAV ================= -->

<main>

  <!-- ================= COMMISSIONS ================= -->
  <section class="section" id="commissions">
    <div class="section__head">
      <h2 class="section__title">Commissions</h2>
      <span class="section__tag">open</span>
    </div>
    <div class="section__body">

      <p class="commissions-intro">Want something made? I take on small commissions, artwork, design, tiny web builds. Tell me what you're after and we'll talk details, timeline, and price.</p>

      <form class="commission-form" id="commission-form" data-user="ata3958" data-domain="sdsu.edu" novalidate>
        <label class="commission-field">
          <span class="commission-label">Your name</span>
          <input class="commission-input" type="text" name="name" required maxlength="80" autocomplete="name" placeholder="what should i call you">
        </label>
        <label class="commission-field">
          <span class="commission-label">Your email</span>
          <input class="commission-input" type="email" name="email" required maxlength="120" autocomplete="email" placeholder="where i can reach you">
        </label>
        <label class="commission-field">
          <span class="commission-label">What would you like made?</span>
          <textarea class="commission-input commission-textarea" name="message" required rows="6" maxlength="2000" placeholder="describe the piece, size, vibe, deadline, whatever you've got"></textarea>
        </label>
        <button class="commission-submit" type="submit">Send request</button>
        <p class="commission-note" id="commission-note" aria-live="polite"></p>
      </form>

    </div>
  </section>

</main>`;
})();
/* Commissions form, validate, then open a prefilled email (no backend).
   Moved verbatim from the inline <script> that used to live in the HTML. */
(function () {
    const form = document.getElementById("commission-form");
    if (!form)
        return;
    const note = document.getElementById("commission-note");
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        var u = form.getAttribute("data-user");
        var d = form.getAttribute("data-domain");
        var name = form.elements.namedItem("name").value.trim();
        var email = form.elements.namedItem("email").value.trim();
        var msg = form.elements.namedItem("message").value.trim();
        var subject = "Commission request from " + name;
        var body = "Name: " + name + "\nEmail: " + email + "\n\n" + msg;
        window.location.href = "mailto:" + u + "@" + d +
            "?subject=" + encodeURIComponent(subject) +
            "&body=" + encodeURIComponent(body);
        if (note)
            note.textContent = "Opening your email app with the request ready to send.";
    });
})();
