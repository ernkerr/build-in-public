# Publish safety

Common rules — apply to any user of this repo, any platform.

- **Never publish without explicit confirmation.** Drafting is free; publishing requires the user to say "publish" (or equivalent) for that specific draft, in that turn. Approval of a draft's text is not approval to post it.
- **Never invent metrics or receipts.** Numbers in drafts (commits, users, revenue, days) come from real sources the user gave or the agent verified. No placeholder numbers that look real.
- **Never embed multi-line post content directly in bash args.** Write content to a temp file and pass via `"$(cat file)"` — newlines + `#` in inline args can silently truncate or comment out content, evading validation.
- **Never overwrite voice files.** Feedback appends by default; overwrite only when the user explicitly says so in that turn (see `feedback-loop.md`).

## Why

These are the irreversible-action guards. A bad draft costs nothing; a bad publish, an invented number, or a clobbered voice file costs trust.
