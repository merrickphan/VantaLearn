import { formatNiceMath } from "@/lib/typography/niceMath";

/**
 * Alternate stems for numeric / skill items — multiplies distinct "question structures"
 * while keeping the same AP-style math and difficulty.
 */

export const DERIVATIVE_POWER_STEMS = [
 "If f(x) = {{fx}}, then f'(x) equals",
 "Let f(x) = {{fx}}. The derivative f'(x) is",
 "For f(x) = {{fx}}, compute f'(x).",
 "Differentiate f(x) = {{fx}}. Then f'(x) =",
 "Find f'(x) if f(x) = {{fx}}.",
 "Using the power rule on f(x) = {{fx}}, f'(x) equals",
 "The derivative of f(x) = {{fx}} is",
 "If f is defined by f(x) = {{fx}}, then f'(x) =",
 "For {{fx}}, the first derivative equals",
 "Apply the power rule to f(x) = {{fx}}. Then f'(x) is",
 "Let f(x) = {{fx}}. Which expression equals f'(x)?",
 "Compute d/dx[{{fx}}].",
 "The slope of the tangent to y = {{fx}} is given by f'(x) =",
 "If y = {{fx}}, then dy/dx =",
 "For f(x) = {{fx}}, select f'(x).",
 "Differentiate: f(x) = {{fx}}. Then",
 "The instantaneous rate of change of f(x) = {{fx}} is",
 "Find the derivative: f(x) = {{fx}}.",
 "Given f(x) = {{fx}}, f'(x) equals",
 "Use the power rule on {{fx}}. Then f'(x) =",
 "If f(x) = {{fx}}, which of the following is f'(x)?",
 "The derivative f'(x) for f(x) = {{fx}} is",
 "For f(x) = {{fx}}, the derivative equals",
 "Compute f'(x) for f(x) = {{fx}}.",
 "Let y = {{fx}}. Then dy/dx equals",
 "The first derivative of {{fx}} is",
 "If f(x) = {{fx}}, then d/dx f(x) =",
 "Differentiate f(x) = {{fx}} with respect to x.",
 "For {{fx}}, f'(x) is",
 "The power rule applied to f(x) = {{fx}} yields",
 "Find f'(x) given f(x) = {{fx}}.",
 "If f(x) = {{fx}}, the derivative is",
 "Compute the derivative of f(x) = {{fx}}.",
 "Let f(x) = {{fx}}. Then f'(x) equals",
 "For f(x) = {{fx}}, the slope function is",
 "Differentiate: {{fx}}.",
 "The derivative of the polynomial f(x) = {{fx}} equals",
 "If f(x) = {{fx}}, which expression is f'(x)?",
 "Using differentiation rules, f'(x) for f(x) = {{fx}} is",
 "For f(x) = {{fx}}, select the correct f'(x).",
 "A model for a quantity on an interval is f(x) = {{fx}}. Then f'(x) =",
 "For the differentiable rule f(x) = {{fx}}, the derivative is",
 "If output follows f(x) = {{fx}} on the domain of interest, then f'(x) equals",
 "The instantaneous rate of change of f(x) = {{fx}} is",
 "An open-interval model uses f(x) = {{fx}}. Its derivative f'(x) is",
 "Given f(x) = {{fx}} on an interval where f is differentiable, f'(x) =",
 "The marginal expression f'(x) for f(x) = {{fx}} simplifies to",
 "For f defined by f(x) = {{fx}}, the derivative with respect to x is",
] as const;

