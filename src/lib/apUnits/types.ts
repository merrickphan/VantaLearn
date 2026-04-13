/** One College Board–style instructional unit for an AP course. */
export interface ApUnit {
  id: string;
  index: number;
  title: string;
  summary: string;
  /** Optional rotating prompt angles for AI generation (not all catalogs define these). */
  questionHooks?: string[];
}
