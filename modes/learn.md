# Learn Mode

## Purpose

Learn from viral build-in-public posts to improve drafting quality. Two approaches:
1. **Scrape**: Automatically find popular posts on a platform
2. **Manual**: User pastes a post they like

## Where things get saved

Everything learned is personal — it goes in the gitignored `data/local/` layer, never the committed base:

- **References (full annotated posts)** → `data/local/references/{platform}/curated.md` (append; create the file if it doesn't exist).
- **Voice patterns** → the appropriate level of `data/local/voice/` per `.claude/rules/feedback-loop.md`:
  - Universal pattern (true across platforms) → `data/local/voice/voice.md`
  - Platform-specific pattern → `data/local/voice/{platform}/voice.md`
  - Task-specific pattern (e.g. IG Reel hooks) → `data/local/voice/{platform}/{task}.md`
- If unsure of scope, **ask** before saving.
- Always **append** unless the user explicitly says to overwrite.

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

5. Append the best examples to `data/local/references/{platform}/curated.md`:

```markdown
### Example [N] (source: @handle, ~likes likes)
[full post text]
**Why it works:** [1-2 sentence analysis]
**Pattern:** [reusable pattern name, e.g. "the struggle → solution arc"]
```

6. If new voice patterns emerged, ask the user where they belong (universal / platform / task), then append to the right voice file:

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
   - `instagram.com` → instagram
   - `youtube.com` or `youtu.be` → youtube
   - `tiktok.com` → tiktok
3. Analyze the post using the same framework as Option 1
4. Append to `data/local/references/{platform}/curated.md`
5. If new patterns emerged, ask scope, then append to the right voice file

### Option 3: Manual learning

If the user pastes post text directly (not a URL) or says "learn from this: [post text]":

1. Analyze the post using the same framework above
2. Ask what platform it's from (if not obvious)
3. Append to `data/local/references/{platform}/curated.md`
4. Extract patterns, ask scope, append to the right voice file

### Option 4: Learn from own past posts

If the user says "learn from my posts" or similar:

1. Read `data/local/published.md` for post history
2. If engagement data exists, find the top performers
3. Analyze what worked in the user's own voice
4. Ask scope, then append to the appropriate voice file

## After learning

Show what was learned and where it was saved:
```
Learned from 5 viral posts on X:

New patterns found:
- "The specific number hook" — posts with exact numbers (hours, dollars, users) get 3x more engagement
- "The build log" — daily/weekly progress updates build audience over time
- "Show the code" — screenshots of actual code or terminal output add credibility

Appended references to: data/local/references/x/curated.md
Appended voice patterns to: data/local/voice/x/voice.md (platform-level)
```
