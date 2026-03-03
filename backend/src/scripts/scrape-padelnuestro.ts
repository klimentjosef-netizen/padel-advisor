import "dotenv/config";
import axios from "axios";
import * as cheerio from "cheerio";
import { db } from "../shared/db";
import { extractYear, normalizeText } from "../shared/normalize";
import {
  ScrapedRacket, Balance, Hardness, PlayStyle, PlayerLevel,
  cleanText, clampRating, ensureSchema, mapWithConcurrency, persistScrapedRacket,
} from "./shared/scraper-utils";

const BASE_URL = "https://www.padelnuestro.com";
const SOURCE_NAME = "padelnuestro";

interface JsonLdProduct {
  name?: string;
  description?: string;
  image?: string | string[];
  brand?: { name?: string } | string;
  offers?: { price?: string | number } | Array<{ price?: string | number }>;
}

function parseArgs(): { maxPages?: number; maxProducts?: number; concurrency: number } {
  const args = process.argv.slice(2);
  const maxPagesArg = args.find((arg) => arg.startsWith("--max-pages="));
  const maxProductsArg = args.find((arg) => arg.startsWith("--max-products="));
  const concurrencyArg = args.find((arg) => arg.startsWith("--concurrency="));
  return {
    maxPages: maxPagesArg ? Number(maxPagesArg.split("=")[1]) : undefined,
    maxProducts: maxProductsArg ? Number(maxProductsArg.split("=")[1]) : undefined,
    concurrency: Number(concurrencyArg?.split("=")[1] ?? 6),
  };
}

function parseNumberish(value: unknown): number | undefined {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return undefined;
  const match = value.replace(/,/g, ".").match(/([0-9]+(?:\.[0-9]+)?)/);
  return match ? Number(match[1]) : undefined;
}

function extractLabeledValue(text: string, labels: string[]): string | undefined {
  for (const label of labels) {
    const rx = new RegExp(`${label}\\s*:?[\\s-]*([^|\\n\\r]{1,120})`, "i");
    const match = text.match(rx);
    if (match?.[1]) return cleanText(match[1]);
  }
  return undefined;
}

function inferShape(raw: string): string {
  const v = normalizeText(raw);
  if (v.includes("diamante") || v.includes("diamond")) return "diamond";
  if (v.includes("redonda") || v.includes("round")) return "round";
  if (v.includes("lagrima") || v.includes("teardrop")) return "teardrop";
  if (v.includes("hibrida") || v.includes("hybrid")) return "hybrid";
  return "teardrop";
}

function inferHardness(raw: string): Hardness {
  const v = normalizeText(raw);
  if (v.includes("blanda") || v.includes("soft")) return "soft";
  if (v.includes("dura") || v.includes("hard")) return "hard";
  return "medium";
}

function inferWeight(raw?: string): number {
  if (!raw) return 365;
  const range = raw.match(/(\d{3})\s*[-–]\s*(\d{3})/);
  if (range) return Math.round((Number(range[1]) + Number(range[2])) / 2);
  const grams = raw.match(/(\d{3})\s*g/i);
  if (grams) return Number(grams[1]);
  const fallback = raw.match(/(\d{3})/);
  return fallback ? Number(fallback[1]) : 365;
}

function inferBalance(balanceRaw: string, power: number, control: number): Balance {
  const v = normalizeText(balanceRaw);
  if (v.includes("alto") || v.includes("high") || v.includes("heavy")) return "head_heavy";
  if (v.includes("bajo") || v.includes("light")) return "head_light";
  const diff = power - control;
  if (diff >= 10) return "head_heavy";
  if (diff <= -10) return "head_light";
  return "balanced";
}

function inferPlayStyle(power: number, control: number, shape: string): PlayStyle {
  if (shape === "diamond") return "offensive";
  if (shape === "round") return "defensive";
  const diff = power - control;
  if (diff >= 10) return "offensive";
  if (diff <= -10) return "defensive";
  return "universal";
}

function inferLevel(raw: string, power: number): PlayerLevel {
  const v = normalizeText(raw);
  if (v.includes("iniciacion") || v.includes("principiante") || v.includes("beginner")) return "beginner";
  if (v.includes("avanzado") || v.includes("pro") || power >= 88) return "advanced";
  return "intermediate";
}

function splitBrandModel(fullName: string): { brand: string; model: string } {
  const name = cleanText(fullName);
  const multiWordBrands = ["Black Crown", "Drop Shot", "Royal Padel"];
  for (const b of multiWordBrands) {
    if (name.toLowerCase().startsWith(b.toLowerCase())) {
      return { brand: b, model: cleanText(name.slice(b.length)) };
    }
  }
  const parts = name.split(" ");
  if (parts.length < 2) return { brand: parts[0] || "Unknown", model: name };
  return { brand: parts[0], model: parts.slice(1).join(" ") };
}

