import { AP_COURSES } from "@/lib/apCatalog";
import { getApFrqReplicaSpec } from "@/lib/apFrqExamReplicaFormat";
import { getUnitOrFirst, getUnitsForCourseId } from "@/lib/apUnits";
import type { ExamFigure, ExamQuestion, FrqRubricCriterion, FrqRubricDoc, FrqRubricPart } from "@/types";
import type { ProceduralDifficulty } from "@/lib/questions/procedural";
import { createRng, hashString, pick, randInt } from "./utils";

/** Number of distinct FRQ practice sets per course (deterministic by setIndex). */
export const AP_FRQ_PRACTICE_SET_COUNT = 100;

/** Internal sentinel so auto-grading never marks FRQ items “correct” by accident. */
export const AP_FRQ_PLACEHOLDER_ANSWER = "__VANTALEARN_FRQ_SELF_SCORE__";

type FrqTrack =
	| "human_geo"
	| "history"
	| "math"
	| "science"
	| "social"
	| "english"
	| "cs"
	| "world_lang"
	| "arts"
	| "capstone"
	| "generic";

function frqTrackForCourse(courseId: string): FrqTrack {
	if (courseId === "hum-geo") return "human_geo";
	if (courseId === "ush" || courseId === "wh" || courseId === "euro") return "history";
	if (courseId === "calc-ab" || courseId === "calc-bc" || courseId === "precalc" || courseId === "stats") return "math";
	if (
		courseId === "physics-1" ||
		courseId === "physics-2" ||
		courseId === "physics-c-m" ||
		courseId === "physics-c-em" ||
		courseId === "chem" ||
		courseId === "bio" ||
		courseId === "env"
	) {
		return "science";
	}
	if (courseId === "gov" || courseId === "comp-gov" || courseId === "macro" || courseId === "micro" || courseId === "psych") {
		return "social";
	}
	if (courseId === "lang" || courseId === "lit") return "english";
	if (courseId === "cs-a" || courseId === "csp") return "cs";
	if (courseId === "spanish" || courseId === "french" || courseId === "german" || courseId === "latin" || courseId === "chinese" || courseId === "japanese") {
		return "world_lang";
	}
	if (courseId === "art-hist" || courseId === "art-design" || courseId === "music") return "arts";
	if (courseId === "seminar" || courseId === "research") return "capstone";
	return "generic";
}

function clampSetIndex(n: number): number {
	if (!Number.isFinite(n)) return 0;
	return Math.min(AP_FRQ_PRACTICE_SET_COUNT - 1, Math.max(0, Math.floor(n)));
}

function idFor(courseId: string, setIndex: number, slot: number, tag: string): string {
	return `frq-${courseId}-s${setIndex}-q${slot}-${hashString(`${courseId}|${setIndex}|${slot}|${tag}`).toString(36)}`;
}

function crit(pointLabel: string, descriptor: string, acceptable: string[]): FrqRubricCriterion {
	return { pointLabel, descriptor, acceptableExamples: acceptable };
}

function rubricDoc(header: string, total: number, parts: FrqRubricPart[]): FrqRubricDoc {
	return { header, totalPoints: total, parts };
}

const PLACES = [
	"a coastal primate city in Southeast Asia",
	"a landlocked state in Central Europe",
	"a rapidly urbanizing corridor in Sub-Saharan Africa",
	"a post-industrial metro region in North America",
	"a highland community in the Andes",
	"a river delta megacity in South Asia",
	"a Pacific archipelago economy",
	"a Sahel borderland settlement",
	"a Caribbean small island developing state",
	"a Middle Eastern entrepôt trading hub",
];

const HG_CONCEPTS = [
	{ term: "nation-state", define: "a sovereign state whose boundaries largely align with a dominant national group" },
	{ term: "supranational organization", define: "an institution where member states voluntarily pool authority to address shared issues" },
	{ term: "centripetal force", define: "a factor that strengthens unity and cohesion within a state" },
	{ term: "centrifugal force", define: "a factor that threatens to pull a state apart or weaken cohesion" },
	{ term: "sequent occupance", define: "the idea that successive societies leave their cultural imprint on a landscape" },
	{ term: "formal region", define: "an area defined by one or more measurable, shared traits" },
	{ term: "functional region", define: "an area organized around a node and interaction (flows, networks)" },
	{ term: "perceptual region", define: "a region defined by popular feelings, images, or stereotypes rather than strict data" },
	{ term: "distance decay", define: "the decline of interaction or influence as distance increases" },
	{ term: "time-space compression", define: "the sense that places are effectively closer because connectivity reduces friction of distance" },
];

const SOCIAL_CONCEPTS = [
	"policy feedback",
	"collective action problems",
	"political socialization",
	"interest-group pluralism",
	"regime legitimacy",
	"judicial review",
	"federalism as a compromise structure",
	"selective incorporation",
	"economic tradeoffs (guns vs butter)",
	"market failure",
	"price elasticity of demand",
	"comparative advantage",
	"cognitive dissonance",
	"operational definitions in psychology",
	"random assignment vs random sampling",
];

const HISTORY_TOPICS = [
	"state-building and political centralization",
	"economic change and labor systems",
	"imperial expansion and resistance",
	"revolution and new political orders",
	"warfare and diplomacy",
	"cultural exchange and syncretism",
	"environment and demography",
	"rights, citizenship, and social movements",
];

const SCI_PHENOM = [
	"enzyme kinetics",
	"population dynamics",
	"energy transfer in trophic levels",
	"half-life and decay",
	"gas laws in a closed system",
	"circuit behavior under changing resistance",
	"wave interference",
	"acid-base buffer behavior",
	"cellular respiration pathways",
	"natural selection in a changing environment",
];

