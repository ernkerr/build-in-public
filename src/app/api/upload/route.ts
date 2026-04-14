import { writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/db";

const MIME_TO_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
};

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const draftId = formData.get("draftId") as string | null;

  if (!file) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  if (!draftId) {
    return Response.json({ error: "draftId is required" }, { status: 400 });
  }

  // Derive extension from MIME type (not filename) to prevent spoofing
  const ext = MIME_TO_EXT[file.type];
  if (!ext) {
    return Response.json({ error: "Only PNG, JPEG, GIF, and WebP images are allowed" }, { status: 400 });
  }

  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    return Response.json({ error: "Image must be under 5MB" }, { status: 400 });
  }

  const filename = `${randomUUID()}.${ext}`;
  const uploadsDir = path.resolve(process.cwd(), "public", "uploads");
  const uploadPath = path.join(uploadsDir, filename);

  // Ensure resolved path is within uploads directory
  if (!uploadPath.startsWith(uploadsDir)) {
    return Response.json({ error: "Invalid file path" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  await writeFile(uploadPath, Buffer.from(bytes));

  const imageUrl = `/uploads/${filename}`;

  await prisma.draft.update({
    where: { id: draftId },
    data: { imageUrl },
  });

  return Response.json({ imageUrl }, { status: 201 });
}
