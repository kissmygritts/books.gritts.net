// The Reading Ledger's panel math, ported from the vault's
// .claude/skills/book/ledger/template.html. Pure functions over the synced
// frontmatter. Each mirrors the ledger's JS so a panel's numbers match the
// private ledger for the same year; keep them in step with it.
import { type AuthorTag, authorTag, type Book } from '@/lib/book'
import { type DerivedBook, derive, US_STATES } from '@/lib/derive'

/** A book on the ledger: it has a finish date. */
export type LedgerBook = DerivedBook & { finished_at: string }
export type LedgerYear = number | 'all'
export type Tally = Record<AuthorTag, number>
export type Format = 'audiobook' | 'print' | 'unknown'
export type FormatTally = Record<Format, number>

export const MONTHS = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
] as const

export const TAG_KEYS: AuthorTag[] = ['other', 'wm', 'untagged']
export const FORMAT_KEYS: Format[] = ['audiobook', 'print', 'unknown']
export const FORMAT_LABEL: Record<Format, string> = {
	audiobook: 'Audiobook',
	print: 'Print',
	unknown: 'Not recorded',
}

/** ledger.py's DATA order: newest start first, then title, both descending. */
function byStartDesc(a: Book, b: Book): number {
	const ka = a.started_at ?? ''
	const kb = b.started_at ?? ''
	if (ka !== kb) return ka < kb ? 1 : -1
	return a.title < b.title ? 1 : a.title > b.title ? -1 : 0
}

/** Every book in the ledger's order, with derived fields. */
export function ledgerBooks(books: readonly Book[]): DerivedBook[] {
	return [...books].sort(byStartDesc).map(derive)
}

export function finishedBooks(books: readonly DerivedBook[]): LedgerBook[] {
	return books.filter((b): b is LedgerBook => !!b.finished_at)
}

export const finishYear = (b: LedgerBook) => +b.finished_at.slice(0, 4)

/** Years with a finished book, newest first. */
export function ledgerYears(finished: readonly LedgerBook[]): number[] {
	return [...new Set(finished.map(finishYear))].sort((a, b) => b - a)
}

export function inYear(b: LedgerBook, year: LedgerYear): boolean {
	return year === 'all' || b.finished_at.startsWith(String(year))
}

export function formatOf(b: Pick<Book, 'audible'>): Format {
	return b.audible === true
		? 'audiobook'
		: b.audible === false
			? 'print'
			: 'unknown'
}

export function tally(books: readonly Book[]): Tally {
	const t: Tally = { other: 0, wm: 0, untagged: 0 }
	for (const b of books) t[authorTag(b.white_male_author)]++
	return t
}

export function formatTally(books: readonly Book[]): FormatTally {
	const t: FormatTally = { audiobook: 0, print: 0, unknown: 0 }
	for (const b of books) t[formatOf(b)]++
	return t
}

export const sumPages = (books: readonly Book[]) =>
	books.reduce((s, b) => s + (b.pages || 0), 0)

/** Mean of the rated books, or null when none is rated. */
export function avgRating(books: readonly Book[]): number | null {
	const r = books.filter((b) => b.rating)
	return r.length ? r.reduce((s, b) => s + (b.rating ?? 0), 0) / r.length : null
}

export const fixed1 = (n: number | null) => (n == null ? null : n.toFixed(1))

// ---- the yearly goal --------------------------------------------------------

export type Verdict =
	| { kind: 'years'; met: number; of: number }
	| { kind: 'untagged' }
	| { kind: 'met'; by: number }
	| { kind: 'behind' | 'missed'; by: number }

export function verdict(
	t: Tally,
	opts: { year: LedgerYear; isCurrent: boolean; finished: LedgerBook[] },
): Verdict {
	if (opts.year === 'all') {
		const years = ledgerYears(opts.finished)
		const met = years.filter((y) => {
			const p = tally(opts.finished.filter((b) => inYear(b, y)))
			return p.other > p.wm
		}).length
		return { kind: 'years', met, of: years.length }
	}
	if (t.other + t.wm === 0) return { kind: 'untagged' }
	if (t.other > t.wm) return { kind: 'met', by: t.other - t.wm }
	return { kind: opts.isCurrent ? 'behind' : 'missed', by: t.wm - t.other + 1 }
}

// ---- the year in numbers ----------------------------------------------------

export interface YearStats {
	books: number
	pages: number
	/** One decimal, as the ledger prints it; null when nothing is rated. */
	avgRating: string | null
	/** The ledger's median: the upper middle of the sorted spans. */
	medianDays: number | null
}

const DAY_MS = 864e5

