import { AP_COURSES } from "@/lib/apCatalog";
import { AP_UNITS_BY_COURSE_ID } from "./courseUnits";
import type { ApUnit } from "./types";

export type { ApUnit } from "./types";
export { AP_UNITS_BY_COURSE_ID } from "./courseUnits";

export function getUnitsForCourseId(courseId: string): ApUnit[] {
  return AP_UNITS_BY_COURSE_ID[courseId] ?? [];
}

export function findUnitById(unitId: string): { courseId: string; unit: ApUnit } | undefined {
  for (const c of AP_COURSES) {
    const units = AP_UNITS_BY_COURSE_ID[c.id];
    if (!units) continue;
    const unit = units.find((u) => u.id === unitId);
    if (unit) return { courseId: c.id, unit };
  }
  return undefined;
}

export function getUnitOrFirst(courseId: string, unitId?: string | null): ApUnit | undefined {
  const units = getUnitsForCourseId(courseId);
  if (units.length === 0) return undefined;
  if (!unitId) return units[0];
  return units.find((u) => u.id === unitId) ?? units[0];
}
