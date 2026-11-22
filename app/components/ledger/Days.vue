<script setup lang="ts">
// Days from start to finish.
import { plural } from '@/lib/format'
import type { LedgerBook, LedgerYear } from '@/lib/ledger'
import { backwards, dayBins, daysOf, median } from '@/lib/shape'

const props = defineProps<{ books: LedgerBook[]; years: number[] }>()
const year = defineModel<LedgerYear>('year', { required: true })

const columns = computed(() => dayBins(props.books))
const days = computed(() =>
	props.books.map(daysOf).filter((n): n is number => n != null),
)
const caption = computed(() => {
	const m = median(days.value)
	const noStart = props.books.filter((b) => !b.started_at).length
	const bad = backwards(props.books).length
	return [
		'Days from the start date to the finish date.',
		m == null ? '' : `Median ${plural(Math.round(m), 'day')}.`,
		noStart
			? `${plural(noStart, 'book')} without a start date, not shown.`
			: '',
		bad
			? `${plural(bad, 'book')} started after it was finished, not shown.`
			: '',
	]
		.filter(Boolean)
		.join(' ')
})
</script>

<template>
  <DashPage legend id="days" v-model:year="year" title="By duration" :caption="caption" :years="years">
    <DotColumns v-if="columns.length" :columns="columns" :per-row="3" />
    <p v-else class="font-extralight text-verdict">No start dates recorded.</p>
  </DashPage>
</template>
