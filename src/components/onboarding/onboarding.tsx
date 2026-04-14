"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Check,
  ArrowRight,
  Key,
  GitBranch,
  Sparkles,
  Send,
  StickyNote,
} from "lucide-react";

interface SetupStatus {
  hasApiKey: boolean;
  hasGithub: boolean;
  hasNotes: boolean;
  hasDrafts: boolean;
  hasPublishers: boolean;
  onboardingDismissed: boolean;
}

export function Onboarding() {
  const [status, setStatus] = useState<SetupStatus | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/onboarding").then((r) => r.json()).then(setStatus);
  }, []);

  if (!status || status.onboardingDismissed || dismissed) return null;

  // If everything is set up, don't show onboarding
  const allDone = status.hasApiKey && status.hasNotes && status.hasDrafts;
  if (allDone) return null;

  const steps = [
    {
      done: status.hasApiKey,
      icon: Key,
      title: "Add your Claude API key",
      description: "Run npm run setup or add ANTHROPIC_API_KEY to .env",
      action: null,
    },
    {
      done: status.hasGithub,
      icon: GitBranch,
      title: "Connect GitHub (optional)",
      description: "Add GITHUB_PAT to .env to auto-pull your commits",
      action: null,
    },
    {
      done: status.hasNotes,
      icon: StickyNote,
      title: "Add your first note",
      description: "Write about what you're building, learning, or shipping",
      action: "/notes",
    },
    {
      done: status.hasDrafts,
      icon: Sparkles,
      title: "Generate a draft",
      description: "Let the AI turn your notes into platform-ready posts",
      action: "/drafts",
    },
    {
      done: status.hasPublishers,
      icon: Send,
      title: "Connect a platform (optional)",
      description: "Set up X, LinkedIn, or Bluesky to publish directly",
      action: "/settings",
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const nextStep = steps.find((s) => !s.done);

  async function handleDismiss() {
    setDismissed(true);
    await fetch("/api/onboarding", { method: "POST" });
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="pt-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Get started</h3>
            <p className="text-sm text-muted-foreground">
              {completedCount}/{steps.length} steps complete
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleDismiss}>
            Dismiss
          </Button>
        </div>

        <div className="w-full bg-secondary rounded-full h-1.5">
          <div
            className="bg-primary h-1.5 rounded-full transition-all"
            style={{ width: `${(completedCount / steps.length) * 100}%` }}
          />
        </div>

        <div className="space-y-2">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isNext = step === nextStep;

            return (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-md p-2 transition-colors ${
                  isNext ? "bg-accent" : ""
                }`}
              >
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                    step.done
                      ? "bg-green-500/20 text-green-500"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.done ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Icon className="h-3.5 w-3.5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      step.done ? "text-muted-foreground line-through" : ""
                    }`}
                  >
                    {step.title}
                  </p>
                  {isNext && (
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  )}
                </div>
                {isNext && step.action && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={step.action}>
                      <ArrowRight className="h-3 w-3" />
                    </a>
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
