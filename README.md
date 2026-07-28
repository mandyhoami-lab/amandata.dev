# amandata.dev

research stuff

## What this repo is

This started as a read-only mirror of the live site (built and hosted on Carrd),
produced by [`tools/mirror.sh`](tools/mirror.sh). That's how `index.html` and
`assets/` got here, and it's still where the current markup came from.

**It is no longer just a mirror.** It's the working copy now. The direction is:

1. Edit here, in the repo.
2. Preview those edits locally and raise them as suggestions against the live
   design.
3. Port the agreed ones upstream while Carrd is still the host.
4. Eventually stop doing step 3 — drop Carrd and serve the site straight from
   this repo.

So the mirror is a starting point, not the source of truth. Divergence from the
live site is expected and intentional.

## Editing

`index.html` and `assets/` are **fair game to edit.** They are hand-maintained
from here on.

The one thing to keep in mind: `index.html` is 90KB of minified,
builder-generated markup. It is not pretty, and reformatting the whole file would
bury every real change in a 90KB diff, so it stays minified for now. Prefer
small, surgical edits. If a real build step (source files + a minifier) becomes
worth it, that's the point to add one.

To preview, open `index.html` in a browser, or serve the directory:

```bash
python3 -m http.server 8000   # then http://localhost:8000
```

### The enhancements block

At the bottom of `index.html`, between

```html
<!-- BEGIN local enhancements -->  …  <!-- END local enhancements -->
```

is one readable `<style>` + `<script>` pair holding everything hand-added so far.
It is appended rather than woven into the minified markup, so it diffs cleanly,
reads like normal code, and can be lifted out in one piece. **New presentation
work should go here** in preference to editing the generated soup above it.

Everything in it is keyed to the page's own content — an EEG trace under the hero,
a highlighter sweep across the biography's green key terms (the page coding its
own themes, the way she codes interview data), staggered section reveals, a
typewriter on the tagline, retro press states, a reading-progress bar, and a CRT
vignette.

Three rules it holds to, worth keeping if you extend it:

- **Everything fails open.** Elements are only ever hidden by script, never by
  the stylesheet, so a JS error or an unsupported property leaves the page fully
  readable instead of blank.
- **`prefers-reduced-motion` kills animation** rather than shortening it — every
  effect lands in its final state instantly.
- **Nothing flashes faster than 3Hz** ([WCAG 2.3.1]). The caret blinks at ~1Hz
  and the trace is continuous motion with no luminance flicker. On a psychology
  portfolio read by clinical researchers, a photosensitivity trigger is the one
  bug that can't be walked back.

One structural landmine to know about: Carrd switches sections with
`section.className = 'inactive'`, a plain assignment that **wipes every class on
a `<section>` element.** Nothing in the block ever puts a class on a `<section>`;
hooks live on injected wrappers or on the sections' children.

A bare `tools/mirror.sh` reset deletes this block along with everything else —
that's what the delimiters are for. Copy it out first, or recover it from git.

[WCAG 2.3.1]: https://www.w3.org/WAI/WCAG21/Understanding/three-flashes-or-below-threshold

### Fixes worth porting back to Carrd

Things fixed here that are really upstream bugs, i.e. step 3 of the plan above:

- **The contact icons were invisible.** The theme sets `fill: #000000` and a
  black border on the Email and LinkedIn icons, on a page whose background is
  `#000000`. They only appeared on hover, where the fill flips to white. The
  block overrides them to white with an accent-blue hover; the real fix is the
  icon colour in the site editor.

## Watching upstream

The live Carrd site can still change under us. A
[scheduled workflow](.github/workflows/mirror.yml) runs `tools/mirror.sh --check`
daily at 07:00 UTC and reports whether the live site has moved. It **writes
nothing and commits nothing** — drift is a signal to go look, not something to
auto-apply, since applying it would flatten our edits.

```bash
tools/mirror.sh --check     # has the live site moved? writes nothing
tools/mirror.sh --baseline  # acknowledge an upstream change; leaves our files alone
tools/mirror.sh             # DESTRUCTIVE: reset index.html + assets/ to live
```

`upstream/index.html` is the baseline: the last sanitized copy of the live site we
looked at. `--check` diffs against **that**, not against our `index.html` — our
own edits aren't drift, and comparing against an edited file would report drift
every day forever regardless of what Carrd did. The baseline is never served;
only `mirror.sh` writes it.

So the loop when the check fires is: look at what changed upstream, port it or
decide not to, then `tools/mirror.sh --baseline` and commit. That's what marks it
as seen and quiets the report.

The bare form is a deliberate full reset to upstream and it discards local edits.
It's kept because it's occasionally the right move — re-pulling after a big
upstream redesign — not because it should ever run on a schedule again.

The script aborts rather than reporting nonsense if the fetch doesn't look like
the real site, so a Cloudflare challenge page fails the run instead of being
mistaken for an upstream rewrite.

### Sanitation the mirror applies

Relevant when re-pulling, and as a record of how the markup here differs from
what Carrd actually serves:

- Cloudflare's obfuscated email link is decoded to a plain `mailto:`. The hex
  payload is XOR'd with a per-response key, so it is decoded programmatically.
- The `/cdn-cgi/` email-decode script is dropped; it 404s off Cloudflare.
- `?v=<hash>` cache-busting is stripped from asset refs, so a republish with no
  content change produces an empty diff.
- The one builder string in the output, an IndexedDB store name, is renamed. The
  output contains no builder references at all.

The ~39KB inline runtime and the `instance-N` / `text-component` class scheme
were left as-is, because excising them from minified generated JS isn't reliably
scriptable and a mirror shouldn't be a rewrite. Now that this is a working copy
instead of a mirror, that second reason no longer applies — unwinding them is on
the table (see below).

## Before this can replace Carrd

Known blockers for step 4. Listed to be tracked, not being worked on yet:

- **The contact form.** It's `method="post"` with no `action`; Carrd's backend
  handles it. Static hosting has nothing to receive the POST, so it will silently
  do nothing if this repo is served as the site. Needs a form service
  (Formspree, FormSubmit, a small Worker) or to become a `mailto:` link.
- **Hosting + DNS.** A `CNAME` has been added and removed twice in this repo's
  history; wherever we land (GitHub Pages, Cloudflare Pages, elsewhere) needs
  deciding once, along with where the apex and `www` records point.
- **The generated cruft.** The inline runtime, the `instance-N` class scheme, and
  the single minified file are all builder artifacts. None of it has to survive
  the pivot, but replacing it is a rewrite and deserves to be its own effort.
- **The mirror's self-mirror guard.** `tools/mirror.sh` verifies the fetch
  contains `indexedDB.open('carrd')` before trusting it. That's what stops it
  overwriting a good copy with a Cloudflare challenge page — but the day the
  domain points at this repo, the live site serves our sanitized
  `indexedDB.open('site')`, the marker check fails, and the drift job goes red
  permanently. Retiring `mirror.sh` (or its marker list) is part of the cutover,
  not a bug to fix before it.

## Branches

- `main` — the working copy (started from the mirror).
- `legacy-site` — the earlier hand-written Othello-themed portfolio
  (`index.html` + `style.css` + `script.js`), kept for reference.

## Credits

Coauthored and maintained by my husband,
[KoriKosmos](https://github.com/KoriKosmos).
