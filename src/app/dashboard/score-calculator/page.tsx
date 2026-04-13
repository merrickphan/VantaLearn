"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui";
import { calculateAPScore, calculateSATScore } from "@/lib/utils";
import {
  AP_SECTION_MODELS,
  compositeToApScore,
  type ApSectionModel,
} from "@/lib/scoring/apSectionModels";
import { SimpleIconBox } from "@/components/icons/SimpleIconBox";

type SimpleExam = "ap" | "sat_math" | "sat_rw";

function initRaw(model: ApSectionModel): Record<string, number> {
  const r: Record<string, number> = {};
  for (const s of model.sections) {
    r[s.id] = 0;
  }
  return r;
}

function SectionScoreCalculator() {
  const [modelId, setModelId] = useState(AP_SECTION_MODELS[0].id);
  const model = useMemo(
    () => AP_SECTION_MODELS.find((m) => m.id === modelId) ?? AP_SECTION_MODELS[0],
    [modelId]
  );
  const [raw, setRaw] = useState<Record<string, number>>(() => initRaw(AP_SECTION_MODELS[0]));

  useEffect(() => {
    const m = AP_SECTION_MODELS.find((x) => x.id === modelId) ?? AP_SECTION_MODELS[0];
    setRaw(initRaw(m));
  }, [modelId]);

  const result = useMemo(() => {
    try {
      const { composite, maxComposite, rows } = model.compute(raw);
      const ap = compositeToApScore(composite, maxComposite);
      return { composite, maxComposite, rows, ap, error: null as string | null };
    } catch {
      return { composite: 0, maxComposite: 200, rows: [], ap: 1 as const, error: "Invalid input" };
    }
  }, [model, raw]);

  const setSection = (id: string, v: number, max: number) => {
    const n = Math.max(0, Math.min(max, v));
    setRaw((prev) => ({ ...prev, [id]: n }));
  };

  const apColors: Record<number, string> = {
    5: "text-emerald-400",
    4: "text-sky-400",
    3: "text-sky-400",
    2: "text-vanta-muted",
    1: "text-red-400",
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      <div className="space-y-5 animate-fade-in-up">
        <div className="rounded-xl border border-sky-500/25 bg-sky-500/10 px-4 py-3 flex gap-3">
          <span className="shrink-0 mt-0.5" aria-hidden>
            <SimpleIconBox name="calculator" size={32} />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">Instructions</p>
            <p className="text-xs text-slate-800/90 mt-1 leading-relaxed">
              Enter your scores for each section using the sliders or number fields. The calculator normalizes sections (often to two
              scores out of 100) and combines them into a composite out of 200, then maps to an estimated AP score (1–5). This is a{" "}
              <strong>study estimate</strong> — College Board does not publish cut scores.
            </p>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-vanta-muted uppercase tracking-wider block mb-2">Exam model</label>
          <select
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            className="w-full bg-vanta-surface-elevated text-vanta-text rounded-lg px-3 py-2.5 text-sm border border-vanta-border focus:border-sky-400 focus:outline-none"
          >
            {AP_SECTION_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-vanta-muted mt-2 leading-relaxed">{model.description}</p>
        </div>

        <div className="space-y-6">
          {model.sections.map((s) => {
            const val = raw[s.id] ?? 0;
            return (
              <div key={s.id} className="border-b border-vanta-border/70 pb-5 last:border-0 last:pb-0">
                <div className="flex justify-between gap-2 mb-2">
                  <label className="text-sm text-vanta-text font-medium leading-snug">{s.label}</label>
                  <div className="flex items-center gap-1 shrink-0">
                    <input
                      type="number"
                      min={0}
                      max={s.max}
                      value={val}
                      onChange={(e) => setSection(s.id, parseFloat(e.target.value) || 0, s.max)}
                      className="w-14 bg-vanta-bg border border-vanta-border rounded-md px-2 py-1 text-sm text-slate-900 text-center tabular-nums"
                    />
                    <span className="text-xs text-vanta-muted tabular-nums">/ {s.max}</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={s.max}
                  step={s.step ?? 1}
                  value={val}
                  onChange={(e) => setSection(s.id, parseFloat(e.target.value), s.max)}
                  className="score-slider w-full"
                />
              </div>
            );
          })}
        </div>
      </div>

      <Card className="p-6 border-sky-500/20 lg:sticky lg:top-24 animate-fade-in-up shadow-xl shadow-black/20">
        <p className="text-[10px] font-bold text-vanta-muted uppercase tracking-[0.2em] mb-1">Predicted AP® score</p>
        {result.error ? (
          <p className="text-vanta-error text-sm">{result.error}</p>
        ) : (
          <>
            <div className="flex flex-wrap items-baseline gap-2 mb-6">
              <span className={`text-5xl font-bold tabular-nums ${apColors[result.ap] ?? "text-vanta-text"}`}>{result.ap}</span>
              <span className="text-sm text-vanta-muted">| Score range: 1 – 5</span>
            </div>

            <div className="border-t border-vanta-border pt-4 space-y-3">
              <p className="text-[10px] font-bold text-vanta-muted uppercase tracking-wider">Section scores</p>
              {result.rows.map((row) => (
                <div key={row.label} className="flex justify-between gap-4 text-sm border-b border-vanta-border/50 pb-2 last:border-0">
                  <span className="text-vanta-muted">{row.label}</span>
                  <span className="text-vanta-text font-medium tabular-nums">{row.value}</span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-vanta-muted mt-6 leading-relaxed border-t border-vanta-border pt-4">
              {model.examBoardNote}
            </p>
          </>
        )}
      </Card>
    </div>
  );
}

function SimpleScoreCalculator() {
  const [examType, setExamType] = useState<SimpleExam>("ap");
  const [rawScore, setRawScore] = useState("");
  const [totalQuestions, setTotalQuestions] = useState("");
  const [result, setResult] = useState<null | {
    percentage: number;
    apScore?: number;
    scaledScore?: number;
    label: string;
    color: string;
  }>(null);

  const calculate = () => {
    const raw = parseInt(rawScore);
    const total = parseInt(totalQuestions);
    if (isNaN(raw) || isNaN(total) || total <= 0 || raw < 0 || raw > total) return;

    if (examType === "ap") {
      const { apScore, percentage } = calculateAPScore({ rawScore: raw, totalQuestions: total });
      const colors = { 5: "text-emerald-400", 4: "text-sky-400", 3: "text-sky-400", 2: "text-vanta-muted", 1: "text-red-400" };
      setResult({ percentage, apScore, label: `AP Score: ${apScore}`, color: colors[apScore] });
    } else {
      const { scaledScore, percentage } = calculateSATScore({ rawScore: raw, totalQuestions: total });
      setResult({
        percentage,
        scaledScore,
        label: `SAT Score: ${scaledScore}`,
        color: percentage >= 75 ? "text-emerald-400" : percentage >= 50 ? "text-sky-400" : "text-red-400",
      });
    }
  };

  const apScoreDescriptions = {
    5: "Extremely well qualified",
    4: "Well qualified",
    3: "Qualified",
    2: "Possibly qualified",
    1: "No recommendation",
  };

  return (
    <Card className="p-6 max-w-lg mx-auto">
      <div className="mb-6">
        <p className="text-sm text-vanta-muted font-medium mb-3">Exam type</p>
        <div className="flex flex-wrap gap-2">
          {(["ap", "sat_math", "sat_rw"] as SimpleExam[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setExamType(type);
                setResult(null);
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all
                  ${examType === type
                    ? "bg-sky-500/15 border-sky-400 text-sky-400"
                    : "border-vanta-border text-vanta-muted hover:border-sky-400/50"
                  }`}
            >
              {type === "ap" ? "AP (quick)" : type === "sat_math" ? "SAT Math" : "SAT R&W"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="text-sm text-vanta-muted font-medium block mb-1.5">Questions correct (raw)</label>
          <input
            type="number"
            min={0}
            value={rawScore}
            onChange={(e) => setRawScore(e.target.value)}
            placeholder="e.g. 38"
            className="w-full bg-vanta-surface-elevated text-slate-900 placeholder-vanta-muted/70 rounded-lg px-4 py-2.5 text-sm border border-vanta-border focus:border-sky-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm text-vanta-muted font-medium block mb-1.5">Total questions</label>
          <input
            type="number"
            min={1}
            value={totalQuestions}
            onChange={(e) => setTotalQuestions(e.target.value)}
            placeholder="e.g. 45"
            className="w-full bg-vanta-surface-elevated text-slate-900 placeholder-vanta-muted/70 rounded-lg px-4 py-2.5 text-sm border border-vanta-border focus:border-sky-400 focus:outline-none"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={calculate}
        className="w-full btn-shine bg-sky-500/20 hover:bg-sky-400/30 text-slate-900 border border-sky-400/50 rounded-lg py-2.5 text-sm font-medium"
      >
        Calculate
      </button>

      {result && (
        <div className="mt-8 pt-6 border-t border-vanta-border text-center">
          <p className={`text-5xl font-bold mb-2 ${result.color}`}>{result.apScore ?? result.scaledScore}</p>
          <p className="text-vanta-muted text-sm">
            {result.apScore ? apScoreDescriptions[result.apScore as keyof typeof apScoreDescriptions] : "Scaled score estimate"}
          </p>
          <p className="text-xs text-vanta-muted mt-2">Accuracy: {result.percentage.toFixed(1)}%</p>
        </div>
      )}
    </Card>
  );
}

export default function ScoreCalculatorPage() {
  const [tab, setTab] = useState<"section" | "simple">("section");

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8 fade-up">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-vanta-text tracking-wide">Score calculators</h1>
        <p className="text-vanta-muted text-sm mt-1 max-w-2xl">
          Section-based models normalize MC and FRQ similarly to composite-style estimates. Quick mode is a simple percent → AP or SAT
          mapping for drill sets.
        </p>
      </div>

      <div className="flex gap-2 mb-8">
        <button
          type="button"
          onClick={() => setTab("section")}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
            tab === "section" ? "bg-sky-500/15 border-sky-400 text-sky-400" : "border-vanta-border text-vanta-muted"
          }`}
        >
          AP by section (recommended)
        </button>
        <button
          type="button"
          onClick={() => setTab("simple")}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
            tab === "simple" ? "bg-sky-500/15 border-sky-400 text-sky-400" : "border-vanta-border text-vanta-muted"
          }`}
        >
          Quick percent
        </button>
      </div>

      {tab === "section" ? <SectionScoreCalculator /> : <SimpleScoreCalculator />}
    </div>
  );
}
