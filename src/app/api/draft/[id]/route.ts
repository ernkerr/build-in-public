import { prisma } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const data: Record<string, unknown> = {};
  if (body.content !== undefined) data.content = body.content;
  if (body.status !== undefined) data.status = body.status;
  if ("imageUrl" in body) data.imageUrl = body.imageUrl;

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
