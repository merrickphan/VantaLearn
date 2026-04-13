import type { ApUnit } from "./types";

function U(
 courseId: string,
 defs: { title: string; summary: string; hooks: string[] }[]
): ApUnit[] {
 return defs.map((d, i) => ({
 id: `${courseId}-u${i + 1}`,
 index: i + 1,
 title: d.title,
 summary: d.summary,
 questionHooks: d.hooks,
 }));
}

/** Full unit lists aligned to typical College Board AP course frameworks */
export const AP_UNITS_BY_COURSE_ID: Record<string, ApUnit[]> = {
 "calc-ab": U("calc-ab", [
 { title: "Limits and Continuity", summary: "Limits, continuity, asymptotes, end behavior, intermediate value theorem.", hooks: ["limit laws", "piecewise limits", "continuity at a point", "asymptotic behavior"] },
 { title: "Differentiation: Definition and Properties", summary: "Derivative definition, basic rules, derivatives of sin/cos, product/quotient rules.", hooks: ["difference quotient", "power rule applications", "tangent line slopes", "higher derivatives"] },
 { title: "Differentiation: Composite and Implicit", summary: "Chain rule, implicit differentiation, derivatives of inverse functions.", hooks: ["chain rule nesting", "implicit slopes", "related rates setup", "inverse trig derivatives"] },
 { title: "Contextual Applications of Differentiation", summary: "Rates, motion, related rates, linear approximation, L'Hospital (AB scope).", hooks: ["motion along a line", "related rates geometry", "local linearization", "sensitivity"] },
 { title: "Analytical Applications of Differentiation", summary: "Mean value theorem, extrema, concavity, optimization, curve sketching.", hooks: ["first derivative test", "second derivative test", "optimization with constraints", "inflection points"] },
 { title: "Integration and Accumulation", summary: "Antiderivatives, definite integral, FTC, accumulation, average value.", hooks: ["FTC part 1/2", "accumulation from rate", "average value of function", "u-substitution intro"] },
 { title: "Differential Equations", summary: "Slope fields, separation of variables, exponential models, particular solutions.", hooks: ["slope field matching", "separable DE", "exponential growth/decay", "initial conditions"] },
 { title: "Applications of Integration", summary: "Area, volume with cross sections, accumulation in context.", hooks: ["area between curves", "disk/washer volume", "cross sections", "net change"] },
 ]),

 "calc-bc": U("calc-bc", [
 { title: "Limits and Continuity", summary: "Same foundations as AB - limits, continuity, asymptotes.", hooks: ["limits at infinity", "continuity", "IVT applications"] },
 { title: "Differentiation: Fundamentals", summary: "Derivative rules, chain rule, implicit differentiation.", hooks: ["derivative from definition", "chain rule depth", "implicit differentiation"] },
 { title: "Differentiation: Applications", summary: "Related rates, optimization, linear approximation.", hooks: ["optimization scenarios", "related rates classic", "approximation error"] },
 { title: "Integration and FTC", summary: "Definite integrals, FTC, accumulation, u-substitution.", hooks: ["FTC", "u-substitution", "average value"] },
 { title: "Differential Equations", summary: "Slope fields, Euler's method (BC), logistic models, separation.", hooks: ["logistic DE", "Euler steps", "separable equations"] },
 { title: "Applications of Integration", summary: "Area, volume, arc length, improper integrals introduction.", hooks: ["polar area (BC)", "volume methods", "arc length setup"] },
 { title: "Parametric, Polar, Vector", summary: "Parametric motion, polar curves, vector-valued derivatives.", hooks: ["parametric velocity", "polar area", "vector motion"] },
 { title: "Infinite Sequences and Series", summary: "Convergence tests, power series, Taylor/Maclaurin, Lagrange error.", hooks: ["ratio test", "Taylor polynomials", "interval of convergence", "error bounds"] },
 ]),

 precalc: U("precalc", [
 { title: "Polynomial and Rational Functions", summary: "Modeling, zeros, end behavior, rational functions.", hooks: ["zeros and factors", "rational asymptotes", "inequalities"] },
 { title: "Exponential, Logarithmic, and Trigonometric", summary: "Exponential models, log laws, trig functions and identities.", hooks: ["log equations", "trig identities", "sinusoidal models"] },
 { title: "Trigonometry, Polar, and Complex", summary: "Polar coordinates, vectors, complex numbers in polar form.", hooks: ["polar graphs", "vector components", "De Moivre"] },
 { title: "Sequences, Series, and Matrices", summary: "Arithmetic/geometric sequences, intro series, matrices as tools.", hooks: ["recursive sequences", "matrix operations", "partial sums"] },
 ]),

 stats: U("stats", [
 { title: "Exploring One-Variable Data", summary: "Distributions, center, spread, boxplots, histograms.", hooks: ["shape and outliers", "comparing spreads", "IQR vs SD"] },
 { title: "Exploring Two-Variable Data", summary: "Scatterplots, correlation, linear regression, residuals.", hooks: ["residual plots", "r vs slope", "influential points"] },
 { title: "Collecting Data", summary: "Sampling methods, experimental design, bias, randomization.", hooks: ["blocking", "confounding", "types of bias"] },
 { title: "Probability and Random Variables", summary: "Probability rules, discrete/continuous RV, combining RVs.", hooks: ["independence", "normal probability", "binomial conditions"] },
 { title: "Sampling Distributions", summary: "Central Limit Theorem, sampling distribution of mean/proportion.", hooks: ["CLT conditions", "standard error", "sampling variability"] },
 { title: "Inference for Proportions", summary: "Confidence intervals and tests for one/two proportions.", hooks: ["z-interval logic", "Type I/II", "conditions check"] },
 { title: "Inference for Means", summary: "t-procedures, paired differences, two-sample means.", hooks: ["paired vs two-sample", "df selection", "conditions"] },
 { title: "Chi-Square Tests", summary: "Goodness of fit, homogeneity, independence.", hooks: ["expected counts", "df for chi-square", "choosing the test"] },
 { title: "Inference for Slopes", summary: "Linear regression slope confidence intervals and tests.", hooks: ["slope CI", "residual conditions", "interpretation"] },
 ]),

 "cs-a": U("cs-a", [
 { title: "Primitive Types and Operators", summary: "int, double, boolean, String basics, arithmetic and casting.", hooks: ["integer division", "casting pitfalls", "boolean logic"] },
 { title: "Objects and Classes", summary: "References, constructors, methods, encapsulation.", hooks: ["this keyword", "null references", "method signatures"] },
 { title: "Boolean Expressions and Selection", summary: "if/else, compound conditions, De Morgan.", hooks: ["nested if", "short-circuit", "boundary cases"] },
 { title: "Iteration", summary: "while, for, nested loops, loop invariants intuition.", hooks: ["off-by-one", "nested iteration cost", "accumulator pattern"] },
 { title: "Writing Classes", summary: "Instance vs static, accessors, mutators, this.", hooks: ["class design", "private fields", "equals intent"] },
 { title: "Array", summary: "1D arrays, traversals, searching basics.", hooks: ["array bounds", "parallel arrays", "shift algorithms"] },
 { title: "ArrayList", summary: "List interface, generics, common algorithms.", hooks: ["remove while iterate", "searching ArrayList", "wrapper types"] },
 { title: "2D Array", summary: "Matrices, row-major traversal, algorithms on grids.", hooks: ["row vs column major", "boundary traversal", "submatrix ideas"] },
 { title: "Inheritance", summary: "Subclasses, polymorphism, abstract classes, interfaces.", hooks: ["dynamic binding", "cast and instanceof", "hierarchy design"] },
 { title: "Recursion", summary: "Base case, recursive calls, tracing, simple fractals/backtracking intro.", hooks: ["stack frames", "Fibonacci inefficiency", "recursive search"] },
 ]),

 csp: U("csp", [
 { title: "Creative Development", summary: "Program design, collaboration, development process.", hooks: ["iterative design", "documentation", "testing mindset"] },
 { title: "Data", summary: "Binary, data abstraction, compression, extracting information from data.", hooks: ["metadata", "lossy vs lossless", "patterns in data"] },
 { title: "Algorithms and Programming", summary: "Algorithms, abstraction, sequencing, selection, iteration.", hooks: ["efficiency intuition", "heuristics", "debugging"] },
 { title: "Computing Systems and Networks", summary: "Internet, routing, fault tolerance, parallel computing.", hooks: ["redundancy", "latency vs bandwidth", "parallel benefits"] },
 { title: "Impact of Computing", summary: "Legal, ethical, social, security, crowdsourcing, digital divide.", hooks: ["privacy tradeoffs", "bias in systems", "licensing"] },
 ]),

 "physics-1": U("physics-1", [
 { title: "Kinematics", summary: "1D/2D motion, graphs, projectile motion.", hooks: ["position-time slope", "projectile symmetry", "relative motion"] },
 { title: "Dynamics", summary: "Newton's laws, friction, free-body diagrams.", hooks: ["Atwood machines", "friction direction", "F=ma components"] },
 { title: "Circular Motion and Gravitation", summary: "Centripetal acceleration, universal gravitation, orbits.", hooks: ["banked curves", "satellite motion", "g variations"] },
 { title: "Energy", summary: "Work, kinetic/potential energy, conservation, power.", hooks: ["work by variable force", "energy graphs", "nonconservative work"] },
 { title: "Momentum", summary: "Impulse, conservation of momentum, collisions.", hooks: ["inelastic collisions", "2D momentum", "impulse from graphs"] },
 { title: "Simple Harmonic Motion", summary: "Springs, pendulums, energy in SHM.", hooks: ["period factors", "mass-spring energy", "phase from graphs"] },
 { title: "Torque and Rotation", summary: "Torque, rotational kinematics/dynamics, angular momentum.", hooks: ["balance torques", "rolling motion", "conservation L"] },
 ]),

 "physics-2": U("physics-2", [
 { title: "Fluids", summary: "Pressure, buoyancy, continuity, Bernoulli.", hooks: ["buoyant force", "flow rate", "pressure depth"] },
 { title: "Thermodynamics", summary: "Laws of thermodynamics, heat engines, PV diagrams.", hooks: ["isothermal vs adiabatic", "efficiency", "entropy intuition"] },
 { title: "Electrostatics", summary: "Charge, Coulomb's law, electric field, potential.", hooks: ["field superposition", "potential energy", "dipoles"] },
 { title: "Electric Circuits", summary: "DC circuits, Ohm's law, Kirchhoff, RC basics.", hooks: ["series vs parallel", "Kirchhoff junctions", "power dissipated"] },
 { title: "Magnetism", summary: "Magnetic forces, fields from currents, induction intro.", hooks: ["force on moving charge", "right-hand rules", "flux change"] },
 { title: "Geometric Optics", summary: "Reflection, refraction, lenses, mirrors.", hooks: ["lens equation", "sign conventions", "ray diagrams"] },
 { title: "Quantum, Atomic, and Nuclear", summary: "Photoelectric effect, atomic models, decay, duality intro.", hooks: ["photon energy", "half-life", "energy levels"] },
 ]),

 "physics-c-m": U("physics-c-m", [
 { title: "Kinematics", summary: "Motion in 1D/2D with calculus - velocity/acceleration vectors.", hooks: ["parametric motion", "tangential acceleration", "curvature intro"] },
 { title: "Newton's Laws of Motion", summary: "Forces, FBDs, systems with calculus.", hooks: ["variable mass intuition", "constraints", "pulleys"] },
 { title: "Work, Energy, and Power", summary: "Work integrals, conservative forces, power.", hooks: ["line integrals for work", "potential energy curves", "power as dot product"] },
 { title: "Systems of Particles and Linear Momentum", summary: "Center of mass, collisions, rocket motion intro.", hooks: ["CM frame", "impulse-momentum", "explosions"] },
 { title: "Rotation", summary: "Torque, rotational inertia, angular momentum, rolling.", hooks: ["parallel axis", "energy in rotation", "precession intro"] },
 ]),

 "physics-c-em": U("physics-c-em", [
 { title: "Electrostatics", summary: "Coulomb, fields, Gauss's law, potentials.", hooks: ["Gauss symmetry", "capacitance", "energy in fields"] },
 { title: "Conductors and Capacitors", summary: "Dielectrics, energy storage, combinations.", hooks: ["dielectric effect", "series/parallel C", "energy density"] },
 { title: "Electric Circuits", summary: "DC circuits, Kirchhoff, RC transients.", hooks: ["time constant", "Kirchhoff loops", "power"] },
 { title: "Magnetic Fields", summary: "Biot-Savart, Ampere's law, forces on charges/currents.", hooks: ["Ampere loops", "force on wire", "cyclotron motion"] },
 { title: "Induction", summary: "Faraday's law, Lenz, inductance.", hooks: ["motional EMF", "inductor energy", "LR circuits"] },
 { title: "Maxwell's Equations and EM Waves", summary: "Displacement current, EM wave properties.", hooks: ["wave speed in medium", "Poynting vector intro", "spectrum"] },
 ]),

 chem: U("chem", [
 { title: "Atomic Structure and Properties", summary: "Periodic trends, electron configuration, photoelectron spectroscopy intro.", hooks: ["ionization energy trends", "atomic radius", "effective nuclear charge"] },
 { title: "Molecular and Ionic Compound Structure", summary: "Bonding, VSEPR, polarity, intermolecular forces.", hooks: ["VSEPR shapes", "IMF ranking", "melting point trends"] },
 { title: "Intermolecular Forces and Properties", summary: "Solids/liquids, phase diagrams, solutions.", hooks: ["vapor pressure", "colligative properties", "solubility"] },
 { title: "Chemical Reactions", summary: "Stoichiometry, titrations, limiting reagent.", hooks: ["percent yield", "titration stoich", "solution M"] },
 { title: "Kinetics", summary: "Rate laws, mechanisms, activation energy.", hooks: ["integrated rate laws", "half-life", "catalyst role"] },
 { title: "Thermodynamics", summary: "Enthalpy, Hess's law, calorimetry, entropy and Gibbs.", hooks: ["Hess cycles", "delta G and spontaneity", "bond enthalpy estimates"] },
 { title: "Equilibrium", summary: "Kc/Kp, Le Chatelier, solubility product.", hooks: ["ICE tables", "Q vs K", "common ion"] },
 { title: "Acids and Bases", summary: "pH, buffers, titration curves, Ka/Kb.", hooks: ["buffer capacity", "half-equivalence", "polyprotic steps"] },
 { title: "Applications of Thermodynamics", summary: "Electrochemistry, delta G and cells, electrolysis.", hooks: ["cell potential", "Nernst qualitative", "Faraday's laws intro"] },
 ]),

 bio: U("bio", [
 { title: "Chemistry of Life", summary: "Water, carbon, macromolecules, enzyme structure/function.", hooks: ["enzyme kinetics", "pH effects", "structure-function"] },
 { title: "Cell Structure and Function", summary: "Organelles, membranes, compartmentalization.", hooks: ["membrane transport", "surface area to volume", "endosymbiosis"] },
 { title: "Cellular Energetics", summary: "Photosynthesis, cellular respiration, fermentation.", hooks: ["electron transport", "chemiosmosis", "fermentation comparison"] },
 { title: "Cell Communication and Cell Cycle", summary: "Signaling, feedback, mitosis/meiosis, cancer intro.", hooks: ["signal transduction", "checkpoints", "crossing over"] },
 { title: "Heredity", summary: "Mendelian genetics, linkage, non-nuclear inheritance.", hooks: ["Punnett squares", "recombination frequency", "chi-square genetics"] },
 { title: "Gene Expression and Regulation", summary: "Central dogma, operons, eukaryotic regulation, viruses.", hooks: ["lac operon", "RNA processing", "mutations"] },
 { title: "Natural Selection", summary: "Evolutionary mechanisms, phylogeny, speciation.", hooks: ["Hardy-Weinberg", "selection types", "phylogenetic trees"] },
 { title: "Ecology", summary: "Populations, communities, ecosystems, conservation.", hooks: ["population growth models", "trophic levels", "disturbance"] },
 ]),

 env: U("env", [
 { title: "The Living World", summary: "Ecosystem structure, energy flow, biogeochemical cycles.", hooks: ["productivity", "nutrient cycles", "trophic efficiency"] },
 { title: "Analytical Techniques", summary: "Experimental design, math in environmental science.", hooks: ["sampling design", "uncertainty", "graph interpretation"] },
 { title: "Populations", summary: "Population dynamics, carrying capacity, human populations.", hooks: ["logistic growth", "demographic transition", "age structure"] },
 { title: "Earth Systems and Resources", summary: "Geology, atmosphere, water resources.", hooks: ["soil formation", "aquifers", "El Nino intro"] },
 { title: "Land and Water Use", summary: "Agriculture, mining, urbanization, fishing.", hooks: ["sustainable ag", "tragedy of commons", "aquaculture"] },
 { title: "Energy Resources and Consumption", summary: "Fossil fuels, renewables, efficiency.", hooks: ["EROEI", "grid mix", "lifecycle analysis"] },
 { title: "Atmospheric Pollution", summary: "Air pollutants, climate change, ozone.", hooks: ["greenhouse effect", "acid rain", "indoor air"] },
 { title: "Aquatic and Terrestrial Pollution", summary: "Water pollution, waste, persistent pollutants.", hooks: ["eutrophication", "bioaccumulation", "wastewater"] },
 { title: "Global Change", summary: "Biodiversity loss, climate impacts, sustainability.", hooks: ["IPCC themes", "conservation strategies", "mitigation vs adaptation"] },
 ]),

 ush: U("ush", [
 { title: "1491-1607", summary: "Indigenous Americas, early contact, exploration.", hooks: ["Columbian exchange", "native societies", "Spanish missions"] },
 { title: "1607-1754", summary: "Colonies, labor, mercantilism, regional differences.", hooks: ["indentured vs slavery", "Puritan society", "mercantilist policy"] },
 { title: "1754-1800", summary: "Revolution, Constitution, early republic.", hooks: ["federalists vs anti", "revolution causes", "Washington precedent"] },
 { title: "1800-1848", summary: "Jefferson through Jackson, market revolution, reform.", hooks: ["Monroe Doctrine", "Second Great Awakening", "manifest destiny seeds"] },
 { title: "1844-1877", summary: "Expansion, Civil War, Reconstruction.", hooks: ["compromises", "emancipation", "Reconstruction debates"] },
 { title: "1865-1898", summary: "Industrialization, Gilded Age, westward expansion.", hooks: ["labor unions", "New South", "Native policy"] },
 { title: "1890-1945", summary: "Progressivism, WWI, Roaring Twenties, Depression, WWII.", hooks: ["New Deal", "isolationism vs intervention", "home front"] },
 { title: "1945-1980", summary: "Cold War, civil rights, Great Society, Vietnam.", hooks: ["containment", "civil rights tactics", "stagflation causes"] },
 { title: "1980-Present", summary: "Conservative resurgence, globalization, modern challenges.", hooks: ["Reaganomics", "9/11 effects", "partisan shifts"] },
 ]),

 wh: U("wh", [
 { title: "The Global Tapestry", summary: "1200 regional states, networks before 1450.", hooks: ["Song China", "Mali", "feudal Europe compare"] },
 { title: "Networks of Exchange", summary: "Silk Roads, Indian Ocean, trans-Saharan, effects.", hooks: ["cultural diffusion", "disease spread", "technology transfer"] },
 { title: "Land-Based Empires", summary: "Gunpowder empires, administration, religion.", hooks: ["Ottoman millet", "Mughal syncretism", "Qing consolidation"] },
 { title: "Transoceanic Interconnections", summary: "Columbian Exchange, maritime empires, capitalism.", hooks: ["Atlantic slave trade", "mercantilism", "silver flows"] },
 { title: "Revolutions", summary: "Enlightenment, Atlantic revolutions, industrial beginnings.", hooks: ["Haitian revolution", "nationalism seeds", "industrial causes"] },
 { title: "Consequences of Industrialization", summary: "Imperialism, reactions, social change.", hooks: ["Berlin Conference", "Meiji", "anti-imperial movements"] },
 { title: "Global Conflict", summary: "WWI, interwar, WWII, genocides, new order.", hooks: ["treaty failures", "total war", "Holocaust context"] },
 { title: "Cold War and Decolonization", summary: "Bipolar world, independence movements, proxy wars.", hooks: ["nonalignment", "Vietnam context", "decolonization Africa"] },
 { title: "Globalization", summary: "1989-present institutions, technology, inequality.", hooks: ["IMF/WB debates", "climate cooperation", "cultural globalization"] },
 ]),

 euro: U("euro", [
 { title: "Renaissance and Exploration", summary: "Humanism, New Monarchies, Atlantic encounters.", hooks: ["Renaissance art patronage", "Reformation seeds", "exploration motives"] },
 { title: "Age of Reformation", summary: "Protestant/Catholic Reformations, wars of religion.", hooks: ["Luther vs Calvin", "Peace of Westphalia", "Catholic Reformation"] },
 { title: "Absolutism and Constitutionalism", summary: "Louis XIV, English civil war, Dutch republic.", hooks: ["divine right", "English Bill of Rights", "mercantilism"] },
 { title: "Scientific and Enlightenment", summary: "Scientific Revolution, philosophes, enlightened despots.", hooks: ["salons", "Diderot", "partition of Poland context"] },
 { title: "Industrialization and Ideologies", summary: "Industrial Revolution, isms, revolutions of 1830/48.", hooks: ["Luddites", "utopian socialism", "nationalism"] },
 { title: "Nationalism and Realpolitik", summary: "Italian/German unification, Crimean War, reforms.", hooks: ["Bismarck", "Garibaldi", "Ottoman decline"] },
 { title: "Mass Society and WWI", summary: "Second Industrial Revolution, imperialism, WWI origins.", hooks: ["alliances", "total war", "Treaty of Versailles"] },
 { title: "Dictatorships and WWII", summary: "Interwar crises, fascism, Stalinism, WWII.", hooks: ["appeasement debate", "Holocaust stages", "home fronts"] },
 { title: "Cold War to Present", summary: "Division of Europe, integration, post-1989 Europe.", hooks: ["EU integration", "decolonization effects", "Brexit context"] },
 ]),

 gov: U("gov", [
 { title: "Foundations of American Democracy", summary: "Constitutional principles, federalism, separation of powers.", hooks: ["Federalist papers", "checks and balances", "enumerated powers"] },
 { title: "Interactions Among Branches", summary: "Congress, presidency, courts, bureaucracy.", hooks: ["vetoes", "judicial review", "iron triangles"] },
 { title: "Civil Liberties and Civil Rights", summary: "Bill of Rights, incorporation, equality movements.", hooks: ["selective incorporation", "affirmative action debates", "free speech limits"] },
 { title: "American Political Ideologies and Beliefs", summary: "Public opinion, political socialization, polarization.", hooks: ["generational gaps", "party ID", "media effects"] },
 { title: "Political Participation", summary: "Elections, parties, interest groups, media.", hooks: ["campaign finance", "primaries", "voting behavior"] },
 ]),

 "comp-gov": U("comp-gov", [
 { title: "Introduction to Comparative Politics", summary: "Concepts: state, regime, nation, legitimacy, sovereignty.", hooks: ["regime types", "authority sources", "failed states"] },
 { title: "Sovereignty, Authority, and Power", summary: "Centralization, federalism, cooptation, coercion.", hooks: ["authoritarian tools", "cleavages", "corporatism"] },
 { title: "Political Institutions", summary: "Executives, legislatures, judiciaries, linkage institutions.", hooks: ["parliamentary vs presidential", "judicial independence", "party systems"] },
 { title: "Citizens, Society, and the State", summary: "Cleavages, civil society, political culture.", hooks: ["ethnic vs class cleavages", "social movements", "postmaterialism"] },
 { title: "Political and Economic Change", summary: "Development, globalization, democratization.", hooks: ["resource curse", "democratic backsliding", "IMF conditionality"] },
 { title: "Country Studies (UK, Russia, China, Iran, Nigeria, Mexico)", summary: "Apply concepts to core countries.", hooks: ["UK devolution", "China party-state", "Nigeria federalism"] },
 ]),

 macro: U("macro", [
 { title: "Basic Economic Concepts", summary: "Scarcity, PPC, comparative advantage, circular flow.", hooks: ["opportunity cost", "terms of trade", "PPF shifts"] },
 { title: "Economic Indicators and the Business Cycle", summary: "GDP, unemployment, inflation, business cycle.", hooks: ["real vs nominal", "labor force participation", "CPI bias"] },
 { title: "National Income and Price Determination", summary: "AD-AS, multiplier, fiscal policy.", hooks: ["multiplier size", "crowding out", "stabilization policy"] },
 { title: "Financial Sector", summary: "Money, banking, loanable funds, monetary policy.", hooks: ["money multiplier", "Fed tools", "quantity theory intro"] },
 { title: "Long-Run Consequences of Stabilization Policies", summary: "Phillips curve, debt, growth, crowding out long run.", hooks: ["expectations", "Ricardian equivalence intro", "supply shocks"] },
 { title: "Open Economy and International Trade", summary: "Balance of payments, exchange rates, trade policy.", hooks: ["appreciation effects", "capital flows", "tariffs"] },
 ]),

 micro: U("micro", [
 { title: "Basic Economic Concepts", summary: "Scarcity, opportunity cost, production possibilities.", hooks: ["marginal analysis", "specialization", "normative vs positive"] },
 { title: "Supply and Demand", summary: "Market equilibrium, elasticity, consumer/producer surplus.", hooks: ["price controls", "tax incidence", "elasticity determinants"] },
 { title: "Production, Cost, and Perfect Competition", summary: "Costs curves, profit max, shut-down, PC long run.", hooks: ["economies of scale", "MR=MC", "producer surplus"] },
 { title: "Imperfect Competition", summary: "Monopoly, price discrimination, oligopoly game theory.", hooks: ["deadweight loss", "cartels", "Nash equilibrium"] },
 { title: "Factor Markets", summary: "Labor markets, marginal revenue product, monopsony.", hooks: ["minimum wage in monopsony", "union effects", "capital rental"] },
 { title: "Market Failure and Government", summary: "Externalities, public goods, inequality.", hooks: ["Pigouvian tax", "Coase conditions", "Gini interpretation"] },
 ]),

 psych: U("psych", [
 {
 title: "Scientific Foundations of Psychology",
 summary: "History and approaches; research methods and ethics; statistics and how psychologists interpret evidence.",
 hooks: ["experimental design", "correlation vs causation", "ethics in research"],
 },
 {
 title: "Biological Bases of Behavior",
 summary: "Neuroanatomy and imaging; neural signaling; endocrine system; genetics; consciousness, sleep, and drugs.",
 hooks: ["brain structure and function", "neurotransmitters", "endocrine system"],
 },
 {
 title: "Sensation and Perception",
 summary: "Thresholds; vision and hearing; attention; perceptual organization and influences on interpretation.",
 hooks: ["Gestalt principles", "depth perception", "top-down processing"],
 },
 {
 title: "Learning",
 summary: "Classical and operant conditioning; schedules; observational learning and applications.",
 hooks: ["classical vs operant", "reinforcement schedules", "observational learning"],
 },
 {
 title: "Cognitive Psychology",
 summary: "Memory models; forgetting; thinking, problem solving, judgment; intelligence and language.",
 hooks: ["working memory", "interference and forgetting", "heuristics and biases"],
 },
 {
 title: "Developmental Psychology",
 summary: "Lifespan development; theories of cognitive and social development; attachment and research methods.",
 hooks: ["Piaget stages", "attachment styles", "Vygotsky ZPD"],
 },
 {
 title: "Motivation, Emotion, and Personality",
 summary: "Motivation and emotion theories; stress and coping; psychodynamic, humanistic, trait, and social-cognitive personality.",
 hooks: ["defense mechanisms", "Big Five traits", "stress and coping"],
 },
 {
 title: "Clinical Psychology",
 summary: "Psychological disorders and classification; psychotherapy; biomedical approaches; mind-body and wellness context.",
 hooks: ["CBT basics", "anxiety vs mood disorders", "therapy modalities"],
 },
 {
 title: "Social Psychology",
 summary: "Attribution; attitudes; conformity and obedience; group behavior; prejudice and prosocial behavior.",
 hooks: ["fundamental attribution error", "conformity vs obedience", "cognitive dissonance"],
 },
 ]),

 "hum-geo": U("hum-geo", [
 { title: "Thinking Geographically", summary: "Maps, scales, regions, spatial concepts.", hooks: ["choropleth bias", "scale of analysis", "formal vs functional regions"] },
 { title: "Population and Migration", summary: "Demographic transition, migration theories, policies.", hooks: ["push-pull", "Malthus vs Boserup", "refugees vs asylum"] },
 { title: "Cultural Patterns", summary: "Language, religion, ethnicity, cultural landscapes.", hooks: ["cultural diffusion", "syncretism", "ethnic enclaves"] },
 { title: "Political Geography", summary: "Boundaries, states, devolution, geopolitics.", hooks: ["gerrymandering", "nation-state", "supranational orgs"] },
 { title: "Agriculture and Rural Land Use", summary: "von Thunen, Green Revolution, subsistence vs commercial.", hooks: ["agricultural hearths", "subsidy effects", "sustainable ag"] },
 { title: "Cities and Urban Land Use", summary: "Models of cities, suburbs, bid-rent, gentrification.", hooks: ["sector vs multiple nuclei", "sprawl", "CBD decline"] },
 { title: "Industrialization and Development", summary: "Measures of development, trade, sustainability.", hooks: ["HDI", "Wallerstein", "microfinance"] },
 ]),

 lang: U("lang", [
 { title: "Rhetorical Situation", summary: "Exigence, audience, purpose, context, speaker.", hooks: ["kairos", "constraints", "stakeholder analysis"] },
 { title: "Claims and Evidence", summary: "Thesis types, evidence quality, reasoning.", hooks: ["warrants", "qualifiers", "data vs anecdote"] },
 { title: "Introduction to Argument", summary: "Line of reasoning, counterarguments, refutation.", hooks: ["Rogerian elements", "straw man avoidance", "concession"] },
 { title: "Style", summary: "Diction, syntax, tone, imagery.", hooks: ["sentence variety", "connotation", "parallelism"] },
 { title: "Synthesis", summary: "Combining sources, attribution, conversation.", hooks: ["synthesis vs summary", "weaving sources", "synthetic thesis"] },
 { title: "Rhetorical Analysis", summary: "SOAPS, rhetorical triangle, choices for effect.", hooks: ["ethos/pathos/logos", "anaphora effect", "shifts in tone"] },
 { title: "Argument Essay", summary: "Defensible claim, evidence, nuance.", hooks: ["line of reasoning marks", "complexity point", "evidence commentary balance"] },
 { title: "Revision", summary: "Organization, coherence, editing for clarity.", hooks: ["transitions", "thesis precision", "eliminating redundancy"] },
 ]),

 lit: U("lit", [
 { title: "Short Fiction", summary: "Plot, character, setting, narrative perspective.", hooks: ["unreliable narrator", "symbolism", "irony types"] },
 { title: "Poetry I", summary: "Imagery, figurative language, sound devices.", hooks: ["sonnet form", "meter basics", "tone shifts"] },
 { title: "Poetry II", summary: "Structure, ambiguity, allusion.", hooks: [" volta", "extended metaphor", "modernist fragmentation"] },
 { title: "Longer Fiction or Drama", summary: "Themes, motifs, characterization over length.", hooks: ["foil characters", "setting as character", "tragic flaw"] },
 { title: "Literary Argument", summary: "Thesis about meaning, evidence from text.", hooks: ["close reading", "interpretive claims", "textual evidence"] },
 { title: "Literary Criticism Lenses", summary: "Historical, feminist, postcolonial (intro).", hooks: ["context limits", "author purpose", "reader response cautions"] },
 { title: "Comparing Texts", summary: "Thematic and stylistic comparison.", hooks: ["compare tone", "genre conventions", "authorial choices"] },
 { title: "Writing About Literature", summary: "Organization, embedding quotations, commentary.", hooks: ["ICE method", "analysis vs plot summary", "conclusion synthesis"] },
 ]),

 "art-hist": U("art-hist", [
 { title: "Global Prehistory", summary: "Paleolithic to Neolithic art across regions.", hooks: ["sculpture in the round", "catalhoyuk", "materials and ritual"] },
 { title: "Ancient Mediterranean", summary: "Egypt, Near East, Greece, Rome.", hooks: ["hieratic scale", "Greek orders", "Roman portraiture"] },
 { title: "Early Europe and Colonial Americas", summary: "Medieval through colonial art.", hooks: ["Romanesque vs Gothic", "Byzantine icons", "colonial syncretism"] },
 { title: "Later Europe and Americas", summary: "Renaissance through Realism.", hooks: ["linear perspective", "Baroque drama", "Romantic sublime"] },
 { title: "Modern Europe and Americas", summary: "Modernisms, abstraction, political art.", hooks: ["Cubism", "Dada", "Mexican muralism"] },
 { title: "Indigenous Americas", summary: "Mesoamerican, Andean, Native North art.", hooks: ["Teotihuacan", "Inka masonry", "Northwest coast"] },
 { title: "Africa", summary: "Regional traditions, materials, performance.", hooks: ["Benin plaques", "masks and masquerade", "colonial encounter"] },
 { title: "West and Central Asia", summary: "Islamic art, mosques, manuscripts.", hooks: ["arabesque", "muqarnas", "calligraphy"] },
 { title: "South, East, and Southeast Asia", summary: "Buddhist/Hindu art, East Asian painting/ceramics.", hooks: ["stupa symbolism", "Chinese landscape", "Zen ink"] },
 { title: "The Pacific and Global Contemporary", summary: "Oceanic art, global contemporary themes.", hooks: ["tattoo traditions", "biennial culture", "identity in art"] },
 ]),

 "art-design": U("art-design", [
 { title: "Inquiry and Investigation", summary: "Developing questions, research, iteration.", hooks: ["sketchbook process", "primary research", "problem finding"] },
 { title: "Making and Materials", summary: "Experimentation, craft, technique.", hooks: ["material constraints", "process documentation", "failure as data"] },
 { title: "Composition and Design", summary: "Elements and principles, visual hierarchy.", hooks: ["balance", "focal point", "negative space"] },
 { title: "Context and Meaning", summary: "Audience, symbolism, cultural references.", hooks: ["intended read", "appropriation ethics", "narrative"] },
 { title: "Critique and Reflection", summary: "Peer feedback, artist statements, growth.", hooks: ["constructive critique", "revision rationale", "metacognition"] },
 { title: "Sustained Investigation Portfolio", summary: "Cohesive body of work, sustained inquiry.", hooks: ["through-line", "breadth vs depth", "presentation"] },
 ]),

 music: U("music", [
 { title: "Fundamentals I", summary: "Rhythm, meter, pitch, scales, key signatures.", hooks: ["compound meter", "enharmonic equivalence", "circle of fifths"] },
 { title: "Fundamentals II", summary: "Intervals, triads, inversions, figured bass intro.", hooks: ["interval quality", "Roman numerals", "voice leading basics"] },
 { title: "Harmony I", summary: "Phrase structure, cadences, non-chord tones.", hooks: ["PAC vs HC", "passing tones", "sequences"] },
 { title: "Harmony II", summary: "Seventh chords, secondary dominants, modulations.", hooks: ["V7 resolution", "pivot chords", "common-tone mod"] },
 { title: "Texture and Form", summary: "Two-part counterpoint, small forms, motivic development.", hooks: ["binary vs ternary", "motivic transformation", "texture types"] },
 { title: "Aural Skills I", summary: "Melodic dictation, rhythmic dictation.", hooks: ["tonal vs modal", "syncopation", "leap vs step"] },
 { title: "Aural Skills II", summary: "Harmonic dictation, sight-singing.", hooks: ["bass line hearing", "soprano line", "sight-singing strategies"] },
 { title: "Score Analysis", summary: "Score reading, orchestration cues, historical styles.", hooks: ["period analysis", "instrumentation effects", "style markers"] },
 ]),

 spanish: U("spanish", [
 { title: "Families and Communities", summary: "Personal identity, relationships, education.", hooks: ["register", "family vocabulary in context", "community issues"] },
 { title: "Personal and Public Identities", summary: "Beliefs, diversity, language and identity.", hooks: ["dialects", "immigration narratives", "stereotypes vs reality"] },
 { title: "Beauty and Aesthetics", summary: "Art, architecture, design, literature.", hooks: ["describing art", "cultural comparisons", "historical periods"] },
 { title: "Science and Technology", summary: "Innovation, ethics, environment, health.", hooks: ["STEM vocabulary", "ethical dilemmas", "future tense spec"] },
 { title: "Contemporary Life", summary: "Work, leisure, travel, media.", hooks: ["subjunctive in opinions", "hypotheticals", "media literacy"] },
 { title: "Global Challenges", summary: "Environment, human rights, economics.", hooks: ["conditional structures", "cause-effect", "debate vocabulary"] },
 ]),

 french: U("french", [
 { title: "Families and Communities", summary: "Identity, relationships, schooling, traditions.", hooks: ["register tu/vous", "Francophone diversity", "youth issues"] },
 { title: "Personal and Public Identities", summary: "Values, multiculturalism, language policy.", hooks: ["laicite context", "identity in Quebec", "code-switching"] },
 { title: "Beauty and Aesthetics", summary: "Arts, fashion, heritage sites.", hooks: ["museum vocabulary", "describing performances", "cultural patrimoine"] },
 { title: "Science and Technology", summary: "Research, digital life, medicine.", hooks: ["future and conditional", "if-clauses", "tech ethics"] },
 { title: "Contemporary Life", summary: "Daily routines, housing, leisure.", hooks: ["subjunctive triggers", "comparatives", "travel problems"] },
 { title: "Global Challenges", summary: "Climate, migration, inequality.", hooks: ["subjunctive in doubt", "argument connectors", "data description"] },
 ]),

 german: U("german", [
 { title: "Families and Communities", summary: "Home, school, traditions in DACH region.", hooks: ["cases in fixed phrases", "education system", "holidays"] },
 { title: "Personal and Public Identities", summary: "History, division/reunification themes, identity.", hooks: ["Ostalgie discussion", "migration in Germany", "media"] },
 { title: "Beauty and Aesthetics", summary: "Music, literature, Bauhaus, festivals.", hooks: ["describing preferences", "cultural comparisons", "film vocabulary"] },
 { title: "Science and Technology", summary: "Engineering culture, environment, health.", hooks: ["modal verbs", "passive voice", "process descriptions"] },
 { title: "Contemporary Life", summary: "Work, transport, urban life.", hooks: ["word order", "Konjunktiv II polite", "complaints"] },
 { title: "Global Challenges", summary: "EU, energy, human rights.", hooks: ["argument essay stems", "cause-effect", "statistics in German"] },
 ]),

 chinese: U("chinese", [
 { title: "Families and Communities", summary: "Family structure, festivals, community roles.", hooks: ["measure words", "kinship terms", "tradition vs modern"] },
 { title: "Personal and Public Identities", summary: "Education, career, regional identities.", hooks: ["compare Taiwan/Mainland vocab", "internet culture", "values"] },
 { title: "Beauty and Aesthetics", summary: "Calligraphy, architecture, cuisine.", hooks: ["describing art forms", "historical sites", "aesthetic vocabulary"] },
 { title: "Science and Technology", summary: "Innovation, mobile life, environment.", hooks: ["result complements", "STEM vocabulary (Chinese)", "future plans"] },
 { title: "Contemporary Life", summary: "Transport, shopping, leisure.", hooks: ["directions", "bargaining", "habits with aspect particle le"] },
 { title: "Global Challenges", summary: "Development, climate, public health.", hooks: ["ba-construction sentences", "formal register", "policy vocabulary"] },
 ]),

 japanese: U("japanese", [
 { title: "Families and Communities", summary: "School, clubs, neighborhood, seasons.", hooks: ["keigo intro", "seasonal references", "group harmony"] },
 { title: "Personal and Public Identities", summary: "Work culture, gender roles discourse, media.", hooks: ["honorific choices", "youth slang awareness", "identity"] },
 { title: "Beauty and Aesthetics", summary: "Traditional arts, manga/anime, design.", hooks: ["onomatopoeia", "describing visuals", "cultural borrowing"] },
 { title: "Science and Technology", summary: "Robotics, disasters prep, health.", hooks: ["passive forms", "technical compounds", "instructions"] },
 { title: "Contemporary Life", summary: "Transit, konbini culture, housing.", hooks: ["giving/receiving", "requests", "problem-solving"] },
 { title: "Global Challenges", summary: "Aging society, energy, international relations.", hooks: ["cause patterns (kara/node)", "debate stems", "news vocabulary"] },
 ]),

 latin: U("latin", [
 { title: "Grammar Foundations", summary: "Cases, declensions, agreement, basic syntax.", hooks: ["case usage", "substantive adjectives", "word order emphasis"] },
 { title: "Verbs and Infinitives", summary: "Tenses, voices, moods, principal parts.", hooks: ["subjunctive purpose", "sequence of tenses", "deponent awareness"] },
 { title: "Complex Sentences", summary: "Participles, ablative absolute, indirect statement.", hooks: ["ablative absolute translation", "indirect command", "result clauses"] },
 { title: "Sight Reading Strategies", summary: "Identifying main verbs, scanning for core meaning.", hooks: ["context clues", "proper names", "genre markers"] },
 { title: "Vergil and Epic", summary: "Meter basics, epic conventions, thematic reading.", hooks: ["epithets", "fate vs will", "similes"] },
 { title: "Caesar and Prose", summary: "Historical narrative, military vocabulary, rhetoric.", hooks: ["indirect discourse", "ethos in commentaries", "geography"] },
 ]),

 seminar: U("seminar", [
 { title: "Question and Explore", summary: "Problem finding, inquiry, source landscapes.", hooks: ["essential questions", "stakeholder map", "feasibility"] },
 { title: "Understand and Analyze", summary: "Arguments, perspectives, line of reasoning.", hooks: ["assessing bias", "comparing lenses", "evidence strength"] },
 { title: "Evaluate Multiple Perspectives", summary: "Synthesis across sources, tensions, implications.", hooks: ["tradeoffs", "limitations", "counterarguments"] },
 { title: "Team, Transform, and Present", summary: "Collaboration, solution proposals, communication.", hooks: ["group roles", "pitch structure", "reflection"] },
 ]),

 research: U("research", [
 { title: "Inquiry and Literature Review", summary: "Narrowing topic, scholarly sources, gaps.", hooks: ["research questions", "synthesis matrix", "ethics of sources"] },
 { title: "Methodology", summary: "Design, data, validity, limitations.", hooks: ["methods fit", "bias control", "IRB-style thinking"] },
 { title: "Analysis and Argument", summary: "Claims, evidence, significance.", hooks: ["significance vs results", "implications", "alternative explanations"] },
 { title: "Presentation and Defense", summary: "Structure, visuals, Q&A readiness.", hooks: ["defense strategies", "limitations honesty", "future work"] },
 ]),
};
