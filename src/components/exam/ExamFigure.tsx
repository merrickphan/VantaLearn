"use client";

import type { ExamFigure as ExamFigureType } from "@/types";

export function ExamFigure({ figure }: { figure: ExamFigureType }) {
 if (figure.kind === "stimulus") {
 const titled = figure.title && figure.title.trim().length > 0 && figure.title !== "Stimulus";
 if (!titled) {
 return (
 <p className="mb-4 font-serif text-[15px] leading-relaxed text-vanta-text italic whitespace-pre-wrap">
 {figure.body}
 </p>
 );
 }
 return (
 <div className="mb-4 rounded-lg border border-vanta-border bg-vanta-surface/80 overflow-hidden">
 <p className="text-xs text-vanta-muted uppercase tracking-wider px-3 py-2 border-b border-vanta-border">
 {figure.title}
 </p>
 <div className="px-3 py-3 text-sm text-vanta-text leading-relaxed whitespace-pre-wrap font-serif">
 {figure.body}
 </div>
 </div>
 );
 }

 if (figure.kind === "table") {
 return (
 <div className="mb-4 rounded-lg border border-vanta-border bg-vanta-surface/80 overflow-hidden">
 {figure.title && (
 <p className="text-xs text-vanta-muted uppercase tracking-wider px-3 py-2 border-b border-vanta-border">
 {figure.title}
 </p>
 )}
 <div className="overflow-x-auto">
 <table className="w-full text-sm text-vanta-text">
 <thead>
 <tr className="bg-vanta-border/30">
 {figure.headers.map((h) => (
 <th key={h} className="text-left px-3 py-2 font-semibold border-b border-vanta-border">
 {h}
 </th>
 ))}
 </tr>
 </thead>
 <tbody>
 {figure.rows.map((row, i) => (
 <tr key={i} className="border-b border-vanta-border/60 last:border-0">
 {row.map((cell, j) => (
 <td key={j} className="px-3 py-2 text-vanta-muted">
 {cell}
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
 const max = Math.max(...figure.bars.map((b) => b.value), 1);
 const w = 320;
 const h = 160;
 const pad = { t: 24, r: 12, b: 36, l: 40 };
 const bw = (w - pad.l - pad.r) / figure.bars.length - 4;

 return (
 <div className="mb-4 rounded-lg border border-vanta-border bg-vanta-surface/80 p-3">
 {figure.title && (
 <p className="text-xs text-vanta-muted uppercase tracking-wider mb-2">{figure.title}</p>
 )}
 <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-h-44 text-vanta-blue" aria-hidden>
 <rect x={0} y={0} width={w} height={h} fill="transparent" />
 {/* axes */}
 <line
 x1={pad.l}
 y1={h - pad.b}
 x2={w - pad.r}
 y2={h - pad.b}
 stroke="currentColor"
 strokeOpacity={0.35}
 strokeWidth={1}
 />
 <line
 x1={pad.l}
 y1={pad.t}
 x2={pad.l}
 y2={h - pad.b}
 stroke="currentColor"
 strokeOpacity={0.35}
 strokeWidth={1}
 />
 {figure.bars.map((b, i) => {
 const x = pad.l + i * (bw + 4) + 2;
 const barH = ((h - pad.t - pad.b) * b.value) / max;
 const y = h - pad.b - barH;
 return (
 <g key={b.label}>
 <rect
 x={x}
 y={y}
 width={bw}
 height={barH}
 fill="currentColor"
 fillOpacity={0.75}
 rx={2}
 />
 <text
 x={x + bw / 2}
 y={h - pad.b + 14}
 textAnchor="middle"
 className="fill-vanta-muted text-[9px]"
 style={{ fontSize: 9 }}
 >
 {b.label}
 </text>
 </g>
 );
 })}
 </svg>
 {figure.yLabel && <p className="text-[10px] text-vanta-muted mt-1">{figure.yLabel}</p>}
 </div>
 );
 }

 // line_chart
 const pts = figure.points;
 const maxY = Math.max(...pts.map((p) => p.y), 1);
 const w = 340;
 const h = 150;
 const pad = { t: 28, r: 16, b: 32, l: 36 };
 const innerW = w - pad.l - pad.r;
 const innerH = h - pad.t - pad.b;

 const pathD = pts
 .map((p, i) => {
 const x = pad.l + (i / Math.max(pts.length - 1, 1)) * innerW;
 const y = pad.t + innerH - (p.y / maxY) * innerH;
 return `${i === 0 ? "M" : "L"} ${x} ${y}`;
 })
 .join(" ");

 return (
 <div className="mb-4 rounded-lg border border-vanta-border bg-vanta-surface/80 p-3">
 {figure.title && (
 <p className="text-xs text-vanta-muted uppercase tracking-wider mb-2">{figure.title}</p>
 )}
 <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-h-44" aria-hidden>
 <line
 x1={pad.l}
 y1={h - pad.b}
 x2={w - pad.r}
 y2={h - pad.b}
 stroke="rgba(148,163,184,0.4)"
 strokeWidth={1}
 />
 <line
 x1={pad.l}
 y1={pad.t}
 x2={pad.l}
 y2={h - pad.b}
 stroke="rgba(148,163,184,0.4)"
 strokeWidth={1}
 />
 <path
 d={pathD}
 fill="none"
 stroke="#38bdf8"
 strokeWidth={2}
 strokeLinecap="round"
 strokeLinejoin="round"
 />
 {pts.map((p, i) => {
 const x = pad.l + (i / Math.max(pts.length - 1, 1)) * innerW;
 const y = pad.t + innerH - (p.y / maxY) * innerH;
 return <circle key={p.x} cx={x} cy={y} r={3} fill="#7dd3fc" />;
 })}
 {pts.map((p, i) => {
 const x = pad.l + (i / Math.max(pts.length - 1, 1)) * innerW;
 return (
 <text
 key={`${p.x}-l`}
 x={x}
 y={h - 12}
 textAnchor="middle"
 className="fill-vanta-muted"
 style={{ fontSize: 9 }}
 >
 {p.x}
 </text>
 );
 })}
 </svg>
 {figure.yLabel && <p className="text-[10px] text-vanta-muted mt-1">{figure.yLabel}</p>}
 </div>
 );
}
