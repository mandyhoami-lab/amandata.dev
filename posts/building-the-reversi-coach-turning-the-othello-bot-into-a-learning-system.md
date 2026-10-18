*By tarotams*

From a teachable robot to a study mode that grades every move: how a childhood favorite became the site's learning system.

**On this page:** [Why othello](#why-othello) · [The engine](#the-engine) · [Grading moves](#grading-moves) · [The teaching UI](#the-teaching-ui) · [Scope notes](#scope-notes) · [What's next](#whats-next)

## Why othello

Othello has been one of my favorite abstract strategy board games since I was a kid — the kind of game that takes a minute to learn and years to get good at. I've spent a long time in othello communities online, watching stronger players, picking apart my own games, learning what a good teaching interface feels like from the receiving end. So when I built a game for my site, I didn't want just another board to click on. I wanted the thing I wished existed when I was learning: a teacher.

That's what the [Learn hub](https://amandata.dev/learn.html) othello page became — a two-mode system. Beginner is the preserved easy game, for people who have never played. Advanced is a study mode where an engine grades every move the moment you play it. The rest of this post is about how the study mode works.

## The engine

Both modes share one engine (`othello.js`, exposed as `window.OthelloEngine` so the pages stay thin). The core is a negamax search with alpha-beta pruning over a standard positional evaluation: disc count, mobility, corners, and edge stability.

- Coaching grades moves at depth 3.
- The robot plays at depth 3, full strength, no blunders.
- The eval graph samples at depth 2 so it stays cheap.

A depth-4 opening search runs in about 4–18 ms locally, which means grading feels instant. One early bug was worth mentioning: the first version ran the root search inside a narrowed window and produced negative score differences — it claimed the move you played was *better* than its own best move. The fix was giving the root search the full window. After that, a scripted 60-move engine-vs-engine game with 438 graded candidate moves produced zero best-move violations.

## Grading moves

Grading compares the engine's evaluation of the move you played against its evaluation of the best move, and the difference maps to a verdict:

| Verdict | Meaning |
|---|---|
| best | you found it (or within 1 centipawn of it) |
| good | within 25 |
| okay | within 70, and it names the stronger square |
| risky | within 150 |
| blunder | beyond that — "was much stronger" |

The verdict appears instantly, stays visible while the robot replies, and gets tagged onto the move in the move list. The point is the tight feedback loop: play, get judged, see why, try again. Undo and redo let you rewind and take the better square once you know what it was.

## The teaching UI

The study interface is inspired by [Hiyoko Reversi (ひよこリバーシ)](https://apps.apple.com/jp/app/id1197944711), a Japanese reversi app whose post-game analysis and evaluation graph showed me what a teaching UI should do. It's credited on the page. From it I took:

- Board coordinates, so moves have names (d3, f5) you can talk about.
- A red last-move highlight, so your eye lands on what just changed.
- A running move list with verdict tags.
- An evaluation graph from your perspective, clamped to ±800, so you can see exactly where the game swung.

The progressive robot opponents and the persistent per-player statistics take cues from [Reversi Online](https://cardgames.io/reversi/) — its named robot opponents and smart-opponent options were the model for a ladder of personalities worth beating. (CardGames.io also hosts online human play.)

The discs are the same pixel-art cat heads as the beginner game — generated at runtime on a 16px canvas, scaled up with `image-rendering: pixelated`. Cream cat for white, black cat with amber eyes for black. They break out of the disc circle, at my specific request.

## Scope notes

Records are honest about what they are: the scoreboard (Everyone plus one tab per username, W-L-D) lives in localStorage, so "all-time" means all-time on this device. The static site has no backend, and the page says so. True cross-device records would need a server; that's a future decision, not a silent promise.

## What's next

The bigger plan is a real learning system, and this is the foundation: an engine that can judge, a UI that can explain, and a beginner mode that doesn't scare people off. Since this post was drafted, Beginner has grown a Tips section (six strategy tips adapted from Brian Rose's *Othello: A Minute to Learn… A Lifetime to Master*) and six interactive exercises — find the best move in positions about corners, X-squares, C-squares, and quiet play. Next up would be per-player advanced records and maybe an opening book. For now: play a game, watch the graph, and find the move where it all went wrong.