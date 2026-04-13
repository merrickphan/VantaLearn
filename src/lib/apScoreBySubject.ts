import { AP_COURSES } from "@/lib/apCatalog";

export type ApScoreBand = 1 | 2 | 3 | 4 | 5;

/** One scored portion of an AP exam (MC, FRQ block, essay, portfolio area, etc.) */
export interface ApScoreSectionDef {
 id: string;
 label: string;
 /** Shown under the input */
 hint?: string;
 maxPoints: number;
}

export type ApCurveGroup =
 | "stem_math"
 | "stats"
 | "science"
 | "history_gov"
 | "econ"
 | "psych"
 | "hum_geo"
 | "english"
 | "cs"
 | "arts"
 | "world_lang"
 | "capstone";

/** When set, composite % for the curve is the average of two buckets each scaled to 100 (like many reference calculators). */
export interface ApTwoPartCompositeDef {
 readonly mcSectionIds: readonly string[];
 readonly frqSectionIds: readonly string[];
 readonly mcScoreLabel?: string;
 readonly frqScoreLabel?: string;
}

export interface ApSubjectScoreModel {
 courseId: string;
 courseName: string;
 sections: ApScoreSectionDef[];
 curveGroup: ApCurveGroup;
 /** One-line note for the UI */
 note?: string;
 /** MC vs FRQ (or portfolio halves) scaled to /100 each; composite shown as /200 in UI. */
 twoPartComposite?: ApTwoPartCompositeDef;
}

/**
 * Minimum composite % (earned/max) to reach that score; below thresholds[0] => 1.
 * Indices: [min for 2, min for 3, min for 4, min for 5]
 */
const CURVES: Record<ApCurveGroup, [number, number, number, number]> = {
 stem_math: [24, 38, 54, 68],
 stats: [26, 40, 54, 67],
 science: [22, 36, 50, 64],
 history_gov: [22, 34, 46, 60],
 econ: [24, 38, 50, 63],
 psych: [28, 42, 55, 70],
 hum_geo: [23, 36, 48, 61],
 english: [22, 34, 45, 58],
 cs: [26, 40, 54, 67],
 arts: [24, 36, 50, 62],
 world_lang: [25, 38, 52, 65],
 capstone: [28, 42, 55, 68],
};

function compositeToApScore(pct: number, group: ApCurveGroup): ApScoreBand {
 const [t2, t3, t4, t5] = CURVES[group];
 if (pct >= t5) return 5;
 if (pct >= t4) return 4;
 if (pct >= t3) return 3;
 if (pct >= t2) return 2;
 return 1;
}

function sections(
 courseId: string,
 courseName: string,
 curveGroup: ApCurveGroup,
 parts: ApScoreSectionDef[],
 note?: string,
 twoPartComposite?: ApTwoPartCompositeDef,
): ApSubjectScoreModel {
 return { courseId, courseName, sections: parts, curveGroup, note, twoPartComposite };
}

/**
 * Section maxima approximate College Board exam blueprints (MC + FRQ rubrics).
 * Curves are heuristic - not official; good for practice estimates only.
 */
