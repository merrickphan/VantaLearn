import type { ApCourse } from "@/lib/apCatalog";
import { AP_COURSES } from "@/lib/apCatalog";

/** Broad groupings for browsing AP courses (study library, AI units picker). */
export type ApCategoryId =
  | "math"
  | "science"
  | "engineering"
  | "social-studies"
  | "language"
  | "business"
  | "arts"
  | "capstone";

export interface ApCategoryMeta {
  id: ApCategoryId;
  label: string;
  short: string;
}

export const AP_CATEGORY_ORDER: ApCategoryMeta[] = [
  { id: "math", label: "Math", short: "Calculus, precalc, statistics" },
  { id: "science", label: "Science", short: "Biology, chemistry, environmental, intro physics" },
  { id: "engineering", label: "Engineering & CS", short: "Physics C, computer science, programming" },
  { id: "social-studies", label: "Social studies", short: "History, government, geography, psychology" },
  { id: "language", label: "Language & literature", short: "English, world languages, composition" },
  { id: "business", label: "Business & economics", short: "Micro, macro" },
  { id: "arts", label: "Arts & music", short: "Art history, studio art, music theory" },
  { id: "capstone", label: "Capstone", short: "Seminar & research" },
];

const COURSE_TO_CATEGORY: Record<string, ApCategoryId> = {
  "calc-ab": "math",
  "calc-bc": "math",
  precalc: "math",
  stats: "math",
  "physics-1": "science",
  "physics-2": "science",
  chem: "science",
  bio: "science",
  env: "science",
  "physics-c-m": "engineering",
  "physics-c-em": "engineering",
  "cs-a": "engineering",
  csp: "engineering",
  ush: "social-studies",
  wh: "social-studies",
  euro: "social-studies",
  gov: "social-studies",
  "comp-gov": "social-studies",
  "hum-geo": "social-studies",
  psych: "social-studies",
  lang: "language",
  lit: "language",
  spanish: "language",
  french: "language",
  german: "language",
  latin: "language",
  chinese: "language",
  japanese: "language",
  macro: "business",
  micro: "business",
  "art-hist": "arts",
  "art-design": "arts",
  music: "arts",
  seminar: "capstone",
  research: "capstone",
};

export function getCategoryIdForCourse(courseId: string): ApCategoryId {
  return COURSE_TO_CATEGORY[courseId] ?? "math";
}

/** Courses grouped by category, in category order; each list follows `AP_COURSES` order. */
export function getCoursesGroupedByCategory(): Record<ApCategoryId, ApCourse[]> {
  const out = {} as Record<ApCategoryId, ApCourse[]>;
  for (const meta of AP_CATEGORY_ORDER) {
    out[meta.id] = [];
  }
  for (const c of AP_COURSES) {
    const cat = getCategoryIdForCourse(c.id);
    out[cat].push(c);
  }
  return out;
}

export function getCategoryMeta(id: ApCategoryId): ApCategoryMeta | undefined {
  return AP_CATEGORY_ORDER.find((x) => x.id === id);
}
