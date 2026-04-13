import { prisma } from "@/lib/db";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const platform = request.nextUrl.searchParams.get("platform");
  const where = platform ? { platform } : {};

  const refs = await prisma.styleReference.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return Response.json(refs);
}

export async function POST(request: Request) {
  const { platform, content, source = "manual", handle } = await request.json();

  if (!platform || !content) {
    return Response.json({ error: "platform and content are required" }, { status: 400 });
  }

  const ref = await prisma.styleReference.create({
    data: { platform, content, source, handle },
  });

  return Response.json(ref, { status: 201 });
}
