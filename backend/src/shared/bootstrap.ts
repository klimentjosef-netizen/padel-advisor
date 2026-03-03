import fs from "fs";
import path from "path";
import { db } from "./db";
import { brands, rackets } from "../data/sample-data";

async function ensureSchema(): Promise<void> {
  const schemaPath = path.resolve(process.cwd(), "database", "schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf-8");
  await db.query(sql);

  // Backward-compatible migration for older installs where racket_metrics had PK only on racket_id.
  await db.query("ALTER TABLE racket_metrics DROP CONSTRAINT IF EXISTS racket_metrics_pkey");
  await db.query("ALTER TABLE racket_metrics ADD CONSTRAINT racket_metrics_pkey PRIMARY KEY (racket_id, source_name)");
}

export async function bootstrapSeedData(): Promise<void> {
  await ensureSchema();

  const brandsCount = await db.query<{ count: string }>("SELECT COUNT(*)::text AS count FROM brands");
  if (Number(brandsCount.rows[0]?.count ?? 0) === 0) {
    for (const brand of brands) {
      await db.query(
        "INSERT INTO brands (name, logo_url) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING",
        [brand.name, brand.logo_url]
      );
    }
  }

  const racketsCount = await db.query<{ count: string }>("SELECT COUNT(*)::text AS count FROM rackets");
  if (Number(racketsCount.rows[0]?.count ?? 0) === 0) {
    for (const racket of rackets) {
      await db.query(
        `INSERT INTO rackets (
          brand, model, price, weight, balance, shape, hardness,
          control_rating, power_rating, sweet_spot_size,
          player_level, player_position, play_style,
          material_face, material_frame, year,
          image_url, description, is_active
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10,
          $11, $12, $13,
          $14, $15, $16,
          $17, $18, $19
        )`,
        [
          racket.brand,
          racket.model,
          racket.price,
          racket.weight,
          racket.balance,
          racket.shape,
          racket.hardness,
          racket.control_rating,
          racket.power_rating,
          racket.sweet_spot_size,
          racket.player_level,
          racket.player_position,
          racket.play_style,
          racket.material_face,
          racket.material_frame,
          racket.year,
          racket.image_url,
          racket.description,
          racket.is_active
        ]
      );
    }
  }
}
