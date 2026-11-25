// Every book for the server routes (/books.csv, /llms.txt), with the same
// null-boolean fix as app/composables/useLedger.ts: Nuxt Content decodes
// BOOLEAN columns with Boolean(value), so NULL comes back as false.
import type { H3Event } from 'h3'
import { type Book, NULLABLE_BOOLEANS } from '~/lib/book'

export async function allBooks(event: H3Event): Promise<Book[]> {
	const [books, ...nulls] = await Promise.all([
		queryCollection(event, 'books').all(),
		...NULLABLE_BOOLEANS.map((f) =>
			queryCollection(event, 'books').where(f, 'IS NULL').select('slug').all(),
		),
	])
	return books.map((b) => {
		const out = { ...(b as unknown as Book) }
		NULLABLE_BOOLEANS.forEach((f, i) => {
			if (nulls[i]?.some((n) => n.slug === b.slug)) out[f] = null
		})
		return out
	})
}

const STATUS_ORDER = ['reading', 'read', 'to-read', 'abandoned']

/** Reading first, then finished newest first, then up next, then abandoned. */
export function byStatusThenFinish(a: Book, b: Book): number {
	const s = STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status)
	if (s) return s
	const f = (b.finished_at ?? '').localeCompare(a.finished_at ?? '')
	return f || a.title.localeCompare(b.title)
}
