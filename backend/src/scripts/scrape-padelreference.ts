import "dotenv/config";
import axios from "axios";
import * as cheerio from "cheerio";
import { db } from "../shared/db";
import { extractYear, normalizeText } from "../shared/normalize";
import {
  ScrapedRacket, Balance, Hardness, PlayStyle, PlayerLevel,
  cleanText, clampRating, ensureSchema, mapWithConcurrency, persistScrapedRacket,
} from "./shared/scraper-utils";

const BASE_URL = "https://www.padelreference.com";
const SOURCE_NAME = "padelreference";

function parseArgs(): { maxProducts?: number; concurrency: number } {
  const args = process.argv.slice(2);
  const maxArg = args.find((arg) => arg.startsWith("--max-products="));
  const concArg = args.find((arg) => arg.startsWith("--concurrency="));
  return {
    maxProducts: maxArg ? Number(maxArg.split("=")[1]) : undefined,
    concurrency: Number(concArg?.split("=")[1] ?? 5),
  };
}

function parseNumber(input?: string): number | undefined {
  if (!input) return undefined;
  const match = input.replace(",", ".").match(/([0-9]+(?:\.[0-9]+)?)/);
  return match ? Number(match[1]) : undefined;
}

function parsePrice(text: string): number {
  const direct = text.match(/([0-9]{2,5})\s*€/);
  if (direct) return Number(direct[1]);
  const alt = text.match(/€\s*([0-9]{2,5})/);
  if (alt) return Number(alt[1]);
  return 0;
}

function parseWeight(text: string): number {
  const range = text.match(/(\d{3})\s*[-–]\s*(\d{3})/);
  if (range) return Math.round((Number(range[1]) + Number(range[2])) / 2);
  const single = text.match(/(\d{3})\s*g/i);
  if (single) return Number(single[1]);
  const fallback = text.match(/(\d{3})/);
  return fallback ? Number(fallback[1]) : 365;
}

function inferShape(value: string): string {
  const v = normalizeText(value);
  if (v.includes("diamond")) return "diamond";
  if (v.includes("round")) return "round";
  if (v.includes("tear")) return "teardrop";
  if (v.includes("hybrid")) return "hybrid";
  return "teardrop";
}

function inferHardness(value: string): Hardness {
  const v = normalizeText(value);
  if (v.includes("soft") || v.includes("eva soft")) return "soft";
  if (v.includes("hard") || v.includes("eva hard")) return "hard";
  return "medium";
}

function inferBalance(text: string, power: number, control: number): Balance {
  const v = normalizeText(text);
  if (v.includes("head heavy") || v.includes("high")) return "head_heavy";
  if (v.includes("head light") || v.includes("low")) return "head_light";
  const diff = power - control;
  if (diff >= 10) return "head_heavy";
  if (diff <= -10) return "head_light";
  return "balanced";
}

function inferLevel(text: string, power: number): PlayerLevel {
  const v = normalizeText(text);
  if (v.includes("beginner") || v.includes("initiation")) return "beginner";
  if (v.includes("advanced") || v.includes("expert") || power >= 88) return "advanced";
  return "intermediate";
}

function inferPlayStyle(typeText: string, power: number, control: number): PlayStyle {
  const t = normalizeText(typeText);
  if (t.includes("power")) return "offensive";
  if (t.includes("control")) return "defensive";
  if (t.includes("versatility") || t.includes("hybrid")) return "universal";
  const diff = power - control;
  if (diff >= 10) return "offensive";
  if (diff <= -10) return "defensive";
  return "universal";
}

function extractLabeledValue(text: string, label: string): string | undefined {
  const rx = new RegExp(`${label}\\s*:?[\\s-]*([^|\\n\\r]{1,120})`, "i");
  const match = text.match(rx);
  return match ? cleanText(match[1]) : undefined;
}

function splitBrandModel(title: string): { brand: string; model: string } {
  const cleaned = cleanText(title.replace(/^padel racket\s*/i, ""));
  const multiWordBrands = ["Black Crown", "Drop Shot", "Royal Padel"];
  for (const brand of multiWordBrands) {
    if (cleaned.toLowerCase().startsWith(brand.toLowerCase())) {
      return { brand, model: cleanText(cleaned.slice(brand.length)) };
    }
  }
  const parts = cleaned.split(" ");
  if (parts.length < 2) return { brand: parts[0] || "Unknown", model: cleaned };
  return { brand: parts[0], model: parts.slice(1).join(" ") };
}

function extractRatings(text: string) {
  const normalized = text.replace(/\s+/g, " ");
  const p = parseNumber(extractLabeledValue(normalized, "Power"));
  const c = parseNumber(extractLabeledValue(normalized, "Control"));
  const comfort = parseNumber(extractLabeledValue(normalized, "Comfort"));
  const maneuverability = parseNumber(extractLabeledValue(normalized, "Maneuverability"));
  const tolerance = parseNumber(extractLabeledValue(normalized, "Tolerance"));
  return {
    power: clampRating((p ?? 5) * 10, 50),
    control: clampRating((c ?? 5) * 10, 50),
    comfort: comfort ? clampRating(comfort * 10, 50) : undefined,
    maneuverability: maneuverability ? clampRating(maneuverability * 10, 50) : undefined,
    tolerance: tolerance ? clampRating(tolerance * 10, 50) : undefined,
  };
}

function parseYear(title: string, model: string, text: string): number {
  return extractYear(title) ?? extractYear(model) ?? extractYear(text) ?? new Date().getFullYear();
}

