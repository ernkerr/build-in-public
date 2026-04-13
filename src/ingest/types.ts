export interface IngestItemInput {
  source: "github" | "notes";
  content: string;
  metadata?: Record<string, unknown>;
}

export interface Source {
  fetch(): Promise<IngestItemInput[]>;
}
