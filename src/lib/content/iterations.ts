export interface IterationStep {
  version: string;
  label: string;
  prompt: string;
  language?: string;
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
    id: "eval-infrastructure",
    title: "Eval-Driven Quality Gates",
    context:
      "Loom AI summaries were structurally valid (Zod passed) but semantically wrong 10–15% of the time — wrong speaker, missed action items, hallucinated topics. No prompt tweak could surface this. Needed an automated eval layer that ran in CI and in production, with a signal I could act on before users filed bugs.",
    steps: [
      {
        version: "v1",
        label: "Manual spot-check",
        prompt: `# v1: Manual review posted to Slack on each deploy
# Eng team reviewed ~20 random summaries — no criteria, no tracking

sample = random.sample(recent_summaries, 20)
for s in sample:
    post_to_slack(f"[REVIEW] {s.video_id}: {s.summary}")

# No structured rubric. Reviewed on good days, skipped on bad ones.
# No CI gate — nothing blocked a bad deploy.`,
        outcome:
          "Caught 0 regressions in 3 months. A model version change silently degraded quality by ~12%. Found out from user complaints, not monitoring.",
        outcomeType: "failure",
      },
      {
        version: "v2",
        label: "LLM-as-judge (single dimension)",
        prompt: `# v2: GPT-4o scores each summary on factual accuracy

JUDGE_PROMPT = """Given a transcript and AI summary, score
factual accuracy 0–1.
Respond with JSON: {"score": float, "reason": "string"}
Transcript: {transcript}
Summary: {summary}"""

async def eval_summary(transcript: str, summary: str) -> float:
    result = await openai.chat.completions.create(
        model="gpt-4o",
        response_format={"type": "json_object"},
        messages=[{"role": "user", "content": JUDGE_PROMPT.format(
            transcript=transcript, summary=summary
        )}]
    )
    return json.loads(result.choices[0].message.content)["score"]`,
        outcome:
          "~78% correlation with human judgment. But a single accuracy score collapsed three distinct failure modes — hallucination, missed topics, wrong speaker. Couldn't diagnose which was regressing.",
        outcomeType: "partial",
      },
      {
        version: "v3",
        label: "Multi-dimensional suite + CI gate",
        prompt: `# v3: Separate eval dimensions + CI gate + production sampling

EVAL_DIMENSIONS = ["factual_accuracy", "topic_coverage", "speaker_attribution"]

async def run_eval_suite(transcript: str, summary: str) -> EvalResult:
    scores = {}
    for dim in EVAL_DIMENSIONS:
        scores[dim] = await llm_judge(transcript, summary, dimension=dim)
    aggregate = (scores["factual_accuracy"] * 0.5 +
                 scores["topic_coverage"]   * 0.3 +
                 scores["speaker_attribution"] * 0.2)
    return EvalResult(scores=scores, aggregate=aggregate)

async def ci_eval_gate() -> bool:
    results = await asyncio.gather(*[
        run_eval_suite(ex.transcript, await generate_summary(ex.transcript))
        for ex in GOLDEN_DATASET  # 150 human-verified examples
    ])
    pass_rate = sum(1 for r in results if r.aggregate >= 0.82) / len(results)
    if pass_rate < 0.90:
        raise CIFailure(f"Eval gate failed: {pass_rate:.1%} (threshold: 90%)")
    return True

# Production: sample 5% of live traffic → scores streamed to Datadog`,
        outcome:
          "Caught a GPT-4o mini regression (factual_accuracy: 0.91 → 0.76) before reaching >1% of users. CI gate blocked the deploy. Fixed with chain-of-thought in summarization — aggregate returned to 0.93.",
        outcomeType: "success",
      },
    ],
    result: "Eval suite catches regressions before users do · CI gate blocked 2 bad deploys · 150-example golden dataset",
  },
  {
    id: "model-routing",
    title: "Model Routing by Complexity",
    context:
      "Loom's summarization ran every LLM call through GPT-4o regardless of video length or content. A 90-second standup and a 45-minute design review got the same model, same cost. At scale, ~60% of videos were under 5 minutes and needed only extractive summarization — no reasoning required. The goal: route by task complexity, cutting cost without degrading quality on complex inputs.",
    steps: [
      {
        version: "v1",
        label: "Token-count threshold",
        language: "typescript",
        prompt: `// v1: Simple token-count threshold
// Assumption: longer transcript = more complex task

const MODEL_THRESHOLD = 2000; // tokens

function selectModel(transcriptTokens: number): string {
  return transcriptTokens > MODEL_THRESHOLD
    ? "gpt-4o"
    : "gpt-4o-mini";
}

// Problem: a 500-token heated technical debate is more complex
// than a 3000-token scripted product demo.
// Token count is a length signal, not a complexity signal.`,
        outcome:
          "Cost dropped 38% but quality on short technical videos degraded. A 400-token architecture discussion got routed to mini and produced shallow summaries.",
        outcomeType: "failure",
      },
      {
        version: "v2",
        label: "Vocabulary heuristics",
        language: "typescript",
        prompt: `// v2: Complexity score from transcript features

async function classifyComplexity(t: string): Promise<"simple" | "complex"> {
  const techTermDensity = countTechnicalTerms(t) / wordCount(t);
  const speakerTurns    = countSpeakerChanges(t);
  const questionCount   = (t.match(/\\?/g) || []).length;

  const score =
    techTermDensity * 0.5 +
    Math.min(speakerTurns / 10, 1) * 0.3 +
    Math.min(questionCount / 5, 1) * 0.2;

  return score > 0.4 ? "complex" : "simple";
}`,
        outcome:
          "Better precision on technical content. Brittle on medical transcripts and non-English vocabulary — confused term-density scoring. Classifier accuracy: ~71% against a human-labeled test set.",
        outcomeType: "partial",
      },
      {
        version: "v3",
        label: "LLM router + cascade fallback",
        language: "typescript",
        prompt: `// v3: Fast router on excerpt + quality-gated cascade

const ROUTER_SYSTEM = \`Classify video transcript complexity.
simple: factual updates, demos, single topic
complex: technical design, multi-party debate, specialized domain
JSON only: {"complexity": "simple"|"complex", "confidence": number}\`;

async function routedSummarize(transcript: string): Promise<SummaryResult> {
  // Stage 1: Cheap router on first ~500 tokens
  const routing = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [{ role: "system", content: ROUTER_SYSTEM },
               { role: "user",   content: transcript.slice(0, 2000) }],
  });
  const { complexity } = JSON.parse(routing.choices[0].message.content!);

  // Stage 2: Generate with routed model
  const model = complexity === "complex" ? "gpt-4o" : "gpt-4o-mini";
  const summary = await generateSummary(transcript, model);

  // Stage 3: Quality gate — cascade to gpt-4o if mini scores low
  if (model === "gpt-4o-mini") {
    const score = await quickEval(transcript, summary.text);
    if (score < 0.78) return generateSummary(transcript, "gpt-4o");
  }
  return summary;
}`,
        outcome:
          "67% of requests served by gpt-4o-mini. Cascade triggered on 8% of mini calls. Quality parity with gpt-4o-only baseline (eval aggregate: 0.91 vs 0.92). Cost reduction: 51%.",
        outcomeType: "success",
      },
    ],
    result: "51% LLM cost reduction · Quality parity on eval suite · 67% of requests served by smaller model",
  },
  {
    id: "hybrid-ranking",
    title: "Hybrid Retrieval Architecture",
    context:
      "Loom search combined pgvector (semantic) and ElasticSearch (BM25 keyword) retrieval. The naive fusion formula produced mediocre relevance — semantic embeddings dominated and buried exact-match results. This is the core tradeoff in hybrid retrieval: semantic search finds conceptually related content, keyword search finds exactly what the user typed. The fusion layer is where retrieval quality is won or lost.",
    steps: [
      {
        version: "v1",
        label: "Naive score fusion",
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
        label: "Min-max normalization",
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
    result: "Measurable NDCG improvement vs. both baselines · Scale-invariant — no per-query tuning · Deployed across all Loom search",
  },
];
