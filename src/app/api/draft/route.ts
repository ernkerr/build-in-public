import { prisma } from "@/lib/db";
import { generateDraft } from "@/agent";
import { type NextRequest } from "next/server";
import { randomUUID } from "node:crypto";

export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get("status");
  const batchId = request.nextUrl.searchParams.get("batchId");

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (batchId) where.batchId = batchId;

  const drafts = await prisma.draft.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { ingestItem: true },
  });

  return Response.json(drafts);
}

export async function POST(request: Request) {
  const body = await request.json();
  const platforms: string[] = body.platforms ?? [body.platform ?? "x"];
  const ingestItemIds: string[] | undefined = body.ingestItemIds;
  const rawOverride: string | undefined = body.rawOverride;

  let rawContent: string;
  let items: { id: string; source: string; content: string }[] = [];

  if (rawOverride) {
    // Direct content override (e.g. from expanded ideas)
    rawContent = rawOverride;
  } else {
    // Fetch ingest items — either specific IDs or all unused
    items = ingestItemIds
      ? await prisma.ingestItem.findMany({ where: { id: { in: ingestItemIds } } })
      : await prisma.ingestItem.findMany({ where: { used: false }, orderBy: { createdAt: "desc" }, take: 10 });

    if (items.length === 0) {
      return Response.json({ error: "No content to draft from. Add some notes first." }, { status: 400 });
    }

    rawContent = items
      .map((item) => {
        const prefix = item.source === "github" ? "[commit]" : "[note]";
        return `${prefix} ${item.content}`;
      })
      .join("\n\n");
  }

  const batchId = randomUUID();
  const drafts = [];

  try {
    for (const platform of platforms) {
      const styleRefs = await prisma.styleReference.findMany({ where: { platform } });
      const styleExamples = styleRefs.map((r) => r.content);

      const content = await generateDraft({ platform, rawContent, styleExamples });

      const draft = await prisma.draft.create({
        data: {
          platform,
          content,
          batchId,
          ingestItemId: items.length === 1 ? items[0].id : null,
        },
      });

      drafts.push(draft);
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Draft generation failed";
    return Response.json({ error: message }, { status: 500 });
  }

  // Mark items as used (skip if using rawOverride)
  if (items.length > 0) {
    await prisma.ingestItem.updateMany({
      where: { id: { in: items.map((i) => i.id) } },
      data: { used: true },
    });
  }

  return Response.json(drafts.length === 1 ? drafts[0] : drafts, { status: 201 });
}
