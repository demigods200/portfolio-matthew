"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePipelineStore } from "@/store/pipeline";
import { topK } from "@/lib/pipeline/scorer";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { truncate } from "@/lib/utils/format";

export function SemanticSearch() {
  const stages = usePipelineStore((s) => s.stages);
  const chunks = usePipelineStore((s) => s.chunks);
  const embeddings = usePipelineStore((s) => s.embeddings);
  const defaultResults = usePipelineStore((s) => s.searchResults);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState(defaultResults);
  const [isSearching, setIsSearching] = useState(false);

  const isReady = stages.ready?.status === "done";
  if (!isReady) return null;

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    // Simulate network latency
    await new Promise((r) => setTimeout(r, 200));
    const found = topK(query, chunks, embeddings, 3);
    setResults(found);
    setIsSearching(false);
  };

  const displayResults = results.length > 0 ? results : defaultResults;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-2xs text-[var(--text-tertiary)] font-mono uppercase tracking-widest">
          Semantic search
        </span>
        <p className="text-xs text-[var(--text-secondary)]">
          Query the indexed document using cosine similarity.
        </p>
      </div>

      {/* Search input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") void handleSearch(); }}
          placeholder="Ask a question about this document…"
          className="flex-1 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-disabled)] focus:outline-none focus:border-[var(--border-default)] hover-transition"
        />
        <Button
          variant="ghost"
          size="md"
          onClick={() => void handleSearch()}
          disabled={!query.trim() || isSearching}
        >
          {isSearching ? <Spinner size="sm" /> : "Search"}
        </Button>
      </div>

      {/* Results */}
      {displayResults.length > 0 && (
        <div className="flex flex-col gap-2">
          {displayResults.map((result, i) => (
            <motion.div
              key={result.chunk.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-3"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-2xs font-mono text-[var(--text-tertiary)]">
                  {result.chunk.id}
                </span>
                <span className="text-2xs font-mono text-[var(--accent)]">
                  {Math.round(result.score * 100)}% match
                </span>
              </div>

              {/* Score bar */}
              <div className="h-0.5 bg-[var(--bg-surface-3)] rounded-full mb-2.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.score * 100}%` }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-[var(--accent)] rounded-full"
                />
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {truncate(result.chunk.text, 140)}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
