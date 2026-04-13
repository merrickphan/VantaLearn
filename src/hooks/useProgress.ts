"use client";

import { useState, useCallback } from "react";
import { FlashcardStatus } from "@/types";

export function useFlashcardProgress(totalCards: number) {
  const [statuses, setStatuses] = useState<Record<string, FlashcardStatus>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const markCard = useCallback((cardId: string, status: FlashcardStatus) => {
    setStatuses((prev) => ({ ...prev, [cardId]: status }));
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((i) => Math.min(i + 1, totalCards - 1)), 300);
  }, [totalCards]);

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsFlipped(false);
  }, []);

  const flip = useCallback(() => setIsFlipped((f) => !f), []);

  const gotItCount = Object.values(statuses).filter((s) => s === "got_it").length;
  const needsReviewCount = Object.values(statuses).filter((s) => s === "needs_review").length;
  const unseenCount = totalCards - gotItCount - needsReviewCount;
  const retentionRate = totalCards > 0 ? Math.round((gotItCount / totalCards) * 100) : 0;
  const isComplete = currentIndex >= totalCards - 1 && Object.keys(statuses).length > 0;

  return {
    currentIndex,
    isFlipped,
    statuses,
    markCard,
    goTo,
    flip,
    stats: { gotItCount, needsReviewCount, unseenCount, retentionRate, isComplete },
  };
}

export function useExamProgress(totalQuestions: number) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const answerQuestion = useCallback((questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }, []);

  const next = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, totalQuestions - 1));
  }, [totalQuestions]);

  const prev = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, []);

  const submit = useCallback(() => setSubmitted(true), []);

  const answeredCount = Object.keys(answers).length;
  const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  return {
    currentIndex,
    answers,
    submitted,
    answerQuestion,
    next,
    prev,
    submit,
    stats: { answeredCount, progress },
  };
}
