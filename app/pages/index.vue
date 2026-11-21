<script setup lang="ts">
import { Bookmark, BookOpen } from '@lucide/vue'
import { plural } from '@/lib/format'
import {
	finishBuckets,
	inYear,
	type LedgerYear,
	monthDay,
	tally,
	verdict,
	yearStats,
} from '@/lib/ledger'

const { all, finished, years, generatedAt, currentYear, currentMonth } =
	await useLedger()

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
const readCount = computed(
	() => all.value.filter((b) => b.status === 'read').length,
)

// ---- the year filter: scopes every panel below it -------------------------
const year = usePersisted<LedgerYear>(
	'books-year',
	years.value[0] ?? 'all',
	(raw) =>
		raw === 'all' ? 'all' : years.value.includes(+raw) ? +raw : undefined,
)
const isAll = computed(() => year.value === 'all')
const isCurrent = computed(() => year.value === currentYear)
const books = computed(() =>
	finished.value.filter((b) => inYear(b, year.value)),
)
const asOf = computed(() => {
	const n = plural(books.value.length, 'book')
	if (isAll.value)
		return `${n} finished, ${years.value.at(-1)}–${years.value[0]}`
	return isCurrent.value
		? `${n} finished as of ${monthDay(generatedAt)}`
		: `${n} finished`
})
const yearTally = computed(() => tally(books.value))
const goalVerdict = computed(() =>
	verdict(yearTally.value, {
		year: year.value,
		isCurrent: isCurrent.value,
		finished: finished.value,
	}),
)
const stats = computed(() => yearStats(books.value))
const months = computed(() =>
	finishBuckets(books.value, {
		year: year.value,
		years: years.value,
		currentMonth: isCurrent.value ? currentMonth : -1,
	}),
)
// The shelf under "All" keeps every read book, dated or not.
const shelf = computed(() =>
	isAll.value ? all.value.filter((b) => b.status === 'read') : books.value,
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
    </div>
  </Panel>

  <section
    aria-labelledby="ledger-h"
    class="mt-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-3"
  >
    <div class="grid gap-1">
      <Eyebrow>The ledger</Eyebrow>
      <h2 id="ledger-h" class="font-display font-semibold text-heading tabular-nums">
        {{ isAll ? 'All years' : year }}
      </h2>
      <p class="text-meta text-muted-foreground tabular-nums">{{ asOf }}</p>
    </div>
    <YearFilter v-model="year" :years="years" />
  </section>

  <LedgerGoal :tally="yearTally" :verdict="goalVerdict" :total="books.length" />

  <LedgerNumbers :stats="stats" />

  <LedgerMonths :buckets="months" :by-year="isAll" />

  <div class="grid gap-5 md:grid-cols-2">
    <LedgerRatings :books="books" />
  </div>

  <LedgerShelf :books="shelf" />
</template>
