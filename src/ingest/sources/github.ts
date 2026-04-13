import { Octokit } from "@octokit/rest";
import type { Source, IngestItemInput } from "../types";

interface GitHubSourceConfig {
  token: string;
  owner: string;
  repo: string;
  since?: string; // ISO date string
}

export class GitHubSource implements Source {
  private octokit: Octokit;
  private owner: string;
  private repo: string;
  private since?: string;

  constructor({ token, owner, repo, since }: GitHubSourceConfig) {
    this.octokit = new Octokit({ auth: token });
    this.owner = owner;
    this.repo = repo;
    this.since = since;
  }

  async fetch(): Promise<IngestItemInput[]> {
    const commits = await this.octokit.repos.listCommits({
      owner: this.owner,
      repo: this.repo,
      since: this.since,
      per_page: 30,
    });

    return commits.data.map((commit) => ({
      source: "github" as const,
      content: [
        commit.commit.message,
        commit.commit.author?.name ? `by ${commit.commit.author.name}` : "",
        commit.html_url,
      ]
        .filter(Boolean)
        .join("\n"),
      metadata: {
        sha: commit.sha,
        url: commit.html_url,
        author: commit.commit.author?.name,
        date: commit.commit.author?.date,
      },
    }));
  }
}
