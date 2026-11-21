<script setup lang="ts">
// States or countries shaded by how many books were set there, after the
// ledger's renderMap(). Outlines are us-atlas@3.0.1 / world-atlas@2.0.2 in
// public/geo/, copied from the vault's ledger/geo/.
import { geoAlbersUsa, geoEqualEarth, geoPath } from 'd3-geo'
import type { Feature, FeatureCollection, Geometry } from 'geojson'
import { feature } from 'topojson-client'
import type { Topology } from 'topojson-specification'
import type { ChartTip } from '@/lib/chart'
import { plural } from '@/lib/format'
import type { LedgerBook } from '@/lib/ledger'

export type MapView = 'us' | 'world'

const props = defineProps<{ books: LedgerBook[]; view: MapView }>()

type Geo = Feature<Geometry, { name: string }>

// Region names match the atlases' `name`s, except these.
const COUNTRY_ALIAS: Record<string, string> = {
	England: 'United Kingdom',
	Scotland: 'United Kingdom',
	Wales: 'United Kingdom',
	'Northern Ireland': 'United Kingdom',
	'United States': 'United States of America',
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

const model = computed(() => {
	const g = geo.value
	if (!g) return null
	const usNames = new Set(g.us.map((f) => f.properties.name))
	const worldNames = new Set(g.world.map((f) => f.properties.name))
	const isUS = props.view === 'us'

	const hits: Record<string, LedgerBook[]> = {}
	const off = new Set<string>()
	for (const b of props.books) {
		const keys = new Set<string>()
		for (const r of b.regions) {
			if (isUS) {
				if (usNames.has(r)) keys.add(r)
				continue
			}
			const c = usNames.has(r)
				? 'United States of America'
				: (COUNTRY_ALIAS[r] ?? r)
			if (worldNames.has(c)) keys.add(c)
			else off.add(r)
		}
		for (const k of keys) {
			hits[k] ??= []
			hits[k].push(b)
		}
	}
	const abroad = new Set<string>()
	if (isUS)
		for (const b of props.books)
			for (const r of b.regions) if (!usNames.has(r)) abroad.add(r)

	const max = Math.max(1, ...Object.values(hits).map((v) => v.length))
	const shade = (n: number) =>
		`color-mix(in srgb, var(--place) ${Math.round(28 + 72 * (max === 1 ? 1 : (n - 1) / (max - 1)))}%, var(--muted))`

	const feats = isUS
		? g.us
		: g.world.filter((f) => f.properties.name !== 'Antarctica')
	const proj = isUS ? geoAlbersUsa() : geoEqualEarth()
	proj.fitExtent(
		[
			[4, 4],
			[W - 4, H.value - 4],
		],
		isUS ? { type: 'FeatureCollection', features: feats } : { type: 'Sphere' },
	)
	const path = geoPath(proj)
	const paths = feats.flatMap((f) => {
		const d = path(f)
		if (!d) return []
		const bs = hits[f.properties.name] ?? []
		return [
			{
				name: f.properties.name,
				d,
				n: bs.length,
				fill: bs.length ? shade(bs.length) : undefined,
				tip: bs.length
					? ({
							title: f.properties.name,
							meta: [plural(bs.length, 'book')],
							books: bs.map((b) => b.title),
						} satisfies ChartTip)
					: null,
			},
		]
	})
	return {
		paths,
		sphere: isUS ? null : path({ type: 'Sphere' }),
		hitCount: Object.keys(hits).length,
		max,
		lo: shade(1),
		hi: shade(max),
		note: isUS
			? abroad.size
				? `Outside the US: ${[...abroad].sort().join(', ')}`
				: ''
			: off.size
				? `Too small for this map: ${[...off].sort().join(', ')}`
				: '',
	}
})

const label = computed(() => {
	const m = model.value
	const what = props.view === 'us' ? 'US states' : 'Countries'
	if (!m) return `${what} shaded by books set there`
	const hit = m.paths
		.filter((p) => p.n)
		.sort((a, b) => b.n - a.n)
		.map((p) => `${p.name} ${plural(p.n, 'book')}`)
	return `${what} shaded by books set there${hit.length ? `: ${hit.join(', ')}` : ''}`
})

const hovered = shallowRef<{ el: Element; tip: ChartTip } | null>(null)
function hover(e: Event | null, tip?: ChartTip | null) {
	hovered.value = e && tip ? { el: e.currentTarget as Element, tip } : null
}
const gradId = useId()
</script>

<template>
  <div class="mt-1 mb-2">
    <p
      v-if="failed"
      class="py-6 text-center text-faint text-meta"
    >
      Map unavailable — the list below has every place.
    </p>
    <ChartHover
      v-else
      :tip="hovered?.tip ?? null"
      :anchor="hovered?.el ?? null"
    >
      <svg
        :viewBox="`0 0 ${W} ${H}`"
        class="block h-auto w-full"
        role="img"
        :aria-label="label"
        :aria-busy="!model"
      >
        <path
          v-if="model?.sphere"
          :d="model.sphere"
          class="fill-none stroke-border"
          stroke-width="0.6"
          vector-effect="non-scaling-stroke"
        />
        <template v-if="model">
          <path
            v-for="p in model.paths"
            :key="p.name"
            :d="p.d"
            :fill="p.fill"
            :class="[
              'stroke-card',
              p.n
                ? 'cursor-pointer hover:stroke-1 hover:stroke-foreground'
                : 'fill-muted',
            ]"
            stroke-width="0.6"
            vector-effect="non-scaling-stroke"
            @pointerenter="hover($event, p.tip)"
            @pointerleave="hover(null)"
            @click="hover($event, p.tip)"
          />
        </template>
        <text
          v-else
          :x="W / 2"
          :y="H / 2"
          text-anchor="middle"
          class="fill-faint text-meta"
        >
          Loading map…
        </text>
      </svg>
    </ChartHover>

    <div class="mt-2 mb-4.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5">
      <div
        v-if="model?.hitCount"
        class="flex items-center gap-2 font-mono text-faint text-label tabular-nums"
      >
        <span>1</span>
        <svg width="120" height="8" viewBox="0 0 120 8" aria-hidden="true">
          <defs>
            <linearGradient :id="gradId">
              <stop offset="0" :stop-color="model.lo" />
              <stop offset="1" :stop-color="model.hi" />
            </linearGradient>
          </defs>
          <rect width="120" height="8" rx="4" :fill="`url(#${gradId})`" />
        </svg>
        <span>{{ plural(model.max, 'book') }}</span>
      </div>
      <span v-else />
      <span v-if="model?.note" class="text-faint text-xs">{{ model.note }}</span>
    </div>
  </div>
</template>
