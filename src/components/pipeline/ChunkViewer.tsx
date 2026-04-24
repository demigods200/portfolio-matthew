"use client";

import { motion } from "framer-motion";
import { usePipelineStore } from "@/store/pipeline";
import { truncate } from "@/lib/utils/format";

export function ChunkViewer() {
  const chunks = usePipelineStore((s) => s.chunks);
  const stages = usePipelineStore((s) => s.stages);
  const chunkingDone = stages.chunking?.status === "done";

  if (!chunkingDone || chunks.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-2xs text-[var(--text-tertiary)] font-mono uppercase tracking-widest">
        {chunks.length} chunks
      </span>
      <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
        {chunks.map((chunk, i) => (
          <motion.div
            key={chunk.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.25,
              delay: i * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] px-3 py-2.5"
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-2xs font-mono text-[var(--accent)]">{chunk.id}</span>
              <span className="text-2xs font-mono text-[var(--text-tertiary)]">
                ~{chunk.tokenEstimate} tokens
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {truncate(chunk.text, 120)}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
