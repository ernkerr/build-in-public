# Decisions

Major design and architectural decisions for this agent. Newest at the top. Format per entry: **Challenge** / **Considered** / **Chose** / **Why**.

## 2026-05-29 — LinkedIn-primary auto-fanout, in-conversation (FB + BSky + X)

**Challenge:** Autopost from LinkedIn → Facebook (erin.codes Page) and adapt for BlueSky + X. Two coupled questions: (a) which repo owns this — crossposter or build-in-public? (b) does fanout fire at draft-time or publish-time?

**Considered:**

- *(a) Crossposter daemon polls LinkedIn for new posts and fans out.* Adds OAuth-as-source, a new poll loop, more state. Wouldn't catch posts drafted in build-in-public (because they'd already be on LinkedIn before the poll). And crossposter is video-only; bolting text on muddies the pipeline.
- *(a) New repo for text crossposting.* Premature split. Adaptation logic (voice tree, never-words, quality gate) already lives in build-in-public; moving the publishing to a new repo would force a cross-repo seam for what's a single coherent flow.
- *(b) Fanout fires after LinkedIn publish, queued as pending drafts for later review.* Adds a "review the pending queue" step that the user didn't want. Breaks the in-the-moment iteration ("tighten the FB one") because variants don't exist while the LinkedIn draft is being shaped.

**Chose:** Build it entirely in build-in-public, fire fanout at draft-time.

- New: `scripts/publish-facebook.mjs` (Graph API to erin.codes Page), `data/voice/facebook/voice.md` (warmer/personal — friends-and-family register, not LinkedIn-in-disguise), `data/references/facebook/curated.md` placeholder.
- Modified: `modes/draft.md` Step 5.5 — when primary is LinkedIn, auto-runs the Step 7 adaptation loop for `facebook` + `bluesky` + `x` without asking, so all four variants are shown together. `modes/publish.md` Step 0 — natural-language "post it" / "post linkedin and fb" ships active conversation drafts directly without the pending-drafts menu walk.
- Crossposter: untouched. Stays video-only (IG → YT/TT/BSky).

**Why:** The trigger is build-in-public's own publish flow — no polling needed. The adaptation engine is build-in-public's voice tree. The drafts file already exists. Draft-time fanout matches the user's mental model: ideate over all platforms at once, "post it" when satisfied. No daemon, no new repo, no review queue ceremony — just fills in the Facebook gap and one Step 5.5 in draft.md.

## 2026-05-29 — IG→YT backfill pacing + approval gate (in crossposter repo)

**Challenge:** Drain a large backlog of old IG reels to YouTube without spamming the channel, while keeping a human review on the first one. Also: prevent the existing watch daemon from posting *new* IG reels to YT mid-backfill (which would jumble new and old in the YT feed).

**Considered:**

- *Auto-transition after first upload (no flag).* Risky — if the human dislikes the seed result, uploads keep going.
- *Poll YT API to detect the seed draft's publish flip.* Adds API call + lag, plus a failure mode if YT lags.
- *Have backfill-tick also handle post-backfill live mode.* Redundant with the existing watch daemon, which already polls IG every 15min.

**Chose:** Two-process model.

- Existing `watch` daemon handles new IG reels but gates each destination on `meta.liveEnabled.<platform>` in `state.json` (defaults true for any unlisted platform; YT is explicitly seeded to false by `bootstrapMeta()` so backfill can run in peace).
- New `backfill-tick youtube` command + daily launchd timer (`com.ern.crossposter.backfill`, 10am local) drains old reels at 1/day. First upload = draft, gated by `meta.backfill.youtube.seeded` until the human runs `backfill-approve youtube`. When the queue drains, the tick auto-flips `liveEnabled.youtube = true` and the watch daemon picks YT up on its next cycle.

**Why:** Two concerns, two processes, one shared flag for the handoff. Watch is event-driven (new reels); backfill is throttled (1/day). The `liveEnabled` gate prevents channel chaos during catch-up. Auto-flipping the flag at drain means no manual "turn on live mode" step.

## 2026-05-19 — Voice/references structure: folders by concern

**Challenge:** Refactor from a 4-platform social-only tool to a 6+ platform build-in-public agent with per-task voices (e.g. Instagram scripting vs. caption). Single `voice.md` + flat `style-refs/` would have buckled. Needed a structure that handles universal voice, per-platform voice, per-task voice within a platform, and per-platform references — all cleanly.

**Considered:**

- *Option A — folder per platform* (`instagram/voice.md`, `instagram/references/`, `instagram/skills/`). Self-contained per platform, but universal stuff has no obvious home, cross-posting reads N folders, and Claude Code only auto-discovers skills under `.claude/skills/` so the colocation promise breaks anyway.
- *Option B — folders by concern* (`data/voice/{platform}/`, `data/references/{platform}/`). Universal voice has one home, cross-posting is a single tree walk, comparing voice across platforms is `cat voice/*/voice.md`.
- *Option C — multi-agent orchestrator + per-platform sub-agents*. Conceptually elegant but sub-agents in Claude Code start cold every invocation, cross-posting becomes coordination overhead, feedback loops bubble up through layers, and iteration cost multiplies (tweak one convention = edit 6 sub-agents).

**Chose:** Option B.

**Why:** The agent's hot path is cross-posting (one idea → N voices). Option B optimizes for that. Universal rules + universal voice each get one obvious home. Option C's "cold start per task" is the exact opposite of the user's "the more I use it the better it gets without bloating" requirement. Option A's biggest pitch (colocation) doesn't deliver because skills can't actually live in platform folders.

**Escape hatch:** If platform-centric browsing becomes useful, a thin `platforms/{name}/README.md` can link to relevant voice + reference files without splitting underlying content.
