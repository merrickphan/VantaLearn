import type { ExamFigure, ExamQuestion } from "@/types";
import {
 CALC_FUNCTION_INTROS,
 COMPOSITION_TABLE_STEMS,
 DERIVATIVE_AFTER_STIM_STEMS,
 fillStem,
 INTEGRAL_AFTER_STIM_STEMS,
 KE_TABLE_STEMS,
 KINEMATICS_TABLE_STEMS,
 LIMIT_AFTER_TABLE_STEMS,
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
 const n = randInt(rng, 2, 48);
 const coefMag = randInt(rng, 1, 72);
 const sign = pick(rng, [-1, 1] as const);
 const coef = coefMag * sign;
 const d = coef * n;
 const nm1 = n - 1;
 const fx = coef < 0 ? `${coef}x^${n}` : `${coef}x^${n}`;
 const correct = `${d}x^${nm1}`;
 const stemIdx = randInt(rng, 0, DERIVATIVE_AFTER_STIM_STEMS.length - 1);
 const stem = DERIVATIVE_AFTER_STIM_STEMS[stemIdx];
 const fig: ExamFigure = {
 kind: "stimulus",
 body: `${pick(rng, CALC_FUNCTION_INTROS)}\n\nf(x) = ${fx}`,
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
 procedural_structure_id: `calc-dpow-s${stemIdx}-n${n}-c${coefMag}`,
 },
 );
}

export function genLimitLinear(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const a = randInt(rng, 1, 42);
 const b = randInt(rng, -60, 60);
 const c = randInt(rng, 1, 55);
 const lim = a * c + b;
 const stemIdx = randInt(rng, 0, LIMIT_AFTER_TABLE_STEMS.length - 1);
 const stem = LIMIT_AFTER_TABLE_STEMS[stemIdx];
 const gx = b >= 0 ? `${a}x + ${b}` : `${a}x - ${-b}`;
 const fig: ExamFigure = {
 kind: "table",
 title: "Table 1. Linear function g(x) = ax + b",
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
 procedural_structure_id: `calc-lim-s${stemIdx}-a${a}-b${b}-c${c}`,
 },
 );
}

export function genIntegralPower(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const n = randInt(rng, 2, 14);
 const coef = randInt(rng, 1, 28);
 const exp = n + 1;
 const num = coef;
 const correct = `(${num}/${exp})x^${exp} + C`;
 const stemIdx = randInt(rng, 0, INTEGRAL_AFTER_STIM_STEMS.length - 1);
 const stem = INTEGRAL_AFTER_STIM_STEMS[stemIdx];
 const fig: ExamFigure = {
 kind: "stimulus",
 body: `${pick(rng, CALC_FUNCTION_INTROS)}\n\nf(x) = ${coef}x^${n}`,
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
 procedural_structure_id: `calc-int-s${stemIdx}-n${n}-k${coef}`,
 },
 );
}

export function genCompositionValue(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 const a = randInt(rng, 1, 18);
 const b = randInt(rng, 1, 35);
 const x0 = randInt(rng, 1, 22);
 const inner = a * x0 + b;
 const outerCoef = randInt(rng, 2, 24);
 const val = outerCoef * inner;
 const stemIdx = randInt(rng, 0, COMPOSITION_TABLE_STEMS.length - 1);
 const stem = fillStem(COMPOSITION_TABLE_STEMS[stemIdx], { x0 });
 const gb = b >= 0 ? `${a}x + ${b}` : `${a}x - ${-b}`;
 const fig: ExamFigure = {
 kind: "table",
 title: "Table 1. Function definitions",
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
 procedural_structure_id: `calc-comp-s${stemIdx}-x${x0}-o${outerCoef}`,
 },
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
 const a = randInt(rng, 12, 998);
 const b = randInt(rng, 12, 998);
 const c = randInt(rng, 12, 998);
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
 return mc(
 rng,
 ctx,
 i,
 "ww2",
 "Which battle is commonly cited as a major turning point on the Eastern Front in World War II?",
 "Stalingrad",
 "Verdun",
 "Somme",
 "Waterloo",
 `The Battle of Stalingrad (1942-43) marked a major Soviet shift.`,
 );
}

export function genPrintingPressSpread(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 return mc(
 rng,
 ctx,
 i,
 "print",
 "The rapid spread of printed books in 15th-16th century Europe most strongly helped",
 "diffuse religious and scientific ideas",
 "end all regional wars",
 "abolish feudalism overnight",
 "isolate monasteries",
 `Printing accelerated circulation of texts across regions.`,
 );
}

export function genScrambleAfrica(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
 return mc(
 rng,
 ctx,
 i,
 "berlin",
 "The late 19th-century European partitioning of African territory is most associated with",
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

/* - - - Pools - - - */

const CALC: QuestionGen[] = [
 genDerivativePower,
 genLimitLinear,
 genIntegralPower,
 genCompositionValue,
 genTrigSpecial,
];

/** Text-only stats items (safe to mix with calculus for numeric literacy). */
const STATS_TEXT: QuestionGen[] = [genMeanSimple, genZScoreConcept];
const STATS_FIG: QuestionGen[] = [genStatsBarChartMode, genStatsExamLineTrend];
const STATS_FULL: QuestionGen[] = [...STATS_TEXT, ...STATS_FIG];

const CS_A: QuestionGen[] = [genBigO, genLoopCount, genBooleanExpr, genCsMass];
const CSP: QuestionGen[] = [genBigO, genLoopCount, genBooleanExpr, genCspListIndex, genCsMass];
const PHYS_ALG: QuestionGen[] = [genKinematicsV, genEnergyKE, genPhysMass];
const PHYS_C: QuestionGen[] = [genKinematicsV, genEnergyKE, genCoulombConcept, genPhysMass];
const CHEM: QuestionGen[] = [genMolarity, genPHScale, genChemConcentrationBarFig, genChemMass];
const BIO: QuestionGen[] = [genDNAbase, genCarryingCapacity, genBioSpeciesTableFig, genBioMass];
const ENV: QuestionGen[] = [genCarryingCapacity, genPHScale];

const HIST_SHARED: QuestionGen[] = [genWW2Turning];
const HIST_GLOBAL: QuestionGen[] = [genPrintingPressSpread, genScrambleAfrica];

const GOV: QuestionGen[] = [
 genAmendmentFreeSpeech,
 genChecksBalances,
 genSeparationOfPowers,
 genFederalismConcept,
 genGovMass,
];

const COMP_GOV: QuestionGen[] = [genRegimeType, genChecksBalances, genNationState, genCompGovMass];

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
 euro: [...HIST_SHARED, ...HIST_GLOBAL],
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
 seminar: [...CAP, ...ENG],
 research: CAP,
};

export function getGeneratorsForCourse(courseId: string, unitIndex: number = 1): QuestionGen[] {
 if (courseId === "wh" && unitIndex >= 1 && unitIndex <= 9) {
 return getWorldHistoryGeneratorsForUnit(unitIndex) as QuestionGen[];
 }
 if (courseId === "hum-geo" && unitIndex >= 1 && unitIndex <= 7) {
 return getHumanGeographyGeneratorsForUnit(unitIndex) as QuestionGen[];
 }
 if (courseId === "ush" && unitIndex >= 1 && unitIndex <= 9) {
 return getUsHistoryGeneratorsForUnit(unitIndex) as QuestionGen[];
 }
 return COURSE_POOL[courseId] ?? DEFAULT_POOL;
}
