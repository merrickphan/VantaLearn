import type { ExamFigure } from "@/types";
import { pick } from "./utils";

/** Scenario text shown above the stem (College Board-style exhibit). */
const BY_PREFIX: Record<string, readonly string[]> = {
 "psych-iv": [
 "In a controlled study, researchers assign participants to different treatment levels and then measure outcomes.",
 "An experiment manipulates one factor across conditions while holding other factors as constant as possible.",
 "Laboratory volunteers are placed into groups that receive different instructions before a timed task.",
 "A field experiment varies a single factor between classrooms and compares average scores afterward.",
 "Participants are randomly assigned to either a treatment or control condition before data are collected.",
 ],
 "psych-dv": [
 "After treatments are applied, the research team records an outcome measure for each participant.",
 "The study tracks how a measured behavior changes when another factor is manipulated.",
 "Researchers score each subject on a quantitative outcome after exposure to different conditions.",
 "The dependent measure is collected at the end of each session for statistical comparison.",
 ],
 "psych-syn": [
 "Two neurons meet at a chemical synapse; vesicles release messenger molecules into a narrow gap.",
 "An action potential reaches the axon terminal, triggering release across the synaptic cleft.",
 "Signals cross from a presynaptic cell to a postsynaptic cell at a specialized junction.",
 ],
 "psych-posr": [
 "A trainer gives a food reward immediately after a desired behavior occurs.",
 "An animal receives praise and a treat contingent on performing the correct action.",
 "Reinforcement adds a pleasant consequence that makes the behavior more likely in the future.",
 ],
 "psych-negr": [
 "An unpleasant buzzer stops as soon as the participant completes the required response.",
 "Removing an aversive stimulus after the target behavior strengthens that behavior.",
 "A student buckles a seatbelt to silence an alarm — removal of noise reinforces buckling.",
 ],
 "psych-hyp": [
 "Before data collection, the team states a clear, testable prediction about the relationship between variables.",
 "The proposal will be evaluated against observed results at the end of the study.",
 ],
 "psych-cr": [
 "After repeated pairings, a previously neutral cue now triggers a learned response.",
 "Classical conditioning has occurred; the organism responds to the conditioned stimulus alone.",
 ],
 "psych-stm": [
 "Participants briefly hold unrelated digits before recalling them in order.",
 "Information is maintained for seconds without rehearsal in a capacity-limited store.",
 ],
 "psych-fae": [
 "Observers explain another person's rude comment as a personality flaw without knowing they just received bad news.",
 "When judging strangers, people often emphasize traits and discount situational constraints.",
 ],
 "psych-rand": [
 "Each volunteer has an equal chance of being placed in each condition using a randomization device.",
 "Assignment to groups is determined by chance to reduce systematic differences at baseline.",
 ],
 "psych-corr": [
 "A scatterplot suggests two variables tend to move together, but causation is not established by association alone.",
 "Researchers report a linear association between X and Y for a large sample.",
 ],
 "psych-hip": [
 "Brain imaging and lesion studies link new declarative memories to medial temporal lobe structures.",
 "A patient with bilateral damage struggles to form new episodic memories while older memories may persist.",
 ],
 "gov-fed": [
 "The national government and state governments both exercise sovereign powers under the Constitution.",
 "Policy debates often turn on which level of government may regulate a particular activity.",
 "State and national governments share authority in a compound republic.",
 "Federal systems allocate powers across levels; disputes arise over which level is supreme in a policy area.",
 ],
 "gov-sep": [
 "Congress enacts statutes, the executive enforces them, and courts interpret them in cases.",
 "No single branch is supposed to hold all governmental power under the U.S. design.",
 ],
 "gov-a1": [
 "A city ordinance restricts certain demonstrations in public parks; challengers cite free expression.",
 "A student newspaper faces a prior restraint question about publishing an article.",
 ],
 "gov-marv": [
 "A late-night judicial appointment dispute reaches the Supreme Court early in the republic.",
 "The opinion discusses whether an act of Congress conflicts with the Constitution.",
 ],
 "gov-chk": [
 "Congress may override a presidential veto; courts may invalidate statutes; the Senate confirms nominees.",
 "Each branch has tools to restrain abuses by the others under the constitutional plan.",
 ],
 "eng-adh": [
 "In a debate, one speaker attacks their opponent's character instead of addressing the argument.",
 "A critic dismisses a proposal by insulting the proposer rather than evaluating evidence.",
 ],
 "eng-eth": [
 "A physician cites training and experience to reassure patients before explaining a treatment plan.",
 "The speaker emphasizes credibility and good character before making a recommendation.",
 ],
 "eng-straw": [
 "Speaker B claims Speaker A wants to ban all cars, but A only proposed a small fee on downtown parking.",
 "An opponent exaggerates a policy position to make it easier to criticize.",
 ],
 "econ-oc": [
 "A student chooses between attending a lecture or working an extra shift with a known hourly wage.",
 "A nation can produce either wheat or steel; producing more wheat means giving up some steel output.",
 ],
 "econ-def": [
 "Analysts compare nominal GDP to real GDP to summarize economy-wide price changes over time.",
 "To interpret growth in current dollars, economists adjust using a broad price index.",
 ],
};

