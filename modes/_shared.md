# Shared Context

## Voice, rules, and references

Drafting protocol lives in [.claude/rules/voice-lookup.md](../.claude/rules/voice-lookup.md). Channel format limits (X 280 chars, LinkedIn 3000, etc.) live in `data/voice/{platform}/voice.md`. Hard prohibitions live in `.claude/rules/never-words.md` and `.claude/rules/voice-non-negotiables.md`.

Don't duplicate any of that here — those files are the single source of truth.

## Reading Git History

To understand what the user has been working on:
```bash
git log --oneline -20          # Recent commits
git log --oneline --since="3 days ago"  # Last 3 days
git diff HEAD~5 --stat         # What files changed recently
```

Read the ACTUAL git history of whatever repo the user is currently in. Don't assume or make up commits.

## Saving Data

- Drafts go in `data/drafts.md` as a markdown table row
- Published posts go in `data/published.md`
- Voice learnings go to the appropriate level of `data/voice/` (per `.claude/rules/feedback-loop.md`)
- References go in `data/references/{platform}/` (per `modes/learn.md`)

Always append to existing data, never overwrite the whole file (unless the user explicitly says so — see `.claude/rules/feedback-loop.md`).

## Natural-language publish

**"post it"** (and variants like *"post linkedin and fb"*, *"post all"*, *"ship bluesky"*) is the primary publish path during a drafting session. It maps to `modes/publish.md` Step 0 — direct publish from active conversation drafts, no menu walk.

The `/build-in-public publish` menu (Step 1+) is for the cold-start case: reviewing leftover pending drafts from earlier sessions. If the user is mid-ideation, prefer Step 0.

## LinkedIn-primary auto-fanout

When a draft session picks LinkedIn as primary, `modes/draft.md` Step 5.5 auto-drafts Facebook, Bluesky, and X variants in the same response. The user iterates on all of them side-by-side and ships with "post it". Don't ask first — fanout is the default for LinkedIn primary. (For non-LinkedIn primaries, adaptation is still on request via Step 6.)
