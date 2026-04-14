#!/usr/bin/env node

// Interactive setup for /build-in-public skill
// Creates config/profile.yml from your answers

import { createInterface } from "node:readline";
import { readFileSync, writeFileSync, existsSync, copyFileSync } from "node:fs";
import { join } from "node:path";
import { exec } from "node:child_process";

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));
const ROOT = new URL("..", import.meta.url).pathname;

function openUrl(url) {
  const cmd = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  exec(`${cmd} "${url}"`);
}

function bold(s) { return `\x1b[1m${s}\x1b[0m`; }
function dim(s) { return `\x1b[2m${s}\x1b[0m`; }
function green(s) { return `\x1b[32m${s}\x1b[0m`; }
function cyan(s) { return `\x1b[36m${s}\x1b[0m`; }

const config = {
  name: "",
  handle: { x: "", linkedin: "", bluesky: "", threads: "" },
  platforms: [],
  voice: { tone: "direct, technical but human, no fluff", avoid: "AI buzzwords, corporate speak, cringe enthusiasm" },
  x_api_key: "", x_api_secret: "", x_access_token: "", x_access_secret: "",
  linkedin_access_token: "", linkedin_person_urn: "",
  bluesky_identifier: "", bluesky_app_password: "",
  threads_access_token: "", threads_user_id: "",
};

