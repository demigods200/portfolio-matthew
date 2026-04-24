import { cn } from "@/lib/utils/cn";

interface TagProps {
  children: React.ReactNode;
  className?: string;
}

export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-2xs font-mono",
        "bg-[var(--bg-surface-2)] text-[var(--text-tertiary)]",
        "border border-[var(--border-subtle)]",
        className
      )}
    >
      {children}
    </span>
  );
}
