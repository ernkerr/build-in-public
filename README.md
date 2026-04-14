# build-in-public

Turn your git commits and dev notes into build-in-public posts for X, LinkedIn, Bluesky, and Threads. An AI agent drafts platform-specific posts in your voice. You review and publish — directly from the app.

## Quickstart

```bash
git clone https://github.com/ernkerr/build-in-public.git
cd build-in-public
npm install
npm run setup          # Interactive CLI — walks you through API keys
npm run dev            # http://localhost:3000
```

That's it. The setup wizard handles everything. Or if you prefer, copy `.env.example` to `.env` and fill it in manually.

> **Security note:** This app is designed to run locally on your machine. It has no authentication — all API routes are open. Do not deploy it to a public URL without adding auth first. Your OAuth tokens and API keys are stored in a local SQLite database.

## How it works

```
[GitHub Commits] ──┐
                   ├──► Claude AI ──► Draft Queue ──► Review UI ──► Publish
[Notes (textbox)] ─┘      ▲                                          │
                          │                               ┌──────────┼──────────┐
                  [Style References]                      ▼          ▼          ▼
                                                      X API    LinkedIn    Bluesky
```

1. **Ingest** — Commits auto-pull from all your GitHub repos on page load. Add dev notes manually.
2. **Draft** — Pick platforms (X, LinkedIn, Bluesky, Threads) and generate. Each gets its own AI-tailored post.
3. **Review** — Edit inline, attach images, regenerate if you don't like it, approve or reject.
4. **Publish** — Post directly via API, schedule for later, or copy to clipboard.

## Features

- **Multi-platform drafting** — AI writes different versions for each platform's style and limits
- **Direct publishing** — X, LinkedIn, Bluesky, and Threads via API
- **OAuth connect** — Click "Connect" in Settings for X and LinkedIn (no API key juggling)
- **Post scheduling** — Pick a date/time, posts publish automatically
- **Image upload** — Attach screenshots or diagrams to any draft
- **Regenerate** — Don't like a draft? Hit regenerate for a fresh take
- **Style references** — Paste example posts you admire, the AI matches your voice
- **All-repo ingestion** — Auto-pulls commits from every repo you push to
- **Mobile-ready** — Responsive with hamburger nav for reviewing on your phone

## Platform setup

| Platform | How to connect |
|---|---|
| **X / Twitter** | Set `X_CLIENT_ID` + `X_CLIENT_SECRET` in .env, then click "Connect" in Settings |
| **LinkedIn** | Set `LINKEDIN_CLIENT_ID` + `LINKEDIN_CLIENT_SECRET` in .env, then click "Connect" in Settings |
| **Bluesky** | Set `BLUESKY_IDENTIFIER` + `BLUESKY_APP_PASSWORD` in .env ([get app password](https://bsky.app/settings/app-passwords)) |
| **Threads** | Set `THREADS_ACCESS_TOKEN` + `THREADS_USER_ID` in .env (requires [Meta app review](https://developers.facebook.com/docs/threads)) |

See `.env.example` for detailed instructions per platform.

## Scheduled publishing

Posts can be scheduled from the Publish page. The app checks for due posts:

- **Automatically** while the app is open (every 60 seconds)
- **Via cron script** for always-on scheduling:
  ```bash
  npm run cron   # Run alongside npm run dev
  ```
- **Via external cron** in production — hit `GET /api/publish/scheduled` every minute

## Extending

**Add a new platform:**
1. Add platform rules in `src/agent/prompts/platform-rules.ts`
2. Create a publisher in `src/publish/` implementing the `Publisher` interface
3. Register it in `src/publish/index.ts`

**Add a new ingest source:**
```typescript
// Implement the Source interface in src/ingest/types.ts
interface Source {
  fetch(): Promise<IngestItemInput[]>;
}
```
See `src/ingest/sources/github.ts` for reference.

## Tech stack

Next.js 15 (App Router, Turbopack) · TypeScript · Tailwind CSS v4 · shadcn/ui · Prisma + SQLite · Claude API · Twitter API v2 · LinkedIn API · AT Protocol (Bluesky) · Threads API

## Contributing

PRs welcome. Run `npm run setup` to get your local env configured, then `npm run dev`.

## License

[MIT](LICENSE)
