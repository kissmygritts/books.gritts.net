<script setup lang="ts">
// The year filter: a row of years, each with a small dot that fills when
// picked. Unframed chrome; ink is currentColor.
import { ToggleGroupItem, ToggleGroupRoot } from 'reka-ui'
import type { LedgerYear } from '@/lib/ledger'

defineProps<{ years: number[] }>()
const year = defineModel<LedgerYear>({ required: true })

// A single toggle group clears when the pressed item is pressed again; keep
// the current year instead.
function pick(v: unknown) {
	if (v === 'all') year.value = 'all'
	else if (typeof v === 'string' && v) year.value = +v
}
</script>

<template>
  <ToggleGroupRoot
    type="single"
    :model-value="String(year)"
    aria-label="Year"
    class="flex flex-wrap gap-x-4 gap-y-1 text-sm"
    @update:model-value="pick"
  >
    <ToggleGroupItem
      v-for="y in ['all', ...years.map(String)]"
      :key="y"
      :value="y"
      class="group flex items-center gap-1.5 py-0.5 tabular-nums aria-pressed:font-medium"
    >
      <span class="size-1.75 rounded-full border border-current group-aria-pressed:bg-current" aria-hidden="true" />
      {{ y === 'all' ? 'All' : y }}
    </ToggleGroupItem>
  </ToggleGroupRoot>
</template>
