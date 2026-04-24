import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ExperimentCard } from "@/components/experiments/ExperimentCard";
import { EXPERIMENTS } from "@/lib/content/projects";

export function Experiments() {
  return (
    <section id="experiments" className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="flex flex-col gap-3 mb-12">
            <span className="section-label">Experiments</span>
            <h2 className="text-3xl font-semibold text-[var(--text-primary)]">
              Production AI Systems
            </h2>
            <p className="text-base text-[var(--text-secondary)] max-w-xl">
              Systems built at Atlassian (Loom), Blind, and Citi Ventures —
              each solving a real reliability or performance constraint.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EXPERIMENTS.map((project, i) => (
            <ScrollReveal key={project.id} delay={i * 80}>
              <ExperimentCard project={project} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
