import { prisma } from "@/lib/db";
import { getPublisher } from "@/publish";

// GET: check and publish any scheduled drafts that are due
export async function GET() {
  const now = new Date();

  const dueDrafts = await prisma.draft.findMany({
    where: {
      status: "scheduled",
      scheduledAt: { lte: now },
    },
  });

  if (dueDrafts.length === 0) {
    return Response.json({ published: 0 });
  }

  const results = [];

  for (const draft of dueDrafts) {
    const publisher = getPublisher(draft.platform);

    if (!publisher || !publisher.isConfigured()) {
      // Can't publish — mark back as approved so user can handle manually
      await prisma.draft.update({
        where: { id: draft.id },
        data: { status: "approved", scheduledAt: null },
      });
      results.push({ id: draft.id, platform: draft.platform, success: false, error: "Publisher not configured" });
      continue;
    }

    const result = await publisher.publish(draft.content, draft.imageUrl);

    if (result.success) {
      await prisma.draft.update({
        where: { id: draft.id },
        data: {
          status: "published",
          publishedUrl: result.url ?? null,
        },
      });
      results.push({ id: draft.id, platform: draft.platform, success: true, url: result.url });
    } else {
      // Failed — keep as scheduled so it retries next check
      results.push({ id: draft.id, platform: draft.platform, success: false, error: result.error });
    }
  }

  return Response.json({
    published: results.filter((r) => r.success).length,
    failed: results.filter((r) => !r.success).length,
    results,
  });
}
