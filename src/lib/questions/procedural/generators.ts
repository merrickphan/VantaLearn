import type { ExamFigure, ExamQuestion } from "@/types";
import {
 CALC_ANTIDERIV_CONTEXT_ONLY,
 CALC_FUNCTION_CONTEXT_ONLY,
 CALC_FUNCTION_INTROS,
 COMPOSITION_STEMS,
 COMPOSITION_TABLE_STEMS,
 DERIVATIVE_AFTER_STIM_STEMS,
 DERIVATIVE_POWER_STEMS,
 fillStem,
 INTEGRAL_AFTER_STIM_STEMS,
 INTEGRAL_POWER_STEMS,
 KE_TABLE_STEMS,
 KINEMATICS_TABLE_STEMS,
 LIMIT_AFTER_TABLE_STEMS,
 LIMIT_LINEAR_STEMS,
 MEAN_AFTER_TABLE_STEMS,
 MOLARITY_TABLE_STEMS,
 ZSCORE_TABLE_STEMS,
} from "./stemBanks";
import { distinctRandInts, hashString, pick, pickThreeDistinct, randInt, roundN, shuffleInPlace } from "./utils";
import {
 examFromMassRow,
 pickBioMassRow,
 pickChemMassRow,
 pickCsMassRow,
 pickEconMassRow,
 pickEngMassRow,
 pickCompGovMassRow,
 pickGovUsMassRow,
 pickPhysMassRow,
 pickPsychMassRow,
 pickEuroMassRow,
 pickSeminarMassRow,
} from "./apMassConceptBanks";
import { getHumanGeographyGeneratorsForUnit } from "./humanGeographyUnitPools";
import { getUsHistoryGeneratorsForUnit } from "./usHistoryUnitPools";
import { getWorldHistoryGeneratorsForUnit } from "./worldHistoryUnitPools";

export interface ProcCtx {
 courseId: string;
 courseName: string;
 unitId: string;
 unitIndex: number;
 unitTitle: string;
 seedBase: string;
 /** When set for Calc AB/BC, tightens numeric parameters (no-calculator) or keeps full ranges (calculator). */
 calculatorAllowed?: boolean;
 /** Per-question difficulty for procedural numeric spread (easy / medium / hard). */
 difficulty?: "easy" | "medium" | "hard";
}

type NumericSpread = "tight" | "medium" | "wide";

function numericSpreadForCtx(ctx: ProcCtx): NumericSpread {
 if (ctx.calculatorAllowed === false) return "tight";
 const d = ctx.difficulty ?? "medium";
 if (d === "easy") return "tight";
 if (d === "hard") return "wide";
 return "medium";
}

export type QuestionGen = (rng: () => number, ctx: ProcCtx, i: number) => ExamQuestion;

function isApCsp(ctx: ProcCtx): boolean {
 return ctx.courseId === "csp";
}

function formatCspListLiteral(list: readonly (string | number)[]): string {
 return list.map((x) => (typeof x === "number" ? String(x) : `"${x}"`)).join(", ");
}

function idFor(ctx: ProcCtx, i: number, tag: string): string {
 return `proc-${ctx.courseId}-${ctx.unitId}-${i}-${hashString(ctx.seedBase + tag).toString(36)}`;
}

type McOpts = {
 figure?: ExamQuestion["figure"];
 procedural_structure_id?: string;
};

function mc(
 rng: () => number,
 ctx: ProcCtx,
 i: number,
 tag: string,
 stem: string,
 correct: string,
 w1: string,
 w2: string,
 w3: string,
 explanation: string,
 opts?: McOpts,
): ExamQuestion {
 const options = shuffleInPlace(rng, [correct, w1, w2, w3]);
 const base: ExamQuestion = {
 id: idFor(ctx, i, tag),
 question: stem,
 type: "multiple_choice",
 options,
 correct_answer: correct,
 explanation,
 subject: ctx.courseName,
 ...(opts?.figure ? { figure: opts.figure } : {}),
 ...(opts?.procedural_structure_id ? { procedural_structure_id: opts.procedural_structure_id } : {}),
 };
 return base;
}

/* - - - Calculus / precalc / stats - - - */

export function genDerivativePower(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const spread = numericSpreadForCtx(ctx);
 const n = randInt(rng, 2, spread === "tight" ? 9 : spread === "wide" ? 56 : 48);
 const coefMag = randInt(rng, 1, spread === "tight" ? 12 : spread === "wide" ? 90 : 72);
 const sign = pick(rng, [-1, 1] as const);
 const coef = coefMag * sign;
 const d = coef * n;
 const nm1 = n - 1;
 const fx = `${coef}x^${n}`;
 const correct = `${d}x^${nm1}`;
 const stemInQuestion = rng() < 0.44;
 let stem: string;
 let stemIdx: number;
 let structStem: string;
 if (stemInQuestion) {
 stemIdx = randInt(rng, 0, DERIVATIVE_POWER_STEMS.length - 1);
 stem = fillStem(DERIVATIVE_POWER_STEMS[stemIdx], { fx });
 structStem = `e${stemIdx}`;
 } else {
 stemIdx = randInt(rng, 0, DERIVATIVE_AFTER_STIM_STEMS.length - 1);
 stem = DERIVATIVE_AFTER_STIM_STEMS[stemIdx];
 structStem = `s${stemIdx}`;
 }
 const fig: ExamFigure = {
 kind: "stimulus",
 body: stemInQuestion
 ? pick(rng, CALC_FUNCTION_CONTEXT_ONLY)
 : `${pick(rng, CALC_FUNCTION_INTROS)}\n\nf(x) = ${fx}`,
 };
 return mc(
 rng,
 ctx,
 i,
 "d-power",
 stem,
 correct,
 `${coef}x^${nm1}`,
 `${d}x^${n}`,
 `${d + randInt(rng, 1, 4)}x^${nm1}`,
 `Power rule: d/dx[c x^n] = (cn)x^(n-1). Here cn = ${d}.`,
 {
 figure: fig,
 procedural_structure_id: `calc-dpow-${structStem}-n${n}-c${coefMag}`,
 },
 );
}

export function genLimitLinear(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const spread = numericSpreadForCtx(ctx);
 const a = randInt(rng, 1, spread === "tight" ? 14 : spread === "wide" ? 48 : 42);
 const b = randInt(rng, spread === "tight" ? -18 : -60, spread === "tight" ? 18 : spread === "wide" ? 72 : 60);
 const c = randInt(rng, 1, spread === "tight" ? 18 : spread === "wide" ? 62 : 55);
 const lim = a * c + b;
 const explicitStem = rng() < 0.36;
 let stem: string;
 let stemIdx: number;
 let structTag: string;
 if (explicitStem) {
 stemIdx = randInt(rng, 0, LIMIT_LINEAR_STEMS.length - 1);
 stem = fillStem(LIMIT_LINEAR_STEMS[stemIdx], { a, b, c });
 structTag = `L${stemIdx}`;
 } else {
 stemIdx = randInt(rng, 0, LIMIT_AFTER_TABLE_STEMS.length - 1);
 stem = LIMIT_AFTER_TABLE_STEMS[stemIdx];
 structTag = `s${stemIdx}`;
 }
 const gx = b >= 0 ? `${a}x + ${b}` : `${a}x - ${-b}`;
 const fig: ExamFigure = {
 kind: "table",
 title: pick(rng, [
 "Table 1. Linear function g(x) = ax + b",
 "Table 1. Parameters for g(x) = ax + b",
 "Table 1. Coefficients and limit target for linear g",
 ]),
 headers: ["a", "b", "c (target)", "g(x)"],
 rows: [[String(a), String(b), String(c), gx]],
 };
 return mc(
 rng,
 ctx,
 i,
 "lim-lin",
 stem,
 `${lim}`,
 `${lim + randInt(rng, 2, 9)}`,
 `${lim - randInt(rng, 2, 9)}`,
 `${a + b}`,
 `Substitute x = ${c} into the continuous linear function.`,
 {
 figure: fig,
 procedural_structure_id: `calc-lim-${structTag}-a${a}-b${b}-c${c}`,
 },
 );
}

export function genIntegralPower(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const spread = numericSpreadForCtx(ctx);
 const n = randInt(rng, 2, spread === "tight" ? 7 : spread === "wide" ? 16 : 14);
 const coef = randInt(rng, 1, spread === "tight" ? 12 : spread === "wide" ? 34 : 28);
 const exp = n + 1;
 const num = coef;
 const correct = `(${num}/${exp})x^${exp} + C`;
 const stemInQuestion = rng() < 0.4;
 let stem: string;
 let stemIdx: number;
 let structStem: string;
 if (stemInQuestion) {
 stemIdx = randInt(rng, 0, INTEGRAL_POWER_STEMS.length - 1);
 stem = fillStem(INTEGRAL_POWER_STEMS[stemIdx], { coef, n });
 structStem = `e${stemIdx}`;
 } else {
 stemIdx = randInt(rng, 0, INTEGRAL_AFTER_STIM_STEMS.length - 1);
 stem = INTEGRAL_AFTER_STIM_STEMS[stemIdx];
 structStem = `s${stemIdx}`;
 }
 const fig: ExamFigure = {
 kind: "stimulus",
 body: stemInQuestion
 ? pick(rng, CALC_ANTIDERIV_CONTEXT_ONLY)
 : `${pick(rng, CALC_FUNCTION_INTROS)}\n\nf(x) = ${coef}x^${n}`,
 };
 return mc(
 rng,
 ctx,
 i,
 "int-power",
 stem,
 correct,
 `${coef}x^${exp} + C`,
 `(${num}/${n})x^${n} + C`,
 `${coef + randInt(rng, 1, 5)}x^${exp} + C`,
 `Increase exponent by 1 and divide by the new exponent.`,
 {
 figure: fig,
 procedural_structure_id: `calc-int-${structStem}-n${n}-k${coef}`,
 },
 );
}

export function genCompositionValue(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const spread = numericSpreadForCtx(ctx);
 const a = randInt(rng, 1, spread === "tight" ? 9 : spread === "wide" ? 22 : 18);
 const b = randInt(rng, 1, spread === "tight" ? 14 : spread === "wide" ? 42 : 35);
 const x0 = randInt(rng, 1, spread === "tight" ? 8 : spread === "wide" ? 28 : 22);
 const inner = a * x0 + b;
 const outerCoef = randInt(rng, 2, spread === "tight" ? 12 : spread === "wide" ? 28 : 24);
 const val = outerCoef * inner;
 const gb = b >= 0 ? `${a}x + ${b}` : `${a}x - ${-b}`;
 const useFullCompositionStem = b >= 0 && rng() < 0.42;
 let stem: string;
 let stemIdx: number;
 let structStem: string;
 if (useFullCompositionStem) {
 stemIdx = randInt(rng, 0, COMPOSITION_STEMS.length - 1);
 stem = fillStem(COMPOSITION_STEMS[stemIdx], { oc: String(outerCoef), a: String(a), b: String(b), x0: String(x0) });
 structStem = `e${stemIdx}`;
 } else {
 stemIdx = randInt(rng, 0, COMPOSITION_TABLE_STEMS.length - 1);
 stem = fillStem(COMPOSITION_TABLE_STEMS[stemIdx], { x0 });
 structStem = `s${stemIdx}`;
 }
 const fig: ExamFigure = {
 kind: "table",
 title: pick(rng, ["Table 1. Function definitions", "Table 1. Rules for f and g", "Table 1. Composition setup"]),
 headers: ["Name", "Rule"],
 rows: [
 ["f(x)", `${outerCoef}x`],
 ["g(x)", gb],
 ["x0", String(x0)],
 ],
 };
 return mc(
 rng,
 ctx,
 i,
 "comp",
 stem,
 `${val}`,
 `${outerCoef + inner + randInt(rng, 1, 6)}`,
 `${a * outerCoef + randInt(rng, 0, 4)}`,
 `${inner + randInt(rng, 1, 7)}`,
 `First g(${x0}) = ${inner}, then f(${inner}) = ${outerCoef} x ${inner}.`,
 {
 figure: fig,
 procedural_structure_id: `calc-comp-${structStem}-x${x0}-o${outerCoef}`,
 },
 );
}

