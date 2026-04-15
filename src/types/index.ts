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
 };

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
