import type { ExamQuestion } from "@/types";
import { hashString, randInt, roundN, shuffleInPlace } from "./utils";
import { getHumanGeographyGeneratorsForUnit } from "./humanGeographyUnitPools";
import { getWorldHistoryGeneratorsForUnit } from "./worldHistoryUnitPools";

export interface ProcCtx {
  courseId: string;
  courseName: string;
  unitId: string;
  unitIndex: number;
  unitTitle: string;
  seedBase: string;
}

export type QuestionGen = (rng: () => number, ctx: ProcCtx, i: number) => ExamQuestion;

function idFor(ctx: ProcCtx, i: number, tag: string): string {
  return `proc-${ctx.courseId}-${ctx.unitId}-${i}-${hashString(ctx.seedBase + tag).toString(36)}`;
}

function mc(
  rng: () => number,
  ctx: ProcCtx,
  i: number,
  tag: string,
  stem: string,
  correct: string,
  w1: string,
  w2: string,
  w3: string,
  explanation: string,
  figure?: ExamQuestion["figure"],
): ExamQuestion {
  const options = shuffleInPlace(rng, [correct, w1, w2, w3]);
  const base: ExamQuestion = {
    id: idFor(ctx, i, tag),
    question: stem,
    type: "multiple_choice",
    options,
    correct_answer: correct,
    explanation,
    subject: ctx.courseName,
  };
  return figure ? { ...base, figure } : base;
}

/* ——— Calculus / precalc / stats ——— */

export function genDerivativePower(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  const n = randInt(rng, 2, 9);
  const coef = randInt(rng, 1, 8);
  const d = coef * n;
  const correct = `${d}x^${n - 1}`;
  return mc(
    rng,
    ctx,
    i,
    "d-power",
    `If f(x) = ${coef}x^${n}, then f′(x) equals`,
    correct,
    `${coef * (n - 1)}x^${n}`,
    `${d}x^${n}`,
    `${coef}x^${n - 1}`,
    `Power rule: d/dx of c·x^n is c·n·x^(n−1).`,
  );
}

export function genLimitLinear(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  const a = randInt(rng, 1, 6);
  const b = randInt(rng, -5, 5);
  const c = randInt(rng, 1, 8);
  const lim = a * c + b;
  return mc(
    rng,
    ctx,
    i,
    "lim-lin",
    `Find the limit as x approaches ${c} of (${a}x + ${b}).`,
    `${lim}`,
    `${lim + 1}`,
    `${lim - 1}`,
    `${a + b}`,
    `Substitute x = ${c} into the continuous linear function.`,
  );
}

export function genIntegralPower(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  const n = randInt(rng, 2, 5);
  const coef = randInt(rng, 1, 4);
  const exp = n + 1;
  const num = coef;
  const correct = `(${num}/${exp})x^${exp} + C`;
  return mc(
    rng,
    ctx,
    i,
    "int-power",
    `An antiderivative of ${coef}x^${n} is`,
    correct,
    `${coef}x^${exp} + C`,
    `(${num}/${n})x^${n} + C`,
    `${coef * exp}x^${n - 1} + C`,
    `Increase exponent by 1 and divide by the new exponent.`,
  );
}

export function genCompositionValue(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  const a = randInt(rng, 1, 4);
  const b = randInt(rng, 1, 5);
  const x0 = randInt(rng, 1, 3);
  const inner = a * x0 + b;
  const outerCoef = randInt(rng, 2, 5);
  const val = outerCoef * inner;
  return mc(
    rng,
    ctx,
    i,
    "comp",
    `If f(x) = ${outerCoef}x and g(x) = ${a}x + ${b}, what is f(g(${x0}))?`,
    `${val}`,
    `${outerCoef + inner}`,
    `${a * outerCoef}`,
    `${inner}`,
    `First g(${x0}) = ${inner}, then f(${inner}) = ${outerCoef} × ${inner}.`,
  );
}

