import type { Chunk } from "@/types/pipeline";
import { estimateTokens } from "@/lib/utils/format";

const SENTENCE_BOUNDARY = /(?<=[.!?])\s+(?=[A-Z])/;
const TARGET_CHUNK_TOKENS = 180;
const OVERLAP_RATIO = 0.2;

function splitSentences(text: string): string[] {
  return text
    .split(SENTENCE_BOUNDARY)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function chunkText(input: string): Chunk[] {
  const sentences = splitSentences(input);
  if (sentences.length === 0) return [];

  const chunks: Chunk[] = [];
  let sentenceIdx = 0;
  let chunkSeq = 0;

  while (sentenceIdx < sentences.length) {
    const startIdx = sentenceIdx;
    const buffer: string[] = [];
    let tokenCount = 0;

    // Fill chunk up to target token size
    while (sentenceIdx < sentences.length && tokenCount < TARGET_CHUNK_TOKENS) {
      const sentence = sentences[sentenceIdx];
      if (!sentence) { sentenceIdx++; continue; }
      buffer.push(sentence);
      tokenCount += estimateTokens(sentence);
      sentenceIdx++;
    }

    if (buffer.length === 0) break;

    const text = buffer.join(" ");
    chunks.push({
      id: `chunk_${String(chunkSeq).padStart(2, "0")}`,
      text,
      start: startIdx,
      end: sentenceIdx - 1,
      tokenEstimate: tokenCount,
    });
    chunkSeq++;

    // Overlap: step back ~20% of sentences consumed.
    // Always advance at least 1 past startIdx to guarantee forward progress.
    const overlapCount = Math.floor(buffer.length * OVERLAP_RATIO);
    sentenceIdx = Math.max(startIdx + 1, sentenceIdx - overlapCount);
  }

  return chunks;
}
