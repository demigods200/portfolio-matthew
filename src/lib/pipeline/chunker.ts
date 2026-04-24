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
  let charOffset = 0;
  let chunkSeq = 0;

  while (sentenceIdx < sentences.length) {
    const buffer: string[] = [];
    let tokenCount = 0;
    const startOffset = charOffset;

    // Fill chunk to target size
    while (sentenceIdx < sentences.length && tokenCount < TARGET_CHUNK_TOKENS) {
      const sentence = sentences[sentenceIdx];
      if (!sentence) break;
      buffer.push(sentence);
      tokenCount += estimateTokens(sentence);
      charOffset += sentence.length + 1;
      sentenceIdx++;
    }

    const chunkText = buffer.join(" ");
    const chunkId = `chunk_${String(chunkSeq).padStart(2, "0")}`;

    chunks.push({
      id: chunkId,
      text: chunkText,
      start: startOffset,
      end: startOffset + chunkText.length,
      tokenEstimate: tokenCount,
    });

    chunkSeq++;

    // Overlap: step back by ~20% of sentences
    const overlapCount = Math.max(1, Math.floor(buffer.length * OVERLAP_RATIO));
    const stepBack = buffer.length - overlapCount;
    sentenceIdx = Math.max(0, sentenceIdx - overlapCount);

    // Recalculate charOffset for overlap position
    charOffset = startOffset;
    for (let i = 0; i < stepBack && i < buffer.length; i++) {
      const s = buffer[i];
      if (s) charOffset += s.length + 1;
    }
  }

  return chunks;
}