const SLOPE_TWO_POINT_STEMS = [
 "The table lists two points on a nonvertical line. The slope of the line is",
 "For the line through the two points in the table, the slope m equals",
 "Using (x1, y1) and (x2, y2) from the table, the slope (rise over run) is",
 "Compute the slope of the line passing through the two given points.",
 "The constant rate of change between the two tabled points equals",
] as const;

/** Average rate of change / slope from two integer points (distinct x). */
export function genLinearSlopeTwoPoints(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const spread = numericSpreadForCtx(ctx);
 const x1 = randInt(rng, spread === "tight" ? 0 : -4, spread === "tight" ? 8 : 12);
 const run = randInt(rng, 2, spread === "tight" ? 7 : 10);
 const x2 = x1 + run;
 let mTrue = randInt(rng, spread === "tight" ? -5 : -8, spread === "tight" ? 5 : 8);
 if (mTrue === 0) mTrue = pick(rng, [-4, -3, -2, 2, 3, 4, 5, 6] as const);
 const y1 = randInt(rng, spread === "tight" ? -12 : -28, spread === "tight" ? 18 : 40);
 const y2 = y1 + mTrue * run;
 const stem = pick(rng, SLOPE_TWO_POINT_STEMS);
 const fig: ExamFigure = {
 kind: "table",
 title: pick(rng, ["Table 1. Two points on a line", "Table 1. Coordinate pairs", "Table 1. (x, y) values"]),
 headers: ["Point", "x", "y"],
 rows: [
 ["P", String(x1), String(y1)],
 ["Q", String(x2), String(y2)],
 ],
 };
 const wrongRise = mTrue + pick(rng, [-1, 1] as const);
 return mc(
 rng,
 ctx,
 i,
 "slope-2pt",
 stem,
 `${mTrue}`,
 `${wrongRise}`,
 `${y2 - y1}`,
 `${run}`,
 `m = (y2 - y1)/(x2 - x1) = (${y2} - ${y1})/(${x2} - ${x1}) = ${mTrue}.`,
 {
 figure: fig,
 procedural_structure_id: `calc-slope2-m${mTrue}-r${run}`,
 },
 );
}

const INTEGER_POWER_STEMS = [
 "The value of the expression above is",
 "Evaluating the power yields",
 "Which value equals the expression shown?",
 "The expression simplifies to",
] as const;

/** Small integer powers for symbolic / mental evaluation (no calculator section friendly). */
export function genSmallIntegerPowerEval(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const base = pick(rng, [2, 3, 4, 5] as const);
 const exp = randInt(rng, 2, base === 2 ? 5 : base === 3 ? 4 : 3);
 const correctN = base ** exp;
 const stem = pick(rng, INTEGER_POWER_STEMS);
 const fig: ExamFigure = {
 kind: "stimulus",
 body: pick(rng, [
 `Evaluate without a calculator:\n\n${base}^${exp}`,
 `Consider the numerical expression ${base}^${exp}.`,
 `Compute ${base}^${exp}.`,
 ]),
 };
 const offByOne = base ** (exp - 1);
 const wrongA = exp > 2 ? base ** (exp - 2) : base + 1;
 return mc(
 rng,
 ctx,
 i,
 "pow-int",
 stem,
 `${correctN}`,
 `${offByOne}`,
 `${base * exp}`,
 `${wrongA}`,
 `Repeated multiplication: ${base}^${exp} = ${correctN}.`,
 {
 figure: fig,
 procedural_structure_id: `calc-powint-b${base}-e${exp}`,
 },
 );
}

/** Removable discontinuity: lim (x^2-a^2)/(x-a) = 2a (AB Unit 1). */
export function genRationalLimitRemovable(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const a = randInt(rng, 2, 11);
 const a2 = a * a;
 const lim = 2 * a;
 const stem = pick(rng, [
 `The limit as x approaches ${a} of (x^2 - ${a2})/(x - ${a}) is`,
 `Evaluate lim(x → ${a}) (x^2 - ${a2})/(x - ${a}).`,
 `Find the value of lim(x → ${a}) [(x^2 - ${a2})/(x - ${a})].`,
 ]);
 return mc(
 rng,
 ctx,
 i,
 "lim-rat",
 stem,
 `${lim}`,
 `${a}`,
 `${a2}`,
 `${lim + pick(rng, [1, -1] as const)}`,
 `Factor x^2 - ${a2} = (x - ${a})(x + ${a}), cancel (x - ${a}), then substitute to get ${a} + ${a} = ${lim}.`,
 { procedural_structure_id: `calc-limrat-a${a}` },
 );
}

/** Continuity / discontinuity type (conceptual, Unit 1). */
export function genContinuityConceptMcq(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 type Row = { stem: string; c: string; w: [string, string, string]; ex: string };
 const rows: Row[] = [
 {
 stem: "A function g has a finite limit as x approaches c, but g(c) is defined to a different number. At x = c, g has",
 c: "a removable discontinuity",
 w: ["a jump discontinuity", "a vertical asymptote", "no discontinuity"],
 ex: "The limit exists but does not match the defined value — the gap can be 'removed' by redefining g(c).",
 },
 {
 stem: "Left-hand and right-hand limits at x = c exist but are unequal. This describes",
 c: "a jump discontinuity",
 w: ["a removable discontinuity", "continuity at c", "a horizontal asymptote"],
 ex: "Unequal one-sided limits produce a jump; the limit overall does not exist.",
 },
 {
 stem: "For continuity at x = c, which condition is NOT required?",
 c: "f'(c) exists",
 w: ["f(c) is defined", "lim(x→c) f(x) exists", "lim(x→c) f(x) = f(c)"],
 ex: "Continuity does not require differentiability; corners can be continuous but not differentiable.",
 },
 ];
 const row = pick(rng, rows);
 return mc(rng, ctx, i, "cont", row.stem, row.c, row.w[0], row.w[1], row.w[2], row.ex, {
 procedural_structure_id: `calc-cont-${hashString(row.stem).toString(36).slice(0, 6)}`,
 });
}

/** IVT — sign change implies a zero in (a,b) (Unit 1). */
export function genIvTSignChange(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const a = randInt(rng, 0, 3);
 const b = a + randInt(rng, 3, 8);
 const fa = randInt(rng, -12, -1);
 const fb = randInt(rng, 1, 14);
 const stem = pick(rng, [
 `Let f be continuous on the closed interval [${a}, ${b}]. Suppose f(${a}) = ${fa} and f(${b}) = ${fb}. Which statement follows from the Intermediate Value Theorem?`,
 `Function f is continuous on [${a}, ${b}] with f(${a}) = ${fa} and f(${b}) = ${fb}. Which must be true by the IVT?`,
 ]);
 return mc(
 rng,
 ctx,
 i,
 "ivt",
 stem,
 "There exists at least one c in the open interval (" + a + ", " + b + ") such that f(c) = 0.",
 "f has a local maximum in (" + a + ", " + b + ").",
 "f'(c) = 0 for some c in (" + a + ", " + b + ").",
 "f is increasing on all of [" + a + ", " + b + "].",
 `Opposite signs at endpoints and continuity imply some c with f(c) = 0 between ${a} and ${b}.`,
 { procedural_structure_id: `calc-ivt-a${a}-b${b}` },
 );
}

/** Average velocity for s(t)=t^2+k on [t1,t2] equals t1+t2 (Unit 2 / 4). */
export function genAvgVelocitySquaredPosition(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const k = randInt(rng, 1, 12);
 const t1 = randInt(rng, 0, 4);
 const t2 = t1 + randInt(rng, 2, 6);
 const avg = t1 + t2;
 const s1 = t1 * t1 + k;
 const s2 = t2 * t2 + k;
 const stem = pick(rng, [
 `A particle moves along a line with position s(t) = t^2 + ${k} (t in seconds). The average velocity over [${t1}, ${t2}] is`,
 `For s(t) = t^2 + ${k}, the average rate of change of s on [${t1}, ${t2}] equals`,
 ]);
 return mc(
 rng,
 ctx,
 i,
 "avgv",
 stem,
 `${avg}`,
 `${(s2 - s1) / (t2 - t1) + 1}`,
 `${t2 - t1}`,
 `${s2 - s1}`,
 `Average velocity = (s(${t2}) - s(${t1}))/(${t2} - ${t1}) = (${t2}^2 - ${t1}^2)/(${t2} - ${t1}) = ${t2} + ${t1} = ${avg}.`,
 { procedural_structure_id: `calc-avgv-k${k}-t${t1}-${t2}` },
 );
}

/** Instantaneous velocity from polynomial position (power rule, Unit 4). */
export function genMotionVelocityPolynomial(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const a = randInt(rng, 1, 2);
 const b = randInt(rng, 0, 3);
 const c = randInt(rng, -1, 4);
 const t0 = randInt(rng, 1, 4);
 const vAt = 3 * a * t0 * t0 + 2 * b * t0 + c;
 const stem = pick(rng, [
 `A particle's position is s(t) = ${a}t^3 + ${b}t^2 + ${c}t (SI units). Its velocity v(t) = s'(t) at t = ${t0} is`,
 `For s(t) = ${a}t^3 + ${b}t^2 + ${c}t, find v(${t0}) where v = ds/dt.`,
 ]);
 return mc(
 rng,
 ctx,
 i,
 "mot-v",
 stem,
 `${vAt}`,
 `${vAt + pick(rng, [2, -2, 3] as const)}`,
 `${a + b + c}`,
 `${3 * a + 2 * b + c}`,
 `v(t) = ${3 * a}t^2 + ${2 * b}t + ${c}; substitute t = ${t0}.`,
 { procedural_structure_id: `calc-motv-a${a}-b${b}-t${t0}` },
 );
}

/** FTC Part 1: d/dx ∫_a^x f(t) dt = f(x) at a point (Unit 6). */
export function genFtcPartOneValue(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const a = randInt(rng, 0, 2);
 const c = randInt(rng, 1, 9);
 const x0 = randInt(rng, 3, 11);
 const fAt = x0 * x0 + c;
 const stem = pick(rng, [
 `Let F(x) = ∫_${a}^{x} (t^2 + ${c}) dt. The value of F'(${x0}) is`,
 `If F(x) = ∫_${a}^{x} (t^2 + ${c}) dt, then F'(${x0}) equals`,
 ]);
 return mc(
 rng,
 ctx,
 i,
 "ftc1",
 stem,
 `${fAt}`,
 `${2 * x0}`,
 `${x0 + c}`,
 `${c}`,
 `By FTC Part 1, F'(x) = x^2 + ${c}, so F'(${x0}) = ${x0}^2 + ${c} = ${fAt}.`,
 { procedural_structure_id: `calc-ftc1-c${c}-x${x0}` },
 );
}

