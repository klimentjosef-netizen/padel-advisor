export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function normalizeBrand(value: string): string {
  return normalizeText(value).replace(/\s+/g, " ");
}

export function normalizeModel(value: string): string {
  const stripped = normalizeText(value)
    .replace(/\b(?:padel|racket|raquette|pala|review|racquet|test)\b/g, " ")
    .replace(/\b20\d{2}\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return stripped;
}

export function buildNormalizedKey(brand: string, model: string, year?: number): string {
  const brandNorm = normalizeBrand(brand);
  const modelNorm = normalizeModel(model);
  const yearPart = year ? String(year) : "na";
  return `${brandNorm}|${modelNorm}|${yearPart}`;
}

export function extractYear(text: string): number | undefined {
  const match = text.match(/20\d{2}/);
  return match ? Number(match[0]) : undefined;
}
