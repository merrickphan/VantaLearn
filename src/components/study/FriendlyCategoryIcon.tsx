import type { ApCategoryId } from "@/lib/apCategories";

/** Flat, colorful icons in soft rounded tiles - friendly / 'education app' vibe */
export function FriendlyCategoryIcon({
 categoryId,
 size = 52,
 className = "",
}: {
 categoryId: ApCategoryId;
 size?: number;
 className?: string;
}) {
 const s = size;
 const inner = Math.round(size * 0.62);
 return (
 <span
 className={`inline-flex items-center justify-center rounded-2xl bg-vanta-surface-elevated shadow-sm ring-1 ring-vanta-border ${className}`}
 style={{ width: s, height: s }}
 aria-hidden
 >
 <svg width={inner} height={inner} viewBox="0 0 48 48" className="overflow-visible">
 <Glyph id={categoryId} />
 </svg>
 </span>
 );
}

function Glyph({ id }: { id: ApCategoryId }) {
 switch (id) {
 case "math":
 return (
 <g>
 <rect x="6" y="8" width="36" height="32" rx="4" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.5" />
 <path d="M14 32 L14 16 M14 24 L22 24 M22 16 L22 32" stroke="#0369a1" strokeWidth="2" strokeLinecap="round" />
 <path d="M26 28 Q30 14 38 20" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />
 <circle cx="30" cy="22" r="3" fill="#fbbf24" />
 </g>
 );
 case "science":
 return (
 <g>
 <path d="M18 8h12l-2 26a4 4 0 0 1-8 0L18 8z" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />
 <ellipse cx="24" cy="22" rx="6" ry="3" fill="#38bdf8" opacity="0.85" />
 <path d="M20 30h8" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" />
 </g>
 );
 case "engineering":
 return (
 <g>
 <rect x="8" y="14" width="32" height="22" rx="3" fill="#ede9fe" stroke="#7c3aed" strokeWidth="1.5" />
 <path d="M12 22h10M12 28h16" stroke="#6d28d9" strokeWidth="2" strokeLinecap="round" />
 <circle cx="34" cy="20" r="6" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.5" />
 <circle cx="34" cy="20" r="2.5" fill="#fff7ed" />
 </g>
 );
 case "social-studies":
 return (
 <g>
 <circle cx="24" cy="24" r="16" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" />
 <path d="M8 28 Q24 12 40 28" fill="#86efac" opacity="0.9" />
 <ellipse cx="18" cy="20" rx="4" ry="6" fill="#4ade80" opacity="0.85" />
 <ellipse cx="32" cy="22" rx="5" ry="4" fill="#22c55e" opacity="0.75" />
 </g>
 );
 case "language":
 return (
 <g>
 <path d="M12 10h20a3 3 0 0 1 3 3v22a3 3 0 0 1-3 3H12V10z" fill="#fef9c3" stroke="#eab308" strokeWidth="1.5" />
 <path d="M12 10v28h20" fill="none" stroke="#ca8a04" strokeWidth="1.5" />
 <path d="M18 18h14M18 24h12M18 30h10" stroke="#854d0e" strokeWidth="1.8" strokeLinecap="round" />
 </g>
 );
 case "business":
 return (
 <g>
 <rect x="10" y="26" width="8" height="12" rx="1" fill="#86efac" />
 <rect x="20" y="18" width="8" height="20" rx="1" fill="#4ade80" />
 <rect x="30" y="12" width="8" height="26" rx="1" fill="#16a34a" />
 <path d="M8 38h32" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
 </g>
 );
 case "arts":
 return (
 <g>
 <ellipse cx="18" cy="20" rx="10" ry="8" fill="#fbcfe8" stroke="#db2777" strokeWidth="1.2" />
 <ellipse cx="32" cy="22" rx="8" ry="10" fill="#fde68a" stroke="#d97706" strokeWidth="1.2" />
 <circle cx="26" cy="30" r="5" fill="#93c5fd" stroke="#2563eb" strokeWidth="1.2" />
 </g>
 );
 case "capstone":
 return (
 <g>
 <path d="M14 18h20l-2 18H16L14 18z" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="1.5" />
 <path d="M12 18h24" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
 <circle cx="24" cy="14" r="4" fill="#fcd34d" stroke="#d97706" strokeWidth="1.2" />
 <path d="M18 30h12" stroke="#4338ca" strokeWidth="1.5" strokeLinecap="round" />
 </g>
 );
 default:
 return <circle cx="24" cy="24" r="14" fill="#e2e8f0" />;
 }
}
