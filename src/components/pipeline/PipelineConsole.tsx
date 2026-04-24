"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePipelineStore } from "@/store/pipeline";
import { STAGE_ORDER } from "@/lib/pipeline/stages";
import type { LogLine } from "@/types/pipeline";

const LEVEL_COLORS: Record<LogLine["level"], string> = {
  info: "text-[var(--log-info)]",
  success: "text-[var(--log-success)]",
  warn: "text-[var(--log-warn)]",
  error: "text-[var(--log-error)]",
};

function formatTs(ts: number): string {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}.${String(d.getMilliseconds()).padStart(3, "0")}`;
}

export function PipelineConsole() {
  const logs = usePipelineStore((s) => s.logs);
  const runStatus = usePipelineStore((s) => s.runStatus);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Collect all log lines in stage order
  const allLines: LogLine[] = STAGE_ORDER.flatMap((id) => logs[id] ?? []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [allLines.length]);

  const isEmpty = allLines.length === 0;

  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] overflow-hidden">
      {/* Console header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--border-subtle)]">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--status-error)]/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--status-queued)]/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--status-done)]/60" />
        </div>
        <span className="text-2xs text-[var(--text-tertiary)] font-mono ml-1">pipeline.log</span>
      </div>

      {/* Log output */}
      <div ref={scrollRef} className="h-48 overflow-y-auto p-3 font-mono text-xs">
        {isEmpty ? (
          <div className="flex items-center gap-1.5 text-[var(--text-disabled)]">
            <span className="text-[var(--text-tertiary)]">$</span>
            Waiting for pipeline run
            {runStatus === "idle" && (
              <span className="inline-block w-1.5 h-3 ml-0.5 bg-[var(--text-disabled)] animate-cursor-blink" />
            )}
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {allLines.map((line) => (
              <motion.div
                key={line.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="flex gap-2 leading-5"
              >
                <span className="text-[var(--log-meta)] flex-shrink-0 select-none">
                  {formatTs(line.ts)}
                </span>
                <span className="text-[var(--log-meta)] flex-shrink-0 select-none">
                  [{line.stageId}]
                </span>
                <span className={LEVEL_COLORS[line.level]}>{line.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={bottomRef} aria-hidden />
      </div>
    </div>
  );
}