/** End behavior of rational function by degree comparison (Unit 1). */
export function genHorizontalAsymptoteRationalDegrees(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const stem = pick(rng, [
 "Let f(x) = P(x)/Q(x) where P and Q are nonzero polynomials. If deg(P) = 2 and deg(Q) = 4, then lim(x → ±∞) f(x) equals",
 "Suppose f(x) is a rational function with numerator degree 2 and denominator degree 4. As x → ±∞, f(x) approaches",
 ]);
 return mc(
 rng,
 ctx,
 i,
 "hasym",
 stem,
 "0",
 "1",
 "∞",
 "the ratio of leading coefficients only (nonzero constant)",
 `When the denominator has greater degree, the limit at ±∞ is 0.`,
 { procedural_structure_id: "calc-hasym-deg" },
 );
}

/** Recognize separable form (Unit 7). */
export function genSeparableFormRecognize(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const stem = pick(rng, [
 "Which differential equation is separable (can be written with all y terms with dy and all x terms with dx)?",
 "Which of the following is in separable form dy/dx = g(x) h(y)?",
 ]);
 return mc(
 rng,
 ctx,
 i,
 "sep",
 stem,
 "dy/dx = x e^y",
 "dy/dx = x + y",
 "dy/dx = sin(x + y)",
 "dy/dx = y/x + ln(xy)",
 `Separate as e^(-y) dy = x dx; the others mix x and y in a way that is not directly separable.`,
 { procedural_structure_id: "calc-sep-form" },
 );
}

/** Volume of revolution setup — disk method (conceptual, Unit 8). */
export function genVolumeDiskIntegralSetup(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const stem = pick(rng, [
 "The region bounded by y = f(x) and the x-axis on [a, b] is revolved about the x-axis. Which integral gives the volume (disk method)?",
 "Volumes by disks about the x-axis use which form?",
 ]);
 return mc(
 rng,
 ctx,
 i,
 "disk",
 stem,
 "π ∫[a to b] (f(x))^2 dx",
 "2π ∫[a to b] f(x) dx",
 "π ∫[a to b] f(x) dx",
 "∫[a to b] π f(x) dx",
 `Disk radius is |f(x)|; cross-sectional area is π (f(x))^2; integrate along x.`,
 { procedural_structure_id: "calc-disk-setup" },
 );
}

/* - - - Calc BC-only procedural items (units 9–11) - - - */

export function genParametricDyDx(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const a = randInt(rng, 1, 4);
 const b = randInt(rng, 1, 5);
 const t0 = randInt(rng, 1, 4);
 const dxdt = 2 * a * t0;
 const dydt = 3 * b * t0 * t0;
 const val = roundN(dydt / dxdt, 3);
 const stem = pick(rng, [
 "For a parametric curve defined by x(t) and y(t) as shown, dy/dx at the stated t-value equals",
 "Using dy/dx = (dy/dt)/(dx/dt), the slope at the given parameter value is",
 "For the parametric equations in the stimulus, compute dy/dx at the indicated t-value.",
 ]);
 const fig: ExamFigure = {
 kind: "stimulus",
 body: `Parametric curve:\n\nx(t) = ${a}t^2\ny(t) = ${b}t^3\n\nEvaluate at t = ${t0}.`,
 };
 return mc(
 rng,
 ctx,
 i,
 "bc-param-dydx",
 stem,
 `${val}`,
 `${roundN(dxdt / dydt, 3)}`,
 `${roundN((dydt + b) / dxdt, 3)}`,
 `${roundN(dydt / (dxdt + a), 3)}`,
 `Compute dx/dt = ${2 * a}t and dy/dt = ${3 * b}t^2, then dy/dx = (dy/dt)/(dx/dt).`,
 { figure: fig, procedural_structure_id: `bc-param-a${a}-b${b}-t${t0}` },
 );
}

export function genPolarAreaSetup(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const stem = pick(rng, [
 "For a polar curve r = f(θ) on [α, β], the area of the region is given by",
 "Which integral represents the area of a region in polar coordinates for r = f(θ)?",
 "Polar area for r = f(θ) between θ = α and θ = β is computed by",
 ]);
 return mc(
 rng,
 ctx,
 i,
 "bc-polar-area",
 stem,
 "(1/2) ∫[α to β] (f(θ))^2 dθ",
 "∫[α to β] f(θ) dθ",
 "π ∫[α to β] (f(θ))^2 dθ",
 "(1/2) ∫[α to β] f(θ) dθ",
 `Polar area uses A = (1/2) ∫ r^2 dθ.`,
 { procedural_structure_id: "bc-polar-area-setup" },
 );
}

export function genGeometricSeriesConcept(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const r = pick(rng, ["1/2", "-1/3", "2/3", "-3/4"] as const);
 const stem = pick(rng, [
 "An infinite geometric series with common ratio r converges if",
 "For an infinite geometric series, convergence occurs exactly when",
 "Which condition on the common ratio ensures an infinite geometric series converges?",
 ]);
 return mc(
 rng,
 ctx,
 i,
 "bc-geom",
 stem,
 "|r| < 1",
 "r > 1",
 "|r| > 1",
 "r = 1 always",
 `Infinite geometric series converge precisely when the magnitude of the common ratio is less than 1 (example r = ${r}).`,
 { procedural_structure_id: `bc-geom-r${hashString(r).toString(36)}` },
 );
}

export function genDivergenceTest(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const stem = pick(rng, [
 "If lim(n→∞) a_n ≠ 0 for a series Σ a_n, then the series",
 "The divergence (nth-term) test says that if the limit of terms is not zero, the series",
 "For Σ a_n, if the terms do not approach 0, then the series",
 ]);
 return mc(
 rng,
 ctx,
 i,
 "bc-div",
 stem,
 "diverges",
 "converges",
 "is geometric",
 "must be alternating",
 `A necessary condition for convergence is lim a_n = 0; if not, the series diverges.`,
 { procedural_structure_id: "bc-div-test" },
 );
}

export function genPSeriesClassification(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const p = pick(rng, [0.5, 1, 1.5, 2, 3] as const);
 const stem = `Consider the p-series Σ 1/n^${p}. This series`;
 const correct = p > 1 ? "converges" : "diverges";
 return mc(
 rng,
 ctx,
 i,
 "bc-p",
 stem,
 correct,
 correct === "converges" ? "diverges" : "converges",
 "converges by the divergence test",
 "cannot be classified without computing partial sums",
 `A p-series Σ 1/n^p converges iff p > 1. Here p = ${p}.`,
 { procedural_structure_id: `bc-p-${String(p).replace(".", "_")}` },
 );
}

export function genRatioTestConcept(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const stem = pick(rng, [
 "The ratio test guarantees convergence of Σ a_n if",
 "Which condition implies absolute convergence by the ratio test?",
 "By the ratio test, a series converges absolutely when the limit L of |a_{n+1}/a_n| satisfies",
 ]);
 return mc(
 rng,
 ctx,
 i,
 "bc-ratio",
 stem,
 "L < 1",
 "L = 1",
 "L > 1",
 "L is negative",
 `Ratio test: if L < 1, the series converges absolutely; if L > 1, it diverges; if L = 1, inconclusive.`,
 { procedural_structure_id: "bc-ratio-concept" },
 );
}

export function genImproperIntegralConcept(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const stem = pick(rng, [
 "An improper integral is an integral that",
 "Which description best matches an improper integral?",
 "An integral is improper when",
 ]);
 return mc(
 rng,
 ctx,
 i,
 "bc-imp-def",
 stem,
 "has an infinite limit of integration or an unbounded integrand on the interval",
 "cannot be evaluated with antiderivatives",
 "always diverges",
 "is always a Riemann sum",
 `Improper integrals involve infinite bounds or vertical asymptotes (unbounded integrand).`,
 { procedural_structure_id: "bc-imp-def" },
 );
}

export function genTrapezoidalRuleSetup(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const stem = pick(rng, [
 "For approximating ∫_a^b f(x) dx with n equal subintervals, the trapezoidal rule uses",
 "Which expression matches the trapezoidal rule approximation for an integral on [a, b]?",
 "The trapezoidal rule approximation is given by",
 ]);
 return mc(
 rng,
 ctx,
 i,
 "bc-trap",
 stem,
 "(Δx/2)[f(x0) + 2f(x1) + 2f(x2) + ... + 2f(x_{n-1}) + f(x_n)]",
 "Δx[f(x0) + f(x1) + ... + f(x_n)]",
 "(Δx/2)[f(x0) + f(x1) + ... + f(x_n)]",
 "Δx[f(x1) + f(x2) + ... + f(x_{n-1})]",
 `Trapezoidal rule averages endpoint heights per subinterval, yielding the (Δx/2) weighted sum with interior terms doubled.`,
 { procedural_structure_id: "bc-trap-setup" },
 );
}

const TRIG_ROWS: { stem: string; c: string; w: [string, string, string]; ex: string }[] = [
 { stem: "sin(0) equals", c: "0", w: ["1", "-1", "1/2"], ex: "sin(0) = 0." },
 { stem: "cos(0) equals", c: "1", w: ["0", "-1", "1/2"], ex: "cos(0) = 1." },
 { stem: "sin(π/2) equals", c: "1", w: ["0", "-1", "1/2"], ex: "sin(π/2) = 1." },
 { stem: "cos(π/2) equals", c: "0", w: ["1", "-1", "1/2"], ex: "cos(π/2) = 0." },
 { stem: "sin(π) equals", c: "0", w: ["1", "-1", "1/2"], ex: "sin(π) = 0." },
 { stem: "cos(π) equals", c: "-1", w: ["0", "1", "1/2"], ex: "cos(π) = -1." },
 { stem: "sin(3π/2) equals", c: "-1", w: ["0", "1", "1/2"], ex: "sin(3π/2) = -1." },
 { stem: "cos(3π/2) equals", c: "0", w: ["1", "-1", "1/2"], ex: "cos(3π/2) = 0." },
 { stem: "sin(π/6) equals", c: "1/2", w: ["√(3)/2", "√(2)/2", "1"], ex: "sin(π/6) = 1/2." },
 { stem: "cos(π/6) equals", c: "√(3)/2", w: ["1/2", "√(2)/2", "1"], ex: "cos(π/6) = √(3)/2." },
 { stem: "sin(π/4) equals", c: "√(2)/2", w: ["1/2", "√(3)/2", "1"], ex: "sin(π/4) = √(2)/2." },
 { stem: "cos(π/4) equals", c: "√(2)/2", w: ["1/2", "√(3)/2", "1"], ex: "cos(π/4) = √(2)/2." },
 { stem: "sin(π/3) equals", c: "√(3)/2", w: ["1/2", "√(2)/2", "1"], ex: "sin(π/3) = √(3)/2." },
 { stem: "cos(π/3) equals", c: "1/2", w: ["√(3)/2", "√(2)/2", "1"], ex: "cos(π/3) = 1/2." },
 { stem: "tan(0) equals", c: "0", w: ["1", "undefined", "1/2"], ex: "tan(0) = 0." },
 { stem: "tan(π/4) equals", c: "1", w: ["0", "√(2)", "1/2"], ex: "tan(π/4) = 1." },
 { stem: "tan(π/3) equals", c: "√(3)", w: ["1", "1/√(3)", "2"], ex: "tan(π/3) = √(3)." },
 { stem: "sin(2π) equals", c: "0", w: ["1", "-1", "1/2"], ex: "sin(2π) = 0." },
 { stem: "cos(2π) equals", c: "1", w: ["0", "-1", "1/2"], ex: "cos(2π) = 1." },
 { stem: "sin(-π/2) equals", c: "-1", w: ["0", "1", "1/2"], ex: "sin(-π/2) = -1." },
 { stem: "cos(-π) equals", c: "-1", w: ["0", "1", "1/2"], ex: "cos(-π) = -1." },
];

