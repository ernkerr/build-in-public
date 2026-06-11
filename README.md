# build-in-public

_You're already building. You're just not posting about it._  
**This agent turns your git commits into posts — drafted in your voice, published from your terminal.**

---

A Claude Code skill that reads your git history, drafts build-in-public posts for X, LinkedIn, Bluesky, and Threads, and publishes them — all from a conversation in your terminal. No web app, no dashboard, no context switching.

> **The agent gets better over time.** It learns your voice from past posts, studies viral #buildinpublic content, and adapts to each platform's style. The more you use it, the less you need to edit.

## What It Does

| Feature                    | Description                                                                                              |
| -------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Draft from commits**     | Reads your git log, suggests what to post about, writes the post                                         |
| **Multi-platform**         | Writes differently for X (280 chars, punchy), LinkedIn (storytelling), Bluesky (indie), Threads (casual) |
| **Expand ideas**           | Got a rough thought? Agent suggests 3 angles with hooks before drafting                                  |
| **Learn from viral posts** | Scrapes popular #buildinpublic content to improve your drafts                                            |
| **Audit your own account** | Pulls your published posts via API and extracts your real voice patterns (re-runnable, diffs over time) |
| **Creator watchlist**      | Analyze creators you admire (via your logged-in browser) — what they do well, what to borrow         |
| **Voice learning**         | Remembers your tone, patterns, and what works — gets better every post                                   |
| **Cross-post**             | Like your X post? "Adapt for LinkedIn" rewrites it for that platform                                     |
| **Direct publishing**      | Posts via API to X, LinkedIn, Bluesky — no copy-paste                                                    |
| **Image support**          | Attach screenshots or diagrams by passing a file path                                                    |
| **Style references**       | Paste posts you admire, agent matches that energy                                                        |
| **File-based storage**     | Drafts, history, and voice data stored as readable markdown                                              |

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
/build-in-public audit              → Audit your own posts — extract your real voice
/build-in-public creators           → Analyze creators you admire, build your watchlist
/build-in-public onboard            → First-run setup (auto-offered when fresh)
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

