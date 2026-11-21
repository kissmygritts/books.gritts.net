<script setup lang="ts">
// A cover in a circle, dithered to two inks (see <DitherFilters>). Initials
// when there is no image or it fails to load.
import { AvatarFallback, AvatarImage, AvatarRoot } from 'reka-ui'

const props = defineProps<{
	src?: string | null
	title: string
	/** Set when the title is printed next to the cover. */
	decorative?: boolean
}>()

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
  <AvatarRoot class="relative inline-flex size-13 shrink-0 overflow-hidden rounded-full border border-current bg-muted">
    <AvatarImage
      v-if="src"
      :src="src"
      :alt="decorative ? '' : `Cover of ${title}`"
      loading="lazy"
      referrerpolicy="no-referrer"
      class="size-full object-cover filter-dither"
    />
    <AvatarFallback
      class="flex size-full items-center justify-center text-meta"
      :aria-label="decorative ? undefined : `No cover for ${title}`"
    >
      {{ initials }}
    </AvatarFallback>
  </AvatarRoot>
</template>
