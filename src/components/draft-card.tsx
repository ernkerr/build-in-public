"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PlatformIcon } from "./platform-icon";
import { Check, X, Pencil, Trash2, ImagePlus, X as XIcon, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface DraftCardProps {
  id: string;
  platform: string;
  content: string;
  status: string;
  imageUrl?: string | null;
  createdAt: string;
  onUpdated: () => void;
}

const charLimits: Record<string, number> = { x: 280, linkedin: 3000, threads: 500, bluesky: 300 };

export function DraftCard({ id, platform, content, status, imageUrl, createdAt, onUpdated }: DraftCardProps) {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [uploading, setUploading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  async function handleRegenerate() {
    setRegenerating(true);
    try {
      const res = await fetch(`/api/draft/${id}/regenerate`, { method: "POST" });
      if (!res.ok) throw new Error();
      toast.success("Draft regenerated");
      onUpdated();
    } catch {
      toast.error("Failed to regenerate");
    } finally {
      setRegenerating(false);
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

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("draftId", id);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }
      toast.success("Image attached");
      onUpdated();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleRemoveImage() {
    try {
      await updateDraft({ imageUrl: null });
      toast.success("Image removed");
    } catch {
      toast.error("Failed to remove image");
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
            {imageUrl && <Badge variant="outline">has image</Badge>}
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

        {imageUrl && (
          <div className="relative group">
            <Image
              src={imageUrl}
              alt="Draft attachment"
              width={400}
              height={300}
              className="rounded-md border object-cover max-h-48 w-auto"
            />
            {status === "pending" && (
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 rounded-full bg-black/60 p-1 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <XIcon className="h-3 w-3 text-white" />
              </button>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <time className="text-xs text-muted-foreground">
            {new Date(createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
          </time>
          {status === "pending" && (
            <div className="flex gap-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/gif,image/webp"
                className="hidden"
                onChange={handleImageUpload}
              />
              <Button variant="ghost" size="icon" onClick={handleRegenerate} disabled={regenerating} title="Regenerate">
                <RefreshCw className={`h-4 w-4 ${regenerating ? "animate-spin" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={uploading} title="Attach image">
                <ImagePlus className="h-4 w-4" />
              </Button>
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
