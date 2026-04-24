export type StageId =
  | "ingestion"
  | "chunking"
  | "embedding"
  | "indexing"
  | "ready";

export type StageStatus = "idle" | "queued" | "running" | "done" | "error";
export type RunStatus = "idle" | "running" | "complete" | "error";

export interface LogLine {
  id: string;
  stageId: StageId;
  level: "info" | "success" | "warn" | "error";
  text: string;
  ts: number;
}

export interface Chunk {
  id: string;
  text: string;
  start: number;
  end: number;
  tokenEstimate: number;
}

export interface EmbeddingPoint {
  chunkId: string;
  x: number;
  y: number;
  cluster: number;
}

export interface SearchResult {
  chunk: Chunk;
  score: number;
}

export interface StageState {
  status: StageStatus;
  startedAt?: number;
  completedAt?: number;
  durationMs?: number;
}

// Discriminated union for SSE events
export type PipelineEvent =
  | { type: "stage_start"; stageId: StageId; ts: number }
  | { type: "log"; stageId: StageId; level: LogLine["level"]; text: string; ts: number }
  | { type: "stage_complete"; stageId: StageId; ts: number; durationMs: number }
  | { type: "chunks"; payload: Chunk[] }
  | { type: "embedding_progress"; processed: number; total: number }
  | { type: "embeddings"; payload: EmbeddingPoint[] }
  | { type: "search_results"; payload: SearchResult[] }
  | { type: "done" }
  | { type: "error"; message: string };
