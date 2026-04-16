import { AP_STEM_STRUCTURE_MINIMUM } from "./apStemStructurePolicy";
import { getCalcAbSentenceStructure } from "./calcAbSentenceStructures";
import { getCalcBcSentenceStructure } from "./calcBcSentenceStructures";
import { getPrecalcSentenceStructure } from "./precalcSentenceStructures";

/**
 * Extra prompt lines forcing rhetorical variety for AI-assembled MCQs.
 * For courses with an explicit catalog, injects one concrete skeleton per item (deterministic from seed).
 */
export function getApCourseStemStructureDirective(courseId: string, seed: number): string {
	if (courseId === "calc-ab") {
		const skeleton = getCalcAbSentenceStructure(seed);
		return [
			`STEM SKELETON (${AP_STEM_STRUCTURE_MINIMUM}+ registered patterns; index from seed):`,
			`Use this grammatical pattern as the stem’s rhetorical frame (adapt the skill to the unit and stimulus; keep the opening + task shape):`,
			`"${skeleton}"`,
			`Do not copy placeholder labels literally if they conflict with the stimulus; preserve the sentence architecture.`,
		].join("\n");
	}
	if (courseId === "calc-bc") {
		const skeleton = getCalcBcSentenceStructure(seed);
		return [
			`STEM SKELETON (${AP_STEM_STRUCTURE_MINIMUM}+ registered patterns; index from seed):`,
			`Use this grammatical pattern as the stem’s rhetorical frame (adapt the skill to the unit and stimulus; keep the opening + task shape):`,
			`"${skeleton}"`,
			`Do not copy placeholder labels literally if they conflict with the stimulus; preserve the sentence architecture.`,
		].join("\n");
	}
	if (courseId === "precalc") {
		const skeleton = getPrecalcSentenceStructure(seed);
		return [
			`STEM SKELETON (${AP_STEM_STRUCTURE_MINIMUM}+ registered patterns; index from seed):`,
			`Use this grammatical pattern as the stem’s rhetorical frame (adapt the skill to the unit and stimulus; keep the opening + task shape):`,
			`"${skeleton}"`,
			`Do not copy placeholder labels literally if they conflict with the stimulus; preserve the sentence architecture.`,
		].join("\n");
	}

	return [
		`STEM STRUCTURE TARGET: register at least ${AP_STEM_STRUCTURE_MINIMUM} distinct stem skeletons for ${courseId} under src/lib/questions/stemStructures/ (see calc-ab as the reference catalog).`,
		`Until that catalog lands, vary openings, tasks, and bridges aggressively so stems do not cluster on one phrasing.`,
	].join("\n");
}
