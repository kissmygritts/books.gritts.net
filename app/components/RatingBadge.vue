<script setup lang="ts">
// The owner's 1–8 rating: eight small circles filled to the rating, then n/8.
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
    class="inline-flex items-center gap-0.75 whitespace-nowrap"
    :aria-label="`Rated ${rating} of ${RATING_MAX}`"
    role="img"
  >
    <span
      v-for="i in RATING_MAX"
      :key="i"
      :class="['size-2.25 rounded-full border border-current', i <= (rating as number) && 'bg-current']"
      aria-hidden="true"
    />
    <span class="ml-1.5 text-xs tabular-nums" aria-hidden="true">{{ rating }}/{{ RATING_MAX }}</span>
  </span>
  <span v-else class="text-meta">Unrated</span>
</template>
