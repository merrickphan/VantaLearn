import Link from "next/link";
import { Button, Card } from "@/components/ui";

export default function LearnModePage() {
 return (
 <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
 <div className="mb-8 fade-up">
 <Link href="/study" className="text-xs text-vanta-muted hover:text-sky-400">
 Back: Practice library
 </Link>
 <h1 className="font-display text-2xl font-bold text-vanta-text mt-3">Learn mode</h1>
 <p className="text-vanta-muted text-sm mt-2 leading-relaxed">
 Learn mode pairs flashcards with <strong className="text-vanta-text">spaced repetition</strong>: cards you struggle with come
 back sooner; easy cards wait longer. Open any deck and use{" "}
 <span className="text-emerald-400">Got it</span> / <span className="text-amber-400">Review</span> to train the schedule.
 </p>
 </div>

 <Card className="p-6 rounded-3xl border-white/10 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 mb-6">
 <p className="text-sm text-vanta-text mb-4">Start with a sample deck or pick from the library.</p>
 <div className="flex flex-wrap gap-3">
 <Link href="/study/flashcards">
 <Button>Open flashcards</Button>
 </Link>
 <Link href="/study">
 <Button variant="secondary">Browse library</Button>
 </Link>
 </div>
 </Card>

 <p className="text-xs text-vanta-muted leading-relaxed">
 {"Tip: same idea as popular 'Learn' flows - mark honesty on each card so reviews stay efficient."}
 </p>
 </div>
 );
}
