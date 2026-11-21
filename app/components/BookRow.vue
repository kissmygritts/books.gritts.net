<script setup lang="ts">
import { Headphones } from '@lucide/vue'
import type { Book } from '@/lib/book'
import { plural } from '@/lib/format'

const props = defineProps<{ book: Book }>()

const spec = computed(() => {
	const b = props.book
	const when =
		b.status === 'read'
			? b.finished_at
			: b.status === 'reading'
				? b.started_at && `started ${b.started_at}`
				: b.status === 'abandoned'
					? 'abandoned'
					: null
	return [
		when,
		b.pages != null && plural(b.pages, 'page'),
		b.publication_year != null && `pub ${b.publication_year}`,
	]
})
</script>

<template>
  <article class="flex items-start gap-3 border-rule border-b py-3 last:border-b-0">
    <BookCover :src="book.cover_image" :title="book.title" size="sm" decorative />
    <div class="grid min-w-0 flex-1 gap-0.5">
      <h3 class="flex items-center gap-1.5 font-medium">
        <span class="truncate">{{ book.title }}</span>
        <Headphones
          v-if="book.audible"
          class="size-3.5 shrink-0 text-audiobook"
          aria-label="Audiobook"
        />
      </h3>
      <p v-if="book.author?.length" class="truncate text-meta text-muted-foreground">
        {{ book.author.join(', ') }}
      </p>
      <SpecLine :items="spec" class="mt-0.5" />
    </div>
    <div class="hidden shrink-0 justify-items-end gap-1.5 sm:grid">
      <RatingBadge v-if="book.status === 'read'" :rating="book.rating" />
      <StatusBadge v-else :status="book.status" />
      <AuthorTag :value="book.white_male_author" />
    </div>
  </article>
</template>
