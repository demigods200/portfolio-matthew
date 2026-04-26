"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Badge } from "@/components/ui/Badge";
import { PROMPT_STORIES } from "@/lib/content/iterations";
import { cn } from "@/lib/utils/cn";

const OUTCOME_VARIANT = {
  failure: "error",
  partial: "warning",
  success: "success",
} as const;

export function HowIBuild() {
  const [activeStory, setActiveStory] = useState(0);
  const story = PROMPT_STORIES[activeStory];

  if (!story) return null;

  return (
    <section id="how-i-build" className="py-24 px-6 border-t border-[var(--border-subtle)]">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="flex flex-col gap-3 mb-10">
            <span className="section-label">How I Build with AI</span>
            <h2 className="text-3xl font-semibold text-[var(--text-primary)]">
              Engineering AI Systems That Stay Correct
            </h2>
            <p className="text-base text-[var(--text-secondary)] max-w-2xl">
              Shipping an AI feature is the easy part. Keeping it correct at
              scale — across model updates, edge cases, and traffic spikes — is
              the engineering challenge. These are three production problems from
              Loom, each requiring a different layer of the stack: eval
              infrastructure, model routing, and retrieval architecture.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          {/* Story tabs */}
          <div className="flex flex-wrap gap-1 p-1 rounded-lg bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] w-fit max-w-full mb-8">
            {PROMPT_STORIES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActiveStory(i)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs sm:text-sm hover-transition whitespace-nowrap",
                  activeStory === i
                    ? "bg-[var(--bg-surface-3)] text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                {s.title}
              </button>
            ))}
          </div>

          {/* Story content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-6"
            >
              {/* Context */}
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl border-l-2 border-[var(--border-default)] pl-4">
                {story.context}
              </p>

              {/* Iteration steps */}
              <div className="flex flex-col gap-4">
                {story.steps.map((step) => (
                  <div
                    key={step.version}
                    className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] overflow-hidden"
                  >
                    {/* Step header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-2)]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-[var(--accent)]">
                          {step.version}
                        </span>
                        <span className="text-xs text-[var(--text-secondary)]">
                          {step.label}
                        </span>
                      </div>
                      <Badge variant={OUTCOME_VARIANT[step.outcomeType]}>
                        {step.outcomeType}
                      </Badge>
                    </div>

                    {/* Prompt */}
                    <CodeBlock
                      code={step.prompt}
                      language={step.language ?? "python"}
                      className="rounded-none border-0 border-b border-[var(--border-subtle)]"
                    />

                    {/* Outcome */}
                    <div className="px-4 py-3">
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        <span className="text-[var(--text-tertiary)] mr-1.5">→</span>
                        {step.outcome}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Final result */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[var(--status-done)]/20 bg-[var(--status-done)]/5">
                <span className="text-[var(--status-done)] text-xs font-mono">result</span>
                <span className="text-sm text-[var(--text-primary)]">{story.result}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </ScrollReveal>
      </div>
    </section>
  );
}
