<script setup lang="ts">
import { Bookmark, BookOpen } from '@lucide/vue'
import type { Book } from '@/lib/book'
import { byFinishDesc } from '@/lib/derive'
import { plural } from '@/lib/format'

const { data } = await useAsyncData('books', () =>
	queryCollection('books').all(),
)

const books = computed<Book[]>(() => data.value ?? [])
const reading = computed(() =>
	books.value
		.filter((b) => b.status === 'reading')
		.sort((a, b) => (b.started_at ?? '').localeCompare(a.started_at ?? '')),
)
const upNext = computed(() =>
	books.value
		.filter((b) => b.status === 'to-read')
		.sort((a, b) => a.title.localeCompare(b.title)),
)
const shelf = computed(() =>
	books.value.filter((b) => b.status === 'read').sort(byFinishDesc),
)
</script>

<template>
  <PageHeader eyebrow="books.gritts.net" title="Books">
    <template #subtitle>
      <span class="tabular-nums">
        {{ plural(shelf.length, 'book') }} read · {{ reading.length }} reading ·
        {{ upNext.length }} to read
      </span>
    </template>
  </PageHeader>

  <Panel title="On the nightstand">
    <div class="grid gap-5">
      <section aria-labelledby="now-h">
        <Eyebrow id="now-h" as="h3" class="flex items-center gap-1.5">
          <BookOpen class="size-3.5 text-audiobook" aria-hidden="true" />
          Reading · {{ reading.length }}
        </Eyebrow>
        <BookRow v-for="b in reading" :key="b.slug" :book="b" />
        <EmptyState v-if="!reading.length" title="Nothing in progress" class="mt-3" />
      </section>
      <Separator />
      <section aria-labelledby="next-h">
        <Eyebrow id="next-h" as="h3" class="flex items-center gap-1.5">
          <Bookmark class="size-3.5" aria-hidden="true" />
          Up next · {{ upNext.length }}
        </Eyebrow>
        <BookRow v-for="b in upNext" :key="b.slug" :book="b" />
        <EmptyState v-if="!upNext.length" title="Nothing queued" class="mt-3" />
      </section>
    </div>
  </Panel>

  <Panel
    title="The shelf"
    :note="`${plural(shelf.length, 'book')} · newest finish first`"
  >
    <BookRow v-for="b in shelf" :key="b.slug" :book="b" />
    <EmptyState v-if="!shelf.length" title="No books finished">
      Read books land here, newest finish first.
    </EmptyState>
  </Panel>
</template>
