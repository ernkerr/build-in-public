"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlatformIcon } from "@/components/platform-icon";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface Draft {
  id: string;
  platform: string;
  content: string;
  status: string;
  createdAt: string;
}

export default function PublishPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchDrafts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/draft?status=approved");
      setDrafts(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);

  async function handleCopy(draft: Draft) {
    await navigator.clipboard.writeText(draft.content);
    setCopiedId(draft.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success("Copied to clipboard!");
  }

  async function markPublished(id: string) {
    await fetch(`/api/draft/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "published" }),
    });
    toast.success("Marked as published");
    fetchDrafts();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Publish</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Approved drafts ready to post. Copy and paste to each platform.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : drafts.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No approved drafts to publish. Approve some drafts first.
        </p>
      ) : (
        <div className="space-y-4">
          {drafts.map((draft) => (
            <Card key={draft.id}>
              <CardContent className="space-y-3 pt-4">
                <div className="flex items-center gap-2">
                  <PlatformIcon platform={draft.platform} className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium capitalize">{draft.platform}</span>
                  <Badge variant="default">approved</Badge>
                </div>
                <p className="text-sm whitespace-pre-wrap">{draft.content}</p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleCopy(draft)}>
                    {copiedId === draft.id ? (
                      <><Check className="mr-2 h-3 w-3" /> Copied</>
                    ) : (
                      <><Copy className="mr-2 h-3 w-3" /> Copy to clipboard</>
                    )}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => markPublished(draft.id)}>
                    Mark as published
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
