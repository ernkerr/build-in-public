import { prisma } from "@/lib/db";

export async function GET() {
  const xToken = await prisma.settings.findUnique({ where: { key: "x_access_token" } });
  const liToken = await prisma.settings.findUnique({ where: { key: "linkedin_access_token" } });

  return Response.json({
    x: {
      connected: !!(process.env.X_ACCESS_TOKEN || xToken?.value),
      method: process.env.X_ACCESS_TOKEN ? "env" : xToken?.value ? "oauth" : null,
      canConnect: !!process.env.X_CLIENT_ID,
    },
    linkedin: {
      connected: !!(process.env.LINKEDIN_ACCESS_TOKEN || liToken?.value),
      method: process.env.LINKEDIN_ACCESS_TOKEN ? "env" : liToken?.value ? "oauth" : null,
      canConnect: !!process.env.LINKEDIN_CLIENT_ID,
    },
    bluesky: {
      connected: !!(process.env.BLUESKY_IDENTIFIER && process.env.BLUESKY_APP_PASSWORD),
      method: process.env.BLUESKY_IDENTIFIER ? "env" : null,
      canConnect: false, // No OAuth — uses app password in .env
    },
    threads: {
      connected: !!(process.env.THREADS_ACCESS_TOKEN),
      method: process.env.THREADS_ACCESS_TOKEN ? "env" : null,
      canConnect: false, // Requires Meta app review
    },
  });
}
