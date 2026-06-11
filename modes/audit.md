# Mode: audit

Audit the user's OWN published posts on a platform and distill real voice patterns into the personal layer at `data/local/voice/{platform}/`. This is the mirror of `learn`: learn studies *other people's* posts (inspiration → `data/local/references/`); audit studies *what the user actually publishes* (prior art → `data/local/audits/`, distilled into the personal voice layer).

Everything an audit produces is personal data — it always lands in the gitignored `data/local/`, never the committed base layer.

First run codified from the 2026-06-10 Instagram audit (see `data/local/audits/instagram/2026-06-10.md` for a complete worked example).

## When to run

- The personal layer for a platform is empty or low-confidence — seed it with evidence instead of guesses.
- **Re-audit** quarterly, or after a deliberate style shift. Re-audits are cheap and expected: pull fresh data, compare against the most recent report in `data/local/audits/{platform}/`, and lead the new report with a "what moved since last audit" section (new tells, retired tells, engagement shifts). Update the personal voice files where the evidence changed; bump or date the `Confidence:` lines.

## Credentials

- Read from `config/profile.yml` (gitignored). Instagram needs `instagram_user_id` + `instagram_access_token` (Instagram API with Instagram Login — token from a Meta developer app with `instagram_basic` / business media permissions).
- If empty: ask whether creds exist in another local project before walking through Meta app setup from scratch (existing crossposting/scheduling tools often already have a token).
- Never print tokens. Source them into env vars; keep URLs with tokens out of displayed output.

## Instagram protocol

1. **Verify identity.** `GET https://graph.instagram.com/v21.0/{user_id}?fields=username,name,biography,followers_count,media_count` — show the username and confirm it's the right account before analyzing.
2. **Pull everything.** `/{user_id}/media?fields=id,caption,media_type,media_product_type,permalink,timestamp,like_count,comments_count&limit=50`, follow `paging.next` until exhausted, dedupe by `id`. Use `curl` for the requests (macOS framework Python often fails SSL verification; curl doesn't).
3. **Era split before anything else.** Voice evolves; old posts poison the signal. Bucket by period (e.g. half-years), compare casing/length/tags/engagement per era, and **extract patterns only from the current era**.
4. **Stat pass** (throwaway script is fine): caption length distribution (look for multi-modal — distinct caption modes are common), casing of first alpha line, hashtag count + placement + top tags, emoji frequency + which + placement, punctuation tells (em dashes, ellipsis forms, "&" vs "and" vs "w/"), question hooks, CTA phrases ("comment", "link in bio"), engagement medians + top performers.
5. **Manual read.** Read the current era's captions in full. Stats find tells; reading finds structure: hook shapes, analogy bridges, recurring formats, how CTAs are earned. Name the archetypes.
6. **Write the report** to `data/local/audits/{platform}/{YYYY-MM-DD}.md`: method, era table, mode breakdown, punctuation findings vs. existing voice rules (call out where the audit *contradicts* a voice file — base or personal), top performers with why, recurring formats, changes made, what wasn't covered. On a re-audit, open with the diff against the previous report.
7. **Distill into the personal voice layer** (`data/local/voice/{platform}/`) per `.claude/rules/feedback-loop.md`: append/refine, never clobber existing learnings; update `Confidence:` lines with provenance ("account audit YYYY-MM-DD, n posts"). Where the audit contradicts an existing personal claim, correct the claim and cite the audit. Where it contradicts a *base* default, leave base alone — note the divergence in the personal file (personal wins at draft time).
8. **Keep the boundary:** audits are the user's real voice; references are inspiration from others. Never mix the two.

## Limits (Instagram)

- API returns captions + metadata only. Spoken voice, hooks, and text overlays need video download + transcription — not built yet. Don't update `scripting.md`/`hook.md`/`text-overlay.md` from a caption-only audit except to correct caption-related claims.
- Stories aren't exposed by this endpoint. Comment replies (the user's reply voice) not covered.

## Other platforms

Same shape everywhere: pull own published posts (X API, LinkedIn API, or a paste/export when no API access), era-split, stat pass, manual read, report, distill. Add a per-platform credentials + endpoint section here the first time each platform is audited.
