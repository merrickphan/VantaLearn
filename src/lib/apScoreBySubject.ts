import { AP_COURSES } from "@/lib/apCatalog";

export type ApScoreBand = 1 | 2 | 3 | 4 | 5;

/** One scored portion of an AP exam (MC, FRQ block, essay, portfolio area, etc.) */
export interface ApScoreSectionDef {
 id: string;
 label: string;
 /** Shown under the input */
 hint?: string;
 /** Rubric / slider maximum (e.g. 7 per HUG FRQ). */
 maxPoints: number;
 /**
 * Contribution to composite when this section is fully correct, after scaling (earned/maxPoints)*weight.
 * Defaults to maxPoints when omitted (rubric max equals weight).
 */
 weightInComposite?: number;
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

/** Single Section I row (no split MC blocks). */
function MC(maxPts: number, hint?: string): ApScoreSectionDef {
 return {
 id: "mc",
 label: "Section I — Multiple choice",
 maxPoints: maxPts,
 hint: hint ?? `Weighted multiple-choice total (max ${maxPts})`,
 };
}

/** Section II row: rubric max for UI; optional different composite weight (CB-style scaling). */
function FR(
 id: string,
 label: string,
 rubricMax: number,
 compositeWeight: number,
 hint?: string,
): ApScoreSectionDef {
 const row: ApScoreSectionDef = {
 id,
 label,
 maxPoints: rubricMax,
 hint: hint ?? `Rubric max ${rubricMax}`,
 };
 if (compositeWeight !== rubricMax) {
 row.weightInComposite = compositeWeight;
 }
 return row;
}

const S80 = 80 / 26;
/** Stats Section II: investigative + five FRQs (rubric /4 or /6); weights sum to 80. */
const STATS_FR = [
 FR("inv", "Investigative task", 6, 6 * S80),
 FR("frq1", "FRQ — Problem 1", 4, 4 * S80),
 FR("frq2", "FRQ — Problem 2", 4, 4 * S80),
 FR("frq3", "FRQ — Problem 3", 4, 4 * S80),
 FR("frq4", "FRQ — Problem 4", 4, 4 * S80),
 FR("frq5", "FRQ — Problem 5", 4, 4 * S80),
];

const WUSH_SAQ = 40 / 3;
const WGOV = 75 / 22;

const WBIO = 90 / 60;
const WCHEM = 90 / 46;
const WP1 = 90 / 50;
const WENV = 67 / 34;

const WECON = 50 / 30;
const WPREC_FR = 40 / 42;

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
 MC(54),
 FR("frq1", "Section II — FRQ 1", 9, 9),
 FR("frq2", "Section II — FRQ 2", 9, 9),
 FR("frq3", "Section II — FRQ 3", 9, 9),
 FR("frq4", "Section II — FRQ 4", 9, 9),
 FR("frq5", "Section II — FRQ 5", 9, 9),
 FR("frq6", "Section II — FRQ 6", 9, 9),
 ],
 "MCQ 54 + FRQ 54 (six ×9 rubric) = 108.",
 { mcSectionIds: ["mc"], frqSectionIds: ["frq1", "frq2", "frq3", "frq4", "frq5", "frq6"] },
 ),
 sections(
 "calc-bc",
 "AP Calculus BC",
 "stem_math",
 [
 MC(54),
 FR("frq1", "Section II — FRQ 1", 9, 9),
 FR("frq2", "Section II — FRQ 2", 9, 9),
 FR("frq3", "Section II — FRQ 3", 9, 9),
 FR("frq4", "Section II — FRQ 4", 9, 9),
 FR("frq5", "Section II — FRQ 5", 9, 9),
 FR("frq6", "Section II — FRQ 6", 9, 9),
 ],
 "MCQ 54 + FRQ 54 (six ×9 rubric) = 108.",
 { mcSectionIds: ["mc"], frqSectionIds: ["frq1", "frq2", "frq3", "frq4", "frq5", "frq6"] },
 ),
 sections(
 "precalc",
 "AP Precalculus",
 "stem_math",
 [
 MC(40, "40 multiple-choice questions (max 40)"),
 FR("frq1", "FRQ 1", 11, 11 * WPREC_FR),
 FR("frq2", "FRQ 2", 11, 11 * WPREC_FR),
 FR("frq3", "FRQ 3", 10, 10 * WPREC_FR),
 FR("frq4", "FRQ 4", 10, 10 * WPREC_FR),
 ],
 "Section II rubric rows scale to 40 composite weight to pair with 40 MC.",
 { mcSectionIds: ["mc"], frqSectionIds: ["frq1", "frq2", "frq3", "frq4"] },
 ),
 sections(
 "stats",
 "AP Statistics",
 "stats",
 [MC(80), ...STATS_FR],
 "MCQ 80 + Section II (investigative + five FRQs; rubric scaled to weight 80) = 160.",
 { mcSectionIds: ["mc"], frqSectionIds: ["inv", "frq1", "frq2", "frq3", "frq4", "frq5"] },
 ),
 sections(
 "cs-a",
 "AP Computer Science A",
 "cs",
 [
 MC(80),
 FR("frq1", "Section II — FRQ 1 (methods & control)", 9, 20),
 FR("frq2", "Section II — FRQ 2 (classes)", 9, 20),
 FR("frq3", "Section II — FRQ 3 (array / ArrayList)", 9, 20),
 FR("frq4", "Section II — FRQ 4 (2D array)", 9, 20),
 ],
 "MCQ 80 + four FRQs (rubric /9 each, weighted to 80) = 160.",
 { mcSectionIds: ["mc"], frqSectionIds: ["frq1", "frq2", "frq3", "frq4"] },
 ),
 sections(
 "csp",
 "AP Computer Science Principles",
 "cs",
 [
 MC(70, "End-of-course multiple choice (weighted total max 70)"),
 FR("ct1", "Create Task — rubric criterion 1", 5, 5),
 FR("ct2", "Create Task — rubric criterion 2", 5, 5),
 FR("ct3", "Create Task — rubric criterion 3", 5, 5),
 FR("ct4", "Create Task — rubric criterion 4", 5, 5),
 FR("ct5", "Create Task — rubric criterion 5", 5, 5),
 FR("ct6", "Create Task — rubric criterion 6", 5, 5),
 ],
 "MCQ 70 + Create Task (6×5 rubric) 30 = 100.",
 {
 mcSectionIds: ["mc"],
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
 MC(90),
 FR("frq1", "Section II — FRQ 1", 12, 12 * WP1),
 FR("frq2", "Section II — FRQ 2", 10, 10 * WP1),
 FR("frq3", "Section II — FRQ 3", 10, 10 * WP1),
 FR("frq4", "Section II — FRQ 4", 8, 8 * WP1),
 FR("frq5", "Section II — FRQ 5", 10, 10 * WP1),
 ],
 "MCQ 90 + five FRQs (rubric scaled to weight 90) = 180.",
 { mcSectionIds: ["mc"], frqSectionIds: ["frq1", "frq2", "frq3", "frq4", "frq5"] },
 ),
 sections(
 "physics-2",
 "AP Physics 2",
 "science",
 [
 MC(90),
 FR("frq1", "Section II — FRQ 1", 12, 12 * WP1),
 FR("frq2", "Section II — FRQ 2", 10, 10 * WP1),
 FR("frq3", "Section II — FRQ 3", 10, 10 * WP1),
 FR("frq4", "Section II — FRQ 4", 8, 8 * WP1),
 FR("frq5", "Section II — FRQ 5", 10, 10 * WP1),
 ],
 "MCQ 90 + five FRQs (rubric scaled to weight 90) = 180.",
 { mcSectionIds: ["mc"], frqSectionIds: ["frq1", "frq2", "frq3", "frq4", "frq5"] },
 ),
 sections(
 "physics-c-m",
 "AP Physics C: Mechanics",
 "science",
 [
 MC(70),
 FR("frq1", "Section II — FRQ 1", 15, 30),
 FR("frq2", "Section II — FRQ 2", 15, 30),
 FR("frq3", "Section II — FRQ 3", 15, 30),
 ],
 "MCQ 70 + three FRQs (rubric /15 each, weighted to 90) = 160.",
 { mcSectionIds: ["mc"], frqSectionIds: ["frq1", "frq2", "frq3"] },
 ),
 sections(
 "physics-c-em",
 "AP Physics C: E&M",
 "science",
 [
 MC(70),
 FR("frq1", "Section II — FRQ 1", 15, 30),
 FR("frq2", "Section II — FRQ 2", 15, 30),
 FR("frq3", "Section II — FRQ 3", 15, 30),
 ],
 "MCQ 70 + three FRQs (rubric /15 each, weighted to 90) = 160.",
 { mcSectionIds: ["mc"], frqSectionIds: ["frq1", "frq2", "frq3"] },
 ),
 sections(
 "chem",
 "AP Chemistry",
 "science",
 [
 MC(90),
 FR("frq1", "Section II — FRQ 1 (long)", 10, 10 * WCHEM),
 FR("frq2", "Section II — FRQ 2 (long)", 10, 10 * WCHEM),
 FR("frq3", "Section II — FRQ 3", 9, 9 * WCHEM),
 FR("frq4", "Section II — FRQ 4", 9, 9 * WCHEM),
 FR("frq5", "Section II — FRQ 5 (short)", 4, 4 * WCHEM),
 FR("frq6", "Section II — FRQ 6 (short)", 4, 4 * WCHEM),
 ],
 "MCQ 90 + six FRQs (rubric scaled to weight 90) = 180.",
 { mcSectionIds: ["mc"], frqSectionIds: ["frq1", "frq2", "frq3", "frq4", "frq5", "frq6"] },
 ),
 sections(
 "bio",
 "AP Biology",
 "science",
 [
 MC(90),
 FR("frq1", "Section II — FRQ 1 (long)", 10, 10 * WBIO),
 FR("frq2", "Section II — FRQ 2 (long)", 10, 10 * WBIO),
 FR("frq3", "Section II — FRQ 3", 8, 8 * WBIO),
 FR("frq4", "Section II — FRQ 4", 8, 8 * WBIO),
 FR("frq5", "Section II — FRQ 5", 12, 12 * WBIO),
 FR("frq6", "Section II — FRQ 6", 12, 12 * WBIO),
 ],
 "MCQ 90 + six FRQs (rubric scaled to weight 90) = 180.",
 { mcSectionIds: ["mc"], frqSectionIds: ["frq1", "frq2", "frq3", "frq4", "frq5", "frq6"] },
 ),
 sections(
 "env",
 "AP Environmental Science",
 "science",
 [
 MC(100),
 FR("frq1", "Section II — FRQ 1", 10, 10 * WENV),
 FR("frq2", "Section II — FRQ 2", 12, 12 * WENV),
 FR("frq3", "Section II — FRQ 3", 12, 12 * WENV),
 ],
 "MCQ 100 + three FRQs (rubric scaled to weight 67) = 167.",
 { mcSectionIds: ["mc"], frqSectionIds: ["frq1", "frq2", "frq3"] },
 ),
 sections(
 "ush",
 "AP US History",
 "history_gov",
 [
 MC(80),
 FR("saq1", "Section II — SAQ 1", 3, WUSH_SAQ),
 FR("saq2", "Section II — SAQ 2", 3, WUSH_SAQ),
 FR("saq3", "Section II — SAQ 3", 3, WUSH_SAQ),
 FR("dbq", "Section II — DBQ", 7, 50),
 FR("leq", "Section II — LEQ", 6, 30),
 ],
 "MCQ 80 + SAQ (3×3 rubric → 40 wt) + DBQ (7→50) + LEQ (6→30) = 200.",
 {
 mcSectionIds: ["mc"],
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
 MC(80),
 FR("saq1", "Section II — SAQ 1", 3, WUSH_SAQ),
 FR("saq2", "Section II — SAQ 2", 3, WUSH_SAQ),
 FR("saq3", "Section II — SAQ 3", 3, WUSH_SAQ),
 FR("dbq", "Section II — DBQ", 7, 50),
 FR("leq", "Section II — LEQ", 6, 30),
 ],
 "MCQ 80 + SAQ (3×3 rubric → 40 wt) + DBQ (7→50) + LEQ (6→30) = 200.",
 {
 mcSectionIds: ["mc"],
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
 MC(80),
 FR("saq1", "Section II — SAQ 1", 3, WUSH_SAQ),
 FR("saq2", "Section II — SAQ 2", 3, WUSH_SAQ),
 FR("saq3", "Section II — SAQ 3", 3, WUSH_SAQ),
 FR("dbq", "Section II — DBQ", 7, 50),
 FR("leq", "Section II — LEQ", 6, 30),
 ],
 "MCQ 80 + SAQ (3×3 rubric → 40 wt) + DBQ (7→50) + LEQ (6→30) = 200.",
 {
 mcSectionIds: ["mc"],
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
 MC(75),
 FR("frq1", "Section II — Concept application", 6, 6 * WGOV),
 FR("frq2", "Section II — Quantitative analysis", 5, 5 * WGOV),
 FR("frq3", "Section II — SCOTUS comparison", 5, 5 * WGOV),
 FR("frq4", "Section II — Argument essay", 6, 6 * WGOV),
 ],
 "MCQ 75 + four FRQs (rubric scaled to weight 75) = 150.",
 { mcSectionIds: ["mc"], frqSectionIds: ["frq1", "frq2", "frq3", "frq4"] },
 ),
 sections(
 "comp-gov",
 "AP Comparative Government",
 "history_gov",
 [
 MC(55, "55 multiple-choice items"),
 FR("frq1", "Section II — FRQ 1", 6, 6),
 FR("frq2", "Section II — FRQ 2", 5, 5),
 FR("frq3", "Section II — FRQ 3", 5, 5),
 FR("frq4", "Section II — FRQ 4", 6, 6),
 FR("frq5", "Section II — FRQ 5", 6, 6),
 FR("frq6", "Section II — FRQ 6", 5, 5),
 FR("frq7", "Section II — FRQ 7", 6, 6),
 FR("frq8", "Section II — FRQ 8", 6, 6),
 ],
 undefined,
 { mcSectionIds: ["mc"], frqSectionIds: ["frq1", "frq2", "frq3", "frq4", "frq5", "frq6", "frq7", "frq8"] },
 ),
 sections(
 "macro",
 "AP Macroeconomics",
 "econ",
 [
 MC(100),
 FR("frq1", "Section II — FRQ 1", 10, 10 * WECON),
 FR("frq2", "Section II — FRQ 2", 10, 10 * WECON),
 FR("frq3", "Section II — FRQ 3", 10, 10 * WECON),
 ],
 "MCQ 100 + three long FRQs (rubric /10 each → weight 50) = 150.",
 { mcSectionIds: ["mc"], frqSectionIds: ["frq1", "frq2", "frq3"] },
 ),
 sections(
 "micro",
 "AP Microeconomics",
 "econ",
 [
 MC(100),
 FR("frq1", "Section II — FRQ 1", 10, 10 * WECON),
 FR("frq2", "Section II — FRQ 2", 10, 10 * WECON),
 FR("frq3", "Section II — FRQ 3", 10, 10 * WECON),
 ],
 "MCQ 100 + three long FRQs (rubric /10 each → weight 50) = 150.",
 { mcSectionIds: ["mc"], frqSectionIds: ["frq1", "frq2", "frq3"] },
 ),
 sections(
 "psych",
 "AP Psychology",
 "psych",
 [
 MC(133, "Section I — all multiple choice (weighted total max 133)"),
 FR("frq1", "Section II — FRQ 1", 7, 67 / 2),
 FR("frq2", "Section II — FRQ 2", 7, 67 / 2),
 ],
 "MCQ 133 + two FRQs (rubric /7 each → weight 67) = 200.",
 {
 mcSectionIds: ["mc"],
 frqSectionIds: ["frq1", "frq2"],
 mcScoreLabel: "MCQ score",
 frqScoreLabel: "FRQ score",
 },
 ),
 sections(
 "hum-geo",
 "AP Human Geography",
 "hum_geo",
 [
 MC(75),
 FR("frq1", "Section II: Free Response — Question 1", 7, 25),
 FR("frq2", "Section II: Free Response — Question 2", 7, 25),
 FR("frq3", "Section II: Free Response — Question 3", 7, 25),
 ],
 "MCQ 75 + three 7-point FRQs (weighted to 75) = 150.",
 {
 mcSectionIds: ["mc"],
 frqSectionIds: ["frq1", "frq2", "frq3"],
 },
 ),
 sections(
 "lang",
 "AP English Language",
 "english",
 [
 MC(90),
 FR("essay1", "Section II — Synthesis essay", 6, 30),
 FR("essay2", "Section II — Rhetorical analysis", 6, 30),
 FR("essay3", "Section II — Argument", 6, 30),
 ],
 "MCQ 90 + three essays (rubric /6 each → weight 90) = 180.",
 {
 mcSectionIds: ["mc"],
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
 MC(90),
 FR("essay1", "Section II — Poetry / prose analysis", 6, 30),
 FR("essay2", "Section II — Literary argument", 6, 30),
 FR("essay3", "Section II — Text / concept analysis", 6, 30),
 ],
 "MCQ 90 + three essays (rubric /6 each → weight 90) = 180.",
 {
 mcSectionIds: ["mc"],
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
 MC(80),
 FR("frq1", "Section II — Comparison", 16, 16),
 FR("frq2", "Section II — Visual / contextual analysis", 12, 12),
 FR("frq3", "Section II — Visual analysis", 10, 10),
 FR("frq4", "Section II — Contextual analysis", 10, 10),
 FR("frq5", "Section II — Attribution", 10, 10),
 FR("frq6", "Section II — Continuity & change", 10, 10),
 ],
 "MCQ 80 + six FRQs (rubric totals 68) = 148.",
 {
 mcSectionIds: ["mc"],
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
 MC(75),
 FR("frq1", "Section II — FRQ / aural (first block)", 45, 37.5),
 FR("frq2", "Section II — FRQ / aural (second block)", 30, 37.5),
 ],
 "MCQ 75 + Section II split (rubric scaled to weight 75) = 150.",
 {
 mcSectionIds: ["mc"],
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
 MC(100),
 FR("writing", "Section II — Writing", 50, 50),
 FR("speaking", "Section II — Speaking", 50, 50),
 ],
 "MCQ 100 + Writing 50 + Speaking 50 = 200.",
 {
 mcSectionIds: ["mc"],
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
 MC(100),
 FR("writing", "Section II — Writing", 50, 50),
 FR("speaking", "Section II — Speaking", 50, 50),
 ],
 "MCQ 100 + Writing 50 + Speaking 50 = 200.",
 {
 mcSectionIds: ["mc"],
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
 MC(100),
 FR("writing", "Section II — Writing", 50, 50),
 FR("speaking", "Section II — Speaking", 50, 50),
 ],
 "MCQ 100 + Writing 50 + Speaking 50 = 200.",
 {
 mcSectionIds: ["mc"],
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
 MC(50, "50 multiple-choice items"),
 FR("frq1", "Section II — FRQ 1", 25, 25),
 FR("frq2", "Section II — FRQ 2", 25, 25),
 ],
 undefined,
 { mcSectionIds: ["mc"], frqSectionIds: ["frq1", "frq2"] },
 ),
 sections(
 "chinese",
 "AP Chinese Language",
 "world_lang",
 [
 MC(100),
 FR("writing", "Section II — Writing", 50, 50),
 FR("speaking", "Section II — Speaking", 50, 50),
 ],
 "MCQ 100 + Writing 50 + Speaking 50 = 200.",
 {
 mcSectionIds: ["mc"],
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
 MC(100),
 FR("writing", "Section II — Writing", 50, 50),
 FR("speaking", "Section II — Speaking", 50, 50),
 ],
 "MCQ 100 + Writing 50 + Speaking 50 = 200.",
 {
 mcSectionIds: ["mc"],
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

function sectionWeight(s: ApScoreSectionDef): number {
 return s.weightInComposite ?? s.maxPoints;
}

/** Bucket total using (earned/rubricMax)*weight per section (College Board–style weighting). */
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
 const clamped = Math.min(e, s.maxPoints);
 const cap = s.maxPoints > 0 ? s.maxPoints : 1;
 const w = sectionWeight(s);
 earned += (clamped / cap) * w;
 max += w;
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
 const cap = s.maxPoints > 0 ? s.maxPoints : 1;
 const w = sectionWeight(s);
 totalEarned += (clamped / cap) * w;
 totalPossible += w;
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