function parsePriceFromText(text: string): number {
  const m1 = text.match(/([0-9]{2,5})\s*€/);
  if (m1) return Number(m1[1]);
  const m2 = text.match(/€\s*([0-9]{2,5})/);
  if (m2) return Number(m2[1]);
  return 0;
}

function parseJsonLdProduct($: cheerio.CheerioAPI): JsonLdProduct | undefined {
  const scripts = $("script[type='application/ld+json']");
  for (let i = 0; i < scripts.length; i += 1) {
    const content = $(scripts[i]).text();
    if (!content) continue;
    try {
      const parsed = JSON.parse(content) as unknown;
      const stack = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of stack) {
        if (!item || typeof item !== "object") continue;
        const maybe = item as Record<string, unknown>;
        if (maybe["@type"] === "Product") return maybe as JsonLdProduct;
        const graph = maybe["@graph"];
        if (Array.isArray(graph)) {
          for (const g of graph) {
            if (g && typeof g === "object" && (g as Record<string, unknown>)["@type"] === "Product") {
              return g as JsonLdProduct;
            }
          }
        }
      }
    } catch { /* ignore */ }
  }
  return undefined;
}

async function fetchListPage(page: number): Promise<{ urls: string[]; hasNext: boolean }> {
  const url = `${BASE_URL}/palas-padel?p=${page}`;
  const response = await axios.get<string>(url, { timeout: 20000 });
  const $ = cheerio.load(response.data);

  const urlSet = new Set<string>();
  $("a[href]").each((_i, el) => {
    const href = $(el).attr("href") || "";
    if (!href.startsWith("/")) return;
    if (href.includes("/palas-padel-") || href.includes("/pala-padel-") || href.includes("/palas/")) {
      const normalized = href.split("?")[0];
      if (normalized.endsWith(".html") || /\/[^/]+$/.test(normalized)) {
        urlSet.add(`${BASE_URL}${normalized}`);
      }
    }
  });

  const bodyText = cleanText($("body").text()).toLowerCase();
  const hasNext = bodyText.includes("siguiente") || bodyText.includes("next") || $(`a[href*='?p=${page + 1}']`).length > 0;
  return { urls: Array.from(urlSet), hasNext };
}

