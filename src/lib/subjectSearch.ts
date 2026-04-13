import { AP_COURSES } from "@/lib/apCatalog";
import { SAT_SUBJECTS } from "@/lib/utils";

export type SubjectSearchHit = {
	name: string;
	short: string;
	href: string;
};

/** AP® courses and SAT subjects for global search (study library filter). */
export function listSubjectSearchHits(): SubjectSearchHit[] {
	return [
		...AP_COURSES.map((c) => ({
			name: c.name,
			short: c.short,
			href: `/study?subject=${encodeURIComponent(c.name)}`,
		})),
		...SAT_SUBJECTS.map((name) => ({
			name,
			short: "Digital SAT®",
			href: `/study?subject=${encodeURIComponent(name)}`,
		})),
	];
}
