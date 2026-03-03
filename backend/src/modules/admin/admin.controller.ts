import { Router } from "express";
import { createRacketSchema } from "../../shared/schemas";
import { db } from "../../shared/db";
import { mapRacketRow } from "../../shared/mappers";
import { asyncHandler } from "../../shared/async-handler";
import { requireAdminKey } from "../../shared/admin-auth.middleware";

export const adminRouter = Router();

adminRouter.use(requireAdminKey);

const ALLOWED_COLUMNS = new Set([
  "brand", "model", "price", "weight", "balance", "shape", "hardness",
  "control_rating", "power_rating", "sweet_spot_size",
  "player_level", "player_position", "play_style",
  "material_face", "material_frame", "year",
  "image_url", "description", "is_active"
]);

adminRouter.post("/rackets", asyncHandler(async (req, res) => {
  const parsed = createRacketSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.flatten() });
    return;
  }

  const data = parsed.data;
  const result = await db.query(
    `INSERT INTO rackets (
      brand, model, price, weight, balance, shape, hardness,
      control_rating, power_rating, sweet_spot_size,
      player_level, player_position, play_style,
      material_face, material_frame, year,
      image_url, description, is_active
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,
      $8,$9,$10,
      $11,$12,$13,
      $14,$15,$16,
      $17,$18,$19
    )
    RETURNING *`,
    [
      data.brand,
      data.model,
      data.price,
      data.weight,
      data.balance,
      data.shape,
      data.hardness,
      data.control_rating,
      data.power_rating,
      data.sweet_spot_size,
      data.player_level,
      data.player_position,
      data.play_style,
      data.material_face,
      data.material_frame,
      data.year,
      data.image_url,
      data.description,
      data.is_active
    ]
  );

  res.status(201).json(mapRacketRow(result.rows[0]));
}));

adminRouter.put("/rackets/:id", asyncHandler(async (req, res) => {
  const parsed = createRacketSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.flatten() });
    return;
  }

  const safeUpdates = Object.entries(parsed.data).filter(([key]) => ALLOWED_COLUMNS.has(key));
  if (!safeUpdates.length) {
    res.status(400).json({ message: "Neni co aktualizovat" });
    return;
  }

  const setClause = safeUpdates.map(([key], index) => `"${key}" = $${index + 1}`).join(", ");
  const values = safeUpdates.map(([, value]) => value);

  const result = await db.query(
    `UPDATE rackets
     SET ${setClause}, updated_at = NOW()
     WHERE id = $${safeUpdates.length + 1}::uuid
     RETURNING *`,
    [...values, req.params.id]
  );

  if (!result.rows.length) {
    res.status(404).json({ message: "Raketa nebyla nalezena" });
    return;
  }

  res.json(mapRacketRow(result.rows[0]));
}));

adminRouter.delete("/rackets/:id", asyncHandler(async (req, res) => {
  const result = await db.query("DELETE FROM rackets WHERE id = $1::uuid RETURNING *", [req.params.id]);

  if (!result.rows.length) {
    res.status(404).json({ message: "Raketa nebyla nalezena" });
    return;
  }

  res.json({ deleted: mapRacketRow(result.rows[0]) });
}));