export function yearStats(books: readonly LedgerBook[]): YearStats {
	const spans = books
		.filter((b) => b.started_at)
		.map(
			(b) =>
				(Date.parse(b.finished_at) - Date.parse(b.started_at as string)) /
				DAY_MS,
		)
		.filter((d) => d >= 0)
		.sort((a, b) => a - b)
	return {
		books: books.length,
		pages: sumPages(books),
		avgRating: fixed1(avgRating(books)),
		medianDays: spans.length
			? (spans[Math.floor(spans.length / 2)] ?? null)
			: null,
	}
}

// ---- grouped counts ---------------------------------------------------------

export interface Bucket {
	key: string
	/** Axis label: "Jan", "’25". */
	label: string
	/** Long name for tooltips and aria: "Jan 2025", "2025". */
	name: string
	current: boolean
	books: LedgerBook[]
}

/** Books finished by month for a year, or by year for "all". */
export function finishBuckets(
	books: readonly LedgerBook[],
	opts: { year: LedgerYear; years: number[]; currentMonth: number },
): Bucket[] {
	if (opts.year === 'all') {
		return [...opts.years].reverse().map((y) => ({
			key: String(y),
			label: `’${String(y).slice(2)}`,
			name: String(y),
			current: false,
			books: books.filter((b) => inYear(b, y)),
		}))
	}
	return MONTHS.map((m, i) => ({
		key: m,
		label: m,
		name: `${m} ${opts.year}`,
		current: i === opts.currentMonth,
		books: books.filter((b) => +b.finished_at.slice(5, 7) === i + 1),
	}))
}

export function ratingBuckets(books: readonly LedgerBook[]): Bucket[] {
	return Array.from({ length: 8 }, (_, i) => i + 1).map((r) => ({
		key: String(r),
		label: String(r),
		name: `Rated ${r}`,
		current: false,
		books: books.filter((b) => b.rating === r),
	}))
}

export interface Group {
	key: string
	books: LedgerBook[]
}

/** Publication decades, in the ledger's (string) key order. */
export function decades(books: readonly LedgerBook[]): Group[] {
	const dc: Record<string, LedgerBook[]> = {}
	for (const b of books) {
		if (!b.publication_year) continue
		const d = String(Math.floor(b.publication_year / 10) * 10)
		dc[d] ??= []
		dc[d].push(b)
	}
	return Object.keys(dc)
		.sort()
		.map((d) => ({ key: d, books: dc[d] as LedgerBook[] }))
}

const byCountThenName = (a: Group, b: Group) =>
	b.books.length - a.books.length || a.key.localeCompare(b.key)

export const isNonFiction = (b: DerivedBook) => b.genres.includes('non-fiction')

/** Top genres within one side of the fiction split. */
export function genreGroups(books: readonly LedgerBook[], limit = 8): Group[] {
	const gc: Record<string, LedgerBook[]> = {}
	for (const b of books) {
		for (const g of b.genres) {
			if (g === 'fiction' || g === 'non-fiction') continue
			gc[g] ??= []
			gc[g].push(b)
		}
	}
	return Object.entries(gc)
		.map(([key, bs]) => ({ key, books: bs }))
		.sort(byCountThenName)
		.slice(0, limit)
}

/** Every author, most books first, then higher average, then name. */
export function authorGroups(books: readonly LedgerBook[]): Group[] {
	const ac: Record<string, LedgerBook[]> = {}
	for (const b of books) {
		for (const a of b.author ?? []) {
			ac[a] ??= []
			ac[a].push(b)
		}
	}
	return Object.entries(ac)
		.map(([key, bs]) => ({ key, books: bs }))
		.sort(
			(a, b) =>
				b.books.length - a.books.length ||
				(avgRating(b.books) ?? 0) - (avgRating(a.books) ?? 0) ||
				a.key.localeCompare(b.key),
		)
}

export interface PlaceGroup extends Group {
	cities: string[]
}

export interface Places {
	regions: PlaceGroup[]
	states: number
	countries: number
	/** Books with no region recorded. */
	without: number
}

export function places(books: readonly LedgerBook[]): Places {
	const pc: Record<string, { books: LedgerBook[]; cities: Set<string> }> = {}
	for (const b of books) {
		for (const r of b.regions) {
			pc[r] ??= { books: [], cities: new Set() }
			pc[r].books.push(b)
		}
	}
	for (const b of books) {
		for (const [r, cs] of Object.entries(b.cities)) {
			const p = pc[r]
			if (p) for (const c of cs) p.cities.add(c)
		}
	}
	const regions = Object.entries(pc)
		.map(([key, o]) => ({ key, books: o.books, cities: [...o.cities] }))
		.sort(byCountThenName)
	const us = new Set(US_STATES)
	const states = regions.filter((r) => us.has(r.key)).length
	return {
		regions,
		states,
		countries: regions.length - states,
		without: books.filter((b) => !b.regions.length).length,
	}
}

/** Long-form "as of" date for the header: "November 21". */
export function monthDay(iso: string): string {
	return new Date(`${iso}T12:00`).toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
	})
}
