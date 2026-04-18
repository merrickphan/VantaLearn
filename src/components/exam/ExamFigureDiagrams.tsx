"use client";

import { useId } from "react";
import type { ExamFigure, NonCoreExamFigure } from "@/types";
import { MathText } from "@/components/typography/MathText";
import { axisTicks, formatAxisNumber } from "./figureAxisUtils";
import {
	BiologyCrossingOverFigure,
	CalculusAreaVerticalFigure,
	GroupedBarChartFigure,
	NeuronActionPotentialFigure,
	PhysicsPendulumFigure,
	PolarAreaCartesianFigure,
	SlopeFieldFigure,
	SynapseSchematicFigure,
	UrbanLandUseModelFigure,
} from "./ExamFigureApExtensions";

type PopFig = Extract<ExamFigure, { kind: "population_pyramid" }>;
type RxFig = Extract<ExamFigure, { kind: "reaction_coordinate" }>;
type SdFig = Extract<ExamFigure, { kind: "supply_demand" }>;
type CirFig = Extract<ExamFigure, { kind: "circuit_series" }>;
type MapFig = Extract<ExamFigure, { kind: "map_schematic" }>;
type ExhFig = Extract<ExamFigure, { kind: "exhibit_placeholder" }>;
type PfFig = Extract<ExamFigure, { kind: "process_flow" }>;
type ScFig = Extract<ExamFigure, { kind: "scatter_plot" }>;
type HiFig = Extract<ExamFigure, { kind: "histogram" }>;
type FwFig = Extract<ExamFigure, { kind: "food_web" }>;

function TitleBlock({ title }: { title?: string }) {
	if (!title) return null;
	return (
		<p className="text-xs text-vanta-muted uppercase tracking-wider mb-2">
			<MathText text={title} />
		</p>
	);
}

export function PopulationPyramidFigure({ figure }: { figure: PopFig }) {
	const maxSide = Math.max(
		...figure.bands.map((b) => Math.max(b.male, b.female)),
		1,
	);
	const w = 400;
	const h = Math.max(160, 28 + figure.bands.length * 36);
	const mid = w / 2;
	const rowH = (h - 48) / Math.max(figure.bands.length, 1);
	const top = 32;

	return (
		<div className="mb-4 rounded-lg border border-vanta-border bg-vanta-surface/80 p-3">
			<TitleBlock title={figure.title} />
{figure.note && (
				<p className="text-[11px] text-vanta-muted mb-2 leading-snug">
					<MathText text={figure.note} />
				</p>
			)}
			<svg viewBox={`0 0 ${w} ${h}`} className="w-full max-h-72" role="img" aria-label={figure.title ?? "Population pyramid"}>
				<text x={mid - 8} y={18} textAnchor="end" className="fill-vanta-muted" style={{ fontSize: 10 }}>
					Male
				</text>
				<text x={mid + 8} y={18} textAnchor="start" className="fill-vanta-muted" style={{ fontSize: 10 }}>
					Female
				</text>
				<line x1={mid} y1={top} x2={mid} y2={h - 12} stroke="rgba(148,163,184,0.45)" strokeWidth={1} />
				{figure.bands.map((b, i) => {
					const y = top + i * rowH;
					const mw = ((mid - 24) * b.male) / maxSide;
					const fw = ((mid - 24) * b.female) / maxSide;
					return (
						<g key={b.age}>
							<text x={8} y={y + rowH / 2 + 4} className="fill-vanta-muted" style={{ fontSize: 10 }}>
								{b.age}
							</text>
							<rect
								x={mid - mw - 4}
								y={y + 4}
								width={mw}
								height={rowH - 10}
								fill="#38bdf8"
								fillOpacity={0.75}
								rx={2}
							/>
							<rect x={mid + 4} y={y + 4} width={fw} height={rowH - 10} fill="#f472b6" fillOpacity={0.75} rx={2} />
							<text x={mid - mw / 2 - 4} y={y + rowH / 2 + 4} textAnchor="middle" className="fill-vanta-text" style={{ fontSize: 9 }}>
								{b.male}
							</text>
							<text x={mid + fw / 2 + 4} y={y + rowH / 2 + 4} textAnchor="middle" className="fill-vanta-text" style={{ fontSize: 9 }}>
								{b.female}
							</text>
						</g>
					);
				})}
			</svg>
			{figure.caption && (
				<p className="text-[10px] text-vanta-muted mt-1">
					<MathText text={figure.caption} />
				</p>
			)}
		</div>
	);
}

