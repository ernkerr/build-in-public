"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface NoteCardProps {
  id: string;
  content: string;
  used: boolean;
  createdAt: string;
  onUpdated: () => void;
}

export function NoteCard({ id, content, used, createdAt, onUpdated }: NoteCardProps) {
  const [drafting, setDrafting] = useState(false);

  async function handleDraft() {
    setDrafting(true);
    try {
      const res = await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: "x", ingestItemIds: [id] }),
      });
      if (!res.ok) throw new Error();
      toast.success("Draft created! Check the Drafts page.");
      onUpdated();
    } catch {
      toast.error("Failed to create draft");
    } finally {
      setDrafting(false);
    }
  }

  async function toggleUsed() {
    try {
      const res = await fetch(`/api/ingest/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ used: !used }),
      });
      if (!res.ok) throw new Error();
      onUpdated();
    } catch {
      toast.error("Failed to update note");
    }
  }

  async function handleDelete() {
    try {
      const res = await fetch(`/api/ingest/notes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Note deleted");
      onUpdated();
    } catch {
      toast.error("Failed to delete note");
    }
  }

  return (
    <Card>
      <CardContent className="flex items-start gap-4 pt-4">
        <div className="flex-1 space-y-2">
          <p className="text-sm whitespace-pre-wrap">{content}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <time>{new Date(createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</time>
            <button onClick={toggleUsed} className="cursor-pointer">
              <Badge variant={used ? "secondary" : "outline"}>
                {used ? "used" : "unused"}
              </Badge>
            </button>
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          <Button variant="ghost" size="icon" onClick={handleDraft} disabled={drafting} title="Draft a post from this note">
            <Sparkles className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDelete} className="text-muted-foreground hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
