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
              self-hosted Whisper upstream for transcription, async job queue
              decoupling, text-only OpenAI GPT for structured analysis
              (title, summary, chapters, action items), and Braintrust eval
              gates in CI and production. Hover any node for implementation
              detail.
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
              { label: "Upstream transcription", detail: "Self-hosted Whisper runs at upload time — before any LLM call" },
              { label: "Text-only LLM",          detail: "OpenAI GPT receives transcript text, never audio or video" },
              { label: "Async decoupling",       detail: "Job queue separates transcription from AI analysis" },
              { label: "Eval gates",             detail: "Braintrust CI gate blocks deploys on quality regression" },
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
