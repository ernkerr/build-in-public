"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PlatformIcon } from "./platform-icon";
import { Check, X, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DraftCardProps {
  id: string;
  platform: string;
  content: string;
  status: string;
  createdAt: string;
  onUpdated: () => void;
}

const charLimits: Record<string, number> = { x: 280, linkedin: 3000, threads: 500 };

export function DraftCard({ id, platform, content, status, createdAt, onUpdated }: DraftCardProps) {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);

  const charLimit = charLimits[platform] ?? 280;
  const charCount = editing ? editContent.length : content.length;
  const overLimit = charCount > charLimit;

  async function updateDraft(data: Record<string, unknown>) {
    const res = await fetch(`/api/draft/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error();
    onUpdated();
  }

  async function handleSaveEdit() {
    try {
      await updateDraft({ content: editContent });
      setEditing(false);
      toast.success("Draft updated");
    } catch {
      toast.error("Failed to update");
    }
  }

  async function handleApprove() {
    try {
      await updateDraft({ status: "approved" });
      toast.success("Draft approved");
    } catch {
      toast.error("Failed to approve");
    }
  }

  async function handleReject() {
    try {
      await updateDraft({ status: "rejected" });
      toast.success("Draft rejected");
    } catch {
      toast.error("Failed to reject");
    }
  }

  async function handleDelete() {
    try {
      const res = await fetch(`/api/draft/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Draft deleted");
      onUpdated();
    } catch {
      toast.error("Failed to delete");
    }
  }

  return (
    <Card>
      <CardContent className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlatformIcon platform={platform} className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium capitalize">{platform}</span>
            <Badge variant={status === "approved" ? "default" : status === "rejected" ? "destructive" : "secondary"}>
              {status}
            </Badge>
          </div>
          <span className={`text-xs font-mono ${overLimit ? "text-destructive" : "text-muted-foreground"}`}>
            {charCount}/{charLimit}
          </span>
        </div>

        {editing ? (
          <div className="space-y-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveEdit}>Save</Button>
              <Button size="sm" variant="ghost" onClick={() => { setEditing(false); setEditContent(content); }}>Cancel</Button>
            </div>
          </div>
        ) : (
          <p className="text-sm whitespace-pre-wrap">{content}</p>
        )}

        <div className="flex items-center justify-between">
          <time className="text-xs text-muted-foreground">
            {new Date(createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
          </time>
          {status === "pending" && (
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => setEditing(true)} title="Edit">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleApprove} title="Approve" className="text-green-500 hover:text-green-600">
                <Check className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleReject} title="Reject" className="text-destructive">
                <X className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDelete} title="Delete" className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
