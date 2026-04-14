#!/usr/bin/env node

import { createInterface } from "node:readline";
import { readFile, writeFile, copyFile, access } from "node:fs/promises";
import { join } from "node:path";
import { execSync } from "node:child_process";

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));
const ROOT = new URL("..", import.meta.url).pathname;

function bold(s) { return `\x1b[1m${s}\x1b[0m`; }
function dim(s) { return `\x1b[2m${s}\x1b[0m`; }
function green(s) { return `\x1b[32m${s}\x1b[0m`; }
function yellow(s) { return `\x1b[33m${s}\x1b[0m`; }
function cyan(s) { return `\x1b[36m${s}\x1b[0m`; }

const env = {};

async function main() {
  console.log();
  console.log(bold("  build-in-public setup"));
  console.log(dim("  Turn your commits into content\n"));

  // Check if .env already exists
  const envPath = join(ROOT, ".env");
  let existingEnv = "";
  try {
    existingEnv = await readFile(envPath, "utf-8");
    console.log(dim("  Found existing .env — will update without overwriting existing values\n"));
  } catch {
    // No existing .env — we'll create one
    try {
      await copyFile(join(ROOT, ".env.example"), envPath);
      existingEnv = await readFile(envPath, "utf-8");
    } catch {
      existingEnv = "";
    }
  }

  // Parse existing env values
  const existing = {};
  for (const line of existingEnv.split("\n")) {
    const match = line.match(/^([A-Z_]+)="?([^"]*)"?$/);
    if (match && match[2]) existing[match[1]] = match[2];
  }

  // ── Claude API ──────────────────────────────────────────
  console.log(bold("  1. Claude API") + " (required for drafting)");
  console.log(dim("     Get a key at https://console.anthropic.com/\n"));

  const anthropicKey = existing.ANTHROPIC_API_KEY || "";
  if (anthropicKey) {
    console.log(green(`     ✓ Already set (${anthropicKey.slice(0, 12)}...)\n`));
    env.ANTHROPIC_API_KEY = anthropicKey;
  } else {
    const key = await ask(cyan("     API key: "));
    env.ANTHROPIC_API_KEY = key.trim();
    console.log(key.trim() ? green("     ✓ Set\n") : yellow("     ⚠ Skipped — drafting won't work without this\n"));
  }

  // ── GitHub ──────────────────────────────────────────────
  console.log(bold("  2. GitHub") + " (for commit ingestion)");
  console.log(dim("     Create a token at https://github.com/settings/tokens"));
  console.log(dim("     Needs 'repo' scope. Leave blank to skip.\n"));

  const githubPat = existing.GITHUB_PAT || "";
  if (githubPat) {
    console.log(green(`     ✓ Already set (${githubPat.slice(0, 10)}...)\n`));
    env.GITHUB_PAT = githubPat;
  } else {
    const pat = await ask(cyan("     Personal access token: "));
    env.GITHUB_PAT = pat.trim();
    console.log(pat.trim() ? green("     ✓ Set\n") : dim("     Skipped\n"));
  }

  // ── X (Twitter) ─────────────────────────────────────────
  console.log(bold("  3. X / Twitter") + " (for direct publishing)");
  console.log(dim("     Create an app at https://developer.x.com/en/portal/dashboard"));
  console.log(dim("     Enable OAuth 1.0a with Read+Write. Leave blank to skip.\n"));

  const xConfigured = existing.X_API_KEY;
  if (xConfigured) {
    console.log(green("     ✓ Already configured\n"));
    env.X_API_KEY = existing.X_API_KEY;
    env.X_API_SECRET = existing.X_API_SECRET || "";
    env.X_ACCESS_TOKEN = existing.X_ACCESS_TOKEN || "";
    env.X_ACCESS_SECRET = existing.X_ACCESS_SECRET || "";
  } else {
    const wantX = await ask(cyan("     Set up X publishing? (y/n): "));
    if (wantX.toLowerCase() === "y") {
      env.X_API_KEY = (await ask(cyan("     API Key: "))).trim();
      env.X_API_SECRET = (await ask(cyan("     API Secret: "))).trim();
      env.X_ACCESS_TOKEN = (await ask(cyan("     Access Token: "))).trim();
      env.X_ACCESS_SECRET = (await ask(cyan("     Access Token Secret: "))).trim();
      console.log(green("     ✓ Set\n"));
    } else {
      env.X_API_KEY = "";
      env.X_API_SECRET = "";
      env.X_ACCESS_TOKEN = "";
      env.X_ACCESS_SECRET = "";
      console.log(dim("     Skipped\n"));
    }
  }

  // ── LinkedIn ────────────────────────────────────────────
  console.log(bold("  4. LinkedIn") + " (for direct publishing)");
  console.log(dim("     Create an app at https://linkedin.com/developers/apps"));
  console.log(dim("     Request 'Share on LinkedIn' product. Leave blank to skip.\n"));

  const liConfigured = existing.LINKEDIN_ACCESS_TOKEN;
  if (liConfigured) {
    console.log(green("     ✓ Already configured\n"));
    env.LINKEDIN_ACCESS_TOKEN = existing.LINKEDIN_ACCESS_TOKEN;
    env.LINKEDIN_PERSON_URN = existing.LINKEDIN_PERSON_URN || "";
  } else {
    const wantLi = await ask(cyan("     Set up LinkedIn publishing? (y/n): "));
    if (wantLi.toLowerCase() === "y") {
      env.LINKEDIN_ACCESS_TOKEN = (await ask(cyan("     Access Token: "))).trim();
      env.LINKEDIN_PERSON_URN = (await ask(cyan("     Person URN (urn:li:person:xxx): "))).trim();
      console.log(green("     ✓ Set\n"));
    } else {
      env.LINKEDIN_ACCESS_TOKEN = "";
      env.LINKEDIN_PERSON_URN = "";
      console.log(dim("     Skipped\n"));
    }
  }

  // ── Bluesky ─────────────────────────────────────────────
  console.log(bold("  5. Bluesky") + " (for direct publishing)");
  console.log(dim("     Use your handle and an app password from https://bsky.app/settings/app-passwords\n"));

  const bskyConfigured = existing.BLUESKY_IDENTIFIER;
  if (bskyConfigured) {
    console.log(green(`     ✓ Already configured (${existing.BLUESKY_IDENTIFIER})\n`));
    env.BLUESKY_IDENTIFIER = existing.BLUESKY_IDENTIFIER;
    env.BLUESKY_APP_PASSWORD = existing.BLUESKY_APP_PASSWORD || "";
  } else {
    const wantBsky = await ask(cyan("     Set up Bluesky publishing? (y/n): "));
    if (wantBsky.toLowerCase() === "y") {
      env.BLUESKY_IDENTIFIER = (await ask(cyan("     Handle (e.g. you.bsky.social): "))).trim();
      env.BLUESKY_APP_PASSWORD = (await ask(cyan("     App password: "))).trim();
      console.log(green("     ✓ Set\n"));
    } else {
      env.BLUESKY_IDENTIFIER = "";
      env.BLUESKY_APP_PASSWORD = "";
      console.log(dim("     Skipped\n"));
    }
  }

  // ── Threads ─────────────────────────────────────────────
  console.log(bold("  6. Threads") + " (for direct publishing)");
  console.log(dim("     Requires Meta developer app review. Leave blank to skip.\n"));

  const threadsConfigured = existing.THREADS_ACCESS_TOKEN;
  if (threadsConfigured) {
    console.log(green("     ✓ Already configured\n"));
    env.THREADS_ACCESS_TOKEN = existing.THREADS_ACCESS_TOKEN;
    env.THREADS_USER_ID = existing.THREADS_USER_ID || "";
  } else {
    const wantThreads = await ask(cyan("     Set up Threads publishing? (y/n): "));
    if (wantThreads.toLowerCase() === "y") {
      env.THREADS_ACCESS_TOKEN = (await ask(cyan("     Access Token: "))).trim();
      env.THREADS_USER_ID = (await ask(cyan("     User ID: "))).trim();
      console.log(green("     ✓ Set\n"));
    } else {
      env.THREADS_ACCESS_TOKEN = "";
      env.THREADS_USER_ID = "";
      console.log(dim("     Skipped\n"));
    }
  }

  // ── Write .env ──────────────────────────────────────────
  const envContent = `# Generated by npm run setup
DATABASE_URL="file:./dev.db"

# Claude API
ANTHROPIC_API_KEY="${env.ANTHROPIC_API_KEY || ""}"

# GitHub
GITHUB_PAT="${env.GITHUB_PAT || ""}"

# X (Twitter)
X_API_KEY="${env.X_API_KEY || ""}"
X_API_SECRET="${env.X_API_SECRET || ""}"
X_ACCESS_TOKEN="${env.X_ACCESS_TOKEN || ""}"
X_ACCESS_SECRET="${env.X_ACCESS_SECRET || ""}"

# LinkedIn
LINKEDIN_ACCESS_TOKEN="${env.LINKEDIN_ACCESS_TOKEN || ""}"
LINKEDIN_PERSON_URN="${env.LINKEDIN_PERSON_URN || ""}"

# Bluesky
BLUESKY_IDENTIFIER="${env.BLUESKY_IDENTIFIER || ""}"
BLUESKY_APP_PASSWORD="${env.BLUESKY_APP_PASSWORD || ""}"

# Threads
THREADS_ACCESS_TOKEN="${env.THREADS_ACCESS_TOKEN || ""}"
THREADS_USER_ID="${env.THREADS_USER_ID || ""}"
`;

  await writeFile(envPath, envContent);
  console.log(green("  ✓ .env written\n"));

  // ── Database setup ──────────────────────────────────────
  console.log(dim("  Setting up database..."));
  try {
    execSync("npx prisma db push", { cwd: ROOT, stdio: "ignore" });
    execSync("npx prisma generate", { cwd: ROOT, stdio: "ignore" });
    console.log(green("  ✓ Database ready\n"));
  } catch {
    console.log(yellow("  ⚠ Database setup failed — run 'npx prisma db push' manually\n"));
  }

  // ── Summary ─────────────────────────────────────────────
  console.log(bold("  All set! Here's what's configured:\n"));

  const check = (v) => v ? green("  ✓") : dim("  ✗");
  console.log(`${check(env.ANTHROPIC_API_KEY)} Claude API (drafting)`);
  console.log(`${check(env.GITHUB_PAT)} GitHub (commit ingestion)`);
  console.log(`${check(env.X_API_KEY)} X / Twitter (publishing)`);
  console.log(`${check(env.LINKEDIN_ACCESS_TOKEN)} LinkedIn (publishing)`);
  console.log(`${check(env.BLUESKY_IDENTIFIER)} Bluesky (publishing)`);
  console.log(`${check(env.THREADS_ACCESS_TOKEN)} Threads (publishing)`);

  console.log(`\n  Run ${cyan("npm run dev")} to start the app.`);
  console.log(`  Run ${cyan("npm run cron")} in another terminal for scheduled publishing.\n`);

  rl.close();
}

main().catch((e) => {
  console.error(e);
  rl.close();
  process.exit(1);
});
