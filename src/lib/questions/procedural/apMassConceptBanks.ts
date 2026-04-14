/**
 * Large banks of AP-style conceptual MC items (stem + key + foils).
 * Each row is a distinct "question structure" for variety accounting.
 */

import type { ExamQuestion } from "@/types";
import { MASS_BANK_STIMULUS_PROBABILITY, stimulusFigureForMassRow } from "./stimulusPools";
import { hashString, pick, shuffleInPlace } from "./utils";

const DEFAULT_MASS_STIMULUS_P = 0.42;

/** AP-style lead-in when an exhibit is shown (avoids redundant standalone stems). */
function massStemWithOptionalLeadIn(rng: () => number, stem: string, useStimulus: boolean): string {
 if (!useStimulus) {
 return stem;
 }
 const prefixes = [
 "Based on the stimulus, ",
 "According to the scenario described above, ",
 "With reference to the information above, ",
 "Using only the stimulus, ",
 ] as const;
 const p = pick(rng, prefixes);
 const t = stem.trim();
 return p + t.charAt(0).toLowerCase() + t.slice(1);
}

/** Minimal context for IDs (avoids circular import with generators). */
export type MassProcCtx = {
 courseId: string;
 courseName: string;
 unitId: string;
 seedBase: string;
};

export type MassConceptRow = {
 id: string;
 stem: string;
 correct: string;
 w: [string, string, string];
 explanation: string;
};

type W = [string, string, string];

function uniqStrings(xs: readonly string[]): string[] {
 const out: string[] = [];
 const seen = new Set<string>();
 for (const x of xs) {
  const t = String(x).trim();
  if (!t) continue;
  if (seen.has(t)) continue;
  seen.add(t);
  out.push(t);
 }
 return out;
}

type MassConceptTemplate = {
 /** Prefix used in `procedural_structure_id` (also drives stimulus pool prefixes). */
 idPrefix: string;
 stems: readonly string[];
 correct: string;
 /** Large distractor pool (we pick any 3 distinct items from it). */
 wrongPool: readonly string[];
 explanation: string;
};

function pickThreeWrongFromPool(rng: () => number, pool: readonly string[], correct: string): [string, string, string] {
 const filtered = pool.map(String).filter((x) => x && x !== correct);
 if (filtered.length < 3) {
  // Fallback for safety; should not happen if pools are sized correctly.
  return [filtered[0] ?? "INVALID", filtered[1] ?? "INVALID", filtered[2] ?? "INVALID"];
 }
 // Shuffle then take first 3.
 const shuffled = shuffleInPlace(rng, [...filtered]);
 return [shuffled[0], shuffled[1], shuffled[2]];
}

function pickMassRowFromTemplates(rng: () => number, templates: readonly MassConceptTemplate[]): MassConceptRow {
 const t = pick(rng, templates);
 const stemIdx = Math.floor(rng() * t.stems.length);
 const stem = t.stems[Math.max(0, Math.min(t.stems.length - 1, stemIdx))] ?? t.stems[0]!;
 const wrongPool = uniqStrings(t.wrongPool);
 const [w1, w2, w3] = pickThreeWrongFromPool(rng, wrongPool, t.correct);
 // Stable-ish structure id: prefix + chosen stem + chosen wrongs (sorted by pool index where possible).
 const idx = (w: string) => Math.max(0, wrongPool.indexOf(w));
 const wIdx = [idx(w1), idx(w2), idx(w3)].sort((a, b) => a - b);
 return {
  id: `${t.idPrefix}-s${stemIdx}-w${wIdx[0]}-${wIdx[1]}-${wIdx[2]}`,
  stem,
  correct: t.correct,
  w: [w1, w2, w3],
  explanation: t.explanation,
 };
}

function expand(
 prefix: string,
 stems: readonly string[],
 correct: string,
 wrongSets: readonly W[],
 explanation: string,
): MassConceptRow[] {
 const out: MassConceptRow[] = [];
 let idx = 0;
 for (const stem of stems) {
 for (const w of wrongSets) {
 out.push({
 id: `${prefix}-${idx}`,
 stem,
 correct,
 w,
 explanation,
 });
 idx++;
 }
 }
 return out;
}

const IV_STEMS = [
 "The variable intentionally manipulated by the researcher is the",
 "In an experiment, the factor the experimenter changes is called the",
 "Which variable is directly controlled or set by the researcher?",
 "The manipulated variable in a controlled study is the",
 "Researchers assign levels of this variable to different groups:",
 "The variable thought to cause an effect (because it is manipulated) is the",
 "In experimental design vocabulary, the factor you manipulate is the",
 "Which term names what the experimenter varies across conditions?",
 "The input variable in a true experiment is typically the",
 "If you change dosage across groups, dosage is the",
 "The variable whose levels you assign in a randomized experiment is the",
 "Which variable corresponds to the experimental manipulation?",
 "The antecedent variable that researchers set in a lab study is the",
 "In a drug trial, the drug dose given to each group would be the",
 "The variable that defines treatment conditions is the",
 "Which variable is not simply measured but assigned by the researcher?",
 "The causal factor under experimental control is the",
 "In a factorial design, a factor you manipulate is an",
 "The variable whose effect on an outcome you test by changing it is the",
 "Which label fits a variable the experimenter introduces at chosen levels?",
] as const;

const IV_WRONGS: readonly W[] = [
 ["dependent variable", "confounding variable", "control variable"],
 ["dependent variable", "extraneous variable", "participant variable"],
 ["dependent variable", "confound", "moderator variable"],
 ["dependent variable", "blocking variable", "order effect"],
 ["dependent variable", "measurement error", "sampling frame"],
];

const DV_STEMS = [
 "The variable measured to assess the outcome of a study is the",
 "Researchers record changes in this variable after manipulating another:",
 "The response variable in an experiment is the",
 "Which variable reflects the effect you measure?",
 "The outcome you operationalize with a test score or behavior count is the",
 "In an experiment, the measured result variable is the",
 "The variable expected to change because of the manipulation is the",
 "Which term names what you measure to see if the manipulation worked?",
 "The criterion variable often plotted on the y-axis is the",
 "The behavior or score that depends on the experimental condition is the",
 "Which variable is observed after treatment is applied?",
 "The measured consequence in a cause-and-effect study is the",
 "If you measure reaction time after caffeine, reaction time is the",
 "The variable used as evidence for an effect is the",
 "Which variable answers 'what changed?' in the results?",
 "The outcome variable in a controlled experiment is the",
 "Researchers analyze variation in this variable across groups:",
 "The dependent measure in a memory experiment might be recall score, which is the",
 "Which variable is expected to covary with the manipulated factor?",
 "The measured endpoint in a treatment study is the",
] as const;

const DV_WRONGS: readonly W[] = [
 ["independent variable", "confounding variable", "control variable"],
 ["independent variable", "construct validity", "internal validity"],
 ["independent variable", "random error", "systematic error"],
 ["independent variable", "latent variable", "suppressor variable"],
 ["independent variable", "criterion contamination", "history effect"],
];

const SYN_STEMS = [
 "The junction where chemical communication occurs between neurons is the",
 "Neurotransmitters cross the microscopic gap called the",
 "Which structure lies between the axon terminal of one neuron and the dendrite of the next?",
 "The site of synaptic transmission is the",
 "Chemical signals pass across the",
 "The specialized connection where one neuron signals another is the",
 "Across which structure do vesicles release neurotransmitter?",
 "The gap bridged by neurotransmitter molecules is the",
 "Which part of the synapse is not physically continuous between cells?",
 "Communication at a chemical synapse occurs at the",
] as const;

const SYN_WRONGS: readonly W[] = [
 ["axon terminal only", "myelin sheath", "soma exclusively"],
 ["dendrite only", "node of Ranvier only", "glial cell body"],
 ["synaptic knob only", "resting potential", "refractory period"],
 ["terminal button only", "Schwann cell only", "basal ganglia only"],
 ["neuromuscular junction", "olfactory bulb only", "pineal gland only"],
];

const POS_REINF_STEMS = [
 "Giving a treat after a dog sits on command is an example of",
 "Adding praise after a correct response strengthens behavior through",
 "When a desirable stimulus is presented after a behavior, this is",
 "Receiving bonus points for completing homework illustrates",
 "A sticker given after raising a hand is",
 "Adding a reward to increase a behavior exemplifies",
 "If a rat earns food pellets for pressing a lever, food delivery is",
 "Compliments after volunteering can function as",
 "A paycheck (assuming it increases work) can exemplify",
 "Adding something pleasant contingent on a response is",
] as const;

const POS_REINF_WRONGS: readonly W[] = [
 ["negative reinforcement", "positive punishment", "extinction"],
 ["negative punishment", "shaping only", "habituation"],
 ["negative reinforcement", "response cost", "modeling"],
 ["negative reinforcement", "token economy only", "schedules only"],
 ["negative reinforcement", "latent learning", "insight learning"],
];

const HYPOTHESIS_STEMS = [
 "A testable prediction, often stated before data collection, is a",
 "The formal statement of expected results in an experiment is a",
 "Which term describes an educated guess that can be empirically evaluated?",
 "Researchers operationalize variables after forming a",
 "A proposed relationship between variables that guides the study is a",
 "The if-then claim you evaluate with data is called a",
 "Which concept is narrower than a broad theory but still empirically testable?",
 "Before running participants, you typically articulate a",
 "A prediction derived from a theory that can fail empirically is a",
 "Which label fits a specific claim about how two variables relate?",
] as const;

const HYP_WRONGS: readonly W[] = [
 ["theory (alone, without prediction)", "law", "opinion poll"],
 ["definition only", "paradigm only", "meta-analysis"],
 ["case study", "naturalistic observation", "correlation coefficient"],
 ["research question only", "operational definition only", "abstract only"],
 ["literature review only", "method section", "discussion section"],
];

const OPERANT_STEMS = [
 "Increasing behavior by removing an aversive stimulus is",
 "Taking pain away after a response strengthens behavior via",
 "When you buckle your seatbelt to turn off the beeping, the beep removal is",
 "Escaping an unpleasant noise by performing a behavior illustrates",
 "Removing shock after a lever press is an example of",
 "Which reinforcement type subtracts something unpleasant after a response?",
 "If studying stops a parent's nagging, nagging removal may reinforce studying through",
 "Turning off a loud alarm by getting out of bed can be",
 "Relief from a headache after taking medicine can reinforce taking medicine through",
 "Subtracting an aversive condition to strengthen behavior is",
] as const;

const NEG_REINF_WRONGS: readonly W[] = [
 ["positive reinforcement", "positive punishment", "extinction"],
 ["negative punishment", "classical conditioning", "spontaneous recovery"],
 ["positive reinforcement", "shaping", "latent learning"],
 ["positive reinforcement", "punishment by removal", "sensory preconditioning"],
 ["positive reinforcement", "avoidance only", "escape only"],
];

const CLASSICAL_STEMS = [
 "In classical conditioning, the learned response to the conditioned stimulus is the",
 "Salivation to a bell after pairing with food illustrates the",
 "Which response is acquired through association with a US?",
 "Pavlov's dogs salivating to a tone reflects the",
 "The CR appears in response to the",
 "After conditioning, behavior triggered by the CS is the",
 "Which term names the learned reaction to a previously neutral stimulus?",
 "The conditioned salivation in Pavlov's experiment is the",
 "The acquired reflex-like response in classical conditioning is the",
 "Which abbreviation fits the learned response to the CS?",
] as const;

const CR_WRONGS: readonly W[] = [
 ["unconditioned response (UR)", "unconditioned stimulus (US)", "neutral stimulus"],
 ["spontaneous recovery", "generalization gradient", "extinction burst"],
 ["habituation", "sensory adaptation", "fight-or-flight"],
 ["discriminative stimulus", "conditioned stimulus before pairing", "backward conditioning"],
 ["higher-order conditioning only", "blocking effect only", "latent inhibition only"],
];

const STM_STEMS = [
 "The limited-capacity store that briefly holds about seven (give or take two) items is",
 "Working memory's phonological loop is part of",
 "Which memory stage holds information for seconds without rehearsal?",
 "Baddeley's model includes visuospatial sketchpad within",
 "The memory system tested by digit span tasks is primarily",
 "Before information enters long-term storage, it often sits in",
 "Which store is fragile and easily displaced by new input?",
 "The component of memory that manipulates information currently in use is",
 "Short-term memory is often equated with",
 "Which system has limited duration unless rehearsal occurs?",
] as const;

const STM_WRONGS: readonly W[] = [
 ["sensory memory", "long-term memory", "implicit memory only"],
 ["procedural memory only", "semantic memory only", "episodic buffer only"],
 ["iconic memory only", "echoic memory only", "state-dependent memory"],
 ["working memory only", "echoic store only", "haptic store only"],
 ["prospective memory only", "autobiographical memory only", "flashbulb memory only"],
];

