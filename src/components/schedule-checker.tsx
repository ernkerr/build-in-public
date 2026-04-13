"use client";

import { useEffect } from "react";
import { toast } from "sonner";

async function checkScheduled() {
  try {
    const res = await fetch("/api/publish/scheduled");
    const data = await res.json();
    if (data.published > 0) {
      toast.success(
        `Published ${data.published} scheduled post${data.published > 1 ? "s" : ""}!`
      );
    }
  } catch {
    // Silent fail — don't block the UI
  }
}

export function ScheduleChecker() {
  useEffect(() => {
    // Check immediately on mount
    checkScheduled();

    // Then check every 60 seconds while the app is open
    const interval = setInterval(checkScheduled, 60_000);
    return () => clearInterval(interval);
  }, []);

  return null;
}
