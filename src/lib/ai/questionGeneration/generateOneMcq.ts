import OpenAI from "openai";
import type { ApQuestionMetadata, ExamFigure, ExamQuestion } from "@/types";
import { validateApRealism } from "@/lib/ai/questionGeneration/apRealismValidator";
import { assertUnitConceptAlignment, planMcqSlot } from "@/lib/ai/questionGeneration/planMcqSlot";
import { buildMcqAssemblySystemPrompt, buildMcqAssemblyUserPrompt } from "@/lib/ai/questionGeneration/mcqAssemblyPrompt";
import { normalizeAiFigure } from "@/lib/ai/questionGeneration/normalizeAiFigure";
import type { RawAiMcqPayload } from "@/lib/ai/questionGeneration/types";
import type { SubjectConfig } from "@/lib/ai/questionGeneration/types";
import { hashSeed } from "@/lib/ai/questionGeneration/seededRng";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function stableQuestionId(parts: (string | number)[]): string {
	const h = hashSeed(parts);
	return `ai-${h.toString(36)}`;
}

function toExamQuestion(
	subjectDisplay: string,
	meta: ApQuestionMetadata,
	raw: RawAiMcqPayload,
	figure: ExamFigure | undefined,
	id: string,
	config: SubjectConfig,
): ExamQuestion {
	const opts = raw.choices.map((o) => String(o).trim()).filter(Boolean);
	const correct = String(raw.correct_answer).trim();
	const n = config.examFormatRules.mcqOptionCount;
	if (opts.length !== n) {
		throw new Error(`Invalid question: need ${n} options`);
	}
	if (!opts.includes(correct)) {
		throw new Error("correct_answer must match one option exactly");
	}

	return {
		id,
		subject: subjectDisplay,
		type: "multiple_choice",
		question: String(raw.question).trim(),
		options: opts,
		choices: opts,
		correct_answer: correct,
		explanation: String(raw.explanation ?? "").trim() || undefined,
		...(figure ? { figure } : {}),
		ap_metadata: meta,
		calculator_allowed: meta.calculatorAllowed,
		difficulty: meta.difficulty,
		ap_realism_score: meta.apRealismScore,
	};
}

export async function generateOneValidatedMcq(params: {
	config: SubjectConfig;
	subjectDisplay: string;
	unitId?: string;
	varietySeed: number;
	slotIndex: number;
	includeFigures: boolean;
	maxAttempts: number;
	topicNote?: string;
}): Promise<ExamQuestion> {
	const { config, subjectDisplay, unitId, varietySeed, slotIndex, includeFigures, maxAttempts, topicNote } =
		params;
	const plan = planMcqSlot({ config, unitId, varietySeed, slotIndex, includeFigures });
	assertUnitConceptAlignment(plan);

	const system = buildMcqAssemblySystemPrompt(config);
	const user = buildMcqAssemblyUserPrompt(plan, config, { topicNote });

	let lastErr = "APRealismValidator rejected all attempts";
	for (let attempt = 0; attempt < maxAttempts; attempt++) {
		const response = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [
				{ role: "system", content: system },
				{ role: "user", content: user },
			],
			response_format: { type: "json_object" },
			temperature: 0.35,
			max_tokens: 3500,
		});

		const text = response.choices[0]?.message?.content;
		if (!text) {
			lastErr = "Empty AI response";
			continue;
		}

		let parsed: RawAiMcqPayload;
		try {
			parsed = JSON.parse(text) as RawAiMcqPayload;
		} catch {
			lastErr = "Invalid JSON from model";
			continue;
		}

		const figure = normalizeAiFigure(parsed.figure);
		const val = validateApRealism(config, plan, parsed, figure);
		if (!val.passes) {
			lastErr = `Realism ${val.apRealismScore}: ${val.reasons.slice(0, 3).join("; ")}`;
			continue;
		}

		const id = stableQuestionId([
			config.courseId,
			plan.unit.id,
			plan.concept.id,
			plan.archetype,
			varietySeed,
			slotIndex,
			attempt,
		]);

		const distractorAnnotations = parsed.distractors.map((d) => ({
			choice: String(d.text).trim(),
			misconceptionSource: String(d.misconceptionSource).trim(),
		}));

		const meta: ApQuestionMetadata = {
			apUnitId: plan.unit.id,
			apUnitTitle: plan.unit.title,
			conceptId: plan.concept.id,
			conceptLabel: plan.concept.label,
			archetype: plan.archetype,
			stimulusKind: plan.stimulus.kind,
			stimulusParameters: plan.stimulus.parameters,
			difficulty: plan.difficulty,
			calculatorAllowed: plan.calculatorAllowed,
			apRealismScore: val.apRealismScore,
			distractorAnnotations,
			examSimulationNote: val.examSimulation.note,
		};

		try {
			return toExamQuestion(subjectDisplay, meta, parsed, figure, id, config);
		} catch (e) {
			lastErr = e instanceof Error ? e.message : "Assembly error";
		}
	}

	throw new Error(lastErr);
}
