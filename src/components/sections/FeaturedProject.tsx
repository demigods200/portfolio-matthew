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
              Document Intelligence Pipeline
            </h2>
            <p className="text-base text-[var(--text-secondary)] max-w-2xl">
              A real-time simulation of the AI pipeline I built at Loom — video
              transcript → chunk → embed → semantic index → query. Paste any text
              and watch it process live over SSE.
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
