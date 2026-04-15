import { AP_COURSE_NAMES, buildCommonExamDates } from "@/lib/apCatalog";

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

// Score calculation utilities (implementation in dedicated module — see `calculateAPScore.ts`)
export { calculateAPScore, type ScoreScaleConfig } from "@/lib/calculateAPScore";

// Progress utilities
export function calculateRetentionRate(
 gotIt: number,
 total: number
): number {
 if (total === 0) return 0;
 return Math.round((gotIt / total) * 100);
}

export const AP_SUBJECTS = AP_COURSE_NAMES;

export const ALL_EXAMS = [...AP_COURSE_NAMES] as const;

export const COMMON_EXAM_DATES: Record<string, string> = buildCommonExamDates();

export {
 computeApSubjectScore,
 getApSubjectModel,
 listApSubjectModels,
 type ApSubjectScoreResult,
 type ApSubjectScoreModel,
 type ApScoreSectionDef,
 type ApTwoPartCompositeDef,
} from "@/lib/apScoreBySubject";
