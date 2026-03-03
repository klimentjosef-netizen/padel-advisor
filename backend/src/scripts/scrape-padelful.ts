import "dotenv/config";
import axios from "axios";
import * as cheerio from "cheerio";
import { db } from "../shared/db";
import {
  ScrapedRacket, Balance, Hardness, PlayStyle, PlayerLevel,
  cleanText, clampRating, ensureSchema, mapWithConcurrency, persistScrapedRacket,
} from "./shared/scraper-utils";

const BASE_URL = "https://www.padelful.com";
const SOURCE_NAME = "padelful";

function parseArgs(): { maxPages?: number; concurrency: number } {
  const args = process.argv.slice(2);
  const maxPagesArg = args.find((arg) => arg.startsWith("--max-pages="));
  const concurrencyArg = args.find((arg) => arg.startsWith("--concurrency="));
  return {
    maxPages: maxPagesArg ? Number(maxPagesArg.split("=")[1]) : undefined,
    concurrency: Number(concurrencyArg?.split("=")[1] ?? 6),
  };
}

function extractScore(blockText: string, label: string): number | undefined {
  const regex = new RegExp(`${label}\\s*([0-9]{1,3})`, "i");
  const match = blockText.match(regex);
  return match ? Number(match[1]) : undefined;
}

const BOUNDARY_LABELS = [
  "Shape", "Weight", "Touch", "Core", "Faces", "Frame",
  "Power", "Control", "Rebound", "Maneuverability", "Sweet\\s*spot",
].join("|");

function extractBetween(blockText: string, label: string): string | undefined {
  const regex = new RegExp(`${label}\\s*:?[\\s-]*(.+?)(?=\\b(?:${BOUNDARY_LABELS})\\b|$)`, "i");
  const match = blockText.match(regex);
  return match ? cleanText(match[1]) : undefined;
}

function inferHardness(rawText: string): Hardness {
  const text = rawText.toLowerCase();
  if (text.includes("soft")) return "soft";
  if (text.includes("hard")) return "hard";
  return "medium";
}

function inferShape(rawShape: string): string {
  const value = rawShape.toLowerCase();
  if (value.includes("diamond")) return "diamond";
  if (value.includes("round")) return "round";
  if (value.includes("tear")) return "teardrop";
  return rawShape || "teardrop";
}

function inferBalance(power: number, control: number): Balance {
  const diff = power - control;
  if (diff >= 10) return "head_heavy";
  if (diff <= -10) return "head_light";
  return "balanced";
}

function inferPlayStyle(power: number, control: number): PlayStyle {
  const diff = power - control;
  if (diff >= 10) return "offensive";
  if (diff <= -10) return "defensive";
  return "universal";
}

function inferPlayerLevel(content: string, power: number): PlayerLevel {
  const text = content.toLowerCase();
  if (text.includes("beginner") || text.includes("easy to play")) return "beginner";
  if (text.includes("advanced") || power >= 88) return "advanced";
  return "intermediate";
}

function parseWeight(raw: string): number {
  const rangeMatch = raw.match(/(\d{3})\s*[-–]\s*(\d{3})/);
  if (rangeMatch) return Math.round((Number(rangeMatch[1]) + Number(rangeMatch[2])) / 2);
  const single = raw.match(/(\d{3})/);
  return single ? Number(single[1]) : 365;
}

function parseBrandModel(title: string, slug: string): { brand: string; model: string } {
  const cleanTitle = cleanText(title.replace(/review/gi, ""));
  const multiWordBrands = ["Black Crown", "Drop Shot", "Royal Padel"];
  for (const candidate of multiWordBrands) {
    if (cleanTitle.toLowerCase().startsWith(candidate.toLowerCase())) {
      const model = cleanText(cleanTitle.slice(candidate.length));
      return { brand: candidate, model: model || slug };
    }
  }
  const parts = cleanTitle.split(" ");
  if (parts.length >= 2) return { brand: parts[0], model: parts.slice(1).join(" ") };
  const fallback = slug.split("-");
  return { brand: fallback[0] ?? "Unknown", model: fallback.slice(1).join(" ") || slug };
}

function parseYear(title: string, text: string): number {
  const fromTitle = title.match(/20\d{2}/);
  if (fromTitle) return Number(fromTitle[0]);
  const fromText = text.match(/20\d{2}/);
  if (fromText) return Number(fromText[0]);
  return new Date().getFullYear();
}

function parsePrice(text: string): number {
  const match = text.match(/(?:EUR|€|CZK|Kc)\s*([0-9]{2,5})|([0-9]{2,5})\s*(?:EUR|€|CZK|Kc)/i);
  if (!match) return 0;
  return Number(match[1] ?? match[2] ?? 0);
}

