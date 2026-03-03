export interface RacketSummary {
  id: string;
  brand: string;
  model: string;
  price: number;
  weight: number;
  balance: string;
  hardness: string;
  shape: string;
  image_url: string;
  description: string;
}

export interface RacketDetail extends RacketSummary {
  control_rating: number;
  power_rating: number;
  sweet_spot_size: number;
  play_style: string;
  player_level: string;
  player_position: string;
  material_face: string;
  material_frame: string;
  year: number;
  image_url: string;
  description: string;
}

export interface RecommendationInput {
  player_level: "beginner" | "intermediate" | "advanced";
  play_style: "defensive" | "offensive" | "universal";
  player_position: "left" | "right" | "universal";
  preferred_weight: number;
  preferred_balance: "head_heavy" | "balanced" | "head_light";
  preferred_hardness: "soft" | "medium" | "hard";
  control_vs_power: number;
  price_min: number;
  price_max: number;
  preferred_brands: string[];
  preferred_shape?: "round" | "teardrop" | "diamond" | null;
  sweet_spot_preference?: "large" | "medium" | "small" | null;
  preferred_material?: "carbon" | "fiberglass" | null;
  year_preference?: "latest" | "recent" | "any" | null;
  experience_months?: number | null;
  play_tempo?: "slow" | "medium" | "fast" | null;
}

export interface RecommendationItem {
  racket_id: string;
  score: number;
  match_percentage: number;
  reasons: string[];
}

export interface RecommendationResponse {
  session_id: string;
  recommendations: RecommendationItem[];
}
