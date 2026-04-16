import { AP_COURSES } from "@/lib/apCatalog";
import { getApFrqReplicaSpec } from "@/lib/apFrqExamReplicaFormat";
import { getUnitOrFirst, getUnitsForCourseId } from "@/lib/apUnits";
import { stripMarkdownBoldMarkers } from "@/lib/typography/plainExamText";
import type { ExamFigure, ExamQuestion, FrqRubricCriterion, FrqRubricDoc, FrqRubricPart } from "@/types";
import type { ProceduralDifficulty } from "@/lib/questions/procedural";
import {
	frqFigureArtsQ0,
	frqFigureCapstoneQ0,
	frqFigureCsQ0,
	frqFigureEnglishQ0,
	frqFigureHistoryQ0,
	frqFigureHumanGeoQ0,
	frqFigureMathQ0,
	frqFigureScienceQ0,
	frqFigureScienceQ1,
	frqFigureSocialQ0,
	frqFigureWorldLangQ0,
} from "./apFrqFigures";
import { createRng, hashString, pick, questionAvoidFingerprintKeys, randInt, randomSeedEntropy } from "./utils";

/** Number of FRQ practice set slots per course (RNG varies wording within a slot each request). */
export const AP_FRQ_PRACTICE_SET_COUNT = 100;

/** Internal sentinel so auto-grading never marks FRQ items “correct” by accident. */
export const AP_FRQ_PLACEHOLDER_ANSWER = "__VANTALEARN_FRQ_SELF_SCORE__";

/** Unit metadata passed into every procedural FRQ builder (content-focused prompts). */
export type FrqUnitCtx = {
	courseId: string;
	courseName: string;
	unitTitle: string;
	/** Short CB-style unit description from the catalog. */
	unitSummary: string;
	/** Optional prompt angles from the unit definition. */
	unitHooks: readonly string[];
	/** 1-based unit index within the course. */
	unitIndex: number;
	setIndex: number;
};

function frqUnitAnchorSentence(ctx: FrqUnitCtx): string {
	const s = ctx.unitSummary.trim();
	const hooks = ctx.unitHooks.filter((h) => h.trim().length > 0);
	const parts: string[] = [];
	if (s) parts.push(s);
	if (hooks.length) parts.push(`Useful angles include ${hooks.slice(0, 4).join("; ")}.`);
	return parts.join(" ");
}

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

/** Political geography (Unit 4) — also default pool if unit index is unexpected. */
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
] as const;

const HG_FRQ_U1_TERMS = [
	{ term: "absolute location", define: "a precise coordinate-based description of where a place is on Earth" },
	{ term: "relative location", define: "where a place is described in relation to other places, flows, or networks" },
	{ term: "site", define: "the physical characteristics of a place itself (terrain, resources, built environment)" },
	{ term: "situation", define: "how a place is situated relative to external connections such as trade routes or markets" },
	{ term: "formal region", define: "an area defined by one or more measurable, shared traits" },
	{ term: "functional region", define: "an area organized around a node and interaction (flows, networks)" },
	{ term: "perceptual region", define: "a region defined by popular feelings, images, or stereotypes rather than strict data" },
	{ term: "distance decay", define: "the decline of interaction or influence as distance increases" },
	{ term: "time-space compression", define: "the sense that places are effectively closer because connectivity reduces friction of distance" },
	{ term: "choropleth map", define: "a thematic map that uses color shading within reporting zones to show rates or densities" },
] as const;

const HG_FRQ_U2_TERMS = [
	{ term: "demographic transition", define: "a model describing long-run shifts in birth and death rates and their effects on growth" },
	{ term: "push factor", define: "a condition at an origin that encourages people to leave" },
	{ term: "pull factor", define: "a condition at a destination that attracts migrants" },
	{ term: "step migration", define: "migration that occurs in stages rather than as a single long-distance move" },
	{ term: "refugee", define: "a person forced to flee across an international border due to persecution, conflict, or disaster" },
	{ term: "internally displaced person", define: "someone forced to flee home but who remains inside their country" },
	{ term: "dependency ratio", define: "a measure comparing dependents to the working-age population in a place" },
	{ term: "rate of natural increase", define: "birth rate minus death rate, ignoring migration effects" },
	{ term: "brain drain", define: "the emigration of skilled workers from a country or region" },
	{ term: "guest-worker policy", define: "rules that allow temporary labor migration while limiting long-term settlement" },
] as const;

const HG_FRQ_U3_TERMS = [
	{ term: "cultural diffusion", define: "the spread of cultural traits or practices across space over time" },
	{ term: "syncretism", define: "the blending of cultural traits from different sources into a new practice or belief" },
	{ term: "language family", define: "a group of related languages that share a distant common ancestor" },
	{ term: "lingua franca", define: "a language used for communication among groups with different mother tongues" },
	{ term: "ethnic enclave", define: "a neighborhood where a minority group concentrates social institutions and daily life" },
	{ term: "folk culture", define: "traditions practiced by relatively small, often rural, homogeneous groups" },
	{ term: "popular culture", define: "cultural practices produced for mass consumption and rapid diffusion" },
	{ term: "cultural landscape", define: "the visible imprint of culture on the land, including buildings, signs, and land use" },
	{ term: "sense of place", define: "the meanings and feelings people attach to a location beyond its physical traits" },
	{ term: "toponym", define: "a place name that can reveal history, power, identity, or language contact" },
] as const;

const HG_FRQ_U5_TERMS = [
	{ term: "Von Thünen model", define: "a model explaining rural land use as rings of activity around a central market based on transport cost" },
	{ term: "subsistence agriculture", define: "farming mainly to feed the farmer’s household with little surplus for sale" },
	{ term: "commercial agriculture", define: "farming oriented to selling output in markets, often at larger scale" },
	{ term: "Green Revolution", define: "a package of high-yield seeds, irrigation, and inputs that raised productivity in many regions" },
	{ term: "food desert", define: "an area where residents lack affordable access to nutritious food retailers" },
	{ term: "agribusiness", define: "large-scale farming integrated with processing, distribution, and marketing firms" },
	{ term: "sustainable agriculture", define: "practices that reduce environmental harm and maintain soil and water for future yields" },
	{ term: "plantation agriculture", define: "large estates focused on one or two cash crops for export markets" },
	{ term: "pastoral nomadism", define: "herding animals while moving seasonally to find pasture and water" },
	{ term: "aquaculture", define: "the farming of fish or shellfish under controlled conditions" },
] as const;

