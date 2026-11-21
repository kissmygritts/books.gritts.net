<script setup lang="ts">
import { plural } from '@/lib/format'
import {
	finishBuckets,
	inYear,
	monthDay,
	tally,
	verdict,
	yearStats,
} from '@/lib/ledger'

useHead({ title: 'Dashboard · Books' })

const { finished, years, generatedAt, currentYear, currentMonth } =
	await useLedger()

// ---- the year filter: scopes every panel below it -------------------------
const year = useLedgerYear(years)
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
</script>

<template>
  <PageHeader eyebrow="books.gritts.net" title="Dashboard">
    <template #actions>
      <SiteNav />
    </template>
  </PageHeader>

  <section
    aria-labelledby="ledger-h"
    class="flex flex-wrap items-end justify-between gap-x-6 gap-y-3"
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
    <LedgerDecades :books="books" />
  </div>

  <LedgerGenres :books="books" />

  <LedgerAuthors :books="books" />

  <LedgerPlaces :books="books" />

  <LedgerYears v-if="!isAll" v-model="year" :finished="finished" :years="years" />
</template>
