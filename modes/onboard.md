# Mode: onboard

Seed (first run) or refresh (re-runs) the personal layer (`data/local/`) so drafting sounds like THE USER, not the base defaults. Auto-offered when the personal layer is empty; also run anytime via `onboard` to pull fresh data.

Tone: conversational, one question at a time. Every step skippable — never block.

## Re-run semantics (onboarding is repeatable, not one-time)

Running `onboard` again is normal and encouraged — it's how the user pulls fresh posts, adds creators, and fills in credentials they didn't have last time. So:

- **Merge, never clobber.** New info appends to existing files. Update a fact only when it *contradicts* what's there (e.g. follower count changed, a voice claim was disproven) — and say so when you do.
- **Profile updates are additive.** New handles/creds/platforms fill empty fields in `config/profile.yml`; don't overwrite a populated field unless the user gives a new value for it.
- **Detect prior state and pick up where it left off:** read what already exists (`data/local/voice/`, `watchlist.md`, audit reports, `profile.yml`) and lead with the gaps — "Last audit was [date], want a fresh pull?", "X and LinkedIn still don't have creds — set them up now?", "Add creators to your watchlist?"
- **Audits are re-runnable and diff:** re-running an audit writes a new dated report and surfaces what moved (per `modes/audit.md`).

## Flow

### 0. Orient (one short paragraph)

First run: explain the two layers plainly — the repo ships generic defaults; everything personal (voice, references, analyses) lives in gitignored `data/local/`, never committed. Re-run: skip the explainer, summarize current state instead ("Here's what's in your personal layer so far...") and offer the gaps.

### 1. Per-channel account audits

Read `platforms:` from `config/profile.yml`. For each configured platform, offer an audit — the user picks which to run (don't force all). Per platform:

- **Instagram** (full support): check `instagram_user_id` + `instagram_access_token`.
  - Present → run `modes/audit.md` (caption audit + transcription pass → voice patterns, what performs, metrics baseline + dated report).
  - Missing → offer to copy creds from another local project, else `npm run connect:instagram` (guided); continue with other steps meanwhile.
- **X** (export-based): needs the data export (Settings → Download an archive, ~24h). If the export file is in `inbox/`, audit it now; else point them to request it and move on.
- **LinkedIn** (export-based): same — Settings → Get a copy of your data → Posts. Audit from `inbox/` when it arrives.
- **Threads / others:** note as available-when-built; don't block.

State which platforms you audited and which are pending (waiting on creds/exports), so the next re-run knows where to resume.

### 2. Creators

- Ask for handles + a word on *why* each (sound / look / content). On a re-run, show the current watchlist first and ask for additions.
- Offer: "or I can scan the accounts you follow and shortlist candidates" (logged-in Chrome, read-only).
- Run `modes/creators.md` on new handles (including the reel-transcription path for spoken-voice study). Merge into `watchlist.md`; don't duplicate existing cards.

### 3. Credentials sweep

Name what's still missing from `config/profile.yml` for the platforms they care about (publish creds, audit tokens, export files) and offer to set each up now — or note it for next time. This is also where a re-run collects the X key / LinkedIn export the user didn't have on the first pass.

### 4. Seed / update the strategy file

Create or update `data/local/strategy.md` from steps 1–2: goals (follower baselines from audits), content pillars, what's proven, open questions. On a re-run, append new findings and refresh metrics rather than rewriting.

### 5. Close the loop

Summarize what got created/updated (paths), note what's still pending (and how to finish it), and point at `/build-in-public draft`. Remind them `onboard` can be re-run anytime to pull fresh data.

## P2

- "Scan who you follow" could rank candidates by bio-keyword relevance to the user's niche once there's enough signal.
- Auto-suggest a re-audit when the last report is >N weeks old.
