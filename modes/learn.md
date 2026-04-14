# Learn Mode

## Purpose

Learn from viral build-in-public posts to improve drafting quality. Two approaches:
1. **Scrape**: Automatically find popular posts on a platform
2. **Manual**: User pastes a post they like

## Flow

### Option 1: Scrape viral posts

If the user says `/build-in-public learn` or `/build-in-public learn x`:

1. Determine which platform (default: x, or user specifies)
2. Run the scraper: `node scripts/scrape-viral.mjs [platform]`
3. The script returns recent popular #buildinpublic posts
4. For each post, analyze:
   - **Hook**: What's the first line? Why does it stop scrolling?
   - **Structure**: How is it formatted? Short sentences? Line breaks? Thread?
   - **Specifics**: What concrete details are included?
   - **Engagement**: Why did this resonate?

5. Save the best examples to `data/style-refs/{platform}.md`:

```markdown
### Example [N] (source: @handle, ~likes likes)
[full post text]
**Why it works:** [1-2 sentence analysis]
**Pattern:** [reusable pattern name, e.g. "the struggle → solution arc"]
```

6. Update `data/voice.md` with any new patterns discovered:

```markdown
## Patterns that work on [platform]
- The "I almost quit" arc — vulnerability + persistence
- Specific numbers — "$X MRR", "Y users", "Z hours debugging"
- Before/after comparisons
- Short hook + details in thread
```

### Option 2: Learn from a URL

If the user shares a link (e.g. "learn from this: https://x.com/levelsio/status/123"):

1. Use the WebFetch tool to fetch the URL and extract the post text
2. Auto-detect the platform from the URL:
   - `x.com` or `twitter.com` → x
   - `linkedin.com` → linkedin
   - `bsky.app` → bluesky
   - `threads.net` → threads
3. Analyze the post using the same framework as Option 1
4. Save to the appropriate style refs file
5. Extract patterns and update voice.md

### Option 3: Manual learning

If the user pastes post text directly (not a URL) or says "learn from this: [post text]":

1. Analyze the post using the same framework above
2. Ask what platform it's from (if not obvious)
3. Save to the appropriate style refs file
4. Extract patterns and update voice.md

### Option 4: Learn from own past posts

If the user says "learn from my posts" or similar:

1. Read `data/published.md` for post history
2. If engagement data exists, find the top performers
3. Analyze what worked in the user's own voice
4. Update `data/voice.md` with self-learned patterns

## After learning

Show what was learned:
```
Learned from 5 viral posts on X:

New patterns found:
- "The specific number hook" — posts with exact numbers (hours, dollars, users) get 3x more engagement
- "The build log" — daily/weekly progress updates build audience over time
- "Show the code" — screenshots of actual code or terminal output add credibility

Saved to data/style-refs/x.md
Updated data/voice.md with new patterns
```