export function ReactionCoordinateFigure({ figure }: { figure: RxFig }) {
	const ys = figure.stages.map((s) => s.energy);
	const minY = Math.min(...ys) - 2;
	const maxY = Math.max(...ys) + 2;
	const yTicks = axisTicks(minY, maxY, 5);
	const domainMin = Math.min(minY, yTicks[0]!);
	const domainMax = Math.max(maxY, yTicks[yTicks.length - 1]!);
	const span = domainMax - domainMin || 1;

	const w = 440;
	const h = 220;
	const pad = { t: 28, r: 24, b: 56, l: 58 };
	const innerW = w - pad.l - pad.r;
	const innerH = h - pad.t - pad.b;
	const yFor = (e: number) => pad.t + innerH - ((e - domainMin) / span) * innerH;
	const n = figure.stages.length;
	const xFor = (i: number) => pad.l + (i / Math.max(n - 1, 1)) * innerW;

	const pathD = figure.stages
		.map((s, i) => {
			const x = xFor(i);
			const y = yFor(s.energy);
			return `${i === 0 ? "M" : "L"} ${x} ${y}`;
		})
		.join(" ");

	const axisStroke = "rgba(148,163,184,0.55)";
	const gridStroke = "rgba(148,163,184,0.22)";

	return (
		<div className="mb-4 rounded-lg border border-vanta-border bg-vanta-surface/80 p-3">
			<TitleBlock title={figure.title} />
			{figure.note && (
				<p className="text-[11px] text-vanta-muted mb-2 leading-snug">
					<MathText text={figure.note} />
				</p>
			)}
			<svg viewBox={`0 0 ${w} ${h}`} className="w-full max-h-56" role="img" aria-label={figure.title ?? "Reaction coordinate"}>
				{yTicks.map((tv) => {
					const yy = yFor(tv);
					return (
						<g key={`rct-${tv}`}>
							<line x1={pad.l} y1={yy} x2={w - pad.r} y2={yy} stroke={gridStroke} strokeWidth={1} />
							<text x={pad.l - 6} y={yy + 3} textAnchor="end" className="fill-vanta-muted" style={{ fontSize: 10 }}>
								{formatAxisNumber(tv)}
							</text>
						</g>
					);
				})}
				<line x1={pad.l} y1={h - pad.b} x2={w - pad.r} y2={h - pad.b} stroke={axisStroke} strokeWidth={1.5} />
				<line x1={pad.l} y1={pad.t} x2={pad.l} y2={h - pad.b} stroke={axisStroke} strokeWidth={1.5} />
				<text x={pad.l + innerW / 2} y={h - 10} textAnchor="middle" className="fill-vanta-muted" style={{ fontSize: 10 }}>
					Reaction coordinate →
				</text>
				<path d={pathD} fill="none" stroke="#a78bfa" strokeWidth={2.5} strokeLinejoin="round" />
				{figure.stages.map((s, i) => {
					const x = xFor(i);
					const y = yFor(s.energy);
					return (
						<g key={`st-${i}`}>
							<circle cx={x} cy={y} r={4} fill="#c4b5fd" stroke="#1e1b4b" strokeWidth={0.5} />
							<text x={x} y={h - pad.b + 22} textAnchor="middle" className="fill-vanta-muted" style={{ fontSize: 9 }}>
								{s.label}
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

export function SupplyDemandFigure({ figure }: { figure: SdFig }) {
	const n = figure.quantities.length;
	const allP = [...figure.supplyPrice, ...figure.demandPrice];
	const minP = Math.min(...allP);
	const maxP = Math.max(...allP);
	const yTicks = axisTicks(minP - 1, maxP + 1, 5);
	const domainMin = yTicks[0]!;
	const domainMax = yTicks[yTicks.length - 1]!;
	const span = domainMax - domainMin || 1;

	const w = 420;
	const h = 220;
	const pad = { t: 28, r: 28, b: 52, l: 58 };
	const innerW = w - pad.l - pad.r;
	const innerH = h - pad.t - pad.b;
	const xFor = (i: number) => pad.l + (i / Math.max(n - 1, 1)) * innerW;
	const yFor = (p: number) => pad.t + innerH - ((p - domainMin) / span) * innerH;

	const pathS = figure.supplyPrice.map((pv, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(pv)}`).join(" ");
	const pathD = figure.demandPrice.map((pv, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(pv)}`).join(" ");

	const axisStroke = "rgba(148,163,184,0.55)";
	const gridStroke = "rgba(148,163,184,0.22)";

	return (
		<div className="mb-4 rounded-lg border border-vanta-border bg-vanta-surface/80 p-3">
			<TitleBlock title={figure.title} />
			{figure.note && (
				<p className="text-[11px] text-vanta-muted mb-2 leading-snug">
					<MathText text={figure.note} />
				</p>
			)}
			<svg viewBox={`0 0 ${w} ${h}`} className="w-full max-h-56" role="img" aria-label={figure.title ?? "Supply and demand"}>
				{yTicks.map((tv) => {
					const yy = yFor(tv);
					return (
						<g key={`sd-${tv}`}>
							<line x1={pad.l} y1={yy} x2={w - pad.r} y2={yy} stroke={gridStroke} strokeWidth={1} />
							<text x={pad.l - 6} y={yy + 3} textAnchor="end" className="fill-vanta-muted" style={{ fontSize: 10 }}>
								{formatAxisNumber(tv)}
							</text>
						</g>
					);
				})}
				<line x1={pad.l} y1={h - pad.b} x2={w - pad.r} y2={h - pad.b} stroke={axisStroke} strokeWidth={1.5} />
				<line x1={pad.l} y1={pad.t} x2={pad.l} y2={h - pad.b} stroke={axisStroke} strokeWidth={1.5} />
				<path d={pathS} fill="none" stroke="#34d399" strokeWidth={2.25} strokeLinecap="round" />
				<path d={pathD} fill="none" stroke="#fb7185" strokeWidth={2.25} strokeLinecap="round" />
				{figure.quantities.map((q, i) => (
					<text key={q} x={xFor(i)} y={h - pad.b + 18} textAnchor="middle" className="fill-vanta-muted" style={{ fontSize: 10 }}>
						{q}
					</text>
				))}
				<text x={w - pad.r} y={pad.t + 12} textAnchor="end" className="fill-emerald-400" style={{ fontSize: 10 }}>
					{figure.supplyLabel ?? "S"}
				</text>
				<text x={w - pad.r} y={pad.t + 26} textAnchor="end" className="fill-rose-300" style={{ fontSize: 10 }}>
					{figure.demandLabel ?? "D"}
				</text>
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

export function CircuitSeriesFigure({ figure }: { figure: CirFig }) {
	const w = 420;
	const h = 120;
	const y = 60;
	const x0 = 40;
	const seg = 100;

	return (
		<div className="mb-4 rounded-lg border border-vanta-border bg-vanta-surface/80 p-3">
			<TitleBlock title={figure.title} />
			{figure.note && (
				<p className="text-[11px] text-vanta-muted mb-2 leading-snug">
					<MathText text={figure.note} />
				</p>
			)}
			<svg viewBox={`0 0 ${w} ${h}`} className="w-full max-h-36" role="img" aria-label={figure.title ?? "Circuit diagram"}>
				<line x1={x0} y1={y} x2={x0 + 30} y2={y} stroke="#94a3b8" strokeWidth={2} />
				<rect x={x0 + 30} y={y - 22} width={14} height={44} stroke="#fbbf24" strokeWidth={2} fill="none" rx={2} />
				<text x={x0 + 37} y={y + 4} textAnchor="middle" className="fill-vanta-text" style={{ fontSize: 9, fontWeight: 600 }}>
					{figure.batteryVolts != null ? `${figure.batteryVolts} V` : "ε"}
				</text>
				<line x1={x0 + 44} y1={y} x2={x0 + seg} y2={y} stroke="#94a3b8" strokeWidth={2} />
				{figure.resistorsOhm.map((ohm, i) => {
					const cx = x0 + seg + 40 + i * 110;
					return (
						<g key={`r-${i}`}>
							<path
								d={`M ${cx - 30} ${y} L ${cx - 22} ${y - 8} L ${cx - 14} ${y + 8} L ${cx - 6} ${y - 8} L ${cx + 2} ${y + 8} L ${cx + 10} ${y - 8} L ${cx + 18} ${y + 8} L ${cx + 26} ${y} L ${cx + 34} ${y}`}
								fill="none"
								stroke="#38bdf8"
								strokeWidth={2}
								strokeLinejoin="round"
							/>
							<text x={cx} y={y + 32} textAnchor="middle" className="fill-vanta-muted" style={{ fontSize: 10 }}>
								{ohm} Ω
							</text>
						</g>
					);
				})}
				<line
					x1={x0 + seg + 40 + figure.resistorsOhm.length * 110 - 4}
					y1={y}
					x2={w - 40}
					y2={y}
					stroke="#94a3b8"
					strokeWidth={2}
				/>
				<text x={w / 2} y={h - 14} textAnchor="middle" className="fill-vanta-muted" style={{ fontSize: 10 }}>
					Series circuit (hypothetical — not to scale)
				</text>
			</svg>
		</div>
	);
}

export function MapSchematicFigure({ figure }: { figure: MapFig }) {
	const w = 400;
	const h = 200;
	return (
		<div className="mb-4 rounded-lg border border-vanta-border bg-vanta-surface/80 p-3">
			<TitleBlock title={figure.title} />
			{figure.note && (
				<p className="text-[11px] text-vanta-muted mb-2 leading-snug">
					<MathText text={figure.note} />
				</p>
			)}
			<svg viewBox={`0 0 ${w} ${h}`} className="w-full max-h-52" role="img" aria-label={figure.title ?? "Map"}>
				{figure.regions.map((r) => (
					<g key={r.abbrev}>
						<path
							d={r.path}
							fill={r.fill}
							fillOpacity={0.55}
							stroke="rgba(148,163,184,0.6)"
							strokeWidth={1.5}
						/>
						<text
							x={r.labelX}
							y={r.labelY}
							textAnchor="middle"
							className="fill-vanta-text"
							style={{ fontSize: 11, fontWeight: 600 }}
						>
							{r.abbrev}
						</text>
					</g>
				))}
			</svg>
			{figure.legend && (
				<p className="text-[10px] text-vanta-muted mt-2 leading-snug">
					<MathText text={figure.legend} />
				</p>
			)}
		</div>
	);
}

export function ExhibitPlaceholderFigure({ figure }: { figure: ExhFig }) {
	return (
		<div className="mb-4 overflow-hidden rounded-lg border border-vanta-border bg-gradient-to-b from-vanta-surface to-vanta-border/20">
			{figure.title && (
				<p className="text-xs text-vanta-muted uppercase tracking-wider border-b border-vanta-border px-3 py-2">
					<MathText text={figure.title} />
				</p>
			)}
			<div className="relative min-h-[140px] bg-slate-900/40 px-3 py-4">
				<div className="absolute inset-0 flex items-center justify-center opacity-25">
					<svg width="120" height="90" viewBox="0 0 120 90" aria-hidden>
						<rect x={8} y={12} width={104} height={66} rx={4} fill="none" stroke="currentColor" className="text-slate-500" strokeWidth={2} />
						<circle cx={44} cy={42} r={10} fill="none" stroke="currentColor" className="text-slate-500" strokeWidth={2} />
						<path d="M 72 32 L 96 48 L 72 64 Z" fill="currentColor" className="text-slate-600" />
					</svg>
				</div>
				<p className="relative text-center text-[10px] font-semibold uppercase tracking-widest text-vanta-muted">
					Exam-style visual (illustrative placeholder)
				</p>
				<p className="relative mt-3 text-sm leading-relaxed text-vanta-text">
					<MathText text={figure.description} />
				</p>
				{figure.credit && (
					<p className="relative mt-2 text-[10px] italic text-vanta-muted">
						<MathText text={figure.credit} />
					</p>
				)}
			</div>
		</div>
	);
}

export function ProcessFlowFigure({ figure }: { figure: PfFig }) {
	const w = Math.max(360, figure.nodes.length * 100);
	const h = 100;
	const nodeW = 72;
	const gap = 20;
	const y = 36;

	return (
		<div className="mb-4 rounded-lg border border-vanta-border bg-vanta-surface/80 p-3">
			<TitleBlock title={figure.title} />
			{figure.note && (
				<p className="text-[11px] text-vanta-muted mb-2 leading-snug">
					<MathText text={figure.note} />
				</p>
			)}
			<svg viewBox={`0 0 ${w} ${h}`} className="w-full max-h-32" role="img" aria-label={figure.title ?? "Process diagram"}>
				{figure.nodes.map((n, i) => {
					const x = 20 + i * (nodeW + gap);
					return (
						<g key={n.id}>
							{i > 0 && (
								<>
									<line
										x1={x - gap + 6}
										y1={y + 18}
										x2={x - 4}
										y2={y + 18}
										stroke="#94a3b8"
										strokeWidth={2}
									/>
									<polygon points={`${x - 4},${y + 18} ${x - 10},${y + 14} ${x - 10},${y + 22}`} fill="#94a3b8" />
								</>
							)}
							<rect x={x} y={y} width={nodeW} height={36} rx={4} fill="rgba(56,189,248,0.12)" stroke="#38bdf8" strokeWidth={1.5} />
							<text x={x + nodeW / 2} y={y + 22} textAnchor="middle" className="fill-vanta-text" style={{ fontSize: 9 }}>
								{n.label.length > 18 ? `${n.label.slice(0, 16)}…` : n.label}
							</text>
						</g>
					);
				})}
			</svg>
		</div>
	);
}

function olsLine(points: { x: number; y: number }[]): { m: number; b: number } {
	const n = points.length;
	if (n < 2) return { m: 0, b: points[0]?.y ?? 0 };
	let sx = 0;
	let sy = 0;
	let sxx = 0;
	let sxy = 0;
	for (const p of points) {
		sx += p.x;
		sy += p.y;
		sxx += p.x * p.x;
		sxy += p.x * p.y;
	}
	const d = n * sxx - sx * sx;
	if (Math.abs(d) < 1e-9) return { m: 0, b: sy / n };
	const m = (n * sxy - sx * sy) / d;
	const b = (sy - m * sx) / n;
	return { m, b };
}

export function ScatterPlotFigure({ figure }: { figure: ScFig }) {
	const pts = figure.points;
	const xs = pts.map((p) => p.x);
	const ys = pts.map((p) => p.y);
	const minX = Math.min(...xs);
	const maxX = Math.max(...xs);
	const minY = Math.min(...ys);
	const maxY = Math.max(...ys);
	const xTicks = axisTicks(minX - (maxX - minX) * 0.05, maxX + (maxX - minX) * 0.05, 5);
	const yTicks = axisTicks(minY - (maxY - minY) * 0.08, maxY + (maxY - minY) * 0.08, 5);
	const dxMin = xTicks[0]!;
	const dxMax = xTicks[xTicks.length - 1]!;
	const dyMin = yTicks[0]!;
	const dyMax = yTicks[yTicks.length - 1]!;
	const sx = dxMax - dxMin || 1;
	const sy = dyMax - dyMin || 1;

	const w = 420;
	const h = 220;
	const pad = { t: 26, r: 28, b: 48, l: 58 };
	const innerW = w - pad.l - pad.r;
	const innerH = h - pad.t - pad.b;
	const xPix = (xv: number) => pad.l + ((xv - dxMin) / sx) * innerW;
	const yPix = (yv: number) => pad.t + innerH - ((yv - dyMin) / sy) * innerH;

	const { m, b } = figure.showTrendLine !== false ? olsLine(pts) : { m: 0, b: 0 };
	const trendPath =
		figure.showTrendLine !== false && pts.length >= 2
			? `M ${xPix(dxMin)} ${yPix(m * dxMin + b)} L ${xPix(dxMax)} ${yPix(m * dxMax + b)}`
			: "";

	const axisStroke = "rgba(148,163,184,0.55)";
	const gridStroke = "rgba(148,163,184,0.22)";

	return (
		<div className="mb-4 rounded-lg border border-vanta-border bg-vanta-surface/80 p-3">
			<TitleBlock title={figure.title} />
			{figure.note && (
				<p className="text-[11px] text-vanta-muted mb-2 leading-snug">
					<MathText text={figure.note} />
				</p>
			)}
			<svg viewBox={`0 0 ${w} ${h}`} className="w-full max-h-56" role="img" aria-label={figure.title ?? "Scatter plot"}>
				{yTicks.map((tv) => {
					const yy = yPix(tv);
					return (
						<g key={`sy-${tv}`}>
							<line x1={pad.l} y1={yy} x2={w - pad.r} y2={yy} stroke={gridStroke} strokeWidth={1} />
							<text x={pad.l - 6} y={yy + 3} textAnchor="end" className="fill-vanta-muted" style={{ fontSize: 10 }}>
								{formatAxisNumber(tv)}
							</text>
						</g>
					);
				})}
				{xTicks.map((tv) => {
					const xx = xPix(tv);
					return (
						<g key={`sx-${tv}`}>
							<line x1={xx} y1={pad.t} x2={xx} y2={h - pad.b} stroke={gridStroke} strokeWidth={1} />
							<text x={xx} y={h - pad.b + 16} textAnchor="middle" className="fill-vanta-muted" style={{ fontSize: 10 }}>
								{formatAxisNumber(tv)}
							</text>
						</g>
					);
				})}
				<line x1={pad.l} y1={h - pad.b} x2={w - pad.r} y2={h - pad.b} stroke={axisStroke} strokeWidth={1.5} />
				<line x1={pad.l} y1={pad.t} x2={pad.l} y2={h - pad.b} stroke={axisStroke} strokeWidth={1.5} />
				{trendPath && <path d={trendPath} fill="none" stroke="#f472b6" strokeWidth={2} strokeDasharray="6 4" />}
				{pts.map((p, i) => (
					<g key={`sp-${i}`}>
						<circle cx={xPix(p.x)} cy={yPix(p.y)} r={5} fill="#38bdf8" fillOpacity={0.85} stroke="#e0f2fe" strokeWidth={1} />
						{p.label && (
							<text x={xPix(p.x) + 8} y={yPix(p.y) - 6} className="fill-vanta-muted" style={{ fontSize: 9 }}>
								{p.label}
							</text>
						)}
					</g>
				))}
			</svg>
			{figure.xLabel && (
				<p className="text-[10px] text-vanta-muted mt-0.5 text-center">
					<MathText text={figure.xLabel} />
				</p>
			)}
			{figure.yLabel && (
				<p className="text-[10px] text-vanta-muted mt-1 text-center">
					<MathText text={figure.yLabel} />
				</p>
			)}
		</div>
	);
}

export function HistogramFigure({ figure }: { figure: HiFig }) {
	const maxC = Math.max(...figure.bins.map((b) => b.count), 1);
	const w = 400;
	const h = 200;
	const pad = { t: 28, r: 20, b: 48, l: 52 };
	const innerW = w - pad.l - pad.r;
	const innerH = h - pad.t - pad.b;
	const bw = innerW / figure.bins.length - 2;
	const y0 = h - pad.b;
	const yTicks = axisTicks(0, maxC, 5);
	const domainMax = yTicks[yTicks.length - 1]!;
	const yFor = (c: number) => y0 - (c / domainMax) * innerH;
	const axisStroke = "rgba(148,163,184,0.55)";
	const gridStroke = "rgba(148,163,184,0.22)";

	return (
		<div className="mb-4 rounded-lg border border-vanta-border bg-vanta-surface/80 p-3">
			<TitleBlock title={figure.title} />
			{figure.note && (
				<p className="text-[11px] text-vanta-muted mb-2 leading-snug">
					<MathText text={figure.note} />
				</p>
			)}
			<svg viewBox={`0 0 ${w} ${h}`} className="w-full max-h-52" role="img" aria-label={figure.title ?? "Histogram"}>
				{yTicks.map((tv) => {
					const yy = yFor(tv);
					return (
						<g key={`hg-${tv}`}>
							<line x1={pad.l} y1={yy} x2={w - pad.r} y2={yy} stroke={gridStroke} strokeWidth={1} />
							<text x={pad.l - 6} y={yy + 3} textAnchor="end" className="fill-vanta-muted" style={{ fontSize: 10 }}>
								{formatAxisNumber(tv)}
							</text>
						</g>
					);
				})}
				<line x1={pad.l} y1={y0} x2={w - pad.r} y2={y0} stroke={axisStroke} strokeWidth={1.5} />
				<line x1={pad.l} y1={pad.t} x2={pad.l} y2={y0} stroke={axisStroke} strokeWidth={1.5} />
				{figure.bins.map((b, i) => {
					const x = pad.l + 2 + i * (bw + 2);
					const top = yFor(b.count);
					return (
						<g key={b.label}>
							<rect x={x} y={top} width={bw} height={y0 - top} fill="#38bdf8" fillOpacity={0.75} />
							<text x={x + bw / 2} y={y0 + 14} textAnchor="middle" className="fill-vanta-muted" style={{ fontSize: 9 }}>
								{b.label}
							</text>
							<text x={x + bw / 2} y={top - 4} textAnchor="middle" className="fill-vanta-text" style={{ fontSize: 9 }}>
								{b.count}
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

export function FoodWebFigure({ figure }: { figure: FwFig }) {
	const arrowId = useId().replace(/:/g, "");
	const byTier = new Map<number, typeof figure.taxa>();
	for (const t of figure.taxa) {
		const arr = byTier.get(t.tier) ?? [];
		arr.push(t);
		byTier.set(t.tier, arr);
	}
	const tiers = [...byTier.keys()].sort((a, b) => a - b);
	const w = 420;
	const h = 200;
	const colW = w / Math.max(tiers.length, 1);
	const pos = new Map<string, { x: number; y: number }>();
	for (const tier of tiers) {
		const nodes = byTier.get(tier)!;
		const n = nodes.length;
		nodes.forEach((node, i) => {
			const x = tiers.indexOf(tier) * colW + colW / 2 + (i - (n - 1) / 2) * 56;
			const y = 40 + tier * 48;
			pos.set(node.id, { x, y });
		});
	}

	return (
		<div className="mb-4 rounded-lg border border-vanta-border bg-vanta-surface/80 p-3">
			<TitleBlock title={figure.title} />
			{figure.note && (
				<p className="text-[11px] text-vanta-muted mb-2 leading-snug">
					<MathText text={figure.note} />
				</p>
			)}
			<svg viewBox={`0 0 ${w} ${h}`} className="w-full max-h-52" role="img" aria-label={figure.title ?? "Food web"}>
				{figure.links.map((l, i) => {
					const a = pos.get(l.from);
					const b = pos.get(l.to);
					if (!a || !b) return null;
					return (
						<line
							key={`${l.from}-${l.to}-${i}`}
							x1={a.x}
							y1={a.y + 10}
							x2={b.x}
							y2={b.y - 10}
							stroke="rgba(148,163,184,0.55)"
							strokeWidth={1.5}
							markerEnd={`url(#${arrowId}-arr)`}
						/>
					);
				})}
				<defs>
					<marker id={`${arrowId}-arr`} markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
						<polygon points="0 0, 6 3, 0 6" fill="rgba(148,163,184,0.7)" />
					</marker>
				</defs>
				{figure.taxa.map((t) => {
					const p = pos.get(t.id);
					if (!p) return null;
					return (
						<g key={t.id}>
							<ellipse cx={p.x} cy={p.y} rx={36} ry={16} fill="rgba(56,189,248,0.15)" stroke="#38bdf8" strokeWidth={1.2} />
							<text x={p.x} y={p.y + 4} textAnchor="middle" className="fill-vanta-text" style={{ fontSize: 9 }}>
								{t.label.length > 14 ? `${t.label.slice(0, 12)}…` : t.label}
							</text>
						</g>
					);
				})}
			</svg>
			{figure.legend && (
				<p className="text-[10px] text-vanta-muted mt-1 leading-snug">
					<MathText text={figure.legend} />
				</p>
			)}
		</div>
	);
}

/** Non–bar/line/table/stimulus figures (maps, circuits, exhibits, etc.). */
export function SpecialExamFigure({ figure }: { figure: NonCoreExamFigure }) {
	switch (figure.kind) {
		case "population_pyramid":
			return <PopulationPyramidFigure figure={figure} />;
		case "reaction_coordinate":
			return <ReactionCoordinateFigure figure={figure} />;
		case "supply_demand":
			return <SupplyDemandFigure figure={figure} />;
		case "circuit_series":
			return <CircuitSeriesFigure figure={figure} />;
		case "map_schematic":
			return <MapSchematicFigure figure={figure} />;
		case "exhibit_placeholder":
			return <ExhibitPlaceholderFigure figure={figure} />;
		case "process_flow":
			return <ProcessFlowFigure figure={figure} />;
		case "scatter_plot":
			return <ScatterPlotFigure figure={figure} />;
		case "histogram":
			return <HistogramFigure figure={figure} />;
		case "food_web":
			return <FoodWebFigure figure={figure} />;
		case "grouped_bar_chart":
			return <GroupedBarChartFigure figure={figure} />;
		case "calculus_area_vertical":
			return <CalculusAreaVerticalFigure figure={figure} />;
		case "polar_area_cartesian":
			return <PolarAreaCartesianFigure figure={figure} />;
		case "slope_field":
			return <SlopeFieldFigure figure={figure} />;
		case "urban_land_use_model":
			return <UrbanLandUseModelFigure figure={figure} />;
		case "physics_pendulum":
			return <PhysicsPendulumFigure figure={figure} />;
		case "biology_crossing_over":
			return <BiologyCrossingOverFigure figure={figure} />;
		case "neuron_action_potential":
			return <NeuronActionPotentialFigure figure={figure} />;
		case "synapse_schematic":
			return <SynapseSchematicFigure figure={figure} />;
	}
}
