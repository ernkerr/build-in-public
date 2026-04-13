import { prisma } from "@/lib/db";

export async function GET() {
  const settings = await prisma.settings.findMany();
  const result: Record<string, string> = {};
  for (const s of settings) {
    result[s.key] = s.value;
  }
  return Response.json(result);
}

export async function PUT(request: Request) {
  const body = await request.json();

  for (const [key, value] of Object.entries(body)) {
    await prisma.settings.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    });
  }

  return Response.json({ ok: true });
}
