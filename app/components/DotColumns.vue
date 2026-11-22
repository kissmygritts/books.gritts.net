<script setup lang="ts">
// A column chart where every book is a dot: stacks grow from the baseline,
// oldest finish at the bottom. The count over a stack is its label; the dots
// are the unit, and the aria-label says it in words.
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

defineProps<{ columns: DotColumn[]; perRow: number }>()
const hovered = useHoverBook()
const card = useBookCard()
</script>

<template>
  <div class="flex items-end gap-2.5 overflow-x-auto px-0.5 pt-3 pb-0.5 sm:gap-6 lg:gap-9">
    <div
      v-for="c in columns"
      :key="c.key"
      role="img"
      :aria-label="`${c.name}: ${plural(c.books.length, 'book')}`"
      class="flex shrink-0 flex-col items-center gap-2.5"
    >
      <span class="text-meta tabular-nums" aria-hidden="true">{{ c.books.length }}</span>
      <div class="flex w-stack flex-wrap-reverse gap-1.25" :style="{ '--per-row': perRow }">
        <BookDot
          v-for="b in [...c.books].sort(byFinishAsc)"
          :key="b.slug"
          :value="b.white_male_author"
          class="hover:outline-2 hover:outline-current hover:outline-offset-2"
          @mouseenter="hovered = b"
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
