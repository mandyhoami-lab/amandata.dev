# Changelog

A catalog of the notable commits on this repo's `main` branch.
Full history: `git log` on the repo, or the Commits page on GitHub.

## 2026-10-01

- **Games page** — new `/games.html` with a playable 8x8 Othello vs. a
  leveling AI. You play black and move first; every win levels the AI up
  (sleepy &rarr; curious &rarr; focused &rarr; sharp &rarr; tryhard), saved
  per device in localStorage and capped at level 5, which uses 3-ply
  minimax with positional weights but no book or endgame solver — strong,
  still beatable. The board re-tints with all four themes via the shared
  token system. "Games" added to the nav on all pages.

## 2026-09-30

### Earlier on Sep 30 (exact times not recorded)

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
- **Light hero: no glow** — hero title is plain leaf green now.
- **EEG trace removed** — the hero waveform is gone.
- **Physical othello backdrop** — the overlay is now a proper wooden board
  with green felt and 3D black/white discs, bigger and clearer, with
  animated strategy notes (candidate moves, arrows, tips, live score).
- **Cache-busted assets** — CSS/JS referenced with `?v=` so theme
  updates reach visitors without stale caches.

- **1:44 AM** — **Othello frame: black instead of brown** — the board
  frame recolored from brown to black.
- **1:48 AM** — **Abstract othello backdrop** — the physical board is
  gone; the game now renders as a flat graphic (thin grid, solid/ring
  discs) spread to the edges so content stays the focus.
- **1:52 AM** — **Type system** — primary: Pixelify Sans (display),
  secondary: Silkscreen (labels), tertiary: Nunito (body).
- **1:55 AM** — **Smaller edge boards, compact tagline** — othello boards
  centered and smaller behind the hero; tagline tightened.
- **1:58 AM** — **VT323 replaces Silkscreen** — secondary font swapped to
  VT323 (whose file has true lowercase) so the nav renders in correct
  lowercase; chunkier title.
- **2:01 AM** — **Heavier words, truer colors** — display type at 2px
  stroke, labels at 0.5px, body at weight 600; dark text tinted to each
  theme's palette (deep leaf / deep rose) instead of near-black.
- **10:50 AM** — **Correct capitalization** — nav, tagline, bio, and
  admin/blog labels properly capitalized; the `amandata.dev` title stays
  lowercase; theme toggle labels capitalized.
- **10:51 AM** — **Changelog section** — new `#changelog` section on the
  homepage summarizing site updates.
- **11:54 AM** — **"my work" &rarr; "projects"** — nav and section
  renamed; section tag reads "cool stuff".
- **11:59 AM** — **Mobile nav scrolls** — nav links scroll horizontally
  on small screens with edge fades instead of overflowing.
- **12:02–12:08 PM** — **Toolkit wording** — JavaScript added to the
  toolkit list; briefly swapped to Java, then back to JavaScript.
- **12:30–12:39 PM** — **Sleeping pixel cat** — a pixel cat that crawls
  in and naps over the hero title; repositioned above `.dev`, coat
  recolored per theme.
- **12:44 PM** — **Reading progress bar** — progress now rides along the
  sticky header's bottom edge.
- **12:48 PM** — **Z's lose the title glow** — the sleeping cat's z's no
  longer inherit the hero title's outline and glow.
- **1:14 PM** — **Pink mode: softer, creamier** — pink background shifted
  to warm cream; rose accents muted; champagne gold.
- **1:16 PM** — **Pink theme: grey cat** — the cat's fur is grey in pink
  mode (pink ears and nose kept).
- **1:20 PM** — **Share preview: amandata.dev, welcome** — link-preview
  metadata updated so shared links read "amandata.dev" / "welcome".
- **1:25–1:35 PM** — **Cat favicon** — sleeping-cat icons for the tab and
  share sheet, plus a text-safe SVG; the first PNG upload landed as broken
  base64 and was re-uploaded as real binaries.
- **1:39 PM** — **PSY 410 vocab flashcards** — interactive 118-card study
  deck at `/psy410-flashcards/`, with README.


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
