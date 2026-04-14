import { prisma } from "@/lib/db";
import { generateDraft } from "@/agent";
import { randomUUID } from "node:crypto";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { platforms } = await request.json();

  if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
    return Response.json({ error: "platforms array is required" }, { status: 400 });
  }

  const source = await prisma.draft.findUnique({ where: { id } });
  if (!source) {
    return Response.json({ error: "Draft not found" }, { status: 404 });
  }

  // Filter out the source platform — no point adapting to the same one
  const targetPlatforms = platforms.filter((p: string) => p !== source.platform);
  if (targetPlatforms.length === 0) {
    return Response.json({ error: "Select at least one different platform" }, { status: 400 });
  }

  const batchId = randomUUID();
  const drafts = [];

  try {
    for (const platform of targetPlatforms) {
      const styleRefs = await prisma.styleReference.findMany({ where: { platform } });
      const styleExamples = styleRefs.map((r) => r.content);

      // Use the source draft content as raw material, with context about what it is
      const rawContent = `This is an existing ${source.platform} post that performed well. Adapt it for ${platform} while keeping the core message:\n\n${source.content}`;

      const content = await generateDraft({ platform, rawContent, styleExamples });

      const draft = await prisma.draft.create({
        data: {
          platform,
          content,
          batchId,
          ingestItemId: source.ingestItemId,
        },
      });

      drafts.push(draft);
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Adaptation failed";
    return Response.json({ error: message }, { status: 500 });
  }

  return Response.json(drafts, { status: 201 });
}
