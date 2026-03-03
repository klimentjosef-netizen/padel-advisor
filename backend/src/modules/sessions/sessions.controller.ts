import { Router } from "express";
import { db } from "../../shared/db";
import { asyncHandler } from "../../shared/async-handler";

export const sessionsRouter = Router();

sessionsRouter.get("/", asyncHandler(async (_req, res) => {
  const result = await db.query(
    `SELECT id, created_at, preferred_price_min, preferred_price_max,
            preferred_weight, preferred_balance, preferred_hardness,
            player_level, play_style, player_position, control_vs_power, preferred_brands
     FROM user_sessions
     ORDER BY created_at DESC
     LIMIT 50`
  );

  res.json({ sessions: result.rows });
}));