async function fetchSitemapProductUrls(): Promise<string[]> {
  const possible = ["/sitemap.xml", "/sitemap_index.xml"];
  const results = new Set<string>();
  for (const pathSuffix of possible) {
    try {
      const response = await axios.get<string>(`${BASE_URL}${pathSuffix}`, { timeout: 15000 });
      const matches = response.data.match(/https?:\/\/www\.padelreference\.com\/en\/padel-rackets\/p\/[^<\s]+/g) || [];
      matches.forEach((url) => results.add(url));
    } catch { /* ignore */ }
  }
  return Array.from(results);
}

async function fetchListingUrls(): Promise<string[]> {
  const listingCandidates = ["/en/padelrackets", "/en/padel-rackets", "/en/padel-rackets/all"];
  const links = new Set<string>();
  for (const listing of listingCandidates) {
    try {
      const response = await axios.get<string>(`${BASE_URL}${listing}`, { timeout: 15000 });
      const $ = cheerio.load(response.data);
      $("a[href]").each((_i, el) => {
        const href = $(el).attr("href") || "";
        if (href.startsWith("/en/padel-rackets/p/")) links.add(`${BASE_URL}${href}`);
      });
    } catch { /* ignore */ }
  }
  return Array.from(links);
}

async function getProductUrls(maxProducts?: number): Promise<string[]> {
  const sitemap = await fetchSitemapProductUrls();
  const listing = await fetchListingUrls();
  const merged = Array.from(new Set([...sitemap, ...listing]));
  if (!merged.length) throw new Error("No product URLs found on padelreference");
  return typeof maxProducts === "number" ? merged.slice(0, maxProducts) : merged;
}

async function scrapeProduct(url: string): Promise<ScrapedRacket | null> {
  try {
    const response = await axios.get<string>(url, { timeout: 20000 });
    const $ = cheerio.load(response.data);
    const bodyText = cleanText($("body").text());

    const title = cleanText($("h1").first().text() || $("meta[property='og:title']").attr("content") || "Unknown racket");
    const description = cleanText($("meta[name='description']").attr("content") || $("p").first().text() || "");
    const imageUrl = $("meta[property='og:image']").attr("content") || "";

    const { brand, model } = splitBrandModel(title);
    const ratings = extractRatings(bodyText);

    const shapeText = extractLabeledValue(bodyText, "Shape") || "teardrop";
    const foamText = extractLabeledValue(bodyText, "Foam") || extractLabeledValue(bodyText, "Touch") || "medium";
    const weightText = extractLabeledValue(bodyText, "Weight") || "365 g";
    const balanceText = extractLabeledValue(bodyText, "Balance") || "balanced";
    const typeText = extractLabeledValue(bodyText, "Type") || "versatility";
    const levelText = extractLabeledValue(bodyText, "Level") || bodyText;
    const frameText = extractLabeledValue(bodyText, "Frame") || "Unknown";
    const surfaceText = extractLabeledValue(bodyText, "Surface") || extractLabeledValue(bodyText, "Faces") || "Unknown";

    const year = parseYear(title, model, bodyText);
    const slug = url.split("/").pop() || model.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const sourceRatingMatch = bodyText.match(/(\d+(?:\.\d+)?)\s*\/\s*10/);
    const sourceRating = sourceRatingMatch ? clampRating(Number(sourceRatingMatch[1]) * 10, 50) : undefined;

    return {
      sourceSlug: slug, sourceUrl: url, title, brand, model, year, description, imageUrl,
      price: parsePrice(bodyText), weight: parseWeight(weightText),
      balance: inferBalance(balanceText, ratings.power, ratings.control),
      shape: inferShape(shapeText), hardness: inferHardness(foamText),
      controlRating: ratings.control, powerRating: ratings.power,
      reboundRating: ratings.comfort, maneuverabilityRating: ratings.maneuverability,
      sweetSpotRating: ratings.tolerance ?? clampRating((ratings.control + ratings.power) / 2, 50),
      materialFace: surfaceText, materialFrame: frameText, sourceRating,
      playerLevel: inferLevel(levelText, ratings.power), playerPosition: "universal",
      playStyle: inferPlayStyle(typeText, ratings.power, ratings.control),
      payload: { title, brand, model, ratings, shapeText, foamText, weightText, balanceText, typeText, levelText, frameText, surfaceText, sourceRating },
    };
  } catch (error) {
    console.warn(`Failed to scrape ${url}`, error instanceof Error ? error.message : error);
    return null;
  }
}

async function run(): Promise<void> {
  const { maxProducts, concurrency } = parseArgs();
  await ensureSchema();

  const productUrls = await getProductUrls(maxProducts);
  console.log(`Found ${productUrls.length} product URLs on padelreference`);

  const scraped = await mapWithConcurrency(productUrls, concurrency, async (url, index) => {
    const row = await scrapeProduct(url);
    console.log(`Processed ${index + 1}/${productUrls.length}: ${url}`);
    return row;
  });

  const valid = scraped.filter((row): row is ScrapedRacket => row !== null);
  for (const row of valid) {
    await persistScrapedRacket(SOURCE_NAME, row);
  }

  console.log(`PadelReference import complete. Parsed: ${valid.length}, stored: ${valid.length}`);
  await db.end();
}

run().catch(async (error) => {
  console.error("PadelReference import failed", error);
  await db.end();
  process.exit(1);
});
