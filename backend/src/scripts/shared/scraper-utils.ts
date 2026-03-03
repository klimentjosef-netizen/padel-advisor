import fs from "fs";
import path from "path";
import { db } from "../../shared/db";
import { resolveExistingRacket, upsertAlias } from "../../shared/racket-linking";

export type PlayStyle = "defensive" | "offensive" | "universal";
export type PlayerLevel = "beginner" | "intermediate" | "advanced";
export type PlayerPosition = "left" | "right" | "universal";
export type Balance = "head_heavy" | "balanced" | "head_light";
export type Hardness = "soft" | "medium" | "hard";

export interface ScrapedRacket {
  sourceSlug: string;
  sourceUrl: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  description: string;
  imageUrl: string;
  price: number;
  weight: number;
  balance: Balance;
  shape: string;
  hardness: Hardness;
  controlRating: number;
  powerRating: number;
  reboundRating?: number;
  maneuverabilityRating?: number;
  sweetSpotRating: number;
  materialFace: string;
  materialFrame: string;
  sourceRating?: number;
  playerLevel: PlayerLevel;
  playerPosition: PlayerPosition;
  playStyle: PlayStyle;
  payload: Record<string, unknown>;
}

export function cleanText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function clampRating(value: number | undefined, fallback: number): number {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  return Math.max(0, Math.min(100, Math.round(value)));
}

export async function ensureSchema(): Promise<void> {
  const schemaPath = path.resolve(process.cwd(), "database", "schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf-8");
  await db.query(sql);
  await db.query("ALTER TABLE racket_metrics DROP CONSTRAINT IF EXISTS racket_metrics_pkey");
  await db.query("ALTER TABLE racket_metrics ADD CONSTRAINT racket_metrics_pkey PRIMARY KEY (racket_id, source_name)");
}

