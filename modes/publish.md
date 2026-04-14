# Publish Mode

## Flow

### Step 1: Show pending drafts

Read `data/drafts.md` and filter for rows with status `pending` or `approved`.

If no pending drafts:
```
No pending drafts. Use /build-in-public draft to create one.
```

Otherwise show them:
```
Pending drafts:

1. [X] "Just fixed a nasty race condition..." (274 chars)
2. [LinkedIn] "Today I debugged a race condition..." (1,204 chars)
3. [Bluesky] "Fixed a race condition today..." (189 chars)

Which ones do you want to publish? (all, or pick numbers)
```

### Step 2: Publish

For each selected draft, run the appropriate publish script:

- **X**: `node scripts/publish-x.mjs "<content>" [image-path]`
- **LinkedIn**: `node scripts/publish-linkedin.mjs "<content>" [image-path]`
- **Bluesky**: `node scripts/publish-bluesky.mjs "<content>" [image-path]`

The scripts read API credentials from `config/profile.yml` and return the post URL on success.

Show results:
```
✓ Published to X: https://x.com/i/status/123456
✓ Published to LinkedIn: https://linkedin.com/feed/update/...
✓ Published to Bluesky: https://bsky.app/profile/you/post/...
```

If a script fails, show the error and ask if they want to retry or skip.

### Step 3: Update data files

1. Update `data/drafts.md` — change status from `pending` to `published`
2. Add rows to `data/published.md`:

```
| [next #] | [today's date] | [platform] | [content snippet] | [url] | |
```

### Step 4: Cross-post suggestion

If the user only published to some platforms, ask:
```
Published to X. Want to adapt and publish to LinkedIn and Bluesky too?
```

If yes, draft adapted versions (follow the draft mode adaptation flow), then publish those too.

### Publishing with images

If a draft has an image path in the Image column of `data/drafts.md`, pass it to the publish script.

The user can also say "publish with this screenshot" and provide a file path. Use the Read tool to verify the image exists before passing it to the script.
