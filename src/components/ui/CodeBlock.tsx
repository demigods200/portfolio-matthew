"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative group rounded-lg border border-[var(--border-subtle)] overflow-hidden", className)}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--bg-surface-2)] border-b border-[var(--border-subtle)]">
        <span className="text-2xs text-[var(--text-tertiary)] font-mono">
          {language ?? "text"}
        </span>
        <button
          onClick={handleCopy}
          className="text-2xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover-transition px-2 py-0.5 rounded"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>

      {/* Code body */}
      <pre className="overflow-x-auto bg-[var(--bg-surface-2)] p-4">
        <code className="font-mono text-xs text-[var(--text-secondary)] leading-relaxed whitespace-pre">
          {code}
        </code>
      </pre>
    </div>
  );
}