function buildHumanGeoSet(
	rng: () => number,
	ctx: { courseId: string; courseName: string; unitTitle: string; setIndex: number },
): ExamQuestion[] {
	const place = pick(rng, PLACES);
	const c0 = pick(rng, HG_CONCEPTS);

	const q0: ExamQuestion = {
		id: idFor(ctx.courseId, ctx.setIndex, 0, "hg0"),
		type: "free_response",
		subject: ctx.courseName,
		correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
		question: `You are analyzing ${place} within the scope of **${ctx.unitTitle}**.\n\n**A)** Define the concept of **${c0.term}**. **(1 point)**\n\n**B)** Explain **one** way ${c0.term} helps explain a pattern you would expect to see in ${place}. **(2 points)**`,
		frq_rubric: rubricDoc("Question 1: No stimulus", 3, [
			{
				letter: "A",
				promptText: `Define the concept of ${c0.term}.`,
				maxPoints: 1,
				criteria: [
					crit(
						"(Point 1)",
						"Accurate definition",
						[
							`States that ${c0.term} involves ${c0.define}.`,
							"Uses geographic vocabulary correctly (may paraphrase).",
							"Shows understanding distinct from a vague synonym.",
						],
					),
				],
			},
			{
				letter: "B",
				promptText: `Explain one way ${c0.term} helps explain an expected pattern in ${place}.`,
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Logical mechanism", [
						"Links the definition to a concrete geographic outcome (migration, borders, development, diffusion, etc.).",
						"Explains *why* the mechanism follows from the concept (not only an example list).",
					]),
					crit("(Point 2)", "Place-specific grounding", [
						`Explicitly ties the explanation to ${place} (process, policy, or landscape evidence).`,
						"Uses at least one plausible geographic detail (distance, scale, institutions, resources).",
					]),
				],
			},
		]),
		explanation: `Self-check: ${c0.term} should be defined precisely, then tied to an observable pattern in ${place}.`,
	};

	const fig1: ExamFigure = {
		kind: "table",
		title: "Table 1. Selected indicators (practice exhibit)",
		headers: ["Indicator", "Value"],
		rows: [
			["Urban population share (%)", String(randInt(rng, 42, 92))],
			["Youth dependency ratio", String((randInt(rng, 35, 75) / 100).toFixed(2))],
			["Female LF participation (%)", String(randInt(rng, 38, 72))],
		],
	};

	const q1: ExamQuestion = {
		id: idFor(ctx.courseId, ctx.setIndex, 1, "hg1"),
		type: "free_response",
		subject: ctx.courseName,
		correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
		figure: fig1,
		question: `Use **Table 1** and your knowledge of **${ctx.unitTitle}**.\n\n**A)** Describe **one** pattern suggested by the table. **(1 point)**\n\n**B)** Explain **one** plausible geographic process that could help account for that pattern. **(2 points)**`,
		frq_rubric: rubricDoc("Question 2: One stimulus", 3, [
			{
				letter: "A",
				promptText: "Describe one pattern suggested by the table.",
				maxPoints: 1,
				criteria: [
					crit("(Point 1)", "Data-linked description", [
						"Identifies a relationship or contrast supported by the numeric values.",
						"Uses evidence from at least two rows (explicitly or implicitly).",
					]),
				],
			},
			{
				letter: "B",
				promptText: "Explain one plausible geographic process behind the pattern.",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Process clarity", [
						"Names a geographic process (e.g., migration, urbanization, policy, diffusion, industrial restructuring).",
						"Explains direction of change or who/where is affected.",
					]),
					crit("(Point 2)", "Mechanism + linkage", [
						"Connects the process back to the table pattern without contradicting the data.",
						"Uses course-appropriate reasoning (scale, place, interaction).",
					]),
				],
			},
		]),
	};

	const stim2: ExamFigure = {
		kind: "stimulus",
		title: "Stimuli for Question 3",
		body: `**Stimulus A — excerpt (hypothetical)**\nA national government announces incentives for firms to relocate manufacturing to secondary cities, citing “balanced growth” and reduced congestion in the primate city.\n\n---\n\n**Stimulus B — data note (hypothetical)**\nAnalysts report rising intra-regional trade within a customs union while per-capita income dispersion across member states remains high.`,
	};

	const q2: ExamQuestion = {
		id: idFor(ctx.courseId, ctx.setIndex, 2, "hg2"),
		type: "free_response",
		subject: ctx.courseName,
		correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
		figure: stim2,
		question: `Refer to **Stimulus A** and **Stimulus B**.\n\n**A)** Identify **one** economic goal implied by Stimulus A. **(1 point)**\n\n**B)** Describe **one** tension suggested when Stimulus B is read alongside Stimulus A. **(2 points)**\n\n**C)** Propose **one** geographically realistic policy tradeoff a supranational body might face when responding. **(2 points)**`,
		frq_rubric: rubricDoc("Question 3: Two stimuli", 5, [
			{
				letter: "A",
				promptText: "Identify one economic goal implied by Stimulus A.",
				maxPoints: 1,
				criteria: [
					crit("(Point 1)", "Accurate identification", [
						"Names a defensible goal (deconcentration, employment, competitiveness, congestion relief, regional equity).",
						"Cites language or logic consistent with Stimulus A.",
					]),
				],
			},
			{
				letter: "B",
				promptText: "Describe one tension when A and B are read together.",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Tension stated clearly", [
						"Explains how B complicates a simple success story implied by A (e.g., integration vs inequality).",
					]),
					crit("(Point 2)", "Geographic/economic reasoning", [
						"Uses at least one mechanism: cores/peripheries, factor mobility, institutions, scale economies, transfers.",
					]),
				],
			},
			{
				letter: "C",
				promptText: "Propose one realistic supranational policy tradeoff.",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Tradeoff named", [
						"States what is gained *and* what is sacrificed or risked (sovereignty, cohesion, equity, enforcement).",
					]),
					crit("(Point 2)", "Plausible governance detail", [
						"References a tool harmonization, standards, funds, dispute resolution, or monitoring—without inventing fake treaties by name.",
					]),
				],
			},
		]),
	};

	return [q0, q1, q2];
}

function buildSocialSet(
	rng: () => number,
	ctx: { courseId: string; courseName: string; unitTitle: string; setIndex: number },
): ExamQuestion[] {
	const concept = pick(rng, SOCIAL_CONCEPTS);
	const place = pick(rng, PLACES);
	const q0: ExamQuestion = {
		id: idFor(ctx.courseId, ctx.setIndex, 0, "soc0"),
		type: "free_response",
		subject: ctx.courseName,
		correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
		question: `In **${ctx.unitTitle}** (${ctx.courseName}), **A)** define **${concept}** in your own words. **(1 point)** **B)** explain **one** consequence of ${concept} for governance or behavior in ${place}. **(2 points)**`,
		frq_rubric: rubricDoc("Question 1: No stimulus", 3, [
			{
				letter: "A",
				promptText: `Define ${concept}.`,
				maxPoints: 1,
				criteria: [
					crit("(Point 1)", "Definition", [
						"Accurate, course-appropriate meaning (may paraphrase textbook language).",
						"Not a circular definition (“when X is X”).",
					]),
				],
			},
			{
				letter: "B",
				promptText: `Explain one consequence for governance or behavior in ${place}.`,
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Mechanism", ["Shows how incentives, beliefs, institutions, or group dynamics change."]),
					crit("(Point 2)", "Application", [`Grounds the consequence in ${place} with a plausible detail.`]),
				],
			},
		]),
	};

	const fig: ExamFigure = {
		kind: "bar_chart",
		title: "Figure 1. Survey support for three policy options (%)",
		yLabel: "Percent supporting",
		bars: [
			{ label: "Option P", value: randInt(rng, 18, 42) },
			{ label: "Option Q", value: randInt(rng, 28, 55) },
			{ label: "Option R", value: randInt(rng, 12, 36) },
		],
	};

	const q1: ExamQuestion = {
		id: idFor(ctx.courseId, ctx.setIndex, 1, "soc1"),
		type: "free_response",
		subject: ctx.courseName,
		correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
		figure: fig,
		question: `Use **Figure 1**.\n\n**A)** Describe **one** pattern in public support. **(1 point)**\n\n**B)** Explain **one** reason the pattern could emerge in the context of **${ctx.unitTitle}**. **(2 points)**`,
		frq_rubric: rubricDoc("Question 2: One stimulus", 3, [
			{
				letter: "A",
				promptText: "Describe one pattern in the chart.",
				maxPoints: 1,
				criteria: [crit("(Point 1)", "Evidence use", ["Compares categories using numeric values from the figure."])],
			},
			{
				letter: "B",
				promptText: "Explain one reason tied to the unit.",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Causal logic", ["Provides a believable mechanism (information, interests, institutions, framing)."]),
					crit("(Point 2)", "Course linkage", [`Explicitly connects to ${ctx.unitTitle}.`]),
				],
			},
		]),
	};

	const stim: ExamFigure = {
		kind: "stimulus",
		title: "Stimuli for Question 3",
		body: `**Stimulus A**\nA legislator argues that decentralizing implementation will improve responsiveness but risks uneven enforcement.\n\n---\n\n**Stimulus B**\nAn agency report claims standardized metrics improved transparency while reducing local flexibility.`,
	};

	const q2: ExamQuestion = {
		id: idFor(ctx.courseId, ctx.setIndex, 2, "soc2"),
		type: "free_response",
		subject: ctx.courseName,
		correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
		figure: stim,
		question: `**A)** Identify **one** tradeoff emphasized in Stimulus A. **(1 point)**\n\n**B)** Describe **one** tension between Stimulus A and Stimulus B. **(2 points)**\n\n**C)** Propose **one** design principle that could mitigate the tension (without claiming a perfect solution). **(2 points)**`,
		frq_rubric: rubricDoc("Question 3: Two stimuli", 5, [
			{
				letter: "A",
				promptText: "Identify one tradeoff in Stimulus A.",
				maxPoints: 1,
				criteria: [crit("(Point 1)", "Accurate identification", ["Names both sides of the tradeoff in plain language."])],
			},
			{
				letter: "B",
				promptText: "Describe tension between A and B.",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Contrast stated", ["Explains how metrics/standardization interacts with decentralization/flexibility."]),
					crit("(Point 2)", "Implication", ["Shows why both cannot be maximized simultaneously without a compromise."]),
				],
			},
			{
				letter: "C",
				promptText: "Propose one mitigation principle.",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Principle", ["Offers a concrete governance idea (audits, waivers, pilot programs, sunset clauses, tiered standards)."]),
					crit("(Point 2)", "Feasibility", ["Acknowledges a cost or limit—does not assert zero tradeoffs remain."]),
				],
			},
		]),
	};

	return [q0, q1, q2];
}

