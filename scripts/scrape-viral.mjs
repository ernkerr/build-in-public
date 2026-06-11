#!/usr/bin/env node

// Usage: node scripts/scrape-viral.mjs [platform]
// Fetches recent popular #buildinpublic posts
// Reads X API credentials from config/profile.yml

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { TwitterApi } from "twitter-api-v2";
import { parse } from "yaml";

const ROOT = new URL("..", import.meta.url).pathname;
const platform = process.argv[2] || "x";

let config;
try {
  config = parse(readFileSync(resolve(ROOT, "config/profile.yml"), "utf-8"));
} catch {
  console.error("Error: config/profile.yml not found.");
  process.exit(1);
}

async function scrapeX() {
  const { x_api_key, x_api_secret, x_access_token, x_access_secret } = config;

  if (!x_api_key) {
    console.error("Error: X API credentials needed for scraping. Set them in config/profile.yml");
    process.exit(1);
  }

  const client = new TwitterApi({
    appKey: x_api_key,
    appSecret: x_api_secret,
    accessToken: x_access_token,
    accessSecret: x_access_secret,
  });

  // Search for popular #buildinpublic tweets from the last 7 days
  const result = await client.v2.search("#buildinpublic", {
    "tweet.fields": ["public_metrics", "author_id", "created_at"],
    "user.fields": ["username"],
    expansions: ["author_id"],
    max_results: 50,
    sort_order: "relevancy",
  });

  if (!result.data?.data) {
    console.log(JSON.stringify({ posts: [], message: "No results found" }));
    return;
  }

  const users = {};
  if (result.includes?.users) {
    for (const user of result.includes.users) {
      users[user.id] = user.username;
    }
  }

  // Sort by engagement (likes + retweets)
  const posts = result.data.data
    .map((tweet) => ({
      text: tweet.text,
      author: users[tweet.author_id] || "unknown",
      likes: tweet.public_metrics?.like_count || 0,
      retweets: tweet.public_metrics?.retweet_count || 0,
      replies: tweet.public_metrics?.reply_count || 0,
      date: tweet.created_at,
      engagement: (tweet.public_metrics?.like_count || 0) + (tweet.public_metrics?.retweet_count || 0) * 2,
    }))
    .sort((a, b) => b.engagement - a.engagement)
    .slice(0, 10);

  console.log(JSON.stringify({ posts, platform: "x" }));
}

async function scrapeBluesky() {
  // Bluesky doesn't require auth for public search
  const res = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts?q=%23buildinpublic&limit=25&sort=top`
  );

  if (!res.ok) {
    console.log(JSON.stringify({ posts: [], message: "Bluesky search failed" }));
    return;
  }

  const data = await res.json();
  const posts = (data.posts || [])
    .map((post) => ({
      text: post.record?.text || "",
      author: post.author?.handle || "unknown",
      likes: post.likeCount || 0,
      retweets: post.repostCount || 0,
      replies: post.replyCount || 0,
      date: post.record?.createdAt,
      engagement: (post.likeCount || 0) + (post.repostCount || 0) * 2,
    }))
    .sort((a, b) => b.engagement - a.engagement)
    .slice(0, 10);

  console.log(JSON.stringify({ posts, platform: "bluesky" }));
}

async function main() {
  switch (platform) {
    case "x":
      await scrapeX();
      break;
    case "bluesky":
      await scrapeBluesky();
      break;
    default:
      console.log(JSON.stringify({
        posts: [],
        message: `Scraping not supported for ${platform} yet. Paste posts manually instead.`,
      }));
  }
}

main().catch((e) => {
  console.log(JSON.stringify({ posts: [], error: e.message }));
  process.exit(1);
});
