/**
 * Enumerated AP Calculus AB MCQ stem **sentence structures** (grammatical skeletons).
 * Built as a Cartesian product: 40 × 25 = 1000 distinct strings (parameters like coefficients
 * are not part of the structure count).
 *
 * The model should adapt the skill referenced in each frame to the unit (limits, derivatives, etc.)
 * while preserving the opening + task wording pattern.
 */

const CALC_AB_OPEN_LEADS = [
	"Based on the exhibit",
	"Using the notation and assumptions in the stimulus",
	"Referring to the function rule displayed above",
	"From the algebraic definition given in the context",
	"Given the piecewise description in the problem",
	"Under the differentiability assumptions stated",
	"On an open interval where the function is differentiable as claimed",
	"Considering the limit process described in the setup",
	"After algebraically simplifying the indeterminate form that arises",
	"After rationalizing the expression in the standard way",
	"Using continuity on the closed interval described",
	"Under the hypotheses needed for the Intermediate Value Theorem",
	"From the table of selected values alone",
	"Comparing left-hand and right-hand information in the context",
	"Using the difference quotient structure indicated",
	"In the sense of instantaneous rate of change",
	"Interpreting the derivative as the slope of the tangent line",
	"Identifying inner and outer functions in the composition",
	"Applying the chain rule to the nested structure shown",
	"For the separable differential equation framing described",
	"For an accumulation function written as an integral with variable upper limit",
	"Using the Fundamental Theorem of Calculus in the role stated",
	"In the related-rates geometric setup described",
	"For the region between two graphs identified in the stem",
	"For the solid formed by revolution about the indicated axis",
	"Using the local linearization (tangent line approximation) indicated",
	"Judging where the first derivative is positive or negative from the information",
	"Using concavity information tied to the second derivative",
	"Where the second derivative test applies as described",
	"Subject to the optimization constraint stated in the problem",
	"Tracking units consistently in the applied interpretation",
	"Using a Riemann-sum viewpoint for the partition described",
	"For straight-line motion with the position function given",
	"Reading the slope field sketch provided",
	"Within an exponential growth or decay model with the proportionality given",
	"With the initial condition specified in the stem",
	"Interpreting net change from a rate function in context",
	"Relating average value of a function to values on an interval",
	"Evaluating end behavior from degree information for a rational function",
	"Using symmetry or periodicity only when explicitly justified by the stem",
] as const;

const CALC_AB_TASK_FRAMES = [
	"which expression equals f'(x)",
	"which value is the correct evaluation of the indicated limit",
	"which statement about continuity at the point in question is true",
	"which conclusion follows from the Intermediate Value Theorem in this setting",
	"which simplified limit matches direct substitution after factoring",
	"which one-sided limit statement is consistent with the context",
	"which conclusion about a horizontal asymptote is correct",
	"which derivative computation matches the power rule on the displayed rule",
	"which expansion follows from the product rule for the given factors",
	"which quotient-rule expression matches u'v minus uv' over v squared for the stated u and v",
	"which implicit differentiation result for dy/dx is correct",
	"which chain-rule derivative matches the composition described",
	"which velocity value matches the derivative of the position function",
	"which acceleration value follows by differentiating the velocity rule",
	"which related-rates differentiation step is correct for the constraint",
	"which linearization expression matches L(x) near the base point",
	"which definite integral expression matches the net signed area described",
	"which antiderivative is correct up to the constant of integration",
	"which derivative of an integral function matches the appropriate integrand",
	"which evaluation is justified by the Fundamental Theorem of Calculus Part 2",
	"which statement about infinite limits or vertical asymptotes is consistent",
	"which equation is in separable form for the purpose of separating variables",
	"which particular solution satisfies the given initial condition",
	"which integral gives the volume by the disk or washer method as described",
	"which inference about increasing, decreasing, or extrema is supported by f prime",
] as const;

function buildCalcAbStructures(): readonly string[] {
	const out: string[] = [];
	for (const lead of CALC_AB_OPEN_LEADS) {
		for (const frame of CALC_AB_TASK_FRAMES) {
			out.push(`${lead}, ${frame}?`);
		}
	}
	return out;
}

/** Exactly 1000 distinct stem skeletons for AP Calculus AB. */
export const CALC_AB_SENTENCE_STRUCTURES: readonly string[] = buildCalcAbStructures();

const _calcAbStructureSet = new Set(CALC_AB_SENTENCE_STRUCTURES);
if (_calcAbStructureSet.size !== CALC_AB_SENTENCE_STRUCTURES.length) {
	throw new Error("calcAbSentenceStructures: duplicate sentence structures in Cartesian product");
}
if (CALC_AB_SENTENCE_STRUCTURES.length < 1000) {
	throw new Error(`calcAbSentenceStructures: expected at least 1000 structures, got ${CALC_AB_SENTENCE_STRUCTURES.length}`);
}

/** Stable index in range [0, CALC_AB_SENTENCE_STRUCTURES.length). */
export function calcAbSentenceStructureIndex(seed: number): number {
	const n = CALC_AB_SENTENCE_STRUCTURES.length;
	const x = Number.isFinite(seed) ? Math.floor(Math.abs(seed)) : 0;
	return ((x % n) + n) % n;
}

export function getCalcAbSentenceStructure(seed: number): string {
	return CALC_AB_SENTENCE_STRUCTURES[calcAbSentenceStructureIndex(seed)];
}
