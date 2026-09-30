# Changelog

A catalog of the notable commits on this repo's `main` branch.
Full history: `git log` on the repo, or the Commits page on GitHub.

## 2026-09-30

- **Pink and blue themes** — sakura pink and midnight blue join dark
  and light as full standalone themes; the toggle cycles
  dark &rarr; light &rarr; pink &rarr; blue. EEG trace, othello pieces,
  and hero ribbons follow the active theme.
- **Light theme rework** — light is its own palette, not an inverted
  dark: leaf-green (`#2E7B3E`) text and accents, leaf-green headings,
  deeper gold; the glossy hero ribbons are hidden in light mode.
- **"about me" bio** — "Biography" renamed to "about me" with a new
  casual bio and links for all three labs (JSBCAI, Kappenman lab,
  Center for Tobacco and the Environment) and named people.
- **Hero refresh** — lowercase `amandata.dev` title with forward
  slant, recentered and resized; new tagline.
- **Supabase-backed blog** — `blog.html` (public reader, Markdown via
  Marked + DOMPurify) and `admin.html` (passwordless email magic-link
  publishing), backed by the `amandata-blog` Supabase project
  (`posts` table; RLS: public reads published posts, authenticated
  users manage them).
- **Dark/light theme toggle + ambient othello backdrop** — saved
  `localStorage` preference (`amandata-theme`) with system-preference
  fallback; small blurred self-playing othello boards at the page
  edges (single board on narrow screens).
- **Nav bar darkened per theme** — the nav now sits on a darker box
  (black in dark, deep leaf in light, darker magenta in pink, darker navy
  in blue) with white links and gold active states. Reverted the earlier
  section-title recolor (it was based on a misspeak).
- **Mobile nav scrolls** — nav links scroll horizontally on small screens
  instead of overflowing.
- **Light hero: no glow** — hero title is plain leaf green now.
- **Abstract othello backdrop** — the physical board is gone; the game
  now renders as a flat graphic (thin grid, solid/ring discs) spread to
  the edges so content stays the focus.
- **Type system** — primary: Pixelify Sans (display), secondary:
  Silkscreen (labels), tertiary: Nunito (body). Cutesy videogamey,
  your call honored.
- **Heavier type** — body text at weight 500; display and micro faces
  get a slight stroke so the words read thicker.
- **EEG trace removed** — the hero waveform is gone.
- **Othello board centered & smaller** — sits behind the hero at a
  calmer size; flip animation softened.
- **Physical othello backdrop** — the overlay is now a proper wooden board
  with green felt and 3D black/white discs, bigger and clearer, with
  animated strategy notes (candidate moves, arrows, tips, live score).
- **"my work" &rarr; "projects"** — nav and section renamed.
- **Changelog section** — new `#changelog` section on the homepage
  summarizing site updates.
- **Cache-busted assets** — CSS/JS referenced with `?v=` so theme
  updates reach visitors without stale caches.

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
