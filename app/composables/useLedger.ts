// The ledger's data for `/`: every book in the ledger's order, the finished
// ones, their years, and the build date that stands in for "today".
import type { Book } from '@/lib/book'
import { finishedBooks, ledgerBooks, ledgerYears } from '@/lib/ledger'

export async function useLedger() {
	// Read before the await: composables lose the Nuxt instance after it.
	const generatedAt = useRuntimeConfig().public.generatedAt as string
	const { data } = await useAsyncData('books', () =>
		queryCollection('books').all(),
	)
	const all = computed(() => ledgerBooks((data.value ?? []) as Book[]))
	const finished = computed(() => finishedBooks(all.value))
	const years = computed(() => ledgerYears(finished.value))
	const currentYear = +generatedAt.slice(0, 4)
	const currentMonth = +generatedAt.slice(5, 7) - 1
	return { all, finished, years, generatedAt, currentYear, currentMonth }
}