export function genTrigSpecial(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  const which = randInt(rng, 0, 3);
  if (which === 0) {
    return mc(rng, ctx, i, "trig", "sin(0) equals", "0", "1", "-1", "1/2", "sin(0) = 0.");
  }
  if (which === 1) {
    return mc(rng, ctx, i, "trig", "cos(0) equals", "1", "0", "-1", "1/2", "cos(0) = 1.");
  }
  return mc(rng, ctx, i, "trig", "sin(π/2) equals", "1", "0", "-1", "1/2", "sin(π/2) = 1.");
}

export function genMeanSimple(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  const a = randInt(rng, 60, 95);
  const b = randInt(rng, 60, 95);
  const c = randInt(rng, 60, 95);
  const mean = roundN((a + b + c) / 3, 2);
  return mc(
    rng,
    ctx,
    i,
    "mean",
    `The sample mean of {${a}, ${b}, ${c}} is`,
    `${mean}`,
    `${a + b + c}`,
    `${roundN((a + b) / 2, 2)}`,
    `${roundN(mean + 1, 2)}`,
    `Add the values and divide by 3.`,
  );
}

export function genZScoreConcept(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "z",
    "The z-score for an observation x with mean μ and standard deviation σ is",
    "(x − μ) / σ",
    "(x + μ) / σ",
    "(x − μ) · σ",
    "μ / σ",
    `Standardize by subtracting the mean and dividing by the standard deviation.`,
  );
}

export function genStatsBarChartMode(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "st-bar",
    "The bar chart shows counts by favorite snack in a class. Which snack was chosen most often?",
    "Chips",
    "Fruit",
    "Granola",
    "Yogurt",
    `The tallest bar corresponds to the mode for this categorical variable.`,
    {
      kind: "bar_chart",
      title: "Favorite snack (counts in a sample)",
      yLabel: "Number of students",
      bars: [
        { label: "Granola", value: 4 },
        { label: "Yogurt", value: 7 },
        { label: "Chips", value: 12 },
        { label: "Fruit", value: 9 },
      ],
    },
  );
}

export function genStatsExamLineTrend(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "st-line",
    "The line chart shows mean exam score over four tests. Which test had the highest mean score?",
    "Test C",
    "Test A",
    "Test B",
    "Test D",
    `Read the y-values at each test; Test C has the maximum.`,
    {
      kind: "line_chart",
      title: "Mean exam score over four tests",
      yLabel: "Score",
      points: [
        { x: "Test A", y: 72 },
        { x: "Test B", y: 78 },
        { x: "Test C", y: 91 },
        { x: "Test D", y: 84 },
      ],
    },
  );
}

/* ——— Computer science ——— */

export function genBigO(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "big-o",
    "Which best describes the worst-case time complexity of comparison-based sorting of n items?",
    "O(n log n)",
    "O(n)",
    "O(n²) for every algorithm",
    "O(1)",
    `Optimal comparison sorts are Θ(n log n) worst case (e.g., mergesort).`,
  );
}

export function genLoopCount(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  const n = randInt(rng, 5, 20);
  const total = n * (n + 1) / 2;
  return mc(
    rng,
    ctx,
    i,
    "loop",
    `Consider: for (int i=1; i<=${n}; i++) sum += i;  After the loop, sum equals`,
    `${total}`,
    `${n * n}`,
    `${n + 1}`,
    `${n}`,
    `This sums 1 + 2 + … + ${n} = ${n}(${n}+1)/2 = ${total}.`,
  );
}

export function genBooleanExpr(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "bool",
    "In Java, true && false evaluates to",
    "false",
    "true",
    "null",
    "error",
    `Logical AND requires both operands true.`,
  );
}

/* ——— Physics ——— */

