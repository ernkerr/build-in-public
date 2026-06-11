# outputs/

Where the agent saves completed work.

## What lives here

- **Finished drafts** ready for human review or publish (will eventually replace `data/local/drafts.md`)
- **Published artifacts** — the canonical text of what actually shipped, with channel + URL + timestamp (will eventually replace `data/local/published.md`)
- **Generated assets** — companion images, alt text, thumbnails, transcripts, repurposed cuts
- **Long-form pieces** — blog posts, newsletter issues, podcast scripts as they're built up

## Suggested structure (as content accumulates)

```
outputs/
  drafts/              # pre-publish, by channel or by piece
  published/           # post-publish, organized by date or campaign
  assets/              # images, video cuts, transcripts
```

Don't over-organize early. Wait until you have enough pieces that you can see the natural shape.

## Relationship to existing data/

`data/local/drafts.md` and `data/local/published.md` are the current sources of truth. As the channel-agnostic workflow lands, those will move here. Until then, the agent continues to read/write from `data/`.
