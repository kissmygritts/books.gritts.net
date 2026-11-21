<script setup lang="ts">
import { Bookmark, BookOpen } from '@lucide/vue'
import { plural } from '@/lib/format'
import { inYear, tally } from '@/lib/ledger'

const { all, finished, years, currentYear } = await useLedger()

const reading = computed(() =>
	all.value
		.filter((b) => b.status === 'reading')
		.sort((a, b) => (b.started_at ?? '').localeCompare(a.started_at ?? '')),
)
const upNext = computed(() =>
	all.value
		.filter((b) => b.status === 'to-read')
		.sort((a, b) => a.title.localeCompare(b.title)),
)
// The ledger's projection, always against the current year: the nightstand
// sits above the year filter, so it doesn't follow it.
const projection = computed(() => {
	const q = tally(upNext.value)
	if (!upNext.value.length) return ''
	const t = tally(finished.value.filter((b) => inYear(b, currentYear)))
	return (
		`Up next: ${q.other} by everyone else, ${q.wm} by white men${q.untagged ? `, ${q.untagged} untagged` : ''}. ` +
		`Reading them all this year would end ${currentYear} at ${t.other + q.other} vs ${t.wm + q.wm}.`
	)
})
const readCount = computed(
	() => all.value.filter((b) => b.status === 'read').length,
)

// ---- the reading list: the shelf, scoped by the shared year filter --------
const year = useLedgerYear(years)
const isAll = computed(() => year.value === 'all')
// Under "All" the shelf keeps every read book, dated or not.
const shelf = computed(() =>
	isAll.value
		? all.value.filter((b) => b.status === 'read')
		: finished.value.filter((b) => inYear(b, year.value)),
)
</script>

<template>
  <PageHeader eyebrow="books.gritts.net" title="Books">
    <template #subtitle>
      <span class="tabular-nums">
        {{ plural(readCount, 'book') }} read · {{ reading.length }} reading ·
        {{ upNext.length }} to read
      </span>
    </template>
    <template #actions>
      <SiteNav />
    </template>
  </PageHeader>

  <Panel title="On the nightstand">
    <div class="grid gap-5">
      <section aria-labelledby="now-h">
        <Eyebrow id="now-h" as="h3" class="flex items-center gap-1.5">
          <BookOpen class="size-3.5" aria-hidden="true" />
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
      <p v-if="projection" class="text-meta text-muted-foreground tabular-nums">
        {{ projection }}
      </p>
    </div>
  </Panel>

  <section
    aria-labelledby="list-h"
    class="mt-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-3"
  >
    <div class="grid gap-1">
      <Eyebrow>Reading list</Eyebrow>
      <h2 id="list-h" class="font-display font-semibold text-heading tabular-nums">
        {{ isAll ? 'All years' : year }}
      </h2>
      <p class="text-meta text-muted-foreground tabular-nums">
        {{ plural(shelf.length, 'book') }} read
      </p>
    </div>
    <YearFilter v-model="year" :years="years" />
  </section>

  <LedgerShelf :books="shelf" />
</template>
