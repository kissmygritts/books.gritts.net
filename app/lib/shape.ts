// The shape of the reading: length, time to finish, and how old a book was
// when it was read. Not in the private ledger, so kept out of ledger.ts.
import type { LedgerBook } from '@/lib/ledger'

export interface Bin {
	key: string
	/** Column label: "300", "2–3". */
	label: string
	/** Long name for the aria-label: "300–399 pages". */
	name: string
	books: LedgerBook[]
}

interface Edge {
	/** Inclusive lower bound. */
	min: number
	label: string
	name: string
}

/** Sort books into fixed bins by value; nulls are left out. */
function binBy(
	books: readonly LedgerBook[],
	value: (b: LedgerBook) => number | null,
	edges: readonly Edge[],
): Bin[] {
	const bins: Bin[] = edges.map((e) => ({
		key: String(e.min),
		label: e.label,
		name: e.name,
		books: [],
	}))
	for (const b of books) {
		const v = value(b)
		if (v == null) continue
		let i = edges.length - 1
		while (i > 0 && v < (edges[i] as Edge).min) i--
		bins[i]?.books.push(b)
	}
	return bins
}

/** Drop empty bins from both ends, keep the gaps between. */
function trim(bins: Bin[]): Bin[] {
	const first = bins.findIndex((b) => b.books.length)
	if (first < 0) return []
	const last = bins.findLastIndex((b) => b.books.length)
	return bins.slice(first, last + 1)
}

export function median(values: readonly number[]): number | null {
	if (!values.length) return null
	const s = [...values].sort((a, b) => a - b)
	const m = Math.floor(s.length / 2)
	return s.length % 2
		? (s[m] as number)
		: ((s[m - 1] as number) + (s[m] as number)) / 2
}

// Length --------------------------------------------------------------------

const PAGE_CAP = 800

export const pagesOf = (b: LedgerBook) =>
	b.pages && b.pages > 0 ? b.pages : null

/** 100-page bins, 800+ in one. */
export function lengthBins(books: readonly LedgerBook[]): Bin[] {
	const edges: Edge[] = []
	for (let min = 0; min < PAGE_CAP; min += 100)
		edges.push({ min, label: String(min), name: `${min}–${min + 99} pages` })
	edges.push({
		min: PAGE_CAP,
		label: `${PAGE_CAP}+`,
		name: `${PAGE_CAP} pages or more`,
	})
	return trim(binBy(books, pagesOf, edges))
}

// Days to finish -------------------------------------------------------------

const DAY_MS = 86_400_000

/** Whole days from start to finish; null without a start or when it's after the finish. */
export function daysOf(b: LedgerBook): number | null {
	if (!b.started_at) return null
	const d = Math.round(
		(Date.parse(b.finished_at) - Date.parse(b.started_at)) / DAY_MS,
	)
	return d < 0 ? null : d
}

/** Books with a start date after their finish date. */
export const backwards = (books: readonly LedgerBook[]) =>
	books.filter((b) => b.started_at && b.started_at > b.finished_at)

const DAY_EDGES: Edge[] = [
	{ min: 0, label: 'Same day', name: 'Finished the day it was started' },
	{ min: 1, label: '1', name: '1 day' },
	{ min: 2, label: '2–3', name: '2–3 days' },
	{ min: 4, label: '4–7', name: '4–7 days' },
	{ min: 8, label: '8–14', name: '8–14 days' },
	{ min: 15, label: '15–30', name: '15–30 days' },
	{ min: 31, label: '31–90', name: '31–90 days' },
	{ min: 91, label: '91+', name: '91 days or more' },
]

export const dayBins = (books: readonly LedgerBook[]) =>
	trim(binBy(books, daysOf, DAY_EDGES))

// Age when read --------------------------------------------------------------

/** Years from publication to the finish; a book read before its year counts as 0. */
export function ageOf(b: LedgerBook): number | null {
	if (!b.publication_year) return null
	return Math.max(0, +b.finished_at.slice(0, 4) - b.publication_year)
}

const AGE_EDGES: Edge[] = [
	{ min: 0, label: '0', name: 'Read the year it was published' },
	{ min: 1, label: '1–2', name: '1–2 years old' },
	{ min: 3, label: '3–5', name: '3–5 years old' },
	{ min: 6, label: '6–10', name: '6–10 years old' },
	{ min: 11, label: '11–20', name: '11–20 years old' },
	{ min: 21, label: '21–50', name: '21–50 years old' },
	{ min: 51, label: '51–100', name: '51–100 years old' },
	{ min: 101, label: '101+', name: 'More than 100 years old' },
]

export const ageBins = (books: readonly LedgerBook[]) =>
	trim(binBy(books, ageOf, AGE_EDGES))
