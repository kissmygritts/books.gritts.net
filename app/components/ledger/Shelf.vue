<script setup lang="ts">
// The shelf: the year's finished books, sortable as in the ledger's table.
// Under "All" it holds every read book, undated finishes last.
import { ArrowDown, ArrowUp } from '@lucide/vue'
import { authorTag, type Book } from '@/lib/book'
import { byFinishDesc } from '@/lib/derive'
import { plural } from '@/lib/format'

const props = defineProps<{ books: Book[] }>()

type Key = 'finished' | 'rating' | 'pages' | 'title' | 'author' | 'tag'
const OPTIONS: { value: Key; label: string }[] = [
	{ value: 'finished', label: 'Finished' },
	{ value: 'rating', label: 'Rating' },
	{ value: 'pages', label: 'Pages' },
	{ value: 'title', label: 'Title' },
	{ value: 'author', label: 'Author' },
	{ value: 'tag', label: 'Author tag' },
]
const ASCENDING: Key[] = ['title', 'author']

const key = ref<Key>('finished')
const dir = ref<1 | -1>(-1)
watch(key, (k) => {
	dir.value = ASCENDING.includes(k) ? 1 : -1
})

const sortKey: Record<Key, (b: Book) => string | number> = {
	finished: (b) => b.finished_at ?? '',
	rating: (b) => b.rating ?? -1,
	pages: (b) => b.pages ?? -1,
	title: (b) => b.title.toLowerCase(),
	author: (b) => (b.author?.[0] ?? '').toLowerCase(),
	tag: (b) => authorTag(b.white_male_author),
}

const rows = computed(() => {
	if (key.value === 'finished' && dir.value === -1)
		return [...props.books].sort(byFinishDesc)
	const k = sortKey[key.value]
	return [...props.books].sort((a, b) => {
		const ka = k(a)
		const kb = k(b)
		return (ka > kb ? 1 : ka < kb ? -1 : 0) * dir.value
	})
})
const undated = computed(() => props.books.filter((b) => !b.finished_at).length)
const label = computed(
	() => OPTIONS.find((o) => o.value === key.value)?.label.toLowerCase() ?? '',
)
</script>

<template>
  <Panel title="The shelf">
    <template #head>
      <SegmentedControl
        v-model="key"
        :options="OPTIONS"
        label="Sort by"
        @repeat="dir = dir === 1 ? -1 : 1"
      >
        <template #suffix="{ active }">
          <template v-if="active">
            <ArrowDown v-if="dir === -1" class="size-3" aria-label="descending" />
            <ArrowUp v-else class="size-3" aria-label="ascending" />
          </template>
        </template>
      </SegmentedControl>
    </template>
    <template #aside>
      <span class="text-faint text-xs tabular-nums">
        {{ plural(books.length, 'book') }}<template v-if="undated">
          · {{ undated }} without a finish date</template
        >
        · by {{ label }}
      </span>
    </template>
    <BookRow v-for="b in rows" :key="b.slug" :book="b" />
    <EmptyState v-if="!books.length" title="No books finished">
      Read books land here, newest finish first.
    </EmptyState>
  </Panel>
</template>
