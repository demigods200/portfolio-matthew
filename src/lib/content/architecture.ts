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

// SVG canvas: 820 x 420
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
    x: 390, y: 80,
    tooltip: "Async job queue. Decouples video upload from AI processing. Handles backpressure during traffic spikes. Dead-letter queue for failed jobs.",
  },
  {
    id: "redis",
    label: "Redis",
    sublabel: "Cache / Pub-Sub",
    x: 390, y: 290,
    tooltip: "LLM response cache (TTL: 2h) keyed by content hash + model version. Deduplicates requests across model variants. SSE pub-sub for real-time streaming. Router decision cache: complexity classification cached per transcript fingerprint.",
  },
  {
    id: "worker",
    label: "AI Worker",
    sublabel: "Node.js service",
    x: 555, y: 80,
    tooltip: "Orchestrates agent loop: Whisper → chunking → embedding → LLM routing → eval scoring. Circuit breaker: 3 retries with exponential backoff, dead-letter queue on final failure. Per-step Zod validation before proceeding.",
  },
  {
    id: "eval",
    label: "Eval Layer",
    sublabel: "LLM-as-judge / CI gate",
    x: 555, y: 250,
    tooltip: "Multi-dimensional quality scoring: factual accuracy, topic coverage, speaker attribution. CI mode: runs against 150-example golden dataset — blocks deploy if pass rate < 90%. Production: samples 5% of live traffic continuously, scores to Datadog.",
  },
  {
    id: "whisper",
    label: "Whisper",
    sublabel: "OpenAI API",
    x: 715, y: 20,
    tooltip: "Audio → transcript. Runs async in the worker. Output feeds directly into the chunking stage.",
  },
  {
    id: "llm",
    label: "LLM Router",
    sublabel: "gpt-4o / gpt-4o-mini",
    x: 715, y: 140,
    tooltip: "Complexity-routed model selection: gpt-4o for technical/debate content, gpt-4o-mini for factual updates. Quality-gated cascade: mini output scored by eval layer, falls back to gpt-4o if score < 0.78. Structured outputs via response_format JSON schema.",
  },
  {
    id: "pgvector",
    label: "pgvector",
    sublabel: "PostgreSQL + HNSW",
    x: 715, y: 280,
    tooltip: "Vector database for embeddings. HNSW index for ANN search. Cosine similarity queries < 10ms at scale.",
  },
  {
    id: "elastic",
    label: "ElasticSearch",
    sublabel: "BM25 keyword",
    x: 715, y: 380,
    tooltip: "Keyword search index. BM25 scoring. Combined with pgvector via Reciprocal Rank Fusion for hybrid search.",
  },
];

export const ARCH_EDGES: ArchEdge[] = [
  { id: "e1",  from: "client",  to: "api",      label: "HTTPS"      },
  { id: "e2",  from: "api",     to: "sqs",      label: "enqueue"    },
  { id: "e3",  from: "api",     to: "redis",    label: "cache check"},
  { id: "e4",  from: "sqs",     to: "worker",   label: "consume"    },
  { id: "e5",  from: "worker",  to: "whisper",  label: "audio"      },
  { id: "e6",  from: "worker",  to: "llm",      label: "route"      },
  { id: "e7",  from: "worker",  to: "pgvector", label: "INSERT"     },
  { id: "e8",  from: "worker",  to: "elastic",  label: "index"      },
  { id: "e9",  from: "llm",     to: "redis",    label: "cache write"},
  { id: "e10", from: "redis",   to: "client",   label: "SSE stream" },
  { id: "e11", from: "llm",     to: "eval",     label: "score"      },
  { id: "e12", from: "eval",    to: "redis",    label: "log"        },
];
