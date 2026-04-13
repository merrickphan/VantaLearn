import React from "react";

/** Outline icons in a dark rounded tile + sky stroke - matches dashboard / reference style */
export type SimpleIconId =
 | "chart"
 | "lineTrend"
 | "atom"
 | "beaker"
 | "shield"
 | "star"
 | "book"
 | "globe"
 | "cpu"
 | "scale"
 | "clock"
 | "pen"
 | "target"
 | "music"
 | "palette"
 | "search"
 | "zap"
 | "cards"
 | "document"
 | "layers"
 | "spark"
 | "calculator"
 | "flame"
 | "clipboard"
 | "check"
 | "refresh"
 | "moon";

const stroke = "currentColor";

function IconGlyph({ name }: { name: SimpleIconId }) {
 const common = { fill: "none", stroke, strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
 switch (name) {
 case "chart":
 return (
 <g>
 <polyline points="3 17 9 11 13 15 21 7" {...common} />
 <polyline points="21 7 21 11 17 11" {...common} />
 </g>
 );
 case "lineTrend":
 return (
 <g>
 <polyline points="3 17 9 11 13 15 21 7" {...common} />
 </g>
 );
 case "atom":
 return (
 <g>
 <circle cx="12" cy="12" r="2" {...common} />
 <ellipse cx="12" cy="12" rx="9" ry="4" {...common} transform="rotate(0 12 12)" />
 <ellipse cx="12" cy="12" rx="9" ry="4" {...common} transform="rotate(60 12 12)" />
 <ellipse cx="12" cy="12" rx="9" ry="4" {...common} transform="rotate(120 12 12)" />
 </g>
 );
 case "beaker":
 return (
 <g>
 <path d="M9 3h6v2l-2 14a2 2 0 0 1-2 2h0a2 2 0 0 1-2-2L7 5V3z" {...common} />
 <path d="M9 8h6" {...common} />
 </g>
 );
 case "shield":
 return <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...common} />;
 case "star":
 return <polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9 12 2" {...common} />;
 case "book":
 return (
 <g>
 <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" {...common} />
 <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" {...common} />
 </g>
 );
 case "globe":
 return (
 <g>
 <circle cx="12" cy="12" r="9" {...common} />
 <path d="M3 12h18M12 3a15 15 0 0 0 0 18M12 3a15 15 0 0 1 0 18" {...common} />
 </g>
 );
 case "cpu":
 return (
 <g>
 <rect x="7" y="7" width="10" height="10" rx="1" {...common} />
 <path d="M9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M17 9h4M3 15h4M17 15h4" {...common} />
 </g>
 );
 case "scale":
 return (
 <g>
 <path d="M12 3v18M3 21h18" {...common} />
 <path d="M7 8h10M7 8l-2 4h14l-2-4" {...common} />
 <path d="M9 12v3M15 12v3" {...common} />
 </g>
 );
 case "clock":
 return (
 <g>
 <circle cx="12" cy="12" r="9" {...common} />
 <path d="M12 7v5l3 2" {...common} />
 </g>
 );
 case "pen":
 return (
 <g>
 <path d="M12 19l7-7 2-5-3-3-5 2-7 7v3h3z" {...common} />
 <path d="M18 5l1 1" {...common} />
 </g>
 );
 case "target":
 return (
 <g>
 <circle cx="12" cy="12" r="9" {...common} />
 <circle cx="12" cy="12" r="5" {...common} />
 <circle cx="12" cy="12" r="1" {...common} />
 </g>
 );
 case "music":
 return (
 <g>
 <path d="M9 18V5l12-2v13" {...common} />
 <circle cx="6" cy="18" r="3" {...common} />
 <circle cx="18" cy="16" r="3" {...common} />
 </g>
 );
 case "palette":
 return (
 <g>
 <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.5 0 2.5-1 2.5-2.5 0-.8-.3-1.5-.8-2.1.4-.3.8-.8.8-1.4 0-1-1-2-2-2H8c-2.2 0-4-1.8-4-4 0-3.3 2.7-6 6-6z" {...common} />
 <circle cx="7" cy="11" r="1" {...common} fill="none" />
 <circle cx="10" cy="8" r="1" {...common} fill="none" />
 <circle cx="15" cy="9" r="1" {...common} fill="none" />
 </g>
 );
 case "search":
 return (
 <g>
 <circle cx="11" cy="11" r="7" {...common} />
 <path d="M21 21l-4.3-4.3" {...common} />
 </g>
 );
 case "zap":
 return <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" {...common} />;
 case "cards":
 return (
 <g>
 <rect x="3" y="5" width="14" height="14" rx="2" {...common} />
 <rect x="7" y="3" width="14" height="14" rx="2" {...common} />
 </g>
 );
 case "document":
 return (
 <g>
 <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" {...common} />
 <path d="M14 2v6h6M8 13h8M8 17h6" {...common} />
 </g>
 );
 case "layers":
 return (
 <g>
 <path d="M12 2l10 5-10 5L2 7l10-5z" {...common} />
 <path d="M2 12l10 5 10-5M2 17l10 5 10-5" {...common} />
 </g>
 );
 case "spark":
 return (
 <g>
 <circle cx="8" cy="9" r="2" {...common} />
 <circle cx="16" cy="8" r="1.5" {...common} />
 <circle cx="14" cy="15" r="2" {...common} />
 <path d="M10 10l2 2M12 11l3-2M13 14l2 1" {...common} />
 </g>
 );
 case "calculator":
 return (
 <g>
 <rect x="5" y="3" width="14" height="18" rx="2" {...common} />
 <path d="M8 7h8M8 11h2M12 11h2M16 11h2M8 15h2M12 15h2M16 15h2" {...common} />
 </g>
 );
 case "flame":
 return <path d="M12 22c4-2 6-6 6-10 0-4-3-7-6-10-3 3-6 6-6 10 0 3 2 6 6 10zM12 22c-2-1-3-3-3-5 0-2 1-4 3-5" {...common} />;
 case "clipboard":
 return (
 <g>
 <path d="M9 3h6l1 2h3a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3l1-2z" {...common} />
 <path d="M9 12h6M9 16h4" {...common} />
 </g>
 );
 case "check":
 return (
 <g>
 <circle cx="12" cy="12" r="9" {...common} />
 <path d="M8 12l2.5 2.5L16 9" {...common} />
 </g>
 );
 case "refresh":
 return (
 <g>
 <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" {...common} />
 <path d="M3 3v5h5M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" {...common} />
 <path d="M21 21v-5h-5" {...common} />
 </g>
 );
 case "moon":
 return <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" {...common} />;
 default:
 return <circle cx="12" cy="12" r="8" {...common} />;
 }
}

export function SimpleIconBox({
 name,
 size = 36,
 className = "",
 label,
}: {
 name: SimpleIconId;
 size?: number;
 className?: string;
 /** Visually hidden label for screen readers */
 label?: string;
}) {
 const inner = Math.round(size * 0.52);
 return (
 <span
 role={label ? "img" : undefined}
 aria-label={label}
 className={`inline-flex shrink-0 items-center justify-center rounded-md bg-slate-950/90 text-sky-400/95 ring-1 ring-sky-500/35 ${className}`}
 style={{ width: size, height: size }}
 >
 <svg width={inner} height={inner} viewBox="0 0 24 24" aria-hidden={label ? true : undefined}>
 <IconGlyph name={name} />
 </svg>
 </span>
 );
}
