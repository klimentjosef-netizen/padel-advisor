"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { RecommendationInput } from "@/types";
import { apiGet } from "@/services/api";
import { RoundShape, TeardropShape, DiamondShape } from "@/components/icons/RacketShapes";

// ── Info tooltip component ──
function InfoTip({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors"
      >
        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-100 text-amber-600 text-[10px] font-bold flex-shrink-0">i</span>
        {open ? "Skryt napovedu" : title}
      </button>
      {open && (
        <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-gray-700 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

// ── Types ──
type Skill = "beginner" | "slight_advanced" | "advanced" | "competitive";
type Experience = "under6m" | "6to12m" | "1to3y" | "3plus";
type Frequency = "weekly1" | "weekly2_3" | "weekly4plus";
type Hand = "left" | "right";
type CourtSide = "left" | "right" | "both";
type PlayTempo = "slow" | "medium" | "fast";
type ArmProblem = "none" | "occasional" | "chronic";
type PhysicalCondition = "beginner" | "average" | "athletic";
type StrikePower = "light" | "medium" | "heavy";
type ShapePref = "round" | "teardrop" | "diamond" | "unknown";
type WeightPref = "light" | "medium" | "heavy" | "unknown";
type SweetSpotPref = "large" | "medium" | "small" | "unknown";
type MaterialPref = "carbon" | "fiberglass" | "nopreference";
type Budget = "up3000" | "3000to5000" | "5000to7000" | "7000plus";
type YearPref = "latest" | "recent" | "any";
type Shot = "bandeja" | "vibora" | "smash" | "lob" | "volejus" | "chiquita";

interface FriendlyForm {
  skill: Skill;
  experience: Experience;
  frequency: Frequency;
  dominantHand: Hand;
  courtSide: CourtSide;
  attackDefenseSlider: number;
  preferredShots: Shot[];
  playTempo: PlayTempo;
  armProblem: ArmProblem;
  physicalCondition: PhysicalCondition;
  strikePower: StrikePower;
  shapePref: ShapePref;
  weightPref: WeightPref;
  sweetSpotPref: SweetSpotPref;
  materialPref: MaterialPref;
  budget: Budget;
  yearPref: YearPref;
  preferredBrands: string[];
}

const defaultForm: FriendlyForm = {
  skill: "slight_advanced",
  experience: "1to3y",
  frequency: "weekly2_3",
  dominantHand: "right",
  courtSide: "both",
  attackDefenseSlider: 50,
  preferredShots: [],
  playTempo: "medium",
  armProblem: "none",
  physicalCondition: "average",
  strikePower: "medium",
  shapePref: "unknown",
  weightPref: "unknown",
  sweetSpotPref: "unknown",
  materialPref: "nopreference",
  budget: "3000to5000",
  yearPref: "any",
  preferredBrands: [],
};

const STEP_TITLES = ["O tobe", "Tvuj herni styl", "Fyzicky profil", "Preference rakety", "Budget a znacky"];

const SHOTS: { value: Shot; label: string }[] = [
  { value: "bandeja", label: "Bandeja" },
  { value: "vibora", label: "Vibora" },
  { value: "smash", label: "Smash" },
  { value: "lob", label: "Lob" },
  { value: "volejus", label: "Volej" },
  { value: "chiquita", label: "Chiquita" },
];

// ── Mapping ──
function mapBudgetToRange(value: Budget): { min: number; max: number } {
  if (value === "up3000") return { min: 0, max: 3000 };
  if (value === "3000to5000") return { min: 3000, max: 5000 };
  if (value === "5000to7000") return { min: 5000, max: 7000 };
  return { min: 7000, max: 20000 };
}

function toRecommendationInput(form: FriendlyForm): RecommendationInput {
  const budget = mapBudgetToRange(form.budget);

  // player_level: refined from skill + experience + frequency
  let playerLevel: RecommendationInput["player_level"] = "intermediate";
  if (form.skill === "beginner") {
    playerLevel = "beginner";
    if (form.frequency === "weekly4plus" && (form.experience === "1to3y" || form.experience === "3plus")) {
      playerLevel = "intermediate";
    }
  } else if (form.skill === "competitive" || form.skill === "advanced") {
    playerLevel = "advanced";
  } else {
    playerLevel = "intermediate";
    if (form.experience === "3plus" && form.frequency !== "weekly1") {
      playerLevel = "advanced";
    }
  }

  // play_style: from slider + shots + tempo
  const slider = form.attackDefenseSlider;
  let playStyle: RecommendationInput["play_style"] = "universal";
  if (slider <= 35) playStyle = "defensive";
  else if (slider >= 65) playStyle = "offensive";
  const offensiveShots = form.preferredShots.filter((s) => ["smash", "vibora"].includes(s)).length;
  const defensiveShots = form.preferredShots.filter((s) => ["lob", "chiquita"].includes(s)).length;
  if (offensiveShots >= 2 && playStyle === "universal") playStyle = "offensive";
  if (defensiveShots >= 2 && playStyle === "universal") playStyle = "defensive";

  // control_vs_power
  let controlVsPower = slider;
  if (form.playTempo === "fast") controlVsPower = Math.min(100, controlVsPower + 10);
  if (form.playTempo === "slow") controlVsPower = Math.max(0, controlVsPower - 10);
  if (form.strikePower === "heavy") controlVsPower = Math.min(100, controlVsPower + 5);
  if (form.strikePower === "light") controlVsPower = Math.max(0, controlVsPower - 5);

  // preferred_weight
  let preferredWeight = 362;
  if (form.weightPref === "light") preferredWeight = 350;
  else if (form.weightPref === "heavy") preferredWeight = 375;
  else if (form.weightPref === "unknown") {
    if (form.armProblem === "chronic") preferredWeight = 348;
    else if (form.physicalCondition === "athletic" && form.strikePower === "heavy") preferredWeight = 372;
    else if (form.armProblem === "occasional") preferredWeight = 355;
  }

  // preferred_hardness
  let preferredHardness: RecommendationInput["preferred_hardness"] = "medium";
  if (form.armProblem === "chronic") preferredHardness = "soft";
  else if (form.armProblem === "occasional" && form.strikePower !== "heavy") preferredHardness = "soft";
  else if (form.strikePower === "heavy" && form.physicalCondition === "athletic") preferredHardness = "hard";

  // preferred_balance
  let preferredBalance: RecommendationInput["preferred_balance"] = "balanced";
  if (playStyle === "offensive" || slider >= 70) preferredBalance = "head_heavy";
  else if (playStyle === "defensive" || slider <= 30) preferredBalance = "head_light";

  // player_position
  const playerPosition: RecommendationInput["player_position"] =
    form.courtSide === "both" ? "universal" : form.courtSide;

  // new direct-mapped fields
  const preferredShape = form.shapePref === "unknown" ? null : (form.shapePref as "round" | "teardrop" | "diamond");
  const sweetSpotPreference = form.sweetSpotPref === "unknown" ? null : (form.sweetSpotPref as "large" | "medium" | "small");
  const preferredMaterial = form.materialPref === "nopreference" ? null : (form.materialPref as "carbon" | "fiberglass");

  const experienceMonths =
    form.experience === "under6m" ? 3 : form.experience === "6to12m" ? 9 : form.experience === "1to3y" ? 24 : 48;

  return {
    player_level: playerLevel,
    play_style: playStyle,
    player_position: playerPosition,
    preferred_weight: preferredWeight,
    preferred_balance: preferredBalance,
    preferred_hardness: preferredHardness,
    control_vs_power: controlVsPower,
    price_min: budget.min,
    price_max: budget.max,
    preferred_brands: form.preferredBrands,
    preferred_shape: preferredShape,
    sweet_spot_preference: sweetSpotPreference,
    preferred_material: preferredMaterial,
    year_preference: form.yearPref,
    experience_months: experienceMonths,
    play_tempo: form.playTempo,
  };
}

// ── Styles ──
const selectClass =
  "w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-white text-gray-800 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none";
const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";
const cardClass = (active: boolean) =>
  `flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
    active ? "border-amber-500 bg-amber-50 text-amber-700" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
  }`;
const chipClass = (active: boolean) =>
  `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
    active ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
  }`;

// ── Component ──
export default function QuestionnaireForm() {
  const [form, setForm] = useState<FriendlyForm>(defaultForm);
  const [step, setStep] = useState(1);
  const [brands, setBrands] = useState<string[]>([]);
  const [brandFilter, setBrandFilter] = useState("");
  const router = useRouter();
  const totalSteps = 5;

  useEffect(() => {
    apiGet<Array<{ name: string }>>("/api/brands")
      .then((data) => setBrands(data.map((b) => b.name)))
      .catch(() => setBrands([]));
  }, []);

  const selectedBrands = useMemo(() => new Set(form.preferredBrands), [form.preferredBrands]);
  const filteredBrands = useMemo(
    () => brands.filter((b) => b.toLowerCase().includes(brandFilter.toLowerCase())),
    [brands, brandFilter],
  );

  function toggleBrand(brand: string) {
    const next = new Set(selectedBrands);
    if (next.has(brand)) next.delete(brand);
    else if (next.size < 5) next.add(brand);
    setForm((prev) => ({ ...prev, preferredBrands: Array.from(next) }));
  }

  function toggleShot(shot: Shot) {
    setForm((prev) => ({
      ...prev,
      preferredShots: prev.preferredShots.includes(shot)
        ? prev.preferredShots.filter((s) => s !== shot)
        : [...prev.preferredShots, shot],
    }));
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const payload = toRecommendationInput(form);
    const encoded = encodeURIComponent(JSON.stringify(payload));
    router.push(`/results?payload=${encoded}`);
  }

  function set<K extends keyof FriendlyForm>(key: K, value: FriendlyForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Progress bar */}
      <div className="mb-2">
        <div className="flex justify-between text-sm text-slate-500 mb-2">
          <span>Krok {step} z {totalSteps}</span>
          <span className="font-medium">{STEP_TITLES[step - 1]}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-amber-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: O tobe */}
      {step === 1 && (
        <div className="space-y-5">
          <p className="text-sm text-gray-500">Rekni nam o sobe — pomuzeme ti najit idealni raketu.</p>
          <div>
            <label className={labelClass}>1. Jak bys ohodnotil/a sve padel schopnosti?</label>
            <InfoTip title="Nejsem si jisty...">
              <p>Neboj se, zadna odpoved neni spatna! Pokud hrajes teprve kratce, zvol zacatecnik. Pokud uz zvladas zakladni udery a hraješ pravidelne, jsi mirne pokrocily.</p>
            </InfoTip>
            <div className="grid grid-cols-2 gap-3">
              {([
                { value: "beginner" as Skill, label: "Zacatecnik", desc: "Teprve zacinam, ucim se zaklady" },
                { value: "slight_advanced" as Skill, label: "Mirne pokrocily", desc: "Umim zaklady, chci se zlepsit" },
                { value: "advanced" as Skill, label: "Pokrocily", desc: "Hraju pravidelne a dobre" },
                { value: "competitive" as Skill, label: "Zavodni", desc: "Hraju turnaje a zapasy" },
              ]).map(({ value, label, desc }) => (
                <button key={value} type="button" onClick={() => set("skill", value)} className={cardClass(form.skill === value)}>
                  <span className="text-sm font-semibold">{label}</span>
                  <span className="text-xs opacity-70 text-center">{desc}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClass}>2. Jak dlouho hrajes padel?</label>
            <select className={selectClass} value={form.experience} onChange={(e) => set("experience", e.target.value as Experience)}>
              <option value="under6m">Mene nez 6 mesicu</option>
              <option value="6to12m">6 az 12 mesicu</option>
              <option value="1to3y">1 az 3 roky</option>
              <option value="3plus">Vice nez 3 roky</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>3. Jak casto hrajes?</label>
            <select className={selectClass} value={form.frequency} onChange={(e) => set("frequency", e.target.value as Frequency)}>
              <option value="weekly1">Obcas (1x tydne nebo mene)</option>
              <option value="weekly2_3">Pravidelne (2-3x tydne)</option>
              <option value="weekly4plus">Hodne casto (4x tydne a vic)</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>4. Kterou rukou hrajes?</label>
            <div className="flex gap-3">
              {(["right", "left"] as Hand[]).map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => set("dominantHand", h)}
                  className={chipClass(form.dominantHand === h)}
                >
                  {h === "right" ? "Pravou" : "Levou"}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Herni styl */}
      {step === 2 && (
        <div className="space-y-5">
          <p className="text-sm text-gray-500">Rekni nam, jak hrajes — pomuzeme ti vybrat raketu pro tvuj styl.</p>
          <div>
            <label className={labelClass}>5. Na ktere strane kurtu hrajes nejcasteji?</label>
            <InfoTip title="Proc na tom zalezi?">
              <p>Pozice na kurtu muze ovlivnit, jaky typ rakety ti bude vice vyhovovat. Pokud stridate nebo nevite, zvolte &quot;Obe&quot;.</p>
            </InfoTip>
            <div className="flex gap-3">
              {([["left", "Leva strana"], ["right", "Prava strana"], ["both", "Obe / stridam"]] as [CourtSide, string][]).map(([v, l]) => (
                <button key={v} type="button" onClick={() => set("courtSide", v)} className={chipClass(form.courtSide === v)}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClass}>6. Jak chces hrat? Posun jezdec podle sveho stylu.</label>
            <InfoTip title="Co je utok a obrana v padelu?">
              <p className="mb-1"><strong className="text-amber-700">Obrana</strong> = trpelive udery, vraceni micu, hra od zadni steny. Chces raketu s kontrolou.</p>
              <p><strong className="text-amber-700">Utok</strong> = smase, razantni voleje, hra u site. Chces raketu se silou.</p>
              <p className="mt-1 text-xs text-gray-500">Vetsina hracu je nekde uprostred — nech jezdec ve stredu pokud si nejsi jisty.</p>
            </InfoTip>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={form.attackDefenseSlider}
              onChange={(e) => set("attackDefenseSlider", Number(e.target.value))}
              className="w-full accent-amber-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Obrana a kontrola</span>
              <span>Vyvazene</span>
              <span>Utok a sila</span>
            </div>
          </div>
          <div>
            <label className={labelClass}>7. Jake udery hrajes nejradeji? (vyber vice, nebo nic)</label>
            <InfoTip title="Co jsou tyto udery?">
              <ul className="space-y-1 ml-1">
                <li><strong className="text-amber-700">Bandeja</strong> — vysoky obranný uder, hraný nad hlavou</li>
                <li><strong className="text-amber-700">Vibora</strong> — agresivni vysoky uder s rotaci</li>
                <li><strong className="text-amber-700">Smash</strong> — silny uder nahoru, snaha o primarni bod</li>
                <li><strong className="text-amber-700">Lob</strong> — vysoky obloukovy mic pres soupeře</li>
                <li><strong className="text-amber-700">Volej</strong> — kratky uder u site bez odrazu</li>
                <li><strong className="text-amber-700">Chiquita</strong> — jemny uder tesne za sit</li>
              </ul>
              <p className="mt-1 text-xs text-gray-500">Pokud nevis, nech prazdne — nevadi to.</p>
            </InfoTip>
            <div className="flex gap-2 flex-wrap">
              {SHOTS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => toggleShot(s.value)}
                  className={chipClass(form.preferredShots.includes(s.value))}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClass}>8. Tempo tve hry</label>
            <select className={selectClass} value={form.playTempo} onChange={(e) => set("playTempo", e.target.value as PlayTempo)}>
              <option value="slow">Pomale a takticke</option>
              <option value="medium">Stredni</option>
              <option value="fast">Rychle a agresivni</option>
            </select>
          </div>
        </div>
      )}

      {/* Step 3: Fyzicky profil */}
      {step === 3 && (
        <div className="space-y-5">
          <p className="text-sm text-gray-500">Tvoje fyzicke predpoklady ovlivni, jaká raketa ti bude nejlepe sedět.</p>
          <div>
            <label className={labelClass}>9. Mas problemy s rukou, loktem nebo ramenem?</label>
            <InfoTip title="Proc se ptame?">
              <p>Pokud te boli ruka nebo loket, doporucime ti lehci a mekci raketu, ktera pohlcuje vibrace a chrani tvoje klouby. Tvrda a tezka raketa by problemy mohla zhorsit.</p>
            </InfoTip>
            <div className="grid grid-cols-3 gap-3">
              {([
                { value: "none" as ArmProblem, label: "Zadne", desc: "Nic me neboli" },
                { value: "occasional" as ArmProblem, label: "Obcas", desc: "Nekdy me neco boli" },
                { value: "chronic" as ArmProblem, label: "Chronicke", desc: "Mam trvalé potize" },
              ]).map(({ value, label, desc }) => (
                <button key={value} type="button" onClick={() => set("armProblem", value)} className={cardClass(form.armProblem === value)}>
                  <span className="text-sm font-semibold">{label}</span>
                  <span className="text-xs opacity-70 text-center">{desc}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClass}>10. Jaka je tvoje fyzicka kondice?</label>
            <div className="grid grid-cols-3 gap-3">
              {([
                { value: "beginner" as PhysicalCondition, label: "Rekreacni", desc: "Spis volnocasove sporty" },
                { value: "average" as PhysicalCondition, label: "Prumerna", desc: "Pravidelne sportuji" },
                { value: "athletic" as PhysicalCondition, label: "Sportovni", desc: "Fit a aktivni" },
              ]).map(({ value, label, desc }) => (
                <button key={value} type="button" onClick={() => set("physicalCondition", value)} className={cardClass(form.physicalCondition === value)}>
                  <span className="text-sm font-semibold">{label}</span>
                  <span className="text-xs opacity-70 text-center">{desc}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClass}>11. Jak silne udery hrajes?</label>
            <InfoTip title="Jak to ovlivni vyber?">
              <p>Silnejsi udery = potrebujes raketu, ktera zvladne vice energie. Lehci udery = pohodlnejsi a kontrolovanejsi raketa.</p>
            </InfoTip>
            <div className="grid grid-cols-3 gap-3">
              {([
                { value: "light" as StrikePower, label: "Lehke", desc: "Jemne, technicke" },
                { value: "medium" as StrikePower, label: "Stredni", desc: "Normalni sila" },
                { value: "heavy" as StrikePower, label: "Silne", desc: "Razantni, tvrde" },
              ]).map(({ value, label, desc }) => (
                <button key={value} type="button" onClick={() => set("strikePower", value)} className={cardClass(form.strikePower === value)}>
                  <span className="text-sm font-semibold">{label}</span>
                  <span className="text-xs opacity-70 text-center">{desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Preference rakety */}
      {step === 4 && (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>12. Jaky tvar rakety preferujes?</label>
            <InfoTip title="Co znamena tvar rakety?">
              <p className="mb-2">Tvar rakety ovlivnuje, jak se ti bude hrat. Kazdy tvar ma jine vlastnosti:</p>
              <ul className="space-y-1.5 ml-1">
                <li><strong className="text-amber-700">Kulaty</strong> — Nejvetsi oblast zasahu. Odpousti chyby, snadne ovladani. Idealni pro zacatecniky a hrace, kteri chteji kontrolu.</li>
                <li><strong className="text-amber-700">Kapka</strong> — Zlaty stred mezi kontrolou a silou. Nejoblibenejsi tvar — vhodny pro vetsinu hracu.</li>
                <li><strong className="text-amber-700">Diamant</strong> — Vice sily v uderech, ale mensi oblast zasahu. Vyzaduje presnejsi techniku. Pro zkusenejsi hrace.</li>
              </ul>
              <p className="mt-2 text-xs text-gray-500">Pokud si nejsi jisty, zvol &quot;Nevim&quot; — doporucime ti tvar podle tvych ostatnich odpovedi.</p>
            </InfoTip>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {([
                { value: "round" as ShapePref, label: "Kulaty", desc: "Snadne ovladani, odpousti chyby", Icon: RoundShape },
                { value: "teardrop" as ShapePref, label: "Kapka", desc: "Zlaty stred — nejoblibenejsi", Icon: TeardropShape },
                { value: "diamond" as ShapePref, label: "Diamant", desc: "Vice sily, vyzaduje presnost", Icon: DiamondShape },
                { value: "unknown" as ShapePref, label: "Nevim", desc: "Doporucte mi", Icon: null },
              ]).map(({ value, label, desc, Icon }) => (
                <button key={value} type="button" onClick={() => set("shapePref", value)} className={cardClass(form.shapePref === value)}>
                  {Icon ? <Icon className="w-10 h-14" /> : <span className="text-2xl h-14 flex items-center">?</span>}
                  <span className="text-sm font-semibold">{label}</span>
                  <span className="text-xs opacity-70 text-center">{desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>13. Preference vahy</label>
            <InfoTip title="Jak vaha ovlivnuje hru?">
              <ul className="space-y-1.5 ml-1">
                <li><strong className="text-amber-700">Lehka (pod 355 g)</strong> — Snadnejsi manipulace, rychlejsi reakce u site. Setrnejsi k ruce a loktu. Vhodna pro zacatecniky a hrace, kteri hraji casto.</li>
                <li><strong className="text-amber-700">Stredni (355–370 g)</strong> — Vyvazeny kompromis. Vyhovuje vetsine hracu.</li>
                <li><strong className="text-amber-700">Tezka (nad 370 g)</strong> — Vice sily a razance v uderech. Namahavejsi na ruku. Pro fyzicky zdatne hrace.</li>
              </ul>
              <p className="mt-2 text-xs text-gray-500">Nevite? Zvol &quot;Nevim&quot; — vypocitame idealni vahu podle tvych fyzickych predpokladu.</p>
            </InfoTip>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {([
                { value: "light" as WeightPref, label: "Lehka", desc: "Pod 355 g — snadna manipulace" },
                { value: "medium" as WeightPref, label: "Stredni", desc: "355–370 g — vyvazena" },
                { value: "heavy" as WeightPref, label: "Tezka", desc: "Nad 370 g — silne udery" },
                { value: "unknown" as WeightPref, label: "Nevim", desc: "Doporucte mi" },
              ]).map(({ value, label, desc }) => (
                <button key={value} type="button" onClick={() => set("weightPref", value)} className={cardClass(form.weightPref === value)}>
                  <span className="text-lg font-bold">{value === "light" ? "~350g" : value === "medium" ? "~360g" : value === "heavy" ? "~375g" : "?"}</span>
                  <span className="text-sm font-semibold">{label}</span>
                  <span className="text-xs opacity-70 text-center">{desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>14. Velikost sweet spotu</label>
            <InfoTip title="Co je sweet spot?">
              <p className="mb-2"><strong>Sweet spot</strong> = oblast na povrchu rakety, kde mic dokonale odskoci. Cim vetsi sweet spot, tim snazsi je trefit spravne.</p>
              <ul className="space-y-1.5 ml-1">
                <li><strong className="text-amber-700">Velky</strong> — Odpousti nepresne zasahy. Mic dobre odskoci i kdyz netrefis presne stred. Skvele pro zacatecniky.</li>
                <li><strong className="text-amber-700">Stredni</strong> — Dobry kompromis mezi odpoustenim a presnosti.</li>
                <li><strong className="text-amber-700">Maly</strong> — Presnejsi udery kdyz trefis stred, ale mene odpoustejici. Pro pokrocile hrace s dobrou technikou.</li>
              </ul>
              <p className="mt-2 text-xs text-gray-500">Tip: Zacatecnikum doporucujeme velky sweet spot. S praxí muzete prejit na mensi.</p>
            </InfoTip>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {([
                { value: "large" as SweetSpotPref, label: "Velky", desc: "Odpousti chyby — pro zacatecniky" },
                { value: "medium" as SweetSpotPref, label: "Stredni", desc: "Dobry kompromis" },
                { value: "small" as SweetSpotPref, label: "Maly", desc: "Presnejsi — pro pokrocile" },
                { value: "unknown" as SweetSpotPref, label: "Nevim", desc: "Doporucte mi" },
              ]).map(({ value, label, desc }) => (
                <button key={value} type="button" onClick={() => set("sweetSpotPref", value)} className={cardClass(form.sweetSpotPref === value)}>
                  <span className="text-lg">{value === "large" ? "⬤" : value === "medium" ? "⬤" : value === "small" ? "•" : "?"}</span>
                  <span className="text-sm font-semibold">{label}</span>
                  <span className="text-xs opacity-70 text-center">{desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>15. Material povrchu</label>
            <InfoTip title="Jaky je rozdil mezi materialy?">
              <ul className="space-y-1.5 ml-1">
                <li><strong className="text-amber-700">Karbon</strong> — Tvrdsi povrch. Dava uderum vice razance a presnosti. Hrace ale mene &quot;chrani&quot; — vibrace se vic prenasi do ruky. Vhodny pro pokrocile.</li>
                <li><strong className="text-amber-700">Sklolaminat</strong> — Mekci, pohodlnejsi. Pohlcuje vibrace, setrnejsi k ruce a loktu. Odpousti nepresne zasahy. Idealni pro zacatecniky.</li>
              </ul>
              <p className="mt-2 text-xs text-gray-500">Pokud mas problemy s loktem/ramenem, sklolaminat bude setrnejsi volba.</p>
            </InfoTip>
            <div className="grid grid-cols-3 gap-3">
              {([
                { value: "carbon" as MaterialPref, label: "Karbon", desc: "Razance a presnost" },
                { value: "fiberglass" as MaterialPref, label: "Sklolaminat", desc: "Komfort a setrnost" },
                { value: "nopreference" as MaterialPref, label: "Je mi jedno", desc: "Doporucte mi" },
              ]).map(({ value, label, desc }) => (
                <button key={value} type="button" onClick={() => set("materialPref", value)} className={cardClass(form.materialPref === value)}>
                  <span className="text-sm font-semibold">{label}</span>
                  <span className="text-xs opacity-70 text-center">{desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Budget a znacky */}
      {step === 5 && (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>16. Kolik chces za raketu utratit?</label>
            <InfoTip title="Jak cena ovlivnuje kvalitu?">
              <ul className="space-y-1.5 ml-1">
                <li><strong className="text-amber-700">Do 3 000 Kc</strong> — Skvele pro zacatecniky. Zakladni materialy, ale plne dostacujici pro uceni se hry.</li>
                <li><strong className="text-amber-700">3 000 - 5 000 Kc</strong> — Nejlepsi pomer cena/vykon. Kvalitni materialy a technologie pro vetsinu hracu.</li>
                <li><strong className="text-amber-700">5 000 - 7 000 Kc</strong> — Profesionalni modely s pokrocilymi technologiemi. Pro vazne hrace.</li>
                <li><strong className="text-amber-700">Nad 7 000 Kc</strong> — Spickove modely s nejlepsimi materialy. Pro zavodni a turnajove hrace.</li>
              </ul>
            </InfoTip>
            <div className="grid grid-cols-2 gap-3">
              {([
                { value: "up3000" as Budget, label: "Do 3 000 Kc", desc: "Pro zacatecniky", icon: "$" },
                { value: "3000to5000" as Budget, label: "3 000 - 5 000 Kc", desc: "Nejlepsi pomer cena/vykon", icon: "$$" },
                { value: "5000to7000" as Budget, label: "5 000 - 7 000 Kc", desc: "Profesionalni modely", icon: "$$$" },
                { value: "7000plus" as Budget, label: "Nad 7 000 Kc", desc: "Spickove modely", icon: "$$$$" },
              ]).map(({ value, label, desc, icon }) => (
                <button key={value} type="button" onClick={() => set("budget", value)} className={cardClass(form.budget === value)}>
                  <span className="text-lg font-bold">{icon}</span>
                  <span className="text-sm font-semibold">{label}</span>
                  <span className="text-xs opacity-70 text-center">{desc}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClass}>17. Chces jen nove modely nebo ti nevadi i starsi?</label>
            <div className="grid grid-cols-3 gap-3">
              {([
                { value: "latest" as YearPref, label: "Jen novinky", desc: "Modely 2025+" },
                { value: "recent" as YearPref, label: "Posledni roky", desc: "2-3 roky stare" },
                { value: "any" as YearPref, label: "Je mi jedno", desc: "I starsi modely" },
              ]).map(({ value, label, desc }) => (
                <button key={value} type="button" onClick={() => set("yearPref", value)} className={cardClass(form.yearPref === value)}>
                  <span className="text-sm font-semibold">{label}</span>
                  <span className="text-xs opacity-70 text-center">{desc}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClass}>18. Mas oblibene znacky? (volitelne, max 5)</label>
            <p className="text-xs text-gray-500 mb-2">Pokud nemas preferenci, nech prazdne — doporucime ti ze vsech znacek.</p>
            <div className="flex gap-2 flex-wrap">
              {brands.map((brand) => (
                <button key={brand} type="button" onClick={() => toggleBrand(brand)} className={chipClass(selectedBrands.has(brand))}>
                  {brand}
                </button>
              ))}
              {brands.length === 0 && <span className="text-sm text-gray-400">Nacitam znacky...</span>}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-300 transition-colors"
          >
            Zpet
          </button>
        ) : (
          <div />
        )}
        {step < totalSteps ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            className="px-6 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors"
          >
            Dalsi &rarr;
          </button>
        ) : (
          <button
            type="submit"
            className="px-8 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-colors shadow-md"
          >
            Najit doporucene rakety
          </button>
        )}
      </div>
    </form>
  );
}