const HG_FRQ_U6_TERMS = [
	{ term: "bid-rent theory", define: "the idea that land values reflect willingness to pay for access to central markets or jobs" },
	{ term: "primate city", define: "a dominant city that is disproportionately large relative to the next-ranked cities in a country" },
	{ term: "gentrification", define: "the reinvestment and upgrading of a neighborhood that often displaces lower-income residents" },
	{ term: "edge city", define: "a large suburban job and retail center that functions like a downtown without traditional urban form" },
	{ term: "filtering", define: "the movement of housing downmarket as buildings age and different income groups occupy them" },
	{ term: "infill development", define: "building on vacant or underused parcels inside an existing urban footprint" },
	{ term: "sprawl", define: "low-density outward expansion of urban land use with heavy automobile dependence" },
	{ term: "CBD", define: "the central business district where retail, offices, and services concentrate" },
	{ term: "transit-oriented development", define: "compact, walkable growth focused near transit corridors to reduce automobile dependence" },
	{ term: "redlining (historic)", define: "systematic denial of credit or services in certain neighborhoods, shaping long-run inequality" },
] as const;

const HG_FRQ_U7_TERMS = [
	{ term: "Human Development Index (HDI)", define: "a composite measure combining health, education, and standard of living indicators" },
	{ term: "core region", define: "a highly interconnected, wealthy region in world-systems accounts of global structure" },
	{ term: "periphery", define: "regions characterized as suppliers of raw materials and lower-wage labor in global systems" },
	{ term: "comparative advantage", define: "the idea that places gain by specializing in what they produce relatively efficiently" },
	{ term: "commodity chain", define: "the linked stages from raw inputs to retail that deliver a product to consumers" },
	{ term: "foreign direct investment", define: "ownership or control of productive assets in another country by outside firms" },
	{ term: "microfinance", define: "small loans and financial services aimed at people excluded from traditional banking" },
	{ term: "structural adjustment", define: "policy reforms tied to loans that often reduce subsidies and open markets" },
	{ term: "sustainable development", define: "development that meets present needs without compromising future generations’ resources" },
	{ term: "gender inequality index", define: "an index summarizing gender gaps in reproductive health, empowerment, and labor" },
] as const;

function hgFrqTermPool(unitIndex: number): readonly { term: string; define: string }[] {
	switch (unitIndex) {
		case 1:
			return HG_FRQ_U1_TERMS;
		case 2:
			return HG_FRQ_U2_TERMS;
		case 3:
			return HG_FRQ_U3_TERMS;
		case 4:
			return HG_CONCEPTS;
		case 5:
			return HG_FRQ_U5_TERMS;
		case 6:
			return HG_FRQ_U6_TERMS;
		case 7:
			return HG_FRQ_U7_TERMS;
		default:
			return HG_CONCEPTS;
	}
}

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

/** Single-point multi-part rubric line (Human Geography FRQs). */
function hgOnePointPart(letter: string, promptText: string, descriptor: string, examples: string[]): FrqRubricPart {
	return {
		letter,
		promptText,
		maxPoints: 1,
		criteria: [crit("(1 pt)", descriptor, examples)],
	};
}

function hgFrqTableFigure(rng: () => number, unitIndex: number): ExamFigure {
	switch (unitIndex) {
		case 2:
			return {
				kind: "table",
				title: "TABLE 1. Demographic snapshot (hypothetical)",
				headers: ["Indicator", "Value"],
				rows: [
					["Total fertility rate (births per woman)", String((randInt(rng, 12, 34) / 10).toFixed(1))],
					["Net migration rate (per 1,000)", String(randInt(rng, -8, 14))],
					["Share of population under age 15 (%)", String(randInt(rng, 18, 42))],
				],
			};
		case 5:
			return {
				kind: "table",
				title: "TABLE 1. Farm-economy indicators (hypothetical)",
				headers: ["Indicator", "Value"],
				rows: [
					["Share of labor force in agriculture (%)", String(randInt(rng, 8, 48))],
					["Irrigated cropland share (%)", String(randInt(rng, 12, 62))],
					["Value of food imports as share of merchandise imports (%)", String(randInt(rng, 9, 35))],
				],
			};
		case 6:
			return {
				kind: "table",
				title: "TABLE 1. Urban-region indicators (hypothetical)",
				headers: ["Indicator", "Value"],
				rows: [
					["Transit commute share (%)", String(randInt(rng, 12, 48))],
					["Median gross rent as share of median household income (%)", String(randInt(rng, 26, 48))],
					["Jobs per km² in inner ring (index, 2010 = 100)", String(randInt(rng, 92, 138))],
				],
			};
		case 7:
			return {
				kind: "table",
				title: "TABLE 1. Development and environment indicators (hypothetical)",
				headers: ["Indicator", "Value"],
				rows: [
					["GNI per capita growth (5-year average, %)", String(randInt(rng, -2, 7))],
					["Estimated income Gini coefficient", String((randInt(rng, 31, 52) / 100).toFixed(2))],
					["Electricity from renewable sources (%)", String(randInt(rng, 8, 56))],
				],
			};
		default:
			return {
				kind: "table",
				title: "TABLE 1. Selected regional indicators (hypothetical)",
				headers: ["Indicator", "Value"],
				rows: [
					["Urban population share (%)", String(randInt(rng, 42, 92))],
					["Youth dependency ratio", String((randInt(rng, 35, 75) / 100).toFixed(2))],
					["Female labor-force participation (%)", String(randInt(rng, 38, 72))],
				],
			};
	}
}

function hgFrqStimulusBody(unitIndex: number): string {
	switch (unitIndex) {
		case 1:
			return [
				"STIMULUS A — planning office memo",
				"• Planners argue equal-area projections should be standard for all public dashboards so regions are comparable.",
				"• They worry that students misread compact countries as “small economies” on common web basemaps.",
				"",
				"STIMULUS B — logistics firm brief",
				"• Shippers request conformal or distance-faithful basemaps for routing and ETA tools.",
				"• Analysts say distortion near poles matters less for their current corridor network.",
			].join("\n");
		case 2:
			return [
				"STIMULUS A — national statistical office",
				"• Reports slowing natural increase and rising elderly share.",
				"• Notes difficulty enumerating seasonal and circular migrants in border districts.",
				"",
				"STIMULUS B — municipal health department",
				"• Sees rising pediatric clinic demand in arrival neighborhoods.",
				"• Requests more school seats and maternal-health outreach funding.",
			].join("\n");
		case 3:
			return [
				"STIMULUS A — tourism board campaign",
				"• Promotes a heritage district as “authentic living culture” for visitors.",
				"• Funds street festivals and multilingual signage downtown.",
				"",
				"STIMULUS B — community council letter",
				"• Residents report noise, crowding, and rising rents near festival venues.",
				"• Elders say some ceremonies were never meant as daily spectacle for outsiders.",
			].join("\n");
		case 5:
			return [
				"STIMULUS A — agriculture ministry",
				"• Expands credit for fertilizer and hybrid seed to raise staple yields.",
				"• Targets river valleys with existing irrigation canals.",
				"",
				"STIMULUS B — watershed council",
				"• Monitors rising nitrate readings in shallow wells downstream of intensive plots.",
				"• Requests buffer strips and rotational fallow in the same valleys.",
			].join("\n");
		case 6:
			return [
				"STIMULUS A — metropolitan transport authority",
				"• Opens a new bus-rapid-transit spine aimed at cutting peak congestion.",
				"• Rezones station areas for higher residential density.",
				"",
				"STIMULUS B — suburban mayors’ joint statement",
				"• Warns that downtown tax abatements pull retail and offices away from older suburbs.",
				"• Asks for revenue-sharing on projects that use regional road networks.",
			].join("\n");
		case 7:
			return [
				"STIMULUS A — finance ministry",
				"• Negotiates a loan package tied to cutting fuel subsidies and privatizing two state firms.",
				"• Projects higher export competitiveness within five years.",
				"",
				"STIMULUS B — labor federation",
				"• Reports job losses in capital-intensive plants and bus fare protests after subsidy cuts.",
				"• Demands retraining funds and cash transfers for low-income households.",
			].join("\n");
		default:
			return [
				"STIMULUS A — government announcement",
				"• A national government announces incentives for firms to relocate manufacturing to secondary cities.",
				"• Officials cite “balanced growth” and reduced congestion in the primate city.",
				"",
				"STIMULUS B — regional analysts",
				"• Analysts report rising intra-regional trade within a customs union.",
				"• Per-capita income dispersion across member states remains high.",
			].join("\n");
	}
}

