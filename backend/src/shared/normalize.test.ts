import { describe, it, expect } from "vitest";
import { normalizeText, normalizeBrand, normalizeModel, buildNormalizedKey, extractYear } from "./normalize";

describe("normalizeText", () => {
  it("lowercases and strips diacritics", () => {
    expect(normalizeText("Čerstvý Vzduch")).toBe("cerstvy vzduch");
  });

  it("replaces non-alphanumeric with spaces", () => {
    expect(normalizeText("hello-world_test")).toBe("hello world test");
  });

  it("trims whitespace", () => {
    expect(normalizeText("  foo  bar  ")).toBe("foo bar");
  });
});

describe("normalizeBrand", () => {
  it("normalizes brand names", () => {
    expect(normalizeBrand("Black Crown")).toBe("black crown");
  });

  it("collapses multiple spaces", () => {
    expect(normalizeBrand("Drop   Shot")).toBe("drop shot");
  });
});

describe("normalizeModel", () => {
  it("strips padel-related words", () => {
    expect(normalizeModel("Vertex 04 Padel Review")).toBe("vertex 04");
  });

  it("strips year from model name", () => {
    expect(normalizeModel("AT10 Genius 2025")).toBe("at10 genius");
  });
});

describe("buildNormalizedKey", () => {
  it("builds key with year", () => {
    expect(buildNormalizedKey("Bullpadel", "Vertex 04", 2025)).toBe("bullpadel|vertex 04|2025");
  });

  it("uses 'na' when year is not provided", () => {
    expect(buildNormalizedKey("Head", "Delta Pro")).toBe("head|delta pro|na");
  });
});

describe("extractYear", () => {
  it("extracts 4-digit year", () => {
    expect(extractYear("Bullpadel Vertex 2025")).toBe(2025);
  });

  it("returns undefined when no year found", () => {
    expect(extractYear("No year here")).toBeUndefined();
  });

  it("extracts first year from text with multiple numbers", () => {
    expect(extractYear("Model 100 from 2024 edition")).toBe(2024);
  });
});