export const LIMIT_LINEAR_STEMS = [
 "Find the limit as x approaches {{c}} of ({{a}}x + {{b}}).",
 "Evaluate lim(x -> {{c}}) ({{a}}x + {{b}}).",
 "What is the limit of ({{a}}x + {{b}}) as x approaches {{c}}?",
 "Compute lim(x -> {{c}}) [{{a}}x + {{b}}].",
 "As x approaches {{c}}, the expression ({{a}}x + {{b}}) approaches",
 "Determine lim(x -> {{c}}) ({{a}}x + {{b}}).",
 "The limit as x -> {{c}} of the linear function ({{a}}x + {{b}}) is",
 "Evaluate the limit: lim(x -> {{c}}) ({{a}}x + {{b}}).",
 "For f(x) = {{a}}x + {{b}}, find lim(x -> {{c}}) f(x).",
 "What value does ({{a}}x + {{b}}) approach as x -> {{c}}?",
 "lim(x -> {{c}}) ({{a}}x + {{b}}) equals",
 "Find lim(x -> {{c}}) [{{a}}x + {{b}}].",
 "As x nears {{c}}, ({{a}}x + {{b}}) tends to",
 "The limit of the linear expression as x approaches {{c}} is",
 "Compute the limit as x -> {{c}} of ({{a}}x + {{b}}).",
 "Evaluate lim(x -> {{c}}) ({{a}}x + {{b}}) by direct substitution.",
 "What is lim(x -> {{c}}) ({{a}}x + {{b}})?",
 "For continuous linear f(x) = {{a}}x + {{b}}, lim(x -> {{c}}) f(x) =",
 "The limit as x approaches {{c}} of ({{a}}x + {{b}}) equals",
 "Find the value of lim(x -> {{c}}) ({{a}}x + {{b}}).",
] as const;

export const INTEGRAL_POWER_STEMS = [
 "An antiderivative of {{coef}}x^{{n}} is",
 "Find ∫ {{coef}}x^{{n}} dx (one antiderivative).",
 "Which expression is an indefinite integral of {{coef}}x^{{n}}?",
 "∫ {{coef}}x^{{n}} dx equals (up to + C)",
 "An antiderivative F(x) for f(x) = {{coef}}x^{{n}} satisfies F(x) =",
 "Integrate: ∫ {{coef}}x^{{n}} dx =",
 "The family of antiderivatives of {{coef}}x^{{n}} includes",
 "Which is ∫ {{coef}}x^{{n}} dx?",
 "Evaluate ∫ {{coef}}x^{{n}} dx.",
 "Find one antiderivative of f(x) = {{coef}}x^{{n}}.",
 "∫ {{coef}}x^{{n}} dx is (do not forget + C in spirit)",
 "Antidifferentiate {{coef}}x^{{n}}.",
 "A primitive of {{coef}}x^{{n}} is",
 "Which indefinite integral is correct for {{coef}}x^{{n}}?",
 "Compute ∫ {{coef}}x^{{n}} dx.",
 "The integral of {{coef}}x^{{n}} with respect to x is",
 "∫ {{coef}}x^{{n}} dx yields",
 "Find ∫ {{coef}}x^{{n}} dx (one member of the family).",
 "Which expression equals ∫ {{coef}}x^{{n}} dx?",
 "Antidifferentiate f(x) = {{coef}}x^{{n}}.",
] as const;

export const COMPOSITION_STEMS = [
 "If f(x) = {{oc}}x and g(x) = {{a}}x + {{b}}, what is f(g({{x0}}))?",
 "Let f(x) = {{oc}}x and g(x) = {{a}}x + {{b}}. Evaluate f(g({{x0}})).",
 "Given f(x) = {{oc}}x and g(x) = {{a}}x + {{b}}, compute f(g({{x0}})).",
 "For f(x) = {{oc}}x and g(x) = {{a}}x + {{b}}, find f(g({{x0}})).",
 "Composition: f ∘ g at x = {{x0}}, where f(x) = {{oc}}x and g(x) = {{a}}x + {{b}}, equals",
 "If g(x) = {{a}}x + {{b}} and f(x) = {{oc}}x, then f(g({{x0}})) =",
 "Evaluate f(g({{x0}})) for f(x) = {{oc}}x, g(x) = {{a}}x + {{b}}.",
 "What is f(g({{x0}})) if f(x) = {{oc}}x and g(x) = {{a}}x + {{b}}?",
 "Let f(x) = {{oc}}x, g(x) = {{a}}x + {{b}}. Then f(g({{x0}})) equals",
 "Find the composite value f(g({{x0}})) given f(x) = {{oc}}x and g(x) = {{a}}x + {{b}}.",
 "Compute (f ∘ g)({{x0}}) for f(x) = {{oc}}x and g(x) = {{a}}x + {{b}}.",
 "If f(x) = {{oc}}x and g(x) = {{a}}x + {{b}}, (f ∘ g)({{x0}}) =",
 "Given g({{x0}}) with g(x) = {{a}}x + {{b}}, and f(x) = {{oc}}x, find f(g({{x0}})).",
 "For f(x) = {{oc}}x and linear g(x) = {{a}}x + {{b}}, evaluate f(g({{x0}})).",
 "What is the output of f(g({{x0}})) when f(x) = {{oc}}x and g(x) = {{a}}x + {{b}}?",
] as const;

