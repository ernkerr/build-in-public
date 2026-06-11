# .claude/rules/

Auto-loaded, always-on directives. **Common layer only** — everything here is brand-agnostic and applies to *any* user of this repo. If a rule encodes one person's taste (banned words, punctuation quirks, tone), it does not belong here.

Files here should be tight: one rule (or one related cluster) per file, with a short *why* so the agent can apply it to edge cases instead of pattern-matching blindly.

## The three-layer system

- **Common rules (this folder):** process and safety. Drafting protocol, feedback loop, publish safety. True for everyone, committed.
- **Base voice defaults (`data/voice/`):** generic, committed. AI-slop bans, platform mechanics, sensible structural defaults. A forker inherits these and may edit them directly.
- **Personal voice (`data/local/voice/`):** gitignored. The user's own patterns, built from feedback and audits. Mirrors the base tree; read after base at every step of the drafting protocol; wins on conflict.

A fork ships with the first two layers and an empty personal layer — nothing personal ever leaves the machine.

## What belongs here

- **Safety rules** — never invent metrics, never publish without explicit confirmation, never embed multi-line content in bash args
- **Source-of-truth rules** — which files to read before drafting, which to never overwrite, where feedback gets saved

## What does NOT belong here

- Brand voice (banned words, cadences, tone) → `data/voice/never-words.md`, `data/voice/non-negotiables.md`, `data/voice/voice.md`
- Mode-specific prompts → those go in [modes/](../../modes/) (or the new per-channel workflow location once migrated)
- Channel format rules (X is 280 chars, etc.) → those are channel config, not always-on rules
- Examples and references → those go in `data/references/{platform}/` (or `inbox/` if not yet categorized)