const TRIG_REFERENCE_FIGURE: ExamFigure = {
 kind: "table",
 title: "Exhibit: exact trigonometric values (selected angles, radians)",
 headers: ["θ", "sin θ", "cos θ", "tan θ"],
 rows: [
 ["0", "0", "1", "0"],
 ["π/6", "1/2", "√(3)/2", "1/√(3)"],
 ["π/4", "√(2)/2", "√(2)/2", "1"],
 ["π/3", "√(3)/2", "1/2", "√(3)"],
 ["π/2", "1", "0", "undefined"],
 ],
};

export function genTrigSpecial(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const row = pick(rng, TRIG_ROWS);
 return mc(rng, ctx, i, "trig", row.stem, row.c, row.w[0], row.w[1], row.w[2], row.ex, {
 figure: TRIG_REFERENCE_FIGURE,
 });
}

export function genMeanSimple(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const spread = numericSpreadForCtx(ctx);
 const lo = spread === "tight" ? 4 : spread === "wide" ? 20 : 12;
 const hi = spread === "tight" ? 48 : spread === "wide" ? 998 : 998;
 const a = randInt(rng, lo, hi);
 const b = randInt(rng, lo, hi);
 const c = randInt(rng, lo, hi);
 const mean = roundN((a + b + c) / 3, 2);
 const stemIdx = randInt(rng, 0, MEAN_AFTER_TABLE_STEMS.length - 1);
 const stem = MEAN_AFTER_TABLE_STEMS[stemIdx];
 const fig: ExamFigure = {
 kind: "table",
 title: "Table 1. Sample values",
 headers: ["Observation", "Value"],
 rows: [
 ["1", String(a)],
 ["2", String(b)],
 ["3", String(c)],
 ],
 };
 return mc(
 rng,
 ctx,
 i,
 "mean",
 stem,
 `${mean}`,
 `${a + b + c}`,
 `${roundN((a + b) / 2, 2)}`,
 `${roundN(mean + randInt(rng, 3, 40), 2)}`,
 `Add the values and divide by 3.`,
 {
 figure: fig,
 procedural_structure_id: `stats-mean-s${stemIdx}`,
 },
 );
}

export function genZScoreConcept(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const si = randInt(rng, 0, ZSCORE_TABLE_STEMS.length - 1);
 const stem = ZSCORE_TABLE_STEMS[si];
 const fig: ExamFigure = {
 kind: "table",
 title: "Table 1. Notation",
 headers: ["Symbol", "Meaning"],
 rows: [
 ["x", "observation"],
 ["μ (mu)", "mean"],
 ["σ (sigma)", "standard deviation (σ > 0)"],
 ],
 };
 return mc(
 rng,
 ctx,
 i,
 "z",
 stem,
 "(x - mu) / sigma",
 "(x + mu) / sigma",
 "(x - mu) | sigma",
 "mu / sigma",
 `Standardize by subtracting the mean and dividing by the standard deviation.`,
 {
 figure: fig,
 procedural_structure_id: `stats-z-s${si}`,
 },
 );
}

const SNACK_BAR_LABELS = [
 "Granola",
 "Yogurt",
 "Chips",
 "Fruit",
 "Crackers",
 "Nuts",
 "Apples",
 "Berries",
 "Cheese",
 "Pretzels",
 "Popcorn",
 "Carrots",
 "Hummus",
 "Muffins",
 "Smoothies",
 "Jerky",
 "Rice cakes",
 "Dark chocolate",
 "Trail mix",
 "Pita",
 "Salsa",
 "Cookies",
 "Bagels",
 "Wraps",
 "Soup",
 "Salad",
] as const;

export function genStatsBarChartMode(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const labels = shuffleInPlace(rng, [...SNACK_BAR_LABELS]).slice(0, 4);
 const vals = distinctRandInts(rng, 4, 6, 220);
 const bars = labels.map((label, idx) => ({ label, value: vals[idx] }));
 let maxI = 0;
 for (let k = 1; k < 4; k++) if (vals[k] > vals[maxI]) maxI = k;
 const correct = labels[maxI];
 const wrong = labels.filter((_, j) => j !== maxI);
 const stem = pick(rng, [
 "The bar chart shows counts by favorite snack in a class. Which snack was chosen most often?",
 "According to the bar chart of favorite snacks (counts in a sample), which category is the mode?",
 "Which label matches the tallest bar (greatest count) on the chart?",
 "For these snack counts, which category appears most frequently in the sample?",
 ]);
 return mc(
 rng,
 ctx,
 i,
 "st-bar",
 stem,
 correct,
 wrong[0],
 wrong[1],
 wrong[2],
 `The tallest bar corresponds to the mode for this categorical variable.`,
 {
 figure: {
 kind: "bar_chart",
 title: pick(rng, [
 "Favorite snack (counts in a sample)",
 "Snack preference counts",
 "Class snack poll (n shown on axis)",
 ]),
 yLabel: pick(rng, ["Number of students", "Count", "Responses"]),
 bars,
 },
 },
 );
}

const EXAM_SERIES_LABELS = ["Test A", "Test B", "Test C", "Test D", "Test E", "Quiz 1", "Quiz 2", "Midterm", "Final"] as const;

export function genStatsExamLineTrend(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const xlabs = shuffleInPlace(rng, [...EXAM_SERIES_LABELS]).slice(0, 4);
 const ys = distinctRandInts(rng, 4, 55, 100);
 const points = xlabs.map((x, idx) => ({ x, y: ys[idx] }));
 let maxI = 0;
 for (let k = 1; k < 4; k++) if (ys[k] > ys[maxI]) maxI = k;
 const correct = xlabs[maxI];
 const wrong = xlabs.filter((_, j) => j !== maxI);
 const stem = pick(rng, [
 "The line chart shows mean exam score over four tests. Which had the highest mean score?",
 "According to the line chart, at which labeled point is the mean score greatest?",
 "Which test label corresponds to the peak mean score on the chart?",
 ]);
 return mc(
 rng,
 ctx,
 i,
 "st-line",
 stem,
 correct,
 wrong[0],
 wrong[1],
 wrong[2],
 `Read the y-values at each point; ${correct} has the maximum.`,
 {
 figure: {
 kind: "line_chart",
 title: pick(rng, ["Mean exam score over four tests", "Mean score by assessment", "Class average by test"]),
 yLabel: pick(rng, ["Score", "Mean score", "Percent"]),
 points,
 },
 },
 );
}

/* - - - Computer science - - - */

export function genBigO(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const body = isApCsp(ctx)
 ? "An AP CSP module compares algorithms that reorder n distinct values using pairwise comparisons. Worst-case efficiency is described with big-O notation in n, following the Course and Exam Description."
 : "A Java class studies comparison-based sorting algorithms that reorder n distinct items using pairwise comparisons. Worst-case running time is expressed using big-O notation in n.";
 const fig: ExamFigure = {
 kind: "stimulus",
 body,
 };
 return mc(
 rng,
 ctx,
 i,
 "big-o",
 "Which best describes the worst-case time complexity of comparison-based sorting of n items?",
 "O(n log n)",
 "O(n)",
 "O(n^2) for every algorithm",
 "O(1)",
 `Optimal comparison sorts are Theta(n log n) worst case (e.g., mergesort).`,
 {
 figure: fig,
 procedural_structure_id: isApCsp(ctx) ? "cs-big-o-csp" : "cs-big-o-java",
 },
 );
}

export function genLoopCount(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const n = randInt(rng, 5, 20);
 const total = n * (n + 1) / 2;
 const body = isApCsp(ctx)
 ? `The procedure below follows AP Computer Science Principles pseudocode conventions (assignment uses ←, lists index from 1 unless stated otherwise).\n\nn ← ${n}\nsum ← 0\nFOR i FROM 1 TO n\n{\n   sum ← sum + i\n}`
 : `Integer variable n is ${n}. The Java fragment initializes sum to 0 and accumulates a series:\n\nfor (int i = 1; i <= n; i++) {\n  sum += i;\n}`;
 const fig: ExamFigure = {
 kind: "stimulus",
 body,
 };
 return mc(
 rng,
 ctx,
 i,
 "loop",
 "After the loop terminates, sum equals",
 `${total}`,
 `${n * n}`,
 `${n + 1}`,
 `${n}`,
 `This sums 1 + 2 + ... + ${n} = ${n}(${n}+1)/2 = ${total}.`,
 {
 figure: fig,
 procedural_structure_id: isApCsp(ctx) ? `cs-loop-csp-n${n}` : `cs-loop-java-n${n}`,
 },
 );
}

export function genBooleanExpr(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 if (isApCsp(ctx)) {
 type BoolPat = {
 id: string;
 expr: string;
 correct: string;
 w: [string, string, string];
 explanation: string;
 };
 const patterns: BoolPat[] = [
 {
 id: "andff",
 expr: "true AND false",
 correct: "false",
 w: ["true", "INVALID", "neither true nor false"],
 explanation: "AND is true only when both operands are true.",
 },
 {
 id: "ortt",
 expr: "true OR false",
 correct: "true",
 w: ["false", "INVALID", "neither true nor false"],
 explanation: "OR is true when at least one operand is true.",
 },
 {
 id: "notf",
 expr: "NOT false",
 correct: "true",
 w: ["false", "INVALID", "neither true nor false"],
 explanation: "NOT inverts the Boolean value.",
 },
 {
 id: "notand",
 expr: "NOT (true AND false)",
 correct: "true",
 w: ["false", "INVALID", "neither true nor false"],
 explanation: "true AND false is false; NOT false is true.",
 },
 ];
 const p = pick(rng, patterns);
 const fig: ExamFigure = {
 kind: "stimulus",
 body: `Boolean values and operators follow the AP CSP exam reference (NOT, AND, OR).\n\n${p.expr}`,
 };
 return mc(
 rng,
 ctx,
 i,
 `bool-${p.id}`,
 "The expression evaluates to",
 p.correct,
 p.w[0],
 p.w[1],
 p.w[2],
 p.explanation,
 { figure: fig, procedural_structure_id: `cs-bool-csp-${p.id}` },
 );
 }
 const fig: ExamFigure = {
 kind: "stimulus",
 body: "Consider the following Java boolean expression using literals:\n\n  true && false",
 };
 return mc(
 rng,
 ctx,
 i,
 "bool",
 "The expression evaluates to",
 "false",
 "true",
 "null",
 "error",
 `Logical AND requires both operands true; primitive booleans are not null.`,
 { figure: fig, procedural_structure_id: "cs-bool-java" },
 );
}

