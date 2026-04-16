/**
 * Enumerated AP Calculus BC MCQ stem **sentence structures** (grammatical skeletons).
 * Built as a Cartesian product: 40 × 25 = 1000 distinct strings (parameters like coefficients
 * are not part of the structure count).
 *
 * Compared to AB, frames include BC-only representations (parametric, polar, series, improper integrals).
 */

const CALC_BC_OPEN_LEADS = [
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
	"For an accumulation function written as an integral with variable upper limit",
	"Using the Fundamental Theorem of Calculus in the role stated",
	"In the related-rates geometric setup described",
	"For the region between two graphs identified in the stem",
	"For the solid formed by revolution about the indicated axis",
	"Using a Riemann-sum viewpoint for the partition described",
	"Using the trapezoidal rule form described for an approximation",
	"For the parametric curve described by x(t) and y(t)",
	"For the polar curve described by r as a function of θ",
	"In a series context using the convergence test named in the stem",
	"Interpreting convergence using the improper-integral form described",
	"Using a local Taylor polynomial approximation as described",
	"Using the Lagrange remainder form indicated",
	"Using symmetry or periodicity only when explicitly justified by the stem",
	"Evaluating end behavior from dominant-term reasoning",
	"Using a slope-field viewpoint for dy/dx",
	"With the initial condition specified in the stem",
	"Interpreting net change from a rate function in context",
	"Relating average value of a function to values on an interval",
	"Where a convergence or divergence claim must be justified",
] as const;

const CALC_BC_TASK_FRAMES = [
	"which expression equals f'(x)",
	"which value is the correct evaluation of the indicated limit",
	"which statement about continuity at the point in question is true",
	"which conclusion follows from the Intermediate Value Theorem in this setting",
	"which simplified limit matches direct substitution after factoring",
	"which one-sided limit statement is consistent with the context",
	"which conclusion about a horizontal asymptote is correct",
	"which implicit differentiation result for dy/dx is correct",
	"which chain-rule derivative matches the composition described",
	"which evaluation is justified by the Fundamental Theorem of Calculus Part 2",
	"which derivative of an accumulation function matches the appropriate integrand",
	"which equation is in separable form for the purpose of separating variables",
	"which particular solution satisfies the given initial condition",
	"which integral gives the volume by the disk or washer method as described",
	"which inference about increasing, decreasing, or extrema is supported by derivative information",
	"which expression equals dy/dx using dy/dt divided by dx/dt for the parameter value",
	"which integral represents polar area using one-half times the integral of r squared",
	"which statement correctly applies a named series convergence test",
	"which statement correctly applies the divergence (nth-term) test",
	"which classification is correct for a p-series given the exponent",
	"which statement correctly applies a comparison or limit-comparison test",
	"which conclusion about an alternating series and its error bound is correct",
	"which conclusion about a power series interval of convergence is justified",
	"which statement about an improper integral’s convergence is correct",
	"which numeric approximation matches the trapezoidal rule setup described",
] as const;

function buildCalcBcStructures(): readonly string[] {
	const out: string[] = [];
	for (const lead of CALC_BC_OPEN_LEADS) {
		for (const frame of CALC_BC_TASK_FRAMES) {
			out.push(`${lead}, ${frame}?`);
		}
	}
	return out;
}

/** Exactly 1000 distinct stem skeletons for AP Calculus BC. */
export const CALC_BC_SENTENCE_STRUCTURES: readonly string[] = buildCalcBcStructures();

const _calcBcStructureSet = new Set(CALC_BC_SENTENCE_STRUCTURES);
if (_calcBcStructureSet.size !== CALC_BC_SENTENCE_STRUCTURES.length) {
	throw new Error("calcBcSentenceStructures: duplicate sentence structures in Cartesian product");
}
if (CALC_BC_SENTENCE_STRUCTURES.length < 1000) {
	throw new Error(`calcBcSentenceStructures: expected at least 1000 structures, got ${CALC_BC_SENTENCE_STRUCTURES.length}`);
}

/** Stable index in range [0, CALC_BC_SENTENCE_STRUCTURES.length). */
export function calcBcSentenceStructureIndex(seed: number): number {
	const n = CALC_BC_SENTENCE_STRUCTURES.length;
	const x = Number.isFinite(seed) ? Math.floor(Math.abs(seed)) : 0;
	return ((x % n) + n) % n;
}

export function getCalcBcSentenceStructure(seed: number): string {
	return CALC_BC_SENTENCE_STRUCTURES[calcBcSentenceStructureIndex(seed)];
}

