import { AP_COURSES } from "@/lib/apCatalog";
import { getUnitOrFirst } from "@/lib/apUnits";
import type { ExamQuestion } from "@/types";
import { createRng, hashString } from "./utils";
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

  const pool = getGeneratorsForCourse(course.id);
  const out: ExamQuestion[] = [];
  const n = Math.min(100, Math.max(1, Math.floor(params.count)));

  for (let i = 0; i < n; i++) {
    const rng = createRng(seedBase, `${i}-${hashString(unit.id)}`);
    const pick = pool[Math.floor(rng() * pool.length)] ?? pool[0];
    out.push(pick(rng, ctx, i));
  }

  return out;
}