export async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const safeConcurrency = Math.max(1, concurrency);
  const results: R[] = new Array(items.length);
  let cursor = 0;

  async function worker(): Promise<void> {
    while (true) {
      const current = cursor;
      cursor += 1;
      if (current >= items.length) return;
      results[current] = await mapper(items[current], current);
    }
  }

  const workers = Array.from({ length: Math.min(safeConcurrency, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

export async function upsertBrand(name: string): Promise<void> {
  await db.query(
    "INSERT INTO brands (name, logo_url) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING",
    [name, null],
  );
}

export async function upsertRacket(
  sourceName: string,
  racket: ScrapedRacket,
): Promise<{ id: string; confidence: number; normalizedKey: string }> {
  const resolved = await resolveExistingRacket({
    sourceName,
    sourceSlug: racket.sourceSlug,
    sourceUrl: racket.sourceUrl,
    brand: racket.brand,
    model: racket.model,
    year: racket.year,
  });

  if (resolved.racketId) {
    await db.query(
      `UPDATE rackets
       SET brand = $1, model = $2, price = $3, weight = $4, balance = $5,
           shape = $6, hardness = $7, control_rating = $8, power_rating = $9,
           sweet_spot_size = $10, player_level = $11, player_position = $12,
           play_style = $13, material_face = $14, material_frame = $15,
           year = $16, image_url = $17, description = $18,
           is_active = TRUE, updated_at = NOW()
       WHERE id = $19::uuid`,
      [
        racket.brand, racket.model, racket.price, racket.weight, racket.balance,
        racket.shape, racket.hardness, racket.controlRating, racket.powerRating,
        racket.sweetSpotRating, racket.playerLevel, racket.playerPosition,
        racket.playStyle, racket.materialFace, racket.materialFrame,
        racket.year, racket.imageUrl, racket.description,
        resolved.racketId,
      ],
    );
    return { id: resolved.racketId, confidence: resolved.confidence, normalizedKey: resolved.normalizedKey };
  }

  const result = await db.query<{ id: string }>(
    `INSERT INTO rackets (
      brand, model, price, weight, balance, shape, hardness,
      control_rating, power_rating, sweet_spot_size,
      player_level, player_position, play_style,
      material_face, material_frame, year,
      image_url, description, is_active
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,TRUE
    )
    ON CONFLICT (brand, model, year)
    DO UPDATE SET
      price = EXCLUDED.price, weight = EXCLUDED.weight, balance = EXCLUDED.balance,
      shape = EXCLUDED.shape, hardness = EXCLUDED.hardness,
      control_rating = EXCLUDED.control_rating, power_rating = EXCLUDED.power_rating,
      sweet_spot_size = EXCLUDED.sweet_spot_size, player_level = EXCLUDED.player_level,
      player_position = EXCLUDED.player_position, play_style = EXCLUDED.play_style,
      material_face = EXCLUDED.material_face, material_frame = EXCLUDED.material_frame,
      image_url = EXCLUDED.image_url, description = EXCLUDED.description,
      updated_at = NOW()
    RETURNING id`,
    [
      racket.brand, racket.model, racket.price, racket.weight, racket.balance,
      racket.shape, racket.hardness, racket.controlRating, racket.powerRating,
      racket.sweetSpotRating, racket.playerLevel, racket.playerPosition,
      racket.playStyle, racket.materialFace, racket.materialFrame,
      racket.year, racket.imageUrl, racket.description,
    ],
  );

  return { id: result.rows[0].id, confidence: 0.7, normalizedKey: resolved.normalizedKey };
}

export async function upsertSource(sourceName: string, racketId: string, data: ScrapedRacket): Promise<void> {
  await db.query(
    `INSERT INTO racket_sources (
      source_name, source_slug, source_url, racket_id, payload, scraped_at
    ) VALUES ($1,$2,$3,$4::uuid,$5,NOW())
    ON CONFLICT (source_name, source_slug)
    DO UPDATE SET
      source_url = EXCLUDED.source_url, racket_id = EXCLUDED.racket_id,
      payload = EXCLUDED.payload, scraped_at = NOW()`,
    [sourceName, data.sourceSlug, data.sourceUrl, racketId, data.payload],
  );
}

export async function upsertMetrics(sourceName: string, racketId: string, data: ScrapedRacket): Promise<void> {
  await db.query(
    `INSERT INTO racket_metrics (
      racket_id, source_name, source_slug, source_rating,
      control_rating, power_rating, rebound_rating,
      maneuverability_rating, sweet_spot_rating, source_count, updated_at
    ) VALUES ($1::uuid,$2,$3,$4,$5,$6,$7,$8,$9,1,NOW())
    ON CONFLICT (racket_id, source_name)
    DO UPDATE SET
      source_slug = EXCLUDED.source_slug, source_rating = EXCLUDED.source_rating,
      control_rating = EXCLUDED.control_rating, power_rating = EXCLUDED.power_rating,
      rebound_rating = EXCLUDED.rebound_rating, maneuverability_rating = EXCLUDED.maneuverability_rating,
      sweet_spot_rating = EXCLUDED.sweet_spot_rating,
      source_count = GREATEST(racket_metrics.source_count, 1),
      updated_at = NOW()`,
    [
      racketId, sourceName, data.sourceSlug,
      data.sourceRating ?? null, data.controlRating, data.powerRating,
      data.reboundRating ?? null, data.maneuverabilityRating ?? null,
      data.sweetSpotRating,
    ],
  );
}

export async function persistScrapedRacket(sourceName: string, row: ScrapedRacket): Promise<void> {
  await upsertBrand(row.brand);
  const racket = await upsertRacket(sourceName, row);
  await upsertAlias({
    racketId: racket.id,
    sourceName,
    sourceSlug: row.sourceSlug,
    sourceUrl: row.sourceUrl,
    sourceBrand: row.brand,
    sourceModel: row.model,
    normalizedKey: racket.normalizedKey,
    confidence: racket.confidence,
  });
  await upsertSource(sourceName, racket.id, row);
  await upsertMetrics(sourceName, racket.id, row);
}
