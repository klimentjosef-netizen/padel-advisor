import { db } from "../../shared/db";
import { mapRacketRow } from "../../shared/mappers";
import { RecommendationInput, RecommendationItem, Racket } from "../../types";
import { calculateScore } from "./scoring.engine";

export class RecommendationService {
  private buildRecommendations(input: RecommendationInput, rackets: Racket[], top: number): RecommendationItem[] {
    return rackets
      .map((racket) => {
        const { score, maxScore, reasons } = calculateScore(input, racket);
        return {
          racket_id: racket.id,
          score,
          match_percentage: Math.round((score / maxScore) * 100),
          reasons: reasons.slice(0, 3)
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, top);
  }

  async recommendAndPersist(input: RecommendationInput, top = 5): Promise<{ session_id: string; recommendations: RecommendationItem[] }> {
    const racketsResult = await db.query("SELECT * FROM rackets WHERE is_active = TRUE");
    const rackets = racketsResult.rows.map(mapRacketRow);
    const recommendations = this.buildRecommendations(input, rackets, top);

    const client = await db.connect();
    try {
      await client.query("BEGIN");

      const sessionResult = await client.query<{ id: string }>(
        `INSERT INTO user_sessions (
          preferred_price_min,
          preferred_price_max,
          preferred_weight,
          preferred_balance,
          preferred_hardness,
          player_level,
          play_style,
          player_position,
          control_vs_power,
          preferred_brands,
          preferred_shape,
          sweet_spot_preference,
          preferred_material,
          year_preference,
          experience_months,
          play_tempo
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
        RETURNING id`,
        [
          input.price_min,
          input.price_max,
          input.preferred_weight,
          input.preferred_balance,
          input.preferred_hardness,
          input.player_level,
          input.play_style,
          input.player_position,
          input.control_vs_power,
          input.preferred_brands,
          input.preferred_shape ?? null,
          input.sweet_spot_preference ?? null,
          input.preferred_material ?? null,
          input.year_preference ?? "any",
          input.experience_months ?? null,
          input.play_tempo ?? null,
        ]
      );

      const sessionId = sessionResult.rows[0].id;

      for (const [index, item] of recommendations.entries()) {
        await client.query(
          "INSERT INTO recommendation_results (session_id, racket_id, score, rank) VALUES ($1, $2::uuid, $3, $4)",
          [sessionId, item.racket_id, item.score, index + 1]
        );
      }

      await client.query("COMMIT");
      return { session_id: sessionId, recommendations };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

export const recommendationService = new RecommendationService();
