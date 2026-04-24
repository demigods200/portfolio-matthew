export function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] py-10 mt-24">
      <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            Matthew Wu
          </span>
          <span className="text-xs text-[var(--text-tertiary)]">
            Senior Software Engineer · Full Stack & AI Systems · New York, NY
          </span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="mailto:matthewjwu93@gmail.com"
            className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover-transition"
          >
            matthewjwu93@gmail.com
          </a>
          <a
            href="https://github.com/matthewwu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover-transition"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/matthewwu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover-transition"
          >
            LinkedIn
          </a>
        </div>

        <span className="text-xs text-[var(--text-disabled)]">
          Built with Next.js · {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
}