const FAE_STEMS = [
 "Blaming a person's character rather than the situation for their behavior illustrates",
 "Assuming someone is rude because they snapped, ignoring a stressful context, reflects",
 "Which bias involves overestimating dispositional causes?",
 "The tendency to underestimate situational factors when judging others is the",
 "Attributing a coworker's lateness to laziness without knowing traffic reflects",
 "Ross's classic term for overusing personality explanations is the",
 "Observers often commit the ___ when explaining others' actions.",
 "Which error involves neglecting external constraints when judging behavior?",
 "Thinking 'they failed because they are lazy' may show",
 "Over-attributing behavior to traits is called the",
] as const;

const FAE_WRONGS: readonly W[] = [
 ["actor-observer bias", "self-serving bias", "just-world hypothesis"],
 ["false consensus", "ingroup bias", "out-group homogeneity"],
 ["stereotype threat", "social loafing", "diffusion of responsibility"],
 ["ultimate attribution error", "self-fulfilling prophecy", "illusory correlation"],
 ["groupthink", "social facilitation", "deindividuation"],
];

const RAND_ASSIGN_STEMS = [
 "Assigning participants to conditions using chance (e.g., coin flips) is",
 "Which procedure reduces systematic differences between groups at the start?",
 "Randomly placing volunteers into treatment and control groups is called",
 "To support causal claims, researchers often use ___ to distribute participants.",
 "Which technique helps ensure groups are comparable before the manipulation?",
 "Drawing names from a hat to form groups illustrates",
 "Using a random number table to allocate participants exemplifies",
 "The gold-standard allocation method in many experiments is",
 "Which step minimizes selection bias when forming comparison groups?",
 "If everyone has an equal chance of each condition, you have used",
] as const;

const RAND_WRONGS: readonly W[] = [
 ["stratified sampling only", "convenience sampling", "naturalistic observation"],
 ["matching only", "repeated measures only", "within-subjects only"],
 ["random selection from a phone book only", "quota sampling", "snowball sampling"],
 ["systematic sampling only", "cluster sampling only", "multistage sampling only"],
 ["volunteer bias only", "self-selection only", "attrition only"],
];

const CORR_STEMS = [
 "A correlation coefficient measures the strength and direction of",
 "If two variables tend to rise together, their association may be described by",
 "Which statistic summarizes linear association between two quantitative variables?",
 "A Pearson r near +1 indicates a strong positive",
 "When higher X pairs with higher Y on average, we observe a positive",
 "Which term describes co-variation that does not by itself prove causation?",
 "Scatterplots often accompany the numerical value of a",
 "The sign of r indicates direction; its magnitude reflects strength of",
 "Which concept is weaker than causation but useful for prediction?",
 "Two variables moving in opposite directions yield a negative",
] as const;

const CORR_WRONGS: readonly W[] = [
 ["causal mechanism", "experimental manipulation", "independent variable"],
 ["the slope of the regression line only", "the y-intercept only", "chi-square only"],
 ["standard deviation only", "variance only", "effect size only"],
 ["regression to the mean only", "restriction of range only", "heteroscedasticity only"],
 ["partial correlation only", "semipartial correlation only", "point-biserial only"],
];

const HIPPO_STEMS = [
 "Consolidation of explicit memories is strongly associated with the",
 "Spatial navigation deficits after bilateral damage implicate the",
 "Which medial temporal lobe structure is critical for forming new declarative memories?",
 "Patient H.M.-style anterograde amnesia is linked to",
 "The structure connecting emotion and memory formation includes the",
 "Which area is damaged in many classic amnesia cases studied in cognitive neuroscience?",
 "Transfer from short-term to long-term explicit memory involves",
 "The seahorse-shaped structure central to episodic memory is the",
 "Which brain region is often cited in context-dependent memory research?",
 "Bilateral removal severely disrupts new fact learning — pointing to the",
] as const;

const HIPPO_WRONGS: readonly W[] = [
 ["amygdala only", "cerebellum only", "medulla only"],
 ["occipital lobe only", "Broca's area only", "Wernicke's area only"],
 ["corpus callosum only", "thalamus only", "hypothalamus only"],
 ["prefrontal cortex only", "motor cortex only", "somatosensory cortex only"],
 ["basal ganglia only", "reticular formation only", "substantia nigra only"],
];

export const PSYCH_CONCEPT_BANK: MassConceptRow[] = [
 ...expand("psych-iv", IV_STEMS, "independent variable", IV_WRONGS, "The IV is what the experimenter manipulates."),
 ...expand("psych-dv", DV_STEMS, "dependent variable", DV_WRONGS, "The DV is what you measure as the outcome."),
 ...expand("psych-syn", SYN_STEMS, "synapse", SYN_WRONGS, "Neurotransmitters cross the synaptic cleft."),
 ...expand("psych-posr", POS_REINF_STEMS, "positive reinforcement", POS_REINF_WRONGS, "A pleasant stimulus is added to strengthen behavior."),
 ...expand("psych-negr", OPERANT_STEMS, "negative reinforcement", NEG_REINF_WRONGS, "An aversive stimulus is removed after a response."),
 ...expand("psych-hyp", HYPOTHESIS_STEMS, "hypothesis", HYP_WRONGS, "A hypothesis is a testable prediction."),
 ...expand("psych-cr", CLASSICAL_STEMS, "conditioned response (CR)", CR_WRONGS, "The CR is learned to the CS."),
 ...expand("psych-stm", STM_STEMS, "short-term memory", STM_WRONGS, "STM holds information briefly and has limited capacity."),
 ...expand("psych-fae", FAE_STEMS, "fundamental attribution error", FAE_WRONGS, "Observers over-attribute others' behavior to disposition."),
 ...expand("psych-rand", RAND_ASSIGN_STEMS, "random assignment", RAND_WRONGS, "Random assignment distributes participants to conditions by chance."),
 ...expand("psych-corr", CORR_STEMS, "correlation", CORR_WRONGS, "Correlation measures association, not necessarily causation."),
 ...expand("psych-hip", HIPPO_STEMS, "hippocampus", HIPPO_WRONGS, "The hippocampus supports explicit memory consolidation."),
];

export function pickPsychMassRow(rng: () => number): MassConceptRow {
 // Combinatorial templates ensure 10,000+ possible structures.
 const TEMPLATES: readonly MassConceptTemplate[] = [
  {
   idPrefix: "psych-iv",
   stems: IV_STEMS,
   correct: "independent variable",
   wrongPool: uniqStrings([...IV_WRONGS.flat(), "dependent variable", "confounding variable", "control variable", "extraneous variable", "random assignment"]),
   explanation: "The IV is what the experimenter manipulates.",
  },
  {
   idPrefix: "psych-dv",
   stems: DV_STEMS,
   correct: "dependent variable",
   wrongPool: uniqStrings([...DV_WRONGS.flat(), "independent variable", "confounding variable", "control variable", "measurement error", "construct validity"]),
   explanation: "The DV is what you measure as the outcome.",
  },
  {
   idPrefix: "psych-syn",
   stems: SYN_STEMS,
   correct: "synapse",
   wrongPool: uniqStrings([...SYN_WRONGS.flat(), "axon", "dendrite", "myelin sheath", "cerebellum"]),
   explanation: "Neurotransmitters cross the synaptic cleft.",
  },
  {
   idPrefix: "psych-posr",
   stems: POS_REINF_STEMS,
   correct: "positive reinforcement",
   wrongPool: uniqStrings([...POS_REINF_WRONGS.flat(), "negative reinforcement", "positive punishment", "negative punishment", "extinction"]),
   explanation: "A pleasant stimulus is added to strengthen behavior.",
  },
  {
   idPrefix: "psych-negr",
   stems: OPERANT_STEMS,
   correct: "negative reinforcement",
   wrongPool: uniqStrings([...NEG_REINF_WRONGS.flat(), "positive reinforcement", "positive punishment", "negative punishment", "extinction"]),
   explanation: "An aversive stimulus is removed after a response.",
  },
  {
   idPrefix: "psych-hyp",
   stems: HYPOTHESIS_STEMS,
   correct: "hypothesis",
   wrongPool: uniqStrings([...HYP_WRONGS.flat(), "theory", "opinion", "operational definition", "case study"]),
   explanation: "A hypothesis is a testable prediction.",
  },
  {
   idPrefix: "psych-cr",
   stems: CLASSICAL_STEMS,
   correct: "conditioned response (CR)",
   wrongPool: uniqStrings([...CR_WRONGS.flat(), "unconditioned response (UR)", "conditioned stimulus (CS)", "unconditioned stimulus (US)"]),
   explanation: "The CR is learned to the CS.",
  },
  {
   idPrefix: "psych-stm",
   stems: STM_STEMS,
   correct: "short-term memory",
   wrongPool: uniqStrings([...STM_WRONGS.flat(), "sensory memory", "long-term memory", "implicit memory", "working memory"]),
   explanation: "STM holds information briefly and has limited capacity.",
  },
  {
   idPrefix: "psych-fae",
   stems: FAE_STEMS,
   correct: "fundamental attribution error",
   wrongPool: uniqStrings([...FAE_WRONGS.flat(), "self-serving bias", "actor-observer bias", "just-world hypothesis", "ingroup bias"]),
   explanation: "Observers over-attribute others' behavior to disposition.",
  },
  {
   idPrefix: "psych-rand",
   stems: RAND_ASSIGN_STEMS,
   correct: "random assignment",
   wrongPool: uniqStrings([...RAND_WRONGS.flat(), "random sampling", "matching", "counterbalancing", "convenience sampling"]),
   explanation: "Random assignment distributes participants to conditions by chance.",
  },
  {
   idPrefix: "psych-corr",
   stems: CORR_STEMS,
   correct: "correlation",
   wrongPool: uniqStrings([...CORR_WRONGS.flat(), "causation", "random assignment", "experiment", "confound"]),
   explanation: "Correlation measures association, not necessarily causation.",
  },
  {
   idPrefix: "psych-hip",
   stems: HIPPO_STEMS,
   correct: "hippocampus",
   wrongPool: uniqStrings([...HIPPO_WRONGS.flat(), "amygdala", "cerebellum", "prefrontal cortex", "medulla"]),
   explanation: "The hippocampus supports explicit memory consolidation.",
  },
 ];
 return pickMassRowFromTemplates(rng, TEMPLATES);
}

/** Comparative Government — conceptual bank (institutions & core terms). */
const FED_STEMS = [
 "A system where sovereignty is constitutionally divided between national and regional governments is called",
 "The U.S. arrangement with national and state governments reflects",
 "Which term describes layered authority across a central government and states?",
 "Power shared between Washington and the states exemplifies",
 "The constitutional allocation of authority between levels is",
 "Dual sovereignty in the U.S. context is known as",
 "When states and the national government both make law in overlapping areas, we describe",
 "The division of power between Capitol and state capitols is",
 "Which concept contrasts with a purely unitary state?",
 "Layered government with enumerated and reserved powers reflects",
] as const;

const FED_WRONGS: readonly W[] = [
 ["unitary government only", "confederation without enforcement", "direct democracy"],
 ["totalitarianism", "oligarchy only", "anarchy"],
 ["mercantilism", "feudalism only", "colonial dependency"],
];

const SEP_STEMS = [
 "Dividing lawmaking, enforcement, and adjudication across branches exemplifies",
 "Montesquieu-influenced design with three branches illustrates",
 "Which principle separates legislative, executive, and judicial power?",
 "Congress makes law, the president enforces, courts interpret — this is",
 "The U.S. Constitution spreads power among branches using",
 "Avoiding concentration of power in one branch relies on",
 "Which doctrine organizes distinct governmental functions?",
 "The tripartite division of core governmental work is called",
 "Keeping prosecutors separate from judges reflects",
 "Vesting legislative, executive, and judicial power separately supports",
] as const;

const SEP_WRONGS: readonly W[] = [
 ["dual federalism only", "unified sovereignty", "judicial activism only"],
 ["checks and balances only", "unitary executive theory only", "executive privilege only"],
 ["bicameralism only", "stare decisis", "rule of law only"],
];

const A1_SPEECH_STEMS = [
 "The Bill of Rights protection for freedom of speech is primarily associated with the",
 "Prior restraint on publication is most directly analyzed under the",
 "Which amendment is the usual textual home for speech and assembly claims?",
 "Symbolic flag-burning cases often invoke protections rooted in the",
 "Content-based regulations of expression face strict scrutiny under frameworks tied to the",
 "Student speech in public schools is weighed partly under precedents interpreting the",
 "Which amendment anchors many free-expression controversies?",
 "Commercial speech receives intermediate scrutiny under precedents related to the",
 "Freedom of the press is commonly litigated under the same amendment as freedom of speech — the",
 "Internet-era speech disputes still often begin with the",
] as const;

const A1_WRONGS: readonly W[] = [
 ["Second Amendment", "Fourth Amendment", "Fourteenth Amendment"],
 ["Third Amendment", "Fifth Amendment", "Sixth Amendment"],
 ["Seventh Amendment", "Eighth Amendment", "Tenth Amendment"],
];

