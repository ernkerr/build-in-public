# Drafting protocol

Before writing any content for the user, read in this order:

1. **Always:** `.claude/rules/never-words.md`, `.claude/rules/voice-non-negotiables.md`, `data/voice/voice.md`
2. **For target platform:** `data/voice/{platform}/voice.md`
3. **If task-specific voice exists:** `data/voice/{platform}/{task}.md` (e.g. `instagram/scripting.md`, `instagram/hook.md`)
4. **References for platform:** `data/references/{platform}/*.md`
5. **Then draft.** Quality-gate against both voice files AND structural patterns from references.

If a voice file you'd expect to exist doesn't, ask before drafting blind.

For cross-posting: repeat steps 2–5 per target platform. Each adapted variant needs a one-line "what changed and why" note.
