interface MetricProps {
  value: string;
  label: string;
}

export function Metric({ value, label }: MetricProps) {
  return (
    <div className="flex flex-col items-center gap-1 px-6 py-4">
      <span className="font-mono text-3xl font-semibold text-[var(--text-primary)] tabular-nums">
        {value}
      </span>
      <span className="text-xs text-[var(--text-tertiary)] text-center leading-tight">
        {label}
      </span>
    </div>
  );
}
