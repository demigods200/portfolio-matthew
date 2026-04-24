"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GlowBorder } from "@/components/ui/GlowBorder";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";

const HEADLINE = "I turn AI capabilities into reliable product systems.";
const WORDS = HEADLINE.split(" ");

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const word = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE },
  },
};

function AnimatedMetric({
  value,
  suffix = "",
  label,
  delay = 0,
}: {
  value: number;
  suffix?: string;
  label: string;
  delay?: number;
}) {
  const count = useAnimatedCounter(value, 1200, delay);
  return (
    <div className="flex flex-col items-center gap-1 px-3 sm:px-6 py-4">
      <span className="font-mono text-xl sm:text-2xl font-semibold text-[var(--text-primary)] tabular-nums">
        {count}{suffix}
      </span>
      <span className="text-xs text-[var(--text-tertiary)] text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center pt-14 pb-16 px-6"
    >
      <div className="max-w-3xl w-full flex flex-col items-start gap-6 md:gap-8">
        {/* Availability badge */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Badge variant="success" dot>
            Available for senior roles
          </Badge>
        </motion.div>

        {/* Headline — DM Serif Display */}
        <motion.h1
          className="font-display text-4xl md:text-5xl lg:text-6xl text-[var(--text-primary)]"
          variants={container}
          initial="hidden"
          animate="visible"
          aria-label={HEADLINE}
        >
          {WORDS.map((w, i) => (
            <motion.span
              key={i}
              variants={word}
              className="inline-block mr-[0.28em]"
            >
              {/* "reliable product systems" gets accent treatment */}
              {i >= WORDS.length - 3 ? (
                <span
                  style={{
                    background: "linear-gradient(135deg, var(--accent-hover) 0%, var(--text-primary) 60%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {w}
                </span>
              ) : (
                w
              )}
            </motion.span>
          ))}
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          className="text-base md:text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        >
          Senior engineer at{" "}
          <span className="text-[var(--text-primary)]">Atlassian (Loom)</span>{" "}
          — building LLM pipelines, hybrid search, and real-time AI experiences
          at scale.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap items-center gap-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.65 }}
        >
          <Button variant="primary" size="md" onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}>
            View Projects
          </Button>
          <Button variant="ghost" size="md" onClick={() => document.getElementById("system-design")?.scrollIntoView({ behavior: "smooth" })}>
            See System Design
          </Button>
        </motion.div>

        {/* Metrics row */}
        <motion.div
          className="w-full mt-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
        >
          <GlowBorder>
            <div className="grid grid-cols-3 divide-x divide-[var(--border-subtle)]">
              <AnimatedMetric value={8} suffix="+" label="Years shipping product" delay={900} />
              <AnimatedMetric value={3} label="AI pipelines in production" delay={1000} />
              <div className="flex flex-col items-center gap-1 px-3 sm:px-6 py-4">
                <span className="font-mono text-xl sm:text-2xl font-semibold text-[var(--text-primary)]">
                  &lt;500ms
                </span>
                <span className="text-xs text-[var(--text-tertiary)] text-center leading-tight">
                  Streaming start latency
                </span>
              </div>
            </div>
          </GlowBorder>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <div className="w-px h-8 bg-gradient-to-b from-[var(--border-default)] to-transparent" />
        <span className="section-label">Scroll</span>
      </motion.div>
    </section>
  );
}
