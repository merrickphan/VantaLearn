/**
 * How many multiple-choice items to serve in one practice sitting, tuned to feel like
 * a single College Board-style set (not a full exam). Values are editorial defaults.
 */

const DEFAULT_MCQ = 5;

/** Course id → MCQ count for procedural / AI practice sessions. */
const PRACTICE_MCQ_BY_COURSE: Record<string, number> = {
 "hum-geo": 5,
 csp: 4,
 lang: 5,
 lit: 5,
 gov: 5,
 "comp-gov": 4,
 psych: 5,
 macro: 5,
 micro: 5,
 "calc-ab": 6,
 "calc-bc": 6,
 precalc: 6,
 stats: 6,
 "cs-a": 5,
 "physics-1": 5,
 "physics-2": 5,
 "physics-c-m": 5,
 "physics-c-em": 5,
 chem: 5,
 bio: 5,
 env: 5,
 ush: 5,
 wh: 5,
 euro: 5,
 "art-hist": 5,
 "art-design": 4,
 music: 5,
 spanish: 5,
 french: 5,
 german: 5,
 latin: 5,
 chinese: 5,
 japanese: 5,
 seminar: 4,
 research: 4,
};

export function proceduralPracticeMcqCountForCourse(courseId: string): number {
 const n = PRACTICE_MCQ_BY_COURSE[courseId];
 const v = typeof n === "number" ? n : DEFAULT_MCQ;
 return Math.min(40, Math.max(1, Math.floor(v)));
}
