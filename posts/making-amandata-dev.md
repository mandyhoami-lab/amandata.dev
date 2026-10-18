*By tarotams*

**On this page:** [History](#history) · [Development workflow](#development-workflow) · [Design system](#design-system) · [The othello theme](#the-othello-theme) · [PSY 410 resources](#psy-410-resources) · [Content](#content) · [Milestones](#milestones) · [Technical details](#technical-details)

This is the first of many blog posts, and I wanted it to be about the site you are reading it on. amandata.dev started as a Carrd page I was renting space on and became something I built file by file, with help from [KoriKosmos](https://korikosmos.dev). What follows includes a lot of dates, stages, and tables, but the reason it exists is simpler; I wanted my own little place on the internet.

---

## History

### Origins on Carrd

The site originated as a Carrd site, a hosted site-builder page. My workflow begins at this stage: as a social scientist rather than a traditionally trained programmer, I lead creative direction while site builders and AI systems perform much of the literal implementation. The builder stage established the site's voice and visual identity before any code was hand-written.

### The mirror

[KoriKosmos](https://korikosmos.dev) ([GitHub](https://github.com/KoriKosmos)) produced a static mirror of the rendered Carrd site: a complete copy of the builder output as ordinary files. The mirror served two purposes. It demonstrated that the site consisted of readable files rather than builder-proprietary output, and it became the reference artifact for subsequent projects. The mirror workflow was later reused for the rebuilds of [amandata.org](https://amandata.org) and [tgupsd.org](https://tgupsd.org/). The original Carrd site is preserved untouched on the repository's archive branch.

### The rebuild

Working from the mirror, Kori and I rebuilt the site completely as hand-written files: index.html, styles.css, script.js, and README.md. The rebuild introduced a black, turquoise, and magenta "clinical cyber-pop" theme and removed the build step entirely. The Carrd-era site was superseded on the main branch while remaining available on the archive branch as a historical record.

## Development workflow

The site's production follows a five-stage workflow, with creative direction held by the owner throughout:

| Stage | Description | Principal |
|---|---|---|
| 1. Builder | Initial site created on Carrd; creative direction established | Mandy |
| 2. Mirror | Static copy of the rendered site produced as a reference artifact | KoriKosmos |
| 3. Rebuild | Complete rewrite as hand-written HTML/CSS/JS; no build step | Mandy and KoriKosmos |
| 4. Direction | Interactive elements and UX improvements added; personality and aesthetics preserved | Mandy |
| 5. Extension | Aesthetic system extended: theme system, type system, and content hubs | Mandy |

Stage 4 prioritized user experience across the site: a theme toggle with saved preferences, an ambient self-playing othello backdrop, a reading progress bar on the sticky header, a horizontally scrolling mobile navigation, share-preview metadata, a custom favicon, and cache-busted assets. Stage 5 extended the visual system itself, as documented in the repository changelog.

## Design system

### Typography

The type system uses three faces: Pixelify Sans for display type, VT323 for labels (selected because its font file contains true lowercase, allowing correct lowercase navigation rendering), and Nunito for body text. Display type is set at a 2px stroke, labels at 0.5px, and body at weight 600.

### Color themes

Four complete themes are available, cycled by a single toggle with the visitor's choice persisted in localStorage and the operating system preference used as fallback:

| Theme | Palette | Distinguishing details |
|---|---|---|
| Dark | Black / turquoise / magenta | Original clinical cyber-pop |
| Light | Leaf green (#2E7B3E) / deeper gold | Independent palette, not an inverted dark; hero ribbons hidden |
| Sakura pink | Warm cream / muted rose / champagne gold | Sleeping cat rendered in grey; pink ears and nose retained |
| Midnight blue | Deep navy | Darker navy navigation bar |

The navigation bar darkens per theme with gold active states, and body text is tinted to each palette rather than set in near-black.

### Motifs

Recurring visual motifs include a pixel-art cat that crawls in and sleeps over the hero title (recolored per theme), othello boards as both decoration and content, and pixel-art disc sprites generated at runtime on a 16px canvas.

## The othello theme

Othello is the site's through-line, and the choice is personal: abstract strategy board games were among my favorite childhood games, and I follow othello communities online. The motif appears in three places: the ambient page backdrop, the playable game, and the study mode.

The backdrop (September 30) began as small blurred self-playing boards at the page edges, passed through a phase as a physical wooden board with green felt, 3D discs, and animated strategy notes (candidate moves, arrows, tips, live score), and was finally flattened into an abstract graphic, thin grid, solid and ring discs, spread to the edges, so the content stays the focus.

The playable game began as a single easy mode: a teachable robot that samples a blunder rate each game (60–92% of its moves are random legal squares) and plays genuine 1-ply positional othello when focused, with an all-time scoreboard tracking wins, losses, and draws per player and combined, stored on the device. On October 1 it split into Beginner (the preserved easy game) and Advanced, a study mode in which a full-strength alpha-beta engine grades every move the moment it is played.

Two outside influences are credited on the site. [Hiyoko Reversi (ひよこリバーシ)](https://apps.apple.com/jp/app/id1197944711), a Japanese reversi application, supplied the model for the teaching interface: its post-game analysis and evaluation graph demonstrated what a study UI should do, reflected here in the board coordinates, last-move highlight, running move list, and eval graph. The progressive robot opponents and the persistent per-player statistics take cues from [Reversi Online](https://cardgames.io/reversi/): its named robot opponents and smart-opponent options were the model for a ladder of personalities worth beating.

Beginner mode has since grown its own teaching layer: a Tips section with six strategy tips adapted from Brian Rose's *Othello: A Minute to Learn… A Lifetime to Master* (credited on the page, with a link to the free PDF), and six interactive exercises, find the best move in positions about corners, X-squares, C-squares, and quiet play, with the engine checking your answer.

## PSY 410 resources

PSY 410 is Advanced Research Methods in Psychology, an undergraduate course at [San Diego State University](https://www.sdsu.edu). The site's PSY 410 resource section was built as a study aid with two audiences in mind: my classmates and I preparing for exams, and readers who have never taken a methods course at all.

Its centerpiece is a 118-term flashcard deck drawn from Myers Experimental Psychology, chapters 1–16, running on the site's shared flashcard engine: stepped card flip, topic filter, shuffle, missed-only drill, progress tracking, and keyboard grading. The deck is linked from the Learn hub alongside the othello game.

## Content

### Learn hub

The Creations hub was renamed Learn, reflecting my framing: "i build these things for people to play around with." The pages /creations.html and /games.html redirect to /learn.html. The hub contains:

- Othello in two modes: Beginner, a preserved easy game with a tips and exercises section, and Advanced, a study mode in which an alpha-beta engine grades every move (best, good, okay, risky, blunder), with board coordinates, a last-move highlight, a running move list, undo/redo, and an evaluation graph. The study interface is credited as inspired by the Japanese reversi application Hiyoko Reversi.
- A flashcard deck on a shared engine (stepped card flip, topic filter, shuffle, missed-only drill, progress tracking, keyboard grading): 118 terms from Myers Experimental Psychology, chapters 1–16.

### Blog

The site includes a Supabase-backed blog: a public Markdown reader and a passwordless magic-link publishing admin. This article is the first post published on it.

## Milestones

| Date | Milestone |
|---|---|
| 2026-09-23 | Hand-written rebuild replaces the Carrd site; Carrd original preserved on the archive branch; GitHub Pages enabled with custom domain |
| 2026-09-30 | Four-theme system; type system; sleeping cat; reading progress bar; ambient othello backdrop; Supabase-backed blog |
| 2026-10-01 | Creations becomes Learn; othello study mode; shared flashcard engine; Myers Exp. Psych Ch. 1–16, 118 terms |

## Technical details

The site is served by GitHub Pages from the main branch of its public repository, with amandata.dev configured as the custom domain. The archive branch preserves the Carrd-based site. The blog is backed by a Supabase project with row-level security permitting public reads of published posts. CSS and JavaScript assets are cache-busted so theme updates reach visitors without stale caches.

See the changelog on both this site and GitHub for a full history.