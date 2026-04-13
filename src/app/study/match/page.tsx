import Link from "next/link";
import { Button, Card } from "@/components/ui";

export default function MatchGamePage() {
 return (
 <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
 <div className="mb-8 fade-up">
 <Link href="/study" className="text-xs text-vanta-muted hover:text-sky-400">
 Back: Practice library
 </Link>
 <h1 className="font-display text-2xl font-bold text-vanta-text mt-3">Match</h1>
 <p className="text-vanta-muted text-sm mt-2 leading-relaxed">
 A fast pairing game: match terms to definitions before time runs out. We&apos;re building this mode next - for now, use
 flashcards for active recall.
 </p>
 </div>

 <Card className="p-8 rounded-3xl border-amber-500/20 bg-amber-500/5 text-center">
 <p className="text-4xl mb-3" aria-hidden>
 
 </p>
 <p className="text-vanta-text font-medium mb-4">Match mode is coming soon</p>
 <Link href="/study/flashcards">
 <Button>Study with flashcards</Button>
 </Link>
 </Card>
 </div>
 );
}
