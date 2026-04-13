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
 { id: "mc1", label: "MCQ — first half", hint: "Points toward MCQ total (max 27)", maxPoints: 27 },
 { id: "mc2", label: "MCQ — second half", hint: "Points toward MCQ total (max 27)", maxPoints: 27 },
 { id: "frq1", label: "FRQ 1", hint: "Rubric points (max 9)", maxPoints: 9 },
 { id: "frq2", label: "FRQ 2", hint: "Rubric points (max 9)", maxPoints: 9 },
 { id: "frq3", label: "FRQ 3", hint: "Rubric points (max 9)", maxPoints: 9 },
 { id: "frq4", label: "FRQ 4", hint: "Rubric points (max 9)", maxPoints: 9 },
 { id: "frq5", label: "FRQ 5", hint: "Rubric points (max 9)", maxPoints: 9 },
 { id: "frq6", label: "FRQ 6", hint: "Rubric points (max 9)", maxPoints: 9 },
 ],
 "Model totals: MCQ 54 + FRQ 54 = 108.",
 { mcSectionIds: ["mc1", "mc2"], frqSectionIds: ["frq1", "frq2", "frq3", "frq4", "frq5", "frq6"] },
 ),
 sections(
 "calc-bc",
 "AP Calculus BC",
 "stem_math",
 [
 { id: "mc1", label: "MCQ — first half", hint: "Points toward MCQ total (max 27)", maxPoints: 27 },
 { id: "mc2", label: "MCQ — second half", hint: "Points toward MCQ total (max 27)", maxPoints: 27 },
 { id: "frq1", label: "FRQ 1", hint: "Rubric points (max 9)", maxPoints: 9 },
 { id: "frq2", label: "FRQ 2", hint: "Rubric points (max 9)", maxPoints: 9 },
 { id: "frq3", label: "FRQ 3", hint: "Rubric points (max 9)", maxPoints: 9 },
 { id: "frq4", label: "FRQ 4", hint: "Rubric points (max 9)", maxPoints: 9 },
 { id: "frq5", label: "FRQ 5", hint: "Rubric points (max 9)", maxPoints: 9 },
 { id: "frq6", label: "FRQ 6", hint: "Rubric points (max 9)", maxPoints: 9 },
 ],
 "Model totals: MCQ 54 + FRQ 54 = 108.",
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
 { id: "mc1", label: "MCQ — first half", hint: "Points toward MCQ total (max 40)", maxPoints: 40 },
 { id: "mc2", label: "MCQ — second half", hint: "Points toward MCQ total (max 40)", maxPoints: 40 },
 { id: "frq", label: "FRQ — Section II (total)", hint: "All FRQ + investigative raw rolled into one line (max 80)", maxPoints: 80 },
 ],
 "Model totals: MCQ 80 + FRQ 80 = 160.",
 { mcSectionIds: ["mc1", "mc2"], frqSectionIds: ["frq"] },
 ),
 sections(
 "cs-a",
 "AP Computer Science A",
 "cs",
 [
 { id: "mc1", label: "MCQ — first half", hint: "Points toward MCQ total (max 40)", maxPoints: 40 },
 { id: "mc2", label: "MCQ — second half", hint: "Points toward MCQ total (max 40)", maxPoints: 40 },
 { id: "frq1", label: "FRQ 1", hint: "Weighted points in 160-pt model (max 20; rubric often /9)", maxPoints: 20 },
 { id: "frq2", label: "FRQ 2", hint: "Weighted points in 160-pt model (max 20; rubric often /9)", maxPoints: 20 },
 { id: "frq3", label: "FRQ 3", hint: "Weighted points in 160-pt model (max 20; rubric often /9)", maxPoints: 20 },
 { id: "frq4", label: "FRQ 4", hint: "Weighted points in 160-pt model (max 20; rubric often /9)", maxPoints: 20 },
 ],
 "Model totals: MCQ 80 + FRQ (4×20) 80 = 160.",
 { mcSectionIds: ["mc1", "mc2"], frqSectionIds: ["frq1", "frq2", "frq3", "frq4"] },
 ),
 sections(
 "csp",
 "AP Computer Science Principles",
 "cs",
 [
 { id: "mcq", label: "MCQ — end-of-course exam", hint: "Multiple-choice weighted total (max 70)", maxPoints: 70 },
 { id: "ct1", label: "Create Task — rubric row 1", hint: "6 rows × 5 = 30 (max 5)", maxPoints: 5 },
 { id: "ct2", label: "Create Task — rubric row 2", hint: "Max 5", maxPoints: 5 },
 { id: "ct3", label: "Create Task — rubric row 3", hint: "Max 5", maxPoints: 5 },
 { id: "ct4", label: "Create Task — rubric row 4", hint: "Max 5", maxPoints: 5 },
 { id: "ct5", label: "Create Task — rubric row 5", hint: "Max 5", maxPoints: 5 },
 { id: "ct6", label: "Create Task — rubric row 6", hint: "Max 5", maxPoints: 5 },
 ],
 "Model totals: MCQ 70 + Create Task (6×5) 30 = 100.",
 {
 mcSectionIds: ["mcq"],
 frqSectionIds: ["ct1", "ct2", "ct3", "ct4", "ct5", "ct6"],
 mcScoreLabel: "MCQ score",
 frqScoreLabel: "Create Task score",
 },
 ),
 sections(
 "physics-1",
 "AP Physics 1",
 "science",
 [
 { id: "mc1", label: "MCQ — first half", hint: "Points toward MCQ total (max 45)", maxPoints: 45 },
 { id: "mc2", label: "MCQ — second half", hint: "Points toward MCQ total (max 45)", maxPoints: 45 },
 { id: "frq", label: "FRQ — Section II (total)", hint: "All free-response weighted total (max 90)", maxPoints: 90 },
 ],
 "Model totals: MCQ 90 + FRQ 90 = 180.",
 { mcSectionIds: ["mc1", "mc2"], frqSectionIds: ["frq"] },
 ),
 sections(
 "physics-2",
 "AP Physics 2",
 "science",
 [
 { id: "mc1", label: "MCQ — first half", hint: "Points toward MCQ total (max 45)", maxPoints: 45 },
 { id: "mc2", label: "MCQ — second half", hint: "Points toward MCQ total (max 45)", maxPoints: 45 },
 { id: "frq", label: "FRQ — Section II (total)", hint: "All free-response weighted total (max 90)", maxPoints: 90 },
 ],
 "Model totals: MCQ 90 + FRQ 90 = 180.",
 { mcSectionIds: ["mc1", "mc2"], frqSectionIds: ["frq"] },
 ),
 sections(
 "physics-c-m",
 "AP Physics C: Mechanics",
 "science",
 [
 { id: "mc1", label: "MCQ — first half", hint: "Points toward MCQ total (max 35)", maxPoints: 35 },
 { id: "mc2", label: "MCQ — second half", hint: "Points toward MCQ total (max 35)", maxPoints: 35 },
 { id: "frq1", label: "FRQ 1", hint: "Points toward FRQ total (max 30)", maxPoints: 30 },
 { id: "frq2", label: "FRQ 2", hint: "Points toward FRQ total (max 30)", maxPoints: 30 },
 { id: "frq3", label: "FRQ 3", hint: "Points toward FRQ total (max 30)", maxPoints: 30 },
 ],
 "Model totals: MCQ 70 + FRQ 90 = 160.",
 { mcSectionIds: ["mc1", "mc2"], frqSectionIds: ["frq1", "frq2", "frq3"] },
 ),
 sections(
 "physics-c-em",
 "AP Physics C: E&M",
 "science",
 [
 { id: "mc1", label: "MCQ — first half", hint: "Points toward MCQ total (max 35)", maxPoints: 35 },
 { id: "mc2", label: "MCQ — second half", hint: "Points toward MCQ total (max 35)", maxPoints: 35 },
 { id: "frq1", label: "FRQ 1", hint: "Points toward FRQ total (max 30)", maxPoints: 30 },
 { id: "frq2", label: "FRQ 2", hint: "Points toward FRQ total (max 30)", maxPoints: 30 },
 { id: "frq3", label: "FRQ 3", hint: "Points toward FRQ total (max 30)", maxPoints: 30 },
 ],
 "Model totals: MCQ 70 + FRQ 90 = 160.",
 { mcSectionIds: ["mc1", "mc2"], frqSectionIds: ["frq1", "frq2", "frq3"] },
 ),
 sections(
 "chem",
 "AP Chemistry",
 "science",
 [
 { id: "mc1", label: "MCQ — first half", hint: "Points toward MCQ total (max 45)", maxPoints: 45 },
 { id: "mc2", label: "MCQ — second half", hint: "Points toward MCQ total (max 45)", maxPoints: 45 },
 { id: "frq", label: "FRQ — Section II (total)", hint: "All free-response weighted total (max 90)", maxPoints: 90 },
 ],
 "Model totals: MCQ 90 + FRQ 90 = 180.",
 { mcSectionIds: ["mc1", "mc2"], frqSectionIds: ["frq"] },
 ),
 sections(
 "bio",
 "AP Biology",
 "science",
 [
 { id: "mc1", label: "MCQ — first half", hint: "Points toward MCQ total (max 45)", maxPoints: 45 },
 { id: "mc2", label: "MCQ — second half", hint: "Points toward MCQ total (max 45)", maxPoints: 45 },
 { id: "frq", label: "FRQ — Section II (total)", hint: "All free-response weighted total (max 90)", maxPoints: 90 },
 ],
 "Model totals: MCQ 90 + FRQ 90 = 180.",
 { mcSectionIds: ["mc1", "mc2"], frqSectionIds: ["frq"] },
 ),
 sections(
 "env",
 "AP Environmental Science",
 "science",
 [
 { id: "mc1", label: "MCQ — first half", hint: "Points toward MCQ total (max 50)", maxPoints: 50 },
 { id: "mc2", label: "MCQ — second half", hint: "Points toward MCQ total (max 50)", maxPoints: 50 },
 { id: "frq1", label: "FRQ — portion 1", hint: "Toward FRQ total (max 22)", maxPoints: 22 },
 { id: "frq2", label: "FRQ — portion 2", hint: "Toward FRQ total (max 22)", maxPoints: 22 },
 { id: "frq3", label: "FRQ — portion 3", hint: "Toward FRQ total (max 23)", maxPoints: 23 },
 ],
 "Model totals: MCQ 100 + FRQ 67 = 167.",
 { mcSectionIds: ["mc1", "mc2"], frqSectionIds: ["frq1", "frq2", "frq3"] },
 ),
 sections(
 "ush",
 "AP US History",
 "history_gov",
 [
 { id: "mc1", label: "MCQ — first half", hint: "Points toward MCQ total (max 40)", maxPoints: 40 },
 { id: "mc2", label: "MCQ — second half", hint: "Points toward MCQ total (max 40)", maxPoints: 40 },
 { id: "saq1", label: "SAQ — set 1", hint: "Toward SAQ total (max 14)", maxPoints: 14 },
 { id: "saq2", label: "SAQ — set 2", hint: "Toward SAQ total (max 13)", maxPoints: 13 },
 { id: "saq3", label: "SAQ — set 3", hint: "Toward SAQ total (max 13)", maxPoints: 13 },
 { id: "dbq", label: "DBQ", hint: "Document-based question (max 50)", maxPoints: 50 },
 { id: "leq", label: "LEQ", hint: "Long essay (max 30)", maxPoints: 30 },
 ],
 "Model totals: MCQ 80 + SAQ 40 + DBQ 50 + LEQ 30 = 200.",
 {
 mcSectionIds: ["mc1", "mc2"],
 frqSectionIds: ["saq1", "saq2", "saq3", "dbq", "leq"],
 mcScoreLabel: "MCQ score",
 frqScoreLabel: "Written (SAQ + DBQ + LEQ) score",
 },
 ),
 sections(
 "wh",
 "AP World History: Modern",
 "history_gov",
 [
 { id: "mc1", label: "MCQ — first half", hint: "Points toward MCQ total (max 40)", maxPoints: 40 },
 { id: "mc2", label: "MCQ — second half", hint: "Points toward MCQ total (max 40)", maxPoints: 40 },
 { id: "saq1", label: "SAQ — set 1", hint: "Toward SAQ total (max 14)", maxPoints: 14 },
 { id: "saq2", label: "SAQ — set 2", hint: "Toward SAQ total (max 13)", maxPoints: 13 },
 { id: "saq3", label: "SAQ — set 3", hint: "Toward SAQ total (max 13)", maxPoints: 13 },
 { id: "dbq", label: "DBQ", hint: "Document-based question (max 50)", maxPoints: 50 },
 { id: "leq", label: "LEQ", hint: "Long essay (max 30)", maxPoints: 30 },
 ],
 "Model totals: MCQ 80 + SAQ 40 + DBQ 50 + LEQ 30 = 200.",
 {
 mcSectionIds: ["mc1", "mc2"],
 frqSectionIds: ["saq1", "saq2", "saq3", "dbq", "leq"],
 mcScoreLabel: "MCQ score",
 frqScoreLabel: "Written (SAQ + DBQ + LEQ) score",
 },
 ),
 sections(
 "euro",
 "AP European History",
 "history_gov",
 [
 { id: "mc1", label: "MCQ — first half", hint: "Points toward MCQ total (max 40)", maxPoints: 40 },
 { id: "mc2", label: "MCQ — second half", hint: "Points toward MCQ total (max 40)", maxPoints: 40 },
 { id: "saq1", label: "SAQ — set 1", hint: "Toward SAQ total (max 14)", maxPoints: 14 },
 { id: "saq2", label: "SAQ — set 2", hint: "Toward SAQ total (max 13)", maxPoints: 13 },
 { id: "saq3", label: "SAQ — set 3", hint: "Toward SAQ total (max 13)", maxPoints: 13 },
 { id: "dbq", label: "DBQ", hint: "Document-based question (max 50)", maxPoints: 50 },
 { id: "leq", label: "LEQ", hint: "Long essay (max 30)", maxPoints: 30 },
 ],
 "Model totals: MCQ 80 + SAQ 40 + DBQ 50 + LEQ 30 = 200.",
 {
 mcSectionIds: ["mc1", "mc2"],
 frqSectionIds: ["saq1", "saq2", "saq3", "dbq", "leq"],
 mcScoreLabel: "MCQ score",
 frqScoreLabel: "Written (SAQ + DBQ + LEQ) score",
 },
 ),
 sections(
 "gov",
 "AP US Government & Politics",
 "history_gov",
 [
 { id: "mc1", label: "MCQ — first half", hint: "Points toward MCQ total (max 38)", maxPoints: 38 },
 { id: "mc2", label: "MCQ — second half", hint: "Points toward MCQ total (max 37)", maxPoints: 37 },
 { id: "frq1", label: "FRQ — concept application", hint: "Toward FRQ total (max 19)", maxPoints: 19 },
 { id: "frq2", label: "FRQ — quantitative analysis", hint: "Toward FRQ total (max 19)", maxPoints: 19 },
 { id: "frq3", label: "FRQ — SCOTUS comparison", hint: "Toward FRQ total (max 19)", maxPoints: 19 },
 { id: "frq4", label: "FRQ — argument essay", hint: "Toward FRQ total (max 18)", maxPoints: 18 },
 ],
 "Model totals: MCQ 75 + FRQ 75 = 150.",
 { mcSectionIds: ["mc1", "mc2"], frqSectionIds: ["frq1", "frq2", "frq3", "frq4"] },
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
 { id: "mc1", label: "MCQ — first half", hint: "Points toward MCQ total (max 50)", maxPoints: 50 },
 { id: "mc2", label: "MCQ — second half", hint: "Points toward MCQ total (max 50)", maxPoints: 50 },
 { id: "frq1", label: "FRQ 1", hint: "Toward FRQ total (max 17)", maxPoints: 17 },
 { id: "frq2", label: "FRQ 2", hint: "Toward FRQ total (max 17)", maxPoints: 17 },
 { id: "frq3", label: "FRQ 3", hint: "Toward FRQ total (max 16)", maxPoints: 16 },
 ],
 "Model totals: MCQ 100 + FRQ 50 = 150.",
 { mcSectionIds: ["mc1", "mc2"], frqSectionIds: ["frq1", "frq2", "frq3"] },
 ),
 sections(
 "micro",
 "AP Microeconomics",
 "econ",
 [
 { id: "mc1", label: "MCQ — first half", hint: "Points toward MCQ total (max 50)", maxPoints: 50 },
 { id: "mc2", label: "MCQ — second half", hint: "Points toward MCQ total (max 50)", maxPoints: 50 },
 { id: "frq1", label: "FRQ 1", hint: "Toward FRQ total (max 17)", maxPoints: 17 },
 { id: "frq2", label: "FRQ 2", hint: "Toward FRQ total (max 17)", maxPoints: 17 },
 { id: "frq3", label: "FRQ 3", hint: "Toward FRQ total (max 16)", maxPoints: 16 },
 ],
 "Model totals: MCQ 100 + FRQ 50 = 150.",
 { mcSectionIds: ["mc1", "mc2"], frqSectionIds: ["frq1", "frq2", "frq3"] },
 ),
 sections(
 "psych",
 "AP Psychology",
 "psych",
 [
 { id: "mc1", label: "MCQ — quarter 1", hint: "Toward MCQ total (max 33)", maxPoints: 33 },
 { id: "mc2", label: "MCQ — quarter 2", hint: "Toward MCQ total (max 33)", maxPoints: 33 },
 { id: "mc3", label: "MCQ — quarter 3", hint: "Toward MCQ total (max 34)", maxPoints: 34 },
 { id: "mc4", label: "MCQ — quarter 4", hint: "Toward MCQ total (max 33)", maxPoints: 33 },
 { id: "frq1", label: "FRQ — portion 1", hint: "Toward FRQ total (max 22)", maxPoints: 22 },
 { id: "frq2", label: "FRQ — portion 2", hint: "Toward FRQ total (max 22)", maxPoints: 22 },
 { id: "frq3", label: "FRQ — portion 3", hint: "Toward FRQ total (max 23)", maxPoints: 23 },
 ],
 "Model totals: MCQ 133 + FRQ 67 = 200.",
 {
 mcSectionIds: ["mc1", "mc2", "mc3", "mc4"],
 frqSectionIds: ["frq1", "frq2", "frq3"],
 mcScoreLabel: "MCQ score",
 frqScoreLabel: "FRQ score",
 },
 ),
 sections(
 "hum-geo",
 "AP Human Geography",
 "hum_geo",
 [
 { id: "mc1", label: "MCQ — first half", hint: "Points toward MCQ total (max 38)", maxPoints: 38 },
 { id: "mc2", label: "MCQ — second half", hint: "Points toward MCQ total (max 37)", maxPoints: 37 },
 { id: "frq1", label: "FRQ 1", hint: "Toward FRQ total (max 25)", maxPoints: 25 },
 { id: "frq2", label: "FRQ 2", hint: "Toward FRQ total (max 25)", maxPoints: 25 },
 { id: "frq3", label: "FRQ 3", hint: "Toward FRQ total (max 25)", maxPoints: 25 },
 ],
 "Model totals: MCQ 75 + FRQ 75 = 150.",
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
 { id: "mc1", label: "MCQ — first half", hint: "Points toward MCQ total (max 45)", maxPoints: 45 },
 { id: "mc2", label: "MCQ — second half", hint: "Points toward MCQ total (max 45)", maxPoints: 45 },
 { id: "essay1", label: "Essay 1", hint: "Essays 3×30 = 90 (max 30)", maxPoints: 30 },
 { id: "essay2", label: "Essay 2", hint: "Max 30", maxPoints: 30 },
 { id: "essay3", label: "Essay 3", hint: "Max 30", maxPoints: 30 },
 ],
 "Model totals: MCQ 90 + essays (3×30) 90 = 180.",
 {
 mcSectionIds: ["mc1", "mc2"],
 frqSectionIds: ["essay1", "essay2", "essay3"],
 mcScoreLabel: "MCQ score",
 frqScoreLabel: "Essay score",
 },
 ),
 sections(
 "lit",
 "AP English Literature",
 "english",
 [
 { id: "mc1", label: "MCQ — first half", hint: "Points toward MCQ total (max 45)", maxPoints: 45 },
 { id: "mc2", label: "MCQ — second half", hint: "Points toward MCQ total (max 45)", maxPoints: 45 },
 { id: "essay1", label: "Essay 1", hint: "Essays 3×30 = 90 (max 30)", maxPoints: 30 },
 { id: "essay2", label: "Essay 2", hint: "Max 30", maxPoints: 30 },
 { id: "essay3", label: "Essay 3", hint: "Max 30", maxPoints: 30 },
 ],
 "Model totals: MCQ 90 + essays (3×30) 90 = 180.",
 {
 mcSectionIds: ["mc1", "mc2"],
 frqSectionIds: ["essay1", "essay2", "essay3"],
 mcScoreLabel: "MCQ score",
 frqScoreLabel: "Essay score",
 },
 ),
 sections(
 "art-hist",
 "AP Art History",
 "arts",
 [
 { id: "mc1", label: "MCQ — first half", hint: "Points toward MCQ total (max 40)", maxPoints: 40 },
 { id: "mc2", label: "MCQ — second half", hint: "Points toward MCQ total (max 40)", maxPoints: 40 },
 { id: "frq1", label: "FRQ — Comparison", hint: "Max 16", maxPoints: 16 },
 { id: "frq2", label: "FRQ — Visual / contextual", hint: "Max 12", maxPoints: 12 },
 { id: "frq3", label: "FRQ — Visual analysis", hint: "Max 10", maxPoints: 10 },
 { id: "frq4", label: "FRQ — Contextual analysis", hint: "Max 10", maxPoints: 10 },
 { id: "frq5", label: "FRQ — Attribution", hint: "Max 10", maxPoints: 10 },
 { id: "frq6", label: "FRQ — Continuity & change", hint: "Max 10", maxPoints: 10 },
 ],
 "Model totals: MCQ 80 + FRQ 68 = 148.",
 {
 mcSectionIds: ["mc1", "mc2"],
 frqSectionIds: ["frq1", "frq2", "frq3", "frq4", "frq5", "frq6"],
 mcScoreLabel: "MCQ score",
 frqScoreLabel: "FRQ score",
 },
 ),
 sections(
 "art-design",
 "AP Art and Design",
 "arts",
 [
 { id: "sustained", label: "Sustained Investigation", hint: "Portfolio rubric (max 60)", maxPoints: 60 },
 { id: "selected", label: "Selected Works", hint: "Portfolio rubric (max 40)", maxPoints: 40 },
 ],
 "Studio Art 2D / 3D / Drawing style split. Model total: 100.",
 {
 mcSectionIds: ["sustained"],
 frqSectionIds: ["selected"],
 mcScoreLabel: "Sustained Investigation score",
 frqScoreLabel: "Selected Works score",
 },
 ),
 sections(
 "music",
 "AP Music Theory",
 "arts",
 [
 { id: "mc1", label: "MCQ — first half", hint: "Points toward MCQ total (max 38)", maxPoints: 38 },
 { id: "mc2", label: "MCQ — second half", hint: "Points toward MCQ total (max 37)", maxPoints: 37 },
 { id: "frq1", label: "FRQ — portion 1", hint: "Toward FRQ total (max 38)", maxPoints: 38 },
 { id: "frq2", label: "FRQ — portion 2", hint: "Toward FRQ total (max 37)", maxPoints: 37 },
 ],
 "Model totals: MCQ 75 + FRQ 75 = 150.",
 {
 mcSectionIds: ["mc1", "mc2"],
 frqSectionIds: ["frq1", "frq2"],
 mcScoreLabel: "MCQ score",
 frqScoreLabel: "FRQ score",
 },
 ),
 sections(
 "spanish",
 "AP Spanish Language",
 "world_lang",
 [
 { id: "mc1", label: "MCQ — first half", hint: "Points toward MCQ total (max 50)", maxPoints: 50 },
 { id: "mc2", label: "MCQ — second half", hint: "Points toward MCQ total (max 50)", maxPoints: 50 },
 { id: "writing", label: "FRQ — Writing", hint: "Presentational & interpersonal writing (max 50)", maxPoints: 50 },
 { id: "speaking", label: "FRQ — Speaking", hint: "Presentational & interpersonal speaking (max 50)", maxPoints: 50 },
 ],
 "Model totals: MCQ 100 + Writing 50 + Speaking 50 = 200.",
 {
 mcSectionIds: ["mc1", "mc2"],
 frqSectionIds: ["writing", "speaking"],
 mcScoreLabel: "MCQ score",
 frqScoreLabel: "Writing + Speaking score",
 },
 ),
 sections(
 "french",
 "AP French Language",
 "world_lang",
 [
 { id: "mc1", label: "MCQ — first half", hint: "Points toward MCQ total (max 50)", maxPoints: 50 },
 { id: "mc2", label: "MCQ — second half", hint: "Points toward MCQ total (max 50)", maxPoints: 50 },
 { id: "writing", label: "FRQ — Writing", hint: "Presentational & interpersonal writing (max 50)", maxPoints: 50 },
 { id: "speaking", label: "FRQ — Speaking", hint: "Presentational & interpersonal speaking (max 50)", maxPoints: 50 },
 ],
 "Model totals: MCQ 100 + Writing 50 + Speaking 50 = 200.",
 {
 mcSectionIds: ["mc1", "mc2"],
 frqSectionIds: ["writing", "speaking"],
 mcScoreLabel: "MCQ score",
 frqScoreLabel: "Writing + Speaking score",
 },
 ),
 sections(
 "german",
 "AP German Language",
 "world_lang",
 [
 { id: "mc1", label: "MCQ — first half", hint: "Points toward MCQ total (max 50)", maxPoints: 50 },
 { id: "mc2", label: "MCQ — second half", hint: "Points toward MCQ total (max 50)", maxPoints: 50 },
 { id: "writing", label: "FRQ — Writing", hint: "Presentational & interpersonal writing (max 50)", maxPoints: 50 },
 { id: "speaking", label: "FRQ — Speaking", hint: "Presentational & interpersonal speaking (max 50)", maxPoints: 50 },
 ],
 "Model totals: MCQ 100 + Writing 50 + Speaking 50 = 200.",
 {
 mcSectionIds: ["mc1", "mc2"],
 frqSectionIds: ["writing", "speaking"],
 mcScoreLabel: "MCQ score",
 frqScoreLabel: "Writing + Speaking score",
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
 { id: "mc1", label: "MCQ — first half", hint: "Points toward MCQ total (max 50)", maxPoints: 50 },
 { id: "mc2", label: "MCQ — second half", hint: "Points toward MCQ total (max 50)", maxPoints: 50 },
 { id: "writing", label: "FRQ — Writing", hint: "Presentational & interpersonal writing (max 50)", maxPoints: 50 },
 { id: "speaking", label: "FRQ — Speaking", hint: "Presentational & interpersonal speaking (max 50)", maxPoints: 50 },
 ],
 "Model totals: MCQ 100 + Writing 50 + Speaking 50 = 200.",
 {
 mcSectionIds: ["mc1", "mc2"],
 frqSectionIds: ["writing", "speaking"],
 mcScoreLabel: "MCQ score",
 frqScoreLabel: "Writing + Speaking score",
 },
 ),
 sections(
 "japanese",
 "AP Japanese Language",
 "world_lang",
 [
 { id: "mc1", label: "MCQ — first half", hint: "Points toward MCQ total (max 50)", maxPoints: 50 },
 { id: "mc2", label: "MCQ — second half", hint: "Points toward MCQ total (max 50)", maxPoints: 50 },
 { id: "writing", label: "FRQ — Writing", hint: "Presentational & interpersonal writing (max 50)", maxPoints: 50 },
 { id: "speaking", label: "FRQ — Speaking", hint: "Presentational & interpersonal speaking (max 50)", maxPoints: 50 },
 ],
 "Model totals: MCQ 100 + Writing 50 + Speaking 50 = 200.",
 {
 mcSectionIds: ["mc1", "mc2"],
 frqSectionIds: ["writing", "speaking"],
 mcScoreLabel: "MCQ score",
 frqScoreLabel: "Writing + Speaking score",
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
