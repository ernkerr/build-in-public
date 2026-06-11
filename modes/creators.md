# Mode: creators

Analyze OTHER creators the user admires and extract what's borrowable. The mirror of `audit` (which analyzes the user's own account): **audit = analyze US, creators = analyze OTHERS.** Both save everything to the personal layer (`data/local/`), never the committed tree.

Platform scope: **Instagram first.** Other platforms are P2 (see bottom).

## Inputs

Any of:
- One or more handles, ideally with a "why" each ("@whoever — her captions")
- A pasted post + handle (route the post itself through `modes/learn.md`, then build the creator card here)
- "Scan my following" — browse the user's own following list (logged-in Chrome) and shortlist candidates to ask about

**Always get the "why" per creator** — it picks the extraction dimension:
- **sound** → caption/script voice → feeds `data/local/voice/{platform}/` files
- **look** → visual style, editing, overlays → feeds `hook.md` / `text-overlay.md` notes
- **content** → topics, formats, posting strategy → feeds `data/local/strategy.md`

If the user can't articulate why ("I'm not sure why they're so good"), treat that as a research question and answer it from their actual content — those produce the best learnings.

## Method (Instagram)

**Preferred: logged-in Chrome browse** (Claude-in-Chrome extension). Read-only — see guardrails.

Per creator:
1. `instagram.com/{handle}/` → profile: display name, bio, follower/post counts, mutuals, link-in-bio (their funnel tells you their business model)
2. `instagram.com/{handle}/reels/` → scroll once, screenshot the grid: view counts per reel, cover/overlay style, topic mix, series patterns
3. Open the top 1–2 reels → read captions + skim comments (engagement quality: real questions vs emoji)
4. Note: **captions ≠ spoken scripts.** Spoken pacing/script analysis needs a transcription pass — flag as a leftover, don't fake it.

**Fallbacks:** user pastes posts manually; or `business_discovery` via Graph API if the user's IG is linked to a Facebook Page (automatable — worth suggesting the link once).

### Transcribing a creator's reel (spoken voice study)

Creator videos aren't API-accessible, and downloader tools are blocked by the login wall + browser cookie encryption. The reliable path (proven 2026-06-11):

1. Open the reel (`instagram.com/reel/{id}/`) in the user's logged-in Chrome.
2. Via the JS tool, scan `document.scripts` for `video_versions` — the page server-renders a signed, **muxed** (audio+video) mp4 URL for every logged-in view.
3. Don't return the signed URL out of the page (the extension blocks token exfiltration — correctly). Instead `fetch(url)` → blob → `<a download>` click *inside the page*; the mp4 lands in `~/Downloads/`.
4. `ffmpeg -ar 16000 -ac 1` → `whisper-cli -m ~/.cache/whisper-cpp/ggml-small.en.bin` (same pipeline as the own-account transcription pass in `modes/audit.md`).
5. Save the verbatim transcript to `references/{platform}/curated.md` with structure notes; private study only — never republish a creator's transcript.

Dead ends, so nobody retries them: anonymous yt-dlp (login wall), `--cookies-from-browser chrome` (macOS encrypts the cookie store), sniffing CDN traffic (DASH splits audio/video; muted autoplay never fetches audio; the feed viewer preloads neighboring reels).

## Guardrails (non-negotiable)

- **Read-only.** Never like, follow, comment, DM, or take any action on the user's account while browsing. Navigation and reading only.
- Public profiles only. If a profile is private, ask the user to paste content instead.
- Close the browser tab group when done.

## Outputs — all to `data/local/`

1. **Watchlist card** → `data/local/watchlist.md` (create from the template below if missing). One card per creator: the user's why (quoted), lookup data, what they are, takeaway. Update existing cards on re-analysis rather than duplicating.
2. **Standout posts** → `data/local/references/{platform}/curated.md` — saved IN FULL with "why it works" notes and a reusable pattern name (same format as other refs).
3. **Voice patterns** → appropriate `data/local/voice/` file per `.claude/rules/feedback-loop.md` (state the scope guess).
4. **Strategic findings** → `data/local/strategy.md` (e.g. "this format outperforms at every scale on the watchlist", positioning gaps).
5. End with a synthesis: per-creator one-liners + what the *list as a whole* says about where the user is heading.

## Watchlist card template

```markdown
### @handle — "Display Name" — N followers, N posts
- **Why (user, date):** "their words"
- **What they are:** niche, business model, format
- **Top content:** titles + view counts
- **Takeaway:** the one borrowable thing + where it got saved
```

## Other platforms (P2)

Same shape everywhere — handle → profile → top content → captions/scripts → watchlist card + refs + voice/strategy distillation. Differences are lookup mechanics only:
- **X / Threads / Bluesky:** text-first, easier extraction; X needs logged-in browse or paste
- **TikTok / YouTube:** transcript access matters more than captions (YouTube has transcripts in-page)
- Add a per-platform section here when each is first built. Until then, tell users non-IG creators can still be added by pasting posts manually.
