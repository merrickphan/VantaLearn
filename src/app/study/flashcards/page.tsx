"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { SAMPLE_RESOURCES } from "@/lib/utils/sampleData";
import { FlashcardContent, FlashcardItem } from "@/types";
import { useFlashcardProgress } from "@/hooks/useProgress";
import { Button, Card, ProgressBar, Badge } from "@/components/ui";
import Link from "next/link";

function FlashcardPlayer() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const resource = SAMPLE_RESOURCES.find((r) => r.id === id && r.type === "flashcard_set");

  if (!resource) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <p className="text-vanta-muted mb-4">Deck not found.</p>
        <Link href="/study"><Button variant="secondary">Back to Library</Button></Link>
      </div>
    );
  }

  const { cards } = resource.content_data as FlashcardContent;
  return <FlashcardGame cards={cards} title={resource.title} />;
}

function FlashcardGame({ cards, title }: { cards: FlashcardItem[]; title: string }) {
  const { currentIndex, isFlipped, statuses, markCard, flip, stats } = useFlashcardProgress(cards.length);
  const card = cards[currentIndex];
  const isLastCard = currentIndex === cards.length - 1;
  const isDone = stats.isComplete || (isLastCard && statuses[card?.id]);

  if (isDone) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center fade-up">
        <div className="text-5xl mb-6">🎉</div>
        <h2 className="text-2xl font-bold text-vanta-text mb-2">Deck Complete!</h2>
        <p className="text-vanta-muted mb-8">{title}</p>
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-vanta-success">{stats.gotItCount}</p>
              <p className="text-xs text-vanta-muted">Got It</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-vanta-blue">{stats.retentionRate}%</p>
              <p className="text-xs text-vanta-muted">Retention</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-vanta-error">{stats.needsReviewCount}</p>
              <p className="text-xs text-vanta-muted">Review</p>
            </div>
          </div>
        </Card>
        <div className="flex gap-3 justify-center">
          <Link href="/study"><Button variant="secondary">Library</Button></Link>
          <Button onClick={() => window.location.reload()}>Study Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/study" className="text-xs text-vanta-muted hover:text-vanta-blue transition-colors">← Library</Link>
          <h1 className="text-vanta-text font-semibold mt-0.5">{title}</h1>
        </div>
        <div className="flex gap-2 items-center">
          <Badge variant="blue">{currentIndex + 1}/{cards.length}</Badge>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-2 mb-2">
        <span className="text-xs text-vanta-success">{stats.gotItCount} ✓</span>
        <span className="text-xs text-vanta-error">{stats.needsReviewCount} ✗</span>
        <span className="text-xs text-vanta-muted ml-auto">{stats.unseenCount} left</span>
      </div>
      <ProgressBar value={(currentIndex / cards.length) * 100} className="mb-8" />

      {/* Flashcard */}
      <div className="perspective mb-6" style={{ height: "300px" }}>
        <div className={`card-inner ${isFlipped ? "flipped" : ""}`} onClick={flip}>
          {/* Front */}
          <div className="card-face bg-vanta-surface border border-vanta-border rounded-card shadow-card cursor-pointer flex flex-col items-center justify-center p-8 text-center select-none hover:border-vanta-blue/30 transition-colors">
            <p className="text-xs text-vanta-muted uppercase tracking-wider mb-4">Question</p>
            <p className="text-vanta-text text-lg font-medium leading-relaxed">{card.front}</p>
            <p className="text-vanta-muted text-xs mt-6">Tap to reveal answer</p>
          </div>

          {/* Back */}
          <div className="card-back card-face bg-vanta-surface border border-vanta-blue/40 rounded-card shadow-card flex flex-col items-center justify-center p-8 text-center select-none">
            <p className="text-xs text-vanta-blue uppercase tracking-wider mb-4">Answer</p>
            <p className="text-vanta-text leading-relaxed whitespace-pre-line">{card.back}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      {!isFlipped ? (
        <div className="flex justify-center">
          <Button onClick={flip} size="lg">Reveal Answer</Button>
        </div>
      ) : (
        <div className="flex gap-3">
          <Button
            variant="danger"
            size="lg"
            className="flex-1"
            onClick={() => markCard(card.id, "needs_review")}
          >
            ✗ Needs Review
          </Button>
          <Button
            size="lg"
            className="flex-1 !bg-emerald-200 hover:!bg-emerald-300 !text-slate-950 border border-emerald-400/50"
            onClick={() => markCard(card.id, "got_it")}
          >
            ✓ Got It
          </Button>
        </div>
      )}
    </div>
  );
}

export default function FlashcardsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-2 border-vanta-border border-t-vanta-blue rounded-full animate-spin" /></div>}>
      <FlashcardPlayer />
    </Suspense>
  );
}
