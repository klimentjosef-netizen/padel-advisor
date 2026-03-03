import { Router } from "express";
import { db } from "../../shared/db";
import { asyncHandler } from "../../shared/async-handler";

export const brandsRouter = Router();

brandsRouter.get("/", asyncHandler(async (_req, res) => {
  const result = await db.query(
    `SELECT DISTINCT name
     FROM (
       SELECT name FROM brands
       UNION ALL
       SELECT brand AS name FROM rackets WHERE is_active = TRUE
     ) AS all_brands
     WHERE name IS NOT NULL AND name <> ''
     ORDER BY name`
  );
  res.json(result.rows);
}));
