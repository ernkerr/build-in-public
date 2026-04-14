import { prisma } from "@/lib/db";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  if (!code || !state) {
    return Response.redirect(new URL("/settings?error=x_oauth_failed", request.url));
  }

  // Verify state
  const storedState = await prisma.settings.findUnique({ where: { key: "x_oauth_state" } });
  if (!storedState || storedState.value !== state) {
    return Response.redirect(new URL("/settings?error=x_oauth_state_mismatch", request.url));
  }

  // Get stored code verifier
  const storedVerifier = await prisma.settings.findUnique({ where: { key: "x_oauth_verifier" } });
  if (!storedVerifier) {
    return Response.redirect(new URL("/settings?error=x_oauth_no_verifier", request.url));
  }

  const clientId = process.env.X_CLIENT_ID!;
  const clientSecret = process.env.X_CLIENT_SECRET || "";
  const redirectUri = `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/auth/x/callback`;

  // Exchange code for tokens
  const tokenRes = await fetch("https://api.twitter.com/2/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      ...(clientSecret
        ? { Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}` }
        : {}),
    },
    body: new URLSearchParams({
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      code_verifier: storedVerifier.value,
      ...(clientSecret ? {} : { client_id: clientId }),
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    console.error("X token exchange failed:", err);
    return Response.redirect(new URL("/settings?error=x_token_failed", request.url));
  }

  const tokens = await tokenRes.json();

  // Store tokens in DB
  await prisma.settings.upsert({
    where: { key: "x_access_token" },
    update: { value: tokens.access_token },
    create: { key: "x_access_token", value: tokens.access_token },
  });

  if (tokens.refresh_token) {
    await prisma.settings.upsert({
      where: { key: "x_refresh_token" },
      update: { value: tokens.refresh_token },
      create: { key: "x_refresh_token", value: tokens.refresh_token },
    });
  }

  // Clean up temporary state
  await prisma.settings.deleteMany({
    where: { key: { in: ["x_oauth_verifier", "x_oauth_state"] } },
  });

  return Response.redirect(new URL("/settings?connected=x", request.url));
}