function buildHistorySet(
	rng: () => number,
	ctx: { courseId: string; courseName: string; unitTitle: string; setIndex: number },
): ExamQuestion[] {
	const topic = pick(rng, HISTORY_TOPICS);
	const era = ctx.unitTitle;
	const q0: ExamQuestion = {
		id: idFor(ctx.courseId, ctx.setIndex, 0, "his0"),
		type: "free_response",
		subject: ctx.courseName,
		correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
		question: `Within **${era}** (${ctx.courseName}), **A)** describe **one** significant change related to **${topic}**. **(2 points)**\n\n**B)** explain **one** cause *or* consequence of that change. **(2 points)**`,
		frq_rubric: rubricDoc("Question 1: No stimulus", 4, [
			{
				letter: "A",
				promptText: `Describe one significant change (${topic}).`,
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Specificity", ["Names actors, places, institutions, technologies, or events appropriate to the era."]),
					crit("(Point 2)", "Change over time", ["Shows before/after or a directional shift—not a static description only."]),
				],
			},
			{
				letter: "B",
				promptText: "Explain one cause or consequence.",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Causation", ["Uses historically plausible reasoning (economic, political, social, environmental)."]),
					crit("(Point 2)", "Linkage", ["Connects clearly to the change described in part A."]),
				],
			},
		]),
	};

	const fig: ExamFigure = {
		kind: "line_chart",
		title: "Figure 1. Index of urban wage earners (hypothetical, 1880–1920)",
		yLabel: "Index (1880 = 100)",
		points: [
			{ x: "1880", y: 100 },
			{ x: "1895", y: randInt(rng, 112, 148) },
			{ x: "1910", y: randInt(rng, 155, 210) },
			{ x: "1920", y: randInt(rng, 170, 240) },
		],
	};

	const q1: ExamQuestion = {
		id: idFor(ctx.courseId, ctx.setIndex, 1, "his1"),
		type: "free_response",
		subject: ctx.courseName,
		correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
		figure: fig,
		question: `Use **Figure 1** and your understanding of **${era}**.\n\n**A)** Describe **one** trend in the index. **(1 point)**\n\n**B)** Explain **one** historical development that could help explain the trend. **(2 points)**`,
		frq_rubric: rubricDoc("Question 2: One stimulus", 3, [
			{
				letter: "A",
				promptText: "Describe one trend.",
				maxPoints: 1,
				criteria: [crit("(Point 1)", "Trend", ["Uses at least two points on the line to establish direction or acceleration."])],
			},
			{
				letter: "B",
				promptText: "Explain one historical development.",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Context", ["Names a plausible industrial, demographic, labor, or policy development for the era."]),
					crit("(Point 2)", "Linkage", ["Connects the development to wage/index behavior without contradicting the figure."]),
				],
			},
		]),
	};

	const stim: ExamFigure = {
		kind: "stimulus",
		title: "Stimuli for Question 3",
		body: `**Stimulus A — perspective 1**\n“We modernized transport and finance; critics forget the human costs in the countryside.”\n\n---\n\n**Stimulus B — perspective 2**\n“Growth depended on extracting labor and resources from colonized peripheries—prosperity was not evenly shared.”`,
	};

	const q2: ExamQuestion = {
		id: idFor(ctx.courseId, ctx.setIndex, 2, "his2"),
		type: "free_response",
		subject: ctx.courseName,
		correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
		figure: stim,
		question: `**A)** Identify **one** point of agreement *or* disagreement between the perspectives. **(1 point)**\n\n**B)** Explain **one** way **${topic}** helps interpret the disagreement. **(2 points)**\n\n**C)** Provide **one** piece of historical evidence that supports *either* perspective (not both). **(2 points)**`,
		frq_rubric: rubricDoc("Question 3: Two stimuli", 5, [
			{
				letter: "A",
				promptText: "Identify agreement or disagreement.",
				maxPoints: 1,
				criteria: [crit("(Point 1)", "Comparison", ["Clearly references both stimuli in one sentence or tight pair of sentences."])],
			},
			{
				letter: "B",
				promptText: `Explain using ${topic}.`,
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Interpretation", ["Shows how the theme reframes stakes (who wins, who loses, what scales matter)."]),
					crit("(Point 2)", "Precision", ["Avoids anachronisms relative to the unit framing."]),
				],
			},
			{
				letter: "C",
				promptText: "Evidence for one side.",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Evidence", ["Specific example (event, policy, statistic pattern, primary-type detail)."]),
					crit("(Point 2)", "Support", ["Explains how the evidence supports the chosen perspective."]),
				],
			},
		]),
	};

	return [q0, q1, q2];
}

