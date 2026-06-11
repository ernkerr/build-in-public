# Drafting protocol

Voice is two layers:

- **Base** — `data/voice/` — committed, generic defaults that ship with the repo. A forker inherits these and may edit them directly.
- **Personal** — `data/local/voice/` — gitignored, this user's patterns, built from feedback and audits.

Every read below means: **read the base file, then the same-path personal file if it exists.** Personal extends base and wins on conflict.

Before writing any content for the user, read in this order:

1. **Always:** `never-words.md`, `non-negotiables.md`, `voice.md` — both layers of each
2. **For target platform:** `{platform}/voice.md` — both layers
3. **If task-specific voice exists:** `{platform}/{task}.md` (e.g. `instagram/scripting.md`, `instagram/hook.md`) — both layers
4. **References for platform:** `data/local/references/{platform}/*.md` (the user's saved inspiration; `data/references/{platform}/` ships as placeholders)
5. **Then draft.** Quality-gate against both voice layers AND structural patterns from references.

If a platform's base voice file doesn't exist, ask before drafting blind. An empty personal layer is normal (fresh instance) — base defaults apply.

For cross-posting: repeat steps 2–5 per target platform. Each adapted variant needs a one-line "what changed and why" note.