function hgFrqQ0StemAndParts(
	ctx: FrqUnitCtx,
	place: string,
	c0: { term: string; define: string },
	c1: { term: string; define: string },
	hgOnePointPartFn: typeof hgOnePointPart,
): { q0Stem: string; q0Parts: FrqRubricPart[] } {
	const anchor = frqUnitAnchorSentence(ctx);
	const figHint =
		"Figure 1 may be a map, chart, photograph exhibit, diagram, or other geographic display (see caption); cite it only where it strengthens your reasoning.";
	const u = ctx.unitIndex;

	if (u === 1) {
		return {
			q0Stem: `You interpret ${place} using **${ctx.unitTitle}**. ${anchor} ${figHint}`,
			q0Parts: [
				hgOnePointPartFn("A", `Define ${c0.term}.`, "Accurate definition", [
					`Explains that ${c0.term} involves ${c0.define}.`,
					"Uses geographic vocabulary correctly (may paraphrase).",
				]),
				hgOnePointPartFn(
					"B",
					`Explain how ${c0.term} helps you describe or compare what is happening in ${place}.`,
					"Mechanism + place",
					[
						"Links the concept to a concrete spatial pattern, comparison, or boundary problem.",
						`Grounds the explanation in ${place} with at least one plausible detail.`,
					],
				),
				hgOnePointPartFn(
					"C",
					`Explain how geospatial data, maps, or remote sensing can clarify ${c1.term} when studying ${place}.`,
					"Data and tools",
					[
						"Names a plausible use (layers, GPS traces, imagery time series, volunteered data, etc.).",
						"Connects the tool to geographic insight (not only a product list).",
					],
				),
				hgOnePointPartFn(
					"D",
					"Describe ONE limitation of relying only on digital map products or imagery for the goals you discussed in part (C).",
					"Limitation",
					[
						"Names a clear constraint (resolution, metadata gaps, projection bias, access, update lag, etc.).",
						"Explains why the limitation matters for interpretation or decisions.",
					],
				),
				hgOnePointPartFn(
					"E",
					`Explain ONE way changing the scale of analysis (local, national, or global) could change the conclusion you draw about ${place}.`,
					"Scale",
					["Contrasts what becomes visible or hidden across at least two scales.", "Uses geographic logic, not opinion only."],
				),
				hgOnePointPartFn(
					"F",
					`Describe ONE risk of comparing ${place} to another world region using only a single thematic map layer.`,
					"Comparison risk",
					["Names a defensible risk (ecological fallacy, masking internal diversity, outdated boundaries, etc.).", "Explains the geographic consequence briefly."],
				),
				hgOnePointPartFn(
					"G",
					"Propose ONE additional spatial or social data layer you would add to strengthen an argument about inequality or access in this setting.",
					"Data proposal",
					["Names a measurable layer (transit stops, hazard zones, income bins, land tenure, etc.).", "States what new question it helps answer."],
				),
			],
		};
	}

	if (u === 2) {
		return {
			q0Stem: `You study population change and mobility in ${place} through **${ctx.unitTitle}**. ${anchor} ${figHint}`,
			q0Parts: [
				hgOnePointPartFn("A", `Define ${c0.term}.`, "Accurate definition", [
					`Explains that ${c0.term} involves ${c0.define}.`,
					"Uses demographic or migration vocabulary correctly (may paraphrase).",
				]),
				hgOnePointPartFn(
					"B",
					`Explain how ${c0.term} helps explain a population or mobility pattern you would expect in ${place}.`,
					"Mechanism + place",
					["Links the concept to fertility, mortality, migration, or age structure outcomes.", `Uses at least one plausible detail about ${place}.`],
				),
				hgOnePointPartFn(
					"C",
					`Explain how ${c1.term} interacts with labor markets, housing, or public services in communities tied to ${place}.`,
					"Process link",
					["Shows how the second concept shapes concrete outcomes (schools, clinics, rents, informal work, etc.).", "Stays geographically grounded."],
				),
				hgOnePointPartFn(
					"D",
					"Explain ONE reason census or survey counts can undercount or misrepresent mobile populations you discussed in part (C).",
					"Data limitation",
					["Names a clear issue (seasonality, legal status fear, informal housing, language, etc.).", "Explains why it biases interpretation."],
				),
				hgOnePointPartFn(
					"E",
					"Describe ONE policy tool governments use to raise, lower, or steer fertility or immigration totals—and one tradeoff of that tool.",
					"Policy",
					["Names a plausible tool (family benefits, pension age, visa categories, border enforcement, etc.).", "States one tradeoff (equity, labor supply, fiscal cost, rights)."],
				),
				hgOnePointPartFn(
					"F",
					`Compare ONE way youth dependency can stress public budgets differently from elderly dependency in ${place}.`,
					"Dependency contrast",
					["Contrasts education/childcare pressures vs pension and health pressures.", "Uses plausible reasoning for the setting."],
				),
				hgOnePointPartFn(
					"G",
					`Predict ONE migration or urban consequence if ${place} experiences rapid wage growth while neighboring regions do not.`,
					"Scenario",
					["Prediction is geographically plausible (commuting, remittances, rent spikes, skill recruitment, etc.).", "Does not ignore neighbor ties."],
				),
			],
		};
	}

	if (u === 3) {
		return {
			q0Stem: `You analyze cultural patterns and landscapes in ${place} using **${ctx.unitTitle}**. ${anchor} ${figHint}`,
			q0Parts: [
				hgOnePointPartFn("A", `Define ${c0.term}.`, "Accurate definition", [
					`Explains that ${c0.term} involves ${c0.define}.`,
					"Uses cultural geography vocabulary correctly (may paraphrase).",
				]),
				hgOnePointPartFn(
					"B",
					`Explain how ${c0.term} helps explain a visible cultural pattern in ${place}.`,
					"Mechanism + place",
					["Links the concept to language, religion, identity, media, or built landscape outcomes.", `Grounds the explanation in ${place}.`],
				),
				hgOnePointPartFn(
					"C",
					`Explain how diffusion of a global practice or popular-culture product can reshape ${c1.term} in neighborhoods tied to ${place}.`,
					"Diffusion",
					["Shows a believable mechanism (media, migration, tourism, firms, education).", "Avoids stereotypes stated as facts about real groups."],
				),
				hgOnePointPartFn(
					"D",
					"Describe ONE way local residents might resist or adapt outside cultural influences you discussed in part (C).",
					"Agency",
					["Names a plausible response (hybrid practices, zoning, language maintenance, boycotts, co-management of tourism, etc.).", "Explains spatial or social outcome briefly."],
				),
				hgOnePointPartFn(
					"E",
					"Explain ONE way language or education policy can strengthen a shared national identity—and one group it may marginalize.",
					"Language policy",
					["Names a plausible policy (official language, bilingual schooling, script reform, etc.).", "Names one plausible marginalization risk."],
				),
				hgOnePointPartFn(
					"F",
					`Explain how marketing ${place} as a heritage destination can create tension between income goals and sacred or intimate practices.`,
					"Heritage tension",
					["Names both economic upside and cultural/spatial pressure.", "Uses geographic logic (crowding, rent, access, seasonality)."],
				),
				hgOnePointPartFn(
					"G",
					"Propose ONE planning guideline that could reduce harm while still supporting livelihoods tied to cultural tourism.",
					"Guideline",
					["Proposal is specific (caps, routes, resident passes, revenue sharing, off-season programming, etc.).", "Acknowledges a remaining tradeoff."],
				),
			],
		};
	}

	if (u === 5) {
		return {
			q0Stem: `You examine agriculture, food systems, and rural land use around ${place} using **${ctx.unitTitle}**. ${anchor} ${figHint}`,
			q0Parts: [
				hgOnePointPartFn("A", `Define ${c0.term}.`, "Accurate definition", [
					`Explains that ${c0.term} involves ${c0.define}.`,
					"Uses agricultural geography vocabulary correctly (may paraphrase).",
				]),
				hgOnePointPartFn(
					"B",
					`Explain how ${c0.term} helps explain land-use or livelihood patterns you would expect near ${place}.`,
					"Mechanism + place",
					["Links the concept to crops, labor, markets, inputs, or land tenure.", `Uses at least one plausible detail about ${place}.`],
				),
				hgOnePointPartFn(
					"C",
					`Explain how global commodity prices or trade rules can reshape farmer choices related to ${c1.term} in this region.`,
					"Global linkage",
					["Shows a believable chain (price shock, credit, contract farming, standards barriers, etc.).", "Does not contradict basic economic logic."],
				),
				hgOnePointPartFn(
					"D",
					"Describe ONE environmental cost that can accompany input-intensive yield gains in the systems you described.",
					"Environmental cost",
					["Names a plausible cost (water drawdown, salinization, nitrate leaching, biodiversity loss, soil compaction, etc.).", "Explains why it follows from the practices discussed."],
				),
				hgOnePointPartFn(
					"E",
					"Explain ONE way smallholders can lose access to land or markets when commercial agriculture expands nearby.",
					"Equity",
					["Names a mechanism (titles, rents, debt, contract terms, infrastructure taking, etc.).", "Grounds in geographic or institutional logic."],
				),
				hgOnePointPartFn(
					"F",
					`Compare growing export specialty crops with prioritizing staple self-sufficiency for food security in ${place}.`,
					"Tradeoff",
					["States at least one benefit and one risk for each path.", "Uses geographically realistic reasoning."],
				),
				hgOnePointPartFn(
					"G",
					"Propose ONE spatially targeted intervention (infrastructure, extension services, conservation set-aside, storage, etc.) that could reduce a harm you identified without ending commercial farming entirely.",
					"Intervention",
					["Intervention is concrete and geographically plausible.", "Acknowledges one limit or unintended effect."],
				),
			],
		};
	}

	if (u === 6) {
		return {
			q0Stem: `You study urban form, land use, and social patterns in ${place} using **${ctx.unitTitle}**. ${anchor} ${figHint}`,
			q0Parts: [
				hgOnePointPartFn("A", `Define ${c0.term}.`, "Accurate definition", [
					`Explains that ${c0.term} involves ${c0.define}.`,
					"Uses urban geography vocabulary correctly (may paraphrase).",
				]),
				hgOnePointPartFn(
					"B",
					`Explain how ${c0.term} helps explain rent gradients, commuting, or neighborhood change in ${place}.`,
					"Mechanism + place",
					["Links the concept to land markets, transport, segregation, or governance.", `Uses at least one plausible detail about ${place}.`],
				),
				hgOnePointPartFn(
					"C",
					`Explain how public investment in transit or arterial roads can shift ${c1.term} in the wider metropolitan area.`,
					"Infrastructure effect",
					["Shows a believable spatial mechanism (accessibility, agglomeration, land value, mode share).", "Does not ignore who gains or loses."],
				),
				hgOnePointPartFn(
					"D",
					"Describe ONE mechanism through which neighborhood upgrading can displace long-term lower-income residents.",
					"Displacement",
					["Names a plausible channel (rents, property tax, eviction, loss of retail/services, etc.).", "Explains why displacement is geographic, not only a price label."],
				),
				hgOnePointPartFn(
					"E",
					"Explain ONE fiscal or governance challenge when a primate city concentrates tax base and talent while smaller municipalities ring it.",
					"Governance",
					["Names a plausible challenge (infrastructure finance, service spillovers, coordination, inequality).", "Uses realistic public-finance or planning logic."],
				),
				hgOnePointPartFn(
					"F",
					`For ${place}, compare concentrating new jobs in the urban core with decentralizing jobs to secondary centers—name one spatial consequence of each approach.`,
					"Spatial consequence",
					["Contrasts consequences (commute lengths, emissions, land take, tax competition, etc.).", "Avoids claiming both are costless."],
				),
				hgOnePointPartFn(
					"G",
					"Propose ONE land-use or housing rule change that could spread benefits of growth more evenly—state who it helps and one risk.",
					"Policy",
					["Proposal is specific (inclusionary zoning, linkage fees, TOD density bonuses, etc.).", "Names one risk or implementation limit."],
				),
			],
		};
	}

	if (u === 7) {
		return {
			q0Stem: `You analyze development, trade, and inequality involving ${place} using **${ctx.unitTitle}**. ${anchor} ${figHint}`,
			q0Parts: [
				hgOnePointPartFn("A", `Define ${c0.term}.`, "Accurate definition", [
					`Explains that ${c0.term} involves ${c0.define}.`,
					"Uses development or economic geography vocabulary correctly (may paraphrase).",
				]),
				hgOnePointPartFn(
					"B",
					`Explain how ${c0.term} helps explain uneven opportunities or outcomes linked to ${place} in the world economy.`,
					"Mechanism + place",
					["Links the concept to trade, investment, labor, or institutions.", `Uses at least one plausible detail about ${place}.`],
				),
				hgOnePointPartFn(
					"C",
					`Explain how ${c1.term} can both raise average productivity and create dependency or vulnerability for workers in export-oriented sectors.`,
					"Dual effect",
					["Names a productivity channel (technology transfer, specialization, scale).", "Names a dependency channel (price shocks, buyer power, seasonal work, debt)."],
				),
				hgOnePointPartFn(
					"D",
					"Give ONE reason a single headline indicator (such as GDP per capita growth) can hide inequality within a country or city.",
					"Indicator limit",
					["Names a masking problem (spatial averaging, informal work, environmental harm, elite capture, etc.).", "Explains what is hidden briefly."],
				),
				hgOnePointPartFn(
					"E",
					"Describe ONE way structural adjustment or austerity-style reforms can improve a fiscal indicator while worsening lived conditions for some groups.",
					"Reform tradeoff",
					["Names a plausible reform channel (subsidy cuts, privatization, devaluation).", "Names a plausible harm channel (fares, food prices, layoffs, service cuts)."],
				),
				hgOnePointPartFn(
					"F",
					`Explain how gendered labor market patterns can make growth in settings like ${place} less inclusive even when aggregate output rises.`,
					"Inclusion",
					["Names a plausible mechanism (occupational segregation, unpaid care, wage gaps, informal work).", "Connects to geographic outcomes (commute, housing, services)."],
				),
				hgOnePointPartFn(
					"G",
					"Propose ONE geographically targeted investment or regulation that could reduce spatial inequality you discussed—state what you would measure to judge success.",
					"Targeting",
					["Proposal is concrete (rural broadband, clinic placement, transit, industrial clusters, protected wages in zones, etc.).", "Names at least one outcome metric."],
				),
			],
		};
	}

	// Unit 4 political geography (default for political unit and unknown indices)
	return {
		q0Stem: `You analyze how states, borders, and networks shape life in ${place} using **${ctx.unitTitle}**. ${anchor} ${figHint}`,
		q0Parts: [
			hgOnePointPartFn("A", `Define ${c0.term}.`, "Accurate definition", [
				`States that ${c0.term} involves ${c0.define}.`,
				"Uses geographic vocabulary correctly (may paraphrase).",
			]),
			hgOnePointPartFn(
				"B",
				`Explain how ${c0.term} can help explain a pattern you would expect to observe in ${place}.`,
				"Mechanism + place",
				[
					"Links the definition to a concrete geographic outcome (migration, borders, development, diffusion, etc.).",
					`Grounds the explanation in ${place} with at least one plausible detail.`,
				],
			),
			hgOnePointPartFn(
				"C",
				`Explain how communication technology can matter for ${c1.term} in contexts related to ${ctx.unitTitle}.`,
				"Technology role",
				[
					"Names a plausible role (coordination, mobilization, surveillance, information diffusion, etc.).",
					"Connects the technology idea to geographic or political outcomes (not only a gadget list).",
				],
			),
			hgOnePointPartFn(
				"D",
				"Explain one limitation of communication technology in achieving political or geographic goals you discussed in part (C).",
				"Limitation stated",
				[
					"States a clear constraint (access gaps, misinformation, state capacity, digital divide, censorship, etc.).",
					"Shows why the limitation weakens or complicates the goal.",
				],
			),
			hgOnePointPartFn(
				"E",
				"Describe ONE centripetal force that governments sometimes use to promote the state as a nation.",
				"Centripetal force",
				[
					"Names a defensible centripetal mechanism (symbols, education, infrastructure, shared institutions, etc.).",
					"Briefly explains how it can increase cohesion.",
				],
			),
			hgOnePointPartFn(
				"F",
				`Explain how uneven development within or across regions tied to ${place} can act as a centrifugal pressure on cohesion.`,
				"Uneven development",
				[
					"Explains a plausible inequality or spatial disparity mechanism.",
					"Links unevenness to tension, grievance, or contested legitimacy (not only a statistic).",
				],
			),
			hgOnePointPartFn(
				"G",
				"For a multinational state facing pressures similar to devolution, explain ONE reason a government might create an autonomous region OR choose to maintain a more unitary structure.",
				"Reasoning about autonomy vs unitary rule",
				[
					"Chooses one path (autonomous region or unitary maintenance) and defends it with governance logic.",
					"Uses at least one geographic or political tradeoff (identity, revenue, security, representation).",
				],
			),
		],
	};
}

