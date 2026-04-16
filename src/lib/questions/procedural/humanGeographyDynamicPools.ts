/**
 * Parametric human geography items - stems and distractors vary by RNG.
 */
import { geoMc, type GeoQuestionGen } from "./humanGeographyCore";
import { pick, pickThreeDistinct } from "./utils";

const WRONG_SPATIAL = [
 "places have no measurable relationship to one another",
 "distance never affects interaction",
 "maps cannot represent any quantitative data",
 "scale is irrelevant when comparing two maps",
 "regions must always have identical borders on every map",
] as const;

const WRONG_POP = [
 "birth rates never change over time",
 "migration cannot affect population totals",
 "the crude death rate ignores deaths entirely",
 "population pyramids show only land area, not people",
 "natural increase always equals total population growth including migration",
] as const;

const WRONG_CULT = [
 "culture is fixed and never blends across groups",
 "languages never diffuse across borders",
 "built landscapes never reflect belief or identity",
 "folk culture and popular culture are identical in every place",
 "toponyms are assigned randomly with no social meaning",
] as const;

const WRONG_POL = [
 "sovereignty means a state has no defined territory",
 "international boundaries are never disputed",
 "supranational organizations eliminate all national laws",
 "EEZs extend unlimited distance from shore",
 "enclaves are always located in the ocean",
] as const;

const WRONG_AG = [
 "intensive farming always uses very large land areas per worker",
 "subsistence farming never occurs in rural areas",
 "irrigation cannot change which land is farmed",
 "plantation crops are never exported",
 "Von Thunen's model ignores distance to market",
] as const;

const WRONG_URB = [
 "the CBD typically has the lowest land values in a city",
 "suburbanization always shrinks metropolitan populations",
 "gentrification never changes neighborhood demographics",
 "Christaller's central place theory ignores settlement spacing",
 "edge cities require a traditional downtown city government",
] as const;

const WRONG_ECON = [
 "tertiary sector jobs never involve services",
 "GNI per capita ignores population size entirely",
 "core regions in world-systems theory are always the least developed",
 "commodity chains end at the farm gate",
 "footloose industries must locate next to a single raw material",
] as const;

function wrong3(rng: () => number, pool: readonly string[], correct: string): [string, string, string] {
 return pickThreeDistinct(rng, [...pool], correct);
}

/** Rotate MCQ stem openings so items feel less templated across sessions. */
function pickStem(rng: () => number, variants: readonly string[]): string {
 return pick(rng, variants);
}

