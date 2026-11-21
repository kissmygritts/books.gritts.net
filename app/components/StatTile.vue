<script setup lang="ts">
import { formatNumber } from '@/lib/format'

const props = defineProps<{
	label: string
	value: number | string | null | undefined
	/** Always set for counts: "books", "pages", "/ 8", "%". */
	unit?: string
	note?: string
}>()

const display = computed(() => {
	if (props.value == null || props.value === '') return '–'
	return typeof props.value === 'number'
		? formatNumber(props.value)
		: props.value
})
</script>

<template>
  <div class="grid content-start gap-1 bg-card px-4.5 py-4">
    <Eyebrow as="span">{{ label }}</Eyebrow>
    <span
      class="font-display font-semibold text-stat tabular-nums tracking-display"
    >
      {{ display
      }}<span
        v-if="unit && display !== '–'"
        class="ml-1 font-medium font-mono text-faint text-meta tracking-normal"
        >{{ unit }}</span
      >
    </span>
    <span v-if="note" class="text-muted-foreground text-xs">{{ note }}</span>
  </div>
</template>
