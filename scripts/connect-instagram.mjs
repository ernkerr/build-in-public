#!/usr/bin/env node

// Connect your Instagram account (Instagram API with Instagram Login)
// Usage: npm run connect:instagram
//
// Gets a long-lived (60-day) access token from the Meta developer dashboard,
// validates it, auto-resolves your IG user ID, and saves both to config/profile.yml.
// Re-run any time to refresh the token before it expires.

import { createInterface } from "node:readline";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { exec } from "node:child_process";
import { parse, stringify } from "yaml";

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));
const ROOT = new URL("..", import.meta.url).pathname;

function bold(s) { return `\x1b[1m${s}\x1b[0m`; }
function dim(s) { return `\x1b[2m${s}\x1b[0m`; }
function green(s) { return `\x1b[32m${s}\x1b[0m`; }
function cyan(s) { return `\x1b[36m${s}\x1b[0m`; }
function red(s) { return `\x1b[31m${s}\x1b[0m`; }

function openUrl(url) {
  const cmd = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  exec(`${cmd} "${url}"`);
}

const API = "https://graph.instagram.com/v21.0";

async function validateToken(token) {
  const res = await fetch(`${API}/me?fields=user_id,username,account_type&access_token=${encodeURIComponent(token)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${res.status}`);
  }
  return res.json();
}

async function refreshToken(token) {
  const res = await fetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(token)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${res.status}`);
  }
  return res.json(); // { access_token, token_type, expires_in }
}

function save(config, profilePath, token, userId, username) {
  config.instagram_access_token = token;
  if (userId) config.instagram_user_id = String(userId);
  if (!config.handle) config.handle = {};
  if (username && !config.handle.instagram) config.handle.instagram = username;
  if (!config.platforms) config.platforms = [];
  if (!config.platforms.includes("instagram")) config.platforms.push("instagram");
  writeFileSync(profilePath, stringify(config));
}

async function main() {
  console.log();
  console.log(bold("  Connect Instagram\n"));

  const profilePath = join(ROOT, "config/profile.yml");
  let config = {};
  if (existsSync(profilePath)) {
    config = parse(readFileSync(profilePath, "utf-8")) || {};
  }

  // ── Refresh path: a token already exists ─────────────────────────────────
  if (config.instagram_access_token) {
    console.log(dim("  Found an existing Instagram token in config/profile.yml."));
    const doRefresh = (await ask(cyan("  Refresh it for another 60 days? (y/n, n = replace with a new one): "))).toLowerCase() === "y";
    if (doRefresh) {
      try {
        console.log(dim("\n  Refreshing token..."));
        const refreshed = await refreshToken(config.instagram_access_token);
        const me = await validateToken(refreshed.access_token);
        save(config, profilePath, refreshed.access_token, me.user_id || me.id, me.username);
        const days = Math.floor((refreshed.expires_in || 0) / 86400);
        console.log(green(`\n  ✓ Refreshed — connected as @${me.username}${days ? ` (valid ~${days} days)` : ""}`));
        console.log(green("  ✓ Saved to config/profile.yml\n"));
      } catch (e) {
        console.log(red(`\n  Refresh failed: ${e.message}`));
        console.log(dim("  The old token may be expired — run this script again and choose a new token.\n"));
      }
      rl.close();
      return;
    }
    console.log();
  }

  // ── Fresh setup ───────────────────────────────────────────────────────────
  console.log(dim("  You need (5 minutes, all free):"));
  console.log(dim("  1. An Instagram Professional account (Business or Creator)."));
  console.log(dim("     Instagram app → Settings → Account type → switch if needed."));
  console.log(dim("  2. A Meta developer app at https://developers.facebook.com/apps"));
  console.log(dim("     Create App (type: Business is fine) → Add Product → Instagram →"));
  console.log(cyan("     \"API setup with Instagram business login\""));
  console.log(dim("  3. On that page, under \"Generate access tokens\": Add account →"));
  console.log(dim("     log in with your IG account → copy the long token it shows you.\n"));

  const open = (await ask(cyan("  Open the Meta developer dashboard now? (y/n): "))).toLowerCase() === "y";
  if (open) openUrl("https://developers.facebook.com/apps/");

  console.log();
  const token = (await ask(cyan("  Paste your access token: "))).trim();

  if (!token) {
    console.log(dim("\n  Skipped — no token provided. Run npm run connect:instagram whenever you're ready.\n"));
    rl.close();
    return;
  }

  try {
    console.log(dim("\n  Validating token + looking up your account..."));
    const me = await validateToken(token);
    save(config, profilePath, token, me.user_id || me.id, me.username);
    console.log(green(`\n  ✓ Connected as @${me.username}${me.account_type ? ` (${me.account_type.toLowerCase()})` : ""}`));
    console.log(green("  ✓ User ID resolved automatically — no hunting required"));
    console.log(green("  ✓ Saved to config/profile.yml\n"));
    console.log(dim("  Token lasts ~60 days. Re-run npm run connect:instagram to refresh it."));
    console.log(dim("  Next: open Claude Code here and run /build-in-public audit instagram\n"));
  } catch (e) {
    console.log(red(`\n  Token didn't validate: ${e.message}`));
    console.log(dim("  Double-check you copied the full token from \"Generate access tokens\","));
    console.log(dim("  and that the Instagram account is Professional (Business/Creator).\n"));
  }

  rl.close();
}

main();
