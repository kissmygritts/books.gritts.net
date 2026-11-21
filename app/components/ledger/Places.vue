<script setup lang="ts">
// Where it was set: states and countries by book count, with their cities.
import type { BarRow } from '@/lib/chart'
import { plural } from '@/lib/format'
import { US_STATES } from '@/lib/derive'
import { type LedgerBook, places } from '@/lib/ledger'
import type { MapView } from './Map.vue'

const props = defineProps<{ books: LedgerBook[] }>()

const p = computed(() => places(props.books))

// The viewer's pick sticks; until then the ledger's rule: US when any book
// is set in a state (or none has a place), else the world.
const picked = usePersisted<MapView | null>('books-map', null, (r) =>
	r === 'us' || r === 'world' ? r : undefined,
)
const view = computed<MapView>({
	get: () => {
		if (picked.value) return picked.value
		const us = new Set(US_STATES)
		const any = props.books.some((b) => b.regions.length)
		const hasUS = props.books.some((b) => b.regions.some((r) => us.has(r)))
		return hasUS || !any ? 'us' : 'world'
	},
	set: (v) => {
		picked.value = v
	},
})
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
    <template #head>
      <SegmentedControl
        v-model="view"
        label="Map"
        :options="[
          { value: 'us', label: 'US' },
          { value: 'world', label: 'World' },
        ]"
      />
    </template>
    <LedgerMap :books="books" :view="view" />
    <ChartBars :rows="rows" empty="No places recorded for this year." />
  </Panel>
</template>
