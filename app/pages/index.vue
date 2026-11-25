<script setup lang="ts">
// Home: every finished book as one dot, then the dashboard below it, one
// chart per full-height section. The grid covers every year; the year
// filter starts with the charts and is shared with /books.
import { ArrowDown } from '@lucide/vue'
import { byFinishDesc } from '@/lib/derive'
import { finishBuckets, inYear, monthDay } from '@/lib/ledger'

useHead({
	// Proximity on a phone, where a section can be taller than the screen.
	htmlAttrs: { class: 'snap-y snap-proximity sm:snap-mandatory' },
	bodyAttrs: { class: 'bg-field text-field-foreground' },
})

const { finished, years, generatedAt, currentYear, currentMonth } =
	await useLedger()

const all = computed(() => [...finished.value].sort(byFinishDesc))

const year = useLedgerYear(years, currentYear)
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
const cue = computed(() =>
	year.value === 'all' ? 'Every year by the numbers' : `${year.value} by the numbers`,
)

function toNumbers() {
	const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
	document
		.getElementById('numbers')
		?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
	history.replaceState(history.state, '', '#numbers')
}
</script>

<template>
  <ScrollDots />
  <section id="books" class="snap-start snap-always">
    <DotGrid :books="all" :until="currentYear">
      <a
        href="#numbers"
        class="inline-flex items-center gap-1.5 underline-offset-4 hover:underline"
        @click.prevent="toNumbers"
      >
        {{ cue }}
        <ArrowDown class="size-4" :stroke-width="1.75" aria-hidden="true" />
      </a>
    </DotGrid>
  </section>
  <LedgerNumbers v-model:year="year" :books="books" :years="years" :caption="numbersCaption" />
  <LedgerGoal v-model:year="year" :books="books" :years="years" />
  <LedgerMonths v-model:year="year" :buckets="months" :years="years" />
  <LedgerRatings v-model:year="year" :books="books" :years="years" />
  <LedgerLength v-model:year="year" :books="books" :years="years" />
  <LedgerDays v-model:year="year" :books="books" :years="years" />
  <LedgerDecades v-model:year="year" :books="books" :years="years" />
  <LedgerAge v-model:year="year" :books="books" :years="years" />
  <LedgerGenres v-model:year="year" :books="books" :years="years" />
  <LedgerAuthors v-model:year="year" :books="books" :years="years" />
  <LedgerMap v-model:year="year" :books="books" :years="years" />
</template>