export const MEAN_STEMS = [
 "The sample mean of {{a}}, {{b}}, and {{c}} is",
 "For the data set {{a}}, {{b}}, {{c}}, the mean equals",
 "Compute the mean of {{a}}, {{b}}, and {{c}}.",
 "What is x-bar for {{a}}, {{b}}, {{c}}?",
 "The arithmetic average of {{a}}, {{b}}, and {{c}} is",
 "Find the average (mean) of {{a}}, {{b}}, and {{c}}.",
 "Given values {{a}}, {{b}}, {{c}}, the sample mean is",
 "The mean of the three numbers {{a}}, {{b}}, and {{c}} equals",
 "Calculate the mean: {{a}}, {{b}}, {{c}}.",
 "For observations {{a}}, {{b}}, {{c}}, compute the mean.",
 "The average of {{a}}, {{b}}, and {{c}} is",
 "What is the mean of {{a}}, {{b}}, {{c}}?",
 "Find x̄ for {{a}}, {{b}}, {{c}}.",
 "The sample average for {{a}}, {{b}}, {{c}} is",
 "Mean = ? for data {{a}}, {{b}}, {{c}}.",
] as const;

export const KINEMATICS_STEMS = [
 "A particle accelerates from {{v0}} m/s at {{a}} m/s² for {{t}} s. Its final speed is",
 "Starting at {{v0}} m/s with constant acceleration {{a}} m/s² for {{t}} s, final speed equals",
 "Use v = v0 + at with v0 = {{v0}}, a = {{a}}, t = {{t}}. Final speed is",
 "A cart starts at {{v0}} m/s and accelerates at {{a}} m/s² for {{t}} s. Its speed at the end is",
 "From rest speed {{v0}} m/s, acceleration {{a}} m/s² for {{t}} s gives final speed",
 "Kinematics: v0 = {{v0}} m/s, a = {{a}} m/s², t = {{t}} s. Find v.",
 "After {{t}} s, with v0 = {{v0}} m/s and a = {{a}} m/s², speed is",
 "A particle has v0 = {{v0}} m/s and a = {{a}} m/s² for {{t}} s. Final |v| (speed magnitude) is",
 "Constant acceleration {{a}} m/s² for {{t}} s from {{v0}} m/s yields final speed",
 "Compute final speed: v0 = {{v0}} m/s, a = {{a}} m/s², t = {{t}} s.",
] as const;

export const KINETIC_ENERGY_STEMS = [
 "Kinetic energy K = 1/2mv^2 for m = {{m}} kg and v = {{v}} m/s is",
 "Find K = 1/2 mv^2 when m = {{m}} kg and v = {{v}} m/s.",
 "A {{m}} kg object moves at {{v}} m/s. Its kinetic energy is",
 "Compute kinetic energy for m = {{m}} kg, v = {{v}} m/s.",
 "Using K = 1/2mv^2 with m = {{m}} and v = {{v}}, K equals",
 "What is the kinetic energy if m = {{m}} kg and speed is {{v}} m/s?",
 "For mass {{m}} kg and speed {{v}} m/s, K =",
 "1/2 mv^2 for m = {{m}}, v = {{v}} gives",
 "A {{m}} kg particle has speed {{v}} m/s. K =",
 "Evaluate 1/2 * {{m}} * ({{v}})^2 (joules).",
] as const;

export const MOLARITY_STEMS = [
 "What is the molarity of a solution with {{mol}} mol solute in {{L}} L of solution?",
 "Calculate M when {{mol}} mol are dissolved in {{L}} L total volume.",
 "Molarity = moles / liters. For {{mol}} mol in {{L}} L, M =",
 "Find M for {{mol}} mol in {{L}} L of solution.",
 "A solution contains {{mol}} mol of solute in {{L}} L. Its molarity is",
 "Compute molarity: {{mol}} mol / {{L}} L =",
 "How many molar is a solution with {{mol}} mol in {{L}} L?",
 "Determine M if {{mol}} mol are in {{L}} L total volume.",
 "Using M = n/V with n = {{mol}} mol and V = {{L}} L,",
 "What is M when volume is {{L}} L and amount is {{mol}} mol?",
] as const;

