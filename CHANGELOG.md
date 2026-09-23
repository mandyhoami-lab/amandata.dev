# Changelog

A catalog of the notable commits on this repo's `main` branch.
Full history: `git log` on the repo, or the Commits page on GitHub.

## 2026-09-23

- **Rebrand to amandata.dev (personal website)** — site and README
  rebranded from amandata.org to amandata.dev. This repo now serves
  the personal site at https://amandata.dev via GitHub Pages
  (custom domain). amandata.org is kept as a separate
  professional portfolio.
- **Update credits** (`26a3c34`) — README credits now read
  "Rebuilt with Claude and 2.0 (personal bot created with Muse
  by Meta)." plus "Contributor: Muse."
- **Enable GitHub Pages** — Pages turned on for `main` / root;
  custom domain set to amandata.dev.
- **Hand-written rebuild** (`dd7ad56`) — replaced the Carrd-era
  site with four hand-written files: `index.html`, `styles.css`,
  `script.js`, `README.md`. Black/turquoise/magenta clinical
  cyber-pop theme, no build step.
- **`archive` branch created** — the complete Carrd-based site
  (old `index.html`, `assets/images/`, `tools/mirror.sh`,
  `.github/workflows/mirror.yml`, etc.) preserved on the
  `archive` branch before `main` was replaced.

## Branches

- `main` — the live personal site (amandata.dev)
- `archive` — the old Carrd-based site, untouched
- `legacy-site` — older branch, untouched
