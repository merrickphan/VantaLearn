/**
 * Policy: each AP course should register a large set of distinct **sentence structures**
 * (rhetorical skeletons for MCQ stems). Numeric or symbolic parameters (coefficients, labels)
 * do not count as new structures — only the grammatical pattern counts.
 *
 * Expand `stemStructures/` catalogs per course until the minimum is met. Calc AB is the reference.
 */
export const AP_STEM_STRUCTURE_MINIMUM = 1000 as const;

/** Courses with a fully enumerated structure catalog in code (others use generic prompt guidance). */
export const AP_COURSES_WITH_STEM_STRUCTURE_CATALOG: ReadonlySet<string> = new Set(["calc-ab"]);