async function main() {
  console.log();
  console.log(bold("  /build-in-public setup"));
  console.log(dim("  Claude Code skill — turn your work into posts\n"));

  // Check if profile already exists
  const profilePath = join(ROOT, "config/profile.yml");
  if (existsSync(profilePath)) {
    const overwrite = await ask(cyan("  config/profile.yml exists. Overwrite? (y/n): "));
    if (overwrite.toLowerCase() !== "y") {
      console.log(dim("  Keeping existing config.\n"));
      rl.close();
      return;
    }
  }

  // ── Identity ────────────────────────────────────────────
  console.log(bold("\n  1. Who are you?\n"));
  config.name = (await ask(cyan("     Your name: "))).trim();

  // ── Platforms ───────────────────────────────────────────
  console.log(bold("\n  2. Which platforms do you post on?\n"));

  const wantX = (await ask(cyan("     X / Twitter? (y/n): "))).toLowerCase() === "y";
  if (wantX) {
    config.handle.x = (await ask(cyan("     X handle (e.g. @you): "))).trim();
    config.platforms.push("x");
  }

  const wantLi = (await ask(cyan("     LinkedIn? (y/n): "))).toLowerCase() === "y";
  if (wantLi) {
    config.handle.linkedin = (await ask(cyan("     LinkedIn profile URL (e.g. https://linkedin.com/in/you): "))).trim();
    config.platforms.push("linkedin");
  }

  const wantBsky = (await ask(cyan("     Bluesky? (y/n): "))).toLowerCase() === "y";
  if (wantBsky) {
    config.handle.bluesky = (await ask(cyan("     Bluesky handle (e.g. you.bsky.social): "))).trim();
    config.platforms.push("bluesky");
  }

  const wantThreads = (await ask(cyan("     Threads? (y/n): "))).toLowerCase() === "y";
  if (wantThreads) {
    config.handle.threads = (await ask(cyan("     Threads handle: "))).trim();
    config.platforms.push("threads");
  }

  // ── API Credentials ─────────────────────────────────────
  console.log(bold("\n  3. API credentials (for direct publishing)\n"));
  console.log(dim("     Leave blank to skip — you can always add these later.\n"));

  if (wantX) {
    console.log(dim("     X: Get keys at https://developer.x.com/en/portal/dashboard\n"));
    config.x_api_key = (await ask(cyan("     X API Key: "))).trim();
    if (config.x_api_key) {
      config.x_api_secret = (await ask(cyan("     X API Secret: "))).trim();
      config.x_access_token = (await ask(cyan("     X Access Token: "))).trim();
      config.x_access_secret = (await ask(cyan("     X Access Token Secret: "))).trim();
    }
    console.log();
  }

  if (wantLi) {
    console.log(dim("     LinkedIn setup:"));
    console.log(dim("     1. Go to https://linkedin.com/developers/apps → Create App"));
    console.log(dim("     2. Go to Products tab → request 'Share on LinkedIn'"));
    console.log(dim("     3. Go to Auth tab → add redirect URL: https://httpbin.org/get"));
    console.log(dim("     4. Copy your Client ID and Client Secret from the Auth tab\n"));

    const liClientId = (await ask(cyan("     Client ID: "))).trim();
    const liClientSecret = (await ask(cyan("     Client Secret: "))).trim();

    if (liClientId && liClientSecret) {
      config.linkedin_client_id = liClientId;
      config.linkedin_client_secret = liClientSecret;

      const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${liClientId}&redirect_uri=https://httpbin.org/get&scope=openid%20profile%20w_member_social`;

      console.log();
      console.log(bold("     Opening your browser to authorize..."));
      console.log(dim(`     ${authUrl}`));
      openUrl(authUrl);
      console.log();
      console.log(dim('     Authorize the app. You\'ll see a JSON page — copy the value after "code":'));
      console.log();

      const code = (await ask(cyan("     Paste the code here: "))).trim();

      if (code) {
        console.log(dim("     Exchanging code for access token..."));
        try {
          const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              grant_type: "authorization_code",
              code,
              redirect_uri: "https://httpbin.org/get",
              client_id: liClientId,
              client_secret: liClientSecret,
            }),
          });

          if (!tokenRes.ok) {
            const err = await tokenRes.text();
            console.log(`\x1b[33m     ⚠ Token exchange failed: ${err}\x1b[0m`);
          } else {
            const tokens = await tokenRes.json();
            config.linkedin_access_token = tokens.access_token;

            // Fetch person URN
            console.log(dim("     Fetching your LinkedIn profile..."));
            const profileRes = await fetch("https://api.linkedin.com/v2/userinfo", {
              headers: { Authorization: `Bearer ${tokens.access_token}` },
            });

            if (profileRes.ok) {
              const profile = await profileRes.json();
              config.linkedin_person_urn = `urn:li:person:${profile.sub}`;
              console.log(`\x1b[32m     ✓ Connected as ${profile.name || profile.sub}\x1b[0m`);
            } else {
              console.log(`\x1b[33m     ⚠ Got token but couldn't fetch profile. Set linkedin_person_urn manually.\x1b[0m`);
            }
          }
        } catch (e) {
          console.log(`\x1b[33m     ⚠ Error: ${e.message}\x1b[0m`);
        }
      }
    } else {
      config.linkedin_access_token = "";
      config.linkedin_person_urn = "";
    }
    console.log();
  }

  if (wantBsky) {
    console.log(dim("     Bluesky: Get app password at https://bsky.app/settings/app-passwords"));
    config.bluesky_identifier = config.handle.bluesky || (await ask(cyan("     Bluesky identifier: "))).trim();
    config.bluesky_app_password = (await ask(cyan("     Bluesky app password: "))).trim();
    console.log();
  }

  if (wantThreads) {
    console.log(dim("     Threads: Requires Meta developer app review"));
    config.threads_access_token = (await ask(cyan("     Threads Access Token: "))).trim();
    if (config.threads_access_token) {
      config.threads_user_id = (await ask(cyan("     Threads User ID: "))).trim();
    }
    console.log();
  }

  // ── Write config ────────────────────────────────────────
  const yml = `# build-in-public profile
# Generated by npm run setup

name: "${config.name}"
handle:
  x: "${config.handle.x}"
  linkedin: "${config.handle.linkedin}"
  bluesky: "${config.handle.bluesky}"
  threads: "${config.handle.threads}"

platforms:
${config.platforms.map(p => `  - ${p}`).join("\n")}

voice:
  tone: "${config.voice.tone}"
  avoid: "${config.voice.avoid}"

# API Credentials
x_api_key: "${config.x_api_key}"
x_api_secret: "${config.x_api_secret}"
x_access_token: "${config.x_access_token}"
x_access_secret: "${config.x_access_secret}"
linkedin_access_token: "${config.linkedin_access_token}"
linkedin_person_urn: "${config.linkedin_person_urn}"
bluesky_identifier: "${config.bluesky_identifier}"
bluesky_app_password: "${config.bluesky_app_password}"
threads_access_token: "${config.threads_access_token}"
threads_user_id: "${config.threads_user_id}"
`;

  writeFileSync(profilePath, yml);
  console.log(green("  ✓ config/profile.yml written\n"));

  // ── Summary ─────────────────────────────────────────────
  console.log(bold("  All set!\n"));

  const check = (v) => v ? green("  ✓") : dim("  ✗");
  console.log(`${check(wantX && config.x_api_key)} X / Twitter`);
  console.log(`${check(wantLi && config.linkedin_access_token)} LinkedIn`);
  console.log(`${check(wantBsky && config.bluesky_app_password)} Bluesky`);
  console.log(`${check(wantThreads && config.threads_access_token)} Threads`);

  console.log(`\n  Now open Claude Code and type ${cyan("/build-in-public")}\n`);

  rl.close();
}

main().catch((e) => {
  console.error(e);
  rl.close();
  process.exit(1);
});