function buildHumanGeoSet(rng: () => number, ctx: FrqUnitCtx): ExamQuestion[] {
	const place = pick(rng, PLACES);
	const pool = hgFrqTermPool(ctx.unitIndex);
	const c0 = pick(rng, pool);
	let c1 = pick(rng, pool);
	let guard = 0;
	while (c1.term === c0.term && guard++ < 16) {
		c1 = pick(rng, pool);
	}

	const hgFig0 = frqFigureHumanGeoQ0(rng, { place, unitTitle: ctx.unitTitle });
	const { q0Stem, q0Parts } = hgFrqQ0StemAndParts(ctx, place, c0, c1, hgOnePointPart);

	const q0 = frqQ(
		{
			id: idFor(ctx.courseId, ctx.setIndex, 0, "hg0"),
			type: "free_response",
			subject: ctx.courseName,
			correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
			figure: hgFig0,
			procedural_structure_id: "hg-q1-seven-part-figure",
			frq_rubric: rubricDoc("Task 1 — Figure 1 (geographic exhibit)", 7, q0Parts),
			explanation: `Self-check: tie definitions (${c0.term}, ${c1.term}) to mechanisms in ${place}, then to tradeoffs, using ideas from **${ctx.unitTitle}**.`,
		},
		q0Stem,
	);

	const fig1 = hgFrqTableFigure(rng, ctx.unitIndex);

	const q1Stem = `Table 1 lists hypothetical indicators for a setting comparable to ${place}. Use the numbers as evidence while reasoning with **${ctx.unitTitle}** (${frqUnitAnchorSentence(ctx)}).`;

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
				"Names a plausible spatial or structural relationship (urban–rural, core–periphery, environment, labor markets, etc.).",
				"Does not contradict the table.",
			],
		),
		hgOnePointPart(
			"C",
			`Explain ONE process (economic, demographic, environmental, political, or cultural) that could help account for the pattern in ${place}.`,
			"Process explanation",
			[
				"Names a geographically plausible process.",
				`Ties the process to ${place} with reasoning consistent with the table.`,
			],
		),
		hgOnePointPart(
			"D",
			"Explain ONE limitation of using Table 1 alone to interpret conditions in the region.",
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
			["Names a measurable indicator relevant to equity or livelihoods.", "Explains what new information it would add."],
		),
		hgOnePointPart(
			"F",
			"Explain how changing the geographic scale of analysis (local vs national vs global) might change the interpretation of the pattern in part (A).",
			"Scale reasoning",
			["Contrasts at least two scales.", "Explains what becomes visible or hidden at each scale."],
		),
		hgOnePointPart(
			"G",
			"Predict ONE plausible consequence if public agencies respond to the table’s pattern with a spatially targeted investment or regulation.",
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
			frq_rubric: rubricDoc("Task 2 — Table 1", 7, q1Parts),
			explanation: "Self-check: anchor each claim in Table 1, then extend with process, limits, scale, and a realistic policy consequence.",
		},
		q1Stem,
	);

	const stim2: ExamFigure = {
		kind: "stimulus",
		title: "STIMULI FOR TASK 3",
		body: hgFrqStimulusBody(ctx.unitIndex),
	};

	const q2Stem = `Read both stimuli. Use geographic reasoning tied to ${place} and **${ctx.unitTitle}**. Do not invent real treaties or organizations by name unless you are certain they exist.`;

	const q2Parts: FrqRubricPart[] = [
		hgOnePointPart(
			"A",
			"Identify ONE goal or priority implied by Stimulus A.",
			"Goal from Stimulus A",
			["Goal is defensible from the text (efficiency, growth, order, equity claim, etc.).", "Uses logic consistent with Stimulus A."],
		),
		hgOnePointPart(
			"B",
			"Describe ONE tension that emerges when Stimulus B is read alongside Stimulus A.",
			"Tension",
			["Names a clear tension between claims, metrics, or interests.", "Explains why both cannot be fully “success stories” at once without qualification."],
		),
		hgOnePointPart(
			"C",
			"Explain ONE geographic mechanism (for example, distance, networks, institutions, land markets, or environment) that helps explain the tension in part (B).",
			"Mechanism",
			["Mechanism is geographic (not purely moral opinion).", "Links mechanism back to language or claims in the stimuli."],
		),
		hgOnePointPart(
			"D",
			"Identify ONE group or place type that is likely to experience uneven benefits or costs if the priorities in Stimulus A spread without addressing Stimulus B’s concern.",
			"Uneven effects",
			["Identifies a plausible stakeholder or place type.", "Explains why effects may be uneven."],
		),
		hgOnePointPart(
			"E",
			"Propose ONE realistic policy or governance tradeoff decision-makers face when responding to Stimulus B’s concern.",
			"Tradeoff",
			["Names both a gain and a sacrifice or risk.", "Tool or approach is plausible (standards, funds, monitoring, co-management, phased rules, etc.)."],
		),
		hgOnePointPart(
			"F",
			`Explain ONE way ideas from **${ctx.unitTitle}** could help a planner weigh the priority in part (A) against the tension in part (B).`,
			"Concept application",
			[
				"Uses at least one idea consistent with the unit summary or hooks.",
				"Shows how the idea changes what should be measured, protected, or sequenced first.",
			],
		),
		hgOnePointPart(
			"G",
			`For ${place}, state ONE likely long-run geographic outcome if actors follow Stimulus A’s priorities while Stimulus B’s worry remains partly unresolved.`,
			"Long-run outcome",
			["Outcome is geographically plausible.", "Does not ignore the risk or cost signal in Stimulus B."],
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
			frq_rubric: rubricDoc("Task 3 — two stimuli", 7, q2Parts),
			explanation: "Self-check: ground each part in both stimuli, then chain mechanism → tradeoff → concept choice → long-run scenario.",
		},
		q2Stem,
	);

	return [q0, q1, q2];
}

