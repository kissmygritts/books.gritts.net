<script setup lang="ts">
// Ratings on the owner's 1–8 scale, one column per step.
import { plural } from '@/lib/format'
import { type LedgerBook, type LedgerYear, ratingBuckets } from '@/lib/ledger'

const props = defineProps<{ books: LedgerBook[]; years: number[] }>()
const year = defineModel<LedgerYear>('year', { required: true })

const columns = computed(() =>
	ratingBuckets(props.books).map((b) => ({
		key: b.key,
		label: `${b.key}/8`,
		name: `Rated ${b.key} of 8`,
		books: b.books,
	})),
)
const unrated = computed(() => props.books.filter((b) => !b.rating).length)
const caption = computed(
	() =>
		`Ratings on the 1–8 scale. ${unrated.value ? `${plural(unrated.value, 'book')} unrated, not shown.` : 'Every book rated.'}`,
)
</script>

<template>
  <DashPage id="ratings" v-model:year="year" title="Ratings" :caption="caption" :years="years">
    <DotColumns :columns="columns" :per-row="2" />
  </DashPage>
</template>
