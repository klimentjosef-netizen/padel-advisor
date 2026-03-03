import { RecommendationInput, Racket } from "../../types";

interface ScoreResult {
  score: number;
  maxScore: number;
  reasons: string[];
}

// ── Helper: ordered distance between enum values ──
function enumDistance(a: string, b: string, order: string[]): number {
  const ia = order.indexOf(a);
  const ib = order.indexOf(b);
  if (ia === -1 || ib === -1) return 99;
  return Math.abs(ia - ib);
}

// ── Weight scoring (max 20) ──
function weightScore(preferred: number, actual: number): { points: number; reason?: string } {
  const diff = Math.abs(preferred - actual);
  if (diff <= 1) return { points: 20, reason: "Odpovida preferovane vaze" };
  if (diff <= 3) return { points: 16, reason: "Velmi blizko preferovane vaze" };
  if (diff <= 6) return { points: 12, reason: "Prijatelna odchylka vahy" };
  if (diff <= 10) return { points: 6, reason: "Mirna odchylka vahy" };
  if (diff <= 15) return { points: 2 };
  return { points: 0 };
}

// ── Play style scoring (max 30) ──
function playStyleScore(input: string, racket: string): { points: number; reason?: string } {
  if (input === racket || racket === "universal") {
    return { points: 30, reason: "Vhodna pro zvoleny herni styl" };
  }
  if (input === "universal") {
    return { points: 20, reason: "Univerzalne pouzitelna" };
  }
  // opposite styles still get a small base
  return { points: 5 };
}

// ── Balance scoring (max 25) ──
function balanceScore(preferred: string, actual: string): { points: number; reason?: string } {
  if (preferred === actual) {
    return { points: 25, reason: "Vyvazeni odpovida preferenci" };
  }
  const order = ["head_light", "balanced", "head_heavy"];
  const dist = enumDistance(preferred, actual, order);
  if (dist === 1) return { points: 15, reason: "Blizke vyvazeni" };
  return { points: 4 };
}

// ── Hardness scoring (max 10) ──
function hardnessScore(preferred: string, actual: string): { points: number; reason?: string } {
  if (preferred === actual) {
    return { points: 10, reason: "Tvrdost odpovida preferenci" };
  }
  const order = ["soft", "medium", "hard"];
  const dist = enumDistance(preferred, actual, order);
  if (dist === 1) return { points: 6, reason: "Podobna tvrdost" };
  return { points: 0 };
}

// ── Player level scoring (max 10) ──
function levelScore(inputLevel: string, racketLevel: string): { points: number; reason?: string } {
  if (inputLevel === racketLevel) {
    return { points: 10, reason: "Vhodna uroven hrace" };
  }
  const order = ["beginner", "intermediate", "advanced"];
  const dist = enumDistance(inputLevel, racketLevel, order);
  if (dist === 1) return { points: 6, reason: "Blizka uroven hrace" };
  return { points: 1 };
}

// ── Price scoring (max 15) ──
function priceScore(min: number, max: number, actual: number): { points: number; reason?: string } {
  if (actual >= min && actual <= max) {
    return { points: 15, reason: "Cena je v pozadovanem rozpoctu" };
  }
  // Within 20% above budget still gets partial
  const tolerance = (max - min) * 0.2 || 500;
  if (actual >= min && actual <= max + tolerance) {
    return { points: 8, reason: "Mirne nad rozpoctem" };
  }
  if (actual < min && actual >= min - tolerance) {
    return { points: 8, reason: "Mirne pod rozpoctem" };
  }
  return { points: 0 };
}

// ── Control/power alignment (max 10) ──
function controlPowerAlignment(input: RecommendationInput, racket: Racket): { points: number; reason?: string } {
  const targetPower = input.control_vs_power;
  const actualPower = racket.power_rating;
  const diff = Math.abs(targetPower - actualPower);

  if (diff <= 10) return { points: 10, reason: "Sedici pomer control/power" };
  if (diff <= 20) return { points: 6, reason: "Podobny pomer control/power" };
  if (diff <= 30) return { points: 3 };
  return { points: 0 };
}

// ── Shape scoring (max 15, dynamic) ──
function shapeScore(preferred: string | null | undefined, actual: string): { points: number; reason?: string } {
  if (!preferred) return { points: 0 };
  const normalized = actual.toLowerCase();
  const shapeMap: Record<string, string[]> = {
    round: ["round", "kulat", "redonda", "circular"],
    teardrop: ["teardrop", "kapka", "lagrima", "drop", "gota"],
    diamond: ["diamond", "diamant", "diamante"],
  };
  const aliases = shapeMap[preferred] ?? [];
  if (aliases.some((a) => normalized.includes(a)) || normalized === preferred) {
    return { points: 15, reason: "Tvar rakety odpovida preferenci" };
  }
  // Adjacent shape: teardrop is between round and diamond
  const shapeOrder = ["round", "teardrop", "diamond"];
  const prefIdx = shapeOrder.indexOf(preferred);
  const matchedShape = shapeOrder.find((s) => {
    const sa = shapeMap[s] ?? [];
    return sa.some((a) => normalized.includes(a)) || normalized === s;
  });
  const actIdx = matchedShape ? shapeOrder.indexOf(matchedShape) : -1;
  if (prefIdx >= 0 && actIdx >= 0 && Math.abs(prefIdx - actIdx) === 1) {
    return { points: 7, reason: "Podobny tvar rakety" };
  }
  return { points: 0 };
}

