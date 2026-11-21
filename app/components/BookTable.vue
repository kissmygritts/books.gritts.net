<script setup lang="ts">
// The books on /books, one row each: cover, title and author, a date,
// pages, rating, author tag. Finished books sort by finish, rating or
// pages; the other lists keep the order they are given.
import { ArrowDown, ArrowUp } from '@lucide/vue'
import type { Book, BookStatus } from '@/lib/book'
import { byFinishDesc } from '@/lib/derive'
import { authorList, longDate, plural } from '@/lib/format'

const props = defineProps<{ books: Book[]; status: BookStatus }>()

type Key = 'finished' | 'rating' | 'pages'
const SORTS: { value: Key; label: string }[] = [
	{ value: 'finished', label: 'Finished' },
	{ value: 'rating', label: 'Rating' },
	{ value: 'pages', label: 'Pages' },
]
const key = ref<Key>('finished')
const dir = ref<1 | -1>(-1)
function sortBy(k: Key) {
	if (key.value === k) dir.value = dir.value === 1 ? -1 : 1
	else {
		key.value = k
		dir.value = -1
	}
}
watch(key, () => {
	dir.value = -1
})

const sortable = computed(() => props.status === 'read')
const sortKey: Record<Key, (b: Book) => string | number> = {
	finished: (b) => b.finished_at ?? '',
	rating: (b) => b.rating ?? -1,
	pages: (b) => b.pages ?? -1,
}
const rows = computed(() => {
	if (!sortable.value) return props.books
	if (key.value === 'finished' && dir.value === -1)
		return [...props.books].sort(byFinishDesc)
	const k = sortKey[key.value]
	return [...props.books].sort((a, b) => {
		const ka = k(a)
		const kb = k(b)
		return (
			(ka > kb ? 1 : ka < kb ? -1 : 0) * dir.value ||
			a.title.localeCompare(b.title)
		)
	})
})

const dateLabel = computed(() =>
	props.status === 'read'
		? 'Finished'
		: props.status === 'to-read'
			? 'Published'
			: 'Started',
)
function dateOf(b: Book): string {
	if (props.status === 'read')
		return b.finished_at ? longDate(b.finished_at) : 'No date'
	if (props.status === 'to-read')
		return b.publication_year ? String(b.publication_year) : '–'
	return b.started_at ? longDate(b.started_at) : 'No date'
}
</script>

<template>
  <div class="@container">
    <SegmentedControl
      v-if="sortable"
      v-model="key"
      :options="SORTS"
      label="Sort by"
      class="mb-5 text-sm @4xl:hidden"
      @repeat="dir = dir === 1 ? -1 : 1"
    >
      <template #suffix="{ active }">
        <template v-if="active">
          <ArrowDown v-if="dir === -1" class="size-3" aria-label="descending" />
          <ArrowUp v-else class="size-3" aria-label="ascending" />
        </template>
      </template>
    </SegmentedControl>

    <ul class="border-border border-t">
      <li
        class="grid grid-cols-book items-center gap-x-5 border-border border-b py-2.5 text-meta @max-4xl:hidden"
      >
        <span />
        <span>Title and author</span>
        <template v-for="c in [{ k: 'finished', l: dateLabel }, { k: 'pages', l: 'Pages' }, { k: 'rating', l: 'Rating' }] as const" :key="c.k">
          <button
            v-if="sortable"
            type="button"
            :aria-pressed="key === c.k"
            :aria-label="`Sort by ${c.l.toLowerCase()}${key === c.k ? (dir === -1 ? ', descending' : ', ascending') : ''}`"
            :class="['flex items-center gap-1.5 text-left', key === c.k && 'font-medium']"
            @click="sortBy(c.k)"
          >
            {{ c.l }}
            <template v-if="key === c.k">
              <ArrowDown v-if="dir === -1" class="size-3" />
              <ArrowUp v-else class="size-3" />
            </template>
          </button>
          <span v-else>{{ c.l }}</span>
        </template>
        <span>Author</span>
      </li>
      <li
        v-for="b in rows"
        :key="b.slug"
        class="grid grid-cols-book items-center gap-x-5 gap-y-1.5 border-rule border-b py-2.75"
      >
        <BookCover :src="b.cover_image" :title="b.title" decorative class="@max-4xl:row-span-5 @max-4xl:self-start" />
        <div class="min-w-0 @max-4xl:col-span-2">
          <p class="font-normal text-heading">{{ b.title }}</p>
          <p class="text-meta">{{ authorList(b.author) }}</p>
        </div>
        <span class="text-sm tabular-nums @max-4xl:col-span-2">
          <span class="@4xl:sr-only">{{ `${dateLabel} ` }}</span>{{ dateOf(b) }}
        </span>
        <span class="text-sm tabular-nums @max-4xl:col-span-2">
          {{ b.pages ? plural(b.pages, 'page') : 'Pages unknown' }}
        </span>
        <RatingBadge :rating="b.rating" class="@max-4xl:col-span-2" />
        <span class="flex flex-wrap items-center gap-2 @max-4xl:col-span-2">
          <AuthorTag :value="b.white_male_author" />
          <Badge v-if="b.audible">Audiobook</Badge>
        </span>
      </li>
    </ul>
    <EmptyState v-if="!books.length" title="No books here">
      Pick another year or list above.
    </EmptyState>
  </div>
</template>
