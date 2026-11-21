<script setup lang="ts">
// Where it was set: US states and countries by book count, with cities.
import { plural } from '@/lib/format'
import { type LedgerBook, type LedgerYear, places } from '@/lib/ledger'

const props = defineProps<{ books: LedgerBook[]; years: number[] }>()
const year = defineModel<LedgerYear>('year', { required: true })

const p = computed(() => places(props.books))
const rows = computed(() =>
	p.value.regions.slice(0, 12).map((r) => ({
		key: r.key,
		label: r.key,
		sub: [plural(r.books.length, 'book'), ...r.cities.slice(0, 3)].join(', '),
		books: r.books,
	})),
)
const caption = computed(() => {
	const { states, countries, without } = p.value
	return `${plural(states, 'state')} and ${plural(countries, 'country', 'countries')}, top twelve shown. ${plural(without, 'book')} without a place recorded.`
})
</script>

<template>
  <DashPage id="places" v-model:year="year" title="Where it was set" :caption="caption" :years="years">
    <DotRows v-if="rows.length" :rows="rows" />
    <p v-else class="font-extralight text-verdict">No places recorded.</p>
  </DashPage>
</template>
