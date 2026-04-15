import type { FrqRubricDoc } from "@/types";

/** Serialize per-part FRQ responses (keys = rubric part letters). */
export function serializeFrqPartAnswers(parts: Record<string, string>): string {
	return JSON.stringify(parts);
}

export function parseFrqPartAnswers(raw: string | undefined): Record<string, string> {
	if (raw == null || raw.trim() === "") return {};
	try {
		const j = JSON.parse(raw) as unknown;
		if (j && typeof j === "object" && !Array.isArray(j)) return j as Record<string, string>;
	} catch {
		/* legacy single textbox */
	}
	return { _: raw ?? "" };
}

export function frqAnswerHasAnyDraft(raw: string | undefined): boolean {
	const o = parseFrqPartAnswers(raw);
	if ("_" in o && Object.keys(o).length === 1) return (o._ ?? "").trim().length > 0;
	return Object.values(o).some((v) => (v ?? "").trim().length > 0);
}

/** True when every rubric part letter has a non-empty response. */
export function frqAnswerIsComplete(raw: string | undefined, rubric: FrqRubricDoc | undefined): boolean {
	if (!rubric) return (raw ?? "").trim().length > 0;
	const o = parseFrqPartAnswers(raw);
	if ("_" in o && Object.keys(o).length === 1) return (o._ ?? "").trim().length > 0;
	return rubric.parts.every((p) => (o[p.letter] ?? "").trim().length > 0);
}

export function mergeFrqPartAnswer(
	raw: string | undefined,
	letter: string,
	text: string,
): string {
	const prev = parseFrqPartAnswers(raw);
	delete prev._;
	return serializeFrqPartAnswers({ ...prev, [letter]: text });
}
