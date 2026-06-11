# Voice — Instagram → Caption — base defaults

The text below the media. First 125 characters visible before "more"; the rest expands on tap.

## Direction

- First 125 chars must stand alone — assume nobody taps "more".
- Below the fold: room for context, story, or links.
- No hashtag dump. Cap at ~5 targeted lowercase hashtags, placed at the very end. Lightweight casual posts can skip hashtags entirely.

## Caption length by content type

**Project / build reel:** long is the default when the audience is technical and rewards depth. The caption should:
- Explain how the thing works under the hood (vocab + small code/concept walkthrough)
- Define unfamiliar terms in-line
- Include relevant tech-term hashtags for discoverability
- Credit tools (@-mention) with what they specifically did, not just a tag

**Lightweight share / vibe post:** short, one or two lines. Used when the reel does all the work and the caption is just labeling.

---

_Personal caption patterns (caption modes, casing, punctuation tells, what performs on your account) live in `data/local/voice/instagram/caption.md` — seeded by `/build-in-public audit instagram`._