export function genKinematicsV(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  const v0 = randInt(rng, 0, 10);
  const a = randInt(rng, 1, 5);
  const t = randInt(rng, 1, 6);
  const v = v0 + a * t;
  return mc(
    rng,
    ctx,
    i,
    "kin",
    `A particle accelerates from ${v0} m/s at ${a} m/s² for ${t} s. Its final speed is`,
    `${v} m/s`,
    `${v0 * t} m/s`,
    `${a * t} m/s`,
    `${v + 1} m/s`,
    `Use v = v₀ + at = ${v0} + (${a})(${t}).`,
  );
}

export function genEnergyKE(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  const m = randInt(rng, 1, 8);
  const v = randInt(rng, 2, 10);
  const ke = roundN(0.5 * m * v * v, 0);
  return mc(
    rng,
    ctx,
    i,
    "ke",
    `Kinetic energy K = ½mv² for m = ${m} kg and v = ${v} m/s is`,
    `${ke} J`,
    `${m * v} J`,
    `${2 * ke} J`,
    `${roundN(ke / 2, 0)} J`,
    `Compute ½ × ${m} × ${v}² = ${ke} J.`,
  );
}

export function genPhysVelocityBarFig(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "ph-vbar",
    "The bar chart shows the magnitude of a cart’s velocity at equal time intervals. At which labeled time is speed greatest?",
    "3 s",
    "1 s",
    "2 s",
    "4 s",
    `Compare bar heights; the largest value indicates the highest speed.`,
    {
      kind: "bar_chart",
      title: "Speed magnitude at 1 s intervals",
      yLabel: "Speed (m/s)",
      bars: [
        { label: "1 s", value: 2 },
        { label: "2 s", value: 5 },
        { label: "3 s", value: 9 },
        { label: "4 s", value: 6 },
      ],
    },
  );
}

export function genCoulombConcept(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "coul",
    "The electric force between two point charges is inversely proportional to",
    "the square of the distance",
    "the distance",
    "the cube of the distance",
    "the charges only",
    `Coulomb's law: F ∝ 1/r².`,
  );
}

/* ——— Chemistry / bio / env ——— */

export function genMolarity(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  const mol = randInt(rng, 1, 5);
  const L = randInt(rng, 1, 4);
  const M = roundN(mol / L, 3);
  return mc(
    rng,
    ctx,
    i,
    "mol",
    `What is the molarity of a solution with ${mol} mol solute in ${L} L of solution?`,
    `${M} M`,
    `${mol * L} M`,
    `${mol + L} M`,
    `${roundN(M * 2, 3)} M`,
    `Molarity is moles per liter: ${mol}/${L}.`,
  );
}

export function genChemConcentrationBarFig(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "chem-bar",
    "The bar chart shows concentration (M) for four solutions. Which solution is most concentrated?",
    "Solution C",
    "Solution A",
    "Solution B",
    "Solution D",
    `The tallest bar corresponds to the highest molarity.`,
    {
      kind: "bar_chart",
      title: "Solution concentration (M)",
      yLabel: "Molarity (M)",
      bars: [
        { label: "Solution A", value: 0.4 },
        { label: "Solution B", value: 0.9 },
        { label: "Solution C", value: 1.6 },
        { label: "Solution D", value: 0.7 },
      ],
    },
  );
}

export function genPHScale(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "ph",
    "At 25°C, a neutral aqueous solution has pH closest to",
    "7",
    "0",
    "14",
    "1",
    `Neutral water has [H⁺] = 10⁻⁷ M, so pH = 7.`,
  );
}

export function genDNAbase(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "dna",
    "In DNA, adenine pairs with",
    "thymine",
    "cytosine",
    "guanine",
    "uracil",
    `DNA uses A–T and G–C pairing (RNA uses A–U).`,
  );
}

export function genBioSpeciesTableFig(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "bio-tbl",
    "According to the table, which species had the greatest estimated population density (individuals per km²) in the sample plot?",
    "Species B",
    "Species A",
    "Species C",
    "Species D",
    `Compare the density column and select the largest value.`,
    {
      kind: "table",
      title: "Sample plot — species counts and area",
      headers: ["Species", "Individuals", "Plot area (km²)", "Density (per km²)"],
      rows: [
        ["Species A", "24", "2", "12"],
        ["Species B", "45", "2", "22.5"],
        ["Species C", "18", "3", "6"],
        ["Species D", "30", "5", "6"],
      ],
    },
  );
}

