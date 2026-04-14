"use client";

import { useCallback, useState } from "react";

/**
 * Embeds Desmos Graphing Calculator (no API key required for basic embed).
 * If the iframe is blocked by a browser extension or network policy, open desmos.com manually.
 */
export function DesmosCalculatorDock() {
 const [open, setOpen] = useState(false);
 const toggle = useCallback(() => setOpen((o) => !o), []);

 return (
 <div className="fixed bottom-0 right-0 z-[45] flex flex-col items-end gap-2 p-3 pointer-events-none">
 <div className="pointer-events-auto flex flex-col items-end gap-2">
 {open ? (
 <div className="w-[min(100vw-1.5rem,28rem)] h-[min(55vh,22rem)] rounded-xl border border-vanta-border bg-vanta-surface shadow-xl overflow-hidden flex flex-col">
 <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-vanta-border bg-vanta-surface-elevated">
 <span className="text-xs font-semibold text-vanta-text">Desmos graphing calculator</span>
 <button
 type="button"
 onClick={toggle}
 className="text-xs font-medium text-vanta-muted hover:text-vanta-text px-2 py-1 rounded-lg border border-transparent hover:border-vanta-border"
 >
 Close
 </button>
 </div>
 <iframe
 title="Desmos Graphing Calculator"
 src="https://www.desmos.com/calculator?embed=true&lang=en"
 className="w-full flex-1 min-h-0 border-0 bg-white"
 allow="fullscreen; clipboard-write"
 />
 </div>
 ) : null}
 <button
 type="button"
 onClick={toggle}
 className="pointer-events-auto rounded-full bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold px-4 py-2.5 shadow-lg shadow-black/25 border border-teal-700/30"
 >
 {open ? "Hide calculator" : "Calculator"}
 </button>
 </div>
 </div>
 );
}