function buildMathSet(
	rng: () => number,
	ctx: { courseId: string; courseName: string; unitTitle: string; setIndex: number },
): ExamQuestion[] {
	const a = randInt(rng, 2, 9);
	const b = randInt(rng, -12, 12);
	const c = randInt(rng, 2, 11);
	const fx = b >= 0 ? `${a}x^2 + ${b}x + ${c}` : `${a}x^2 - ${-b}x + ${c}`;
	const q0: ExamQuestion = {
		id: idFor(ctx.courseId, ctx.setIndex, 0, "m0"),
		type: "free_response",
		subject: ctx.courseName,
		correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
		question: `Let \\(f(x) = ${fx}\\) for all real \\(x\\). This item aligns with **${ctx.unitTitle}**.\n\n**A)** Find \\(f'(x)\\). **(1 point)**\n\n**B)** Determine whether \\(f\\) has a local maximum, local minimum, or neither at the critical point in the interior of the domain shown by your algebra—justify using an appropriate derivative test or sign analysis. **(3 points)**`,
		frq_rubric: rubricDoc("Question 1: No stimulus", 4, [
			{
				letter: "A",
				promptText: "Find f'(x).",
				maxPoints: 1,
				criteria: [
					crit("(Point 1)", "Derivative", [
						"Applies power rule (and constant rule) correctly to obtain a linear derivative.",
						"Simplifies to standard polynomial form.",
					]),
				],
			},
			{
				letter: "B",
				promptText: "Classify the interior critical point with justification.",
				maxPoints: 3,
				criteria: [
					crit("(Point 1)", "Critical point", ["Finds where f'(x)=0 (or explains if none) with correct algebra."]),
					crit("(Point 2)", "Test choice", ["Uses first-derivative sign change or second derivative test consistently."]),
					crit("(Point 3)", "Conclusion", ["States max/min/neither with reasoning matching the test outcome."]),
				],
			},
		]),
		explanation: `Differentiate with the power rule, then locate critical points where f'(x)=0 and justify max/min with an appropriate test.`,
	};

	const x0 = randInt(rng, 1, 8);
	const table: ExamFigure = {
		kind: "table",
		title: "Table 1. Values of g near x = " + String(x0),
		headers: ["x", "g(x)"],
		rows: [
			[String(x0 - 1), String(randInt(rng, 10, 40))],
			[String(x0), String(randInt(rng, 41, 70))],
			[String(x0 + 1), String(randInt(rng, 10, 40))],
		],
	};

	const q1: ExamQuestion = {
		id: idFor(ctx.courseId, ctx.setIndex, 1, "m1"),
		type: "free_response",
		subject: ctx.courseName,
		correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
		figure: table,
		question: `A differentiable function \\(g\\) is modeled by **Table 1** near \\(x=${x0}\\).\n\n**A)** Estimate \\(g'(${x0})\\) using the table (show the difference quotient you use). **(2 points)**\n\n**B)** In one sentence, interpret the sign of your estimate in a real-world quantity if \\(g(x)\\) represents thousands of units sold at price \\(x\\). **(1 point)**`,
		frq_rubric: rubricDoc("Question 2: One stimulus", 3, [
			{
				letter: "A",
				promptText: "Estimate g'(x0) from the table.",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Setup", ["Uses a plausible symmetric or one-sided difference quotient with correct substitution."]),
					crit("(Point 2)", "Computation", ["Arithmetic matches the chosen points from the table."]),
				],
			},
			{
				letter: "B",
				promptText: "Interpret sign in context.",
				maxPoints: 1,
				criteria: [
					crit("(Point 1)", "Interpretation", [
						"Positive derivative: sales increase as price increases near x0 (local upward trend).",
						"Negative derivative: sales decrease as price increases near x0.",
					]),
				],
			},
		]),
	};

	const stim: ExamFigure = {
		kind: "stimulus",
		title: "Stimuli for Question 3",
		body: `**Stimulus A**\nA student claims: “Because the definite integral counts area, it must always be positive.”\n\n---\n\n**Stimulus B**\nAnother student responds: “But the integrand can be negative on part of the interval, so the integral can be negative or zero.”`,
	};

	const q2: ExamQuestion = {
		id: idFor(ctx.courseId, ctx.setIndex, 2, "m2"),
		type: "free_response",
		subject: ctx.courseName,
		correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
		figure: stim,
		question: `**A)** Identify **one** mathematical error or oversimplification in Stimulus A. **(1 point)**\n\n**B)** Explain **one** correct idea in Stimulus B using the language of **${ctx.unitTitle}**. **(2 points)**\n\n**C)** Give **one** concrete integral example on a closed interval that supports Stimulus B (you may define a simple piecewise linear function). **(2 points)**`,
		frq_rubric: rubricDoc("Question 3: Two stimuli", 5, [
			{
				letter: "A",
				promptText: "Identify issue in Stimulus A.",
				maxPoints: 1,
				criteria: [
					crit("(Point 1)", "Accuracy", [
						"Notes signed area / cancellation / below-axis contributions / orientation vs area.",
					]),
				],
			},
			{
				letter: "B",
				promptText: "Explain Stimulus B with unit language.",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Concept", ["Discusses net change, accumulation, FTC intuition, or signed contribution."]),
					crit("(Point 2)", "Unit linkage", [`Ties the idea explicitly to ${ctx.unitTitle} (not generic math only).`]),
				],
			},
			{
				letter: "C",
				promptText: "Concrete example.",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Example validity", ["Provides an interval and function behavior that yields ≤ 0 integral."]),
					crit("(Point 2)", "Explanation", ["Sketches reasoning (symmetry, negative region dominates, etc.)."]),
				],
			},
		]),
	};

	return [q0, q1, q2];
}

