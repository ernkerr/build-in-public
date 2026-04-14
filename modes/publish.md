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

For each selected draft, write the post content to a temp file first, then invoke the publish script with `--file`:

1. Use the Write tool to save the content to `/tmp/bip-post.txt`.
2. Check `config/profile.yml` for API credentials for that platform.

#### If credentials exist → publish directly via API

- **X**: `node scripts/publish-x.mjs --file /tmp/bip-post.txt [--image <path>]`
- **LinkedIn**: `node scripts/publish-linkedin.mjs --file /tmp/bip-post.txt [--image <path>]`
- **Bluesky**: `node scripts/publish-bluesky.mjs --file /tmp/bip-post.txt [--image <path>]`

Show results:
```
✓ Published to X: https://x.com/i/status/123456
✓ Published to LinkedIn: https://linkedin.com/feed/update/...
✓ Published to Bluesky: https://bsky.app/profile/you/post/...
```

Then offer to copy to clipboard too:
```
📋 Want me to copy this to clipboard? (for cross-posting, saving, etc.)
```

#### If credentials are missing → clipboard workflow

Copy the post content to the clipboard:
- `node scripts/clipboard.mjs --file /tmp/bip-post.txt`

Then tell the user where to paste:

For X:
```
📋 Copied to clipboard!
→ Paste at https://x.com/compose/post
```

For LinkedIn:
```
📋 Copied to clipboard!
→ Paste at https://www.linkedin.com/feed/ → "Start a post"
```

For Bluesky:
```
📋 Copied to clipboard!
→ Paste at https://bsky.app → compose box
```

For Threads:
```
📋 Copied to clipboard!
→ Paste in the Threads app → new post
```

**For threads (X multi-part posts separated by `---`):** Copy each part one at a time. After copying part 1, tell the user to paste and reply, then ask when they're ready for part 2.

3. Clean up the temp file after publishing (`rm /tmp/bip-post.txt`).

**Why `--file` and not a quoted argument?** Passing multi-line post content as a quoted bash argument is brittle: a newline followed by `#` (e.g. a `#buildinpublic` hashtag on its own line) can confuse tools that parse the raw command string, and shell-quoting of apostrophes/backticks/etc. inside post text is error-prone. Always use `--file`.

If a script fails, show the error and ask if they want to retry or skip.

### Step 3: Update data files

1. Update `data/drafts.md` — change status from `pending` to `published`
2. Add rows to `data/published.md`:

For API-published posts:
```
| [next #] | [today's date] | [platform] | [content snippet] | [url] | |
```

For clipboard-published posts:
```
| [next #] | [today's date] | [platform] | [content snippet] | (clipboard) | |
```

### Step 4: Cross-post suggestion

If the user only published to some platforms, ask:
```
Published to X. Want to adapt and publish to LinkedIn and Bluesky too?
```

If yes, draft adapted versions (follow the draft mode adaptation flow), then publish those too. Each platform can use its own method (API or clipboard) independently.

### Publishing with images

If a draft has an image path in the Image column of `data/drafts.md`, pass it to the publish script via `--image <path>`.

The user can also say "publish with this screenshot" and provide a file path. Use the Read tool to verify the image exists before passing it to the script.

Note: Images can only be attached via API publishing. For clipboard workflows, remind the user to attach the image manually after pasting.
