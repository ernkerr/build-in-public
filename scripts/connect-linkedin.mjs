#!/usr/bin/env node

// Connect your LinkedIn account
// Usage: npm run connect:linkedin

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

function openUrl(url) {
  const cmd = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  exec(`${cmd} "${url}"`);
}

async function main() {
  console.log();
  console.log(bold("  Connect LinkedIn\n"));

  const profilePath = join(ROOT, "config/profile.yml");
  let config = {};

  if (existsSync(profilePath)) {
    config = parse(readFileSync(profilePath, "utf-8")) || {};
  }

  console.log(dim("  Before starting, make sure you've done these in the LinkedIn Developer Portal:"));
  console.log(dim("  1. Created an app at https://linkedin.com/developers/apps"));
  console.log(dim("  2. Requested 'Share on LinkedIn' under the Products tab"));
  console.log(dim("  3. Added this redirect URL under Auth tab:"));
  console.log(cyan("     https://httpbin.org/get\n"));

  const clientId = (await ask(cyan("  Client ID: "))).trim();
  const clientSecret = (await ask(cyan("  Client Secret: "))).trim();

  if (!clientId || !clientSecret) {
    console.log(dim("\n  Skipped — no credentials provided.\n"));
    rl.close();
    return;
  }

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=https://httpbin.org/get&scope=openid%20profile%20w_member_social`;

  console.log();
  console.log(bold("  Opening your browser to authorize..."));
  openUrl(authUrl);
  console.log();
  console.log(dim('  After you authorize, you\'ll see a JSON page.'));
  console.log(dim('  Find the "code" value in the "args" section and copy it.\n'));

  const code = (await ask(cyan("  Paste the code here: "))).trim();

  if (!code) {
    console.log(dim("\n  No code provided. Try again.\n"));
    rl.close();
    return;
  }

  console.log(dim("\n  Exchanging code for access token..."));

  try {
    const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: "https://httpbin.org/get",
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.log(`\n  \x1b[31mFailed: ${err}\x1b[0m\n`);
      rl.close();
      return;
    }

    const tokens = await tokenRes.json();

    console.log(dim("  Fetching your LinkedIn profile..."));

    const profileRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    let personUrn = "";
    if (profileRes.ok) {
      const profile = await profileRes.json();
      personUrn = `urn:li:person:${profile.sub}`;
      console.log(green(`\n  ✓ Connected as ${profile.name || profile.sub}`));
    } else {
      console.log(dim("\n  Got token but couldn't fetch profile."));
    }

    // Update config
    config.linkedin_client_id = clientId;
    config.linkedin_client_secret = clientSecret;
    config.linkedin_access_token = tokens.access_token;
    if (personUrn) config.linkedin_person_urn = personUrn;
    if (tokens.refresh_token) config.linkedin_refresh_token = tokens.refresh_token;

    // Add linkedin to platforms if not there
    if (!config.platforms) config.platforms = [];
    if (!config.platforms.includes("linkedin")) config.platforms.push("linkedin");

    writeFileSync(profilePath, stringify(config));
    console.log(green("  ✓ Saved to config/profile.yml\n"));
  } catch (e) {
    console.log(`\n  \x1b[31mError: ${e.message}\x1b[0m\n`);
  }

  rl.close();
}

main();
