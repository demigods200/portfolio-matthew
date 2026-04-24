import type { Chunk, EmbeddingPoint } from "@/types/pipeline";

// djb2 hash — deterministic from string
function djb2(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) + hash + char;
    hash = hash & hash; // Convert to 32-bit int
  }
  return Math.abs(hash);
}

// Linear congruential generator seeded from hash
function lcg(seed: number) {
  let state = seed;
  return () => {
    state = (1664525 * state + 1013904223) & 0xffffffff;
    return (state >>> 0) / 0xffffffff;
  };
}

export function generateEmbeddingPoint(chunk: Chunk, totalChunks: number, index: number): EmbeddingPoint {
  const seed = djb2(chunk.text);
  const rand = lcg(seed);

  // Generate stable 2D projection in [0.05, 0.95] range
  const x = 0.05 + rand() * 0.9;
  const y = 0.05 + rand() * 0.9;

  // Assign cluster based on chunk position — creates natural groupings
  const cluster = Math.floor((index / Math.max(1, totalChunks)) * 4);

  return { chunkId: chunk.id, x, y, cluster };
}

export function generateEmbeddings(chunks: Chunk[]): EmbeddingPoint[] {
  return chunks.map((chunk, i) => generateEmbeddingPoint(chunk, chunks.length, i));
}
