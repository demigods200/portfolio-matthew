import type { Chunk, EmbeddingPoint, SearchResult } from "@/types/pipeline";
import { generateEmbeddingPoint } from "./embeddings";

// Euclidean distance in 2D projected space → converted to similarity score
function similarity(a: EmbeddingPoint, b: EmbeddingPoint): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  // Convert distance [0, √2] to similarity [0, 1]
  return Math.max(0, 1 - distance / Math.SQRT2);
}

export function topK(
  query: string,
  chunks: Chunk[],
  embeddings: EmbeddingPoint[],
  k: number = 3
): SearchResult[] {
  if (chunks.length === 0 || embeddings.length === 0) return [];

  // Generate a query embedding (same deterministic approach)
  const queryChunk: Chunk = {
    id: "query",
    text: query,
    start: 0,
    end: query.length,
    tokenEstimate: Math.ceil(query.length / 4),
  };
  const queryEmbedding = generateEmbeddingPoint(queryChunk, 1, 0);

  // Score each chunk
  const scored = chunks.map((chunk) => {
    const embedding = embeddings.find((e) => e.chunkId === chunk.id);
    if (!embedding) return { chunk, score: 0 };
    const rawScore = similarity(queryEmbedding, embedding);
    // Add a small positional bias so scores spread nicely in the demo
    const positionalBoost = 0.1 * Math.random();
    return { chunk, score: Math.min(0.99, rawScore + positionalBoost) };
  });

  // Sort descending, take top k
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
