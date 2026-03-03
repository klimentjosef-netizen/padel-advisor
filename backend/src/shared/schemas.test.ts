import { describe, it, expect } from "vitest";
import { recommendationSchema, compareSchema, createRacketSchema } from "./schemas";

describe("recommendationSchema", () => {
  const validInput = {
    player_level: "intermediate",
    play_style: "universal",
    player_position: "universal",
    preferred_weight: 365,
    preferred_balance: "balanced",
    preferred_hardness: "medium",
    control_vs_power: 50,
    price_min: 0,
    price_max: 6000,
    preferred_brands: [],
  };

  it("accepts valid input", () => {
    const result = recommendationSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("rejects invalid player_level", () => {
    const result = recommendationSchema.safeParse({ ...validInput, player_level: "pro" });
    expect(result.success).toBe(false);
  });

  it("rejects weight below 330", () => {
    const result = recommendationSchema.safeParse({ ...validInput, preferred_weight: 300 });
    expect(result.success).toBe(false);
  });

  it("rejects weight above 390", () => {
    const result = recommendationSchema.safeParse({ ...validInput, preferred_weight: 400 });
    expect(result.success).toBe(false);
  });

  it("rejects control_vs_power above 100", () => {
    const result = recommendationSchema.safeParse({ ...validInput, control_vs_power: 150 });
    expect(result.success).toBe(false);
  });

  it("rejects price_min > price_max", () => {
    const result = recommendationSchema.safeParse({ ...validInput, price_min: 5000, price_max: 3000 });
    expect(result.success).toBe(false);
  });

  it("defaults preferred_brands to empty array", () => {
    const { preferred_brands, ...withoutBrands } = validInput;
    const result = recommendationSchema.safeParse(withoutBrands);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.preferred_brands).toEqual([]);
    }
  });

  it("defaults new optional fields to null/any when omitted", () => {
    const result = recommendationSchema.safeParse(validInput);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.preferred_shape).toBeNull();
      expect(result.data.sweet_spot_preference).toBeNull();
      expect(result.data.preferred_material).toBeNull();
      expect(result.data.year_preference).toBe("any");
      expect(result.data.experience_months).toBeNull();
      expect(result.data.play_tempo).toBeNull();
    }
  });

  it("accepts valid new optional fields", () => {
    const result = recommendationSchema.safeParse({
      ...validInput,
      preferred_shape: "teardrop",
      sweet_spot_preference: "large",
      preferred_material: "carbon",
      year_preference: "latest",
      experience_months: 24,
      play_tempo: "fast",
    });
    expect(result.success).toBe(true);
  });

  it("accepts null values for new optional fields", () => {
    const result = recommendationSchema.safeParse({
      ...validInput,
      preferred_shape: null,
      sweet_spot_preference: null,
      preferred_material: null,
      year_preference: null,
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid enum for preferred_shape", () => {
    const result = recommendationSchema.safeParse({ ...validInput, preferred_shape: "hexagon" });
    expect(result.success).toBe(false);
  });
});

describe("compareSchema", () => {
  it("accepts 2-5 UUIDs", () => {
    const result = compareSchema.safeParse({
      racket_ids: [
        "550e8400-e29b-41d4-a716-446655440000",
        "550e8400-e29b-41d4-a716-446655440001",
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects less than 2 IDs", () => {
    const result = compareSchema.safeParse({
      racket_ids: ["550e8400-e29b-41d4-a716-446655440000"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-UUID strings", () => {
    const result = compareSchema.safeParse({
      racket_ids: ["not-a-uuid", "also-not-uuid"],
    });
    expect(result.success).toBe(false);
  });
});

describe("createRacketSchema", () => {
  const validRacket = {
    brand: "Test",
    model: "Model X",
    price: 4500,
    weight: 365,
    balance: "balanced",
    shape: "teardrop",
    hardness: "medium",
    control_rating: 80,
    power_rating: 85,
    sweet_spot_size: 75,
    player_level: "intermediate",
    player_position: "universal",
    play_style: "universal",
    material_face: "Carbon",
    material_frame: "Carbon",
    year: 2025,
    image_url: "https://example.com/img.jpg",
    description: "A test racket",
    is_active: true,
  };

  it("accepts valid racket", () => {
    const result = createRacketSchema.safeParse(validRacket);
    expect(result.success).toBe(true);
  });

  it("rejects empty brand", () => {
    const result = createRacketSchema.safeParse({ ...validRacket, brand: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid balance enum", () => {
    const result = createRacketSchema.safeParse({ ...validRacket, balance: "unknown" });
    expect(result.success).toBe(false);
  });

  it("defaults is_active to true", () => {
    const { is_active, ...withoutActive } = validRacket;
    const result = createRacketSchema.safeParse(withoutActive);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.is_active).toBe(true);
    }
  });
});
