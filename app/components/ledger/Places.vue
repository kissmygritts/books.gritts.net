<script setup lang="ts">
// Where it was set: states and countries by book count, with their cities.
import type { BarRow } from '@/lib/chart'
import { plural } from '@/lib/format'
import { type LedgerBook, places } from '@/lib/ledger'

const props = defineProps<{ books: LedgerBook[] }>()

const p = computed(() => places(props.books))
const note = computed(() => {
	const { regions, states, countries, without } = p.value
	if (!regions.length) return ''
	return (
		`${plural(states, 'state')} · ${plural(countries, 'country', 'countries')}` +
		(without ? ` · ${without} without places` : '')
	)
})
const rows = computed<BarRow[]>(() =>
	p.value.regions.slice(0, 12).map((r) => ({
		key: r.key,
		label: r.key,
		sub: r.cities.join(', ') || undefined,
		segments: [{ tone: 'place', value: r.books.length }],
		value: r.books.length,
		tip: {
			title: r.key,
			meta: [plural(r.books.length, 'book')],
			books: r.books.map((b) => b.title),
		},
	})),
)
</script>

<template>
  <Panel title="Where it was set" :note="note">
    <slot name="map" :books="books" />
    <ChartBars :rows="rows" empty="No places recorded for this year." />
  </Panel>
</template>
