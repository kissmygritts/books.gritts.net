<script setup lang="ts">
// One line about a book, for a hovered dot: title, author, finish, rating,
// tag, format.
import { AUTHOR_TAG_SINGLE, authorTag, type Book, RATING_MAX } from '@/lib/book'
import { authorList, longDate } from '@/lib/format'

const props = defineProps<{ book: Book }>()
const rest = computed(() => {
	const b = props.book
	return [
		b.finished_at ? `Finished ${longDate(b.finished_at)}` : 'No finish date',
		[
			b.rating ? `${b.rating}/${RATING_MAX}` : 'Unrated',
			AUTHOR_TAG_SINGLE[authorTag(b.white_male_author)].toLowerCase(),
			...(b.audible ? ['audiobook'] : []),
		].join(', '),
	]
		.map((s) => `${s}.`)
		.join(' ')
})
</script>

<template>
  <span class="tabular-nums">
    <span class="font-medium">{{ book.title }}</span>, {{ authorList(book.author) }}. {{ rest }}
  </span>
</template>
