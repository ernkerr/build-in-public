# Voice — Instagram → Reel scripting

The spoken voice in a Reel/short-form video. What's said out loud, not what's displayed.

## Direction

Initial defaults:
- Pacing matches edit pace: short sentences for cuts, longer for held shots.
- First spoken line carries the hook (paired with `hook.md` for the visual hook).
- Sound on/off: a Reel should still make sense with sound off (relies on `text-overlay.md`).
- **Case in scripts: sentence case.** Scripts are read aloud, not typed for aesthetic. All-lowercase is harder to scan. Capitalize "I", proper nouns, and sentence starts. Caption stays lowercase per `caption.md` aesthetic, but the script Erin reads from is normal case.
- **Don't use "Here's the trick" or other guru-y reveal phrases** (see `.claude/rules/never-words.md`). Pivot from hook to explainer directly — just start the explanation.

## Technical depth target: junior engineer

For build-in-public reels, Erin's audience leans technical. Default depth is **junior engineer**:
- Use real terms naturally (canvas, RGBA, frame, ramp, getUserMedia) — don't dumb them down.
- Explain the *unfamiliar* terms in-line, briefly. Don't explain the *familiar* ones (React, hooks, API).
- Show actual concepts (hidden canvas, brightness mapping, frame rate), not just outcomes.
- "Girl explaining why her phone does the thing" tone — conversational, but with real technical meat. Less consumer-y than "look it makes art!"

**Avoid both extremes:**
- Too consumer-y ("look how pretty") — Erin's audience came for the build, not just the demo.
- Too jargon-walled ("we use requestAnimationFrame with OffscreenCanvas...") — junior engineers don't all know the specifics.

## Confidence: LOW

Source: ascii-cam reel feedback, 2026-05-19.
