# PSY 410 Vocab Flashcards

An interactive flashcard deck covering every key vocabulary term from **PSY 410 (Experimental Psychology)** — built for drilling before the mini-exam.

Open it here: **https://amandata.dev/psy410-flashcards/** (or open `index.html` in any browser — it works fully offline).

## What's inside

- **118 flashcards** across 11 chapters: 1, 2, 7, 8, 9, 10, 11, 12, 14, 15, 16
- Every term + definition pulled from the course review guide (`psy410-mini-exam-review.docx`)
- Chapters 3–6 and 13 are intentionally excluded — the syllabus places them after the mini-exam

## Features

- **Tap to flip** — term on the front, definition on the back
- **Got it / Still learning** — grade each card as you go; the deck tracks your progress
- **Missed-only mode** — drill just the cards you haven't nailed yet
- **Chapter filter** — study one chapter at a time or the whole deck
- **Shuffle** — randomize the order for every session
- **Progress bar** — see how far through the deck you are
- **Keyboard shortcuts** — `space` flips, `→` marks "got it", `←` marks "still learning"
- **Mobile-friendly** — designed to work well on a phone

## How to study with it

1. Run through the full deck once, honestly marking what you know vs. don't.
2. Switch on **Missed only** and drill those until they're gone.
3. Shuffle and do a final full pass. If you clear it, you're ready.

Since the concepts are already solid, the fastest path is recognition speed: flip fast, say the definition out loud before flipping, and don't linger on cards you know.

## Running locally

No build step, no dependencies — it's one self-contained HTML file.

```bash
# from this folder
python3 -m http.server 8000
# then open http://localhost:8000
```

Or just double-click `index.html`.

## Files

| File         | What it is                                              |
|--------------|---------------------------------------------------------|
| `index.html` | The whole app — cards, styling, and logic in one file   |
| `README.md`  | This file                                               |

## Notes

- Card data is embedded directly in `index.html` as JSON, so the deck never needs a network connection after it loads.
- Progress ("got it" / "still learning") resets when the page reloads — each study session starts fresh.
- Chapter 15 is covered as **Quasi-Experimental Designs**; confirm against your class notes if your section labeled it differently.
- This is a study aid, not coursework — it contains no assignment answers.
