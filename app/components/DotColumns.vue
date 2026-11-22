<script setup lang="ts">
// A column chart where every book is a dot: stacks grow from the baseline,
// oldest finish at the bottom. The count over a stack is its label; the dots
// are the unit, and the aria-label says it in words.
import { useElementSize } from '@vueuse/core'
import type { Book } from '@/lib/book'
import { byFinishAsc } from '@/lib/derive'
import { plural } from '@/lib/format'

export interface DotColumn {
	key: string
	label: string
	/** Long name for the aria-label: "Mar 2026". */
	name: string
	books: Book[]
}

const props = defineProps<{
	columns: DotColumn[]
	perRow: number
	/** Widen every stack past `perRow` so the tallest is at most this many rows. */
	maxRows?: number
}>()

// Stacks widen until the tallest is `maxRows` high, but no wider than lets
// every column fit the chart's width (measured after mount). Such charts
// keep a tighter column gap so the stacks can be wider.
const root = useTemplateRef<HTMLElement>('root')
const { width: boxWidth } = useElementSize(root)
const fit = computed(() => {
	const el = root.value
	if (!el || !boxWidth.value) return Number.POSITIVE_INFINITY
	const css = getComputedStyle(el)
	const rem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
	const dot = Number.parseFloat(css.getPropertyValue('--dot')) * rem
	const gap = 0.3125 * rem
	const colGap = Number.parseFloat(css.columnGap) || 0
	const n = props.columns.length
	const each = (boxWidth.value - (n - 1) * colGap) / n
	return Math.floor((each + gap) / (dot + gap))
})
const width = computed(() => {
	if (!props.maxRows) return props.perRow
	const tallest = Math.max(0, ...props.columns.map((c) => c.books.length))
	const want = Math.ceil(tallest / props.maxRows)
	return Math.max(props.perRow, Math.min(want, fit.value))
})
const { lens } = useLens()
const card = useBookCard()
</script>

<template>
  <div
    ref="root"
    class="flex items-end gap-2.5 overflow-x-auto px-0.5 pt-3 pb-0.5"
    :class="maxRows ? 'sm:gap-4' : 'sm:gap-6 lg:gap-9'"
  >
    <div
      v-for="c in columns"
      :key="c.key"
      role="img"
      :aria-label="`${c.name}: ${plural(c.books.length, 'book')}`"
      class="flex shrink-0 flex-col items-center gap-2.5"
    >
      <span class="text-meta tabular-nums" aria-hidden="true">{{ c.books.length }}</span>
      <div class="flex w-stack flex-wrap-reverse gap-1.25" :style="{ '--per-row': width }">
        <BookDot
          v-for="b in [...c.books].sort(byFinishAsc)"
          :key="b.slug"
          :tag="lens.tag(b)"
          class="hover:outline-2 hover:outline-current hover:outline-offset-2"
          v-on="card.on(b)"
        />
      </div>
      <span class="self-stretch border-current border-t pt-1.5 text-center text-meta" aria-hidden="true">
        {{ c.label }}
      </span>
    </div>
    <BookCardPopover :card="card" />
  </div>
</template>
