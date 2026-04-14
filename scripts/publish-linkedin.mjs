#!/usr/bin/env node

// Usage: node scripts/publish-linkedin.mjs "post content" [image-path]
// Reads credentials from config/profile.yml

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

const { linkedin_access_token, linkedin_person_urn } = config;

if (!linkedin_access_token || !linkedin_person_urn) {
  console.error("Error: LinkedIn credentials not configured in config/profile.yml");
  process.exit(1);
}

const content = process.argv[2];
const imagePath = process.argv[3];

if (!content) {
  console.error("Usage: node scripts/publish-linkedin.mjs \"post content\" [image-path]");
  process.exit(1);
}

async function uploadImage() {
  if (!imagePath) return null;

  const fullPath = resolve(ROOT, imagePath);
  const buffer = readFileSync(fullPath);

  // Register upload
  const regRes = await fetch("https://api.linkedin.com/v2/assets?action=registerUpload", {
    method: "POST",
    headers: { Authorization: `Bearer ${linkedin_access_token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      registerUploadRequest: {
        recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
        owner: linkedin_person_urn,
        serviceRelationships: [{ relationshipType: "OWNER", identifier: "urn:li:userGeneratedContent" }],
      },
    }),
  });

  if (!regRes.ok) throw new Error("Failed to register LinkedIn image upload");
  const regData = await regRes.json();
  const uploadUrl = regData.value.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"].uploadUrl;
  const asset = regData.value.asset;

  // Upload binary
  const upRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { Authorization: `Bearer ${linkedin_access_token}`, "Content-Type": "application/octet-stream" },
    body: buffer,
  });

  if (!upRes.ok) throw new Error("Failed to upload image to LinkedIn");
  return asset;
}

async function main() {
  const imageAsset = await uploadImage();

  const shareContent = imageAsset
    ? { shareCommentary: { text: content }, shareMediaCategory: "IMAGE", media: [{ status: "READY", media: imageAsset }] }
    : { shareCommentary: { text: content }, shareMediaCategory: "NONE" };

  const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${linkedin_access_token}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      author: linkedin_person_urn,
      lifecycleState: "PUBLISHED",
      specificContent: { "com.linkedin.ugc.ShareContent": shareContent },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`LinkedIn API: ${err}`);
  }

  const data = await res.json();
  const activityId = data.id?.replace("urn:li:share:", "") ?? "";
  const url = activityId ? `https://www.linkedin.com/feed/update/urn:li:activity:${activityId}` : null;

  console.log(JSON.stringify({ success: true, url }));
}

main().catch(e => {
  console.log(JSON.stringify({ success: false, error: e.message }));
  process.exit(1);
});
