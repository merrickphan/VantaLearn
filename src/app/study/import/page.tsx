import Link from "next/link";
import { Button, Card } from "@/components/ui";

export default function ImportSetsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8 fade-up">
        <Link href="/study" className="text-xs text-vanta-muted hover:text-sky-400">
          ← Practice library
        </Link>
        <h1 className="font-display text-2xl font-bold text-vanta-text mt-3">Import sets</h1>
        <p className="text-vanta-muted text-sm mt-2 leading-relaxed">
          Bring flashcard sets from other apps so everything lives in one library. Import by file (CSV / text) and deck merging is on
          the roadmap.
        </p>
      </div>

      <Card className="p-8 rounded-3xl border-sky-500/20 bg-sky-500/5">
        <p className="text-sm text-vanta-text mb-4">
          For now, use the built-in sample decks in the practice library, or ask your teacher for a shared export when we enable
          imports.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/study">
            <Button variant="secondary">Back to library</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
