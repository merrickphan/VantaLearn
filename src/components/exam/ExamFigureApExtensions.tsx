"use client";

import { useId } from "react";
import type { ExamFigure } from "@/types";
import { MathText } from "@/components/typography/MathText";
import { axisTicks, formatAxisNumber } from "./figureAxisUtils";

type GbFig = Extract<ExamFigure, { kind: "grouped_bar_chart" }>;
type CavFig = Extract<ExamFigure, { kind: "calculus_area_vertical" }>;
type PacFig = Extract<ExamFigure, { kind: "polar_area_cartesian" }>;
type SfFig = Extract<ExamFigure, { kind: "slope_field" }>;
type CxpFig = Extract<ExamFigure, { kind: "calculus_xy_plot" }>;
type UrbFig = Extract<ExamFigure, { kind: "urban_land_use_model" }>;
type PenFig = Extract<ExamFigure, { kind: "physics_pendulum" }>;
type BioXFig = Extract<ExamFigure, { kind: "biology_crossing_over" }>;
type NapFig = Extract<ExamFigure, { kind: "neuron_action_potential" }>;
type SynFig = Extract<ExamFigure, { kind: "synapse_schematic" }>;

function TitleBlock({ title }: { title?: string }) {
	if (!title) return null;
	return (
		<p className="text-xs text-vanta-muted uppercase tracking-wider mb-2">
			<MathText text={title} />
		</p>
	);
}

