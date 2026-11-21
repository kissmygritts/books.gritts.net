<script setup lang="ts">
// Legend key: a 10px rounded square in a domain color.
export type SwatchTone =
	| 'wm'
	| 'other'
	| 'untagged'
	| 'place'
	| 'audiobook'
	| 'print'
	| 'chart-1'
	| 'chart-2'
	| 'chart-3'
	| 'chart-4'
	| 'chart-5'

defineProps<{ tone: SwatchTone }>()

const TONE: Record<SwatchTone, string> = {
	wm: 'bg-wm',
	other: 'bg-other',
	untagged: 'bg-untagged',
	place: 'bg-place',
	audiobook: 'bg-audiobook',
	print: 'bg-muted-foreground',
	'chart-1': 'bg-chart-1',
	'chart-2': 'bg-chart-2',
	'chart-3': 'bg-chart-3',
	'chart-4': 'bg-chart-4',
	'chart-5': 'bg-chart-5',
}
</script>

<template>
  <span
    :class="['inline-block size-2.5 shrink-0 rounded-xs', TONE[tone]]"
    aria-hidden="true"
  />
</template>
