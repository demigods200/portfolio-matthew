"use client";

import { usePipelineStore } from "@/store/pipeline";
import { PipelineStage } from "./PipelineStage";
import { STAGE_ORDER } from "@/lib/pipeline/stages";

export function PipelineStages() {
  const stages = usePipelineStore((s) => s.stages);
  const embeddingProgress = usePipelineStore((s) => s.embeddingProgress);

  return (
    <div className="flex flex-col gap-1">
      {STAGE_ORDER.map((stageId) => {
        const stage = stages[stageId];
        return (
          <div key={stageId}>
            <PipelineStage
              stageId={stageId}
              status={stage?.status ?? "idle"}
              {...(stage?.durationMs !== undefined ? { durationMs: stage.durationMs } : {})}
            />
            {/* Embedding sub-progress bar */}
            {stageId === "embedding" && stage?.status === "running" && embeddingProgress && (
              <div className="ml-8 mt-1 mb-1 h-0.5 bg-[var(--bg-surface-3)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--accent)] rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.round((embeddingProgress.processed / Math.max(1, embeddingProgress.total)) * 100)}%`,
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
