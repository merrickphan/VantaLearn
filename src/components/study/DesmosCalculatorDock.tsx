"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DESMOS_API = "https://www.desmos.com/api/v1.11/calculator.js";

type DesmosCalculatorInstance = {
 destroy: () => void;
 resize: () => void;
};

type DockSize = "compact" | "half" | "full";

declare global {
 interface Window {
 /** Set in root `layout.tsx` from server env so the key is always current (avoids stale client bundle inlining). */
 __VL_DESMOS_API_KEY__?: string;
 Desmos?: {
 GraphingCalculator: (element: HTMLElement, options?: Record<string, unknown>) => DesmosCalculatorInstance;
 };
 }
}

function getDesmosApiKey(): string {
 if (typeof window !== "undefined") {
 const injected = window.__VL_DESMOS_API_KEY__;
 if (typeof injected === "string" && injected.length > 0) {
 return injected.trim();
 }
 }
 return (process.env.NEXT_PUBLIC_DESMOS_API_KEY ?? "").trim();
}

function loadDesmosScript(apiKey: string): Promise<void> {
 if (typeof window === "undefined") {
 return Promise.reject(new Error("no window"));
 }
 if (window.Desmos) {
 return Promise.resolve();
 }
 return new Promise((resolve, reject) => {
 const id = "vanta-desmos-calculator-api";
 const existing = document.getElementById(id) as HTMLScriptElement | null;
 if (existing) {
 if (window.Desmos) {
 resolve();
 return;
 }
 existing.addEventListener("load", () => resolve(), { once: true });
 existing.addEventListener("error", () => reject(new Error("Desmos script error")), { once: true });
 return;
 }
 const s = document.createElement("script");
 s.id = id;
 s.src = `${DESMOS_API}?apiKey=${encodeURIComponent(apiKey)}`;
 s.async = true;
 s.onload = () => resolve();
 s.onerror = () => reject(new Error("Failed to load Desmos API"));
 document.body.appendChild(s);
 });
}

function SizeToggle({
 active,
 label,
 onClick,
}: {
 active: boolean;
 label: string;
 onClick: () => void;
}) {
 return (
 <button
 type="button"
 onClick={onClick}
 className={`rounded-lg px-2 py-1 text-[11px] font-semibold transition-colors ${
 active
 ? "bg-teal-600 text-white shadow-sm"
 : "bg-vanta-surface text-vanta-muted hover:text-vanta-text border border-vanta-border"
 }`}
 >
 {label}
 </button>
 );
}

/**
 * In-app Desmos: uses the official Graphing Calculator API when `NEXT_PUBLIC_DESMOS_API_KEY`
 * is set (free key: https://www.desmos.com/my-api). Without a key, uses the public
 * `/calculator/embed` iframe (more reliable than `?embed=true` on the main calculator URL).
 */
