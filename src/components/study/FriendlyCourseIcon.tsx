import { AP_COURSES } from "@/lib/apCatalog";

const KNOWN_IDS = new Set(AP_COURSES.map((c) => c.id));

/** One distinct flat illustration per AP course (`ApCourse.id`). */
export function FriendlyCourseIcon({
 courseId,
 size = 44,
 className = "",
}: {
 courseId: string;
 size?: number;
 className?: string;
}) {
 const s = size;
 const inner = Math.round(size * 0.62);
 const valid = KNOWN_IDS.has(courseId);
 return (
 <span
 className={`inline-flex items-center justify-center rounded-2xl bg-slate-100 shadow-sm ring-1 ring-slate-200/90 ${className}`}
 style={{ width: s, height: s }}
 aria-hidden
 title={valid ? undefined : courseId}
 >
 <svg width={inner} height={inner} viewBox="0 0 48 48" className="overflow-visible">
 <CourseGlyph courseId={valid ? courseId : "_fallback"} />
 </svg>
 </span>
 );
}

function CourseGlyph({ courseId }: { courseId: string }) {
 switch (courseId) {
 case "calc-ab":
 return (
 <g>
 <rect x="6" y="8" width="36" height="32" rx="4" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.2" />
 <path d="M12 28 Q18 14 28 20 T40 18" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />
 <text x="12" y="22" fontSize="11" fill="#0369a1" fontFamily="Georgia,serif" fontStyle="italic">
 int
 </text>
 </g>
 );
 case "calc-bc":
 return (
 <g>
 <rect x="6" y="8" width="36" height="32" rx="4" fill="#fef3c7" stroke="#d97706" strokeWidth="1.2" />
 <path d="M14 32c2-8 6-14 12-14s8 6 10 14" fill="none" stroke="#ea580c" strokeWidth="2" />
 <text x="18" y="24" fontSize="12" fill="#b45309" fontFamily="Georgia,serif">
 Sum
 </text>
 </g>
 );
 case "precalc":
 return (
 <g>
 <rect x="6" y="10" width="36" height="30" rx="4" fill="#ede9fe" stroke="#7c3aed" strokeWidth="1.2" />
 <path d="M10 30 Q16 12 24 24 T38 14" fill="none" stroke="#6d28d9" strokeWidth="2.2" strokeLinecap="round" />
 <circle cx="24" cy="24" r="3" fill="#fbbf24" />
 </g>
 );
 case "stats":
 return (
 <g>
 <rect x="8" y="12" width="32" height="26" rx="3" fill="#ecfdf5" stroke="#059669" strokeWidth="1.2" />
 <rect x="12" y="26" width="5" height="8" rx="1" fill="#34d399" />
 <rect x="20" y="20" width="5" height="14" rx="1" fill="#10b981" />
 <rect x="28" y="16" width="5" height="18" rx="1" fill="#047857" />
 </g>
 );
 case "cs-a":
 return (
 <g>
 <rect x="8" y="10" width="32" height="28" rx="3" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
 <text x="14" y="26" fontSize="11" fill="#fbbf24" fontFamily="monospace" fontWeight="bold">
 {"{ }"}
 </text>
 <path d="M28 14h8v4h-4v8h-4v-12z" fill="#38bdf8" opacity="0.9" />
 </g>
 );
 case "csp":
 return (
 <g>
 <circle cx="24" cy="24" r="16" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.2" />
 <path d="M24 12v8M24 28v8M12 24h8M28 24h8" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" />
 <circle cx="24" cy="24" r="4" fill="#fbbf24" />
 </g>
 );
 case "physics-1":
 return (
 <g>
 <path d="M8 36h32" stroke="#64748b" strokeWidth="2" />
 <path d="M14 36 L28 18 L34 36" fill="#cbd5e1" stroke="#475569" strokeWidth="1.2" />
 <rect x="22" y="22" width="10" height="8" rx="1" fill="#f97316" />
 </g>
 );
 case "physics-2":
 return (
 <g>
 <path d="M8 30 Q24 8 40 30" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
 <ellipse cx="24" cy="22" rx="10" ry="6" fill="#bae6fd" stroke="#0284c7" strokeWidth="1" />
 <circle cx="32" cy="18" r="3" fill="#fef08a" stroke="#eab308" />
 </g>
 );
 case "physics-c-m":
 return (
 <g>
 <circle cx="18" cy="28" r="6" fill="#94a3b8" stroke="#475569" />
 <path d="M24 28h14" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
 <path d="M32 20v16" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
 <path d="M10 14 L17 26" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" />
 <path d="M17 26 L14 26 L15 29 Z" fill="#16a34a" />
 </g>
 );
 case "physics-c-em":
 return (
 <g>
 <rect x="10" y="14" width="10" height="18" rx="1" fill="#1e3a8a" stroke="#1e40af" />
 <path d="M22 18h14M22 28h14" stroke="#f59e0b" strokeWidth="2" />
 <path d="M30 10c4 4 4 12 0 16" fill="none" stroke="#a855f7" strokeWidth="2" />
 <text x="22" y="40" fontSize="7" fill="#4f46e5" fontFamily="serif">
 line
 </text>
 </g>
 );
 case "chem":
 return (
 <g>
 <path d="M18 8h12l-1 22a5 5 0 0 1-10 0L18 8z" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.2" />
 <circle cx="20" cy="18" r="2" fill="#38bdf8" />
 <circle cx="28" cy="22" r="2.5" fill="#22c55e" />
 <circle cx="24" cy="28" r="2" fill="#a855f7" />
 </g>
 );
 case "bio":
 return (
 <g>
 <ellipse cx="24" cy="26" rx="14" ry="10" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
 <circle cx="18" cy="24" r="4" fill="#86efac" stroke="#15803d" />
 <circle cx="30" cy="26" r="3" fill="#bbf7d0" stroke="#166534" />
 <path d="M24 12v6" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
 </g>
 );
 case "env":
 return (
 <g>
 <path d="M8 32 Q24 6 40 32Z" fill="#86efac" stroke="#15803d" strokeWidth="1.2" />
 <rect x="18" y="22" width="12" height="14" fill="#92400e" rx="1" />
 <circle cx="24" cy="14" r="6" fill="#fcd34d" />
 </g>
 );
 case "ush":
 return (
 <g>
 <circle cx="24" cy="24" r="15" fill="#1e40af" stroke="#1e3a8a" strokeWidth="1" />
 <path d="M12 18h24M12 22h24M12 26h12" stroke="#f8fafc" strokeWidth="1.5" />
 <path d="M14 14 L16 18 L14 22" stroke="#dc2626" strokeWidth="2" fill="none" />
 </g>
 );
 case "wh":
 return (
 <g>
 <circle cx="24" cy="26" r="14" fill="#bae6fd" stroke="#0369a1" strokeWidth="1.2" />
 <path d="M12 28 Q24 10 36 28" fill="#86efac" opacity="0.9" />
 <path d="M24 12 L26 18 L24 20 L22 18Z" fill="#dc2626" />
 </g>
 );
 case "euro":
 return (
 <g>
 <rect x="10" y="12" width="28" height="24" rx="2" fill="#1e3a8a" stroke="#172554" />
 <circle cx="24" cy="24" r="9" fill="none" stroke="#fbbf24" strokeWidth="1.2" />
 <text x="17" y="28" fontSize="11" fill="#fbbf24" fontWeight="bold">
 EU
 </text>
 </g>
 );
 case "gov":
 return (
 <g>
 <path d="M14 38V14h20v24" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
 <rect x="18" y="18" width="12" height="8" fill="#1e40af" />
 <path d="M24 10 L28 14H20Z" fill="#64748b" />
 </g>
 );
 case "comp-gov":
 return (
 <g>
 <rect x="6" y="14" width="10" height="14" rx="1" fill="#dc2626" stroke="#991b1b" />
 <rect x="19" y="12" width="10" height="16" rx="1" fill="#2563eb" stroke="#1d4ed8" />
 <rect x="32" y="15" width="10" height="13" rx="1" fill="#16a34a" stroke="#15803d" />
 </g>
 );
 case "macro":
 return (
 <g>
 <rect x="8" y="10" width="32" height="28" rx="3" fill="#fef9c3" stroke="#ca8a04" />
 <path d="M12 32 L18 22 L26 26 L36 12" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
 <path d="M12 32h24" stroke="#64748b" strokeWidth="1.5" />
 </g>
 );
 case "micro":
 return (
 <g>
 <rect x="8" y="12" width="32" height="26" rx="3" fill="#fff7ed" stroke="#ea580c" />
 <path d="M14 28 Q24 14 34 28" fill="none" stroke="#2563eb" strokeWidth="2" />
 <path d="M14 22 Q24 34 34 22" fill="none" stroke="#dc2626" strokeWidth="2" />
 </g>
 );
 case "psych":
 return (
 <g>
 <path
 d="M18 10c-4 0-8 6-8 14s4 18 10 18 10-10 10-18-4-14-8-14c0-4 4-6 8-6s8 2 8 6z"
 fill="#fbcfe8"
 stroke="#db2777"
 strokeWidth="1.2"
 />
 <path d="M20 22h6M23 19v6" stroke="#9d174d" strokeWidth="1.5" strokeLinecap="round" />
 </g>
 );
 case "hum-geo":
 return (
 <g>
 <rect x="8" y="10" width="32" height="28" rx="2" fill="#dbeafe" stroke="#2563eb" />
 <circle cx="16" cy="20" r="3" fill="#ef4444" />
 <circle cx="28" cy="24" r="2.5" fill="#22c55e" />
 <path d="M12 32 L20 18 L30 32" fill="none" stroke="#64748b" strokeWidth="1.5" />
 </g>
 );
 case "lang":
 return (
 <g>
 <rect x="10" y="12" width="28" height="24" rx="2" fill="#fffbeb" stroke="#d97706" />
 <path d="M14 20h16M14 26h12" stroke="#92400e" strokeWidth="2" strokeLinecap="round" />
 <path d="M30 14 L34 18 L30 22" fill="none" stroke="#0284c7" strokeWidth="2" />
 </g>
 );
 case "lit":
 return (
 <g>
 <path d="M12 8h12v32H12z M24 8h12v32H24z" fill="#fef3c7" stroke="#b45309" strokeWidth="1.2" />
 <path d="M16 16h4M16 22h8M16 28h6" stroke="#78350f" strokeWidth="1.2" strokeLinecap="round" />
 </g>
 );
 case "art-hist":
 return (
 <g>
 <rect x="10" y="10" width="28" height="22" rx="1" fill="#fef3c7" stroke="#92400e" strokeWidth="2" />
 <circle cx="24" cy="20" r="6" fill="#38bdf8" opacity="0.7" />
 <path d="M14 34h20" stroke="#78350f" strokeWidth="2" />
 </g>
 );
 case "art-design":
 return (
 <g>
 <path d="M12 34 L22 12 L34 34Z" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="1.5" />
 <rect x="16" y="22" width="16" height="3" fill="#f59e0b" transform="rotate(-25 24 23.5)" />
 </g>
 );
 case "music":
 return (
 <g>
 <ellipse cx="14" cy="32" rx="5" ry="4" fill="#1e293b" />
 <ellipse cx="34" cy="28" rx="5" ry="4" fill="#1e293b" />
 <path d="M19 32 V14 M29 28 V10" stroke="#0f172a" strokeWidth="2" />
 <circle cx="22" cy="12" r="2" fill="#0f172a" />
 </g>
 );
 case "spanish":
 return (
 <g>
 <rect x="8" y="12" width="32" height="24" rx="2" fill="#fef2f2" stroke="#991b1b" />
 <rect x="8" y="20" width="32" height="8" fill="#fbbf24" />
 <text x="16" y="27" fontSize="9" fill="#b91c1c" fontWeight="bold">
 Es
 </text>
 </g>
 );
 case "french":
 return (
 <g>
 <rect x="8" y="12" width="10" height="24" fill="#1e40af" />
 <rect x="18" y="12" width="12" height="24" fill="#f8fafc" />
 <rect x="30" y="12" width="10" height="24" fill="#dc2626" />
 </g>
 );
 case "german":
 return (
 <g>
 <rect x="8" y="12" width="32" height="8" fill="#0f172a" />
 <rect x="8" y="20" width="32" height="8" fill="#dc2626" />
 <rect x="8" y="28" width="32" height="8" fill="#fbbf24" />
 </g>
 );
 case "latin":
 return (
 <g>
 <rect x="10" y="14" width="8" height="22" fill="#cbd5e1" stroke="#64748b" />
 <rect x="22" y="10" width="8" height="26" fill="#94a3b8" stroke="#475569" />
 <rect x="34" y="16" width="6" height="18" fill="#e2e8f0" stroke="#64748b" />
 <path d="M12 38h26" stroke="#78716c" strokeWidth="2" />
 </g>
 );
 case "chinese":
 return (
 <g>
 <rect x="8" y="10" width="32" height="28" rx="3" fill="#fef2f2" stroke="#dc2626" strokeWidth="1.5" />
 <text x="12" y="30" fontSize="14" fill="#b91c1c" fontFamily="serif">
 Zh
 </text>
 </g>
 );
 case "japanese":
 return (
 <g>
 <circle cx="24" cy="24" r="16" fill="#fce7f3" stroke="#db2777" strokeWidth="1.2" />
 <text x="12" y="30" fontSize="14" fill="#9d174d" fontFamily="sans-serif">
 Ja
 </text>
 </g>
 );
 case "seminar":
 return (
 <g>
 <ellipse cx="24" cy="30" rx="16" ry="6" fill="#e2e8f0" stroke="#64748b" />
 <rect x="10" y="16" width="28" height="10" rx="2" fill="#cbd5e1" stroke="#475569" />
 <circle cx="16" cy="12" r="3" fill="#38bdf8" />
 <circle cx="24" cy="10" r="3" fill="#f472b6" />
 <circle cx="32" cy="12" r="3" fill="#a78bfa" />
 </g>
 );
 case "research":
 return (
 <g>
 <rect x="12" y="14" width="24" height="22" rx="1" fill="#fff" stroke="#64748b" />
 <circle cx="30" cy="18" r="6" fill="none" stroke="#2563eb" strokeWidth="2" />
 <path d="M34 22 L38 26" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
 <path d="M16 22h10M16 28h16M16 32h12" stroke="#94a3b8" strokeWidth="1.5" />
 </g>
 );
 case "_fallback":
 default:
 return (
 <g>
 <rect x="8" y="10" width="32" height="28" rx="4" fill="#f1f5f9" stroke="#94a3b8" />
 <path d="M16 18h16M16 24h12M16 30h8" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
 </g>
 );
 }
}
