<script setup lang="ts">
// Hover tooltip for an HTML element (a bar row): the default slot is the
// trigger. SVG marks use <ChartHover> instead; a reka Portal declared inside
// <svg> would mount its content in the SVG namespace.
import { TooltipRoot, TooltipTrigger } from 'reka-ui'
import type { ChartTip } from '@/lib/chart'

defineProps<{ tip: ChartTip; maxTitles?: number }>()
</script>

<template>
  <TooltipRoot>
    <TooltipTrigger as-child>
      <slot />
    </TooltipTrigger>
    <ChartTipBody :tip="tip" :max-titles="maxTitles" />
  </TooltipRoot>
</template>
