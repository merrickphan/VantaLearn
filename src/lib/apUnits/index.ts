import { AP_COURSES } from "@/lib/apCatalog";
import { AP_UNITS_BY_COURSE_ID } from "./courseUnits";
import type { ApUnit } from "./types";

export type { ApUnit } from "./types";
export { AP_UNITS_BY_COURSE_ID } from "./courseUnits";

export function getUnitsForCourseId(courseId: string): ApUnit[] {
 return AP_UNITS_BY_COURSE_ID[courseId] ?? [];
}

/** Resolve catalog id (e.g. calc-ab) from display name (e.g. AP Calculus AB). */
export function getCourseIdFromSubjectName(subjectName: string): string | undefined {
 return AP_COURSES.find((c) => c.name === subjectName)?.id;
}

export function findUnitById(unitId: string): { courseId: string; courseName: string; unit: ApUnit } | null {
 for (const c of AP_COURSES) {
 const units = AP_UNITS_BY_COURSE_ID[c.id];
 if (!units) continue;
 const unit = units.find((u) => u.id === unitId);
 if (unit) return { courseId: c.id, courseName: c.name, unit };
 }
 return null;
}

/** All units flattened with course metadata (for pickers). */
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

export function getUnitOrFirst(courseId: string, unitId?: string | null): ApUnit | undefined {
 const units = getUnitsForCourseId(courseId);
 if (units.length === 0) return undefined;
 if (!unitId) return units[0];
 return units.find((u) => u.id === unitId) ?? units[0];
}
