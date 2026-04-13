"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui";
import Link from "next/link";

const trendData = [
  { attempt: 1, score: 42, projected: 42 },
  { attempt: 2, score: 48, projected: 50 },
  { attempt: 3, score: 55, projected: 58 },
  { attempt: 4, score: 61, projected: 67 },
  { attempt: 5, score: 68, projected: 74 },
  { attempt: 6, score: null, projected: 79 },
  { attempt: 7, score: null, projected: 83 },
  { attempt: 8, score: null, projected: 86 },
];

export default function PredictorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8 fade-up">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-vanta-text tracking-wide">
          Score predictor
        </h1>
        <p className="text-vanta-muted text-sm mt-1">
          CB-style trajectory — modeled from practice accuracy (sample curve). Log more attempts in{" "}
          <Link href="/study" className="text-sky-400 hover:underline">
            Practice
          </Link>{" "}
          to refine estimates.
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="p-6 border-sky-500/20">
          <h2 className="text-xs font-semibold text-vanta-muted uppercase tracking-wider mb-4">
            Projected AP-style mastery (%)
          </h2>
          <div className="h-72 w-full min-h-[288px] min-w-0">
            <ResponsiveContainer width="100%" height="100%" minHeight={288}>
              <AreaChart data={trendData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="projFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="attempt" stroke="#64748b" tick={{ fontSize: 11 }} label={{ value: "Attempt #", position: "bottom", fill: "#64748b", fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111822",
                    border: "1px solid #1e293b",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: "#94a3b8" }}
                />
                <Area type="monotone" dataKey="projected" name="Projected" stroke="#a78bfa" fill="url(#projFill)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="score" name="Recorded" stroke="#38bdf8" fill="url(#scoreFill)" strokeWidth={2} connectNulls={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-vanta-muted mt-3">
            Purple = projected trend; cyan = recorded practice scores. Not affiliated with College Board — for study motivation only.
          </p>
        </Card>

        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="p-5">
            <p className="text-xs text-vanta-muted uppercase tracking-wider mb-1">Est. AP score band</p>
            <p className="text-3xl font-display font-bold text-sky-400">3 – 4</p>
            <p className="text-xs text-vanta-muted mt-2">If you hold ~65%+ on mixed MC + FRQ-style sets.</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs text-vanta-muted uppercase tracking-wider mb-1">Focus next</p>
            <p className="text-sm text-vanta-text">Weakest units often show up in graph & data questions — try Biology & Stats sets with figures.</p>
            <Link href="/study" className="inline-block mt-3 text-xs text-sky-400 hover:underline">
              Open practice →
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
