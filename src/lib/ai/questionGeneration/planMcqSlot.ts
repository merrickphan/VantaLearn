import type { ApUnit } from "@/lib/apUnits/types";
import { getUnitsForCourseId } from "@/lib/apUnits";
import type { SubjectConfig } from "@/lib/ai/questionGeneration/types";
import type { ApQuestionDifficulty, McqArchetypeId, PlannedMcqSlot } from "@/lib/ai/questionGeneration/types";
import { getControlledConceptsForUnit, pickMisconceptionIds } from "@/lib/ai/questionGeneration/conceptMisconceptionRegistry";
import { buildStimulusBlueprint } from "@/lib/ai/questionGeneration/stimulusBlueprint";
import { hashSeed, mulberry32, pickIndex, pickWeighted } from "@/lib/ai/questionGeneration/seededRng";

function resolveUnit(
	config: SubjectConfig,
	unitId: string | undefined,
	varietySeed: number,
	slotIndex: number,
): ApUnit {
	const units = getUnitsForCourseId(config.courseId);
	if (units.length === 0) {
		throw new Error(`No AP units configured for course ${config.courseId}`);
	}
	if (unitId) {
		const u = units.find((x) => x.id === unitId);
		if (u) return u;
	}
	const rng = mulberry32(hashSeed([config.courseId, varietySeed, slotIndex, "unit-pick"]));
	return units[pickIndex(rng, units.length)];
}

function archetypeForDifficulty(diff: ApQuestionDifficulty, rng: () => number): McqArchetypeId {
	const easyPool: McqArchetypeId[] = ["concept_identification", "stimulus_interpretation", "application_to_scenario"];
	const medPool: McqArchetypeId[] = [
		"stimulus_interpretation",
		"causal_reasoning",
		"application_to_scenario",
		"comparison_reasoning",
	];
	const hardPool: McqArchetypeId[] = [
		"comparison_reasoning",
		"exception_detection",
		"causal_reasoning",
		"stimulus_interpretation",
	];
	const pool = diff === "easy" ? easyPool : diff === "medium" ? medPool : hardPool;
	return pool[pickIndex(rng, pool.length)];
}

function calculatorForSlot(
	config: SubjectConfig,
	unit: ApUnit,
	archetype: McqArchetypeId,
	conceptLabel: string,
): boolean {
	const idx = Math.max(0, unit.index - 1);
	const base = config.calculatorByUnitIndex[idx] ?? false;
	if (!base) return false;
	if (archetype === "concept_identification" && /definitions|boundaries/i.test(conceptLabel)) {
		return false;
	}
	return true;
}

/**
 * Deterministic pipeline step: subject → unit → concept → archetype → stimulus parameters → distractor ids.
 */
export function planMcqSlot(params: {
	config: SubjectConfig;
	unitId?: string;
	varietySeed: number;
	slotIndex: number;
	includeFigures: boolean;
}): PlannedMcqSlot {
	const { config, unitId, varietySeed, slotIndex, includeFigures } = params;
	const unit = resolveUnit(config, unitId, varietySeed, slotIndex);
	const concepts = getControlledConceptsForUnit(unit);
	const seed = hashSeed([config.courseId, unit.id, varietySeed, slotIndex, "plan"]);
	const rng = mulberry32(seed);

	const diffKeys = ["easy", "medium", "hard"] as const;
	let wEasy = Math.max(0.05, config.difficultyRules.weights.easy);
	const wMed = Math.max(0.05, config.difficultyRules.weights.medium);
	let wHard = Math.max(0.05, config.difficultyRules.weights.hard);
	const shift = config.difficultyRules.baselineDensityShift;
	wHard *= 1 + shift;
	wEasy *= 1 - shift * 0.35;
	const sum = wEasy + wMed + wHard;
	const weights = { easy: wEasy / sum, medium: wMed / sum, hard: wHard / sum };
	const difficulty = pickWeighted(rng, weights, diffKeys);

	const concept = concepts[pickIndex(rng, concepts.length)];
	const archetype = archetypeForDifficulty(difficulty, rng);
	const stimulus = buildStimulusBlueprint(config, { varietySeed, slotIndex, unit, archetype }, includeFigures);

	const need = Math.max(1, config.examFormatRules.mcqOptionCount - 1);
	const misconceptionIds = pickMisconceptionIds(concept, need, seed ^ 0x9e3779b9);

	return {
		courseId: config.courseId,
		subjectName: config.subjectName,
		unit,
		concept,
		archetype,
		difficulty,
		stimulus,
		distractorPlan: { misconceptionIds },
		calculatorAllowed: calculatorForSlot(config, unit, archetype, concept.label),
		reasoningModes: [...config.reasoningModes],
		mcqMaxReasoningSteps: 2,
		frqPartMaxReasoningSteps: 3,
		varietySeed,
		slotIndex,
	};
}

export function assertUnitConceptAlignment(plan: PlannedMcqSlot): void {
	if (plan.concept.unitId !== plan.unit.id) {
		throw new Error(`Unit/concept misalignment: ${plan.concept.unitId} vs ${plan.unit.id}`);
	}
}
