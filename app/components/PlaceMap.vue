<script setup lang="ts">
// US states or countries shaded by how many books were set there, after the
// ledger's renderMap(): one ink, currentColor, more opaque for more books.
// Empty regions are the ink at 10%. Every region is stroked 1.5px in the
// field color, a gap that reads the same on shared borders (drawn twice)
// and on coasts. Hovering a region writes its count and cities into the
// page caption. Outlines are
// us-atlas@3.0.1 / world-atlas@2.0.2 in public/geo/, copied from the
// vault's ledger/geo/.
import { geoAlbersUsa, geoEqualEarth, geoPath } from 'd3-geo'
import type { Feature, FeatureCollection, Geometry } from 'geojson'
import { feature } from 'topojson-client'
import type { Topology } from 'topojson-specification'
import { plural } from '@/lib/format'
import { type LedgerBook, places } from '@/lib/ledger'

export type MapView = 'us' | 'world'

const props = defineProps<{ books: LedgerBook[]; view: MapView }>()
const emit = defineEmits<{
	/** Places with books that this view can't show. */
	omit: [names: string[]]
}>()

type Geo = Feature<Geometry, { name: string }>

// Region names match the atlases' `name`s, except these.
const COUNTRY_ALIAS: Record<string, string> = {
	England: 'United Kingdom',
	Scotland: 'United Kingdom',
	Wales: 'United Kingdom',
	'Northern Ireland': 'United Kingdom',
	'United States': 'United States of America',
}
const DISPLAY: Record<string, string> = {
	'United States of America': 'United States',
}

const geo = shallowRef<{ us: Geo[]; world: Geo[] } | null>(null)
const failed = ref(false)

onMounted(async () => {
	try {
		const [us, world] = await Promise.all([
			$fetch<Topology>('/geo/us-states-10m.json'),
			$fetch<Topology>('/geo/world-countries-110m.json'),
		])
		const fc = (t: Topology, key: string) =>
			(
				feature(t, t.objects[key] as never) as unknown as FeatureCollection<
					Geometry,
					{ name: string }
				>
			).features
		geo.value = { us: fc(us, 'states'), world: fc(world, 'countries') }
	} catch {
		failed.value = true
	}
})

const W = 960
const H = computed(() => (props.view === 'us' ? 600 : 500))

interface Region {
	name: string
	d: string
	n: number
	cities: string[]
	opacity: number
}

const model = computed(() => {
	const g = geo.value
	if (!g) return null
	const isUS = props.view === 'us'
	const usNames = new Set(g.us.map((f) => f.properties.name))
	const worldNames = new Set(g.world.map((f) => f.properties.name))

	const hits: Record<string, { books: Set<string>; cities: Set<string> }> = {}
	const omitted = new Set<string>()
	for (const r of places(props.books).regions) {
		const key = isUS
			? usNames.has(r.key)
				? r.key
				: null
			: usNames.has(r.key)
				? 'United States of America'
				: (COUNTRY_ALIAS[r.key] ?? r.key)
		if (!key || (!isUS && !worldNames.has(key))) {
			omitted.add(r.key)
			continue
		}
		hits[key] ??= { books: new Set(), cities: new Set() }
		for (const b of r.books) hits[key].books.add(b.slug)
		for (const c of r.cities) hits[key].cities.add(c)
	}

	const max = Math.max(1, ...Object.values(hits).map((h) => h.books.size))
	const shade = (n: number) =>
		max === 1 ? 1 : 0.25 + (0.75 * (n - 1)) / (max - 1)

	const feats = isUS
		? g.us
		: g.world.filter((f) => f.properties.name !== 'Antarctica')
	const proj = isUS ? geoAlbersUsa() : geoEqualEarth()
	proj.fitExtent(
		[
			[2, 2],
			[W - 2, H.value - 2],
		],
		isUS ? { type: 'FeatureCollection', features: feats } : { type: 'Sphere' },
	)
	const path = geoPath(proj)
	const regions: Region[] = feats.flatMap((f) => {
		const d = path(f)
		if (!d) return []
		const h = hits[f.properties.name]
		const n = h?.books.size ?? 0
		return [
			{
				name: DISPLAY[f.properties.name] ?? f.properties.name,
				d,
				n,
				cities: h ? [...h.cities] : [],
				opacity: n ? shade(n) : 0.1,
			},
		]
	})

	// Up to five legend steps from 1 to the most books.
	const steps = [
		...new Set(
			Array.from({ length: Math.min(max, 5) }, (_, i) =>
				Math.round(1 + (i * (max - 1)) / Math.max(1, Math.min(max, 5) - 1)),
			),
		),
	].map((n) => ({ n, opacity: shade(n) }))
	return { regions, max, steps, omitted: [...omitted].sort() }
})

watch(
	() => model.value?.omitted ?? [],
	(v) => emit('omit', v),
	{ immediate: true },
)

const label = computed(() => {
	const what = props.view === 'us' ? 'US states' : 'Countries'
	const list = (model.value?.regions ?? [])
		.filter((r) => r.n)
		.sort((a, b) => b.n - a.n || a.name.localeCompare(b.name))
		.map((r) => `${r.name} ${plural(r.n, 'book')}`)
	return `${what} shaded by books set there${list.length ? `: ${list.join(', ')}` : ''}`
})

const note = useHoverNote()
const book = useHoverBook()
const hovered = shallowRef<Region | null>(null)
// A new view or year redraws the map under the pointer: drop stale hover.
watch(model, () => {
	hovered.value = null
	note.value = null
})
watch(note, (v) => {
	if (v === null) hovered.value = null
})
function hover(r: Region) {
	book.value = null
	hovered.value = r.n ? r : null
	note.value = r.n
		? `${r.name}: ${plural(r.n, 'book')}.${r.cities.length ? ` ${r.cities.join(', ')}.` : ''}`
		: null
}
</script>

<template>
  <p v-if="failed" class="font-extralight text-verdict">Map unavailable.</p>
  <div v-else class="grid gap-4">
    <svg
      :viewBox="`0 0 ${W} ${H}`"
      class="block h-auto w-full"
      role="img"
      :aria-label="label"
      :aria-busy="!model"
    >
      <path
        v-for="r in model?.regions"
        :key="r.name"
        :d="r.d"
        :fill-opacity="r.opacity"
        stroke-width="1.5"
        vector-effect="non-scaling-stroke"
        class="fill-current stroke-field"
        @mouseenter="hover(r)"
      />
      <path
        v-if="hovered"
        :d="hovered.d"
        vector-effect="non-scaling-stroke"
        class="pointer-events-none fill-none stroke-2 stroke-current"
      />
    </svg>
    <div
      v-if="model && model.regions.some((r) => r.n)"
      class="flex items-center gap-2 text-meta tabular-nums"
      aria-hidden="true"
    >
      <span>{{ plural(1, 'book') }}</span>
      <svg :width="model.steps.length * 18 - 6" height="12" class="block">
        <circle
          v-for="(s, i) in model.steps"
          :key="s.n"
          :cx="i * 18 + 6"
          cy="6"
          r="6"
          :fill-opacity="s.opacity"
          class="fill-current"
        />
      </svg>
      <span v-if="model.max > 1">{{ plural(model.max, 'book') }}</span>
    </div>
  </div>
</template>
