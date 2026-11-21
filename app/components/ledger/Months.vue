<script setup lang="ts">
// Books finished by month (by year under "All"), colored by author tag or
// by format.
import { AUTHOR_TAG_LABEL } from '@/lib/book'
import type { Column, Series } from '@/lib/chart'
import { formatNumber, plural } from '@/lib/format'
import {
	type Bucket,
	FORMAT_KEYS,
	FORMAT_LABEL,
	type Format,
	formatTally,
	sumPages,
	TAG_KEYS,
	tally,
} from '@/lib/ledger'
import type { Tone } from '@/lib/tone'

const props = defineProps<{ buckets: Bucket[]; byYear: boolean }>()

type Mode = 'tag' | 'format'
const mode = usePersisted<Mode>('books-month-mode', 'tag', (r) =>
	r === 'tag' || r === 'format' ? r : undefined,
)

const FORMAT_TONE: Record<Format, Tone> = {
	audiobook: 'audiobook',
	print: 'print',
	unknown: 'untagged',
}
const series = computed<Series[]>(() =>
	mode.value === 'format'
		? FORMAT_KEYS.map((k) => ({ key: k, tone: FORMAT_TONE[k] }))
		: TAG_KEYS.map((k) => ({ key: k, tone: k })),
)
const parts = (bs: Bucket['books']): Record<string, number> =>
	mode.value === 'format' ? formatTally(bs) : tally(bs)

const columns = computed<Column[]>(() =>
	props.buckets.map((b) => ({
		key: b.key,
		label: b.label,
		current: b.current,
		parts: parts(b.books),
		aria: `${b.name}: ${plural(b.books.length, 'book')}`,
		tip: {
			title: b.name,
			meta: [
				plural(b.books.length, 'book'),
				`${formatNumber(sumPages(b.books))} pp`,
			],
			books: b.books.map((x) => x.title),
		},
	})),
)
const legend = computed(() => {
	const all = props.buckets.flatMap((b) => b.books)
	if (mode.value === 'format') {
		const t = formatTally(all)
		return FORMAT_KEYS.map((k) => ({
			tone: FORMAT_TONE[k],
			label: FORMAT_LABEL[k],
			value: t[k],
		}))
	}
	const t = tally(all)
	return TAG_KEYS.map((k) => ({
		tone: k,
		label: AUTHOR_TAG_LABEL[k],
		value: t[k],
	}))
})
const title = computed(() =>
	props.byYear ? 'Books finished by year' : 'Books finished by month',
)
</script>

<template>
  <Panel :title="title">
    <template #head>
      <SegmentedControl
        v-model="mode"
        label="Color by"
        :options="[
          { value: 'tag', label: 'Author' },
          { value: 'format', label: 'Format' },
        ]"
      />
    </template>
    <template #aside>
      <Legend :items="legend" />
    </template>
    <ChartColumns
      :columns="columns"
      :series="series"
      :label="`${title}, in books`"
      :max-titles="15"
    />
  </Panel>
</template>
