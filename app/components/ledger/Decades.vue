<script setup lang="ts">
// When it was published, by decade.
import { plural } from '@/lib/format'
import { decades, type LedgerBook, type LedgerYear } from '@/lib/ledger'

const props = defineProps<{ books: LedgerBook[]; years: number[] }>()
const year = defineModel<LedgerYear>('year', { required: true })

const columns = computed(() =>
	decades(props.books).map((d) => ({
		key: d.key,
		label: `${d.key}s`,
		name: `Published in the ${d.key}s`,
		books: d.books,
	})),
)
const none = computed(
	() => props.books.filter((b) => !b.publication_year).length,
)
const caption = computed(
	() =>
		`Books by the decade they were published.${none.value ? ` ${plural(none.value, 'book')} without a year, not shown.` : ''}`,
)
</script>

<template>
  <DashPage id="decades" v-model:year="year" title="By decade" :caption="caption" :years="years">
    <DotColumns v-if="columns.length" :columns="columns" :per-row="3" />
    <p v-else class="font-extralight text-verdict">No publication years recorded.</p>
  </DashPage>
</template>