function buildScienceSet(
	rng: () => number,
	ctx: { courseId: string; courseName: string; unitTitle: string; setIndex: number },
): ExamQuestion[] {
	const phenom = pick(rng, SCI_PHENOM);
	const q0: ExamQuestion = {
		id: idFor(ctx.courseId, ctx.setIndex, 0, "sci0"),
		type: "free_response",
		subject: ctx.courseName,
		correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
		question: `You are investigating **${phenom}** within **${ctx.unitTitle}** (${ctx.courseName}).\n\n**A)** State **one** measurable independent variable and **one** dependent variable you could study. **(2 points)**\n\n**B)** Describe **one** control or randomization choice that would strengthen a causal claim. **(2 points)**`,
		frq_rubric: rubricDoc("Question 1: No stimulus", 4, [
			{
				letter: "A",
				promptText: "Variables",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Independent variable", ["Clear, measurable manipulator or stratifier appropriate to the investigation."]),
					crit("(Point 2)", "Dependent variable", ["Clear outcome measure tied to the phenomenon."]),
				],
			},
			{
				letter: "B",
				promptText: "Control / randomization",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Design choice", ["Names a plausible control, blocking factor, blind, or random assignment detail."]),
					crit("(Point 2)", "Causal reasoning", ["Explains how the choice reduces confounding or bias in one sentence+."]),
				],
			},
		]),
	};

	const fig: ExamFigure = {
		kind: "line_chart",
		title: "Figure 1. Measured quantity over time (arbitrary units)",
		yLabel: "Quantity",
		points: [
			{ x: "t0", y: randInt(rng, 10, 30) },
			{ x: "t1", y: randInt(rng, 35, 60) },
			{ x: "t2", y: randInt(rng, 55, 85) },
			{ x: "t3", y: randInt(rng, 40, 70) },
		],
	};

	const q1: ExamQuestion = {
		id: idFor(ctx.courseId, ctx.setIndex, 1, "sci1"),
		type: "free_response",
		subject: ctx.courseName,
		correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
		figure: fig,
		question: `Use **Figure 1**.\n\n**A)** Describe **one** pattern in the measured quantity. **(1 point)**\n\n**B)** Propose **one** biophysical or chemical mechanism consistent with the pattern (course-appropriate). **(2 points)**`,
		frq_rubric: rubricDoc("Question 2: One stimulus", 3, [
			{
				letter: "A",
				promptText: "Pattern",
				maxPoints: 1,
				criteria: [crit("(Point 1)", "Description", ["Uses multiple time points; avoids contradicting the plotted trend."])],
			},
			{
				letter: "B",
				promptText: "Mechanism",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Mechanism named", ["Invokes energy, concentration gradients, feedback, kinetics, forces, ecology, etc.—appropriate to course."]),
					crit("(Point 2)", "Linkage", ["Connects mechanism to the observed rise/fall/inflection without magic steps."]),
				],
			},
		]),
	};

	const stim: ExamFigure = {
		kind: "stimulus",
		title: "Stimuli for Question 3",
		body: `**Stimulus A — lab note**\n“We increased temperature and observed faster initial rate but lower final yield.”\n\n---\n\n**Stimulus B — field note**\n“Predator introduction reduced herbivore pressure; plant diversity increased after two seasons.”`,
	};

	const q2: ExamQuestion = {
		id: idFor(ctx.courseId, ctx.setIndex, 2, "sci2"),
		type: "free_response",
		subject: ctx.courseName,
		correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
		figure: stim,
		question: `**A)** Identify **one** variable interaction implied by Stimulus A. **(1 point)**\n\n**B)** Explain **one** way Stimulus B illustrates a community-level outcome. **(2 points)**\n\n**C)** State **one** hypothesis that links a mechanism in A to an ecosystem property in B (hypothesis may be tentative). **(2 points)**`,
		frq_rubric: rubricDoc("Question 3: Two stimuli", 5, [
			{
				letter: "A",
				promptText: "Interaction in A",
				maxPoints: 1,
				criteria: [crit("(Point 1)", "Interaction", ["Names how temperature affects rate and/or equilibrium/yield tradeoff plausibly."])],
			},
			{
				letter: "B",
				promptText: "Community outcome in B",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Outcome", ["Explains trophic cascade / release / succession-style reasoning at appropriate depth."]),
					crit("(Point 2)", "Evidence language", ["References time delay, diversity metric, or population change explicitly."]),
				],
			},
			{
				letter: "C",
				promptText: "Cross-stimulus hypothesis",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Hypothesis format", ["If…then… or predicts direction of change for a measurable quantity."]),
					crit("(Point 2)", "Plausibility", ["Connects a mechanism class from A to a community property in B without contradicting either stimulus."]),
				],
			},
		]),
	};

	return [q0, q1, q2];
}

function buildEnglishSet(
	rng: () => number,
	ctx: { courseId: string; courseName: string; unitTitle: string; setIndex: number },
): ExamQuestion[] {
	const passage = pick(rng, [
		"A city council member argues that ‘efficiency’ should outweigh neighborhood character when approving new housing.",
		"A blogger celebrates remote work as liberation while dismissing concerns about downtown small businesses.",
		"A scientist warns that ‘correlation is not causation’ but then implies policy should wait indefinitely for certainty.",
	]);

	const q0: ExamQuestion = {
		id: idFor(ctx.courseId, ctx.setIndex, 0, "en0"),
		type: "free_response",
		subject: ctx.courseName,
		correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
		question: `Read the following claim (hypothetical):\n\n> ${passage}\n\n**A)** Identify **one** rhetorical strategy or assumption in the passage. **(1 point)**\n\n**B)** Analyze **one** implication of that strategy for how audiences might respond. **(2 points)**`,
		frq_rubric: rubricDoc("Question 1: No stimulus", 3, [
			{
				letter: "A",
				promptText: "Strategy / assumption",
				maxPoints: 1,
				criteria: [crit("(Point 1)", "Identification", ["Names ethos/pathos/logos, juxtaposition, generalization, straw person, false dilemma, etc.—with accuracy."])],
			},
			{
				letter: "B",
				promptText: "Implication for audience",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Analysis", ["Explains how the strategy positions credibility, emotion, or reasoning."]),
					crit("(Point 2)", "Audience effect", ["Specifies likely belief shift, resistance, polarization, or trust change."]),
				],
			},
		]),
	};

	const fig: ExamFigure = {
		kind: "table",
		title: "Table 1. Word frequency in two drafts (counts)",
		headers: ["Word", "Draft 1", "Draft 2"],
		rows: [
			["we", String(randInt(rng, 2, 9)), String(randInt(rng, 10, 22))],
			["should", String(randInt(rng, 1, 6)), String(randInt(rng, 2, 9))],
			["evidence", String(randInt(rng, 0, 3)), String(randInt(rng, 4, 11))],
		],
	};

	const q1: ExamQuestion = {
		id: idFor(ctx.courseId, ctx.setIndex, 1, "en1"),
		type: "free_response",
		subject: ctx.courseName,
		correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
		figure: fig,
		question: `Use **Table 1** while revising an argument tied to **${ctx.unitTitle}**.\n\n**A)** Describe **one** revision pattern suggested by the counts. **(1 point)**\n\n**B)** Explain **one** rhetorical benefit *or* risk of that revision for a skeptical reader. **(2 points)**`,
		frq_rubric: rubricDoc("Question 2: One stimulus", 3, [
			{
				letter: "A",
				promptText: "Pattern",
				maxPoints: 1,
				criteria: [crit("(Point 1)", "Evidence", ["Compares drafts using at least one word row quantitatively."])],
			},
			{
				letter: "B",
				promptText: "Benefit or risk",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Claim", ["States a clear benefit (clarity, urgency, inclusivity) or risk (hectoring, vagueness, overclaim)."]),
					crit("(Point 2)", "Development", [`Connects to ${ctx.unitTitle} skills (line of reasoning, concession, evidence use).`]),
				],
			},
		]),
	};

	const stim: ExamFigure = {
		kind: "stimulus",
		title: "Stimuli for Question 3",
		body: `**Stimulus A — excerpt 1**\n“Policy must follow the data—even when communities disagree.”\n\n---\n\n**Stimulus B — excerpt 2**\n“Data never speak for themselves; every dataset embeds choices about what to measure.”`,
	};

	const q2: ExamQuestion = {
		id: idFor(ctx.courseId, ctx.setIndex, 2, "en2"),
		type: "free_response",
		subject: ctx.courseName,
		correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
		figure: stim,
		question: `**A)** Identify **one** tension between Stimulus A and Stimulus B. **(2 points)**\n\n**B)** Craft **one** sentence that negotiates the tension (a qualified claim). **(1 point)**\n\n**C)** Name **one** rhetorical move that makes your sentence persuasive without overclaiming. **(2 points)**`,
		frq_rubric: rubricDoc("Question 3: Two stimuli", 5, [
			{
				letter: "A",
				promptText: "Tension",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Comparison", ["Explains how “follow data” interacts with “embedded measurement choices.”"]),
					crit("(Point 2)", "Implication", ["Names a stake: authority, expertise, democracy, uncertainty, justice."]),
				],
			},
			{
				letter: "B",
				promptText: "Qualified sentence",
				maxPoints: 1,
				criteria: [crit("(Point 1)", "Syntax", ["Contains a hedge/caveat *and* a directional claim (not purely empty qualifier)."])],
			},
			{
				letter: "C",
				promptText: "Rhetorical move",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Move named", ["Concession, precision, definition of terms, refutation, framing, etc."]),
					crit("(Point 2)", "Fit", ["Explains how the move supports the qualified claim from part B."]),
				],
			},
		]),
	};

	return [q0, q1, q2];
}

