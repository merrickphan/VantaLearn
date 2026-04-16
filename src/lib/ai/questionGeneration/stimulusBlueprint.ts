import type { SubjectConfig } from "@/lib/ai/questionGeneration/types";
import type { PlannedMcqSlot, QuestionStimulusBlueprint, StimulusKind } from "@/lib/ai/questionGeneration/types";
import { hashSeed, mulberry32, pickIndex } from "@/lib/ai/questionGeneration/seededRng";

function allowedKinds(config: SubjectConfig, includeFigures: boolean): StimulusKind[] {
	const all = [...config.allowedStimulusTypes];
	if (!includeFigures) {
		return all.filter((k) => k !== "graph_bar" && k !== "graph_line" && k !== "table");
	}
	return all;
}

export function buildStimulusBlueprint(
	config: SubjectConfig,
	slot: Pick<PlannedMcqSlot, "varietySeed" | "slotIndex" | "unit" | "archetype">,
	includeFigures: boolean,
): QuestionStimulusBlueprint {
	const kinds = allowedKinds(config, includeFigures);
	const seed = hashSeed([
		config.courseId,
		slot.unit.id,
		slot.archetype,
		slot.varietySeed,
		slot.slotIndex,
		"stim",
	]);
	const rng = mulberry32(seed);
	const kind = kinds[pickIndex(rng, kinds.length)] ?? "passage_scenario";

	const lines: string[] = [];
	const parameters: Record<string, string | number | boolean | string[]> = { archetype: slot.archetype };

	switch (kind) {
		case "graph_bar": {
			const nBars = 3 + pickIndex(rng, 3);
			parameters.variableCount = 2;
			parameters.series = "single_series";
			parameters.barCount = nBars;
			lines.push("Graph: exactly one quantitative series (one y-axis concept).");
			lines.push(`Provide ${nBars} categories; values must be internally consistent with the stem.`);
			break;
		}
		case "graph_line": {
			const nPts = 4 + pickIndex(rng, 4);
			parameters.variableCount = 2;
			parameters.pointCount = nPts;
			lines.push("Graph: time or ordered categories on horizontal axis; one dependent series only.");
			lines.push(`Include ${nPts} labeled points; no third-variable overlay.`);
			break;
		}
		case "table": {
			const cols = 2 + pickIndex(rng, 4);
			const rows = 2 + pickIndex(rng, 3);
			parameters.columnCount = cols;
			parameters.rowCount = rows;
			lines.push(`Table: ${cols} columns (inclusive of row label column if used), ${rows} data rows.`);
			lines.push("Column count must stay between 2 and 5 inclusive.");
			break;
		}
		case "map_description": {
			parameters.variableCount = 2;
			lines.push(
				"Map: use a structured spatial description (regions, directions, relative distances) — not an image.",
			);
			lines.push("3–6 sentences, AP-level geographic context, no invented country names.");
			break;
		}
		case "passage_scenario":
		case "numeric_scenario": {
			const sentences = 3 + pickIndex(rng, 4);
			parameters.sentenceCount = Math.min(6, Math.max(3, sentences));
			lines.push(`Scenario: ${parameters.sentenceCount} sentences, realistic AP-style context.`);
			lines.push("No fantastical elements; keep proper nouns generic if needed.");
			break;
		}
		default:
			lines.push("Stimulus must be exam-realistic and directly necessary to answer.");
	}

	return { kind, parameters, constraintLines: lines };
}
