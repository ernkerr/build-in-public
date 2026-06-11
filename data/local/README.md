# data/local/ — the personal layer

Everything in this folder except this README is **gitignored**. It belongs to whoever runs this instance and never ships with the repo.

```
data/local/
  voice/              # Your personal voice — mirrors data/voice/ structure
    voice.md          #   extends/overrides the base universal voice
    {platform}/...    #   extends/overrides base platform + task voices
  references/         # Posts you've saved as inspiration (other people's)
    {platform}/curated.md
  audits/             # Audits of your own published posts (your real voice)
    {platform}/{date}.md
  drafts.md           # Your draft queue (created on first draft)
  published.md        # Your publication history (created on first publish)
  outputs/            # Finished deliverables (reel scripts, etc.)
  archive/            # Past iterations you want to keep around
```

## How it works

- The drafting protocol (`.claude/rules/voice-lookup.md`) reads each base file in `data/voice/`, then the same-path file here. **Local extends base and wins on conflict.**
- Feedback you give the agent lands here by default (`.claude/rules/feedback-loop.md`). The base layer only changes when you deliberately want to ship a different default to forks.
- `/build-in-public audit {platform}` writes reports to `audits/` and distills patterns into `voice/` here.

## If you just forked this repo

This folder starts empty for you — base defaults in `data/voice/` apply as-is. Run `npm run setup`, then `/build-in-public audit {platform}` to seed your personal layer from your real published posts. Don't copy another person's local layer; the whole point is that it's yours.
