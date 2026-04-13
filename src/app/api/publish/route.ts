import { prisma } from "@/lib/db";
import { getPublisher, getConfiguredPlatforms } from "@/publish";

export async function GET() {
  return Response.json({ platforms: getConfiguredPlatforms() });
}

export async function POST(request: Request) {
  const { draftId, scheduledAt } = await request.json();

  if (!draftId) {
    return Response.json({ error: "draftId is required" }, { status: 400 });
  }

  const draft = await prisma.draft.findUnique({ where: { id: draftId } });
  if (!draft) {
    return Response.json({ error: "Draft not found" }, { status: 404 });
  }

  if (draft.status !== "approved" && draft.status !== "scheduled") {
    return Response.json({ error: "Draft must be approved before publishing" }, { status: 400 });
  }

  // Schedule for later
  if (scheduledAt) {
    const scheduleDate = new Date(scheduledAt);
    if (scheduleDate <= new Date()) {
      return Response.json({ error: "Scheduled time must be in the future" }, { status: 400 });
    }

    await prisma.draft.update({
      where: { id: draftId },
      data: { status: "scheduled", scheduledAt: scheduleDate },
    });

    return Response.json({ scheduled: true, scheduledAt: scheduleDate });
  }

  // Publish now
  const publisher = getPublisher(draft.platform);
  if (!publisher) {
    return Response.json({ error: `No publisher configured for ${draft.platform}` }, { status: 400 });
  }

  if (!publisher.isConfigured()) {
    return Response.json({
      error: `${draft.platform} API credentials not configured. Check your .env file.`,
    }, { status: 400 });
  }

  const result = await publisher.publish(draft.content, draft.imageUrl);

  if (result.success) {
    await prisma.draft.update({
      where: { id: draftId },
      data: { status: "published", publishedUrl: result.url ?? null },
    });
  }

  return Response.json(result, { status: result.success ? 200 : 500 });
}
