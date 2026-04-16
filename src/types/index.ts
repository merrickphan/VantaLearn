// User types
export interface User {
 id: string;
 email: string;
 full_name?: string;
 avatar_url?: string;
 auth_provider: "google" | "email";
 created_at: string;
}

// Study Resource types
export type ResourceType = "flashcard_set" | "practice_exam" | "study_guide";

export interface StudyResource {
 id: string;
 title: string;
 subject: string;
 type: ResourceType;
 content_data: FlashcardContent | ExamContent;
 created_at: string;
}

// Flashcard types
export interface FlashcardContent {
 cards: FlashcardItem[];
}

export interface FlashcardItem {
 id: string;
 front: string;
 back: string;
}

export type FlashcardStatus = "unseen" | "needs_review" | "got_it";

export interface FlashcardSession {
 cardId: string;
 status: FlashcardStatus;
}

// Exam types
export type QuestionType = "multiple_choice" | "free_response";

/** One row in an AP-style scoring guide (acceptable answers may vary). */
export interface FrqRubricCriterion {
	pointLabel: string;
	descriptor: string;
	acceptableExamples: string[];
}

/** Part A / B / C within a single FRQ prompt. */
export interface FrqRubricPart {
	letter: string;
	promptText: string;
	maxPoints: number;
	criteria: FrqRubricCriterion[];
}

/**
 * Full answer key for one free-response item (College Board-style structure,
 * rendered with VantaLearn styling in the exam player).
 */
export interface FrqRubricDoc {
	header: string;
	totalPoints: number;
	parts: FrqRubricPart[];
}

export interface ExamContent {
 questions: ExamQuestion[];
 time_limit_minutes?: number;
}

/** CB-style stimulus: charts, tables (rendered like exam booklets). */
export type ExamFigure =
	| {
			kind: "bar_chart";
			title?: string;
			yLabel?: string;
			bars: { label: string; value: number }[];
	  }
	| {
			kind: "line_chart";
			title?: string;
			yLabel?: string;
			/** Horizontal-axis caption below the plot (may include \\(…\\) LaTeX). */
			xLabel?: string;
			points: { x: string; y: number }[];
	  }
	| {
			kind: "table";
			title?: string;
			headers: string[];
			rows: string[][];
	  }
	| {
			/** Short scenario, experimental setup, or exhibit (College Board-style stimulus). */
			kind: "stimulus";
			/** Optional caption; omit for sentence-only stimuli shown inline like AP Lang. */
			title?: string;
			body: string;
	  }
	| {
			kind: "population_pyramid";
			title?: string;
			note?: string;
			caption?: string;
			bands: { age: string; male: number; female: number }[];
	  }
	| {
			kind: "reaction_coordinate";
			title?: string;
			note?: string;
			yLabel?: string;
			stages: { label: string; energy: number }[];
	  }
	| {
			kind: "supply_demand";
			title?: string;
			note?: string;
			yLabel?: string;
			xLabel?: string;
			quantities: string[];
			supplyPrice: number[];
			demandPrice: number[];
			supplyLabel?: string;
			demandLabel?: string;
	  }
	| {
			kind: "circuit_series";
			title?: string;
			note?: string;
			resistorsOhm: number[];
			batteryVolts?: number;
	  }
	| {
			kind: "map_schematic";
			title?: string;
			note?: string;
			legend?: string;
			regions: {
				abbrev: string;
				path: string;
				fill: string;
				labelX: number;
				labelY: number;
			}[];
	  }
	| {
			kind: "exhibit_placeholder";
			title?: string;
			credit?: string;
			description: string;
	  }
	| {
			kind: "process_flow";
			title?: string;
			note?: string;
			nodes: { id: string; label: string }[];
	  }
	| {
			kind: "scatter_plot";
			title?: string;
			note?: string;
			xLabel?: string;
			yLabel?: string;
			points: { x: number; y: number; label?: string }[];
			showTrendLine?: boolean;
	  }
	| {
			kind: "histogram";
			title?: string;
			note?: string;
			yLabel?: string;
			bins: { label: string; count: number }[];
	  }
	| {
			kind: "food_web";
			title?: string;
			note?: string;
			legend?: string;
			taxa: { id: string; label: string; tier: number }[];
			links: { from: string; to: string }[];
	  }
	| {
			/** Side-by-side bars per category (e.g. demographic composition by year). */
			kind: "grouped_bar_chart";
			title?: string;
			note?: string;
			yLabel?: string;
			xLabel?: string;
			groupLabels: string[];
			series: { label: string; values: number[]; fill?: string; striped?: boolean }[];
	  }
	| {
			/** Area under / between curves with optional single Riemann strip (AP Calc style). */
			kind: "calculus_area_vertical";
			title?: string;
			note?: string;
			xLabel?: string;
			yLabel?: string;
			xs: number[];
			upperY: number[];
			lowerY?: number[];
			shadeFromIndex: number;
			shadeToIndex: number;
			mode: "full_shade" | "riemann_strip";
			riemannStripIndex?: number;
			upperCurveLabel?: string;
			lowerCurveLabel?: string;
	  }
	| {
			/** Polar curves plotted as \\(x=r\\cos\\theta, y=r\\sin\\theta\\); shaded between inner and outer on \\(0\\le\\theta\\le\\pi\\). */
			kind: "polar_area_cartesian";
			title?: string;
			note?: string;
			caption?: string;
			outerR: number;
			innerR0: number;
			innerRCos: number;
	  }
	| {
			kind: "urban_land_use_model";
			title?: string;
			note?: string;
			variant: "concentric" | "sector" | "multiple_nuclei";
	  }
	| {
			kind: "physics_pendulum";
			title?: string;
			note?: string;
			lengthM: number;
			massKg: number;
			angleDeg: number;
	  }
	| {
			kind: "biology_crossing_over";
			title?: string;
			note?: string;
	  }
	| {
			kind: "neuron_action_potential";
			title?: string;
			note?: string;
	  }
	| {
			kind: "synapse_schematic";
			title?: string;
			note?: string;
	  };