/** List indexing practice in AP CSP pseudocode (1-based, per CED unless a problem states otherwise). */
export function genCspListIndex(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const rows: { list: readonly (string | number)[]; idx: number }[] = [
 { list: [5, 10, 15], idx: 2 },
 { list: [5, 10, 15], idx: 1 },
 { list: ["sensor", "motor", "display"], idx: 3 },
 { list: [2, 4, 6, 8], idx: 4 },
 { list: ["low", "medium", "high"], idx: 2 },
 ];
 const p = pick(rng, rows);
 const correct = String(p.list[p.idx - 1]);
 const wrongPool = p.list.map(String).filter((s) => s !== correct);
 const wrongCandidates = [...wrongPool, "INVALID", "0", "(no output)"];
 const [w1, w2, w3] = pickThreeDistinct(rng, wrongCandidates, correct);
 const inner = formatCspListLiteral(p.list);
 const fig: ExamFigure = {
 kind: "stimulus",
 body: `Unless otherwise indicated, list indexes begin at 1 (AP CSP pseudocode reference).\n\naList ← [ ${inner} ]\nn ← ${p.idx}\nDISPLAY(aList[n])`,
 };
 return mc(
 rng,
 ctx,
 i,
 "csp-idx",
 "After the segment runs, the program displays",
 correct,
 w1,
 w2,
 w3,
 `aList[${p.idx}] selects the ${p.idx === 1 ? "first" : p.idx === 2 ? "second" : p.idx === 3 ? "third" : "fourth"} item in this 1-based list: ${correct}.`,
 { figure: fig, procedural_structure_id: `csp-idx-n${p.idx}-len${p.list.length}` },
 );
}

/* - - - Physics - - - */

export function genKinematicsV(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const v0 = randInt(rng, 0, 10);
 const a = randInt(rng, 1, 5);
 const t = randInt(rng, 1, 6);
 const v = v0 + a * t;
 const stemIdx = randInt(rng, 0, KINEMATICS_TABLE_STEMS.length - 1);
 const stem = KINEMATICS_TABLE_STEMS[stemIdx];
 const fig: ExamFigure = {
 kind: "table",
 title: "Table 1. One-dimensional kinematics (SI)",
 headers: ["v0", "a", "t"],
 rows: [[`${v0} m/s`, `${a} m/s²`, `${t} s`]],
 };
 return mc(
 rng,
 ctx,
 i,
 "kin",
 stem,
 `${v} m/s`,
 `${v0 * t} m/s`,
 `${a * t} m/s`,
 `${v + 1} m/s`,
 `Use v = v_0 + at = ${v0} + (${a})(${t}).`,
 {
 figure: fig,
 procedural_structure_id: `ph-kin-s${stemIdx}-t${t}`,
 },
 );
}

export function genEnergyKE(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const m = randInt(rng, 1, 8);
 const v = randInt(rng, 2, 10);
 const ke = roundN(0.5 * m * v * v, 0);
 const stemIdx = randInt(rng, 0, KE_TABLE_STEMS.length - 1);
 const stem = KE_TABLE_STEMS[stemIdx];
 const fig: ExamFigure = {
 kind: "table",
 title: "Table 1. Particle data",
 headers: ["m (kg)", "v (m/s)"],
 rows: [[String(m), String(v)]],
 };
 return mc(
 rng,
 ctx,
 i,
 "ke",
 stem,
 `${ke} J`,
 `${m * v} J`,
 `${2 * ke} J`,
 `${roundN(ke / 2, 0)} J`,
 `Compute 1/2 x ${m} x ${v}^2 = ${ke} J.`,
 {
 figure: fig,
 procedural_structure_id: `ph-ke-s${stemIdx}-m${m}`,
 },
 );
}

const TIME_TICK_LABELS = ["1 s", "2 s", "3 s", "4 s", "5 s", "0.5 s", "1.5 s", "2.5 s", "3.5 s"] as const;

export function genPhysVelocityBarFig(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const labels = shuffleInPlace(rng, [...TIME_TICK_LABELS]).slice(0, 4);
 const vals = distinctRandInts(rng, 4, 2, 55);
 const bars = labels.map((label, idx) => ({ label, value: vals[idx] }));
 let maxI = 0;
 for (let k = 1; k < 4; k++) if (vals[k] > vals[maxI]) maxI = k;
 const correct = labels[maxI];
 const wrong = labels.filter((_, j) => j !== maxI);
 const stem = pick(rng, [
 "The bar chart shows the magnitude of a cart's velocity at equal time intervals. At which labeled time is speed greatest?",
 "Which time label corresponds to the maximum speed magnitude on the chart?",
 "According to the bars, when is the cart moving fastest?",
 ]);
 return mc(
 rng,
 ctx,
 i,
 "ph-vbar",
 stem,
 correct,
 wrong[0],
 wrong[1],
 wrong[2],
 `Compare bar heights; the largest value indicates the highest speed.`,
 {
 figure: {
 kind: "bar_chart",
 title: pick(rng, ["Speed magnitude at equal time intervals", "Cart speed by time", "Kinematics bar chart"]),
 yLabel: pick(rng, ["Speed (m/s)", "|v| (m/s)", "m/s"]),
 bars,
 },
 },
 );
}

export function genCoulombConcept(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const fig: ExamFigure = {
 kind: "stimulus",
 body: "Two point charges q1 and q2 are separated by a center-to-center distance r in vacuum.\n\nCoulomb's law gives the magnitude of the electrostatic force between them.",
 };
 return mc(
 rng,
 ctx,
 i,
 "coul",
 "The electric force between the two point charges is inversely proportional to",
 "the square of the distance",
 "the distance",
 "the cube of the distance",
 "the charges only",
 `Coulomb's law: F is proportional to 1/r².`,
 { figure: fig },
 );
}

/* - - - Chemistry / bio / env - - - */

export function genMolarity(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const mol = randInt(rng, 1, 5);
 const L = randInt(rng, 1, 4);
 const M = roundN(mol / L, 3);
 const stemIdx = randInt(rng, 0, MOLARITY_TABLE_STEMS.length - 1);
 const stem = MOLARITY_TABLE_STEMS[stemIdx];
 const fig: ExamFigure = {
 kind: "table",
 title: "Table 1. Solution data",
 headers: ["Amount of solute (mol)", "Volume of solution (L)"],
 rows: [[String(mol), String(L)]],
 };
 return mc(
 rng,
 ctx,
 i,
 "mol",
 stem,
 `${M} M`,
 `${mol * L} M`,
 `${mol + L} M`,
 `${roundN(M * 2, 3)} M`,
 `Molarity M = moles of solute / liters of solution = ${mol}/${L} = ${M} M.`,
 {
 figure: fig,
 procedural_structure_id: `chem-mol-s${stemIdx}-n${mol}`,
 },
 );
}

const SOLUTION_LABELS = [
 "Solution A",
 "Solution B",
 "Solution C",
 "Solution D",
 "Solution E",
 "Solution F",
 "Flask 1",
 "Flask 2",
 "Beaker X",
 "Beaker Y",
 "Vial I",
 "Vial II",
 "Trial 1",
 "Trial 2",
 "Sample P",
 "Sample Q",
] as const;

export function genChemConcentrationBarFig(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const labels = shuffleInPlace(rng, [...SOLUTION_LABELS]).slice(0, 4);
 const raw = distinctRandInts(rng, 4, 5, 250);
 const vals = raw.map((v) => roundN(v / 100, 2));
 const bars = labels.map((label, idx) => ({ label, value: vals[idx] }));
 let maxI = 0;
 for (let k = 1; k < 4; k++) if (vals[k] > vals[maxI]) maxI = k;
 const correct = labels[maxI];
 const wrong = labels.filter((_, j) => j !== maxI);
 const stem = pick(rng, [
 "The bar chart shows concentration (M) for four solutions. Which solution is most concentrated?",
 "Which label has the greatest molarity according to the bar chart?",
 "For these solutions, which bar indicates the highest concentration (M)?",
 ]);
 return mc(
 rng,
 ctx,
 i,
 "chem-bar",
 stem,
 correct,
 wrong[0],
 wrong[1],
 wrong[2],
 `The tallest bar corresponds to the highest molarity.`,
 {
 figure: {
 kind: "bar_chart",
 title: pick(rng, ["Solution concentration (M)", "Molarity comparison", "Lab results (M)"]),
 yLabel: pick(rng, ["Molarity (M)", "Concentration (M)", "M"]),
 bars,
 },
 },
 );
}

const PH_SCALE_REFERENCE: ExamFigure = {
 kind: "table",
 title: "Reference: pH scale (aqueous, 25°C)",
 headers: ["Region", "Approx. pH"],
 rows: [
 ["Strongly acidic", "0–3"],
 ["Acidic", "4–6"],
 ["Neutral", "~7"],
 ["Basic", "8–10"],
 ["Strongly basic", "11–14"],
 ],
};

export function genPHScale(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 return mc(
 rng,
 ctx,
 i,
 "ph",
 "Using the reference table, at 25°C a neutral aqueous solution has pH closest to",
 "7",
 "0",
 "14",
 "1",
 `Neutral water has [H^+] = 10^-^7 M, so pH = 7.`,
 { figure: PH_SCALE_REFERENCE },
 );
}

export function genDNAbase(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const fig: ExamFigure = {
 kind: "stimulus",
 body: "Complementary base pairing in double-stranded DNA (hydrogen bonds between strands):\n\n  A — T\n  C — G\n\n(RNA uses uracil instead of thymine.)",
 };
 return mc(
 rng,
 ctx,
 i,
 "dna",
 "In DNA, adenine pairs with",
 "thymine",
 "cytosine",
 "guanine",
 "uracil",
 `DNA uses A-T and G-C pairing (RNA uses A-U).`,
 { figure: fig },
 );
}

const SPECIES_TABLE_NAMES = [
 "Species A",
 "Species B",
 "Species C",
 "Species D",
 "Blue finch",
 "Marsh thrush",
 "Pine beetle",
 "River otter",
 "Field mouse",
 "Grass snake",
 "Oak moth",
 "Reed warbler",
 "Dune skink",
 "Bog frog",
 "Cliff swift",
 "Tide crab",
 "Meadow vole",
 "Fen newt",
 "Ridge hawk",
 "Bay shrimp",
] as const;

export function genBioSpeciesTableFig(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const labels = shuffleInPlace(rng, [...SPECIES_TABLE_NAMES]).slice(0, 4);
 const areas = distinctRandInts(rng, 4, 2, 18);
 const dScaled = distinctRandInts(rng, 4, 35, 220);
 dScaled.sort((a, b) => a - b);
 const densSorted = dScaled.map((x) => x / 10);
 const perm = shuffleInPlace(rng, [0, 1, 2, 3]);
 const densitiesNum = [0, 1, 2, 3].map((row) => densSorted[perm[row]]);
 const actualD = densitiesNum.map((d, k) => {
 const ind = Math.max(1, Math.round(d * areas[k]));
 return ind / areas[k];
 });
 let maxI = 0;
 for (let k = 1; k < 4; k++) if (actualD[k] > actualD[maxI]) maxI = k;
 const rows = labels.map((name, k) => {
 const ind = Math.max(1, Math.round(densitiesNum[k] * areas[k]));
 const density = ind / areas[k];
 const densStr = String(roundN(density, 1));
 return [name, String(ind), String(areas[k]), densStr] as [string, string, string, string];
 });
 const correct = labels[maxI];
 const wrong = labels.filter((_, j) => j !== maxI);
 const stem = pick(rng, [
 "According to the table, which species had the greatest estimated population density (individuals per km²) in the sample plot?",
 "Which species shows the highest density value in the table?",
 "Using individuals and plot area, which row has the greatest population density?",
 ]);
 return mc(
 rng,
 ctx,
 i,
 "bio-tbl",
 stem,
 correct,
 wrong[0],
 wrong[1],
 wrong[2],
 `Compare the density column and select the largest value.`,
 {
 figure: {
 kind: "table",
 title: pick(rng, [
 "Sample plot - species counts and area",
 "Field plot census",
 "Population density by species",
 ]),
 headers: ["Species", "Individuals", "Plot area (km²)", "Density (per km²)"],
 rows,
 },
 },
 );
}

