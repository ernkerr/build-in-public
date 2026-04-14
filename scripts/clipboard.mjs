#!/usr/bin/env node

// Usage:
//   node scripts/clipboard.mjs --file <path>         (recommended)
//   node scripts/clipboard.mjs "post content"         (legacy)
//
// Copies content to the system clipboard (macOS/Linux/WSL)
// Returns JSON result like the other publish scripts

import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { resolve } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

const args = process.argv.slice(2);
let content;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--file" && args[i + 1]) {
    content = readFileSync(resolve(ROOT, args[++i]), "utf-8").replace(/\n$/, "");
  } else if (content === undefined) {
    content = args[i];
  }
}

if (!content) {
  console.error("Usage: node scripts/clipboard.mjs --file <path>");
  process.exit(1);
}

try {
  execSync("pbcopy", { input: content });
  console.log(JSON.stringify({ success: true, clipboard: true }));
} catch {
  try {
    execSync("xclip -selection clipboard", { input: content });
    console.log(JSON.stringify({ success: true, clipboard: true }));
  } catch {
    try {
      execSync("xsel --clipboard --input", { input: content });
      console.log(JSON.stringify({ success: true, clipboard: true }));
    } catch {
      console.log(JSON.stringify({ success: false, error: "No clipboard tool found (tried pbcopy, xclip, xsel)" }));
      process.exit(1);
    }
  }
}
