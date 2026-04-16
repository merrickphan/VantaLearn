import { buildUnitCurriculumBlock, buildUnitVarietyDirective } from "@/lib/ai/unitQuestionProcedure";
import { getMisconceptionById } from "@/lib/ai/questionGeneration/conceptMisconceptionRegistry";
import type { PlannedMcqSlot } from "@/lib/ai/questionGeneration/types";
import type { SubjectConfig } from "@/lib/ai/questionGeneration/types";

function courseExamStyleRules(courseId: string | undefined): string {
	switch (courseId) {
		case "csp":
			return `- AP Computer Science Principles: use ONLY the College Board CSP pseudocode reference (e.g., ← for assignment, FOR/FOR EACH/REPEAT, list indices starting at 1 unless a problem states otherwise, NOT/AND/OR). Never Java, Python, C++, or JavaScript syntax in code snippets.`;
		case "cs-a":
			return `- AP Computer Science A: use Java as on the exam (loops, classes, primitives vs references) — not pseudocode unless the stem explicitly compares languages.`;
		case "physics-1":
		case "physics-2":
			return `- AP Physics 1/2: SI units; use notation like m/s² for acceleration squared; algebra-based stems consistent with the course exam.`;
		case "chem":
			return `- AP Chemistry: use M for molarity, mol, L, and vocabulary aligned with the AP Chemistry Course and Exam Description.`;
		case "calc-ab":
		case "calc-bc":
		case "precalc":
			return `- AP Calculus / Precalculus: standard prime / Leibniz notation as on AP exams; avoid calculator-specific syntax unless the stem is about technology.`;
		case "stats":
			return `- AP Statistics: use vocabulary from the CED (e.g., experimental units, inference conditions, interpret context).`;
		default:
			return `- General AP: stems should read like course-exam items (concise, neutral tone, clearly defined terms); align vocabulary with the AP Course and Exam Description for this discipline.`;
	}
}

const ARCHETYPE_RULES: Record<string, string> = {
	concept_identification:
		"Ask which term, pattern, or boundary best matches the stimulus; avoid multi-hop proofs.",
	stimulus_interpretation: "Require reading the exhibit (graph/table/map text/scenario) before answering.",
	causal_reasoning: "Ask what causes or drives an outcome implied by the stimulus.",
	comparison_reasoning: "Contrast two cases, regions, methods, or outcomes in the stimulus.",
	exception_detection: "Ask which option is NOT consistent with the model, definition, or evidence.",
	application_to_scenario: "Transfer a principle to a short novel situation consistent with the unit.",
};

export function buildMcqAssemblySystemPrompt(config: SubjectConfig): string {
	const n = config.examFormatRules.mcqOptionCount;
	const courseRules = courseExamStyleRules(config.courseId);
	return `You are an AP exam item writer operating inside a STRICT assembly pipeline.
Output ONLY valid JSON (no markdown fences).

Required top-level object keys:
{
  "question": string,
  "choices": string[${n}],
  "correct_answer": string,
  "explanation": string,
  "figure": null | figure object,
  "distractors": [
    { "text": string, "misconceptionSource": string, "misconceptionId": string }
  ]
}

Rules:
- choices: exactly ${n} strings, plain answer text only (no "A." prefix; the app prints letters).
- correct_answer must equal exactly one element of choices (trimmed match).
- distractors: exactly ${n - 1} objects, one per incorrect choice; "text" must equal the corresponding incorrect string in choices verbatim.
- misconceptionSource: one sentence naming the underlying student error (not "random" or "distractor").
- misconceptionId MUST be copied from the ASSIGNED BANK list in the user message.
- MCQ reasoning: at most TWO conceptual steps from stimulus to answer.
- Figures: if used, set kind to table | bar_chart | line_chart | stimulus (stimulus = passage/map description body).
- Tables: 2–5 columns. Charts: at most two variables (categories + one quantitative series).
- Maps: never claim to output an image; use prose spatial description inside figure.kind="stimulus" OR the stem.
- Scenarios: 3–6 sentences if using narrative stimulus.
- STIMULUS–STEM LOCK (mandatory): If figure.kind is "stimulus", the question MUST be answerable only with that context. Reuse at least two substantive content words from the stimulus body in the stem, OR start with explicit bridging language ("Based on the scenario above", "Given the maps described in the context above", etc.). It is INVALID to pair a narrative exhibit with a generic textbook definition that ignores the exhibit.
- If figure is table, bar_chart, or line_chart, the stem MUST explicitly reference the exhibit ("According to the chart/table", etc.).
- DIVERSITY (mandatory): invent a fresh scenario frame each item (rotate among lab notes, agency memos, field logs, student investigations, maps, simple models, surveys, or policy excerpts). Do not reuse the same fictional organization name, dataset name, or opening clause pattern you would use for another item in the same response.
- DIVERSITY: vary whether the stem opens with context, with a claim, or with a direct task; avoid stacking three items in a row that all begin with "Which of the following".
- DIVERSITY: distractors must read like plausible student errors tied to the assigned misconception bank — not random vocabulary swaps.
${courseRules ? courseRules + "\n" : ""}`;
}

