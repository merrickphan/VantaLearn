import Link from "next/link";
import { VantaLogo } from "@/components/branding/VantaLogo";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-vanta-bg flex flex-col">
      {/* Header */}
      <header className="border-b border-vanta-border px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 group rounded-lg -m-1 p-1 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="rounded-lg p-1 ring-1 ring-vanta-border bg-white shadow-inner shadow-slate-900/5 transition-[box-shadow,ring-color] duration-300 group-hover:ring-vanta-blue/35 group-hover:shadow-[0_0_24px_rgba(37,99,235,0.12)]">
            <VantaLogo size={30} />
          </span>
          <span className="font-semibold text-lg tracking-tight text-slate-950 group-hover:text-slate-800 transition-colors">
            VantaLearn
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm text-vanta-muted hover:text-vanta-text transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="text-sm btn-shine bg-sky-200 hover:bg-sky-300 text-slate-950 border border-sky-400/50 px-4 py-2 rounded-lg font-medium shadow-sm shadow-slate-900/10"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 stagger">
        <div className="fade-up inline-flex items-center gap-2 bg-vanta-blue/10 border border-vanta-blue/20 rounded-full px-4 py-1.5 text-sm text-vanta-blue mb-8">
          <span className="w-2 h-2 bg-vanta-blue rounded-full animate-pulse" />
          Free for all students
        </div>

        <h1 className="fade-up text-4xl sm:text-5xl md:text-6xl font-bold text-vanta-text leading-tight max-w-3xl mb-6">
          Ace your{" "}
          <span className="text-vanta-blue">AP & SAT</span>{" "}
          exams with AI
        </h1>

        <p className="fade-up text-lg text-vanta-muted max-w-xl mb-10 leading-relaxed">
          Flashcards, practice exams, and instant AI feedback — all in one focused, distraction-free study environment built for high school students.
        </p>

        <div className="fade-up flex flex-col sm:flex-row gap-3">
          <Link
            href="/auth/signup"
            className="bg-sky-200 hover:bg-sky-300 text-slate-950 border border-sky-400/50 px-8 py-3.5 rounded-lg font-semibold text-base btn-shine shadow-md shadow-slate-900/10 hover:shadow-slate-900/15"
          >
            Start Studying Free →
          </Link>
          <Link
            href="/auth/login"
            className="bg-transparent border border-vanta-border hover:border-vanta-blue/60 text-vanta-text hover:text-vanta-blue px-8 py-3.5 rounded-lg font-semibold text-base btn-shine btn-shine-outline transition-colors hover:bg-vanta-blue-muted/30"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-20 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 stagger">
          {[
            { icon: "🃏", title: "Flashcards", desc: "3D flip cards with swipe gestures for spaced repetition" },
            { icon: "📝", title: "Practice Exams", desc: "Real AP & SAT questions with instant scoring" },
            { icon: "🤖", title: "AI Feedback", desc: "GPT-4o-mini explains every answer and gives study tips" },
            { icon: "⏱️", title: "Exam Countdown", desc: "Track days remaining to your exams at a glance" },
          ].map((f) => (
            <div
              key={f.title}
              className="fade-up bg-vanta-surface border border-vanta-border rounded-card p-5 hover:border-vanta-blue/35 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="text-vanta-text font-semibold mb-1">{f.title}</h3>
              <p className="text-vanta-muted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-vanta-border px-6 py-6 text-center text-vanta-muted text-sm">
        © {new Date().getFullYear()} VantaLearn. Made for students, by students.
      </footer>
    </div>
  );
}
