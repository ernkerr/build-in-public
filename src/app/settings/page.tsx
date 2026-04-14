"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trash2, ExternalLink, Check } from "lucide-react";
import { PlatformIcon } from "@/components/platform-icon";
import { toast } from "sonner";

interface StyleRef {
  id: string;
  platform: string;
  content: string;
  source: string;
  createdAt: string;
}

interface PlatformAuth {
  connected: boolean;
  method: string | null;
  canConnect: boolean;
}

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [authStatus, setAuthStatus] = useState<Record<string, PlatformAuth>>({});
  const [styleRefs, setStyleRefs] = useState<StyleRef[]>([]);
  const [githubRepo, setGithubRepo] = useState("");
  const [newStylePlatform, setNewStylePlatform] = useState("x");
  const [newStyleContent, setNewStyleContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then(setSettings);
    fetch("/api/style").then((r) => r.json()).then(setStyleRefs);
    fetch("/api/auth/status").then((r) => r.json()).then(setAuthStatus);

    // Show toast for successful OAuth connection
    const connected = searchParams.get("connected");
    if (connected) {
      toast.success(`${connected.charAt(0).toUpperCase() + connected.slice(1)} connected!`);
    }
    const error = searchParams.get("error");
    if (error) {
      toast.error(`Connection failed: ${error}`);
    }
  }, [searchParams]);

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

  async function disconnectPlatform(platform: string) {
    const keysToDelete: Record<string, string[]> = {
      x: ["x_access_token", "x_refresh_token"],
      linkedin: ["linkedin_access_token", "linkedin_refresh_token", "linkedin_person_urn"],
    };
    const keys = keysToDelete[platform];
    if (!keys) return;

    for (const key of keys) {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: "" }),
      });
    }

    setAuthStatus((prev) => ({
      ...prev,
      [platform]: { ...prev[platform], connected: false, method: null },
    }));
    toast.success(`${platform} disconnected`);
  }

  const platforms = [
    { id: "x", label: "X / Twitter", connectUrl: "/api/auth/x", setupGuide: "Set X_CLIENT_ID and X_CLIENT_SECRET in .env, then click Connect." },
    { id: "linkedin", label: "LinkedIn", connectUrl: "/api/auth/linkedin", setupGuide: "Set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET in .env, then click Connect." },
    { id: "bluesky", label: "Bluesky", connectUrl: null, setupGuide: "Set BLUESKY_IDENTIFIER and BLUESKY_APP_PASSWORD in .env. Get an app password at bsky.app/settings/app-passwords." },
    { id: "threads", label: "Threads", connectUrl: null, setupGuide: "Set THREADS_ACCESS_TOKEN and THREADS_USER_ID in .env. Requires Meta developer app review." },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Connect your accounts and configure preferences.
        </p>
      </div>

      {/* Platform Connections */}
      <Card>
        <CardContent className="space-y-4 pt-4">
          <h3 className="font-semibold">Platform Connections</h3>
          <p className="text-sm text-muted-foreground">
            Connect your social accounts to publish directly from the app.
          </p>

          <div className="space-y-3">
            {platforms.map((p) => {
              const status = authStatus[p.id];
              const connected = status?.connected;
              const canConnect = status?.canConnect;

              return (
                <div key={p.id} className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center gap-3">
                    <PlatformIcon platform={p.id} className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <span className="text-sm font-medium">{p.label}</span>
                      {connected && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <Badge variant="outline" className="text-green-500 border-green-500/30 text-xs">
                            <Check className="mr-1 h-2.5 w-2.5" /> Connected
                          </Badge>
                          {status?.method === "oauth" && (
                            <Badge variant="secondary" className="text-xs">OAuth</Badge>
                          )}
                          {status?.method === "env" && (
                            <Badge variant="secondary" className="text-xs">.env</Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {connected && status?.method === "oauth" && (
                      <Button size="sm" variant="ghost" onClick={() => disconnectPlatform(p.id)}>
                        Disconnect
                      </Button>
                    )}
                    {!connected && canConnect && p.connectUrl && (
                      <Button size="sm" asChild>
                        <a href={p.connectUrl}>
                          <ExternalLink className="mr-2 h-3 w-3" /> Connect
                        </a>
                      </Button>
                    )}
                    {!connected && !canConnect && (
                      <span className="text-xs text-muted-foreground max-w-48">{p.setupGuide}</span>
                    )}
                    {!connected && canConnect && !p.connectUrl && (
                      <span className="text-xs text-muted-foreground max-w-48">{p.setupGuide}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* GitHub */}
      <Card>
        <CardContent className="space-y-4 pt-4">
          <h3 className="font-semibold">GitHub Connection</h3>
          <p className="text-sm text-muted-foreground">
            Leave blank to pull commits from <strong>all your repos</strong>. Or set a specific repo (owner/repo format).
            Your GITHUB_PAT is configured via the .env file.
          </p>
          <input
            type="text"
            placeholder="Leave blank for all repos, or owner/repo"
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

      {/* Style References */}
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
              <option value="bluesky">Bluesky</option>
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
