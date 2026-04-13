"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui";
import { SAMPLE_RESOURCES } from "@/lib/utils/sampleData";
import { AP_COURSES } from "@/lib/apCatalog";
import { useCountdown } from "@/hooks/useTimer";
import { loadCmdStats, type CommandCenterStats } from "@/lib/cmdStats";
import { SimpleIconBox, type SimpleIconId } from "@/components/icons/SimpleIconBox";

function SubjectCard({
  icon,
  name,
  short,
  examDate,
}: {
  icon: SimpleIconId;
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
        className="p-6 h-full border-vanta-border/80 bg-vanta-surface/60 hover:border-sky-500/30 hover:bg-vanta-surface-hover transition-all"
      >
        <div className="flex items-start justify-between gap-2 mb-4">
          <span aria-hidden>
            <SimpleIconBox name={icon} size={40} />
          </span>
          <span className="text-xs font-mono tabular-nums shrink-0 rounded-md px-2 py-1 bg-slate-200 text-slate-900">
            {timerLabel}
          </span>
        </div>
        <h3 className="text-base font-semibold text-vanta-text leading-snug mb-2">{name}</h3>
        <p className="text-sm text-vanta-muted leading-relaxed line-clamp-3">{short}</p>
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
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 md:py-12">
      <section className="mb-12 fade-up flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
        <div>
          <p className="text-xs text-sky-400 uppercase tracking-[0.2em] font-semibold mb-3">Command center</p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-vanta-text tracking-wide">
            Your AP command center
          </h1>
          <p className="text-vanta-muted text-lg mt-3 max-w-xl">
            CB-style practice • Live countdowns • Score predictor • Analytics — {userName ? `${userName}, ` : ""}
            stay exam-ready.
          </p>
        </div>
        <div className="flex flex-wrap gap-8 lg:gap-12 font-display">
          <div className="text-right">
            <p className="text-3xl sm:text-4xl font-bold text-sky-400 tabular-nums">{AP_COURSES.length}</p>
            <p className="text-xs text-vanta-muted uppercase tracking-widest">Subjects</p>
          </div>
          <div className="text-right">
            <p className="text-3xl sm:text-4xl font-bold text-vanta-text tabular-nums">{attempts}</p>
            <p className="text-xs text-vanta-muted uppercase tracking-widest">Attempts</p>
          </div>
          <div className="text-right">
            <p className="text-3xl sm:text-4xl font-bold text-emerald-400 tabular-nums">{attempts ? `${accuracy}%` : "—"}</p>
            <p className="text-xs text-vanta-muted uppercase tracking-widest">Accuracy</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-12 stagger">
        <Card className="p-6 border-vanta-border bg-vanta-surface/50">
          <span className="mb-3 inline-block" aria-hidden>
            <SimpleIconBox name="clipboard" size={36} />
          </span>
          <p className="text-3xl font-display font-bold text-vanta-text">{attempts}</p>
          <p className="text-sm text-vanta-muted uppercase tracking-wider">Total attempts</p>
        </Card>
        <Card className="p-6 border-vanta-border bg-vanta-surface/50">
          <span className="mb-3 inline-block" aria-hidden>
            <SimpleIconBox name="check" size={36} />
          </span>
          <p className="text-3xl font-display font-bold text-emerald-400">{correct}</p>
          <p className="text-sm text-vanta-muted uppercase tracking-wider">Correct answers</p>
        </Card>
        <Card className="p-6 border-vanta-border bg-vanta-surface/50">
          <span className="mb-3 inline-block" aria-hidden>
            <SimpleIconBox name="book" size={36} />
          </span>
          <p className="text-3xl font-display font-bold text-sky-400">{subjectsPracticed}</p>
          <p className="text-sm text-vanta-muted uppercase tracking-wider">Subjects practiced</p>
        </Card>
        <Card className="p-6 border-vanta-border bg-vanta-surface/50">
          <span className="mb-3 inline-block" aria-hidden>
            <SimpleIconBox name="flame" size={36} />
          </span>
          <p className="text-3xl font-display font-bold text-amber-400">{streak}</p>
          <p className="text-sm text-vanta-muted uppercase tracking-wider">Strong-exam streak</p>
        </Card>
      </section>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-vanta-muted uppercase tracking-widest">All AP exams</h2>
          <Link href="/study" className="text-sm text-sky-400 hover:underline">
            Open practice library →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {AP_COURSES.map((c) => (
            <SubjectCard key={c.id} icon={c.icon} name={c.name} short={c.short} examDate={c.examDate} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-vanta-muted uppercase tracking-widest mb-4">Featured practice sets</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {practiceExams.slice(0, 6).map((exam) => {
            const n = (exam.content_data as { questions: unknown[] }).questions.length;
            return (
              <Link key={exam.id} href={`/study/exam?id=${exam.id}`}>
                <Card hover className="p-6 h-full border-vanta-border/80">
                  <p className="text-sm text-sky-400 font-medium mb-2">{exam.subject}</p>
                  <p className="text-lg font-semibold text-vanta-text">{exam.title}</p>
                  <p className="text-sm text-vanta-muted mt-3">{n} questions · MC & figures where noted</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
