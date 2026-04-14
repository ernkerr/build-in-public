import { prisma } from "@/lib/db";
import { getConfiguredPlatforms } from "@/publish";

export async function GET() {
  const [noteCount, draftCount, dismissed] = await Promise.all([
    prisma.ingestItem.count(),
    prisma.draft.count(),
    prisma.settings.findUnique({ where: { key: "onboarding_dismissed" } }),
  ]);

  return Response.json({
    hasApiKey: !!process.env.ANTHROPIC_API_KEY,
    hasGithub: !!process.env.GITHUB_PAT,
    hasNotes: noteCount > 0,
    hasDrafts: draftCount > 0,
    hasPublishers: getConfiguredPlatforms().length > 0,
    onboardingDismissed: dismissed?.value === "true",
  });
}

// Dismiss onboarding
export async function POST() {
  await prisma.settings.upsert({
    where: { key: "onboarding_dismissed" },
    update: { value: "true" },
    create: { key: "onboarding_dismissed", value: "true" },
  });

  return Response.json({ ok: true });
}
