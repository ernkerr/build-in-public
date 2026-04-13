import { prisma } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const note = await prisma.ingestItem.update({
    where: { id },
    data: { used: body.used },
  });

  return Response.json(note);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.ingestItem.delete({ where: { id } });

  return Response.json({ ok: true });
}
