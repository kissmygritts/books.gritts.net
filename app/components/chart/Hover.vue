<script setup lang="ts">
// One controlled tooltip for a whole SVG chart, anchored to the hovered mark.
// Wrap the chart's <svg> in this and report hover with `anchor` + `tip`.
import { TooltipRoot, TooltipTrigger } from 'reka-ui'
import type { ChartTip } from '@/lib/chart'

const props = defineProps<{
	tip: ChartTip | null
	anchor: Element | null
	maxTitles?: number
}>()

const open = computed(() => !!props.tip && !!props.anchor)
</script>

<template>
  <TooltipRoot :open="open">
    <TooltipTrigger as-child :reference="anchor ?? undefined">
      <div><slot /></div>
    </TooltipTrigger>
    <ChartTipBody v-if="tip" :tip="tip" :max-titles="maxTitles" />
  </TooltipRoot>
</template>