/** Stems used when f(x) appears in a stimulus exhibit (not repeated in the stem line). */
export const DERIVATIVE_AFTER_STIM_STEMS = [
 "Based on the function in the stimulus, f'(x) equals",
 "f'(x) equals",
 "An expression for the derivative f'(x) is",
 "Which expression is equal to f'(x)?",
 "The derivative of f is",
 "Select the correct f'(x).",
 "Using differentiation rules on the given f, f'(x) =",
 "The first derivative satisfies f'(x) =",
 "For the model f shown above, an equivalent expression for f'(x) is",
 "The rate-of-change function f'(x) is",
 "Which of these is f'(x) for the defined f?",
 "Differentiate the displayed f(x). Then f'(x) =",
 "The slope function associated with f is",
 "An antiderivative’s derivative is not requested — only f'(x). Here f'(x) =",
 "Compute f'(x) from the definition of f in the exhibit.",
 "The instantaneous rate of change of f with respect to x is given by f'(x) =",
 "If f is as given, then d/dx[f(x)] =",
 "The derivative with respect to x of the exhibited f satisfies",
 "Select f'(x) consistent with the power rule on the given polynomial.",
 "The tangent-line slope function for the graph of f is",
 "For all x in the domain shown, f'(x) equals",
 "Using only algebraic differentiation, f'(x) =",
 "The first derivative of the exhibited f may be written as",
 "Which expression matches f'(x) after simplifying?",
 "The derivative operator applied to f yields",
 "For the differentiable f above, f'(x) is equivalent to",
 "Identify f'(x) from the explicit rule for f.",
 "The derivative f'(x) simplifies to",
 "After differentiating term-by-term, f'(x) equals",
 "The marginal rate f'(x) for the model f is",
] as const;

export const CALC_FUNCTION_INTROS = [
 "A differentiable function f is defined as follows.",
 "The exhibit below gives an explicit formula for f(x) on an open interval.",
 "Consider a polynomial model f used to approximate a quantity on an interval where f is differentiable.",
 "An analyst defines f for all real x in an open interval where the derivative exists.",
 "A researcher fits f to observational data; assume f is differentiable on the stated domain.",
 "The graph’s algebraic rule for f is recorded in the box below (f differentiable as indicated).",
 "For a motion study, position along a line is modeled by f(t) with respect to time t; treat x as the independent variable shown.",
 "A calibration curve is modeled by f on a laboratory interval where differentiation is valid.",
 "A free-response style exhibit defines f algebraically below.",
 "Assume f is differentiable wherever the rule below is defined on the real line.",
 "The following rule defines f on an interval where the derivative test applies.",
 "A textbook exhibit defines f piecewise from polynomials; use only the branch shown for your task.",
 "An economist’s simplified cost curve is f(x) for output x; f is smooth on the interval of interest.",
 "A physics lab approximates a potential curve by f(x); treat f as differentiable on the window shown.",
 "The function f models cumulative rainfall over a short interval; f is differentiable on that interval.",
 "Below, f is given explicitly so that derivative exercises use the same display conventions as AP practice.",
 "The rule for f is chosen so that f' can be found with differentiation rules only (no implicit steps).",
 "A student’s calculator screen is summarized algebraically as f below; differentiate symbolically.",
 "The polynomial f models a small segment of a larger curve; assume standard differentiability.",
 "For the interval under study, f is given by the expression below and is differentiable there.",
] as const;

/** Short exhibit text when the full rule for f appears in the stem (avoids duplicating f(x) = …). */
export const CALC_FUNCTION_CONTEXT_ONLY = [
 "Differentiable function f is used on an open interval; the explicit rule appears in the question stem.",
 "Assume standard differentiability on the domain implied by the rule stated in the stem.",
 "The polynomial rule for f is written in the stem; treat x as the independent variable.",
 "Use differentiation rules only; the definition of f is given in the stem.",
 "An analyst models a quantity with f as in the stem; f is differentiable where the rule is defined.",
 "The exhibit summarizes context only — refer to the stem for the algebraic rule for f.",
 "All questions use the same notational conventions as AP Calculus practice materials.",
 "The function f is polynomial on its domain; see the stem for its formula.",
 "Compute symbolically; the rule for f appears once in the stem.",
 "Differentiate with respect to x using the rule stated in the stem.",
] as const;

