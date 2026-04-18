import { AP_COURSES } from "@/lib/apCatalog";
import { getUnitOrFirst, getUnitsForCourseId } from "@/lib/apUnits";
import type { ExamQuestion } from "@/types";
import {
	calculusMcqGraphBatchKey,
	createRng,
	hashString,
	isQuestionAvoidedBySet,
	proceduralUniqKey,
	questionReadDedupKey,
	randomSeedEntropy,
	shuffleInPlace,
} from "./utils";
import { getGeneratorsForCourse, type CalculatorSectionPolicy, type ProcCtx } from "./generators";

export type { CalculatorSectionPolicy };

/** Client / API difficulty policy; `random` picks easy/medium/hard per question from the seed. */
export type ProceduralDifficulty = "random" | "easy" | "medium" | "hard";

export interface GenerateProceduralParams {
 courseId: string;
 unitId?: string | null;
 count: number;
 /** Optional seed for reproducible sets (defaults to random per request). */
 seed?: string;
 /** Uniqueness keys to avoid returning (e.g., already seen by the user). */
 avoidKeys?: ReadonlySet<string>;
 /** Calc AB/BC only: AP-style no-calculator vs calculator-allowed MCQ pools and numerics. */
 calculatorSection?: CalculatorSectionPolicy;
 /** Controls numeric ranges and template weighting for supported generators. */
 difficulty?: ProceduralDifficulty;
}

function resolveDifficultyTier(
 seedBase: string,
 slotIndex: number,
 policy: ProceduralDifficulty | undefined,
): "easy" | "medium" | "hard" {
 if (policy === "easy" || policy === "medium" || policy === "hard") return policy;
 const r = createRng(seedBase, `diffTier|${slotIndex}`)();
 if (r < 0.34) return "easy";
 if (r < 0.67) return "medium";
 return "hard";
}

