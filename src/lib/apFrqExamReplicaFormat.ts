import type { CalculatorSectionPolicy } from "@/lib/questions/procedural";

/**
 * Published-exam-style FRQ section facts for the setup modal and generated session length.
 * Times are rounded replicas for practice; official administration wording may vary by year.
 */
export type ApFrqReplicaSpec = {
	/** How many free-response items we assemble for this practice session. */
	frqCount: number;
	/** Total Section II–style timing for the countdown timer (minutes). */
	sectionMinutes: number;
	/** Read-only row: how many FR tasks. */
	frqCountLabel: string;
	/** Read-only row: timer description. */
	timerLabel: string;
	/** Read-only row: calculator policy for the real exam’s FRQ portion. */
	calculatorLabel: string;
	/** When set, exam URL includes calcSection (AP Calc FRQ Part B). */
	examCalcSection?: CalculatorSectionPolicy;
};

const DEFAULT: ApFrqReplicaSpec = {
	frqCount: 3,
	sectionMinutes: 75,
	frqCountLabel: "3 free-response items (Section II–style)",
	timerLabel: "75 minutes (Section II–style total)",
	calculatorLabel: "No separate calculator policy for this course’s FRQ replica in VantaLearn.",
};

/** Course-specific replicas; keys are `ApCourse.id`. */
const BY_COURSE: Partial<Record<string, ApFrqReplicaSpec>> = {
	"calc-ab": {
		frqCount: 6,
		sectionMinutes: 90,
		frqCountLabel: "6 free-response questions (Paper 2, Section II)",
		timerLabel: "90 minutes total for all FRQs (exam Section II)",
		calculatorLabel:
			"Part A (questions 1–2): no calculator. Part B (questions 3–6): graphing calculator allowed.",
		examCalcSection: "calculator",
	},
	"calc-bc": {
		frqCount: 6,
		sectionMinutes: 90,
		frqCountLabel: "6 free-response questions (Paper 2, Section II)",
		timerLabel: "90 minutes total for all FRQs (exam Section II)",
		calculatorLabel:
			"Part A (questions 1–2): no calculator. Part B (questions 3–6): graphing calculator allowed.",
		examCalcSection: "calculator",
	},
	precalc: {
		frqCount: 4,
		sectionMinutes: 60,
		frqCountLabel: "4 free-response tasks (Section II)",
		timerLabel: "60 minutes (Section II–style total)",
		calculatorLabel: "Graphing calculator allowed on all FRQs for this exam.",
		examCalcSection: "calculator",
	},
	stats: {
		frqCount: 6,
		sectionMinutes: 90,
		frqCountLabel: "6 investigative tasks (Section II)",
		timerLabel: "90 minutes (Section II–style total)",
		calculatorLabel: "Calculator allowed throughout the statistics free-response section.",
		examCalcSection: "calculator",
	},
	"cs-a": {
		frqCount: 4,
		sectionMinutes: 90,
		frqCountLabel: "4 free-response questions (Section II)",
		timerLabel: "90 minutes (Section II)",
		calculatorLabel: "No calculator (Computer Science A).",
	},
	csp: {
		frqCount: 2,
		sectionMinutes: 120,
		frqCountLabel: "Create performance task + written response (through-course)",
		timerLabel: "Timing varies by school year; practice timer uses 120 minutes as a planning block.",
		calculatorLabel: "No calculator for CSP written prompts.",
	},
	"physics-1": {
		frqCount: 5,
		sectionMinutes: 90,
		frqCountLabel: "5 free-response questions (Section II)",
		timerLabel: "90 minutes (Section II)",
		calculatorLabel: "Four-function, scientific, or graphing calculator allowed where permitted.",
		examCalcSection: "calculator",
	},
	"physics-2": {
		frqCount: 4,
		sectionMinutes: 90,
		frqCountLabel: "4 free-response questions (Section II)",
		timerLabel: "90 minutes (Section II)",
		calculatorLabel: "Four-function, scientific, or graphing calculator allowed where permitted.",
		examCalcSection: "calculator",
	},
	"physics-c-m": {
		frqCount: 3,
		sectionMinutes: 45,
		frqCountLabel: "3 free-response questions (Mechanics Section II)",
		timerLabel: "45 minutes (Mechanics FRQ block)",
		calculatorLabel: "Calculator allowed on all Mechanics FRQs.",
		examCalcSection: "calculator",
	},
	"physics-c-em": {
		frqCount: 3,
		sectionMinutes: 45,
		frqCountLabel: "3 free-response questions (E&M Section II)",
		timerLabel: "45 minutes (E&M FRQ block)",
		calculatorLabel: "Calculator allowed on all E&M FRQs.",
		examCalcSection: "calculator",
	},
	chem: {
		frqCount: 7,
		sectionMinutes: 105,
		frqCountLabel: "7 free-response prompts (long + short, Section II)",
		timerLabel: "105 minutes (Section II)",
		calculatorLabel: "Scientific or graphing calculator allowed on the chemistry FRQ section.",
		examCalcSection: "calculator",
	},
	bio: {
		frqCount: 8,
		sectionMinutes: 90,
		frqCountLabel: "8 free-response prompts (Section II)",
		timerLabel: "90 minutes (Section II)",
		calculatorLabel: "Four-function (with square root), scientific, or graphing calculator as allowed.",
		examCalcSection: "calculator",
	},
	env: {
		frqCount: 3,
		sectionMinutes: 90,
		frqCountLabel: "3 free-response questions (Section II)",
		timerLabel: "90 minutes (Section II)",
		calculatorLabel: "Four-function (with square root), scientific, or graphing calculator allowed.",
		examCalcSection: "calculator",
	},
	ush: {
		frqCount: 3,
		sectionMinutes: 100,
		frqCountLabel: "3 long-essay / document-based tasks (Section II, Part A–C style)",
		timerLabel: "100 minutes (Section II–style total)",
		calculatorLabel: "No calculator (AP US History).",
	},
	wh: {
		frqCount: 3,
		sectionMinutes: 100,
		frqCountLabel: "3 long-essay / document-based tasks (Section II)",
		timerLabel: "100 minutes (Section II–style total)",
		calculatorLabel: "No calculator (AP World History: Modern).",
	},
	euro: {
		frqCount: 3,
		sectionMinutes: 100,
		frqCountLabel: "3 long-essay / document-based tasks (Section II)",
		timerLabel: "100 minutes (Section II–style total)",
		calculatorLabel: "No calculator (AP European History).",
	},
	gov: {
		frqCount: 4,
		sectionMinutes: 100,
		frqCountLabel: "4 concept-application / argument tasks (Section II)",
		timerLabel: "100 minutes (Section II–style total)",
		calculatorLabel: "No calculator (AP US Government and Politics).",
	},
	"comp-gov": {
		frqCount: 4,
		sectionMinutes: 100,
		frqCountLabel: "4 conceptual analysis / argument tasks (Section II)",
		timerLabel: "100 minutes (Section II–style total)",
		calculatorLabel: "No calculator (AP Comparative Government).",
	},
	macro: {
		frqCount: 3,
		sectionMinutes: 60,
		frqCountLabel: "3 long free-response questions (Section II)",
		timerLabel: "60 minutes (Section II)",
		calculatorLabel: "Simple four-function calculator (+/−/×/÷) allowed on macro FRQs.",
		examCalcSection: "calculator",
	},
	micro: {
		frqCount: 3,
		sectionMinutes: 60,
		frqCountLabel: "3 long free-response questions (Section II)",
		timerLabel: "60 minutes (Section II)",
		calculatorLabel: "Simple four-function calculator (+/−/×/÷) allowed on micro FRQs.",
		examCalcSection: "calculator",
	},
	psych: {
		frqCount: 2,
		sectionMinutes: 50,
		frqCountLabel: "2 free-response questions (Section II)",
		timerLabel: "50 minutes (Section II)",
		calculatorLabel: "No calculator (AP Psychology).",
	},
	"hum-geo": {
		frqCount: 3,
		sectionMinutes: 75,
		frqCountLabel: "3 free-response questions (Section II); each question has parts (A)–(G)",
		timerLabel: "75 minutes (Section II)",
		calculatorLabel: "Four-function, scientific, or graphing calculator allowed where applicable.",
		examCalcSection: "calculator",
	},
	lang: {
		frqCount: 3,
		sectionMinutes: 135,
		frqCountLabel: "3 timed writing tasks (Section II: synthesis, rhetorical analysis, argument)",
		timerLabel: "135 minutes (Section II)",
		calculatorLabel: "No calculator (AP English Language).",
	},
	lit: {
		frqCount: 3,
		sectionMinutes: 120,
		frqCountLabel: "3 literary analysis essays (Section II)",
		timerLabel: "120 minutes (Section II)",
		calculatorLabel: "No calculator (AP English Literature).",
	},
	"art-hist": {
		frqCount: 6,
		sectionMinutes: 120,
		frqCountLabel: "6 long and short essay prompts (Section II)",
		timerLabel: "120 minutes (Section II)",
		calculatorLabel: "No calculator (AP Art History).",
	},
	"art-design": {
		frqCount: 1,
		sectionMinutes: 15,
		frqCountLabel: "Sustained investigation / portfolio is not a timed FRQ exam—timer is a short planning block only.",
		timerLabel: "15 minutes (optional planning block for this replica)",
		calculatorLabel: "Not applicable (portfolio course).",
	},
	music: {
		frqCount: 7,
		sectionMinutes: 90,
		frqCountLabel: "7 free-response tasks (sight-singing, written, aural—Section II mix)",
		timerLabel: "90 minutes (Section II–style total)",
		calculatorLabel: "No calculator (AP Music Theory).",
	},
	spanish: {
		frqCount: 4,
		sectionMinutes: 90,
		frqCountLabel: "4 free-response tasks (Section II)",
		timerLabel: "90 minutes (Section II)",
		calculatorLabel: "No calculator (world language exam).",
	},
	french: {
		frqCount: 4,
		sectionMinutes: 90,
		frqCountLabel: "4 free-response tasks (Section II)",
		timerLabel: "90 minutes (Section II)",
		calculatorLabel: "No calculator (world language exam).",
	},
	german: {
		frqCount: 4,
		sectionMinutes: 90,
		frqCountLabel: "4 free-response tasks (Section II)",
		timerLabel: "90 minutes (Section II)",
		calculatorLabel: "No calculator (world language exam).",
	},
	latin: {
		frqCount: 5,
		sectionMinutes: 120,
		frqCountLabel: "5 free-response tasks (Section II)",
		timerLabel: "120 minutes (Section II)",
		calculatorLabel: "No calculator (AP Latin).",
	},
	chinese: {
		frqCount: 4,
		sectionMinutes: 90,
		frqCountLabel: "4 free-response tasks (Section II)",
		timerLabel: "90 minutes (Section II)",
		calculatorLabel: "No calculator (world language exam).",
	},
	japanese: {
		frqCount: 4,
		sectionMinutes: 90,
		frqCountLabel: "4 free-response tasks (Section II)",
		timerLabel: "90 minutes (Section II)",
		calculatorLabel: "No calculator (world language exam).",
	},
	seminar: {
		frqCount: 1,
		sectionMinutes: 120,
		frqCountLabel: "End-of-course exam includes timed written argument / analysis (replica uses one extended block).",
		timerLabel: "120 minutes (timed writing block)",
		calculatorLabel: "No calculator (AP Seminar).",
	},
	research: {
		frqCount: 1,
		sectionMinutes: 60,
		frqCountLabel: "Academic paper defense / presentation varies—replica uses one focused writing block.",
		timerLabel: "60 minutes (practice writing block)",
		calculatorLabel: "Not applicable (AP Research).",
	},
};

export function getApFrqReplicaSpec(courseId: string): ApFrqReplicaSpec {
	return { ...DEFAULT, ...(BY_COURSE[courseId] ?? {}) };
}
