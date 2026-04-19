"use client";

import type { ExamFigure as ExamFigureType, NonCoreExamFigure } from "@/types";
import { MathText } from "@/components/typography/MathText";
import { axisTicks, formatAxisNumber } from "./figureAxisUtils";
import { SpecialExamFigure } from "./ExamFigureDiagrams";

export function ExamFigure({ figure }: { figure: ExamFigureType }) {
	if (figure.kind === "stimulus") {
		const titled = figure.title && figure.title.trim().length > 0 && figure.title !== "Stimulus";
		if (!titled) {
			return (
				<p className="mb-4 font-serif text-[16px] leading-relaxed text-vanta-text italic whitespace-pre-wrap">
					<MathText text={figure.body} />
				</p>
			);
		}
		return (
			<div className="mb-4 overflow-hidden rounded-lg border-2 border-vanta-border bg-vanta-surface-elevated">
				<p className="border-b-2 border-vanta-border bg-vanta-surface-hover px-3 py-2 text-xs font-semibold uppercase tracking-wider text-vanta-text">
					<MathText text={figure.title ?? ""} />
				</p>
				<div className="bg-vanta-surface px-3 py-3 font-serif text-sm leading-relaxed text-vanta-text whitespace-pre-wrap">
					<MathText text={figure.body} />
				</div>
			</div>
		);
	}

	if (figure.kind === "table") {
		return (
			<div className="mb-4 overflow-hidden rounded-lg border-2 border-vanta-border bg-vanta-surface-elevated">
				{figure.title && (
					<p className="border-b-2 border-vanta-border bg-vanta-surface-hover px-3 py-2 text-xs font-semibold uppercase tracking-wider text-vanta-text">
						<MathText text={figure.title} />
					</p>
				)}
				<div className="overflow-x-auto bg-vanta-surface">
					<table className="w-full border-collapse text-sm text-vanta-text">
						<thead>
							<tr className="bg-vanta-surface-hover">
								{figure.headers.map((h) => (
									<th
										key={h}
										className="border-b-2 border-vanta-border px-3 py-2.5 text-left font-semibold text-vanta-text"
									>
										<MathText text={h} />
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{figure.rows.map((row, i) => (
								<tr key={i} className="border-b border-vanta-border last:border-0">
									{row.map((cell, j) => (
										<td key={j} className="border-r border-vanta-border px-3 py-2.5 text-vanta-text last:border-r-0">
											<MathText text={cell} />
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		);
	}

	if (figure.kind === "bar_chart") {
		const maxVal = Math.max(...figure.bars.map((b) => b.value), 0);
		const minVal = Math.min(0, Math.min(...figure.bars.map((b) => b.value)));
		const yTicks = axisTicks(minVal, maxVal, 5);
		const domainMin = Math.min(minVal, yTicks[0]!);
		const domainMax = Math.max(maxVal, yTicks[yTicks.length - 1]!);
		const domainSpan = domainMax - domainMin || 1;

		const w = 380;
		const h = 200;
		const pad = { t: 28, r: 20, b: 44, l: 52 };
		const innerW = w - pad.l - pad.r;
		const innerH = h - pad.t - pad.b;
		const y0 = h - pad.b;
		const yFor = (val: number) => pad.t + innerH - ((val - domainMin) / domainSpan) * innerH;
		const baselineY = yFor(0);
		const bw = (innerW - 4) / figure.bars.length - 6;

		const axisStroke = "rgba(51,65,85,0.88)";
		const gridStroke = "rgba(51,65,85,0.32)";
		const barFill = "#0284c7";

		return (
			<div className="mb-4 rounded-lg border-2 border-vanta-border bg-vanta-surface-elevated p-3">
				{figure.title && (
					<p className="text-xs text-vanta-muted uppercase tracking-wider mb-2">
						<MathText text={figure.title} />
					</p>
				)}
				<svg
					viewBox={`0 0 ${w} ${h}`}
					className="w-full max-h-52 text-slate-600"
					role="img"
					aria-label={figure.title ?? "Bar chart"}
				>
					<rect x={0} y={0} width={w} height={h} fill="transparent" />
					{yTicks.map((tv) => {
						const yy = yFor(tv);
						return (
							<g key={`gy-${tv}`}>
								<line x1={pad.l} y1={yy} x2={w - pad.r} y2={yy} stroke={gridStroke} strokeWidth={1} />
								<text
									x={pad.l - 6}
									y={yy + 3}
									textAnchor="end"
									className="fill-vanta-muted"
									style={{ fontSize: 10 }}
								>
									{formatAxisNumber(tv)}
								</text>
							</g>
						);
					})}
					{minVal < 0 && maxVal > 0 && (
						<line
							x1={pad.l}
							y1={baselineY}
							x2={w - pad.r}
							y2={baselineY}
							stroke="rgba(248,250,252,0.35)"
							strokeWidth={1}
							strokeDasharray="4 3"
						/>
					)}
					<line x1={pad.l} y1={y0} x2={w - pad.r} y2={y0} stroke={axisStroke} strokeWidth={1.5} />
					<line x1={pad.l} y1={pad.t} x2={pad.l} y2={y0} stroke={axisStroke} strokeWidth={1.5} />
					{figure.bars.map((b, i) => {
						const x = pad.l + 4 + i * (bw + 6);
						const topY = yFor(b.value);
						const bottomY = domainMin < 0 ? baselineY : y0;
						const barH = Math.abs(bottomY - topY);
						const barY = Math.min(topY, bottomY);
						return (
							<g key={`${b.label}-${i}`}>
								<rect
									x={x}
									y={barY}
									width={bw}
									height={Math.max(barH, 0.5)}
									fill={barFill}
									fillOpacity={0.78}
									rx={2}
								/>
								<text
									x={x + bw / 2}
									y={barY - 4}
									textAnchor="middle"
									className="fill-vanta-text"
									style={{ fontSize: 10, fontWeight: 600 }}
								>
									{formatAxisNumber(b.value)}
								</text>
								<text
									x={x + bw / 2}
									y={y0 + 14}
									textAnchor="middle"
									className="fill-vanta-muted"
									style={{ fontSize: 10 }}
								>
									{b.label}
								</text>
							</g>
						);
					})}
				</svg>
				{figure.yLabel && (
					<p className="text-[10px] text-vanta-muted mt-1">
						<MathText text={figure.yLabel} />
					</p>
				)}
			</div>
		);
	}

	if (figure.kind !== "line_chart") {
		return <SpecialExamFigure figure={figure as NonCoreExamFigure} />;
	}

	// line_chart — full numeric y-axis, grid, optional y=0 line, point (x,y) labels
	const pts = figure.points;
	const ys = pts.map((p) => p.y);
	const rawMin = Math.min(...ys);
	const rawMax = Math.max(...ys);
	const span = rawMax - rawMin;
	const minY = span === 0 ? rawMin - 0.5 : rawMin;
	const maxY = span === 0 ? rawMax + 0.5 : rawMax;
	const yTicks = axisTicks(minY, maxY, 6);
	const domainMin = Math.min(minY, yTicks[0]!);
	const domainMax = Math.max(maxY, yTicks[yTicks.length - 1]!);
	const domainSpan = domainMax - domainMin || 1;

	const w = 420;
	const h = 220;
	const pad = { t: 26, r: 28, b: 48, l: 58 };
	const innerW = w - pad.l - pad.r;
	const innerH = h - pad.t - pad.b;

	const yFor = (yv: number) => pad.t + innerH - ((yv - domainMin) / domainSpan) * innerH;
	const xFor = (i: number) => pad.l + (i / Math.max(pts.length - 1, 1)) * innerW;
	const y0Line = yFor(0);
	const showZeroLine = domainMin < 0 && domainMax > 0;

	const pathD = pts
		.map((p, i) => {
			const x = xFor(i);
			const y = yFor(p.y);
			return `${i === 0 ? "M" : "L"} ${x} ${y}`;
		})
		.join(" ");

	const axisStroke = "rgba(51,65,85,0.88)";
	const gridStroke = "rgba(51,65,85,0.32)";

	return (
		<div className="mb-4 rounded-lg border-2 border-vanta-border bg-vanta-surface-elevated p-3">
			{figure.title && (
				<p className="text-xs text-vanta-muted uppercase tracking-wider mb-2">
					<MathText text={figure.title} />
				</p>
			)}
			<svg
				viewBox={`0 0 ${w} ${h}`}
				className="w-full max-h-56"
				role="img"
				aria-label={figure.title ?? "Line chart"}
			>
				{yTicks.map((tv) => {
					const yy = yFor(tv);
					return (
						<g key={`ly-${tv}`}>
							<line x1={pad.l} y1={yy} x2={w - pad.r} y2={yy} stroke={gridStroke} strokeWidth={1} />
							<text
								x={pad.l - 6}
								y={yy + 3}
								textAnchor="end"
								className="fill-vanta-muted"
								style={{ fontSize: 10 }}
							>
								{formatAxisNumber(tv)}
							</text>
						</g>
					);
				})}
				{showZeroLine && (
					<line
						x1={pad.l}
						y1={y0Line}
						x2={w - pad.r}
						y2={y0Line}
						stroke="rgba(248,250,252,0.4)"
						strokeWidth={1}
						strokeDasharray="5 4"
					/>
				)}
				<line x1={pad.l} y1={h - pad.b} x2={w - pad.r} y2={h - pad.b} stroke={axisStroke} strokeWidth={1.5} />
				<line x1={pad.l} y1={pad.t} x2={pad.l} y2={h - pad.b} stroke={axisStroke} strokeWidth={1.5} />
				<path
					d={pathD}
					fill="none"
					stroke="#38bdf8"
					strokeWidth={2.25}
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				{pts.map((p, i) => {
					const x = xFor(i);
					const y = yFor(p.y);
					return (
						<g key={`pt-${i}-${p.x}`}>
							<line x1={x} y1={h - pad.b} x2={x} y2={y} stroke={gridStroke} strokeWidth={1} />
							<circle cx={x} cy={y} r={4} fill="#0ea5e9" stroke="#e0f2fe" strokeWidth={1} />
							<text
								x={x}
								y={y - 10}
								textAnchor="middle"
								className="fill-vanta-text"
								style={{ fontSize: 10, fontWeight: 600 }}
							>
								{formatAxisNumber(p.y)}
							</text>
							<text
								x={x}
								y={h - pad.b + 16}
								textAnchor="middle"
								className="fill-vanta-muted"
								style={{ fontSize: 10 }}
							>
								{p.x}
							</text>
						</g>
					);
				})}
			</svg>
			{figure.yLabel && (
				<p className="text-[10px] text-vanta-muted mt-1">
					<MathText text={figure.yLabel} />
				</p>
			)}
			{figure.xLabel && (
				<p className="text-[10px] text-vanta-muted mt-0.5 text-center leading-snug">
					<MathText text={figure.xLabel} />
				</p>
			)}
		</div>
	);
}
