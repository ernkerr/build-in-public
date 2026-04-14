import { prisma } from "@/lib/db";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  if (!code || !state) {
    return Response.redirect(new URL("/settings?error=linkedin_oauth_failed", request.url));
  }

  // Verify state
  const storedState = await prisma.settings.findUnique({ where: { key: "linkedin_oauth_state" } });
  if (!storedState || storedState.value !== state) {
    return Response.redirect(new URL("/settings?error=linkedin_state_mismatch", request.url));
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID!;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET!;
  const redirectUri = `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/auth/linkedin/callback`;

  // Exchange code for access token
  const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    console.error("LinkedIn token exchange failed:", err);
    return Response.redirect(new URL("/settings?error=linkedin_token_failed", request.url));
  }

  const tokens = await tokenRes.json();

  // Store access token
  await prisma.settings.upsert({
    where: { key: "linkedin_access_token" },
    update: { value: tokens.access_token },
    create: { key: "linkedin_access_token", value: tokens.access_token },
  });

  if (tokens.refresh_token) {
    await prisma.settings.upsert({
      where: { key: "linkedin_refresh_token" },
      update: { value: tokens.refresh_token },
      create: { key: "linkedin_refresh_token", value: tokens.refresh_token },
    });
  }

  // Get the user's Person URN
  const profileRes = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  if (profileRes.ok) {
    const profile = await profileRes.json();
    const personUrn = `urn:li:person:${profile.sub}`;
    await prisma.settings.upsert({
      where: { key: "linkedin_person_urn" },
      update: { value: personUrn },
      create: { key: "linkedin_person_urn", value: personUrn },
    });
  }

  // Clean up
  await prisma.settings.deleteMany({
    where: { key: "linkedin_oauth_state" },
  });

  return Response.redirect(new URL("/settings?connected=linkedin", request.url));
}
