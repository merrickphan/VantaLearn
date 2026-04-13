import type { ApCourse } from "@/lib/apCatalog";
import { AP_COURSES } from "@/lib/apCatalog";

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

/* - - - Coarser 'category' buckets (study / AI unit browser) - - - */

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
