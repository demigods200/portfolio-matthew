import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type {
  RunStatus,
  StageId,
  StageStatus,
  StageState,
  LogLine,
  Chunk,
  EmbeddingPoint,
  SearchResult,
} from "@/types/pipeline";
import { STAGE_ORDER } from "@/lib/pipeline/stages";

interface PipelineStore {
  // Run-level state
  runStatus: RunStatus;
  currentStageId: StageId | null;
  error: string | null;
  inputText: string;

  // Per-stage state
  stages: Record<StageId, StageState>;

  // Log lines per stage
  logs: Record<StageId, LogLine[]>;

  // Pipeline data outputs
  chunks: Chunk[];
  embeddings: EmbeddingPoint[];
  searchResults: SearchResult[];
  embeddingProgress: { processed: number; total: number } | null;

  // Actions
  setInputText: (text: string) => void;
  startRun: () => void;
  onStageStart: (stageId: StageId, ts: number) => void;
  onLog: (stageId: StageId, level: LogLine["level"], text: string, ts: number) => void;
  onStageComplete: (stageId: StageId, ts: number, durationMs: number) => void;
  onChunks: (chunks: Chunk[]) => void;
  onEmbeddingProgress: (processed: number, total: number) => void;
  onEmbeddings: (embeddings: EmbeddingPoint[]) => void;
  onSearchResults: (results: SearchResult[]) => void;
  onDone: () => void;
  onError: (message: string) => void;
  reset: () => void;
}

function makeInitialStages(): Record<StageId, StageState> {
  return Object.fromEntries(
    STAGE_ORDER.map((id) => [id, { status: "idle" as StageStatus }])
  ) as Record<StageId, StageState>;
}

function makeInitialLogs(): Record<StageId, LogLine[]> {
  return Object.fromEntries(
    STAGE_ORDER.map((id) => [id, [] as LogLine[]])
  ) as Record<StageId, LogLine[]>;
}

const INITIAL_STATE = {
  runStatus: "idle" as RunStatus,
  currentStageId: null,
  error: null,
  inputText: "",
  stages: makeInitialStages(),
  logs: makeInitialLogs(),
  chunks: [],
  embeddings: [],
  searchResults: [],
  embeddingProgress: null,
};

export const usePipelineStore = create<PipelineStore>()(
  immer((set) => ({
    ...INITIAL_STATE,

    setInputText: (text) =>
      set((s) => { s.inputText = text; }),

    startRun: () =>
      set((s) => {
        s.runStatus = "running";
        s.currentStageId = null;
        s.error = null;
        s.chunks = [];
        s.embeddings = [];
        s.searchResults = [];
        s.embeddingProgress = null;
        s.stages = makeInitialStages();
        s.logs = makeInitialLogs();
      }),

    onStageStart: (stageId, ts) =>
      set((s) => {
        const stage = s.stages[stageId];
        if (stage) {
          stage.status = "running";
          stage.startedAt = ts;
        }
        s.currentStageId = stageId;
      }),

    onLog: (stageId, level, text, ts) =>
      set((s) => {
        const stageLogs = s.logs[stageId];
        if (stageLogs) {
          stageLogs.push({
            id: `${stageId}_${ts}_${Math.random().toString(36).slice(2, 6)}`,
            stageId,
            level,
            text,
            ts,
          });
        }
      }),

    onStageComplete: (stageId, ts, durationMs) =>
      set((s) => {
        const stage = s.stages[stageId];
        if (stage) {
          stage.status = "done";
          stage.completedAt = ts;
          stage.durationMs = durationMs;
        }
      }),

    onChunks: (chunks) =>
      set((s) => { s.chunks = chunks; }),

    onEmbeddingProgress: (processed, total) =>
      set((s) => { s.embeddingProgress = { processed, total }; }),

    onEmbeddings: (embeddings) =>
      set((s) => { s.embeddings = embeddings; }),

    onSearchResults: (results) =>
      set((s) => { s.searchResults = results; }),

    onDone: () =>
      set((s) => { s.runStatus = "complete"; }),

    onError: (message) =>
      set((s) => {
        s.runStatus = "error";
        s.error = message;
        if (s.currentStageId) {
          const stage = s.stages[s.currentStageId];
          if (stage) stage.status = "error";
        }
      }),

    reset: () => set(() => ({ ...INITIAL_STATE })),
  }))
);
