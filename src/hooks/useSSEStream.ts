"use client";

import { useCallback, useRef } from "react";
import { usePipelineStore } from "@/store/pipeline";
import type { PipelineEvent } from "@/types/pipeline";

export function useSSEStream() {
  const store = usePipelineStore();
  const abortRef = useRef<AbortController | null>(null);

  const startStream = useCallback(
    async (text: string) => {
      // Cancel any in-flight request
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      try {
        const response = await fetch("/api/pipeline/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
          signal: abortRef.current.signal,
        });

        if (!response.ok || !response.body) {
          store.onError(`HTTP ${response.status}`);
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Parse complete SSE lines
          const lines = buffer.split("\n");
          // Keep the last (potentially incomplete) line in the buffer
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const raw = line.slice(6).trim();
            if (!raw) continue;

            try {
              const event = JSON.parse(raw) as PipelineEvent;
              dispatchEvent(event, store);
            } catch {
              // Malformed line — ignore
            }
          }
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          store.onError(String(err));
        }
      }
    },
    [store]
  );

  const abort = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { startStream, abort };
}

function dispatchEvent(
  event: PipelineEvent,
  store: ReturnType<typeof usePipelineStore.getState>
) {
  switch (event.type) {
    case "stage_start":
      store.onStageStart(event.stageId, event.ts);
      break;
    case "log":
      store.onLog(event.stageId, event.level, event.text, event.ts);
      break;
    case "stage_complete":
      store.onStageComplete(event.stageId, event.ts, event.durationMs);
      break;
    case "chunks":
      store.onChunks(event.payload);
      break;
    case "embedding_progress":
      store.onEmbeddingProgress(event.processed, event.total);
      break;
    case "embeddings":
      store.onEmbeddings(event.payload);
      break;
    case "search_results":
      store.onSearchResults(event.payload);
      break;
    case "done":
      store.onDone();
      break;
    case "error":
      store.onError(event.message);
      break;
  }
}