export const AP_SUBJECT_SCORE_MODELS: ApSubjectScoreModel[] = [
 sections(
 "calc-ab",
 "AP Calculus AB",
 "stem_math",
 [
 { id: "mc1", label: "Section I — multiple choice (calculator inactive)", hint: "Correct out of 22", maxPoints: 22 },
 { id: "mc2", label: "Section I — multiple choice (calculator active)", hint: "Correct out of 23", maxPoints: 23 },
 { id: "frq1", label: "FRQ 1", hint: "Rubric points", maxPoints: 9 },
 { id: "frq2", label: "FRQ 2", hint: "Rubric points", maxPoints: 9 },
 { id: "frq3", label: "FRQ 3", hint: "Rubric points", maxPoints: 9 },
 { id: "frq4", label: "FRQ 4", hint: "Rubric points", maxPoints: 9 },
 { id: "frq5", label: "FRQ 5", hint: "Rubric points", maxPoints: 9 },
 { id: "frq6", label: "FRQ 6", hint: "Rubric points", maxPoints: 9 },
 ],
 undefined,
 { mcSectionIds: ["mc1", "mc2"], frqSectionIds: ["frq1", "frq2", "frq3", "frq4", "frq5", "frq6"] },
 ),
 sections(
 "calc-bc",
 "AP Calculus BC",
 "stem_math",
 [
 { id: "mc1", label: "Section I — multiple choice (calculator inactive)", hint: "Correct out of 22", maxPoints: 22 },
 { id: "mc2", label: "Section I — multiple choice (calculator active)", hint: "Correct out of 23", maxPoints: 23 },
 { id: "frq1", label: "FRQ 1", hint: "Rubric points", maxPoints: 9 },
 { id: "frq2", label: "FRQ 2", hint: "Rubric points", maxPoints: 9 },
 { id: "frq3", label: "FRQ 3", hint: "Rubric points", maxPoints: 9 },
 { id: "frq4", label: "FRQ 4", hint: "Rubric points", maxPoints: 9 },
 { id: "frq5", label: "FRQ 5", hint: "Rubric points", maxPoints: 9 },
 { id: "frq6", label: "FRQ 6", hint: "Rubric points", maxPoints: 9 },
 ],
 undefined,
 { mcSectionIds: ["mc1", "mc2"], frqSectionIds: ["frq1", "frq2", "frq3", "frq4", "frq5", "frq6"] },
 ),
 sections(
 "precalc",
 "AP Precalculus",
 "stem_math",
 [
 { id: "mc1", label: "Section I — multiple choice (first 20)", hint: "Correct out of 20", maxPoints: 20 },
 { id: "mc2", label: "Section I — multiple choice (last 20)", hint: "Correct out of 20", maxPoints: 20 },
 { id: "frq1", label: "FRQ 1", hint: "Rubric points", maxPoints: 11 },
 { id: "frq2", label: "FRQ 2", hint: "Rubric points", maxPoints: 11 },
 { id: "frq3", label: "FRQ 3", hint: "Rubric points", maxPoints: 10 },
 { id: "frq4", label: "FRQ 4", hint: "Rubric points", maxPoints: 10 },
 ],
 undefined,
 { mcSectionIds: ["mc1", "mc2"], frqSectionIds: ["frq1", "frq2", "frq3", "frq4"] },
 ),
 sections(
 "stats",
 "AP Statistics",
 "stats",
 [
 { id: "mc1", label: "Section I — multiple choice (first 20)", hint: "Correct out of 20", maxPoints: 20 },
 { id: "mc2", label: "Section I — multiple choice (last 20)", hint: "Correct out of 20", maxPoints: 20 },
 { id: "inv", label: "Investigative task", hint: "Rubric points", maxPoints: 6 },
 { id: "frq1", label: "FRQ 1", hint: "Rubric points", maxPoints: 7 },
 { id: "frq2", label: "FRQ 2", hint: "Rubric points", maxPoints: 7 },
 { id: "frq3", label: "FRQ 3", hint: "Rubric points", maxPoints: 8 },
 { id: "frq4", label: "FRQ 4", hint: "Rubric points", maxPoints: 9 },
 { id: "frq5", label: "FRQ 5", hint: "Rubric points", maxPoints: 9 },
 ],
 undefined,
 { mcSectionIds: ["mc1", "mc2"], frqSectionIds: ["inv", "frq1", "frq2", "frq3", "frq4", "frq5"] },
 ),
 sections(
 "cs-a",
 "AP Computer Science A",
 "cs",
 [
 { id: "mc1", label: "Section I — multiple choice (first 20)", hint: "Correct out of 20", maxPoints: 20 },
 { id: "mc2", label: "Section I — multiple choice (last 20)", hint: "Correct out of 20", maxPoints: 20 },
 { id: "frq1", label: "FRQ 1", hint: "Rubric points", maxPoints: 9 },
 { id: "frq2", label: "FRQ 2", hint: "Rubric points", maxPoints: 9 },
 { id: "frq3", label: "FRQ 3", hint: "Rubric points", maxPoints: 9 },
 { id: "frq4", label: "FRQ 4", hint: "Rubric points", maxPoints: 9 },
 ],
 undefined,
 { mcSectionIds: ["mc1", "mc2"], frqSectionIds: ["frq1", "frq2", "frq3", "frq4"] },
 ),
 sections(
 "csp",
 "AP Computer Science Principles",
 "cs",
 [
 { id: "pt", label: "Create performance task", hint: "Full rubric total (max 50)", maxPoints: 50 },
 {
 id: "exam1",
 label: "End-of-course exam — first half (suggested split)",
 hint: "Practice split of exam raw score (max 25)",
 maxPoints: 25,
 },
 {
 id: "exam2",
 label: "End-of-course exam — second half (suggested split)",
 hint: "Practice split of exam raw score (max 25)",
 maxPoints: 25,
 },
 ],
 "Exam is officially one 50-point component; two rows help track calculator vs PT-style items separately.",
 {
 mcSectionIds: ["pt"],
 frqSectionIds: ["exam1", "exam2"],
 mcScoreLabel: "Create PT score",
 frqScoreLabel: "End-of-course exam score",
 },
 ),
 sections(
 "physics-1",
 "AP Physics 1",
 "science",
 [
 { id: "mc1", label: "Section I — multiple choice (first 25)", hint: "Correct out of 25", maxPoints: 25 },
 { id: "mc2", label: "Section I — multiple choice (last 25)", hint: "Correct out of 25", maxPoints: 25 },
 { id: "frq1", label: "Section II — FRQ 1", hint: "Rubric points", maxPoints: 10 },
 { id: "frq2", label: "Section II — FRQ 2", hint: "Rubric points", maxPoints: 10 },
 { id: "frq3", label: "Section II — FRQ 3", hint: "Rubric points", maxPoints: 10 },
 { id: "frq4", label: "Section II — FRQ 4", hint: "Rubric points", maxPoints: 10 },
 { id: "frq5", label: "Section II — FRQ 5", hint: "Rubric points", maxPoints: 10 },
 ],
 undefined,
 { mcSectionIds: ["mc1", "mc2"], frqSectionIds: ["frq1", "frq2", "frq3", "frq4", "frq5"] },
 ),
 sections(
 "physics-2",
 "AP Physics 2",
 "science",
 [
 { id: "mc1", label: "Section I — multiple choice (first 25)", hint: "Correct out of 25", maxPoints: 25 },
 { id: "mc2", label: "Section I — multiple choice (last 25)", hint: "Correct out of 25", maxPoints: 25 },
 { id: "frq1", label: "Section II — FRQ 1", hint: "Rubric points", maxPoints: 10 },
 { id: "frq2", label: "Section II — FRQ 2", hint: "Rubric points", maxPoints: 10 },
 { id: "frq3", label: "Section II — FRQ 3", hint: "Rubric points", maxPoints: 10 },
 { id: "frq4", label: "Section II — FRQ 4", hint: "Rubric points", maxPoints: 10 },
 { id: "frq5", label: "Section II — FRQ 5", hint: "Rubric points", maxPoints: 10 },
 ],
 undefined,
 { mcSectionIds: ["mc1", "mc2"], frqSectionIds: ["frq1", "frq2", "frq3", "frq4", "frq5"] },
 ),
 sections(
 "physics-c-m",
 "AP Physics C: Mechanics",
 "science",
 [
 { id: "mc1", label: "Section I — multiple choice (first 18)", hint: "Correct out of 18", maxPoints: 18 },
 { id: "mc2", label: "Section I — multiple choice (last 17)", hint: "Correct out of 17", maxPoints: 17 },
 { id: "frq1", label: "Section II — FRQ 1", hint: "Rubric points", maxPoints: 15 },
 { id: "frq2", label: "Section II — FRQ 2", hint: "Rubric points", maxPoints: 15 },
 { id: "frq3", label: "Section II — FRQ 3", hint: "Rubric points", maxPoints: 15 },
 ],
 undefined,
 { mcSectionIds: ["mc1", "mc2"], frqSectionIds: ["frq1", "frq2", "frq3"] },
 ),
 sections(
 "physics-c-em",
 "AP Physics C: E&M",
 "science",
 [
 { id: "mc1", label: "Section I — multiple choice (first 18)", hint: "Correct out of 18", maxPoints: 18 },
 { id: "mc2", label: "Section I — multiple choice (last 17)", hint: "Correct out of 17", maxPoints: 17 },
 { id: "frq1", label: "Section II — FRQ 1", hint: "Rubric points", maxPoints: 15 },
 { id: "frq2", label: "Section II — FRQ 2", hint: "Rubric points", maxPoints: 15 },
 { id: "frq3", label: "Section II — FRQ 3", hint: "Rubric points", maxPoints: 15 },
 ],
 undefined,
 { mcSectionIds: ["mc1", "mc2"], frqSectionIds: ["frq1", "frq2", "frq3"] },
 ),
 sections(
 "chem",
 "AP Chemistry",
 "science",
 [
 { id: "mc1", label: "Section I — multiple choice (first 30)", hint: "Correct out of 30", maxPoints: 30 },
 { id: "mc2", label: "Section I — multiple choice (last 30)", hint: "Correct out of 30", maxPoints: 30 },
 { id: "frq1", label: "FRQ 1 (long)", hint: "Rubric points", maxPoints: 10 },
 { id: "frq2", label: "FRQ 2 (long)", hint: "Rubric points", maxPoints: 10 },
 { id: "frq3", label: "FRQ 3", hint: "Rubric points", maxPoints: 9 },
 { id: "frq4", label: "FRQ 4", hint: "Rubric points", maxPoints: 9 },
 { id: "frq5", label: "FRQ 5 (short)", hint: "Rubric points", maxPoints: 4 },
 { id: "frq6", label: "FRQ 6 (short)", hint: "Rubric points", maxPoints: 4 },
 ],
 undefined,
 { mcSectionIds: ["mc1", "mc2"], frqSectionIds: ["frq1", "frq2", "frq3", "frq4", "frq5", "frq6"] },
 ),
 sections(
 "bio",
 "AP Biology",
 "science",
 [
 { id: "mc", label: "Section I: Multiple choice", hint: "Correct out of 60", maxPoints: 60 },
 { id: "frq1", label: "FRQ 1 (long)", hint: "Rubric", maxPoints: 10 },
 { id: "frq2", label: "FRQ 2 (long)", hint: "Rubric", maxPoints: 10 },
 { id: "frq3", label: "FRQ 3 (short)", hint: "Rubric", maxPoints: 8 },
 { id: "frq4", label: "FRQ 4 (short)", hint: "Rubric", maxPoints: 8 },
 { id: "frq5", label: "FRQ 5 (short)", hint: "Rubric", maxPoints: 12 },
 { id: "frq6", label: "FRQ 6 (short)", hint: "Rubric", maxPoints: 12 },
 ],
 undefined,
 { mcSectionIds: ["mc"], frqSectionIds: ["frq1", "frq2", "frq3", "frq4", "frq5", "frq6"] },
 ),
 sections(
 "env",
 "AP Environmental Science",
 "science",
 [
 { id: "mc1", label: "Section I — multiple choice (first 40)", hint: "Correct out of 40", maxPoints: 40 },
 { id: "mc2", label: "Section I — multiple choice (last 40)", hint: "Correct out of 40", maxPoints: 40 },
 { id: "frq1", label: "Section II — FRQ 1", hint: "Rubric points", maxPoints: 13 },
 { id: "frq2", label: "Section II — FRQ 2", hint: "Rubric points", maxPoints: 13 },
 { id: "frq3", label: "Section II — FRQ 3", hint: "Rubric points", maxPoints: 14 },
 ],
 undefined,
 { mcSectionIds: ["mc1", "mc2"], frqSectionIds: ["frq1", "frq2", "frq3"] },
 ),
 sections(
 "ush",
 "AP US History",
 "history_gov",
 [
 { id: "mc", label: "Section I — multiple choice", hint: "Correct out of 55", maxPoints: 55 },
 { id: "saq1", label: "Section II — SAQ 1", hint: "Rubric points", maxPoints: 6 },
 { id: "saq2", label: "Section II — SAQ 2", hint: "Rubric points", maxPoints: 6 },
 { id: "saq3", label: "Section II — SAQ 3", hint: "Rubric points", maxPoints: 6 },
 { id: "dbq", label: "Section II — DBQ", hint: "Rubric points", maxPoints: 7 },
 { id: "leq", label: "Section II — LEQ", hint: "Rubric points", maxPoints: 6 },
 ],
 "SAQ / DBQ / LEQ maxima are practice-friendly estimates; adjust to match your rubric printouts.",
 {
 mcSectionIds: ["mc"],
 frqSectionIds: ["saq1", "saq2", "saq3", "dbq", "leq"],
 },
 ),
 sections(
 "wh",
 "AP World History: Modern",
 "history_gov",
 [
 { id: "mc", label: "Section I — multiple choice", hint: "Correct out of 55", maxPoints: 55 },
 { id: "saq1", label: "Section II — SAQ 1", hint: "Rubric points", maxPoints: 7 },
 { id: "saq2", label: "Section II — SAQ 2", hint: "Rubric points", maxPoints: 7 },
 { id: "saq3", label: "Section II — SAQ 3", hint: "Rubric points", maxPoints: 7 },
 { id: "dbq", label: "Section II — DBQ", hint: "Rubric points", maxPoints: 12 },
 { id: "leq", label: "Section II — LEQ", hint: "Rubric points", maxPoints: 12 },
 ],
 undefined,
 { mcSectionIds: ["mc"], frqSectionIds: ["saq1", "saq2", "saq3", "dbq", "leq"] },
 ),
 sections(
 "euro",
 "AP European History",
 "history_gov",
 [
 { id: "mc", label: "Section I — multiple choice", hint: "Correct out of 55", maxPoints: 55 },
 { id: "saq1", label: "Section II — SAQ 1", hint: "Rubric points", maxPoints: 7 },
 { id: "saq2", label: "Section II — SAQ 2", hint: "Rubric points", maxPoints: 7 },
 { id: "saq3", label: "Section II — SAQ 3", hint: "Rubric points", maxPoints: 7 },
 { id: "dbq", label: "Section II — DBQ", hint: "Rubric points", maxPoints: 12 },
 { id: "leq", label: "Section II — LEQ", hint: "Rubric points", maxPoints: 12 },
 ],
 undefined,
 { mcSectionIds: ["mc"], frqSectionIds: ["saq1", "saq2", "saq3", "dbq", "leq"] },
 ),
 sections(
 "gov",
 "AP US Government & Politics",
 "history_gov",
 [
 { id: "mc", label: "Section I — multiple choice", hint: "Correct out of 55", maxPoints: 55 },
 { id: "frq1", label: "Section II — Concept application", hint: "Rubric points", maxPoints: 11 },
 { id: "frq2", label: "Section II — Quantitative analysis", hint: "Rubric points", maxPoints: 11 },
 { id: "frq3", label: "Section II — SCOTUS comparison", hint: "Rubric points", maxPoints: 11 },
 { id: "frq4", label: "Section II — Argument essay", hint: "Rubric points", maxPoints: 12 },
 ],
 undefined,
 { mcSectionIds: ["mc"], frqSectionIds: ["frq1", "frq2", "frq3", "frq4"] },
 ),
 sections(
 "comp-gov",
 "AP Comparative Government",
 "history_gov",
 [
 { id: "mc", label: "Section I — multiple choice", hint: "Correct out of 55", maxPoints: 55 },
 { id: "frq1", label: "Section II — FRQ 1", hint: "Rubric points", maxPoints: 6 },
 { id: "frq2", label: "Section II — FRQ 2", hint: "Rubric points", maxPoints: 5 },
 { id: "frq3", label: "Section II — FRQ 3", hint: "Rubric points", maxPoints: 5 },
 { id: "frq4", label: "Section II — FRQ 4", hint: "Rubric points", maxPoints: 6 },
 { id: "frq5", label: "Section II — FRQ 5", hint: "Rubric points", maxPoints: 6 },
 { id: "frq6", label: "Section II — FRQ 6", hint: "Rubric points", maxPoints: 5 },
 { id: "frq7", label: "Section II — FRQ 7", hint: "Rubric points", maxPoints: 6 },
 { id: "frq8", label: "Section II — FRQ 8", hint: "Rubric points", maxPoints: 6 },
 ],
 undefined,
 { mcSectionIds: ["mc"], frqSectionIds: ["frq1", "frq2", "frq3", "frq4", "frq5", "frq6", "frq7", "frq8"] },
 ),
 sections(
 "macro",
 "AP Macroeconomics",
 "econ",
 [
 { id: "mc1", label: "Section I — multiple choice (first 30)", hint: "Correct out of 30", maxPoints: 30 },
 { id: "mc2", label: "Section I — multiple choice (last 30)", hint: "Correct out of 30", maxPoints: 30 },
 { id: "frq1", label: "Section II — FRQ 1 (long)", hint: "Rubric points", maxPoints: 13 },
 { id: "frq2", label: "Section II — FRQ 2 (long)", hint: "Rubric points", maxPoints: 13 },
 { id: "frq3", label: "Section II — FRQ 3 (long)", hint: "Rubric points", maxPoints: 14 },
 ],
 undefined,
 { mcSectionIds: ["mc1", "mc2"], frqSectionIds: ["frq1", "frq2", "frq3"] },
 ),
 sections(
 "micro",
 "AP Microeconomics",
 "econ",
 [
 { id: "mc1", label: "Section I — multiple choice (first 30)", hint: "Correct out of 30", maxPoints: 30 },
 { id: "mc2", label: "Section I — multiple choice (last 30)", hint: "Correct out of 30", maxPoints: 30 },
 { id: "frq1", label: "Section II — FRQ 1 (long)", hint: "Rubric points", maxPoints: 13 },
 { id: "frq2", label: "Section II — FRQ 2 (long)", hint: "Rubric points", maxPoints: 13 },
 { id: "frq3", label: "Section II — FRQ 3 (long)", hint: "Rubric points", maxPoints: 14 },
 ],
 undefined,
 { mcSectionIds: ["mc1", "mc2"], frqSectionIds: ["frq1", "frq2", "frq3"] },
 ),
 sections(
 "psych",
 "AP Psychology",
 "psych",
 [
 { id: "mc1", label: "Section I — multiple choice (questions 1–25)", hint: "Correct out of 25", maxPoints: 25 },
 { id: "mc2", label: "Section I — multiple choice (questions 26–50)", hint: "Correct out of 25", maxPoints: 25 },
 { id: "mc3", label: "Section I — multiple choice (questions 51–75)", hint: "Correct out of 25", maxPoints: 25 },
 { id: "mc4", label: "Section I — multiple choice (questions 76–100)", hint: "Correct out of 25", maxPoints: 25 },
 ],
 "The national exam is all multiple choice (often 75 operational + 25 field-test). Enter all four quarters or leave unused quarters at 0.",
 ),
 sections(
 "hum-geo",
 "AP Human Geography",
 "hum_geo",
 [
 {
 id: "mc1",
 label: "Section I — multiple choice (questions 1–30)",
 hint: "Correct out of 30",
 maxPoints: 30,
 },
 {
 id: "mc2",
 label: "Section I — multiple choice (questions 31–60)",
 hint: "Correct out of 30",
 maxPoints: 30,
 },
 {
 id: "frq1",
 label: "Section II — FRQ 1 (stimulus + multi-part)",
 hint: "Max 7 rubric points",
 maxPoints: 7,
 },
 {
 id: "frq2",
 label: "Section II — FRQ 2 (stimulus + multi-part)",
 hint: "Max 7 rubric points",
 maxPoints: 7,
 },
 {
 id: "frq3",
 label: "Section II — FRQ 3 (stimulus + multi-part)",
 hint: "Max 7 rubric points",
 maxPoints: 7,
 },
 ],
 "Section II is three 7-point questions (21 raw points). Section I is split into two MC blocks for practice tracking.",
 {
 mcSectionIds: ["mc1", "mc2"],
 frqSectionIds: ["frq1", "frq2", "frq3"],
 },
 ),
 sections(
 "lang",
 "AP English Language",
 "english",
 [
 { id: "mc1", label: "Section I — reading (suggested first half)", hint: "Correct out of 23", maxPoints: 23 },
 { id: "mc2", label: "Section I — reading (suggested second half)", hint: "Correct out of 22", maxPoints: 22 },
 {
 id: "essay1",
 label: "Section II — Synthesis essay",
 hint: "Rubric points",
 maxPoints: 15,
 },
 {
 id: "essay2",
 label: "Section II — Rhetorical analysis",
 hint: "Rubric points",
 maxPoints: 15,
 },
 {
 id: "essay3",
 label: "Section II — Argument essay",
 hint: "Rubric points",
 maxPoints: 15,
 },
 ],
 undefined,
 {
 mcSectionIds: ["mc1", "mc2"],
 frqSectionIds: ["essay1", "essay2", "essay3"],
 mcScoreLabel: "Section I score",
 frqScoreLabel: "Section II score",
 },
 ),
 sections(
 "lit",
 "AP English Literature",
 "english",
 [
 { id: "mc1", label: "Section I — multiple choice (first half)", hint: "Correct out of 28", maxPoints: 28 },
 { id: "mc2", label: "Section I — multiple choice (second half)", hint: "Correct out of 27", maxPoints: 27 },
 {
 id: "essay1",
 label: "Section II — Poetry / prose analysis",
 hint: "Rubric points",
 maxPoints: 15,
 },
 {
 id: "essay2",
 label: "Section II — Literary argument",
 hint: "Rubric points",
 maxPoints: 15,
 },
 {
 id: "essay3",
 label: "Section II — Text / concept analysis",
 hint: "Rubric points",
 maxPoints: 15,
 },
 ],
 undefined,
 {
 mcSectionIds: ["mc1", "mc2"],
 frqSectionIds: ["essay1", "essay2", "essay3"],
 mcScoreLabel: "Section I score",
 frqScoreLabel: "Section II score",
 },
 ),
 sections(
 "art-hist",
 "AP Art History",
 "arts",
 [
 { id: "mc1", label: "Section I — multiple choice (first 40)", hint: "Correct out of 40", maxPoints: 40 },
 { id: "mc2", label: "Section I — multiple choice (last 40)", hint: "Correct out of 40", maxPoints: 40 },
 {
 id: "frq1",
 label: "Free Response 1: Comparison essay",
 hint: "Rubric points",
 maxPoints: 8,
 },
 {
 id: "frq2",
 label: "Free Response 2: Visual / contextual analysis",
 hint: "Rubric points",
 maxPoints: 6,
 },
 {
 id: "frq3",
 label: "Free Response 3: Visual analysis",
 hint: "Rubric points",
 maxPoints: 5,
 },
 {
 id: "frq4",
 label: "Free Response 4: Contextual analysis",
 hint: "Rubric points",
 maxPoints: 5,
 },
 {
 id: "frq5",
 label: "Free Response 5: Attribution",
 hint: "Rubric points",
 maxPoints: 5,
 },
 {
 id: "frq6",
 label: "Free Response 6: Continuity and change",
 hint: "Rubric points",
 maxPoints: 5,
 },
 ],
 undefined,
 {
 mcSectionIds: ["mc1", "mc2"],
 frqSectionIds: ["frq1", "frq2", "frq3", "frq4", "frq5", "frq6"],
 mcScoreLabel: "Multiple Choice Score",
 frqScoreLabel: "Free Response Score",
 },
 ),
 sections("art-design", "AP Art and Design", "arts", [
 { id: "sustained", label: "Sustained investigation", hint: "Portfolio rubric (max 50)", maxPoints: 50 },
 { id: "selected", label: "Selected works", hint: "Portfolio rubric (max 50)", maxPoints: 50 },
 ], "Scores depend on portfolio review; enter best-fit rubric totals."),
 sections(
 "music",
 "AP Music Theory",
 "arts",
 [
 { id: "mc", label: "Non-aural multiple choice", hint: "Correct out of 45", maxPoints: 45 },
 { id: "aural", label: "Aural MC + dictation", hint: "Rubric / correct items (max ~25)", maxPoints: 25 },
 { id: "frq", label: "Free response (written + sight-sing)", hint: "Rubric total (max ~30)", maxPoints: 30 },
 ],
 undefined,
 {
 mcSectionIds: ["mc"],
 frqSectionIds: ["aural", "frq"],
 mcScoreLabel: "Multiple Choice Score",
 frqScoreLabel: "Free Response & aural score",
 },
 ),
 sections(
 "spanish",
 "AP Spanish Language",
 "world_lang",
 [
 { id: "listen", label: "Interpretive listening", hint: "Max 20", maxPoints: 20 },
 { id: "read", label: "Interpretive reading (print + combined)", hint: "Max 20", maxPoints: 20 },
 { id: "ipSpeak", label: "Interpersonal speaking", hint: "Max 15", maxPoints: 15 },
 { id: "ipWrite", label: "Interpersonal writing", hint: "Max 15", maxPoints: 15 },
 { id: "prSpeak", label: "Presentational speaking", hint: "Max 15", maxPoints: 15 },
 { id: "prWrite", label: "Presentational writing", hint: "Max 15", maxPoints: 15 },
 ],
 undefined,
 {
 mcSectionIds: ["listen", "read"],
 frqSectionIds: ["ipSpeak", "ipWrite", "prSpeak", "prWrite"],
 mcScoreLabel: "Interpretive score",
 frqScoreLabel: "Interpersonal + presentational score",
 },
 ),
 sections(
 "french",
 "AP French Language",
 "world_lang",
 [
 { id: "listen", label: "Interpretive listening", hint: "Max 20", maxPoints: 20 },
 { id: "read", label: "Interpretive reading", hint: "Max 20", maxPoints: 20 },
 { id: "ipSpeak", label: "Interpersonal speaking", hint: "Max 15", maxPoints: 15 },
 { id: "ipWrite", label: "Interpersonal writing", hint: "Max 15", maxPoints: 15 },
 { id: "prSpeak", label: "Presentational speaking", hint: "Max 15", maxPoints: 15 },
 { id: "prWrite", label: "Presentational writing", hint: "Max 15", maxPoints: 15 },
 ],
 undefined,
 {
 mcSectionIds: ["listen", "read"],
 frqSectionIds: ["ipSpeak", "ipWrite", "prSpeak", "prWrite"],
 mcScoreLabel: "Interpretive score",
 frqScoreLabel: "Interpersonal + presentational score",
 },
 ),
 sections(
 "german",
 "AP German Language",
 "world_lang",
 [
 { id: "listen", label: "Interpretive listening", hint: "Max 20", maxPoints: 20 },
 { id: "read", label: "Interpretive reading", hint: "Max 20", maxPoints: 20 },
 { id: "ipSpeak", label: "Interpersonal speaking", hint: "Max 15", maxPoints: 15 },
 { id: "ipWrite", label: "Interpersonal writing", hint: "Max 15", maxPoints: 15 },
 { id: "prSpeak", label: "Presentational speaking", hint: "Max 15", maxPoints: 15 },
 { id: "prWrite", label: "Presentational writing", hint: "Max 15", maxPoints: 15 },
 ],
 undefined,
 {
 mcSectionIds: ["listen", "read"],
 frqSectionIds: ["ipSpeak", "ipWrite", "prSpeak", "prWrite"],
 mcScoreLabel: "Interpretive score",
 frqScoreLabel: "Interpersonal + presentational score",
 },
 ),
 sections(
 "latin",
 "AP Latin",
 "world_lang",
 [
 { id: "mc1", label: "Section I — multiple choice (first 25)", hint: "Correct out of 25", maxPoints: 25 },
 { id: "mc2", label: "Section I — multiple choice (last 25)", hint: "Correct out of 25", maxPoints: 25 },
 { id: "frq1", label: "Section II — FRQ 1 (translation / analytical)", hint: "Rubric points", maxPoints: 25 },
 { id: "frq2", label: "Section II — FRQ 2 (essay / sight reading)", hint: "Rubric points", maxPoints: 25 },
 ],
 undefined,
 { mcSectionIds: ["mc1", "mc2"], frqSectionIds: ["frq1", "frq2"] },
 ),
 sections(
 "chinese",
 "AP Chinese Language",
 "world_lang",
 [
 { id: "listen", label: "Interpretive listening", hint: "Max 20", maxPoints: 20 },
 { id: "read", label: "Interpretive reading", hint: "Max 20", maxPoints: 20 },
 { id: "ipSpeak", label: "Interpersonal speaking", hint: "Max 15", maxPoints: 15 },
 { id: "ipWrite", label: "Interpersonal writing", hint: "Max 15", maxPoints: 15 },
 { id: "prSpeak", label: "Presentational speaking", hint: "Max 15", maxPoints: 15 },
 { id: "prWrite", label: "Presentational writing", hint: "Max 15", maxPoints: 15 },
 ],
 undefined,
 {
 mcSectionIds: ["listen", "read"],
 frqSectionIds: ["ipSpeak", "ipWrite", "prSpeak", "prWrite"],
 mcScoreLabel: "Interpretive score",
 frqScoreLabel: "Interpersonal + presentational score",
 },
 ),
 sections(
 "japanese",
 "AP Japanese Language",
 "world_lang",
 [
 { id: "listen", label: "Interpretive listening", hint: "Max 20", maxPoints: 20 },
 { id: "read", label: "Interpretive reading", hint: "Max 20", maxPoints: 20 },
 { id: "ipSpeak", label: "Interpersonal speaking", hint: "Max 15", maxPoints: 15 },
 { id: "ipWrite", label: "Interpersonal writing", hint: "Max 15", maxPoints: 15 },
 { id: "prSpeak", label: "Presentational speaking", hint: "Max 15", maxPoints: 15 },
 { id: "prWrite", label: "Presentational writing", hint: "Max 15", maxPoints: 15 },
 ],
 undefined,
 {
 mcSectionIds: ["listen", "read"],
 frqSectionIds: ["ipSpeak", "ipWrite", "prSpeak", "prWrite"],
 mcScoreLabel: "Interpretive score",
 frqScoreLabel: "Interpersonal + presentational score",
 },
 ),
 sections("seminar", "AP Seminar", "capstone", [
 { id: "team", label: "Team multimedia & defense", hint: "Rubric total (max 40)", maxPoints: 40 },
 { id: "individual", label: "Individual research report", hint: "Rubric total (max 40)", maxPoints: 40 },
 { id: "eoc", label: "End-of-course exam", hint: "MC + written (max 20)", maxPoints: 20 },
 ]),
 sections("research", "AP Research", "capstone", [
 { id: "paper", label: "Academic paper", hint: "Rubric total (max 60)", maxPoints: 60 },
 { id: "presentation", label: "Presentation & oral defense", hint: "Rubric total (max 40)", maxPoints: 40 },
 ]),
];

