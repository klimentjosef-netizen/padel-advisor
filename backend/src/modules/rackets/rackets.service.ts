import { db } from "../../shared/db";
import { mapRacketRow } from "../../shared/mappers";
import { Racket } from "../../types";

export class RacketsService {
  async listActive(): Promise<Racket[]> {
    const result = await db.query("SELECT * FROM rackets WHERE is_active = TRUE ORDER BY brand, model");
    return result.rows.map(mapRacketRow);
  }

  async getById(id: string): Promise<Racket | undefined> {
    const result = await db.query("SELECT * FROM rackets WHERE id = $1 LIMIT 1", [id]);
    return result.rows[0] ? mapRacketRow(result.rows[0]) : undefined;
  }

  async compare(ids: string[]): Promise<Racket[]> {
    const unique = Array.from(new Set(ids));
    if (!unique.length) return [];

    const result = await db.query("SELECT * FROM rackets WHERE id = ANY($1::uuid[])", [unique]);
    return result.rows.map(mapRacketRow);
  }
}

export const racketsService = new RacketsService();
