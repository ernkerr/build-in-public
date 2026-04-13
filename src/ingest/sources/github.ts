import { Octokit } from "@octokit/rest";
import type { Source, IngestItemInput } from "../types";

interface GitHubSourceConfig {
  token: string;
  owner?: string;
  repo?: string;
  since?: string; // ISO date string
}

export class GitHubSource implements Source {
  private octokit: Octokit;
  private owner?: string;
  private repo?: string;
  private since?: string;

  constructor({ token, owner, repo, since }: GitHubSourceConfig) {
    this.octokit = new Octokit({ auth: token });
    this.owner = owner;
    this.repo = repo;
    this.since = since;
  }

  async fetch(): Promise<IngestItemInput[]> {
    // Single repo mode
    if (this.owner && this.repo) {
      return this.fetchFromRepo(this.owner, this.repo);
    }

    // All repos mode — fetch recent events for the authenticated user
    return this.fetchAllRepos();
  }

  private async fetchAllRepos(): Promise<IngestItemInput[]> {
    // Get the authenticated user
    const { data: user } = await this.octokit.users.getAuthenticated();
    const username = user.login;

    // Get recent push events (covers all repos)
    const { data: events } = await this.octokit.activity.listEventsForAuthenticatedUser({
      username,
      per_page: 100,
    });

    const since = this.since ? new Date(this.since) : null;
    const items: IngestItemInput[] = [];
    const seenShas = new Set<string>();

    for (const event of events) {
      if (event.type !== "PushEvent") continue;

      const payload = event.payload as {
        commits?: Array<{
          sha: string;
          message: string;
          author?: { name?: string };
          url?: string;
        }>;
        ref?: string;
      };

      if (!payload.commits) continue;

      const createdAt = event.created_at ? new Date(event.created_at) : null;
      if (since && createdAt && createdAt < since) continue;

      const repoName = event.repo?.name ?? "unknown";
      const branch = payload.ref?.replace("refs/heads/", "") ?? "main";

      for (const commit of payload.commits) {
        if (seenShas.has(commit.sha)) continue;
        seenShas.add(commit.sha);

        const htmlUrl = `https://github.com/${repoName}/commit/${commit.sha}`;

        items.push({
          source: "github",
          content: [
            `[${repoName}] ${commit.message}`,
            commit.author?.name ? `by ${commit.author.name}` : "",
            `branch: ${branch}`,
            htmlUrl,
          ]
            .filter(Boolean)
            .join("\n"),
          metadata: {
            sha: commit.sha,
            repo: repoName,
            branch,
            url: htmlUrl,
            author: commit.author?.name,
            date: event.created_at,
          },
        });
      }
    }

    return items;
  }

  private async fetchFromRepo(owner: string, repo: string): Promise<IngestItemInput[]> {
    const commits = await this.octokit.repos.listCommits({
      owner,
      repo,
      since: this.since,
      per_page: 30,
    });

    return commits.data.map((commit) => ({
      source: "github" as const,
      content: [
        `[${owner}/${repo}] ${commit.commit.message}`,
        commit.commit.author?.name ? `by ${commit.commit.author.name}` : "",
        commit.html_url,
      ]
        .filter(Boolean)
        .join("\n"),
      metadata: {
        sha: commit.sha,
        repo: `${owner}/${repo}`,
        url: commit.html_url,
        author: commit.commit.author?.name,
        date: commit.commit.author?.date,
      },
    }));
  }
}
