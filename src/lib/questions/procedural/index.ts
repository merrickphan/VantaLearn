import { AP_COURSES } from "@/lib/apCatalog";
import { getUnitOrFirst, getUnitsForCourseId } from "@/lib/apUnits";
import type { ExamQuestion } from "@/types";
import { createRng, hashString, proceduralUniqKey, randomSeedEntropy, shuffleInPlace } from "./utils";
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
 const seedBase = `${params.seed ?? randomSeedEntropy()}|calc:${params.calculatorSection ?? "default"}|diff:${diffPolicy}`;

 const isCalcCourse = course.id === "calc-ab" || course.id === "calc-bc";

 const out: ExamQuestion[] = [];
 const n = Math.min(100, Math.max(1, Math.floor(params.count)));

 const seen = new Set<string>();
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
 `slot${i}|g${genIndex}|t${attempt}|${hashString(unit.id)}|${hashString(String(attempt * 9301 + genIndex * 104729))}`,
 );
 const cand = pool[genIndex](rng, ctx, i);
 const key = proceduralUniqKey(cand);
 const struct = cand.procedural_structure_id ?? "";
 const isStructRepeated = struct ? seenStructure.has(struct) : false;
 const acceptable = !avoid.has(key) && !seen.has(key) && !isStructRepeated;
 if (acceptable) {
 seen.add(key);
 if (struct) seenStructure.add(struct);
 q = cand;
 break;
 }
 if (!bestFallback && !avoid.has(key) && !seen.has(key)) bestFallback = cand;
 }
 if (!q) {
 if (bestFallback) {
 q = bestFallback;
 const key = proceduralUniqKey(q);
 const struct = q.procedural_structure_id ?? "";
 seen.add(key);
 if (struct) seenStructure.add(struct);
 } else {
 const genIndex = order[i % order.length];
 const rng = createRng(seedBase, `fallback|${i}|${hashString(unit.id)}|${i * 9973}|${hashString("fb")}`);
 q = pool[genIndex](rng, ctx, i);
 }
 }
 out.push(q);
 }

 return out;
}