async function fetchSitemapProductUrls(): Promise<string[]> {
  const candidates = ["/sitemap.xml", "/sitemap_index.xml", "/media/sitemaps/sitemap.xml"];
  const all = new Set<string>();
  for (const entry of candidates) {
    try {
      const response = await axios.get<string>(`${BASE_URL}${entry}`, { timeout: 15000 });
      const matches = response.data.match(/https?:\/\/www\.padelnuestro\.com\/[^<\s"]+/g) || [];
      matches.forEach((u) => { if (u.includes("palas") || u.includes("pala")) all.add(u.split("?")[0]); });
    } catch { /* ignore */ }
  }
  return Array.from(all);
}

async function getProductUrls(maxPages?: number, maxProducts?: number): Promise<string[]> {
  const fromSitemaps = await fetchSitemapProductUrls();
  const fromListing = new Set<string>();
  let page = 1;
  const hardStop = maxPages ?? 30;
  while (page <= hardStop) {
    const { urls, hasNext } = await fetchListPage(page);
    urls.forEach((u) => fromListing.add(u));
    console.log(`Scanned PadelNuestro list page ${page} (unique urls: ${fromListing.size})`);
    if (!hasNext && urls.length === 0) break;
    if (!hasNext && page > 3) break;
    page += 1;
  }
  const merged = Array.from(new Set([...fromSitemaps, ...fromListing]));
  const products = merged.filter((u) => {
    if (u.includes("/blog") || u.includes("/marca/")) return false;
    if (/\/palas-padel\/?$/.test(u) || /\/palas-padel\?/.test(u)) return false;
    return true;
  });
  return typeof maxProducts === "number" ? products.slice(0, maxProducts) : products;
}

async function scrapeProduct(url: string): Promise<ScrapedRacket | null> {
  try {
    const response = await axios.get<string>(url, { timeout: 20000 });
    const $ = cheerio.load(response.data);
    const bodyText = cleanText($("body").text());
    const jsonLd = parseJsonLdProduct($);

    const title = cleanText((jsonLd?.name as string | undefined) || $("h1").first().text() || "Unknown racket");
    const description = cleanText((jsonLd?.description as string | undefined) || $("meta[name='description']").attr("content") || "");

    let imageUrl = "";
    if (typeof jsonLd?.image === "string") imageUrl = jsonLd.image;
    if (Array.isArray(jsonLd?.image) && jsonLd?.image[0]) imageUrl = jsonLd.image[0];
    if (!imageUrl) imageUrl = $("meta[property='og:image']").attr("content") || "";

    let brand = "";
    if (typeof jsonLd?.brand === "string") brand = jsonLd.brand;
    if (typeof jsonLd?.brand === "object" && jsonLd?.brand?.name) brand = jsonLd.brand.name;
    const fromSplit = splitBrandModel(title);
    if (!brand) brand = fromSplit.brand;
    const model = brand === fromSplit.brand ? fromSplit.model : cleanText(title.replace(new RegExp(`^${brand}`, "i"), ""));

    const year = extractYear(title) ?? extractYear(bodyText) ?? new Date().getFullYear();

    let price = 0;
    const offers = jsonLd?.offers;
    if (Array.isArray(offers)) price = parseNumberish(offers[0]?.price) ?? 0;
    else if (offers && typeof offers === "object") price = parseNumberish(offers.price) ?? 0;
    if (!price) price = parsePriceFromText(bodyText);

    const weightRaw = extractLabeledValue(bodyText, ["Peso", "Weight"]) || "365";
    const balanceRaw = extractLabeledValue(bodyText, ["Balance", "Equilibrio"]) || "balanced";
    const shapeRaw = extractLabeledValue(bodyText, ["Forma", "Shape"]) || "teardrop";
    const hardnessRaw = extractLabeledValue(bodyText, ["Tacto", "Dureza", "Foam"]) || "medium";
    const faceRaw = extractLabeledValue(bodyText, ["Caras", "Plano", "Surface"]) || "Unknown";
    const frameRaw = extractLabeledValue(bodyText, ["Marco", "Frame"]) || "Unknown";
    const levelRaw = extractLabeledValue(bodyText, ["Nivel", "Level"]) || bodyText;

    const power = clampRating((parseNumberish(extractLabeledValue(bodyText, ["Potencia", "Power"])) ?? 5) * 10, 50);
    const control = clampRating((parseNumberish(extractLabeledValue(bodyText, ["Control"])) ?? 5) * 10, 50);

    const shape = inferShape(shapeRaw);
    const hardness = inferHardness(hardnessRaw);
    const weight = inferWeight(weightRaw);
    const slug = url.split("/").pop()?.replace(".html", "") || model.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const playStyle = inferPlayStyle(power, control, shape);

    const sourceRatingMatch = bodyText.match(/(\d+(?:\.\d+)?)\s*\/\s*10/);
    const sourceRating = sourceRatingMatch ? clampRating(Number(sourceRatingMatch[1]) * 10, 50) : undefined;

    return {
      sourceSlug: slug, sourceUrl: url, title, brand, model: model || fromSplit.model || title, year,
      description, imageUrl, price, weight,
      balance: inferBalance(balanceRaw, power, control), shape, hardness,
      controlRating: control, powerRating: power,
      reboundRating: clampRating(control + (hardness === "soft" ? 10 : hardness === "hard" ? -5 : 0), 50),
      maneuverabilityRating: clampRating(100 - Math.abs(weight - 360) * 2, 50),
      sweetSpotRating: shape === "round" ? 82 : shape === "teardrop" ? 72 : 62,
      materialFace: faceRaw, materialFrame: frameRaw, sourceRating,
      playerLevel: inferLevel(levelRaw, power), playerPosition: "universal", playStyle,
      payload: { title, brand, model, year, jsonLd, weightRaw, balanceRaw, shapeRaw, hardnessRaw, sourceRating },
    };
  } catch (error) {
    console.warn(`Failed to scrape ${url}`, error instanceof Error ? error.message : error);
    return null;
  }
}

async function run(): Promise<void> {
  const { maxPages, maxProducts, concurrency } = parseArgs();
  await ensureSchema();

  const urls = await getProductUrls(maxPages, maxProducts);
  console.log(`Found ${urls.length} candidate product URLs on padelnuestro`);

  const scraped = await mapWithConcurrency(urls, concurrency, async (url, index) => {
    const row = await scrapeProduct(url);
    console.log(`Processed ${index + 1}/${urls.length}: ${url}`);
    return row;
  });

  const valid = scraped.filter((row): row is ScrapedRacket => row !== null);
  for (const row of valid) {
    await persistScrapedRacket(SOURCE_NAME, row);
  }

  console.log(`PadelNuestro import complete. Parsed: ${valid.length}, stored: ${valid.length}`);
  await db.end();
}

run().catch(async (error) => {
  console.error("PadelNuestro import failed", error);
  await db.end();
  process.exit(1);
});
