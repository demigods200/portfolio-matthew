import type { StageId } from "@/types/pipeline";

export interface StageDef {
  id: StageId;
  name: string;
  description: string;
  minDurationMs: number;
  maxDurationMs: number;
}

export const STAGE_DEFS: StageDef[] = [
  {
    id: "ingestion",
    name: "Ingestion",
    description: "Parse and validate input document",
    minDurationMs: 800,
    maxDurationMs: 1200,
  },
  {
    id: "chunking",
    name: "Chunking",
    description: "Sentence-boundary split with overlap window",
    minDurationMs: 400,
    maxDurationMs: 700,
  },
  {
    id: "embedding",
    name: "Embedding",
    description: "Generate 1536-dim vectors per chunk",
    minDurationMs: 1500,
    maxDurationMs: 2500,
  },
  {
    id: "indexing",
    name: "Semantic Indexing",
    description: "Insert into pgvector HNSW index",
    minDurationMs: 600,
    maxDurationMs: 900,
  },
  {
    id: "ready",
    name: "Query Ready",
    description: "Index built — semantic search enabled",
    minDurationMs: 150,
    maxDurationMs: 300,
  },
];

export const STAGE_ORDER: StageId[] = STAGE_DEFS.map((s) => s.id);

export function stageDuration(def: StageDef): number {
  return (
    def.minDurationMs +
    Math.floor(Math.random() * (def.maxDurationMs - def.minDurationMs))
  );
}
