/**
 * Approximate counts of distinct procedural "structures" (stem template × foil pattern ×
 * numeric parameters where applicable). Used for documentation; actual runtime variety also
 * depends on figure randomization and deduplication.
 */

import { PROCEDURAL_MASS_BANK_SIZES } from "./apMassConceptBanks";
import { calcCedLimitSpecCount } from "./calcCedLimitBank";
import {
 COMPOSITION_STEMS,
 DERIVATIVE_POWER_STEMS,
 INTEGRAL_POWER_STEMS,
 LIMIT_LINEAR_STEMS,
 MEAN_STEMS,
 MOLARITY_STEMS,
 KINEMATICS_STEMS,
 KINETIC_ENERGY_STEMS,
} from "./stemBanks";

/** Rough lower bound on distinct structures for STEM-heavy courses (calc / precalc / stats). */
function stemHeavyMathEstimate(): number {
 const d =
 DERIVATIVE_POWER_STEMS.length * 47 * 72 * 2 * 4;
 const lim = LIMIT_LINEAR_STEMS.length * 42 * 121 * 55;
 const inte = INTEGRAL_POWER_STEMS.length * 13 * 28 * 13;
 const comp = COMPOSITION_STEMS.length * 18 * 35 * 22 * 23 * 24;
 const trig = 16 * 3;
 const mean = MEAN_STEMS.length * 900 * 900 * 900;
 const z = 10 * 4;
 return d + lim + inte + comp + trig + mean + z;
}

export function estimateMinStructuresForCourse(courseId: string): number {
 const mass = PROCEDURAL_MASS_BANK_SIZES;

 switch (courseId) {
 case "psych":
 return mass.psych + 150;
 case "gov":
  return mass.gov + 200;
 case "lang":
 case "lit":
 return mass.eng + 120;
 case "macro":
 case "micro":
 return mass.econ + 250;
 case "calc-ab":
 case "calc-bc":
 return stemHeavyMathEstimate() + calcCedLimitSpecCount() + 800;
 case "precalc":
 return stemHeavyMathEstimate() + 800;
 case "stats":
 return stemHeavyMathEstimate() + 2000;
 case "physics-1":
 case "physics-2":
 return (
 KINEMATICS_STEMS.length * 11 * 5 * 6 * 10 +
 KINETIC_ENERGY_STEMS.length * 8 * 9 +
 500 +
 400
 );
 case "chem":
 return MOLARITY_STEMS.length * 5 * 4 * 400 + 800;
 case "comp-gov":
  return mass["comp-gov"] + 150;
 case "hum-geo":
 case "ush":
 case "wh":
 return 1200;
 default:
 return 600;
 }
}

/** Target band the generator system is tuned for (AP-style procedural practice). */
export const PROCEDURAL_STRUCTURE_TARGET_PER_EXAM = 1000;
