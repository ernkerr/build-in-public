#!/usr/bin/env node

// Usage: node scripts/publish-x.mjs "post content" [image-path]
// Reads credentials from config/profile.yml

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { TwitterApi } from "twitter-api-v2";
import { parse } from "yaml";

const ROOT = new URL("..", import.meta.url).pathname;
const configPath = resolve(ROOT, "config/profile.yml");

let config;
try {
  config = parse(readFileSync(configPath, "utf-8"));
} catch {
  console.error("Error: config/profile.yml not found. Copy config/profile.example.yml and fill in your credentials.");
  process.exit(1);
}

const { x_api_key, x_api_secret, x_access_token, x_access_secret } = config;

if (!x_api_key || !x_access_token) {
  console.error("Error: X API credentials not configured in config/profile.yml");
  process.exit(1);
}

const content = process.argv[2];
const imagePath = process.argv[3];

if (!content) {
  console.error("Usage: node scripts/publish-x.mjs \"post content\" [image-path]");
  process.exit(1);
}

const client = new TwitterApi({
  appKey: x_api_key,
  appSecret: x_api_secret,
  accessToken: x_access_token,
  accessSecret: x_access_secret,
});

async function main() {
  let mediaId;

  if (imagePath) {
    const fullPath = resolve(ROOT, imagePath);
    const buffer = readFileSync(fullPath);
    const mimeType = imagePath.endsWith(".png") ? "image/png" : imagePath.endsWith(".gif") ? "image/gif" : "image/jpeg";
    mediaId = await client.v1.uploadMedia(buffer, { mimeType });
  }

  // Check for threads (separated by ---)
  const parts = content.split(/\n---\n/).map(p => p.trim()).filter(Boolean);

  if (parts.length === 1) {
    const options = mediaId ? { media: { media_ids: [mediaId] } } : {};
    const tweet = await client.v2.tweet(parts[0], options);
    const url = `https://x.com/i/status/${tweet.data.id}`;
    console.log(JSON.stringify({ success: true, url }));
    return;
  }

  // Thread
  let lastId;
  let firstUrl;

  for (let i = 0; i < parts.length; i++) {
    const options = {};
    if (lastId) options.reply = { in_reply_to_tweet_id: lastId };
    if (i === 0 && mediaId) options.media = { media_ids: [mediaId] };

    const tweet = await client.v2.tweet(parts[i], options);
    lastId = tweet.data.id;
    if (!firstUrl) firstUrl = `https://x.com/i/status/${tweet.data.id}`;
  }

  console.log(JSON.stringify({ success: true, url: firstUrl }));
}

main().catch(e => {
  console.log(JSON.stringify({ success: false, error: e.message }));
  process.exit(1);
});
