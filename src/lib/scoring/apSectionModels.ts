/**
 * Section-based AP score models (inspired by real exam structure).
 * Composite → AP 1–5 uses study-motivation bands (not published by College Board).
 */

export type SectionField = {
  id: string;
  label: string;
  max: number;
  /** Slider step (1 for integers, 0.5 for half points if needed) */
  step?: number;
};

export type ApSectionModel = {
  id: string;
  name: string;
  description: string;
  examBoardNote: string;
  sections: SectionField[];
  /** Build normalized section scores and composite (maxComposite = typical 200 when two 100-pt norms) */
  compute: (raw: Record<string, number>) => {
    composite: number;
    maxComposite: number;
    rows: { label: string; value: string }[];
  };
};

/** Map 0–100 percentage to AP 1–5 (reasonable study bands) */
export function percentageToApScore(pct: number): 1 | 2 | 3 | 4 | 5 {
  if (pct >= 85) return 5;
  if (pct >= 70) return 4;
  if (pct >= 55) return 3;
  if (pct >= 40) return 2;
  return 1;
}

function artHistoryCompute(raw: Record<string, number>) {
  const mc = Math.min(80, Math.max(0, raw.mc ?? 0));
  const fr1 = Math.min(8, Math.max(0, raw.fr1 ?? 0));
  const fr2 = Math.min(6, Math.max(0, raw.fr2 ?? 0));
  const fr3 = Math.min(5, Math.max(0, raw.fr3 ?? 0));
  const fr4 = Math.min(5, Math.max(0, raw.fr4 ?? 0));
  const fr5 = Math.min(5, Math.max(0, raw.fr5 ?? 0));
  const fr6 = Math.min(5, Math.max(0, raw.fr6 ?? 0));
  const frSum = fr1 + fr2 + fr3 + fr4 + fr5 + fr6;
  const mcNorm = (mc / 80) * 100;
  const frNorm = (frSum / 34) * 100;
  const composite = mcNorm + frNorm;
  return {
    composite,
    maxComposite: 200,
    rows: [
      { label: "Multiple Choice Score", value: `${Math.round(mcNorm)} / 100` },
      { label: "Free Response Score", value: `${Math.round(frNorm)} / 100` },
      { label: "Combined Composite Score", value: `${composite.toFixed(1)} / 200` },
    ],
  };
}

function twoPartMcFrq(raw: Record<string, number>, mcMax: number, frMax: number) {
  const mc = Math.min(mcMax, Math.max(0, raw.mc ?? 0));
  const fr = Math.min(frMax, Math.max(0, raw.frq ?? 0));
  const mcNorm = (mc / mcMax) * 100;
  const frNorm = (fr / frMax) * 100;
  const composite = mcNorm + frNorm;
  return {
    composite,
    maxComposite: 200,
    rows: [
      { label: "Section I (MC) — normalized", value: `${Math.round(mcNorm)} / 100` },
      { label: "Section II (FRQ) — normalized", value: `${Math.round(frNorm)} / 100` },
      { label: "Composite", value: `${composite.toFixed(1)} / 200` },
    ],
  };
}

export const AP_SECTION_MODELS: ApSectionModel[] = [
  {
    id: "ap-art-history",
    name: "AP Art History",
    description: "MC + six FRQs — composite out of 200 (two normalized 100s).",
    examBoardNote:
      "Structure mirrors typical weighting; cut scores are estimates for study planning only — not published by College Board.",
    sections: [
      { id: "mc", label: "Section I: Multiple Choice", max: 80 },
      { id: "fr1", label: "FRQ 1: Comparison Essay", max: 8 },
      { id: "fr2", label: "FRQ 2: Visual / Contextual Analysis", max: 6 },
      { id: "fr3", label: "FRQ 3: Visual Analysis", max: 5 },
      { id: "fr4", label: "FRQ 4: Contextual Analysis", max: 5 },
      { id: "fr5", label: "FRQ 5: Attribution", max: 5 },
      { id: "fr6", label: "FRQ 6: Continuity and Change", max: 5 },
    ],
    compute: artHistoryCompute,
  },
  {
    id: "ap-biology",
    name: "AP Biology (simplified)",
    description: "Section I MC + Section II FRQ total — normalized to /200 composite.",
    examBoardNote: "FRQ is modeled as one total raw out of typical max; use for directional estimates only.",
    sections: [
      { id: "mc", label: "Section I: Multiple Choice (×1.25 scorable)", max: 60 },
      { id: "frq", label: "Section II: Free Response (6 questions, total raw)", max: 24 },
    ],
    compute: (raw) => twoPartMcFrq(raw, 60, 24),
  },
  {
    id: "ap-calc-ab",
    name: "AP Calculus AB (simplified)",
    description: "MC section + FRQ section totals — normalized composite /200.",
    examBoardNote: "Real exam uses parts (calc/computer) and rubrics; this is a study approximation.",
    sections: [
      { id: "mc", label: "Section I: Multiple Choice (no calc part focus)", max: 45 },
      { id: "frq", label: "Section II: Free Response (6 questions total)", max: 54 },
    ],
    compute: (raw) => twoPartMcFrq(raw, 45, 54),
  },
  {
    id: "ap-world",
    name: "AP World History: Modern (simplified)",
    description: "MC + SAQ/DBQ/LEQ style combined FRQ total.",
    examBoardNote: "Combine your FRQ raw points into one total for a quick composite.",
    sections: [
      { id: "mc", label: "Multiple Choice", max: 55 },
      { id: "frq", label: "Short answer + DBQ + LEQ (total raw)", max: 24 },
    ],
    compute: (raw) => twoPartMcFrq(raw, 55, 24),
  },
  {
    id: "ap-stats",
    name: "AP Statistics (simplified)",
    description: "MC + FRQ total — normalized composite.",
    examBoardNote: "Investigative task is included in FRQ total for this calculator.",
    sections: [
      { id: "mc", label: "Multiple Choice", max: 40 },
      { id: "frq", label: "Free Response (all parts)", max: 30 },
    ],
    compute: (raw) => twoPartMcFrq(raw, 40, 30),
  },
];

export function getApSectionModel(id: string): ApSectionModel | undefined {
  return AP_SECTION_MODELS.find((m) => m.id === id);
}

export function compositeToApScore(composite: number, maxComposite: number): 1 | 2 | 3 | 4 | 5 {
  const pct = maxComposite <= 0 ? 0 : (composite / maxComposite) * 100;
  return percentageToApScore(pct);
}
