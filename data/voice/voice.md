# Voice (universal)

Operational voice profile for drafting in Erin's voice. Consumed by the agent before every draft (per `.claude/rules/voice-lookup.md`).

```
AUTHOR:     Erin Kerr (@erinkerr17 on X, erin.codes on Threads)
GOAL:       Build-in-public content that reads as human, technical, and specific
CONFIDENCE: High for X + LinkedIn (10+ source samples each)
            Low for everything else — borrow from X cadence until samples exist
```

## Source set

Universal voice (this file) plus:
- `data/voice/{platform}/voice.md` — per-platform direction
- `data/voice/{platform}/{task}.md` — per-task direction within a platform (e.g. Instagram scripting vs caption)
- `data/references/{platform}/*.md` — annotated examples
- `data/published.md` — what's actually shipped (drift check)

## Compression

- Cut every word that doesn't earn its place.
- Explanatory when needed (longer-form platforms) — but explanation comes from genuine thinking, not padding.
- Source evidence: *"Same features, just lives inside my terminal now"* — full idea in 8 words.

## Capitalization

Conventional. No forced lowercase. Acronyms allowed (NOAA, FDA, CBP, LOC).

## Parentheticals

Used for warmth, qualification, or self-aware aside.
Source evidence: *"(amazingly)"*, *"(or not so subtle)"*, *"(especially for solo projects)"*.
Not used for: corny over-clarification, footnote dumps.

## Question use

Rare. Only when genuine — an actual question Erin wants an answer to.
Source evidence: *"What is the absolute best day to launch on Product Hunt? Tuesday for maximum traffic or a weekend for a better shot at 'Product of the Day'?"* — real ask, not bait.

## Claim style

Anchored in concrete numbers and receipts. Specifics beat adjectives.
Source evidence: *"13,000 lines"*, *"1,524 commits"*, *"8x velocity"*, *"<72 hours"*, *"$2k freelance project"*, *"proposal #38"*.
Mechanisms over abstractions: *"rebuilt the whole thing as a Claude Code skill w/ markdown + a few scripts"* beats *"simplified my workflow."*

## Preferred moves

- Decisive number + action hook (*"Deleted 13,000 lines..."*, *"1,524 commits and manual TypeScript fixes"*)
- Tech-specific nouns: *"terminal"* not *"editor"*, *"Claude Code skill"* not *"tool"*, *"SELECT...FOR UPDATE"* not *"DB lock"*
- *"w/"* shorthand instead of *"with"* or em dash
- Single tasteful emoji at end (👾, ✍️, 😎, 😅) — one, not strings
- Thinking-out-loud parentheticals for warmth
- Casual sign-offs: *"My 2C!"*, *"Oh well.. Happy Monday"*
- Long ellipses (`.......`) — intentional anti-AI tell, preserve them
- Drop terminal periods on short standalone lines (pace, casualness)
- *"Is it X? Probably. / Is it Y? Absolutely."* paired-question rhythm

## CTA rules

- Default: no CTA.
- Allowed: genuine question Erin actually wants answered (*"best day to launch on PH?"*). Soft connect ask only when post is reflective/community-toned (rare).
- Banned: rhetorical CTAs, *"what do you think?"*, *"drop a 🚀"*, *"link in bio"* unless literally true.

## Drift check

If a draft seems to violate these rules, check `data/published.md` and `data/references/*/` for fresher evidence before rewriting. Voice evolves; this profile should evolve with it (via `.claude/rules/feedback-loop.md`).

## Hard prohibitions

Live in `.claude/rules/never-words.md` and `.claude/rules/voice-non-negotiables.md`. Those files are read first; this file builds on them with positive direction.
