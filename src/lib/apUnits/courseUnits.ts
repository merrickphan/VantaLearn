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

/**
 * AP Calculus BC — unit map aligned to your requested pacing (Units 1–11).
 * Units 1–8 overlap AB; Units 9–11 are BC-only.
 */
const CALC_BC_UNIT_DEFS: readonly { title: string; summary: string; hooks: readonly string[] }[] = [
 // 1
 {
  title: "Limits and Continuity",
  summary:
   "Limits as approach behavior from graphs, tables, and algebraic expressions; left-hand and right-hand limits; conditions for limit existence; algebraic limit techniques (substitution, factoring/canceling, rationalizing, simplifying complex rational expressions); indeterminate forms 0/0 and ∞/∞ resolved by algebra; limits at infinity and horizontal asymptotes via dominant-term reasoning; continuity definition and continuity on intervals; discontinuity types (removable, jump, infinite); Intermediate Value Theorem for existence of values on a continuous interval.",
  hooks: [
   "limit existence (left vs right)",
   "algebraic simplification for 0/0",
   "∞/∞ and dominant-term reasoning",
   "limits at infinity / horizontal asymptote",
   "continuity: three conditions",
   "discontinuity types from graphs",
   "IVT guarantees a value",
  ],
 },
 // 2
 {
  title: "Derivatives Foundations",
  summary:
   "Derivative concept as slope of the tangent line and instantaneous rate of change; secant-to-tangent limiting process; differentiability and where derivatives fail (corner, cusp, vertical tangent, discontinuity); relationship between continuity and differentiability; basic derivative rules (constant, power, sum/difference); interpreting derivatives from graphs (sign and magnitude).",
  hooks: [
   "secant-to-tangent limit",
   "where derivative fails to exist",
   "power rule and linearity",
   "derivative sign from a graph",
   "instantaneous rate interpretation",
  ],
 },
 // 3
 {
  title: "Differentiation Techniques",
  summary:
   "Chain rule for composite functions; product and quotient rules; implicit differentiation; derivatives of inverse functions; trigonometric derivatives (sin, cos, tan) with chain rule; logarithmic differentiation for products and variable exponents.",
  hooks: [
   "chain rule nesting",
   "product rule structure",
   "quotient rule structure",
   "implicit dy/dx",
   "inverse-function derivative rule",
   "logarithmic differentiation setup",
  ],
 },
 // 4
 {
  title: "Applications of Derivatives",
  summary:
   "Motion analysis (position, velocity, acceleration) and sign/magnitude interpretations; related rates (setup relationships, differentiate with respect to time, substitute values); linear approximation; differentials and error interpretations (absolute and relative).",
  hooks: [
   "motion: v and a meaning",
   "related rates setup",
   "related rates solve step",
   "linear approximation",
   "differentials and error",
  ],
 },
 // 5
 {
  title: "Function Analysis",
  summary:
   "Critical points; increasing/decreasing intervals; First Derivative Test; concavity via second derivative; inflection points; Second Derivative Test; optimization; curve sketching by synthesizing derivative information.",
  hooks: [
   "critical points classification",
   "first derivative test",
   "concavity from f''",
   "inflection points",
   "optimization reasoning",
   "curve sketching synthesis",
  ],
 },
 // 6
 {
  title: "Integration and the Fundamental Theorem of Calculus",
  summary:
   "Riemann sums (left/right/midpoint) and definite integrals as net signed area; FTC Part 1 (derivative of an accumulation function) and Part 2 (evaluate definite integrals using antiderivatives); antiderivatives with +C; accumulation functions interpreted as total change.",
  hooks: [
   "Riemann sums (L/R/M)",
   "definite integral as net area",
   "FTC Part 1",
   "FTC Part 2 evaluation",
   "antiderivative + C",
   "accumulation interpretation",
  ],
 },
 // 7
 {
  title: "Differential Equations",
  summary:
   "Slope fields and matching behavior; separable differential equations (separate variables and integrate); exponential growth/decay dy/dt = ky and solution form; initial value problems and solving for constants.",
  hooks: [
   "slope field reading",
   "separable separation step",
   "exponential model ky",
   "IVP constant from condition",
  ],
 },
 // 8
 {
  title: "Applications of Integration",
  summary:
   "Area between curves; volume by disk method; average value of a function; motion with integrals (displacement vs total distance).",
  hooks: [
   "area between curves setup",
   "volume (disk) setup",
   "average value formula",
   "displacement vs distance",
  ],
 },
 // 9 (BC-only)
 {
  title: "Parametric, Polar, and Vector Motion",
  summary:
   "Parametric representations x(t), y(t); dy/dx = (dy/dt)/(dx/dt); velocity and acceleration in parametric form; arc length for a parametric curve; polar coordinates r = f(θ), polar area (1/2)∫r^2 dθ, and polar slope ideas.",
  hooks: [
   "parametric dy/dx ratio",
   "parametric velocity/acceleration",
   "parametric arc length",
   "polar area one-half integral",
   "polar slope conversion",
  ],
 },
 // 10 (BC-only)
 {
  title: "Sequences and Series",
  summary:
   "Sequence convergence/divergence; series and partial sums; geometric series; divergence (nth-term) test; integral test; p-series; comparison and limit comparison; alternating series test and error; ratio/root tests; power series and intervals of convergence; Taylor/Maclaurin series, polynomial approximations, and Lagrange error bounds.",
  hooks: [
   "geometric series sum/converge",
   "divergence test",
   "p-series classification",
   "comparison tests",
   "alternating series and error",
   "ratio/root test",
   "power series interval",
   "Taylor polynomial approximation",
   "Lagrange remainder bound",
  ],
 },
 // 11 (BC-only)
 {
  title: "Advanced Integration Techniques",
  summary:
   "Improper integrals with infinite limits or discontinuous integrands; convergence/divergence of improper integrals; numerical integration (trapezoidal rule and midpoint approximation) and interpreting approximation error direction when applicable.",
  hooks: [
   "improper integral setup",
   "improper integral convergence",
   "trapezoidal approximation",
   "midpoint approximation",
  ],
 },
] as const;

