import { Badge } from "@/components/ui/Badge";
import { Tag } from "@/components/ui/Tag";
import type { Project } from "@/types/project";

const statusVariant = {
  production: "success",
  archived: "default",
  experiment: "warning",
} as const;

interface ExperimentCardProps {
  project: Project;
}

export function ExperimentCard({ project }: ExperimentCardProps) {
  return (
    <div className="group flex flex-col gap-4 p-5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] card-hover hover-transition">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-[var(--text-primary)] leading-snug">
          {project.title}
        </h3>
        <Badge variant={statusVariant[project.status]} className="flex-shrink-0 capitalize">
          {project.status}
        </Badge>
      </div>

      {/* Company */}
      <span className="text-xs text-[var(--text-tertiary)] -mt-2">
        {project.company}
      </span>

      {/* Description */}
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1">
        {project.description}
      </p>

      {/* Impact */}
      {project.impact && (
        <p className="text-xs text-[var(--accent-hover)] font-mono">
          → {project.impact}
        </p>
      )}

      {/* Stack tags */}
      <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
        {project.stack.map((tech) => (
          <Tag key={tech}>{tech}</Tag>
        ))}
      </div>
    </div>
  );
}
