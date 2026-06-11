# Mode: onboard

First-run setup for a new user: seed the personal layer (`data/local/`) so drafting sounds like THEM instead of the base defaults. Triggered automatically when the personal layer is empty (no `data/local/voice/` content, no watchlist), or explicitly via `onboard`.

Tone: conversational, one question at a time. Each step is skippable — never block on a step.

## Flow

### 0. Orient (one short paragraph)

Explain the two layers in plain words: the repo ships generic voice defaults; everything personal (their voice, their references, their analyses) is built locally in `data/local/` and never committed. The two fastest seeds: analyze their own account, and analyze creators they admire.

### 1. "Want me to analyze your Instagram?"

- If yes → check `config/profile.yml` for `instagram_user_id` + `instagram_access_token`.
  - Creds present → run `modes/audit.md` (their real posts → voice patterns, what performs, metrics baseline).
  - Creds missing → ask whether they have an existing Meta app/token in another project; otherwise point to the audit mode's credentials section for setup, and offer to continue onboarding without it.
- If no/skip → continue.

### 2. "Any creators you want to sound, look, or make content like?"

- Ask for handles + a word on *why* each (sound / look / content).
- Also offer: "or I can scan the accounts you follow and shortlist candidates" (logged-in Chrome, read-only).
- Run `modes/creators.md` on what they give. Even 2–3 creators is plenty for a first pass.

### 3. Seed the strategy file

Create `data/local/strategy.md` from whatever steps 1–2 produced: goals (follower baseline if audited), draft content pillars, what's proven (from the audit), open questions (from the creator analysis). If both steps were skipped, create it with just a goals section and a note to revisit after the first audit.

### 4. Close the loop

Tell them what got created (paths), and that everything compounds from here: feedback on drafts → voice files, saved posts → references, re-audits → diffs. Point at `/build-in-public draft` as the natural next step.

## P2

- Onboarding is Instagram-first. As other platforms get audit/creators support, extend step 1–2 to ask per configured platform (read `platforms:` from `profile.yml`).
- "Scan who you follow" could rank candidates by relevance (bio keywords matching the user's niche) once there's enough signal about the user.
