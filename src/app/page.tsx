import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-vanta-bg flex flex-col">
      {/* Header */}
      <header className="border-b border-vanta-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-vanta-blue rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className="text-vanta-text font-semibold text-lg tracking-tight">VantaLearn</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm text-vanta-muted hover:text-vanta-text transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="text-sm bg-vanta-blue hover:bg-vanta-blue-hover text-white px-4 py-2 rounded-lg transition-colors font-medium"
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
            className="bg-vanta-blue hover:bg-vanta-blue-hover text-white px-8 py-3.5 rounded-lg font-semibold text-base transition-colors"
          >
            Start Studying Free →
          </Link>
          <Link
            href="/auth/login"
            className="bg-transparent border border-vanta-border hover:border-vanta-blue text-vanta-text hover:text-vanta-blue px-8 py-3.5 rounded-lg font-semibold text-base transition-colors"
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
            <div key={f.title} className="fade-up bg-vanta-surface border border-vanta-border rounded-card p-5 hover:border-vanta-blue/30 transition-colors">
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
