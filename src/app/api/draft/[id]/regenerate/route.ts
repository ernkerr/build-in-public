import { prisma } from "@/lib/db";
import { generateDraft } from "@/agent";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const draft = await prisma.draft.findUnique({
    where: { id },
    include: { ingestItem: true },
  });

  if (!draft) {
    return Response.json({ error: "Draft not found" }, { status: 404 });
  }

  // Gather source content — from the linked ingest item, or from unused items in the same batch
  let rawContent: string;

  if (draft.ingestItem) {
    const prefix = draft.ingestItem.source === "github" ? "[commit]" : "[note]";
    rawContent = `${prefix} ${draft.ingestItem.content}`;
  } else {
    // Find other drafts in the same batch to get the original source material
    // Fall back to using the current draft content as context
    const batchDrafts = await prisma.draft.findMany({
      where: { batchId: draft.batchId },
      include: { ingestItem: true },
    });

    const items = batchDrafts
      .filter((d) => d.ingestItem)
      .map((d) => {
        const prefix = d.ingestItem!.source === "github" ? "[commit]" : "[note]";
        return `${prefix} ${d.ingestItem!.content}`;
      });

    rawContent = items.length > 0 ? items.join("\n\n") : draft.content;
  }

  // Get style references for this platform
  const styleRefs = await prisma.styleReference.findMany({
    where: { platform: draft.platform },
  });
  const styleExamples = styleRefs.map((r) => r.content);

  const newContent = await generateDraft({
    platform: draft.platform,
    rawContent,
    styleExamples,
  });

  const updated = await prisma.draft.update({
    where: { id },
    data: { content: newContent, status: "pending" },
  });

  return Response.json(updated);
}
