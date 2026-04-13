"use client";

import { useMemo, useState } from "react";
import { Button, Card } from "@/components/ui";
import { AP_COURSES } from "@/lib/apCatalog";
import {
  calculateAPScore,
  computeApSubjectScore,
  listApSubjectModels,
  type ApSubjectScoreResult,
} from "@/lib/utils";

type ExamMode = "ap_subject" | "ap_quick";

export default function ScoreCalculatorPage() {
  const models = useMemo(() => listApSubjectModels(), []);
  const [mode, setMode] = useState<ExamMode>("ap_subject");
  const [courseId, setCourseId] = useState(AP_COURSES[0].id);
  const [sectionValues, setSectionValues] = useState<Record<string, string>>(() => {
    const m = listApSubjectModels().find((x) => x.courseId === AP_COURSES[0].id);
    const o: Record<string, string> = {};
    m?.sections.forEach((s) => {
      o[s.id] = "";
    });
    return o;
  });

  const [rawScore, setRawScore] = useState("");
  const [totalQuestions, setTotalQuestions] = useState("");

  const [result, setResult] = useState<
    | null
    | {
        kind: "ap_subject";
        data: ApSubjectScoreResult;
      }
    | {
        kind: "ap_quick";
        percentage: number;
        apScore: number;
        label: string;
        color: string;
      }
  >(null);

  const activeModel = useMemo(() => models.find((m) => m.courseId === courseId), [models, courseId]);

  const resetSectionState = (id: string) => {
    const m = models.find((x) => x.courseId === id);
    const next: Record<string, string> = {};
    m?.sections.forEach((s) => {
      next[s.id] = "";
    });
    setSectionValues(next);
  };

  const calculate = () => {
    if (mode === "ap_subject" && activeModel) {
      const earned: Record<string, number> = {};
      for (const s of activeModel.sections) {
        const v = parseFloat(sectionValues[s.id] ?? "");
        earned[s.id] = Number.isFinite(v) ? v : 0;
      }
      const out = computeApSubjectScore(courseId, earned);
      if ("error" in out) return;
      setResult({ kind: "ap_subject", data: out });
      return;
    }

    const raw = parseInt(rawScore, 10);
    const total = parseInt(totalQuestions, 10);
    if (Number.isNaN(raw) || Number.isNaN(total) || total <= 0 || raw < 0 || raw > total) return;

    const { apScore, percentage } = calculateAPScore({ rawScore: raw, totalQuestions: total });
    const colors = { 5: "text-vanta-success", 4: "text-vanta-blue", 3: "text-vanta-blue", 2: "text-vanta-muted", 1: "text-vanta-error" };
    setResult({
      kind: "ap_quick",
      percentage,
      apScore,
      label: `AP Score: ${apScore}`,
      color: colors[apScore],
    });
  };

  const apScoreDescriptions = {
    5: "Extremely well qualified",
    4: "Well qualified",
    3: "Qualified",
    2: "Possibly qualified",
    1: "No recommendation",
  } as const;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 md:py-12">
      <div className="mb-10 fade-up">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-vanta-text">Score calculators</h1>
        <p className="text-vanta-muted text-lg mt-2 max-w-2xl">
          <strong className="text-vanta-text">Subject-specific AP</strong> models use section weights (MC, FRQ, essays, portfolio, etc.)
          and a tuned curve per subject family. Results are <strong className="text-vanta-text">practice estimates only</strong> — not
          from College Board.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 items-start">
        <Card className="p-6 md:p-8 fade-up lg:col-span-3 rounded-2xl">
          <p className="text-sm text-vanta-muted font-semibold uppercase tracking-wider mb-4">Mode</p>
          <div className="flex flex-wrap gap-2 mb-8">
            {(
              [
                ["ap_subject", "AP by subject"],
                ["ap_quick", "AP quick %"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setMode(key);
                  setResult(null);
                  if (key === "ap_subject") resetSectionState(courseId);
                }}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all
                  ${mode === key
                    ? "bg-vanta-blue/15 border-vanta-blue text-vanta-blue"
                    : "border-vanta-border text-vanta-muted hover:border-vanta-blue/50"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          {mode === "ap_subject" && activeModel ? (
            <>
              <div className="mb-6">
                <label className="text-sm text-vanta-muted font-medium block mb-2">AP course</label>
                <select
                  value={courseId}
                  onChange={(e) => {
                    setCourseId(e.target.value);
                    setResult(null);
                    resetSectionState(e.target.value);
                  }}
                  className="w-full bg-vanta-surface-elevated text-vanta-text rounded-xl px-4 py-3 text-base border border-vanta-border focus:border-vanta-blue focus:outline-none"
                >
                  {AP_COURSES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {activeModel.note ? <p className="text-xs text-vanta-muted mt-2 leading-relaxed">{activeModel.note}</p> : null}
              </div>

              <div className="space-y-6 mb-8">
                {activeModel.sections.map((s) => (
                  <div key={s.id}>
                    <div className="flex flex-wrap justify-between gap-2 mb-2">
                      <label htmlFor={`sec-${s.id}`} className="text-base font-medium text-vanta-text">
                        {s.label}
                      </label>
                      <span className="text-sm text-vanta-muted">
                        max {s.maxPoints} pts
                      </span>
                    </div>
                    {s.hint ? <p className="text-sm text-vanta-muted mb-2">{s.hint}</p> : null}
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                      <input
                        id={`sec-${s.id}`}
                        type="number"
                        min={0}
                        max={s.maxPoints}
                        step={0.5}
                        value={sectionValues[s.id] ?? ""}
                        onChange={(e) =>
                          setSectionValues((prev) => ({ ...prev, [s.id]: e.target.value }))
                        }
                        placeholder={`0 – ${s.maxPoints}`}
                        className="flex-1 min-w-0 bg-vanta-surface-elevated text-vanta-text placeholder-vanta-muted/70 rounded-xl px-4 py-3 text-base border border-vanta-border focus:border-vanta-blue focus:outline-none"
                      />
                      <input
                        type="range"
                        min={0}
                        max={s.maxPoints}
                        step={0.5}
                        value={Math.min(
                          s.maxPoints,
                          Math.max(0, parseFloat(sectionValues[s.id] ?? "0") || 0)
                        )}
                        onChange={(e) =>
                          setSectionValues((prev) => ({ ...prev, [s.id]: e.target.value }))
                        }
                        className="flex-1 h-3 accent-sky-500"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Button type="button" onClick={calculate} className="w-full" size="lg">
                Estimate AP score
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-5 mb-8">
                <div>
                  <label className="text-sm text-vanta-muted font-medium block mb-2">Questions correct (raw)</label>
                  <input
                    type="number"
                    min={0}
                    value={rawScore}
                    onChange={(e) => setRawScore(e.target.value)}
                    placeholder="e.g. 38"
                    className="w-full bg-vanta-surface-elevated text-vanta-text placeholder-vanta-muted/70 rounded-xl px-4 py-3 text-base border border-vanta-border focus:border-vanta-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-vanta-muted font-medium block mb-2">Total questions</label>
                  <input
                    type="number"
                    min={1}
                    value={totalQuestions}
                    onChange={(e) => setTotalQuestions(e.target.value)}
                    placeholder="e.g. 45"
                    className="w-full bg-vanta-surface-elevated text-vanta-text placeholder-vanta-muted/70 rounded-xl px-4 py-3 text-base border border-vanta-border focus:border-vanta-blue focus:outline-none"
                  />
                </div>
              </div>
              <p className="text-sm text-vanta-muted mb-6">
                Single practice-test percentage mapped to a generic AP 1–5 band (not course-specific).
              </p>
              <Button type="button" onClick={calculate} className="w-full" size="lg">
                Calculate
              </Button>
            </>
          )}
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {result?.kind === "ap_subject" ? (
            <Card className="p-6 md:p-8 fade-up rounded-2xl border-sky-500/20">
              <p className="text-sm text-vanta-muted font-semibold uppercase tracking-wider mb-4">Estimate</p>
              <div className="text-center mb-6">
                <p
                  className={`text-6xl md:text-7xl font-bold mb-2 ${
                    result.data.apScore >= 4
                      ? "text-vanta-success"
                      : result.data.apScore === 3
                        ? "text-vanta-blue"
                        : result.data.apScore === 2
                          ? "text-vanta-muted"
                          : "text-vanta-error"
                  }`}
                >
                  {result.data.apScore}
                </p>
                <p className="text-vanta-muted text-base">{apScoreDescriptions[result.data.apScore]}</p>
                <p className="text-xs text-vanta-muted mt-3 leading-relaxed">
                  {result.data.model.courseName} · composite {result.data.compositePercent.toFixed(1)}% (
                  {result.data.totalEarned.toFixed(1)} / {result.data.totalPossible} pts)
                </p>
              </div>

              <div className="bg-vanta-bg rounded-xl p-4 mb-4">
                <p className="text-xs font-semibold text-vanta-muted uppercase tracking-wider mb-3">By section</p>
                <ul className="space-y-3">
                  {result.data.bySection.map((row) => (
                    <li key={row.id} className="text-sm">
                      <div className="flex justify-between gap-2 mb-1">
                        <span className="text-vanta-text font-medium">{row.label}</span>
                        <span className="text-vanta-muted tabular-nums">
                          {row.earned} / {row.max}
                        </span>
                      </div>
                      <div className="h-2 bg-vanta-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-vanta-blue rounded-full transition-all"
                          style={{ width: `${Math.min(100, row.percent)}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-5 gap-1">
                {([1, 2, 3, 4, 5] as const).map((score) => (
                  <div
                    key={score}
                    className={`text-center py-2.5 rounded-lg text-base font-bold ${
                      score === result.data.apScore
                        ? "bg-sky-500/20 text-sky-200 border border-sky-400/40"
                        : score < result.data.apScore
                          ? "bg-vanta-blue/20 text-vanta-blue"
                          : "bg-vanta-border/50 text-vanta-muted"
                    }`}
                  >
                    {score}
                  </div>
                ))}
              </div>
            </Card>
          ) : result ? (
            <Card className="p-6 md:p-8 fade-up rounded-2xl">
              <p className="text-sm text-vanta-muted mb-4">Estimated result</p>
              <div className="text-center mb-6">
                <p className={`text-6xl font-bold mb-2 ${result.color}`}>{result.apScore}</p>
                <p className="text-vanta-muted text-base">
                  {apScoreDescriptions[result.apScore as keyof typeof apScoreDescriptions]}
                </p>
              </div>
              <div className="bg-vanta-bg rounded-xl p-4">
                <div className="flex justify-between text-base mb-2">
                  <span className="text-vanta-muted">Accuracy</span>
                  <span className="text-vanta-text font-medium tabular-nums">{result.percentage.toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-vanta-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-vanta-blue rounded-full transition-all duration-700"
                    style={{ width: `${result.percentage}%` }}
                  />
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6 md:p-8 rounded-2xl border-dashed border-vanta-border">
              <p className="text-vanta-muted text-sm leading-relaxed">
                Choose a mode, enter your practice results, then run the calculator. Subject-specific AP uses the same course list as
                the rest of VantaLearn ({AP_COURSES.length} exams).
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
