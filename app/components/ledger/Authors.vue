<script setup lang="ts">
// Most read authors: everyone with more than one book, top twelve.
import { plural } from '@/lib/format'
import {
	authorGroups,
	avgRating,
	fixed1,
	type LedgerBook,
	type LedgerYear,
} from '@/lib/ledger'

const props = defineProps<{ books: LedgerBook[]; years: number[] }>()
const year = defineModel<LedgerYear>('year', { required: true })

const groups = computed(() => authorGroups(props.books))
const rows = computed(() =>
	groups.value
		.filter((g) => g.books.length > 1)
		.slice(0, 12)
		.map((g) => {
			const avg = fixed1(avgRating(g.books))
			return {
				key: g.key,
				label: g.key,
				sub: `${plural(g.books.length, 'book')}${avg ? `, avg ${avg}/8` : ''}`,
				books: g.books,
			}
		}),
)
const caption = computed(
	() =>
		`Top ${plural(rows.value.length, 'author')} (only authors with more than one book). ${plural(groups.value.length, 'author')} ${year.value === 'all' ? 'across all years' : `in ${year.value}`}.`,
)
</script>

<template>
  <DashPage id="authors" v-model:year="year" title="By author" :caption="caption" :years="years">
    <DotRows v-if="rows.length" :rows="rows" />
    <p v-else class="font-extralight text-verdict">No author read twice in {{ year }}.</p>
  </DashPage>
</template>
