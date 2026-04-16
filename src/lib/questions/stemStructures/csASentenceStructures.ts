/**
 * Enumerated AP Computer Science A MCQ stem **sentence structures** (grammatical skeletons).
 * Built as a Cartesian product: 40 × 25 = 1000 distinct strings.
 *
 * Notes:
 * - Java-only framing (AP CSA).
 * - Parameters like variable names and literal values do not count as new structures.
 */

const CSA_OPEN_LEADS = [
	"Consider the following Java code segment",
	"Given the Java class and method shown",
	"Assume the following variables have been initialized as shown",
	"Using Java operator precedence rules",
	"After evaluating the expression in Java",
	"Assume integer arithmetic unless a double is involved",
	"Assume the cast occurs exactly as written",
	"Given that Strings are immutable in Java",
	"Using the String method call shown",
	"Given the boolean expression shown",
	"Using short-circuit evaluation in Java",
	"Consider the if statement and its condition",
	"Consider the nested conditional structure shown",
	"Consider the switch statement behavior shown",
	"Consider the while loop shown",
	"Consider the for loop shown",
	"Consider the loop that uses an accumulator variable",
	"Consider the nested loops in the code segment",
	"Consider the array declaration and initialization shown",
	"Using zero-based indexing for arrays in Java",
	"Consider the array traversal shown",
	"Consider the ArrayList operations shown",
	"Using ArrayList size() and index rules",
	"Consider the wrapper class usage shown",
	"Consider the class with private instance variables shown",
	"Consider the constructor call shown",
	"Consider the accessor/mutator method calls shown",
	"Consider the use of the keyword this in the method",
	"Consider the superclass/subclass relationship shown",
	"Given the method override shown in the subclass",
	"Using the keyword super as shown",
	"Consider polymorphism with a superclass reference",
	"Consider the recursive method shown",
	"Consider the base case and recursive case shown",
	"Tracing the recursive calls as written",
	"Consider the call stack behavior implied by the recursion",
	"Consider the array/ArrayList FRQ-style traversal pattern",
	"Consider the code segment being debugged",
	"Considering informal efficiency as n grows",
	"Using standard AP CSA multiple-choice conventions",
] as const;

const CSA_TASK_FRAMES = [
	"what is printed to the console",
	"what is the final value of the variable after the code executes",
	"which expression has type double (not int)",
	"which statement about casting is correct",
	"which value is returned by the method call",
	"which option correctly describes String concatenation in this context",
	"what is the value of the boolean expression",
	"which condition is logically equivalent by De Morgan’s law",
	"which branch of the if/else structure executes",
	"how many times does the loop body execute",
	"which loop condition would cause an infinite loop",
	"which change fixes an off-by-one error",
	"which array index access is valid",
	"which traversal visits every element exactly once",
	"what value is stored at a specific array index after the loop",
	"which statement about ArrayList add/remove shifting is correct",
	"what is the value returned by size() after the operations",
	"which call correctly updates an element with set(index, value)",
	"which statement best describes encapsulation in the class",
	"which constructor correctly initializes the instance variables",
	"which method is an accessor (getter)",
	"which method is a mutator (setter)",
	"which method call demonstrates polymorphism",
	"which statement about overriding is correct",
	"what value is returned by the recursive method for the input shown",
] as const;

function buildCsaStructures(): readonly string[] {
	const out: string[] = [];
	for (const lead of CSA_OPEN_LEADS) {
		for (const frame of CSA_TASK_FRAMES) {
			out.push(`${lead}, ${frame}?`);
		}
	}
	return out;
}

/** Exactly 1000 distinct stem skeletons for AP CSA. */
export const CSA_SENTENCE_STRUCTURES: readonly string[] = buildCsaStructures();

const _csaSet = new Set(CSA_SENTENCE_STRUCTURES);
if (_csaSet.size !== CSA_SENTENCE_STRUCTURES.length) {
	throw new Error("csASentenceStructures: duplicate sentence structures in Cartesian product");
}
if (CSA_SENTENCE_STRUCTURES.length < 1000) {
	throw new Error(`csASentenceStructures: expected at least 1000 structures, got ${CSA_SENTENCE_STRUCTURES.length}`);
}

export function csaSentenceStructureIndex(seed: number): number {
	const n = CSA_SENTENCE_STRUCTURES.length;
	const x = Number.isFinite(seed) ? Math.floor(Math.abs(seed)) : 0;
	return ((x % n) + n) % n;
}

export function getCsaSentenceStructure(seed: number): string {
	return CSA_SENTENCE_STRUCTURES[csaSentenceStructureIndex(seed)];
}

