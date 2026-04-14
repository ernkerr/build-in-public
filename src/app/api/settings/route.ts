import { prisma } from "@/lib/db";

// Keys that are safe to expose to the client
const PUBLIC_KEYS = new Set([
  "github_repo",
  "onboarding_dismissed",
]);

// Keys that the client is allowed to write
const WRITABLE_KEYS = new Set([
  "github_repo",
  "onboarding_dismissed",
]);

export async function GET() {
  const settings = await prisma.settings.findMany({
    where: { key: { in: [...PUBLIC_KEYS] } },
  });
  const result: Record<string, string> = {};
  for (const s of settings) {
    result[s.key] = s.value;
  }
  return Response.json(result);
}

export async function PUT(request: Request) {
  const body = await request.json();

  for (const [key, value] of Object.entries(body)) {
    if (!WRITABLE_KEYS.has(key)) {
      return Response.json({ error: `Key '${key}' is not writable` }, { status: 400 });
    }
    await prisma.settings.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    });
  }

  return Response.json({ ok: true });
}
