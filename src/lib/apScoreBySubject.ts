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

export interface ApSubjectScoreModel {
 courseId: string;
 courseName: string;
 sections: ApScoreSectionDef[];
 curveGroup: ApCurveGroup;
 /** One-line note for the UI */
 note?: string;
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
 note?: string
): ApSubjectScoreModel {
 return { courseId, courseName, sections: parts, curveGroup, note };
}

/**
 * Section maxima approximate College Board exam blueprints (MC + FRQ rubrics).
 * Curves are heuristic - not official; good for practice estimates only.
 */
export const AP_SUBJECT_SCORE_MODELS: ApSubjectScoreModel[] = [
 sections("calc-ab", "AP Calculus AB", "stem_math", [
 { id: "mc", label: "Multiple choice", hint: "Correct out of 45", maxPoints: 45 },
 { id: "frq", label: "Free response", hint: "Rubric points (6 questions, max 54)", maxPoints: 54 },
 ]),
 sections("calc-bc", "AP Calculus BC", "stem_math", [
 { id: "mc", label: "Multiple choice", hint: "Correct out of 45", maxPoints: 45 },
 { id: "frq", label: "Free response", hint: "Rubric points (max 54)", maxPoints: 54 },
 ]),
 sections("precalc", "AP Precalculus", "stem_math", [
 { id: "mc", label: "Multiple choice", hint: "Correct out of 40", maxPoints: 40 },
 { id: "frq", label: "Free response", hint: "Rubric points (max ~42)", maxPoints: 42 },
 ]),
 sections("stats", "AP Statistics", "stats", [
 { id: "mc", label: "Multiple choice", hint: "Correct out of 40", maxPoints: 40 },
 { id: "frq", label: "Free response + investigative task", hint: "Combined rubric points (max ~46)", maxPoints: 46 },
 ]),
 sections("cs-a", "AP Computer Science A", "cs", [
 { id: "mc", label: "Multiple choice", hint: "Correct out of 40", maxPoints: 40 },
 { id: "frq", label: "Free response", hint: "4 problems, rubric total (max ~36)", maxPoints: 36 },
 ]),
 sections("csp", "AP Computer Science Principles", "cs", [
 { id: "pt", label: "Create performance task", hint: "As scored on rubric (max 50)", maxPoints: 50 },
 { id: "exam", label: "End-of-course exam", hint: "MC + PT-related items (max 50)", maxPoints: 50 },
 ]),
 sections("physics-1", "AP Physics 1", "science", [
 { id: "mc", label: "Section I (MC)", hint: "Correct out of 50", maxPoints: 50 },
 { id: "frq", label: "Section II (FRQ)", hint: "Rubric total (max ~50)", maxPoints: 50 },
 ]),
 sections("physics-2", "AP Physics 2", "science", [
 { id: "mc", label: "Section I (MC)", hint: "Correct out of 50", maxPoints: 50 },
 { id: "frq", label: "Section II (FRQ)", hint: "Rubric total (max ~50)", maxPoints: 50 },
 ]),
 sections("physics-c-m", "AP Physics C: Mechanics", "science", [
 { id: "mc", label: "Multiple choice", hint: "Correct out of 35", maxPoints: 35 },
 { id: "frq", label: "Free response", hint: "3 questions, rubric total (max ~45)", maxPoints: 45 },
 ]),
 sections("physics-c-em", "AP Physics C: E&M", "science", [
 { id: "mc", label: "Multiple choice", hint: "Correct out of 35", maxPoints: 35 },
 { id: "frq", label: "Free response", hint: "3 questions, rubric total (max ~45)", maxPoints: 45 },
 ]),
 sections("chem", "AP Chemistry", "science", [
 { id: "mc", label: "Multiple choice", hint: "Correct out of 60", maxPoints: 60 },
 { id: "frq", label: "Free response", hint: "Long + short questions (max ~46)", maxPoints: 46 },
 ]),
 sections("bio", "AP Biology", "science", [
 { id: "mc", label: "Multiple choice", hint: "Correct out of 60", maxPoints: 60 },
 { id: "frq", label: "Free response", hint: "6 FRQs, rubric total (max ~60)", maxPoints: 60 },
 ]),
 sections("env", "AP Environmental Science", "science", [
 { id: "mc", label: "Multiple choice", hint: "Correct out of 80", maxPoints: 80 },
 { id: "frq", label: "Free response", hint: "3 FRQs, rubric total (max ~40)", maxPoints: 40 },
 ]),
 sections("ush", "AP US History", "history_gov", [
 { id: "mc", label: "Multiple choice", hint: "Correct out of 55", maxPoints: 55 },
 { id: "saq", label: "Short answer", hint: "Combined SAQ rubric (max ~18)", maxPoints: 18 },
 { id: "dbq", label: "Document-based question", hint: "DBQ rubric (max ~7)", maxPoints: 7 },
 { id: "leq", label: "Long essay", hint: "LEQ rubric (max ~6)", maxPoints: 6 },
 ], "Weights mirror MC + SAQ + DBQ + LEQ; adjust if your practice uses a single FRQ score."),
 sections("wh", "AP World History: Modern", "history_gov", [
 { id: "mc", label: "Multiple choice", hint: "Correct out of 55", maxPoints: 55 },
 { id: "frq", label: "SAQ + DBQ + LEQ combined", hint: "Enter total rubric points (max ~45)", maxPoints: 45 },
 ]),
 sections("euro", "AP European History", "history_gov", [
 { id: "mc", label: "Multiple choice", hint: "Correct out of 55", maxPoints: 55 },
 { id: "frq", label: "SAQ + DBQ + LEQ combined", hint: "Total rubric points (max ~45)", maxPoints: 45 },
 ]),
 sections("gov", "AP US Government & Politics", "history_gov", [
 { id: "mc", label: "Multiple choice", hint: "Correct out of 55", maxPoints: 55 },
 { id: "frq", label: "Concept application + SCOTUS + argument", hint: "All FRQ rubrics (max ~45)", maxPoints: 45 },
 ]),
 sections("comp-gov", "AP Comparative Government", "history_gov", [
 { id: "mc", label: "Multiple choice", hint: "Correct out of 55", maxPoints: 55 },
 { id: "frq", label: "8 FRQs (concept + analysis + argument)", hint: "Total rubric points (max ~45)", maxPoints: 45 },
 ]),
 sections("macro", "AP Macroeconomics", "econ", [
 { id: "mc", label: "Multiple choice", hint: "Correct out of 60", maxPoints: 60 },
 { id: "frq", label: "Free response", hint: "3 questions, rubric total (max ~40)", maxPoints: 40 },
 ]),
 sections("micro", "AP Microeconomics", "econ", [
 { id: "mc", label: "Multiple choice", hint: "Correct out of 60", maxPoints: 60 },
 { id: "frq", label: "Free response", hint: "3 questions, rubric total (max ~40)", maxPoints: 40 },
 ]),
 sections("psych", "AP Psychology", "psych", [
 { id: "mc", label: "Multiple choice", hint: "Correct out of 100 (operational + field-test)", maxPoints: 100 },
 ], "AP Psych is all multiple choice on the national exam."),
 sections("hum-geo", "AP Human Geography", "hum_geo", [
 { id: "mc", label: "Multiple choice", hint: "Correct out of 60", maxPoints: 60 },
 { id: "frq", label: "Free response", hint: "3 questions, rubric total (max ~40)", maxPoints: 40 },
 ]),
 sections("lang", "AP English Language", "english", [
 { id: "mc", label: "Multiple choice / reading", hint: "Correct out of 45", maxPoints: 45 },
 { id: "essays", label: "Synthesis + rhetorical analysis + argument", hint: "Combined essay rubric points (max ~45)", maxPoints: 45 },
 ]),
 sections("lit", "AP English Literature", "english", [
 { id: "mc", label: "Multiple choice", hint: "Correct out of 55", maxPoints: 55 },
 { id: "essays", label: "Three essays", hint: "Combined rubric points (max ~45)", maxPoints: 45 },
 ]),
 sections("art-hist", "AP Art History", "arts", [
 { id: "mc", label: "Multiple choice", hint: "Correct out of 80", maxPoints: 80 },
 { id: "frq", label: "Long & short essays", hint: "6 FRQs, rubric total (max ~40)", maxPoints: 40 },
 ]),
 sections("art-design", "AP Art and Design", "arts", [
 { id: "sustained", label: "Sustained investigation", hint: "Portfolio rubric (max 50)", maxPoints: 50 },
 { id: "selected", label: "Selected works", hint: "Portfolio rubric (max 50)", maxPoints: 50 },
 ], "Scores depend on portfolio review; enter best-fit rubric totals."),
 sections("music", "AP Music Theory", "arts", [
 { id: "mc", label: "Non-aural multiple choice", hint: "Correct out of 45", maxPoints: 45 },
 { id: "aural", label: "Aural MC + dictation", hint: "Rubric / correct items (max ~25)", maxPoints: 25 },
 { id: "frq", label: "Free response (written + sight-sing)", hint: "Rubric total (max ~30)", maxPoints: 30 },
 ]),
 sections("spanish", "AP Spanish Language", "world_lang", [
 { id: "interpretive", label: "Interpretive (print + audio)", hint: "Combined score (max 40)", maxPoints: 40 },
 { id: "interpersonal", label: "Interpersonal speaking & writing", hint: "Combined (max 30)", maxPoints: 30 },
 { id: "presentational", label: "Presentational speaking & writing", hint: "Combined (max 30)", maxPoints: 30 },
 ]),
 sections("french", "AP French Language", "world_lang", [
 { id: "interpretive", label: "Interpretive communication", hint: "Combined (max 40)", maxPoints: 40 },
 { id: "interpersonal", label: "Interpersonal", hint: "Combined (max 30)", maxPoints: 30 },
 { id: "presentational", label: "Presentational", hint: "Combined (max 30)", maxPoints: 30 },
 ]),
 sections("german", "AP German Language", "world_lang", [
 { id: "interpretive", label: "Interpretive communication", hint: "Combined (max 40)", maxPoints: 40 },
 { id: "interpersonal", label: "Interpersonal", hint: "Combined (max 30)", maxPoints: 30 },
 { id: "presentational", label: "Presentational", hint: "Combined (max 30)", maxPoints: 30 },
 ]),
 sections("latin", "AP Latin", "world_lang", [
 { id: "mc", label: "Multiple choice (grammar + reading)", hint: "Correct out of 50", maxPoints: 50 },
 { id: "frq", label: "Translation + analytical essay", hint: "Rubric total (max ~50)", maxPoints: 50 },
 ]),
 sections("chinese", "AP Chinese Language", "world_lang", [
 { id: "interpretive", label: "Interpretive listening & reading", hint: "Combined (max 40)", maxPoints: 40 },
 { id: "interpersonal", label: "Interpersonal speaking & writing", hint: "Combined (max 30)", maxPoints: 30 },
 { id: "presentational", label: "Presentational", hint: "Combined (max 30)", maxPoints: 30 },
 ]),
 sections("japanese", "AP Japanese Language", "world_lang", [
 { id: "interpretive", label: "Interpretive listening & reading", hint: "Combined (max 40)", maxPoints: 40 },
 { id: "interpersonal", label: "Interpersonal", hint: "Combined (max 30)", maxPoints: 30 },
 { id: "presentational", label: "Presentational", hint: "Combined (max 30)", maxPoints: 30 },
 ]),
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

 const compositePercent = totalPossible > 0 ? (totalEarned / totalPossible) * 100 : 0;
 const apScore = compositeToApScore(compositePercent, model.curveGroup);

 return {
 apScore,
 compositePercent,
 totalEarned,
 totalPossible,
 bySection,
 model,
 };
}
