# build-in-public

A Claude Code skill that turns your git commits and ideas into build-in-public posts for X, LinkedIn, Bluesky, and Threads. Draft, review, and publish — all from your terminal.

## Quickstart

```bash
git clone https://github.com/ernkerr/build-in-public.git
cd build-in-public
npm install
cp config/profile.example.yml config/profile.yml   # Fill in your handles + API keys
```

Then in Claude Code:

```
> /build-in-public
```

That's it. The agent reads your git history, helps you draft posts, and publishes them.

## How it works

```
You're coding
  → /build-in-public draft
    → Agent reads your recent commits
    → Drafts a post for X in your voice
    → You tweak it in conversation
    → "Publish to X and adapt for LinkedIn"
    → ✓ Published to both platforms
```

The agent is conversational. Tell it what you want:
- "post about the auth feature I just shipped"
- "make this more punchy"
- "adapt this for linkedin"
- "learn from @levelsio's style"

## Commands

| Command | What it does |
|---|---|
| `/build-in-public` | Show available commands |
| `/build-in-public draft` | Draft a post from recent commits or an idea |
| `/build-in-public publish` | Publish pending drafts to your platforms |
| `/build-in-public expand` | Expand a rough idea into angles and hooks |
| `/build-in-public learn` | Learn from viral posts to improve drafting |
| `/build-in-public review` | Review and edit pending drafts |
| `/build-in-public history` | View your published post history |

Or just type your idea: `/build-in-public I just shipped dark mode`

## Platform setup

| Platform | What you need |
|---|---|
| **X** | API key + secret, access token + secret ([developer portal](https://developer.x.com)) |
| **LinkedIn** | Access token + person URN ([developer apps](https://linkedin.com/developers/apps)) |
| **Bluesky** | Handle + app password ([settings](https://bsky.app/settings/app-passwords)) |
| **Threads** | Access token + user ID ([Meta developer](https://developers.facebook.com)) |

Add credentials to `config/profile.yml`. Only configure the platforms you use.

## What the agent can do

- **Read your git history** — knows what you've been working on
- **Draft per-platform** — writes differently for X (280 chars, punchy) vs LinkedIn (storytelling) vs Bluesky (indie crowd)
- **Learn your voice** — from your past posts and style references
- **Learn from viral posts** — scrapes popular #buildinpublic content to improve drafts
- **Expand ideas** — turns rough thoughts into 3 angles with hooks
- **Cross-post** — write once, adapt for every platform
- **Publish directly** — posts via API, no copy-paste
- **Attach images** — pass a file path for screenshots

## Project structure

```
.claude/skills/build-in-public/
  SKILL.md              # Skill entry point and routing
modes/
  _shared.md            # Shared context (platform rules, writing rules, voice)
  draft.md              # Drafting flow
  publish.md            # Publishing flow
  expand.md             # Idea expansion
  learn.md              # Learn from viral posts
  review.md             # Review pending drafts
  history.md            # View past posts
config/
  profile.example.yml   # Config template (copy to profile.yml)
data/
  drafts.md             # Draft queue
  published.md          # Publication history
  voice.md              # Learned voice profile
  style-refs/           # Viral post examples per platform
scripts/
  publish-x.mjs         # X publishing script
  publish-linkedin.mjs  # LinkedIn publishing script
  publish-bluesky.mjs   # Bluesky publishing script
  scrape-viral.mjs      # Viral post scraper
```

## Adding a new platform

1. Add platform rules to `modes/_shared.md`
2. Create a publish script in `scripts/`
3. Add credentials to `config/profile.example.yml`
4. Create a style refs file in `data/style-refs/`

## License

[MIT](LICENSE)