function buildCsSet(
	rng: () => number,
	ctx: { courseId: string; courseName: string; unitTitle: string; setIndex: number },
): ExamQuestion[] {
	const q0: ExamQuestion = {
		id: idFor(ctx.courseId, ctx.setIndex, 0, "cs0"),
		type: "free_response",
		subject: ctx.courseName,
		correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
		question: `Design context: **${ctx.unitTitle}**.\n\n**A)** State **one** invariant or precondition your program should enforce. **(1 point)**\n\n**B)** Describe **one** failure mode if the invariant is violated and how you would detect it at runtime or test time. **(2 points)**`,
		frq_rubric: rubricDoc("Question 1: No stimulus", 3, [
			{
				letter: "A",
				promptText: "Invariant / precondition",
				maxPoints: 1,
				criteria: [crit("(Point 1)", "Clarity", ["Specifies an enforceable rule (range, type, state, input validity)."])],
			},
			{
				letter: "B",
				promptText: "Failure mode + detection",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Failure mode", ["Plausible bug class: crash, wrong output, security issue, deadlock, bias in sampling, etc."]),
					crit("(Point 2)", "Detection", ["Names assert, exception, unit test, log, property test, validation layer—specifically."]),
				],
			},
		]),
	};

	const fig: ExamFigure = {
		kind: "table",
		title: "Table 1. Algorithm steps vs cost (hypothetical)",
		headers: ["Input size n", "Steps"],
		rows: [
			["10", String(randInt(rng, 30, 80))],
			["20", String(randInt(rng, 120, 260))],
			["40", String(randInt(rng, 500, 1100))],
		],
	};

	const q1: ExamQuestion = {
		id: idFor(ctx.courseId, ctx.setIndex, 1, "cs1"),
		type: "free_response",
		subject: ctx.courseName,
		correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
		figure: fig,
		question: `Use **Table 1**.\n\n**A)** Identify the most likely complexity class among **O(n)**, **O(n log n)**, and **O(n^2)** (justify with ratios). **(2 points)**\n\n**B)** Name **one** practical implication for choosing data structures in **${ctx.unitTitle}**. **(1 point)**`,
		frq_rubric: rubricDoc("Question 2: One stimulus", 3, [
			{
				letter: "A",
				promptText: "Complexity justification",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Evidence", ["Computes a growth ratio between consecutive rows (doubling n)."]),
					crit("(Point 2)", "Conclusion", ["Selects a class consistent with the ratio trend (allow correct work even if table is noisy)."]),
				],
			},
			{
				letter: "B",
				promptText: "Practical implication",
				maxPoints: 1,
				criteria: [crit("(Point 1)", "Implication", ["Chooses structure/strategy aligned to the inferred scaling (hash map, heap, sorting, etc.)."])],
			},
		]),
	};

	const stim: ExamFigure = {
		kind: "stimulus",
		title: "Stimuli for Question 3",
		body: `**Stimulus A**\n“Ship fast: store user passwords in plaintext so support can help recover accounts.”\n\n---\n\n**Stimulus B**\n“Security is a tradeoff: usability suffers if we require long passwords and MFA for everyone.”`,
	};

	const q2: ExamQuestion = {
		id: idFor(ctx.courseId, ctx.setIndex, 2, "cs2"),
		type: "free_response",
		subject: ctx.courseName,
		correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
		figure: stim,
		question: `**A)** Identify **one** ethical and **one** technical problem with Stimulus A. **(2 points)**\n\n**B)** Explain **one** way Stimulus B is reasonable *and* **one** way it could excuse harmful choices. **(2 points)**\n\n**C)** Propose **one** policy that balances B’s concern without adopting A’s approach. **(1 point)**`,
		frq_rubric: rubricDoc("Question 3: Two stimuli", 5, [
			{
				letter: "A",
				promptText: "Ethical + technical problems",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Ethical", ["Privacy, trust, harm, consent, responsibility to users."]),
					crit("(Point 2)", "Technical", ["Hashing/salting, threat model, breach impact, recovery design—specifically tied to plaintext storage."]),
				],
			},
			{
				letter: "B",
				promptText: "Reasonable + risky reading of B",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Reasonable", ["Acknowledges real usability/support constraints."]),
					crit("(Point 2)", "Risk", ["Explains how “tradeoff” language can under-implement baseline protections."]),
				],
			},
			{
				letter: "C",
				promptText: "Balanced policy",
				maxPoints: 1,
				criteria: [crit("(Point 1)", "Policy", ["MFA tiers, hashed passwords, recovery codes, risk-based auth—any coherent compromise."])],
			},
		]),
	};

	return [q0, q1, q2];
}

function buildWorldLangSet(
	rng: () => number,
	ctx: { courseId: string; courseName: string; unitTitle: string; setIndex: number },
): ExamQuestion[] {
	const lang =
		ctx.courseId === "spanish"
			? "Spanish"
			: ctx.courseId === "french"
				? "French"
				: ctx.courseId === "german"
					? "German"
					: ctx.courseId === "latin"
						? "Latin"
						: ctx.courseId === "chinese"
							? "Chinese"
							: "Japanese";

	const q0: ExamQuestion = {
		id: idFor(ctx.courseId, ctx.setIndex, 0, "wl0"),
		type: "free_response",
		subject: ctx.courseName,
		correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
		question: `**${lang} free response.** Theme: **${ctx.unitTitle}**.\n\nRespond in **${lang}** with **3–4 sentences**.\n\n**Prompt:** Describe **one** community tradition you value and **one** change you have noticed in daily life. Explain how the two connect.\n\n_(Rubric text is in English for clarity.)_`,
		frq_rubric: rubricDoc("Question 1: No stimulus", 4, [
			{
				letter: "A",
				promptText: "Task completion",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Tradition described", ["Specific, culturally plausible detail; not a single vague word."]),
					crit("(Point 2)", "Change described", ["Clear contrast over time or across contexts."]),
				],
			},
			{
				letter: "B",
				promptText: "Language control",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Connectedness", ["Explains a logical link between tradition and change."]),
					crit("(Point 2)", "Accuracy/variety", ["Generally understandable target-language grammar with some complexity beyond lists."]),
				],
			},
		]),
	};

	const fig: ExamFigure = {
		kind: "table",
		title: "Table 1. Student poll: reasons to learn languages (hypothetical %)",
		headers: ["Reason", "Percent"],
		rows: [
			["Career", String(randInt(rng, 18, 38))],
			["Travel", String(randInt(rng, 22, 44))],
			["Family/community", String(randInt(rng, 12, 33))],
		],
	};

	const q1: ExamQuestion = {
		id: idFor(ctx.courseId, ctx.setIndex, 1, "wl1"),
		type: "free_response",
		subject: ctx.courseName,
		correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
		figure: fig,
		question: `Use **Table 1**. In **${lang}**, write **4–5 sentences**:\n\n**A)** summarize **one** pattern from the table, and **B)** compare it with **your** motivation related to **${ctx.unitTitle}**.`,
		frq_rubric: rubricDoc("Question 2: One stimulus", 3, [
			{
				letter: "A",
				promptText: "Summary of pattern",
				maxPoints: 1,
				criteria: [crit("(Point 1)", "Evidence", ["Uses numeric comparisons from the table accurately."])],
			},
			{
				letter: "B",
				promptText: "Comparison + unit link",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Personal link", ["Contrasts or aligns personal motivation with the table pattern."]),
					crit("(Point 2)", "Language", ["Mostly target language with coherent connectors and time markers."]),
				],
			},
		]),
	};

	const stim: ExamFigure = {
		kind: "stimulus",
		title: "Stimuli for Question 3",
		body: `**Stimulus A (English prompt for exam integrity)**\nTwo classmates disagree whether classroom-only practice is enough for proficiency.\n\n---\n\n**Stimulus B (English prompt for exam integrity)**\nA teacher argues that “interpersonal risk-taking” matters more than perfect grammar early on.`,
	};

	const q2: ExamQuestion = {
		id: idFor(ctx.courseId, ctx.setIndex, 2, "wl2"),
		type: "free_response",
		subject: ctx.courseName,
		correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
		figure: stim,
		question: `In **${lang}**, respond with **5–6 sentences**.\n\n**A)** State **one** agreement *or* disagreement with Stimulus A.\n\n**B)** Explain **one** way Stimulus B changes how you would study for **${ctx.unitTitle}**.\n\n**C)** Give **one** concrete study habit you will try this week.`,
		frq_rubric: rubricDoc("Question 3: Two stimuli", 5, [
			{
				letter: "A",
				promptText: "Position on A",
				maxPoints: 1,
				criteria: [crit("(Point 1)", "Clarity", ["Clear claim about practice beyond classroom vs not; references A."])],
			},
			{
				letter: "B",
				promptText: "Response to B + unit",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Interpretation", ["Explains risk-taking vs accuracy tradeoff in study strategy."]),
					crit("(Point 2)", "Unit linkage", [`Applies to ${ctx.unitTitle} specifically.`]),
				],
			},
			{
				letter: "C",
				promptText: "Concrete habit",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Specific habit", ["Named action with frequency, duration, or measurable output."]),
					crit("(Point 2)", "Language", ["Target language used for the habit section with understandable control."]),
				],
			},
		]),
	};

	return [q0, q1, q2];
}

