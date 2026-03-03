import { db } from "./db";
import { buildNormalizedKey, normalizeModel } from "./normalize";

interface ResolveInput {
  sourceName: string;
  sourceSlug: string;
  sourceUrl: string;
  brand: string;
  model: string;
  year: number;
}

interface ResolveOutput {
  racketId?: string;
  confidence: number;
  normalizedKey: string;
}

function modelSimilarity(a: string, b: string): number {
  if (!a || !b) return 0;
  if (a === b) return 1;
  if (a.startsWith(b) || b.startsWith(a)) return 0.9;

  const tokensA = new Set(a.split(" ").filter(Boolean));
  const tokensB = new Set(b.split(" ").filter(Boolean));
  const intersection = [...tokensA].filter((t) => tokensB.has(t)).length;
  const union = new Set([...tokensA, ...tokensB]).size;
  return union ? intersection / union : 0;
}

export async function resolveExistingRacket(input: ResolveInput): Promise<ResolveOutput> {
  const normalizedKey = buildNormalizedKey(input.brand, input.model, input.year);
  const modelNorm = normalizeModel(input.model);

  const aliasExact = await db.query<{ racket_id: string }>(
    `SELECT racket_id
     FROM racket_aliases
     WHERE source_name = $1 AND source_slug = $2
     LIMIT 1`,
    [input.sourceName, input.sourceSlug]
  );

  if (aliasExact.rows[0]?.racket_id) {
    return { racketId: aliasExact.rows[0].racket_id, confidence: 1, normalizedKey };
  }

  const aliasByKey = await db.query<{ racket_id: string }>(
    `SELECT racket_id
     FROM racket_aliases
     WHERE normalized_key = $1
     ORDER BY updated_at DESC
     LIMIT 1`,
    [normalizedKey]
  );

  if (aliasByKey.rows[0]?.racket_id) {
    return { racketId: aliasByKey.rows[0].racket_id, confidence: 0.98, normalizedKey };
  }

  const candidates = await db.query<{ id: string; brand: string; model: string; year: number }>(
    `SELECT id, brand, model, year
     FROM rackets
     WHERE LOWER(brand) = LOWER($1)
       AND ABS(year - $2) <= 1`,
    [input.brand, input.year]
  );

  let best: { id: string; score: number } | undefined;
  for (const row of candidates.rows) {
    const score = modelSimilarity(modelNorm, normalizeModel(row.model));
    if (!best || score > best.score) best = { id: row.id, score };
  }

  if (best && best.score >= 0.78) {
    return { racketId: best.id, confidence: Math.min(0.95, best.score), normalizedKey };
  }

  const candidatesNoYear = await db.query<{ id: string; brand: string; model: string }>(
    `SELECT id, brand, model
     FROM rackets
     WHERE LOWER(brand) = LOWER($1)
     LIMIT 200`,
    [input.brand]
  );

  let bestNoYear: { id: string; score: number } | undefined;
  for (const row of candidatesNoYear.rows) {
    const score = modelSimilarity(modelNorm, normalizeModel(row.model));
    if (!bestNoYear || score > bestNoYear.score) bestNoYear = { id: row.id, score };
  }

  if (bestNoYear && bestNoYear.score >= 0.86) {
    return { racketId: bestNoYear.id, confidence: Math.min(0.9, bestNoYear.score), normalizedKey };
  }

  return { confidence: 0, normalizedKey };
}

export async function upsertAlias(params: {
  racketId: string;
  sourceName: string;
  sourceSlug: string;
  sourceUrl: string;
  sourceBrand: string;
  sourceModel: string;
  normalizedKey: string;
  confidence: number;
}): Promise<void> {
  await db.query(
    `INSERT INTO racket_aliases (
      racket_id,
      source_name,
      source_slug,
      source_url,
      source_brand,
      source_model,
      normalized_key,
      match_confidence,
      updated_at
    ) VALUES ($1::uuid,$2,$3,$4,$5,$6,$7,$8,NOW())
    ON CONFLICT (source_name, source_slug)
    DO UPDATE SET
      racket_id = EXCLUDED.racket_id,
      source_url = EXCLUDED.source_url,
      source_brand = EXCLUDED.source_brand,
      source_model = EXCLUDED.source_model,
      normalized_key = EXCLUDED.normalized_key,
      match_confidence = EXCLUDED.match_confidence,
      updated_at = NOW()`,
    [
      params.racketId,
      params.sourceName,
      params.sourceSlug,
      params.sourceUrl,
      params.sourceBrand,
      params.sourceModel,
      params.normalizedKey,
      params.confidence
    ]
  );
}
