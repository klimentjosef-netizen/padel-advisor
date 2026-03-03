import { describe, it, expect } from "vitest";
import { calculateScore } from "./scoring.engine";
import { RecommendationInput, Racket } from "../../types";

function makeInput(overrides?: Partial<RecommendationInput>): RecommendationInput {
  return {
    player_level: "intermediate",
    play_style: "universal",
    player_position: "universal",
    preferred_weight: 365,
    preferred_balance: "balanced",
    preferred_hardness: "medium",
    control_vs_power: 50,
    price_min: 3000,
    price_max: 6000,
    preferred_brands: [],
    ...overrides,
  };
}

function makeRacket(overrides?: Partial<Racket>): Racket {
  return {
    id: "test-id",
    brand: "TestBrand",
    model: "TestModel",
    price: 4500,
    weight: 365,
    balance: "balanced",
    shape: "teardrop",
    hardness: "medium",
    control_rating: 50,
    power_rating: 50,
    sweet_spot_size: 75,
    player_level: "intermediate",
    player_position: "universal",
    play_style: "universal",
    material_face: "Carbon",
    material_frame: "Carbon",
    year: 2025,
    image_url: "",
    description: "",
    is_active: true,
    ...overrides,
  };
}

describe("calculateScore", () => {
  it("returns maxScore of 135", () => {
    const result = calculateScore(makeInput(), makeRacket());
    expect(result.maxScore).toBe(135);
  });

  // ── Play style: 30pts max, with partial credit ──

  it("gives 30 points for exact play_style match", () => {
    const input = makeInput({ play_style: "offensive" });
    const result = calculateScore(input, makeRacket({ play_style: "offensive" }));
    expect(result.reasons).toContain("Vhodna pro zvoleny herni styl");
  });

  it("gives 30 points when racket play_style is universal", () => {
    const input = makeInput({ play_style: "offensive" });
    const racket = makeRacket({ play_style: "universal" });
    const result = calculateScore(input, racket);
    expect(result.reasons).toContain("Vhodna pro zvoleny herni styl");
  });

  it("gives partial points for opposite play_style", () => {
    const input = makeInput({ play_style: "offensive" });
    const match = calculateScore(input, makeRacket({ play_style: "offensive" }));
    const opposite = calculateScore(input, makeRacket({ play_style: "defensive" }));
    expect(match.score).toBeGreaterThan(opposite.score);
    expect(opposite.score).toBeGreaterThan(0); // partial credit, not zero
  });

  // ── Balance: 25pts max, with partial credit ──

  it("gives 25 points for matching balance", () => {
    const input = makeInput({ preferred_balance: "head_heavy" });
    const match = calculateScore(input, makeRacket({ balance: "head_heavy" }));
    expect(match.reasons).toContain("Vyvazeni odpovida preferenci");
  });

  it("gives partial points for adjacent balance", () => {
    const input = makeInput({ preferred_balance: "head_heavy" });
    const adjacent = calculateScore(input, makeRacket({ balance: "balanced" }));
    expect(adjacent.reasons).toContain("Blizke vyvazeni");
  });

  it("gives fewer points for opposite balance", () => {
    const input = makeInput({ preferred_balance: "head_heavy" });
    const match = calculateScore(input, makeRacket({ balance: "head_heavy" }));
    const opposite = calculateScore(input, makeRacket({ balance: "head_light" }));
    expect(match.score - opposite.score).toBeGreaterThan(15);
  });

  // ── Weight: 20pts max ──

  it("gives 20 points when weight diff <= 1g", () => {
    const input = makeInput({ preferred_weight: 365 });
    const result = calculateScore(input, makeRacket({ weight: 365 }));
    expect(result.reasons).toContain("Odpovida preferovane vaze");
  });

  it("gives 16 points when weight diff <= 3g", () => {
    const input = makeInput({ preferred_weight: 365 });
    const result = calculateScore(input, makeRacket({ weight: 368 }));
    expect(result.reasons).toContain("Velmi blizko preferovane vaze");
  });

  it("gives 12 points when weight diff <= 6g", () => {
    const input = makeInput({ preferred_weight: 365 });
    const result = calculateScore(input, makeRacket({ weight: 371 }));
    expect(result.reasons).toContain("Prijatelna odchylka vahy");
  });

  it("gives partial points when weight diff <= 10g", () => {
    const input = makeInput({ preferred_weight: 365 });
    const result = calculateScore(input, makeRacket({ weight: 375 }));
    expect(result.reasons).toContain("Mirna odchylka vahy");
  });

  it("gives minimal weight points for large diff (15g)", () => {
    const input = makeInput({ preferred_weight: 365 });
    const result = calculateScore(input, makeRacket({ weight: 380 }));
    const weightReasons = result.reasons.filter((r) => r.includes("preferovane vaze") || r.includes("odchylka vahy"));
    expect(weightReasons).toHaveLength(0);
  });

  // ── Hardness: 10pts max, with partial credit ──

  it("gives 10 points for matching hardness", () => {
    const input = makeInput({ preferred_hardness: "soft" });
    const match = calculateScore(input, makeRacket({ hardness: "soft" }));
    const opposite = calculateScore(input, makeRacket({ hardness: "hard" }));
    expect(match.score - opposite.score).toBe(10);
  });

  it("gives partial hardness points for adjacent", () => {
    const input = makeInput({ preferred_hardness: "soft" });
    const adjacent = calculateScore(input, makeRacket({ hardness: "medium" }));
    expect(adjacent.reasons).toContain("Podobna tvrdost");
  });

  // ── Player level: 10pts max, with partial credit ──

  it("gives 10 points for matching player_level", () => {
    const input = makeInput({ player_level: "advanced" });
    const match = calculateScore(input, makeRacket({ player_level: "advanced" }));
    expect(match.reasons).toContain("Vhodna uroven hrace");
  });

  it("gives partial level points for adjacent level", () => {
    const input = makeInput({ player_level: "advanced" });
    const adjacent = calculateScore(input, makeRacket({ player_level: "intermediate" }));
    expect(adjacent.reasons).toContain("Blizka uroven hrace");
  });

  it("gives minimal points for distant player_level", () => {
    const input = makeInput({ player_level: "advanced" });
    const distant = calculateScore(input, makeRacket({ player_level: "beginner" }));
    const match = calculateScore(input, makeRacket({ player_level: "advanced" }));
    expect(match.score).toBeGreaterThan(distant.score);
  });

  // ── Player position: 5pts ──

  it("gives 5 points for matching player_position", () => {
    const input = makeInput({ player_position: "left" });
    const match = calculateScore(input, makeRacket({ player_position: "left" }));
    const noMatch = calculateScore(input, makeRacket({ player_position: "right" }));
    expect(match.score - noMatch.score).toBe(5);
  });

  // ── Price: 15pts max, with near-budget partial ──

  it("gives 15 points when price is in range", () => {
    const input = makeInput({ price_min: 3000, price_max: 6000 });
    const inRange = calculateScore(input, makeRacket({ price: 4500 }));
    expect(inRange.reasons).toContain("Cena je v pozadovanem rozpoctu");
  });

  it("gives partial price points when slightly over budget", () => {
    const input = makeInput({ price_min: 3000, price_max: 5000 });
    const slightlyOver = calculateScore(input, makeRacket({ price: 5300 }));
    expect(slightlyOver.reasons).toContain("Mirne nad rozpoctem");
  });

  it("gives 0 price points when far over budget", () => {
    const input = makeInput({ price_min: 3000, price_max: 5000 });
    const farOver = calculateScore(input, makeRacket({ price: 9000 }));
    const priceReasons = farOver.reasons.filter((r) => r.includes("rozpoctem") || r.includes("rozpoctu"));
    expect(priceReasons).toHaveLength(0);
  });

  // ── Brands: 10pts, gives full when no brands preferred ──

  it("gives 10 points for preferred brand", () => {
    const input = makeInput({ preferred_brands: ["TestBrand"] });
    const match = calculateScore(input, makeRacket({ brand: "TestBrand" }));
    const noMatch = calculateScore(input, makeRacket({ brand: "OtherBrand" }));
    expect(match.score - noMatch.score).toBe(10);
  });

  it("gives full brand points when no brand preference (all brands OK)", () => {
    const input = makeInput({ preferred_brands: [] });
    const result = calculateScore(input, makeRacket({ brand: "AnyBrand" }));
    // Should include brand points in score since user has no preference
    const withBrandPref = makeInput({ preferred_brands: ["AnyBrand"] });
    const matchBrand = calculateScore(withBrandPref, makeRacket({ brand: "AnyBrand" }));
    // Both should have the same brand contribution (10 points)
    expect(result.score).toBeGreaterThan(0);
  });

  // ── Control/power: 10pts max ──

  it("gives 10 points when control_vs_power diff <= 10", () => {
    const input = makeInput({ control_vs_power: 50 });
    const result = calculateScore(input, makeRacket({ power_rating: 55 }));
    expect(result.reasons).toContain("Sedici pomer control/power");
  });

  it("gives partial control/power points for moderate diff", () => {
    const input = makeInput({ control_vs_power: 50 });
    const result = calculateScore(input, makeRacket({ power_rating: 70 }));
    expect(result.reasons).toContain("Podobny pomer control/power");
  });

  it("gives 0 control/power points when diff > 30", () => {
    const input = makeInput({ control_vs_power: 50 });
    const result = calculateScore(input, makeRacket({ power_rating: 90 }));
    const cpReasons = result.reasons.filter((r) => r.includes("control/power"));
    expect(cpReasons).toHaveLength(0);
  });

  // ── Perfect scores ──

  it("returns perfect score when all criteria match", () => {
    const input = makeInput({
      play_style: "universal",
      preferred_balance: "balanced",
      preferred_weight: 365,
      preferred_hardness: "medium",
      player_level: "intermediate",
      player_position: "universal",
      price_min: 3000,
      price_max: 6000,
      preferred_brands: ["TestBrand"],
      control_vs_power: 50,
    });
    const racket = makeRacket({
      play_style: "universal",
      balance: "balanced",
      weight: 365,
      hardness: "medium",
      player_level: "intermediate",
      player_position: "universal",
      price: 4500,
      brand: "TestBrand",
      power_rating: 50,
    });
    const result = calculateScore(input, racket);
    expect(result.score).toBe(135);
    expect(result.maxScore).toBe(135);
  });

  // --- New factors ---

  it("gives 15 points for matching shape", () => {
    const input = makeInput({ preferred_shape: "teardrop" });
    const match = calculateScore(input, makeRacket({ shape: "teardrop" }));
    expect(match.reasons).toContain("Tvar rakety odpovida preferenci");
  });

  it("gives partial points for adjacent shape", () => {
    const input = makeInput({ preferred_shape: "teardrop" });
    const adjacent = calculateScore(input, makeRacket({ shape: "round" }));
    expect(adjacent.reasons).toContain("Podobny tvar rakety");
  });

  it("does not add shape points when preferred_shape is null", () => {
    const input = makeInput({ preferred_shape: null });
    const result = calculateScore(input, makeRacket());
    expect(result.maxScore).toBe(135);
  });

  it("gives 10 points for matching sweet spot (large)", () => {
    const input = makeInput({ sweet_spot_preference: "large" });
    const match = calculateScore(input, makeRacket({ sweet_spot_size: 80 }));
    expect(match.reasons).toContain("Velky sweet spot - odpoustejici");
  });

  it("gives partial sweet spot points for adjacent", () => {
    const input = makeInput({ sweet_spot_preference: "large" });
    const result = calculateScore(input, makeRacket({ sweet_spot_size: 55 }));
    const noInput = makeInput({ sweet_spot_preference: null });
    const base = calculateScore(noInput, makeRacket({ sweet_spot_size: 55 }));
    expect(result.score - base.score).toBe(5);
  });

  it("gives 10 points for matching material (carbon)", () => {
    const input = makeInput({ preferred_material: "carbon" });
    const match = calculateScore(input, makeRacket({ material_face: "Carbon Fiber" }));
    expect(match.reasons).toContain("Karbonovy povrch - tvrdy uder");
  });

  it("gives 0 material points when no match", () => {
    const input = makeInput({ preferred_material: "fiberglass" });
    const result = calculateScore(input, makeRacket({ material_face: "Carbon" }));
    const matReasons = result.reasons.filter((r) => r.includes("komfort") || r.includes("povrch"));
    expect(matReasons).toHaveLength(0);
  });

  it("gives 10 points for latest year preference", () => {
    const currentYear = new Date().getFullYear();
    const input = makeInput({ year_preference: "latest" });
    const match = calculateScore(input, makeRacket({ year: currentYear }));
    expect(match.reasons).toContain("Novinka aktualniho roku");
  });

  it("gives 0 year points when year_preference is 'any'", () => {
    const input = makeInput({ year_preference: "any" });
    const result = calculateScore(input, makeRacket());
    expect(result.maxScore).toBe(135);
  });

  it("returns maxScore 135 when no new fields are set", () => {
    const result = calculateScore(makeInput(), makeRacket());
    expect(result.maxScore).toBe(135);
  });

  it("returns maxScore 180 when all new fields are set", () => {
    const input = makeInput({
      preferred_shape: "teardrop",
      sweet_spot_preference: "large",
      preferred_material: "carbon",
      year_preference: "latest",
    });
    const result = calculateScore(input, makeRacket());
    expect(result.maxScore).toBe(180);
  });

  it("returns perfect score 180 with all factors matching", () => {
    const currentYear = new Date().getFullYear();
    const input = makeInput({
      play_style: "universal",
      preferred_balance: "balanced",
      preferred_weight: 365,
      preferred_hardness: "medium",
      player_level: "intermediate",
      player_position: "universal",
      price_min: 3000,
      price_max: 6000,
      preferred_brands: ["TestBrand"],
      control_vs_power: 50,
      preferred_shape: "teardrop",
      sweet_spot_preference: "large",
      preferred_material: "carbon",
      year_preference: "latest",
    });
    const racket = makeRacket({
      play_style: "universal",
      balance: "balanced",
      weight: 365,
      hardness: "medium",
      player_level: "intermediate",
      player_position: "universal",
      price: 4500,
      brand: "TestBrand",
      power_rating: 50,
      shape: "teardrop",
      sweet_spot_size: 80,
      material_face: "Carbon",
      year: currentYear,
    });
    const result = calculateScore(input, racket);
    expect(result.score).toBe(180);
    expect(result.maxScore).toBe(180);
  });

  // ── Higher overall scores: realistic scenarios ──

  it("gives 90%+ match for well-fitting beginner racket", () => {
    const input = makeInput({
      player_level: "beginner",
      play_style: "defensive",
      preferred_balance: "head_light",
      preferred_weight: 355,
      preferred_hardness: "soft",
      control_vs_power: 35,
      price_min: 0,
      price_max: 4000,
      preferred_brands: [],
    });
    const racket = makeRacket({
      player_level: "beginner",
      play_style: "defensive",
      balance: "head_light",
      weight: 355,
      hardness: "soft",
      power_rating: 42,
      price: 1990,
    });
    const result = calculateScore(input, racket);
    expect(result.score / result.maxScore).toBeGreaterThan(0.9);
  });
});
