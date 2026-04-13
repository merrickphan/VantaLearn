"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { listSubjectSearchHits, type SubjectSearchHit } from "@/lib/subjectSearch";

function filterHits(query: string, hits: SubjectSearchHit[]): SubjectSearchHit[] {
	const q = query.trim().toLowerCase();
	if (!q) return [];
	return hits.filter(
		(h) =>
			h.name.toLowerCase().includes(q) ||
			h.short.toLowerCase().includes(q) ||
			h.name.toLowerCase().replace(/®/g, "").includes(q.replace(/®/g, "")),
	);
}

export function SubjectSearchBar() {
	const router = useRouter();
	const hits = useMemo(() => listSubjectSearchHits(), []);
	const [query, setQuery] = useState("");
	const [open, setOpen] = useState(false);
	const [activeIdx, setActiveIdx] = useState(0);
	const rootRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const results = useMemo(() => filterHits(query, hits).slice(0, 12), [query, hits]);

	useEffect(() => {
		setActiveIdx(0);
	}, [query, results.length]);

	useEffect(() => {
		if (!open) return;
		const onDoc = (e: MouseEvent) => {
			if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
		};
		document.addEventListener("mousedown", onDoc);
		return () => document.removeEventListener("mousedown", onDoc);
	}, [open]);

	const onKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (!open && (e.key === "ArrowDown" || e.key === "Enter") && query.trim()) {
				setOpen(true);
				return;
			}
			if (!open) return;
			if (e.key === "Escape") {
				setOpen(false);
				return;
			}
			if (e.key === "ArrowDown") {
				e.preventDefault();
				setActiveIdx((i) => Math.min(i + 1, Math.max(0, results.length - 1)));
			}
			if (e.key === "ArrowUp") {
				e.preventDefault();
				setActiveIdx((i) => Math.max(i - 1, 0));
			}
			if (e.key === "Enter" && results[activeIdx]) {
				e.preventDefault();
				router.push(results[activeIdx].href);
			}
		},
		[open, query, results, activeIdx, router],
	);

	return (
		<div ref={rootRef} className="relative w-full">
			<input
				ref={inputRef}
				type="search"
				value={query}
				onChange={(e) => {
					setQuery(e.target.value);
					setOpen(true);
				}}
				onFocus={() => setOpen(true)}
				onKeyDown={onKeyDown}
				placeholder="Search subjects…"
				className="w-full bg-vanta-surface-elevated border border-vanta-border rounded-xl py-2.5 pl-10 pr-4 text-sm text-vanta-text placeholder:text-vanta-muted/60 focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 focus:outline-none transition-shadow"
				aria-label="Search subjects"
				aria-expanded={open}
				aria-controls="subject-search-results"
				autoComplete="off"
				spellCheck={false}
			/>
			<svg
				className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-vanta-muted pointer-events-none"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				aria-hidden
			>
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
			</svg>

			{open && query.trim() ? (
				<div
					id="subject-search-results"
					role="listbox"
					className="absolute z-50 mt-1.5 w-full min-w-[240px] max-h-72 overflow-auto rounded-xl border border-vanta-border bg-vanta-surface shadow-card py-1"
				>
					{results.length === 0 ? (
						<p className="px-4 py-3 text-sm text-vanta-muted">No matching subjects.</p>
					) : (
						results.map((hit, idx) => (
							<Link
								key={hit.name}
								href={hit.href}
								role="option"
								aria-selected={idx === activeIdx}
								className={`block px-4 py-2.5 text-left text-sm transition-colors border-b border-vanta-border/50 last:border-0 ${
									idx === activeIdx ? "bg-sky-500/15 text-sky-400" : "text-vanta-text hover:bg-vanta-surface-hover"
								}`}
								onMouseEnter={() => setActiveIdx(idx)}
								onClick={() => {
									setOpen(false);
									setQuery("");
								}}
							>
								<span className="font-medium block leading-snug">{hit.name}</span>
								<span className="text-xs text-vanta-muted line-clamp-1">{hit.short}</span>
							</Link>
						))
					)}
				</div>
			) : null}
		</div>
	);
}