function buildArtsSet(
	rng: () => number,
	ctx: { courseId: string; courseName: string; unitTitle: string; setIndex: number },
): ExamQuestion[] {
	const q0: ExamQuestion = {
		id: idFor(ctx.courseId, ctx.setIndex, 0, "ar0"),
		type: "free_response",
		subject: ctx.courseName,
		correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
		question: `Choose **one** work or repertoire item you have studied in **${ctx.unitTitle}** (hypothetical if needed).\n\n**A)** Identify **two** observable formal traits (visual, sonic, or structural). **(2 points)**\n\n**B)** Explain **one** likely intent or cultural function supported by those traits. **(2 points)**`,
		frq_rubric: rubricDoc("Question 1: No stimulus", 4, [
			{
				letter: "A",
				promptText: "Formal traits",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Trait 1", ["Specific, non-generic observation (motif, harmony, perspective, material, rhythm, etc.)."]),
					crit("(Point 2)", "Trait 2", ["Second trait clearly distinct from the first."]),
				],
			},
			{
				letter: "B",
				promptText: "Intent / function",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Claim", ["States a defensible purpose: devotion, power, identity, experimentation, education, etc."]),
					crit("(Point 2)", "Evidence", ["Links intent back to named traits without contradiction."]),
				],
			},
		]),
	};

	const fig: ExamFigure = {
		kind: "bar_chart",
		title: "Figure 1. Audience ratings (hypothetical)",
		yLabel: "Rating",
		bars: [
			{ label: "Clarity", value: randInt(rng, 6, 9) },
			{ label: "Originality", value: randInt(rng, 5, 9) },
			{ label: "Craft", value: randInt(rng, 6, 10) },
		],
	};

	const q1: ExamQuestion = {
		id: idFor(ctx.courseId, ctx.setIndex, 1, "ar1"),
		type: "free_response",
		subject: ctx.courseName,
		correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
		figure: fig,
		question: `Use **Figure 1** as peer feedback on a draft tied to **${ctx.unitTitle}**.\n\n**A)** Describe **one** pattern. **(1 point)**\n\n**B)** Recommend **one** revision priority and justify it using the chart. **(2 points)**`,
		frq_rubric: rubricDoc("Question 2: One stimulus", 3, [
			{
				letter: "A",
				promptText: "Pattern",
				maxPoints: 1,
				criteria: [crit("(Point 1)", "Evidence", ["Compares at least two categories numerically."])],
			},
			{
				letter: "B",
				promptText: "Revision priority",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Priority", ["Chooses lowest category or most mismatched pair with a rationale."]),
					crit("(Point 2)", "Justification", ["Explains how improving that dimension would change audience experience."]),
				],
			},
		]),
	};

	const stim: ExamFigure = {
		kind: "stimulus",
		title: "Stimuli for Question 3",
		body: `**Stimulus A — artist statement (hypothetical)**\n“I repeat forms to create calm, not boredom.”\n\n---\n\n**Stimulus B — critic note (hypothetical)**\n“Repetition here reads as insistence—almost political.”`,
	};

	const q2: ExamQuestion = {
		id: idFor(ctx.courseId, ctx.setIndex, 2, "ar2"),
		type: "free_response",
		subject: ctx.courseName,
		correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
		figure: stim,
		question: `**A)** Identify **one** interpretive difference between Stimulus A and Stimulus B. **(2 points)**\n\n**B)** Propose **one** additional contextual detail (historical, institutional, or material) that would help adjudicate the disagreement. **(2 points)**\n\n**C)** State **one** criterion you would use to decide which reading is stronger. **(1 point)**`,
		frq_rubric: rubricDoc("Question 3: Two stimuli", 5, [
			{
				letter: "A",
				promptText: "Interpretive difference",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Comparison", ["Explains calm/repetition vs political insistence (or analogous contrast)."]),
					crit("(Point 2)", "Evidence tie", ["Quotes or paraphrases both stimuli precisely enough to avoid straw reading."]),
				],
			},
			{
				letter: "B",
				promptText: "Context detail",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Context", ["Adds plausible venue, period, medium, patronage, or performance condition."]),
					crit("(Point 2)", "Adjudication value", ["Explains why the detail matters for meaning—not decorative."]),
				],
			},
			{
				letter: "C",
				promptText: "Criterion",
				maxPoints: 1,
				criteria: [crit("(Point 1)", "Criterion", ["Coherence, audience, intention, material constraints, intertext—any defensible standard."])],
			},
		]),
	};

	return [q0, q1, q2];
}

