# amandata.dev

My personal website, live at **https://amandata.dev**. GitHub Pages and custom domain.

> **amandata.org** is kept as a separate professional portfolio. This repo is the personal site. In active development.

## How it's built

- **Pages are thin HTML shells.** Each `*.html` is mostly a `<head>` and an empty `<main>`; the content is injected by its matching TypeScript file.
- **TypeScript sources** (`*.ts`) compile to the `*.js` files next to them. Edit the `.ts`, never the compiled `.js`. A GitHub Action (`.github/workflows/build-typescript.yml`) auto-compiles on push, so the `.js` is build output.
- **Hand-written `.js`** files are marked with a `// hand-written, not compiled from .ts` header: the `stat200-*` practice hub files and `synergy-lang.js` (the Synergy esolang interpreter).
- **Shared chrome** (nav, theme toggle, footer) is injected by `layout.js` on every page.
- **Blog posts** are markdown files in `posts/` with a `posts/index.json` manifest. To publish: add `posts/<slug>.md`, add one line to `index.json`, push.
- **No build step needed locally** beyond `npx tsc -p tsconfig.json` if you want to check compilation. `npm run build` does the same.

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