export function genCarryingCapacity(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "cc",
    "In logistic population growth, the carrying capacity K represents",
    "the maximum population an environment can sustain long term",
    "the initial growth rate only",
    "the extinction threshold",
    "the migration rate",
    `K is the upper asymptote of the logistic curve.`,
  );
}

/* ——— History / gov / geo ——— */

export function genAmendmentFreeSpeech(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "a1",
    "The Bill of Rights protection for freedom of speech is primarily associated with the",
    "First Amendment",
    "Second Amendment",
    "Fourth Amendment",
    "Fourteenth Amendment",
    `Speech protections are central to the First Amendment.`,
  );
}

export function genChecksBalances(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "chk",
    "The power of judicial review in the U.S. was most clearly articulated in",
    "Marbury v. Madison",
    "Brown v. Board",
    "McCulloch v. Maryland",
    "United States v. Lopez",
    `Marshall's opinion established judicial review.`,
  );
}

export function genSeparationOfPowers(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "sep",
    "In the U.S. federal system, dividing lawmaking, enforcement, and adjudication across branches exemplifies",
    "separation of powers",
    "dual federalism only",
    "unified sovereignty",
    "judicial activism only",
    `Different branches hold distinct core functions with checks between them.`,
  );
}

export function genFederalismConcept(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "fed",
    "A system where sovereignty is constitutionally divided between national and regional governments is called",
    "federalism",
    "unitary government only",
    "confederation without enforcement",
    "direct democracy",
    `Federalism allocates authority across levels (U.S.: national + state).`,
  );
}

export function genRegimeType(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "reg",
    "In comparative politics, a system where citizens elect representatives is often classified as",
    "democratic",
    "authoritarian",
    "totalitarian",
    "theocratic",
    `Representative elections are a hallmark of democratic regimes (with definitional nuance).`,
  );
}

export function genNationState(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "nat",
    "A political unit recognized as having legitimate authority over a defined territory is commonly called a",
    "state",
    "regime type only",
    "civil society",
    "interest group",
    `In comparative politics, “state” often denotes the organized political community with territorial sovereignty.`,
  );
}

export function genMapScale(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "map",
    "A large-scale map typically shows",
    "a smaller area with more detail",
    "a larger area with less detail",
    "only elevation",
    "only political boundaries",
    `Large scale ⇒ smaller geographic area, finer detail.`,
  );
}

export function genGeoDistanceDecay(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "dd",
    "The idea that interaction between places weakens as the distance between them increases is known as",
    "distance decay",
    "possibilism",
    "environmental determinism",
    "core–periphery theory",
    `Interaction typically tails off with distance (time and cost of movement).`,
  );
}

export function genGeoRelocationDiffusion(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "reloc",
    "The spread of an idea through the physical movement of people from one place to another is best described as",
    "relocation diffusion",
    "expansion diffusion",
    "stimulus diffusion",
    "hierarchical diffusion",
    `Relocation diffusion moves with migrants or travelers.`,
  );
}

export function genGeoPushPull(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "pp",
    "A factory closing in a rural area, leading workers to leave, acts most directly as a",
    "push factor",
    "pull factor",
    "migration selectivity",
    "remittance flow",
    `Push factors encourage people to leave an origin.`,
  );
}

export function genGeoPrimateCity(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "prim",
    "In a country where one city is vastly larger than the next-ranked cities, that dominant city is often called a",
    "primate city",
    "gateway city",
    "boom town",
    "exurb",
    `The primate city pattern shows the largest city dramatically outranking others.`,
  );
}

export function genGeoBidRent(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "bid",
    "In the bid–rent model, land closest to the central business district (CBD) is typically bid highest by",
    "retail and office uses",
    "extensive grain farming",
    "subsistence herding",
    "forestry",
    `High accessibility near the CBD supports intensive, high-revenue land uses.`,
  );
}

