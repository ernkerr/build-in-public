import { prisma } from "@/lib/db";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const used = request.nextUrl.searchParams.get("used");

  const where = used !== null ? { source: "notes" as const, used: used === "true" } : { source: "notes" as const };

  const notes = await prisma.ingestItem.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return Response.json(notes);
}

export async function POST(request: Request) {
  const { content } = await request.json();

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return Response.json({ error: "Content is required" }, { status: 400 });
  }

  const note = await prisma.ingestItem.create({
    data: {
      source: "notes",
      content: content.trim(),
    },
  });

  return Response.json(note, { status: 201 });
}
