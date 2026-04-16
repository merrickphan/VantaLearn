import type { ExamFigure } from "@/types";
import { randInt } from "./utils";

/** Human Geography — Question 1: rotate AP-style exhibits (map, pyramid, photo placeholder, sector bar, histogram). */
export function frqFigureHumanGeoQ0(
	rng: () => number,
	ctx: { place: string; unitTitle: string },
): ExamFigure {
	const r = rng();
	if (r < 0.12) {
		const variants = ["concentric", "sector", "multiple_nuclei"] as const;
		return {
			kind: "urban_land_use_model",
			title: "FIGURE 1. Classic urban land-use model (hypothetical labels)",
			note: `Use the diagram with ${ctx.unitTitle} when discussing internal structure, accessibility, and land rent—not as a map of ${ctx.place}.`,
			variant: variants[Math.floor(rng() * variants.length)]!,
		};
	}
	if (r < 0.26) {
		return {
			kind: "grouped_bar_chart",
			title: "FIGURE 1. Hypothetical racial/ethnic composition by census year (%)",
			note: "Clustered bars share a year on the horizontal axis; values sum to roughly 100% within each year.",
			yLabel: "Percentage of population",
			xLabel: "Year",
			groupLabels: ["1980", "2000", "2010", "2050*"],
			series: [
				{ label: "Group A", values: [82, 68, 63, 47].map((v) => v + randInt(rng, -2, 2)), fill: "#cbd5e1" },
				{ label: "Group B", values: [6, 14, 17, 29].map((v) => v + randInt(rng, -1, 1)), fill: "#64748b" },
				{ label: "Group C", values: [12, 13, 13, 13].map((v) => v + randInt(rng, -1, 1)), striped: true },
				{ label: "Group D", values: [2, 5, 7, 9].map((v) => v + randInt(rng, -1, 1)), fill: "#0f172a" },
			],
		};
	}
	if (r < 0.36) {
		return {
			kind: "population_pyramid",
			title: "FIGURE 1. Age–sex composition (hypothetical thousands; modeled region)",
			note: "Bars extend from a central axis: males at left, females at right. Values are for practice only.",
			caption: `Comparable in scale to a national or large regional profile you might discuss with ${ctx.unitTitle}.`,
			bands: [
				{ age: "0–14", male: randInt(rng, 120, 320), female: randInt(rng, 110, 300) },
				{ age: "15–44", male: randInt(rng, 280, 520), female: randInt(rng, 270, 500) },
				{ age: "45–64", male: randInt(rng, 160, 340), female: randInt(rng, 170, 360) },
				{ age: "65+", male: randInt(rng, 80, 220), female: randInt(rng, 100, 260) },
			],
		};
	}
	if (r < 0.46) {
		return {
			kind: "map_schematic",
			title: "FIGURE 1. Stylized regions within a hypothetical state (not drawn to geographic scale)",
			note: `Treat as a simplified political map for discussing boundaries, cores, and peripheries related to ${ctx.unitTitle}.`,
			legend: "Letters label four internal regions; boundaries are illustrative.",
			regions: [
				{
					abbrev: "N",
					fill: "rgba(56,189,248,0.35)",
					path: "M 40 30 L 200 20 L 220 100 L 60 110 Z",
					labelX: 130,
					labelY: 70,
				},
				{
					abbrev: "S",
					fill: "rgba(244,114,182,0.3)",
					path: "M 60 115 L 220 105 L 200 180 L 50 175 Z",
					labelX: 130,
					labelY: 145,
				},
				{
					abbrev: "E",
					fill: "rgba(167,139,250,0.32)",
					path: "M 225 25 L 360 40 L 350 170 L 230 100 Z",
					labelX: 295,
					labelY: 85,
				},
				{
					abbrev: "W",
					fill: "rgba(52,211,153,0.28)",
					path: "M 35 35 L 55 175 L 20 120 Z",
					labelX: 38,
					labelY: 110,
				},
			],
		};
	}
	if (r < 0.62) {
		return {
			kind: "exhibit_placeholder",
			title: "PHOTO 1. Central business district edge (hypothetical)",
			credit: "Exam-style exhibit for practice; not a real College Board photograph.",
			description: `Shows mid-rise commercial blocks, street-level retail, and visible informal vending along sidewalks—useful for discussing land use, informal economy, and urban morphology in a setting comparable to ${ctx.place}.`,
		};
	}
	if (r < 0.82) {
		return {
			kind: "bar_chart",
			title: "FIGURE 1. Sector share of GDP in a hypothetical national economy (%)",
			yLabel: "Percent of GDP",
			bars: [
				{ label: "Primary", value: randInt(rng, 3, 24) },
				{ label: "Secondary", value: randInt(rng, 16, 45) },
				{ label: "Tertiary", value: randInt(rng, 35, 76) },
			],
		};
	}
	return {
		kind: "histogram",
		title: "FIGURE 1. Hypothetical distribution of farm sizes (number of holdings by size class)",
		note: "Histogram bins are adjacent; counts are arbitrary practice units.",
		yLabel: "Number of holdings",
		bins: [
			{ label: "<5 ha", count: randInt(rng, 18, 45) },
			{ label: "5–20", count: randInt(rng, 28, 55) },
			{ label: "20–50", count: randInt(rng, 12, 32) },
			{ label: ">50", count: randInt(rng, 4, 18) },
		],
	};
}

