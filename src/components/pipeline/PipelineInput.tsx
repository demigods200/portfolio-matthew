"use client";

import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { usePipelineStore } from "@/store/pipeline";
import { usePipeline } from "@/hooks/usePipeline";

const MAX_CHARS = 5000;

const SAMPLE_TEXT = `Loom's AI summarization pipeline processes thousands of video transcripts daily. When a user records a video, it enters an async queue backed by AWS SQS. A worker service picks up the job, runs Whisper transcription, then chunks the resulting text at sentence boundaries. Each chunk is embedded using OpenAI's text-embedding-3-large model, producing 1536-dimensional vectors stored in pgvector. At query time, we combine semantic similarity search with ElasticSearch BM25 keyword matching using Reciprocal Rank Fusion to surface the most relevant transcript segments. The entire pipeline is designed for reliability: failed jobs retry with exponential backoff, embeddings are cached in Redis to avoid redundant inference costs, and all LLM outputs are validated through Zod schemas before storage.`;

export function PipelineInput() {
  const inputText = usePipelineStore((s) => s.inputText);
  const setInputText = usePipelineStore((s) => s.setInputText);
  const { runStatus, startPipeline, resetPipeline } = usePipeline();

  const isRunning = runStatus === "running";
  const isComplete = runStatus === "complete" || runStatus === "error";
  const isEmpty = inputText.trim().length === 0;

  const handleSubmit = () => {
    if (isEmpty || isRunning) return;
    void startPipeline(inputText);
  };

  const handleSample = () => {
    setInputText(SAMPLE_TEXT);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Textarea */}
      <div className="relative">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value.slice(0, MAX_CHARS))}
          disabled={isRunning}
          placeholder="Paste a document or transcript to process…"
          rows={5}
          className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-disabled)] resize-none focus:outline-none focus:border-[var(--border-default)] hover-transition disabled:opacity-50"
        />
        <span className="absolute bottom-3 right-3 text-2xs text-[var(--text-disabled)] font-mono select-none">
          {inputText.length} / {MAX_CHARS}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {isComplete ? (
          <Button variant="ghost" size="md" onClick={resetPipeline}>
            Reset
          </Button>
        ) : (
          <>
            <Button
              variant="primary"
              size="md"
              onClick={handleSubmit}
              disabled={isEmpty || isRunning}
            >
              {isRunning ? (
                <>
                  <Spinner size="sm" />
                  Running…
                </>
              ) : (
                "Run Pipeline →"
              )}
            </Button>
            {!isRunning && (
              <Button variant="subtle" size="md" onClick={handleSample}>
                Load sample
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
