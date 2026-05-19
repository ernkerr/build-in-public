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
