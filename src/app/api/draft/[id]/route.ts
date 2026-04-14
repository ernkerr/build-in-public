import { prisma } from "@/lib/db";

const VALID_STATUSES = new Set(["pending", "approved", "rejected", "scheduled", "published"]);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const data: Record<string, unknown> = {};

  if (body.content !== undefined) data.content = body.content;

  if (body.status !== undefined) {
    if (!VALID_STATUSES.has(body.status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }
    data.status = body.status;
  }

  if ("imageUrl" in body) {
    if (body.imageUrl !== null && typeof body.imageUrl === "string") {
      if (!body.imageUrl.startsWith("/uploads/")) {
        return Response.json({ error: "Invalid image URL" }, { status: 400 });
      }
    }
    data.imageUrl = body.imageUrl;
  }

  const draft = await prisma.draft.update({
    where: { id },
    data,
  });

  return Response.json(draft);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.draft.delete({ where: { id } });
  return Response.json({ ok: true });
}
