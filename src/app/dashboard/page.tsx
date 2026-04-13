"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui";
import { SAMPLE_RESOURCES } from "@/lib/utils/sampleData";
import { AP_COURSES } from "@/lib/apCatalog";
import { useCountdown } from "@/hooks/useTimer";
import { loadCmdStats, type CommandCenterStats } from "@/lib/cmdStats";

function SubjectCard({
  icon,
  name,
  short,
  examDate,
}: {
  icon: string;
  name: string;
  short: string;
  examDate: string;
}) {
  const { days, hours, minutes } = useCountdown(examDate);
  const done = days <= 0 && hours <= 0 && minutes <= 0;
  const timerLabel = done ? "Exam window" : `${days}d ${hours}h ${minutes}m`;

  return (
    <Link href={`/study?subject=${encodeURIComponent(name)}`}>
      <Card
        hover
        className="p-4 h-full border-vanta-border/80 bg-vanta-surface/60 hover:border-sky-500/30 hover:bg-vanta-surface-hover transition-all"
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-xl">{icon}</span>
          <span className="text-[10px] font-mono text-sky-400/80 tabular-nums shrink-0">{timerLabel}</span>
        </div>
        <h3 className="text-sm font-semibold text-vanta-text leading-snug mb-1">{name}</h3>
        <p className="text-[11px] text-vanta-muted leading-relaxed line-clamp-2">{short}</p>
      </Card>
    </Link>
  );
}

export default function DashboardPage() {
  const [userName, setUserName] = useState("");
  const [cmdStats, setCmdStats] = useState<CommandCenterStats | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserName(data.user.user_metadata?.full_name?.split(" ")[0] || "Student");
      }
    });
    setCmdStats(loadCmdStats());
  }, []);

  const practiceExams = SAMPLE_RESOURCES.filter((r) => r.type === "practice_exam");
  const attempts = cmdStats?.attempts ?? 0;
  const correct = cmdStats?.correct ?? 0;
  const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;
  const subjectsPracticed = cmdStats?.subjectsPracticed?.length ?? 0;
  const streak = cmdStats?.streak ?? 0;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
      <section className="mb-10 fade-up flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div>
          <p className="text-[10px] text-sky-400 uppercase tracking-[0.2em] font-semibold mb-2">Command center</p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-vanta-text tracking-wide">
            Your AP command center
          </h1>
          <p className="text-vanta-muted text-sm mt-2 max-w-xl">
            CB-style practice • Live countdowns • Score predictor • Analytics — {userName ? `${userName}, ` : ""}
            stay exam-ready.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 lg:gap-10 font-display">
          <div className="text-right">
            <p className="text-2xl sm:text-3xl font-bold text-sky-400 tabular-nums">{AP_COURSES.length}</p>
            <p className="text-[10px] text-vanta-muted uppercase tracking-widest">Subjects</p>
          </div>
          <div className="text-right">
            <p className="text-2xl sm:text-3xl font-bold text-vanta-text tabular-nums">{attempts}</p>
            <p className="text-[10px] text-vanta-muted uppercase tracking-widest">Attempts</p>
          </div>
          <div className="text-right">
            <p className="text-2xl sm:text-3xl font-bold text-emerald-400 tabular-nums">{attempts ? `${accuracy}%` : "—"}</p>
            <p className="text-[10px] text-vanta-muted uppercase tracking-widest">Accuracy</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10 stagger">
        <Card className="p-4 border-vanta-border bg-vanta-surface/50">
          <p className="text-lg mb-1">📋</p>
          <p className="text-2xl font-display font-bold text-vanta-text">{attempts}</p>
          <p className="text-[11px] text-vanta-muted uppercase tracking-wider">Total attempts</p>
        </Card>
        <Card className="p-4 border-vanta-border bg-vanta-surface/50">
          <p className="text-lg mb-1">✅</p>
          <p className="text-2xl font-display font-bold text-emerald-400">{correct}</p>
          <p className="text-[11px] text-vanta-muted uppercase tracking-wider">Correct answers</p>
        </Card>
        <Card className="p-4 border-vanta-border bg-vanta-surface/50">
          <p className="text-lg mb-1">📚</p>
          <p className="text-2xl font-display font-bold text-sky-400">{subjectsPracticed}</p>
          <p className="text-[11px] text-vanta-muted uppercase tracking-wider">Subjects practiced</p>
        </Card>
        <Card className="p-4 border-vanta-border bg-vanta-surface/50">
          <p className="text-lg mb-1">🔥</p>
          <p className="text-2xl font-display font-bold text-amber-400">{streak}</p>
          <p className="text-[11px] text-vanta-muted uppercase tracking-wider">Strong-exam streak</p>
        </Card>
      </section>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-vanta-muted uppercase tracking-widest">All AP exams</h2>
          <Link href="/study" className="text-xs text-sky-400 hover:underline">
            Open practice library →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {AP_COURSES.map((c) => (
            <SubjectCard key={c.id} icon={c.icon} name={c.name} short={c.short} examDate={c.examDate} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold text-vanta-muted uppercase tracking-widest mb-3">Featured practice sets</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {practiceExams.slice(0, 6).map((exam) => {
            const n = (exam.content_data as { questions: unknown[] }).questions.length;
            return (
              <Link key={exam.id} href={`/study/exam?id=${exam.id}`}>
                <Card hover className="p-4 h-full border-vanta-border/80">
                  <p className="text-xs text-sky-400 font-medium mb-1">{exam.subject}</p>
                  <p className="text-sm font-semibold text-vanta-text">{exam.title}</p>
                  <p className="text-[11px] text-vanta-muted mt-2">{n} questions · MC & figures where noted</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