function buildSocialSet(
	rng: () => number,
	ctx: FrqUnitCtx,
): ExamQuestion[] {
	const concept = pick(rng, SOCIAL_CONCEPTS);
	const place = pick(rng, PLACES);
	const socFig0 = frqFigureSocialQ0(rng, {
		courseId: ctx.courseId,
		courseName: ctx.courseName,
		place,
		unitTitle: ctx.unitTitle,
	});
	const soc0Stem = `Apply ideas from **${ctx.unitTitle}** (${frqUnitAnchorSentence(ctx)}). Where it helps, ground claims in a setting like ${place}. Figure 1 may show a market diagram, process model, photograph exhibit, time series, synapse schematic, or action-potential trace; use it when discussing attitudes, institutions, or policy feedback.`;

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

	const soc1Stem = `Figure 2 summarizes survey support for three policy options in a setting analogous to ${place}. Use the figure together with **${ctx.unitTitle}** (${frqUnitAnchorSentence(ctx)}).`;

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
				promptText: `Explain one reason grounded in **${ctx.unitTitle}**.`,
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

	const soc2Stem = `Use Stimulus A, Stimulus B, and **${ctx.unitTitle}** (${frqUnitAnchorSentence(ctx)}). Tie claims to ${place} wherever a part asks for application.`;

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
	ctx: FrqUnitCtx,
): ExamQuestion[] {
	const topic = pick(rng, HISTORY_TOPICS);
	const era = ctx.unitTitle;
	const hisFig0 = frqFigureHistoryQ0(rng, { era, courseName: ctx.courseName });
	const his0Stem = `You are writing about **${era}** in historical context: ${frqUnitAnchorSentence(ctx)} Figure 1 may be a demographic chart, stylized map, photograph exhibit, or sector graph; use it only where it helps you discuss structure, change, or causation.`;

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
		`Use Figure 2 together with **${era}** (${frqUnitAnchorSentence(ctx)}).`,
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
					crit("(Point 2)", "Precision", ["Avoids anachronisms for the period and places implied by your argument."]),
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
		`Refer to the two perspectives in the stimuli above, keeping arguments consistent with **${era}** (${frqUnitAnchorSentence(ctx)}).`,
	);

	return [q0, q1, q2];
}