const MARSHALL_STEMS = [
 "The power of judicial review in the U.S. was most clearly articulated in",
 "Chief Justice Marshall's opinion establishing courts may strike unconstitutional laws is",
 "Which case is the landmark for judicial review?",
 "The 1803 decision often paired with Marshall and judicial power is",
 "If Congress passes an unconstitutional statute, the precedent allowing courts to refuse enforcement is",
 "The case where a midnight-appointment dispute became a separation-of-powers classic is",
 "Marshall's assertion that 'it is emphatically the province of the judicial department' appears in",
 "Which decision made judicial review an explicit part of U.S. constitutional practice?",
 "The power to say what the law is, articulated in Marshall's era, comes from",
 "Early Supreme Court authority to invalidate legislation traces to",
] as const;

const MARSHALL_WRONGS: readonly W[] = [
 ["Brown v. Board", "McCulloch v. Maryland", "United States v. Lopez"],
 ["Plessy v. Ferguson", "Gideon v. Wainwright", "Miranda v. Arizona"],
 ["Roe v. Wade", "Citizens United", "Bush v. Gore"],
];

const CHK_STEMS = [
 "The power of one branch to limit another (e.g., veto, override, impeachment) illustrates",
 "Presidential veto and congressional override are examples of",
 "Which concept complements separation of powers by enabling inter-branch restraint?",
 "Impeachment by Congress checking the executive reflects",
 "Senate confirmation of appointments is part of the system's",
 "Judicial invalidation of statutes interacts with legislative revision through",
 "The design where branches restrain one another is called",
 "Beyond dividing functions, the Constitution builds",
 "Which phrase names mutual limits among branches?",
 "Inter-branch oversight and restraint collectively describe",
] as const;

