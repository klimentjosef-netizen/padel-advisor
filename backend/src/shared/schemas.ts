import { z } from "zod";

export const recommendationSchema = z.object({
  player_level: z.enum(["beginner", "intermediate", "advanced"]),
  play_style: z.enum(["defensive", "offensive", "universal"]),
  player_position: z.enum(["left", "right", "universal"]),
  preferred_weight: z.number().int().min(330).max(390),
  preferred_balance: z.enum(["head_heavy", "balanced", "head_light"]),
  preferred_hardness: z.enum(["soft", "medium", "hard"]),
  control_vs_power: z.number().min(0).max(100),
  price_min: z.number().min(0),
  price_max: z.number().min(0),
  preferred_brands: z.array(z.string()).default([]),
  preferred_shape: z.enum(["round", "teardrop", "diamond"]).nullable().optional().default(null),
  sweet_spot_preference: z.enum(["large", "medium", "small"]).nullable().optional().default(null),
  preferred_material: z.enum(["carbon", "fiberglass"]).nullable().optional().default(null),
  year_preference: z.enum(["latest", "recent", "any"]).nullable().optional().default("any"),
  experience_months: z.number().int().min(0).max(600).nullable().optional().default(null),
  play_tempo: z.enum(["slow", "medium", "fast"]).nullable().optional().default(null),
}).refine((v) => v.price_min <= v.price_max, {
  message: "price_min musi byt mensi nebo rovno price_max",
  path: ["price_min"]
});

export const compareSchema = z.object({
  racket_ids: z.array(z.string().uuid()).min(2).max(5)
});

export const createRacketSchema = z.object({
  brand: z.string().min(1),
  model: z.string().min(1),
  price: z.number().min(0),
  weight: z.number().int().min(330).max(390),
  balance: z.enum(["head_heavy", "balanced", "head_light"]),
  shape: z.string().min(1),
  hardness: z.enum(["soft", "medium", "hard"]),
  control_rating: z.number().min(0).max(100),
  power_rating: z.number().min(0).max(100),
  sweet_spot_size: z.number().min(0).max(100),
  player_level: z.enum(["beginner", "intermediate", "advanced"]),
  player_position: z.enum(["left", "right", "universal"]),
  play_style: z.enum(["defensive", "offensive", "universal"]),
  material_face: z.string().min(1),
  material_frame: z.string().min(1),
  year: z.number().int().min(2018).max(2100),
  image_url: z.string().url(),
  description: z.string().min(5),
  is_active: z.boolean().default(true)
});
