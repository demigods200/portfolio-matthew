import { cn } from "@/lib/utils/cn";

type BadgeVariant = "default" | "success" | "warning" | "accent" | "error";

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[var(--bg-surface-2)] text-[var(--text-secondary)] border-[var(--border-subtle)]",
  success: "bg-[#16a34a]/10 text-[#4ade80] border-[#16a34a]/20",
  warning: "bg-[#b45309]/10 text-[#fbbf24] border-[#b45309]/20",
  accent:  "bg-[var(--accent)]/10 text-[var(--accent-hover)] border-[var(--accent)]/20",
  error:   "bg-[#dc2626]/10 text-[#f87171] border-[#dc2626]/20",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-[var(--text-disabled)]",
  success: "bg-[#4ade80]",
  warning: "bg-[#fbbf24]",
  accent:  "bg-[var(--accent-hover)]",
  error:   "bg-[#f87171]",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

export function Badge({ children, variant = "default", dot = false, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-2xs font-medium border",
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dotColors[variant])} />
      )}
      {children}
    </span>
  );
}
