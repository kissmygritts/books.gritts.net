<script setup lang="ts">
// Most read authors: the top 12 in two columns, colored by author tag.
import { authorTag } from '@/lib/book'
import type { BarRow } from '@/lib/chart'
import { plural } from '@/lib/format'
import { authorGroups, avgRating, fixed1, type LedgerBook } from '@/lib/ledger'

const props = defineProps<{ books: LedgerBook[] }>()

const groups = computed(() => authorGroups(props.books))
const note = computed(() => {
	const n = groups.value.length
	if (!n) return ''
	const repeat = groups.value.filter((g) => g.books.length > 1).length
	return `${plural(n, 'author')} · ${repeat} with 2+ books · avg /8`
})
const top = computed(() => groups.value.slice(0, 12))
const max = computed(() => Math.max(1, ...top.value.map((g) => g.books.length)))
const rows = computed<BarRow[]>(() =>
	top.value.map((g) => {
		const avg = fixed1(avgRating(g.books))
		return {
			key: g.key,
			label: g.key,
			segments: [
				{
					tone: authorTag(g.books[0]?.white_male_author),
					value: g.books.length,
				},
			],
			value: g.books.length,
			avg,
			tip: {
				title: g.key,
				meta: [
					plural(g.books.length, 'book'),
					...(avg ? [`avg ${avg}/8`] : []),
				],
				books: g.books.map((b) => b.title),
			},
		}
	}),
)
const halves = computed(() => {
	const half = Math.ceil(rows.value.length / 2)
	return [rows.value.slice(0, half), rows.value.slice(half)]
})
</script>

<template>
  <Panel title="Most read authors" :note="note">
    <div v-if="rows.length" class="grid gap-x-8 gap-y-2 sm:grid-cols-2">
      <ChartBars v-for="(h, i) in halves.filter((x) => x.length)" :key="i" :rows="h" :max="max" wide />
    </div>
    <p v-else class="py-6 text-center text-faint text-meta">No books finished.</p>
  </Panel>
</template>
