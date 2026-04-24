export interface IterationStep {
  version: string;
  label: string;
  prompt: string;
  outcome: string;
  outcomeType: "failure" | "partial" | "success";
}

export interface PromptStory {
  id: string;
  title: string;
  context: string;
  steps: IterationStep[];
  result: string;
}

export const PROMPT_STORIES: PromptStory[] = [
  {
    id: "llm-validation",
    title: "LLM Output Validation",
    context:
      "GPT-4 summarizing Loom video transcripts. Needed reliable JSON output to store in PostgreSQL and serve the UI. Freeform responses were breaking the parser ~15% of the time.",
    steps: [
      {
        version: "v1",
        label: "Naive prompt",
        prompt: `Summarize this video transcript. Return a JSON with title, summary, and key_points.

Transcript:
{transcript}`,
        outcome:
          "GPT-4 returned markdown prose, code fences, and inconsistent keys. Parser failed ~15% of calls.",
        outcomeType: "failure",
      },
      {
        version: "v2",
        label: "Schema hint",
        prompt: `Summarize this video transcript. You MUST respond with valid JSON only.
Format:
{ "title": "string", "summary": "string", "key_points": ["string"] }

Transcript:
{transcript}`,
        outcome:
          "Parse rate improved to ~88%. Still failed on long transcripts where the model lost track of the format constraint.",
        outcomeType: "partial",
      },
      {
        version: "v3",
        label: "Strict schema + few-shot",
        prompt: `You are a transcript analysis API. Respond ONLY with a JSON object matching this exact schema. No prose, no markdown, no code fences.

Schema:
{
  "title": "string (max 80 chars)",
  "summary": "string (2-3 sentences)",
  "key_points": ["string (max 5 items)"],
  "confidence": "number (0-1)"
}

Example input: "Today we covered our Q3 roadmap..."
Example output: {"title":"Q3 Roadmap Review","summary":"Team reviewed Q3 priorities focusing on AI features and search improvements.","key_points":["AI summarization launch","Hybrid search rollout","Performance targets"],"confidence":0.95}

Transcript:
{transcript}`,
        outcome:
          "Parse rate: 99.8% over 30 days in production. Added Zod schema validation as a safety net — caught 0.2% edge cases.",
        outcomeType: "success",
      },
    ],
    result: "99.8% parse rate · Zero silent failures in 30 days production",
  },
  {
    id: "hybrid-ranking",
    title: "Hybrid Search Ranking",
    context:
      "Loom search combined pgvector (semantic) and ElasticSearch (BM25 keyword). Early fusion formula produced mediocre relevance — semantic results dominated and buried exact-match results.",
    steps: [
      {
        version: "v1",
        label: "Simple average",
        prompt: `# Fusion formula
score = (semantic_score + bm25_score) / 2

# Problem
Semantic scores range [0, 1] — BM25 scores range [0, ~25]
BM25 scores dominate. Semantic results buried.`,
        outcome:
          "BM25 dominated by 10-25x due to score scale mismatch. Semantic results ranked near bottom.",
        outcomeType: "failure",
      },
      {
        version: "v2",
        label: "Normalized + weighted",
        prompt: `# Normalize both to [0, 1], apply weights
semantic_norm = cosine_sim  # already [0, 1]
bm25_norm = bm25_score / max_bm25_score  # normalize by observed max

score = (0.6 * semantic_norm) + (0.4 * bm25_norm)`,
        outcome:
          "Better balance, but max_bm25_score varied per query — normalization was unstable on short queries.",
        outcomeType: "partial",
      },
      {
        version: "v3",
        label: "Reciprocal Rank Fusion",
        prompt: `# RRF — rank-based, scale-invariant
# k=60 is the standard constant (Cormack et al. 2009)

def rrf_score(rank: int, k: int = 60) -> float:
    return 1.0 / (k + rank)

# Merge ranked lists
for doc in semantic_results:
    scores[doc.id] += rrf_score(doc.semantic_rank)

for doc in bm25_results:
    scores[doc.id] += rrf_score(doc.bm25_rank)

return sorted(scores.items(), key=lambda x: -x[1])`,
        outcome:
          "Relevance improved measurably vs. both baselines. Scale-invariant — no tuning needed per query type.",
        outcomeType: "success",
      },
    ],
    result: "Measurable relevance gain · No per-query tuning · Deployed to all Loom search",
  },
  {
    id: "streaming-latency",
    title: "Streaming Latency Reduction",
    context:
      "LLM streaming responses had 1.2s average TTFB (time to first byte). Users perceived this as the app being slow even though tokens arrived quickly after. Target: <500ms.",
    steps: [
      {
        version: "v1",
        label: "Cold call on every request",
        prompt: `# Every request hit OpenAI cold
async def stream_summary(transcript: str):
    response = await openai.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": build_prompt(transcript)}],
        stream=True
    )
    async for chunk in response:
        yield chunk.choices[0].delta.content`,
        outcome:
          "TTFB: 1.1–1.4s. OpenAI cold-start latency dominated. Repeated requests for same video hit the model every time.",
        outcomeType: "failure",
      },
      {
        version: "v2",
        label: "Redis response cache",
        prompt: `# Cache full responses — miss still hits OpenAI cold
CACHE_TTL = 3600  # 1 hour

async def stream_summary(transcript: str):
    cache_key = f"summary:{hash(transcript)}"
    cached = await redis.get(cache_key)

    if cached:
        yield cached  # instant — but not streaming
        return

    # Cache miss: still 1.2s TTFB
    full_response = ""
    async for chunk in openai_stream(transcript):
        full_response += chunk
        yield chunk

    await redis.set(cache_key, full_response, ex=CACHE_TTL)`,
        outcome:
          "Cache hits: instant. Cache misses: still 1.2s. ~40% cache hit rate meant 60% of users still saw slow TTFB.",
        outcomeType: "partial",
      },
      {
        version: "v3",
        label: "Pre-warm + async background generation",
        prompt: `# On video upload: trigger background generation immediately
# User always gets a warm stream

@on_video_uploaded
async def pre_warm_summary(video_id: str, transcript: str):
    cache_key = f"summary:{hash(transcript)}"

    # Generate and cache before user requests it
    full = await openai_generate(transcript)
    await redis.set(cache_key, full, ex=7200)

# At request time: cache is always warm
async def stream_summary(transcript: str):
    cache_key = f"summary:{hash(transcript)}"
    cached = await redis.get(cache_key)

    if cached:
        # Stream from cache — simulates token-by-token for UX
        for token in cached.split():
            yield token + " "
            await asyncio.sleep(0.015)  # ~67 tokens/sec
        return

    # Fallback: real-time (rare)
    async for chunk in openai_stream(transcript):
        yield chunk`,
        outcome:
          "TTFB: <80ms (cache hit). Effective TTFB: <500ms including network. Cache hit rate: 94%.",
        outcomeType: "success",
      },
    ],
    result: "<500ms TTFB · 94% cache hit rate · Reduced OpenAI spend by ~40%",
  },
];
