import katex from "katex";
import type { ReactNode } from "react";
import { formatNiceMath } from "@/lib/typography/niceMath";
import { hasLatexDelimiters, latexifyExamPlainMath } from "@/lib/typography/examPlainMathToLatex";

type MathTextProps = {
	text: string | null | undefined;
	/**
	 * When true, runs `formatNiceMath` on the non-LaTeX text segments.
	 * This is helpful for things like `km^2 → km²` outside math delimiters.
	 */
	prettifyText?: boolean;
	/**
	 * Exam MCQ / calc: if the string has no `\\(` delimiters, upgrade sqrt, fractions, Σ, lim, etc.
	 * to real LaTeX and wrap in `\\( \\displaystyle … \\)` so KaTeX renders symbols correctly.
	 */
	examMath?: boolean;
};

const INLINE_RE = /\\\(([\s\S]+?)\\\)/g;
const DISPLAY_RE = /\\\[([\s\S]+?)\\\]/g;
const ANY_RE = /\\\(([\s\S]+?)\\\)|\\\[([\s\S]+?)\\\]/g;

function renderKatexToHtml(src: string, displayMode: boolean): string {
	try {
		return katex.renderToString(src, {
			displayMode,
			throwOnError: false,
			strict: "ignore",
			trust: false,
			output: "html",
		});
	} catch {
		return src;
	}
}

/**
 * Render strings that may contain LaTeX delimiters:
 * - inline: `\\( ... \\)`
 * - display: `\\[ ... \\]`
 */
export function MathText({ text, prettifyText = true, examMath = false }: MathTextProps) {
	const raw = text ?? "";
	if (!raw) return null;

	const processed =
		examMath && !hasLatexDelimiters(raw) ? latexifyExamPlainMath(raw) : raw;

	// Fast path: no LaTeX delimiters detected (use fresh check; global regex .test() mutates lastIndex).
	if (!hasLatexDelimiters(processed)) {
		return <>{prettifyText ? formatNiceMath(processed) : processed}</>;
	}

	ANY_RE.lastIndex = 0;
	const out: ReactNode[] = [];
	let last = 0;
	let match: RegExpExecArray | null;

	while ((match = ANY_RE.exec(processed))) {
		const idx = match.index;
		if (idx > last) {
			const chunk = processed.slice(last, idx);
			out.push(<span key={`t-${last}`}>{prettifyText ? formatNiceMath(chunk) : chunk}</span>);
		}

		const inlineSrc = match[1];
		const displaySrc = match[2];
		const isDisplay = typeof displaySrc === "string" && displaySrc.length > 0;
		const src = (isDisplay ? displaySrc : inlineSrc) ?? "";
		const html = renderKatexToHtml(src, isDisplay);

		out.push(
			<span
				key={`m-${idx}`}
				className={isDisplay ? "katex-display" : "katex-inline"}
				dangerouslySetInnerHTML={{ __html: html }}
			/>,
		);

		last = idx + match[0].length;
	}

	if (last < processed.length) {
		const tail = processed.slice(last);
		out.push(<span key={`t-${last}`}>{prettifyText ? formatNiceMath(tail) : tail}</span>);
	}

	return <>{out}</>;
}

