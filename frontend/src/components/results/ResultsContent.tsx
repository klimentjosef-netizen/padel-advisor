"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiGet, apiPost } from "@/services/api";
import { RecommendationInput, RecommendationItem, RecommendationResponse, RacketSummary } from "@/types";

interface Props {
  payload: string | undefined;
}

const fallbackPayload: RecommendationInput = {
  player_level: "beginner",
  play_style: "universal",
  player_position: "universal",
  preferred_weight: 360,
  preferred_balance: "balanced",
  preferred_hardness: "medium",
  control_vs_power: 50,
  price_min: 0,
  price_max: 6000,
  preferred_brands: [],
  preferred_shape: null,
  sweet_spot_preference: null,
  preferred_material: null,
  year_preference: "any",
  experience_months: null,
  play_tempo: null,
};

// ── Personalized profile description ──
function buildProfileDescription(input: RecommendationInput): string {
  const parts: string[] = [];

  // Player level description
  const levelMap: Record<string, string> = {
    beginner: "Jako zacatecnik potrebujes raketu, ktera ti odpousti chyby a pomaha budovat techniku.",
    intermediate: "Jako stredne pokrocily hrac hledas raketu, ktera ti umozni rozvoj a nabidne vyvazeny vykon.",
    advanced: "Jako pokrocily hrac oceníš raketu s preciznimi vlastnostmi, ktera maximalizuje tvuj styl hry.",
  };
  parts.push(levelMap[input.player_level] ?? "");

  // Play style
  if (input.play_style === "offensive") {
    parts.push("Tvuj utocny styl vyzaduje raketu s vyssi silou a vyvazenim smerem k hlavici.");
  } else if (input.play_style === "defensive") {
    parts.push("Tvuj obranny styl vyzaduje kontrolni raketu s nizkym vyvazenim a velkym sweet spotem.");
  } else {
    parts.push("Tvuj univerzalni styl hry ti dovoluje vybrat si z siroke nabidky vyvazenych raket.");
  }

  // Weight preference
  if (input.preferred_weight < 355) {
    parts.push("Lehka raketa (pod 355 g) ti zajisti snadnou manipulaci a rychlost u site.");
  } else if (input.preferred_weight > 370) {
    parts.push("Tezsi raketa (nad 370 g) ti doda vice sily v uderech, ale bude namahavejsi na ruku.");
  }

  // Hardness
  if (input.preferred_hardness === "soft") {
    parts.push("Mekci raketa bude setrnejsi k tve ruce a loktu a odpusti nepresne zasahy.");
  } else if (input.preferred_hardness === "hard") {
    parts.push("Tvrda raketa ti doda razanci a presnost, ale prenasi vice vibraci.");
  }

  // Budget
  if (input.price_max <= 3000) {
    parts.push("V tvem rozpoctu do 3 000 Kc najdes skvele vstupni modely od overrenych znacek.");
  } else if (input.price_max <= 5000) {
    parts.push("V rozpoctu 3 000 - 5 000 Kc je nejvetsi vyber kvalitních raket pro vetsinu hracu.");
  } else if (input.price_max <= 7000) {
    parts.push("V rozpoctu do 7 000 Kc dosahnes na profesionalni modely s pokrocilymi technologiemi.");
  } else {
    parts.push("S vysším rozpoctem mas pristup k tomu nejlepsimu co trh nabizi.");
  }

  return parts.filter(Boolean).join(" ");
}

// ── Translate balance/hardness/shape to Czech ──
function translateBalance(b: string): string {
  if (b === "head_heavy") return "Hlavou tezka";
  if (b === "head_light") return "Hlavou lehka";
  return "Vyvazena";
}
function translateHardness(h: string): string {
  if (h === "soft") return "Mekka";
  if (h === "hard") return "Tvrda";
  return "Stredni";
}
function translateShape(s: string): string {
  if (s === "round") return "Kulata";
  if (s === "teardrop") return "Kapka";
  if (s === "diamond") return "Diamant";
  return s;
}

