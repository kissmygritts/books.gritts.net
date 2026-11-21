<script setup lang="ts">
// The year in numbers: books, pages, average rating, days per book, and the
// audiobook share.
import { formatNumber, plural } from '@/lib/format'
import {
	formatTally,
	type LedgerBook,
	type LedgerYear,
	yearStats,
} from '@/lib/ledger'

const props = defineProps<{
	books: LedgerBook[]
	years: number[]
	/** "Every book with a finish date, 2018–2026." */
	caption: string
}>()
const year = defineModel<LedgerYear>('year', { required: true })

const s = computed(() => yearStats(props.books))
const rated = computed(() => props.books.filter((b) => b.rating).length)
const fmt = computed(() => formatTally(props.books))
const known = computed(() => fmt.value.audiobook + fmt.value.print)
const share = computed(() =>
	known.value ? Math.round((fmt.value.audiobook / known.value) * 100) : null,
)
const scope = computed(() =>
	year.value === 'all' ? 'every year' : `in ${year.value}`,
)
</script>

<template>
  <DashPage id="numbers" v-model:year="year" title="In numbers" :caption="caption" :years="years">
    <StatGrid label="The year in numbers">
      <StatTile :value="s.books" :label="`books finished ${scope}`" />
      <StatTile :value="formatNumber(s.pages)" label="pages" />
      <StatTile
        :value="s.avgRating"
        suffix="/8"
        :label="rated ? `average rating, from ${plural(rated, 'rated book')}` : 'average rating: nothing rated'"
      />
      <StatTile :value="s.medianDays" label="days to finish a book, the median" />
      <StatTile
        :value="share"
        suffix="%"
        :label="`audiobooks: ${fmt.audiobook} of ${plural(known, 'book')} with a format recorded`"
      />
    </StatGrid>
  </DashPage>
</template>
