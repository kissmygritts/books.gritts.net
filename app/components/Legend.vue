<script setup lang="ts">
// A row of swatch keys for a panel head. Items with a zero value drop out.
import { formatNumber } from '@/lib/format'
import type { Tone } from '@/lib/tone'

const props = defineProps<{
	items: { tone: Tone; label: string; value?: number }[]
}>()

const shown = computed(() => props.items.filter((i) => i.value !== 0))
</script>

<template>
  <ul class="flex flex-wrap gap-x-3.5 gap-y-1.5 text-muted-foreground text-xs">
    <li v-for="i in shown" :key="i.label" class="inline-flex items-center gap-1.5">
      <Swatch :tone="i.tone" />{{ i.label }}
      <span v-if="i.value != null" class="font-mono tabular-nums">{{
        formatNumber(i.value)
      }}</span>
    </li>
  </ul>
</template>