function buildCapstoneSet(
	rng: () => number,
	ctx: { courseId: string; courseName: string; unitTitle: string; setIndex: number },
): ExamQuestion[] {
	const q0: ExamQuestion = {
		id: idFor(ctx.courseId, ctx.setIndex, 0, "cap0"),
		type: "free_response",
		subject: ctx.courseName,
		correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
		question: `Within **${ctx.unitTitle}**, propose **one** researchable question.\n\n**A)** State the question in **one** sentence. **(1 point)**\n\n**B)** Explain **one** reason the question is significant to a defined stakeholder group. **(2 points)**`,
		frq_rubric: rubricDoc("Question 1: No stimulus", 3, [
			{
				letter: "A",
				promptText: "Research question",
				maxPoints: 1,
				criteria: [crit("(Point 1)", "Quality", ["Focused, debatable, and answerable with school-level methods (not too broad)."])],
			},
			{
				letter: "B",
				promptText: "Significance",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Stakeholder", ["Names a specific group (students, patients, residents, workers, etc.)."]),
					crit("(Point 2)", "Significance", ["Explains decision, wellbeing, justice, knowledge, or policy relevance."]),
				],
			},
		]),
	};

	const fig: ExamFigure = {
		kind: "table",
		title: "Table 1. Source triage (hypothetical)",
		headers: ["Source", "Credibility notes"],
		rows: [
			["Peer-reviewed article", "Methods section present"],
			["News editorial", "No primary data; strong claims"],
			["Government dataset", "Large n; limited variables"],
		],
	};

	const q1: ExamQuestion = {
		id: idFor(ctx.courseId, ctx.setIndex, 1, "cap1"),
		type: "free_response",
		subject: ctx.courseName,
		correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
		figure: fig,
		question: `Use **Table 1**.\n\n**A)** Identify **one** source you would prioritize for evidence and **one** you would use only with caution. **(2 points)**\n\n**B)** Justify both choices using criteria from **${ctx.unitTitle}**. **(2 points)**`,
		frq_rubric: rubricDoc("Question 2: One stimulus", 4, [
			{
				letter: "A",
				promptText: "Prioritization",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Priority source", ["Chooses peer review or government data with a reason tied to methods/coverage."]),
					crit("(Point 2)", "Caution source", ["Names editorial (or similar) and states a limitation (bias, no data)."]),
				],
			},
			{
				letter: "B",
				promptText: "Justification",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Criteria", ["Explicitly cites credibility, relevance, perspective, or accuracy—course-appropriate."]),
					crit("(Point 2)", "Linkage", ["Each justification matches the chosen source row without contradiction."]),
				],
			},
		]),
	};

	const stim: ExamFigure = {
		kind: "stimulus",
		title: "Stimuli for Question 3",
		body: `**Stimulus A**\n“A narrow question saves time.”\n\n---\n\n**Stimulus B**\n“If the question is too narrow, you’ll miss the system causing the problem.”`,
	};

	const q2: ExamQuestion = {
		id: idFor(ctx.courseId, ctx.setIndex, 2, "cap2"),
		type: "free_response",
		subject: ctx.courseName,
		correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
		figure: stim,
		question: `**A)** Describe **one** tension between A and B for researchers. **(2 points)**\n\n**B)** Propose **one** scoping move (boundary choice) that keeps the project feasible **without** ignoring Stimulus B’s warning. **(2 points)**\n\n**C)** Name **one** method limitation you will disclose in your report. **(1 point)**`,
		frq_rubric: rubricDoc("Question 3: Two stimuli", 5, [
			{
				letter: "A",
				promptText: "Tension",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Comparison", ["Explains feasibility vs system-level explanation conflict."]),
					crit("(Point 2)", "Research consequence", ["Notes tradeoff in claims you can responsibly make."]),
				],
			},
			{
				letter: "B",
				promptText: "Scoping move",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Feasibility", ["Names a boundary (case, time window, mechanism, population)."]),
					crit("(Point 2)", "System awareness", ["Explains how boundary still acknowledges broader structure (confound, context, alternative cause)."]),
				],
			},
			{
				letter: "C",
				promptText: "Limitation",
				maxPoints: 1,
				criteria: [crit("(Point 1)", "Limitation", ["Sampling, access, self-report, generalizability, measurement validity, etc.—specific."])],
			},
		]),
	};

	return [q0, q1, q2];
}

function buildGenericSet(
	rng: () => number,
	ctx: { courseId: string; courseName: string; unitTitle: string; setIndex: number },
): ExamQuestion[] {
	// Mirrors the three-item AP practice structure: no stimulus, one stimulus, two stimuli.
	return buildSocialSet(rng, ctx);
}

function generateApFrqPracticeTriple(params: {
	courseId: string;
	setIndex: number;
	unitId: string;
	difficulty?: ProceduralDifficulty;
}): ExamQuestion[] {
	const course = AP_COURSES.find((c) => c.id === params.courseId);
	if (!course) throw new Error(`Unknown course: ${params.courseId}`);

	const units = getUnitsForCourseId(params.courseId);
	if (units.length === 0) throw new Error(`No units for course: ${params.courseId}`);

	const si = clampSetIndex(params.setIndex);
	const diff = params.difficulty ?? "medium";
	const unit =
		params.unitId === "all"
			? units[Math.floor(createRng(`frq|${params.courseId}|${si}|diff:${diff}`, "unit")() * units.length)]
			: getUnitOrFirst(params.courseId, params.unitId);
	if (!unit) throw new Error(`Bad unit for course: ${params.courseId}`);

	const seed = `frq|${params.courseId}|u:${unit.id}|set:${si}|diff:${diff}`;
	const track = frqTrackForCourse(params.courseId);

	const ctx = {
		courseId: params.courseId,
		courseName: course.name,
		unitTitle: unit.title,
		setIndex: si,
	};

	const r0 = createRng(seed, "q0");
	const r1 = createRng(seed, "q1");

	const mk = (): ExamQuestion[] => {
		switch (track) {
			case "human_geo":
				return buildHumanGeoSet(r0, ctx);
			case "history":
				return buildHistorySet(r0, ctx);
			case "math":
				return buildMathSet(r0, ctx);
			case "science":
				return buildScienceSet(r0, ctx);
			case "social":
				return buildSocialSet(r0, ctx);
			case "english":
				return buildEnglishSet(r0, ctx);
			case "cs":
				return buildCsSet(r0, ctx);
			case "world_lang":
				return buildWorldLangSet(r0, ctx);
			case "arts":
				return buildArtsSet(r0, ctx);
			case "capstone":
				return buildCapstoneSet(r0, ctx);
			default:
				return buildGenericSet(r0, ctx);
		}
	};

	let qs = mk();
	const jitter = createRng(seed, `jitter|${si}`);
	if (jitter() > 0.5) {
		if (track === "math" || track === "science") {
			qs = track === "math" ? buildMathSet(r1, ctx) : buildScienceSet(r1, ctx);
		}
	}
	return qs;
}

export function generateApFrqPracticeSet(params: {
	courseId: string;
	setIndex: number;
	unitId: string;
	difficulty?: ProceduralDifficulty;
}): ExamQuestion[] {
	const spec = getApFrqReplicaSpec(params.courseId);
	const n = Math.max(1, Math.min(24, spec.frqCount));
	const out: ExamQuestion[] = [];
	let round = 0;
	while (out.length < n && round < 20) {
		const chunk = generateApFrqPracticeTriple({
			...params,
			setIndex: clampSetIndex(params.setIndex + round),
		});
		for (const q of chunk) {
			if (out.length >= n) break;
			out.push({
				...q,
				id: idFor(params.courseId, params.setIndex, out.length, hashString(q.question.slice(0, 48)).toString(36)),
			});
		}
		round++;
	}
	return out;
}
