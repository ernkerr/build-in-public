import { readFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/db";
import type { Publisher, PublishResult } from "./types";

async function getDbSetting(key: string): Promise<string | null> {
  const setting = await prisma.settings.findUnique({ where: { key } });
  return setting?.value || null;
}

export class LinkedInPublisher implements Publisher {
  platform = "linkedin";

  isConfigured(): boolean {
    return !!(
      process.env.LINKEDIN_ACCESS_TOKEN ||
      process.env.LINKEDIN_CLIENT_ID
    );
  }

  async publish(content: string, imageUrl?: string | null): Promise<PublishResult> {
    const accessToken =
      process.env.LINKEDIN_ACCESS_TOKEN ||
      (await getDbSetting("linkedin_access_token"));
    const personUrn =
      process.env.LINKEDIN_PERSON_URN ||
      (await getDbSetting("linkedin_person_urn"));

    if (!accessToken || !personUrn) {
      return { success: false, error: "LinkedIn not connected. Go to Settings to connect your account." };
    }

    try {
      let imageAsset: string | undefined;
      if (imageUrl) {
        imageAsset = await this.uploadImage(accessToken, personUrn, imageUrl);
      }

      const shareContent: Record<string, unknown> = imageAsset
        ? {
            shareCommentary: { text: content },
            shareMediaCategory: "IMAGE",
            media: [{ status: "READY", media: imageAsset }],
          }
        : {
            shareCommentary: { text: content },
            shareMediaCategory: "NONE",
          };

      const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
        },
        body: JSON.stringify({
          author: personUrn,
          lifecycleState: "PUBLISHED",
          specificContent: { "com.linkedin.ugc.ShareContent": shareContent },
          visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        return { success: false, error: `LinkedIn API error: ${err}` };
      }

      const data = await res.json();
      const postId = data.id;
      const activityId = postId?.replace("urn:li:share:", "") ?? "";
      return {
        success: true,
        url: activityId ? `https://www.linkedin.com/feed/update/urn:li:activity:${activityId}` : undefined,
      };
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      return { success: false, error: `LinkedIn error: ${message}` };
    }
  }

  private async uploadImage(accessToken: string, personUrn: string, imageUrl: string): Promise<string> {
    const registerRes = await fetch("https://api.linkedin.com/v2/assets?action=registerUpload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        registerUploadRequest: {
          recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
          owner: personUrn,
          serviceRelationships: [{ relationshipType: "OWNER", identifier: "urn:li:userGeneratedContent" }],
        },
      }),
    });

    if (!registerRes.ok) throw new Error("Failed to register LinkedIn image upload");

    const registerData = await registerRes.json();
    const uploadUrl = registerData.value.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"].uploadUrl;
    const asset = registerData.value.asset;

    const imagePath = path.join(process.cwd(), "public", imageUrl);
    const imageBuffer = await readFile(imagePath);

    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/octet-stream" },
      body: imageBuffer,
    });

    if (!uploadRes.ok) throw new Error("Failed to upload image to LinkedIn");
    return asset;
  }
}