function buildMathSet(
	rng: () => number,
	ctx: FrqUnitCtx,
): ExamQuestion[] {
	const mathUnitBridge =
		ctx.unitHooks.length > 0
			? `Tie any applied interpretation to **${ctx.unitTitle}** (for example: ${ctx.unitHooks.slice(0, 2).join("; ")}).`
			: `Tie any applied interpretation to **${ctx.unitTitle}** (${ctx.unitSummary.trim().slice(0, 200)}${ctx.unitSummary.trim().length > 200 ? "…" : ""}).`;
	const a = randInt(rng, 2, 9);
	const b = randInt(rng, -12, 12);
	const c = randInt(rng, 2, 11);
	const fx = b >= 0 ? `${a}x^2 + ${b}x + ${c}` : `${a}x^2 - ${-b}x + ${c}`;
	const sampleXs = [-2, -1, 0, 1, 2] as const;
	const mathFig0 = frqFigureMathQ0(rng, { courseId: ctx.courseId, fx, a, b, c, sampleXs });

	let q0Stem = `Let \\(f(x) = ${fx}\\) for all real numbers \\(x\\). ${mathUnitBridge} Figure 1 shows rounded evaluations of \\(f\\) at integer inputs; treat \\(f\\) as differentiable everywhere between those points.`;

	let q0Rubric = rubricDoc("Question 1 (Figure 1 — function snapshot)", 4, [
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
	]);

	if (mathFig0.kind === "polar_area_cartesian") {
		q0Stem = `Figure 1 shows two polar curves plotted in the \\(xy\\)-plane for \\(0 \\le \\theta \\le \\pi\\), with the shaded region between them. ${mathUnitBridge}`;
		q0Rubric = rubricDoc("Question 1 (Figure 1 — polar area)", 4, [
			{
				letter: "a",
				promptText: "Write an integral that gives the area of the shaded region using polar coordinates.",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Integrand", ["Uses a correct polar area element form such as \\(\\frac{1}{2}\\int (R^2 - r^2)\\,d\\theta\\) with consistent inner/outer radii."]),
					crit("(Point 2)", "Bounds", ["Uses \\(0\\) to \\(\\pi\\) (or an equivalent correct description of the traced region)."]),
				],
			},
			{
				letter: "b",
				promptText: "In one sentence, explain why integrating from \\(\\pi\\) to \\(2\\pi\\) would not contribute additional shaded area in this diagram.",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Geometry", ["Notes symmetry, overlap, cancellation, or that the shaded wedge is only traced once on \\(0\\le\\theta\\le\\pi\\)."]),
					crit("(Point 2)", "Consistency", ["Does not contradict the figure (e.g., no claim that the shaded region reappears identically on \\(\\pi\\) to \\(2\\pi\\))."]),
				],
			},
		]);
	} else if (mathFig0.kind === "calculus_area_vertical") {
		q0Stem = `Figure 1 shows two differentiable functions \\(f\\) (blue) and \\(g\\) (orange) on a closed interval; the shaded region lies between the graphs. ${mathUnitBridge}`;
		q0Rubric = rubricDoc("Question 1 (Figure 1 — area between curves)", 4, [
			{
				letter: "a",
				promptText: "Set up a definite integral that gives the area of the shaded region with respect to \\(x\\).",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Integrand", ["Uses \\(\\int (f(x)-g(x))\\,dx\\) (or equivalent) with the upper minus lower ordering consistent with the figure."]),
					crit("(Point 2)", "Bounds", ["Uses endpoints consistent with the shaded interval shown (may read from axis labels)."]),
				],
			},
			{
				letter: "b",
				promptText:
					mathFig0.mode === "riemann_strip"
						? "Explain how the highlighted vertical strip relates to a Riemann sum approximation for the area."
						: "Explain in words why subtracting the lower curve from the upper curve yields a nonnegative integrand on the shaded interval.",
				maxPoints: 2,
				criteria: [
					crit("(Point 1)", "Concept", [
						mathFig0.mode === "riemann_strip"
							? "Connects strip width to \\(\\Delta x\\) and height to a sample value of \\(f-g\\) (or endpoint values) in a sum."
							: "Notes \\(f(x)\\ge g(x)\\) on the interval so \\(f-g\\) represents vertical slice height.",
					]),
					crit("(Point 2)", "Clarity", ["Explanation matches the diagram without contradicting which curve is upper/lower."]),
				],
			},
		]);
	}

	const q0 = frqQ(
		{
			id: idFor(ctx.courseId, ctx.setIndex, 0, "m0"),
			type: "free_response",
			subject: ctx.courseName,
			correct_answer: AP_FRQ_PLACEHOLDER_ANSWER,
			figure: mathFig0,
			procedural_structure_id: "math-q1-lowercase-parts-figure",
			frq_rubric: q0Rubric,
			explanation:
				mathFig0.kind === "line_chart"
					? `Differentiate with the power rule, then locate critical points where f'(x)=0 and justify max/min with an appropriate test.`
					: mathFig0.kind === "polar_area_cartesian"
						? `Use the polar area formula with correct inner/outer radii and limits matching the shaded wedge.`
						: `Set up \\(\\int (f-g)\\,dx\\) with correct bounds and relate strips to Riemann sums or nonnegative height as appropriate.`,
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

	const q1Stem = `A differentiable function \\(g\\) is modeled by Table 1 near \\(x=${x0}\\). ${mathUnitBridge}`;

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

	const q2Stem = `Use Stimulus A and Stimulus B. In part (b), explain the correct integral idea using situations or vocabulary that fit **${ctx.unitTitle}**.`;

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
						crit("(Point 2)", "Unit linkage", [
							`Ties the idea explicitly to **${ctx.unitTitle}** (${frqUnitAnchorSentence(ctx)}), not generic math only.`,
						]),
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
	ctx: FrqUnitCtx,
): ExamQuestion[] {
	const phenom = pick(rng, SCI_PHENOM);
	const sciFig0 = frqFigureScienceQ0(rng, {
		courseId: ctx.courseId,
		phenom,
		unitTitle: ctx.unitTitle,
		courseName: ctx.courseName,
	});
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
		`You model ${phenom} as part of **${ctx.unitTitle}** (${frqUnitAnchorSentence(ctx)}). Figure 1 may show a model diagram, circuit, pendulum schematic, reaction profile, food web, chromosome crossing-over diagram, scatterplot, or time series—use it to motivate design choices where appropriate.`,
	);

	const fig = frqFigureScienceQ1(createRng(`frq|${ctx.courseId}|s${ctx.setIndex}|sci-q1`, "v0"), { courseId: ctx.courseId });

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
		`Use Figure 2. It may be a time series, histogram, scatterplot, demographic diagram, or second genetics schematic—describe patterns using evidence from the figure.`,
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
		`Refer to Stimulus A and Stimulus B. Connect your reasoning to **${ctx.unitTitle}** (${frqUnitAnchorSentence(ctx)}).`,
	);

	return [q0, q1, q2];
}

