# Voice Profile

Operational voice profile for drafting in Erin's voice. Consumed by `modes/draft.md` and adapt steps.
Source-backed: every banned move is observable in `data/style-refs/*` or explicitly requested.

```
VOICE PROFILE
=============
Author:     Erin Kerr (@erinkerr17 on X, erin.codes on Threads)
Goal:       Build-in-public posts that read as human, technical, and specific
Confidence: High for X + LinkedIn (10+ source samples each)
            Low for Threads + Bluesky (no source samples yet — borrow from X cadence)
```

## Source Set

- `data/style-refs/x.md` — Erin's own posts + saved refs (slop bucket, cook or be cooked, RAAS, etc.)
- `data/style-refs/linkedin.md` — Refs A–O (LOC reviewed, cognitive offloading, 20hr side project, etc.)
- `data/style-refs/threads.md` — empty, fall back to X
- `data/style-refs/bluesky.md` — empty, fall back to X
- `data/published.md` — what's actually shipped (drift check)

## Rhythm

- Short fragments with line breaks for pacing on X. Standalone lines, no terminal periods.
- Longer thinking-out-loud paragraphs on LinkedIn. Sentences breathe, not bullet-pointed.
- Punchy meme cadence at the extreme ("RAAS", "cook or be cooked") — one-line posts that work as standalone declarations.

## Compression

- Very compressed on X. Cut every word that doesn't earn its place.
- Explanatory on LinkedIn — but explanation comes from genuine thinking, not from padding.
- Source evidence: "Same features, just lives inside my terminal now" — full idea in 8 words.

## Capitalization

Conventional. No forced lowercase. Acronyms allowed (NOAA, FDA, CBP, LOC).

## Parentheticals

Used for warmth, qualification, or self-aware aside.
Source evidence: "(amazingly)", "(or not so subtle)", "(especially for solo projects)".
Not used for: corny over-clarification, footnote dumps.

## Question Use

Rare. Only when genuine — actual question Erin wants an answer to.
Source evidence: "What is the absolute best day to launch on Product Hunt? Tuesday for maximum traffic or a weekend for a better shot at 'Product of the Day'?" — real ask, not bait.

## Claim Style

Anchored in concrete numbers and receipts. Specifics beat adjectives.
Source evidence: "13,000 lines", "1,524 commits", "8x velocity", "<72 hours", "$2k freelance project", "proposal #38".
Mechanisms over abstractions: "rebuilt the whole thing as a Claude Code skill w/ markdown + a few scripts" beats "simplified my workflow."

## Preferred Moves

- Decisive number + action hook ("Deleted 13,000 lines...", "1,524 commits and manual TypeScript fixes")
- Tech-specific nouns: "terminal" not "editor", "Claude Code skill" not "tool", "SELECT...FOR UPDATE" not "DB lock"
- "w/" shorthand instead of "with" or em dash
- Single tasteful emoji at end (👾, ✍️, 😎, 😅) — one, not strings
- Thinking-out-loud parentheticals for warmth
- Casual sign-offs: "My 2C!", "Oh well.. Happy Monday"
- Long ellipses (`.......`) — intentional anti-AI tell, preserve them
- Drop terminal periods on short standalone lines (pace, casualness)
- "Is it X? Probably. / Is it Y? Absolutely." paired-question rhythm

## Banned Moves

Every entry below is observable as a thing Erin avoids in the source set or explicitly flagged.

- "Not because X. Not because Y. Because Z." — guru cadence (flagged in linkedin.md AVOID)
- "Here's the truth most developers don't want to hear:" — guru framing (flagged in linkedin.md AVOID)
- "The hardest part wasn't X. It was Y." — Instagram-quote territory (flagged in linkedin.md AVOID)
- Punchy AI-y maxims as closes: "That's it. That's the whole thing." — see [[feedback_whimsy_lean_into_cadence]]
- Bait-question closes: "What's the dumbest thing you've shipped this month?" — see [[feedback_whimsy_lean_into_cadence]]
- "That's the loop." style declarative button endings
- Rhetorical CTAs that farm replies: "What's the simplest form your product could take?"
- Em dashes mid-sentence — use commas, parens, or "w/"
- "Excited to share" / "Here's why this matters" openers
- Periods at the end of every line in short X posts
- AI vocabulary: delve, leverage, foster, landscape, tapestry, game-changer, unlock, empower, harness, cutting-edge, innovative, robust
- Overly clean polished endings — leave room for an emoji or casual aside

## CTA Rules

Default: no CTA.
Allowed: genuine question Erin actually wants answered ("best day to launch on PH?"). Soft connect ask only when post is reflective/community-toned (rare).
Banned: rhetorical CTAs, "what do you think?", "drop a 🚀", "link in bio" unless literally true.

## Channel Notes

### X
- Compressed. Hook is the first line.
- 1–2 hashtags max, `#buildinpublic` is the default.
- Drop terminal periods on standalone short lines.
- Single emoji at end is OK, not required.
- Threads (multi-tweet): only when one tweet would collapse the argument. Each tweet advances.

### LinkedIn
- First 2 lines hook before the "see more" fold.
- Think out loud — show the work, not a polished thesis.
- Parentheticals for warmth.
- No fake founder-journey filler, no "professional takeaway" paragraphs.
- Casual sign-off OK ("My 2C!"). No bait closes.

### Threads
- No source samples yet — fall back to compressed X cadence.
- Casual, conversational, no hashtags.
- Single emoji at end is fine.
- 500 char limit — more room than X but don't pad to fill it.

### Bluesky
- No source samples yet — fall back to compressed X cadence.
- Early-Twitter techy/indie register.
- 300 char limit. No hashtag gaming, no algo bait.

## Drift Check

If a draft seems to violate these rules, check `data/published.md` and `data/style-refs/` for fresher evidence before rewriting. Voice evolves; this profile should evolve with it.

Related: [[feedback_long_ellipsis_anti_ai_tell]], [[feedback_whimsy_lean_into_cadence]], [[feedback_save_all_style_refs]]
