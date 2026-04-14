import { prisma } from "@/lib/db";
import { expandIdea } from "@/agent/expand";

export async function POST(request: Request) {
  const { noteId, content } = await request.json();

  let text: string;
  let itemId: string | null = null;

  if (noteId) {
    const item = await prisma.ingestItem.findUnique({ where: { id: noteId } });
    if (!item) {
      return Response.json({ error: "Note not found" }, { status: 404 });
    }
    text = item.content;
    itemId = item.id;
  } else if (content) {
    text = content;
  } else {
    return Response.json({ error: "noteId or content is required" }, { status: 400 });
  }

  try {
    const expansion = await expandIdea(text);

    // Persist expansion on the note if we have an ID
    if (itemId) {
      await prisma.ingestItem.update({
        where: { id: itemId },
        data: { expansion },
      });
    }

    return Response.json({ expansion });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Expansion failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
