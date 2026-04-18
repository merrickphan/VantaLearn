"use client";

import type { ReactNode } from "react";
import { MathText } from "@/components/typography/MathText";
import { ExamRasterizedBlock } from "./ExamRasterizedBlock";

type ExamRasterMathProps = {
	text: string | null | undefined;
	examMath?: boolean;
	className?: string;
	/** Accessible summary (stem / explanation). */
	plainAlt: string;
	/** MCQ options: parent control provides aria-label; image is decorative. */
	decorative?: boolean;
};

/**
 * MathText rendered then rasterized for exams (non-copyable display).
 */
export function ExamRasterMath({ text, examMath, className, plainAlt, decorative }: ExamRasterMathProps) {
	const raw = text ?? "";
	if (!raw.trim()) return null;
	const syncKey = `${raw}\0${examMath ?? false}`;
	return (
		<ExamRasterizedBlock
			syncKey={syncKey}
			className={className}
			alt={plainAlt.slice(0, 450)}
			decorative={decorative}
		>
			<MathText text={raw} examMath={examMath} />
		</ExamRasterizedBlock>
	);
}

type ExamRasterLineProps = {
	children: ReactNode;
	syncKey: string;
	className?: string;
	plainAlt: string;
	decorative?: boolean;
};

/** Plain React children (e.g. stimulus prose) rasterized for exams. */
export function ExamRasterLine({ children, syncKey, className, plainAlt, decorative }: ExamRasterLineProps) {
	return (
		<ExamRasterizedBlock
			syncKey={syncKey}
			className={className}
			alt={plainAlt.slice(0, 450)}
			decorative={decorative}
		>
			{children}
		</ExamRasterizedBlock>
	);
}