export const HG_U1_DYNAMIC: GeoQuestionGen[] = [
 (rng, ctx, i) => {
 const concept = pick(rng, ["absolute location", "relative location", "site", "situation"]);
 const correct = pick(rng, [
 "it helps explain where something is or how it connects to other places",
 "it is used together with other locational ideas to describe place",
 "geographers pair it with distance and direction in analysis",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_SPATIAL, correct);
 const stem = pickStem(rng, [
 `In geographic analysis, ${concept} matters because`,
 `When you read a map prompt, ${concept} is worth foregrounding because`,
 `Which rationale best defends treating ${concept} as central here?`,
 `Unlike treating coordinates as decoration, ${concept} earns emphasis because`,
 `A grader-friendly answer notes ${concept} because`,
 `Think “locational toolkit”: ${concept} belongs in the discussion because`,
 ]);
 return geoMc(rng, ctx, i, `hg1-loc-${i}`, stem, correct, w1, w2, w3, "Location is analyzed with multiple complementary concepts.");
 },
 (rng, ctx, i) => {
 const type = pick(rng, ["formal", "functional (nodal)", "vernacular (perceptual)"]);
 const correct = pick(rng, [
 "it is defined by a shared characteristic, a node-and-flow logic, or collective perception - depending on the type",
 "its boundaries and criteria differ by whether uniformity, ties to a center, or mental maps dominate",
 "geographers choose the regional concept that matches the question they are asking",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_SPATIAL, correct);
 const stem = pickStem(rng, [
 `When classifying a ${type} region, the key point is that`,
 `On a regionalization item, labeling an area as ${type} signals that`,
 `Compared with mixing region types, calling a place a ${type} region implies that`,
 `Geographers separate ${type} regions from other labels because`,
 `Which completion fits best? A ${type} region is distinctive in that`,
 `A thematic map caption hints at ${type} logic; that choice reflects that`,
 ]);
 return geoMc(rng, ctx, i, `hg1-reg-${i}`, stem, correct, w1, w2, w3, "Formal, functional, and vernacular regions answer different geographic questions.");
 },
 (rng, ctx, i) => {
 const tool = pick(rng, ["GIS", "GPS", "remote sensing"]);
 const correct = pick(rng, [
 "it supports layering, measurement, and analysis of spatial data",
 "it helps map patterns and monitor change across the landscape",
 "it links coordinates, imagery, and attribute tables for decision-making",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_SPATIAL, correct);
 const stem = pickStem(rng, [
 `A typical strength of ${tool} for geographers is that`,
 `In a skills-based MCQ, ${tool} is praised because`,
 `Lab prompts often reward answers that ${tool} helps because`,
 `Which advantage of ${tool} is most “geographic” rather than purely technical?`,
 `Compared with paper-only mapping, ${tool} matters because`,
 `Field teams pair observations with ${tool} because`,
 ]);
 return geoMc(rng, ctx, i, `hg1-tech-${i}`, stem, correct, w1, w2, w3, "Geospatial technology combines location data with analysis and visualization.");
 },
 (rng, ctx, i) => {
 const pattern = pick(rng, ["clustered", "linear", "dispersed", "random"]);
 const correct = pick(rng, [
 "it describes how a phenomenon is arranged across space",
 "it can reflect purpose (e.g., agglomeration) or lack of order",
 "it is read alongside density and scale of analysis",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_SPATIAL, correct);
 const stem = pickStem(rng, [
 `Calling a distribution ${pattern} means that`,
 `If a dot map looks ${pattern}, geographers infer that`,
 `Which interpretation matches a ${pattern} arrangement?`,
 `A field sketch described as ${pattern} suggests that`,
 `At the scale shown, ${pattern} patterning indicates that`,
 `Compared with uniform spacing, a ${pattern} layout implies that`,
 ]);
 return geoMc(rng, ctx, i, `hg1-pat-${i}`, stem, correct, w1, w2, w3, "Spatial patterns summarize arrangement; density measures concentration.");
 },
 (rng, ctx, i) => {
 const diff = pick(rng, ["expansion", "relocation", "hierarchical", "contagious", "stimulus"]);
 const correct = pick(rng, [
 "the spread mechanism differs - nearby expansion vs movement across barriers vs cascade through an ordered network",
 "geographers match the diffusion type to how the idea or innovation moves",
 "the same innovation can show more than one diffusion process over time",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_SPATIAL, correct);
 const stem = pickStem(rng, [
 `Compared with other diffusion types, ${diff} diffusion is distinct because`,
 `A textbook contrasts ${diff} diffusion with others; the contrast works because`,
 `Which mechanism best defines ${diff} diffusion? It is distinctive because`,
 `In a case study, ${diff} diffusion shows up when`,
 `Modelers flag ${diff} diffusion separately because`,
 `Unlike vague “it spreads” answers, naming ${diff} diffusion matters because`,
 ]);
 return geoMc(rng, ctx, i, `hg1-diff-${i}`, stem, correct, w1, w2, w3, "Diffusion type captures how and where spread occurs.");
 },
 (rng, ctx, i) => {
 const topic = pick(rng, ["Mercator", "equal-area", "conic", "Robinson"]);
 const correct = pick(rng, [
 "each projection trades off shape, area, distance, and direction in different ways",
 "purpose (navigation vs thematic comparison) should drive projection choice",
 "no flat map preserves every globe property simultaneously",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_SPATIAL, correct);
 const stem = pickStem(rng, [
 `Teachers often ask why ${topic} projections spark debate; the geographic point is that`,
 `When you switch basemaps to ${topic}, the lesson is that`,
 `Which statement about ${topic} projections is most accurate?`,
 `Unlike assuming “all maps are neutral,” discussing ${topic} highlights that`,
 ]);
 return geoMc(rng, ctx, i, `hg1-proj-${i}`, stem, correct, w1, w2, w3, "Map projections encode unavoidable geometric trade-offs.");
 },
 (rng, ctx, i) => {
 const scale = pick(rng, ["local", "national", "global"]);
 const correct = pick(rng, [
 "changing scale changes what is aggregated and which processes look dominant",
 "patterns visible at one scale can disappear or reverse at another",
 "AP items often force you to justify the scale of analysis you chose",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_SPATIAL, correct);
 const stem = pickStem(rng, [
 `Zooming from neighborhood to ${scale} scale usually matters because`,
 `A student toggles scale to ${scale}; that move is defensible because`,
 `Which rationale supports analyzing this issue at a ${scale} scale?`,
 `Compared with staying only local, framing the case as ${scale} helps because`,
 ]);
 return geoMc(rng, ctx, i, `hg1-scale-${i}`, stem, correct, w1, w2, w3, "Scale of analysis shapes which patterns appear.");
 },
 (rng, ctx, i) => {
 const law = pick(rng, ["Tobler's first law", "distance decay", "spatial autocorrelation"]);
 const correct = pick(rng, [
 "near things tend to be more related than distant things in many geographic processes",
 "interaction and similarity often weaken with separation unless networks override distance",
 "modelers use these ideas to justify spatial dependence in data",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_SPATIAL, correct);
 const stem = pickStem(rng, [
 `In human geography, ${law} is invoked because`,
 `Which everyday pattern illustrates ${law} most clearly? The geographic logic is that`,
 `A quantitative geographer cites ${law} when arguing that`,
 `Unlike assuming independence between pixels, ${law} reminds us that`,
 `Field observations plus ${law} suggest that`,
 ]);
 return geoMc(rng, ctx, i, `hg1-law-${i}`, stem, correct, w1, w2, w3, "Core spatial statistics ideas describe how distance structures similarity.");
 },
];

export const HG_U2_DYNAMIC: GeoQuestionGen[] = [
 (rng, ctx, i) => {
 const stage = pick(rng, ["high birth and high death", "declining death rates while births stay high", "falling birth rates", "low birth and low death"]);
 const correct = pick(rng, [
 "it illustrates a stage-like shift in birth/death dynamics tied to development and health transitions",
 "demographers use it to interpret growth, aging, and migration pressures",
 "it connects fertility and mortality trends to population structure over time",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_POP, correct);
 const stem = pickStem(rng, [
 `In the demographic transition model, a country described as having ${stage} rates is typically interpreted as showing`,
 `A stylized DTM prompt lists ${stage} conditions; geographers read that as showing`,
 `Which interpretation matches ${stage} vital-rate patterns in the DTM framework?`,
 `Unlike mixing stages casually, ${stage} wording signals that`,
 `On a population unit quiz, ${stage} labels usually imply that`,
 ]);
 return geoMc(rng, ctx, i, `hg2-dtm-${i}`, stem, correct, w1, w2, w3, "DTM summarizes long-run shifts in vital rates.");
 },
 (rng, ctx, i) => {
 const m = pick(rng, ["step migration", "chain migration", "forced migration", "internal migration"]);
 const correct = pick(rng, [
 "it highlights how moves are staged, linked through networks, coerced, or contained within a state",
 "migration studies distinguish mechanisms because causes and policy responses differ",
 "the same person's move can be analyzed at multiple geographic scales",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_POP, correct);
 const stem = pickStem(rng, [
 `Emphasizing ${m} is useful because`,
 `A case narrative tagged as ${m} is instructive because`,
 `Which mechanism does ${m} foreground? It matters because`,
 `Compared with treating all moves as identical, ${m} framing helps because`,
 `Policy debates cite ${m} because`,
 ]);
 return geoMc(rng, ctx, i, `hg2-mig-${i}`, stem, correct, w1, w2, w3, "Migration typologies clarify process and scale.");
 },
 (rng, ctx, i) => {
 const x = pick(rng, ["total fertility rate", "dependency ratio", "rate of natural increase"]);
 const correct = pick(rng, [
 "it summarizes age structure, fertility behavior, or natural growth from vital statistics",
 "planners use it alongside migration data for schools, pensions, and labor supply",
 "it must be read with care about what is included (e.g., natural increase excludes net migration)",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_POP, correct);
 const stem = pickStem(rng, [
 `The measure ${x} is important in population geography because`,
 `When a stem cites ${x}, the geographic payoff is that`,
 `Which role does ${x} play in interpreting pyramids and growth?`,
 `Unlike anecdotal impressions, ${x} helps because`,
 `A county dashboard highlights ${x} because`,
 ]);
 return geoMc(rng, ctx, i, `hg2-msr-${i}`, stem, correct, w1, w2, w3, "Population metrics answer different questions.");
 },
 (rng, ctx, i) => {
 const push = pick(rng, [
 "conflict",
 "environmental stress",
 "job loss",
 "persecution",
 "economic despair",
 "natural hazard exposure",
 "housing insecurity",
 "political instability",
 "water insecurity",
 "land dispossession",
 ]);
 const correct = pick(rng, [
 "it raises emigration pressure from the origin",
 "it interacts with pull factors at destinations to shape flows",
 "it helps explain involuntary as well as voluntary movement",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_POP, correct);
 const stem = pickStem(rng, [
 `A strong push factor such as ${push} matters in migration studies because`,
 `If ${push} intensifies at origin, models predict that`,
 `Which narrative best illustrates ${push} operating as a classic push factor?`,
 `Compared with ignoring origin conditions, ${push} matters because`,
 `On a push-pull framing item, ${push} belongs on the origin side because`,
 `Field interviews citing ${push} as a reason to leave support the idea that`,
 `Policy analysts treat worsening ${push} as emigration pressure because`,
 `In a migration systems view, rising ${push} at origin tends to signal that`,
 ]);
 return geoMc(rng, ctx, i, `hg2-push-${i}`, stem, correct, w1, w2, w3, "Push-pull framing organizes migration drivers.");
 },
 (rng, ctx, i) => {
 const pyr = pick(rng, ["rapid growth with many young dependents", "slow growth with a bulging elderly cohort", "an echo from past baby booms"]);
 const correct = pick(rng, [
 "cohort size reflects past births, deaths, and sometimes shocks like wars",
 "the shape signals growth momentum and future support needs",
 "male and female bars are read symmetrically around age groups",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_POP, correct);
 const stem = pickStem(rng, [
 `A population pyramid showing ${pyr} suggests that`,
 `Given a pyramid described as ${pyr}, you can infer that`,
 `Which lesson follows from a ${pyr} silhouette?`,
 `Interpreting ${pyr} bars, demographers conclude that`,
 ]);
 return geoMc(rng, ctx, i, `hg2-pyr-${i}`, stem, correct, w1, w2, w3, "Pyramids visualize age-sex structure and momentum.");
 },
 (rng, ctx, i) => {
 const side = pick(rng, ["doubling time", "population momentum", "carrying capacity"]);
 const correct = pick(rng, [
 "each concept links growth arithmetic to different assumptions about limits and age structure",
 "momentum can keep totals rising even after fertility falls",
 "carrying capacity debates mix ecology, technology, and equity",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_POP, correct);
 const stem = pickStem(rng, [
 `In population theory, ${side} shows up on exams because`,
 `Which geographic insight does ${side} capture?`,
 `Compared with only counting people, ${side} forces students to explain that`,
 ]);
 return geoMc(rng, ctx, i, `hg2-gr-${i}`, stem, correct, w1, w2, w3, "Growth vocabulary spans rates, momentum, and limits.");
 },
 (rng, ctx, i) => {
 const pol = pick(rng, ["pro-natal policy", "anti-natal policy", "guest-worker programs"]);
 const correct = pick(rng, [
 "states try to steer fertility or labor supply with incentives, rules, and messaging",
 "outcomes depend on gender norms, economy, and civil rights context",
 "geographers map where policies concentrate and who is targeted",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_POP, correct);
 const stem = pickStem(rng, [
 `Analyzing ${pol} geographically matters because`,
 `A headline about ${pol} is best read through human geography because`,
 `Which spatial question does ${pol} raise?`,
 ]);
 return geoMc(rng, ctx, i, `hg2-pol-${i}`, stem, correct, w1, w2, w3, "Population policy is spatially uneven and contested.");
 },
];

export const HG_U3_DYNAMIC: GeoQuestionGen[] = [
 (rng, ctx, i) => {
 const rel = pick(rng, ["universalizing", "ethnic (traditional)"]);
 const correct = pick(rng, [
 "diffusion, sacred geographies, and political effects differ systematically",
 "membership and spread patterns are not the same across these broad categories",
 "landscapes of worship and pilgrimage vary with doctrine and history",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_CULT, correct);
 const stem = pickStem(rng, [
 `Geographers contrast ${rel} religious traditions partly because`,
 `Which geographic contrast is most important between ${rel} traditions?`,
 `On a landscape walk-through, ${rel} traditions differ because`,
 `A short answer scoring rubric rewards noting that ${rel} traditions diverge because`,
 `Unlike treating religion as uniform, separating ${rel} traditions matters because`,
 ]);
 return geoMc(rng, ctx, i, `hg3-rel-${i}`, stem, correct, w1, w2, w3, "Religion shapes landscapes and mobility.");
 },
 (rng, ctx, i) => {
 const ex = pick(rng, ["lingua franca", "dialect", "language family", "toponym"]);
 const correct = pick(rng, [
 "it structures communication, identity, and political boundaries on the map",
 "language geography links migration, empire, and everyday place naming",
 "distribution maps show contact zones and official vs unofficial usage",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_CULT, correct);
 const stem = pickStem(rng, [
 `Studying ${ex} is central to cultural geography because`,
 `Which map-layer question does ${ex} unlock?`,
 `Field notes on ${ex} pay off because`,
 `Compared with ignoring speech communities, ${ex} analysis helps because`,
 ]);
 return geoMc(rng, ctx, i, `hg3-lang-${i}`, stem, correct, w1, w2, w3, "Language is a core cultural trait with spatial patterns.");
 },
 (rng, ctx, i) => {
 const land = pick(rng, ["mosque minaret orientation", "steepled churches", "temple pagodas"]);
 const correct = pick(rng, [
 "sacred architecture makes belief visible in the built environment",
 "styles diffuse and adapt while retaining symbolic functions",
 "urban skylines often encode denominational histories",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_CULT, correct);
 const stem = pickStem(rng, [
 `Examples such as ${land} illustrate that`,
 `If a photo set features ${land}, cultural geographers argue that`,
 `Which claim about ${land} is best supported?`,
 `Walking tours highlighting ${land} make sense because`,
 ]);
 return geoMc(rng, ctx, i, `hg3-blt-${i}`, stem, correct, w1, w2, w3, "Architecture expresses culture on the landscape.");
 },
 (rng, ctx, i) => {
 const ch = pick(rng, ["acculturation", "assimilation", "syncretism"]);
 const correct = pick(rng, [
 "contact produces a spectrum from blending to full adoption of norms",
 "geographers track how traits change across generations and neighborhoods",
 "globalization accelerates hybrid cultural forms in many cities",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_CULT, correct);
 const stem = pickStem(rng, [
 `Processes like ${ch} matter for cultural geography because`,
 `A borderland case study featuring ${ch} shows that`,
 `Which mechanism does ${ch} describe? It matters because`,
 `Unlike static “culture areas,” ${ch} captures that`,
 ]);
 return geoMc(rng, ctx, i, `hg3-chg-${i}`, stem, correct, w1, w2, w3, "Culture changes through contact and power relations.");
 },
 (rng, ctx, i) => {
 const f = pick(rng, ["foodways", "music", "clothing"]);
 const correct = pick(rng, [
 "they diffuse globally while retaining local variants",
 "material culture is both economic and symbolic on the landscape",
 "popular culture can reshape consumption patterns in many regions at once",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_CULT, correct);
 const stem = pickStem(rng, [
 `Analyzing ${f} as cultural traits is useful because`,
 `Which spatial story do ${f} tell in a globalizing city?`,
 `Compared with only reading statistics, ${f} reveal that`,
 `A festival poster about ${f} is geographic evidence that`,
 ]);
 return geoMc(rng, ctx, i, `hg3-mat-${i}`, stem, correct, w1, w2, w3, "Culture is expressed materially and non-materially.");
 },
 (rng, ctx, i) => {
 const trait = pick(rng, ["gender roles in public space", "segregation of leisure venues", "cosmopolitanism in business districts"]);
 const correct = pick(rng, [
 "social norms and power shape who feels welcome where",
 "urban design encodes identity and can reproduce inequality",
 "cultural politics intersect with zoning, policing, and investment",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_CULT, correct);
 const stem = pickStem(rng, [
 `Urban cultural geographers study ${trait} because`,
 `Which question does ${trait} raise about justice and place?`,
 `Compared with treating cities as neutral containers, ${trait} shows that`,
 ]);
 return geoMc(rng, ctx, i, `hg3-urb-${i}`, stem, correct, w1, w2, w3, "Culture is spatially performed and regulated.");
 },
 (rng, ctx, i) => {
 const med = pick(rng, ["social media memes", "streaming platforms", "satellite television"]);
 const correct = pick(rng, [
 "time-space compression accelerates diffusion and hybridization",
 "gatekeepers and algorithms reshape who sees which cultural content",
 "digital geographies overlap with offline community boundaries",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_CULT, correct);
 const stem = pickStem(rng, [
 `Thinking geographically about ${med} matters because`,
 `Which diffusion pathway does ${med} most strongly amplify?`,
 `Unlike purely local oral tradition, ${med} changes culture because`,
 ]);
 return geoMc(rng, ctx, i, `hg3-dig-${i}`, stem, correct, w1, w2, w3, "Popular culture now moves through networked media.");
 },
];

export const HG_U4_DYNAMIC: GeoQuestionGen[] = [
 (rng, ctx, i) => {
 const b = pick(rng, ["antecedent", "subsequent", "superimposed", "relict"]);
 const correct = pick(rng, [
 "boundary origins shape later conflict potential and legitimacy claims",
 "some borders predate intensive settlement; others follow wars or colonial grids",
 "geographers classify processes to compare cases across world regions",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_POL, correct);
 const stem = pickStem(rng, [
 `In political geography, the label '${b}' (as a boundary type) highlights that`,
 `A map caption calls this border '${b}'; that classification stresses that`,
 `Which process does a '${b}' boundary story emphasize?`,
 `Compared with ignoring boundary genealogy, '${b}' matters because`,
 ]);
 return geoMc(rng, ctx, i, `hg4-bnd-${i}`, stem, correct, w1, w2, w3, "Boundary typologies describe how lines were created.");
 },
 (rng, ctx, i) => {
 const d = pick(rng, ["definitional", "locational", "operational", "allocational"]);
 const correct = pick(rng, [
 "disputes differ if treaties are ambiguous, rivers shift, crossings are restricted, or resources straddle the line",
 "states respond with diplomacy, arbitration, or escalation depending on the dispute type",
 "maps and documents are interpreted differently by each side in some conflicts",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_POL, correct);
 const stem = pickStem(rng, [
 `A ${d} border dispute is distinct because`,
 `Diplomacy briefings label a clash as ${d}; that label matters because`,
 `Which mechanism defines a ${d} dispute?`,
 `Unlike other border fights, ${d} cases hinge on the idea that`,
 ]);
 return geoMc(rng, ctx, i, `hg4-dis-${i}`, stem, correct, w1, w2, w3, "Border conflict types guide analysis.");
 },
 (rng, ctx, i) => {
 const org = pick(rng, ["European Union", "United Nations", "NATO"]);
 const correct = pick(rng, [
 "member states pool some authority for trade, security, or diplomacy while retaining sovereignty in other areas",
 "supranationalism changes flows of people, money, and rules across borders",
 "tensions arise between national policy and shared commitments",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_POL, correct);
 const stem = pickStem(rng, [
 `Organizations such as the ${org} illustrate that`,
 `A news clip about the ${org} is geographic because`,
 `Which sovereignty tension does the ${org} embody?`,
 `Compared with purely bilateral deals, the ${org} shows that`,
 ]);
 return geoMc(rng, ctx, i, `hg4-sup-${i}`, stem, correct, w1, w2, w3, "Supranational bodies reshape political geography.");
 },
 (rng, ctx, i) => {
 const t = pick(rng, ["EEZ (200 nautical miles)", "territorial sea (12 nautical miles)", "high seas"]);
 const correct = pick(rng, [
 "UNCLOS frameworks allocate resource rights and sovereignty differently by zone",
 "maritime claims affect fisheries, shipping, and offshore energy",
 "islands and rocks can dramatically extend maritime space when recognized",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_POL, correct);
 const stem = pickStem(rng, [
 `Under common UNCLOS readings, ${t} matters because`,
 `Which rights question does ${t} raise for coastal states?`,
 `Compared with land borders alone, ${t} zones show that`,
 `A fisheries conflict tied to ${t} spreads because`,
 ]);
 return geoMc(rng, ctx, i, `hg4-sea-${i}`, stem, correct, w1, w2, w3, "Ocean political geography is zoned.");
 },
 (rng, ctx, i) => {
 const gerry = pick(rng, ["packing supporters", "cracking opposition", "pairing odd shapes"]);
 const correct = pick(rng, [
 "district lines shape electoral outcomes and representation",
 "court and civil-society debates focus on compactness, communities of interest, and rights",
 "GIS makes gerrymandering easier to visualize and contest",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_POL, correct);
 const stem = pickStem(rng, [
 `Gerrymandering strategies like ${gerry} matter politically because`,
 `Which fairness critique targets tactics such as ${gerry}?`,
 `Redistricting hearings cite ${gerry} because`,
 `Unlike random district noise, ${gerry} is purposeful in that`,
 ]);
 return geoMc(rng, ctx, i, `hg4-ger-${i}`, stem, correct, w1, w2, w3, "Electoral geography links boundaries to power.");
 },
 (rng, ctx, i) => {
 const arrangement = pick(rng, ["unitary", "federal", "confederal"]);
 const correct = pick(rng, [
 "power is divided differently between capital and regions, with different conflict patterns",
 "maps of autonomy, revenue sharing, and policing reflect the arrangement",
 "students compare how policies travel (or stall) across scales",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_POL, correct);
 const stem = pickStem(rng, [
 `Comparing ${arrangement} states geographically matters because`,
 `Which service-delivery story fits ${arrangement} design?`,
 `A protest slogan about ${arrangement} power hints that`,
 ]);
 return geoMc(rng, ctx, i, `hg4-gov-${i}`, stem, correct, w1, w2, w3, "Government structure shapes spatial politics.");
 },
];

export const HG_U5_DYNAMIC: GeoQuestionGen[] = [
 (rng, ctx, i) => {
 const pr = pick(rng, ["shifting cultivation", "pastoral nomadism", "intensive wet rice", "plantation export"]);
 const correct = pick(rng, [
 "labor, land, technology, and environmental risk combine differently in each system",
 "sustainability concerns vary with population pressure and market ties",
 "geographers classify systems to compare development and environmental impacts",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_AG, correct);
 const stem = pickStem(rng, [
 `Contrasting ${pr} with other agricultural systems shows that`,
 `A field sketch labeled ${pr} is teaching you that`,
 `Which livelihood pattern does ${pr} best exemplify?`,
 `Compared with textbook generalities, ${pr} forces attention to the fact that`,
 ]);
 return geoMc(rng, ctx, i, `hg5-sys-${i}`, stem, correct, w1, w2, w3, "Agricultural geography compares livelihood strategies.");
 },
 (rng, ctx, i) => {
 const ring = pick(rng, ["dairy and market gardening", "extensive grain", "ranching or forestry"]);
 const correct = pick(rng, [
 "land rent and transport costs sort activities around a central market in idealized models",
 "perishable or bulky products compete for locations near consumers when assumptions hold",
 "real landscapes modify the pattern with roads, subsidies, and technology",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_AG, correct);
 const stem = pickStem(rng, [
 `In Von Thunen-style thinking, placing ${ring} closer to or farther from town illustrates that`,
 `A ring diagram with ${ring} near or far from the CBD implies that`,
 `Which bid-rent story matches ${ring} placement?`,
 `Unlike random rings, ${ring} location in the model signals that`,
 ]);
 return geoMc(rng, ctx, i, `hg5-vt-${i}`, stem, correct, w1, w2, w3, "Bid-rent logic structures rural land use in the model.");
 },
 (rng, ctx, i) => {
 const g = pick(rng, ["high-yield varieties", "fertilizer", "irrigation expansion"]);
 const correct = pick(rng, [
 "yield gains can reduce hunger but raise environmental and equity questions",
 "diffusion is uneven and depends on capital, institutions, and farm size",
 "dependency on inputs can increase risk for smallholders",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_AG, correct);
 const stem = pickStem(rng, [
 `Debates about the Green Revolution often focus on how ${g}`,
 `Which trade-off does ${g} introduce in agrarian landscapes?`,
 `Extension agents promote ${g}; geographers ask whether`,
 `Compared with low-input farming, ${g} shifts outcomes because`,
 ]);
 return geoMc(rng, ctx, i, `hg5-gr-${i}`, stem, correct, w1, w2, w3, "Modernization of farming has mixed outcomes.");
 },
 (rng, ctx, i) => {
 const iss = pick(rng, ["aquifer depletion", "soil salinization", "desertification", "loss of biodiversity"]);
 const correct = pick(rng, [
 "intensive resource use can degrade supporting ecosystems over time",
 "sustainability links local farming practices to global commodity demand",
 "policy and technology can mitigate - but not always eliminate - harm",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_AG, correct);
 const stem = pickStem(rng, [
 `Environmental issues such as ${iss} connect to agriculture because`,
 `Which feedback loop ties farming to ${iss}?`,
 `Satellite imagery of ${iss} supports the claim that`,
 `Unlike blaming farmers alone, ${iss} debates show that`,
 ]);
 return geoMc(rng, ctx, i, `hg5-env-${i}`, stem, correct, w1, w2, w3, "Human-environment interactions shape rural outcomes.");
 },
 (rng, ctx, i) => {
 const c = pick(rng, ["fair trade labels", "organic certification", "local food networks"]);
 const correct = pick(rng, [
 "consumers use standards to signal values about labor and ecology",
 "farmers may receive premiums but face auditing and market access hurdles",
 "geography of networks affects who benefits along the chain",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_AG, correct);
 const stem = pickStem(rng, [
 `Movements emphasizing ${c} reflect`,
 `Which market geography lesson follows from ${c}?`,
 `A farmers-market flyer about ${c} suggests that`,
 `Compared with anonymous global sourcing, ${c} networks reveal that`,
 ]);
 return geoMc(rng, ctx, i, `hg5-alt-${i}`, stem, correct, w1, w2, w3, "Alternative food systems respond to globalization of agriculture.");
 },
 (rng, ctx, i) => {
 const crop = pick(rng, ["coffee", "cocoa", "tea", "sugar"]);
 const correct = pick(rng, [
 "value chains link tropical producers to distant consumers with unequal bargaining power",
 "price volatility and climate risk concentrate in origin landscapes",
 "certification and cooperatives try to redistribute benefits upstream",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_AG, correct);
 const stem = pickStem(rng, [
 `Teaching commodity chains with ${crop} works because`,
 `Which geographic injustice shows up in ${crop} markets?`,
 `Tracing ${crop} from farm gate to supermarket shelf shows that`,
 ]);
 return geoMc(rng, ctx, i, `hg5-comm-${i}`, stem, correct, w1, w2, w3, "Cash crops tie regions through trade and labor.");
 },
];

export const HG_U6_DYNAMIC: GeoQuestionGen[] = [
 (rng, ctx, i) => {
 const m = pick(rng, ["concentric zone", "sector", "multiple nuclei", "peripheral (galactic)"]);
 const correct = pick(rng, [
 "each model stresses different forces: distance rings, corridors, many centers, or decentralization",
 "real cities combine elements; models are idealizations for teaching and comparison",
 "history, industry, and policy reshape land use from any single diagram",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_URB, correct);
 const stem = pickStem(rng, [
 `Compared with other ideal types, a ${m} model of urban structure highlights that`,
 `Which simplifying assumption does a ${m} diagram foreground?`,
 `A metro planning class uses the ${m} model because`,
 `Unlike treating downtown as random, ${m} logic claims that`,
 ]);
 return geoMc(rng, ctx, i, `hg6-mdl-${i}`, stem, correct, w1, w2, w3, "Urban models simplify complex North American and global patterns.");
 },
 (rng, ctx, i) => {
 const z = pick(rng, ["Latin American city", "Southeast Asian city", "Sub-Saharan African city"]);
 const correct = pick(rng, [
 "colonial histories, informality, and resource economies leave distinctive spatial signatures",
 "models help compare elite spines, market zones, and squatter peripheries",
 "rapid growth stresses infrastructure and services in different ways than U.S. suburbs",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_URB, correct);
 const stem = pickStem(rng, [
 `World regional models such as the ${z} model are useful because`,
 `Which street-level pattern does the ${z} model anticipate?`,
 `Compared with a generic CBD sketch, the ${z} model stresses that`,
 ]);
 return geoMc(rng, ctx, i, `hg6-wd-${i}`, stem, correct, w1, w2, w3, "Urban form varies globally.");
 },
 (rng, ctx, i) => {
 const x = pick(rng, ["threshold", "range", "hierarchy of services"]);
 const correct = pick(rng, [
 "central place theory links settlement size to the spacing of goods and services",
 "firms locate where demand can support fixed costs (threshold) within travel tolerance (range)",
 "nested hexagonal patterns are a teaching ideal, not a literal map of all places",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_URB, correct);
 const stem = pickStem(rng, [
 `In central place theory, ideas like ${x} matter because`,
 `Which grocery-store spacing puzzle does ${x} address?`,
 `A chain closes rural outlets; ${x} explains that`,
 `Unlike random store scatter, ${x} predicts that`,
 ]);
 return geoMc(rng, ctx, i, `hg6-cpt-${i}`, stem, correct, w1, w2, w3, "Christaller-style analysis explains service hierarchies.");
 },
 (rng, ctx, i) => {
 const s = pick(rng, ["suburban sprawl", "smart growth", "transit-oriented development"]);
 const correct = pick(rng, [
 "land-use rules and infrastructure investments steer density and commuting",
 "environmental and equity outcomes differ sharply across metro areas",
 "political fragmentation makes coordinated planning difficult in many regions",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_URB, correct);
 const stem = pickStem(rng, [
 `Planning debates over ${s} show that`,
 `Which metro-scale trade-off does ${s} target?`,
 `Compared with laissez-faire expansion, ${s} advocates argue that`,
 `A zoning map rewrite for ${s} signals that`,
 ]);
 return geoMc(rng, ctx, i, `hg6-pln-${i}`, stem, correct, w1, w2, w3, "Urban policy shapes spatial structure.");
 },
 (rng, ctx, i) => {
 const p = pick(rng, ["filtering of housing", "invasion-succession", "redlining's legacy"]);
 const correct = pick(rng, [
 "neighborhood change is driven by economics, discrimination, and investment cycles",
 "segregation patterns reflect both past policy and ongoing market forces",
 "urban social geography links identity to place-based opportunity",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_URB, correct);
 const stem = pickStem(rng, [
 `Concepts such as ${p} help explain`,
 `Which lived experience does ${p} illuminate on the map?`,
 `Compared with color-blind narratives, ${p} insists that`,
 `A block-by-block story about ${p} shows that`,
 ]);
 return geoMc(rng, ctx, i, `hg6-soc-${i}`, stem, correct, w1, w2, w3, "Cities are socially as well as economically segmented.");
 },
 (rng, ctx, i) => {
 const issue = pick(rng, ["heat islands", "food deserts", "transit deserts"]);
 const correct = pick(rng, [
 "environmental and service inequalities cluster spatially with land value and politics",
 "infrastructure investment is uneven and reflects historical decisions",
 "community advocacy maps where burdens concentrate",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_URB, correct);
 const stem = pickStem(rng, [
 `Urban environmental justice often begins by mapping ${issue} because`,
 `Which policy lever responds to ${issue}?`,
 `Compared with citywide averages, ${issue} hotspots reveal that`,
 ]);
 return geoMc(rng, ctx, i, `hg6-ej-${i}`, stem, correct, w1, w2, w3, "Urban problems have uneven geographies.");
 },
];

export const HG_U7_DYNAMIC: GeoQuestionGen[] = [
 (rng, ctx, i) => {
 const sec = pick(rng, ["primary", "secondary", "tertiary", "quaternary"]);
 const correct = pick(rng, [
 "employment and value added shift with development and trade",
 "sectoral structure affects wages, volatility, and environmental pressure",
 "cross-national comparisons use consistent sector definitions with some blur at edges",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_ECON, correct);
 const stem = pickStem(rng, [
 `Tracking the ${sec} sector's share of jobs matters because`,
 `Which structural shift shows up when the ${sec} sector grows?`,
 `Compared with only looking at GDP totals, ${sec} employment reveals that`,
 `A jobs map dominated by ${sec} work suggests that`,
 ]);
 return geoMc(rng, ctx, i, `hg7-sec-${i}`, stem, correct, w1, w2, w3, "Economic sectors structure development patterns.");
 },
 (rng, ctx, i) => {
 const th = pick(rng, ["Rostow's stages", "dependency theory", "Wallerstein's world-systems"]);
 const correct = pick(rng, [
 "each framework highlights different causes of uneven development and policy levers",
 "they are debated; real histories mix trade, institutions, and power relations",
 "geographers use theory to ask where extraction, manufacturing, and services concentrate",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_ECON, correct);
 const stem = pickStem(rng, [
 `Development theories such as ${th} are taught in geography because`,
 `Which power relation does ${th} foreground?`,
 `Unlike one-indicator rankings, ${th} encourages students to argue that`,
 `A debate clip citing ${th} is geographic when it shows that`,
 ]);
 return geoMc(rng, ctx, i, `hg7-th-${i}`, stem, correct, w1, w2, w3, "Multiple lenses explain global inequality.");
 },
 (rng, ctx, i) => {
 const f = pick(rng, ["export processing zones", "special economic zones", "offshore outsourcing"]);
 const correct = pick(rng, [
 "states compete for investment with rules, infrastructure, and labor costs",
 "global production networks slice tasks across borders",
 "benefits and labor conditions vary widely by site and sector",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_ECON, correct);
 const stem = pickStem(rng, [
 `Patterns like ${f} show that`,
 `Which map of flows does ${f} belong on?`,
 `Compared with autarky, ${f} arrangements imply that`,
 `Labor advocates criticize ${f} when they claim that`,
 ]);
 return geoMc(rng, ctx, i, `hg7-fdi-${i}`, stem, correct, w1, w2, w3, "FDI and trade policy reshape economic geography.");
 },
 (rng, ctx, i) => {
 const ind = pick(rng, ["weight-losing smelting near ore", "weight-gaining assembly near consumers", "just-in-time supplier networks"]);
 const correct = pick(rng, [
 "transport minimization and supply-chain timing influence plant location",
 "Weber-style reasoning persists in modified form in industry studies",
 "footloose sectors care more about skills and institutions than raw materials",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_ECON, correct);
 const stem = pickStem(rng, [
 `Industrial location examples such as ${ind} illustrate that`,
 `Which cost curve story matches ${ind}?`,
 `Compared with random plant scatter, ${ind} follows the logic that`,
 ]);
 return geoMc(rng, ctx, i, `hg7-loc-${i}`, stem, correct, w1, w2, w3, "Location theory explains spatial cost logic.");
 },
 (rng, ctx, i) => {
 const m = pick(rng, ["HDI", "GNI per capita (PPP)", "Gini coefficient"]);
 const correct = pick(rng, [
 "each indicator captures wellbeing or inequality with different blind spots",
 "composite indices combine health, education, and income in standardized ways",
 "geographers pair metrics with qualitative context about local costs and politics",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_ECON, correct);
 const stem = pickStem(rng, [
 `Using measures like ${m} to compare countries requires care because`,
 `Which misread of ${m} do graders penalize?`,
 `Unlike ranking countries by vibe alone, ${m} pushes analysts to admit that`,
 `A dashboard that only shows ${m} can mislead because`,
 ]);
 return geoMc(rng, ctx, i, `hg7-dev-${i}`, stem, correct, w1, w2, w3, "Development is multidimensional.");
 },
 (rng, ctx, i) => {
 const flow = pick(rng, ["remittances", "portfolio investment", "ODA (aid)"]);
 const correct = pick(rng, [
 "financial flows reshape consumption, construction, and dependency in receiving places",
 "geographers track who sends, who receives, and what strings attach",
 "scale matters: household remittances vs sovereign debt vs project aid",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_ECON, correct);
 const stem = pickStem(rng, [
 `Mapping ${flow} between countries matters because`,
 `Which development story hinges on ${flow}?`,
 `Compared with trade in goods alone, ${flow} shows that`,
 ]);
 return geoMc(rng, ctx, i, `hg7-fin-${i}`, stem, correct, w1, w2, w3, "Money moves across borders with geographic effects.");
 },
];