/** Figures rendered outside the core bar / line / table / stimulus path. */
export type NonCoreExamFigure = Exclude<
	ExamFigure,
	{ kind: "stimulus" } | { kind: "table" } | { kind: "bar_chart" } | { kind: "line_chart" }
>;

/** Pipeline-assigned difficulty for AI-generated items (optional on procedural questions). */
export type ApQuestionDifficultyLevel = "easy" | "medium" | "hard";

export interface ApQuestionDistractorAnnotation {
	choice: string;
	misconceptionSource: string;
}

/** Rich metadata from the unified AP question generation pipeline (optional). */
export interface ApQuestionMetadata {
	apUnitId: string;
	apUnitTitle: string;
	conceptId: string;
	conceptLabel: string;
	archetype: string;
	stimulusKind: string;
	/** Deterministic parameter card used for stimulus assembly. */
	stimulusParameters?: Record<string, string | number | boolean | string[]>;
	difficulty: ApQuestionDifficultyLevel;
	calculatorAllowed: boolean;
	apRealismScore: number;
	distractorAnnotations: ApQuestionDistractorAnnotation[];
	examSimulationNote: string;
}

export interface ExamQuestion {
 id: string;
 question: string;
 type: QuestionType;
 options?: string[];
 correct_answer: string;
 explanation?: string;
 subject: string;
 /** Optional graph/table shown above the stem (AP-style). */
 figure?: ExamFigure;
 /** Procedural template id for variety tracking (not shown to students). */
 procedural_structure_id?: string;
	/** When set, exam UI shows a structured scoring guide after submit (self-check). */
	frq_rubric?: FrqRubricDoc;
	/**
	 * Intro / shared stem only (no lettered parts). With `frq_rubric`, the exam player shows
	 * one rubric part at a time (College Board–style sections).
	 */
	frq_stem?: string;
	/** Mirrors `options` for AI schema consumers (same strings, same order). */
	choices?: string[];
	/** Calculator policy for this stem (AI pipeline; optional elsewhere). */
	calculator_allowed?: boolean;
	difficulty?: ApQuestionDifficultyLevel;
	ap_realism_score?: number;
	ap_metadata?: ApQuestionMetadata;
}

export interface ExamAttempt {
 questionId: string;
 userAnswer: string;
 isCorrect: boolean;
 aiFeedback?: string;
}

// Progress types
export interface UserProgress {
 id: string;
 user_id: string;
 resource_id: string;
 score?: number;
 completed_at?: string;
 time_spent_seconds: number;
}

// Exam Timer types
export interface ExamTimer {
 id: string;
 user_id: string;
 exam_name: string;
 target_date: string;
}

// AI Feedback types
export interface AIFeedback {
 id: string;
 user_id: string;
 resource_id: string;
 prompt: string;
 response: string;
 created_at: string;
}

// Score Calculator types
export interface ScoreResult {
 rawScore: number;
 scaledScore: number;
 percentage: number;
 estimatedGrade?: string;
}

// Onboarding types
export interface OnboardingData {
 selectedExams: string[];
 examDates: Record<string, string>;
}
