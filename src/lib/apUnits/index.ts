import { AP_COURSES } from "@/lib/apCatalog";
import type { ApUnit } from "./types";
import { AP_UNITS_BY_COURSE_ID } from "./registry";

export type { ApUnit } from "./types";
export { AP_UNITS_BY_COURSE_ID } from "./registry";

export function getUnitsForCourseId(courseId: string): ApUnit[] {
  return AP_UNITS_BY_COURSE_ID[courseId] ?? [];
}

/** Resolve catalog id (e.g. calc-ab) from display name (e.g. AP Calculus AB) */
export function getCourseIdFromSubjectName(subjectName: string): string | undefined {
  return AP_COURSES.find((c) => c.name === subjectName)?.id;
}

export function findUnitById(unitId: string): { courseId: string; courseName: string; unit: ApUnit } | null {
  for (const course of AP_COURSES) {
    const units = AP_UNITS_BY_COURSE_ID[course.id];
    if (!units) continue;
    const unit = units.find((u) => u.id === unitId);
    if (unit) return { courseId: course.id, courseName: course.name, unit };
  }
  return null;
}

/** All units flattened with course metadata (for pickers) */
export function listAllUnitsWithCourses(): { courseId: string; courseName: string; unit: ApUnit }[] {
  const out: { courseId: string; courseName: string; unit: ApUnit }[] = [];
  for (const course of AP_COURSES) {
    const units = AP_UNITS_BY_COURSE_ID[course.id];
    if (!units) continue;
    for (const unit of units) {
      out.push({ courseId: course.id, courseName: course.name, unit });
    }
  }
  return out;
}
