"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { usePipelineStore } from "@/store/pipeline";
import { truncate } from "@/lib/utils/format";

const CLUSTER_COLORS = [
  "var(--data-a)",
  "var(--data-b)",
  "var(--data-c)",
  "var(--data-d)",
];

const W = 280;
const H = 180;
const CENTER_X = W / 2;
const CENTER_Y = H / 2;
const PADDING = 16;

export function EmbeddingViz() {
  const embeddings = usePipelineStore((s) => s.embeddings);
  const chunks = usePipelineStore((s) => s.chunks);
  const stages = usePipelineStore((s) => s.stages);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const embeddingDone = stages.embedding?.status === "done";
  if (!embeddingDone || embeddings.length === 0) return null;

  const chunkMap = new Map(chunks.map((c) => [c.id, c]));
  const hoveredChunk = hoveredId ? chunkMap.get(hoveredId) : null;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-2xs text-[var(--text-tertiary)] font-mono uppercase tracking-widest">
        2D embedding projection (t-SNE)
      </span>
      <div className="relative">
        <svg
          width={W}
          height={H}
          className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)]"
        >
          {embeddings.map((pt, i) => {
            const cx = PADDING + pt.x * (W - PADDING * 2);
            const cy = PADDING + pt.y * (H - PADDING * 2);
            const color = CLUSTER_COLORS[pt.cluster % CLUSTER_COLORS.length] ?? "var(--data-a)";
            const isHovered = hoveredId === pt.chunkId;

            return (
              <motion.circle
                key={pt.chunkId}
                initial={{ cx: CENTER_X, cy: CENTER_Y, r: 0, opacity: 0 }}
                animate={{ cx, cy, r: isHovered ? 6 : 4, opacity: 1 }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.025,
                  ease: [0.16, 1, 0.3, 1],
                }}
                fill={color}
                fillOpacity={isHovered ? 1 : 0.7}
                stroke={isHovered ? "white" : "transparent"}
                strokeWidth={1}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredId(pt.chunkId)}
                onMouseLeave={() => setHoveredId(null)}
              />
            );
          })}
        </svg>

        {/* Hover tooltip */}
        {hoveredChunk && (
          <div className="absolute left-0 -bottom-2 translate-y-full z-10 w-64 rounded-md border border-[var(--border-default)] bg-[var(--bg-overlay)] p-2.5 shadow-lg">
            <p className="text-2xs font-mono text-[var(--accent)] mb-1">{hoveredChunk.id}</p>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {truncate(hoveredChunk.text, 100)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
