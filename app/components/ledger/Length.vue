<script setup lang="ts">
// How long the books were, in 100-page bins.
import { plural } from '@/lib/format'
import type { LedgerBook, LedgerYear } from '@/lib/ledger'
import { lengthBins, median, pagesOf } from '@/lib/shape'

const props = defineProps<{ books: LedgerBook[]; years: number[] }>()
const year = defineModel<LedgerYear>('year', { required: true })

const columns = computed(() => lengthBins(props.books))
const pages = computed(() =>
	props.books.map(pagesOf).filter((n): n is number => n != null),
)
const caption = computed(() => {
	const m = median(pages.value)
	const none = props.books.length - pages.value.length
	return [
		'Books by number of pages, in 100-page bins.',
		m == null ? '' : `Median ${plural(Math.round(m), 'page')}.`,
		none ? `${plural(none, 'book')} without a page count, not shown.` : '',
	]
		.filter(Boolean)
		.join(' ')
})
</script>

<template>
  <DashPage legend id="length" v-model:year="year" title="By length" :caption="caption" :years="years">
    <DotColumns v-if="columns.length" :columns="columns" :per-row="4" :max-rows="10" />
    <p v-else class="font-extralight text-verdict">No page counts recorded.</p>
  </DashPage>
</template>