export function genGeoPopulationBarFig(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "geo-pbar",
    "According to the bar chart, which urban area has the largest population shown?",
    "River Delta Metro",
    "Inland Hub",
    "Coastal Port",
    "Plateau Town",
    `Compare bar heights to find the maximum.`,
    {
      kind: "bar_chart",
      title: "Population of selected urban areas (millions)",
      yLabel: "Millions",
      bars: [
        { label: "River Delta Metro", value: 18 },
        { label: "Inland Hub", value: 9 },
        { label: "Coastal Port", value: 6 },
        { label: "Plateau Town", value: 2 },
      ],
    },
  );
}

export function genGeoUrbanGrowthLineFig(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "geo-line",
    "According to the line chart, in which period was urban growth (percentage change) fastest?",
    "2010–2015",
    "2000–2005",
    "2005–2010",
    "2015–2020",
    `The steepest upward segment indicates the fastest growth rate.`,
    {
      kind: "line_chart",
      title: "Urban population growth rate (% per period)",
      yLabel: "% change",
      points: [
        { x: "2000–2005", y: 1.1 },
        { x: "2005–2010", y: 1.4 },
        { x: "2010–2015", y: 2.6 },
        { x: "2015–2020", y: 1.8 },
      ],
    },
  );
}

export function genGeoCropsTableFig(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "geo-tbl",
    "According to the table, which crop had the highest national production (million metric tons) in Year 2?",
    "Maize",
    "Wheat",
    "Rice",
    "Barley",
    `Read the Year 2 column and select the largest value.`,
    {
      kind: "table",
      title: "Crop production (million metric tons) — sample country",
      headers: ["Crop", "Year 1", "Year 2"],
      rows: [
        ["Wheat", "42", "48"],
        ["Maize", "55", "71"],
        ["Rice", "30", "33"],
        ["Barley", "18", "20"],
      ],
    },
  );
}

export function genWW2Turning(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "ww2",
    "Which battle is commonly cited as a major turning point on the Eastern Front in World War II?",
    "Stalingrad",
    "Verdun",
    "Somme",
    "Waterloo",
    `The Battle of Stalingrad (1942–43) marked a major Soviet shift.`,
  );
}

export function genPrintingPressSpread(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "print",
    "The rapid spread of printed books in 15th–16th century Europe most strongly helped",
    "diffuse religious and scientific ideas",
    "end all regional wars",
    "abolish feudalism overnight",
    "isolate monasteries",
    `Printing accelerated circulation of texts across regions.`,
  );
}

export function genScrambleAfrica(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "berlin",
    "The late 19th-century European partitioning of African territory is most associated with",
    "the Berlin Conference (1884–85)",
    "the Congress of Vienna",
    "the Treaty of Versailles",
    "the Yalta Conference",
    `European powers met to set rules for African colonization.`,
  );
}

/* ——— Economics ——— */

export function genOppCost(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  const a = randInt(rng, 8, 20);
  const b = randInt(rng, 8, 20);
  return mc(
    rng,
    ctx,
    i,
    "opp",
    `If producing one more unit of Good A requires giving up ${b} units of Good B, the opportunity cost of A in terms of B is`,
    `${b} units of B per unit of A`,
    `${a} units of B per unit of A`,
    `${a + b} total units`,
    `zero`,
    `Opportunity cost is what you sacrifice at the margin.`,
  );
}

export function genGDPdeflator(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "gdp",
    "The GDP deflator is calculated as",
    "Nominal GDP / Real GDP × 100",
    "Real GDP / Nominal GDP × 100",
    "CPI / GDP",
    "Exports − Imports",
    `Deflator compares nominal output to real output.`,
  );
}

