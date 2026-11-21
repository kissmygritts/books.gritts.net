<script setup lang="ts">
// Hover tooltip for a chart mark or bar row (reka-ui Tooltip). The default
// slot is the trigger, rendered as-is: an SVG <g>, a row <div>, a map path.
import {
	TooltipContent,
	TooltipPortal,
	TooltipRoot,
	TooltipTrigger,
} from 'reka-ui'
import type { ChartTip } from '@/lib/chart'

const props = withDefaults(
	defineProps<{ tip: ChartTip; maxTitles?: number }>(),
	{ maxTitles: 12 },
)

const titles = computed(() =>
	props.tip.books && props.tip.books.length <= props.maxTitles
		? props.tip.books
		: [],
)
</script>

<template>
  <TooltipRoot>
    <TooltipTrigger as-child>
      <slot />
    </TooltipTrigger>
    <TooltipPortal>
      <TooltipContent
        side="top"
        :side-offset="8"
        :collision-padding="8"
        class="z-50 max-w-60 rounded-lg bg-foreground px-2.5 py-1.75 text-background text-xs"
      >
        <p class="tabular-nums">
          <span class="font-semibold">{{ tip.title }}</span>
          <template v-for="m in tip.meta ?? []" :key="m"> · {{ m }}</template>
        </p>
        <p v-for="(line, i) in tip.lines ?? []" :key="`l${i}`" class="tabular-nums">
          {{ line }}
        </p>
        <p v-for="(t, i) in titles" :key="`t${i}`">{{ t }}</p>
      </TooltipContent>
    </TooltipPortal>
  </TooltipRoot>
</template>
