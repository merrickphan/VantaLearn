// Date/time utilities
export function getDaysUntil(targetDate: string): number {
 const today = new Date();
 today.setHours(0, 0, 0, 0);
 const target = new Date(targetDate);
 target.setHours(0, 0, 0, 0);
 const diff = target.getTime() - today.getTime();
 return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function formatDate(dateString: string): string {
 return new Date(dateString).toLocaleDateString("en-US", {
 month: "long",
 day: "numeric",
 year: "numeric",
 });
}

export function formatTimeSpent(seconds: number): string {
 if (seconds < 60) return `${seconds}s`;
 const minutes = Math.floor(seconds / 60);
 if (minutes < 60) return `${minutes}m`;
 const hours = Math.floor(minutes / 60);
 const remainingMinutes = minutes % 60;
 return `${hours}h ${remainingMinutes}m`;
}

// Score calculation utilities
export interface ScoreScaleConfig {
 totalQuestions: number;
 rawScore: number;
}

export function calculateAPScore(config: ScoreScaleConfig): {
 apScore: 1 | 2 | 3 | 4 | 5;
 percentage: number;
} {
 const percentage = (config.rawScore / config.totalQuestions) * 100;

 let apScore: 1 | 2 | 3 | 4 | 5;
 if (percentage >= 75) apScore = 5;
 else if (percentage >= 60) apScore = 4;
 else if (percentage >= 45) apScore = 3;
 else if (percentage >= 30) apScore = 2;
 else apScore = 1;

 return { apScore, percentage };
}

export function calculateSATScore(config: ScoreScaleConfig): {
 scaledScore: number;
 percentage: number;
} {
 const percentage = (config.rawScore / config.totalQuestions) * 100;
 // Simplified SAT scaling: 400-1600 range
 const scaledScore = Math.round(400 + (percentage / 100) * 1200);
 return { scaledScore, percentage };
}

// Progress utilities
export function calculateRetentionRate(
 gotIt: number,
 total: number
): number {
 if (total === 0) return 0;
 return Math.round((gotIt / total) * 100);
}

import { AP_COURSE_NAMES, buildCommonExamDates } from "@/lib/apCatalog";

// All AP courses from catalog (+ SAT below)
export const AP_SUBJECTS = AP_COURSE_NAMES;

export const SAT_SUBJECTS = ["SAT Math", "SAT Reading & Writing"] as const;

export const ALL_EXAMS = [...AP_COURSE_NAMES, ...SAT_SUBJECTS] as const;

export const COMMON_EXAM_DATES: Record<string, string> = buildCommonExamDates();

export {
 computeApSubjectScore,
 getApSubjectModel,
 listApSubjectModels,
 type ApSubjectScoreResult,
 type ApSubjectScoreModel,
 type ApScoreSectionDef,
} from "@/lib/apScoreBySubject";
