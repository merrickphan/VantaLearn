import katex from "katex";
import type { ReactNode } from "react";
import { formatNiceMath } from "@/lib/typography/niceMath";

type MathTextProps = {
	text: string | null | undefined;
	/**
	 * When true, runs `formatNiceMath` on the non-LaTeX text segments.
	 * This is helpful for things like `km^2 → km²` outside math delimiters.
	 */
	prettifyText?: boolean;
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
export function MathText({ text, prettifyText = true }: MathTextProps) {
	const raw = text ?? "";
	if (!raw) return null;

	// Fast path: no LaTeX delimiters detected.
	if (!INLINE_RE.test(raw) && !DISPLAY_RE.test(raw)) {
		return <>{prettifyText ? formatNiceMath(raw) : raw}</>;
	}

	ANY_RE.lastIndex = 0;
	const out: ReactNode[] = [];
	let last = 0;
	let match: RegExpExecArray | null;

	while ((match = ANY_RE.exec(raw))) {
		const idx = match.index;
		if (idx > last) {
			const chunk = raw.slice(last, idx);
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

	if (last < raw.length) {
		const tail = raw.slice(last);
		out.push(<span key={`t-${last}`}>{prettifyText ? formatNiceMath(tail) : tail}</span>);
	}

	return <>{out}</>;
}

