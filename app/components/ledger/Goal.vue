<script setup lang="ts">
// The yearly goal: more books by everyone else than by white men. The
// verdict, then the three groups as rows of dots.
import { AUTHOR_TAG_LABEL } from '@/lib/book'
import { plural } from '@/lib/format'
import {
	type LedgerBook,
	type LedgerYear,
	TAG_KEYS,
	tally,
	verdict,
} from '@/lib/ledger'

const props = defineProps<{
	books: LedgerBook[]
	finished: LedgerBook[]
	years: number[]
	isCurrent: boolean
}>()
const year = defineModel<LedgerYear>('year', { required: true })

const t = computed(() => tally(props.books))
const text = computed(() => {
	const v = verdict(t.value, {
		year: year.value,
		isCurrent: props.isCurrent,
		finished: props.finished,
	})
	switch (v.kind) {
		case 'years':
			return `Goal met in ${v.met} of ${plural(v.of, 'year')}`
		case 'untagged':
			return 'No tagged books yet'
		case 'met':
			return props.isCurrent
				? `Ahead by ${plural(v.by, 'book')}`
				: `Goal met in ${year.value}, by ${plural(v.by, 'book')}`
		case 'behind':
			return `Behind: ${plural(v.by, 'more book')} by everyone else to pull ahead`
		case 'missed':
			return `Goal missed in ${year.value}: ${plural(v.by, 'more book')} by everyone else would have met it`
	}
	return ''
})
const rows = computed(() =>
	TAG_KEYS.map((k) => ({
		key: k,
		label: AUTHOR_TAG_LABEL[k],
		sub: plural(t.value[k], 'book'),
		books: props.books.filter((b) =>
			k === 'other'
				? b.white_male_author === false
				: k === 'wm'
					? b.white_male_author === true
					: b.white_male_author == null,
		),
	})),
)
const caption = computed(
	() =>
		'Every year I set a goal. Not a book count: I try to read more books by everyone else than by white men. Untagged books count toward neither.' +
		(year.value === 'all' ? ' Under All, each year is judged on its own.' : ''),
)
</script>

<template>
  <DashPage id="goal" v-model:year="year" title="Annual goal" :caption="caption" :years="years">
    <p class="mb-8 max-w-4xl font-extralight text-verdict tabular-nums sm:mb-14">{{ text }}</p>
    <DotRows :rows="rows" fixed />
  </DashPage>
</template>