| Platform     | What you need                           | How to get it                                                                            |
| ------------ | --------------------------------------- | ---------------------------------------------------------------------------------------- |
| **X**        | API key + secret, access token + secret | [X Developer Portal](https://developer.x.com) — create app, enable OAuth 1.0a Read+Write |
| **LinkedIn** | Access token + person URN               | `npm run connect:linkedin` — see [LinkedIn setup](#linkedin-setup) below                 |
| **Bluesky**  | Handle + app password                   | [Bluesky Settings](https://bsky.app/settings/app-passwords) — create app password        |
| **Instagram**| Access token (60-day)                   | `npm run connect:instagram` — see [Instagram setup](#instagram-setup) below              |
| **Threads**  | Access token + user ID                  | [Meta Developer](https://developers.facebook.com) — requires app review                  |

Add credentials to `config/profile.yml`. Only configure the platforms you use — the rest are optional.

### LinkedIn Setup

1. Go to [linkedin.com/developers/apps](https://www.linkedin.com/developers/apps) and click **Create App**
2. Go to the **Products** tab → request **Share on LinkedIn** and **Sign In with LinkedIn using OpenID Connect**
3. Go to the **Auth** tab → under **Authorized redirect URLs**, add `https://httpbin.org/get`
4. Run the connect script:
   ```bash
   npm run connect:linkedin
   ```
   It will ask for your Client ID and Secret (from the Auth tab), open your browser to authorize, and handle the rest automatically.

> **Note:** LinkedIn tokens expire after 60 days. Run `npm run connect:linkedin` again to re-auth.

### Instagram Setup

Instagram powers the **account audit** (`/build-in-public audit instagram` — extracts your real voice from your published posts). Setup is ~5 minutes, all free:

1. Make your Instagram account **Professional** (Business or Creator): Instagram app → Settings → Account type
2. Create a Meta app at [developers.facebook.com/apps](https://developers.facebook.com/apps) (type: Business) → **Add Product → Instagram** → "API setup with Instagram business login"
3. Run the guided connector:
   ```bash
   npm run connect:instagram
   ```
   It opens the dashboard, tells you exactly where to generate the token (under "Generate access tokens": Add account → log in → copy), then **validates the token and resolves your user ID automatically**.

> **Note:** tokens last ~60 days. Re-run `npm run connect:instagram` and it offers a one-keypress refresh.

## Learning Your Voice

The agent improves over time:

1. **Account audit** — `/build-in-public audit instagram` pulls your own published posts via API and extracts your *actual* voice patterns (caption modes, punctuation tells, what performs). The fastest way to seed your personal layer with evidence instead of guesses. Re-run it anytime; reports land in `data/local/audits/{platform}/` and each re-audit diffs against the last one.
2. **Style references** — Paste posts you like: "learn from this: [post]"
3. **Viral scraping** — `/build-in-public learn x` finds popular #buildinpublic posts and analyzes what works
4. **Voice files** — `data/voice/voice.md` (universal) plus `data/voice/{platform}/voice.md` accumulate your patterns, tone, and what resonates per platform. Task-specific voices live under platform folders (e.g. `data/voice/instagram/scripting.md`).
5. **Past posts** — The agent reads your publication history to stay consistent

The more you use it, the less editing you'll need.

## Project Structure

```
CLAUDE.md                   # Agent identity + @-imports for the always-on rules
SKILL.md                    # Agent-level knowledge surface (the high-level shape)
decisions.md                # Log of major design/architectural decisions

.claude/
  rules/                    # COMMON layer — brand-agnostic, same for every user
    voice-lookup.md         # Drafting protocol (read every session via @import)
    feedback-loop.md        # Feedback handling protocol (read every session via @import)
    publish-safety.md       # Publish/metrics/overwrite guards
  skills/build-in-public/
    SKILL.md                # Skill entry point and routing

modes/
  _shared.md                # Shared context (pointer to rules; git + save mechanics)
  draft.md                  # Drafting flow
  publish.md                # Publishing flow
  expand.md                 # Idea expansion
  learn.md                  # Learn from viral posts (other people's)
  audit.md                  # Audit your own published posts → voice patterns
  creators.md               # Analyze creators you admire → watchlist + patterns
  onboard.md                # First-run setup: seed the personal layer
  review.md                 # Review pending drafts
  history.md                # View past posts

config/
  profile.example.yml       # Config template (copy to profile.yml)

data/
  voice/                    # BASE voice layer — committed generic defaults, forker-editable
    voice.md                # Universal voice defaults
    never-words.md          # Generic AI-slop bans (vocab + cadences)
    non-negotiables.md      # Generic punctuation/structure/tone defaults
    {platform}/voice.md     # Per-platform mechanics + defaults (x, linkedin, instagram, ...)
    instagram/{scripting,hook,text-overlay,caption}.md  # Per-task defaults
  references/               # Ships as placeholders only
  local/                    # PERSONAL layer — gitignored, never ships (see data/local/README.md)
    voice/                  # Your patterns; mirrors data/voice/, wins on conflict
    references/             # Posts you saved as inspiration (other people's)
    audits/                 # Audits of your own published posts (your real voice)
    drafts.md               # Your draft queue
    published.md            # Your publication history

inbox/                      # Incoming material awaiting triage
outputs/                    # Completed work
archive/                    # Read-only past iterations

scripts/
  publish-x.mjs             # X publishing script
  publish-linkedin.mjs      # LinkedIn publishing script
  publish-bluesky.mjs       # Bluesky publishing script
  scrape-viral.mjs          # Viral post scraper
  setup.mjs                 # Interactive config setup
```

## Adding a New Platform

1. Create `data/voice/{platform}/voice.md` with format constraints + voice direction
2. Create `data/references/{platform}/` with a 1-line README placeholder
3. Create `scripts/publish-{platform}.mjs`
4. Add credential fields to `config/profile.example.yml` (and your own `profile.yml`)
5. Add to the platform pick logic in `modes/draft.md`

Or just ask Claude: "Add Mastodon support" — it knows the pattern.

## Forking This Repo (Making It Yours)

Personal content is **never committed** — it lives in the gitignored `data/local/` layer. So a fork is already clean: you get the engine and the generic defaults, none of the original author's voice.

**What you inherit:**
- `.claude/rules/` — drafting protocol, feedback loop, publish safety (process; rarely needs touching)
- `modes/`, `.claude/skills/`, `scripts/` — workflows and publishing
- `data/voice/` — base voice defaults (no em dashes, hashtag caps, hook formulas, platform mechanics). These are *defaults, not rules*: edit them directly — or tell your agent ("I like em dashes, remove that ban") — to change what your instance considers baseline.

**What you build (automatically, by using it):**
- `data/local/voice/` — your patterns, accumulated from feedback you give on drafts
- `data/local/references/` — posts you save as inspiration
- `data/local/audits/` — audits of your own published posts

**Fastest path to your own voice:** `npm run setup`, add platform API creds to `config/profile.yml`, then `/build-in-public audit {platform}` to seed your personal layer from your real published posts instead of starting from guesses. Re-audit whenever your style shifts. Every piece of draft feedback compounds via the feedback loop.

Everything personal — voice learnings, references, audits, drafts, publish history — lives in `data/local/`, which is gitignored. A fork contains nothing of the original author's.

## Contributing

PRs welcome. The skill is just markdown files and Node scripts. No build step.

- **New agent capability** → add or edit a mode file in `modes/`
- **New platform** → add a publish script + platform rules + style refs template
- **Better prompts** → edit the mode files directly

## License

[MIT](LICENSE)