async function fetchListPage(page: number): Promise<{ slugs: string[]; totalPages: number }> {
  const url = `${BASE_URL}/en/rackets?page=${page}`;
  const response = await axios.get<string>(url, { timeout: 20000 });
  const $ = cheerio.load(response.data);

  const slugSet = new Set<string>();
  $("a[href]").each((_i, el) => {
    const href = $(el).attr("href");
    if (!href) return;
    const match = href.match(/^\/en\/rackets\/([^/?#]+)$/);
    if (match) slugSet.add(match[1]);
  });

  let totalPages = 1;
  $("a[href*='?page=']").each((_i, el) => {
    const href = $(el).attr("href") ?? "";
    const pageMatch = href.match(/page=(\d+)/);
    if (pageMatch) totalPages = Math.max(totalPages, Number(pageMatch[1]));
  });

  return { slugs: Array.from(slugSet), totalPages };
}

async function getAllSlugs(maxPages?: number): Promise<string[]> {
  const first = await fetchListPage(1);
  const totalPages = maxPages ? Math.min(maxPages, first.totalPages) : first.totalPages;
  const allSlugs = new Set(first.slugs);

  for (let page = 2; page <= totalPages; page += 1) {
    const data = await fetchListPage(page);
    data.slugs.forEach((slug) => allSlugs.add(slug));
    console.log(`Scanned list page ${page}/${totalPages} (unique slugs: ${allSlugs.size})`);
  }

  return Array.from(allSlugs);
}

async function scrapeDetail(slug: string): Promise<ScrapedRacket | null> {
  const sourceUrl = `${BASE_URL}/en/rackets/${slug}`;
  try {
    const response = await axios.get<string>(sourceUrl, { timeout: 20000 });
    const $ = cheerio.load(response.data);
    const bodyText = cleanText($("body").text());

    const title = cleanText($("h1").first().text() || slug.replace(/-/g, " "));
    const description = cleanText($("meta[name='description']").attr("content") || $("p").first().text() || "");
    const imageUrl = $("meta[property='og:image']").attr("content") || "";

    const power = clampRating(extractScore(bodyText, "Power"), 50);
    const control = clampRating(extractScore(bodyText, "Control"), 50);
    const rebound = clampRating(extractScore(bodyText, "Rebound"), 50);
    const maneuverability = clampRating(extractScore(bodyText, "Maneuverability"), 50);
    const sweetSpot = clampRating(extractScore(bodyText, "Sweet\\s*spot"), 50);

    const shape = inferShape(extractBetween(bodyText, "Shape") || "teardrop");
    const weightRaw = extractBetween(bodyText, "Weight") || "365";
    const hardnessRaw = extractBetween(bodyText, "Touch") || "medium";
    const core = extractBetween(bodyText, "Core") || "Unknown";
    const frame = extractBetween(bodyText, "Frame") || "Unknown";
    const faces = extractBetween(bodyText, "Faces") || "Unknown";

    const ratingMatch = bodyText.match(/([0-9]{2,3})\s*\/\s*100/);
    const sourceRating = clampRating(ratingMatch ? Number(ratingMatch[1]) : undefined, Math.round((power + control) / 2));

    const { brand, model } = parseBrandModel(title, slug);
    const year = parseYear(title, bodyText);

    return {
      sourceSlug: slug, sourceUrl, title, brand, model, year, description, imageUrl,
      price: parsePrice(bodyText), weight: parseWeight(weightRaw),
      balance: inferBalance(power, control), shape, hardness: inferHardness(hardnessRaw),
      controlRating: control, powerRating: power, reboundRating: rebound,
      maneuverabilityRating: maneuverability, sweetSpotRating: sweetSpot,
      materialFace: faces, materialFrame: frame, sourceRating,
      playerLevel: inferPlayerLevel(bodyText, power), playerPosition: "universal",
      playStyle: inferPlayStyle(power, control),
      payload: { title, slug, power, control, rebound, maneuverability, sweetSpot, shape, weightRaw, hardnessRaw, core, frame, faces, sourceRating },
    };
  } catch (error) {
    console.warn(`Failed to scrape ${sourceUrl}`, error instanceof Error ? error.message : error);
    return null;
  }
}

async function run(): Promise<void> {
  const { maxPages, concurrency } = parseArgs();
  await ensureSchema();

  const slugs = await getAllSlugs(maxPages);
  console.log(`Found ${slugs.length} racket detail pages`);

  const scraped = await mapWithConcurrency(slugs, concurrency, async (slug, index) => {
    const data = await scrapeDetail(slug);
    console.log(`Processed ${index + 1}/${slugs.length}: ${slug}`);
    return data;
  });

  const valid = scraped.filter((row): row is ScrapedRacket => row !== null);
  for (const row of valid) {
    await persistScrapedRacket(SOURCE_NAME, row);
  }

  console.log(`Padelful import complete. Parsed: ${valid.length}, stored: ${valid.length}`);
  await db.end();
}

run().catch(async (error) => {
  console.error("Padelful import failed", error);
  await db.end();
  process.exit(1);
});
