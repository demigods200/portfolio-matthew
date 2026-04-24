"use client";

import { PipelineInput } from "./PipelineInput";
import { PipelineStages } from "./PipelineStages";
import { PipelineConsole } from "./PipelineConsole";
import { ChunkViewer } from "./ChunkViewer";
import { EmbeddingViz } from "./EmbeddingViz";
import { SemanticSearch } from "./SemanticSearch";

export function PipelineDemo() {
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-2)]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
          <span className="text-xs font-mono text-[var(--text-secondary)]">
            pipeline.demo
          </span>
        </div>
        <span className="text-2xs text-[var(--text-tertiary)] font-mono">
          Loom AI · Simulated
        </span>
      </div>

      <div className="p-5 flex flex-col gap-6">
        {/* Input */}
        <PipelineInput />

        {/* Two-column: stages + console */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-2xs text-[var(--text-tertiary)] font-mono uppercase tracking-widest">
              Stages
            </span>
            <PipelineStages />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-2xs text-[var(--text-tertiary)] font-mono uppercase tracking-widest">
              Log output
            </span>
            <PipelineConsole />
          </div>
        </div>

        {/* Data outputs — appear progressively */}
        <div className="flex flex-col gap-6">
          <ChunkViewer />
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <EmbeddingViz />
            </div>
            <div className="flex-1 min-w-0">
              <SemanticSearch />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
