import type { ApUnit } from "./types";

function U(prefix: string, titles: string[]): ApUnit[] {
 return titles.map((title, i) => ({
 id: `${prefix}-u${i + 1}`,
 index: i + 1,
 title,
 summary: `Practice for Unit ${i + 1}: ${title}.`,
 }));
}

function unitsDetailed(
 prefix: string,
 defs: readonly { title: string; summary: string; hooks: readonly string[] }[],
): ApUnit[] {
 return defs.map((d, i) => ({
 id: `${prefix}-u${i + 1}`,
 index: i + 1,
 title: d.title,
 summary: d.summary,
 questionHooks: [...d.hooks],
 }));
}

/**
 * AP Calculus AB — eight units aligned to common CED-style sequencing (limits through applications of integration).
 * Summaries and hooks drive AI stems and procedural variety; lesson labels mirror typical AB pacing.
 */
const CALC_AB_UNIT_DEFS = [
 {
 title: "Limits and Continuity",
 summary:
 "Limits as values a function approaches; limit notation lim(x→a) f(x) and one-sided limits; estimating from graphs and tables; evaluating limits algebraically (substitution, simplifying, rationalizing); indeterminate forms 0/0 and ∞/∞ with algebraic resolution; infinite limits and vertical asymptotes; limits at infinity and horizontal asymptotes for rational functions; continuity (three conditions), types of discontinuity (removable, jump, infinite); Intermediate Value Theorem for roots on an interval.",
 hooks: [
 "limit vs function value",
 "one-sided limits and when a limit fails to exist",
 "limits from tables and graphs",
 "direct substitution and removable discontinuity",
 "0/0 form: factor and simplify",
 "limits at infinity / end behavior",
 "continuity at a point: three-part test",
 "IVT and existence of zeros",
 ],
 },
 {
 title: "Differentiation: Definition and Fundamental Properties",
 summary:
 "Tangent line and instantaneous rate of change; derivative as limit of difference quotient (secant to tangent); interpretations (rate, slope); conditions for non-differentiability (corners, cusps, vertical tangent, discontinuity); basic rules (constant, power, sum/difference); estimating derivatives from graphs; units of derivatives in applied contexts.",
 hooks: [
 "difference quotient and derivative definition",
 "derivative as slope of tangent",
 "when f is not differentiable",
 "power rule and linearity",
 "derivative sign and increasing/decreasing from a graph",
 "units in applied rates (e.g. distance/time, cost per unit)",
 ],
 },
 {
 title: "Differentiation: Composite, Implicit, and Inverse Functions",
 summary:
 "Chain rule for compositions (identifying inner and outer functions); product and quotient rules; implicit differentiation (dy/dx when y is not isolated); derivatives of inverse functions; derivatives of sin, cos, tan and compositions (AB scope).",
 hooks: [
 "chain rule: inner vs outer",
 "product vs quotient structure",
 "implicit differentiation setup",
 "derivatives of sin, cos, tan",
 "inverse function derivative relationship",
 ],
 },
 {
 title: "Contextual Applications of Differentiation",
 summary:
 "Rectilinear motion: position, velocity, acceleration; sign of velocity and direction; speeding up vs slowing down; related rates (set up, differentiate with respect to t, substitute); local linear approximation and differentials; interpreting error and sensitivity.",
 hooks: [
 "motion along a line: v and a from s(t)",
 "related rates: geometric constraints",
 "linear approximation near a point",
 "differentials dy and measurement interpretation",
 ],
 },
 {
 title: "Analytical Applications of Differentiation",
 summary:
 "Critical points (where f' is zero or undefined); increasing/decreasing via f' sign; First Derivative Test; concavity and f''; inflection points; Second Derivative Test; optimization (objective function, domain, critical points, justification); synthesizing behavior for curve analysis.",
 hooks: [
 "critical numbers and local extrema",
 "first derivative sign chart",
 "concavity and inflection",
 "second derivative test cautions",
 "optimization with endpoints",
 ],
 },
 {
 title: "Integration and Accumulation of Change",
 summary:
 "Riemann sums (left, right, midpoint); definite integral as limit of sums and net signed area; antiderivatives and +C; Fundamental Theorem Parts 1 and 2; accumulation functions; average value of a function on an interval.",
 hooks: [
 "Riemann sum interpretation",
 "FTC: derivative of an accumulation",
 "FTC: evaluating definite integrals",
 "average value = 1/(b-a) ∫ f",
 "net change from rate",
 ],
 },
 {
 title: "Differential Equations",
 summary:
 "Slope fields and matching DEs to fields; separable differential equations (concept and solution steps); exponential growth/decay dy/dt = ky; initial value problems and solving for constants.",
 hooks: [
 "slope field reading",
 "separable form dy/dx = g(x)h(y)",
 "exponential model ky",
 "initial condition fixes constant",
 ],
 },
 {
 title: "Applications of Integration",
 summary:
 "Area between curves (top minus bottom); volumes of revolution (disk/washer setup); average value; displacement vs distance with integrals; accumulated change from a rate in context.",
 hooks: [
 "area between two graphs",
 "disk method π∫ R^2 dx",
 "average value theorem",
 "displacement vs total distance",
 "accumulated quantity from rate",
 ],
 },
] as const;

