"use client";

import { cn } from "@/lib/utils/cn";
import { useScrollSpy } from "@/hooks/useScrollSpy";

const NAV_LINKS = [
  { label: "Projects", href: "projects" },
  { label: "System Design", href: "system-design" },
  { label: "Experiments", href: "experiments" },
  { label: "How I Build", href: "how-i-build" },
];

const SECTION_IDS = NAV_LINKS.map((l) => l.href);

export function Header() {
  const activeId = useScrollSpy(["hero", ...SECTION_IDS]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/80 backdrop-blur-md">
      <div className="mx-auto w-full max-w-6xl px-6 flex items-center justify-between">
        {/* Monogram */}
        <a
          href="#hero"
          className="font-sans font-semibold text-sm text-[var(--text-primary)] hover:text-[var(--accent)] hover-transition"
        >
          MW
        </a>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={`#${link.href}`}
              className={cn(
                "text-sm hover-transition",
                activeId === link.href
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Availability indicator */}
        <a
          href="mailto:matthewjwu93@gmail.com"
          className="hidden md:inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover-transition"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-done)] animate-pulse" />
          Available
        </a>
      </div>
    </header>
  );
}
