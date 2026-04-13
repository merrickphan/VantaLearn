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

 const MAX_ATTEMPTS = 512;

 for (let i = 0; i < n; i++) {
 let q: ExamQuestion | undefined;
 for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
 const genIndex = order[(i + attempt) % order.length];
 const rng = createRng(
 seedBase,
 `slot${i}|g${genIndex}|t${attempt}|${hashString(unit.id)}|${hashString(String(attempt * 9301 + genIndex * 104729))}`,
 );
 const cand = pool[genIndex](rng, ctx, i);
 const fp = proceduralQuestionFingerprint(cand);
 if (!seen.has(fp)) {
 seen.add(fp);
 q = cand;
 break;
 }
 }
 if (!q) {
 const genIndex = order[i % order.length];
 const rng = createRng(seedBase, `fallback|${i}|${hashString(unit.id)}|${i * 9973}|${hashString("fb")}`);
 q = pool[genIndex](rng, ctx, i);
 }
 out.push(q);
 }

 return out;
}
