import type { ExamFigure } from "@/types";

export function normalizeAiFigure(f: unknown): ExamFigure | undefined {
	if (!f || typeof f !== "object") return undefined;
	const fig = f as Record<string, unknown>;
	const kind = fig.kind;
	if (kind === "table" && Array.isArray(fig.headers) && Array.isArray(fig.rows)) {
		return {
			kind: "table",
			title: typeof fig.title === "string" ? fig.title : undefined,
			headers: fig.headers.map(String),
			rows: (fig.rows as unknown[]).map((r) => (Array.isArray(r) ? r.map(String) : [])),
		};
	}
	if (kind === "bar_chart" && Array.isArray(fig.bars)) {
		const bars = (fig.bars as { label?: unknown; value?: unknown }[])
			.filter((b) => b && typeof b.label === "string" && typeof b.value === "number")
			.map((b) => ({ label: String(b.label), value: Number(b.value) }));
		if (bars.length === 0) return undefined;
		return {
			kind: "bar_chart",
			title: typeof fig.title === "string" ? fig.title : undefined,
			yLabel: typeof fig.yLabel === "string" ? fig.yLabel : undefined,
			bars,
		};
	}
	if (kind === "line_chart" && Array.isArray(fig.points)) {
		const points = (fig.points as { x?: unknown; y?: unknown }[])
			.filter((p) => p && typeof p.x === "string" && typeof p.y === "number")
			.map((p) => ({ x: String(p.x), y: Number(p.y) }));
		if (points.length === 0) return undefined;
		return {
			kind: "line_chart",
			title: typeof fig.title === "string" ? fig.title : undefined,
			yLabel: typeof fig.yLabel === "string" ? fig.yLabel : undefined,
			points,
		};
	}
	if (kind === "stimulus" && typeof fig.body === "string") {
		return {
			kind: "stimulus",
			title: typeof fig.title === "string" ? fig.title : undefined,
			body: String(fig.body),
		};
	}
	return undefined;
}
