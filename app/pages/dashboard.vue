<script setup lang="ts">
// The dashboard: one chart per full-height page, all on the field, every
// book a dot. The year filter repeats on each page and is shared with
// /books.
import { finishBuckets, inYear, monthDay } from '@/lib/ledger'

useHead({
	title: 'Dashboard · Gritts Books',
	bodyAttrs: { class: 'bg-field text-field-foreground' },
})

const { finished, years, generatedAt, currentYear, currentMonth } =
	await useLedger()

const year = useLedgerYear(years)
const isCurrent = computed(() => year.value === currentYear)
const books = computed(() =>
	finished.value.filter((b) => inYear(b, year.value)),
)
const months = computed(() =>
	finishBuckets(books.value, {
		year: year.value,
		years: years.value,
		currentMonth: isCurrent.value ? currentMonth : -1,
	}),
)
const numbersCaption = computed(() =>
	year.value === 'all'
		? `Every book with a finish date, ${years.value.at(-1)}–${years.value[0]}. Read books without one are on the Books page.`
		: isCurrent.value
			? `${year.value} as of ${monthDay(generatedAt)}.`
			: `Every book finished in ${year.value}.`,
)
</script>

<template>
  <h1 class="sr-only">Dashboard</h1>
  <LedgerGoal
    v-model:year="year"
    :books="books"
    :finished="finished"
    :years="years"
    :is-current="isCurrent"
  />
  <LedgerNumbers v-model:year="year" :books="books" :years="years" :caption="numbersCaption" />
  <LedgerMonths v-model:year="year" :buckets="months" :years="years" />
  <LedgerRatings v-model:year="year" :books="books" :years="years" />
  <LedgerDecades v-model:year="year" :books="books" :years="years" />
  <LedgerGenres v-model:year="year" :books="books" :years="years" />
  <LedgerAuthors v-model:year="year" :books="books" :years="years" />
  <LedgerPlaces v-model:year="year" :books="books" :years="years" />
</template>
