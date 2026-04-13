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
 title: "Stimulus",
 body: pick(rng, pool),
 };
}
