import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { PipelineDemo } from "@/components/pipeline/PipelineDemo";

export function FeaturedProject() {
  return (
    <section id="projects" className="py-24 px-6 border-t border-[var(--border-subtle)]">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="flex flex-col gap-3 mb-8">
            <span className="section-label">Featured Project</span>
            <h2 className="text-3xl font-semibold text-[var(--text-primary)]">
              Agentic Document Processing
            </h2>
            <p className="text-base text-[var(--text-secondary)] max-w-2xl">
              A live simulation of the document processing agent I built at Loom
              — multi-step tool-use loop with per-stage structured output
              validation. Paste any text: watch it route through transcription,
              chunking, embedding, and retrieval in real time over SSE.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <PipelineDemo />
        </ScrollReveal>
      </div>
    </section>
  );
}
