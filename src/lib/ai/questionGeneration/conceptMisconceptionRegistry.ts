import type { ApUnit } from "@/lib/apUnits/types";
import type { ControlledConcept, MisconceptionEntry } from "@/lib/ai/questionGeneration/types";

const CONCEPT_SUFFIXES = [
	{ suf: "core-def", label: "Core definitions and boundaries" },
	{ suf: "process", label: "Processes and mechanisms" },
	{ suf: "scale", label: "Scale, measurement, and representation" },
	{ suf: "implication", label: "Implications, trade-offs, and outcomes" },
];

function misconceptionsFor(conceptKey: string, unitTitle: string): MisconceptionEntry[] {
	const u = unitTitle.slice(0, 48);
	return [
		{
			id: `${conceptKey}-m1`,
			studentError: "Treats a related but distinct term as interchangeable with the target idea.",
			distractorSeed: `Confuses the target concept in “${u}” with a closely related vocabulary term.`,
		},
		{
			id: `${conceptKey}-m2`,
			studentError: "Reverses cause and effect in the unit context.",
			distractorSeed: `Attributes an outcome to the wrong driver for “${u}”.`,
		},
		{
			id: `${conceptKey}-m3`,
			studentError: "Overgeneralizes a pattern from one scale to another.",
			distractorSeed: `Applies a pattern valid at one scale incorrectly to another scale in “${u}”.`,
		},
		{
			id: `${conceptKey}-m4`,
			studentError: "Ignores a key constraint stated in typical AP stems for this unit.",
			distractorSeed: `Violates a boundary condition that AP tasks in “${u}” usually preserve.`,
		},
		{
			id: `${conceptKey}-m5`,
			studentError: "Selects a plausible but non-definitive detail as the main idea.",
			distractorSeed: `Elevates a secondary detail over the primary claim the item assesses in “${u}”.`,
		},
		{
			id: `${conceptKey}-m6`,
			studentError: "Misreads directionality (increase vs decrease, positive vs negative).",
			distractorSeed: `Flips directionality implied by the evidence for “${u}”.`,
		},
	];
}

/**
 * Controlled, unit-aligned concept list with misconception banks (no random distractors).
 * Concepts are stable ids derived from the official unit id + controlled suffix.
 */
export function getControlledConceptsForUnit(unit: ApUnit): ControlledConcept[] {
	return CONCEPT_SUFFIXES.map(({ suf, label }) => {
		const id = `${unit.id}::${suf}`;
		return {
			id,
			label: `${label} — ${unit.title}`,
			unitId: unit.id,
			misconceptions: misconceptionsFor(id, unit.title),
		};
	});
}

export function findConcept(unit: ApUnit, conceptId: string): ControlledConcept | undefined {
	return getControlledConceptsForUnit(unit).find((c) => c.id === conceptId);
}

export function pickMisconceptionIds(
	concept: ControlledConcept,
	need: number,
	seed: number,
): string[] {
	const pool = [...concept.misconceptions];
	const out: string[] = [];
	let s = seed >>> 0;
	const used = new Set<string>();
	let guard = 0;
	while (out.length < need && pool.length > 0 && guard < 64) {
		guard++;
		s = (s * 1664525 + 1013904223) >>> 0;
		const idx = s % pool.length;
		const id = pool[idx].id;
		if (!used.has(id)) {
			used.add(id);
			out.push(id);
		}
	}
	while (out.length < need && pool.length > 0) {
		out.push(pool[out.length % pool.length].id);
	}
	return out;
}

export function getMisconceptionById(
	concept: ControlledConcept,
	mid: string,
): MisconceptionEntry | undefined {
	return concept.misconceptions.find((m) => m.id === mid);
}
