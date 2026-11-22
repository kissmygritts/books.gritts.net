<script setup lang="ts">
// What it was: fiction and non-fiction, then the most read genres.
import { plural } from '@/lib/format'
import {
	genreGroups,
	isNonFiction,
	type LedgerBook,
	type LedgerYear,
} from '@/lib/ledger'

const props = defineProps<{ books: LedgerBook[]; years: number[] }>()
const year = defineModel<LedgerYear>('year', { required: true })

const rows = computed(() => {
	const non = props.books.filter(isNonFiction)
	const fic = props.books.filter((b) => !isNonFiction(b))
	return [
		{
			key: 'fiction',
			label: 'Fiction',
			sub: plural(fic.length, 'book'),
			books: fic,
		},
		{
			key: 'non-fiction',
			label: 'Non-fiction',
			sub: plural(non.length, 'book'),
			books: non,
		},
		...genreGroups(props.books).map((g) => ({
			key: g.key,
			label: g.key,
			sub: plural(g.books.length, 'book'),
			books: g.books,
		})),
	].filter((r) => r.books.length)
})
</script>

<template>
  <DashPage legend
    id="genres"
    v-model:year="year"
    title="By genre"
    caption="The most read genres (books can have dots in multiple genres)."
    :years="years"
  >
    <DotRows v-if="rows.length" :rows="rows" />
    <p v-else class="font-extralight text-verdict">No books finished.</p>
  </DashPage>
</template>
