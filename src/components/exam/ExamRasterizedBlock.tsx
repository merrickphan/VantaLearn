"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { toPng } from "html-to-image";

function katexFilter(domNode: HTMLElement): boolean {
	return !domNode.classList?.contains("katex-mathml");
}

function resolvedSurfaceBackground(): string {
	const root = document.documentElement;
	const raw = getComputedStyle(root).getPropertyValue("--vanta-surface").trim();
	if (raw) return raw;
	const bg = getComputedStyle(root).backgroundColor;
	if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") return bg;
	return "#ffffff";
}

export type ExamRasterizedBlockProps = {
	children: ReactNode;
	/** Stable key when content changes (text hash, question id + figure hash, etc.) */
	syncKey: string;
	className?: string;
	/** Accessible description when not decorative */
	alt: string;
	/** When true, image is marked decorative (e.g. MCQ option inside a labeled button). */
	decorative?: boolean;
};

/**
 * Snapshots `children` to a PNG. During capture the node is moved to `fixed` (0,0) with full
 * opacity so the browser paints real pixels; a fullscreen mask prevents a visible flash.
 * Far off-screen `fixed` nodes often report `clientHeight === 0`, which produced black bars.
 */
export function ExamRasterizedBlock({ children, syncKey, className, alt, decorative }: ExamRasterizedBlockProps) {
	const wrapRef = useRef<HTMLDivElement>(null);
	const sourceRef = useRef<HTMLDivElement>(null);
	const [dataUrl, setDataUrl] = useState<string | null>(null);
	const [failed, setFailed] = useState(false);
	const inFlight = useRef(false);

	useEffect(() => {
		const host = wrapRef.current;
		const src = sourceRef.current;
		if (!host || !src) return;

		let cancelled = false;
		setDataUrl(null);
		setFailed(false);

		const capture = async () => {
			if (inFlight.current) return;
			const hostW = Math.max(280, Math.floor(host.getBoundingClientRect().width));
			if (hostW < 280) return;

			inFlight.current = true;
			const prevCssText = src.style.cssText;
			const mask = document.createElement("div");
			mask.setAttribute("aria-hidden", "true");
			mask.style.cssText =
				"position:fixed;inset:0;z-index:2147482990;background:var(--vanta-bg, #e8edf5);";

			try {
				document.body.appendChild(mask);
				src.style.boxSizing = "border-box";
				src.style.position = "fixed";
				src.style.left = "0";
				src.style.top = "0";
				src.style.zIndex = "2147483000";
				src.style.pointerEvents = "none";
				src.style.width = `${hostW}px`;
				src.style.maxWidth = "100vw";
				src.style.opacity = "1";
				src.style.visibility = "visible";

				await document.fonts.ready.catch(() => undefined);
				await new Promise<void>((r) => requestAnimationFrame(() => r()));

				const wPx = Math.max(
					hostW,
					Math.ceil(src.scrollWidth || src.offsetWidth || src.clientWidth || hostW),
				);
				const hPx = Math.max(
					28,
					Math.ceil(src.scrollHeight || src.offsetHeight || src.clientHeight || 28),
				);

				const bg = resolvedSurfaceBackground();

				const data = await toPng(src, {
					width: wPx,
					height: hPx,
					pixelRatio: Math.min(2.25, Math.max(1.5, window.devicePixelRatio || 1.5)),
					cacheBust: true,
					filter: katexFilter,
					backgroundColor: bg,
				});
				if (!cancelled) {
					setDataUrl(data);
					setFailed(false);
				}
			} catch {
				if (!cancelled) setFailed(true);
			} finally {
				if (mask.parentNode) mask.parentNode.removeChild(mask);
				src.style.cssText = prevCssText;
				inFlight.current = false;
			}
		};

		let roTimer: number | undefined;
		const ro = new ResizeObserver(() => {
			if (roTimer) clearTimeout(roTimer);
			roTimer = window.setTimeout(() => void capture(), 90);
		});
		ro.observe(host);
		const t0 = window.setTimeout(() => void capture(), 50);

		return () => {
			cancelled = true;
			clearTimeout(t0);
			if (roTimer) clearTimeout(roTimer);
			ro.disconnect();
		};
	}, [syncKey]);

	const showImg = dataUrl && !failed;

	return (
		<div
			ref={wrapRef}
			className={`exam-katex-body relative w-full min-w-0 overflow-hidden rounded-sm ${className ?? ""}`}
		>
			<div
				ref={sourceRef}
				className="pointer-events-none absolute left-0 top-0 z-0 box-border w-full bg-[var(--vanta-surface)] p-0 font-sans text-[15px] leading-relaxed text-[var(--vanta-text)] antialiased opacity-0"
				aria-hidden
			>
				{children}
			</div>
			<div className="relative z-10 w-full min-w-0 rounded-sm bg-[var(--vanta-surface)]">
				{failed ? (
					<div className="select-text">{children}</div>
				) : showImg ? (
					<img
						src={dataUrl}
						alt={decorative ? "" : alt.slice(0, 450)}
						aria-hidden={decorative ? true : undefined}
						className="max-w-full self-start object-contain align-top select-none"
						draggable={false}
					/>
				) : (
					<div
						className="min-h-[2.25rem] w-full bg-[var(--vanta-surface-elevated)]"
						aria-busy
						aria-label="Rendering question"
					/>
				)}
			</div>
		</div>
	);
}
