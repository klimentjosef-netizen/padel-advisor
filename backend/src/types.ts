export type PlayerLevel = "beginner" | "intermediate" | "advanced";
export type PlayStyle = "defensive" | "offensive" | "universal";
export type PlayerPosition = "left" | "right" | "universal";
export type Balance = "head_heavy" | "balanced" | "head_light";
export type Hardness = "soft" | "medium" | "hard";
export type RacketShape = "round" | "teardrop" | "diamond";
export type SweetSpotPref = "large" | "medium" | "small";
export type MaterialPref = "carbon" | "fiberglass";
export type YearPref = "latest" | "recent" | "any";
export type PlayTempo = "slow" | "medium" | "fast";

export interface Racket {
  id: string;
  brand: string;
  model: string;
  price: number;
  weight: number;
  balance: Balance;
  shape: string;
  hardness: Hardness;
  control_rating: number;
  power_rating: number;
  sweet_spot_size: number;
  player_level: PlayerLevel;
  player_position: PlayerPosition;
  play_style: PlayStyle;
  material_face: string;
  material_frame: string;
  year: number;
  image_url: string;
  description: string;
  is_active: boolean;
}

export interface Brand {
  id: string;
  name: string;
  logo_url: string;
}

export interface RecommendationInput {
  player_level: PlayerLevel;
  play_style: PlayStyle;
  player_position: PlayerPosition;
  preferred_weight: number;
  preferred_balance: Balance;
  preferred_hardness: Hardness;
  control_vs_power: number;
  price_min: number;
  price_max: number;
  preferred_brands: string[];
  preferred_shape?: RacketShape | null;
  sweet_spot_preference?: SweetSpotPref | null;
  preferred_material?: MaterialPref | null;
  year_preference?: YearPref | null;
  experience_months?: number | null;
  play_tempo?: PlayTempo | null;
}

export interface RecommendationItem {
  racket_id: string;
  score: number;
  match_percentage: number;
  reasons: string[];
}

export interface UserSession extends RecommendationInput {
  id: string;
  created_at: string;
}
