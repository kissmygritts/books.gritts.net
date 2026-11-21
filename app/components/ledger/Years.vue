<script setup lang="ts">
// Every year, stacked by author tag. A column opens its year.
import type { Column } from '@/lib/chart'
import { plural } from '@/lib/format'
import {
	inYear,
	type LedgerBook,
	type LedgerYear,
	TAG_KEYS,
	tally,
} from '@/lib/ledger'

const props = defineProps<{ finished: LedgerBook[]; years: number[] }>()
const year = defineModel<LedgerYear>({ required: true })

const columns = computed<Column[]>(() =>
	[...props.years].reverse().map((y) => {
		const bs = props.finished.filter((b) => inYear(b, y))
		const t = tally(bs)
		const lines: string[] = []
		if (t.other + t.wm)
			lines.push(`Everyone else ${t.other} · White men ${t.wm}`)
		if (t.untagged) lines.push(`Not tagged ${t.untagged}`)
		return {
			key: String(y),
			label: `’${String(y).slice(2)}`,
			current: y === year.value,
			parts: t,
			aria: `${y}: ${plural(bs.length, 'book')}`,
			tip: { title: String(y), meta: [plural(bs.length, 'book')], lines },
		}
	}),
)
</script>

<template>
  <Panel
    title="Every year"
    note="Books per year. Click a year to open it. Grey books are not tagged yet."
  >
    <ChartColumns
      :columns="columns"
      :series="TAG_KEYS.map((k) => ({ key: k, tone: k }))"
      :height="160"
      label="Books finished each year"
      interactive
      @pick="(c) => (year = +c.key)"
    />
  </Panel>
</template>
