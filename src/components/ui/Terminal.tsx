import { cn } from "@/lib/utils/cn";

interface TerminalProps {
  children?: React.ReactNode;
  className?: string;
  showCursor?: boolean;
  placeholder?: string;
}

export function Terminal({ children, className, showCursor = false, placeholder }: TerminalProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-4 font-mono text-xs overflow-auto",
        className
      )}
    >
      {children ?? (
        <span className="text-[var(--text-disabled)]">
          {placeholder ?? "Waiting for output…"}
          {showCursor && (
            <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-[var(--text-tertiary)] animate-cursor-blink align-middle" />
          )}
        </span>
      )}
    </div>
  );
}
