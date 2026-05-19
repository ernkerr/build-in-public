# .claude/rules/

Auto-loaded, always-on directives. Things the agent should never violate, regardless of mode or channel.

Files here should be tight: one rule (or one related cluster) per file, with a short *why* so the agent can apply it to edge cases instead of pattern-matching blindly.

## What belongs here

- **Voice non-negotiables** — banned words, banned cadences, anti-AI tells to preserve
- **Safety rules** — never invent metrics, never publish without explicit confirmation, never embed multi-line content in bash args
- **Source-of-truth rules** — which files to read before drafting, which to never overwrite

## What does NOT belong here

- Mode-specific prompts → those go in [modes/](../../modes/) (or the new per-channel workflow location once migrated)
- Channel format rules (X is 280 chars, etc.) → those are channel config, not always-on rules
- Examples and references → those go in `data/references/{platform}/` (or `inbox/` if not yet categorized)

## Loading

These files are not yet wired into CLAUDE.md or the skill loader. As rules are extracted out of `modes/_shared.md` and the memory system, add the relevant import or reference here so they're actually picked up.
