"use client";

import { useMemo, useState } from "react";
import { Button, Card } from "@/components/ui";
import { AP_COURSES } from "@/lib/apCatalog";
import { calculateAPScore } from "@/lib/calculateAPScore";
import {
 computeApSubjectScore,
 listApSubjectModels,
 type ApSubjectScoreResult,
} from "@/lib/utils";

type ExamMode = "ap_subject" | "ap_quick";

function earnedForSection(maxPoints: number, raw: string | undefined): number {
 const v = parseFloat(raw ?? "");
 if (!Number.isFinite(v)) return 0;
 return Math.min(Math.max(0, v), maxPoints);
}

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

 const [quickResult, setQuickResult] = useState<{
 percentage: number;
 apScore: number;
 color: string;
 } | null>(null);

 const activeModel = useMemo(() => models.find((m) => m.courseId === courseId), [models, courseId]);

 const subjectPreview = useMemo((): ApSubjectScoreResult | null => {
 if (mode !== "ap_subject" || !activeModel) return null;
 const earned: Record<string, number> = {};
 for (const s of activeModel.sections) {
 earned[s.id] = earnedForSection(s.maxPoints, sectionValues[s.id]);
 }
 const out = computeApSubjectScore(courseId, earned);
 if ("error" in out) return null;
 return out;
 }, [mode, activeModel, courseId, sectionValues]);

 const resetSectionState = (id: string) => {
 const m = models.find((x) => x.courseId === id);
 const next: Record<string, string> = {};
 m?.sections.forEach((s) => {
 next[s.id] = "";
 });
 setSectionValues(next);
 };

 const calculateQuick = () => {
 const raw = parseInt(rawScore, 10);
 const total = parseInt(totalQuestions, 10);
 if (Number.isNaN(raw) || Number.isNaN(total) || total <= 0 || raw < 0 || raw > total) return;

 const { apScore, percentage } = calculateAPScore({ rawScore: raw, totalQuestions: total });
 const colors = {
 5: "text-vanta-success",
 4: "text-vanta-blue",
 3: "text-vanta-blue",
 2: "text-vanta-muted",
 1: "text-vanta-error",
 } as const;
 setQuickResult({
 percentage,
 apScore,
 color: colors[apScore as keyof typeof colors],
 });
 };

 const apScoreDescriptions = {
 5: "Extremely well qualified",
 4: "Well qualified",
 3: "Qualified",
 2: "Possibly qualified",
 1: "No recommendation",
 } as const;

 const scoreColor = (n: number) =>
 n >= 4 ? "text-vanta-success" : n === 3 ? "text-vanta-blue" : n === 2 ? "text-vanta-muted" : "text-vanta-error";

 return (
 <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 md:py-12">
 <div className="mb-10 fade-up">
 <h1 className="font-display text-3xl md:text-4xl font-bold text-vanta-text">AP score calculators</h1>
 <p className="text-vanta-muted text-lg mt-2 max-w-2xl">
 <strong className="text-vanta-text">One calculator per AP course</strong> ({AP_COURSES.length} exams): enter raw
 section scores (MC, each FRQ, portfolio blocks, etc.). Section scores can mirror reference tools — each bucket scaled to
 a <strong className="text-vanta-text">/100</strong> line and a <strong className="text-vanta-text">/200</strong>{" "}
 composite when the exam has a clear two-part layout. Curves are <strong className="text-vanta-text">practice estimates
 only</strong>, not from College Board.
 </p>
 </div>

 <div className="grid lg:grid-cols-2 gap-10 items-start">
 <Card className="p-6 md:p-8 fade-up rounded-2xl">
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
 setQuickResult(null);
 if (key === "ap_subject") resetSectionState(courseId);
 }}
 className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all
 ${
 mode === key
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
 <p className="text-xs text-vanta-muted mt-3">
 The estimate updates as you type or drag — no submit button for subject mode.
 </p>
 </div>

 <div className="space-y-6 mb-2">
 {activeModel.sections.map((s) => {
 const e = earnedForSection(s.maxPoints, sectionValues[s.id]);
 return (
 <div key={s.id}>
 <div className="flex flex-wrap justify-between gap-2 mb-2 items-baseline">
 <label htmlFor={`sec-${s.id}`} className="text-base font-medium text-vanta-text leading-snug">
 {s.label}
 </label>
 <span className="text-sm text-vanta-muted tabular-nums shrink-0">
 {e} / {s.maxPoints}
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
 onChange={(ev) =>
 setSectionValues((prev) => ({ ...prev, [s.id]: ev.target.value }))
 }
 placeholder={`0 – ${s.maxPoints}`}
 className="flex-1 min-w-0 bg-vanta-surface-elevated text-vanta-text placeholder-vanta-muted/70 rounded-xl px-4 py-3 text-base border border-vanta-border focus:border-vanta-blue focus:outline-none"
 />
 <input
 type="range"
 min={0}
 max={s.maxPoints}
 step={0.5}
 value={e}
 onChange={(ev) =>
 setSectionValues((prev) => ({ ...prev, [s.id]: ev.target.value }))
 }
 className="flex-1 h-3 accent-sky-500"
 />
 </div>
 </div>
 );
 })}
 </div>
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
 <Button type="button" onClick={calculateQuick} className="w-full" size="lg">
 Calculate
 </Button>
 </>
 )}
 </Card>

 <div className="space-y-6">
 {mode === "ap_subject" && subjectPreview ? (
 <Card className="p-6 md:p-8 fade-up rounded-2xl border-sky-500/20">
 <p className="text-xs font-semibold text-vanta-muted uppercase tracking-wider mb-1">Predicted AP® score</p>
 <div className="text-center mb-6 pb-6 border-b border-vanta-border">
 <p className={`text-6xl md:text-7xl font-bold mb-1 ${scoreColor(subjectPreview.apScore)}`}>
 {subjectPreview.apScore}
 </p>
 <p className="text-vanta-muted text-sm">| Score range: 1 – 5</p>
 <p className="text-vanta-muted text-base mt-3">{apScoreDescriptions[subjectPreview.apScore]}</p>
 </div>

 {subjectPreview.scaledDisplay ? (
 <div className="mb-6 pb-6 border-b border-vanta-border">
 <p className="text-xs font-semibold text-vanta-muted uppercase tracking-wider mb-4">Section scores</p>
 <div className="space-y-4 text-sm">
 <div className="flex justify-between gap-4">
 <span className="text-vanta-text font-medium">{subjectPreview.scaledDisplay.mcLabel}</span>
 <span className="text-vanta-text font-semibold tabular-nums">
 {subjectPreview.scaledDisplay.mcOutOf100} / 100
 </span>
 </div>
 <div className="flex justify-between gap-4">
 <span className="text-vanta-text font-medium">{subjectPreview.scaledDisplay.frqLabel}</span>
 <span className="text-vanta-text font-semibold tabular-nums">
 {subjectPreview.scaledDisplay.frqOutOf100} / 100
 </span>
 </div>
 <div className="flex justify-between gap-4 pt-3 border-t border-vanta-border/80">
 <span className="text-vanta-muted font-medium">Combined composite score</span>
 <span className="text-vanta-text font-bold tabular-nums">
 {subjectPreview.scaledDisplay.compositeOutOf200} / 200
 </span>
 </div>
 </div>
 </div>
 ) : (
 <div className="mb-6 pb-6 border-b border-vanta-border">
 <p className="text-xs font-semibold text-vanta-muted uppercase tracking-wider mb-2">Composite (raw)</p>
 <p className="text-vanta-text tabular-nums text-lg font-medium">
 {subjectPreview.totalEarned.toFixed(1)} / {subjectPreview.totalPossible} pts (
 {subjectPreview.compositePercent.toFixed(1)}%)
 </p>
 </div>
 )}

 <div className="bg-vanta-bg rounded-xl p-4 mb-4">
 <p className="text-xs font-semibold text-vanta-muted uppercase tracking-wider mb-3">By section (raw)</p>
 <ul className="space-y-3">
 {subjectPreview.bySection.map((row) => (
 <li key={row.id} className="text-sm">
 <div className="flex justify-between gap-2 mb-1">
 <span className="text-vanta-text font-medium leading-snug">{row.label}</span>
 <span className="text-vanta-muted tabular-nums shrink-0">
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
 score === subjectPreview.apScore
 ? "bg-sky-500/20 text-sky-200 border border-sky-400/40"
 : score < subjectPreview.apScore
 ? "bg-vanta-blue/20 text-vanta-blue"
 : "bg-vanta-border/50 text-vanta-muted"
 }`}
 >
 {score}
 </div>
 ))}
 </div>
 <p className="text-[11px] text-vanta-muted mt-4 leading-relaxed">{subjectPreview.model.courseName}</p>
 </Card>
 ) : mode === "ap_quick" && quickResult ? (
 <Card className="p-6 md:p-8 fade-up rounded-2xl">
 <p className="text-sm text-vanta-muted mb-4">Estimated result</p>
 <div className="text-center mb-6">
 <p className={`text-6xl font-bold mb-2 ${quickResult.color}`}>{quickResult.apScore}</p>
 <p className="text-vanta-muted text-base">
 {apScoreDescriptions[quickResult.apScore as keyof typeof apScoreDescriptions]}
 </p>
 </div>
 <div className="bg-vanta-bg rounded-xl p-4">
 <div className="flex justify-between text-base mb-2">
 <span className="text-vanta-muted">Accuracy</span>
 <span className="text-vanta-text font-medium tabular-nums">{quickResult.percentage.toFixed(1)}%</span>
 </div>
 <div className="h-3 bg-vanta-border rounded-full overflow-hidden">
 <div
 className="h-full bg-vanta-blue rounded-full transition-all duration-700"
 style={{ width: `${quickResult.percentage}%` }}
 />
 </div>
 </div>
 </Card>
 ) : (
 <Card className="p-6 md:p-8 rounded-2xl border-dashed border-vanta-border">
 <p className="text-vanta-muted text-sm leading-relaxed">
 {mode === "ap_subject"
 ? "Select a course and enter scores — your predicted AP score appears here."
 : "Enter raw correct count and total questions, then tap Calculate."}
 </p>
 </Card>
 )}
 </div>
 </div>
 </div>
 );
}
