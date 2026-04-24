export interface ArchNode {
  id: string;
  label: string;
  sublabel: string;
  x: number;
  y: number;
  tooltip: string;
}

export interface ArchEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
}

// SVG canvas: 860 x 420
export const ARCH_NODES: ArchNode[] = [
  {
    id: "client",
    label: "Client",
    sublabel: "Next.js / React",
    x: 60, y: 180,
    tooltip: "Browser client. Initiates recording upload and receives streaming SSE responses.",
  },
  {
    id: "api",
    label: "API Gateway",
    sublabel: "Node.js / Express",
    x: 220, y: 180,
    tooltip: "REST + GraphQL API layer. Auth via JWT, rate limiting, request validation.",
  },
  {
    id: "sqs",
    label: "SQS Queue",
    sublabel: "AWS SQS",
    x: 390, y: 90,
    tooltip: "Async job queue. Decouples video upload from AI processing. Handles backpressure during traffic spikes. Dead-letter queue for failed jobs.",
  },
  {
    id: "redis",
    label: "Redis",
    sublabel: "Cache / Pub-Sub",
    x: 390, y: 280,
    tooltip: "LLM response cache (TTL: 2h). Deduplicates identical inference requests. Also used for real-time SSE pub-sub.",
  },
  {
    id: "worker",
    label: "AI Worker",
    sublabel: "Node.js service",
    x: 560, y: 90,
    tooltip: "Consumes SQS jobs. Runs Whisper → chunking → embedding pipeline. Retries with exponential backoff.",
  },
  {
    id: "whisper",
    label: "Whisper",
    sublabel: "OpenAI API",
    x: 720, y: 30,
    tooltip: "Audio → transcript. Runs async in the worker. Output feeds directly into the chunking stage.",
  },
  {
    id: "llm",
    label: "LLM",
    sublabel: "GPT-4 / Streaming",
    x: 720, y: 150,
    tooltip: "Summarization and analysis. Responses streamed via SSE. Output validated via Zod schema before storage.",
  },
  {
    id: "pgvector",
    label: "pgvector",
    sublabel: "PostgreSQL + HNSW",
    x: 720, y: 280,
    tooltip: "Vector database for embeddings. HNSW index for ANN search. Cosine similarity queries < 10ms at scale.",
  },
  {
    id: "elastic",
    label: "ElasticSearch",
    sublabel: "BM25 keyword",
    x: 720, y: 380,
    tooltip: "Keyword search index. BM25 scoring. Combined with pgvector via Reciprocal Rank Fusion for hybrid search.",
  },
];

export const ARCH_EDGES: ArchEdge[] = [
  { id: "e1", from: "client", to: "api", label: "HTTPS" },
  { id: "e2", from: "api", to: "sqs", label: "enqueue" },
  { id: "e3", from: "api", to: "redis", label: "cache check" },
  { id: "e4", from: "sqs", to: "worker", label: "consume" },
  { id: "e5", from: "worker", to: "whisper", label: "audio" },
  { id: "e6", from: "worker", to: "llm", label: "prompt" },
  { id: "e7", from: "worker", to: "pgvector", label: "INSERT" },
  { id: "e8", from: "worker", to: "elastic", label: "index" },
  { id: "e9", from: "llm", to: "redis", label: "cache write" },
  { id: "e10", from: "redis", to: "client", label: "SSE stream" },
];