/** Context-only lines when the integrand appears in the stem (no duplicate f(x) in the exhibit). */
export const CALC_ANTIDERIV_CONTEXT_ONLY = [
 "Find an antiderivative using the integrand written in the stem.",
 "The integrand is stated in the stem; use standard indefinite integration rules.",
 "Assume the integrand is defined on an interval where antidifferentiation applies as usual.",
 "Integrate with respect to x; the power appears in the stem.",
 "Use algebraic antidifferentiation only; refer to the stem for the integrand.",
] as const;

export const LIMIT_AFTER_TABLE_STEMS = [
 "Assume g is the linear function described in the table. Find the limit of g(x) as x approaches c.",
 "Let g(x) = ax + b with parameters given in the table. Evaluate lim(x → c) g(x).",
 "Using the table, compute lim(x → c) g(x) for the linear function g.",
 "For g defined by the table, determine lim(x → c) g(x).",
 "The limit as x approaches c (see table) of g(x) is",
 "Read slopes and intercepts from the table; then lim(x → c) g(x) equals",
 "If g is linear with the tabulated values, the limit as x → c is",
 "The table encodes g near c; evaluate lim(x → c) g(x).",
] as const;

export const INTEGRAL_AFTER_STIM_STEMS = [
 "For the integrand shown in the stimulus, one antiderivative is",
 "An indefinite integral equals (up to + C)",
 "∫ f(x) dx yields",
 "Which expression is ∫ f(x) dx?",
 "Antidifferentiate the integrand in the exhibit; a member of the family is",
 "A correct indefinite integral (ignore + C in the choices if omitted) is",
 "Select an antiderivative F with F' = f for the given f.",
 "∫ f(x) dx can be written as",
] as const;

export const COMPOSITION_TABLE_STEMS = [
 "Use the definitions of f and g in the table. f(g({{x0}})) equals",
 "Evaluate f(g({{x0}})) using the table.",
 "According to the table, f(g({{x0}})) =",
 "Compute the composition using the table for x = {{x0}}.",
 "From the tabulated rules, (f ∘ g)({{x0}}) equals",
 "Chain the outputs: first g({{x0}}), then apply f. The result is",
] as const;

export const MEAN_AFTER_TABLE_STEMS = [
 "The sample mean of the three observations in the table is",
 "Compute x̄ for the data in the table.",
 "What is the mean of the values listed in the table?",
 "The arithmetic average of the tabled observations equals",
 "The mean of the three table entries is",
 "Average the values shown in the table; x̄ equals",
] as const;

export const ZSCORE_TABLE_STEMS = [
 "Using the notation in the table, the z-score for an observation x is",
 "The standardized score z equals",
 "Which expression standardizes x using mu and sigma?",
 "Standardize x with the table’s mean and SD: z =",
 "The z-score corresponding to x under the table model is",
] as const;

export const KINEMATICS_TABLE_STEMS = [
 "Using the kinematic parameters in the table (SI units), the final speed magnitude is",
 "From the table, v equals",
 "The particle's final speed is",
 "Apply v = v0 + at with tabled quantities; final speed is",
 "The magnitude of velocity after the interval in the table is",
] as const;

export const KE_TABLE_STEMS = [
 "Using the values in the table, the kinetic energy K = 1/2 mv^2 is",
 "From the table, K equals",
 "Compute K from the tabulated m and v.",
 "Evaluate 1/2 m v^2 using the table entries; K =",
 "The kinetic energy computed from the table is",
] as const;

export const MOLARITY_TABLE_STEMS = [
 "Using the solution data in the table, the molarity M is",
 "From the table, M equals",
 "Compute M = n/V using the table.",
 "Molarity from the tabulated moles and volume is",
 "The solution’s molarity consistent with the table is",
] as const;

/** Replace {{key}} placeholders in template string. */
export function fillStem(template: string, vars: Record<string, string | number>): string {
 let s = template;
 for (const [k, v] of Object.entries(vars)) {
 s = s.split(`{{${k}}}`).join(String(v));
 }
 return formatNiceMath(s);
}