export function genCarryingCapacity(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const fig: ExamFigure = {
 kind: "stimulus",
 body: "A population’s growth is modeled by a logistic curve: growth is nearly exponential at first, then slows as resources become limiting, and the curve levels off at an upper horizontal asymptote labeled K.",
 };
 return mc(
 rng,
 ctx,
 i,
 "cc",
 "In this model, the parameter K represents",
 "the maximum population an environment can sustain long term",
 "the initial growth rate only",
 "the extinction threshold",
 "the migration rate",
 `K is the upper asymptote of the logistic curve.`,
 { figure: fig },
 );
}

/* - - - History / gov / geo - - - */

export function genAmendmentFreeSpeech(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 return mc(
 rng,
 ctx,
 i,
 "a1",
 "The Bill of Rights protection for freedom of speech is primarily associated with the",
 "First Amendment",
 "Second Amendment",
 "Fourth Amendment",
 "Fourteenth Amendment",
 `Speech protections are central to the First Amendment.`,
 );
}

export function genChecksBalances(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 return mc(
 rng,
 ctx,
 i,
 "chk",
 "The power of judicial review in the U.S. was most clearly articulated in",
 "Marbury v. Madison",
 "Brown v. Board",
 "McCulloch v. Maryland",
 "United States v. Lopez",
 `Marshall's opinion established judicial review.`,
 );
}

export function genSeparationOfPowers(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 return mc(
 rng,
 ctx,
 i,
 "sep",
 "In the U.S. federal system, dividing lawmaking, enforcement, and adjudication across branches exemplifies",
 "separation of powers",
 "dual federalism only",
 "unified sovereignty",
 "judicial activism only",
 `Different branches hold distinct core functions with checks between them.`,
 );
}

export function genFederalismConcept(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 return mc(
 rng,
 ctx,
 i,
 "fed",
 "A system where sovereignty is constitutionally divided between national and regional governments is called",
 "federalism",
 "unitary government only",
 "confederation without enforcement",
 "direct democracy",
 `Federalism allocates authority across levels (U.S.: national + state).`,
 );
}

export function genRegimeType(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 return mc(
 rng,
 ctx,
 i,
 "reg",
 "In comparative politics, a system where citizens elect representatives is often classified as",
 "democratic",
 "authoritarian",
 "totalitarian",
 "theocratic",
 `Representative elections are a hallmark of democratic regimes (with definitional nuance).`,
 );
}

export function genNationState(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 return mc(
 rng,
 ctx,
 i,
 "nat",
 "A political unit recognized as having legitimate authority over a defined territory is commonly called a",
 "state",
 "regime type only",
 "civil society",
 "interest group",
 `In comparative politics, 'state' often denotes the organized political community with territorial sovereignty.`,
 );
}

export function genMapScale(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 return mc(
 rng,
 ctx,
 i,
 "map",
 "A large-scale map typically shows",
 "a smaller area with more detail",
 "a larger area with less detail",
 "only elevation",
 "only political boundaries",
 `Large scale (next) smaller geographic area, finer detail.`,
 );
}

export function genGeoDistanceDecay(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 return mc(
 rng,
 ctx,
 i,
 "dd",
 "The idea that interaction between places weakens as the distance between them increases is known as",
 "distance decay",
 "possibilism",
 "environmental determinism",
 "core-periphery theory",
 `Interaction typically tails off with distance (time and cost of movement).`,
 );
}

export function genGeoRelocationDiffusion(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 return mc(
 rng,
 ctx,
 i,
 "reloc",
 "The spread of an idea through the physical movement of people from one place to another is best described as",
 "relocation diffusion",
 "expansion diffusion",
 "stimulus diffusion",
 "hierarchical diffusion",
 `Relocation diffusion moves with migrants or travelers.`,
 );
}

export function genGeoPushPull(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 return mc(
 rng,
 ctx,
 i,
 "pp",
 "A factory closing in a rural area, leading workers to leave, acts most directly as a",
 "push factor",
 "pull factor",
 "migration selectivity",
 "remittance flow",
 `Push factors encourage people to leave an origin.`,
 );
}

export function genGeoPrimateCity(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 return mc(
 rng,
 ctx,
 i,
 "prim",
 "In a country where one city is vastly larger than the next-ranked cities, that dominant city is often called a",
 "primate city",
 "gateway city",
 "boom town",
 "exurb",
 `The primate city pattern shows the largest city dramatically outranking others.`,
 );
}

export function genGeoBidRent(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 return mc(
 rng,
 ctx,
 i,
 "bid",
 "In the bid-rent model, land closest to the central business district (CBD) is typically bid highest by",
 "retail and office uses",
 "extensive grain farming",
 "subsistence herding",
 "forestry",
 `High accessibility near the CBD supports intensive, high-revenue land uses.`,
 );
}

const URBAN_AREA_LABELS = [
 "River Delta Metro",
 "Inland Hub",
 "Coastal Port",
 "Plateau Town",
 "Harbor City",
 "Highland Ridge",
 "Lake District",
 "Desert Oasis",
 "Forest Edge",
 "Steppe Junction",
 "Bayfront",
 "Canal District",
 "Summit City",
 "Delta Plains",
 "Ironworks Valley",
 "University Town",
 "Border Station",
 "Transit Hub",
 "Market Quarter",
 "Old Fort",
 "Riverbend",
 "Seaport",
 "Uplands",
 "Lowlands",
 "Gateway",
] as const;

export function genGeoPopulationBarFig(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const labels = shuffleInPlace(rng, [...URBAN_AREA_LABELS]).slice(0, 4);
 const vals = distinctRandInts(rng, 4, 1, 48);
 const bars = labels.map((label, idx) => ({ label, value: vals[idx] }));
 let maxI = 0;
 for (let k = 1; k < 4; k++) if (vals[k] > vals[maxI]) maxI = k;
 const correct = labels[maxI];
 const wrong = labels.filter((_, j) => j !== maxI);
 const stem = pick(rng, [
 "According to the bar chart, which urban area has the largest population shown?",
 "Which label matches the tallest population bar?",
 "For these urban areas, which has the greatest population (millions) on the chart?",
 ]);
 return mc(
 rng,
 ctx,
 i,
 "geo-pbar",
 stem,
 correct,
 wrong[0],
 wrong[1],
 wrong[2],
 `Compare bar heights to find the maximum.`,
 {
 figure: {
 kind: "bar_chart",
 title: pick(rng, [
 "Population of selected urban areas (millions)",
 "Urban population snapshot (millions)",
 "Metro area sizes (millions)",
 ]),
 yLabel: pick(rng, ["Millions", "Population (millions)", "People (millions)"]),
 bars,
 },
 },
 );
}

const URBAN_PERIOD_LABELS = [
 "2000-2005",
 "2005-2010",
 "2010-2015",
 "2015-2020",
 "2016-2021",
 "2018-2023",
 "1998-2003",
 "2002-2007",
 "2008-2013",
 "2012-2017",
 "2014-2019",
 "2020-2025",
] as const;

export function genGeoUrbanGrowthLineFig(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const xlabs = shuffleInPlace(rng, [...URBAN_PERIOD_LABELS]).slice(0, 4);
 const raw = distinctRandInts(rng, 4, 8, 52);
 const ys = raw.map((v) => roundN(v / 10, 1));
 const points = xlabs.map((x, idx) => ({ x, y: ys[idx] }));
 let maxI = 0;
 for (let k = 1; k < 4; k++) if (ys[k] > ys[maxI]) maxI = k;
 const correct = xlabs[maxI];
 const wrong = xlabs.filter((_, j) => j !== maxI);
 const stem = pick(rng, [
 "According to the line chart, in which period was urban growth (percentage change) fastest?",
 "Which period shows the highest percentage change on the chart?",
 "At which labeled interval is the urban growth rate greatest?",
 ]);
 return mc(
 rng,
 ctx,
 i,
 "geo-line",
 stem,
 correct,
 wrong[0],
 wrong[1],
 wrong[2],
 `The highest point indicates the fastest growth rate for that interval.`,
 {
 figure: {
 kind: "line_chart",
 title: pick(rng, [
 "Urban population growth rate (% per period)",
 "Urban growth by period",
 "City growth rates (% change)",
 ]),
 yLabel: pick(rng, ["% change", "Growth (%)", "Percent change"]),
 points,
 },
 },
 );
}

const CROP_NAMES = [
 "Wheat",
 "Maize",
 "Rice",
 "Barley",
 "Soybeans",
 "Sorghum",
 "Oats",
 "Rye",
 "Millet",
 "Sunflower",
 "Cotton",
 "Potatoes",
 "Sugar beets",
 "Canola",
 "Peanuts",
 "Cassava",
] as const;

export function genGeoCropsTableFig(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const crops = shuffleInPlace(rng, [...CROP_NAMES]).slice(0, 4);
 const y1base = randInt(rng, 2010, 2022);
 const y2 = y1base + 1;
 const h1 = `Year ${y1base}`;
 const h2 = `Year ${y2}`;
 const y2vals = distinctRandInts(rng, 4, 18, 220);
 const y1vals = crops.map(() => String(randInt(rng, 12, 200)));
 let maxI = 0;
 for (let k = 1; k < 4; k++) if (y2vals[k] > y2vals[maxI]) maxI = k;
 const correct = crops[maxI];
 const wrong = crops.filter((_, j) => j !== maxI);
 const rows = crops.map((c, k) => [c, y1vals[k], String(y2vals[k])] as [string, string, string]);
 const stem = pick(rng, [
 `According to the table, which crop had the highest national production (million metric tons) in ${h2}?`,
 `In ${h2}, which crop shows the greatest production in the table?`,
 `Compare the ${h2} column: which crop has the largest value?`,
 ]);
 return mc(
 rng,
 ctx,
 i,
 "geo-tbl",
 stem,
 correct,
 wrong[0],
 wrong[1],
 wrong[2],
 `Read the ${h2} column and select the largest value.`,
 {
 figure: {
 kind: "table",
 title: pick(rng, [
 "Crop production (million metric tons) - sample country",
 "National crop output (MMT)",
 "Harvest totals (million metric tons)",
 ]),
 headers: ["Crop", h1, h2],
 rows,
 },
 },
 );
}

export function genWW2Turning(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const stem = pick(rng, [
  "Which battle is commonly cited as a major turning point on the Eastern Front in World War II?",
  "On the Eastern Front, which battle is most often identified as a turning point in World War II?",
  "Which engagement is frequently described as a decisive turning point against Germany on the Eastern Front?",
  "Many historians cite which battle as a key turning point on the Eastern Front during World War II?",
 ]);
 return mc(
 rng,
 ctx,
 i,
 "ww2",
  stem,
 "Stalingrad",
 "Verdun",
 "Somme",
 "Waterloo",
 `The Battle of Stalingrad (1942-43) marked a major Soviet shift.`,
 );
}

export function genPrintingPressSpread(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const stem = pick(rng, [
  "The rapid spread of printed books in 15th-16th century Europe most strongly helped",
  "The diffusion of print technology in early modern Europe most directly contributed to",
  "Wider access to printed materials in 15th-16th century Europe most strongly promoted",
  "The printing press is historically linked to which outcome in early modern Europe?",
 ]);
 return mc(
 rng,
 ctx,
 i,
 "print",
  stem,
 "diffuse religious and scientific ideas",
 "end all regional wars",
 "abolish feudalism overnight",
 "isolate monasteries",
 `Printing accelerated circulation of texts across regions.`,
 );
}

