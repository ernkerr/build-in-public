import { prisma } from "@/lib/db";
import { GitHubSource } from "@/ingest/sources/github";

export async function POST(request: Request) {
  const { repo, since } = await request.json();

  const token = process.env.GITHUB_PAT;
  if (!token) {
    return Response.json({ error: "GITHUB_PAT not configured" }, { status: 400 });
  }

  if (!repo || typeof repo !== "string" || !repo.includes("/")) {
    return Response.json({ error: "Repo must be in owner/repo format" }, { status: 400 });
  }

  const [owner, repoName] = repo.split("/");

  const source = new GitHubSource({ token, owner, repo: repoName, since });

  try {
    const items = await source.fetch();

    // Filter out commits we've already ingested (by SHA in metadata)
    const existingShas = new Set(
      (
        await prisma.ingestItem.findMany({
          where: { source: "github" },
          select: { metadata: true },
        })
      )
        .map((i) => {
          try {
            return JSON.parse(i.metadata).sha;
          } catch {
            return null;
          }
        })
        .filter(Boolean)
    );

    const newItems = items.filter((item) => {
      const sha = item.metadata?.sha as string | undefined;
      return sha && !existingShas.has(sha);
    });

    if (newItems.length === 0) {
      return Response.json({ message: "No new commits to ingest", count: 0 });
    }

    await prisma.ingestItem.createMany({
      data: newItems.map((item) => ({
        source: item.source,
        content: item.content,
        metadata: JSON.stringify(item.metadata),
      })),
    });

    return Response.json({
      message: `Ingested ${newItems.length} new commits`,
      count: newItems.length,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return Response.json({ error: `GitHub API error: ${message}` }, { status: 500 });
  }
}