const MODEL_BY_ID: Record<string, ApSubjectScoreModel> = Object.fromEntries(
 AP_SUBJECT_SCORE_MODELS.map((m) => [m.courseId, m])
);

export function getApSubjectModel(courseId: string): ApSubjectScoreModel | undefined {
 return MODEL_BY_ID[courseId];
}

export function listApSubjectModels(): ApSubjectScoreModel[] {
 return AP_SUBJECT_SCORE_MODELS;
}

/** Ensure catalog and models stay in sync in dev */
export function assertAllCoursesHaveModels(): void {
 if (process.env.NODE_ENV === "production") return;
 for (const c of AP_COURSES) {
 if (!MODEL_BY_ID[c.id]) {
 console.warn(`[apScoreBySubject] Missing model for course id: ${c.id}`);
 }
 }
}

export interface ApSubjectScoreResult {
 apScore: ApScoreBand;
 compositePercent: number;
 totalEarned: number;
 totalPossible: number;
 bySection: { id: string; label: string; earned: number; max: number; percent: number }[];
 model: ApSubjectScoreModel;
 /** Present when the model uses MC vs FRQ (or equivalent) each scaled to 100 and summed for /200 display. */
 scaledDisplay?: {
 mcLabel: string;
 frqLabel: string;
 mcOutOf100: number;
 frqOutOf100: number;
 compositeOutOf200: number;
 };
}

