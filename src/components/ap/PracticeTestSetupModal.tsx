"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ApUnit } from "@/lib/apUnits";
import { proceduralPracticeMcqCountForCourse } from "@/lib/apPracticeExamFormat";
import type { ProceduralDifficulty } from "@/lib/questions/procedural";
import { Button } from "@/components/ui";

const MINUTE_CHOICES = Array.from({ length: 91 }, (_, i) => i);
const SECOND_CHOICES = Array.from({ length: 60 }, (_, i) => i);

function selectClassName() {
 return "rounded-full border border-vanta-border bg-vanta-surface px-3 py-2 text-sm text-vanta-text min-w-[7.5rem] focus:outline-none focus:ring-2 focus:ring-sky-500/40";
}

export function PracticeTestSetupModal({
 open,
 onClose,
 courseId,
 defaultUnitId,
 isCalcCourse,
 showUnitPicker = false,
 units,
}: {
 open: boolean;
 onClose: () => void;
 courseId: string;
 /** Used when `showUnitPicker` is false (unit chosen before opening the modal). */
 defaultUnitId: string;
 isCalcCourse: boolean;
 /** When true, shows unit / “All units” row; `units` must be provided. */
 showUnitPicker?: boolean;
 units?: ApUnit[];
}) {
 const router = useRouter();
 const defaultCount = proceduralPracticeMcqCountForCourse(courseId);

 const [unitChoice, setUnitChoice] = useState<string>("all");
 const [difficulty, setDifficulty] = useState<ProceduralDifficulty>("random");
 const [questionCount, setQuestionCount] = useState(String(defaultCount));
 const [timerMinutes, setTimerMinutes] = useState(0);
 const [timerSeconds, setTimerSeconds] = useState(0);
 const [calculatorQuestions, setCalculatorQuestions] = useState(true);

 useEffect(() => {
 if (!open) return;
 if (showUnitPicker && units && units.length > 0) {
 setUnitChoice("all");
 } else if (!showUnitPicker) {
 setUnitChoice(defaultUnitId);
 }
 setDifficulty("random");
 setQuestionCount(String(proceduralPracticeMcqCountForCourse(courseId)));
 setTimerMinutes(0);
 setTimerSeconds(0);
 setCalculatorQuestions(true);
 }, [open, courseId, showUnitPicker, defaultUnitId]);

 useEffect(() => {
 if (!open || typeof document === "undefined") return;
 const prev = document.body.style.overflow;
 document.body.style.overflow = "hidden";
 return () => {
 document.body.style.overflow = prev;
 };
 }, [open]);

 const unitOptions = useMemo(
 () =>
 showUnitPicker && units?.length
 ? [{ id: "all", label: "All units" }, ...units.map((u) => ({ id: u.id, label: `Unit ${u.index}: ${u.title}` }))]
 : [],
 [showUnitPicker, units],
 );

 const resolvedUnit =
 showUnitPicker && units?.length ? (unitChoice === "all" ? "all" : unitChoice) : defaultUnitId;

 const start = useCallback(() => {
 const n = Math.min(100, Math.max(1, Math.floor(Number(questionCount) || defaultCount)));
 const qs = new URLSearchParams();
 qs.set("proc", "1");
 qs.set("course", courseId);
 qs.set("unit", resolvedUnit);
 qs.set("count", String(n));
 qs.set("difficulty", difficulty);
 qs.set("timerM", String(Math.min(180, Math.max(0, timerMinutes))));
 qs.set("timerS", String(Math.min(59, Math.max(0, timerSeconds))));
 if (isCalcCourse) {
 qs.set("calcSection", calculatorQuestions ? "calculator" : "no_calculator");
 }
 router.push(`/study/exam?${qs.toString()}`);
 onClose();
 }, [
 calculatorQuestions,
 courseId,
 defaultCount,
 difficulty,
 isCalcCourse,
 onClose,
 questionCount,
 router,
 timerMinutes,
 timerSeconds,
 resolvedUnit,
 ]);

 if (!open) return null;

 return (
 <div
 className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md vl-backdrop-in"
 role="dialog"
 aria-modal="true"
 aria-labelledby="practice-setup-title"
 onClick={(e) => {
 if (e.target === e.currentTarget) onClose();
 }}
 >
 <div
 className="w-full max-w-lg rounded-2xl border border-vanta-border bg-vanta-surface shadow-xl shadow-black/20 overflow-hidden vl-modal-surface-in"
 onClick={(e) => e.stopPropagation()}
 >
 <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-vanta-border">
 <h2 id="practice-setup-title" className="text-lg font-bold text-vanta-text">
 Set up your practice test
 </h2>
 <Button
 type="button"
 onClick={start}
 className="rounded-full px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white border-0 shadow-sm shadow-sky-900/20"
 >
 Start practice
 </Button>
 </div>

 <div className="px-5 py-1">
 {showUnitPicker && unitOptions.length > 0 ? (
 <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-vanta-border/80">
 <span className="text-sm font-medium text-vanta-text">Unit</span>
 <select
 className={selectClassName()}
 value={unitChoice}
 onChange={(e) => setUnitChoice(e.target.value)}
 aria-label="Unit"
 >
 {unitOptions.map((o) => (
 <option key={o.id} value={o.id}>
 {o.label}
 </option>
 ))}
 </select>
 </div>
 ) : null}

 <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-vanta-border/80">
 <span className="text-sm font-medium text-vanta-text">Difficulty level</span>
 <select
 className={selectClassName()}
 value={difficulty}
 onChange={(e) => setDifficulty(e.target.value as ProceduralDifficulty)}
 aria-label="Difficulty level"
 >
 <option value="random">Random</option>
 <option value="easy">Easy</option>
 <option value="medium">Medium</option>
 <option value="hard">Hard</option>
 </select>
 </div>

 <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-vanta-border/80">
 <span className="text-sm font-medium text-vanta-text">Number of questions in your test</span>
 <input
 type="number"
 min={1}
 max={100}
 className="w-20 rounded-full border border-vanta-border bg-vanta-surface px-3 py-2 text-sm text-vanta-text text-center tabular-nums focus:outline-none focus:ring-2 focus:ring-sky-500/40"
 value={questionCount}
 onChange={(e) => setQuestionCount(e.target.value)}
 aria-label="Number of questions"
 />
 </div>

 <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-vanta-border/80">
 <span className="text-sm font-medium text-vanta-text">Set a timer</span>
 <div className="flex flex-wrap items-center gap-2">
 <select
 className={selectClassName()}
 value={timerMinutes}
 onChange={(e) => setTimerMinutes(Number(e.target.value))}
 aria-label="Timer minutes"
 >
 {MINUTE_CHOICES.map((m) => (
 <option key={m} value={m}>
 {m} min
 </option>
 ))}
 </select>
 <select
 className={selectClassName()}
 value={timerSeconds}
 onChange={(e) => setTimerSeconds(Number(e.target.value))}
 aria-label="Timer seconds"
 >
 {SECOND_CHOICES.map((s) => (
 <option key={s} value={s}>
 {s} sec
 </option>
 ))}
 </select>
 </div>
 </div>

 {isCalcCourse ? (
 <div className="flex flex-wrap items-center justify-between gap-3 py-3">
 <span className="text-sm font-medium text-vanta-text">Calculator questions</span>
 <button
 type="button"
 role="switch"
 aria-checked={calculatorQuestions}
 onClick={() => setCalculatorQuestions((v) => !v)}
 className={`relative h-8 w-14 rounded-full transition-colors shrink-0 ${
 calculatorQuestions ? "bg-sky-600" : "bg-vanta-border"
 }`}
 >
 <span
 className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${
 calculatorQuestions ? "left-7" : "left-1"
 }`}
 aria-hidden
 />
 <span className="sr-only">{calculatorQuestions ? "On" : "Off"}</span>
 </button>
 </div>
 ) : null}
 </div>

 <div className="px-5 py-3 bg-vanta-surface-elevated/50 border-t border-vanta-border flex justify-end gap-2">
 <Button type="button" variant="secondary" onClick={onClose}>
 Cancel
 </Button>
 <Button
 type="button"
 onClick={start}
 className="rounded-full px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white border-0 shadow-sm shadow-sky-900/20"
 >
 Start practice
 </Button>
 </div>
 </div>
 </div>
 );
}
