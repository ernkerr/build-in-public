#!/usr/bin/env node

// Usage:
//   node scripts/publish-facebook.mjs --file <path> [--image <path>]   (recommended)
//   node scripts/publish-facebook.mjs "post content" [image-path]      (legacy, unsafe for multi-line)
//
// Prefer --file for multi-line posts. Passing long or multi-line content as a
// quoted bash argument can expose the command to shell-quoting pitfalls and
// makes command-string validation brittle (e.g. a newline + "#" inside quotes
// can hide trailing arguments from hooks that parse the raw command).
//
// Publishes to the Facebook Page identified by facebook_page_id, using the
// long-lived facebook_page_access_token from config/profile.yml.
//
// Page setup: in your Meta app, request pages_manage_posts (+ pages_show_list
// to enumerate pages). Exchange a short-lived user token for a long-lived one,
// then GET /me/accounts to retrieve the Page access token (Page tokens issued
// from a long-lived user token do not expire).

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";

const ROOT = new URL("..", import.meta.url).pathname;
const configPath = resolve(ROOT, "config/profile.yml");

let config;
try {
  config = parse(readFileSync(configPath, "utf-8"));
} catch {
  console.error("Error: config/profile.yml not found.");
  process.exit(1);
}

const { facebook_page_id, facebook_page_access_token } = config;

if (!facebook_page_id || !facebook_page_access_token) {
  console.error("Error: Facebook credentials not configured in config/profile.yml");
  console.error("Need: facebook_page_id, facebook_page_access_token");
  process.exit(1);
}

const args = process.argv.slice(2);
let content, imagePath;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--file" && args[i + 1]) {
    content = readFileSync(resolve(ROOT, args[++i]), "utf-8").replace(/\n$/, "");
  } else if (args[i] === "--image" && args[i + 1]) {
    imagePath = args[++i];
  } else if (content === undefined) {
    content = args[i];
  } else if (imagePath === undefined) {
    imagePath = args[i];
  }
}

if (!content) {
  console.error("Usage: node scripts/publish-facebook.mjs --file <path> [--image <path>]");
  process.exit(1);
}

const GRAPH = "https://graph.facebook.com/v22.0";

async function postWithImage() {
  const fullPath = resolve(ROOT, imagePath);
  const buffer = readFileSync(fullPath);
  const form = new FormData();
  form.append("message", content);
  form.append("access_token", facebook_page_access_token);
  form.append("source", new Blob([buffer]), imagePath.split("/").pop());

  const res = await fetch(`${GRAPH}/${facebook_page_id}/photos`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Facebook API (photo): ${err}`);
  }
  const data = await res.json();
  // photos endpoint returns { id, post_id } — post_id is the page-scoped post
  return data.post_id || data.id;
}

async function postTextOnly() {
  const res = await fetch(`${GRAPH}/${facebook_page_id}/feed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: content,
      access_token: facebook_page_access_token,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Facebook API: ${err}`);
  }
  const data = await res.json();
  return data.id;
}

async function main() {
  const postId = imagePath ? await postWithImage() : await postTextOnly();
  // post_id format is "{page-id}_{post-id}"; the second half is the post slug
  const slug = postId.includes("_") ? postId.split("_")[1] : postId;
  const url = `https://www.facebook.com/${facebook_page_id}/posts/${slug}`;

  console.log(JSON.stringify({ success: true, url }));
}

main().catch(e => {
  console.log(JSON.stringify({ success: false, error: e.message }));
  process.exit(1);
});
