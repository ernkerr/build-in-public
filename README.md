# build-in-public

Turn your git commits and dev notes into build-in-public posts for X, LinkedIn, and Threads. An AI agent drafts platform-specific posts in your voice. You review and publish — directly from the app or via clipboard.

## How it works

```
[GitHub Commits] ──┐
                   ├──► Agent (Claude API) ──► Draft Queue ──► Review UI ──► Publish
[Notes (textbox)] ─┘        ▲                                                  │
                            │                                    ┌──────────────┤
                    [Style References]                           ▼              ▼
                                                            X API        LinkedIn API
```

1. **Ingest** — Commits are auto-pulled when you open the dashboard. Add dev notes manually.
2. **Draft** — The agent generates platform-tailored posts using your content and style references.
3. **Review** — Edit drafts inline, approve or reject.
4. **Publish** — Post directly to X/LinkedIn via API, or copy to clipboard.

## Quickstart

```bash
git clone https://github.com/ernkerr/build-in-public.git
cd build-in-public
npm install
cp .env.example .env     # Fill in your API keys (see below)
npx prisma db push       # Create the SQLite database
npx prisma generate      # Generate the Prisma client
npm run dev              # Start at localhost:3000
```

## Prerequisites

- Node.js 20+
- A Claude API key (required for drafting)

## API Keys Setup

### Claude API (required)

This powers the AI drafting. Without it, you can still use the app but can't generate drafts.

1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Create an account and add credits
3. Go to **API Keys** and create a new key
4. Set `ANTHROPIC_API_KEY` in your `.env`

### GitHub (optional — for commit ingestion)

Lets the app pull your recent commits as raw material for posts.

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Generate a **classic** token with the `repo` scope
3. Set `GITHUB_PAT` in your `.env`
4. In the app, go to **Settings** and enter your repo (e.g. `ernkerr/build-in-public`)

Commits are auto-ingested when you open the dashboard.

### X / Twitter API (optional — for direct publishing)

Lets you publish tweets directly from the app instead of copy-pasting.

1. Go to the [X Developer Portal](https://developer.x.com/en/portal/dashboard)
2. Sign up for a developer account (Free tier is fine)
3. Create a **Project** and an **App** inside it
4. Under your app's **Settings > User authentication settings**:
   - Enable **OAuth 1.0a**
   - Set App permissions to **Read and Write**
   - Set the callback URL to `http://localhost:3000` (not used, but required)
   - Set the website URL to anything
5. Go to **Keys and tokens** and generate:
   - **API Key and Secret** (Consumer Keys)
   - **Access Token and Secret** (with Read and Write access)
6. Set these in your `.env`:
   ```
   X_API_KEY="your-api-key"
   X_API_SECRET="your-api-secret"
   X_ACCESS_TOKEN="your-access-token"
   X_ACCESS_SECRET="your-access-secret"
   ```

The app supports posting single tweets and threads (separate tweets with `---` in the draft).

### LinkedIn API (optional — for direct publishing)

Lets you publish LinkedIn posts directly from the app.

1. Go to [linkedin.com/developers/apps](https://www.linkedin.com/developers/apps) and create an app
   - You'll need to verify your app with a LinkedIn Page (create one if needed)
2. Under the **Products** tab, request access to **Share on LinkedIn** (`w_member_social`)
3. Under **Auth**, note your **Client ID** and **Client Secret**
4. Get an access token — the easiest way for personal use:
   - Go to the [LinkedIn OAuth Token Generator](https://www.linkedin.com/developers/tools/oauth)
   - Or use the OAuth 2.0 Authorization Code flow manually:
     ```
     https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000&scope=openid%20profile%20w_member_social
     ```
   - Exchange the code for a token using the token endpoint
5. Get your Person URN:
   - Call `GET https://api.linkedin.com/v2/userinfo` with your access token
   - Your URN is: `urn:li:person:{sub}` where `{sub}` is from the response
6. Set these in your `.env`:
   ```
   LINKEDIN_ACCESS_TOKEN="your-access-token"
   LINKEDIN_PERSON_URN="urn:li:person:your-id"
   ```

> **Note:** LinkedIn access tokens expire after 60 days. You'll need to refresh them periodically. A future version will handle this automatically.

## Configuration

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | SQLite path (default: `file:./dev.db`) |
| `ANTHROPIC_API_KEY` | Yes | Claude API key for draft generation |
| `GITHUB_PAT` | No | GitHub token for commit ingestion |
| `X_API_KEY` | No | X/Twitter API consumer key |
| `X_API_SECRET` | No | X/Twitter API consumer secret |
| `X_ACCESS_TOKEN` | No | X/Twitter access token |
| `X_ACCESS_SECRET` | No | X/Twitter access token secret |
| `LINKEDIN_ACCESS_TOKEN` | No | LinkedIn OAuth access token |
| `LINKEDIN_PERSON_URN` | No | Your LinkedIn person URN |

## Adding new platforms

To add a new platform (e.g., Bluesky):

1. Add platform rules in `src/agent/prompts/platform-rules.ts`
2. Create a publisher in `src/publish/` implementing the `Publisher` interface
3. Register it in `src/publish/index.ts`
4. Add the platform option to UI dropdowns

## Adding new ingest sources

Implement the `Source` interface in `src/ingest/types.ts`:

```typescript
interface Source {
  fetch(): Promise<IngestItemInput[]>;
}
```

See `src/ingest/sources/github.ts` for reference.

## Tech stack

- Next.js 15 (App Router, Turbopack)
- TypeScript, Tailwind CSS v4, shadcn/ui
- Prisma + SQLite
- Claude API (Anthropic SDK)
- Twitter API v2, LinkedIn API v2

## License

MIT
