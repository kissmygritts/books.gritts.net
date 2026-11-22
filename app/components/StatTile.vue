<script setup lang="ts">
// One figure: the number big, then the words that carry its unit ("pages", "average rating, from 50 rated books").
defineProps<{
	value: string | number | null
	/** Printed with the figure: "/8", "%". */
	suffix?: string
	label: string
}>()
</script>

<template>
  <div class="flex flex-col-reverse">
    <dt class="mt-2.5 max-w-xs text-sm">{{ label }}</dt>
    <dd class="font-extralight text-figure tracking-display tabular-nums">
      {{ value ?? '–' }}<template v-if="value != null && suffix">{{ suffix }}</template>
    </dd>
  </div>
</template>
