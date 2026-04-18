import type { ExamFigure } from "@/types";
import {
	dataFigureReferencedInQuestion,
	narrativeStimulusCoheresWithQuestion,
} from "@/lib/ai/questionGeneration/stimulusQuestionCoherence";
import type {
	ApQuestionDifficulty,
	ApRealismValidationResult,
	ExamSimulationResult,
	McqArchetypeId,
	PlannedMcqSlot,
	RawAiMcqPayload,
} from "@/lib/ai/questionGeneration/types";
import type { SubjectConfig } from "@/lib/ai/questionGeneration/types";

function figureVariableCount(fig: ExamFigure): number {
	if (fig.kind === "bar_chart") return 2;
	if (fig.kind === "line_chart") return 2;
	if (fig.kind === "slope_field") return 2;
	if (fig.kind === "calculus_xy_plot") return 2;
	if (fig.kind === "table") return Math.max(1, fig.headers.length);
	return 1;
}

function tableColumnCount(fig: Extract<ExamFigure, { kind: "table" }>): number {
	return fig.headers.length;
}

function estimateReadingSeconds(text: string, choiceCount: number): number {
	const words = text.split(/\s+/).filter(Boolean).length;
	return Math.min(240, Math.max(18, Math.round(words * 0.35 + choiceCount * 4)));
}

function examSimulation(
	config: SubjectConfig,
	stem: string,
	choices: string[],
): ExamSimulationResult {
	const body = `${stem}\n${choices.join(" ")}`;
	const est = estimateReadingSeconds(body, choices.length);
	const allowed = Math.round(
		config.examFormatRules.secondsPerMcqStandard * config.examFormatRules.timingAdjustmentFactor,
	);
	const passes = est <= allowed * 1.15;
	return {
		passesTimedSection: passes,
		estimatedSeconds: est,
		allowedSeconds: allowed,
		note: passes
			? `Estimated pacing ${est}s vs allowed ~${allowed}s (adjusted).`
			: `Stem+choices likely exceed comfortable pacing (${est}s vs ~${allowed}s).`,
	};
}

function archetypeDifficultyCoherence(archetype: McqArchetypeId, difficulty: ApQuestionDifficulty): number {
	const hardish = new Set<McqArchetypeId>(["comparison_reasoning", "exception_detection"]);
	if (difficulty === "easy" && hardish.has(archetype)) return 40;
	if (difficulty === "hard" && archetype === "concept_identification") return 65;
	return 95;
}

function singleCorrectCheck(correct: string, choices: string[]): boolean {
	const trimmed = choices.map((c) => c.trim());
	const c = correct.trim();
	const hits = trimmed.filter((x) => x === c);
	return hits.length === 1;
}

function distractorStructure(
	raw: RawAiMcqPayload,
	plan: PlannedMcqSlot,
): { penalty: number; reasons: string[] } {
	const reasons: string[] = [];
	let penalty = 0;
	const need = plan.distractorPlan.misconceptionIds.length;
	if (!Array.isArray(raw.distractors) || raw.distractors.length < need) {
		penalty += 40;
		reasons.push("distractors[] must include one object per incorrect answer with misconceptionSource.");
		return { penalty, reasons };
	}
	const correct = String(raw.correct_answer ?? "").trim();
	const wrongChoices = raw.choices.map((c) => c.trim()).filter((c) => c !== correct);
	const requiredIds = new Set(plan.distractorPlan.misconceptionIds);
	for (const d of raw.distractors) {
		if (!String(d.text ?? "").trim() || !String(d.misconceptionSource ?? "").trim()) {
			penalty += 12;
			reasons.push("Each distractor needs non-empty text and misconceptionSource (student error).");
		}
		if (d.misconceptionId && !requiredIds.has(d.misconceptionId)) {
			penalty += 6;
			reasons.push(`misconceptionId ${d.misconceptionId} was not in the assigned bank for this item.`);
		}
	}
	for (const w of wrongChoices) {
		const hit = raw.distractors.find((d) => String(d.text).trim() === w);
		if (!hit) {
			penalty += 14;
			reasons.push("Each incorrect choice must appear verbatim as distractors[].text.");
		}
	}
	const sources = new Set(raw.distractors.map((d) => String(d.misconceptionSource).trim().toLowerCase()));
	if (sources.size < Math.min(raw.distractors.length, need)) {
		penalty += 8;
		reasons.push("Misconception sources should not all repeat the same phrase.");
	}
	return { penalty, reasons };
}

/**
 * Mandatory AP realism gate: scores 0–100; callers reject below 85 and regenerate.
 */
export function validateApRealism(
	config: SubjectConfig,
	plan: PlannedMcqSlot,
	raw: RawAiMcqPayload,
	figure: ExamFigure | undefined,
): ApRealismValidationResult {
	const reasons: string[] = [];
	const n = config.examFormatRules.mcqOptionCount;

	if (!Array.isArray(raw.choices) || raw.choices.length !== n) {
		reasons.push(`choices must contain exactly ${n} option strings (plain text; letters are rendered by the player).`);
		return {
			passes: false,
			apRealismScore: 0,
			reasons,
			examSimulation: examSimulation(config, raw.question ?? "", raw.choices ?? []),
		};
	}

	const correct = String(raw.correct_answer ?? "").trim();
	if (!singleCorrectCheck(correct, raw.choices)) {
		reasons.push("Exactly one choice must match correct_answer character-for-character (after trim).");
	}

	let penalty = 0;
	if (figure) {
		if (figure.kind !== "table" && figureVariableCount(figure) > 2) {
			penalty += 15;
			reasons.push("Charts may encode at most two variables (x vs one series).");
		}
		if (figure.kind === "table") {
			const cols = tableColumnCount(figure);
			if (cols < 2 || cols > 5) {
				penalty += 18;
				reasons.push("Tables must have 2–5 columns.");
			}
		}
	}

	const stemWords = String(raw.question ?? "")
		.split(/\s+/)
		.filter(Boolean).length;
	if (stemWords < 18) {
		penalty += 8;
		reasons.push("Stem is very short for AP discrimination.");
	}
	if (stemWords > 240) {
		penalty += 10;
		reasons.push("Stem is likely too long for timed pacing.");
	}

	const coh = archetypeDifficultyCoherence(plan.archetype, plan.difficulty);
	if (coh < 80) {
		penalty += 12;
		reasons.push("Difficulty label does not match archetype reasoning demand.");
	}

	const dq = distractorStructure(raw, plan);
	penalty += dq.penalty;
	reasons.push(...dq.reasons);

	const qText = String(raw.question ?? "");
	const nar = narrativeStimulusCoheresWithQuestion(figure, qText);
	if (!nar.ok) {
		penalty += 38;
		if (nar.reason) reasons.push(nar.reason);
	}
	const dataFig = dataFigureReferencedInQuestion(figure, qText);
	if (!dataFig.ok) {
		penalty += 32;
		if (dataFig.reason) reasons.push(dataFig.reason);
	}

	const sim = examSimulation(config, raw.question, raw.choices);
	if (!sim.passesTimedSection) {
		penalty += 10;
		reasons.push(sim.note);
	}

	let score = 100 - penalty;
	score = Math.round(Math.min(100, Math.max(0, score)));

	const structurallyValid =
		Array.isArray(raw.choices) &&
		raw.choices.length === n &&
		singleCorrectCheck(correct, raw.choices);

	const passes = structurallyValid && score >= 85;

	return { passes, apRealismScore: score, reasons, examSimulation: sim };
}
