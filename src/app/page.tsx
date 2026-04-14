import Link from "next/link";
import { VantaLogo } from "@/components/branding/VantaLogo";
import { SimpleIconBox, type SimpleIconId } from "@/components/icons/SimpleIconBox";

export default function HomePage() {
 return (
 <div className="min-h-screen bg-vanta-bg flex flex-col">
 {/* Header */}
 <header className="border-b border-vanta-border px-6 py-4 flex items-center justify-between">
 <Link
 href="/"
 className="flex items-center gap-2.5 group rounded-lg -m-1 p-1 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
 >
 <span className="rounded-lg p-1 ring-1 ring-sky-500/30 bg-vanta-surface-elevated shadow-glow transition-[box-shadow] duration-300 group-hover:ring-sky-400/50">
 <VantaLogo size={30} variant="command" />
 </span>
 <span className="font-display font-semibold text-lg tracking-wide text-vanta-text group-hover:text-sky-200 transition-colors">
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
 className="text-sm btn-shine bg-sky-500/20 hover:bg-sky-400/30 text-vanta-text border border-sky-400/50 px-4 py-2 rounded-lg font-medium"
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

 <h1 className="fade-up font-display text-4xl sm:text-5xl md:text-6xl font-bold text-vanta-text tracking-wide leading-tight max-w-3xl mb-6">
 Ace your{" "}
 <span className="text-sky-400">AP Exams</span>
 {" "}with VantaLearn
 </h1>

 <p className="fade-up text-lg text-vanta-muted max-w-xl mb-10 leading-relaxed">
 Flashcards, practice exams, and instant AI feedback - all in one focused, distraction-free study environment built for high school students.
 </p>

 <div className="fade-up flex flex-col sm:flex-row gap-3">
 <Link
 href="/auth/signup"
 className="inline-flex items-center justify-center gap-2 bg-sky-500/20 hover:bg-sky-400/30 text-vanta-text border border-sky-400/50 px-8 py-3.5 rounded-lg font-semibold text-base btn-shine"
 >
 <span>Start Studying Free</span>
 <span aria-hidden className="font-normal opacity-90">
 →
 </span>
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
 {(
 [
 { icon: "cards" as SimpleIconId, title: "Flashcards", desc: "3D flip cards with swipe gestures for spaced repetition" },
 { icon: "document" as SimpleIconId, title: "Practice Exams", desc: "Real AP & SAT questions with instant scoring" },
 { icon: "spark" as SimpleIconId, title: "AI Feedback", desc: "GPT-4o-mini explains every answer and gives study tips" },
 { icon: "clock" as SimpleIconId, title: "Exam Countdown", desc: "Track days remaining to your exams at a glance" },
 ] as const
 ).map((f) => (
 <div
 key={f.title}
 className="fade-up bg-vanta-surface border border-vanta-border rounded-card p-5 hover:border-vanta-blue/35 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
 >
 <div className="mb-3" aria-hidden>
 <SimpleIconBox name={f.icon} size={40} />
 </div>
 <h3 className="text-vanta-text font-semibold mb-1">{f.title}</h3>
 <p className="text-vanta-muted text-sm leading-relaxed">{f.desc}</p>
 </div>
 ))}
 </div>
 </section>

 <footer className="border-t border-vanta-border px-6 py-6 text-center text-vanta-muted text-sm">
 (c) {new Date().getFullYear()} VantaLearn. Made for students, by students.
 </footer>
 </div>
 );
}
