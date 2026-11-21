<script setup lang="ts">
// On the map: where it was set, US states or countries shaded by book
// count.
import type { MapView } from '@/components/PlaceMap.vue'
import { plural } from '@/lib/format'
import { type LedgerBook, type LedgerYear, places } from '@/lib/ledger'

const props = defineProps<{ books: LedgerBook[]; years: number[] }>()
const year = defineModel<LedgerYear>('year', { required: true })

const p = computed(() => places(props.books))

// The viewer's pick sticks; until then the ledger's rule: US when any book
// is set in a state (or none has a place), else the world.
const picked = usePersisted<MapView | null>('books-map', null, (r) =>
	r === 'us' || r === 'world' ? r : undefined,
)
const view = computed<MapView>({
	get: () =>
		picked.value ??
		(p.value.states || !p.value.regions.length ? 'us' : 'world'),
	set: (v) => {
		picked.value = v
	},
})

const omitted = ref<string[]>([])
const caption = computed(() => {
	const where = view.value === 'us' ? 'state' : 'country'
	const off = omitted.value.length
		? ` Not on this map: ${omitted.value.join(', ')}.`
		: ''
	return `Each ${where} shaded by the books set there, whiter for more.${off} ${plural(p.value.without, 'book')} without a place recorded.`
})
</script>

<template>
  <DashPage id="map" v-model:year="year" title="On the map" :caption="caption" :years="years">
    <div v-if="p.regions.length" class="grid gap-8">
      <SegmentedControl
        v-model="view"
        label="Map"
        :options="[
          { value: 'us', label: 'US' },
          { value: 'world', label: 'World' },
        ]"
      />
      <PlaceMap :books="books" :view="view" @omit="omitted = $event" />
    </div>
    <p v-else class="font-extralight text-verdict">No places recorded.</p>
  </DashPage>
</template>