function buildEnglishSet(
	rng: () => number,
	ctx: FrqUnitCtx,
): ExamQuestion[] {
	const passage = pick(rng, [
		"A city council member argues that ‘efficiency’ should outweigh neighborhood character when approving new housing.",
		"A blogger celebrates remote work as liberation while dismissing concerns about downtown small businesses.",
		"A scientist warns that ‘correlation is not causation’ but then implies policy should wait indefinitely for certainty.",
	]);

	const enFig0 = frqFigureEnglishQ0(rng, { unitTitle: ctx.unitTitle });

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
		`Read the following claim (hypothetical):\n\n> ${passage}\n\nFigure 1 may be a reader poll, a rhetorical process sketch, or a photograph exhibit; cite it only if it sharpens your analysis for **${ctx.unitTitle}** (${frqUnitAnchorSentence(ctx)}).`,
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
					crit("(Point 2)", "Development", [
						`Connects drafting choices to **${ctx.unitTitle}** (line of reasoning, concession, evidence use) with at least one concrete link to the unit’s themes.`,
					]),
				],
			},
		]),
		},
		`Use Table 1 while revising an argument tied to **${ctx.unitTitle}** (${frqUnitAnchorSentence(ctx)}).`,
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
		`Refer to Stimulus A and Stimulus B. Relate your answers to **${ctx.unitTitle}** (${frqUnitAnchorSentence(ctx)}).`,
	);

	return [q0, q1, q2];
}