export default function ResultsContent({ payload }: Props) {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [rackets, setRackets] = useState<RacketSummary[]>([]);
  const [warning, setWarning] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [parsedInput, setParsedInput] = useState<RecommendationInput>(fallbackPayload);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(99999);

  const selectedPath = useMemo(() => selected.join(","), [selected]);

  useEffect(() => {
    let input = fallbackPayload;
    if (payload) {
      try {
        input = JSON.parse(decodeURIComponent(payload)) as RecommendationInput;
      } catch {
        input = fallbackPayload;
      }
    }
    setParsedInput(input);

    async function load() {
      try {
        const rec = await apiPost<RecommendationResponse>("/api/recommendations", input);
        const allRackets = await apiGet<RacketSummary[]>("/api/rackets");
        setRackets(allRackets);

        if (rec.recommendations.length) {
          setRecommendations(rec.recommendations);
        } else if (allRackets.length) {
          setRecommendations(
            allRackets.slice(0, 5).map((r, i) => ({
              racket_id: r.id,
              score: 50 - i,
              match_percentage: 50 - i,
              reasons: ["Zakladni vypis dostupnych modelu"],
            })),
          );
          setWarning("Algoritmus nevratil zadny vysledek, proto zobrazuji dostupne modely.");
        }
      } catch {
        setWarning("Backend momentalne neodpovida. Zobrazuji dostupne rakety.");
        try {
          const allRackets = await apiGet<RacketSummary[]>("/api/rackets");
          setRackets(allRackets);
          setRecommendations(
            allRackets.slice(0, 5).map((r, i) => ({
              racket_id: r.id,
              score: 50 - i,
              match_percentage: 50 - i,
              reasons: ["Docasny vypis bez detailniho skorovani"],
            })),
          );
        } catch {
          setRecommendations([]);
          setRackets([]);
          setWarning("Nepodarilo se nacist ani seznam raket. Zkontroluj backend a databazi.");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [payload]);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].slice(0, 3),
    );
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-gray-500">Analyzuji tvuj profil a hledam nejlepsi rakety...</p>
      </div>
    );
  }

  const profileDescription = buildProfileDescription(parsedInput);

  return (
    <div>
      {/* Profile summary card */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-5 mb-6 text-white">
        <h1 className="text-xl font-bold">Tvuj herni profil</h1>
        <p className="mt-2 text-slate-300 text-sm leading-relaxed">{profileDescription}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs bg-white/10 px-2.5 py-1 rounded-full">{parsedInput.player_level === "beginner" ? "Zacatecnik" : parsedInput.player_level === "intermediate" ? "Stredne pokrocily" : "Pokrocily"}</span>
          <span className="text-xs bg-white/10 px-2.5 py-1 rounded-full">{parsedInput.play_style === "offensive" ? "Utocny styl" : parsedInput.play_style === "defensive" ? "Obranny styl" : "Univerzalni styl"}</span>
          <span className="text-xs bg-white/10 px-2.5 py-1 rounded-full">{parsedInput.preferred_weight} g</span>
          <span className="text-xs bg-white/10 px-2.5 py-1 rounded-full">{parsedInput.price_min} - {parsedInput.price_max} Kc</span>
        </div>
      </div>

      {/* Actions bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Top {recommendations.length} doporucenych raket</h2>
            {warning && <p className="text-orange-600 text-sm">{warning}</p>}
          </div>
          <div className="flex gap-2">
            <Link href="/questionnaire">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                Upravit odpovedi
              </button>
            </Link>
            {selected.length >= 2 && (
              <Link href={`/compare?ids=${selectedPath}`}>
                <button className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors">
                  Porovnat vybrane ({selected.length})
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Price filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Filtrovat podle ceny</h3>
        <div className="flex flex-wrap gap-2">
          {([
            { label: "Vse", min: 0, max: 99999 },
            { label: "Do 3 000 Kc", min: 0, max: 3000 },
            { label: "3 000 - 5 000 Kc", min: 3000, max: 5000 },
            { label: "5 000 - 7 000 Kc", min: 5000, max: 7000 },
            { label: "Nad 7 000 Kc", min: 7000, max: 99999 },
          ]).map((range) => {
            const active = priceMin === range.min && priceMax === range.max;
            return (
              <button
                key={range.label}
                onClick={() => { setPriceMin(range.min); setPriceMax(range.max); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-amber-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Racket cards */}
      {!recommendations.length ? (
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center text-gray-500">
          Nepodarilo se najit doporuceni. Zkus upravit odpovedi nebo rozpocet.
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.filter((item) => {
            const racket = rackets.find((r) => r.id === item.racket_id);
            if (!racket) return false;
            return racket.price >= priceMin && racket.price <= priceMax;
          }).map((item, index) => {
            const racket = rackets.find((r) => r.id === item.racket_id)!;

            return (
              <div key={item.racket_id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex">
                  {/* Racket image */}
                  <div className="w-28 sm:w-36 flex-shrink-0 bg-gray-50 flex items-center justify-center p-3 border-r border-gray-100">
                    {racket.image_url ? (
                      <img
                        src={racket.image_url}
                        alt={`${racket.brand} ${racket.model}`}
                        className="w-full h-auto max-h-40 object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-16 h-24 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                        Foto
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                            #{index + 1}
                          </span>
                          <h3 className="text-lg font-bold text-gray-800">
                            {racket.brand} {racket.model}
                          </h3>
                        </div>

                        {/* Match bar */}
                        <div className="flex items-center gap-3 mt-1.5">
                          <div className="flex-1 bg-gray-100 rounded-full h-2.5 max-w-xs">
                            <div
                              className="bg-amber-500 h-2.5 rounded-full transition-all"
                              style={{ width: `${Math.min(item.match_percentage, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-amber-600">{item.match_percentage}% shoda</span>
                        </div>

                        {/* Specs tags */}
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">{translateShape(racket.shape)}</span>
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">{racket.weight} g</span>
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">{translateBalance(racket.balance)}</span>
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">{translateHardness(racket.hardness)}</span>
                          <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md font-bold">{racket.price} Kc</span>
                        </div>

                        {/* Description */}
                        {racket.description && (
                          <p className="mt-2 text-xs text-gray-500 line-clamp-2">{racket.description}</p>
                        )}

                        {/* Match reasons */}
                        <div className="mt-2 flex flex-wrap gap-1">
                          {item.reasons.map((reason, i) => (
                            <span key={i} className="text-[11px] bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100">
                              {reason}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <Link href={`/racket/${racket.id}`}>
                          <button className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-900 transition-colors w-full">
                            Detail
                          </button>
                        </Link>
                        <button
                          onClick={() => toggle(item.racket_id)}
                          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                            selected.includes(item.racket_id)
                              ? "bg-amber-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {selected.includes(item.racket_id) ? "Vybrano" : "Porovnat"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
