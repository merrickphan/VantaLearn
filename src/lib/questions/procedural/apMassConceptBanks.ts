/**
 * Large banks of AP-style conceptual MC items (stem + key + foils).
 * Each row is a distinct "question structure" for variety accounting.
 */

import type { ExamQuestion } from "@/types";
import { stimulusFigureForMassRow } from "./stimulusPools";
import { hashString, pick, shuffleInPlace } from "./utils";

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
 return pick(rng, PSYCH_CONCEPT_BANK);
}

/** Gov / Pol — conceptual bank (shared macro/micro style items + institutions). */
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

const GOV_CONCEPT_BANK: MassConceptRow[] = [
 ...expand("gov-fed", FED_STEMS, "federalism", FED_WRONGS, "Federalism divides sovereignty across levels."),
 ...expand("gov-sep", SEP_STEMS, "separation of powers", SEP_WRONGS, "Different branches hold distinct core functions."),
 ...expand("gov-a1", A1_SPEECH_STEMS, "First Amendment", A1_WRONGS, "Speech protections are central to the First Amendment."),
 ...expand("gov-marv", MARSHALL_STEMS, "Marbury v. Madison", MARSHALL_WRONGS, "Marshall's opinion established judicial review."),
 ...expand("gov-chk", CHK_STEMS, "checks and balances", CHK_WRONGS, "Branches limit one another through checks and balances."),
];

export function pickGovMassRow(rng: () => number): MassConceptRow {
 return pick(rng, GOV_CONCEPT_BANK);
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

const ENG_CONCEPT_BANK: MassConceptRow[] = [
 ...expand("eng-adh", ADHOM_STEMS, "ad hominem", ADHOM_WRONGS, "Ad hominem attacks the person."),
 ...expand("eng-eth", ETHOS_STEMS, "ethos", ETHOS_WRONGS, "Ethos is credibility appeal."),
 ...expand("eng-straw", STRAW_STEMS, "straw man", STRAW_WRONGS, "A straw man misrepresents the opposing argument."),
];

export function pickEngMassRow(rng: () => number): MassConceptRow {
 return pick(rng, ENG_CONCEPT_BANK);
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

const ECON_CONCEPT_BANK: MassConceptRow[] = [
 ...expand("econ-oc", OC_STEMS, "opportunity cost", OC_WRONGS_FIXED, "Opportunity cost is the next-best alternative forgone."),
 ...expand("econ-def", GDP_DEF_STEMS, "Nominal GDP / Real GDP x 100", GDP_DEF_WRONGS, "Deflator compares nominal to real output."),
];

export function pickEconMassRow(rng: () => number): MassConceptRow {
 return pick(rng, ECON_CONCEPT_BANK);
}

/** Row counts for mass banks (distinct template × foil-set structures). */
export const PROCEDURAL_MASS_BANK_SIZES = {
 psych: PSYCH_CONCEPT_BANK.length,
 gov: GOV_CONCEPT_BANK.length,
 eng: ENG_CONCEPT_BANK.length,
 econ: ECON_CONCEPT_BANK.length,
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
 return {
 id: idForMass(ctx, i, tag),
 question: row.stem,
 type: "multiple_choice",
 options,
 correct_answer: row.correct,
 explanation: row.explanation,
 subject: ctx.courseName,
 procedural_structure_id: row.id,
 figure: stimulusFigureForMassRow(rng, row.id),
 };
}
