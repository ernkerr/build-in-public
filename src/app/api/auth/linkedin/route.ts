import { prisma } from "@/lib/db";
import { randomBytes } from "node:crypto";

export async function GET() {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  if (!clientId) {
    return Response.json({ error: "LINKEDIN_CLIENT_ID not set in .env" }, { status: 400 });
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/auth/linkedin/callback`;
  const state = randomBytes(16).toString("hex");

  await prisma.settings.upsert({
    where: { key: "linkedin_oauth_state" },
    update: { value: state },
    create: { key: "linkedin_oauth_state", value: state },
  });

  const scopes = ["openid", "profile", "w_member_social"];

  const authUrl = new URL("https://www.linkedin.com/oauth/v2/authorization");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", scopes.join(" "));
  authUrl.searchParams.set("state", state);

  return Response.redirect(authUrl.toString());
}
