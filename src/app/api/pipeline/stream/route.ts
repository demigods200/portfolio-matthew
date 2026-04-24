import { NextRequest } from "next/server";
import { chunkText } from "@/lib/pipeline/chunker";
import { generateEmbeddings } from "@/lib/pipeline/embeddings";
import { topK } from "@/lib/pipeline/scorer";
import { sleep, jitter } from "@/lib/utils/sleep";
import { STAGE_DEFS, stageDuration } from "@/lib/pipeline/stages";
import type { PipelineEvent } from "@/types/pipeline";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function encode(event: PipelineEvent): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(event)}\n\n`);
}

export async function POST(req: NextRequest) {
  let inputText: string;

  try {
    const body = await req.json() as { text?: unknown };
    if (typeof body.text !== "string" || body.text.trim().length === 0) {
      return new Response("Missing text", { status: 400 });
    }
    inputText = body.text.trim();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const emit = (event: PipelineEvent) => {
        controller.enqueue(encode(event));
      };

      try {
        // ─── Stage 1: Ingestion ───────────────────────────────────
        const ingestionDef = STAGE_DEFS.find((s) => s.id === "ingestion")!;
        const ingestionDuration = stageDuration(ingestionDef);
        const ingestionStart = Date.now();

        emit({ type: "stage_start", stageId: "ingestion", ts: ingestionStart });
        await sleep(jitter(200, 100));

        emit({ type: "log", stageId: "ingestion", level: "info",
          text: `Received ${inputText.length.toLocaleString()} characters`, ts: Date.now() });
        await sleep(jitter(200, 100));

        const wordCount = inputText.split(/\s+/).filter(Boolean).length;
        emit({ type: "log", stageId: "ingestion", level: "info",
          text: `Word count: ${wordCount.toLocaleString()}`, ts: Date.now() });
        await sleep(jitter(150, 100));

        emit({ type: "log", stageId: "ingestion", level: "info",
          text: "Language detection: en (confidence: 0.98)", ts: Date.now() });
        await sleep(jitter(150, 100));

        const docId = `doc_${Buffer.from(inputText.slice(0, 16)).toString("hex").slice(0, 8)}`;
        emit({ type: "log", stageId: "ingestion", level: "success",
          text: `Document ID assigned: ${docId}`, ts: Date.now() });
        await sleep(ingestionDuration - 700);

        emit({ type: "stage_complete", stageId: "ingestion", ts: Date.now(),
          durationMs: Date.now() - ingestionStart });

        // ─── Stage 2: Chunking ────────────────────────────────────
        const chunkingStart = Date.now();

        emit({ type: "stage_start", stageId: "chunking", ts: chunkingStart });
        await sleep(jitter(80, 50));

        emit({ type: "log", stageId: "chunking", level: "info",
          text: "Splitting at sentence boundaries (regex: /(?<=[.!?])\\s+(?=[A-Z])/)", ts: Date.now() });
        await sleep(jitter(150, 80));

        const chunks = chunkText(inputText);

        emit({ type: "log", stageId: "chunking", level: "info",
          text: `Overlap window: 20% (${Math.ceil(chunks.length * 0.2)} sentence lookback)`, ts: Date.now() });
        await sleep(jitter(100, 50));

        emit({ type: "log", stageId: "chunking", level: "success",
          text: `Produced ${chunks.length} chunks (avg ~${Math.round(chunks.reduce((s, c) => s + c.tokenEstimate, 0) / Math.max(1, chunks.length))} tokens each)`, ts: Date.now() });
        await sleep(jitter(100, 50));

        emit({ type: "chunks", payload: chunks });

        emit({ type: "stage_complete", stageId: "chunking", ts: Date.now(),
          durationMs: Date.now() - chunkingStart });

        // ─── Stage 3: Embedding ───────────────────────────────────
        const embeddingDef = STAGE_DEFS.find((s) => s.id === "embedding")!;
        const embeddingStart = Date.now();
        const embeddingDuration = stageDuration(embeddingDef);

        emit({ type: "stage_start", stageId: "embedding", ts: embeddingStart });
        await sleep(jitter(100, 50));

        emit({ type: "log", stageId: "embedding", level: "info",
          text: `Model: text-embedding-3-large (1536 dims)`, ts: Date.now() });
        await sleep(jitter(100, 50));

        emit({ type: "log", stageId: "embedding", level: "info",
          text: `Batch size: ${Math.min(chunks.length, 8)} chunks/request`, ts: Date.now() });

        // Emit progress sub-events during the expensive embedding step
        const progressSteps = Math.min(chunks.length, 4);
        const stepMs = Math.floor(embeddingDuration / (progressSteps + 1));

        for (let i = 0; i < progressSteps; i++) {
          await sleep(stepMs);
          const processed = Math.floor(((i + 1) / progressSteps) * chunks.length);
          emit({ type: "embedding_progress", processed, total: chunks.length });
          emit({ type: "log", stageId: "embedding", level: "info",
            text: `Embedded ${processed}/${chunks.length} chunks…`, ts: Date.now() });
        }

        const embeddings = generateEmbeddings(chunks);
        await sleep(stepMs);

        emit({ type: "log", stageId: "embedding", level: "success",
          text: `All ${chunks.length} embeddings ready. t-SNE projection: 1536→2D`, ts: Date.now() });

        emit({ type: "embeddings", payload: embeddings });
        emit({ type: "stage_complete", stageId: "embedding", ts: Date.now(),
          durationMs: Date.now() - embeddingStart });

        // ─── Stage 4: Semantic Indexing ───────────────────────────
        const indexingStart = Date.now();

        emit({ type: "stage_start", stageId: "indexing", ts: indexingStart });
        await sleep(jitter(80, 50));

        emit({ type: "log", stageId: "indexing", level: "info",
          text: `INSERT INTO embeddings (doc_id, chunk_id, vector) VALUES ...`, ts: Date.now() });
        await sleep(jitter(150, 80));

        emit({ type: "log", stageId: "indexing", level: "info",
          text: `Building HNSW index (m=16, ef_construction=64)`, ts: Date.now() });
        await sleep(jitter(200, 100));

        emit({ type: "log", stageId: "indexing", level: "info",
          text: `Index size: ${chunks.length} vectors @ 1536 dims`, ts: Date.now() });
        await sleep(jitter(150, 80));

        emit({ type: "log", stageId: "indexing", level: "success",
          text: `pgvector index ready. HNSW build: ${jitter(120, 40)}ms`, ts: Date.now() });
        await sleep(jitter(100, 60));

        emit({ type: "stage_complete", stageId: "indexing", ts: Date.now(),
          durationMs: Date.now() - indexingStart });

        // ─── Stage 5: Query Ready ─────────────────────────────────
        const readyDef = STAGE_DEFS.find((s) => s.id === "ready")!;
        const readyStart = Date.now();
        const readyDuration = stageDuration(readyDef);

        emit({ type: "stage_start", stageId: "ready", ts: readyStart });
        await sleep(jitter(60, 40));

        // Run demo query automatically
        const demoQuery = "What is the main topic of this document?";
        const results = topK(demoQuery, chunks, embeddings, 3);

        emit({ type: "log", stageId: "ready", level: "info",
          text: `Auto-query: "${demoQuery}"`, ts: Date.now() });
        await sleep(jitter(80, 40));

        emit({ type: "log", stageId: "ready", level: "success",
          text: `Returned ${results.length} results (cosine similarity). Index latency: ${jitter(8, 5)}ms`, ts: Date.now() });
        await sleep(readyDuration - 140);

        emit({ type: "search_results", payload: results });
        emit({ type: "stage_complete", stageId: "ready", ts: Date.now(),
          durationMs: Date.now() - readyStart });

        emit({ type: "done" });
      } catch (err) {
        emit({ type: "error", message: String(err) });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-store, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
