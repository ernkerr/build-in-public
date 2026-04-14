"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Sparkles, Lightbulb, ChevronDown, ChevronUp, Send } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface NoteCardProps {
  id: string;
  content: string;
  expansion?: string | null;
  used: boolean;
  createdAt: string;
  onUpdated: () => void;
}

export function NoteCard({ id, content, expansion: initialExpansion, used, createdAt, onUpdated }: NoteCardProps) {
  const [drafting, setDrafting] = useState(false);
  const [expanding, setExpanding] = useState(false);
  const [expansion, setExpansion] = useState(initialExpansion || "");
  const [showExpansion, setShowExpansion] = useState(!!initialExpansion);
  const [editedExpansion, setEditedExpansion] = useState(initialExpansion || "");

  async function handleExpand() {
    setExpanding(true);
    try {
      const res = await fetch("/api/expand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId: id }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed");
      }
      const data = await res.json();
      setExpansion(data.expansion);
      setEditedExpansion(data.expansion);
      setShowExpansion(true);
      toast.success("Idea expanded!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to expand idea");
    } finally {
      setExpanding(false);
    }
  }

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

  async function handleDraftFromExpanded() {
    setDrafting(true);
    try {
      const res = await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: "x", rawOverride: editedExpansion }),
      });
      if (!res.ok) throw new Error();
      toast.success("Draft created from expanded idea! Check the Drafts page.");
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
      <CardContent className="space-y-3 pt-4">
        <div className="flex items-start gap-4">
          <div className="flex-1 space-y-2">
            <p className="text-sm whitespace-pre-wrap">{content}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <time>{new Date(createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</time>
              <button onClick={toggleUsed} className="cursor-pointer">
                <Badge variant={used ? "secondary" : "outline"}>
                  {used ? "used" : "unused"}
                </Badge>
              </button>
              {expansion && (
                <Badge variant="outline" className="text-amber-500 border-amber-500/30">expanded</Badge>
              )}
            </div>
          </div>
          <div className="flex shrink-0 gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={expansion ? () => setShowExpansion(!showExpansion) : handleExpand}
              disabled={expanding}
              title={expansion ? "Toggle expansion" : "Expand this idea"}
              className="text-amber-500"
            >
              {expanding ? (
                <Lightbulb className="h-4 w-4 animate-pulse" />
              ) : expansion ? (
                showExpansion ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
              ) : (
                <Lightbulb className="h-4 w-4" />
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDraft} disabled={drafting} title="Draft a post from this note">
              <Sparkles className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {showExpansion && expansion && (
          <div className="rounded-md border border-amber-500/20 bg-amber-500/5 p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-amber-500">AI Expansion</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-amber-500"
                onClick={handleExpand}
                disabled={expanding}
              >
                {expanding ? "Regenerating..." : "Regenerate"}
              </Button>
            </div>
            <Textarea
              value={editedExpansion}
              onChange={(e) => setEditedExpansion(e.target.value)}
              rows={10}
              className="text-sm resize-none border-amber-500/20 bg-transparent"
            />
            <Button size="sm" onClick={handleDraftFromExpanded} disabled={drafting}>
              <Send className="mr-2 h-3 w-3" />
              {drafting ? "Drafting..." : "Draft from expanded"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
