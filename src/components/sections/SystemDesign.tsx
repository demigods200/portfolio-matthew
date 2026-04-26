import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ArchitectureDiagram } from "@/components/architecture/ArchitectureDiagram";

export function SystemDesign() {
  return (
    <section id="system-design" className="py-24 px-6 border-t border-[var(--border-subtle)]">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="flex flex-col gap-3 mb-10">
            <span className="section-label">System Design</span>
            <h2 className="text-3xl font-semibold text-[var(--text-primary)]">
              The Loom AI Pipeline
            </h2>
            <p className="text-base text-[var(--text-secondary)] max-w-2xl">
              Architecture of the production AI system I built at Loom —
              SQS-backed async processing, complexity-routed LLM calls
              (gpt-4o / gpt-4o-mini cascade), inline eval scoring for quality
              gates, and pgvector + ElasticSearch hybrid retrieval. Hover any
              node for implementation detail.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-6">
            <ArchitectureDiagram />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={160}>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Async decoupling", detail: "SQS queue absorbs upload spikes" },
              { label: "Model routing",   detail: "Complexity-aware gpt-4o / gpt-4o-mini cascade" },
              { label: "Hybrid search",   detail: "pgvector + BM25 via RRF fusion" },
              { label: "Eval gates",      detail: "CI blocks deploys on quality regression" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] px-4 py-3"
              >
                <p className="text-xs font-medium text-[var(--text-primary)] mb-0.5">
                  {item.label}
                </p>
                <p className="text-xs text-[var(--text-tertiary)]">{item.detail}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
