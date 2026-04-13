#!/usr/bin/env node

// Standalone cron that checks for scheduled posts every 60 seconds.
// Run alongside `npm run dev` to get always-on scheduling.
//
// Usage: node scripts/cron.mjs
// Or:    npm run cron

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const INTERVAL = 60_000; // 1 minute

async function check() {
  try {
    const res = await fetch(`${BASE_URL}/api/publish/scheduled`);
    const data = await res.json();
    const now = new Date().toLocaleTimeString();
    if (data.published > 0) {
      console.log(`[${now}] Published ${data.published} scheduled post(s)`);
      if (data.results) {
        for (const r of data.results) {
          console.log(`  - ${r.platform}: ${r.success ? r.url : r.error}`);
        }
      }
    } else {
      console.log(`[${now}] No scheduled posts due`);
    }
  } catch (e) {
    console.error(`[${new Date().toLocaleTimeString()}] Error:`, e.message);
  }
}

console.log(`Scheduler started — checking ${BASE_URL} every 60s`);
console.log("Press Ctrl+C to stop\n");

check();
setInterval(check, INTERVAL);
