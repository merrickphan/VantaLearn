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

// Available exam subjects
export const AP_SUBJECTS = [
  "AP Calculus AB",
  "AP Calculus BC",
  "AP Statistics",
  "AP Biology",
  "AP Chemistry",
  "AP Physics 1",
  "AP Physics 2",
  "AP Physics C",
  "AP English Language",
  "AP English Literature",
  "AP US History",
  "AP World History",
  "AP European History",
  "AP US Government",
  "AP Psychology",
  "AP Computer Science A",
  "AP Computer Science Principles",
  "AP Spanish",
  "AP French",
  "AP Environmental Science",
  "AP Economics (Macro)",
  "AP Economics (Micro)",
  "AP Art History",
] as const;

export const SAT_SUBJECTS = [
  "SAT Math",
  "SAT Reading & Writing",
] as const;

export const ALL_EXAMS = [...AP_SUBJECTS, ...SAT_SUBJECTS] as const;

// Common AP exam dates (2025)
export const COMMON_EXAM_DATES: Record<string, string> = {
  "AP Calculus AB": "2025-05-13",
  "AP Calculus BC": "2025-05-13",
  "AP Statistics": "2025-05-16",
  "AP Biology": "2025-05-12",
  "AP Chemistry": "2025-05-06",
  "AP Physics 1": "2025-05-07",
  "AP English Language": "2025-05-14",
  "AP English Literature": "2025-05-07",
  "AP US History": "2025-05-09",
  "AP World History": "2025-05-15",
  "AP Psychology": "2025-05-20",
  "AP Computer Science A": "2025-05-14",
  "SAT Math": "2025-05-03",
  "SAT Reading & Writing": "2025-05-03",
};