/** Canonical units per course id (aligned with typical CB syllabi; titles may vary slightly by year). */
export const AP_UNITS_BY_COURSE_ID: Record<string, ApUnit[]> = {
 "calc-ab": unitsDetailed("calc-ab", CALC_AB_UNIT_DEFS),
 "calc-bc": unitsDetailed("calc-bc", CALC_BC_UNIT_DEFS),
 precalc: unitsDetailed("precalc", [
  {
   title: "Polynomial and Rational Functions",
   summary:
    "Function notation, domain/range, evaluating and interpreting graphs; polynomial structure (degree, leading coefficient, end behavior, turning points); zeros, factors, and multiplicity; constructing polynomial models from conditions; rational functions (structure, restrictions, simplification); asymptotes (vertical/horizontal/slant), holes, intercepts, end behavior; solving rational equations with attention to extraneous solutions and domain restrictions.",
   hooks: [
    "domain and range from graphs",
    "end behavior from degree and leading coefficient",
    "zeros and multiplicity (cross vs touch)",
    "factor theorem / constructing factors",
    "rational restrictions and holes",
    "vertical vs horizontal vs slant asymptotes",
    "solving rational equations (extraneous checks)",
   ],
  },
  {
   title: "Exponential and Logarithmic Functions",
   summary:
    "Exponential growth/decay models and parameter meaning; transformations; exponent rules and simplifying expressions; logarithms as inverses; log properties and change of base; solving exponential and logarithmic equations with domain checks; compound growth/decay modeling in context.",
   hooks: [
    "growth vs decay interpretation",
    "exponent rules simplification",
    "log properties (product/quotient/power)",
    "change of base usage",
    "solve exponential equations",
    "solve logarithmic equations (domain)",
    "compound growth modeling",
   ],
  },
  {
   title: "Trigonometric Functions",
   summary:
    "Unit circle (radians, coordinates) and trig definitions; sine/cosine/tangent and reciprocals; graphs of trig functions (amplitude, period, midline, phase shift); identities (Pythagorean, symmetry, periodicity); inverse trig principal values; solving trig equations; sinusoidal modeling in context.",
   hooks: [
    "unit circle exact values",
    "amplitude/period/midline from equations",
    "symmetry and periodicity",
    "Pythagorean identities",
    "inverse trig principal values",
    "solve trig equations (general solutions)",
    "sinusoidal modeling",
   ],
  },
  {
   title: "Complex Numbers and Polynomial Systems",
   summary:
    "Complex number arithmetic and i; powers of i cycle; quadratic solutions with complex roots and discriminant meaning; polynomial long/synthetic division; connecting roots to factors and to the fundamental theorem of algebra.",
   hooks: [
    "arithmetic with a+bi",
    "powers of i cycle",
    "discriminant and root type",
    "synthetic division remainder",
    "number of roots (FTA)",
   ],
  },
  {
   title: "Analytic Trigonometry and Identities",
   summary:
    "Identity manipulation and rewriting expressions; Pythagorean identities; sum and difference formulas; double-angle formulas; solving advanced trig equations using identities strategically.",
   hooks: [
    "simplify using identities",
    "sum/difference formulas",
    "double-angle formulas",
    "identity-based equation solving",
   ],
  },
  {
   title: "Modeling and Applications",
   summary:
    "Choosing function types for data; regression basics and interpreting best-fit models; periodic modeling; piecewise functions in context; constraints and interpretation of domain/range in applied settings.",
   hooks: [
    "choose model type from description",
    "interpret regression parameters",
    "periodic modeling context",
    "piecewise interpretation",
    "domain/range constraints in context",
   ],
  },
  {
   title: "Systems of Equations and Matrices",
   summary:
    "Systems of linear equations via substitution and elimination; interpreting intersections as solutions; matrix representation and solving simple systems when included.",
   hooks: [
    "substitution vs elimination",
    "intersection meaning",
    "matrix form of a system",
   ],
  },
  {
   title: "Advanced Function Analysis",
   summary:
    "Function transformations; composition f(g(x)); inverses (find/verify); piecewise function behavior and graph construction; comparing growth rates of polynomial, exponential, and logarithmic functions.",
   hooks: [
    "transformations (shift/scale/reflect)",
    "composition meaning",
    "inverse verification",
    "piecewise continuity/behavior",
    "growth-rate comparisons",
   ],
  },
  {
   title: "Data and Probability Foundations",
   summary:
    "Interpreting scatterplots and trends; correlation vs causation; basic probability rules (independent vs dependent events); conditional probability basics; introductory expected value when included.",
   hooks: [
    "scatterplot trend interpretation",
    "correlation vs causation",
    "independent vs dependent events",
    "conditional probability",
    "expected value basics",
   ],
  },
 ]),
 stats: unitsDetailed("stats", [
  {
   title: "Exploring One-Variable Data",
   summary:
    "Identify data types (categorical vs quantitative) and variables; describe distributions using graphs (dotplots, histograms, boxplots, stemplots); describe shape (skewness, symmetry, modes); measures of center (mean/median/mode) and spread (range, IQR, standard deviation); outliers using the 1.5×IQR rule; z-scores and standardized position; compare distributions by shape, center, and spread.",
   hooks: [
    "categorical vs quantitative",
    "shape (skew/symmetric, uni/bi-modal)",
    "center vs spread selection",
    "outliers (1.5×IQR rule)",
    "z-score interpretation",
    "compare two distributions",
   ],
  },
  {
   title: "Exploring Two-Variable Data",
   summary:
    "Scatterplots and relationship description; correlation (direction/strength) and r interpretation; least-squares regression line (LSRL) concepts; residuals and residual plots; coefficient of determination r²; influential points and outliers in regression; interpretation in context.",
   hooks: [
    "association direction/strength",
    "correlation r meaning",
    "LSRL interpretation",
    "residual plot meaning",
    "r-squared interpretation",
    "influential point concept",
   ],
  },
  {
   title: "Collecting Data",
   summary:
    "Sampling methods (SRS, stratified, cluster, systematic); sources of bias (sampling/response/undercoverage); experimental design vocabulary (treatments, factors, control, placebo); random assignment vs random sampling; design principles (control, randomization, replication); blinding and placebo effect.",
   hooks: [
    "sampling method identification",
    "bias sources",
    "random assignment vs sampling",
    "control/randomize/replicate",
    "placebo and blinding",
   ],
  },
  {
   title: "Probability, Random Variables, and Simulation",
   summary:
    "Probability with sample spaces/events; addition and multiplication rules; conditional probability P(A|B); independence vs dependence; two-way tables and tree diagrams; random variables (discrete/continuous); expected value and variance concepts; simulation methods.",
   hooks: [
    "addition vs multiplication rule",
    "conditional probability",
    "independence criteria",
    "two-way tables",
    "expected value meaning",
    "simulation logic",
   ],
  },
  {
   title: "Sampling Distributions",
   summary:
    "Sampling distributions for sample proportions and means; Central Limit Theorem; bias vs variability; conditions for normal approximations (large counts, etc.); standard error and variability of statistics; interpretation of sampling variability.",
   hooks: [
    "sampling distribution concept",
    "CLT reasoning",
    "standard error meaning",
    "large-counts conditions",
    "bias vs variability",
   ],
  },
  {
   title: "Inference for Categorical Data: Proportions",
   summary:
    "Confidence intervals for proportions; hypothesis testing framework (H0 vs Ha); one-proportion z-test; Type I/II errors; significance level and p-values; interpret conclusions in context.",
   hooks: [
    "CI for p interpretation",
    "one-proportion z-test logic",
    "p-value vs alpha",
    "Type I/II errors",
    "contextual conclusion",
   ],
  },
  {
   title: "Inference for Quantitative Data: Means",
   summary:
    "t-distributions and conditions; one-sample t-interval and t-test; paired data inference; interpreting CIs and significance in context.",
   hooks: [
    "t vs z choice",
    "t-interval meaning",
    "t-test conclusion",
    "paired data setup",
    "conditions check",
   ],
  },
  {
   title: "Inference for Categorical Data: Chi-Square",
   summary:
    "Chi-square goodness-of-fit, independence, and homogeneity tests; expected counts and conditions; interpreting results in context.",
   hooks: [
    "GOF vs independence vs homogeneity",
    "expected counts condition",
    "chi-square conclusion in context",
   ],
  },
  {
   title: "Inference for Regression",
   summary:
    "Inference for slope of the regression line; conditions for regression inference; t-test and confidence interval for slope; interpreting slope in context.",
   hooks: [
    "slope inference meaning",
    "regression conditions",
    "t-test for slope",
    "CI for slope",
    "interpret slope in context",
   ],
  },
 ]),
 "cs-a": unitsDetailed("cs-a", [
  {
   title: "Primitive Types and Basic Java",
   summary:
    "Java program structure (classes, main method, execution flow); variables (declaration, initialization, assignment); primitive types (int, double, boolean, char); expressions and operator precedence; casting and type conversion; String basics (creation, concatenation, length, immutability).",
   hooks: [
    "variable initialization and assignment",
    "primitive types and literals",
    "operator precedence",
    "casting (int/double) effects",
    "String length/concatenation",
   ],
  },
  {
   title: "Boolean Expressions and Control Flow",
   summary:
    "Boolean logic; relational operators; logical operators (&&, ||, !); if and if-else; nested conditionals; De Morgan’s law and logical equivalence; switch statements when used.",
   hooks: [
    "relational vs logical operators",
    "short-circuit logic",
    "if/else branching",
    "nested conditionals",
    "De Morgan equivalence",
    "switch behavior",
   ],
  },
  {
   title: "Iteration",
   summary:
    "While loops and for loops; common iteration patterns (accumulation, counting, searching); nested loops; loop control patterns and common errors (off-by-one, infinite loop).",
   hooks: [
    "while vs for",
    "accumulation pattern",
    "off-by-one errors",
    "nested loop counting",
    "searching with loops",
   ],
  },
  {
   title: "Writing Classes (OOP Basics)",
   summary:
    "Classes and objects; instance variables (state); constructors; methods (behavior, return types); parameters and scope; encapsulation (private/public); accessors and mutators; this keyword.",
   hooks: [
    "constructor and initialization",
    "instance variables vs local variables",
    "accessor vs mutator",
    "this keyword meaning",
    "encapsulation intent",
   ],
  },
  {
   title: "Arrays",
   summary:
    "Array declaration/initialization; zero-based indexing; traversals; modifying elements; length; enhanced for loop; linear search; common algorithms (max/min/sum/average).",
   hooks: [
    "zero-based indexing",
    "traversal patterns",
    "length usage",
    "linear search",
    "max/min/sum/avg",
   ],
  },
  {
   title: "ArrayList",
   summary:
    "ArrayList basics (import and creation); add/remove; get/set; size; iteration; common operations; wrapper classes (Integer, Double, etc.).",
   hooks: [
    "ArrayList add/remove shifting",
    "get/set and index rules",
    "size vs index",
    "iteration patterns",
    "wrapper class usage",
   ],
  },
  {
   title: "Inheritance",
   summary:
    "Superclasses and subclasses; extends; method overriding; super keyword; polymorphism basics; is-a relationships.",
   hooks: [
    "override vs overload",
    "super constructor call",
    "polymorphism reference type",
    "is-a relationship",
   ],
  },
  {
   title: "Recursion",
   summary:
    "Recursive structure (base case and recursive case); tracing calls; simple recursive methods; recursive processing of arrays/strings; call stack behavior; common recursion errors (missing base case, infinite recursion).",
   hooks: [
    "base case identification",
    "trace recursive calls",
    "stack frames concept",
    "recursive array/string processing",
    "common recursion bugs",
   ],
  },
  {
   title: "Exam-Level Problem Solving",
   summary:
    "FRQ-style method writing, especially for arrays/ArrayLists and class design; traversal/search patterns; debugging code segments; informal algorithm efficiency ideas.",
   hooks: [
    "FRQ-style method writing",
    "Array/ArrayList traversal patterns",
    "debugging code segments",
    "efficiency intuition (Big-O informal)",
   ],
  },
 ]),
 csp: unitsDetailed("csp", [
  {
   title: "Big Ideas of Computing Systems",
   summary:
    "Lesson 1.1 Computing systems: hardware vs software, devices and networks; Lesson 1.2 Internet basics: packets, routing, latency, redundancy; Lesson 1.3 Abstraction in computing systems: hiding complexity through layers; Lesson 1.4 Impact of computing: social, economic, and ethical effects; Lesson 1.5 Digital information: how data is represented and processed.",
   hooks: [
    "hardware vs software",
    "packets routing latency redundancy",
    "abstraction and layers",
    "social economic ethical impacts",
    "digital information representation",
   ],
  },
  {
   title: "Digital Information (Data Representation)",
   summary:
    "Lesson 2.1 Bits and bytes: binary representation fundamentals; Lesson 2.2 Number systems: binary to decimal conversion and vice versa; Lesson 2.3 Representing text: ASCII and Unicode basics; Lesson 2.4 Representing images: pixels, resolution, color encoding (RGB); Lesson 2.5 Representing sound: sampling, bit depth, compression basics; Lesson 2.6 Data compression: lossless vs lossy compression.",
   hooks: [
    "bits vs bytes",
    "binary decimal conversion",
    "ASCII vs Unicode",
    "pixels resolution RGB",
    "sampling bit depth compression",
    "lossless vs lossy",
   ],
  },
  {
   title: "Algorithms and Programming Basics",
   summary:
    "Lesson 3.1 Algorithms: definition, steps, and logic flow; Lesson 3.2 Pseudocode and flowcharts: representing algorithms clearly; Lesson 3.3 Sequencing, selection, iteration; Lesson 3.4 Variables and assignment; Lesson 3.5 Boolean logic and expressions; Lesson 3.6 Debugging and error detection; Lesson 3.7 Algorithm efficiency (basic comparison of steps/time).",
   hooks: [
    "algorithm steps and logic flow",
    "pseudocode and flowcharts",
    "sequencing selection iteration",
    "variables and assignment",
    "boolean logic",
    "debugging",
    "efficiency steps comparison",
   ],
  },
  {
   title: "Programming Concepts (App Development)",
   summary:
    "Lesson 4.1 Event-driven programming (especially in App Lab); Lesson 4.2 User input and output; Lesson 4.3 Functions: defining and calling procedures; Lesson 4.4 Parameters and return values; Lesson 4.5 Conditionals in code; Lesson 4.6 Loops in code; Lesson 4.7 Lists (basic data structures in CSP context); Lesson 4.8 Developing small apps with multiple components.",
   hooks: [
    "event-driven programming",
    "input and output",
    "procedures and functions",
    "parameters and return values",
    "conditionals",
    "loops",
    "lists",
    "multi-component apps",
   ],
  },
  {
   title: "The Internet and Cybersecurity",
   summary:
    "Lesson 5.1 How the internet works: clients, servers, protocols; Lesson 5.2 HTTP/HTTPS and basic web communication; Lesson 5.3 IP addresses and domain names (DNS); Lesson 5.4 Routing and packet switching; Lesson 5.5 Cybersecurity: encryption, hashing, authentication basics; Lesson 5.6 Threats: phishing, malware, social engineering; Lesson 5.7 Digital privacy and data protection.",
   hooks: [
    "clients servers protocols",
    "HTTP vs HTTPS",
    "IP and DNS",
    "routing packet switching",
    "encryption hashing authentication",
    "phishing malware social engineering",
    "privacy and data protection",
   ],
  },
  {
   title: "Data, Simulation, and Modeling",
   summary:
    "Lesson 6.1 Data collection and analysis; Lesson 6.2 Data visualization: charts, graphs, trends; Lesson 6.3 Simulations: modeling real-world systems; Lesson 6.4 Randomness and probability in simulations; Lesson 6.5 Using data to make predictions and conclusions.",
   hooks: [
    "data collection and analysis",
    "data visualization",
    "simulations and models",
    "randomness and probability",
    "predictions and conclusions",
   ],
  },
  {
   title: "Impact of Computing (Computing in Society)",
   summary:
    "Lesson 7.1 Bias in computing systems and datasets; Lesson 7.2 Ethical issues: privacy, surveillance, ownership; Lesson 7.3 Digital divide and accessibility; Lesson 7.4 Intellectual property and copyright; Lesson 7.5 Effects of computing innovations on society; Lesson 7.6 Responsible computing and decision-making.",
   hooks: [
    "bias in systems and datasets",
    "ethics privacy surveillance ownership",
    "digital divide accessibility",
    "intellectual property copyright",
    "innovations and societal effects",
    "responsible computing decisions",
   ],
  },
 ]),
 "physics-1": unitsDetailed("physics-1", [
  {
   title: "Kinematics (Motion in 1D and 2D)",
   summary:
    "Lesson 1.1 Position, displacement, distance, reference frames; Lesson 1.2 Velocity vs speed, average vs instantaneous velocity; Lesson 1.3 Acceleration meaning and sign interpretation; Lesson 1.4 Motion graphs: position-time, velocity-time, acceleration-time; Lesson 1.5 Kinematic equations (constant acceleration); Lesson 1.6 Free-fall motion under gravity; Lesson 1.7 Projectile motion: horizontal and vertical independence; Lesson 1.8 Relative motion basics (reference frame shifts).",
   hooks: [
    "reference frames and displacement",
    "average vs instantaneous velocity",
    "acceleration sign and meaning",
    "motion graphs interpretation",
    "constant-acceleration equations",
    "free fall under gravity",
    "projectile motion independence",
    "relative motion frame shifts",
   ],
  },
  {
   title: "Newton’s Laws of Motion",
   summary:
    "Lesson 2.1 Force concept and free-body diagrams (FBDs); Lesson 2.2 Newton’s First Law (inertia); Lesson 2.3 Newton’s Second Law (F = ma in vector form); Lesson 2.4 Newton’s Third Law (action-reaction pairs); Lesson 2.5 Weight vs normal force vs tension; Lesson 2.6 Friction: static and kinetic models; Lesson 2.7 Inclined planes: resolving forces into components; Lesson 2.8 Multi-object systems (connected masses, pulleys).",
   hooks: [
    "free-body diagrams",
    "Newton's first law inertia",
    "F equals ma vectors",
    "Newton's third law pairs",
    "weight normal tension",
    "static vs kinetic friction",
    "inclined plane components",
    "connected masses and pulleys",
   ],
  },
  {
   title: "Work, Energy, and Power",
   summary:
    "Lesson 3.1 Work definition (W = F·d cosθ); Lesson 3.2 Work-energy theorem; Lesson 3.3 Kinetic energy and potential energy; Lesson 3.4 Conservation of mechanical energy; Lesson 3.5 Non-conservative forces (friction, energy loss); Lesson 3.6 Springs and elastic potential energy; Lesson 3.7 Power (rate of energy transfer).",
   hooks: [
    "work dot product F d cos",
    "work-energy theorem",
    "kinetic and potential energy",
    "conservation of mechanical energy",
    "nonconservative forces and dissipation",
    "springs elastic potential energy",
    "power rate of energy transfer",
   ],
  },
  {
   title: "Momentum and Impulse",
   summary:
    "Lesson 4.1 Momentum definition (p = mv); Lesson 4.2 Impulse and change in momentum; Lesson 4.3 Conservation of momentum in isolated systems; Lesson 4.4 Elastic vs inelastic collisions; Lesson 4.5 1D and 2D collision analysis; Lesson 4.6 Center of mass basics (intro level).",
   hooks: [
    "momentum p equals mv",
    "impulse equals change in momentum",
    "momentum conservation",
    "elastic vs inelastic collisions",
    "1D and 2D collisions",
    "center of mass basics",
   ],
  },
  {
   title: "Circular Motion and Gravitation",
   summary:
    "Lesson 5.1 Uniform circular motion concepts; Lesson 5.2 Centripetal acceleration (a = v²/r); Lesson 5.3 Centripetal force (net inward force requirement); Lesson 5.4 Banked curves and vertical circles (conceptual level); Lesson 5.5 Universal gravitation (F = Gm₁m₂/r²); Lesson 5.6 Gravitational field strength and weight variation; Lesson 5.7 Orbital motion basics (circular orbit speed and period relationships).",
   hooks: [
    "uniform circular motion",
    "centripetal acceleration v squared over r",
    "net inward force requirement",
    "banked curves and vertical circles",
    "universal gravitation",
    "gravitational field strength and weight",
    "orbital speed and period relations",
   ],
  },
  {
   title: "Simple Harmonic Motion (SHM)",
   summary:
    "Lesson 6.1 Oscillation basics (equilibrium, restoring force); Lesson 6.2 Springs and Hooke’s Law (F = -kx); Lesson 6.3 Mass-spring systems and SHM behavior; Lesson 6.4 Energy in SHM (exchange between KE and PE); Lesson 6.5 Period and frequency relationships; Lesson 6.6 Pendulums (small-angle approximation).",
   hooks: [
    "equilibrium and restoring force",
    "Hooke's law negative kx",
    "mass-spring SHM behavior",
    "energy exchange in SHM",
    "period and frequency",
    "pendulum small-angle approximation",
   ],
  },
  {
   title: "Torque and Rotational Motion",
   summary:
    "Lesson 7.1 Angular position, velocity, acceleration; Lesson 7.2 Torque (τ = rF sinθ); Lesson 7.3 Rotational equilibrium (net torque = 0); Lesson 7.4 Moment of inertia (rotational resistance concept); Lesson 7.5 Rotational Newton’s Second Law (τ = Iα); Lesson 7.6 Angular momentum basics (intro conservation idea).",
   hooks: [
    "angular kinematics",
    "torque r F sin",
    "rotational equilibrium net torque zero",
    "moment of inertia concept",
    "tau equals I alpha",
    "angular momentum conservation intro",
   ],
  },
  {
   title: "Fluids (basic AP Physics 1 level)",
   summary:
    "Lesson 8.1 Density and pressure; Lesson 8.2 Fluid pressure with depth (P = ρgh); Lesson 8.3 Pascal’s principle; Lesson 8.4 Buoyancy and Archimedes’ principle; Lesson 8.5 Fluid flow concepts (qualitative continuity ideas).",
   hooks: [
    "density and pressure",
    "pressure with depth rho g h",
    "Pascal principle",
    "buoyancy and Archimedes principle",
    "continuity qualitative flow",
   ],
  },
  {
   title: "Experimental Design and Data Analysis (throughout course)",
   summary:
    "Lesson 9.1 Experimental variables: independent, dependent, controlled; Lesson 9.2 Uncertainty and measurement error; Lesson 9.3 Graph interpretation and slope meaning in physics context; Lesson 9.4 Linearization of relationships; Lesson 9.5 Designing and analyzing experiments (FRQ focus skill).",
   hooks: [
    "independent dependent controlled variables",
    "uncertainty and measurement error",
    "graph slope meaning",
    "linearization",
    "design and analyze experiments",
   ],
  },
 ]),
 "physics-2": unitsDetailed("physics-2", [
  {
   title: "Fluids (expanded from AP Physics 1)",
   summary:
    "Lesson 1.1 Density and specific gravity; Lesson 1.2 Pressure in fluids (P = F/A, P = ρgh); Lesson 1.3 Pascal’s principle and hydraulic systems; Lesson 1.4 Buoyancy (Archimedes’ principle) and floating equilibrium; Lesson 1.5 Fluid flow basics: continuity equation (A₁v₁ = A₂v₂); Lesson 1.6 Bernoulli’s principle (qualitative energy in fluids).",
   hooks: [
    "density and specific gravity",
    "fluid pressure F over A rho g h",
    "Pascal principle hydraulics",
    "buoyancy and floating equilibrium",
    "continuity equation A1v1 equals A2v2",
    "Bernoulli qualitative energy",
   ],
  },
  {
   title: "Thermodynamics",
   summary:
    "Lesson 2.1 Temperature vs heat vs internal energy; Lesson 2.2 Thermal equilibrium and zeroth law; Lesson 2.3 Heat transfer: conduction, convection, radiation; Lesson 2.4 Specific heat capacity (Q = mcΔT); Lesson 2.5 Phase changes and latent heat; Lesson 2.6 Ideal gas law (PV = nRT); Lesson 2.7 Kinetic molecular theory (gas behavior at microscopic level); Lesson 2.8 Thermodynamic processes: isothermal, isobaric, isochoric, adiabatic; Lesson 2.9 First law of thermodynamics (ΔU = Q − W); Lesson 2.10 PV diagrams and work interpretation.",
   hooks: [
    "temperature heat internal energy",
    "zeroth law thermal equilibrium",
    "conduction convection radiation",
    "specific heat Q equals mc delta T",
    "latent heat phase change",
    "ideal gas law PV equals nRT",
    "kinetic molecular theory",
    "thermodynamic processes types",
    "first law delta U equals Q minus W",
    "PV diagrams and work",
   ],
  },
  {
   title: "Electric Force, Field, and Potential",
   summary:
    "Lesson 3.1 Electric charge and conservation of charge; Lesson 3.2 Coulomb’s law (F = kq₁q₂/r²); Lesson 3.3 Electric field (E = F/q) and field diagrams; Lesson 3.4 Superposition of electric fields; Lesson 3.5 Electric potential energy; Lesson 3.6 Electric potential (voltage) and equipotential lines; Lesson 3.7 Relationship between field and potential (E = −dV/dx conceptually).",
   hooks: [
    "charge conservation",
    "Coulomb law inverse square",
    "electric field definition and diagrams",
    "superposition of fields",
    "electric potential energy",
    "voltage and equipotentials",
    "field vs potential conceptual derivative",
   ],
  },
  {
   title: "DC Circuits",
   summary:
    "Lesson 4.1 Current, resistance, and Ohm’s law (V = IR); Lesson 4.2 Power in circuits (P = IV, P = I²R, P = V²/R); Lesson 4.3 Series circuits: current, voltage, equivalent resistance; Lesson 4.4 Parallel circuits: current splitting, equivalent resistance; Lesson 4.5 Kirchhoff’s laws (junction and loop rules); Lesson 4.6 Multi-loop circuit analysis; Lesson 4.7 Capacitors in circuits (basic charge, voltage, energy); Lesson 4.8 RC circuits (charging and discharging behavior, qualitative + equations).",
   hooks: [
    "Ohm law V equals IR",
    "circuit power formulas",
    "series circuit rules",
    "parallel circuit rules",
    "Kirchhoff junction and loop rules",
    "multi-loop analysis",
    "capacitors Q V energy",
    "RC charging and discharging",
   ],
  },
  {
   title: "Magnetism and Electromagnetism",
   summary:
    "Lesson 5.1 Magnetic fields and field direction rules; Lesson 5.2 Force on moving charges (F = qvB sinθ); Lesson 5.3 Force on current-carrying wires; Lesson 5.4 Motion of charged particles in magnetic fields (circular paths); Lesson 5.5 Electromagnetic induction basics; Lesson 5.6 Faraday’s law (changing flux induces emf); Lesson 5.7 Lenz’s law (direction of induced current); Lesson 5.8 Applications: generators and motors (conceptual level).",
   hooks: [
    "magnetic field direction rules",
    "force on moving charge q v B",
    "force on current-carrying wire",
    "charged particle circular motion in B",
    "induction basics",
    "Faraday law changing flux",
    "Lenz law direction",
    "generators and motors concepts",
   ],
  },
  {
   title: "Geometric and Physical Optics",
   summary:
    "Lesson 6.1 Wave nature of light; Lesson 6.2 Reflection and refraction basics; Lesson 6.3 Snell’s law (n₁sinθ₁ = n₂sinθ₂); Lesson 6.4 Total internal reflection; Lesson 6.5 Mirrors: ray diagrams and image formation; Lesson 6.6 Lenses: converging and diverging lens equations; Lesson 6.7 Thin lens equation (1/f = 1/do + 1/di); Lesson 6.8 Magnification and image properties; Lesson 6.9 Interference and diffraction (qualitative introduction).",
   hooks: [
    "wave nature of light",
    "reflection and refraction",
    "Snell law",
    "total internal reflection",
    "mirror ray diagrams",
    "lens types and ray diagrams",
    "thin lens equation",
    "magnification and image properties",
    "interference and diffraction qualitative",
   ],
  },
  {
   title: "Modern Physics",
   summary:
    "Lesson 7.1 Quantum concepts: photons and energy quantization; Lesson 7.2 Photoelectric effect (light as particles, threshold frequency); Lesson 7.3 de Broglie wavelength (matter waves concept); Lesson 7.4 Atomic models and energy levels; Lesson 7.5 Nuclear physics basics: decay, half-life; Lesson 7.6 Mass-energy equivalence (E = mc²); Lesson 7.7 Radioactivity types (alpha, beta, gamma) and penetration.",
   hooks: [
    "photons and quantization",
    "photoelectric effect threshold",
    "de Broglie wavelength matter waves",
    "atomic energy levels",
    "nuclear decay and half-life",
    "mass-energy equivalence",
    "alpha beta gamma penetration",
   ],
  },
  {
   title: "Experimental Design and Data Analysis",
   summary:
    "Lesson 8.1 Experimental variables and control design; Lesson 8.2 Uncertainty, error propagation (basic AP level); Lesson 8.3 Linearization of relationships; Lesson 8.4 Graph interpretation (slope/area meaning in physics contexts); Lesson 8.5 Experimental justification and reasoning (FRQ-style explanations); Lesson 8.6 Designing experiments with constraints and assumptions.",
   hooks: [
    "variables and controls",
    "uncertainty and error propagation",
    "linearization",
    "graph slope and area meaning",
    "FRQ-style experimental reasoning",
    "constraints and assumptions in design",
   ],
  },
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