export function generateProceduralQuestions(params: GenerateProceduralParams): ExamQuestion[] {
 const course = AP_COURSES.find((c) => c.id === params.courseId);
 if (!course) {
 throw new Error(`Unknown course: ${params.courseId}`);
 }

 const unitsList = getUnitsForCourseId(params.courseId);
 if (unitsList.length === 0) {
 throw new Error(`No units defined for course: ${params.courseId}`);
 }

 const allUnits = params.unitId === "all";
 const fixedUnit = allUnits ? undefined : getUnitOrFirst(params.courseId, params.unitId);
 if (!allUnits && !fixedUnit) {
 throw new Error(`No units defined for course: ${params.courseId}`);
 }

 const diffPolicy = params.difficulty ?? "medium";
 /** Always lead with fresh entropy so two requests never share the same RNG stream unless explicitly reproducible. */
 const seedBase = `${randomSeedEntropy()}|${randomSeedEntropy()}|${params.seed ?? ""}|calc:${params.calculatorSection ?? "default"}|diff:${diffPolicy}`;

 const isCalcCourse = course.id === "calc-ab" || course.id === "calc-bc";

 const out: ExamQuestion[] = [];
 const n = Math.min(100, Math.max(1, Math.floor(params.count)));

 /** Precise + “same reading” keys already emitted in this batch. */
 const placedFingerprints = new Set<string>();
 /** Calc AB/BC: avoid two MCQs in one set sharing the same rendered graph geometry. */
 const placedGraphKeys = new Set<string>();
 const seenStructure = new Set<string>();
 const avoid = params.avoidKeys ?? new Set<string>();

 const MAX_ATTEMPTS = 512;

 for (let i = 0; i < n; i++) {
 const unit = allUnits
 ? unitsList[Math.floor(createRng(seedBase, `unitPick|${i}`)() * unitsList.length)]
 : fixedUnit!;

 const difficultyTier = resolveDifficultyTier(seedBase, i, diffPolicy);

 const calculatorAllowed =
  isCalcCourse && params.calculatorSection === "no_calculator"
   ? false
   : isCalcCourse && params.calculatorSection === "calculator"
    ? true
    : undefined;

 const ctx: ProcCtx = {
 courseId: course.id,
 courseName: course.name,
 unitId: unit.id,
 unitIndex: unit.index,
 unitTitle: unit.title,
 seedBase,
 difficulty: difficultyTier,
 ...(calculatorAllowed !== undefined ? { calculatorAllowed } : {}),
 };

 const pool = getGeneratorsForCourse(
 course.id,
 unit.index,
 isCalcCourse ? params.calculatorSection : undefined,
 );

 /** Stratified rotation through generators + deduped content fingerprints (stem + answer + figure). */
 const order = shuffleInPlace(
 createRng(seedBase, `strat|${course.id}|${unit.id}|slot${i}`),
 [...Array(pool.length).keys()],
 );

 let q: ExamQuestion | undefined;
 let bestFallback: ExamQuestion | undefined;
 for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
 const genIndex = order[(i + attempt) % order.length];
 const rng = createRng(
 seedBase,
 `slot${i}|g${genIndex}|t${attempt}|${randomSeedEntropy()}|${hashString(unit.id)}|${hashString(String(attempt * 9301 + genIndex * 104729))}`,
 );
 const cand = pool[genIndex](rng, ctx, i);
 const key = proceduralUniqKey(cand);
 const readKey = questionReadDedupKey(cand);
 const graphKey = calculusMcqGraphBatchKey(cand.figure);
 const struct = cand.procedural_structure_id ?? "";
 const structOk = !struct || !seenStructure.has(struct);
 const graphOk = !isCalcCourse || !graphKey || !placedGraphKeys.has(graphKey);
 const acceptable =
 structOk &&
 graphOk &&
 !isQuestionAvoidedBySet(cand, avoid) &&
 !placedFingerprints.has(key) &&
 !placedFingerprints.has(readKey);
 if (acceptable) {
 placedFingerprints.add(key);
 placedFingerprints.add(readKey);
 if (graphKey) placedGraphKeys.add(graphKey);
 if (struct) seenStructure.add(struct);
 q = cand;
 break;
 }
 const fallbackOk =
 structOk &&
 graphOk &&
 !isQuestionAvoidedBySet(cand, avoid) &&
 !placedFingerprints.has(key) &&
 !placedFingerprints.has(readKey);
 if (!bestFallback && fallbackOk) bestFallback = cand;
 }
 if (!q) {
 if (bestFallback) {
 q = bestFallback;
 const key = proceduralUniqKey(q);
 const readKey = questionReadDedupKey(q);
 const graphKeyBf = calculusMcqGraphBatchKey(q.figure);
 placedFingerprints.add(key);
 placedFingerprints.add(readKey);
 if (graphKeyBf) placedGraphKeys.add(graphKeyBf);
 const struct = q.procedural_structure_id ?? "";
 if (struct) seenStructure.add(struct);
 } else {
 let picked: ExamQuestion | undefined;
 for (let fb = 0; fb < 360; fb++) {
 const genIndex = order[(i + fb) % order.length];
 const rng = createRng(`${seedBase}|fb${fb}`, `${randomSeedEntropy()}|${hashString(unit.id)}|${i}`);
 const cand = pool[genIndex](rng, ctx, i);
 const key = proceduralUniqKey(cand);
 const readKey = questionReadDedupKey(cand);
 const graphKeyFb = calculusMcqGraphBatchKey(cand.figure);
 const struct = cand.procedural_structure_id ?? "";
 const structOk = !struct || !seenStructure.has(struct);
 const graphOkFb = !isCalcCourse || !graphKeyFb || !placedGraphKeys.has(graphKeyFb);
 const ok =
 graphOkFb &&
 !isQuestionAvoidedBySet(cand, avoid) &&
 !placedFingerprints.has(key) &&
 !placedFingerprints.has(readKey) &&
 structOk;
 if (ok) {
 picked = cand;
 placedFingerprints.add(key);
 placedFingerprints.add(readKey);
 if (graphKeyFb) placedGraphKeys.add(graphKeyFb);
 if (struct) seenStructure.add(struct);
 break;
 }
 }
 if (!picked) {
 for (let lr = 0; lr < 200; lr++) {
 const genIndex = order[(i + lr) % order.length];
 const rng = createRng(randomSeedEntropy(), `lastresort|${i}|lr${lr}|${randomSeedEntropy()}`);
 const cand = pool[genIndex](rng, ctx, i);
 const key = proceduralUniqKey(cand);
 const readKey = questionReadDedupKey(cand);
 const graphKeyLr = calculusMcqGraphBatchKey(cand.figure);
 const struct = cand.procedural_structure_id ?? "";
 const structOk = !struct || !seenStructure.has(struct);
 const graphOkLr = !isCalcCourse || !graphKeyLr || !placedGraphKeys.has(graphKeyLr);
 if (
 graphOkLr &&
 !isQuestionAvoidedBySet(cand, avoid) &&
 !placedFingerprints.has(key) &&
 !placedFingerprints.has(readKey) &&
 structOk
 ) {
 picked = cand;
 placedFingerprints.add(key);
 placedFingerprints.add(readKey);
 if (graphKeyLr) placedGraphKeys.add(graphKeyLr);
 if (struct) seenStructure.add(struct);
 break;
 }
 }
 }
 if (!picked) {
 const genIndex = order[i % order.length];
 const rng = createRng(randomSeedEntropy(), `lastresort|${i}|${randomSeedEntropy()}`);
 picked = pool[genIndex](rng, ctx, i);
 const key = proceduralUniqKey(picked);
 const readKey = questionReadDedupKey(picked);
 const graphKeyLast = calculusMcqGraphBatchKey(picked.figure);
 placedFingerprints.add(key);
 placedFingerprints.add(readKey);
 if (graphKeyLast) placedGraphKeys.add(graphKeyLast);
 const struct = picked.procedural_structure_id ?? "";
 if (struct) seenStructure.add(struct);
 }
 q = picked;
 }
 }
 out.push(q);
 }

 return out;
}
