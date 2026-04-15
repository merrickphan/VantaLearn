import { AP_COURSES } from "@/lib/apCatalog";

export type SubjectSearchHit = {
	name: string;
	short: string;
	href: string;
};

/** AP® courses for global search (study library filter). */
export function listSubjectSearchHits(): SubjectSearchHit[] {
	return AP_COURSES.map((c) => ({
		name: c.name,
		short: c.short,
		href: `/study?subject=${encodeURIComponent(c.name)}`,
	}));
}
