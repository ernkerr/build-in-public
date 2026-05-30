# Draft Mode

## Flow

### Step 1: Gather context

If the user provided an idea or topic, use that. Otherwise:

1. Run `git log --oneline -10` to see recent commits in the current repo
2. Run `git log --oneline --since="3 days ago"` for recent activity
3. Present the commits to the user:

```
Looking at your recent work...

Recent commits:
- abc1234 feat: add user authentication
- def5678 fix: resolve race condition in queue
- ghi9012 refactor: simplify API routes

What do you want to post about? Or I can suggest an angle.
```

4. If the user says "suggest" or similar, pick the most interesting commit(s) and propose an angle

### Step 2: Read universal voice + rules

Per `.claude/rules/voice-lookup.md`:

1. Read `config/profile.yml` for available platforms and Erin's identity/handles
2. Read `.claude/rules/never-words.md` and `.claude/rules/voice-non-negotiables.md` (hard prohibitions)
3. Read `data/voice/voice.md` (universal voice direction)

Platform voice + references load AFTER primary is picked — see Step 4.

### Step 3: Pick the primary platform from the source idea

Do NOT default to the first platform in `profile.yml`. Pick based on which platform the source idea is naturally strongest on:

- **X** when the idea is compressible to a punchy claim, a number-driven hook, a meme cadence, or a sharp observation.
- **LinkedIn** when the idea wants thinking-out-loud space, a real anecdote, or a reflective frame. Posts that need >280 chars of context to land.
- **Threads** when the idea is conversational/casual and would feel forced as either X-tight or LinkedIn-essay.
- **Instagram** when the idea is visual-first (a screenshot, a process, a before/after) and would land harder with imagery than with text.
- **YouTube** when the idea wants long-form treatment — explanation, walkthrough, deeper context that won't compress.
- **TikTok** when the idea has a quick visual hook + short narrative arc that suits 15-60s vertical video.
- **Bluesky** when the idea is techy/indie/open-source-flavored and would land with that crowd specifically.

State the pick out loud and why, in one line: *"Primary: LinkedIn — the bug story needs the setup paragraph."*

If the user wants a different primary, switch.

### Step 4: Read platform voice + draft the primary version

Now that primary is picked, complete the lookup:

1. Read `data/voice/{primary-platform}/voice.md` for platform direction (rhythm, format constraints, voice notes)
2. If the task is task-specific (e.g. an Instagram Reel scripting pass): also read `data/voice/{primary-platform}/{task}.md`
3. Read `data/references/{primary-platform}/*.md` for structural patterns and what's worked before

Then write a draft for the primary platform.

Show the draft with character count:

```
Draft for X (274/280 chars):

"Just fixed a nasty race condition in my job queue.

The bug: two workers grabbing the same job. The fix: a single
SELECT...FOR UPDATE. 3 lines of SQL, 2 hours of debugging.

Sometimes the fix is simple. Finding it isn't. #buildinpublic"
```

### Step 5: Run the quality gate (silent, before showing)

Before presenting the draft to the user, run this checklist. If anything fails, rewrite first.

- [ ] No banned vocabulary or cadences from `.claude/rules/never-words.md`
- [ ] No violations of `.claude/rules/voice-non-negotiables.md` (em dashes, "It's not X. It's Y.", bait closes)
- [ ] No engagement-bait CTA unless explicitly requested
- [ ] Claim has a real receipt (number, mechanism, named tech, concrete observation) — not just adjectives
- [ ] Length is within the platform's hard limit (from `data/voice/{platform}/voice.md`)
- [ ] Reads like Erin under that platform's constraint — not like the platform stereotype
- [ ] Long ellipses (`.......`) preserved if natural; not normalized to `…`
- [ ] Single tasteful emoji at end, max — strip any extras
- [ ] Structurally matches a pattern from `data/references/{platform}/*.md` (or is a deliberate departure)

If the draft fails, rewrite silently and run the gate again. Only show drafts that pass.

### Step 5.5: Auto-fanout (LinkedIn primary only)

If the primary platform picked in Step 3 is **LinkedIn**, automatically run the Step 7 adaptation loop for `facebook`, `bluesky`, and `x` *before* showing anything to the user. Don't ask first — this is the in-conversation fanout pattern: the user wants to see all the variants together so they can iterate side-by-side.

Skip a platform only if its voice file is missing (`data/voice/{platform}/voice.md`) — in that case, note `(skipped — no voice file)` in the output.

Each adapted variant still runs through Step 5's quality gate and gets a "what changed and why" note per Step 7.

For non-LinkedIn primaries (X, Threads, Instagram, etc.), skip Step 5.5 entirely. The current Step 6 menu still offers adaptation on request.

### Step 6: Get feedback

**If Step 5.5 fired (LinkedIn primary, multiple variants shown):**

Show all variants together, then offer:
```
Want to:
1. Edit one — name which ("tighten the FB one", "punch up X")
2. Post — say "post it" (all) or "post {platforms}" (e.g. "post linkedin and fb")
3. Skip a platform — say "drop bsky" / "skip X"
4. Start over
```

When the user says "post it" or "post {platforms}", switch to publish mode (see `modes/publish.md` Step 0 — direct publish from conversation).

**Otherwise (single-primary case, no auto-fanout):**

```
Want to:
1. Edit this
2. Publish to {primary platform} (say "post it")
3. Adapt for {other platforms from profile.yml}
4. Start over
```

- If edit: let them give feedback, redraft, re-run the quality gate. Feedback handling follows `.claude/rules/feedback-loop.md` — identify scope, save to the right level of the voice tree.
- If publish ("post it"): switch to publish mode (Step 0).
- If adapt: go to Step 7.
- If start over: go back to Step 1.

### Step 7: Adapt to other platforms (when requested)

For each additional platform, repeat the platform-specific lookup:

1. Read `data/voice/{platform}/voice.md` and `data/references/{platform}/*.md` for that platform (universal voice already loaded from Step 2)
2. Adapt the primary version — do NOT paste-and-shorten or paste-and-expand
3. Run the quality gate (Step 5) on each variant
4. Add a one-line **"What changed and why"** note per variant

Output format:
```
{Primary platform} (kept as-is):
"..."

{Platform B} (XX/limit chars):
"..."
What changed: stripped the hashtag, expanded the bug setup, dropped the SQL detail — Threads readers don't need the specifics, they want the human texture.

{Platform C} (XX/limit chars):
"..."
What changed: kept the punchline, added a sentence of context before it — LinkedIn's see-more fold needs the hook upfront.
```

The "what changed" line is non-negotiable. If you can't name a meaningful difference, the variant is just the primary in costume — rewrite it.

### Step 8: Save drafts

Save to `data/drafts.md`. Add a new row per platform:

```
| [next #] | [today's date] | [platform] | [content] | pending | [primary? Y/N — note "what changed" if adapted] |
```

If adapted across multiple platforms, save each as a separate row with the same date and a marker indicating which was the primary version.
