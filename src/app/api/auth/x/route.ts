import { prisma } from "@/lib/db";
import { randomBytes, createHash } from "node:crypto";

// Start X OAuth 2.0 PKCE flow
export async function GET() {
  const clientId = process.env.X_CLIENT_ID;
  if (!clientId) {
    return Response.json({ error: "X_CLIENT_ID not set in .env" }, { status: 400 });
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/auth/x/callback`;

  // Generate PKCE code verifier and challenge
  const codeVerifier = randomBytes(32).toString("base64url");
  const codeChallenge = createHash("sha256").update(codeVerifier).digest("base64url");
  const state = randomBytes(16).toString("hex");

  // Store verifier + state in DB so callback can retrieve them
  await prisma.settings.upsert({
    where: { key: "x_oauth_verifier" },
    update: { value: codeVerifier },
    create: { key: "x_oauth_verifier", value: codeVerifier },
  });
  await prisma.settings.upsert({
    where: { key: "x_oauth_state" },
    update: { value: state },
    create: { key: "x_oauth_state", value: state },
  });

  const scopes = ["tweet.read", "tweet.write", "users.read", "offline.access"];

  const authUrl = new URL("https://twitter.com/i/oauth2/authorize");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", scopes.join(" "));
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("code_challenge", codeChallenge);
  authUrl.searchParams.set("code_challenge_method", "S256");

  return Response.redirect(authUrl.toString());
}
