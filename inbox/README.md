# inbox/

Shared workspace for incoming material. The triage zone — things land here before they have a home.

## What lands here

- **Style references** pasted in conversation that haven't been categorized to a channel yet
- **Raw transcripts** — voice notes, podcast recordings, meeting dumps to mine for posts
- **Link dumps** — articles, tweets, videos worth referencing or responding to
- **Half-formed ideas** — a sentence or two the agent should expand later
- **Source material** for longer-form pieces (research, quotes, screenshots)

## What leaves here

The agent processes inbox items into one of:

- A draft → `outputs/` (or `data/local/drafts.md` until migration is complete)
- A reference → `data/references/{platform}/curated.md`
- A voice learning → the appropriate level of `data/voice/` per `.claude/rules/feedback-loop.md` (universal / platform / task)
- An archived/dropped item → `archive/`

Don't let things rot in inbox/. If something's been here for a while and nobody's done anything with it, archive it.