// ── Sweet spot scoring (max 10, dynamic) ──
function sweetSpotScore(preferred: string | null | undefined, actualSize: number): { points: number; reason?: string } {
  if (!preferred) return { points: 0 };
  if (preferred === "large" && actualSize >= 70) return { points: 10, reason: "Velky sweet spot - odpoustejici" };
  if (preferred === "medium" && actualSize >= 40 && actualSize < 70) return { points: 10, reason: "Stredni sweet spot" };
  if (preferred === "small" && actualSize < 40) return { points: 10, reason: "Maly sweet spot - presny" };
  if (preferred === "large" && actualSize >= 50) return { points: 5 };
  if (preferred === "small" && actualSize < 55) return { points: 5 };
  return { points: 0 };
}

// ── Material scoring (max 10, dynamic) ──
function materialScore(preferred: string | null | undefined, actualFace: string): { points: number; reason?: string } {
  if (!preferred) return { points: 0 };
  const face = actualFace.toLowerCase();
  if (preferred === "carbon" && (face.includes("carbon") || face.includes("karbon"))) {
    return { points: 10, reason: "Karbonovy povrch - tvrdy uder" };
  }
  if (preferred === "fiberglass" && (face.includes("glass") || face.includes("fibra") || face.includes("sklolaminat"))) {
    return { points: 10, reason: "Sklolaminat - vetsi komfort" };
  }
  return { points: 0 };
}

// ── Year scoring (max 10, dynamic) ──
function yearScore(preferred: string | null | undefined, actualYear: number): { points: number; reason?: string } {
  if (!preferred || preferred === "any") return { points: 0 };
  const currentYear = new Date().getFullYear();
  if (preferred === "latest") {
    if (actualYear >= currentYear) return { points: 10, reason: "Novinka aktualniho roku" };
    if (actualYear === currentYear - 1) return { points: 5 };
  }
  if (preferred === "recent") {
    if (actualYear >= currentYear - 2) return { points: 10, reason: "Model poslednich 2-3 let" };
    if (actualYear >= currentYear - 3) return { points: 5 };
  }
  return { points: 0 };
}

// ── Main scoring function ──
export function calculateScore(input: RecommendationInput, racket: Racket): ScoreResult {
  let score = 0;
  let maxScore = 135;
  const reasons: string[] = [];

  // Play style (30)
  const ps = playStyleScore(input.play_style, racket.play_style);
  score += ps.points;
  if (ps.reason) reasons.push(ps.reason);

  // Balance (25) — with partial credit
  const bal = balanceScore(input.preferred_balance, racket.balance);
  score += bal.points;
  if (bal.reason) reasons.push(bal.reason);

  // Weight (20) — with softer thresholds
  const weight = weightScore(input.preferred_weight, racket.weight);
  score += weight.points;
  if (weight.reason) reasons.push(weight.reason);

  // Hardness (10) — with partial credit
  const hard = hardnessScore(input.preferred_hardness, racket.hardness);
  score += hard.points;
  if (hard.reason) reasons.push(hard.reason);

  // Player level (10) — with partial credit
  const level = levelScore(input.player_level, racket.player_level);
  score += level.points;
  if (level.reason) reasons.push(level.reason);

  // Player position (5)
  if (input.player_position === racket.player_position || racket.player_position === "universal") {
    score += 5;
    reasons.push("Hodi se na zvolenou pozici");
  }

  // Price (15) — with near-budget partial credit
  const price = priceScore(input.price_min, input.price_max, racket.price);
  score += price.points;
  if (price.reason) reasons.push(price.reason);

  // Brands (10) — if no brands preferred, give full points (all brands are acceptable)
  if (input.preferred_brands.length === 0) {
    score += 10;
  } else if (input.preferred_brands.includes(racket.brand)) {
    score += 10;
    reasons.push("Znacka je mezi preferovanymi");
  }

  // Control/power (10) — with softer thresholds
  const cp = controlPowerAlignment(input, racket);
  score += cp.points;
  if (cp.reason) reasons.push(cp.reason);

  // New factors — dynamic maxScore (only added when user provides preference)
  if (input.preferred_shape) {
    maxScore += 15;
    const shape = shapeScore(input.preferred_shape, racket.shape);
    score += shape.points;
    if (shape.reason) reasons.push(shape.reason);
  }

  if (input.sweet_spot_preference) {
    maxScore += 10;
    const ss = sweetSpotScore(input.sweet_spot_preference, racket.sweet_spot_size);
    score += ss.points;
    if (ss.reason) reasons.push(ss.reason);
  }

  if (input.preferred_material) {
    maxScore += 10;
    const mat = materialScore(input.preferred_material, racket.material_face);
    score += mat.points;
    if (mat.reason) reasons.push(mat.reason);
  }

  if (input.year_preference && input.year_preference !== "any") {
    maxScore += 10;
    const yr = yearScore(input.year_preference, racket.year);
    score += yr.points;
    if (yr.reason) reasons.push(yr.reason);
  }

  return { score, maxScore, reasons };
}