function buildCsSet(
	rng: () => number,
	ctx: FrqUnitCtx,
): ExamQuestion[] {
	const csFig0 = frqFigureCsQ0(rng, { courseId: ctx.courseId, unitTitle: ctx.unitTitle });
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
		`Design context: **${ctx.unitTitle}** (${frqUnitAnchorSentence(ctx)}). Figure 1 may show a process/network sketch, a simple circuit model, or build telemetry—use it if it helps you reason about invariants, failure modes, or detection.`,
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
		`Refer to Stimulus A and Stimulus B. Relate your answers to **${ctx.unitTitle}** (${frqUnitAnchorSentence(ctx)}).`,
	);

	return [q0, q1, q2];
}

function buildWorldLangSet(
	rng: () => number,
	ctx: FrqUnitCtx,
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

	const wlFig0 = frqFigureWorldLangQ0(rng, { lang });

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
		`${lang} response — **${ctx.unitTitle}**.\n${frqUnitAnchorSentence(ctx)}\n\nFigure 1 may be a photograph exhibit or a chart; refer to it in ${lang} only if it supports your answer.\n\nRespond in ${lang} with 3–4 sentences.\n\nPrompt: Describe one tradition or practice that matters in a community you know, and one recent change in daily life there. Explain how the two are connected for people who live there.`,
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
		body: `**Stimulus A — learning context (English)**\nTwo classmates disagree whether studying only at home is enough to build real proficiency in ${lang}.\n\n---\n\n**Stimulus B — learning context (English)**\nA mentor argues that taking interpersonal risks (starting conversations, making mistakes aloud) matters more than perfect grammar in the first months.`,
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
					crit("(Point 2)", "Unit linkage", [`Applies to **${ctx.unitTitle}** (${frqUnitAnchorSentence(ctx)}).`]),
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
	ctx: FrqUnitCtx,
): ExamQuestion[] {
	const arFig0 = frqFigureArtsQ0(rng, { unitTitle: ctx.unitTitle });
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
		`Choose one work or repertoire item you have studied in **${ctx.unitTitle}** (${frqUnitAnchorSentence(ctx)}; hypothetical if needed). Figure 1 may be a photograph exhibit or an engagement curve; reference it if it helps connect form to audience experience.`,
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
		`Refer to Stimulus A and Stimulus B. Relate your answers to **${ctx.unitTitle}** (${frqUnitAnchorSentence(ctx)}).`,
	);

	return [q0, q1, q2];
}

function buildCapstoneSet(
	rng: () => number,
	ctx: FrqUnitCtx,
): ExamQuestion[] {
	const capFig0 = frqFigureCapstoneQ0(rng);
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
		`Grounded in **${ctx.unitTitle}** (${frqUnitAnchorSentence(ctx)}), propose one researchable question. Figure 1 may show a planning sketch, score histogram, or research-cycle flowchart—use it if it helps you justify significance or scope.`,
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
		`Refer to Stimulus A and Stimulus B. Relate your answers to **${ctx.unitTitle}** (${frqUnitAnchorSentence(ctx)}).`,
	);

	return [q0, q1, q2];
}

function buildGenericSet(
	rng: () => number,
	ctx: FrqUnitCtx,
): ExamQuestion[] {
	// Mirrors the three-item AP practice structure: no stimulus, one stimulus, two stimuli.
	return buildSocialSet(rng, ctx);
}

function generateApFrqPracticeTriple(params: {
	courseId: string;
	setIndex: number;
	unitId: string;
	difficulty?: ProceduralDifficulty;
	/** Per-request salt so the same setIndex never yields identical FRQ wording. */
	sessionEntropy?: string;
	/** Fingerprints (precise + read) to avoid repeating items the user already saw. */
	avoidFingerprints?: readonly string[];
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

	const avoid = new Set(params.avoidFingerprints ?? []);
	const track = frqTrackForCourse(params.courseId);

	const ctxBase: Omit<FrqUnitCtx, "setIndex"> = {
		courseId: params.courseId,
		courseName: course.name,
		unitTitle: unit.title,
		unitSummary: unit.summary,
		unitHooks: unit.questionHooks ?? [],
		unitIndex: unit.index,
	};

	let attemptEntropy = params.sessionEntropy ?? randomSeedEntropy();
	let lastQs: ExamQuestion[] = [];

	for (let attempt = 0; attempt < 48; attempt++) {
		const entropy = `${attemptEntropy}|try${attempt}`;
		const seed = `frq|${params.courseId}|u:${unit.id}|set:${si}|diff:${diff}|${entropy}`;
		const ctx: FrqUnitCtx = { ...ctxBase, setIndex: si };
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
		lastQs = qs;

		const seen = new Set<string>();
		let clash = false;
		for (const q of qs) {
			for (const k of questionAvoidFingerprintKeys(q)) {
				if (avoid.has(k) || seen.has(k)) {
					clash = true;
					break;
				}
				seen.add(k);
			}
			if (clash) break;
		}
		if (!clash) return qs;
		attemptEntropy = randomSeedEntropy();
	}

	return lastQs;
}

export function generateApFrqPracticeSet(params: {
	courseId: string;
	setIndex: number;
	unitId: string;
	difficulty?: ProceduralDifficulty;
	sessionEntropy?: string;
	avoidFingerprints?: readonly string[];
}): ExamQuestion[] {
	const spec = getApFrqReplicaSpec(params.courseId);
	const n = Math.max(1, Math.min(24, spec.frqCount));
	const out: ExamQuestion[] = [];
	const avoidAccum = new Set(params.avoidFingerprints ?? []);
	let round = 0;
	const baseEntropy = params.sessionEntropy ?? randomSeedEntropy();
	while (out.length < n && round < 20) {
		const chunk = generateApFrqPracticeTriple({
			...params,
			setIndex: clampSetIndex(params.setIndex + round),
			sessionEntropy: `${baseEntropy}|round${round}|${randomSeedEntropy()}`,
			avoidFingerprints: [...avoidAccum],
		});
		for (const q of chunk) {
			if (out.length >= n) break;
			out.push({
				...q,
				id: idFor(params.courseId, params.setIndex, out.length, hashString(q.question.slice(0, 48)).toString(36)),
			});
			for (const k of questionAvoidFingerprintKeys(q)) {
				avoidAccum.add(k);
			}
		}
		round++;
	}
	return out;
}
