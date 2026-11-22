<script setup lang="ts">
// A map region in brief: its name, the count, and every book set there,
// oldest finish first. The body of <PlaceCardPopover>; the same surface as
// <BookCard> (field-card, white ink, no border), rounded rather than a pill
// since it grows with the list, which scrolls past about ten books.
import type { Book } from '@/lib/book'
import { byFinishAsc } from '@/lib/derive'
import { authorList, plural } from '@/lib/format'

export interface Place {
	name: string
	books: Book[]
}

const props = defineProps<{ place: Place }>()
const books = computed(() => [...props.place.books].sort(byFinishAsc))
</script>

<template>
  <div class="grid w-max max-w-80 gap-3 rounded-3xl bg-field-card p-5 text-field-foreground">
    <p class="flex items-baseline justify-between gap-4">
      <span class="font-normal text-heading">{{ place.name }}</span>
      <span class="text-meta text-field-foreground/75 tabular-nums">{{ plural(books.length, 'book') }}</span>
    </p>
    <ul class="grid max-h-96 gap-2.5 overflow-y-auto">
      <li v-for="b in books" :key="b.slug" class="flex items-center gap-3">
        <BookDot :value="b.white_male_author" size="sm" />
        <span class="grid min-w-0">
          <span class="truncate" :title="b.title">{{ b.title.split(/:\s/)[0] }}</span>
          <span class="truncate text-meta text-field-foreground/75">{{ authorList(b.author) }}</span>
        </span>
      </li>
    </ul>
  </div>
</template>
