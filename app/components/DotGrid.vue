<script setup lang="ts">
// The home page: every finished book as one dot, left to right and top to
// bottom by finish date, and one static line under it. Pointing at a dot,
// clicking it, or stepping with the arrow keys opens its book card; a
// screen reader hears the book through a hidden live caption.
import type { Book } from '@/lib/book'

const props = defineProps<{ books: Book[] }>()

// How the dots are filled; the legend's button cycles it.
const { lens } = useLens()
const tags = computed(() => props.books.map(lens.value.tag))
const ariaLabel = computed(() => {
	const l = lens.value.label
	return `Every finished book, one dot each, in the order finished. Solid: ${l.other}. Ring: ${l.wm}. Small dot: ${l.untagged}. Use the arrow keys to step through them.`
})

// About 3:1 when there is room; narrower screens reflow to fewer columns.
const cols = computed(() => Math.ceil(Math.sqrt(props.books.length * 3)))
const active = ref(-1)
const focused = ref(false)
const grid = ref<HTMLElement>()
const book = computed(() => props.books[active.value] ?? null)
const card = useBookCard()

// Years spanned by recorded finishes, e.g. "2011 – 2026".
const span = computed(() => {
	const ys = props.books.map((b) => b.finished_at?.slice(0, 4)).filter(Boolean) as string[]
	if (!ys.length) return ''
	const lo = ys.reduce((a, b) => (a < b ? a : b))
	const hi = ys.reduce((a, b) => (a > b ? a : b))
	return lo === hi ? lo : `${lo} – ${hi}`
})

// Columns actually rendered: dots sharing the first row's top edge.
function renderedCols(): number {
	const kids = grid.value?.children
	if (!kids?.length) return 1
	const top = (kids[0] as HTMLElement).offsetTop
	let n = 0
	while (n < kids.length && (kids[n] as HTMLElement).offsetTop === top) n++
	return Math.max(1, n)
}

function onFocus() {
	focused.value = true
	if (active.value < 0) active.value = props.books.length - 1
}
function onBlur() {
	focused.value = false
	active.value = -1
}
function onLeave() {
	if (!focused.value) active.value = -1
}

function onKey(e: KeyboardEvent) {
	const last = props.books.length - 1
	const from = Math.max(0, active.value)
	const step: Record<string, number> = {
		ArrowRight: 1,
		ArrowLeft: -1,
		ArrowDown: renderedCols(),
		ArrowUp: -renderedCols(),
	}
	let next: number | undefined
	if (e.key === 'Home') next = 0
	else if (e.key === 'End') next = last
	else if (e.key in step) next = from + (step[e.key] ?? 0)
	if (next === undefined) return
	e.preventDefault()
	active.value = Math.min(last, Math.max(0, next))
	const el = grid.value?.children[active.value]
	const b = props.books[active.value]
	if (el && b) card.show(b, el as HTMLElement, 0)
}
</script>

<template>
  <div class="grid min-h-svh content-center px-4 pt-28 pb-14 sm:px-8">
    <div class="w-dot-grid mx-auto" :style="{ '--cols': cols }">
      <header class="mb-16">
        <h1 class="font-extralight text-title tracking-display tabular-nums">
          {{ books.length }} Books
        </h1>
        <p v-if="span" class="mt-1 text-lg tabular-nums">{{ span }}</p>
      </header>
      <div
        ref="grid"
        tabindex="0"
        role="group"
        :aria-label="ariaLabel"
        aria-describedby="dot-caption"
        class="dot-grid rounded-sm outline-offset-12"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKey"
        @mouseleave="onLeave"
      >
        <BookDot
          v-for="(b, i) in books"
          :key="b.slug"
          size="grid"
          :tag="tags[i]"
          :class="[
            'dot-delay motion-safe:animate-dot-in hover:outline-2 hover:outline-current hover:outline-offset-3',
            i === active && 'outline-2 outline-current outline-offset-3',
          ]"
          :style="{ '--i': i }"
          @mouseenter="active = i"
          @click="active = i"
          v-on="card.on(b)"
        />
      </div>
      <BookCardPopover :card="card" />
      <div class="mt-16 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 text-sm">
        <p id="dot-caption">A dot for every book I've read.</p>
        <DotLegend />
      </div>
      <p class="sr-only" aria-live="polite">
        <BookCaption v-if="book" :book="book" />
      </p>
    </div>
  </div>
</template>
