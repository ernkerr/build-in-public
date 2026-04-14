#!/usr/bin/env node

// Usage: node scripts/publish-bluesky.mjs "post content" [image-path]
// Reads credentials from config/profile.yml

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { BskyAgent, RichText } from "@atproto/api";
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

const { bluesky_identifier, bluesky_app_password } = config;

if (!bluesky_identifier || !bluesky_app_password) {
  console.error("Error: Bluesky credentials not configured in config/profile.yml");
  process.exit(1);
}

const content = process.argv[2];
const imagePath = process.argv[3];

if (!content) {
  console.error("Usage: node scripts/publish-bluesky.mjs \"post content\" [image-path]");
  process.exit(1);
}

async function main() {
  const agent = new BskyAgent({ service: "https://bsky.social" });
  await agent.login({ identifier: bluesky_identifier, password: bluesky_app_password });

  const rt = new RichText({ text: content });
  await rt.detectFacets(agent);

  const post = {
    text: rt.text,
    facets: rt.facets,
    createdAt: new Date().toISOString(),
  };

  if (imagePath) {
    const fullPath = resolve(ROOT, imagePath);
    const buffer = readFileSync(fullPath);
    const mimeType = imagePath.endsWith(".png") ? "image/png" : imagePath.endsWith(".gif") ? "image/gif" : "image/jpeg";
    const upload = await agent.uploadBlob(buffer, { encoding: mimeType });

    post.embed = {
      $type: "app.bsky.embed.images",
      images: [{ alt: "", image: upload.data.blob }],
    };
  }

  const res = await agent.post(post);

  const parts = res.uri.split("/");
  const rkey = parts[parts.length - 1];
  const url = `https://bsky.app/profile/${bluesky_identifier}/post/${rkey}`;

  console.log(JSON.stringify({ success: true, url }));
}

main().catch(e => {
  console.log(JSON.stringify({ success: false, error: e.message }));
  process.exit(1);
});
