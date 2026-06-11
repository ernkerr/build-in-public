# Voice (universal) — base defaults

Generic voice direction that ships with the repo. Consumed before every draft (per `.claude/rules/voice-lookup.md`), then extended/overridden by the personal layer at `data/local/voice/voice.md` if it exists. Forkers: edit this file to change the defaults themselves, or let your agent build your personal layer on top.

## Source set

Universal voice (this file + local mirror) plus:
- `data/voice/{platform}/voice.md` — per-platform direction (+ local mirror)
- `data/voice/{platform}/{task}.md` — per-task direction within a platform (+ local mirror)
- `data/references/{platform}/*.md` and `data/local/references/{platform}/*.md` — annotated examples
- `data/local/published.md` — what's actually shipped (drift check)

## Compression

- Cut every word that doesn't earn its place.
- Explanatory when needed (longer-form platforms) — but explanation comes from genuine thinking, not padding.

## Capitalization

Conventional by default. No forced lowercase. Acronyms allowed.

## Parentheticals

Used for warmth, qualification, or self-aware asides. Not for corny over-clarification or footnote dumps.

## Question use

Rare. Only when genuine — an actual question the author wants an answer to. Never as engagement bait.

## Claim style

Anchored in concrete numbers and receipts. Specifics beat adjectives ("1,524 commits" not "lots of commits"). Mechanisms over abstractions ("rebuilt it as a markdown skill + a few scripts" beats "simplified my workflow"). Never invent a number — receipts come from real work.

## Preferred moves (defaults)

- Decisive number + action hook ("Deleted 13,000 lines...")
- Tech-specific nouns: "terminal" not "editor", the actual tool name not "a tool"
- Single tasteful emoji at end is OK — one, not strings
- Drop terminal periods on short standalone lines (pace, casualness)

## CTA rules

- Default: no CTA.
- Allowed: a genuine question the author actually wants answered. Soft connect ask only when the post is reflective/community-toned (rare).
- Banned: rhetorical CTAs, "what do you think?", "drop a 🚀", "link in bio" unless literally true.

## Drift check

If a draft seems to violate these rules, check `data/local/published.md` and the reference folders for fresher evidence before rewriting. Voice evolves; these files should evolve with it (via `.claude/rules/feedback-loop.md`).

## Hard prohibitions

Live in `data/voice/never-words.md` and `data/voice/non-negotiables.md` (base) plus their `data/local/voice/` mirrors. Those are read first; this file builds on them with positive direction.
