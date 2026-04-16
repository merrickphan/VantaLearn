import type { ExamQuestion } from "@/types";
import { findUnitById, getCourseIdFromSubjectName } from "@/lib/apUnits";
import { generateOneValidatedMcq } from "@/lib/ai/questionGeneration/generateOneMcq";
import { getSubjectConfigForCourse } from "@/lib/ai/questionGeneration/subjectConfigRegistry";

export interface GenerateQuestionsInput {
	subject: string;
	/** Short topic focus, e.g. "derivatives" (optional extra focus on top of unit) */
	topic?: string;
	/** Number of MC questions (max 12 per request for latency) */
	count: number;
	/** Encourage figures: charts, tables, graphs where appropriate */
	includeFigures: boolean;
	/** e.g. calc-ab-u3 - locks questions to one curriculum unit */
	unitId?: string;
	/** Changes hook rotation / scenario emphasis each request (timestamp ok) */
	varietySeed?: number;
}

function clampCount(n: number): number {
	return Math.min(12, Math.max(1, Math.floor(n)));
}

/**
 * Unified AP MCQ pipeline: subject → unit → concept → archetype → stimulus blueprint →
 * assembly prompt → model JSON → APRealismValidator (≥85) with retries per slot.
 */
export async function generateExamQuestions(input: GenerateQuestionsInput): Promise<ExamQuestion[]> {
	if (!process.env.OPENAI_API_KEY) {
		throw new Error("OPENAI_API_KEY is not configured");
	}

	const count = clampCount(input.count);
	const unitCtx = input.unitId ? findUnitById(input.unitId) : null;
	const resolvedCourseId = unitCtx?.courseId ?? getCourseIdFromSubjectName(input.subject) ?? "lang";
	const config = getSubjectConfigForCourse(resolvedCourseId);
	const subjectLabel = unitCtx?.courseName ?? input.subject;

	const seed =
		typeof input.varietySeed === "number" && Number.isFinite(input.varietySeed)
			? Math.floor(input.varietySeed)
			: Date.now() % 1_000_000_000;

	const out: ExamQuestion[] = [];
	for (let i = 0; i < count; i++) {
		const q = await generateOneValidatedMcq({
			config,
			subjectDisplay: subjectLabel,
			unitId: input.unitId,
			varietySeed: seed,
			slotIndex: i,
			includeFigures: input.includeFigures,
			maxAttempts: 6,
			topicNote: input.topic,
		});
		out.push(q);
	}

	return out;
}
