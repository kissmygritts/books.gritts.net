<script setup lang="ts">
// By location: the places in each book, US states or countries shaded by
// book count.
import type { MapView } from '@/components/PlaceMap.vue'
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
</script>

<template>
  <DashPage
    id="map"
    v-model:year="year"
    title="By location"
    caption="Important places for each book on a map (books can have multiple places)."
    :years="years"
  >
    <div v-if="p.regions.length" class="grid gap-8">
      <SegmentedControl
        v-model="view"
        label="Map"
        :options="[
          { value: 'us', label: 'US' },
          { value: 'world', label: 'World' },
        ]"
      />
      <PlaceMap :books="books" :view="view" />
    </div>
    <p v-else class="font-extralight text-verdict">No places recorded.</p>
  </DashPage>
</template>
