"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, Badge, ProgressBar } from "@/components/ui";
import { useCountdown } from "@/hooks/useTimer";
import { SAMPLE_RESOURCES } from "@/lib/utils/sampleData";
import { formatDate } from "@/lib/utils";

interface ExamTimer {
  exam_name: string;
  target_date: string;
}

function CountdownWidget({ timer }: { timer: ExamTimer }) {
  const { days, hours, minutes } = useCountdown(timer.target_date);
  const isPast = days <= 0 && hours <= 0;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-vanta-muted font-medium uppercase tracking-wider mb-1">Exam Countdown</p>
          <h3 className="text-vanta-text font-semibold">{timer.exam_name}</h3>
          <p className="text-xs text-vanta-muted mt-0.5">{formatDate(timer.target_date)}</p>
        </div>
        {isPast ? (
          <Badge variant="gray">Past</Badge>
        ) : days <= 14 ? (
          <Badge variant="red">Soon</Badge>
        ) : (
          <Badge variant="blue">Upcoming</Badge>
        )}
      </div>

      {isPast ? (
        <p className="text-vanta-muted text-sm">Exam date has passed. Good luck with your results!</p>
      ) : (
        <div className="flex gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-vanta-blue">{days}</p>
            <p className="text-xs text-vanta-muted">days</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-vanta-text">{hours}</p>
            <p className="text-xs text-vanta-muted">hrs</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-vanta-text">{minutes}</p>
            <p className="text-xs text-vanta-muted">min</p>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function DashboardPage() {
  const [userName, setUserName] = useState("");
  const [examTimers, setExamTimers] = useState<ExamTimer[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserName(data.user.user_metadata?.full_name?.split(" ")[0] || "Student");
      }
    });

    // Load exam timers from localStorage (set during onboarding)
    try {
      const stored = localStorage.getItem("vanta_exam_timers");
      if (stored) {
        const parsed = JSON.parse(stored) as ExamTimer[];
        setExamTimers(parsed.filter((t) => t.target_date));
      }
    } catch {}
  }, []);

  const quickActions = [
    { href: "/study/flashcards", icon: "🃏", label: "Flashcards", desc: "Flip & review cards" },
    { href: "/study/exam", icon: "📝", label: "Practice Exam", desc: "Test your knowledge" },
    { href: "/study/tips", icon: "🤖", label: "AI Study Tips", desc: "Get personalized tips" },
    { href: "/dashboard/score-calculator", icon: "🧮", label: "Score Calculator", desc: "Estimate your score" },
  ];

  const flashcardSets = SAMPLE_RESOURCES.filter((r) => r.type === "flashcard_set");
  const practiceExams = SAMPLE_RESOURCES.filter((r) => r.type === "practice_exam");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Greeting */}
      <div className="mb-8 fade-up">
        <h1 className="text-2xl sm:text-3xl font-bold text-vanta-text">
          {userName ? `Welcome back, ${userName} 👋` : "Welcome back 👋"}
        </h1>
        <p className="text-vanta-muted mt-1 text-sm">Ready to study? Pick up where you left off.</p>
      </div>

      {/* Countdown timers */}
      {examTimers.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-vanta-muted uppercase tracking-wider mb-3">
            Exam Countdowns
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
            {examTimers.slice(0, 3).map((timer) => (
              <CountdownWidget key={timer.exam_name} timer={timer} />
            ))}
          </div>
        </section>
      )}

      {examTimers.length === 0 && (
        <Card className="p-5 mb-8 border-dashed">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-vanta-text font-medium">No exam timers set</p>
              <p className="text-vanta-muted text-sm">Add your upcoming AP/SAT dates to track your countdown</p>
            </div>
            <Link href="/dashboard/settings" className="text-vanta-blue text-sm hover:underline whitespace-nowrap">
              Add exams →
            </Link>
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-vanta-muted uppercase tracking-wider mb-3">Study Tools</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 stagger">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card hover className="p-4 text-center h-full">
                <div className="text-2xl mb-2">{action.icon}</div>
                <p className="text-vanta-text text-sm font-semibold">{action.label}</p>
                <p className="text-vanta-muted text-xs mt-0.5 hidden sm:block">{action.desc}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Available Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Flashcard Decks */}
        <section>
          <h2 className="text-sm font-semibold text-vanta-muted uppercase tracking-wider mb-3">Flashcard Decks</h2>
          <div className="space-y-3 stagger">
            {flashcardSets.map((set) => {
              const cards = (set.content_data as { cards: unknown[] }).cards;
              return (
                <Link key={set.id} href={`/study/flashcards?id=${set.id}`}>
                  <Card hover className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-vanta-text text-sm font-medium">{set.title}</span>
                      <Badge variant="blue">{cards.length} cards</Badge>
                    </div>
                    <p className="text-vanta-muted text-xs">{set.subject}</p>
                    <ProgressBar value={0} className="mt-2" />
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Practice Exams */}
        <section>
          <h2 className="text-sm font-semibold text-vanta-muted uppercase tracking-wider mb-3">Practice Exams</h2>
          <div className="space-y-3 stagger">
            {practiceExams.map((exam) => {
              const questions = (exam.content_data as { questions: unknown[]; time_limit_minutes?: number }).questions;
              return (
                <Link key={exam.id} href={`/study/exam?id=${exam.id}`}>
                  <Card hover className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-vanta-text text-sm font-medium">{exam.title}</span>
                      <Badge variant="gray">{questions.length} Qs</Badge>
                    </div>
                    <p className="text-vanta-muted text-xs">{exam.subject}</p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