function roundDisplayScore(n: number): number {
 return Math.round(n * 10) / 10;
}

function resolveTwoPartDef(model: ApSubjectScoreModel): ApTwoPartCompositeDef | null {
 if (model.twoPartComposite) {
 return model.twoPartComposite;
 }
 if (model.sections.length === 2) {
 return {
 mcSectionIds: [model.sections[0].id],
 frqSectionIds: [model.sections[1].id],
 };
 }
 return null;
}

function bucketEarnedMax(
 model: ApSubjectScoreModel,
 earnedBySectionId: Record<string, number>,
 ids: readonly string[],
): { earned: number; max: number } {
 let earned = 0;
 let max = 0;
 for (const id of ids) {
 const s = model.sections.find((x) => x.id === id);
 if (!s) continue;
 const raw = earnedBySectionId[id];
 const e = typeof raw === "number" && !Number.isNaN(raw) ? Math.max(0, raw) : 0;
 earned += Math.min(e, s.maxPoints);
 max += s.maxPoints;
 }
 return { earned, max };
}

/**
 * @param earnedBySectionId - numeric points per section id (defaults to 0 if missing)
 */
export function computeApSubjectScore(
 courseId: string,
 earnedBySectionId: Record<string, number>
): ApSubjectScoreResult | { error: string } {
 const model = MODEL_BY_ID[courseId];
 if (!model) return { error: "Unknown AP course" };

 let totalEarned = 0;
 let totalPossible = 0;
 const bySection: ApSubjectScoreResult["bySection"] = [];

 for (const s of model.sections) {
 const raw = earnedBySectionId[s.id];
 const earned = typeof raw === "number" && !Number.isNaN(raw) ? Math.max(0, raw) : 0;
 const clamped = Math.min(earned, s.maxPoints);
 totalEarned += clamped;
 totalPossible += s.maxPoints;
 bySection.push({
 id: s.id,
 label: s.label,
 earned: clamped,
 max: s.maxPoints,
 percent: s.maxPoints > 0 ? (clamped / s.maxPoints) * 100 : 0,
 });
 }

 const twoDef = resolveTwoPartDef(model);
 let compositePercent =
 totalPossible > 0 ? (totalEarned / totalPossible) * 100 : 0;
 let scaledDisplay: ApSubjectScoreResult["scaledDisplay"];

 if (twoDef) {
 const mcB = bucketEarnedMax(model, earnedBySectionId, twoDef.mcSectionIds);
 const frqB = bucketEarnedMax(model, earnedBySectionId, twoDef.frqSectionIds);
 const mcOut = mcB.max > 0 ? (mcB.earned / mcB.max) * 100 : 0;
 const frqOut = frqB.max > 0 ? (frqB.earned / frqB.max) * 100 : 0;
 scaledDisplay = {
 mcLabel: twoDef.mcScoreLabel ?? "Multiple Choice Score",
 frqLabel: twoDef.frqScoreLabel ?? "Free Response Score",
 mcOutOf100: roundDisplayScore(mcOut),
 frqOutOf100: roundDisplayScore(frqOut),
 compositeOutOf200: roundDisplayScore(mcOut + frqOut),
 };
 compositePercent = (mcOut + frqOut) / 2;
 }

 const apScore = compositeToApScore(compositePercent, model.curveGroup);

 return {
 apScore,
 compositePercent,
 totalEarned,
 totalPossible,
 bySection,
 model,
 ...(scaledDisplay ? { scaledDisplay } : {}),
 };
}
