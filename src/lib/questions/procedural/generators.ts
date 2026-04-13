import type { ExamQuestion, ExamFigure } from "@/types";
import { makeQuestionId, pick, randInt, round, shuffle } from "./utils";

function mc(
  subject: string,
  salt: number,
  stem: string,
  correct: string,
  wrong: string[],
  explanation: string,
  figure?: ExamFigure
): ExamQuestion {
  const opts = shuffle([correct, ...wrong], salt);
  return {
    id: makeQuestionId("mc", salt),
    subject,
    type: "multiple_choice",
    question: stem,
    options: opts,
    correct_answer: correct,
    explanation,
    ...(figure ? { figure } : {}),
  };
}

/* ---------- Calculus / Precalc ---------- */
export function genDerivativeAtPoint(s: number, subject: string): ExamQuestion {
  const a = randInt(2, 9, s);
  const c2 = randInt(2, 5, s);
  const c1 = randInt(1, 8, s);
  const c0 = randInt(0, 6, s);
  const fp = 2 * c2 * a + c1;
  const correct = String(fp);
  return mc(
    subject,
    s,
    `If f(x) = ${c2}x² + ${c1}x + ${c0}, what is f'(${a})?`,
    correct,
    [String(2 * c2 * a + c0), String(c2 * a * a + c1), String(4 * c2 * a)],
    `f'(x) = ${2 * c2}x + ${c1}, so f'(${a}) = ${2 * c2}·${a} + ${c1} = ${fp}.`,
  );
}

export function genPowerRule(s: number, subject: string): ExamQuestion {
  const n = randInt(2, 8, s);
  const c = randInt(1, 6, s + 3);
  const coeff = randInt(2, 7, s + 5);
  const correct = `${coeff * n}x^${n - 1}`;
  const wrong = [
    `${coeff}x^${n - 1}`,
    `${coeff * n}x^${n + 1}`,
    `${coeff + n}x^${n - 1}`,
  ];
  return mc(
    subject,
    s,
    `What is the derivative of ${coeff}x^${n} with respect to x?`,
    correct,
    wrong,
    `Power rule: d/dx(cx^n) = ${coeff * n}x^${n - 1}.`,
  );
}

export function genChainSimple(s: number, subject: string): ExamQuestion {
  const a = randInt(2, 4, s);
  const b = randInt(1, 5, s + 1);
  const p = randInt(2, 4, s + 2);
  const coef = p * a;
  const inner = `${a}x + ${b}`;
  const correct = `${coef}(${inner})^${p - 1}`;
  return mc(
    subject,
    s,
    `If y = (${inner})^${p}, what is dy/dx?`,
    correct,
    [
      `${p}(${inner})^${p - 1}`,
      `${coef}(${inner})^${p}`,
      `${a + p}(${inner})^${p - 1}`,
    ],
    `Chain rule: dy/dx = ${p}·${a}·(${inner})^${p - 1} = ${correct}.`,
  );
}

/* ---------- Statistics ---------- */
export function genMeanFromTable(s: number, subject: string): ExamQuestion {
  const base = randInt(10, 40, s);
  const vals = [base, base + randInt(2, 8, s), base + randInt(10, 20, s), base + randInt(1, 6, s), base + randInt(3, 12, s)];
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  const correct = round(mean, 2);
  const fig: ExamFigure = {
    kind: "table",
    title: "Sample measurements",
    headers: ["Trial", "Value"],
    rows: vals.map((v, i) => [`${i + 1}`, String(v)]),
  };
  return mc(
    subject,
    s,
    "What is the mean of the values in the table?",
    correct,
    [round(mean + 3, 2), round(mean - 3, 2), round(mean + 1.5, 2)],
    `Mean = sum / n = ${vals.join("+")} / 5 ≈ ${correct}.`,
    fig,
  );
}

export function genMedianSmallSet(s: number, subject: string): ExamQuestion {
  const arr = shuffle(
    [randInt(1, 9, s), randInt(10, 19, s), randInt(20, 29, s), randInt(30, 39, s), randInt(40, 50, s)],
    s
  ).sort((a, b) => a - b);
  const median = arr[2];
  return mc(
    subject,
    s,
    `The sorted data set is {${arr.join(", ")}}. What is the median?`,
    String(median),
    [String(arr[1]), String(arr[3]), String((arr[0] + arr[4]) / 2)],
    "With 5 values, the median is the 3rd value when sorted.",
  );
}