const GENERIC: readonly string[] = [
 "Read the stimulus carefully before selecting the best answer.",
 "Use only the information implied by the scenario and standard definitions from the course.",
 "This item follows the style of a document-based or scenario-based multiple-choice question.",
];

export function stimulusFigureForMassRow(rng: () => number, rowId: string): ExamFigure {
 const parts = rowId.split("-");
 const key = parts.length >= 2 ? `${parts[0]}-${parts[1]}` : rowId;
 const pool = BY_PREFIX[key] ?? GENERIC;
 return {
 kind: "stimulus",
 body: pick(rng, pool),
 };
}

/**
 * Target probability that a mass-bank item includes a stimulus exhibit (College Board MC sets
 * typically mix stimulus-based and stand-alone items; these values approximate that mix without
 * copying released exam material).
 */
export const MASS_BANK_STIMULUS_PROBABILITY: Record<string, number> = {
 psych: 0.44,
 gov: 0.42,
 "comp-gov": 0.42,
 lang: 0.4,
 lit: 0.4,
 macro: 0.41,
 micro: 0.41,
};

const USH_THEMATIC: Record<number, readonly string[]> = {
 1: [
 "A museum panel describes societies in the Americas before sustained European colonization and early Atlantic contacts.",
 "Students compare archaeological evidence and indigenous sources about North American societies prior to 1607.",
 "An excerpt from a historian's essay frames migration, maize agriculture, and early colonial encounters.",
 ],
 2: [
 "A timeline highlights Virginia, New England, and Atlantic trade in the seventeenth and early eighteenth centuries.",
 "A brief reading compares mercantilist policies with colonial assemblies and labor systems in British North America.",
 ],
 3: [
 "A classroom debate uses documents about imperial wars, taxation, and colonial protest leading toward independence.",
 "A map activity follows frontier disputes and revolutionary-era mobilization across regions.",
 ],
 4: [
 "An article summarizes early national debates over parties, the judiciary, and territorial expansion.",
 "Students analyze sectional economic differences and foreign policy in the early republic.",
 ],
 5: [
 "A historian's overview connects reform movements, westward migration, and rising sectional tensions.",
 "Primary-source snippets illustrate arguments over slavery's expansion and popular sovereignty.",
 ],
 6: [
 "Reconstruction-era sources and later retrospectives are paired in a document-based warm-up.",
 "A lecture outline traces industrial growth, labor conflict, and Gilded Age politics after the Civil War.",
 ],
 7: [
 "Political cartoons and editorials from the Progressive Era through the World Wars frame reform and foreign policy.",
 "A chart compares migration, urban growth, and civil rights activism across the early twentieth century.",
 ],
 8: [
 "Cold War timelines and speeches illustrate containment, domestic anticommunism, and social movements.",
 "Postwar economic change and suburbanization appear in a short interpretive passage.",
 ],
 9: [
 "Recent decades are introduced through themes of rights movements, partisan realignment, and globalization.",
 "A policy brief-style paragraph discusses debates over federal power, trade, and demographic change.",
 ],
};

