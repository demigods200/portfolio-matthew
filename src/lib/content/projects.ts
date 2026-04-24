import type { Project } from "@/types/project";

export const EXPERIMENTS: Project[] = [
  {
    id: "transcript-pipeline",
    title: "AI Transcript Pipeline",
    company: "Atlassian (Loom)",
    description:
      "Async video-to-intelligence system: Whisper transcription → sentence chunking → pgvector embedding → semantic index. Designed for reliability under SQS-backed async load with Redis caching to cut repeat inference cost.",
    stack: ["Whisper", "SQS", "pgvector", "PostgreSQL", "Redis", "Node.js"],
    status: "production",
    impact: "Powers Loom AI summaries at scale",
  },
  {
    id: "hybrid-search",
    title: "Hybrid Search Engine",
    company: "Atlassian (Loom) · Blind",
    description:
      "Combined semantic (pgvector cosine similarity) and keyword (ElasticSearch BM25) retrieval with Reciprocal Rank Fusion. Built custom relevance scoring that outperformed pure-vector and pure-keyword baselines.",
    stack: ["ElasticSearch", "pgvector", "BM25", "RRF", "TypeScript"],
    status: "production",
    impact: "Measurably improved search relevance vs. baseline",
  },
  {
    id: "llm-streaming",
    title: "LLM Streaming UI",
    company: "Atlassian (Loom)",
    description:
      "Token-streaming pipeline with sub-500ms TTFB. SSE-based server → client delivery, Redis-backed deduplication cache for cost optimization, Zod-validated LLM output schemas for reliability.",
    stack: ["SSE", "Vercel AI SDK", "Redis", "Zod", "React", "Node.js"],
    status: "production",
    impact: "<500ms streaming start latency in production",
  },
  {
    id: "graphql-platform",
    title: "GraphQL Product Platform",
    company: "Citi Ventures (Worthi)",
    description:
      "Full-stack consumer platform built from 0 → production. GraphQL API with Apollo, Kafka event pipelines, async job workers, magic-link auth, and Terraform-managed GCP infrastructure with Datadog observability.",
    stack: ["GraphQL", "Apollo", "Kafka", "GCP", "Terraform", "Datadog"],
    status: "production",
    impact: "0 → production: full platform ownership",
  },
];
