<script setup lang="ts">
// The yearly goal: more books by everyone else than by white men. Three
// rows of dots, grouped and labelled by the current lens; the caption
// gives solid minus ring.
import type { AuthorTag } from '@/lib/book'
import { plural } from '@/lib/format'
import type { LedgerBook, LedgerYear } from '@/lib/ledger'

const props = defineProps<{ books: LedgerBook[]; years: number[] }>()
const year = defineModel<LedgerYear>('year', { required: true })
const { lens } = useLens()

const ORDER: AuthorTag[] = ['other', 'wm', 'untagged']
const groups = computed(() => {
	const g: Record<AuthorTag, LedgerBook[]> = { other: [], wm: [], untagged: [] }
	for (const b of props.books) g[lens.value.tag(b)].push(b)
	return g
})
const rows = computed(() =>
	ORDER.map((k) => ({
		key: k,
		label: lens.value.label[k],
		sub: plural(groups.value[k].length, 'book'),
		books: groups.value[k],
	})),
)
// Solid minus ring, signed: "+14 books", "−3 books", "±0 books".
const diff = computed(() => {
	const n = groups.value.other.length - groups.value.wm.length
	return `${n > 0 ? '+' : n < 0 ? '−' : '±'}${plural(Math.abs(n), 'book')}`
})
const caption = computed(() => {
	const l = lens.value.label
	const lead =
		lens.value.id === 'wm'
			? 'Every year I set a goal. Not a book count: I try to read more books by everyone else than by white men.'
			: `${l.other} against ${l.wm.toLowerCase()}.`
	return `${lead} ${diff.value}. ${l.untagged} counts toward neither.`
})
</script>

<template>
  <DashPage id="goal" v-model:year="year" legend title="Annual goal" :caption="caption" :years="years">
    <DotRows :rows="rows" />
  </DashPage>
</template>
