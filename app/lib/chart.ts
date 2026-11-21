import type { Tone } from '@/lib/tone'

/** Tooltip content: "<b>title</b> · meta · meta", extra lines, then book titles. */
export interface ChartTip {
	title: string
	meta?: string[]
	lines?: string[]
	books?: string[]
}

export interface Series {
	key: string
	tone: Tone
}

/** One column of a stacked column chart. */
export interface Column {
	key: string
	label: string
	current?: boolean
	parts: Record<string, number>
	aria: string
	tip: ChartTip
}

/** One row of a horizontal bar list. */
export interface BarRow {
	key: string
	label: string
	/** Muted text after the label (a region's cities). */
	sub?: string
	segments: { tone: Tone; value: number }[]
	value: number
	/** Average rating, one decimal, or null for "–". Omit for no column. */
	avg?: string | null
	tip?: ChartTip
}

/** The ledger's axis max: 4, then steps of 2, 5, 10. */
export function niceMax(v: number): number {
	if (v <= 4) return 4
	const step = v <= 10 ? 2 : v <= 25 ? 5 : 10
	return Math.ceil(v / step) * step
}

export function ticks(max: number): number[] {
	const step = max <= 4 ? 1 : max <= 10 ? 2 : max <= 25 ? 5 : 10
	const t: number[] = []
	for (let v = step; v <= max; v += step) t.push(v)
	return t
}
