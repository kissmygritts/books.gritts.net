<script setup lang="ts">
import { AvatarFallback, AvatarImage, AvatarRoot } from 'reka-ui'

const props = withDefaults(
	defineProps<{
		src?: string | null
		title: string
		size?: 'sm' | 'md' | 'lg'
		/** Set when the title is printed next to the cover (rows, cards). */
		decorative?: boolean
	}>(),
	{ size: 'md', decorative: false },
)

const SIZE = {
	sm: { root: 'w-10', text: 'text-meta' },
	md: { root: 'w-16', text: 'text-heading' },
	lg: { root: 'w-28', text: 'text-stat' },
} as const

const initials = computed(() =>
	props.title
		.replace(/^(the|a|an)\s+/i, '')
		.split(/\s+/)
		.filter((w) => /^[\p{L}\p{N}]/u.test(w))
		.slice(0, 2)
		.map((w) => w[0]?.toUpperCase())
		.join(''),
)
</script>

<template>
  <AvatarRoot
    :class="[
      'relative inline-flex aspect-2/3 shrink-0 overflow-hidden rounded-sm bg-muted ring-1 ring-edge',
      SIZE[size].root,
    ]"
  >
    <AvatarImage
      v-if="src"
      :src="src"
      :alt="decorative ? '' : `Cover of ${title}`"
      loading="lazy"
      referrerpolicy="no-referrer"
      class="size-full object-cover"
    />
    <AvatarFallback
      :class="[
        'flex size-full items-center justify-center font-display font-semibold text-faint',
        SIZE[size].text,
      ]"
      :aria-label="decorative ? undefined : `No cover for ${title}`"
    >
      {{ initials }}
    </AvatarFallback>
  </AvatarRoot>
</template>
