/**
 * One curriculum unit per AP course. IDs are globally unique: `${courseId}-u${n}`.
 */
export interface ApUnit {
  id: string;
  /** 1-based display order within the course */
  index: number;
  title: string;
  /** What this unit covers — used in AI prompts */
  summary: string;
  /** Rotate these to force stem/figure variety across requests */
  questionHooks: string[];
}
