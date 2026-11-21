<script setup lang="ts">
// Ratings on the owner's 1–8 scale.
import type { Column } from '@/lib/chart'
import { plural } from '@/lib/format'
import { type LedgerBook, ratingBuckets } from '@/lib/ledger'

const props = defineProps<{ books: LedgerBook[] }>()

const columns = computed<Column[]>(() =>
	ratingBuckets(props.books).map((b) => ({
		key: b.key,
		label: b.label,
		parts: { r: b.books.length },
		aria: `${b.name}: ${plural(b.books.length, 'book')}`,
		tip: {
			title: b.name,
			meta: [plural(b.books.length, 'book')],
			books: b.books.map((x) => x.title),
		},
	})),
)
</script>

<template>
  <Panel title="Ratings" note="books · your 1–8 scale">
    <ChartColumns
      :columns="columns"
      :series="[{ key: 'r', tone: 'chart-1' }]"
      :height="150"
      label="Books by rating, on a 1–8 scale"
    />
  </Panel>
</template>
