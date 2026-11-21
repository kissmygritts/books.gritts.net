<script setup lang="ts">
withDefaults(defineProps<{ label?: string; cols?: 2 | 3 | 4 }>(), {
	cols: 4,
})

const COLS = {
	2: 'grid-cols-2',
	3: 'grid-cols-2 sm:grid-cols-3',
	4: 'grid-cols-2 sm:grid-cols-4',
} as const
</script>

<template>
  <section
    :aria-label="label"
    :class="[
      'grid gap-px overflow-hidden rounded-xl bg-rule ring-1 ring-edge',
      COLS[cols],
    ]"
  >
    <slot />
  </section>
</template>
