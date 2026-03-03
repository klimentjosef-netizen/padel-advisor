import { Racket } from "../types";

interface DbRacketRow {
  id: string;
  brand: string;
  model: string;
  price: string | number;
  weight: number;
  balance: Racket["balance"];
  shape: string;
  hardness: Racket["hardness"];
  control_rating: number;
  power_rating: number;
  sweet_spot_size: number;
  player_level: Racket["player_level"];
  player_position: Racket["player_position"];
  play_style: Racket["play_style"];
  material_face: string;
  material_frame: string;
  year: number;
  image_url: string;
  description: string;
  is_active: boolean;
}

export function mapRacketRow(row: DbRacketRow): Racket {
  return {
    ...row,
    price: Number(row.price)
  };
}