const CHK_WRONGS: readonly W[] = [
 ["dual federalism only", "separation of powers only", "judicial activism only"],
 ["federalism only", "popular sovereignty only", "limited government only"],
 ["enumerated powers only", "reserved powers only", "concurrent powers only"],
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const COMP_GOV_CONCEPT_BANK: MassConceptRow[] = [
 ...expand("gov-fed", FED_STEMS, "federalism", FED_WRONGS, "Federalism divides sovereignty across levels."),
 ...expand("gov-sep", SEP_STEMS, "separation of powers", SEP_WRONGS, "Different branches hold distinct core functions."),
 ...expand("gov-a1", A1_SPEECH_STEMS, "First Amendment", A1_WRONGS, "Speech protections are central to the First Amendment."),
 ...expand("gov-marv", MARSHALL_STEMS, "Marbury v. Madison", MARSHALL_WRONGS, "Marshall's opinion established judicial review."),
 ...expand("gov-chk", CHK_STEMS, "checks and balances", CHK_WRONGS, "Branches limit one another through checks and balances."),
];

export function pickCompGovMassRow(rng: () => number): MassConceptRow {
 const CGOV_METHODS_STEMS = [
  "Empirical data in political science refers to information that is",
  "Quantitative analysis is best defined as",
  "Qualitative analysis is best defined as",
  "A correlation describes",
  "Causation means that",
 ] as const;

 const CGOV_CONCEPTS_STEMS = [
  "A state is best defined as a political entity that has",
  "A regime refers to",
  "A government is best described as",
  "A nation is best described as",
  "A political system refers to",
 ] as const;

 const CGOV_DEMO_AUTO_STEMS = [
  "A defining feature of democracy is",
  "A defining feature of authoritarianism is",
  "Which regime type is characterized by rule by a single dominant party?",
  "A theocracy is best described as a system in which",
  "Democratization refers to the process of",
 ] as const;

 const CGOV_METRICS_STEMS = [
  "The Human Development Index (HDI) is a composite measure of",
  "The Gini index is used to measure",
  "Gross Domestic Product (GDP) is best described as",
  "Freedom House is known for assessing",
  "Transparency International is known for monitoring",
 ] as const;

 const CGOV_INSTITUTIONS_STEMS = [
  "In a parliamentary system, executive power is typically held by",
  "A presidential system is characterized by",
  "A semi-presidential system includes",
  "In a federal system, power is",
  "In a unitary system, power is",
 ] as const;

 const CGOV_LEGIT_STEMS = [
  "Political legitimacy is best defined as",
  "Traditional legitimacy is based on",
  "Charismatic legitimacy is based on",
  "Rational-legal legitimacy is based on",
  "A government may lose legitimacy when",
 ] as const;

 const CGOV_WRONG_POOL = [
  // Methods/analysis
  "gathered through observation, measurement, or evidence-based collection",
  "based on value judgments about what should be",
  "the use of statistical methods to analyze numerical data",
  "the use of interviews, case studies, and non-numerical evidence to interpret patterns",
  "a relationship between variables that does not, by itself, prove one causes the other",
  "one variable directly produces a change in another variable",
  // Institutions/definitions
  "defined territory, permanent population, a government, and capacity to interact with other states",
  "the rules, institutions, and practices that organize political life and power",
  "the individuals and institutions responsible for making and enforcing policy",
  "a shared identity based on culture, language, or history",
  "the set of institutions, laws, and procedures through which a society is governed",
  // Democracy vs authoritarian
  "free and fair elections and protection of civil liberties",
  "power concentrated in a single leader or small group with limited accountability",
  "a single-party state",
  "religious leaders or institutions hold ultimate authority",
  "a transition from authoritarian rule toward democratic institutions",
  // Metrics/organizations
  "life expectancy, education, and income indicators",
  "income inequality within a population",
  "the total value of goods and services produced within a country's borders",
  "democracy, political freedom, and human rights",
  "corporate and political corruption",
  "a ranking of vulnerability to conflict and state capacity failures",
  // Institutions: systems
  "a prime minister accountable to the legislature",
  "a directly elected executive separate from the legislature",
  "a president and a prime minister sharing executive authority",
  "divided between central and regional governments",
  "centralized in the national government with delegated local authority",
  // Legitimacy
  "public acceptance that a government has the right to rule",
  "longstanding customs and inherited authority",
  "the personal appeal and perceived qualities of a leader",
  "legal procedures such as constitutions and elections",
  "widespread corruption, rights violations, or election fraud",
  // Plausible distractors (extra variety)
  "perfect equality of income across society",
  "a system where the military is the only source of authority",
  "a government where courts are always controlled by the legislature",
  "a political entity without defined borders or sovereignty",
 ] as const;

 const TEMPLATES: readonly MassConceptTemplate[] = [
  { idPrefix: "cg-methods", stems: CGOV_METHODS_STEMS, correct: "gathered through observation, measurement, or evidence-based collection", wrongPool: CGOV_WRONG_POOL, explanation: "Empirical analysis relies on observation and evidence rather than purely value-based claims." },
  { idPrefix: "cg-corr", stems: CGOV_METHODS_STEMS, correct: "a relationship between variables that does not, by itself, prove one causes the other", wrongPool: CGOV_WRONG_POOL, explanation: "Correlation can be positive or negative, but it does not automatically establish causation." },
  { idPrefix: "cg-state", stems: CGOV_CONCEPTS_STEMS, correct: "defined territory, permanent population, a government, and capacity to interact with other states", wrongPool: CGOV_WRONG_POOL, explanation: "A state has territory, population, government, and sovereignty in international relations." },
  { idPrefix: "cg-regime", stems: CGOV_CONCEPTS_STEMS, correct: "the rules, institutions, and practices that organize political life and power", wrongPool: CGOV_WRONG_POOL, explanation: "Regimes describe the rules and norms that structure political authority and participation." },
  { idPrefix: "cg-demo", stems: CGOV_DEMO_AUTO_STEMS, correct: "free and fair elections and protection of civil liberties", wrongPool: CGOV_WRONG_POOL, explanation: "Democracies feature competitive elections and protection of rights under rule of law." },
  { idPrefix: "cg-auth", stems: CGOV_DEMO_AUTO_STEMS, correct: "power concentrated in a single leader or small group with limited accountability", wrongPool: CGOV_WRONG_POOL, explanation: "Authoritarian systems limit competition and accountability and concentrate decision-making." },
  { idPrefix: "cg-demz", stems: CGOV_DEMO_AUTO_STEMS, correct: "a transition from authoritarian rule toward democratic institutions", wrongPool: CGOV_WRONG_POOL, explanation: "Democratization involves building institutions like elections, rule of law, and civil liberties." },
  { idPrefix: "cg-hdi", stems: CGOV_METRICS_STEMS, correct: "life expectancy, education, and income indicators", wrongPool: CGOV_WRONG_POOL, explanation: "HDI combines health, education, and income to compare development levels." },
  { idPrefix: "cg-gini", stems: CGOV_METRICS_STEMS, correct: "income inequality within a population", wrongPool: CGOV_WRONG_POOL, explanation: "The Gini index summarizes how evenly income is distributed in a society." },
  { idPrefix: "cg-gdp", stems: CGOV_METRICS_STEMS, correct: "the total value of goods and services produced within a country's borders", wrongPool: CGOV_WRONG_POOL, explanation: "GDP measures economic output produced domestically within a time period." },
  { idPrefix: "cg-parl", stems: CGOV_INSTITUTIONS_STEMS, correct: "a prime minister accountable to the legislature", wrongPool: CGOV_WRONG_POOL, explanation: "In parliamentary systems, the executive depends on legislative confidence." },
  { idPrefix: "cg-pres", stems: CGOV_INSTITUTIONS_STEMS, correct: "a directly elected executive separate from the legislature", wrongPool: CGOV_WRONG_POOL, explanation: "Presidential systems separate executive and legislative mandates and powers." },
  { idPrefix: "cg-semi", stems: CGOV_INSTITUTIONS_STEMS, correct: "a president and a prime minister sharing executive authority", wrongPool: CGOV_WRONG_POOL, explanation: "Semi-presidential systems divide executive authority between president and prime minister." },
  { idPrefix: "cg-fed", stems: CGOV_INSTITUTIONS_STEMS, correct: "divided between central and regional governments", wrongPool: CGOV_WRONG_POOL, explanation: "Federalism divides authority across levels of government." },
  { idPrefix: "cg-unit", stems: CGOV_INSTITUTIONS_STEMS, correct: "centralized in the national government with delegated local authority", wrongPool: CGOV_WRONG_POOL, explanation: "Unitary systems centralize authority, delegating powers to subnational units as needed." },
  { idPrefix: "cg-legit", stems: CGOV_LEGIT_STEMS, correct: "public acceptance that a government has the right to rule", wrongPool: CGOV_WRONG_POOL, explanation: "Legitimacy depends on public acceptance and can be undermined by corruption or fraud." },
  { idPrefix: "cg-legit-types", stems: CGOV_LEGIT_STEMS, correct: "legal procedures such as constitutions and elections", wrongPool: CGOV_WRONG_POOL, explanation: "Rational-legal legitimacy comes from lawful rules and procedures rather than tradition or personality." },
 ];
 return pickMassRowFromTemplates(rng, TEMPLATES);
}

/**
 * AP U.S. Government & Politics — redesigned conceptual bank
 * (Unit 1–5 foundations, institutions, interactions, civil liberties, participation).
 */
const ENLIGHT_LOCKE_STEMS = [
 "John Locke argued that government exists primarily to protect",
 "Locke's theory of natural rights held that legitimate government must safeguard",
 "In Locke's Second Treatise, citizens may revolt when government violates",
 "Locke's social contract emphasizes that political authority is justified by",
 "Locke's natural rights philosophy is most directly associated with protection of",
] as const;

const ENLIGHT_LOCKE_WRONGS: readonly W[] = [
 ["divine right of kings", "hereditary aristocratic privilege", "absolute monarchy as default"],
 ["military rule as a permanent emergency", "one-party control of elections", "rule by decree without consent"],
 ["mercantilist trade regulation", "unitary executive control only", "judicial supremacy over elections"],
];

const ENLIGHT_HOBBES_STEMS = [
 "Thomas Hobbes argued that order is best secured when",
 "In Hobbes's Leviathan, individuals accept a social contract mainly to obtain",
 "Hobbes believed that without strong authority, life would be",
 "Hobbes's view of human nature implies that government should",
] as const;

const ENLIGHT_HOBBES_WRONGS: readonly W[] = [
 ["natural rights are inalienable and limit government", "citizens should overthrow government easily", "government should be minimal"],
 ["separation of powers is unnecessary because people are naturally cooperative", "factions never threaten stability", "direct democracy is always stable"],
 ["government should be optional and purely voluntary", "states should nullify national laws routinely", "courts should be elected yearly"],
];

const ENLIGHT_MONTESQUIEU_STEMS = [
 "Montesquieu's Spirit of the Laws is most associated with the idea of",
 "Montesquieu argued that liberty is protected when",
 "The U.S. model of three branches reflects Montesquieu's emphasis on",
 "Dividing governmental power into legislative, executive, and judicial functions illustrates",
] as const;

const ENLIGHT_MONTESQUIEU_WRONGS: readonly W[] = [
 ["divine right", "unitary government only", "popular sovereignty only"],
 ["a single assembly holds all power", "political power is inherited", "elections are unnecessary"],
 ["government controls all speech", "absolute monarchy protects rights best", "courts should be abolished"],
];

const DEMOCRACY_FORMS_STEMS = [
 "Broad participation by many citizens in politics across different statuses best describes",
 "Group-based activism by citizens with shared interests seeking the same goals best describes",
 "A model emphasizing power held mainly by educated or wealthy elites best describes",
 "Participatory, pluralist, and elite models are all attempts to describe",
] as const;

const DEMOCRACY_FORMS_WRONGS: readonly W[] = [
 ["elite democracy", "unitary government", "judicial review"],
 ["participatory democracy", "federalism", "separation of powers"],
 ["pluralist democracy", "popular sovereignty", "enumerated powers"],
];

const POP_SOV_STEMS = [
 "The principle that government power derives from the consent of the governed is called",
 "Elections as a source of governmental authority reflect the concept of",
 "Peaceful protest and voting as sources of legitimacy align most closely with",
 "The idea that the people give government its power is known as",
] as const;

const POP_SOV_WRONGS: readonly W[] = [
 ["judicial review", "divine right", "unitary executive theory"],
 ["fiscal federalism", "judicial restraint", "bureaucratic neutrality"],
 ["bicameralism", "senatorial courtesy", "conference committee"],
];

const DECL_IND_STEMS = [
 "The Declaration of Independence primarily served as",
 "Jefferson's Declaration is best described as",
 "A central purpose of the Declaration of Independence was to",
 "The Declaration's list of grievances was used to",
] as const;

const DECL_IND_WRONGS: readonly W[] = [
 ["a replacement for the Constitution", "a Supreme Court decision", "a treaty ending the Revolutionary War"],
 ["a bill of rights limiting state governments", "a set of Articles of Confederation amendments", "a federal budget proposal"],
 ["a statute passed by Congress under Article I", "a presidential executive order", "a judicial opinion establishing judicial review"],
];

const ARTICLES_WEAK_STEMS = [
 "A major weakness of the Articles of Confederation was that the national government",
 "Under the Articles of Confederation, Congress lacked the power to",
 "Shays' Rebellion highlighted that the Articles government could not effectively",
 "Revising the Articles was difficult because amendments required",
] as const;

const ARTICLES_WEAK_WRONGS: readonly W[] = [
 ["could veto state laws directly", "could impose national income taxes easily", "could command state legislatures"],
 ["regulate interstate trade or impose tariffs between states", "appoint federal judges for life", "create a standing executive cabinet"],
 ["enforce laws through an executive branch", "declare independence", "create a bicameral Congress"],
];

const CONVENTION_PLANS_STEMS = [
 "Madison's Virginia Plan proposed a legislature in which representation was based on",
 "The New Jersey Plan proposed",
 "The Great (Connecticut) Compromise created",
 "The Three-Fifths Compromise addressed representation by counting enslaved people as",
] as const;

const CONVENTION_PLANS_WRONGS: readonly W[] = [
 ["equal state representation in a single house", "representation by judicial district", "representation by wealth only"],
 ["a unicameral legislature with one vote per state", "a president chosen by popular vote only", "term limits for judges in the Constitution"],
 ["a unicameral legislature", "no national legislature", "a legislature chosen by the Supreme Court"],
];

const FED_ANTI_STEMS = [
 "Supporters of the Constitution who argued for a stronger national government were called",
 "Opponents of the Constitution who feared it would threaten liberties were called",
 "The Federalist Papers were written primarily to",
 "A major Anti-Federalist demand during ratification was",
] as const;

const FED_ANTI_WRONGS: readonly W[] = [
 ["Anti-Federalists", "Whigs", "Progressives"],
 ["Federalists", "Populists", "Muckrakers"],
 ["repeal the Articles of Confederation after ratification", "grant voting rights to women immediately", "abolish political parties in the Constitution"],
];

const FEDP_10_STEMS = [
 "Federalist No. 10 argued that a large republic would",
 "Madison's Federalist No. 10 focused on the problem of",
 "According to Federalist No. 10, the extended republic helps prevent",
] as const;

const FEDP_10_WRONGS: readonly W[] = [
 ["eliminate factions entirely by banning parties", "ensure only one faction can rule", "make state governments unnecessary"],
 ["judicial review of legislation", "line-item veto", "direct democracy in all policy areas"],
 ["a standing army from ever existing", "a single-party system", "unanimous consent for legislation"],
];

const FEDP_51_STEMS = [
 "Federalist No. 51 argued that liberty is protected when",
 "Madison's Federalist No. 51 is best known for explaining",
 "The phrase 'ambition must be made to counteract ambition' is associated with",
] as const;

const FEDP_51_WRONGS: readonly W[] = [
 ["one branch holds all power to act quickly", "states control all national appointments", "courts cannot review legislation"],
 ["popular referenda replace legislatures", "the president chooses members of Congress", "unicameralism guarantees fairness"],
 ["a unitary government", "direct primary elections", "bureaucratic rulemaking"],
];

const FEDP_70_STEMS = [
 "Federalist No. 70 argued most strongly for",
 "Hamilton's Federalist No. 70 defended",
 "A key claim in Federalist No. 70 is that the executive should be",
] as const;

const FEDP_70_WRONGS: readonly W[] = [
 ["a plural executive with many co-equal presidents", "a legislature-led executive committee", "no executive branch at all"],
 ["lifetime appointment of the president", "complete removal of veto power", "judicial election by popular vote"],
 ["a committee chosen by Congress", "chosen by state supreme courts", "selected by random lottery"],
];

const FEDP_78_STEMS = [
 "Federalist No. 78 argued that the judiciary would be the 'least dangerous' branch because it",
 "Hamilton's Federalist No. 78 defended the role of courts by emphasizing",
 "A key power associated with the judiciary under Federalist No. 78 is",
] as const;

const FEDP_78_WRONGS: readonly W[] = [
 ["controls the power of the purse", "commands the military", "writes all legislation"],
 ["directs foreign policy", "sets tax rates", "controls elections"],
 ["a legislative veto", "the line-item veto", "executive privilege"],
];

const ELASTIC_SUPREM_STEMS = [
 "Article I, Section 8's Necessary and Proper Clause is also known as",
 "The Supremacy Clause establishes that",
 "McCulloch v. Maryland reinforced the idea that",
 "United States v. Lopez held that Congress's power under the Commerce Clause",
] as const;

const ELASTIC_SUPREM_WRONGS: readonly W[] = [
 ["the establishment clause", "the equal protection clause", "the due process clause"],
 ["state laws always override federal laws", "states may nullify any federal statute", "federal judges are elected by states"],
 ["states may tax federal institutions freely", "Congress cannot create implied powers", "the Constitution bans a national bank"],
];

const GRANTS_STEMS = [
 "Federal aid with strict rules about how money must be used is called",
 "Federal aid that gives states broad discretion in how to spend it is called",
 "Politicians who favor states' rights often prefer",
 "Conditions attached to federal money are most directly associated with",
] as const;

const GRANTS_WRONGS: readonly W[] = [
 ["block grants", "judicial review", "executive agreements"],
 ["categorical grants", "pocket vetoes", "conference committees"],
 ["categorical grants", "unitary government", "bureaucratic neutrality"],
];

const CONGRESS_STRUCT_STEMS = [
 "The House of Representatives was designed primarily to represent",
 "The Senate was designed primarily to represent",
 "A census affects representation in the House through",
 "Drawing district boundaries to advantage a political party is known as",
] as const;

const CONGRESS_STRUCT_WRONGS: readonly W[] = [
 ["states equally", "the president's cabinet", "federal courts"],
 ["population proportionally", "foreign countries", "bureaucratic agencies"],
 ["impeachment trials", "executive orders", "judicial review"],
];

const LEGIS_PROCESS_STEMS = [
 "In the House, the committee that sets debate rules and time limits is the",
 "A Senate tactic used to delay a vote by extending debate is a",
 "The only formal way to end a filibuster is",
 "A conference committee is used to",
] as const;

const LEGIS_PROCESS_WRONGS: readonly W[] = [
 ["Ways and Means Committee", "Judiciary Committee", "Appropriations Committee"],
 ["cloture", "pocket veto", "judicial review"],
 ["a simple majority vote", "a presidential signing statement", "a discharge petition"],
];

const CIV_LIB_CIV_RIGHTS_STEMS = [
 "Civil liberties are best defined as",
 "Civil rights are best defined as",
 "Selective incorporation refers to the Supreme Court applying",
 "The decision that began applying parts of the Bill of Rights to states via the Fourteenth Amendment is most associated with",
] as const;

const CIV_LIB_CIV_RIGHTS_WRONGS: readonly W[] = [
 ["government services provided to citizens", "campaign finance rules", "bureaucratic regulations"],
 ["protections against government abuse (civil liberties)", "delegated powers", "reserved powers"],
 ["state powers under the Tenth Amendment", "the Electoral College rules", "committee chair assignments"],
];

const VOTING_MODELS_STEMS = [
 "Voting based on which candidate best serves one's self-interest is explained by",
 "Voting to reward or punish a party for past performance is called",
 "Voting based on expectations about a candidate's future performance is called",
 "Voting for one party's candidates across offices is called",
] as const;

const VOTING_MODELS_WRONGS: readonly W[] = [
 ["retrospective voting", "prospective voting", "party-line voting"],
 ["rational choice voting", "prospective voting", "split-ticket voting"],
 ["retrospective voting", "rational choice voting", "gerrymandering"],
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GOV_US_CONCEPT_BANK: MassConceptRow[] = [
 ...expand(
  "govus-locke",
  ENLIGHT_LOCKE_STEMS,
  "natural rights (life, liberty, property)",
  ENLIGHT_LOCKE_WRONGS,
  "Locke argued legitimate government protects natural rights; citizens may resist tyranny.",
 ),
 ...expand(
  "govus-hobbes",
  ENLIGHT_HOBBES_STEMS,
  "a strong central authority protects life and order",
  ENLIGHT_HOBBES_WRONGS,
  "Hobbes emphasized security and order through strong authority under a social contract.",
 ),
 ...expand(
  "govus-mont",
  ENLIGHT_MONTESQUIEU_STEMS,
  "separation of powers",
  ENLIGHT_MONTESQUIEU_WRONGS,
  "Montesquieu argued separating power among branches prevents tyranny.",
 ),
 ...expand(
  "govus-dem",
  DEMOCRACY_FORMS_STEMS,
  "representative democracy models (participatory, pluralist, elite)",
  DEMOCRACY_FORMS_WRONGS,
  "These models describe who participates and how influence is distributed in representative democracy.",
 ),
 ...expand(
  "govus-pop",
  POP_SOV_STEMS,
  "popular sovereignty",
  POP_SOV_WRONGS,
  "Popular sovereignty means government authority comes from the consent of the governed.",
 ),
 ...expand(
  "govus-decl",
  DECL_IND_STEMS,
  "a declaration of independence listing grievances and justification",
  DECL_IND_WRONGS,
  "The Declaration justified independence by listing grievances and stating principles of legitimacy.",
 ),
 ...expand(
  "govus-art",
  ARTICLES_WEAK_STEMS,
  "could not levy taxes or enforce laws effectively",
  ARTICLES_WEAK_WRONGS,
  "The Articles created a weak national government lacking taxation, enforcement, and commerce authority.",
 ),
 ...expand(
  "govus-plan",
  CONVENTION_PLANS_STEMS,
  "the Great Compromise (House by population, Senate equal by state)",
  CONVENTION_PLANS_WRONGS,
  "The Great Compromise created bicameralism balancing large- and small-state interests.",
 ),
 ...expand(
  "govus-rat",
  FED_ANTI_STEMS,
  "Federalists",
  FED_ANTI_WRONGS,
  "Federalists supported ratification; Anti-Federalists pushed for protections like a Bill of Rights.",
 ),
 ...expand(
  "govus-f10",
  FEDP_10_STEMS,
  "limit faction dominance by extending the republic",
  FEDP_10_WRONGS,
  "Madison argued a large republic makes it harder for any one faction to dominate.",
 ),
 ...expand(
  "govus-f51",
  FEDP_51_STEMS,
  "checks and balances",
  FEDP_51_WRONGS,
  "Federalist No. 51 explains using separated powers and checks to prevent concentration of authority.",
 ),
 ...expand(
  "govus-f70",
  FEDP_70_STEMS,
  "a single, energetic executive",
  FEDP_70_WRONGS,
  "Hamilton argued a single executive improves accountability and energy in administration.",
 ),
 ...expand(
  "govus-f78",
  FEDP_78_STEMS,
  "judicial review",
  FEDP_78_WRONGS,
  "Hamilton defended judicial review and argued courts lack purse and sword compared with other branches.",
 ),
 ...expand(
  "govus-elas",
  ELASTIC_SUPREM_STEMS,
  "the necessary and proper (elastic) clause",
  ELASTIC_SUPREM_WRONGS,
  "The Necessary and Proper Clause enables implied powers to carry out enumerated powers.",
 ),
 ...expand(
  "govus-grant",
  GRANTS_STEMS,
  "categorical grants",
  GRANTS_WRONGS,
  "Categorical grants come with strict conditions; block grants provide broader discretion.",
 ),
 ...expand(
  "govus-cong",
  CONGRESS_STRUCT_STEMS,
  "the people (population-based representation)",
  CONGRESS_STRUCT_WRONGS,
  "The House is apportioned by population; redistricting and gerrymandering shape elections.",
 ),
 ...expand(
  "govus-leg",
  LEGIS_PROCESS_STEMS,
  "filibuster",
  LEGIS_PROCESS_WRONGS,
  "The Senate filibuster delays action; cloture (60 votes) ends extended debate.",
 ),
 ...expand(
  "govus-lib",
  CIV_LIB_CIV_RIGHTS_STEMS,
  "protections from government abuse of power",
  CIV_LIB_CIV_RIGHTS_WRONGS,
  "Civil liberties limit government; civil rights protect against discrimination; incorporation applies rights to states.",
 ),
 ...expand(
  "govus-vote",
  VOTING_MODELS_STEMS,
  "rational choice voting",
  VOTING_MODELS_WRONGS,
  "Rational choice voting emphasizes self-interest; other models include retrospective, prospective, and party-line voting.",
 ),
];

export function pickGovUsMassRow(rng: () => number): MassConceptRow {
 const TEMPLATES: readonly MassConceptTemplate[] = [
  {
   idPrefix: "govus-locke",
   stems: ENLIGHT_LOCKE_STEMS,
   correct: "natural rights (life, liberty, property)",
   wrongPool: uniqStrings([
    ...ENLIGHT_LOCKE_WRONGS.flat(),
    "divine right",
    "rule by hereditary nobles",
    "absolute monarchy",
    "popular sovereignty (as a separate concept)",
    "the Articles of Confederation",
    "judicial review",
    "separation of powers",
   ]),
   explanation: "Locke argued legitimate government protects natural rights; citizens may resist tyranny.",
  },
  {
   idPrefix: "govus-hobbes",
   stems: ENLIGHT_HOBBES_STEMS,
   correct: "a strong central authority protects life and order",
   wrongPool: uniqStrings([
    ...ENLIGHT_HOBBES_WRONGS.flat(),
    "natural rights require minimal government",
    "direct democracy is always stable",
    "government should be abolished",
    "rule by aristocracy is best",
    "checks and balances are unnecessary",
    "rule of law is irrelevant",
   ]),
   explanation: "Hobbes emphasized security and order through strong authority under a social contract.",
  },
  {
   idPrefix: "govus-mont",
   stems: ENLIGHT_MONTESQUIEU_STEMS,
   correct: "separation of powers",
   wrongPool: uniqStrings([
    ...ENLIGHT_MONTESQUIEU_WRONGS.flat(),
    "popular sovereignty",
    "federalism",
    "unitary government",
    "pluralism",
    "elite democracy",
    "theocracy",
    "judicial review",
   ]),
   explanation: "Montesquieu argued separating power among branches prevents tyranny.",
  },
  {
   idPrefix: "govus-dem",
   stems: DEMOCRACY_FORMS_STEMS,
   correct: "representative democracy models (participatory, pluralist, elite)",
   wrongPool: uniqStrings([
    ...DEMOCRACY_FORMS_WRONGS.flat(),
    "rule by a single monarch",
    "unitary government",
    "authoritarianism",
    "totalitarianism",
    "direct democracy in all decisions",
    "judicial review",
    "federalism",
   ]),
   explanation: "These models describe who participates and how influence is distributed in representative democracy.",
  },
  {
   idPrefix: "govus-pop",
   stems: POP_SOV_STEMS,
   correct: "popular sovereignty",
   wrongPool: uniqStrings([
    ...POP_SOV_WRONGS.flat(),
    "divine right",
    "rule by aristocracy",
    "judicial review",
    "enumerated powers",
    "reserved powers",
    "checks and balances",
    "separation of powers",
   ]),
   explanation: "Popular sovereignty means government authority comes from the consent of the governed.",
  },
  {
   idPrefix: "govus-decl",
   stems: DECL_IND_STEMS,
   correct: "a declaration of independence listing grievances and justification",
   wrongPool: uniqStrings([
    ...DECL_IND_WRONGS.flat(),
    "the Articles of Confederation",
    "the Constitution",
    "the Bill of Rights",
    "the Treaty of Paris (1783)",
    "a Supreme Court ruling",
    "a congressional statute",
   ]),
   explanation: "The Declaration justified independence by listing grievances and stating principles of legitimacy.",
  },
  {
   idPrefix: "govus-art",
   stems: ARTICLES_WEAK_STEMS,
   correct: "could not levy taxes or enforce laws effectively",
   wrongPool: uniqStrings([
    ...ARTICLES_WEAK_WRONGS.flat(),
    "could regulate interstate commerce",
    "could draft soldiers and maintain a standing army",
    "could create an executive branch",
    "could create a national judiciary",
    "required only a simple majority to amend",
    "could coin and control national currency effectively",
   ]),
   explanation: "The Articles created a weak national government lacking taxation, enforcement, and commerce authority.",
  },
  {
   idPrefix: "govus-plan",
   stems: CONVENTION_PLANS_STEMS,
   correct: "the Great Compromise (House by population, Senate equal by state)",
   wrongPool: uniqStrings([
    ...CONVENTION_PLANS_WRONGS.flat(),
    "the Virginia Plan",
    "the New Jersey Plan",
    "the Three-Fifths Compromise",
    "the Electoral College",
    "the Bill of Rights",
    "the Supremacy Clause",
   ]),
   explanation: "The Great Compromise created bicameralism balancing large- and small-state interests.",
  },
  {
   idPrefix: "govus-rat",
   stems: FED_ANTI_STEMS,
   correct: "Federalists",
   wrongPool: uniqStrings([
    ...FED_ANTI_WRONGS.flat(),
    "Anti-Federalists",
    "Whigs",
    "Progressives",
    "Populists",
    "Federalist Papers",
    "Bill of Rights",
    "Articles of Confederation",
   ]),
   explanation: "Federalists supported ratification; Anti-Federalists pushed for protections like a Bill of Rights.",
  },
  {
   idPrefix: "govus-f10",
   stems: FEDP_10_STEMS,
   correct: "limit faction dominance by extending the republic",
   wrongPool: uniqStrings([
    ...FEDP_10_WRONGS.flat(),
    "abolish factions by banning parties",
    "create a unitary government",
    "require unanimous consent for laws",
    "eliminate minority rights",
    "make states irrelevant",
    "use direct democracy only",
   ]),
   explanation: "Madison argued a large republic makes it harder for any one faction to dominate.",
  },
  {
   idPrefix: "govus-f51",
   stems: FEDP_51_STEMS,
   correct: "checks and balances",
   wrongPool: uniqStrings([
    ...FEDP_51_WRONGS.flat(),
    "popular sovereignty",
    "federalism",
    "judicial review",
    "unicameralism",
    "direct democracy",
    "unitary executive theory",
   ]),
   explanation: "Federalist No. 51 explains using separated powers and checks to prevent concentration of authority.",
  },
  {
   idPrefix: "govus-f70",
   stems: FEDP_70_STEMS,
   correct: "a single, energetic executive",
   wrongPool: uniqStrings([
    ...FEDP_70_WRONGS.flat(),
    "a plural executive",
    "a judiciary-led executive",
    "no veto power",
    "lifetime term for president",
    "executive chosen by Supreme Court",
    "executive chosen by random lottery",
   ]),
   explanation: "Hamilton argued a single executive improves accountability and energy in administration.",
  },
  {
   idPrefix: "govus-f78",
   stems: FEDP_78_STEMS,
   correct: "judicial review",
   wrongPool: uniqStrings([
    ...FEDP_78_WRONGS.flat(),
    "power of the purse",
    "commander-in-chief authority",
    "treaty-making power",
    "executive orders",
    "legislative veto",
    "line-item veto",
   ]),
   explanation: "Hamilton defended judicial review and argued courts lack purse and sword compared with other branches.",
  },
  {
   idPrefix: "govus-elas",
   stems: ELASTIC_SUPREM_STEMS,
   correct: "the necessary and proper (elastic) clause",
   wrongPool: uniqStrings([
    ...ELASTIC_SUPREM_WRONGS.flat(),
    "the Supremacy Clause",
    "the Commerce Clause",
    "the Establishment Clause",
    "the Equal Protection Clause",
    "the Due Process Clause",
    "the Tenth Amendment",
   ]),
   explanation: "The Necessary and Proper Clause enables implied powers to carry out enumerated powers.",
  },
  {
   idPrefix: "govus-grant",
   stems: GRANTS_STEMS,
   correct: "categorical grants",
   wrongPool: uniqStrings([
    ...GRANTS_WRONGS.flat(),
    "block grants",
    "unfunded mandates",
    "preemption",
    "devolution",
    "fiscal federalism",
    "enumerated powers",
   ]),
   explanation: "Categorical grants come with strict conditions; block grants provide broader discretion.",
  },
  {
   idPrefix: "govus-cong",
   stems: CONGRESS_STRUCT_STEMS,
   correct: "the people (population-based representation)",
   wrongPool: uniqStrings([
    ...CONGRESS_STRUCT_WRONGS.flat(),
    "states equally",
    "interest groups",
    "the president",
    "the Supreme Court",
    "bureaucratic agencies",
    "foreign governments",
    "political parties only",
   ]),
   explanation: "The House is apportioned by population; redistricting and gerrymandering shape elections.",
  },
  {
   idPrefix: "govus-leg",
   stems: LEGIS_PROCESS_STEMS,
   correct: "filibuster",
   wrongPool: uniqStrings([
    ...LEGIS_PROCESS_WRONGS.flat(),
    "cloture",
    "pocket veto",
    "rider",
    "earmark",
    "discharge petition",
    "markup session",
    "conference committee",
    "Rules Committee",
   ]),
   explanation: "The Senate filibuster delays action; cloture (60 votes) ends extended debate.",
  },
  {
   idPrefix: "govus-lib",
   stems: CIV_LIB_CIV_RIGHTS_STEMS,
   correct: "protections from government abuse of power",
   wrongPool: uniqStrings([
    ...CIV_LIB_CIV_RIGHTS_WRONGS.flat(),
    "protections from discrimination by private actors only",
    "delegated powers",
    "reserved powers",
    "campaign finance rules",
    "bureaucratic regulations",
    "federal grants",
    "committee assignments",
   ]),
   explanation: "Civil liberties limit government; civil rights protect against discrimination; incorporation applies rights to states.",
  },
  {
   idPrefix: "govus-vote",
   stems: VOTING_MODELS_STEMS,
   correct: "rational choice voting",
   wrongPool: uniqStrings([
    ...VOTING_MODELS_WRONGS.flat(),
    "retrospective voting",
    "prospective voting",
    "party-line voting",
    "split-ticket voting",
    "incumbent advantage",
    "gerrymandering",
   ]),
   explanation: "Rational choice voting emphasizes self-interest; other models include retrospective, prospective, and party-line voting.",
  },
 ];
 return pickMassRowFromTemplates(rng, TEMPLATES);
}

/** English / rhetoric — fallacies and appeals (Lang & Lit). */
const ADHOM_STEMS = [
 "Attacking the person rather than the argument is known as",
 "Criticizing the speaker's character instead of their reasons commits",
 "Which fallacy targets the arguer instead of the claim?",
 "Saying 'you cannot trust her view because she is young' is often",
 "Poisoning the well against a messenger rather than evaluating evidence is",
 "An insult directed at the opponent instead of rebutting premises is",
 "Which Latin-named fallacy is a personal attack?",
 "Dismissing an idea because of who said it may be",
 "Replacing logic with character assassination uses",
 "If the debate shifts to someone's appearance, you may be seeing",
] as const;

const ADHOM_WRONGS: readonly W[] = [
 ["straw man", "false dilemma", "appeal to authority"],
 ["red herring", "slippery slope", "tu quoque"],
 ["begging the question", "hasty generalization", "false analogy"],
];

const ETHOS_STEMS = [
 "An appeal to credibility and character is primarily",
 "Trustworthiness of the speaker is central to",
 "Which rhetorical proof relies on the speaker's reputation?",
 "Establishing expertise and good will relates to",
 "If a doctor cites credentials to reassure listeners, that leans on",
 "Which Aristotelian appeal is about the speaker's character?",
 "Building ethos means strengthening",
 "Audience belief in the speaker's virtue supports",
 "Endorsements from respected figures can boost",
 "Professional tone and demonstrated competence support",
] as const;

const ETHOS_WRONGS: readonly W[] = [
 ["logos", "pathos", "kairos"],
 ["mythos", "chiasmus", "anaphora"],
 ["diction only", "syntax only", "meter only"],
];

const STRAW_STEMS = [
 "Misrepresenting an opponent's claim to make it easier to attack is",
 "Refuting a weaker version of an argument than your opponent actually made is the",
 "Which fallacy involves distorting someone's position before criticizing it?",
 "If you exaggerate a proposal to absurdity and then attack the exaggeration, you may commit",
 "Attacking a caricature rather than the real argument is",
 "Which logical error builds a flimsy version of a view and knocks it down?",
 "Replacing a nuanced claim with an extreme one to criticize it is often",
 "The tactic of exaggerating an opponent's view to discredit it is called",
 "When debate slides to a distorted summary of the rival position, watch for",
 "Knocking down a position your opponent does not hold is",
] as const;

const STRAW_WRONGS: readonly W[] = [
 ["ad hominem", "false dilemma", "appeal to authority"],
 ["red herring", "tu quoque", "begging the question"],
 ["hasty generalization", "false analogy", "slippery slope"],
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ENG_CONCEPT_BANK: MassConceptRow[] = [
 ...expand("eng-adh", ADHOM_STEMS, "ad hominem", ADHOM_WRONGS, "Ad hominem attacks the person."),
 ...expand("eng-eth", ETHOS_STEMS, "ethos", ETHOS_WRONGS, "Ethos is credibility appeal."),
 ...expand("eng-straw", STRAW_STEMS, "straw man", STRAW_WRONGS, "A straw man misrepresents the opposing argument."),
];

export function pickEngMassRow(rng: () => number): MassConceptRow {
 const TEMPLATES: readonly MassConceptTemplate[] = [
  {
   idPrefix: "eng-adh",
   stems: ADHOM_STEMS,
   correct: "ad hominem",
   wrongPool: uniqStrings([...ADHOM_WRONGS.flat(), "straw man", "false dilemma", "appeal to authority", "red herring", "slippery slope", "hasty generalization"]),
   explanation: "Ad hominem attacks the person.",
  },
  {
   idPrefix: "eng-eth",
   stems: ETHOS_STEMS,
   correct: "ethos",
   wrongPool: uniqStrings([...ETHOS_WRONGS.flat(), "logos", "pathos", "kairos", "diction", "syntax", "tone"]),
   explanation: "Ethos is credibility appeal.",
  },
  {
   idPrefix: "eng-straw",
   stems: STRAW_STEMS,
   correct: "straw man",
   wrongPool: uniqStrings([...STRAW_WRONGS.flat(), "ad hominem", "red herring", "false dilemma", "appeal to authority", "slippery slope", "begging the question"]),
   explanation: "A straw man misrepresents the opposing argument.",
  },
 ];
 return pickMassRowFromTemplates(rng, TEMPLATES);
}

/** Economics — additional stems around opportunity cost & deflator. */
const OC_STEMS = [
 "The value of the next-best alternative forgone when choosing an option is the",
 "What you give up to take a job in City A instead of City B is an",
 "Choosing college over immediate work sacrifices wages — that sacrificed value is",
 "Economists emphasize ___ when comparing mutually exclusive choices.",
 "If you spend an hour studying, the best thing you could have done instead measures",
 "The hidden cost of a decision includes the",
 "Which concept captures foregone benefits of the runner-up choice?",
 "When budgets are tight, the relevant measure of a choice's cost includes",
 "Trade-offs are summarized by the",
 "The forgone benefit from not choosing the next-best use of resources is the",
] as const;

const OC_WRONGS_FIXED: readonly W[] = [
 ["marginal cost only", "sunk cost", "accounting profit"],
 ["consumer surplus", "producer surplus", "deadweight loss"],
 ["absolute advantage", "comparative advantage in the wrong direction", "price ceiling"],
];

const GDP_DEF_STEMS = [
 "The GDP deflator is calculated as",
 "To move from nominal to real output using overall prices, economists use",
 "Nominal GDP divided by real GDP, times 100, defines the",
 "Which price index is built from the basket of all domestically produced goods?",
 "The broadest domestic price level measure for GDP comparison is the",
 "Real GDP equals nominal GDP divided by the",
 "To correct nominal GDP for economy-wide price changes, divide by the",
 "The ratio that converts current-dollar GDP to constant dollars involves the",
 "Unlike the CPI, the GDP deflator reflects prices of",
 "Which measure is Paasche/Fisher-related in spirit for entire output?",
] as const;

const GDP_DEF_WRONGS: readonly W[] = [
 ["Real GDP / Nominal GDP x 100", "CPI / GDP", "Exports - Imports"],
 ["Nominal GDP x Real GDP", "GDP / population", "M2 / GDP"],
 ["CPI only", "PPI only", "exchange rate"],
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ECON_CONCEPT_BANK: MassConceptRow[] = [
 ...expand("econ-oc", OC_STEMS, "opportunity cost", OC_WRONGS_FIXED, "Opportunity cost is the next-best alternative forgone."),
 ...expand("econ-def", GDP_DEF_STEMS, "Nominal GDP / Real GDP x 100", GDP_DEF_WRONGS, "Deflator compares nominal to real output."),
];

export function pickEconMassRow(rng: () => number): MassConceptRow {
 const TEMPLATES: readonly MassConceptTemplate[] = [
  {
   idPrefix: "econ-oc",
   stems: OC_STEMS,
   correct: "opportunity cost",
   wrongPool: uniqStrings([...OC_WRONGS_FIXED.flat(), "trade-off", "marginal cost", "sunk cost", "consumer surplus", "comparative advantage"]),
   explanation: "Opportunity cost is the next-best alternative forgone.",
  },
  {
   idPrefix: "econ-def",
   stems: GDP_DEF_STEMS,
   correct: "Nominal GDP / Real GDP x 100",
   wrongPool: uniqStrings([...GDP_DEF_WRONGS.flat(), "Real GDP / Nominal GDP x 100", "CPI", "PPI", "Exports - Imports", "GDP per capita"]),
   explanation: "Deflator compares nominal to real output.",
  },
 ];
 return pickMassRowFromTemplates(rng, TEMPLATES);
}

/** Computer Science — conceptual bank (AP CSA / CSP fundamentals). */
const CS_BIG_O_STEMS = [
 "In the average and worst case, an optimal comparison-based sorting algorithm runs in",
 "The best asymptotic bound for comparison-based sorting in the worst case is",
 "For sorting n distinct items using comparisons, the lower bound is",
 "Which time complexity is typical of mergesort and heapsort in the worst case?",
 "Comparison sorting cannot do better than which asymptotic growth (worst case)?",
] as const;

const CS_BIG_O_WRONGS: readonly W[] = [
 ["O(n)", "O(n^2) for every algorithm", "O(1)"],
 ["O(log n)", "O(n^2)", "O(2^n)"],
 ["O(n^2) always", "O(1)", "O(n!)"],
];

const CS_BOOL_STEMS = [
 "In Boolean logic, an expression is true for AND when",
 "The expression true AND false evaluates to",
 "The expression true OR false evaluates to",
 "NOT false evaluates to",
 "In AP CSP-style logic, OR is true when",
] as const;

const CS_BOOL_WRONGS: readonly W[] = [
 ["at least one operand is true", "both operands are false", "operators are ignored"],
 ["true", "INVALID", "neither true nor false"],
 ["false", "INVALID", "neither true nor false"],
];

const CS_INDEX_STEMS = [
 "If list indexes begin at 1 and aList has length 3, the expression aList[1] refers to the",
 "In 1-based indexing, aList[n] selects the",
 "If aList ← [5, 10, 15] and n ← 2 using 1-based indexing, DISPLAY(aList[n]) shows",
 "When indexes start at 1, the last element of a list of length L is at index",
 "AP CSP pseudocode often uses 1-based lists; for a list of length 4, index 4 refers to the",
] as const;

const CS_INDEX_WRONGS: readonly W[] = [
 ["second element", "third element", "no element (INVALID)"],
 ["first element", "last element", "an element chosen at random"],
 ["0", "1", "INVALID"],
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CS_CONCEPT_BANK: MassConceptRow[] = [
 ...expand("cs-big-o", CS_BIG_O_STEMS, "O(n log n)", CS_BIG_O_WRONGS, "Optimal comparison sorts are Θ(n log n) worst case."),
 ...expand("cs-bool", CS_BOOL_STEMS, "both operands are true", CS_BOOL_WRONGS, "AND is true only when both operands are true."),
 ...expand("cs-idx", CS_INDEX_STEMS, "second element", CS_INDEX_WRONGS, "With 1-based indexing, index 2 selects the second item."),
];

export function pickCsMassRow(rng: () => number): MassConceptRow {
 const TEMPLATES: readonly MassConceptTemplate[] = [
  {
   idPrefix: "cs-big-o",
   stems: CS_BIG_O_STEMS,
   correct: "O(n log n)",
   wrongPool: uniqStrings([...CS_BIG_O_WRONGS.flat(), "O(n)", "O(n^2)", "O(log n)", "O(1)", "O(2^n)", "O(n!)"]),
   explanation: "Optimal comparison sorts are Θ(n log n) worst case.",
  },
  {
   idPrefix: "cs-bool",
   stems: CS_BOOL_STEMS,
   correct: "both operands are true",
   wrongPool: uniqStrings([...CS_BOOL_WRONGS.flat(), "at least one operand is true", "both operands are false", "INVALID", "neither true nor false"]),
   explanation: "AND is true only when both operands are true.",
  },
  {
   idPrefix: "cs-idx",
   stems: CS_INDEX_STEMS,
   correct: "second element",
   wrongPool: uniqStrings([...CS_INDEX_WRONGS.flat(), "first element", "third element", "last element", "no element (INVALID)", "random element"]),
   explanation: "With 1-based indexing, index 2 selects the second item.",
  },
 ];
 return pickMassRowFromTemplates(rng, TEMPLATES);
}

/** Physics — conceptual bank (AP Physics 1/2/C core ideas). */
const PHYS_NEWTON2_STEMS = [
 "Newton's second law is best expressed as",
 "If the net force on an object increases while mass is constant, the object's acceleration",
 "For constant mass, acceleration is proportional to",
 "An object of mass m experiences net force F; its acceleration magnitude is",
 "Which relationship matches Newton's second law?",
] as const;

const PHYS_NEWTON2_WRONGS: readonly W[] = [
 ["F = m + a", "F = a/m", "F is independent of mass"],
 ["decreases", "stays zero", "depends only on velocity"],
 ["velocity", "position", "time squared only"],
];

const PHYS_COULOMB_STEMS = [
 "Coulomb's law implies the electric force magnitude between two point charges varies with separation r as",
 "If the distance between two point charges doubles, the electric force magnitude becomes",
 "The electrostatic force between two point charges is inversely proportional to",
 "In Coulomb's law, the dependence on distance r is",
 "Which expression captures the distance dependence of Coulomb force magnitude?",
] as const;

const PHYS_COULOMB_WRONGS: readonly W[] = [
 ["1/r", "r^2", "r"],
 ["twice as large", "four times as large", "unchanged"],
 ["the cube of distance", "the distance", "the charges only"],
];

const PHYS_ENERGY_STEMS = [
 "Kinetic energy is proportional to",
 "Doubling an object's speed (mass constant) changes its kinetic energy by a factor of",
 "The SI unit of energy is the",
 "The expression for translational kinetic energy is",
 "If mass doubles and speed stays the same, kinetic energy",
] as const;

const PHYS_ENERGY_WRONGS: readonly W[] = [
 ["speed", "mass only", "time"],
 ["2", "1/2", "1/4"],
 ["watt", "newton", "pascal"],
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PHYS_CONCEPT_BANK: MassConceptRow[] = [
 ...expand("phys-n2", PHYS_NEWTON2_STEMS, "F = ma", PHYS_NEWTON2_WRONGS, "Newton's second law relates net force, mass, and acceleration."),
 ...expand("phys-coul", PHYS_COULOMB_STEMS, "1/r^2", PHYS_COULOMB_WRONGS, "Coulomb force magnitude scales as 1/r²."),
 ...expand("phys-ke", PHYS_ENERGY_STEMS, "1/2 mv^2", PHYS_ENERGY_WRONGS, "Kinetic energy is K = 1/2 mv² and depends on v²."),
];

export function pickPhysMassRow(rng: () => number): MassConceptRow {
 const TEMPLATES: readonly MassConceptTemplate[] = [
  {
   idPrefix: "phys-n2",
   stems: PHYS_NEWTON2_STEMS,
   correct: "F = ma",
   wrongPool: uniqStrings([...PHYS_NEWTON2_WRONGS.flat(), "F = mv", "F = m/a", "F = a/m", "F = mg always", "F = p/t"]),
   explanation: "Newton's second law relates net force, mass, and acceleration.",
  },
  {
   idPrefix: "phys-coul",
   stems: PHYS_COULOMB_STEMS,
   correct: "1/r^2",
   wrongPool: uniqStrings([...PHYS_COULOMB_WRONGS.flat(), "1/r", "r", "r^2", "independent of r", "1/r^3"]),
   explanation: "Coulomb force magnitude scales as 1/r².",
  },
  {
   idPrefix: "phys-ke",
   stems: PHYS_ENERGY_STEMS,
   correct: "1/2 mv^2",
   wrongPool: uniqStrings([...PHYS_ENERGY_WRONGS.flat(), "mv", "mgh", "F = ma", "impulse", "work = Fd"]),
   explanation: "Kinetic energy is K = 1/2 mv² and depends on v².",
  },
 ];
 return pickMassRowFromTemplates(rng, TEMPLATES);
}

/** Chemistry — conceptual bank (AP Chem essentials). */
const CHEM_PH_STEMS = [
 "On the pH scale at 25°C, a neutral aqueous solution has pH closest to",
 "A solution with pH 3 is best described as",
 "Compared with pH 7, a solution with pH 9 is",
 "A smaller pH value indicates a",
 "Which pH range is typically strongly basic?",
] as const;

const CHEM_PH_WRONGS: readonly W[] = [
 ["0", "14", "1"],
 ["neutral", "basic", "buffered"],
 ["more acidic", "equally acidic", "unable to be compared"],
];

const CHEM_MOLARITY_STEMS = [
 "Molarity is defined as",
 "A 1.0 M solution contains 1 mol solute per",
 "If moles of solute stays constant while volume increases, molarity",
 "The units of molarity are",
 "M = n/V; if V doubles with n constant, M becomes",
] as const;

const CHEM_MOLARITY_WRONGS: readonly W[] = [
 ["moles divided by grams", "grams divided by liters", "liters divided by moles"],
 ["milliliter of solution", "gram of solution", "mole of solvent"],
 ["increases", "stays the same", "depends only on temperature"],
];

const CHEM_BOND_STEMS = [
 "A covalent bond forms when atoms",
 "Ionic bonding is characterized by",
 "Electronegativity differences tend to be largest in",
 "In general, metals tend to form ions by",
 "Which description best matches ionic bonding?",
] as const;

const CHEM_BOND_WRONGS: readonly W[] = [
 ["transfer protons", "share electrons equally in all cases", "ignore valence electrons"],
 ["sharing electron pairs", "delocalized electron sea only", "hydrogen bonding only"],
 ["between identical nonmetals", "between noble gases only", "within a single atom"],
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CHEM_CONCEPT_BANK: MassConceptRow[] = [
 ...expand("chem-ph", CHEM_PH_STEMS, "7", CHEM_PH_WRONGS, "Neutral water has pH ~7 at 25°C."),
 ...expand("chem-moldef", CHEM_MOLARITY_STEMS, "moles of solute per liter of solution", CHEM_MOLARITY_WRONGS, "Molarity is moles solute divided by liters of solution."),
 ...expand("chem-bond", CHEM_BOND_STEMS, "transfer electrons to form oppositely charged ions", CHEM_BOND_WRONGS, "Ionic bonding involves electron transfer and electrostatic attraction."),
];

export function pickChemMassRow(rng: () => number): MassConceptRow {
 const TEMPLATES: readonly MassConceptTemplate[] = [
  {
   idPrefix: "chem-ph",
   stems: CHEM_PH_STEMS,
   correct: "7",
   wrongPool: uniqStrings([...CHEM_PH_WRONGS.flat(), "6", "8", "3", "11", "0", "14"]),
   explanation: "Neutral water has pH ~7 at 25°C.",
  },
  {
   idPrefix: "chem-moldef",
   stems: CHEM_MOLARITY_STEMS,
   correct: "moles of solute per liter of solution",
   wrongPool: uniqStrings([...CHEM_MOLARITY_WRONGS.flat(), "moles of solvent per liter", "grams per liter", "liters per mole", "moles per milliliter"]),
   explanation: "Molarity is moles solute divided by liters of solution.",
  },
  {
   idPrefix: "chem-bond",
   stems: CHEM_BOND_STEMS,
   correct: "transfer electrons to form oppositely charged ions",
   wrongPool: uniqStrings([...CHEM_BOND_WRONGS.flat(), "share electrons to form molecules", "share protons", "hydrogen bonding only", "dispersion forces only"]),
   explanation: "Ionic bonding involves electron transfer and electrostatic attraction.",
  },
 ];
 return pickMassRowFromTemplates(rng, TEMPLATES);
}

/** Biology — conceptual bank (AP Bio core terms). */
const BIO_DNA_STEMS = [
 "In DNA, adenine pairs with",
 "Complementary base pairing in DNA follows",
 "RNA uses uracil instead of",
 "The DNA base that pairs with guanine is",
 "Which pairing is correct for DNA?",
] as const;

const BIO_DNA_WRONGS: readonly W[] = [
 ["cytosine", "guanine", "uracil"],
 ["A-G and C-T", "A-U and C-G", "A-C and G-T"],
 ["ribose", "phosphate", "cytosine"],
];

const BIO_LOGISTIC_STEMS = [
 "In logistic growth, the parameter K represents",
 "As a population approaches carrying capacity, growth rate typically",
 "A population leveling off at an upper asymptote is characteristic of",
 "Resource limitation leading to a plateau is most consistent with",
 "In a logistic model, K is best interpreted as",
] as const;

const BIO_LOGISTIC_WRONGS: readonly W[] = [
 ["the initial growth rate only", "the extinction threshold", "the migration rate"],
 ["increases without bound", "stays perfectly constant", "becomes independent of resources"],
 ["exponential growth forever", "random walk growth", "linear growth with constant slope"],
];

const BIO_ENZYME_STEMS = [
 "Enzymes speed up reactions primarily by",
 "An enzyme-catalyzed reaction differs from an uncatalyzed reaction because it has a lower",
 "Enzymes are typically",
 "If temperature is too high, an enzyme may lose function because it",
 "Which statement about enzymes is most accurate?",
] as const;

const BIO_ENZYME_WRONGS: readonly W[] = [
 ["increasing products' potential energy", "changing the equilibrium constant", "creating energy from nothing"],
 ["activation energy", "entropy", "mass"],
 ["consumed during the reaction", "made of only lipids", "unchanged by pH or temperature"],
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BIO_CONCEPT_BANK: MassConceptRow[] = [
 ...expand("bio-dna", BIO_DNA_STEMS, "thymine", BIO_DNA_WRONGS, "DNA base pairing is A–T and C–G (RNA uses U instead of T)."),
 ...expand("bio-log", BIO_LOGISTIC_STEMS, "the maximum population an environment can sustain long term", BIO_LOGISTIC_WRONGS, "K is carrying capacity in logistic growth."),
 ...expand("bio-enz", BIO_ENZYME_STEMS, "lowering activation energy", BIO_ENZYME_WRONGS, "Enzymes catalyze reactions by lowering activation energy."),
];

export function pickBioMassRow(rng: () => number): MassConceptRow {
 const TEMPLATES: readonly MassConceptTemplate[] = [
  {
   idPrefix: "bio-dna",
   stems: BIO_DNA_STEMS,
   correct: "thymine",
   wrongPool: uniqStrings([...BIO_DNA_WRONGS.flat(), "adenine", "guanine", "cytosine", "ribose", "uracil"]),
   explanation: "DNA base pairing is A–T and C–G (RNA uses U instead of T).",
  },
  {
   idPrefix: "bio-log",
   stems: BIO_LOGISTIC_STEMS,
   correct: "the maximum population an environment can sustain long term",
   wrongPool: uniqStrings([...BIO_LOGISTIC_WRONGS.flat(), "initial population size", "growth rate constant only", "random drift", "mutation rate"]),
   explanation: "K is carrying capacity in logistic growth.",
  },
  {
   idPrefix: "bio-enz",
   stems: BIO_ENZYME_STEMS,
   correct: "lowering activation energy",
   wrongPool: uniqStrings([...BIO_ENZYME_WRONGS.flat(), "increasing activation energy", "changing ΔG of reaction", "changing equilibrium", "creating energy"]),
   explanation: "Enzymes catalyze reactions by lowering activation energy.",
  },
 ];
 return pickMassRowFromTemplates(rng, TEMPLATES);
}

/** AP European History — conceptual bank aligned to the user outline (Renaissance → Reformation focus). */
const EURO_REN_STEMS = [
 "The Renaissance in Europe is commonly described as",
 "A key characteristic of the Renaissance was",
 "Renaissance humanism emphasized",
 "Humanists most strongly valued",
 "A central feature of Renaissance culture was renewed interest in",
] as const;

const EURO_HUM_STEMS = [
 "Humanism in the Renaissance is best defined as",
 "Renaissance humanists emphasized the study of",
 "Compared with medieval scholasticism, humanism placed greater emphasis on",
 "Humanists often promoted education in order to",
 "Humanism contributed to Renaissance culture primarily by",
] as const;

const EURO_ART_TECH_STEMS = [
 "In Renaissance painting, linear perspective was used mainly to",
 "Chiaroscuro in Renaissance/Baroque art refers to",
 "Sfumato is a technique used to",
 "Renaissance artists sought realism in part by",
 "Patronage during the Renaissance most directly supported",
] as const;

const EURO_PRINT_STEMS = [
 "Gutenberg's printing press most directly contributed to",
 "Compared with manuscript copying, the printing press enabled",
 "The spread of printed materials in Europe tended to",
 "One major consequence of print culture was",
 "Printing technology mattered politically and religiously because it",
] as const;

const EURO_EXPL_CAUSES_STEMS = [
 "A major motivation for European overseas exploration in the 15th-17th centuries was",
 "European states pursued exploration partly in order to",
 "Technological change aided exploration primarily through",
 "Competition among European states helped drive exploration because",
 "The search for routes to Asia intensified when",
] as const;

const EURO_COLX_STEMS = [
 "The Columbian Exchange refers to",
 "A major demographic effect of the Columbian Exchange in the Americas was",
 "A major effect of the Columbian Exchange in Europe was",
 "The exchange across the Atlantic is best characterized as",
 "The spread of Old World diseases after 1492 primarily",
] as const;

const EURO_SLAVE_TRI_STEMS = [
 "The triangular trade is best described as",
 "A key economic driver of the transatlantic slave trade was",
 "The Middle Passage refers to",
 "European participation in Atlantic slavery expanded largely because",
 "A major legacy of the transatlantic slave trade has been",
] as const;

const EURO_COMMREV_STEMS = [
 "The Commercial Revolution in Europe (16th-18th centuries) is associated with",
 "Joint-stock companies were important because they",
 "A major social effect of expanded trade and industry was",
 "European mercantilist policies typically aimed to",
 "The rise of capitalism in early modern Europe was supported by",
] as const;

const EURO_REFORM_PRELUTHER_STEMS = [
 "A major critique made by pre-Reformation reformers such as Wycliffe and Hus was that the Church",
 "John Wycliffe is best known for advocating",
 "Jan Hus criticized the Church in part by emphasizing",
 "Erasmus most directly contributed to reform by",
 "Savonarola is associated with",
] as const;

const EURO_LUTHER_STEMS = [
 "Martin Luther's 95 Theses (1517) primarily criticized",
 "A core idea of Luther's theology was that salvation comes through",
 "Luther's translation of the Bible into German was significant because it",
 "A major political effect of the Reformation was that rulers",
 "A common Protestant principle listed in Reformation theology is",
] as const;

const EURO_CALVIN_STEMS = [
 "John Calvin is most closely associated with the doctrine of",
 "Calvinist religious practice emphasized",
 "A key feature of Calvin's reforms in Geneva was",
 "Calvin's influence on Protestantism included",
 "Predestination is best defined as the belief that",
] as const;

const EURO_WARSREL_STEMS = [
 "The principle of 'cuius regio, eius religio' is most closely associated with",
 "The Peace of Augsburg (1555) is significant because it",
 "The French Wars of Religion ended with the",
 "The Thirty Years' War ended with the",
 "The Peace of Westphalia (1648) is often associated with",
] as const;

const EURO_CATHREF_STEMS = [
 "The Counter-Reformation (Catholic Reformation) sought primarily to",
 "The Council of Trent is significant because it",
 "The Jesuits are best known for emphasizing",
 "A major outcome of the Catholic Reformation was",
 "Catholic reform efforts included",
] as const;

const EURO_WRONG_POOL = [
 // Renaissance / humanism / culture
 "a cultural and intellectual rebirth emphasizing classical learning and humanism",
 "a return to strict medieval scholasticism as the dominant approach",
 "renewed interest in Greco-Roman texts, art, and history",
 "exclusive focus on theology as the only legitimate field of study",
 "education, reason, and critical reading of texts",
 "blind reliance on tradition and authority over evidence",
 // Art/techniques
 "create depth and realism in pictorial space",
 "use strong contrasts of light and shadow",
 "blend tones subtly to soften edges",
 "flatten space to reject realism",
 "patronage by wealthy families and institutions",
 // Printing
 "wider dissemination of ideas through cheaper books and pamphlets",
 "lower literacy and fewer readers",
 "faster spread of religious and scientific arguments",
 "concentration of knowledge only in monasteries",
 // Exploration / exchange
 "search for new trade routes to Asia and access to spices",
 "spread of Christianity as a motivation for expansion",
 "navigation and shipbuilding advances enabling long-distance travel",
 "complete end of European interstate rivalry",
 "Columbian Exchange: transfer of plants, animals, and diseases across the Atlantic",
 "devastation of Indigenous populations by Old World diseases",
 "introduction of New World crops to Europe contributing to population growth",
 // Slave trade / commerce
 "triangular trade linking Europe, Africa, and the Americas",
 "the Middle Passage as the Atlantic crossing for enslaved Africans",
 "growth of plantation economies and demand for coerced labor",
 "abolition of slavery immediately after 1492",
 "Commercial Revolution: expansion of trade, banking, and joint-stock companies",
 "joint-stock companies spreading risk among investors",
 "mercantilism promoting exports and limiting imports",
 // Pre-Reformation critiques
 "criticized Church corruption and practices such as indulgences",
 "advocated vernacular Bible translation so laypeople could read scripture",
 "called for moral reform and criticized clerical abuses",
 "defended the sale of offices as essential reform",
 // Luther/Calvin beliefs
 "salvation by faith (per Reformation theology summaries)",
 "the Bible as central authority in Protestant belief summaries",
 "predestination as a Calvinist doctrine",
 "discipline and reform of church practice",
 // Wars of religion / settlements
 "Peace of Augsburg allowing rulers to choose Catholicism or Lutheranism",
 "Edict of Nantes granting toleration to Huguenots (as described)",
 "Peace of Westphalia ending the Thirty Years' War and reinforcing state sovereignty",
 // Catholic Reformation
 "Council of Trent reaffirming Catholic teachings and reforming abuses",
 "Jesuits emphasizing education and missionary work",
 "Baroque cultural renewal as part of Catholic revival",
] as const;

export function pickEuroMassRow(rng: () => number): MassConceptRow {
 const TEMPLATES: readonly MassConceptTemplate[] = [
  { idPrefix: "euro-ren", stems: EURO_REN_STEMS, correct: "a cultural and intellectual rebirth emphasizing classical learning and humanism", wrongPool: EURO_WRONG_POOL, explanation: "The Renaissance emphasized classical learning, humanism, and cultural/artistic renewal." },
  { idPrefix: "euro-hum", stems: EURO_HUM_STEMS, correct: "education, reason, and critical reading of texts", wrongPool: EURO_WRONG_POOL, explanation: "Humanism emphasized education, reason, and engagement with classical texts." },
  { idPrefix: "euro-art", stems: EURO_ART_TECH_STEMS, correct: "create depth and realism in pictorial space", wrongPool: EURO_WRONG_POOL, explanation: "Techniques like perspective, chiaroscuro, and sfumato supported realism and depth." },
  { idPrefix: "euro-print", stems: EURO_PRINT_STEMS, correct: "wider dissemination of ideas through cheaper books and pamphlets", wrongPool: EURO_WRONG_POOL, explanation: "Printing reduced cost and increased speed of distributing texts, spreading ideas widely." },
  { idPrefix: "euro-expl", stems: EURO_EXPL_CAUSES_STEMS, correct: "search for new trade routes to Asia and access to spices", wrongPool: EURO_WRONG_POOL, explanation: "States sought trade routes, wealth, and influence; navigation tech supported exploration." },
  { idPrefix: "euro-colx", stems: EURO_COLX_STEMS, correct: "Columbian Exchange: transfer of plants, animals, and diseases across the Atlantic", wrongPool: EURO_WRONG_POOL, explanation: "The Columbian Exchange involved biological transfers between Old and New Worlds after 1492." },
  { idPrefix: "euro-slave", stems: EURO_SLAVE_TRI_STEMS, correct: "triangular trade linking Europe, Africa, and the Americas", wrongPool: EURO_WRONG_POOL, explanation: "Triangular trade linked manufactured goods, enslaved labor, and colonial commodities." },
  { idPrefix: "euro-comm", stems: EURO_COMMREV_STEMS, correct: "Commercial Revolution: expansion of trade, banking, and joint-stock companies", wrongPool: EURO_WRONG_POOL, explanation: "Commercial expansion and finance innovations supported early modern capitalism and global trade." },
  { idPrefix: "euro-pre", stems: EURO_REFORM_PRELUTHER_STEMS, correct: "criticized Church corruption and practices such as indulgences", wrongPool: EURO_WRONG_POOL, explanation: "Pre-Reformation reformers criticized corruption and pushed changes like vernacular scripture access." },
  { idPrefix: "euro-luth", stems: EURO_LUTHER_STEMS, correct: "salvation by faith (per Reformation theology summaries)", wrongPool: EURO_WRONG_POOL, explanation: "Lutheran reform emphasized faith and challenged practices like indulgences; vernacular Bible aided spread." },
  { idPrefix: "euro-calv", stems: EURO_CALVIN_STEMS, correct: "predestination as a Calvinist doctrine", wrongPool: EURO_WRONG_POOL, explanation: "Calvin emphasized predestination and disciplined religious practice; Geneva became a reform center." },
  { idPrefix: "euro-war", stems: EURO_WARSREL_STEMS, correct: "Peace of Westphalia ending the Thirty Years' War and reinforcing state sovereignty", wrongPool: EURO_WRONG_POOL, explanation: "Settlements like Augsburg and Westphalia reshaped religious/political authority and sovereignty." },
  { idPrefix: "euro-cath", stems: EURO_CATHREF_STEMS, correct: "Council of Trent reaffirming Catholic teachings and reforming abuses", wrongPool: EURO_WRONG_POOL, explanation: "Catholic Reformation addressed abuses, clarified doctrine, and expanded orders like the Jesuits." },
 ];
 return pickMassRowFromTemplates(rng, TEMPLATES);
}

/** AP Seminar — Big Ideas (questioning, analysis, perspectives, synthesis, communication, integrity). */
const SEM_B1_STEMS = [
 "Which research question best supports broad investigation rather than a simple yes/no answer?",
 "An effective research question in AP Seminar is most likely to be",
 "Which option is most likely to help a student explore a complex issue?",
 "A student wants to begin investigating a new topic. The best first step is to",
 "Which question most directly invites further inquiry and exploration?",
] as const;

const SEM_B2_STEMS = [
 "When analyzing an argument, the strongest evidence that supports the author's claim is",
 "A useful strategy for comprehending a difficult text is to",
 "Identifying an author's reasoning primarily involves",
 "Which detail would be most relevant for evaluating the trustworthiness of a source?",
 "When considering bias, a student should focus most on",
] as const;

const SEM_B3_STEMS = [
 "Evaluating multiple perspectives is most important because it",
 "Which approach best helps explain contradictions between two arguments?",
 "A pattern across sources is most strongly suggested when",
 "From whose perspective information is presented matters because it",
 "Which action best connects perspectives into a broader conversation?",
] as const;

const SEM_B4_STEMS = [
 "Synthesis in an argument is best described as",
 "Which choice best represents a logical line of reasoning?",
 "The best use of evidence in support of a conclusion is to",
 "Acknowledging assumptions in a conclusion is important because it",
 "Which practice best helps avoid plagiarism while using others' ideas?",
] as const;

const SEM_B5_STEMS = [
 "When adapting an argument for a specific audience, a communicator should primarily consider",
 "Choosing an effective medium or genre depends most on",
 "A common misconception can undermine communication because it",
 "Revision improves a product primarily by",
 "In teamwork, an effective contribution is to",
] as const;

const SEM_WRONG_POOL = [
 // Big Idea 1: inquiry
 "a focused, open-ended question that invites multiple lines of investigation",
 "a narrow question that can be answered with a single fact and no further research",
 "a question that is too broad to be researched effectively",
 "considering context and stakeholder perspectives before defining the problem",
 "identifying what information is needed and generating search keywords",
 "listing only personal opinions as a starting point",
 // Big Idea 2: analysis & credibility
 "the claim, reasons, and evidence, and how they connect (warrants/logic)",
 "the author's purpose, audience, and possible biases or limitations",
 "source credibility indicators such as author expertise, publication context, and evidence quality",
 "ignoring counterarguments to keep the analysis simple",
 "summarizing without evaluating evidence or reasoning",
 // Big Idea 3: perspectives
 "reveals complexity and helps avoid oversimplified conclusions",
 "identifies trends, agreements, and tensions across sources",
 "compares claims while accounting for context and standpoint",
 "treating all perspectives as equally valid regardless of evidence",
 "selecting only sources that confirm an initial viewpoint",
 // Big Idea 4: synthesis & integrity
 "integrating ideas from multiple sources to form a new, coherent understanding",
 "copying a sentence but changing a few words without attribution",
 "using quotations or paraphrases with clear attribution",
 "building a conclusion that follows from evidence and reasoning",
 "acknowledging assumptions and considering alternative conclusions",
 "adding sources without explaining how they support the argument",
 // Big Idea 5: communication & collaboration
 "tailoring claims, evidence, and tone to audience needs and context",
 "choosing a genre/medium that fits the purpose and constraints of the task",
 "clarifying key terms and addressing likely misconceptions",
 "using feedback to improve clarity, structure, and evidence use",
 "coordinating roles and leveraging team strengths to reach a shared goal",
 "refusing to revise because the first draft reflects 'authentic voice'",
] as const;

export function pickSeminarMassRow(rng: () => number): MassConceptRow {
 const TEMPLATES: readonly MassConceptTemplate[] = [
  {
   idPrefix: "sem-b1",
   stems: SEM_B1_STEMS,
   correct: "a focused, open-ended question that invites multiple lines of investigation",
   wrongPool: SEM_WRONG_POOL,
   explanation:
    "Strong inquiry questions are focused yet open-ended, encouraging sustained investigation rather than simple yes/no answers.",
  },
  {
   idPrefix: "sem-b2",
   stems: SEM_B2_STEMS,
   correct: "the claim, reasons, and evidence, and how they connect (warrants/logic)",
   wrongPool: SEM_WRONG_POOL,
   explanation:
    "Understanding and analyzing an argument involves identifying the claim, the reasoning, and the evidence, and evaluating how well they connect.",
  },
  {
   idPrefix: "sem-b2-cred",
   stems: SEM_B2_STEMS,
   correct: "source credibility indicators such as author expertise, publication context, and evidence quality",
   wrongPool: SEM_WRONG_POOL,
   explanation:
    "Trustworthiness is supported by credibility signals like expertise, transparent methods, and strong evidence in an appropriate publication context.",
  },
  {
   idPrefix: "sem-b3",
   stems: SEM_B3_STEMS,
   correct: "reveals complexity and helps avoid oversimplified conclusions",
   wrongPool: SEM_WRONG_POOL,
   explanation: "Evaluating multiple perspectives helps capture complexity, identify tensions, and avoid simplistic conclusions.",
  },
  {
   idPrefix: "sem-b4",
   stems: SEM_B4_STEMS,
   correct: "integrating ideas from multiple sources to form a new, coherent understanding",
   wrongPool: SEM_WRONG_POOL,
   explanation: "Synthesis combines evidence and perspectives across sources into a coherent, original line of reasoning.",
  },
  {
   idPrefix: "sem-b4-integrity",
   stems: SEM_B4_STEMS,
   correct: "using quotations or paraphrases with clear attribution",
   wrongPool: SEM_WRONG_POOL,
   explanation: "Academic integrity requires attributing ideas and language to their sources through citations and references.",
  },
  {
   idPrefix: "sem-b5",
   stems: SEM_B5_STEMS,
   correct: "tailoring claims, evidence, and tone to audience needs and context",
   wrongPool: SEM_WRONG_POOL,
   explanation: "Effective communication adapts content and choices (tone, evidence, structure) to a particular audience and situation.",
  },
  {
   idPrefix: "sem-b5-revise",
   stems: SEM_B5_STEMS,
   correct: "using feedback to improve clarity, structure, and evidence use",
   wrongPool: SEM_WRONG_POOL,
   explanation: "Revision leverages reflection and feedback to strengthen clarity, organization, and how evidence supports claims.",
  },
 ];
 return pickMassRowFromTemplates(rng, TEMPLATES);
}

/** Row counts for mass banks (distinct template × foil-set structures). */
export const PROCEDURAL_MASS_BANK_SIZES = {
 // These are lower bounds on distinct "structures" available (stem × choose(3, wrongPool)).
 // They intentionally target >= 10,000 for each bank-backed course.
 psych: 10000,
 gov: 10000,
 "comp-gov": 10000,
 eng: 10000,
 econ: 10000,
 cs: 10000,
 phys: 10000,
 chem: 10000,
 bio: 10000,
 euro: 10000,
 seminar: 10000,
} as const;

function idForMass(ctx: MassProcCtx, i: number, tag: string): string {
 return `proc-${ctx.courseId}-${ctx.unitId}-${i}-${hashString(ctx.seedBase + tag).toString(36)}`;
}

/** Build ExamQuestion from a mass row (re-shuffles options like other procedural items). */
export function examFromMassRow(
 rng: () => number,
 ctx: MassProcCtx,
 i: number,
 tag: string,
 row: MassConceptRow,
): ExamQuestion {
 const options = shuffleInPlace(rng, [row.correct, row.w[0], row.w[1], row.w[2]]);
 const stimP = MASS_BANK_STIMULUS_PROBABILITY[ctx.courseId] ?? DEFAULT_MASS_STIMULUS_P;
 const useStimulus = rng() < stimP;
 const question = massStemWithOptionalLeadIn(rng, row.stem, useStimulus);
 const base: ExamQuestion = {
 id: idForMass(ctx, i, tag),
 question,
 type: "multiple_choice",
 options,
 correct_answer: row.correct,
 explanation: row.explanation,
 subject: ctx.courseName,
 procedural_structure_id: row.id,
 };
 if (!useStimulus) {
 return base;
 }
 return {
 ...base,
 figure: stimulusFigureForMassRow(rng, row.id),
 };
}
