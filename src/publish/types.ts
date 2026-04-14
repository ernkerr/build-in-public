import path from "node:path";

export interface PublishResult {
  success: boolean;
  url?: string;
  error?: string;
}

/** Resolve an imageUrl to a safe absolute path within public/uploads/ */
export function resolveImagePath(imageUrl: string): string | null {
  const uploadsDir = path.resolve(process.cwd(), "public", "uploads");
  const resolved = path.resolve(process.cwd(), "public", imageUrl);
  if (!resolved.startsWith(uploadsDir)) return null;
  return resolved;
}

export interface Publisher {
  platform: string;
  publish(content: string, imageUrl?: string | null): Promise<PublishResult>;
  isConfigured(): boolean;
}
