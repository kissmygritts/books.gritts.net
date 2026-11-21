<script setup lang="ts">
// Stacked column chart, hand-built SVG, after the ledger's `columns()`.
// Width is measured so gaps and corners stay true; SSR draws at a default
// width and the viewBox scales it until the client measures.
import { useElementSize } from '@vueuse/core'
import { type Column, niceMax, type Series, ticks } from '@/lib/chart'
import { TONE_FILL } from '@/lib/tone'

const props = withDefaults(
	defineProps<{
		columns: Column[]
		series: Series[]
		/** Plot height in px, without the x labels. */
		height?: number
		/** What the chart shows, for its accessible name. */
		label: string
		/** Columns become buttons that emit `pick`. */
		interactive?: boolean
		maxTitles?: number
	}>(),
	{ height: 200, maxTitles: 12 },
)
const emit = defineEmits<{ pick: [column: Column] }>()

const hovered = shallowRef<{ el: Element; col: Column } | null>(null)
function hover(e: Event | null, col?: Column) {
	hovered.value = e && col ? { el: e.currentTarget as Element, col } : null
}

const GUTTER = 26 // tick labels
const GAP = 6 // between columns
const SEG_GAP = 2 // between stacked segments
const LABELS = 20 // x label band

const box = useTemplateRef<HTMLElement>('box')
const { width } = useElementSize(box, { width: 640, height: 0 })
const W = computed(() => Math.max(200, Math.round(width.value)))
const H = computed(() => props.height)

const total = (c: Column) =>
	props.series.reduce((s, k) => s + (c.parts[k.key] ?? 0), 0)
const max = computed(() => niceMax(Math.max(1, ...props.columns.map(total))))
const tickList = computed(() => ticks(max.value))
const y = (v: number) => H.value - (v / max.value) * H.value

/** Rect with only the top corners rounded. */
function topRounded(x: number, y0: number, w: number, h: number, r: number) {
	const rr = Math.min(r, h, w / 2)
	return `M${x},${y0 + h}V${y0 + rr}Q${x},${y0} ${x + rr},${y0}H${x + w - rr}Q${x + w},${y0} ${x + w},${y0 + rr}V${y0 + h}Z`
}

const cols = computed(() => {
	const n = props.columns.length || 1
	const plotW = W.value - GUTTER
	const colW = (plotW - GAP * (n - 1)) / n
	return props.columns.map((c, i) => {
		const x = GUTTER + i * (colW + GAP)
		const bx = x + colW * 0.12
		const bw = colW * 0.76
		const live = props.series.filter((k) => c.parts[k.key])
		let acc = 0
		const segs = live.map((k, j) => {
			const h = Math.max(
				0,
				((c.parts[k.key] ?? 0) / max.value) * H.value - SEG_GAP,
			)
			const top = H.value - acc - h
			acc += h + SEG_GAP
			const d =
				j === live.length - 1
					? topRounded(bx, top, bw, h, 4)
					: `M${bx},${top}h${bw}v${h}h${-bw}Z`
			return { key: k.key, d, fill: TONE_FILL[k.tone] }
		})
		return { c, x, colW, cx: x + colW / 2, segs }
	})
})

function onKey(e: KeyboardEvent, c: Column) {
	if (e.key === 'Enter' || e.key === ' ') {
		e.preventDefault()
		emit('pick', c)
	}
}
</script>

<template>
  <div ref="box" class="w-full">
    <ChartHover
      :tip="hovered?.col.tip ?? null"
      :anchor="hovered?.el ?? null"
      :max-titles="maxTitles"
    >
    <svg
      :viewBox="`0 0 ${W} ${H + LABELS}`"
      class="block h-auto w-full overflow-visible"
      :role="interactive ? 'group' : 'img'"
      :aria-label="interactive ? label : `${label}. ${columns.map((c) => c.aria).join('; ')}`"
    >
      <g aria-hidden="true">
        <g v-for="t in tickList" :key="t">
          <line :x1="GUTTER" :x2="W" :y1="y(t)" :y2="y(t)" class="stroke-rule" />
          <text
            :x="GUTTER - 6"
            :y="y(t)"
            dy="0.32em"
            text-anchor="end"
            class="fill-faint font-mono text-label tabular-nums"
          >
            {{ t }}
          </text>
        </g>
        <line :x1="GUTTER" :x2="W" :y1="H" :y2="H" class="stroke-border" />
      </g>
        <g
          v-for="col in cols"
          :key="col.c.key"
          class="group outline-none"
          :class="interactive && 'cursor-pointer'"
          :role="interactive ? 'button' : undefined"
          :tabindex="interactive ? 0 : undefined"
          :aria-label="interactive ? col.c.aria : undefined"
          :aria-pressed="interactive ? !!col.c.current : undefined"
          @click="interactive && emit('pick', col.c)"
          @keydown="interactive && onKey($event, col.c)"
          @pointerenter="hover($event, col.c)"
          @pointerleave="hover(null)"
          @focus="hover($event, col.c)"
          @blur="hover(null)"
        >
          <rect
            :x="col.x"
            y="0"
            :width="col.colW"
            :height="H"
            rx="6"
            class="fill-transparent group-hover:fill-muted/50 group-focus-visible:fill-muted group-focus-visible:stroke-ring"
          />
          <path
            v-for="s in col.segs"
            :key="s.key"
            :d="s.d"
            :class="s.fill"
          />
          <text
            :x="col.cx"
            :y="H + 15"
            text-anchor="middle"
            :class="[
              'font-mono text-label tabular-nums',
              col.c.current ? 'fill-foreground font-medium' : 'fill-faint',
            ]"
          >
            {{ col.c.label }}
          </text>
        </g>
    </svg>
    </ChartHover>
  </div>
</template>
