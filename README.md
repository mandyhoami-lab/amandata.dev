# amandata.dev

My personal website. Plain HTML, CSS, and JS — no build step.

Live at **https://amandata.dev** (GitHub Pages, custom domain).

> **amandata.org** is kept as a separate professional portfolio. This repo is the personal site. In active development.

## Edit me

- `index.html` — all the words on the site
- `styles.css` — colors and fonts (tokens at the top)
- `script.js` — animations (EEG trace, typewriter, scroll reveals)

## Preview

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

## Deploy

GitHub Pages serves the `main` branch (`/ (root)`) at amandata.dev.
DNS: apex A records pointing at GitHub Pages (see repo settings).

## History

See [CHANGELOG.md](CHANGELOG.md) for a catalog of notable commits.

The old Carrd-based site is kept on the `archive` branch.

### How the Carrd mirror became the site

*Written by KoriKosmos — restored from the original README:*

This started as a read-only mirror of the live site (built and hosted on Carrd),
produced by `tools/mirror.sh`. That's how `index.html` and `assets/` got here,
and it's still where the current markup came from.

**It is no longer just a mirror.** It's the working copy now. The direction is:

1. Edit here, in the repo.
2. Preview those edits locally and raise them as suggestions against the live
   design.
3. Port the agreed ones upstream while Carrd is still the host.
4. Eventually stop doing step 3 — drop Carrd and serve the site straight from
   this repo.

So the mirror is a starting point, not the source of truth. Divergence from the
live site is expected and intentional.

## Contributors

- **[Amanda Ta](https://github.com/mandyhoami-lab)** — the original live site was entirely built by me.
- **[KoriKosmos](https://github.com/KoriKosmos)** — coauthored by, KoriKosmos. Wrote the original full README and led the Carrd-mirror-to-working-copy transition.
- **Muse** — contributor.
- Assisted rebuilt commits with Claude and 2.0 (Muse by Meta). 

## To do

- [ ] Fill in the "My Work" section
