# Shared Context

## Platform Rules

### X (Twitter)
- Max 280 characters per tweet
- Threads: up to 10 tweets, separated by `---`
- Hook in the first line — make people stop scrolling
- #buildinpublic tag (1-2 hashtags max, no spam)
- Short, punchy sentences. Numbers perform well.

### LinkedIn
- Up to 3000 characters
- First 2 lines must hook — "see more" fold cuts everything else
- Line breaks for readability (short paragraphs)
- Professional but human — never corporate
- Storytelling format works well
- CTA at the end

### Bluesky
- Max 300 characters per post
- Early Twitter vibe — techy, indie, open-source crowd
- Links and mentions auto-detected
- No algorithm gaming, just write something real
- Short and specific beats long and vague

### Threads
- Up to 500 characters
- Casual, conversational — like talking to a friend who codes
- No hashtags usually
- Emoji is fine, don't overdo it

## Writing Rules

- Be specific about what was built, learned, or struggled with
- Include concrete details: tech choices, numbers, tradeoffs, time spent
- Don't be cringe or overly enthusiastic
- NEVER use these words: delve, leverage, foster, landscape, tapestry, game-changer, unlock, empower, harness, cutting-edge, innovative, robust
- Use contractions (I'm, it's, don't) — write like a real person
- Vary post structure — don't start every post the same way
- Show the messy parts too, not just wins

## Reading Git History

To understand what the user has been working on:
```bash
git log --oneline -20          # Recent commits
git log --oneline --since="3 days ago"  # Last 3 days
git diff HEAD~5 --stat         # What files changed recently
```

Read the ACTUAL git history of whatever repo the user is currently in. Don't assume or make up commits.

## Voice

Before drafting, always:
1. Read `config/profile.yml` for the user's identity and preferences
2. Read `data/voice.md` for learned voice patterns
3. Read `data/style-refs/{platform}.md` for that platform's style examples

If these files are empty or don't exist, ask the user about their voice preferences and save them.

## Saving Data

- Drafts go in `data/drafts.md` as a markdown table row
- Published posts go in `data/published.md`
- Style references go in `data/style-refs/{platform}.md`
- Voice learnings go in `data/voice.md`

Always append to existing data, never overwrite the whole file.
