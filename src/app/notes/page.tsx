"use client";

import { useState } from "react";
import { NoteForm } from "@/components/note-form";
import { NoteList } from "@/components/note-list";
import { Separator } from "@/components/ui/separator";

export default function NotesPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Notes</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Capture what you&apos;re working on, learning, or thinking about.
        </p>
      </div>
      <NoteForm onCreated={() => setRefreshKey((k) => k + 1)} />
      <Separator />
      <NoteList refreshKey={refreshKey} />
    </div>
  );
}
