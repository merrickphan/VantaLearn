import type { ApCourse } from "@/lib/apCatalog";

/** High-level navigation buckets for AP courses (not CB exam sections). */
export type ApSectionId =
  | "math"
  | "computer_science"
  | "sciences"
  | "engineering_physics"
  | "social_studies"
  | "business_economics"
  | "psychology"
  | "english"
  | "arts_music"
  | "world_languages"
  | "capstone";

export interface ApSection {
  id: ApSectionId;
  label: string;
  description: string;
}

export const AP_SECTIONS: ApSection[] = [
  { id: "math", label: "Mathematics & statistics", description: "Calculus, precalculus, and AP Statistics." },
  { id: "computer_science", label: "Computer science", description: "CSA and Computer Science Principles." },
  { id: "sciences", label: "Sciences", description: "Introductory physics, chemistry, biology, and environmental science." },
  {
    id: "engineering_physics",
    label: "Engineering & advanced physics",
    description: "Calculus-based mechanics and electricity & magnetism.",
  },
  { id: "social_studies", label: "Social studies", description: "History, government, comparative politics, and human geography." },
  { id: "business_economics", label: "Business & economics", description: "Macroeconomics and microeconomics." },
  { id: "psychology", label: "Psychology", description: "AP Psychology." },
  { id: "english", label: "English", description: "Language and Literature." },
  { id: "arts_music", label: "Arts & music", description: "Art History, Art and Design, and Music Theory." },
  { id: "world_languages", label: "World languages", description: "Modern and classical languages." },
  { id: "capstone", label: "Capstone", description: "AP Seminar and AP Research." },
];

const COURSE_TO_SECTION: Record<string, ApSectionId> = {
  "calc-ab": "math",
  "calc-bc": "math",
  precalc: "math",
  stats: "math",
  "cs-a": "computer_science",
  csp: "computer_science",
  "physics-1": "sciences",
  "physics-2": "sciences",
  chem: "sciences",
  bio: "sciences",
  env: "sciences",
  "physics-c-m": "engineering_physics",
  "physics-c-em": "engineering_physics",
  ush: "social_studies",
  wh: "social_studies",
  euro: "social_studies",
  gov: "social_studies",
  "comp-gov": "social_studies",
  "hum-geo": "social_studies",
  macro: "business_economics",
  micro: "business_economics",
  psych: "psychology",
  lang: "english",
  lit: "english",
  "art-hist": "arts_music",
  "art-design": "arts_music",
  music: "arts_music",
  spanish: "world_languages",
  french: "world_languages",
  german: "world_languages",
  latin: "world_languages",
  chinese: "world_languages",
  japanese: "world_languages",
  seminar: "capstone",
  research: "capstone",
};

export function getSectionIdForCourseId(courseId: string): ApSectionId | undefined {
  return COURSE_TO_SECTION[courseId];
}

export function getCoursesInSection(sectionId: ApSectionId, courses: ApCourse[]): ApCourse[] {
  return courses.filter((c) => COURSE_TO_SECTION[c.id] === sectionId);
}

export const AP_SECTION_ORDER: ApSectionId[] = AP_SECTIONS.map((s) => s.id);
