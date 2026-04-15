"use client";

import { SimpleIconBox } from "@/components/icons/SimpleIconBox";

export function ProceduralPracticeCtaBanner({ onStart }: { onStart: () => void }) {
  return (
    <div className="mb-8 rounded-2xl border border-vanta-border bg-vanta-surface shadow-card px-4 py-4 sm:px-6 sm:py-5 flex flex-wrap items-center justify-between gap-4 fade-up transition-shadow duration-300 hover:shadow-card-hover hover:border-sky-500/25">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <span
          className="shrink-0 rounded-xl bg-vanta-surface-elevated p-2.5 ring-1 ring-sky-500/20 shadow-sm"
          aria-hidden
        >
          <SimpleIconBox name="document" size={36} />
        </span>
        <p className="font-display font-bold text-vanta-text text-base sm:text-lg tracking-tight leading-snug">
          Multiple choice practice questions
        </p>
      </div>
      <button
        type="button"
        onClick={onStart}
        className="shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-sm sm:text-base font-semibold px-5 sm:px-6 py-2.5 sm:py-3 border border-sky-700/25 shadow-md shadow-sky-600/20 transition-all duration-200 hover:shadow-lg hover:shadow-sky-600/25 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-vanta-surface"
      >
        Start practice
        <span aria-hidden className="font-normal opacity-95">
          →
        </span>
      </button>
    </div>
  );
}
