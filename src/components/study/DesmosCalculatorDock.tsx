"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DESMOS_API = "https://www.desmos.com/api/v1.11/calculator.js";

type DesmosCalculatorInstance = {
 destroy: () => void;
 resize: () => void;
};

declare global {
 interface Window {
 Desmos?: {
 GraphingCalculator: (element: HTMLElement, options?: Record<string, unknown>) => DesmosCalculatorInstance;
 };
 }
}

function getDesmosApiKey(): string {
 return (typeof process !== "undefined" && process.env.NEXT_PUBLIC_DESMOS_API_KEY
 ? process.env.NEXT_PUBLIC_DESMOS_API_KEY
 : ""
 ).trim();
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

/**
 * In-app Desmos: uses the official Graphing Calculator API when `NEXT_PUBLIC_DESMOS_API_KEY`
 * is set (free key: https://www.desmos.com/my-api). Without a key, uses the public
 * `/calculator/embed` iframe (more reliable than `?embed=true` on the main calculator URL).
 */
export function DesmosCalculatorDock() {
 const [open, setOpen] = useState(false);
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
 }, [open, apiKey, mode]);

 return (
 <div className="fixed bottom-0 right-0 z-[45] flex flex-col items-end gap-2 p-3 pointer-events-none">
 <div className="pointer-events-auto flex flex-col items-end gap-2 max-w-[min(100vw-1.5rem,28rem)]">
 {open ? (
 <div className="w-full h-[min(55vh,22rem)] rounded-xl border border-vanta-border bg-vanta-surface shadow-xl overflow-hidden flex flex-col">
 <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-vanta-border bg-vanta-surface-elevated shrink-0">
 <span className="text-xs font-semibold text-vanta-text">Desmos graphing calculator</span>
 <div className="flex items-center gap-2">
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
 onClick={toggle}
 className="text-xs font-medium text-vanta-muted hover:text-vanta-text px-2 py-1 rounded-lg border border-transparent hover:border-vanta-border"
 >
 Close
 </button>
 </div>
 </div>
 {!apiKey ? (
 <div className="flex flex-1 flex-col min-h-0">
 <p className="text-[11px] text-vanta-muted px-3 py-2 border-b border-vanta-border/80 bg-vanta-bg leading-snug">
 For a fully interactive calculator inside the app, add a free key from{" "}
 <a href="https://www.desmos.com/my-api" className="text-sky-600 hover:underline" target="_blank" rel="noopener noreferrer">
 desmos.com/my-api
 </a>{" "}
 as <code className="text-vanta-text">NEXT_PUBLIC_DESMOS_API_KEY</code> in <code className="text-vanta-text">.env.local</code> and restart the dev server. Embed below:
 </p>
 <iframe
 title="Desmos Graphing Calculator"
 src="https://www.desmos.com/calculator/embed"
 className="w-full flex-1 min-h-0 border-0 bg-white"
 allow="clipboard-write; fullscreen"
 referrerPolicy="origin-when-cross-origin"
 />
 </div>
 ) : (
 <div className="relative flex-1 min-h-0 w-full bg-white">
 {mode === "loading" ? (
 <div className="absolute inset-0 z-10 flex items-center justify-center text-sm text-vanta-muted bg-vanta-surface">
 Loading calculator…
 </div>
 ) : null}
 {mode === "error" && errorMsg ? (
 <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 p-4 text-center text-sm text-vanta-error bg-vanta-surface">
 <p>{errorMsg}</p>
 <a
 href="https://www.desmos.com/my-api"
 target="_blank"
 rel="noopener noreferrer"
 className="text-sky-600 hover:underline text-xs"
 >
 Get an API key
 </a>
 </div>
 ) : null}
 <div ref={containerRef} className="absolute inset-0 w-full h-full" />
 </div>
 )}
 </div>
 ) : null}
 <button
 type="button"
 onClick={toggle}
 className="rounded-full bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold px-4 py-2.5 shadow-lg shadow-black/25 border border-teal-700/30"
 >
 {open ? "Hide calculator" : "Calculator"}
 </button>
 </div>
 </div>
 );
}