export function genEconUnemploymentLineFig(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "econ-un",
    "According to the line chart, the unemployment rate was highest in",
    "Q2",
    "Q1",
    "Q3",
    "Q4",
    `Identify which point has the maximum unemployment rate.`,
    {
      kind: "line_chart",
      title: "Unemployment rate (%) by quarter",
      yLabel: "Percent",
      points: [
        { x: "Q1", y: 4.2 },
        { x: "Q2", y: 6.8 },
        { x: "Q3", y: 5.1 },
        { x: "Q4", y: 4.5 },
      ],
    },
  );
}

/* ——— Psychology ——— */

export function genNeuronPart(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "neu",
    "The gap between two neurons across which neurotransmitters travel is the",
    "synapse",
    "axon terminal only",
    "myelin sheath",
    "soma exclusively",
    `The synaptic cleft lies between the presynaptic and postsynaptic neurons.`,
  );
}

export function genOperant(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "op",
    "Giving a treat after a dog sits on command is an example of",
    "positive reinforcement",
    "negative reinforcement",
    "positive punishment",
    "extinction",
    `Adding a desirable stimulus strengthens behavior (positive reinforcement).`,
  );
}

/* ——— English ——— */

export function genFallacy(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "fall",
    "Attacking the person rather than the argument is known as",
    "ad hominem",
    "straw man",
    "false dilemma",
    "appeal to authority",
    `Ad hominem targets the arguer instead of the claim.`,
  );
}

export function genRhetoricalAppeal(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "eth",
    "An appeal to credibility and character is primarily",
    "ethos",
    "logos",
    "pathos",
    "kairos",
    `Ethos emphasizes speaker trustworthiness.`,
  );
}

/* ——— Arts ——— */

export function genRenaissanceArt(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "ren",
    "Linear perspective as a systematic compositional tool is especially associated with",
    "Early Renaissance in Italy",
    "Impressionism in France",
    "Abstract Expressionism in New York",
    "Byzantine mosaics",
    `Filippo Brunelleschi and others helped develop linear perspective in Quattrocento Italy.`,
  );
}

export function genCadence(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "cad",
    "A cadence that ends on the dominant harmony typically sounds",
    "half cadence",
    "authentic cadence",
    "plagal cadence",
    "deceptive cadence",
    `A half cadence ends on V (dominant).`,
  );
}

/* ——— World languages (pattern drills) ——— */

export function genNumberPatternEs(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  const n = randInt(rng, 2, 9);
  const wrongs = [`once`, `diez`, `cero`];
  return mc(
    rng,
    ctx,
    i,
    "esn",
    `Which Spanish word matches the number ${n}?`,
    n === 2 ? "dos" : n === 3 ? "tres" : n === 4 ? "cuatro" : n === 5 ? "cinco" : n === 6 ? "seis" : n === 7 ? "siete" : n === 8 ? "ocho" : "nueve",
    wrongs[0],
    wrongs[1],
    wrongs[2],
    `Match Spanish numerals to digits (example item; vary with unit practice).`,
  );
}

/* ——— Capstone ——— */

export function genCitationEthics(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "cite",
    "In academic research, paraphrasing a source without citation is generally considered",
    "plagiarism",
    "fair use automatically",
    "peer review",
    "synthesis",
    `Ideas and wording from sources require attribution.`,
  );
}

export function genVariableControl(rng: () => number, ctx: ProcCtx, i: number): ExamQuestion {
  return mc(
    rng,
    ctx,
    i,
    "var",
    "The variable intentionally manipulated by the researcher is the",
    "independent variable",
    "dependent variable",
    "confounding variable",
    "control group",
    `The IV is what the experimenter changes.`,
  );
}

/* ——— Pools ——— */

const CALC: QuestionGen[] = [
  genDerivativePower,
  genLimitLinear,
  genIntegralPower,
  genCompositionValue,
  genTrigSpecial,
];

/** Text-only stats items (safe to mix with calculus for numeric literacy). */
const STATS_TEXT: QuestionGen[] = [genMeanSimple, genZScoreConcept];
const STATS_FIG: QuestionGen[] = [genStatsBarChartMode, genStatsExamLineTrend];
const STATS_FULL: QuestionGen[] = [...STATS_TEXT, ...STATS_FIG];

