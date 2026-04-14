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

const COMP_GOV_CONCEPT_BANK: MassConceptRow[] = [
 ...expand("gov-fed", FED_STEMS, "federalism", FED_WRONGS, "Federalism divides sovereignty across levels."),
 ...expand("gov-sep", SEP_STEMS, "separation of powers", SEP_WRONGS, "Different branches hold distinct core functions."),
 ...expand("gov-a1", A1_SPEECH_STEMS, "First Amendment", A1_WRONGS, "Speech protections are central to the First Amendment."),
 ...expand("gov-marv", MARSHALL_STEMS, "Marbury v. Madison", MARSHALL_WRONGS, "Marshall's opinion established judicial review."),
 ...expand("gov-chk", CHK_STEMS, "checks and balances", CHK_WRONGS, "Branches limit one another through checks and balances."),
];

export function pickCompGovMassRow(rng: () => number): MassConceptRow {
 return pick(rng, COMP_GOV_CONCEPT_BANK);
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
 return pick(rng, GOV_US_CONCEPT_BANK);
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
 gov: GOV_US_CONCEPT_BANK.length,
 "comp-gov": COMP_GOV_CONCEPT_BANK.length,
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
