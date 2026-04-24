import { cn } from "@/lib/utils/cn";

interface GlowBorderProps {
  children: React.ReactNode;
  className?: string;
}

export function GlowBorder({ children, className }: GlowBorderProps) {
  return (
    <div className={cn("relative rounded-lg p-px overflow-hidden", className)}>
      {/* Rotating glow layer */}
      <div
        className="absolute inset-0 rounded-lg animate-glow-rotate"
        style={{
          background:
            "conic-gradient(from var(--glow-angle), transparent 0deg, var(--accent) 60deg, transparent 120deg)",
          opacity: 0.5,
        }}
      />
      {/* Inner content */}
      <div className="relative rounded-[calc(8px-1px)] bg-[var(--bg-surface-1)]">
        {children}
      </div>
    </div>
  );
}
