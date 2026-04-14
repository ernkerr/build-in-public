# build-in-public

<p align="center">
  <em>You're already building. You're just not posting about it.</em><br>
  <strong>This agent turns your git commits into posts — drafted in your voice, published from your terminal.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Claude_Code-000?style=flat&logo=anthropic&logoColor=white" alt="Claude Code">
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT">
</p>

---

A Claude Code skill that reads your git history, drafts build-in-public posts for X, LinkedIn, Bluesky, and Threads, and publishes them — all from a conversation in your terminal. No web app, no dashboard, no context switching.

> **The agent gets better over time.** It learns your voice from past posts, studies viral #buildinpublic content, and adapts to each platform's style. The more you use it, the less you need to edit.

## What It Does

| Feature | Description |
|---------|-------------|
| **Draft from commits** | Reads your git log, suggests what to post about, writes the post |
| **Multi-platform** | Writes differently for X (280 chars, punchy), LinkedIn (storytelling), Bluesky (indie), Threads (casual) |
| **Expand ideas** | Got a rough thought? Agent suggests 3 angles with hooks before drafting |
| **Learn from viral posts** | Scrapes popular #buildinpublic content to improve your drafts |
| **Voice learning** | Remembers your tone, patterns, and what works — gets better every post |
| **Cross-post** | Like your X post? "Adapt for LinkedIn" rewrites it for that platform |
| **Direct publishing** | Posts via API to X, LinkedIn, Bluesky — no copy-paste |
| **Image support** | Attach screenshots or diagrams by passing a file path |
| **Style references** | Paste posts you admire, agent matches that energy |
| **File-based storage** | Drafts, history, and voice data stored as readable markdown |

## Quick Start

```bash
# 1. Clone and install
git clone https://github.com/ernkerr/build-in-public.git
cd build-in-public && npm install

# 2. Configure
npm run setup                   # Interactive — walks you through handles + API keys

# Or manually:
cp config/profile.example.yml config/profile.yml    # Edit with your details

# 3. Start using
claude                          # Open Claude Code in this directory
```

Then:

```
> /build-in-public
```

> **The system is designed to be customized by Claude itself.** Modes, platform rules, voice settings — just ask Claude to change them. It reads the same files it uses, so it knows exactly what to edit.

## Usage

build-in-public is a single slash command with multiple modes:

```
/build-in-public                    → Show all available commands
/build-in-public draft              → Draft a post from recent commits or an idea
/build-in-public publish            → Publish pending drafts to your platforms
/build-in-public expand [idea]      → Expand a rough idea into angles and hooks
/build-in-public learn              → Scrape viral posts to learn what works
/build-in-public review             → Review and edit pending drafts
/build-in-public history            → View your published post history
```

Or just tell it what you want:

```
> /build-in-public I just shipped dark mode

  Looking at your recent commits...

  Here's a draft for X (271/280 chars):

  "Just shipped dark mode. Not because users asked — because I couldn't
  stand looking at my own app at 2am.

  Took 4 hours. 3 of those were fighting CSS variables.

  #buildinpublic"

  Want to:
  1. Edit this
  2. Publish to X
  3. Adapt for LinkedIn and Bluesky
  4. Start over

> 3

  LinkedIn version:
  "Dark mode is one of those features that seems simple until you build it..."

  Bluesky version:
  "shipped dark mode today. 4 hours. 3 of those were CSS variables."

  Want to publish all three?

> yes

  ✓ Published to X: https://x.com/i/status/...
  ✓ Published to LinkedIn: https://linkedin.com/feed/...
  ✓ Published to Bluesky: https://bsky.app/profile/...
```

## How It Works

```
You're coding → push commits → /build-in-public draft
                                       │
                                       ▼
                              ┌─────────────────┐
                              │  Agent reads:    │
                              │  · git log       │
                              │  · voice.md      │
                              │  · style refs    │
                              └────────┬────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │  Drafts post     │
                              │  per platform    │
                              └────────┬────────┘
                                       │
                            ┌──────────┼──────────┐
                            ▼          ▼          ▼
                        X tweet   LinkedIn    Bluesky
                                    post       post
                            │          │          │
                            ▼          ▼          ▼
                         Publish via API from terminal
```

## Platform Setup

| Platform | What you need | How to get it |
|----------|---------------|---------------|
| **X** | API key + secret, access token + secret | [X Developer Portal](https://developer.x.com) — create app, enable OAuth 1.0a Read+Write. Free tier: 500 posts/mo (if available), otherwise pay-per-use at $0.01/post |
| **LinkedIn** | Access token + person URN | [LinkedIn Developer Apps](https://linkedin.com/developers/apps) — create app, request w_member_social |
| **Bluesky** | Handle + app password | [Bluesky Settings](https://bsky.app/settings/app-passwords) — create app password |
| **Threads** | Access token + user ID | [Meta Developer](https://developers.facebook.com) — requires app review |

Add credentials to `config/profile.yml`. Only configure the platforms you use — the rest are optional.

## Learning Your Voice

The agent improves over time:

1. **Style references** — Paste posts you like: "learn from this: [post]"
2. **Viral scraping** — `/build-in-public learn x` finds popular #buildinpublic posts and analyzes what works
3. **Voice file** — `data/voice.md` accumulates your patterns, tone, and what resonates
4. **Past posts** — The agent reads your publication history to stay consistent

The more you use it, the less editing you'll need.

## Project Structure

```
.claude/skills/build-in-public/
  SKILL.md                  # Skill entry point and routing

modes/
  _shared.md                # Shared context (platform rules, writing rules, voice)
  draft.md                  # Drafting flow
  publish.md                # Publishing flow
  expand.md                 # Idea expansion
  learn.md                  # Learn from viral posts
  review.md                 # Review pending drafts
  history.md                # View past posts

config/
  profile.example.yml       # Config template (copy to profile.yml)

data/
  drafts.md                 # Draft queue (markdown table)
  published.md              # Publication history
  voice.md                  # Learned voice profile
  style-refs/               # Viral post examples per platform

scripts/
  publish-x.mjs             # X publishing script
  publish-linkedin.mjs      # LinkedIn publishing script
  publish-bluesky.mjs       # Bluesky publishing script
  scrape-viral.mjs          # Viral post scraper
  setup.mjs                 # Interactive config setup
```

## Adding a New Platform

1. Add platform rules to `modes/_shared.md`
2. Create `scripts/publish-{platform}.mjs`
3. Add credential fields to `config/profile.example.yml`
4. Create `data/style-refs/{platform}.md`

Or just ask Claude: "Add Mastodon support" — it knows the pattern.

## Contributing

PRs welcome. The skill is just markdown files and Node scripts. No build step.

- **New agent capability** → add or edit a mode file in `modes/`
- **New platform** → add a publish script + platform rules + style refs template
- **Better prompts** → edit the mode files directly

## License

[MIT](LICENSE)
