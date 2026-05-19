# Decisions

Major design and architectural decisions for this agent. Newest at the top. Format per entry: **Challenge** / **Considered** / **Chose** / **Why**.

## 2026-05-19 — Voice/references structure: folders by concern

**Challenge:** Refactor from a 4-platform social-only tool to a 6+ platform build-in-public agent with per-task voices (e.g. Instagram scripting vs. caption). Single `voice.md` + flat `style-refs/` would have buckled. Needed a structure that handles universal voice, per-platform voice, per-task voice within a platform, and per-platform references — all cleanly.

**Considered:**

- *Option A — folder per platform* (`instagram/voice.md`, `instagram/references/`, `instagram/skills/`). Self-contained per platform, but universal stuff has no obvious home, cross-posting reads N folders, and Claude Code only auto-discovers skills under `.claude/skills/` so the colocation promise breaks anyway.
- *Option B — folders by concern* (`data/voice/{platform}/`, `data/references/{platform}/`). Universal voice has one home, cross-posting is a single tree walk, comparing voice across platforms is `cat voice/*/voice.md`.
- *Option C — multi-agent orchestrator + per-platform sub-agents*. Conceptually elegant but sub-agents in Claude Code start cold every invocation, cross-posting becomes coordination overhead, feedback loops bubble up through layers, and iteration cost multiplies (tweak one convention = edit 6 sub-agents).

**Chose:** Option B.

**Why:** The agent's hot path is cross-posting (one idea → N voices). Option B optimizes for that. Universal rules + universal voice each get one obvious home. Option C's "cold start per task" is the exact opposite of the user's "the more I use it the better it gets without bloating" requirement. Option A's biggest pitch (colocation) doesn't deliver because skills can't actually live in platform folders.

**Escape hatch:** If platform-centric browsing becomes useful, a thin `platforms/{name}/README.md` can link to relevant voice + reference files without splitting underlying content.
