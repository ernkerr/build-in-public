# Mode: audit

Audit the user's OWN published posts on a platform and distill real voice patterns into the personal layer at `data/local/voice/{platform}/`. This is the mirror of `learn`: learn studies *other people's* posts (inspiration → `data/local/references/`); audit studies *what the user actually publishes* (prior art → `data/local/audits/`, distilled into the personal voice layer).

Everything an audit produces is personal data — it always lands in the gitignored `data/local/`, never the committed base layer.

First run codified from the 2026-06-10 Instagram audit (see `data/local/audits/instagram/2026-06-10.md` for a complete worked example).

## When to run

- The personal layer for a platform is empty or low-confidence — seed it with evidence instead of guesses.
- **Re-audit** quarterly, or after a deliberate style shift. Re-audits are cheap and expected: pull fresh data, compare against the most recent report in `data/local/audits/{platform}/`, and lead the new report with a "what moved since last audit" section (new tells, retired tells, engagement shifts). Update the personal voice files where the evidence changed; bump or date the `Confidence:` lines.

## Credentials

- Read from `config/profile.yml` (gitignored). Instagram needs `instagram_user_id` + `instagram_access_token` (Instagram API with Instagram Login — token from a Meta developer app with `instagram_basic` / business media permissions).
- If empty: first ask whether creds exist in another local project (existing crossposting/scheduling tools often already have a token — offer to copy them in). Otherwise point at the guided connector: `npm run connect:instagram` (walks the Meta dashboard steps, validates the token, auto-resolves the user ID). Full steps in the README's "Instagram Setup" section.
- If the API ever returns a 190 (expired token): `npm run connect:instagram` offers a one-keypress refresh.
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

## Transcription pass (spoken voice) — run after the caption audit

Captions are half the voice; this add-on covers the spoken half (first run: 2026-06-11).

1. Pull `media_url` for VIDEO posts (works for the user's OWN media — the API serves the mp4s directly; other creators' videos are NOT accessible this way). Select ~15–20: top-liked all-time + most recent.
2. Download each mp4 (`curl`), extract audio: `ffmpeg -i in.mp4 -ar 16000 -ac 1 out.wav`.
3. Transcribe with whisper-cpp (`brew install whisper-cpp`; model `ggml-small.en.bin` from huggingface `ggerganov/whisper.cpp`, cache it at `~/.cache/whisper-cpp/`): `whisper-cli -m <model> -f <wav> -otxt`.
4. **Classify before analyzing.** Expect many reels to be trend-audio only (whisper returns "(upbeat music)" or song lyrics). That ratio is a *format finding*, not a failure — report voiceover : trend-audio, and note which formats the user's written voice files actually apply to.
5. Analyze the real voiceovers: hook line + formula used, pivot lines, analogy use (and whether it rings open→close), sentence length vs cut pace, how it ends. Distill into the personal `scripting.md` with an n-count — n=1 is still worth recording for a flagship, just say so.
6. Write findings into the dated audit report alongside the caption audit.

## Limits (Instagram)

- Text overlays are visual — needs frame extraction + OCR, not built yet. Don't update `text-overlay.md` from audio.
- Stories aren't exposed by this endpoint. Comment replies (the user's reply voice) not covered.
- Other creators' reels can't be pulled via API — manual save/screen-grab if a creator's voiceover needs studying.

## Other platforms

Same shape everywhere: pull own published posts (X API, LinkedIn API, or a paste/export when no API access), era-split, stat pass, manual read, report, distill. Add a per-platform credentials + endpoint section here the first time each platform is audited.
