import { AP_COURSES } from "@/lib/apCatalog";
import { getUnitOrFirst } from "@/lib/apUnits";
import type { ExamQuestion } from "@/types";
import { createRng, hashString, shuffleInPlace } from "./utils";
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

 const seedBase =
 params.seed ??
 `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

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

 /** Stratified rotation through generators + deduped stems so a session rarely repeats the same prompt. */
 const order = shuffleInPlace(createRng(seedBase, `strat|${course.id}|${unit.id}`), [...Array(pool.length).keys()]);
 const seenStems = new Set<string>();

 for (let i = 0; i < n; i++) {
 let q: ExamQuestion | undefined;
 for (let attempt = 0; attempt < 72; attempt++) {
 const genIndex = order[(i + attempt) % order.length];
 const rng = createRng(seedBase, `slot${i}|g${genIndex}|t${attempt}|${hashString(unit.id)}`);
 const cand = pool[genIndex](rng, ctx, i);
 const stem = cand.question.trim();
 if (!seenStems.has(stem)) {
 seenStems.add(stem);
 q = cand;
 break;
 }
 }
 if (!q) {
 const genIndex = order[i % order.length];
 const rng = createRng(seedBase, `fallback|${i}|${hashString(unit.id)}|${i * 9973}`);
 q = pool[genIndex](rng, ctx, i);
 }
 out.push(q);
 }

 return out;
}