/* ---------- Physics (kinematics) ---------- */
export function genKinematicsTime(s: number, subject: string): ExamQuestion {
  const v0 = randInt(5, 15, s);
  const a = randInt(1, 4, s);
  const t = randInt(2, 8, s);
  const v = v0 + a * t;
  return mc(
    subject,
    s,
    `A particle moves along a line with initial velocity ${v0} m/s and constant acceleration ${a} m/s². What is its velocity after ${t} s?`,
    `${v} m/s`,
    [`${v + randInt(1, 4, s)} m/s`, `${Math.max(0, v - randInt(2, 5, s))} m/s`, `${v0 * t} m/s`],
    `v = v₀ + at = ${v0} + (${a})(${t}) = ${v} m/s.`,
  );
}

export function genDisplacement(s: number, subject: string): ExamQuestion {
  const v0 = randInt(0, 10, s);
  const a = randInt(2, 6, s);
  const t = randInt(1, 5, s);
  const x = v0 * t + 0.5 * a * t * t;
  const correct = round(x, 2);
  return mc(
    subject,
    s,
    `Starting from rest at x=0, an object has v₀ = ${v0} m/s and a = ${a} m/s² for t = ${t} s. What is displacement Δx?`,
    correct,
    [round(v0 * t, 2), round(0.5 * a * t, 2), round(a * t * t, 2)],
    `Δx = v₀t + ½at² = ${v0}·${t} + ½(${a})(${t})² ≈ ${correct}.`,
  );
}

/* ---------- Chemistry ---------- */
export function genMolarityDilution(s: number, subject: string): ExamQuestion {
  const M1 = randInt(1, 5, s) * 0.5;
  const V1 = randInt(2, 10, s);
  const V2 = V1 + randInt(5, 20, s);
  const M2 = (M1 * V1) / V2;
  const correct = round(M2, 3);
  return mc(
    subject,
    s,
    `Using M₁V₁ = M₂V₂, a ${M1} M solution (${V1} mL) is diluted to ${V2} mL. What is M₂ (M)?`,
    correct,
    [round(M1 * V2 / V1, 3), round(M1 + M2, 3), round(V2 / (M1 * V1), 3)],
    `M₂ = M₁V₁/V₂ = (${M1})(${V1})/${V2} ≈ ${correct} M.`,
  );
}

/* ---------- Economics (simple) ---------- */
export function genElasticityMidpoint(s: number, subject: string): ExamQuestion {
  const p1 = randInt(4, 12, s);
  const p2 = p1 + randInt(1, 4, s);
  const q1 = randInt(20, 40, s);
  const q2 = q1 - randInt(2, 8, s);
  const ed =
    (Math.abs((q2 - q1) / ((q1 + q2) / 2)) / Math.abs((p2 - p1) / ((p1 + p2) / 2)));
  const absEd = Math.abs(ed);
  const correct = round(absEd, 2);
  return mc(
    subject,
    s,
    `Price rises from $${p1} to $${p2} and quantity falls from ${q1} to ${q2}. Using the midpoint formula, what is |price elasticity of demand|?`,
    correct,
    [round(absEd + 0.4, 2), round(Math.max(0.1, absEd - 0.35), 2), round((p2 - p1) / p1, 2)],
    "Midpoint elasticity: |(ΔQ/Q̄)/(ΔP/P̄)| with averages in denominators.",
  );
}

/* ---------- Generic / humanities-ish (fixed templates) ---------- */
const FALLACIES = [
  {
    name: "straw man",
    def: "Misrepresenting an opponent's argument to make it easier to attack.",
  },
  { name: "ad hominem", def: "Attacking the person rather than the argument." },
  { name: "false dilemma", def: "Presenting only two options when more exist." },
  { name: "hasty generalization", def: "A conclusion from insufficient evidence." },
];

export function genFallacy(s: number, subject: string): ExamQuestion {
  const f = FALLACIES[s % FALLACIES.length];
  const wrong = shuffle(
    FALLACIES.filter((x) => x.name !== f.name).map((x) => x.name),
    s
  ).slice(0, 3);
  return mc(
    subject,
    s,
    `Which fallacy best matches: "${f.def}"`,
    f.name,
    wrong,
    `This describes a ${f.name}.`,
  );
}

export function genPercentChange(s: number, subject: string): ExamQuestion {
  const oldV = randInt(50, 200, s);
  const pct = randInt(5, 25, s);
  const newV = oldV * (1 + pct / 100);
  const correct = round(newV, 2);
  return mc(
    subject,
    s,
    `A quantity starts at ${oldV} and increases by exactly ${pct}%. What is the new value?`,
    correct,
    [round(oldV + pct, 2), round(oldV * pct, 2), round(oldV / (1 + pct / 100), 2)],
    `New = ${oldV} × (1 + ${pct}/100) ≈ ${correct}.`,
  );
}
