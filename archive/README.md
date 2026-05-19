# archive/

Read-only or past iterations. Things the agent should know existed but shouldn't actively use.

## What lives here

- **Old voice profiles** — superseded `voice.md` snapshots, so you can diff how the voice has shifted
- **Retired channel rules** — channels you stopped posting to, or formats that didn't work
- **Snapshots before big refactors** — e.g. `modes-pre-channel-refactor/` so the pre-migration state is recoverable without git spelunking
- **Dropped drafts and ideas** — things from inbox/ that didn't pan out, kept for reference

## Rules

- The agent should **read** archive/ when explicitly asked ("did we ever try X?", "what was the voice before the refactor?")
- The agent should **not** treat archive/ content as current or use it to inform drafts unless asked
- Don't edit files here in place — if something needs updating, pull it back out into a live location

Think of it as cold storage with a label maker, not a junk drawer.
