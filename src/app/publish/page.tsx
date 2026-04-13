"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlatformIcon } from "@/components/platform-icon";
import { Copy, Check, Send, ExternalLink, Clock, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface Draft {
  id: string;
  platform: string;
  content: string;
  status: string;
  imageUrl?: string | null;
  scheduledAt?: string | null;
  publishedUrl?: string | null;
  createdAt: string;
}

export default function PublishPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [schedulingId, setSchedulingId] = useState<string | null>(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [configuredPlatforms, setConfiguredPlatforms] = useState<string[]>([]);

  const fetchDrafts = useCallback(async () => {
    setLoading(true);
    try {
      const [draftsRes, scheduledRes, publishRes] = await Promise.all([
        fetch("/api/draft?status=approved"),
        fetch("/api/draft?status=scheduled"),
        fetch("/api/publish"),
      ]);
      const approved = await draftsRes.json();
      const scheduled = await scheduledRes.json();
      setDrafts([...approved, ...scheduled]);
      const publishData = await publishRes.json();
      setConfiguredPlatforms(publishData.platforms ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrafts();
    // Check for due scheduled posts on load
    fetch("/api/publish/scheduled").then(async (res) => {
      const data = await res.json();
      if (data.published > 0) {
        toast.success(`Auto-published ${data.published} scheduled post${data.published > 1 ? "s" : ""}!`);
        fetchDrafts();
      }
    });
  }, [fetchDrafts]);

  async function handleCopy(draft: Draft) {
    await navigator.clipboard.writeText(draft.content);
    setCopiedId(draft.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success("Copied to clipboard!");
  }

  async function handlePublish(draft: Draft) {
    setPublishingId(draft.id);
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId: draft.id }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(`Published to ${draft.platform}!`);
        if (data.url) window.open(data.url, "_blank");
        fetchDrafts();
      } else {
        toast.error(data.error || "Failed to publish");
      }
    } catch {
      toast.error("Failed to publish");
    } finally {
      setPublishingId(null);
    }
  }

  async function handleSchedule(draft: Draft) {
    if (!scheduleDate) {
      toast.error("Pick a date and time first");
      return;
    }

    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId: draft.id, scheduledAt: scheduleDate }),
      });
      const data = await res.json();

      if (data.scheduled) {
        toast.success(`Scheduled for ${new Date(data.scheduledAt).toLocaleString()}`);
        setSchedulingId(null);
        setScheduleDate("");
        fetchDrafts();
      } else {
        toast.error(data.error || "Failed to schedule");
      }
    } catch {
      toast.error("Failed to schedule");
    }
  }

  async function handleCancelSchedule(draft: Draft) {
    await fetch(`/api/draft/${draft.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "approved" }),
    });
    toast.success("Schedule cancelled");
    fetchDrafts();
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

  const approved = drafts.filter((d) => d.status === "approved");
  const scheduled = drafts.filter((d) => d.status === "scheduled");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Publish</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Publish directly, schedule for later, or copy to clipboard.
        </p>
      </div>

      {configuredPlatforms.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Connected:</span>
          {configuredPlatforms.map((p) => (
            <Badge key={p} variant="outline" className="capitalize">{p}</Badge>
          ))}
        </div>
      )}

      {scheduled.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Scheduled</h3>
          {scheduled.map((draft) => (
            <Card key={draft.id}>
              <CardContent className="space-y-3 pt-4">
                <div className="flex items-center gap-2">
                  <PlatformIcon platform={draft.platform} className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium capitalize">{draft.platform}</span>
                  <Badge variant="secondary">
                    <Clock className="mr-1 h-3 w-3" />
                    {draft.scheduledAt ? new Date(draft.scheduledAt).toLocaleString() : "scheduled"}
                  </Badge>
                </div>
                <p className="text-sm whitespace-pre-wrap">{draft.content}</p>
                {draft.imageUrl && (
                  <Image src={draft.imageUrl} alt="Post attachment" width={400} height={300} className="rounded-md border object-cover max-h-48 w-auto" />
                )}
                <Button size="sm" variant="ghost" onClick={() => handleCancelSchedule(draft)}>
                  <X className="mr-2 h-3 w-3" /> Cancel schedule
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : approved.length === 0 && scheduled.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No approved drafts to publish. Approve some drafts first.
        </p>
      ) : approved.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Ready to publish</h3>
          {approved.map((draft) => {
            const canPublish = configuredPlatforms.includes(draft.platform);
            const isPublishing = publishingId === draft.id;
            const isScheduling = schedulingId === draft.id;

            return (
              <Card key={draft.id}>
                <CardContent className="space-y-3 pt-4">
                  <div className="flex items-center gap-2">
                    <PlatformIcon platform={draft.platform} className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium capitalize">{draft.platform}</span>
                    <Badge variant="default">approved</Badge>
                    {canPublish && (
                      <Badge variant="outline" className="text-green-500 border-green-500/30">API ready</Badge>
                    )}
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{draft.content}</p>
                  {draft.imageUrl && (
                    <Image src={draft.imageUrl} alt="Post attachment" width={400} height={300} className="rounded-md border object-cover max-h-48 w-auto" />
                  )}

                  {isScheduling ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="datetime-local"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      />
                      <Button size="sm" onClick={() => handleSchedule(draft)}>
                        Confirm
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => { setSchedulingId(null); setScheduleDate(""); }}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {canPublish && (
                        <Button size="sm" onClick={() => handlePublish(draft)} disabled={isPublishing}>
                          {isPublishing ? (
                            <>Publishing...</>
                          ) : (
                            <><Send className="mr-2 h-3 w-3" /> Publish to {draft.platform}</>
                          )}
                        </Button>
                      )}
                      {canPublish && (
                        <Button size="sm" variant="outline" onClick={() => setSchedulingId(draft.id)}>
                          <Clock className="mr-2 h-3 w-3" /> Schedule
                        </Button>
                      )}
                      <Button size="sm" variant={canPublish ? "ghost" : "default"} onClick={() => handleCopy(draft)}>
                        {copiedId === draft.id ? (
                          <><Check className="mr-2 h-3 w-3" /> Copied</>
                        ) : (
                          <><Copy className="mr-2 h-3 w-3" /> Copy</>
                        )}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => markPublished(draft.id)}>
                        <ExternalLink className="mr-2 h-3 w-3" /> Mark published
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
