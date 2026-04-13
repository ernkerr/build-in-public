import { TwitterApi } from "twitter-api-v2";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Publisher, PublishResult } from "./types";

export class XPublisher implements Publisher {
  platform = "x";

  isConfigured(): boolean {
    return !!(
      process.env.X_API_KEY &&
      process.env.X_API_SECRET &&
      process.env.X_ACCESS_TOKEN &&
      process.env.X_ACCESS_SECRET
    );
  }

  async publish(content: string, imageUrl?: string | null): Promise<PublishResult> {
    if (!this.isConfigured()) {
      return { success: false, error: "X API credentials not configured" };
    }

    const client = new TwitterApi({
      appKey: process.env.X_API_KEY!,
      appSecret: process.env.X_API_SECRET!,
      accessToken: process.env.X_ACCESS_TOKEN!,
      accessSecret: process.env.X_ACCESS_SECRET!,
    });

    try {
      // Upload image if provided
      let mediaId: string | undefined;
      if (imageUrl) {
        const imagePath = path.join(process.cwd(), "public", imageUrl);
        const imageBuffer = await readFile(imagePath);
        mediaId = await client.v1.uploadMedia(imageBuffer, {
          mimeType: imageUrl.endsWith(".png") ? "image/png" : imageUrl.endsWith(".gif") ? "image/gif" : "image/jpeg",
        });
      }

      // Check if this is a thread (separated by ---)
      const parts = content.split(/\n---\n/).map((p) => p.trim()).filter(Boolean);

      if (parts.length === 1) {
        const tweetOptions: Record<string, unknown> = {};
        if (mediaId) {
          tweetOptions.media = { media_ids: [mediaId] };
        }
        const tweet = await client.v2.tweet(parts[0], tweetOptions);
        return {
          success: true,
          url: `https://x.com/i/status/${tweet.data.id}`,
        };
      }

      // Thread: attach image to first tweet only
      let lastTweetId: string | undefined;
      let firstUrl: string | undefined;

      for (let i = 0; i < parts.length; i++) {
        const options: Record<string, unknown> = {};
        if (lastTweetId) {
          options.reply = { in_reply_to_tweet_id: lastTweetId };
        }
        if (i === 0 && mediaId) {
          options.media = { media_ids: [mediaId] };
        }

        const tweet = await client.v2.tweet(parts[i], options);
        lastTweetId = tweet.data.id;

        if (!firstUrl) {
          firstUrl = `https://x.com/i/status/${tweet.data.id}`;
        }
      }

      return { success: true, url: firstUrl };
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      return { success: false, error: `X API error: ${message}` };
    }
  }
}
