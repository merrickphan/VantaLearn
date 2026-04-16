import type { ExamFigure } from "@/types";

const STOP = new Set(
	`the and for with from that this which while into onto about over under after before near
  same other each most more less very also only just into than then them they their such
  than into being have been were was are been being will would could should may might
  human geography often refers best described typically known commonly called often
  geography students instructor maps thematic region when what which where there these
  those some many much few several across among within without against during through`
		.split(/\s+/),
);

function tokenize(s: string): string[] {
	return s
		.toLowerCase()
		.replace(/['’]/g, "")
		.replace(/[^a-z0-9\s]/g, " ")
		.split(/\s+/)
		.map((w) => w.trim())
		.filter((w) => w.length >= 4 && !STOP.has(w));
}

function hasBridgingPhrase(question: string): boolean {
	return /\b(based on|according to the (context|scenario|passage|reading|information|exhibit|maps?|chart|table|data)|given the (context|scenario|maps?)|in the (scenario|setting|passage|reading) (above|shown)|described (above|in the (passage|scenario))|refer to the|use the (italicized )?context|as shown in the (figure|chart|table|graph)|the (bar chart|line chart|table) (above|shown))\b/i.test(
		question,
	);
}

function significantHits(stimulusWords: string[], questionLower: string): string[] {
	const hits: string[] = [];
	for (const w of stimulusWords) {
		if (w.length < 4) continue;
		if (questionLower.includes(w)) hits.push(w);
	}
	return hits;
}

/**
 * When a narrative stimulus is shown above the stem, the MCQ must require that context
 * (shared vocabulary or explicit bridging language).
 */
export function narrativeStimulusCoheresWithQuestion(
	figure: ExamFigure | undefined,
	question: string,
): { ok: boolean; reason?: string } {
	if (!figure || figure.kind !== "stimulus") return { ok: true };
	const body = figure.body.trim();
	if (body.length < 28) return { ok: true };

	const q = question.trim();
	if (!q) return { ok: false, reason: "Empty question with narrative stimulus." };

	if (hasBridgingPhrase(q)) return { ok: true };

	const stimTok = tokenize(body);
	const qLow = q.toLowerCase();
	const hits = significantHits(stimTok, qLow);
	if (hits.length >= 2) return { ok: true };
	if (hits.length === 1 && hits[0].length >= 9) return { ok: true };

	return {
		ok: false,
		reason:
			"Narrative stimulus and stem are disconnected: reuse at least two substantive terms from the italic context in the stem, or use explicit bridging language (e.g., 'Based on the scenario above').",
	};
}

/**
 * Data figures must be referenced so the item is clearly exhibit-based.
 */
export function dataFigureReferencedInQuestion(
	figure: ExamFigure | undefined,
	question: string,
): { ok: boolean; reason?: string } {
	if (!figure) return { ok: true };
	if (figure.kind === "stimulus") return { ok: true };

	const q = question.trim().toLowerCase();
	const mentionsExhibit =
		hasBridgingPhrase(question) ||
		/\b(chart|graph|table|figure|plot|bar|line|data|values?|rows?|columns?|shown|displayed)\b/i.test(
			q,
		);
	if (!mentionsExhibit) {
		return {
			ok: false,
			reason:
				"Stem must explicitly tie to the exhibit (e.g., 'According to the table/chart' or equivalent) when a data figure is present.",
		};
	}
	return { ok: true };
}
