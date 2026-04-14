import { TwitterApi } from "twitter-api-v2";
import { readFile } from "node:fs/promises";
import { prisma } from "@/lib/db";
import type { Publisher, PublishResult } from "./types";
import { resolveImagePath } from "./types";

async function getDbSetting(key: string): Promise<string | null> {
  const setting = await prisma.settings.findUnique({ where: { key } });
  return setting?.value || null;
}

export class XPublisher implements Publisher {
  platform = "x";

  isConfigured(): boolean {
    // Check env vars (OAuth 1.0a legacy) OR we assume OAuth 2.0 tokens may be in DB
    return !!(
      (process.env.X_API_KEY && process.env.X_ACCESS_TOKEN) ||
      process.env.X_CLIENT_ID
    );
  }

  async publish(content: string, imageUrl?: string | null): Promise<PublishResult> {
    try {
      const client = await this.getClient();
      if (!client) {
        return { success: false, error: "X not connected. Go to Settings to connect your account." };
      }

      // Upload image if provided
      let mediaId: string | undefined;
      if (imageUrl) {
        const imagePath = resolveImagePath(imageUrl);
        if (imagePath && process.env.X_API_KEY) {
          const oauth1Client = new TwitterApi({
            appKey: process.env.X_API_KEY!,
            appSecret: process.env.X_API_SECRET!,
            accessToken: process.env.X_ACCESS_TOKEN!,
            accessSecret: process.env.X_ACCESS_SECRET!,
          });
          const imageBuffer = await readFile(imagePath);
          mediaId = await oauth1Client.v1.uploadMedia(imageBuffer, {
            mimeType: imageUrl.endsWith(".png") ? "image/png" : imageUrl.endsWith(".gif") ? "image/gif" : "image/jpeg",
          });
        }
      }

      // Check if this is a thread (separated by ---)
      const parts = content.split(/\n---\n/).map((p) => p.trim()).filter(Boolean);

      if (parts.length === 1) {
        const tweetOptions: Record<string, unknown> = {};
        if (mediaId) tweetOptions.media = { media_ids: [mediaId] };
        const tweet = await client.v2.tweet(parts[0], tweetOptions);
        return { success: true, url: `https://x.com/i/status/${tweet.data.id}` };
      }

      // Thread
      let lastTweetId: string | undefined;
      let firstUrl: string | undefined;

      for (let i = 0; i < parts.length; i++) {
        const options: Record<string, unknown> = {};
        if (lastTweetId) options.reply = { in_reply_to_tweet_id: lastTweetId };
        if (i === 0 && mediaId) options.media = { media_ids: [mediaId] };

        const tweet = await client.v2.tweet(parts[i], options);
        lastTweetId = tweet.data.id;
        if (!firstUrl) firstUrl = `https://x.com/i/status/${tweet.data.id}`;
      }

      return { success: true, url: firstUrl };
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      return { success: false, error: `X API error: ${message}` };
    }
  }

  private async getClient(): Promise<TwitterApi | null> {
    // Try OAuth 1.0a first (env vars — legacy)
    if (process.env.X_API_KEY && process.env.X_ACCESS_TOKEN) {
      return new TwitterApi({
        appKey: process.env.X_API_KEY,
        appSecret: process.env.X_API_SECRET!,
        accessToken: process.env.X_ACCESS_TOKEN,
        accessSecret: process.env.X_ACCESS_SECRET!,
      });
    }

    // Try OAuth 2.0 tokens from DB (from browser-based connect)
    const accessToken = await getDbSetting("x_access_token");
    if (accessToken) {
      return new TwitterApi(accessToken);
    }

    return null;
  }
}
