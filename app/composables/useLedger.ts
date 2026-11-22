// The ledger's data for `/` and `/dashboard`: every book in the ledger's order, the finished
// ones, their years, and the build date that stands in for "today".
import type { Book } from '@/lib/book'
import { finishedBooks, ledgerBooks, ledgerYears } from '@/lib/ledger'

export async function useLedger() {
	// Read before the await: composables lose the Nuxt instance after it.
	const generatedAt = useRuntimeConfig().public.generatedAt as string
	const { data } = await useAsyncData('books', fetchBooks)
	const all = computed(() => ledgerBooks((data.value ?? []) as Book[]))
	const finished = computed(() => finishedBooks(all.value))
	const years = computed(() => ledgerYears(finished.value))
	const currentYear = +generatedAt.slice(0, 4)
	const currentMonth = +generatedAt.slice(5, 7) - 1
	return { all, finished, years, generatedAt, currentYear, currentMonth }
}

// Nuxt Content decodes BOOLEAN columns with Boolean(value), so a null or
// missing `white_male_author` / `audible` / `author_poc` comes back as false ("everyone
// else", "print"). The column itself stores NULL, so ask for those rows and
// put the nulls back. The files, and so the data contract, are untouched.
const NULLABLE_BOOLEANS = ['white_male_author', 'audible', 'author_poc'] as const

async function fetchBooks(): Promise<Book[]> {
	const [books, ...nulls] = await Promise.all([
		queryCollection('books').all(),
		...NULLABLE_BOOLEANS.map((f) =>
			queryCollection('books').where(f, 'IS NULL').select('slug').all(),
		),
	])
	return books.map((b) => {
		const out: Book = { ...(b as Book) }
		NULLABLE_BOOLEANS.forEach((f, i) => {
			if (nulls[i]?.some((n) => n.slug === b.slug)) out[f] = null
		})
		return out
	})
}
