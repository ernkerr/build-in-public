# Keep the docs current — split public/private

Two documents, two audiences, both updated AS PART of the change (never "later"):

- **README.md (public):** features, commands, setup, examples — how a stranger uses the repo. Any commit that adds or changes a capability updates the README in the **same commit**: feature table row, commands list, setup steps, and an example if the capability is user-facing.
- **`data/local/decisions.md` (private, gitignored):** the design log — one entry per decision with real trade-offs, format **Challenge / Considered / Chose / Why** (+ optional Escape hatch). This is the user's record for answering "why is it built this way" — it never ships.

## Why

A stale README reads as an abandoned repo — forkers judge by it. And the decisions log only works if it's complete; a why-log with gaps is worse than none. Splitting them keeps the public face clean (what it does) and the private record honest (what it cost to decide).
