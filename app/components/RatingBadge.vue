<script setup lang="ts">
import { RATING_MAX } from '@/lib/book'

const props = defineProps<{ rating: number | null | undefined }>()

const rated = computed(
	() =>
		typeof props.rating === 'number' &&
		props.rating >= 1 &&
		props.rating <= RATING_MAX,
)
</script>

<template>
  <span
    v-if="rated"
    class="inline-flex items-center gap-2 whitespace-nowrap font-medium font-mono text-xs tabular-nums"
    :aria-label="`Rated ${rating} of ${RATING_MAX}`"
    role="img"
  >
    <svg
      :width="RATING_MAX * 8 - 2"
      height="6"
      :viewBox="`0 0 ${RATING_MAX * 8 - 2} 6`"
      aria-hidden="true"
    >
      <circle
        v-for="i in RATING_MAX"
        :key="i"
        :cx="(i - 1) * 8 + 3"
        cy="3"
        :r="i <= (rating as number) ? 3 : 2.4"
        :class="i <= (rating as number) ? 'fill-foreground' : 'fill-none stroke-faint'"
        stroke-width="1.2"
      />
    </svg>
    <span>{{ rating }}<span class="text-faint">/{{ RATING_MAX }}</span></span>
  </span>
  <span v-else class="font-mono text-faint text-xs">unrated</span>
</template>
