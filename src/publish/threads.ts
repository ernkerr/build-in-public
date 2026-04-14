import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Publisher, PublishResult } from "./types";

export class ThreadsPublisher implements Publisher {
  platform = "threads";

  isConfigured(): boolean {
    return !!(
      process.env.THREADS_ACCESS_TOKEN &&
      process.env.THREADS_USER_ID
    );
  }

  async publish(content: string, imageUrl?: string | null): Promise<PublishResult> {
    if (!this.isConfigured()) {
      return { success: false, error: "Threads credentials not configured" };
    }

    const accessToken = process.env.THREADS_ACCESS_TOKEN!;
    const userId = process.env.THREADS_USER_ID!;

    try {
      let mediaContainerId: string;

      if (imageUrl) {
        // For image posts, we need a publicly accessible URL
        // Since our images are local, we need to use the image_url approach
        // with a publicly hosted image. For now, we'll create a text post
        // and note this limitation.
        //
        // In production, you'd upload to a CDN first or use a public URL.
        // For local dev, fall back to text-only.
        const imageHostUrl = process.env.PUBLIC_URL
          ? `${process.env.PUBLIC_URL}${imageUrl}`
          : null;

        if (imageHostUrl) {
          // Step 1: Create media container with image
          const createRes = await fetch(
            `https://graph.threads.net/v1.0/${userId}/threads`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                media_type: "IMAGE",
                image_url: imageHostUrl,
                text: content,
                access_token: accessToken,
              }),
            }
          );

          if (!createRes.ok) {
            const err = await createRes.text();
            return { success: false, error: `Threads API error: ${err}` };
          }

          const createData = await createRes.json();
          mediaContainerId = createData.id;
        } else {
          // Fall back to text-only if no public URL available
          const createRes = await fetch(
            `https://graph.threads.net/v1.0/${userId}/threads`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                media_type: "TEXT",
                text: content,
                access_token: accessToken,
              }),
            }
          );

          if (!createRes.ok) {
            const err = await createRes.text();
            return { success: false, error: `Threads API error: ${err}` };
          }

          const createData = await createRes.json();
          mediaContainerId = createData.id;
        }
      } else {
        // Step 1: Create text media container
        const createRes = await fetch(
          `https://graph.threads.net/v1.0/${userId}/threads`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              media_type: "TEXT",
              text: content,
              access_token: accessToken,
            }),
          }
        );

        if (!createRes.ok) {
          const err = await createRes.text();
          return { success: false, error: `Threads API error: ${err}` };
        }

        const createData = await createRes.json();
        mediaContainerId = createData.id;
      }

      // Step 2: Publish the media container
      const publishRes = await fetch(
        `https://graph.threads.net/v1.0/${userId}/threads_publish`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            creation_id: mediaContainerId,
            access_token: accessToken,
          }),
        }
      );

      if (!publishRes.ok) {
        const err = await publishRes.text();
        return { success: false, error: `Threads publish error: ${err}` };
      }

      const publishData = await publishRes.json();
      const postId = publishData.id;

      return {
        success: true,
        url: `https://www.threads.net/post/${postId}`,
      };
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      return { success: false, error: `Threads error: ${message}` };
    }
  }
}
