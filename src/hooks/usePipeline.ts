"use client";

import { useCallback } from "react";
import { usePipelineStore } from "@/store/pipeline";
import { useSSEStream } from "./useSSEStream";

export function usePipeline() {
  const store = usePipelineStore();
  const { startStream, abort } = useSSEStream();

  const startPipeline = useCallback(
    async (text: string) => {
      store.startRun();
      await startStream(text);
    },
    [store, startStream]
  );

  const resetPipeline = useCallback(() => {
    abort();
    store.reset();
  }, [abort, store]);

  return {
    runStatus: store.runStatus,
    startPipeline,
    resetPipeline,
  };
}
