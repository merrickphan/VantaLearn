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

export const HG_U1_DYNAMIC: GeoQuestionGen[] = [
 (rng, ctx, i) => {
 const concept = pick(rng, ["absolute location", "relative location", "site", "situation"]);
 const correct = pick(rng, [
 "it helps explain where something is or how it connects to other places",
 "it is used together with other locational ideas to describe place",
 "geographers pair it with distance and direction in analysis",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_SPATIAL, correct);
 return geoMc(rng, ctx, i, `hg1-loc-${i}`, `In geographic analysis, ${concept} matters because`, correct, w1, w2, w3, "Location is analyzed with multiple complementary concepts.");
 },
 (rng, ctx, i) => {
 const type = pick(rng, ["formal", "functional (nodal)", "vernacular (perceptual)"]);
 const correct = pick(rng, [
 "it is defined by a shared characteristic, a node-and-flow logic, or collective perception - depending on the type",
 "its boundaries and criteria differ by whether uniformity, ties to a center, or mental maps dominate",
 "geographers choose the regional concept that matches the question they are asking",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_SPATIAL, correct);
 return geoMc(rng, ctx, i, `hg1-reg-${i}`, `When classifying a ${type} region, the key point is that`, correct, w1, w2, w3, "Formal, functional, and vernacular regions answer different geographic questions.");
 },
 (rng, ctx, i) => {
 const tool = pick(rng, ["GIS", "GPS", "remote sensing"]);
 const correct = pick(rng, [
 "it supports layering, measurement, and analysis of spatial data",
 "it helps map patterns and monitor change across the landscape",
 "it links coordinates, imagery, and attribute tables for decision-making",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_SPATIAL, correct);
 return geoMc(rng, ctx, i, `hg1-tech-${i}`, `A typical strength of ${tool} for geographers is that`, correct, w1, w2, w3, "Geospatial technology combines location data with analysis and visualization.");
 },
 (rng, ctx, i) => {
 const pattern = pick(rng, ["clustered", "linear", "dispersed", "random"]);
 const correct = pick(rng, [
 "it describes how a phenomenon is arranged across space",
 "it can reflect purpose (e.g., agglomeration) or lack of order",
 "it is read alongside density and scale of analysis",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_SPATIAL, correct);
 return geoMc(rng, ctx, i, `hg1-pat-${i}`, `Calling a distribution ${pattern} means that`, correct, w1, w2, w3, "Spatial patterns summarize arrangement; density measures concentration.");
 },
 (rng, ctx, i) => {
 const diff = pick(rng, ["expansion", "relocation", "hierarchical", "contagious", "stimulus"]);
 const correct = pick(rng, [
 "the spread mechanism differs - nearby expansion vs movement across barriers vs cascade through an ordered network",
 "geographers match the diffusion type to how the idea or innovation moves",
 "the same innovation can show more than one diffusion process over time",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_SPATIAL, correct);
 return geoMc(rng, ctx, i, `hg1-diff-${i}`, `Compared with other diffusion types, ${diff} diffusion is distinct because`, correct, w1, w2, w3, "Diffusion type captures how and where spread occurs.");
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
 return geoMc(rng, ctx, i, `hg2-dtm-${i}`, `In the demographic transition model, a country described as having ${stage} rates is typically interpreted as showing`, correct, w1, w2, w3, "DTM summarizes long-run shifts in vital rates.");
 },
 (rng, ctx, i) => {
 const m = pick(rng, ["step migration", "chain migration", "forced migration", "internal migration"]);
 const correct = pick(rng, [
 "it highlights how moves are staged, linked through networks, coerced, or contained within a state",
 "migration studies distinguish mechanisms because causes and policy responses differ",
 "the same person's move can be analyzed at multiple geographic scales",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_POP, correct);
 return geoMc(rng, ctx, i, `hg2-mig-${i}`, `Emphasizing ${m} is useful because`, correct, w1, w2, w3, "Migration typologies clarify process and scale.");
 },
 (rng, ctx, i) => {
 const x = pick(rng, ["total fertility rate", "dependency ratio", "rate of natural increase"]);
 const correct = pick(rng, [
 "it summarizes age structure, fertility behavior, or natural growth from vital statistics",
 "planners use it alongside migration data for schools, pensions, and labor supply",
 "it must be read with care about what is included (e.g., natural increase excludes net migration)",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_POP, correct);
 return geoMc(rng, ctx, i, `hg2-msr-${i}`, `The measure ${x} is important in population geography because`, correct, w1, w2, w3, "Population metrics answer different questions.");
 },
 (rng, ctx, i) => {
 const push = pick(rng, ["conflict", "environmental stress", "job loss", "persecution"]);
 const correct = pick(rng, [
 "it raises emigration pressure from the origin",
 "it interacts with pull factors at destinations to shape flows",
 "it helps explain involuntary as well as voluntary movement",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_POP, correct);
 return geoMc(rng, ctx, i, `hg2-push-${i}`, `A strong push factor such as ${push} matters in migration studies because`, correct, w1, w2, w3, "Push-pull framing organizes migration drivers.");
 },
 (rng, ctx, i) => {
 const pyr = pick(rng, ["rapid growth with many young dependents", "slow growth with a bulging elderly cohort", "an echo from past baby booms"]);
 const correct = pick(rng, [
 "cohort size reflects past births, deaths, and sometimes shocks like wars",
 "the shape signals growth momentum and future support needs",
 "male and female bars are read symmetrically around age groups",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_POP, correct);
 return geoMc(rng, ctx, i, `hg2-pyr-${i}`, `A population pyramid showing ${pyr} suggests that`, correct, w1, w2, w3, "Pyramids visualize age-sex structure and momentum.");
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
 return geoMc(rng, ctx, i, `hg3-rel-${i}`, `Geographers contrast ${rel} religious traditions partly because`, correct, w1, w2, w3, "Religion shapes landscapes and mobility.");
 },
 (rng, ctx, i) => {
 const ex = pick(rng, ["lingua franca", "dialect", "language family", "toponym"]);
 const correct = pick(rng, [
 "it structures communication, identity, and political boundaries on the map",
 "language geography links migration, empire, and everyday place naming",
 "distribution maps show contact zones and official vs unofficial usage",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_CULT, correct);
 return geoMc(rng, ctx, i, `hg3-lang-${i}`, `Studying ${ex} is central to cultural geography because`, correct, w1, w2, w3, "Language is a core cultural trait with spatial patterns.");
 },
 (rng, ctx, i) => {
 const land = pick(rng, ["mosque minaret orientation", "steepled churches", "temple pagodas"]);
 const correct = pick(rng, [
 "sacred architecture makes belief visible in the built environment",
 "styles diffuse and adapt while retaining symbolic functions",
 "urban skylines often encode denominational histories",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_CULT, correct);
 return geoMc(rng, ctx, i, `hg3-blt-${i}`, `Examples such as ${land} illustrate that`, correct, w1, w2, w3, "Architecture expresses culture on the landscape.");
 },
 (rng, ctx, i) => {
 const ch = pick(rng, ["acculturation", "assimilation", "syncretism"]);
 const correct = pick(rng, [
 "contact produces a spectrum from blending to full adoption of norms",
 "geographers track how traits change across generations and neighborhoods",
 "globalization accelerates hybrid cultural forms in many cities",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_CULT, correct);
 return geoMc(rng, ctx, i, `hg3-chg-${i}`, `Processes like ${ch} matter for cultural geography because`, correct, w1, w2, w3, "Culture changes through contact and power relations.");
 },
 (rng, ctx, i) => {
 const f = pick(rng, ["foodways", "music", "clothing"]);
 const correct = pick(rng, [
 "they diffuse globally while retaining local variants",
 "material culture is both economic and symbolic on the landscape",
 "popular culture can reshape consumption patterns in many regions at once",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_CULT, correct);
 return geoMc(rng, ctx, i, `hg3-mat-${i}`, `Analyzing ${f} as cultural traits is useful because`, correct, w1, w2, w3, "Culture is expressed materially and non-materially.");
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
 return geoMc(
 rng,
 ctx,
 i,
 `hg4-bnd-${i}`,
 `In political geography, the label '${b}' (as a boundary type) highlights that`,
 correct,
 w1,
 w2,
 w3,
 "Boundary typologies describe how lines were created.",
 );
 },
 (rng, ctx, i) => {
 const d = pick(rng, ["definitional", "locational", "operational", "allocational"]);
 const correct = pick(rng, [
 "disputes differ if treaties are ambiguous, rivers shift, crossings are restricted, or resources straddle the line",
 "states respond with diplomacy, arbitration, or escalation depending on the dispute type",
 "maps and documents are interpreted differently by each side in some conflicts",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_POL, correct);
 return geoMc(rng, ctx, i, `hg4-dis-${i}`, `A ${d} border dispute is distinct because`, correct, w1, w2, w3, "Border conflict types guide analysis.");
 },
 (rng, ctx, i) => {
 const org = pick(rng, ["European Union", "United Nations", "NATO"]);
 const correct = pick(rng, [
 "member states pool some authority for trade, security, or diplomacy while retaining sovereignty in other areas",
 "supranationalism changes flows of people, money, and rules across borders",
 "tensions arise between national policy and shared commitments",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_POL, correct);
 return geoMc(rng, ctx, i, `hg4-sup-${i}`, `Organizations such as the ${org} illustrate that`, correct, w1, w2, w3, "Supranational bodies reshape political geography.");
 },
 (rng, ctx, i) => {
 const t = pick(rng, ["EEZ (200 nautical miles)", "territorial sea (12 nautical miles)", "high seas"]);
 const correct = pick(rng, [
 "UNCLOS frameworks allocate resource rights and sovereignty differently by zone",
 "maritime claims affect fisheries, shipping, and offshore energy",
 "islands and rocks can dramatically extend maritime space when recognized",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_POL, correct);
 return geoMc(rng, ctx, i, `hg4-sea-${i}`, `Under common UNCLOS readings, ${t} matters because`, correct, w1, w2, w3, "Ocean political geography is zoned.");
 },
 (rng, ctx, i) => {
 const gerry = pick(rng, ["packing supporters", "cracking opposition", "pairing odd shapes"]);
 const correct = pick(rng, [
 "district lines shape electoral outcomes and representation",
 "court and civil-society debates focus on compactness, communities of interest, and rights",
 "GIS makes gerrymandering easier to visualize and contest",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_POL, correct);
 return geoMc(rng, ctx, i, `hg4-ger-${i}`, `Gerrymandering strategies like ${gerry} matter politically because`, correct, w1, w2, w3, "Electoral geography links boundaries to power.");
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
 return geoMc(rng, ctx, i, `hg5-sys-${i}`, `Contrasting ${pr} with other agricultural systems shows that`, correct, w1, w2, w3, "Agricultural geography compares livelihood strategies.");
 },
 (rng, ctx, i) => {
 const ring = pick(rng, ["dairy and market gardening", "extensive grain", "ranching or forestry"]);
 const correct = pick(rng, [
 "land rent and transport costs sort activities around a central market in idealized models",
 "perishable or bulky products compete for locations near consumers when assumptions hold",
 "real landscapes modify the pattern with roads, subsidies, and technology",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_AG, correct);
 return geoMc(rng, ctx, i, `hg5-vt-${i}`, `In Von Thunen-style thinking, placing ${ring} closer to or farther from town illustrates that`, correct, w1, w2, w3, "Bid-rent logic structures rural land use in the model.");
 },
 (rng, ctx, i) => {
 const g = pick(rng, ["high-yield varieties", "fertilizer", "irrigation expansion"]);
 const correct = pick(rng, [
 "yield gains can reduce hunger but raise environmental and equity questions",
 "diffusion is uneven and depends on capital, institutions, and farm size",
 "dependency on inputs can increase risk for smallholders",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_AG, correct);
 return geoMc(rng, ctx, i, `hg5-gr-${i}`, `Debates about the Green Revolution often focus on how ${g}`, correct, w1, w2, w3, "Modernization of farming has mixed outcomes.");
 },
 (rng, ctx, i) => {
 const iss = pick(rng, ["aquifer depletion", "soil salinization", "desertification", "loss of biodiversity"]);
 const correct = pick(rng, [
 "intensive resource use can degrade supporting ecosystems over time",
 "sustainability links local farming practices to global commodity demand",
 "policy and technology can mitigate - but not always eliminate - harm",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_AG, correct);
 return geoMc(rng, ctx, i, `hg5-env-${i}`, `Environmental issues such as ${iss} connect to agriculture because`, correct, w1, w2, w3, "Human-environment interactions shape rural outcomes.");
 },
 (rng, ctx, i) => {
 const c = pick(rng, ["fair trade labels", "organic certification", "local food networks"]);
 const correct = pick(rng, [
 "consumers use standards to signal values about labor and ecology",
 "farmers may receive premiums but face auditing and market access hurdles",
 "geography of networks affects who benefits along the chain",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_AG, correct);
 return geoMc(rng, ctx, i, `hg5-alt-${i}`, `Movements emphasizing ${c} reflect`, correct, w1, w2, w3, "Alternative food systems respond to globalization of agriculture.");
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
 return geoMc(rng, ctx, i, `hg6-mdl-${i}`, `Compared with other ideal types, a ${m} model of urban structure highlights that`, correct, w1, w2, w3, "Urban models simplify complex North American and global patterns.");
 },
 (rng, ctx, i) => {
 const z = pick(rng, ["Latin American city", "Southeast Asian city", "Sub-Saharan African city"]);
 const correct = pick(rng, [
 "colonial histories, informality, and resource economies leave distinctive spatial signatures",
 "models help compare elite spines, market zones, and squatter peripheries",
 "rapid growth stresses infrastructure and services in different ways than U.S. suburbs",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_URB, correct);
 return geoMc(rng, ctx, i, `hg6-wd-${i}`, `World regional models such as the ${z} model are useful because`, correct, w1, w2, w3, "Urban form varies globally.");
 },
 (rng, ctx, i) => {
 const x = pick(rng, ["threshold", "range", "hierarchy of services"]);
 const correct = pick(rng, [
 "central place theory links settlement size to the spacing of goods and services",
 "firms locate where demand can support fixed costs (threshold) within travel tolerance (range)",
 "nested hexagonal patterns are a teaching ideal, not a literal map of all places",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_URB, correct);
 return geoMc(rng, ctx, i, `hg6-cpt-${i}`, `In central place theory, ideas like ${x} matter because`, correct, w1, w2, w3, "Christaller-style analysis explains service hierarchies.");
 },
 (rng, ctx, i) => {
 const s = pick(rng, ["suburban sprawl", "smart growth", "transit-oriented development"]);
 const correct = pick(rng, [
 "land-use rules and infrastructure investments steer density and commuting",
 "environmental and equity outcomes differ sharply across metro areas",
 "political fragmentation makes coordinated planning difficult in many regions",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_URB, correct);
 return geoMc(rng, ctx, i, `hg6-pln-${i}`, `Planning debates over ${s} show that`, correct, w1, w2, w3, "Urban policy shapes spatial structure.");
 },
 (rng, ctx, i) => {
 const p = pick(rng, ["filtering of housing", "invasion-succession", "redlining's legacy"]);
 const correct = pick(rng, [
 "neighborhood change is driven by economics, discrimination, and investment cycles",
 "segregation patterns reflect both past policy and ongoing market forces",
 "urban social geography links identity to place-based opportunity",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_URB, correct);
 return geoMc(rng, ctx, i, `hg6-soc-${i}`, `Concepts such as ${p} help explain`, correct, w1, w2, w3, "Cities are socially as well as economically segmented.");
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
 return geoMc(rng, ctx, i, `hg7-sec-${i}`, `Tracking the ${sec} sector's share of jobs matters because`, correct, w1, w2, w3, "Economic sectors structure development patterns.");
 },
 (rng, ctx, i) => {
 const th = pick(rng, ["Rostow's stages", "dependency theory", "Wallerstein's world-systems"]);
 const correct = pick(rng, [
 "each framework highlights different causes of uneven development and policy levers",
 "they are debated; real histories mix trade, institutions, and power relations",
 "geographers use theory to ask where extraction, manufacturing, and services concentrate",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_ECON, correct);
 return geoMc(rng, ctx, i, `hg7-th-${i}`, `Development theories such as ${th} are taught in geography because`, correct, w1, w2, w3, "Multiple lenses explain global inequality.");
 },
 (rng, ctx, i) => {
 const f = pick(rng, ["export processing zones", "special economic zones", "offshore outsourcing"]);
 const correct = pick(rng, [
 "states compete for investment with rules, infrastructure, and labor costs",
 "global production networks slice tasks across borders",
 "benefits and labor conditions vary widely by site and sector",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_ECON, correct);
 return geoMc(rng, ctx, i, `hg7-fdi-${i}`, `Patterns like ${f} show that`, correct, w1, w2, w3, "FDI and trade policy reshape economic geography.");
 },
 (rng, ctx, i) => {
 const ind = pick(rng, ["weight-losing smelting near ore", "weight-gaining assembly near consumers", "just-in-time supplier networks"]);
 const correct = pick(rng, [
 "transport minimization and supply-chain timing influence plant location",
 "Weber-style reasoning persists in modified form in industry studies",
 "footloose sectors care more about skills and institutions than raw materials",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_ECON, correct);
 return geoMc(rng, ctx, i, `hg7-loc-${i}`, `Industrial location examples such as ${ind} illustrate that`, correct, w1, w2, w3, "Location theory explains spatial cost logic.");
 },
 (rng, ctx, i) => {
 const m = pick(rng, ["HDI", "GNI per capita (PPP)", "Gini coefficient"]);
 const correct = pick(rng, [
 "each indicator captures wellbeing or inequality with different blind spots",
 "composite indices combine health, education, and income in standardized ways",
 "geographers pair metrics with qualitative context about local costs and politics",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_ECON, correct);
 return geoMc(rng, ctx, i, `hg7-dev-${i}`, `Using measures like ${m} to compare countries requires care because`, correct, w1, w2, w3, "Development is multidimensional.");
 },
];