const CS: QuestionGen[] = [genBigO, genLoopCount, genBooleanExpr];
const PHYS_ALG: QuestionGen[] = [genKinematicsV, genEnergyKE];
const PHYS_C: QuestionGen[] = [genKinematicsV, genEnergyKE, genCoulombConcept];
const CHEM: QuestionGen[] = [genMolarity, genPHScale, genChemConcentrationBarFig];
const BIO: QuestionGen[] = [genDNAbase, genCarryingCapacity, genBioSpeciesTableFig];
const ENV: QuestionGen[] = [genCarryingCapacity, genPHScale];

const HIST_SHARED: QuestionGen[] = [genWW2Turning];
const HIST_GLOBAL: QuestionGen[] = [genPrintingPressSpread, genScrambleAfrica];

const GOV: QuestionGen[] = [
  genAmendmentFreeSpeech,
  genChecksBalances,
  genSeparationOfPowers,
  genFederalismConcept,
];

const COMP_GOV: QuestionGen[] = [genRegimeType, genChecksBalances, genNationState];

const ECON: QuestionGen[] = [genOppCost, genGDPdeflator, genEconUnemploymentLineFig];

const PSYCH: QuestionGen[] = [genNeuronPart, genOperant, genVariableControl];

const ENG: QuestionGen[] = [genFallacy, genRhetoricalAppeal];
const ART: QuestionGen[] = [genRenaissanceArt, genCadence];
const LANG: QuestionGen[] = [genNumberPatternEs, genRhetoricalAppeal];
const CAP: QuestionGen[] = [genCitationEthics, genVariableControl];

/** Fallback when a catalog course is missing from the map — should not happen in normal use. */
const DEFAULT_POOL: QuestionGen[] = [genFallacy, genRhetoricalAppeal];

const COURSE_POOL: Record<string, QuestionGen[]> = {
  "calc-ab": [...CALC, ...STATS_TEXT],
  "calc-bc": [...CALC, ...STATS_TEXT],
  precalc: [...CALC, ...STATS_TEXT],
  stats: STATS_FULL,
  "cs-a": [...CS, genVariableControl],
  csp: [...CS, genVariableControl],
  "physics-1": [...PHYS_ALG, genVariableControl, genPhysVelocityBarFig],
  "physics-2": [...PHYS_ALG, genPHScale, genVariableControl, genPhysVelocityBarFig],
  "physics-c-m": [...PHYS_C, genVariableControl],
  "physics-c-em": [...PHYS_C, genVariableControl],
  chem: [...CHEM, genVariableControl],
  bio: [...BIO, genVariableControl],
  env: [...ENV, genVariableControl],
  ush: [...HIST_SHARED, ...GOV],
  euro: [...HIST_SHARED, ...HIST_GLOBAL],
  gov: [...GOV],
  "comp-gov": [...COMP_GOV],
  macro: [...ECON],
  micro: [...ECON],
  psych: PSYCH,
  lang: ENG,
  lit: ENG,
  "art-hist": ART,
  "art-design": [...ART, genCitationEthics],
  music: ART,
  spanish: LANG,
  french: LANG,
  german: LANG,
  latin: [...ENG, genCitationEthics],
  chinese: LANG,
  japanese: LANG,
  seminar: [...CAP, ...ENG],
  research: CAP,
};

export function getGeneratorsForCourse(courseId: string, unitIndex: number = 1): QuestionGen[] {
  if (courseId === "wh" && unitIndex >= 1 && unitIndex <= 9) {
    return getWorldHistoryGeneratorsForUnit(unitIndex) as QuestionGen[];
  }
  if (courseId === "hum-geo" && unitIndex >= 1 && unitIndex <= 7) {
    return getHumanGeographyGeneratorsForUnit(unitIndex) as QuestionGen[];
  }
  return COURSE_POOL[courseId] ?? DEFAULT_POOL;
}