export function frqFigureSocialQ0(
	rng: () => number,
	ctx: { courseId: string; courseName: string; place: string; unitTitle: string },
): ExamFigure {
	if (ctx.courseId === "psych") {
		const r = rng();
		if (r < 0.22) {
			return {
				kind: "synapse_schematic",
				title: "FIGURE 1. Chemical synapse (schematic)",
				note: `Relates to neural communication in ${ctx.unitTitle}. Vesicles, neurotransmitter release, and postsynaptic receptors are simplified.`,
			};
		}
		if (r < 0.44) {
			return {
				kind: "neuron_action_potential",
				title: "FIGURE 1. Membrane potential vs. time during one action potential (model trace)",
				note: "Threshold near −55 mV; trace is illustrative, not from a single empirical recording.",
			};
		}
	}
	if (ctx.courseId === "macro" || ctx.courseId === "micro") {
		const q0 = ["10", "20", "30", "40", "50"];
		const sUp = [12, 14, 16, 18, 22].map((b, i) => b + randInt(rng, -2, 2) + i * 2);
		const dDown = [24, 21, 18, 15, 12].map((b) => b + randInt(rng, -2, 2));
		return {
			kind: "supply_demand",
			title:
				ctx.courseId === "macro"
					? "FIGURE 1. Hypothetical aggregate supply and aggregate demand (index values)"
					: "FIGURE 1. Hypothetical market for a good (price vs. quantity)",
			note: `Use the figure with ${ctx.unitTitle}. Values are not tied to a real market.`,
			yLabel: ctx.courseId === "macro" ? "Price level (index)" : "Price ($)",
			xLabel: ctx.courseId === "macro" ? "Real GDP (index)" : "Quantity (units per period)",
			quantities: q0,
			supplyPrice: sUp,
			demandPrice: dDown,
			supplyLabel: ctx.courseId === "macro" ? "SRAS" : "S",
			demandLabel: ctx.courseId === "macro" ? "AD" : "D",
		};
	}
	const r = rng();
	if (r < 0.28) {
		return {
			kind: "process_flow",
			title: "FIGURE 1. Hypothetical policy implementation sequence",
			note: `Sequential model for ${ctx.courseName}; arrows imply temporal order only.`,
			nodes: [
				{ id: "a", label: "Agenda setting" },
				{ id: "b", label: "Policy formulation" },
				{ id: "c", label: "Implementation" },
				{ id: "d", label: "Feedback / evaluation" },
			],
		};
	}
	if (r < 0.5) {
		return {
			kind: "exhibit_placeholder",
			title: "PHOTO 1. Legislative chamber during debate (hypothetical)",
			credit: "Practice exhibit only.",
			description: `Shows members seated in a semicircular arrangement with visible party grouping—useful for discussing representation, rules, or coalition behavior in ${ctx.unitTitle}.`,
		};
	}
	return {
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
}

export function frqFigureHistoryQ0(rng: () => number, ctx: { era: string; courseName: string }): ExamFigure {
	const r = rng();
	if (r < 0.22) {
		return {
			kind: "population_pyramid",
			title: "FIGURE 1. Hypothetical age structure in one region (modeled cohort counts)",
			note: `Context: ${ctx.era} (${ctx.courseName}).`,
			bands: [
				{ age: "0–14", male: randInt(rng, 80, 200), female: randInt(rng, 75, 195) },
				{ age: "15–44", male: randInt(rng, 150, 280), female: randInt(rng, 145, 275) },
				{ age: "45+", male: randInt(rng, 60, 160), female: randInt(rng, 70, 180) },
			],
		};
	}
	if (r < 0.42) {
		return {
			kind: "map_schematic",
			title: "FIGURE 1. Hypothetical territorial control at one date (illustrative)",
			note: "Not a map of any real conflict; use for discussing borders, sovereignty, or spatial claims.",
			legend: "Shaded regions are labeled for reference only.",
			regions: [
				{ abbrev: "I", fill: "rgba(148,163,184,0.4)", path: "M 50 40 L 210 30 L 200 130 L 40 120 Z", labelX: 125, labelY: 80 },
				{ abbrev: "II", fill: "rgba(248,113,113,0.28)", path: "M 215 35 L 370 50 L 360 160 L 210 135 Z", labelX: 290, labelY: 95 },
				{ abbrev: "III", fill: "rgba(74,222,128,0.25)", path: "M 45 125 L 205 135 L 180 185 L 35 175 Z", labelX: 115, labelY: 160 },
			],
		};
	}
	if (r < 0.58) {
		return {
			kind: "exhibit_placeholder",
			title: "PHOTO 1. Industrial workplace (hypothetical)",
			description: `Shows workers, machinery, and factory interior lighting—useful for discussing labor, technology, or economic change within ${ctx.era}.`,
			credit: "Practice exhibit only.",
		};
	}
	return {
		kind: "bar_chart",
		title: "FIGURE 1. Hypothetical share of labor force by sector in one region (%)",
		yLabel: "Percent of labor force",
		bars: [
			{ label: "Agr.", value: randInt(rng, 18, 52) },
			{ label: "Ind.", value: randInt(rng, 22, 48) },
			{ label: "Serv.", value: randInt(rng, 20, 45) },
		],
	};
}

export function frqFigureEnglishQ0(rng: () => number, ctx: { unitTitle: string }): ExamFigure {
	if (rng() < 0.35) {
		return {
			kind: "exhibit_placeholder",
			title: "PHOTO 1. Public meeting on a local policy proposal (hypothetical)",
			description: `Audience members hold signs and face a panel; use for discussing audience, stakes, or rhetorical situation in ${ctx.unitTitle}.`,
			credit: "Practice exhibit only.",
		};
	}
	if (rng() < 0.55) {
		return {
			kind: "process_flow",
			title: "FIGURE 1. Simplified rhetorical analysis workflow",
			nodes: [
				{ id: "1", label: "Observe claims" },
				{ id: "2", label: "Identify strategies" },
				{ id: "3", label: "Evaluate effects" },
			],
		};
	}
	return {
		kind: "bar_chart",
		title: "FIGURE 1. Hypothetical reader survey: dominant impression after first read (%)",
		yLabel: "Percent of readers",
		bars: [
			{ label: "Persuaded", value: randInt(rng, 12, 32) },
			{ label: "Unsure", value: randInt(rng, 38, 58) },
			{ label: "Skeptical", value: randInt(rng, 18, 38) },
		],
	};
}

export function frqFigureCsQ0(rng: () => number, ctx: { courseId: string; unitTitle: string }): ExamFigure {
	if (ctx.courseId === "csp" && rng() < 0.45) {
		return {
			kind: "process_flow",
			title: "FIGURE 1. Hypothetical Internet request path (simplified)",
			note: `Relates to ${ctx.unitTitle}; not a complete protocol diagram.`,
			nodes: [
				{ id: "c", label: "Client device" },
				{ id: "r", label: "Router / ISP" },
				{ id: "s", label: "Server host" },
				{ id: "d", label: "Response to client" },
			],
		};
	}
	if (rng() < 0.35) {
		return {
			kind: "circuit_series",
			title: "FIGURE 1. Hypothetical series circuit for a “smart sensor” prototype",
			note: "Use for discussing constraints, testing, or physical vs. logical models—not a lab wiring diagram.",
			resistorsOhm: [randInt(rng, 4, 12), randInt(rng, 6, 20)],
			batteryVolts: randInt(rng, 5, 12),
		};
	}
	return {
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
}

export function frqFigureWorldLangQ0(rng: () => number, ctx: { lang: string }): ExamFigure {
	if (rng() < 0.3) {
		return {
			kind: "exhibit_placeholder",
			title: "PHOTO 1. Community festival scene (hypothetical)",
			description: `Public gathering with music, food stalls, and multilingual signage—useful for ${ctx.lang} prompts about culture, tradition, or change.`,
			credit: "Practice exhibit only.",
		};
	}
	return {
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
}

export function frqFigureArtsQ0(rng: () => number, ctx: { unitTitle: string }): ExamFigure {
	if (rng() < 0.35) {
		return {
			kind: "exhibit_placeholder",
			title: "PHOTO 1. Gallery installation view (hypothetical)",
			description: `Visitors viewing a large-format work under directional lighting—use for discussing reception, space, or design choices in ${ctx.unitTitle}.`,
			credit: "Practice exhibit only.",
		};
	}
	return {
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
}

export function frqFigureCapstoneQ0(rng: () => number): ExamFigure {
	if (rng() < 0.4) {
		return {
			kind: "histogram",
			title: "FIGURE 1. Hypothetical distribution of peer-review scores on draft outlines (count of drafts)",
			yLabel: "Number of drafts",
			bins: [
				{ label: "1–2", count: randInt(rng, 2, 10) },
				{ label: "3–4", count: randInt(rng, 8, 22) },
				{ label: "5–6", count: randInt(rng, 12, 28) },
				{ label: "7–8", count: randInt(rng, 6, 18) },
			],
		};
	}
	if (rng() < 0.65) {
		return {
			kind: "process_flow",
			title: "FIGURE 1. Hypothetical research cycle (iterative)",
			nodes: [
				{ id: "q", label: "Question" },
				{ id: "l", label: "Literature" },
				{ id: "m", label: "Method" },
				{ id: "e", label: "Evidence" },
			],
		};
	}
	return {
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
}

export function frqFigureMathQ0(
	rng: () => number,
	ctx: {
		courseId: string;
		fx: string;
		a: number;
		b: number;
		c: number;
		sampleXs: readonly number[];
	},
): ExamFigure {
	if (ctx.courseId === "calc-bc" && rng() < 0.36) {
		return {
			kind: "polar_area_cartesian",
			title: "FIGURE 1. Polar curves in the Cartesian plane",
			note: "The shaded region lies between the inner limaçon and the outer semicircle for \\(0 \\le \\theta \\le \\pi\\).",
			caption: "Outer boundary: \\(r = 2\\). Inner boundary: \\(r = 1 + \\cos\\theta\\).",
			outerR: 2,
			innerR0: 1,
			innerRCos: 1,
		};
	}
	if (ctx.courseId === "calc-ab" && rng() < 0.36) {
		const xs = [-1, -0.5, 0, 0.5, 1, 1.5, 2];
		const upperY = xs.map((x) => 4 - x * x);
		const lowerY = xs.map((x) => 0.5 * x + 0.5);
		const mode = rng() < 0.5 ? "full_shade" : "riemann_strip";
		return {
			kind: "calculus_area_vertical",
			title: "FIGURE 1. Region between two graphs (illustrative)",
			note: "Blue curve is the upper boundary; orange is the lower boundary. Shading shows the region between the curves on the interval shown.",
			xLabel: "Independent variable \\(x\\)",
			yLabel: "Dependent variable \\(y\\)",
			xs,
			upperY,
			lowerY,
			shadeFromIndex: 0,
			shadeToIndex: xs.length - 1,
			mode,
			riemannStripIndex: mode === "riemann_strip" ? 3 : undefined,
			upperCurveLabel: "f(x)",
			lowerCurveLabel: "g(x)",
		};
	}
	void ctx.fx;
	const sampleXs = ctx.sampleXs;
	return {
		kind: "line_chart",
		title: "FIGURE 1. Selected values of \\(y = f(x)\\) (rounded)",
		yLabel: "Dependent variable: \\(y = f(x)\\) (rounded to nearest integer on the plot)",
		xLabel:
			"Independent variable: \\(x\\). Each value along the bottom is an input; the number above the point is the corresponding output \\(y\\).",
		points: sampleXs.map((x) => ({
			x: String(x),
			y: Math.round(ctx.a * x * x + ctx.b * x + ctx.c),
		})),
	};
}

export function frqFigureScienceQ0(
	rng: () => number,
	ctx: { courseId: string; phenom: string; unitTitle: string; courseName: string },
): ExamFigure {
	const { courseId } = ctx;
	if (courseId === "chem") {
		return {
			kind: "reaction_coordinate",
			title: "FIGURE 1. Hypothetical reaction coordinate diagram (relative energy)",
			note: `Relates to ${ctx.phenom} in ${ctx.unitTitle}. Energies are not experimental values.`,
			yLabel: "Relative potential energy (arbitrary units)",
			stages: [
				{ label: "Reactants", energy: 0 },
				{ label: "Transition state", energy: randInt(rng, 18, 42) },
				{ label: "Intermediate", energy: randInt(rng, 8, 22) },
				{ label: "Products", energy: randInt(rng, -6, 8) },
			],
		};
	}
	if (courseId.startsWith("physics")) {
		if (rng() < 0.42) {
			return {
				kind: "physics_pendulum",
				title: "FIGURE 1. Simple pendulum held at an angle (schematic)",
				note: `Context: ${ctx.unitTitle}. Diagram is not to scale; dashed line shows the vertical through the pivot.`,
				lengthM: 2 + randInt(rng, 0, 4) / 10,
				massKg: 1 + randInt(rng, 2, 16) / 10,
				angleDeg: [20, 25, 30, 35][randInt(rng, 0, 3)]!,
			};
		}
		return {
			kind: "circuit_series",
			title: "FIGURE 1. Hypothetical series circuit for a mechanics/electricity lab setup",
			note: `Context: ${ctx.unitTitle}.`,
			resistorsOhm: [randInt(rng, 5, 15), randInt(rng, 8, 24)],
			batteryVolts: randInt(rng, 6, 24),
		};
	}
	if (courseId === "bio") {
		if (rng() < 0.38) {
			return {
				kind: "biology_crossing_over",
				title: "FIGURE 1. Homologous chromosomes before and after crossing over (schematic)",
				note: `Relates to meiosis and genetic variation in ${ctx.unitTitle}. Gene blocks are simplified markers, not drawn to genomic scale.`,
			};
		}
		return {
			kind: "food_web",
			title: "FIGURE 1. Hypothetical partial food web (arbitrary species labels)",
			note: "Arrows show energy flow (who eats whom). Not a field site diagram.",
			legend: "Trophic levels increase from producers upward.",
			taxa: [
				{ id: "p", label: "Producers", tier: 0 },
				{ id: "h", label: "Herbivore", tier: 1 },
				{ id: "c", label: "Carnivore", tier: 2 },
				{ id: "d", label: "Decomposer", tier: 1 },
			],
			links: [
				{ from: "p", to: "h" },
				{ from: "h", to: "c" },
				{ from: "p", to: "d" },
				{ from: "h", to: "d" },
			],
		};
	}
	if (courseId === "env") {
		if (rng() < 0.55) {
			return {
				kind: "scatter_plot",
				title: "FIGURE 1. Hypothetical paired field measurements",
				note: `Use with ${ctx.unitTitle}.`,
				xLabel: "Distance from source (km)",
				yLabel: "Indicator concentration (ppb, arbitrary)",
				points: [
					{ x: 0.5, y: 42 + randInt(rng, -4, 4) },
					{ x: 1.2, y: 31 + randInt(rng, -3, 3) },
					{ x: 2.0, y: 22 + randInt(rng, -3, 3) },
					{ x: 3.5, y: 14 + randInt(rng, -2, 2) },
					{ x: 5.0, y: 9 + randInt(rng, -2, 2) },
				],
				showTrendLine: true,
			};
		}
		return {
			kind: "line_chart",
			title: "FIGURE 1. Hypothetical index of stream health vs. distance downstream of a disturbance",
			yLabel: "Health index (arb. units)",
			points: [
				{ x: "t0", y: randInt(rng, 8, 28) },
				{ x: "t1", y: randInt(rng, 22, 48) },
				{ x: "t2", y: randInt(rng, 38, 62) },
				{ x: "t3", y: randInt(rng, 30, 55) },
			],
		};
	}
	return {
		kind: "line_chart",
		title: "FIGURE 1. Hypothetical pilot trial: outcome magnitude vs. run order (arbitrary units)",
		yLabel: "Quantity (arb. units)",
		points: [
			{ x: "t0", y: randInt(rng, 8, 28) },
			{ x: "t1", y: randInt(rng, 22, 48) },
			{ x: "t2", y: randInt(rng, 38, 62) },
			{ x: "t3", y: randInt(rng, 30, 55) },
		],
	};
}

/** Science question 2: vary line chart vs reaction profile vs histogram vs circuit (physics). */
export function frqFigureScienceQ1(rng: () => number, ctx: { courseId: string }): ExamFigure {
	const { courseId } = ctx;
	const r = rng();
	if (courseId === "chem" && r < 0.45) {
		return {
			kind: "histogram",
			title: "FIGURE 2. Hypothetical distribution of molecular collision energies at one temperature (model)",
			yLabel: "Relative frequency",
			bins: [
				{ label: "Low", count: randInt(rng, 20, 45) },
				{ label: "Mid", count: randInt(rng, 35, 70) },
				{ label: "High", count: randInt(rng, 10, 30) },
			],
		};
	}
	if (courseId.startsWith("physics") && r < 0.4) {
		return {
			kind: "scatter_plot",
			title: "FIGURE 2. Hypothetical position vs. time sample (one-dimensional motion)",
			xLabel: "Time (s)",
			yLabel: "Position (m)",
			points: [
				{ x: 0, y: 0 },
				{ x: 0.2, y: 0.8 + rng() * 0.2 },
				{ x: 0.4, y: 1.5 + rng() * 0.2 },
				{ x: 0.6, y: 2.1 + rng() * 0.2 },
				{ x: 0.8, y: 2.6 + rng() * 0.2 },
			],
			showTrendLine: true,
		};
	}
	if (courseId === "bio" && r < 0.32) {
		return {
			kind: "biology_crossing_over",
			title: "FIGURE 2. Crossing over within a tetrad (alternate schematic)",
			note: "Compare to Figure 1 if both appear in the same set; otherwise use independently.",
		};
	}
	if (courseId === "bio" && r < 0.55) {
		return {
			kind: "population_pyramid",
			title: "FIGURE 2. Hypothetical age structure for a prey population (model counts)",
			bands: [
				{ age: "Juvenile", male: randInt(rng, 40, 90), female: randInt(rng, 38, 88) },
				{ age: "Adult", male: randInt(rng, 20, 55), female: randInt(rng, 22, 58) },
				{ age: "Senescent", male: randInt(rng, 5, 20), female: randInt(rng, 6, 22) },
			],
		};
	}
	return {
		kind: "line_chart",
		title: "FIGURE 2. Measured quantity over time (arbitrary units)",
		yLabel: "Quantity",
		points: [
			{ x: "t0", y: randInt(rng, 10, 30) },
			{ x: "t1", y: randInt(rng, 35, 60) },
			{ x: "t2", y: randInt(rng, 55, 85) },
			{ x: "t3", y: randInt(rng, 40, 70) },
		],
	};
}
