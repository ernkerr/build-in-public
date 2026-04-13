"use client";

import { useEffect, useState, useCallback } from "react";
import { DraftCard } from "@/components/draft-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

const ALL_PLATFORMS = [
  { id: "x", label: "X" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "threads", label: "Threads" },
];

interface Draft {
  id: string;
  platform: string;
  content: string;
  status: string;
  batchId: string;
  imageUrl?: string | null;
  createdAt: string;
}

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(
    new Set(["x", "linkedin"])
  );

  const fetchDrafts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/draft");
      setDrafts(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);

  function togglePlatform(id: string) {
    setSelectedPlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function handleGenerate() {
    setGenerating(true);
    try {
      const platforms = Array.from(selectedPlatforms);
      const res = await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platforms }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed");
      }
      const count = platforms.length;
      toast.success(`Generated ${count} draft${count > 1 ? "s" : ""}!`);
      fetchDrafts();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate drafts");
    } finally {
      setGenerating(false);
    }
  }

  const pending = drafts.filter((d) => d.status === "pending");
  const approved = drafts.filter((d) => d.status === "approved");
  const rejected = drafts.filter((d) => d.status === "rejected");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Drafts</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Review, edit, and approve your AI-generated posts.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-md border border-border p-3">
        <span className="text-sm font-medium text-muted-foreground">Platforms:</span>
        <div className="flex gap-2">
          {ALL_PLATFORMS.map((p) => (
            <button
              key={p.id}
              onClick={() => togglePlatform(p.id)}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                selectedPlatforms.has(p.id)
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="ml-auto">
          <Button onClick={handleGenerate} disabled={generating}>
            <Sparkles className="mr-2 h-4 w-4" />
            {generating
              ? "Generating..."
              : `Draft for ${selectedPlatforms.size} platform${selectedPlatforms.size > 1 ? "s" : ""}`}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-3 mt-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : pending.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending drafts. Generate one or add notes first.</p>
          ) : (
            pending.map((d) => <DraftCard key={d.id} {...d} onUpdated={fetchDrafts} />)
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-3 mt-4">
          {approved.length === 0 ? (
            <p className="text-sm text-muted-foreground">No approved drafts yet.</p>
          ) : (
            approved.map((d) => <DraftCard key={d.id} {...d} onUpdated={fetchDrafts} />)
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-3 mt-4">
          {rejected.length === 0 ? (
            <p className="text-sm text-muted-foreground">No rejected drafts.</p>
          ) : (
            rejected.map((d) => <DraftCard key={d.id} {...d} onUpdated={fetchDrafts} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
