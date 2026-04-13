"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface StyleRef {
  id: string;
  platform: string;
  content: string;
  source: string;
  createdAt: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [styleRefs, setStyleRefs] = useState<StyleRef[]>([]);
  const [githubRepo, setGithubRepo] = useState("");
  const [newStylePlatform, setNewStylePlatform] = useState("x");
  const [newStyleContent, setNewStyleContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then(setSettings);
    fetch("/api/style").then((r) => r.json()).then(setStyleRefs);
  }, []);

  useEffect(() => {
    setGithubRepo(settings.github_repo || "");
  }, [settings]);

  async function saveSettings() {
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ github_repo: githubRepo }),
      });
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function addStyleRef() {
    if (!newStyleContent.trim()) return;
    try {
      const res = await fetch("/api/style", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: newStylePlatform, content: newStyleContent }),
      });
      if (!res.ok) throw new Error();
      const ref = await res.json();
      setStyleRefs((prev) => [ref, ...prev]);
      setNewStyleContent("");
      toast.success("Style reference added");
    } catch {
      toast.error("Failed to add");
    }
  }

  async function deleteStyleRef(id: string) {
    await fetch(`/api/style/${id}`, { method: "DELETE" });
    setStyleRefs((prev) => prev.filter((r) => r.id !== id));
    toast.success("Removed");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure your connections and style preferences.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-4">
          <h3 className="font-semibold">GitHub Connection</h3>
          <p className="text-sm text-muted-foreground">
            Set your GitHub repo (owner/repo format). Your GITHUB_PAT is configured via the .env file.
          </p>
          <input
            type="text"
            placeholder="owner/repo"
            value={githubRepo}
            onChange={(e) => setGithubRepo(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <Button onClick={saveSettings} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardContent className="space-y-4 pt-4">
          <h3 className="font-semibold">Style References</h3>
          <p className="text-sm text-muted-foreground">
            Add example posts you want to emulate. These guide the AI&apos;s voice when drafting.
          </p>
          <div className="flex gap-2">
            <select
              value={newStylePlatform}
              onChange={(e) => setNewStylePlatform(e.target.value)}
              className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            >
              <option value="x">X</option>
              <option value="linkedin">LinkedIn</option>
              <option value="threads">Threads</option>
            </select>
          </div>
          <Textarea
            placeholder="Paste an example post you want to emulate..."
            value={newStyleContent}
            onChange={(e) => setNewStyleContent(e.target.value)}
            rows={3}
          />
          <Button onClick={addStyleRef} disabled={!newStyleContent.trim()}>
            Add reference
          </Button>

          {styleRefs.length > 0 && (
            <div className="space-y-2 pt-4">
              {styleRefs.map((ref) => (
                <div key={ref.id} className="flex items-start gap-3 rounded-md border p-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{ref.platform}</Badge>
                      <Badge variant="secondary">{ref.source}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3">{ref.content}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteStyleRef(ref.id)} className="shrink-0 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
