import { AP_COURSES } from "@/lib/apCatalog";
import { AP_UNITS_BY_COURSE_ID } from "@/lib/apUnits";
import type { SubjectConfig } from "@/lib/ai/questionGeneration/types";
import {
	FRQ_ARCHETYPE_IDS,
	MCQ_ARCHETYPE_IDS,
	type ReasoningMode,
	type StimulusKind,
} from "@/lib/ai/questionGeneration/types";

const ALL_MCQ = [...MCQ_ARCHETYPE_IDS];
const ALL_FRQ = [...FRQ_ARCHETYPE_IDS];

const DEFAULT_REASONING: ReasoningMode[] = [
	"direct_mapping",
	"interpretation",
	"application",
	"comparison",
	"inference",
	"elimination",
];

function stemHeavyStimuli(): StimulusKind[] {
	return ["graph_bar", "graph_line", "table", "map_description", "passage_scenario", "numeric_scenario"];
}

function csStimuli(): StimulusKind[] {
	return ["table", "passage_scenario", "numeric_scenario", "graph_bar", "graph_line"];
}

function geoStimuli(): StimulusKind[] {
	return ["map_description", "table", "passage_scenario", "graph_bar", "graph_line", "numeric_scenario"];
}

/** Official MCQ option counts: explicit exceptions + conservative defaults. */
function mcqOptionCountForCourse(courseId: string): 4 | 5 {
	switch (courseId) {
		case "csp":
			return 4;
		case "comp-gov":
			return 4;
		case "art-design":
			return 4;
		case "seminar":
			return 4;
		case "research":
			return 4;
		default:
			return 5;
	}
}

function secondsPerMcq(courseId: string): { standard: number; adjustment: number } {
	if (courseId === "csp") {
		return { standard: 72, adjustment: 1.08 };
	}
	if (courseId === "hum-geo") {
		return { standard: 60, adjustment: 1 };
	}
	if (courseId === "calc-ab" || courseId === "calc-bc" || courseId === "precalc") {
		return { standard: 120, adjustment: 1 };
	}
	if (courseId === "stats") {
		return { standard: 110, adjustment: 1 };
	}
	return { standard: 66, adjustment: 1 };
}

function calculatorFlagsForCourse(courseId: string, unitCount: number): boolean[] {
	const out: boolean[] = [];
	for (let i = 0; i < unitCount; i++) {
		let v = false;
		if (
			courseId === "calc-ab" ||
			courseId === "calc-bc" ||
			courseId === "precalc" ||
			courseId === "stats"
		) {
			v = true;
		} else if (courseId === "physics-1" || courseId === "physics-2") {
			v = i >= 3;
		} else if (courseId === "chem") {
			v = i >= 2;
		}
		out.push(v);
	}
	return out;
}

function difficultyRulesFor(courseId: string) {
	if (courseId === "hum-geo") {
		return {
			weights: { easy: 0.18, medium: 0.45, hard: 0.37 } as const,
			baselineDensityShift: 0.12,
		};
	}
	if (courseId === "csp") {
		return {
			weights: { easy: 0.38, medium: 0.45, hard: 0.17 } as const,
			baselineDensityShift: -0.08,
		};
	}
	return {
		weights: { easy: 0.28, medium: 0.45, hard: 0.27 } as const,
		baselineDensityShift: 0,
	};
}

function stimulusPalette(courseId: string): StimulusKind[] {
	if (courseId === "hum-geo") return geoStimuli();
	if (courseId === "csp" || courseId === "cs-a") return csStimuli();
	if (courseId === "chem") return stemHeavyStimuli().filter((x) => x !== "table");
	return stemHeavyStimuli();
}

const CACHE = new Map<string, SubjectConfig>();

export function getSubjectConfigForCourse(courseId: string): SubjectConfig {
	const hit = CACHE.get(courseId);
	if (hit) return hit;

	const course = AP_COURSES.find((c) => c.id === courseId);
	const name = course?.name ?? courseId;
	const units = AP_UNITS_BY_COURSE_ID[courseId] ?? [];
	const unitIds = units.map((u) => u.id);
	const n = Math.max(1, units.length || 1);
	const mcqN = mcqOptionCountForCourse(courseId);
	const timing = secondsPerMcq(courseId);
	const diff = difficultyRulesFor(courseId);

	const cfg: SubjectConfig = {
		courseId,
		subjectName: name,
		unitStructure: unitIds,
		conceptList: ["core-def", "process", "scale", "implication"],
		archetypeListMcq: ALL_MCQ,
		archetypeListFrq: ALL_FRQ,
		allowedStimulusTypes: stimulusPalette(courseId),
		reasoningModes: DEFAULT_REASONING,
		examFormatRules: {
			mcqOptionCount: mcqN,
			choiceLetters: Array.from({ length: mcqN }, (_, i) => String.fromCharCode(65 + i)),
			secondsPerMcqStandard: timing.standard,
			timingAdjustmentFactor: timing.adjustment,
		},
		difficultyRules: {
			weights: { ...diff.weights },
			baselineDensityShift: diff.baselineDensityShift,
		},
		calculatorByUnitIndex: calculatorFlagsForCourse(courseId, n),
	};
	CACHE.set(courseId, cfg);
	return cfg;
}
