import type { Project } from "@/types/project";

export const EXPERIMENTS: Project[] = [
  {
    id: "transcript-pipeline",
    title: "AI Transcript Pipeline",
    company: "Atlassian (Loom)",
    description:
      "Async video-to-intelligence system: Whisper transcription → sentence chunking → pgvector embedding → semantic index. SQS-backed async processing for reliability under load, Redis inference caching for cost control, structured outputs via Zod as the contract between pipeline stages.",
    stack: ["Whisper", "SQS", "pgvector", "PostgreSQL", "Redis", "Node.js"],
    status: "production",
    impact: "Powers Loom AI summaries at scale",
  },
  {
    id: "hybrid-search",
    title: "Hybrid Search Engine",
    company: "Atlassian (Loom) · Blind",
    description:
      "Combined semantic (pgvector cosine similarity) and keyword (ElasticSearch BM25) retrieval with Reciprocal Rank Fusion. Built as the retrieval layer for Loom's RAG pipeline — quality measured by offline NDCG evaluation against human-labeled relevance judgments.",
    stack: ["ElasticSearch", "pgvector", "BM25", "RRF", "TypeScript"],
    status: "production",
    impact: "Measurable NDCG improvement vs. both baselines",
  },
  {
    id: "eval-observability",
    title: "LLM Eval & Observability Platform",
    company: "Atlassian (Loom)",
    description:
      "Multi-dimensional eval suite for production LLM outputs: LLM-as-judge scoring across factual accuracy, topic coverage, and speaker attribution. CI gate blocks deploys when pass rate drops below threshold. 5% of production traffic sampled continuously — scores streamed to Datadog with per-model breakdowns.",
    stack: ["Python", "GPT-4o", "Datadog", "PostgreSQL", "GitHub Actions", "Node.js"],
    status: "production",
    impact: "Caught 2 model regressions before reaching users · 150-example golden dataset",
  },
  {
    id: "video-intelligence-worker",
    title: "Video Intelligence Worker",
    company: "Atlassian (Loom)",
    description:
      "Resilient multi-step processing system for video content intelligence: orchestrates Whisper transcription, topic extraction, action item detection, and cross-video entity linking through a structured pipeline with circuit breakers, per-step timeouts, and exponential-backoff retry logic. Each stage validates output via Zod before proceeding.",
    stack: ["TypeScript", "SQS", "Redis", "PostgreSQL", "Zod", "Node.js"],
    status: "production",
    impact: "Multi-step processing with <0.5% unrecoverable failure rate",
  },
];
