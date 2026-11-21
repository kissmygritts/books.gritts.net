<script setup lang="ts">
// The year filter: unframed chrome that scopes the ledger panels below it.
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
    class="flex flex-wrap gap-1.5"
    @update:model-value="pick"
  >
    <ToggleGroupItem
      v-for="y in ['all', ...years.map(String)]"
      :key="y"
      :value="y"
      class="cursor-pointer rounded-full border border-border px-2.75 py-1.25 font-medium font-mono text-meta text-muted-foreground tabular-nums leading-none transition-colors hover:border-muted-foreground hover:text-foreground aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
    >
      {{ y === 'all' ? 'All' : y }}
    </ToggleGroupItem>
  </ToggleGroupRoot>
</template>
