"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StickyNote, FileEdit, Send, GitCommit, Sparkles } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Stats {
  notes: number;
  commits: number;
  pendingDrafts: number;
  approvedDrafts: number;
  publishedDrafts: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [pulling, setPulling] = useState(false);

  const [autoIngestMsg, setAutoIngestMsg] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const [notesRes, draftsRes, settingsRes] = await Promise.all([
        fetch("/api/ingest/notes"),
        fetch("/api/draft"),
        fetch("/api/settings"),
      ]);
      const notes = await notesRes.json();
      const drafts = await draftsRes.json();
      const settings = await settingsRes.json();

      setStats({
        notes: notes.filter((n: { source: string }) => n.source === "notes").length,
        commits: notes.filter((n: { source: string }) => n.source === "github").length,
        pendingDrafts: drafts.filter((d: { status: string }) => d.status === "pending").length,
        approvedDrafts: drafts.filter((d: { status: string }) => d.status === "approved").length,
        publishedDrafts: drafts.filter((d: { status: string }) => d.status === "published").length,
      });

      // Auto-ingest commits on page load
      // Uses specific repo from settings, or "all" for all repos
      const repo = settings.github_repo || "all";
      try {
        const res = await fetch("/api/ingest/github", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ repo }),
        });
        const data = await res.json();
        if (res.ok && data.count > 0) {
          setAutoIngestMsg(`Auto-ingested ${data.count} new commits`);
          // Refresh stats
          const refreshNotes = await fetch("/api/ingest/notes");
          const refreshedNotes = await refreshNotes.json();
          setStats((prev) => prev ? {
            ...prev,
            commits: refreshedNotes.filter((n: { source: string }) => n.source === "github").length,
          } : prev);
        }
      } catch {
        // Silent fail — GITHUB_PAT might not be set
      }
    }
    load();
  }, []);

  async function handlePullCommits() {
    setPulling(true);
    try {
      const settingsRes = await fetch("/api/settings");
      const settings = await settingsRes.json();
      const repo = settings.github_repo || "all";

      const res = await fetch("/api/ingest/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(data.message);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to pull commits");
    } finally {
      setPulling(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your build-in-public command center.
        </p>
      </div>

      {autoIngestMsg && (
        <div className="rounded-md border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-400">
          {autoIngestMsg}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <StickyNote className="h-4 w-4" />
              <span className="text-sm">Notes</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{stats?.notes ?? "-"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <GitCommit className="h-4 w-4" />
              <span className="text-sm">Commits</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{stats?.commits ?? "-"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileEdit className="h-4 w-4" />
              <span className="text-sm">Pending Drafts</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{stats?.pendingDrafts ?? "-"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Send className="h-4 w-4" />
              <span className="text-sm">Published</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{stats?.publishedDrafts ?? "-"}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/notes">
          <Button>
            <StickyNote className="mr-2 h-4 w-4" /> Add a note
          </Button>
        </Link>
        <Link href="/drafts">
          <Button variant="outline">
            <Sparkles className="mr-2 h-4 w-4" /> Draft new posts
          </Button>
        </Link>
        <Button variant="outline" onClick={handlePullCommits} disabled={pulling}>
          <GitCommit className="mr-2 h-4 w-4" />
          {pulling ? "Pulling..." : "Pull commits"}
        </Button>
      </div>
    </div>
  );
}
