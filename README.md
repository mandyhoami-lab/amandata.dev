# amandata.dev

research stuff

## How this repo works

`index.html` and `assets/` are **generated**, not hand-written. They are a mirror
of the live site, produced by [`tools/mirror.sh`](tools/mirror.sh).

**Do not edit them directly — the next sync overwrites your changes.** Edit the
live site, then let the mirror pick it up. Anything that needs to differ from
upstream belongs in the sanitation steps inside `tools/mirror.sh`.

```bash
tools/mirror.sh            # fetch, sanitize, write
tools/mirror.sh --check    # report whether anything changed; writes nothing
```

A [scheduled workflow](.github/workflows/mirror.yml) runs it daily at 07:00 UTC
and commits any change. You can also trigger it by hand from the Actions tab.
The script aborts rather than committing if the fetch doesn't look like the real
site, so a Cloudflare challenge page fails the run instead of clobbering a good
mirror.

### Sanitation applied

- Cloudflare's obfuscated email link is decoded to a plain `mailto:`. The hex
  payload is XOR'd with a per-response key, so it is decoded programmatically.
- The `/cdn-cgi/` email-decode script is dropped; it 404s off Cloudflare.
- `?v=<hash>` cache-busting is stripped from asset refs, so a republish with no
  content change produces an empty diff.
- The one builder string in the output, an IndexedDB store name, is renamed. The
  output contains no builder references at all.

Most of the generated code is deliberately left as-is. There was never a badge
or attribution notice to remove, and the ~39KB inline runtime and the
`instance-N` / `text-component` class scheme stay: excising them from minified
generated JS isn't reliably scriptable, and a rewrite wouldn't be a mirror.

### Known limitation

The contact form is `method="post"` with no `action`; the current host's backend
handles it. **It will not work if this repo is ever served as the site** (static
hosting has nothing to receive the POST). It would need a form service such as
Formspree or FormSubmit, or to be replaced with a `mailto:` link.

## Branches

- `main` — the mirror.
- `legacy-site` — the earlier hand-written Othello-themed portfolio
  (`index.html` + `style.css` + `script.js`), kept for reference.
