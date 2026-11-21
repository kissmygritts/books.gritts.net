<script setup lang="ts">
// One book as one dot, the site's only mark. Solid: everyone else. Ring: a
// white man. A small pip: untagged. Ink is currentColor, so a dot takes the
// surface it sits on.
import { cva } from 'class-variance-authority'
import { type AuthorTag, authorTag } from '@/lib/book'

const props = withDefaults(
	defineProps<{
		/** A book's `white_male_author`; or pass `tag` directly. */
		value?: boolean | null
		tag?: AuthorTag
		/** `md` is the site's `--dot`; `grid` takes it from the home grid's `dot-grid`. */
		size?: 'grid' | 'md' | 'sm'
	}>(),
	{ size: 'md' },
)

const dot = cva('relative block shrink-0 rounded-full border-dot', {
	variants: {
		tag: {
			other: 'border-current bg-current',
			wm: 'border-current',
			untagged: 'border-transparent',
		},
		size: { grid: '', md: 'size-(--dot)', sm: 'size-2.5' },
	},
})
const t = computed(() => props.tag ?? authorTag(props.value))
</script>

<template>
  <span :class="dot({ tag: t, size })" aria-hidden="true">
    <span
      v-if="t === 'untagged'"
      class="absolute inset-0 m-auto size-1 rounded-full bg-current"
    />
  </span>
</template>
