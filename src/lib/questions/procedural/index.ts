import { AP_COURSES } from "@/lib/apCatalog";
import { getUnitOrFirst } from "@/lib/apUnits";
import type { ExamQuestion } from "@/types";
import { createRng, hashString, proceduralQuestionFingerprint, randomSeedEntropy, shuffleInPlace } from "./utils";
import { getGeneratorsForCourse, type ProcCtx } from "./generators";

export interface GenerateProceduralParams {
 courseId: string;
 unitId?: string | null;
 count: number;
 /** Optional seed for reproducible sets (defaults to random per request). */
 seed?: string;
 /** Fingerprints to avoid returning (e.g., already seen by the user). */
 avoidFingerprints?: ReadonlySet<string>;
}

export function generateProceduralQuestions(params: GenerateProceduralParams): ExamQuestion[] {
 const course = AP_COURSES.find((c) => c.id === params.courseId);
 if (!course) {
 throw new Error(`Unknown course: ${params.courseId}`);
 }

 const unit = getUnitOrFirst(params.courseId, params.unitId);
 if (!unit) {
 throw new Error(`No units defined for course: ${params.courseId}`);
 }

 const seedBase = params.seed ?? randomSeedEntropy();

 const ctx: ProcCtx = {
 courseId: course.id,
 courseName: course.name,
 unitId: unit.id,
 unitIndex: unit.index,
 unitTitle: unit.title,
 seedBase,
 };

 const pool = getGeneratorsForCourse(course.id, unit.index);
 const out: ExamQuestion[] = [];
 const n = Math.min(100, Math.max(1, Math.floor(params.count)));

 /** Stratified rotation through generators + deduped content fingerprints (stem + answer + figure). */
 const order = shuffleInPlace(createRng(seedBase, `strat|${course.id}|${unit.id}`), [...Array(pool.length).keys()]);
 const seen = new Set<string>();
 const seenStructure = new Set<string>();
 const avoid = params.avoidFingerprints ?? new Set<string>();

 const MAX_ATTEMPTS = 512;

 for (let i = 0; i < n; i++) {
 let q: ExamQuestion | undefined;
  let bestFallback: ExamQuestion | undefined;
 for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
 const genIndex = order[(i + attempt) % order.length];
 const rng = createRng(
 seedBase,
 `slot${i}|g${genIndex}|t${attempt}|${hashString(unit.id)}|${hashString(String(attempt * 9301 + genIndex * 104729))}`,
 );
 const cand = pool[genIndex](rng, ctx, i);
 const fp = proceduralQuestionFingerprint(cand);
   const struct = cand.procedural_structure_id ?? "";
   const isStructRepeated = struct ? seenStructure.has(struct) : false;
   const acceptable = !avoid.has(fp) && !seen.has(fp) && !isStructRepeated;
   if (acceptable) {
 seen.add(fp);
    if (struct) seenStructure.add(struct);
 q = cand;
 break;
 }
   // Keep a fallback that at least avoids exact repeats, even if structure repeats.
   if (!bestFallback && !avoid.has(fp) && !seen.has(fp)) bestFallback = cand;
 }
 if (!q) {
   // Prefer any candidate that avoids repeats even if sentence structure repeats.
   if (bestFallback) {
    q = bestFallback;
    const fp = proceduralQuestionFingerprint(q);
    const struct = q.procedural_structure_id ?? "";
    seen.add(fp);
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
