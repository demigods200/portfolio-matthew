"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { Spinner } from "@/components/ui/Spinner";
import type { StageId, StageStatus } from "@/types/pipeline";
import { STAGE_DEFS } from "@/lib/pipeline/stages";
import { formatDuration } from "@/lib/utils/format";

const STATUS_ICONS: Record<StageStatus, React.ReactNode> = {
  idle: <span className="w-2.5 h-2.5 rounded-full border border-[var(--status-idle)] opacity-40" />,
  queued: <span className="w-2.5 h-2.5 rounded-full border border-[var(--status-queued)] bg-[var(--status-queued)]/20" />,
  running: <Spinner size="sm" className="text-[var(--accent)]" />,
  done: (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: [0, 1.3, 1] }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-center w-2.5 h-2.5 rounded-full bg-[var(--status-done)]"
    >
      <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
        <path d="M1 3l1.5 1.5L5 1.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.span>
  ),
  error: (
    <span className="flex items-center justify-center w-2.5 h-2.5 rounded-full bg-[var(--status-error)]">
      <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
        <path d="M1.5 1.5l3 3M4.5 1.5l-3 3" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </span>
  ),
};

const STATUS_COLORS: Record<StageStatus, string> = {
  idle: "text-[var(--text-disabled)]",
  queued: "text-[var(--status-queued)]",
  running: "text-[var(--text-primary)]",
  done: "text-[var(--text-secondary)]",
  error: "text-[var(--status-error)]",
};

interface PipelineStageProps {
  stageId: StageId;
  status: StageStatus;
  durationMs?: number;
}

export function PipelineStage({ stageId, status, durationMs }: PipelineStageProps) {
  const def = STAGE_DEFS.find((s) => s.id === stageId);
  if (!def) return null;

  const isActive = status === "running" || status === "done";

  return (
    <AnimatePresence>
      <motion.div
        initial={status === "running" ? { x: -12, opacity: 0 } : false}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-md hover-transition",
          status === "running" && "bg-[var(--accent-subtle)] border border-[var(--accent)]/20",
          status === "done" && "bg-[var(--bg-surface-1)]",
          (status === "idle" || status === "queued") && "bg-transparent"
        )}
      >
        {/* Status icon */}
        <div className="flex-shrink-0 w-5 flex items-center justify-center">
          {STATUS_ICONS[status]}
        </div>

        {/* Stage info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className={cn("text-sm font-medium truncate", STATUS_COLORS[status])}>
              {def.name}
            </span>
            {durationMs !== undefined && status === "done" && (
              <span className="text-2xs text-[var(--text-tertiary)] font-mono flex-shrink-0">
                {formatDuration(durationMs)}
              </span>
            )}
            {status === "running" && (
              <span className="text-2xs text-[var(--accent)] font-mono animate-pulse flex-shrink-0">
                running
              </span>
            )}
          </div>
          {isActive && (
            <p className="text-xs text-[var(--text-tertiary)] truncate mt-0.5">
              {def.description}
            </p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
