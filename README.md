# build-in-public

Turn your git commits and dev notes into build-in-public posts for X, LinkedIn, and Threads. An AI agent drafts platform-specific posts in your voice. You review, edit, and publish.

## How it works

```
[GitHub Commits] ──┐
                   ├──► Agent (Claude API) ──► Draft Queue ──► Review UI ──► Publish
[Notes (textbox)] ─┘        ▲
                            │
                    [Style References]
```

1. **Ingest** — Add dev notes manually or pull commits from GitHub
2. **Draft** — The agent generates platform-tailored posts using your raw material and style references
3. **Review** — Edit drafts inline, approve or reject them
4. **Publish** — Copy approved posts to clipboard and paste to each platform

## Quickstart

```bash
git clone https://github.com/ernkerr/build-in-public.git
cd build-in-public
npm install
cp .env.example .env     # Fill in your API keys
npx prisma db push       # Create the SQLite database
npx prisma generate      # Generate the Prisma client
npm run dev              # Start the app at localhost:3000
```

## Prerequisites

- Node.js 20+
- A [Claude API key](https://docs.anthropic.com/) (`ANTHROPIC_API_KEY`)
- A [GitHub personal access token](https://github.com/settings/tokens) if using commit ingestion (`GITHUB_PAT`)

## Configuration

| Variable | Description |
|---|---|
| `DATABASE_URL` | SQLite database path (default: `file:./dev.db`) |
| `ANTHROPIC_API_KEY` | Your Claude API key for generating drafts |
| `GITHUB_PAT` | GitHub token for pulling commits (optional) |

## Adding new platforms

The drafting system is tool-based. To add a new platform (e.g., Bluesky):

1. Add platform rules in `src/agent/prompts/platform-rules.ts`
2. The agent will use those rules when generating drafts for the new platform
3. Add the platform option to the UI dropdowns

## Adding new ingest sources

Implement the `Source` interface in `src/ingest/types.ts`:

```typescript
interface Source {
  fetch(): Promise<IngestItemInput[]>;
}
```

See `src/ingest/sources/github.ts` for an example.

## Tech stack

- Next.js 15 (App Router, Turbopack)
- TypeScript, Tailwind CSS v4, shadcn/ui
- Prisma + SQLite
- Claude API (Anthropic SDK)

## License

MIT