export function buildMcqAssemblyUserPrompt(
	plan: PlannedMcqSlot,
	config: SubjectConfig,
	opts?: { topicNote?: string },
): string {
	const unitBlock = `${buildUnitCurriculumBlock(plan.subjectName, plan.unit)}

${buildUnitVarietyDirective(plan.unit, plan.varietySeed ^ plan.slotIndex)}`;

	const bankLines: string[] = [];
	for (const mid of plan.distractorPlan.misconceptionIds) {
		const m = getMisconceptionById(plan.concept, mid);
		if (m) {
			bankLines.push(
				`- id=${m.id} | studentError=${JSON.stringify(m.studentError)} | seed=${JSON.stringify(m.distractorSeed)}`,
			);
		}
	}

	const stimLines = [
		`STIMULUS_KIND: ${plan.stimulus.kind}`,
		...plan.stimulus.constraintLines,
		`PARAMS: ${JSON.stringify(plan.stimulus.parameters)}`,
	].join("\n");

	return `${unitBlock}

PIPELINE METADATA (obey exactly):
- Subject: ${plan.subjectName}
- AP unit id: ${plan.unit.id}
- AP unit title: ${plan.unit.title}
- Concept id: ${plan.concept.id}
- Concept label: ${plan.concept.label}
- Archetype: ${plan.archetype}
- Archetype rules: ${ARCHETYPE_RULES[plan.archetype] ?? "Follow AP style."}
- Difficulty label: ${plan.difficulty}
- Calculator allowed for this item: ${plan.calculatorAllowed ? "yes" : "no"} (do not contradict with stem tools)
- Cognitive cap: at most ${plan.mcqMaxReasoningSteps} reasoning steps for the MCQ.

${stimLines}

MISCONCEPTION BANK (incorrect answers MUST come only from these — use ids verbatim):
${bankLines.join("\n")}

ASSEMBLY:
1) Build the narrative or data exhibit first (if required), then write the MCQ stem so it clearly depends on that exhibit.
2) Write the correct answer text first.
3) For each incorrect slot, adapt one bank seed into a full plausible AP distractor; set misconceptionId to that bank row's id.
4) Keep vocabulary aligned to ${plan.subjectName} Unit ${plan.unit.index} only.
5) Never output a "floating" definition question under an unrelated italic paragraph.
6) Before finalizing, mentally check: if the stem were printed next to four other AP items, would it still feel distinct in setting and task? If not, rewrite the scenario or lead-in.
${opts?.topicNote?.trim() ? `\nOptional extra focus (weave naturally, do not tag as a note): ${opts.topicNote.trim()}` : ""}`;
}