export function genScrambleAfrica(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const stem = pick(rng, [
  "The late 19th-century European partitioning of African territory is most associated with",
  "European rules for colonizing and partitioning Africa in the late 1800s are most closely linked to",
  "The meeting that set guidelines for European claims in Africa is known as",
  "The event most closely tied to formalizing the 'Scramble for Africa' was",
 ]);
 return mc(
 rng,
 ctx,
 i,
 "berlin",
  stem,
 "the Berlin Conference (1884-85)",
 "the Congress of Vienna",
 "the Treaty of Versailles",
 "the Yalta Conference",
 `European powers met to set rules for African colonization.`,
 );
}

/* - - - Economics - - - */

export function genOppCost(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const a = randInt(rng, 8, 20);
 const b = randInt(rng, 8, 20);
 const fig: ExamFigure = {
 kind: "table",
 title: "Table 1. Marginal tradeoff along a PPF (hypothetical)",
 headers: ["", "Amount"],
 rows: [
 ["Good B forgone to produce one more unit of Good A", `${b} units of B`],
 ["Unrelated parameter (distractor context)", `${a} units`],
 ],
 };
 return mc(
 rng,
 ctx,
 i,
 "opp",
 "The opportunity cost of one additional unit of Good A in terms of Good B is",
 `${b} units of B per unit of A`,
 `${a} units of B per unit of A`,
 `${a + b} total units`,
 `zero`,
 `Opportunity cost is what you sacrifice at the margin.`,
 { figure: fig },
 );
}

export function genGDPdeflator(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const fig: ExamFigure = {
 kind: "stimulus",
 body: "National accounts report:\n• Nominal GDP: current-price output\n• Real GDP: constant-price output (base year)\n\nAnalysts form a price index that compares them economy-wide.",
 };
 return mc(
 rng,
 ctx,
 i,
 "gdp",
 "The GDP deflator is calculated as",
 "Nominal GDP / Real GDP x 100",
 "Real GDP / Nominal GDP x 100",
 "CPI / GDP",
 "Exports - Imports",
 `Deflator compares nominal output to real output.`,
 { figure: fig },
 );
}

const QUARTER_LABELS = ["Q1", "Q2", "Q3", "Q4", "Jan", "Apr", "Jul", "Oct"] as const;

export function genEconUnemploymentLineFig(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const xlabs = shuffleInPlace(rng, [...QUARTER_LABELS]).slice(0, 4);
 const ys = distinctRandInts(rng, 4, 35, 120);
 const points = xlabs.map((x, idx) => ({ x, y: roundN(ys[idx] / 10, 1) }));
 let maxI = 0;
 for (let k = 1; k < 4; k++) if (points[k].y > points[maxI].y) maxI = k;
 const correct = xlabs[maxI];
 const wrong = xlabs.filter((_, j) => j !== maxI);
 const stem = pick(rng, [
 "According to the line chart, the unemployment rate was highest in",
 "Which period shows the peak unemployment rate on the chart?",
 "At which labeled time is unemployment greatest?",
 ]);
 return mc(
 rng,
 ctx,
 i,
 "econ-un",
 stem,
 correct,
 wrong[0],
 wrong[1],
 wrong[2],
 `Identify which point has the maximum unemployment rate.`,
 {
 figure: {
 kind: "line_chart",
 title: pick(rng, ["Unemployment rate (%) by quarter", "Unemployment over time", "Labor market indicator"]),
 yLabel: pick(rng, ["Percent", "Rate (%)", "Unemployment (%)"]),
 points,
 },
 },
 );
}

/* - - - Psychology - - - */

export function genNeuronPart(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const fig: ExamFigure = {
 kind: "stimulus",
 body: "Diagram description: Neuron A (presynaptic) —(vesicles release neurotransmitter)→ gap ←(receptors)— Neuron B (postsynaptic). The narrow space is labeled.",
 };
 return mc(
 rng,
 ctx,
 i,
 "neu",
 "The gap between two neurons across which neurotransmitters travel is the",
 "synapse",
 "axon terminal only",
 "myelin sheath",
 "soma exclusively",
 `The synaptic cleft lies between the presynaptic and postsynaptic neurons.`,
 { figure: fig },
 );
}

export function genOperant(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const fig: ExamFigure = {
 kind: "stimulus",
 body: "A dog trainer says “sit.” When the dog sits, the trainer immediately gives a small food treat. Over trials, sitting becomes more frequent.",
 };
 return mc(
 rng,
 ctx,
 i,
 "op",
 "This procedure is best described as",
 "positive reinforcement",
 "negative reinforcement",
 "positive punishment",
 "extinction",
 `Adding a desirable stimulus strengthens behavior (positive reinforcement).`,
 { figure: fig },
 );
}

/* - - - English - - - */

export function genFallacy(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const fig: ExamFigure = {
 kind: "stimulus",
 body: "Speaker: “We should fund the new lab.”\nOpponent: “You can’t trust anything they say — they failed chemistry in high school.”",
 };
 return mc(
 rng,
 ctx,
 i,
 "fall",
 "The opponent’s reply is best classified as",
 "ad hominem",
 "straw man",
 "false dilemma",
 "appeal to authority",
 `Ad hominem targets the arguer instead of the claim.`,
 { figure: fig },
 );
}

export function genRhetoricalAppeal(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const fig: ExamFigure = {
 kind: "stimulus",
 body: "A surgeon begins a public health talk: “In twenty years of practice at this hospital, I’ve seen hundreds of cases like this…”",
 };
 return mc(
 rng,
 ctx,
 i,
 "eth",
 "This opening primarily establishes",
 "ethos",
 "logos",
 "pathos",
 "kairos",
 `Ethos emphasizes speaker trustworthiness.`,
 { figure: fig },
 );
}

/* - - - Arts - - - */

export function genRenaissanceArt(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const fig: ExamFigure = {
 kind: "stimulus",
 body: "Exhibit: Architectural and pictorial works from Quattrocento Italy increasingly use converging orthogonals and a single vanishing point to organize space on a flat surface.",
 };
 return mc(
 rng,
 ctx,
 i,
 "ren",
 "This systematic compositional approach is especially associated with",
 "Early Renaissance in Italy",
 "Impressionism in France",
 "Abstract Expressionism in New York",
 "Byzantine mosaics",
 `Filippo Brunelleschi and others helped develop linear perspective in Quattrocento Italy.`,
 { figure: fig },
 );
}

export function genCadence(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const fig: ExamFigure = {
 kind: "stimulus",
 body: "Notation (Roman numeral analysis): a phrase ends on the dominant chord (V) rather than the tonic (I), leaving a sense of pause or expectation.",
 };
 return mc(
 rng,
 ctx,
 i,
 "cad",
 "A cadence that ends on the dominant harmony typically sounds",
 "half cadence",
 "authentic cadence",
 "plagal cadence",
 "deceptive cadence",
 `A half cadence ends on V (dominant).`,
 { figure: fig },
 );
}

/* - - - World languages (pattern drills) - - - */

export function genNumberPatternEs(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const n = randInt(rng, 2, 9);
 const wrongs = [`once`, `diez`, `cero`];
 const fig: ExamFigure = {
 kind: "table",
 title: "Table 1. Number–word match",
 headers: ["Digit", "?"],
 rows: [[String(n), "(select Spanish word)"]],
 };
 return mc(
 rng,
 ctx,
 i,
 "esn",
 `Which Spanish word matches the digit in the table?`,
 n === 2 ? "dos" : n === 3 ? "tres" : n === 4 ? "cuatro" : n === 5 ? "cinco" : n === 6 ? "seis" : n === 7 ? "siete" : n === 8 ? "ocho" : "nueve",
 wrongs[0],
 wrongs[1],
 wrongs[2],
 `Match Spanish numerals to digits (example item; vary with unit practice).`,
 { figure: fig },
 );
}

/* - - - Capstone - - - */

export function genCitationEthics(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const fig: ExamFigure = {
 kind: "stimulus",
 body: "A student rewrites two paragraphs from a journal article in their own words but does not add in-text citations or a bibliography entry.",
 };
 return mc(
 rng,
 ctx,
 i,
 "cite",
 "This practice is generally considered",
 "plagiarism",
 "fair use automatically",
 "peer review",
 "synthesis",
 `Ideas and wording from sources require attribution.`,
 { figure: fig },
 );
}

export function genVariableControl(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const fig: ExamFigure = {
 kind: "table",
 title: "Table 1. Experiment sketch",
 headers: ["Element", "Description"],
 rows: [
 ["Manipulated factor", "different noise levels assigned to groups"],
 ["Measured outcome", "proofreading errors"],
 ],
 };
 return mc(
 rng,
 ctx,
 i,
 "var",
 "The factor intentionally set by the researcher is the",
 "independent variable",
 "dependent variable",
 "confounding variable",
 "control group",
 `The IV is what the experimenter changes.`,
 { figure: fig },
 );
}

/* - - - Mass concept banks (large template × foil rotation sets) - - - */

export function genPsychMass(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 return examFromMassRow(rng, ctx, i, "psych-mass", pickPsychMassRow(rng));
}

export function genGovMass(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 return examFromMassRow(rng, ctx, i, "gov-mass", pickGovUsMassRow(rng));
}

export function genCompGovMass(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 return examFromMassRow(rng, ctx, i, "comp-gov-mass", pickCompGovMassRow(rng));
}

export function genEngMass(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 return examFromMassRow(rng, ctx, i, "eng-mass", pickEngMassRow(rng));
}

export function genEconMass(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 return examFromMassRow(rng, ctx, i, "econ-mass", pickEconMassRow(rng));
}

export function genCsMass(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 return examFromMassRow(rng, ctx, i, "cs-mass", pickCsMassRow(rng));
}

export function genPhysMass(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 return examFromMassRow(rng, ctx, i, "phys-mass", pickPhysMassRow(rng));
}

export function genChemMass(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 return examFromMassRow(rng, ctx, i, "chem-mass", pickChemMassRow(rng));
}

export function genBioMass(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 return examFromMassRow(rng, ctx, i, "bio-mass", pickBioMassRow(rng));
}

export function genEuroMass(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 return examFromMassRow(rng, ctx, i, "euro-mass", pickEuroMassRow(rng));
}

export function genSeminarMass(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 return examFromMassRow(rng, ctx, i, "seminar-mass", pickSeminarMassRow(rng));
}

/* - - - Pools - - - */

/** Symbolic + conceptual generators shared by Calc AB/BC procedural practice. */
const CALC: QuestionGen[] = [
 genDerivativePower,
 genLimitLinear,
 genIntegralPower,
 genCompositionValue,
 genLinearSlopeTwoPoints,
 genSmallIntegerPowerEval,
 genTrigSpecial,
 genRationalLimitRemovable,
 genContinuityConceptMcq,
 genIvTSignChange,
 genAvgVelocitySquaredPosition,
 genMotionVelocityPolynomial,
 genFtcPartOneValue,
 genHorizontalAsymptoteRationalDegrees,
 genSeparableFormRecognize,
 genVolumeDiskIntegralSetup,
];