export function DesmosCalculatorDock() {
 const [open, setOpen] = useState(false);
 const [dockSize, setDockSize] = useState<DockSize>("compact");
 const [mode, setMode] = useState<"idle" | "loading" | "ready" | "error">("idle");
 const [errorMsg, setErrorMsg] = useState<string | null>(null);
 const containerRef = useRef<HTMLDivElement>(null);
 const calculatorRef = useRef<DesmosCalculatorInstance | null>(null);
 const apiKey = getDesmosApiKey();

 const tearDownCalculator = useCallback(() => {
 try {
 calculatorRef.current?.destroy();
 } catch {
 /* ignore */
 }
 calculatorRef.current = null;
 if (containerRef.current) containerRef.current.innerHTML = "";
 }, []);

 const close = useCallback(() => {
 setOpen(false);
 setDockSize("compact");
 }, []);

 const toggle = useCallback(() => setOpen((o) => !o), []);

 useEffect(() => {
 if (!open) {
 tearDownCalculator();
 setMode("idle");
 setErrorMsg(null);
 return;
 }

 if (!apiKey) {
 setMode("ready");
 setErrorMsg(null);
 return;
 }

 let cancelled = false;
 setMode("loading");
 setErrorMsg(null);
 tearDownCalculator();

 (async () => {
 try {
 await loadDesmosScript(apiKey);
 if (cancelled || !containerRef.current) return;
 if (!window.Desmos) throw new Error("Desmos API unavailable");
 calculatorRef.current = window.Desmos.GraphingCalculator(containerRef.current);
 if (cancelled) {
 calculatorRef.current.destroy();
 calculatorRef.current = null;
 return;
 }
 setMode("ready");
 } catch (e) {
 if (!cancelled) {
 setErrorMsg(e instanceof Error ? e.message : "Could not start Desmos");
 setMode("error");
 }
 }
 })();

 return () => {
 cancelled = true;
 tearDownCalculator();
 setMode("idle");
 };
 }, [open, apiKey, tearDownCalculator]);

 useEffect(() => {
 if (!open || !apiKey || mode !== "ready" || !calculatorRef.current || !containerRef.current) return;
 const el = containerRef.current;
 const calc = calculatorRef.current;
 const ro = new ResizeObserver(() => {
 try {
 calc.resize();
 } catch {
 /* ignore */
 }
 });
 ro.observe(el);
 return () => ro.disconnect();
 }, [open, apiKey, mode, dockSize]);

 useEffect(() => {
 if (!open || mode !== "ready" || !calculatorRef.current) return;
 const id = requestAnimationFrame(() => {
 try {
 calculatorRef.current?.resize();
 } catch {
 /* ignore */
 }
 });
 return () => cancelAnimationFrame(id);
 }, [dockSize, open, mode]);

 useEffect(() => {
 if (!open || dockSize !== "full") return;
 const onKey = (e: KeyboardEvent) => {
 if (e.key === "Escape") {
 e.preventDefault();
 setDockSize("compact");
 }
 };
 window.addEventListener("keydown", onKey);
 return () => window.removeEventListener("keydown", onKey);
 }, [open, dockSize]);

 const shellClass =
 dockSize === "full"
 ? "fixed inset-0 z-[100] flex flex-col p-0 pointer-events-auto bg-vanta-bg/95 backdrop-blur-sm"
 : dockSize === "half"
 ? "fixed inset-x-0 bottom-0 left-0 right-0 z-[60] flex h-[50vh] max-h-[50dvh] flex-col pointer-events-auto px-0 pt-0 pb-[env(safe-area-inset-bottom,0px)]"
 : "fixed bottom-0 right-0 z-[45] flex flex-col items-end gap-2 p-3 pointer-events-none";

 const panelClass =
 dockSize === "full"
 ? "flex h-full min-h-0 w-full flex-col overflow-hidden rounded-none border-0 border-vanta-border bg-vanta-surface shadow-none"
 : dockSize === "half"
 ? "flex h-full min-h-0 w-full flex-col overflow-hidden rounded-t-2xl border border-b-0 border-vanta-border border-x-vanta-border bg-vanta-surface shadow-[0_-8px_30px_rgba(0,0,0,0.12)]"
 : "flex h-[min(55vh,22rem)] w-full max-w-[min(100vw-1.5rem,28rem)] flex-col overflow-hidden rounded-xl border border-vanta-border bg-vanta-surface shadow-xl";

 const innerWrapClass = dockSize === "compact" ? "pointer-events-auto flex w-full max-w-[min(100vw-1.5rem,28rem)] flex-col items-end gap-2" : "flex h-full min-h-0 w-full flex-col";

 return (
 <>
 {open ? (
 <div className={shellClass}>
 <div className={innerWrapClass}>
 <div className={panelClass}>
 <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-vanta-border bg-vanta-surface-elevated px-3 py-2">
 <span className="text-xs font-semibold text-vanta-text">Desmos graphing calculator</span>
 <div className="flex flex-wrap items-center gap-2">
 <div className="flex items-center gap-1 rounded-lg bg-vanta-bg/80 p-0.5">
 <SizeToggle active={dockSize === "compact"} label="Small" onClick={() => setDockSize("compact")} />
 <SizeToggle active={dockSize === "half"} label="Half" onClick={() => setDockSize("half")} />
 <SizeToggle active={dockSize === "full"} label="Full" onClick={() => setDockSize("full")} />
 </div>
 <a
 href="https://www.desmos.com/calculator"
 target="_blank"
 rel="noopener noreferrer"
 className="text-xs font-medium text-sky-600 hover:underline"
 >
 Open in tab
 </a>
 <button
 type="button"
 onClick={close}
 className="text-xs font-medium text-vanta-muted hover:text-vanta-text px-2 py-1 rounded-lg border border-transparent hover:border-vanta-border"
 >
 Close
 </button>
 </div>
 </div>
 {dockSize === "full" ? (
 <p className="shrink-0 px-3 py-1 text-[10px] text-vanta-muted border-b border-vanta-border/60">
 Press <kbd className="rounded bg-vanta-surface-elevated px-1 font-mono text-vanta-text">Esc</kbd> to leave full screen
 </p>
 ) : null}
 {!apiKey ? (
 <div className="flex min-h-0 flex-1 flex-col">
 <p className="text-[11px] text-vanta-muted border-b border-vanta-border/80 bg-vanta-bg px-3 py-2 leading-snug">
 Add a free key from{" "}
 <a href="https://www.desmos.com/my-api" className="text-sky-600 hover:underline" target="_blank" rel="noopener noreferrer">
 desmos.com/my-api
 </a>{" "}
 to <code className="text-vanta-text">.env.local</code> as{" "}
 <code className="text-vanta-text">NEXT_PUBLIC_DESMOS_API_KEY</code> (or <code className="text-vanta-text">DESMOS_API_KEY</code>
 ), then restart <code className="text-vanta-text">npm run dev</code>. Embed below:
 </p>
 <iframe
 title="Desmos Graphing Calculator"
 src="https://www.desmos.com/calculator/embed"
 className="min-h-0 w-full flex-1 border-0 bg-white"
 allow="clipboard-write; fullscreen"
 referrerPolicy="origin-when-cross-origin"
 />
 </div>
 ) : (
 <div className="relative min-h-0 flex-1 w-full bg-white">
 {mode === "loading" ? (
 <div className="absolute inset-0 z-10 flex items-center justify-center bg-vanta-surface text-sm text-vanta-muted">
 Loading calculator…
 </div>
 ) : null}
 {mode === "error" && errorMsg ? (
 <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-vanta-surface p-4 text-center text-sm text-vanta-error">
 <p>{errorMsg}</p>
 <a
 href="https://www.desmos.com/my-api"
 target="_blank"
 rel="noopener noreferrer"
 className="text-xs text-sky-600 hover:underline"
 >
 Get an API key
 </a>
 </div>
 ) : null}
 <div ref={containerRef} className="absolute inset-0 h-full w-full" />
 </div>
 )}
 </div>
 </div>
 </div>
 ) : null}

 {!open ? (
 <div className="fixed bottom-0 right-0 z-[45] p-3 pointer-events-none">
 <button
 type="button"
 onClick={toggle}
 className="pointer-events-auto rounded-full border border-teal-700/30 bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/25 hover:bg-teal-500"
 >
 Calculator
 </button>
 </div>
 ) : null}
 </>
 );
}
