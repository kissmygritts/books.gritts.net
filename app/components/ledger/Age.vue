<script setup lang="ts">
// How old a book was when it was finished.
import { plural } from '@/lib/format'
import type { LedgerBook, LedgerYear } from '@/lib/ledger'
import { ageBins, ageOf, median } from '@/lib/shape'

const props = defineProps<{ books: LedgerBook[]; years: number[] }>()
const year = defineModel<LedgerYear>('year', { required: true })

const columns = computed(() => ageBins(props.books))
const ages = computed(() =>
	props.books.map(ageOf).filter((n): n is number => n != null),
)
const caption = computed(() => {
	const m = median(ages.value)
	const none = props.books.length - ages.value.length
	return [
		'Years between publication and the finish date.',
		m == null ? '' : `Median ${plural(Math.round(m), 'year')}.`,
		none
			? `${plural(none, 'book')} without a publication year, not shown.`
			: '',
	]
		.filter(Boolean)
		.join(' ')
})
</script>

<template>
  <DashPage legend id="age" v-model:year="year" title="By age" :caption="caption" :years="years">
    <DotColumns v-if="columns.length" :columns="columns" :per-row="3" />
    <p v-else class="font-extralight text-verdict">No publication years recorded.</p>
  </DashPage>
</template>
