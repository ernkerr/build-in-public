import { BskyAgent, RichText } from "@atproto/api";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Publisher, PublishResult } from "./types";

export class BlueskyPublisher implements Publisher {
  platform = "bluesky";

  isConfigured(): boolean {
    return !!(
      process.env.BLUESKY_IDENTIFIER &&
      process.env.BLUESKY_APP_PASSWORD
    );
  }

  async publish(content: string, imageUrl?: string | null): Promise<PublishResult> {
    if (!this.isConfigured()) {
      return { success: false, error: "Bluesky credentials not configured" };
    }

    try {
      const agent = new BskyAgent({ service: "https://bsky.social" });
      await agent.login({
        identifier: process.env.BLUESKY_IDENTIFIER!,
        password: process.env.BLUESKY_APP_PASSWORD!,
      });

      // Parse rich text (detects links, mentions, hashtags)
      const rt = new RichText({ text: content });
      await rt.detectFacets(agent);

      const postRecord: Record<string, unknown> = {
        text: rt.text,
        facets: rt.facets,
        createdAt: new Date().toISOString(),
      };

      // Upload image if provided
      if (imageUrl) {
        const imagePath = path.join(process.cwd(), "public", imageUrl);
        const imageBuffer = await readFile(imagePath);
        const mimeType = imageUrl.endsWith(".png")
          ? "image/png"
          : imageUrl.endsWith(".gif")
            ? "image/gif"
            : "image/jpeg";

        const uploadRes = await agent.uploadBlob(imageBuffer, { encoding: mimeType });

        postRecord.embed = {
          $type: "app.bsky.embed.images",
          images: [
            {
              alt: "",
              image: uploadRes.data.blob,
            },
          ],
        };
      }

      const res = await agent.post(postRecord);

      // Build the post URL from the URI
      const uri = res.uri; // at://did:plc:xxx/app.bsky.feed.post/yyy
      const parts = uri.split("/");
      const rkey = parts[parts.length - 1];
      const handle = process.env.BLUESKY_IDENTIFIER!;
      const postUrl = `https://bsky.app/profile/${handle}/post/${rkey}`;

      return { success: true, url: postUrl };
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      return { success: false, error: `Bluesky error: ${message}` };
    }
  }
}
