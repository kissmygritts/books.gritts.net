<script setup lang="ts">
// The year in numbers, written as a sentence: books, pages and pages a day,
// the average rating, and the median days to finish. Figures (the year
// included, since it changes) are a size up and underlined, so they read first.
import { formatNumber, plural } from '@/lib/format'
import { type LedgerBook, type LedgerYear, yearStats } from '@/lib/ledger'

const props = defineProps<{
	books: LedgerBook[]
	years: number[]
	/** The build date, YYYY-MM-DD: "so far" ends here in the current year. */
	asOf: string
}>()
const year = defineModel<LedgerYear>('year', { required: true })

type Part = { text: string; figure?: boolean }

const DAY_MS = 86_400_000

// Days the year's reading had: to the build date in the current year, the
// whole year before it. None under "All".
const daysInScope = computed(() => {
	if (year.value === 'all') return null
	const start = Date.UTC(year.value, 0, 1)
	const end = Math.min(Date.UTC(year.value + 1, 0, 1), Date.parse(props.asOf) + DAY_MS)
	return Math.round((end - start) / DAY_MS)
})
const current = computed(() => year.value === +props.asOf.slice(0, 4))

const parts = computed<Part[]>(() => {
	const s = yearStats(props.books)
	const y = year.value
	if (!s.books) return [{ text: y === 'all' ? 'No books finished yet.' : `No books finished in ${y}.` }]

	const out: Part[] = [
		{ text: formatNumber(s.books), figure: true },
		{ text: s.books === 1 ? ' book and ' : ' books and ' },
		{ text: formatNumber(s.pages), figure: true },
		...(y === 'all'
			? [{ text: ' pages across every year' }]
			: [{ text: current.value ? ' pages so far in ' : ' pages in ' }, { text: String(y), figure: true }]),
	]
	const days = daysInScope.value
	if (days && s.pages) {
		out.push({ text: ', about ' }, { text: formatNumber(Math.round(s.pages / days)), figure: true }, { text: ' pages a day' })
	}
	out.push({ text: '.' })

	const rated = props.books.filter((b) => b.rating).length
	if (s.avgRating != null && rated) {
		out.push(
			{ text: ' Rated ' },
			{ text: `${s.avgRating}/8`, figure: true },
			{ text: rated === s.books ? ' on average' : ` on average, from ${plural(rated, 'rated book')}` },
			{ text: '.' },
		)
	}
	if (s.medianDays != null) {
		const d = Math.round(s.medianDays)
		out.push(
			{ text: ' The median book took ' },
			{ text: formatNumber(d), figure: true },
			{ text: d === 1 ? ' day to finish.' : ' days to finish.' },
		)
	}
	return out
})
</script>

<template>
  <DashPage id="numbers" v-model:year="year" title="By the numbers" :years="years">
    <p class="max-w-3xl text-lede tabular-nums text-pretty">
      <template v-for="(p, i) in parts" :key="i"><span v-if="p.figure" class="text-lede-figure underline decoration-2 underline-offset-6">{{ p.text }}</span><template v-else>{{ p.text }}</template></template>
    </p>
  </DashPage>
</template>
