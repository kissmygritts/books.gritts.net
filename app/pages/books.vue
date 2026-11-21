<script setup lang="ts">
// Books: every book in a table, by status. Finished books follow the shared
// year filter and sort; up next carries the goal projection.
import type { BookStatus } from '@/lib/book'
import { plural } from '@/lib/format'
import { inYear, sumPages, tally } from '@/lib/ledger'

useHead({ title: 'Books' })

const { all, finished, years, currentYear } = await useLedger()
const year = useLedgerYear(years)
const status = ref<BookStatus>('read')

const ofStatus = (s: BookStatus) => all.value.filter((b) => b.status === s)
// Under "All" the finished list keeps every read book, dated or not.
const shelf = computed(() =>
	year.value === 'all'
		? ofStatus('read')
		: finished.value.filter((b) => inYear(b, year.value)),
)
const list = computed(() =>
	status.value === 'read'
		? shelf.value
		: ofStatus(status.value).sort(
				(a, b) =>
					(b.started_at ?? '').localeCompare(a.started_at ?? '') ||
					a.title.localeCompare(b.title),
			),
)
const options = computed(() => [
	{ value: 'read' as const, label: 'Finished', count: shelf.value.length },
	{
		value: 'reading' as const,
		label: 'Reading',
		count: ofStatus('reading').length,
	},
	{
		value: 'to-read' as const,
		label: 'Up next',
		count: ofStatus('to-read').length,
	},
	{
		value: 'abandoned' as const,
		label: 'Abandoned',
		count: ofStatus('abandoned').length,
	},
])

const summary = computed(() => {
	const n = list.value.length
	const pages = plural(sumPages(list.value), 'page')
	switch (status.value) {
		case 'read': {
			const undated = list.value.filter((b) => !b.finished_at).length
			return year.value === 'all'
				? `${plural(n, 'book')}, ${pages}, every year.${undated ? ` ${undated} without a finish date sort last.` : ''}`
				: `${plural(n, 'book')}, ${pages}, finished in ${year.value}.`
		}
		case 'reading':
			return `${plural(n, 'book')} on the go.`
		case 'to-read': {
			// The ledger's projection, always against the current year.
			const q = tally(list.value)
			const t = tally(finished.value.filter((b) => inYear(b, currentYear)))
			return (
				`${plural(n, 'book')} waiting: ${q.other} by everyone else, ${q.wm} by white men${q.untagged ? `, ${q.untagged} untagged` : ''}. ` +
				`Reading them all this year would end ${currentYear} at ${t.other + q.other} to ${t.wm + q.wm}.`
			)
		}
		default:
			return `${plural(n, 'book')} put down for good.`
	}
})
</script>

<template>
  <div class="mx-auto max-w-ledger px-4 pt-30 pb-24 sm:px-8 lg:px-14">
    <div class="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4">
      <h1 class="font-extralight text-title tracking-display">Books</h1>
      <YearFilter v-if="status === 'read'" v-model="year" :years="years" />
    </div>
    <SegmentedControl v-model="status" :options="options" label="List" class="mt-8" />
    <p class="mt-3.5 min-h-6 text-sm tabular-nums">{{ summary }}</p>
    <BookTable :books="list" :status="status" class="mt-7" />
  </div>
</template>
