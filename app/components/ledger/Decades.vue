<script setup lang="ts">
// When it was published, by decade.
import type { BarRow } from '@/lib/chart'
import { plural } from '@/lib/format'
import { decades, type LedgerBook } from '@/lib/ledger'

const props = defineProps<{ books: LedgerBook[] }>()

const rows = computed<BarRow[]>(() =>
	decades(props.books).map((d) => ({
		key: d.key,
		label: `${d.key}s`,
		segments: [{ tone: 'chart-1', value: d.books.length }],
		value: d.books.length,
		tip: {
			title: `Published in the ${d.key}s`,
			meta: [plural(d.books.length, 'book')],
			books: d.books.map((b) => b.title),
		},
	})),
)
</script>

<template>
  <Panel title="When it was published" note="books by decade">
    <ChartBars :rows="rows" empty="No publication years recorded." />
  </Panel>
</template>
