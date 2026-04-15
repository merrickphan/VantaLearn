/** Kept separate from `@/lib/utils` so client bundles (e.g. ExamGame) do not pull the full utils barrel + apCatalog side effects. */

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
