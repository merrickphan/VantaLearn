import { AP_COURSES } from "@/lib/apCatalog";
import { getApFrqReplicaSpec } from "@/lib/apFrqExamReplicaFormat";
import { getUnitOrFirst, getUnitsForCourseId } from "@/lib/apUnits";
import { stripMarkdownBoldMarkers } from "@/lib/typography/plainExamText";
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

function plainFrqPartsBlock(rubric: FrqRubricDoc): string {
	return rubric.parts
		.map((p) => `(${p.letter}) ${p.promptText} (${p.maxPoints} point${p.maxPoints === 1 ? "" : "s"}).`)
		.join("\n\n");
}

function withPlainStimulusBody(fig: ExamFigure | undefined): ExamFigure | undefined {
	if (!fig || fig.kind !== "stimulus") return fig;
	return { ...fig, body: stripMarkdownBoldMarkers(fig.body) };
}

type FrqQInput = Omit<ExamQuestion, "question" | "frq_stem"> & { frq_rubric: FrqRubricDoc };

function frqQ(base: FrqQInput, stem: string): ExamQuestion {
	const stemPlain = stripMarkdownBoldMarkers(stem.trim());
	const figure = withPlainStimulusBody(base.figure);
	return {
		...base,
		figure,
		frq_stem: stemPlain,
		question: `${stemPlain}\n\n${plainFrqPartsBlock(base.frq_rubric)}`,
	};
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

/** Single-point AP Human Geography–style rubric part (7 parts per FRQ is typical). */
function hgOnePointPart(letter: string, promptText: string, descriptor: string, examples: string[]): FrqRubricPart {
	return {
		letter,
		promptText,
		maxPoints: 1,
		criteria: [crit("(1 pt)", descriptor, examples)],
	};
}

function buildHumanGeoSet(
	rng: () => number,
	ctx: { courseId: string; courseName: string; unitTitle: string; setIndex: number },
): ExamQuestion[] {
	const place = pick(rng, PLACES);
	const c0 = pick(rng, HG_CONCEPTS);
	let c1 = pick(rng, HG_CONCEPTS);
	let guard = 0;
	while (c1.term === c0.term && guard++ < 12) {
		c1 = pick(rng, HG_CONCEPTS);
	}

	const hgFig0: ExamFigure = {
		kind: "bar_chart",
		title: "FIGURE 1. Sector share of GDP in a hypothetical national economy (%)",
		yLabel: "Percent of GDP",
		bars: [
			{ label: "Primary", value: randInt(rng, 3, 24) },
			{ label: "Secondary", value: randInt(rng, 16, 45) },
			{ label: "Tertiary", value: randInt(rng, 35, 76) },
		],
	};

	const q0Stem = `Political geography connects states, identities, and networks across scales. Focus your answers on ${place} and on ${ctx.unitTitle}, drawing on ideas such as devolution, centripetal and centrifugal forces, uneven development, and communication technologies where they help your argument. Figure 1 summarizes a simplified economic structure for a hypothetical country; reference it where it strengthens a part of your answer.`;

	const q0Parts: FrqRubricPart[] = [
		hgOnePointPart(
			"A",
			`Define the concept of ${c0.term}.`,
			"Accurate definition",
			[
				`States that ${c0.term} involves ${c0.define}.`,
				"Uses geographic vocabulary correctly (may paraphrase).",
			],
		),
		hgOnePointPart(
			"B",
			`Explain how ${c0.term} can help explain a pattern you would expect to observe in ${place}.`,
			"Mechanism + place",
			[
				"Links the definition to a concrete geographic outcome (migration, borders, development, diffusion, etc.).",
				`Grounds the explanation in ${place} with at least one plausible detail.`,
			],
		),
		hgOnePointPart(
			"C",
			`Explain how communication technology can matter for ${c1.term} in contexts related to ${ctx.unitTitle}.`,
			"Technology role",
			[
				"Names a plausible role (coordination, mobilization, surveillance, information diffusion, etc.).",
				"Connects the technology idea to geographic or political outcomes (not only a gadget list).",
			],
		),
		hgOnePointPart(
			"D",
			"Explain one limitation of communication technology in achieving political or geographic goals you discussed in part (C).",
			"Limitation stated",
			[
				"States a clear constraint (access gaps, misinformation, state capacity, digital divide, censorship, etc.).",
				"Shows why the limitation weakens or complicates the goal.",
			],
		),
		hgOnePointPart(
			"E",
			"Describe ONE centripetal force that governments sometimes use to promote the state as a nation.",
			"Centripetal force",
			[
				"Names a defensible centripetal mechanism (symbols, education, infrastructure, shared institutions, etc.).",
				"Briefly explains how it can increase cohesion.",
			],
		),
		hgOnePointPart(
			"F",
			`Explain how uneven development within or across regions tied to ${place} can act as a centrifugal pressure on cohesion.`,
			"Uneven development",
			[
				"Explains a plausible inequality or spatial disparity mechanism.",
				"Links unevenness to tension, grievance, or contested legitimacy (not only a statistic).",
			],
		),
		hgOnePointPart(
			"G",
			"For a multinational state facing pressures similar to devolution, explain ONE reason a government might create an autonomous region OR choose to maintain a more unitary structure.",
			"Reasoning about autonomy vs unitary rule",
			[
				"Chooses one path (autonomous region or unitary maintenance) and defends it with governance logic.",
				"Uses at least one geographic or political tradeoff (identity, revenue, security, representation).",
			],
		),
	];

	const q0 = frqQ(
		{
			id: idFor(ctx.courseId, ctx.setIndex, 0, "hg0"),
			type: "free_response",
			subject: ctx.courseName,
			correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
			figure: hgFig0,
			procedural_structure_id: "hg-q1-seven-part-figure",
			frq_rubric: rubricDoc("Question 1 (Figure 1 — sector structure)", 7, q0Parts),
			explanation: `Self-check: work from definitions (${c0.term}, ${c1.term}) to mechanisms, then to tradeoffs and governance choices, using ${place} and ${ctx.unitTitle}.`,
		},
		q0Stem,
	);

	const fig1: ExamFigure = {
		kind: "table",
		title: "TABLE 1. Selected development indicators (hypothetical)",
		headers: ["Indicator", "Value"],
		rows: [
			["Urban population share (%)", String(randInt(rng, 42, 92))],
			["Youth dependency ratio", String((randInt(rng, 35, 75) / 100).toFixed(2))],
			["Female labor-force participation (%)", String(randInt(rng, 38, 72))],
		],
	};

	const q1Stem = `Table 1 reports selected development indicators for a setting comparable to ${place}. Use the table together with ${ctx.unitTitle} to support your reasoning in the parts that follow.`;

	const q1Parts: FrqRubricPart[] = [
		hgOnePointPart(
			"A",
			"Identify ONE pattern suggested by Table 1.",
			"Pattern from data",
			["Uses at least two rows or a clear row-to-row comparison.", "Pattern is consistent with the numeric values shown."],
		),
		hgOnePointPart(
			"B",
			"Describe ONE geographic relationship implied by the pattern you identified in part (A).",
			"Relationship",
			[
				"Names a plausible spatial or structural relationship (core–periphery, urban–rural, gendered labor markets, etc.).",
				"Does not contradict the table.",
			],
		),
		hgOnePointPart(
			"C",
			`Explain ONE demographic or economic process that could help account for the pattern in ${place}.`,
			"Process explanation",
			[
				"Names a geographic process (migration, fertility transition, industrial restructuring, policy change, etc.).",
				`Ties the process to ${place} with plausible reasoning.`,
			],
		),
		hgOnePointPart(
			"D",
			"Explain ONE limitation of using Table 1 alone to explain development outcomes in the region.",
			"Limitation",
			[
				"States a clear limitation (missing variables, scale, time, causal ambiguity, etc.).",
				"Explains why the limitation matters for interpretation.",
			],
		),
		hgOnePointPart(
			"E",
			"Propose ONE additional indicator (not in Table 1) that would strengthen an analysis of well-being or equity in this setting.",
			"Indicator proposal",
			["Names a measurable indicator relevant to equity or development.", "Explains what new information it would add."],
		),
		hgOnePointPart(
			"F",
			"Explain how changing the geographic scale of analysis (local vs national vs global) might change the interpretation of the pattern in part (A).",
			"Scale reasoning",
			["Contrasts at least two scales.", "Explains what becomes visible or hidden at each scale."],
		),
		hgOnePointPart(
			"G",
			"Predict ONE plausible policy consequence if leaders in the region respond to the pattern in Table 1 with a spatially targeted investment program.",
			"Policy consequence",
			["Prediction is geographically realistic.", "Connects to the table pattern without contradicting it."],
		),
	];

	const q1 = frqQ(
		{
			id: idFor(ctx.courseId, ctx.setIndex, 1, "hg1"),
			type: "free_response",
			subject: ctx.courseName,
			correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
			figure: fig1,
			procedural_structure_id: "hg-q2-seven-part-table",
			frq_rubric: rubricDoc("Question 2 (one stimulus — Table 1)", 7, q1Parts),
			explanation:
				"Self-check: anchor every evidence claim in Table 1, then extend with processes, limitations, and scale—typical of AP-style data FRQs.",
		},
		q1Stem,
	);

	const stim2: ExamFigure = {
		kind: "stimulus",
		title: "STIMULI FOR QUESTION 3",
		body: [
			"STIMULUS A — government announcement",
			"• A national government announces incentives for firms to relocate manufacturing to secondary cities.",
			"• Officials cite “balanced growth” and reduced congestion in the primate city.",
			"",
			"STIMULUS B — regional analysts",
			"• Analysts report rising intra-regional trade within a customs union.",
			"• Per-capita income dispersion across member states remains high.",
		].join("\n"),
	};

	const q2Stem = `Read Stimulus A and Stimulus B. Use geographic reasoning tied to ${place} and ${ctx.unitTitle}. Do not invent real treaties or organizations by name unless you are certain they exist.`;

	const q2Parts: FrqRubricPart[] = [
		hgOnePointPart(
			"A",
			"Identify ONE economic or spatial goal implied by Stimulus A.",
			"Goal from Stimulus A",
			["Goal is defensible from the announcement (deconcentration, jobs, competitiveness, congestion relief, etc.).", "Uses logic consistent with Stimulus A."],
		),
		hgOnePointPart(
			"B",
			"Describe ONE tension that emerges when Stimulus B is read alongside Stimulus A.",
			"Tension",
			["Names a clear tension (growth vs dispersion, integration vs inequality, etc.).", "Explains why both stimuli cannot be fully “success stories” at once without qualification."],
		),
		hgOnePointPart(
			"C",
			"Explain ONE geographic mechanism (for example, cores and peripheries, factor mobility, or institutions) that helps explain the tension in part (B).",
			"Mechanism",
			["Mechanism is course-appropriate and geographic (not purely moral opinion).", "Links mechanism back to language or claims in the stimuli."],
		),
		hgOnePointPart(
			"D",
			"Identify ONE group or region type that is likely to experience uneven benefits if policies like Stimulus A spread widely without addressing Stimulus B’s concern.",
			"Uneven benefits",
			["Identifies a plausible stakeholder or region type (borderlands, secondary cities, rural hinterlands, smaller member states, etc.).", "Explains why benefits or costs may be uneven."],
		),
		hgOnePointPart(
			"E",
			"Propose ONE geographically realistic policy tradeoff a supranational body might face when responding to the situation described in Stimulus B.",
			"Supranational tradeoff",
			["Names both a gain and a sacrifice or risk (sovereignty, cohesion, equity, enforcement capacity).", "Policy tool is plausible (standards, funds, monitoring, dispute resolution, etc.)."],
		),
		hgOnePointPart(
			"F",
			`Explain ONE way ${ctx.unitTitle} concepts could help a decision maker prioritize between the goal in part (A) and the tension in part (B).`,
			"Course linkage",
			["Uses at least one idea from the unit framing (scale, networks, political geography, development, etc.).", "Shows how the concept changes what should be measured or protected first."],
		),
		hgOnePointPart(
			"G",
			`For ${place}, state ONE likely long-run geographic outcome if the policies in Stimulus A succeed in reducing primate-city congestion but Stimulus B’s dispersion persists.`,
			"Long-run outcome",
			["Outcome is geographically plausible (sprawl, polycentric growth, cross-border commuting, fiscal stress, etc.).", "Does not ignore Stimulus B’s inequality signal."],
		),
	];

	const q2 = frqQ(
		{
			id: idFor(ctx.courseId, ctx.setIndex, 2, "hg2"),
			type: "free_response",
			subject: ctx.courseName,
			correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
			figure: stim2,
			procedural_structure_id: "hg-q3-seven-part-stimuli",
			frq_rubric: rubricDoc("Question 3 (two stimuli)", 7, q2Parts),
			explanation:
				"Self-check: anchor claims in both stimuli, then build mechanism → tradeoff → prioritization → scenario—mirrors multi-part AP synthesis FRQs.",
		},
		q2Stem,
	);

	return [q0, q1, q2];
}

function buildSocialSet(
	rng: () => number,
	ctx: { courseId: string; courseName: string; unitTitle: string; setIndex: number },
): ExamQuestion[] {
	const concept = pick(rng, SOCIAL_CONCEPTS);
	const place = pick(rng, PLACES);
	const socFig0: ExamFigure = {
		kind: "line_chart",
		title: "FIGURE 1. Hypothetical index of institutional trust (selected waves; first wave = 100)",
		yLabel: "Index",
		points: [
			{ x: "W1", y: 100 },
			{ x: "W2", y: randInt(rng, 94, 108) },
			{ x: "W3", y: randInt(rng, 88, 112) },
			{ x: "W4", y: randInt(rng, 90, 118) },
		],
	};
	const soc0Stem = `Use concepts from ${ctx.unitTitle} in ${ctx.courseName}. Where it strengthens your answer, ground claims in a setting like ${place}. Figure 1 shows a hypothetical trust trend; you may reference it when discussing attitudes, legitimacy, or policy feedback.`;

	const q0 = frqQ(
		{
			id: idFor(ctx.courseId, ctx.setIndex, 0, "soc0"),
			type: "free_response",
			subject: ctx.courseName,
			correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
			figure: socFig0,
			frq_rubric: rubricDoc("Question 1: Figure 1", 3, [
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
		},
		soc0Stem,
	);

	const fig: ExamFigure = {
		kind: "bar_chart",
		title: "Figure 2. Survey support for three policy options (%)",
		yLabel: "Percent supporting",
		bars: [
			{ label: "Option P", value: randInt(rng, 18, 42) },
			{ label: "Option Q", value: randInt(rng, 28, 55) },
			{ label: "Option R", value: randInt(rng, 12, 36) },
		],
	};

	const soc1Stem = `Figure 2 summarizes survey support for three policy options in a setting analogous to ${place}. Answer using the figure and ${ctx.unitTitle}.`;

	const q1 = frqQ(
		{
			id: idFor(ctx.courseId, ctx.setIndex, 1, "soc1"),
			type: "free_response",
			subject: ctx.courseName,
			correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
			figure: fig,
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
		},
		soc1Stem,
	);

	const stim: ExamFigure = {
		kind: "stimulus",
		title: "Stimuli for Question 3",
		body: [
			"STIMULUS A — legislator",
			"• Argues that decentralizing implementation will improve responsiveness.",
			"• Warns that decentralization risks uneven enforcement across jurisdictions.",
			"",
			"STIMULUS B — agency report",
			"• Claims standardized metrics improved transparency.",
			"• Notes standardized metrics reduced local flexibility in implementation.",
		].join("\n"),
	};

	const soc2Stem = `Use Stimulus A, Stimulus B, and ${ctx.unitTitle}. Tie claims to ${place} where a part asks for application.`;

	const q2 = frqQ(
		{
			id: idFor(ctx.courseId, ctx.setIndex, 2, "soc2"),
			type: "free_response",
			subject: ctx.courseName,
			correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
			figure: stim,
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
		},
		soc2Stem,
	);

	return [q0, q1, q2];
}

function buildHistorySet(
	rng: () => number,
	ctx: { courseId: string; courseName: string; unitTitle: string; setIndex: number },
): ExamQuestion[] {
	const topic = pick(rng, HISTORY_TOPICS);
	const era = ctx.unitTitle;
	const hisFig0: ExamFigure = {
		kind: "bar_chart",
		title: "FIGURE 1. Hypothetical share of labor force by sector in one region (%)",
		yLabel: "Percent of labor force",
		bars: [
			{ label: "Agr.", value: randInt(rng, 18, 52) },
			{ label: "Ind.", value: randInt(rng, 22, 48) },
			{ label: "Serv.", value: randInt(rng, 20, 45) },
		],
	};
	const his0Stem = `Within ${era} (${ctx.courseName}). Figure 1 is a stylized snapshot (not tied to a specific country); use it only where it helps you discuss structure, change, or causation.`;

	const q0 = frqQ(
		{
			id: idFor(ctx.courseId, ctx.setIndex, 0, "his0"),
			type: "free_response",
			subject: ctx.courseName,
			correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
			figure: hisFig0,
			frq_rubric: rubricDoc("Question 1: Figure 1", 4, [
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
		},
		his0Stem,
	);

	const fig: ExamFigure = {
		kind: "line_chart",
		title: "Figure 2. Index of urban wage earners (hypothetical, 1880–1920)",
		yLabel: "Index (1880 = 100)",
		points: [
			{ x: "1880", y: 100 },
			{ x: "1895", y: randInt(rng, 112, 148) },
			{ x: "1910", y: randInt(rng, 155, 210) },
			{ x: "1920", y: randInt(rng, 170, 240) },
		],
	};

	const q1 = frqQ(
		{
			id: idFor(ctx.courseId, ctx.setIndex, 1, "his1"),
			type: "free_response",
			subject: ctx.courseName,
			correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
			figure: fig,
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
		},
		`Use Figure 2 and your understanding of ${era}.`,
	);

	const stim: ExamFigure = {
		kind: "stimulus",
		title: "Stimuli for Question 3",
		body: `**Stimulus A — perspective 1**\n“We modernized transport and finance; critics forget the human costs in the countryside.”\n\n---\n\n**Stimulus B — perspective 2**\n“Growth depended on extracting labor and resources from colonized peripheries—prosperity was not evenly shared.”`,
	};

	const q2 = frqQ(
		{
			id: idFor(ctx.courseId, ctx.setIndex, 2, "his2"),
			type: "free_response",
			subject: ctx.courseName,
			correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
			figure: stim,
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
		},
		`Refer to the two perspectives in the stimuli above.`,
	);

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
	const sampleXs = [-2, -1, 0, 1, 2] as const;
	const mathFig0: ExamFigure = {
		kind: "line_chart",
		title: "FIGURE 1. Selected values of \\(y = f(x)\\) (rounded)",
		yLabel: "Dependent variable: \\(y = f(x)\\) (rounded to nearest integer on the plot)",
		xLabel:
			"Independent variable: \\(x\\). Each value along the bottom is an input; the number above the point is the corresponding output \\(y\\).",
		points: sampleXs.map((x) => ({
			x: String(x),
			y: Math.round(a * x * x + b * x + c),
		})),
	};
	const q0Stem = `Let \\(f(x) = ${fx}\\) for all real numbers \\(x\\). This question aligns with ${ctx.unitTitle}. Figure 1 shows rounded evaluations of \\(f\\) at integer inputs; treat \\(f\\) as differentiable everywhere between those points.`;

	const q0 = frqQ(
		{
			id: idFor(ctx.courseId, ctx.setIndex, 0, "m0"),
			type: "free_response",
			subject: ctx.courseName,
			correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
			figure: mathFig0,
			procedural_structure_id: "math-q1-lowercase-parts-figure",
			frq_rubric: rubricDoc("Question 1 (Figure 1 — function snapshot)", 4, [
				{
					letter: "a",
					promptText: "Find \\(f'(x)\\).",
					maxPoints: 1,
					criteria: [
						crit("(Point 1)", "Derivative", [
							"Applies power rule (and constant rule) correctly to obtain a linear derivative.",
							"Simplifies to standard polynomial form.",
						]),
					],
				},
				{
					letter: "b",
					promptText:
						"Determine whether \\(f\\) has a local maximum, local minimum, or neither at the critical point in the interior of the domain suggested by your algebra—justify using an appropriate derivative test or sign analysis.",
					maxPoints: 3,
					criteria: [
						crit("(Point 1)", "Critical point", ["Finds where f'(x)=0 (or explains if none) with correct algebra."]),
						crit("(Point 2)", "Test choice", ["Uses first-derivative sign change or second derivative test consistently."]),
						crit("(Point 3)", "Conclusion", ["States max/min/neither with reasoning matching the test outcome."]),
					],
				},
			]),
			explanation: `Differentiate with the power rule, then locate critical points where f'(x)=0 and justify max/min with an appropriate test.`,
		},
		q0Stem,
	);

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

	const q1Stem = `A differentiable function \\(g\\) is modeled by Table 1 near \\(x=${x0}\\). This item aligns with ${ctx.unitTitle}.`;

	const q1 = frqQ(
		{
			id: idFor(ctx.courseId, ctx.setIndex, 1, "m1"),
			type: "free_response",
			subject: ctx.courseName,
			correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
			figure: table,
			procedural_structure_id: "math-q2-table-lowercase",
			frq_rubric: rubricDoc("Question 2 (tabular stimulus)", 3, [
				{
					letter: "a",
					promptText: `Estimate \\(g'(${x0})\\) using the table (show the difference quotient you use).`,
					maxPoints: 2,
					criteria: [
						crit("(Point 1)", "Setup", ["Uses a plausible symmetric or one-sided difference quotient with correct substitution."]),
						crit("(Point 2)", "Computation", ["Arithmetic matches the chosen points from the table."]),
					],
				},
				{
					letter: "b",
					promptText:
						"In one sentence, interpret the sign of your estimate in a real-world quantity if \\(g(x)\\) represents thousands of units sold at price \\(x\\).",
					maxPoints: 1,
					criteria: [
						crit("(Point 1)", "Interpretation", [
							"Positive derivative: sales increase as price increases near x0 (local upward trend).",
							"Negative derivative: sales decrease as price increases near x0.",
						]),
					],
				},
			]),
		},
		q1Stem,
	);

	const stim: ExamFigure = {
		kind: "stimulus",
		title: "STIMULI FOR QUESTION 3",
		body: [
			"STIMULUS A — student claim",
			"• “Because the definite integral counts area, it must always be positive.”",
			"",
			"STIMULUS B — response",
			"• “The integrand can be negative on part of the interval, so the integral can be negative or zero.”",
		].join("\n"),
	};

	const q2Stem = `Use Stimulus A and Stimulus B. In part (b), use language appropriate to ${ctx.unitTitle}.`;

	const q2 = frqQ(
		{
			id: idFor(ctx.courseId, ctx.setIndex, 2, "m2"),
			type: "free_response",
			subject: ctx.courseName,
			correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
			figure: stim,
			procedural_structure_id: "math-q3-stimuli-lowercase",
			frq_rubric: rubricDoc("Question 3 (two student statements)", 5, [
				{
					letter: "a",
					promptText: "Identify one mathematical error or oversimplification in Stimulus A.",
					maxPoints: 1,
					criteria: [
						crit("(Point 1)", "Accuracy", [
							"Notes signed area / cancellation / below-axis contributions / orientation vs area.",
						]),
					],
				},
				{
					letter: "b",
					promptText: `Explain one correct idea in Stimulus B using the language of ${ctx.unitTitle}.`,
					maxPoints: 2,
					criteria: [
						crit("(Point 1)", "Concept", ["Discusses net change, accumulation, FTC intuition, or signed contribution."]),
						crit("(Point 2)", "Unit linkage", [`Ties the idea explicitly to ${ctx.unitTitle} (not generic math only).`]),
					],
				},
				{
					letter: "c",
					promptText:
						"Give one concrete integral example on a closed interval that supports Stimulus B (you may define a simple piecewise linear function).",
					maxPoints: 2,
					criteria: [
						crit("(Point 1)", "Example validity", ["Provides an interval and function behavior that yields ≤ 0 integral."]),
						crit("(Point 2)", "Explanation", ["Sketches reasoning (symmetry, negative region dominates, etc.)."]),
					],
				},
			]),
		},
		q2Stem,
	);

	return [q0, q1, q2];
}

function buildScienceSet(
	rng: () => number,
	ctx: { courseId: string; courseName: string; unitTitle: string; setIndex: number },
): ExamQuestion[] {
	const phenom = pick(rng, SCI_PHENOM);
	const sciFig0Title =
		ctx.courseId === "chem"
			? "FIGURE 1. Hypothetical product concentration vs. elapsed time during a batch run"
			: ctx.courseId === "bio"
				? "FIGURE 1. Hypothetical population count across sampling intervals"
				: ctx.courseId === "env"
					? "FIGURE 1. Hypothetical index of stream health vs. distance downstream of a disturbance"
					: ctx.courseId.startsWith("physics")
						? "FIGURE 1. Hypothetical sensor reading vs. time in a short lab interval"
						: "FIGURE 1. Hypothetical measured quantity across sequential trial runs";
	const sciFig0Y =
		ctx.courseId === "chem"
			? "Concentration (arb. units)"
			: ctx.courseId === "bio"
				? "Population (arb. units)"
				: ctx.courseId === "env"
					? "Health index (arb. units)"
					: ctx.courseId.startsWith("physics")
						? "Reading (arb. units)"
						: "Quantity (arb. units)";
	const sciFig0: ExamFigure = {
		kind: "line_chart",
		title: sciFig0Title,
		yLabel: sciFig0Y,
		points: [
			{ x: "t0", y: randInt(rng, 8, 28) },
			{ x: "t1", y: randInt(rng, 22, 48) },
			{ x: "t2", y: randInt(rng, 38, 62) },
			{ x: "t3", y: randInt(rng, 30, 55) },
		],
	};
	const q0 = frqQ(
		{
			id: idFor(ctx.courseId, ctx.setIndex, 0, "sci0"),
			type: "free_response",
			subject: ctx.courseName,
			correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
			figure: sciFig0,
			frq_rubric: rubricDoc("Question 1: Figure 1", 4, [
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
		},
		`You are investigating ${phenom} within ${ctx.unitTitle} (${ctx.courseName}). Figure 1 shows hypothetical pilot-style measurements you might use to motivate your design choices.`,
	);

	const fig: ExamFigure = {
		kind: "line_chart",
		title: "Figure 2. Measured quantity over time (arbitrary units)",
		yLabel: "Quantity",
		points: [
			{ x: "t0", y: randInt(rng, 10, 30) },
			{ x: "t1", y: randInt(rng, 35, 60) },
			{ x: "t2", y: randInt(rng, 55, 85) },
			{ x: "t3", y: randInt(rng, 40, 70) },
		],
	};

	const q1 = frqQ(
		{
			id: idFor(ctx.courseId, ctx.setIndex, 1, "sci1"),
			type: "free_response",
			subject: ctx.courseName,
			correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
			figure: fig,
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
		},
		`Use Figure 2.`,
	);

	const stim: ExamFigure = {
		kind: "stimulus",
		title: "Stimuli for Question 3",
		body: `**Stimulus A — lab note**\n“We increased temperature and observed faster initial rate but lower final yield.”\n\n---\n\n**Stimulus B — field note**\n“Predator introduction reduced herbivore pressure; plant diversity increased after two seasons.”`,
	};

	const q2 = frqQ(
		{
			id: idFor(ctx.courseId, ctx.setIndex, 2, "sci2"),
			type: "free_response",
			subject: ctx.courseName,
			correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
			figure: stim,
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
		},
		`Refer to Stimulus A and Stimulus B.`,
	);

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

	const enFig0: ExamFigure = {
		kind: "bar_chart",
		title: "FIGURE 1. Hypothetical reader survey: dominant impression after first read (%)",
		yLabel: "Percent of readers",
		bars: [
			{ label: "Persuaded", value: randInt(rng, 12, 32) },
			{ label: "Unsure", value: randInt(rng, 38, 58) },
			{ label: "Skeptical", value: randInt(rng, 18, 38) },
		],
	};

	const q0 = frqQ(
		{
			id: idFor(ctx.courseId, ctx.setIndex, 0, "en0"),
			type: "free_response",
			subject: ctx.courseName,
			correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
			figure: enFig0,
			frq_rubric: rubricDoc("Question 1: Figure 1", 3, [
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
		},
		`Read the following claim (hypothetical):\n\n> ${passage}\n\nFigure 1 summarizes a hypothetical first-impression poll of readers like those in ${ctx.unitTitle}; cite it only if it sharpens your analysis.`,
	);

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

	const q1 = frqQ(
		{
			id: idFor(ctx.courseId, ctx.setIndex, 1, "en1"),
			type: "free_response",
			subject: ctx.courseName,
			correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
			figure: fig,
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
		},
		`Use Table 1 while revising an argument tied to ${ctx.unitTitle}.`,
	);

	const stim: ExamFigure = {
		kind: "stimulus",
		title: "Stimuli for Question 3",
		body: `**Stimulus A — excerpt 1**\n“Policy must follow the data—even when communities disagree.”\n\n---\n\n**Stimulus B — excerpt 2**\n“Data never speak for themselves; every dataset embeds choices about what to measure.”`,
	};

	const q2 = frqQ(
		{
			id: idFor(ctx.courseId, ctx.setIndex, 2, "en2"),
			type: "free_response",
			subject: ctx.courseName,
			correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
			figure: stim,
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
		},
		`Refer to Stimulus A and Stimulus B.`,
	);

	return [q0, q1, q2];
}

function buildCsSet(
	rng: () => number,
	ctx: { courseId: string; courseName: string; unitTitle: string; setIndex: number },
): ExamQuestion[] {
	const csFig0: ExamFigure = {
		kind: "line_chart",
		title: "FIGURE 1. Hypothetical automated test pass rate by nightly build (%)",
		yLabel: "Tests passed (%)",
		points: [
			{ x: "B1", y: randInt(rng, 78, 92) },
			{ x: "B2", y: randInt(rng, 72, 90) },
			{ x: "B3", y: randInt(rng, 81, 96) },
			{ x: "B4", y: randInt(rng, 76, 94) },
		],
	};
	const q0 = frqQ(
		{
			id: idFor(ctx.courseId, ctx.setIndex, 0, "cs0"),
			type: "free_response",
			subject: ctx.courseName,
			correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
			figure: csFig0,
			frq_rubric: rubricDoc("Question 1: Figure 1", 3, [
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
		},
		`Design context: ${ctx.unitTitle}. Figure 1 is hypothetical CI-style telemetry; use it if it helps you reason about invariants, failure modes, or detection.`,
	);

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

	const q1 = frqQ(
		{
			id: idFor(ctx.courseId, ctx.setIndex, 1, "cs1"),
			type: "free_response",
			subject: ctx.courseName,
			correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
			figure: fig,
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
		},
		`Use Table 1.`,
	);

	const stim: ExamFigure = {
		kind: "stimulus",
		title: "Stimuli for Question 3",
		body: `**Stimulus A**\n“Ship fast: store user passwords in plaintext so support can help recover accounts.”\n\n---\n\n**Stimulus B**\n“Security is a tradeoff: usability suffers if we require long passwords and MFA for everyone.”`,
	};

	const q2 = frqQ(
		{
			id: idFor(ctx.courseId, ctx.setIndex, 2, "cs2"),
			type: "free_response",
			subject: ctx.courseName,
			correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
			figure: stim,
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
		},
		`Refer to Stimulus A and Stimulus B.`,
	);

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

	const wlFig0: ExamFigure = {
		kind: "bar_chart",
		title: "FIGURE 1. Hypothetical weekly hours learners reported by skill focus",
		yLabel: "Hours per week",
		bars: [
			{ label: "Listen", value: randInt(rng, 2, 8) },
			{ label: "Speak", value: randInt(rng, 1, 6) },
			{ label: "Read", value: randInt(rng, 2, 9) },
			{ label: "Write", value: randInt(rng, 1, 5) },
		],
	};

	const q0 = frqQ(
		{
			id: idFor(ctx.courseId, ctx.setIndex, 0, "wl0"),
			type: "free_response",
			subject: ctx.courseName,
			correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
			figure: wlFig0,
			frq_rubric: rubricDoc("Question 1: Figure 1", 4, [
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
		},
		`${lang} free response. Theme: ${ctx.unitTitle}.\n\nFigure 1 shows hypothetical weekly study-time allocation; you may refer to it in ${lang} if it supports your response.\n\nRespond in ${lang} with 3–4 sentences.\n\nPrompt: Describe one community tradition you value and one change you have noticed in daily life. Explain how the two connect.\n\n(Rubric text is in English for clarity.)`,
	);

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

	const q1 = frqQ(
		{
			id: idFor(ctx.courseId, ctx.setIndex, 1, "wl1"),
			type: "free_response",
			subject: ctx.courseName,
			correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
			figure: fig,
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
		},
		`Use Table 1. In ${lang}, write 4–5 sentences total across the parts that follow.`,
	);

	const stim: ExamFigure = {
		kind: "stimulus",
		title: "Stimuli for Question 3",
		body: `**Stimulus A (English prompt for exam integrity)**\nTwo classmates disagree whether classroom-only practice is enough for proficiency.\n\n---\n\n**Stimulus B (English prompt for exam integrity)**\nA teacher argues that “interpersonal risk-taking” matters more than perfect grammar early on.`,
	};

	const q2 = frqQ(
		{
			id: idFor(ctx.courseId, ctx.setIndex, 2, "wl2"),
			type: "free_response",
			subject: ctx.courseName,
			correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
			figure: stim,
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
		},
		`In ${lang}, respond with 5–6 sentences total across the parts that follow.`,
	);

	return [q0, q1, q2];
}

function buildArtsSet(
	rng: () => number,
	ctx: { courseId: string; courseName: string; unitTitle: string; setIndex: number },
): ExamQuestion[] {
	const arFig0: ExamFigure = {
		kind: "line_chart",
		title: "FIGURE 1. Hypothetical audience engagement index during a single viewing/listening (arbitrary units)",
		yLabel: "Engagement",
		points: [
			{ x: "0%", y: randInt(rng, 20, 40) },
			{ x: "25%", y: randInt(rng, 35, 55) },
			{ x: "50%", y: randInt(rng, 45, 70) },
			{ x: "75%", y: randInt(rng, 40, 68) },
			{ x: "100%", y: randInt(rng, 30, 55) },
		],
	};
	const q0 = frqQ(
		{
			id: idFor(ctx.courseId, ctx.setIndex, 0, "ar0"),
			type: "free_response",
			subject: ctx.courseName,
			correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
			figure: arFig0,
			frq_rubric: rubricDoc("Question 1: Figure 1", 4, [
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
		},
		`Choose one work or repertoire item you have studied in ${ctx.unitTitle} (hypothetical if needed). Figure 1 models a hypothetical engagement arc; reference it if it helps connect form to audience experience.`,
	);

	const fig: ExamFigure = {
		kind: "bar_chart",
		title: "Figure 2. Audience ratings (hypothetical)",
		yLabel: "Rating",
		bars: [
			{ label: "Clarity", value: randInt(rng, 6, 9) },
			{ label: "Originality", value: randInt(rng, 5, 9) },
			{ label: "Craft", value: randInt(rng, 6, 10) },
		],
	};

	const q1 = frqQ(
		{
			id: idFor(ctx.courseId, ctx.setIndex, 1, "ar1"),
			type: "free_response",
			subject: ctx.courseName,
			correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
			figure: fig,
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
		},
		`Use Figure 2 as peer feedback on a draft tied to ${ctx.unitTitle}.`,
	);

	const stim: ExamFigure = {
		kind: "stimulus",
		title: "Stimuli for Question 3",
		body: `**Stimulus A — artist statement (hypothetical)**\n“I repeat forms to create calm, not boredom.”\n\n---\n\n**Stimulus B — critic note (hypothetical)**\n“Repetition here reads as insistence—almost political.”`,
	};

	const q2 = frqQ(
		{
			id: idFor(ctx.courseId, ctx.setIndex, 2, "ar2"),
			type: "free_response",
			subject: ctx.courseName,
			correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
			figure: stim,
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
		},
		`Refer to Stimulus A and Stimulus B.`,
	);

	return [q0, q1, q2];
}

function buildCapstoneSet(
	rng: () => number,
	ctx: { courseId: string; courseName: string; unitTitle: string; setIndex: number },
): ExamQuestion[] {
	const capFig0: ExamFigure = {
		kind: "bar_chart",
		title: "FIGURE 1. Hypothetical mean importance ratings for capstone criteria (1–10 scale)",
		yLabel: "Mean rating",
		bars: [
			{ label: "Rigor", value: randInt(rng, 6, 10) },
			{ label: "Feasibility", value: randInt(rng, 5, 9) },
			{ label: "Impact", value: randInt(rng, 6, 10) },
			{ label: "Ethics", value: randInt(rng, 7, 10) },
		],
	};
	const q0 = frqQ(
		{
			id: idFor(ctx.courseId, ctx.setIndex, 0, "cap0"),
			type: "free_response",
			subject: ctx.courseName,
			correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
			figure: capFig0,
			frq_rubric: rubricDoc("Question 1: Figure 1", 3, [
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
		},
		`Within ${ctx.unitTitle}, propose one researchable question. Figure 1 shows hypothetical priorities from a peer rubric exercise—use it if it helps you justify significance or scope.`,
	);

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

	const q1 = frqQ(
		{
			id: idFor(ctx.courseId, ctx.setIndex, 1, "cap1"),
			type: "free_response",
			subject: ctx.courseName,
			correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
			figure: fig,
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
		},
		`Use Table 1.`,
	);

	const stim: ExamFigure = {
		kind: "stimulus",
		title: "Stimuli for Question 3",
		body: `**Stimulus A**\n“A narrow question saves time.”\n\n---\n\n**Stimulus B**\n“If the question is too narrow, you’ll miss the system causing the problem.”`,
	};

	const q2 = frqQ(
		{
			id: idFor(ctx.courseId, ctx.setIndex, 2, "cap2"),
			type: "free_response",
			subject: ctx.courseName,
			correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
			figure: stim,
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
		},
		`Refer to Stimulus A and Stimulus B.`,
	);

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