export function GroupedBarChartFigure({ figure }: { figure: GbFig }) {
	const patternId = `gb-stripes-${useId().replace(/:/g, "")}`;
	const n = figure.groupLabels.length;
	const maxV = Math.max(
		1,
		...figure.series.flatMap((s) => s.values),
	);
	const w = 440;
	const h = 220;
	const pad = { t: 32, r: 24, b: 72, l: 52 };
	const innerW = w - pad.l - pad.r;
	const innerH = h - pad.t - pad.b;
	const y0 = h - pad.b;
	const yTicks = axisTicks(0, maxV, 5);
	const dMax = yTicks[yTicks.length - 1]!;
	const yFor = (v: number) => y0 - (v / dMax) * innerH;
	const groupW = innerW / Math.max(n, 1);
	const nSer = figure.series.length;
	const bw = (groupW * 0.72) / Math.max(nSer, 1);
	const axisStroke = "rgba(148,163,184,0.55)";
	const gridStroke = "rgba(148,163,184,0.22)";

	const fills = ["#94a3b8", "#64748b", "#e2e8f0", "#0f172a"];

	return (
		<div className="mb-4 rounded-lg border-2 border-vanta-border bg-vanta-surface-elevated p-3">
			<TitleBlock title={figure.title} />
			{figure.note && (
				<p className="text-[11px] text-vanta-muted mb-2 leading-snug">
					<MathText text={figure.note} />
				</p>
			)}
			<svg viewBox={`0 0 ${w} ${h}`} className="w-full max-h-56" role="img" aria-label={figure.title ?? "Grouped bar chart"}>
				<defs>
					<pattern id={patternId} patternUnits="userSpaceOnUse" width={6} height={6}>
						<path d="M-1,6 L6,-1 M0,6 L6,0" stroke="#334155" strokeWidth={1} />
					</pattern>
				</defs>
				{yTicks.map((tv) => {
					const yy = yFor(tv);
					return (
						<g key={`gbg-${tv}`}>
							<line x1={pad.l} y1={yy} x2={w - pad.r} y2={yy} stroke={gridStroke} strokeWidth={1} />
							<text x={pad.l - 6} y={yy + 3} textAnchor="end" className="fill-vanta-muted" style={{ fontSize: 10 }}>
								{formatAxisNumber(tv)}
							</text>
						</g>
					);
				})}
				<line x1={pad.l} y1={y0} x2={w - pad.r} y2={y0} stroke={axisStroke} strokeWidth={1.5} />
				<line x1={pad.l} y1={pad.t} x2={pad.l} y2={y0} stroke={axisStroke} strokeWidth={1.5} />
				{figure.groupLabels.map((gl, gi) => {
					const gx = pad.l + gi * groupW + groupW * 0.14;
					const clusterW = nSer * bw + Math.max(0, nSer - 1) * 2;
					const cx = gx + clusterW / 2;
					return (
						<g key={gl}>
							{figure.series.map((s, si) => {
								const val = s.values[gi] ?? 0;
								const x = gx + si * (bw + 2);
								const top = yFor(val);
								const fill = s.striped ? `url(#${patternId})` : s.fill ?? fills[si % fills.length];
								return (
									<rect
										key={`${gl}-${s.label}`}
										x={x}
										y={top}
										width={bw}
										height={Math.max(y0 - top, 0.5)}
										fill={fill}
										stroke="#475569"
										strokeWidth={0.5}
									/>
								);
							})}
							<text x={cx} y={y0 + 18} textAnchor="middle" className="fill-vanta-muted" style={{ fontSize: 10 }}>
								{gl}
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
				<p className="text-[10px] text-vanta-muted mt-0.5 text-center">
					<MathText text={figure.xLabel} />
				</p>
			)}
			<div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-vanta-muted">
				{figure.series.map((s, i) => (
					<span key={s.label} className="inline-flex items-center gap-1">
						<span
							className="inline-block h-2.5 w-2.5 border border-vanta-border"
							style={{
								background: s.striped ? `repeating-linear-gradient(45deg,#64748b,#64748b 2px,#e2e8f0 2px,#e2e8f0 4px)` : s.fill ?? fills[i % fills.length],
							}}
						/>
						{s.label}
					</span>
				))}
			</div>
		</div>
	);
}

export function CalculusAreaVerticalFigure({ figure }: { figure: CavFig }) {
	const xs = figure.xs;
	const up = figure.upperY;
	const low = figure.lowerY ?? xs.map(() => 0);
	const i0 = Math.max(0, Math.min(figure.shadeFromIndex, xs.length - 1));
	const i1 = Math.max(i0, Math.min(figure.shadeToIndex, xs.length - 1));
	const allY = [...up, ...low];
	const minY = Math.min(...allY, 0);
	const maxY = Math.max(...allY, 0);
	const yTicks = axisTicks(minY - (maxY - minY) * 0.05, maxY + (maxY - minY) * 0.08, 6);
	const dMin = yTicks[0]!;
	const dMax = yTicks[yTicks.length - 1]!;
	const spanY = dMax - dMin || 1;

	const w = 440;
	const h = 240;
	const pad = { t: 28, r: 28, b: 52, l: 58 };
	const innerW = w - pad.l - pad.r;
	const innerH = h - pad.t - pad.b;
	const xMin = xs[0]!;
	const xMax = xs[xs.length - 1]!;
	const spanX = xMax - xMin || 1;
	const xPix = (xv: number) => pad.l + ((xv - xMin) / spanX) * innerW;
	const yPix = (yv: number) => pad.t + innerH - ((yv - dMin) / spanY) * innerH;

	const upperPath = xs.map((x, i) => `${i === 0 ? "M" : "L"} ${xPix(x)} ${yPix(up[i]!)}`).join(" ");
	const lowerPath = xs
		.map((x, i) => `${i === 0 ? "M" : "L"} ${xPix(x)} ${yPix(low[i]!)}`)
		.join(" ");

	let shadeD = "";
	for (let i = i0; i <= i1; i++) {
		const x = xs[i]!;
		const u = up[i]!;
		const l = low[i]!;
		if (i === i0) shadeD += `M ${xPix(x)} ${yPix(l)} L ${xPix(x)} ${yPix(u)}`;
		else shadeD += ` L ${xPix(x)} ${yPix(u)}`;
	}
	for (let i = i1; i >= i0; i--) {
		const x = xs[i]!;
		const l = low[i]!;
		shadeD += ` L ${xPix(x)} ${yPix(l)}`;
	}
	shadeD += " Z";

	const axisStroke = "rgba(148,163,184,0.55)";
	const gridStroke = "rgba(148,163,184,0.22)";
	const ri = figure.mode === "riemann_strip" ? Math.max(i0, Math.min(figure.riemannStripIndex ?? i0, i1 - 1)) : i0;
	const rx0 = xs[ri]!;
	const rx1 = xs[ri + 1] ?? rx0 + (spanX / (xs.length - 1 || 1)) * 0.25;

	return (
		<div className="mb-4 rounded-lg border-2 border-vanta-border bg-vanta-surface-elevated p-3">
			<TitleBlock title={figure.title} />
			{figure.note && (
				<p className="text-[11px] text-vanta-muted mb-2 leading-snug">
					<MathText text={figure.note} />
				</p>
			)}
			<svg viewBox={`0 0 ${w} ${h}`} className="w-full max-h-64" role="img" aria-label={figure.title ?? "Calculus area"}>
				{yTicks.map((tv) => {
					const yy = yPix(tv);
					return (
						<g key={`cav-${tv}`}>
							<line x1={pad.l} y1={yy} x2={w - pad.r} y2={yy} stroke={gridStroke} strokeWidth={1} />
							<text x={pad.l - 6} y={yy + 3} textAnchor="end" className="fill-vanta-muted" style={{ fontSize: 10 }}>
								{formatAxisNumber(tv)}
							</text>
						</g>
					);
				})}
				{dMin < 0 && dMax > 0 && (
					<line
						x1={pad.l}
						y1={yPix(0)}
						x2={w - pad.r}
						y2={yPix(0)}
						stroke="rgba(248,250,252,0.35)"
						strokeWidth={1}
						strokeDasharray="4 3"
					/>
				)}
				<line x1={pad.l} y1={h - pad.b} x2={w - pad.r} y2={h - pad.b} stroke={axisStroke} strokeWidth={1.5} />
				<line x1={pad.l} y1={pad.t} x2={pad.l} y2={h - pad.b} stroke={axisStroke} strokeWidth={1.5} />
				<text x={w - pad.r + 4} y={h - pad.b + 4} className="fill-vanta-muted" style={{ fontSize: 11 }}>
					x
				</text>
				<text x={pad.l - 4} y={pad.t + 4} textAnchor="end" className="fill-vanta-muted" style={{ fontSize: 11 }}>
					y
				</text>
				{figure.mode === "full_shade" && <path d={shadeD} fill="rgba(56,189,248,0.28)" stroke="none" />}
				<path d={lowerPath} fill="none" stroke="#fb923c" strokeWidth={2} />
				<path d={upperPath} fill="none" stroke="#38bdf8" strokeWidth={2} />
				{figure.mode === "riemann_strip" && i1 > i0 && (
					<rect
						x={xPix(rx0)}
						y={yPix(Math.max(up[ri]!, low[ri]!))}
						width={Math.max(xPix(rx1) - xPix(rx0), 2)}
						height={Math.abs(yPix(up[ri]!) - yPix(low[ri]!))}
						fill="rgba(56,189,248,0.35)"
						stroke="#38bdf8"
						strokeWidth={1}
					/>
				)}
				{figure.upperCurveLabel && (
					<text x={xPix(xs[Math.floor(xs.length * 0.65)]!)} y={yPix(up[Math.floor(xs.length * 0.65)]!) - 8} className="fill-sky-300" style={{ fontSize: 11 }}>
						{figure.upperCurveLabel}
					</text>
				)}
				{figure.lowerCurveLabel && figure.lowerY && (
					<text x={xPix(xs[Math.floor(xs.length * 0.35)]!)} y={yPix(low[Math.floor(xs.length * 0.35)]!) + 14} className="fill-orange-300" style={{ fontSize: 11 }}>
						{figure.lowerCurveLabel}
					</text>
				)}
				<text x={xPix(xMin)} y={h - pad.b + 28} textAnchor="middle" className="fill-vanta-muted" style={{ fontSize: 10 }}>
					a
				</text>
				<text x={xPix(xMax)} y={h - pad.b + 28} textAnchor="middle" className="fill-vanta-muted" style={{ fontSize: 10 }}>
					b
				</text>
			</svg>
			{figure.xLabel && (
				<p className="text-[10px] text-vanta-muted mt-1 text-center">
					<MathText text={figure.xLabel} />
				</p>
			)}
			{figure.yLabel && (
				<p className="text-[10px] text-vanta-muted mt-0.5 text-center">
					<MathText text={figure.yLabel} />
				</p>
			)}
		</div>
	);
}

export function PolarAreaCartesianFigure({ figure }: { figure: PacFig }) {
	const steps = 72;
	const R = figure.outerR;
	const r0 = figure.innerR0;
	const rc = figure.innerRCos;
	const innerPts: { x: number; y: number }[] = [];
	const outerPts: { x: number; y: number }[] = [];
	for (let i = 0; i <= steps; i++) {
		const t = (Math.PI * i) / steps;
		const ri = r0 + rc * Math.cos(t);
		innerPts.push({ x: ri * Math.cos(t), y: ri * Math.sin(t) });
		outerPts.push({ x: R * Math.cos(t), y: R * Math.sin(t) });
	}
	const all = [...innerPts, ...outerPts];
	const minX = Math.min(...all.map((p) => p.x));
	const maxX = Math.max(...all.map((p) => p.x));
	const maxY = Math.max(...all.map((p) => p.y), 0.1);
	const minY = 0;
	const spanX = maxX - minX || 1;
	const spanY = maxY - minY || 1;

	const w = 440;
	const h = 260;
	const pad = { t: 28, r: 28, b: 56, l: 58 };
	const innerW = w - pad.l - pad.r;
	const innerH = h - pad.t - pad.b;
	const px = (x: number) => pad.l + ((x - minX) / spanX) * innerW;
	const py = (y: number) => pad.t + innerH - ((y - minY) / spanY) * innerH;

	const outerD = outerPts.map((p, i) => `${i === 0 ? "M" : "L"} ${px(p.x)} ${py(p.y)}`).join(" ");
	const innerD = innerPts.map((p, i) => `${i === 0 ? "M" : "L"} ${px(p.x)} ${py(p.y)}`).join(" ");
	let shade = `${outerD} `;
	for (let i = innerPts.length - 1; i >= 0; i--) {
		const p = innerPts[i]!;
		shade += ` L ${px(p.x)} ${py(p.y)}`;
	}
	shade += " Z";

	const xt = axisTicks(minX - spanX * 0.05, maxX + spanX * 0.05, 5);
	const yt = axisTicks(0, maxY + spanY * 0.08, 5);
	const axisStroke = "rgba(148,163,184,0.55)";
	const gridStroke = "rgba(148,163,184,0.22)";

	return (
		<div className="mb-4 rounded-lg border-2 border-vanta-border bg-vanta-surface-elevated p-3">
			<TitleBlock title={figure.title} />
			{figure.note && (
				<p className="text-[11px] text-vanta-muted mb-2 leading-snug">
					<MathText text={figure.note} />
				</p>
			)}
			<svg viewBox={`0 0 ${w} ${h}`} className="w-full max-h-64" role="img" aria-label={figure.title ?? "Polar area"}>
				{yt.map((tv) => {
					const yy = py(tv);
					if (yy < pad.t || yy > h - pad.b) return null;
					return (
						<g key={`py-${tv}`}>
							<line x1={pad.l} y1={yy} x2={w - pad.r} y2={yy} stroke={gridStroke} strokeWidth={1} />
							<text x={pad.l - 6} y={yy + 3} textAnchor="end" className="fill-vanta-muted" style={{ fontSize: 10 }}>
								{formatAxisNumber(tv)}
							</text>
						</g>
					);
				})}
				{xt.map((tv) => {
					const xx = px(tv);
					if (xx < pad.l || xx > w - pad.r) return null;
					return (
						<g key={`px-${tv}`}>
							<line x1={xx} y1={pad.t} x2={xx} y2={h - pad.b} stroke={gridStroke} strokeWidth={1} />
							<text x={xx} y={h - pad.b + 16} textAnchor="middle" className="fill-vanta-muted" style={{ fontSize: 10 }}>
								{formatAxisNumber(tv)}
							</text>
						</g>
					);
				})}
				<line x1={pad.l} y1={py(0)} x2={w - pad.r} y2={py(0)} stroke={axisStroke} strokeWidth={1.5} />
				<line x1={px(0)} y1={pad.t} x2={px(0)} y2={h - pad.b} stroke={axisStroke} strokeWidth={1.5} />
				<path d={shade} fill="rgba(148,163,184,0.32)" stroke="none" />
				<path d={innerD} fill="none" stroke="#fb923c" strokeWidth={2.2} />
				<path d={outerD} fill="none" stroke="#38bdf8" strokeWidth={2.2} />
			</svg>
			{figure.caption && (
				<p className="text-[10px] text-vanta-muted mt-1 leading-snug">
					<MathText text={figure.caption} />
				</p>
			)}
		</div>
	);
}

export function UrbanLandUseModelFigure({ figure }: { figure: UrbFig }) {
	const w = 400;
	const h = 260;
	const cx = 200;
	const cy = 125;
	const legendY = 238;

	const zonesCon = [
		{ r: 22, fill: "#facc15", label: "1 CBD" },
		{ r: 48, fill: "#f87171", label: "2 Transition" },
		{ r: 74, fill: "#c4b5fd", label: "3 Working" },
		{ r: 100, fill: "#e879f9", label: "4 Residences" },
		{ r: 118, fill: "#1e3a8a", label: "5 Commuter" },
	];

	return (
		<div className="mb-4 rounded-lg border-2 border-vanta-border bg-vanta-surface-elevated p-3">
			<TitleBlock title={figure.title} />
			{figure.note && (
				<p className="text-[11px] text-vanta-muted mb-2 leading-snug">
					<MathText text={figure.note} />
				</p>
			)}
			<svg viewBox={`0 0 ${w} ${h}`} className="w-full max-h-72" role="img" aria-label={figure.title ?? "Urban model"}>
				{figure.variant === "concentric" && (
					<g>
						{[...zonesCon].reverse().map((z) => (
							<circle key={z.label} cx={cx} cy={cy} r={z.r} fill={z.fill} fillOpacity={0.85} stroke="#0f172a" strokeWidth={1} />
						))}
						<text x={cx} y={cy + 4} textAnchor="middle" className="fill-black" style={{ fontSize: 8, fontWeight: 700 }}>
							CBD
						</text>
					</g>
				)}
				{figure.variant === "sector" && (
					<g>
						{Array.from({ length: 6 }, (_, i) => {
							const n = 6;
							const r = 100;
							const a0 = (i * 2 * Math.PI) / n;
							const a1 = ((i + 1) * 2 * Math.PI) / n;
							const x0 = cx + r * Math.cos(a0);
							const y0 = cy - r * Math.sin(a0);
							const x1 = cx + r * Math.cos(a1);
							const y1 = cy - r * Math.sin(a1);
							const colors = ["#fef08a", "#c4b5fd", "#f87171", "#86efac", "#fdba74", "#94a3b8"];
							return (
								<path
									key={i}
									d={`M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} Z`}
									fill={colors[i % colors.length]}
									fillOpacity={0.72}
									stroke="#0f172a"
									strokeWidth={0.6}
								/>
							);
						})}
						<circle cx={cx} cy={cy} r={14} fill="#fef08a" stroke="#0f172a" />
						<text x={cx} y={cy + 4} textAnchor="middle" style={{ fontSize: 8 }}>
							Core
						</text>
					</g>
				)}
				{figure.variant === "multiple_nuclei" && (
					<g>
						{[
							{ path: "M 80 60 L 160 50 L 180 120 L 70 130 Z", fill: "#fef08a", t: "CBD" },
							{ path: "M 180 55 L 300 45 L 320 130 L 190 125 Z", fill: "#fdba74", t: "Industry" },
							{ path: "M 60 140 L 200 135 L 210 200 L 50 195 Z", fill: "#c4b5fd", t: "Residential" },
							{ path: "M 220 130 L 340 125 L 350 200 L 230 205 Z", fill: "#f9a8d4", t: "Residential" },
							{ path: "M 130 200 L 280 195 L 290 240 L 120 245 Z", fill: "#86efac", t: "Suburb" },
						].map((r) => (
							<g key={r.t}>
								<path d={r.path} fill={r.fill} fillOpacity={0.7} stroke="#0f172a" strokeWidth={1} />
							</g>
						))}
					</g>
				)}
				<text x={w / 2} y={legendY} textAnchor="middle" className="fill-vanta-muted" style={{ fontSize: 9 }}>
					{figure.variant === "concentric" && "Concentric zone model (hypothetical labels)"}
					{figure.variant === "sector" && "Sector model (illustrative wedges)"}
					{figure.variant === "multiple_nuclei" && "Multiple nuclei model (illustrative land-use patches)"}
				</text>
			</svg>
		</div>
	);
}

export function PhysicsPendulumFigure({ figure }: { figure: PenFig }) {
	const w = 360;
	const h = 220;
	const cx = 180;
	const cy = 28;
	const Lpx = 130;
	const th = (figure.angleDeg * Math.PI) / 180;
	const bx = cx + Lpx * Math.sin(th);
	const by = cy + Lpx * Math.cos(th);

	return (
		<div className="mb-4 rounded-lg border-2 border-vanta-border bg-vanta-surface-elevated p-3">
			<TitleBlock title={figure.title} />
			{figure.note && (
				<p className="text-[11px] text-vanta-muted mb-2 leading-snug">
					<MathText text={figure.note} />
				</p>
			)}
			<svg viewBox={`0 0 ${w} ${h}`} className="w-full max-h-56" role="img" aria-label={figure.title ?? "Pendulum"}>
				<rect x={120} y={12} width={120} height={14} fill="#64748b" rx={2} />
				<line x1={cx} y1={cy} x2={bx} y2={by} stroke="#0f172a" strokeWidth={2} />
				<line x1={cx} y1={cy} x2={cx} y2={cy + Lpx + 24} stroke="#94a3b8" strokeWidth={1} strokeDasharray="5 4" />
				<circle cx={bx} cy={by} r={14} fill="#1e293b" stroke="#e2e8f0" strokeWidth={1} />
				<path
					d={`M ${cx} ${cy} A 28 28 0 0 1 ${cx + 28 * Math.sin(th / 2)} ${cy + 28 * Math.cos(th / 2)}`}
					fill="none"
					stroke="#38bdf8"
					strokeWidth={1.5}
				/>
				<text x={cx + 36} y={cy + 22} className="fill-sky-300" style={{ fontSize: 11 }}>
					{figure.angleDeg}°
				</text>
				<text
					x={(cx + bx) / 2 + 10}
					y={(cy + by) / 2 - 4}
					className="fill-vanta-muted"
					style={{ fontSize: 10 }}
					transform={`rotate(${figure.angleDeg}, ${(cx + bx) / 2}, ${(cy + by) / 2})`}
				>
					{figure.lengthM} m
				</text>
				<text x={bx - 6} y={by + 32} textAnchor="middle" className="fill-vanta-text" style={{ fontSize: 10 }}>
					{figure.massKg} kg
				</text>
				<text x={260} y={100} className="fill-vanta-muted" style={{ fontSize: 9 }}>
					Length label: practice diagram (not to scale).
				</text>
			</svg>
			<p className="text-[10px] text-vanta-muted mt-1">
				String length ≈ {figure.lengthM} m, bob mass {figure.massKg} kg, angle from vertical {figure.angleDeg}°.
			</p>
		</div>
	);
}

export function BiologyCrossingOverFigure({ figure }: { figure: BioXFig }) {
	const w = 420;
	const h = 200;
	const hatchId = `hatch-bio-${useId().replace(/:/g, "")}`;
	const drawPair = (y: number, label: string, swap: boolean) => (
		<g>
			<text x={8} y={y + 18} className="fill-vanta-muted" style={{ fontSize: 10 }}>
				{label}
			</text>
			<circle cx={100} cy={y + 14} r={6} fill="#94a3b8" />
			<text x={92} y={y + 28} className="fill-vanta-muted" style={{ fontSize: 8 }}>
				Centromere
			</text>
			<line x1={110} y1={y + 14} x2={360} y2={y + 8} stroke="#0f172a" strokeWidth={5} strokeLinecap="round" />
			<line x1={110} y1={y + 22} x2={360} y2={y + 28} stroke="#0f172a" strokeWidth={5} strokeLinecap="round" />
			<rect x={swap ? 300 : 320} y={y + 2} width={36} height={12} fill={swap ? "#cbd5e1" : "#94a3b8"} stroke="#334155" />
			<text x={swap ? 302 : 322} y={y + 11} style={{ fontSize: 7 }}>
				RFP
			</text>
			<rect x={220} y={y + 18} width={40} height={12} fill={`url(#${hatchId})`} stroke="#334155" />
			<text x={222} y={y + 27} style={{ fontSize: 7 }}>
				GFP
			</text>
		</g>
	);

	return (
		<div className="mb-4 rounded-lg border-2 border-vanta-border bg-vanta-surface-elevated p-3">
			<TitleBlock title={figure.title} />
			{figure.note && (
				<p className="text-[11px] text-vanta-muted mb-2 leading-snug">
					<MathText text={figure.note} />
				</p>
			)}
			<svg viewBox={`0 0 ${w} ${h}`} className="w-full max-h-52" role="img" aria-label={figure.title ?? "Crossing over"}>
				<defs>
					<pattern id={hatchId} patternUnits="userSpaceOnUse" width={4} height={4}>
						<path d="M0,4 L4,0" stroke="#334155" strokeWidth={1} />
					</pattern>
				</defs>
				{drawPair(24, "A — Before", false)}
				{drawPair(110, "B — After", true)}
			</svg>
			<p className="text-[10px] text-vanta-muted mt-1">Schematic: homologous pairs; exchange within hotspot region (practice).</p>
		</div>
	);
}

const AP_MV_SAMPLES: { t: number; v: number }[] = [
	{ t: 0, v: -70 },
	{ t: 0.4, v: -70 },
	{ t: 0.55, v: -52 },
	{ t: 0.9, v: 28 },
	{ t: 1.25, v: -85 },
	{ t: 2.2, v: -72 },
	{ t: 3.5, v: -70 },
	{ t: 5, v: -70 },
];

export function NeuronActionPotentialFigure({ figure }: { figure: NapFig }) {
	const w = 400;
	const h = 200;
	const pad = { t: 24, r: 20, b: 44, l: 52 };
	const tMin = 0;
	const tMax = 5;
	const vMin = -90;
	const vMax = 35;
	const innerW = w - pad.l - pad.r;
	const innerH = h - pad.t - pad.b;
	const px = (t: number) => pad.l + ((t - tMin) / (tMax - tMin)) * innerW;
	const py = (v: number) => pad.t + innerH - ((v - vMin) / (vMax - vMin)) * innerH;
	const d = AP_MV_SAMPLES.map((p, i) => `${i === 0 ? "M" : "L"} ${px(p.t)} ${py(p.v)}`).join(" ");

	return (
		<div className="mb-4 rounded-lg border-2 border-vanta-border bg-vanta-surface-elevated p-3">
			<TitleBlock title={figure.title} />
			{figure.note && (
				<p className="text-[11px] text-vanta-muted mb-2 leading-snug">
					<MathText text={figure.note} />
				</p>
			)}
			<svg viewBox={`0 0 ${w} ${h}`} className="w-full max-h-52" role="img" aria-label={figure.title ?? "Action potential"}>
				<line x1={pad.l} y1={py(-55)} x2={w - pad.r} y2={py(-55)} stroke="#f472b6" strokeWidth={1} strokeDasharray="4 3" />
				<text x={w - pad.r - 2} y={py(-55) - 4} textAnchor="end" className="fill-vanta-muted" style={{ fontSize: 9 }}>
					Threshold
				</text>
				{[-70, 0, 30].map((mv) => (
					<text key={`mv-${mv}`} x={pad.l - 8} y={py(mv) + 3} textAnchor="end" className="fill-vanta-muted" style={{ fontSize: 9 }}>
						{mv}
					</text>
				))}
				<path d={d} fill="none" stroke="#38bdf8" strokeWidth={2.2} />
				<line x1={pad.l} y1={h - pad.b} x2={w - pad.r} y2={h - pad.b} stroke="#64748b" strokeWidth={1.2} />
				<line x1={pad.l} y1={pad.t} x2={pad.l} y2={h - pad.b} stroke="#64748b" strokeWidth={1.2} />
				{[0, 1, 2, 3, 4, 5].map((t) => (
					<text key={t} x={px(t)} y={h - pad.b + 16} textAnchor="middle" className="fill-vanta-muted" style={{ fontSize: 9 }}>
						{t}
					</text>
				))}
				<text x={w / 2} y={h - 6} textAnchor="middle" className="fill-vanta-muted" style={{ fontSize: 10 }}>
					Time (ms)
				</text>
				<text x={14} y={h / 2} transform={`rotate(-90 14 ${h / 2})`} textAnchor="middle" className="fill-vanta-muted" style={{ fontSize: 10 }}>
					mV
				</text>
			</svg>
		</div>
	);
}

export function CalculusXyPlotFigure({ figure }: { figure: CxpFig }) {
	const xMin = figure.xMin;
	const xMax = figure.xMax;
	const yMin = figure.yMin;
	const yMax = figure.yMax;
	const spanX = xMax - xMin || 1;
	const spanY = yMax - yMin || 1;

	const w = 480;
	const h = 268;
	const pad = { t: 32, r: 30, b: 62, l: 56 };
	const innerW = w - pad.l - pad.r;
	const innerH = h - pad.t - pad.b;

	const xPix = (xv: number) => pad.l + ((xv - xMin) / spanX) * innerW;
	const yPix = (yv: number) => pad.t + innerH - ((yv - yMin) / spanY) * innerH;

	const xTicks =
		figure.xTicks && figure.xTicks.length > 0 ? figure.xTicks : axisTicks(xMin, xMax, Math.min(9, Math.max(5, Math.ceil(spanX) + 2)));
	const yTicks =
		figure.yTicks && figure.yTicks.length > 0 ? figure.yTicks : axisTicks(yMin, yMax, 6);

	const axisStroke = "rgba(30,41,59,0.88)";
	const guideStroke = "rgba(148,163,184,0.12)";
	const plotStroke = "rgba(15,23,42,0.94)";
	const y0 = yPix(0);
	const showZeroLine = yMin < 0 && yMax > 0;

	const guides =
		figure.showVerticalGuides === false
			? []
			: Array.from({ length: Math.floor(xMax) - Math.ceil(xMin) + 1 }, (_, j) => Math.ceil(xMin) + j).filter((xv) => xv >= xMin && xv <= xMax);

	return (
		<div className="mb-4 rounded-lg border border-vanta-border bg-white p-3 shadow-sm">
			<TitleBlock title={figure.title} />
			{figure.note && (
				<p className="text-[11px] text-vanta-muted mb-2 leading-snug">
					<MathText text={figure.note} />
				</p>
			)}
			<svg viewBox={`0 0 ${w} ${h}`} className="w-full max-h-72" role="img" aria-label={figure.title ?? "Calculus graph"}>
				{guides.map((gx) => (
					<line
						key={`vg-${gx}`}
						x1={xPix(gx)}
						y1={pad.t}
						x2={xPix(gx)}
						y2={h - pad.b}
						stroke={guideStroke}
						strokeWidth={1}
					/>
				))}
				{yTicks.map((tv) => {
					const yy = yPix(tv);
					return (
						<g key={`cxpy-${tv}`}>
							<line x1={pad.l - 5} y1={yy} x2={pad.l} y2={yy} stroke={axisStroke} strokeWidth={1} />
							<text x={pad.l - 10} y={yy + 3} textAnchor="end" className="fill-slate-500" style={{ fontSize: 10, fontFamily: "Georgia, 'Times New Roman', serif" }}>
								{formatAxisNumber(tv)}
							</text>
						</g>
					);
				})}
				{xTicks.map((tv) => {
					const xx = xPix(tv);
					return (
						<g key={`cxpx-${tv}`}>
							<line x1={xx} y1={h - pad.b} x2={xx} y2={h - pad.b + 5} stroke={axisStroke} strokeWidth={1} />
							<text x={xx} y={h - pad.b + 18} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 10, fontFamily: "Georgia, 'Times New Roman', serif" }}>
								{formatAxisNumber(tv)}
							</text>
						</g>
					);
				})}
				{showZeroLine && (
					<line x1={pad.l} y1={y0} x2={w - pad.r} y2={y0} stroke="rgba(100,116,139,0.35)" strokeWidth={1} strokeDasharray="4 4" />
				)}
				<line x1={pad.l} y1={h - pad.b} x2={w - pad.r} y2={h - pad.b} stroke={axisStroke} strokeWidth={1.65} />
				<line x1={pad.l} y1={pad.t} x2={pad.l} y2={h - pad.b} stroke={axisStroke} strokeWidth={1.65} />
				<path d={`M ${pad.l} ${pad.t + 6} L ${pad.l - 2} ${pad.t + 14} L ${pad.l + 2} ${pad.t + 14} Z`} fill={axisStroke} />
				<text x={xPix(0) - 14} y={yPix(0) + 14} className="fill-slate-600" style={{ fontSize: 11, fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic" }}>
					O
				</text>
				{figure.polylines.map((poly, pi) => {
					if (poly.length === 0) return null;
					const d = poly
						.map((p, i) => {
							const xp = xPix(p.x);
							const yp = yPix(p.y);
							return `${i === 0 ? "M" : "L"} ${xp} ${yp}`;
						})
						.join(" ");
					return <path key={`cxp-p-${pi}`} d={d} fill="none" stroke={plotStroke} strokeWidth={2.85} strokeLinecap="round" strokeLinejoin="round" />;
				})}
			</svg>
			{figure.caption && (
				<p className="text-center text-[12px] text-slate-700 mt-2 font-serif leading-snug">
					<MathText text={figure.caption} />
				</p>
			)}
			{figure.yLabel && (
				<p className="text-[10px] text-vanta-muted mt-1">
					<MathText text={figure.yLabel} />
				</p>
			)}
			{figure.xLabel && (
				<p className="text-[10px] text-vanta-muted mt-0.5 text-center">
					<MathText text={figure.xLabel} />
				</p>
			)}
		</div>
	);
}

export function SlopeFieldFigure({ figure }: { figure: SfFig }) {
	const xMin = figure.xMin;
	const xMax = figure.xMax;
	const yMin = figure.yMin;
	const yMax = figure.yMax;
	const spanX = xMax - xMin || 1;
	const spanY = yMax - yMin || 1;

	const w = 440;
	const h = 400;
	const pad = { t: 28, r: 28, b: 56, l: 58 };
	const innerW = w - pad.l - pad.r;
	const innerH = h - pad.t - pad.b;

	const xPix = (xv: number) => pad.l + ((xv - xMin) / spanX) * innerW;
	const yPix = (yv: number) => pad.t + innerH - ((yv - yMin) / spanY) * innerH;

	const xTicks = axisTicks(xMin, xMax, Math.min(9, Math.max(5, Math.abs(xMax - xMin) + 1)));
	const yTicks = axisTicks(yMin, yMax, Math.min(9, Math.max(5, Math.abs(yMax - yMin) + 1)));

	const axisStroke = "rgba(148,163,184,0.65)";
	const gridStroke = "rgba(148,163,184,0.2)";
	const segStroke = "rgba(51,65,85,0.88)";

	return (
		<div className="mb-4 rounded-lg border-2 border-vanta-border bg-vanta-surface-elevated p-3">
			<TitleBlock title={figure.title} />
			{figure.note && (
				<p className="text-[11px] text-vanta-muted mb-2 leading-snug">
					<MathText text={figure.note} />
				</p>
			)}
			<svg viewBox={`0 0 ${w} ${h}`} className="w-full max-h-96" role="img" aria-label={figure.title ?? "Slope field"}>
				{yTicks.map((tv) => {
					const yy = yPix(tv);
					return (
						<g key={`sfgy-${tv}`}>
							<line x1={pad.l} y1={yy} x2={w - pad.r} y2={yy} stroke={gridStroke} strokeWidth={tv === 0 ? 1.25 : 1} />
							<text x={pad.l - 6} y={yy + 3} textAnchor="end" className="fill-vanta-muted" style={{ fontSize: 10 }}>
								{formatAxisNumber(tv)}
							</text>
						</g>
					);
				})}
				{xTicks.map((tv) => {
					const xx = xPix(tv);
					return (
						<g key={`sfgx-${tv}`}>
							<line x1={xx} y1={pad.t} x2={xx} y2={h - pad.b} stroke={gridStroke} strokeWidth={tv === 0 ? 1.25 : 1} />
							<text x={xx} y={h - pad.b + 16} textAnchor="middle" className="fill-vanta-muted" style={{ fontSize: 10 }}>
								{formatAxisNumber(tv)}
							</text>
						</g>
					);
				})}
				<line x1={pad.l} y1={yPix(0)} x2={w - pad.r} y2={yPix(0)} stroke={axisStroke} strokeWidth={1.5} />
				<line x1={xPix(0)} y1={pad.t} x2={xPix(0)} y2={h - pad.b} stroke={axisStroke} strokeWidth={1.5} />
				{figure.segments.map((s, idx) => {
					const m = Math.max(-36, Math.min(36, s.dyDx));
					const t = Math.hypot(1, m);
					const dxm = 0.32 / t;
					const dym = (m * 0.32) / t;
					const x0 = xPix(s.x - dxm);
					const y0 = yPix(s.y - dym);
					const x1 = xPix(s.x + dxm);
					const y1 = yPix(s.y + dym);
					return <line key={`sf-${idx}-${s.x}-${s.y}`} x1={x0} y1={y0} x2={x1} y2={y1} stroke={segStroke} strokeWidth={1.15} strokeLinecap="round" />;
				})}
			</svg>
			{figure.yLabel && (
				<p className="text-[10px] text-vanta-muted mt-1">
					<MathText text={figure.yLabel} />
				</p>
			)}
			{figure.xLabel && (
				<p className="text-[10px] text-vanta-muted mt-0.5 text-center">
					<MathText text={figure.xLabel} />
				</p>
			)}
		</div>
	);
}

export function SynapseSchematicFigure({ figure }: { figure: SynFig }) {
	const w = 400;
	const h = 200;
	const mid = useId().replace(/:/g, "");

	return (
		<div className="mb-4 rounded-lg border-2 border-vanta-border bg-vanta-surface-elevated p-3">
			<TitleBlock title={figure.title} />
			{figure.note && (
				<p className="text-[11px] text-vanta-muted mb-2 leading-snug">
					<MathText text={figure.note} />
				</p>
			)}
			<svg viewBox={`0 0 ${w} ${h}`} className="w-full max-h-52" role="img" aria-label={figure.title ?? "Synapse"}>
				<rect x={40} y={20} width={320} height={55} rx={6} fill="rgba(56,189,248,0.08)" stroke="#38bdf8" strokeWidth={1} />
				<text x={300} y={38} className="fill-vanta-muted" style={{ fontSize: 9 }}>
					Presynaptic
				</text>
				{[70, 120, 170, 220].map((x) => (
					<circle key={x} cx={x} cy={42} r={10} fill="#e2e8f0" stroke="#64748b" />
				))}
				<text x={60} y={46} style={{ fontSize: 7 }}>
					NT
				</text>
				<path d="M 130 50 Q 200 95 270 50" fill="none" stroke="#94a3b8" strokeWidth={1} markerEnd={`url(#${mid}-syn-arr)`} />
				<defs>
					<marker id={`${mid}-syn-arr`} markerWidth={5} markerHeight={5} refX={4} refY={2.5} orient="auto">
						<polygon points="0 0, 5 2.5, 0 5" fill="#94a3b8" />
					</marker>
				</defs>
				<text x={190} y={88} textAnchor="middle" className="fill-vanta-muted" style={{ fontSize: 10 }}>
					Synaptic cleft
				</text>
				<rect x={40} y={105} width={320} height={55} rx={6} fill="rgba(167,139,250,0.08)" stroke="#a78bfa" strokeWidth={1} />
				<text x={300} y={124} className="fill-vanta-muted" style={{ fontSize: 9 }}>
					Postsynaptic
				</text>
				{[100, 180, 260].map((x) => (
					<rect key={x} x={x - 12} y={118} width={24} height={18} fill="#64748b" stroke="#334155" rx={2} />
				))}
				<circle cx={115} cy={127} r={3} fill="#0f172a" />
				<circle cx={200} cy={127} r={3} fill="#0f172a" />
			</svg>
		</div>
	);
}
