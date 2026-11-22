<script setup lang="ts">
// The year in numbers: books, pages, average rating and days per book.
import { formatNumber, plural } from '@/lib/format'
import { type LedgerBook, type LedgerYear, yearStats } from '@/lib/ledger'

const props = defineProps<{
	books: LedgerBook[]
	years: number[]
	/** "Every book with a finish date, 2018–2026." */
	caption: string
}>()
const year = defineModel<LedgerYear>('year', { required: true })

const s = computed(() => yearStats(props.books))
const rated = computed(() => props.books.filter((b) => b.rating).length)
const scope = computed(() =>
	year.value === 'all' ? 'every year' : `in ${year.value}`,
)
</script>

<template>
  <DashPage id="numbers" v-model:year="year" title="By the numbers" :caption="caption" :years="years">
    <StatGrid label="The year in numbers">
      <StatTile :value="s.books" :label="`books finished ${scope}`" />
      <StatTile :value="formatNumber(s.pages)" label="pages" />
      <StatTile
        :value="s.avgRating"
        suffix="/8"
        :label="rated ? `average rating, from ${plural(rated, 'rated book')}` : 'average rating: nothing rated'"
      />
      <StatTile :value="s.medianDays" label="days to finish a book, the median" />
    </StatGrid>
  </DashPage>
</template>