/** BC-only units 9–10 (AB students do not see these). */
const CALC_BC_EXTRA_UNITS: readonly {
 title: string;
 summary: string;
 hooks: readonly string[];
}[] = [
 {
 title: "Parametric Equations, Polar Coordinates, and Vector-Valued Functions",
 summary:
 "Parametric motion and vector-valued derivatives; polar area and curve behavior; velocity and acceleration in 2D (BC). Practice here emphasizes BC-only representations while building on AB differentiation and integration skills.",
 hooks: [
 "parametric derivative dy/dx",
 "polar area element",
 "vector-valued motion",
 ],
 },
 {
 title: "Infinite Sequences and Series",
 summary:
 "Sequence limits; series convergence tests; power series; Taylor/Maclaurin representations; interval of convergence; error bounds where appropriate (BC).",
 hooks: [
 "series convergence reasoning",
 "Taylor polynomials",
 "interval of convergence",
 ],
 },
];

/** Canonical units per course id (aligned with typical CB syllabi; titles may vary slightly by year). */
export const AP_UNITS_BY_COURSE_ID: Record<string, ApUnit[]> = {
 "calc-ab": unitsDetailed("calc-ab", CALC_AB_UNIT_DEFS),
 "calc-bc": [
 ...unitsDetailed("calc-bc", CALC_AB_UNIT_DEFS).map((u) => ({
 ...u,
 summary: `${u.summary} (BC includes additional representations in later units.)`,
 })),
 ...CALC_BC_EXTRA_UNITS.map((d, j) => ({
 id: `calc-bc-u${j + 9}`,
 index: j + 9,
 title: d.title,
 summary: d.summary,
 questionHooks: [...d.hooks],
 })),
 ],
 precalc: U("precalc", [
 "Polynomial and Rational Functions",
 "Exponential and Logarithmic Functions",
 "Trigonometric and Polar Functions",
 "Functions Involving Parameters, Vectors, and Matrices",
 "Conics and Advanced Graphing",
 "Sequences, Series, and Mathematical Induction",
 "Limits and Introductory Calculus Ideas",
 "Modeling with Functions and Data",
 ]),
 stats: U("stats", [
 "Exploring One-Variable Data",
 "Exploring Two-Variable Data",
 "Collecting Data",
 "Probability, Random Variables, and Probability Distributions",
 "Sampling Distributions",
 "Inference for Categorical Data: Proportions",
 "Inference for Quantitative Data: Means",
 "Inference for Categorical Data: Chi-Square",
 "Inference for Quantitative Data: Slopes",
 ]),
 "cs-a": U("cs-a", [
 "Primitive Types and Using Objects",
 "Boolean Expressions and if Statements",
 "While Loops, String Traversal, and Algorithms",
 "Array Traversal and Algorithms",
 "Writing Classes",
 "ArrayList and Searching/Sorting",
 "Inheritance and Polymorphism",
 "Recursion",
 ]),
 csp: U("csp", [
 "Creative Development",
 "Data",
 "Algorithms and Programming",
 "Computing Systems and Networks",
 "Impact of Computing",
 "Investigative Practices",
 ]),
 "physics-1": U("physics-1", [
 "Kinematics",
 "Dynamics",
 "Circular Motion and Gravitation",
 "Energy",
 "Momentum",
 "Simple Harmonic Motion",
 "Torque and Rotational Motion",
 "Electric Charge and Electric Force",
 "DC Circuits",
 "Mechanical Waves and Sound",
 ]),
 "physics-2": U("physics-2", [
 "Fluids",
 "Thermodynamics",
 "Electric Force, Field, and Potential",
 "Electric Circuits",
 "Magnetism and Electromagnetic Induction",
 "Geometric and Physical Optics",
 "Quantum, Atomic, and Nuclear Physics",
 ]),
 "physics-c-m": U("physics-c-m", [
 "Kinematics",
 "Newton's Laws of Motion",
 "Work, Energy, and Power",
 "Systems of Particles and Linear Momentum",
 "Rotation",
 "Oscillations",
 "Gravitation",
 ]),
 "physics-c-em": U("physics-c-em", [
 "Electrostatics",
 "Conductors, Capacitors, and Dielectrics",
 "Electric Circuits",
 "Magnetic Fields",
 "Electromagnetism",
 "Optics (Physical)",
 ]),
 chem: U("chem", [
 "Atomic Structure and Properties",
 "Molecular and Ionic Compound Structure and Properties",
 "Intermolecular Forces and Properties",
 "Chemical Reactions",
 "Kinetics",
 "Thermodynamics",
 "Equilibrium",
 "Acids and Bases",
 "Applications of Thermodynamics",
 ]),
 bio: U("bio", [
 "Chemistry of Life",
 "Cell Structure and Function",
 "Cellular Energetics",
 "Cell Communication and Cell Cycle",
 "Heredity",
 "Gene Expression and Regulation",
 "Natural Selection",
 "Ecology",
 ]),
 env: U("env", [
 "The Living World: Ecosystems",
 "The Living World: Biodiversity",
 "Populations",
 "Earth Systems and Resources",
 "Land and Water Use",
 "Energy Resources and Consumption",
 "Atmospheric Pollution",
 "Aquatic and Terrestrial Pollution",
 "Global Change",
 ]),
 ush: [
 {
 id: "ush-u1",
 index: 1,
 title: "Period 1: 1491-1607",
 summary:
 "Indigenous societies and environments; peopling of the Americas; European exploration and Columbian Exchange; Spanish colonial systems (including encomienda); early rival empires; introduction of African slavery in the Atlantic world; first sustained English and French footholds.",
 },
 {
 id: "ush-u2",
 index: 2,
 title: "Period 2: 1607-1754",
 summary:
 "British, French, Dutch, and Spanish colonies; labor (indenture, slavery, family farming); mercantilism and Navigation Acts; regional cultures (Chesapeake, New England, middle colonies); Native diplomacy and conflict; Bacon's Rebellion; slavery's growth; First Great Awakening; imperial wars culminating in the Seven Years' War.",
 },
 {
 id: "ush-u3",
 index: 3,
 title: "Period 3: 1754-1800",
 summary:
 "French and Indian War to independence; imperial reforms and resistance (taxation, protest, loyalism); revolution, war, and Native alliances; state and national experiments under the Articles; Constitutional Convention and Bill of Rights; Hamilton-Jefferson divisions; Washington's presidency and early foreign policy.",
 },
 {
 id: "ush-u4",
 index: 4,
 title: "Period 4: 1800-1848",
 summary:
 "Jeffersonian and Jacksonian democracy; Louisiana Purchase and exploration; War of 1812; Market Revolution and transportation; Indian Removal; Monroe Doctrine; sectionalism and slavery's expansion; reform movements (abolition, women's rights, temperance); Mexican-American War and territorial acquisition.",
 },
 {
 id: "ush-u5",
 index: 5,
 title: "Period 5: 1844-1877",
 summary:
 "Manifest destiny and the Mexican Cession; compromise and crisis (Compromise of 1850, Kansas-Nebraska, Dred Scott); Civil War mobilization, emancipation, and turning points; Reconstruction plans, amendments, Freedmen's Bureau; retreat from Reconstruction and contested endings.",
 },
 {
 id: "ush-u6",
 index: 6,
 title: "Period 6: 1865-1898",
 summary:
 "Industrialization, immigration, and urban growth; labor conflict and agrarian protest; Gilded Age politics and corruption; segregation and disenfranchisement after Reconstruction; Populists; overseas expansion and the Spanish-American War; debates over empire, markets, and reform.",
 },
 {
 id: "ush-u7",
 index: 7,
 title: "Period 7: 1890-1945",
 summary:
 "Progressivism and regulatory state; women's suffrage; World War I and its aftermath; Great Migration; Roaring Twenties; Great Depression; New Deal; World War II mobilization, home front, and internment; paths toward postwar superpower status.",
 },
 {
 id: "ush-u8",
 index: 8,
 title: "Period 8: 1945-1980",
 summary:
 "Cold War containment, Korea, and Vietnam; civil rights movement and landmark legislation; Great Society; suburbanization; environmental and consumer culture; Watergate; stagflation; shifting foreign policy and detente; social movements (feminism, environmentalism, conservatism's rise).",
 },
 {
 id: "ush-u9",
 index: 9,
 title: "Period 9: 1980-Present",
 summary:
 "Reagan revolution and end of Cold War; globalization, trade, and immigration after 1965; culture wars; digital economy; war on terror and security policy; recurring debates over inequality, health care, climate, and partisan polarization - interpretation of very recent events remains contested.",
 },
 ],
 wh: [
 {
 id: "wh-u1",
 index: 1,
 title: "The Global Tapestry",
 summary:
 "States and belief systems c. 1200: post-classical developments, major world religions (Buddhism, Christianity, Confucianism, Hinduism, Islam, Judaism), regional powers (Abbasid, Song, feudal Europe, Japan, Delhi Sultanate, Khmer, Mesoamerican empires), trade and social structures.",
 },
 {
 id: "wh-u2",
 index: 2,
 title: "Networks of Exchange",
 summary:
 "Hanseatic League, Crusades, scholasticism and universities, Mongol expansion, Mali and Songhai, Indian Ocean and Silk Road trade, Black Death, travelers (Ibn Battuta, Marco Polo), urbanization and cultural diffusion 1200-1450.",
 },
 {
 id: "wh-u3",
 index: 3,
 title: "Land-Based Empires",
 summary:
 "Renaissance humanism, Reformation and Catholic Reformation, Scientific Revolution, gunpowder empires (Ottoman, Safavid, Mughal), European state-building, Qing and Tokugawa, Atlantic slavery and resistance in Africa and the Americas.",
 },
 {
 id: "wh-u4",
 index: 4,
 title: "Transoceanic Interconnections",
 summary:
 "Iberian exploration, Treaty of Tordesillas, Columbian Exchange, encomienda, African slave trade and Middle Passage, mercantilism and joint-stock companies, silver and global trade, colonial societies 1450-1750.",
 },
 {
 id: "wh-u5",
 index: 5,
 title: "Revolutions",
 summary:
 "Enlightenment and Atlantic revolutions (US, France, Haiti, Latin America), industrial beginnings, nationalism, socialism/Marxism, women's rights debates, resistance to early industrialization.",
 },
 {
 id: "wh-u6",
 index: 6,
 title: "Consequences of Industrialization",
 summary:
 "Imperialism and ideologies of rule, British India, unequal treaties and Meiji Japan, scramble for Africa and Berlin Conference, labor and reform, economic dependency and environmental extraction.",
 },
 {
 id: "wh-u7",
 index: 7,
 title: "Global Conflict",
 summary:
 "World War I and Versailles, Russian Revolution, interwar crises and fascism, World War II and Holocaust, UN and new international order.",
 },
 {
 id: "wh-u8",
 index: 8,
 title: "Cold War and Decolonization",
 summary:
 "Containment, NATO/Warsaw Pact, decolonization (South Asia, Africa, Middle East), China's civil war, Korea and Vietnam, Cuban Missile Crisis, Non-Aligned Movement, end of the USSR.",
 },
 {
 id: "wh-u9",
 index: 9,
 title: "Globalization",
 summary:
 "Institutions (WTO, UN, ICC), regional trade, terrorism and conflict after 9/11, China and India in the world economy, migration, global health, environment, internet and culture.",
 },
 ],
 euro: U("euro", [
 "Renaissance and Exploration",
 "Age of Reformation",
 "Absolutism and Constitutionalism",
 "Scientific, Philosophical, and Political Developments",
 "Conflict, Crisis, and Reaction in the Late 18th Century",
 "Industrialization and Its Effects",
 "19th-Century Perspectives and Political Developments",
 "20th-Century Global Conflicts",
 "Cold War and Contemporary Europe",
 ]),
 gov: U("gov", [
 "Foundations of American Democracy",
 "Interactions Among Branches of Government",
 "Civil Liberties and Civil Rights",
 "American Political Ideologies and Beliefs",
 "Political Participation",
 ]),
 "comp-gov": U("comp-gov", [
 "Introduction to Comparative Politics",
 "Sovereignty, Authority, and Power",
 "Political Institutions",
 "Citizens, Society, and the State",
 "Political and Economic Change",
 "Public Policy",
 ]),
 macro: U("macro", [
 "Basic Economic Concepts",
 "Economic Indicators and the Business Cycle",
 "National Income and Price Determination",
 "The Financial Sector",
 "Long-Run Consequences of Stabilization Policies",
 "Open Economy: International Trade and Finance",
 ]),
 micro: U("micro", [
 "Basic Economic Concepts",
 "Supply and Demand",
 "Production, Cost, and the Perfect Competition Model",
 "Imperfect Competition",
 "Factor Markets",
 "Market Failure and the Role of Government",
 ]),
 psych: [
 {
 id: "psych-u1",
 index: 1,
 title: "Scientific Foundations of Psychology",
 summary:
 "Major historical approaches (psychodynamic, behavioral, humanistic, cognitive, biological, evolutionary, sociocultural); how psychologists pose questions and use evidence; research designs including experiments, correlational studies, naturalistic observation, surveys, and case studies; key ethical principles (informed consent, confidentiality, debriefing, use of animals); descriptive versus inferential statistics; central tendency and variability; statistical significance; operational definitions; independent and dependent variables; confounds; validity and reliability; how nature-nurture and levels of analysis frame psychological inquiry.",
 questionHooks: ["experimental design", "correlation vs causation", "ethics in research"],
 },
 {
 id: "psych-u2",
 index: 2,
 title: "Biological Bases of Behavior",
 summary:
 "Broca's and Wernicke's areas and expressive versus receptive aphasia; lesion methods and neuroimaging (CT, MRI, PET, fMRI, EEG, MEG); organization of the nervous system (CNS, PNS, somatic, autonomic, sympathetic versus parasympathetic); major structures (brainstem, cerebellum, basal ganglia, limbic system, thalamus, hypothalamus, hippocampus, cortex, association areas); lateralization and split-brain research; plasticity; neuron structure and glia; resting and action potentials; all-or-none law; saltatory conduction; synapses; agonists and antagonists; major neurotransmitters; reflex arc and neuron types; endocrine glands and hormones; genetics, molecular genetics, twin and adoption studies, heritability, genotype and phenotype, selected genetic conditions; evolutionary psychology as context; states of consciousness; sleep architecture (NREM, REM), dreams and major theories; sleep disorders; hypnosis; meditation; categories of psychoactive drugs and dependence.",
 questionHooks: ["brain structure and function", "neurotransmitters", "endocrine system"],
 },
 {
 id: "psych-u3",
 index: 3,
 title: "Sensation and Perception",
 summary:
 "Thresholds and signal detection; sensory adaptation; structure and function of vision and hearing; feature detection and parallel processing; Gestalt principles of form perception; depth and motion perception; perceptual constancies; attention and selective attention; bottom-up versus top-down processing; how internal factors (expectations, motivation, emotion, past experience) and external factors (culture, social context, physical environment) shape perception; misperceptions and context effects.",
 questionHooks: ["Gestalt principles", "depth perception", "top-down processing"],
 },
 {
 id: "psych-u4",
 index: 4,
 title: "Learning",
 summary:
 "Classical conditioning (Pavlov): acquisition, extinction, spontaneous recovery, generalization, discrimination, higher-order conditioning; applications and aversive conditioning; operant conditioning (Skinner): reinforcement and punishment (positive and negative), shaping, schedules of reinforcement (fixed/variable ratio and interval), effects on response rates; escape and avoidance learning; latent learning and cognitive maps; observational learning (Bandura): modeling, mirror-neuron ideas, prosocial versus antisocial examples; insight learning; biological constraints on learning.",
 questionHooks: ["classical vs operant", "reinforcement schedules", "observational learning"],
 },
 {
 id: "psych-u5",
 index: 5,
 title: "Cognitive Psychology",
 summary:
 "Information-processing model: encoding, storage, retrieval; sensory, working, and long-term memory; explicit versus implicit memory; models of long-term memory; encoding strategies (including levels of processing, rehearsal, mnemonics); forgetting (encoding failure, retrieval failure, interference, motivated forgetting); memory construction and misinformation; cognition: concepts and prototypes; problem solving and obstacles (confirmation bias, functional fixedness); decision making and heuristics (availability, representativeness); anchoring; intelligence theories and assessment debates; language structure (phonemes, morphemes, grammar); language acquisition and critical periods; thinking and creativity in context.",
 questionHooks: ["working memory", "interference and forgetting", "heuristics and biases"],
 },
 {
 id: "psych-u6",
 index: 6,
 title: "Developmental Psychology",
 summary:
 "Research designs (cross-sectional, longitudinal, sequential); prenatal development and teratogens; newborn reflexes; developmental theories across the lifespan; Piaget's stages and cognitive tasks; Vygotsky (ZPD, scaffolding, cultural tools); information-processing views of development; Erikson's psychosocial stages; attachment theory (Bowlby, Ainsworth strange situation, attachment styles); parenting styles; Harlow and contact comfort; gender development and identity; Kohlberg's moral reasoning; theories of aging; stability and change; continuity versus stages; key developmental milestones and studies.",
 questionHooks: ["Piaget stages", "attachment styles", "Vygotsky ZPD"],
 },
 {
 id: "psych-u7",
 index: 7,
 title: "Motivation, Emotion, and Personality",
 summary:
 "Motivation: instinct, drive-reduction, arousal, incentive, hierarchy of needs, intrinsic versus extrinsic motivation, achievement motivation; hunger and regulation; emotion theories (James-Lange, Cannon-Bard, Schachter-Singer two-factor, Lazarus appraisal); physiology and expression of emotion (including universality and display rules); stress: stressors, cognitive appraisal (primary and secondary), general adaptation syndrome (alarm, resistance, exhaustion), problem-focused versus emotion-focused coping, perceived control; personality: psychodynamic theory (Freud: id, ego, superego, defense mechanisms, psychosexual stages); neo-Freudians; humanistic theories (Rogers, Maslow); trait models (Big Five); social-cognitive theory (Bandura: reciprocal determinism, self-efficacy); assessment of personality; locus of control.",
 questionHooks: ["defense mechanisms", "Big Five traits", "stress and coping"],
 },
 {
 id: "psych-u8",
 index: 8,
 title: "Clinical Psychology",
 summary:
 "Defining and classifying disorders; anxiety-related disorders; obsessive-compulsive and trauma-related disorders; depressive and bipolar disorders; schizophrenia spectrum; dissociative and somatic symptom-related disorders; feeding and eating disorders; personality disorders (overview); substance-related and addictive disorders (overview); historical and modern psychotherapy (psychoanalysis, humanistic, behavior, cognitive, CBT, group and family); biomedical therapies (drug classes, ECT, newer brain stimulation); therapeutic alliance; prevention; mind-body connections (for example psychoneuroimmunology) and wellness; understanding mental health care in context; stigma and barriers to care.",
 questionHooks: ["CBT basics", "anxiety vs mood disorders", "therapy modalities"],
 },
 {
 id: "psych-u9",
 index: 9,
 title: "Social Psychology",
 summary:
 "Person perception; attribution theory (dispositional versus situational, fundamental attribution error, actor-observer bias, self-serving bias); attitudes and behavior; cognitive dissonance (Festinger); persuasion (central versus peripheral route, foot-in-the-door, door-in-the-face); conformity (Asch); obedience (Milgram); group influence (social facilitation, social loafing, deindividuation, group polarization, groupthink); prosocial behavior (bystander effect, altruism); aggression; prejudice, discrimination, and stereotypes; attraction and relationships.",
 questionHooks: ["fundamental attribution error", "conformity vs obedience", "cognitive dissonance"],
 },
 ],
 "hum-geo": [
 {
 id: "hum-geo-u1",
 index: 1,
 title: "Thinking Geographically",
 summary:
 "Space, place, and scale; absolute and relative location; site and situation; distance decay and space-time compression; formal, functional, and perceptual regions; patterns and density; diffusion types; map types, projections, GIS/GPS, and models as geographic abstractions.",
 },
 {
 id: "hum-geo-u2",
 index: 2,
 title: "Population and Migration Patterns and Processes",
 summary:
 "Population structure and change: birth and death rates, natural increase, fertility, migration, and population pyramids; demographic and epidemiological transition ideas; Malthusian and sustainability debates; migration types, push and pull factors, and policy contexts.",
 },
 {
 id: "hum-geo-u3",
 index: 3,
 title: "Cultural Patterns and Processes",
 summary:
 "Culture regions and diffusion; language families and lingua francas; religion and sacred space; ethnicity and identity; folk and popular culture; architecture and the cultural landscape; acculturation, assimilation, syncretism, and globalization of culture.",
 },
 {
 id: "hum-geo-u4",
 index: 4,
 title: "Political Patterns and Processes",
 summary:
 "Territorial states, nations, and nationalism; boundaries and border disputes; enclaves and exclaves; maritime zones under UNCLOS; federal and unitary systems; devolution and supranational organizations; electoral geography and gerrymandering; geopolitics and conflict.",
 },
 {
 id: "hum-geo-u5",
 index: 5,
 title: "Agriculture and Rural Land-Use Patterns",
 summary:
 "Subsistence and commercial systems; intensive and extensive land use; agricultural revolutions and the Columbian Exchange; Von Thunen and land rent; environmental impacts (irrigation, salinization, desertification); global commodity chains, alternatives, and development debates.",
 },
 {
 id: "hum-geo-u6",
 index: 6,
 title: "Cities and Urban Land-Use Patterns",
 summary:
 "Urban hierarchy and central place concepts; North American models (concentric, sector, multiple nuclei, galactic/peripheral); world regional city models; suburbanization, sprawl, and new urbanist responses; segregation, gentrification, sustainability, and transportation.",
 },
 {
 id: "hum-geo-u7",
 index: 7,
 title: "Industrial and Economic Development Patterns",
 summary:
 "Economic sectors and globalization; measures of development (GNI, HDI, inequality); industrial location and supply chains; development theories; foreign investment and trade; regional industrial cores and shifting geographies of production and services.",
 },
 ],
 lang: U("lang", [
 "Rhetorical Situation",
 "Claims and Evidence",
 "Reasoning and Organization",
 "Style",
 "Reading Arguments",
 "Writing Arguments",
 "Research and Synthesis",
 "Revision and Reflection",
 ]),
 lit: U("lit", [
 "Short Fiction",
 "Poetry",
 "Longer Fiction or Drama",
 "Literary Argument",
 "Reading Complex Texts",
 "Figurative Language and Structure",
 "Characterization and Setting",
 "Themes Across Texts",
 ]),
 "art-hist": U("art-hist", [
 "Global Prehistory",
 "The Ancient Mediterranean",
 "Early Europe and Colonial Americas",
 "Later Europe and Americas",
 "Indigenous Americas",
 "Africa",
 "West and Central Asia",
 "South, East, and Southeast Asia",
 "The Pacific",
 "Global Contemporary",
 ]),
 "art-design": U("art-design", [
 "Inquiry and Investigation",
 "Making and Practice",
 "Experimentation and Revision",
 "Communication and Presentation",
 "Sustained Investigation Documentation",
 "Selected Works",
 "Reflection and Critique",
 "Connecting to Context",
 ]),
 music: U("music", [
 "Fundamentals: Pitch and Rhythm",
 "Scales, Keys, and Modes",
 "Harmony and Voice Leading",
 "Chord Function and Progressions",
 "Melodic Organization",
 "Texture and Form",
 "Aural Skills: Dictation",
 "Aural Skills: Sight-singing",
 ]),
 spanish: U("spanish", [
 "Families and Communities",
 "Personal and Public Identities",
 "Beauty and Aesthetics",
 "Science and Technology",
 "Contemporary Life",
 "Global Challenges",
 "Interpretive Communication",
 "Interpersonal Communication",
 "Presentational Communication",
 ]),
 french: U("french", [
 "Families and Communities",
 "Personal and Public Identities",
 "Beauty and Aesthetics",
 "Science and Technology",
 "Contemporary Life",
 "Global Challenges",
 "Interpretive Communication",
 "Interpersonal Communication",
 "Presentational Communication",
 ]),
 german: U("german", [
 "Families and Communities",
 "Personal and Public Identities",
 "Beauty and Aesthetics",
 "Science and Technology",
 "Contemporary Life",
 "Global Challenges",
 "Interpretive Communication",
 "Interpersonal Communication",
 "Presentational Communication",
 ]),
 latin: U("latin", [
 "Reading and Comprehension",
 "Grammar and Syntax",
 "Figures of Speech and Style",
 "Culture and Context",
 "Sight Reading",
 "Meter and Scansion",
 "Essay and Analysis",
 "Vergil and Caesar Skills",
 ]),
 chinese: U("chinese", [
 "Families and Communities",
 "Personal and Public Identities",
 "Beauty and Aesthetics",
 "Science and Technology",
 "Contemporary Life",
 "Global Challenges",
 "Interpretive Communication",
 "Interpersonal Communication",
 "Presentational Communication",
 ]),
 japanese: U("japanese", [
 "Families and Communities",
 "Personal and Public Identities",
 "Beauty and Aesthetics",
 "Science and Technology",
 "Contemporary Life",
 "Global Challenges",
 "Interpretive Communication",
 "Interpersonal Communication",
 "Presentational Communication",
 ]),
 seminar: U("seminar", [
 "Question and Explore",
 "Understand and Analyze",
 "Evaluate Multiple Perspectives",
 "Synthesize Ideas",
 "Teamwork and Collaboration",
 "Individual Research",
 "Presentation and Defense",
 "Reflection",
 ]),
 research: U("research", [
 "Topic Exploration",
 "Preliminary Research",
 "Literature Review",
 "Methodology Design",
 "Data Collection",
 "Analysis and Interpretation",
 "Writing the Academic Paper",
 "Presentation and Defense",
 ]),
};
