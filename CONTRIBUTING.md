# Contributing

Thanks for wanting to contribute to build-in-public!

## Getting started

```bash
git clone https://github.com/ernkerr/build-in-public.git
cd build-in-public
npm install
npm run setup    # Set up your .env with API keys
npm run dev      # http://localhost:3000
```

## Project structure

```
src/
├── agent/           # AI drafting (LLM wrapper, prompts, platform rules)
├── app/             # Next.js App Router (pages + API routes)
├── components/      # React components (UI)
├── ingest/          # Content ingestion (GitHub commits, notes)
├── lib/             # Shared utilities (Prisma client, cn helper)
└── publish/         # Platform publishers (X, LinkedIn, Bluesky, Threads)
```

## Adding a new platform

1. Add platform rules in `src/agent/prompts/platform-rules.ts`
2. Create a publisher in `src/publish/` implementing the `Publisher` interface from `src/publish/types.ts`
3. Register it in `src/publish/index.ts`
4. Add the platform to `ALL_PLATFORMS` in `src/app/drafts/page.tsx`
5. Add a char limit in `src/components/draft-card.tsx`
6. Add an icon in `src/components/platform-icon.tsx`

## Adding a new ingest source

1. Implement the `Source` interface from `src/ingest/types.ts`
2. Create your source in `src/ingest/sources/`
3. Add an API route in `src/app/api/ingest/`

## Code style

- TypeScript throughout
- Biome for linting (`npm run lint` — not fully configured yet, PRs welcome)
- No unnecessary abstractions — keep it simple

## Pull requests

- Keep PRs focused on one thing
- Test your changes locally
- Update the README if you add user-facing features
