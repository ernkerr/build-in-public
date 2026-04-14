"use client";

import { useEffect, useState, useCallback } from "react";
import { NoteCard } from "./note-card";

interface Note {
  id: string;
  content: string;
  expansion?: string | null;
  used: boolean;
  createdAt: string;
}

export function NoteList({ refreshKey }: { refreshKey: number }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ingest/notes");
      const data = await res.json();
      setNotes(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes, refreshKey]);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading notes...</p>;
  }

  if (notes.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No notes yet. Add one above to get started.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          {...note}
          onUpdated={fetchNotes}
        />
      ))}
    </div>
  );
}