const WH_THEMATIC: Record<number, readonly string[]> = {
 1: [
 "Two students discuss state-building, belief systems, and technology around 1200 CE across Afro-Eurasia and the Americas.",
 "A world map labels major empires and trade routes students will compare in this unit.",
 ],
 2: [
 "An outline traces Silk Road, Indian Ocean, and trans-Saharan exchanges of goods, ideas, and disease.",
 "A teacher projects data on urban growth tied to long-distance commerce before 1450.",
 ],
 3: [
 "Land-based empires are compared using gunpowder technology, taxation, and religious patronage.",
 "Court chronicles and travel accounts are introduced as sources on imperial consolidation.",
 ],
 4: [
 "Maritime exploration and new oceanic networks are summarized in a short analytical paragraph.",
 "A chart contrasts Portuguese, Spanish, and later European claims in the Americas and Asia.",
 ],
 5: [
 "Revolutions and Enlightenment-era ideas appear in a synthetic passage on rights, nationalism, and resistance.",
 "Political cartoons from the Atlantic revolutions are shown as stimulus for discussion.",
 ],
 6: [
 "Industrialization and imperialism are linked in a brief essay on coal, factories, and competition for territory.",
 "Economic data illustrate uneven industrial growth across world regions in the nineteenth century.",
 ],
 7: [
 "Global conflict and depression are framed through alliances, total war, and interwar instability.",
 "Propaganda excerpts illustrate mobilization and home-front experiences in the World Wars era.",
 ],
 8: [
 "Cold War rivalry, decolonization, and nonalignment appear in a comparative overview.",
 "Migration and new international institutions are summarized for post-1945 context.",
 ],
 9: [
 "Globalization, technology, and environmental challenges are introduced in a contemporary issues passage.",
 "A table lists regional trade blocs and NGOs as prompts for discussion—not as facts to memorize from the exhibit alone.",
 ],
};

const HG_THEMATIC: Record<number, readonly string[]> = {
 1: [
 "A worksheet asks students to move between absolute location, relative location, and scale on several maps.",
 "An instructor emphasizes Tobler's law while comparing two thematic maps of the same region.",
 ],
 2: [
 "Population pyramids for two countries are displayed alongside crude rate vocabulary in a short introduction.",
 "A news-style paragraph discusses migration streams and demographic transition in generic terms.",
 ],
 3: [
 "Ethnographic notes describe language, religion, and identity in a hypothetical border region.",
 "Photos of cultural landscapes accompany a question set on diffusion and syncretism.",
 ],
 4: [
 "Boundary types and electoral geography are previewed using simplified world-region sketches.",
 "A brief scenario discusses sovereignty, devolution, and supranational organizations.",
 ],
 5: [
 "Von Thünen-style rings and agricultural regions are introduced on a stylized diagram—not real farm data.",
 "Climate and terrain constraints on farming are summarized before the items below.",
 ],
 6: [
 "A simplified city model highlights CBD, sectors, and suburban patterns for analysis.",
 "Urban policy debates are framed through generic gentrification and sprawl examples.",
 ],
 7: [
 "Core–periphery language and development indicators appear in a short interpretive blurb.",
 "Commodity chain language is used to set context for global economic geography questions.",
 ],
};

const HIST_GENERIC: readonly string[] = [
 "Historians situate the question below within the unit's usual themes; use course concepts, not outside trivia from the exhibit.",
 "The exhibit orients the item to period themes; select the best answer from standard course expectations.",
];

/** Thematic stimulus for AP US History unit pools (text-only items may attach with fixed probability). */
export function thematicStimulusUsh(rng: () => number, unitIndex: number): ExamFigure {
 const pool = USH_THEMATIC[unitIndex] ?? HIST_GENERIC;
 return {
 kind: "stimulus",
 body: pick(rng, pool),
 };
}

/** Thematic stimulus for AP World History unit pools. */
export function thematicStimulusWh(rng: () => number, unitIndex: number): ExamFigure {
 const pool = WH_THEMATIC[unitIndex] ?? HIST_GENERIC;
 return {
 kind: "stimulus",
 body: pick(rng, pool),
 };
}

/** Thematic stimulus for AP Human Geography unit pools. */
export function thematicStimulusHg(rng: () => number, unitIndex: number): ExamFigure {
 const pool = HG_THEMATIC[unitIndex] ?? HIST_GENERIC;
 return {
 kind: "stimulus",
 body: pick(rng, pool),
 };
}

/**
 * Share of text-only MC items that receive a thematic stimulus.
 * Set to 0 for geography/history pools so stems never pair with unrelated random exhibits
 * (stimulus must match the question; coherent items pass an explicit `figure` from generators).
 */
export const TEXT_ITEM_STIMULUS_PROBABILITY = {
 ush: 0,
 wh: 0,
 "hum-geo": 0,
} as const;
