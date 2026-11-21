<script setup lang="ts">
// What it was: the fiction / non-fiction split, then each side's top genres,
// stacked by author tag, with the average rating.
import { AUTHOR_TAG_LABEL } from '@/lib/book'
import type { BarRow } from '@/lib/chart'
import { plural } from '@/lib/format'
import {
	avgRating,
	fixed1,
	genreGroups,
	isNonFiction,
	type LedgerBook,
	TAG_KEYS,
	tally,
} from '@/lib/ledger'

const props = defineProps<{ books: LedgerBook[] }>()

const nonFiction = computed(() => props.books.filter(isNonFiction))
const fiction = computed(() => props.books.filter((b) => !isNonFiction(b)))
const share = (n: number) => ({
	'--share': `${(n / (props.books.length || 1)) * 100}%`,
})

const legend = computed(() => {
	const t = tally(props.books)
	return TAG_KEYS.filter((k) => t[k]).map((k) => ({
		tone: k,
		label: AUTHOR_TAG_LABEL[k],
	}))
})

function side(label: string, bs: LedgerBook[]) {
	const groups = genreGroups(bs)
	const max = Math.max(1, ...groups.map((g) => g.books.length))
	const rows: BarRow[] = groups.map((g) => {
		const t = tally(g.books)
		const avg = fixed1(avgRating(g.books))
		return {
			key: g.key,
			label: g.key,
			segments: TAG_KEYS.map((k) => ({ tone: k, value: t[k] })),
			value: g.books.length,
			avg,
			tip: {
				title: g.key,
				meta: [
					plural(g.books.length, 'book'),
					...(avg ? [`avg ${avg}/8`] : []),
				],
				lines: [
					`Everyone else ${t.other} · White men ${t.wm}${t.untagged ? ` · Not tagged ${t.untagged}` : ''}`,
				],
				books: g.books.map((b) => b.title),
			},
		}
	})
	return { label, count: bs.length, avg: fixed1(avgRating(bs)), rows, max }
}
const sides = computed(() => [
	side('Fiction', fiction.value),
	side('Non-fiction', nonFiction.value),
])
</script>

<template>
  <Panel title="What it was">
    <template #aside>
      <Legend :items="legend" />
    </template>

    <div v-if="books.length" class="mb-5 grid gap-2.5">
      <div class="flex h-7 gap-0.5 overflow-hidden rounded-md" aria-hidden="true">
        <span
          v-if="fiction.length"
          class="flex h-full w-share shrink-0 items-center overflow-hidden whitespace-nowrap bg-muted-foreground px-2.5 font-semibold text-background text-xs"
          :style="share(fiction.length)"
          >Fiction</span
        >
        <span
          v-if="nonFiction.length"
          class="flex h-full w-share shrink-0 items-center overflow-hidden whitespace-nowrap bg-border px-2.5 font-semibold text-foreground text-xs"
          :style="share(nonFiction.length)"
          >Non-fiction</span
        >
      </div>
      <div class="flex flex-wrap justify-between gap-2.5 text-meta text-muted-foreground tabular-nums">
        <span>{{ fiction.length }} fiction</span>
        <span>{{ nonFiction.length }} non-fiction</span>
      </div>
    </div>

    <div class="grid gap-x-8 gap-y-5 sm:grid-cols-2">
      <section v-for="s in sides" :key="s.label" :aria-label="s.label">
        <h3 class="mb-2.5 flex justify-between gap-2">
          <Eyebrow as="span" class="tabular-nums">{{ s.label }} · {{ s.count }}</Eyebrow>
          <span v-if="s.avg" class="font-mono text-faint text-label tabular-nums">
            avg {{ s.avg }}/8
          </span>
        </h3>
        <ChartBars
          :rows="s.rows"
          :max="s.max"
          wide
          :empty="`No ${s.label.toLowerCase()} this year.`"
        />
      </section>
    </div>
  </Panel>
</template>
