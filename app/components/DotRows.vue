<script setup lang="ts">
// A bar list where every book is a dot: one labelled row per group.
import type { Book } from '@/lib/book'
import { byFinishAsc } from '@/lib/derive'
import { plural } from '@/lib/format'

export interface DotRow {
	key: string
	label: string
	/** A second line under the label: "12 books", "avg 6.0/8". */
	sub?: string
	books: Book[]
}

defineProps<{ rows: DotRow[] }>()
const { lens } = useLens()
const hovered = useHoverBook()
const card = useBookCard()
</script>

<template>
  <ul class="grid gap-4.5">
    <li v-for="r in rows" :key="r.key" class="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4.5">
      <span class="leading-tight sm:w-48 sm:shrink-0 sm:text-right">
        {{ r.label }}
        <span v-if="r.sub" class="block text-meta tabular-nums">{{ r.sub }}</span>
      </span>
      <span
        role="img"
        :aria-label="`${r.label}: ${plural(r.books.length, 'book')}`"
        class="flex min-w-0 flex-1 flex-wrap gap-1.5"
      >
        <BookDot
          v-for="b in [...r.books].sort(byFinishAsc)"
          :key="b.slug"
          :tag="lens.tag(b)"
          class="hover:outline-2 hover:outline-current hover:outline-offset-2"
          @mouseenter="hovered = b"
          v-on="card.on(b)"
        />
      </span>
    </li>
    <BookCardPopover :card="card" />
  </ul>
</template>
