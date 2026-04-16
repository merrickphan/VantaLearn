import type { ApUnit } from "@/lib/apUnits/types";
import type { ApQuestionDifficultyLevel } from "@/types";

/** Fixed MCQ archetype vocabulary (pipeline-enforced). */
export const MCQ_ARCHETYPE_IDS = [
	"concept_identification",
	"stimulus_interpretation",
	"causal_reasoning",
	"comparison_reasoning",
	"exception_detection",
	"application_to_scenario",
] as const;
export type McqArchetypeId = (typeof MCQ_ARCHETYPE_IDS)[number];

/** Fixed FRQ archetype vocabulary (config + future FRQ assembly). */
export const FRQ_ARCHETYPE_IDS = [
	"explain_cause",
	"explain_effect",
	"compare_cases",
	"apply_concept_to_stimulus",
	"evaluate_claim",
] as const;
export type FrqArchetypeId = (typeof FRQ_ARCHETYPE_IDS)[number];

export type StimulusKind =
	| "graph_bar"
	| "graph_line"
	| "table"
	| "map_description"
	| "passage_scenario"
	| "numeric_scenario";

export type ReasoningMode =
	| "direct_mapping"
	| "interpretation"
	| "application"
	| "comparison"
	| "inference"
	| "elimination";

export type ApQuestionDifficulty = ApQuestionDifficultyLevel;

export interface MisconceptionEntry {
	id: string;
	/** Student-facing error pattern the distractor embodies. */
	studentError: string;
	/** Short phrase the model must adapt into a full answer choice (not random text). */
	distractorSeed: string;
}

export interface ControlledConcept {
	id: string;
	/** Human-readable concept label aligned to the unit. */
	label: string;
	/** Must align to `unitId` (enforced at planning time). */
	unitId: string;
	misconceptions: MisconceptionEntry[];
}

export interface ExamFormatRules {
	mcqOptionCount: 4 | 5;
	/** Letters shown on real exam booklets for MCQ. */
	choiceLetters: string[];
	/** Standard seconds budget per MCQ in a timed administration (course-specific). */
	secondsPerMcqStandard: number;
	/** Optional multiplier for practice realism vs standard section pacing. */
	timingAdjustmentFactor: number;
}

export interface DifficultyRules {
	/** Weights used for deterministic difficulty assignment per slot. */
	weights: Record<ApQuestionDifficulty, number>;
	/**
	 * Baseline density shift: positive = relatively harder mix (e.g. AP Human Geography
	 * vs AP Computer Science Principles).
	 */
	baselineDensityShift: number;
}

export interface SubjectConfig {
	courseId: string;
	subjectName: string;
	/** Official-style unit ids for this course (mirrors `ApUnit.id` list). */
	unitStructure: readonly string[];
	/**
	 * Controlled concept dimensions repeated for every unit (full ids are `${unitId}::${suffix}`).
	 * Aligns planning with explicit AP unit scope.
	 */
	conceptList: readonly string[];
	/** Archetypes allowed for MCQ generation in this course. */
	archetypeListMcq: readonly McqArchetypeId[];
	/** Archetypes allowed for FRQ items (assembly / future work). */
	archetypeListFrq: readonly FrqArchetypeId[];
	allowedStimulusTypes: readonly StimulusKind[];
	reasoningModes: readonly ReasoningMode[];
	examFormatRules: ExamFormatRules;
	difficultyRules: DifficultyRules;
	/**
	 * Per-unit calculator defaults: when true, MCQs in that unit may use calculator-class stems.
	 * Final `calculatorAllowed` also depends on concept + archetype in the pipeline.
	 */
	calculatorByUnitIndex: readonly boolean[];
}

export interface QuestionStimulusBlueprint {
	kind: StimulusKind;
	/** Parameter card the model must follow (deterministic). */
	parameters: Record<string, string | number | boolean | string[]>;
	/** Prompt lines describing constraints (deterministic text). */
	constraintLines: string[];
}

export interface DistractorPlan {
	/** Misconception ids to adapt into incorrect choices (count = mcqOptionCount - 1). */
	misconceptionIds: string[];
}

export interface PlannedMcqSlot {
	courseId: string;
	subjectName: string;
	unit: ApUnit;
	concept: ControlledConcept;
	archetype: McqArchetypeId;
	difficulty: ApQuestionDifficulty;
	stimulus: QuestionStimulusBlueprint;
	distractorPlan: DistractorPlan;
	calculatorAllowed: boolean;
	reasoningModes: ReasoningMode[];
	/** Cognitive caps communicated to the model. */
	mcqMaxReasoningSteps: 2;
	frqPartMaxReasoningSteps: 3;
	varietySeed: number;
	slotIndex: number;
}

export interface RawDistractorPayload {
	text: string;
	misconceptionSource: string;
	misconceptionId?: string;
}

export interface RawAiMcqPayload {
	question: string;
	choices: string[];
	correct_answer: string;
	explanation: string;
	figure?: unknown;
	distractors: RawDistractorPayload[];
}

export interface ExamSimulationResult {
	passesTimedSection: boolean;
	estimatedSeconds: number;
	allowedSeconds: number;
	note: string;
}

export interface ApRealismValidationResult {
	passes: boolean;
	apRealismScore: number;
	reasons: string[];
	examSimulation: ExamSimulationResult;
}
