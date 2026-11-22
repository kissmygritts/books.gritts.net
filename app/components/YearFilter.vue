<script setup lang="ts">
// The year filter: a one-line select, underlined in currentColor. Its list is
// the book card's surface (field-card, white ink), newest year first, the
// picked one marked with a filled dot.
import { ChevronDown } from '@lucide/vue'
import {
	SelectContent,
	SelectItem,
	SelectItemText,
	SelectPortal,
	SelectRoot,
	SelectTrigger,
	SelectValue,
	SelectViewport,
} from 'reka-ui'
import type { LedgerYear } from '@/lib/ledger'

defineProps<{ years: number[] }>()
const year = defineModel<LedgerYear>({ required: true })

function pick(v: unknown) {
	if (v === 'all') year.value = 'all'
	else if (typeof v === 'string' && v) year.value = +v
}
const label = (y: string) => (y === 'all' ? 'All years' : y)
</script>

<template>
  <SelectRoot :model-value="String(year)" @update:model-value="pick">
    <SelectTrigger
      aria-label="Year"
      class="flex cursor-pointer items-center gap-3 border-current border-b py-0.5 text-sm tabular-nums outline-none focus-visible:border-b-2 focus-visible:pb-px"
    >
      <SelectValue>{{ label(String(year)) }}</SelectValue>
      <ChevronDown class="size-3.5" aria-hidden="true" />
    </SelectTrigger>
    <SelectPortal>
      <SelectContent
        position="popper"
        side="bottom"
        align="start"
        :side-offset="8"
        :collision-padding="16"
        class="z-50 min-w-36 overflow-hidden rounded-3xl bg-field-card text-field-foreground motion-safe:animate-in motion-safe:fade-in-0"
      >
        <SelectViewport class="max-h-80 p-2">
          <SelectItem
            v-for="y in ['all', ...years.map(String)]"
            :key="y"
            :value="y"
            class="group flex cursor-pointer select-none items-center gap-2.5 rounded-full px-3 py-1.5 text-meta text-field-foreground/75 tabular-nums outline-none data-highlighted:bg-current/15 data-highlighted:text-field-foreground aria-selected:font-medium aria-selected:text-field-foreground"
          >
            <span
              class="size-1.75 rounded-full border border-current group-aria-selected:bg-current"
              aria-hidden="true"
            />
            <SelectItemText>{{ label(y) }}</SelectItemText>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
