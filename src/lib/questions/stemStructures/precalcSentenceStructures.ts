/**
 * Enumerated AP Precalculus MCQ stem **sentence structures** (grammatical skeletons).
 * Built as a Cartesian product: 40 × 25 = 1000 distinct strings (parameters like coefficients
 * are not part of the structure count).
 */

const PRECALC_OPEN_LEADS = [
	"Based on the graph or table provided",
	"From the function definition in the context",
	"Using function notation as stated",
	"Using the stated domain and range constraints",
	"Interpreting the transformation described",
	"Given the polynomial’s degree and leading coefficient",
	"Using end behavior reasoning for a polynomial",
	"Using turning-point and intercept information",
	"From the zero and multiplicity information",
	"From the factored form shown",
	"From the expanded form shown",
	"Using a polynomial model constructed from conditions",
	"Given the rational function and its domain restrictions",
	"After simplifying the rational expression appropriately",
	"Using vertical and horizontal asymptote information",
	"Using slant-asymptote reasoning when applicable",
	"Using the exponential growth/decay model described",
	"Using exponent rules to simplify",
	"Using logarithms as inverses of exponentials",
	"Using log properties (product/quotient/power)",
	"Using a change-of-base perspective when needed",
	"Using unit-circle definitions (radians and coordinates)",
	"Using trig symmetry and periodicity",
	"Using inverse trig principal values",
	"Using the complex-number definition i^2 = -1",
	"Using the cyclic pattern of powers of i",
	"Using the quadratic formula and discriminant meaning",
	"Using synthetic or long division structure",
	"Using the Fundamental Theorem of Algebra connection",
	"Using a sum/difference identity provided or implied",
	"Using a double-angle relationship",
	"Using function composition language f(g(x))",
	"Using inverse-function verification steps",
	"Using a piecewise definition and interval behavior",
	"Using systems-of-equations interpretation (intersection points)",
	"Using elimination/substitution steps in a linear system",
	"Using a matrix representation of a simple system",
	"Using a scatterplot trend description",
	"Distinguishing correlation from causation in the scenario",
	"Using basic probability rules in the setup",
] as const;

const PRECALC_TASK_FRAMES = [
	"which statement best describes the function’s domain",
	"which statement best describes the function’s range on the stated interval",
	"which value equals f(a) for the input shown",
	"which expression represents the transformed function",
	"which choice matches the polynomial’s end behavior",
	"which statement about zeros and multiplicity is correct",
	"which x-intercept behavior (cross/touch) is consistent with the multiplicity",
	"which factor must be present given the stated zero",
	"which equation is equivalent after simplifying the rational expression",
	"which value is excluded from the domain",
	"which statement about a hole or removable discontinuity is correct",
	"which statement about a vertical asymptote is correct",
	"which statement about a horizontal or slant asymptote is correct",
	"which solution set is correct after solving the rational equation (excluding extraneous solutions)",
	"which expression is equivalent after applying exponent rules",
	"which expression is equivalent after applying log rules",
	"which equation results after taking logarithms appropriately",
	"which statement best interprets a growth/decay parameter",
	"which exact trig value is correct (unit circle)",
	"which identity-based simplification is correct",
	"which principal value is correct for an inverse trig expression",
	"which complex-number result is correct",
	"which power of i simplifies to the stated value",
	"which statement about the number/type of roots is correct",
	"which remainder corresponds to evaluating the polynomial at the given input",
] as const;

function buildPrecalcStructures(): readonly string[] {
	const out: string[] = [];
	for (const lead of PRECALC_OPEN_LEADS) {
		for (const frame of PRECALC_TASK_FRAMES) {
			out.push(`${lead}, ${frame}?`);
		}
	}
	return out;
}

/** Exactly 1000 distinct stem skeletons for AP Precalculus. */
export const PRECALC_SENTENCE_STRUCTURES: readonly string[] = buildPrecalcStructures();

const _precalcSet = new Set(PRECALC_SENTENCE_STRUCTURES);
if (_precalcSet.size !== PRECALC_SENTENCE_STRUCTURES.length) {
	throw new Error("precalcSentenceStructures: duplicate sentence structures in Cartesian product");
}
if (PRECALC_SENTENCE_STRUCTURES.length < 1000) {
	throw new Error(`precalcSentenceStructures: expected at least 1000 structures, got ${PRECALC_SENTENCE_STRUCTURES.length}`);
}

export function precalcSentenceStructureIndex(seed: number): number {
	const n = PRECALC_SENTENCE_STRUCTURES.length;
	const x = Number.isFinite(seed) ? Math.floor(Math.abs(seed)) : 0;
	return ((x % n) + n) % n;
}

export function getPrecalcSentenceStructure(seed: number): string {
	return PRECALC_SENTENCE_STRUCTURES[precalcSentenceStructureIndex(seed)];
}

