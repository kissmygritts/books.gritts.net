<script setup lang="ts">
// A book in brief: dithered cover, title, author, finish date, rating. The
// body of <BookCardPopover>. A pill, so its ends are concentric with the
// round cover; sized to its content. No border: the surface contrast is the
// edge. On the field palette: the field's other shade (`field-card`), white
// text and cover ink. Hierarchy by color and weight, not size:
// title in ink, everything else muted. Data only: the rating as circles,
// the finish date bare.
import type { Book } from '@/lib/book'
import { authorList, longDate } from '@/lib/format'

const props = defineProps<{ book: Book }>()
// One line, so every pill is the same height: the title before any subtitle
// ("Essentialism: The Disciplined Pursuit of Less" → "Essentialism"), then
// truncated. The full title is on hover and in the popover's aria-label.
const short = computed(() => props.book.title.split(/:\s/)[0])
</script>

<template>
  <div class="flex w-max max-w-88 items-center gap-4 rounded-full bg-field-card p-3 pr-8 text-field-foreground">
    <BookCover :src="book.cover_image" :title="book.title" decorative size="lg" ink="field" />
    <div class="grid min-w-0">
      <p class="truncate font-normal text-heading" :title="book.title">{{ short }}</p>
      <p class="truncate text-meta text-field-foreground/75">{{ authorList(book.author) }}</p>
      <p class="mt-2.5 flex items-center gap-3 text-meta text-field-foreground/75 tabular-nums">
        <RatingBadge :rating="book.rating" bare />
        <span>{{ book.finished_at ? longDate(book.finished_at) : 'No finish date' }}</span>
      </p>
    </div>
  </div>
</template>