/**
 * AP-style no-calculator MCQ mix: symbolic calculus, light composition, exact trig,
 * integer powers, slope / limits / continuity / IVT / FTC recognition, and z-score form (no heavy means).
 */
const CALC_NO_CALCULATOR_SECTION: QuestionGen[] = [
 genDerivativePower,
 genLimitLinear,
 genIntegralPower,
 genCompositionValue,
 genLinearSlopeTwoPoints,
 genSmallIntegerPowerEval,
 genTrigSpecial,
 genRationalLimitRemovable,
 genContinuityConceptMcq,
 genIvTSignChange,
 genAvgVelocitySquaredPosition,
 genMotionVelocityPolynomial,
 genFtcPartOneValue,
 genHorizontalAsymptoteRationalDegrees,
 genSeparableFormRecognize,
 genVolumeDiskIntegralSetup,
 genZScoreConcept,
 genMeanSimple,
];

/** Unit-indexed pools for AP Calculus AB (1–8), aligned to typical CED-style units. */
const CALC_AB_UNIT_POOLS: QuestionGen[][] = [
 // 1 — Limits & continuity
 [
 genLimitLinear,
 genRationalLimitRemovable,
 genTrigSpecial,
 genContinuityConceptMcq,
 genIvTSignChange,
 genHorizontalAsymptoteRationalDegrees,
 genSmallIntegerPowerEval,
 ],
 // 2 — Derivative definition & basic rules
 [
 genDerivativePower,
 genLinearSlopeTwoPoints,
 genAvgVelocitySquaredPosition,
 genSmallIntegerPowerEval,
 genTrigSpecial,
 genContinuityConceptMcq,
 ],
 // 3 — Chain / product / quotient / implicit / inverse / trig derivatives
 [
 genCompositionValue,
 genDerivativePower,
 genTrigSpecial,
 genLimitLinear,
 genRationalLimitRemovable,
 ],
 // 4 — Contextual differentiation (motion, rates, approximation)
 [
 genMotionVelocityPolynomial,
 genAvgVelocitySquaredPosition,
 genDerivativePower,
 genCompositionValue,
 genLinearSlopeTwoPoints,
 ],
 // 5 — Analytical applications (extrema, concavity, optimization framing)
 [
 genDerivativePower,
 genCompositionValue,
 genLinearSlopeTwoPoints,
 genTrigSpecial,
 genLimitLinear,
 ],
 // 6 — Integration & FTC
 [
 genIntegralPower,
 genFtcPartOneValue,
 genMeanSimple,
 genZScoreConcept,
 genDerivativePower,
 ],
 // 7 — Differential equations
 [
 genSeparableFormRecognize,
 genDerivativePower,
 genIntegralPower,
 genLimitLinear,
 genSmallIntegerPowerEval,
 ],
 // 8 — Applications of integration
 [
 genVolumeDiskIntegralSetup,
 genIntegralPower,
 genFtcPartOneValue,
 genMeanSimple,
 genDerivativePower,
 ],
];

function calcPoolForSection(pool: QuestionGen[], calculatorSection?: CalculatorSectionPolicy): QuestionGen[] {
 if (calculatorSection === "no_calculator") {
 const allowed = new Set(CALC_NO_CALCULATOR_SECTION);
 const filtered = pool.filter((g) => allowed.has(g));
 return filtered.length > 0 ? filtered : CALC_NO_CALCULATOR_SECTION;
 }
 if (calculatorSection === "calculator") {
 return [...pool, ...STATS_TEXT];
 }
 return [...pool, ...STATS_TEXT];
}

function getCalcAbUnitGenerators(unitIndex: number, calculatorSection?: CalculatorSectionPolicy): QuestionGen[] {
 const idx = Math.min(8, Math.max(1, Math.floor(unitIndex))) - 1;
 const pool = CALC_AB_UNIT_POOLS[idx] ?? CALC;
 return calcPoolForSection(pool, calculatorSection);
}

/** Unit-indexed pools for AP Calculus BC (1–11), aligned to the course unit map. */
const CALC_BC_UNIT_POOLS: QuestionGen[][] = [
 // 1 — Limits & continuity
 CALC_AB_UNIT_POOLS[0]!,
 // 2 — Derivatives foundations
 CALC_AB_UNIT_POOLS[1]!,
 // 3 — Differentiation techniques
 CALC_AB_UNIT_POOLS[2]!,
 // 4 — Applications of derivatives
 CALC_AB_UNIT_POOLS[3]!,
 // 5 — Function analysis
 CALC_AB_UNIT_POOLS[4]!,
 // 6 — Integration & FTC
 CALC_AB_UNIT_POOLS[5]!,
 // 7 — Differential equations
 CALC_AB_UNIT_POOLS[6]!,
 // 8 — Applications of integration
 CALC_AB_UNIT_POOLS[7]!,
 // 9 — Parametric / polar / vector
 [
  genParametricDyDx,
  genPolarAreaSetup,
  genDerivativePower,
  genIntegralPower,
  genTrigSpecial,
 ],
 // 10 — Sequences and series
 [
  genGeometricSeriesConcept,
  genDivergenceTest,
  genPSeriesClassification,
  genRatioTestConcept,
  genSmallIntegerPowerEval,
 ],
 // 11 — Advanced integration techniques
 [
  genImproperIntegralConcept,
  genTrapezoidalRuleSetup,
  genIntegralPower,
  genFtcPartOneValue,
  genMeanSimple,
 ],
];

function getCalcBcUnitGenerators(unitIndex: number, calculatorSection?: CalculatorSectionPolicy): QuestionGen[] {
 const idx = Math.min(11, Math.max(1, Math.floor(unitIndex))) - 1;
 const pool = CALC_BC_UNIT_POOLS[idx] ?? CALC;
 if (calculatorSection === "no_calculator") {
  const allowed = new Set<QuestionGen>([
   ...CALC_NO_CALCULATOR_SECTION,
   genGeometricSeriesConcept,
   genDivergenceTest,
   genPSeriesClassification,
   genRatioTestConcept,
   genImproperIntegralConcept,
   genTrapezoidalRuleSetup,
   genParametricDyDx,
   genPolarAreaSetup,
  ]);
  const filtered = pool.filter((g) => allowed.has(g));
  return filtered.length > 0 ? filtered : [...CALC_NO_CALCULATOR_SECTION];
 }
 if (calculatorSection === "calculator") return [...pool, ...STATS_TEXT];
 return [...pool, ...STATS_TEXT];
}

/** Text-only stats items (safe to mix with calculus for numeric literacy). */
const STATS_TEXT: QuestionGen[] = [genMeanSimple, genZScoreConcept];
const STATS_FIG: QuestionGen[] = [genStatsBarChartMode, genStatsExamLineTrend];
const STATS_FULL: QuestionGen[] = [...STATS_TEXT, ...STATS_FIG];

const CS_A: QuestionGen[] = [genBigO, genLoopCount, genBooleanExpr, genCsMass];
const CSP: QuestionGen[] = [genBigO, genLoopCount, genBooleanExpr, genCspListIndex, genCsMass];
const PHYS_ALG: QuestionGen[] = [genKinematicsV, genEnergyKE, genPhysMass];
const PHYS_C: QuestionGen[] = [genKinematicsV, genEnergyKE, genCoulombConcept, genPhysMass];
const CHEM: QuestionGen[] = [genMolarity, genChemConcentrationBarFig, genChemMass];
const BIO: QuestionGen[] = [genBioSpeciesTableFig, genBioMass];
// ENV previously relied on fixed concept items; use the (varied) mass bank instead.
const ENV: QuestionGen[] = [genChemMass, genBioMass];

// History: avoid single fixed prompts; keep these but they will be randomized in-function.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const HIST_SHARED: QuestionGen[] = [genWW2Turning];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const HIST_GLOBAL: QuestionGen[] = [genPrintingPressSpread, genScrambleAfrica];

const GOV: QuestionGen[] = [
 genGovMass,
];

// Comp Gov: avoid fixed, always-identical prompts; use template-driven mass bank instead.
const COMP_GOV: QuestionGen[] = [genCompGovMass];

const ECON: QuestionGen[] = [genOppCost, genGDPdeflator, genEconUnemploymentLineFig, genEconMass];

const PSYCH: QuestionGen[] = [genPsychMass, genNeuronPart, genOperant, genVariableControl];

const ENG: QuestionGen[] = [genFallacy, genRhetoricalAppeal, genEngMass];
const ART: QuestionGen[] = [genRenaissanceArt, genCadence];
const LANG: QuestionGen[] = [genNumberPatternEs, genRhetoricalAppeal, genEngMass];
const CAP: QuestionGen[] = [genCitationEthics, genVariableControl];

/** Fallback when a catalog course is missing from the map - should not happen in normal use. */
const DEFAULT_POOL: QuestionGen[] = [genFallacy, genRhetoricalAppeal];

const COURSE_POOL: Record<string, QuestionGen[]> = {
 "calc-ab": [...CALC, ...STATS_TEXT],
 "calc-bc": [...CALC, ...STATS_TEXT],
 precalc: [...CALC, ...STATS_TEXT],
 stats: STATS_FULL,
 "cs-a": [...CS_A, genVariableControl],
 csp: [...CSP, genVariableControl],
 "physics-1": [...PHYS_ALG, genVariableControl, genPhysVelocityBarFig],
 "physics-2": [...PHYS_ALG, genPHScale, genVariableControl, genPhysVelocityBarFig],
 "physics-c-m": [...PHYS_C, genVariableControl],
 "physics-c-em": [...PHYS_C, genVariableControl],
 chem: [...CHEM, genVariableControl],
 bio: [...BIO, genVariableControl],
 env: [...ENV, genVariableControl],
 euro: [genEuroMass],
 gov: [...GOV],
 "comp-gov": [...COMP_GOV],
 macro: [...ECON],
 micro: [...ECON],
 psych: PSYCH,
 lang: ENG,
 lit: ENG,
 "art-hist": ART,
 "art-design": [...ART, genCitationEthics],
 music: ART,
 spanish: LANG,
 french: LANG,
 german: LANG,
 latin: [...ENG, genCitationEthics],
 chinese: LANG,
 japanese: LANG,
 // Avoid fixed, always-identical prompts (e.g. `genCitationEthics` has a fixed stimulus).
 // Seminar uses a template-driven mass bank aligned to Big Ideas for high variety.
 seminar: [genSeminarMass],
 research: CAP,
};

export type CalculatorSectionPolicy = "no_calculator" | "calculator";

export function getGeneratorsForCourse(
 courseId: string,
 unitIndex: number = 1,
 calculatorSection?: CalculatorSectionPolicy,
): QuestionGen[] {
 if (courseId === "wh" && unitIndex >= 1 && unitIndex <= 9) {
 return getWorldHistoryGeneratorsForUnit(unitIndex) as QuestionGen[];
 }
 if (courseId === "hum-geo" && unitIndex >= 1 && unitIndex <= 7) {
 return getHumanGeographyGeneratorsForUnit(unitIndex) as QuestionGen[];
 }
 if (courseId === "ush" && unitIndex >= 1 && unitIndex <= 9) {
 return getUsHistoryGeneratorsForUnit(unitIndex) as QuestionGen[];
 }
 if (courseId === "calc-ab") {
 return getCalcAbUnitGenerators(unitIndex, calculatorSection);
 }
 if (courseId === "calc-bc") {
 return getCalcBcUnitGenerators(unitIndex, calculatorSection);
 }
 return COURSE_POOL[courseId] ?? DEFAULT_POOL;
}
