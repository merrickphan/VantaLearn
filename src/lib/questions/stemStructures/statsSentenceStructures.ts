/**
 * Enumerated AP Statistics MCQ stem **sentence structures** (grammatical skeletons).
 * Built as a Cartesian product: 40 × 25 = 1000 distinct strings (parameters like sample sizes
 * or counts do not count as new structures).
 */

const STATS_OPEN_LEADS = [
	"Based on the plot or table shown",
	"Using the context described in the stimulus",
	"From the summary statistics provided",
	"Interpreting the distribution shape in the exhibit",
	"Using the definitions of categorical and quantitative variables",
	"Using the dotplot or histogram description",
	"Using the boxplot information about quartiles and spread",
	"Using the 1.5×IQR outlier rule",
	"Using the z-score definition",
	"Comparing two distributions using center and spread",
	"From the scatterplot relationship described",
	"Using the direction and strength of association",
	"Using the meaning of correlation r",
	"Using the least-squares regression line information",
	"Using residuals or a residual plot",
	"Using the meaning of r-squared",
	"Using a sampling method described (SRS/stratified/cluster/systematic)",
	"Using the sampling bias described in the scenario",
	"Using the experiment design features (treatments/factors/control)",
	"Using random assignment versus random sampling",
	"Using probability rules (addition/multiplication)",
	"Using conditional probability notation P(A|B)",
	"Using independence criteria",
	"Using a discrete random variable table",
	"Using expected value in context",
	"Using simulation results described in the stimulus",
	"Using a sampling distribution description",
	"Using standard error language",
	"Using Central Limit Theorem reasoning",
	"Using inference structure (CI or test) as described",
	"Using a null and alternative hypothesis framing",
	"Using p-value and significance level interpretation",
	"Using Type I and Type II error interpretations",
	"Using chi-square test conditions and expected counts",
	"Using regression inference for slope",
	"Using conditions for inference (random/normal/independent/large counts)",
	"Using paired data language",
	"Using two-way table reasoning",
	"Using tree-diagram probability reasoning",
	"Using a conclusion in context requirement",
] as const;

const STATS_TASK_FRAMES = [
	"which variable type classification is correct",
	"which display is most appropriate for the variable type",
	"which statement best describes the shape of the distribution",
	"which measure of center is most appropriate given skew/outliers",
	"which measure of spread is most appropriate given skew/outliers",
	"which value is an outlier by the 1.5×IQR rule",
	"which statement correctly interprets a z-score",
	"which statement correctly compares the two distributions",
	"which statement best describes association direction/strength",
	"which statement correctly interprets correlation r",
	"which statement correctly interprets r-squared",
	"which point would be most influential in regression",
	"which residual interpretation is correct",
	"which sampling method description matches the procedure",
	"which source of bias is most plausible in the design",
	"which statement distinguishes random sampling from random assignment",
	"which probability expression matches the event description",
	"which conditional probability expression matches the situation",
	"which statement correctly identifies independence",
	"which expected value computation is correct",
	"which statement describes variability of a statistic via standard error",
	"which CLT-based conclusion is justified",
	"which confidence interval interpretation is correct",
	"which hypothesis test conclusion is correct given p and alpha",
	"which statement correctly describes a Type I or Type II error",
] as const;

function buildStatsStructures(): readonly string[] {
	const out: string[] = [];
	for (const lead of STATS_OPEN_LEADS) {
		for (const frame of STATS_TASK_FRAMES) {
			out.push(`${lead}, ${frame}?`);
		}
	}
	return out;
}

/** Exactly 1000 distinct stem skeletons for AP Statistics. */
export const STATS_SENTENCE_STRUCTURES: readonly string[] = buildStatsStructures();

const _statsSet = new Set(STATS_SENTENCE_STRUCTURES);
if (_statsSet.size !== STATS_SENTENCE_STRUCTURES.length) {
	throw new Error("statsSentenceStructures: duplicate sentence structures in Cartesian product");
}
if (STATS_SENTENCE_STRUCTURES.length < 1000) {
	throw new Error(`statsSentenceStructures: expected at least 1000 structures, got ${STATS_SENTENCE_STRUCTURES.length}`);
}

export function statsSentenceStructureIndex(seed: number): number {
	const n = STATS_SENTENCE_STRUCTURES.length;
	const x = Number.isFinite(seed) ? Math.floor(Math.abs(seed)) : 0;
	return ((x % n) + n) % n;
}

export function getStatsSentenceStructure(seed: number): string {
	return STATS_SENTENCE_STRUCTURES[statsSentenceStructureIndex(seed)];
}

