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

// SVG canvas: 820 x 420  |  NODE_W=110  NODE_H=44
//
// Layout:
//
//  TOP ROW (y=50):   [API]  [SQS]  [Whisper]   ← upload & transcription chain
//  MID ROW (y=195):  [Client]  [Worker]  [LLM]  [pgvector]  [ElasticSearch]
//  BTM ROW (y=340):  [Redis]  [Eval]
//
//  Circuit: Client ↑ API → SQS → Whisper ↓ Worker → LLM → Redis → Client (SSE)
//           Worker also fans right to pgvector + ElasticSearch for storage
//           LLM drops to Eval for quality scoring

export const ARCH_NODES: ArchNode[] = [
  {
    id: "api",
    label: "API Gateway",
    sublabel: "Node.js / TypeScript",
    x: 10, y: 50,
    tooltip: "REST API layer. Accepts video upload, validates auth (JWT), enqueues an async transcription job to SQS, and returns a job ID to the client immediately.",
  },
  {
    id: "sqs",
    label: "SQS Queue",
    sublabel: "AWS SQS",
    x: 165, y: 50,
    tooltip: "Async job queue. Decouples video upload from AI processing — two separate job types: transcription jobs (audio → Whisper) and analysis jobs (transcript → Worker). Dead-letter queue for failed jobs. Absorbs upload spikes without blocking the API.",
  },
  {
    id: "whisper",
    label: "Whisper",
    sublabel: "Self-hosted ASR",
    x: 320, y: 50,
    tooltip: "Self-hosted Whisper (not the OpenAI API) — runs upstream at transcription time, before any LLM call. Consumes audio from SQS, transcribes at ~1× real-time, stores transcript to PostgreSQL, then enqueues an AI analysis job.",
  },
  {
    id: "client",
    label: "Client",
    sublabel: "Next.js / React",
    x: 10, y: 195,
    tooltip: "Browser client. Uploads video, polls for job status, then receives the final AI output (title, summary, chapters, action items) via SSE once the analysis pipeline completes.",
  },
  {
    id: "worker",
    label: "AI Worker",
    sublabel: "Node.js / Python",
    x: 165, y: 195,
    tooltip: "Reads transcript text from PostgreSQL — never handles audio or video. Orchestrates the analysis loop: routes to LLM for structured output, generates embeddings for pgvector, and indexes text for ElasticSearch. Per-step Zod validation before proceeding. Circuit breaker with exponential backoff.",
  },
  {
    id: "llm",
    label: "LLM Router",
    sublabel: "gpt-4o / gpt-4o-mini",
    x: 355, y: 195,
    tooltip: "Complexity-routed model selection. GPT-4o for technical/debate content; gpt-4o-mini for factual updates and short videos. Cascade fallback: mini output scored by Eval layer, falls back to gpt-4o if score < 0.78. Structured outputs via response_format JSON schema — title, summary, chapters, action items.",
  },
  {
    id: "pgvector",
    label: "pgvector",
    sublabel: "PostgreSQL + HNSW",
    x: 545, y: 195,
    tooltip: "Vector database for transcript embeddings. HNSW index for approximate nearest-neighbor search. Powers semantic search across past recordings — cosine similarity queries under 10ms at scale.",
  },
  {
    id: "elastic",
    label: "ElasticSearch",
    sublabel: "BM25 keyword",
    x: 700, y: 195,
    tooltip: "Keyword search index for transcript content. BM25 scoring. Combined with pgvector results via Reciprocal Rank Fusion for hybrid semantic + keyword search across all recorded meetings.",
  },
  {
    id: "redis",
    label: "Redis",
    sublabel: "Cache / Pub-Sub",
    x: 165, y: 340,
    tooltip: "LLM response cache keyed by transcript hash + model version (TTL: 2h) — deduplicates repeated processing. SSE pub-sub channel streams analysis results back to the client in real time as each output type completes.",
  },
  {
    id: "eval",
    label: "Eval Layer",
    sublabel: "Braintrust / CI gate",
    x: 355, y: 340,
    tooltip: "Multi-dimensional quality scoring via Braintrust: factual accuracy, topic coverage, speaker attribution. CI gate: runs against a 150-example golden dataset and blocks deploy if aggregate pass rate < 90%. Production: 5% of live traffic sampled continuously, scores streamed to Datadog per model version.",
  },
];

export const ARCH_EDGES: ArchEdge[] = [
  { id: "e1",  from: "client",   to: "api",      label: "upload"     },
  { id: "e2",  from: "api",      to: "sqs",      label: "enqueue"    },
  { id: "e3",  from: "sqs",      to: "whisper",  label: "transcribe" },
  { id: "e4",  from: "whisper",  to: "worker",   label: "transcript" },
  { id: "e5",  from: "worker",   to: "llm",      label: "text only"  },
  { id: "e6",  from: "worker",   to: "pgvector", label: "embed"      },
  { id: "e7",  from: "worker",   to: "elastic",  label: "index"      },
  { id: "e8",  from: "llm",      to: "redis",    label: "cache"      },
  { id: "e9",  from: "llm",      to: "eval",     label: "score"      },
  { id: "e10", from: "redis",    to: "client",   label: "SSE"        },
];
