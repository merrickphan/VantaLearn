/** Soft rounded tile with emoji - matches FriendlyCategoryIcon container style */
export function FriendlyTileEmoji({ emoji, label }: { emoji: string; label?: string }) {
 return (
 <span
 className="inline-flex items-center justify-center rounded-2xl bg-vanta-surface-elevated text-2xl shadow-sm ring-1 ring-vanta-border w-12 h-12"
 role={label ? "img" : undefined}
 aria-label={label}
 >
 {emoji}
 </span>
 );
}
