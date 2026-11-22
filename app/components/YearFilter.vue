<script setup lang="ts">
// The year filter: a one-line select, underlined in currentColor. Its list,
// newest year first with the picked one marked by a filled dot, takes the
// surface it opens over: the book card's (field-card, white ink) on the
// field, `muted` and the page ink on the page.
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

const props = defineProps<{ years: number[]; surface?: 'field' | 'page' }>()
const page = computed(() => props.surface === 'page')
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
        class="z-50 min-w-36 overflow-hidden rounded-3xl motion-safe:animate-in motion-safe:fade-in-0"
        :class="page ? 'bg-muted text-foreground' : 'bg-field-card text-field-foreground'"
      >
        <SelectViewport class="max-h-80 p-2">
          <SelectItem
            v-for="y in ['all', ...years.map(String)]"
            :key="y"
            :value="y"
            class="group flex cursor-pointer select-none items-center gap-2.5 rounded-full px-3 py-1.5 text-meta tabular-nums outline-none data-highlighted:bg-current/15 aria-selected:font-medium"
            :class="
              page
                ? 'text-muted-foreground data-highlighted:text-foreground aria-selected:text-foreground'
                : 'text-field-foreground/75 data-highlighted:text-field-foreground aria-selected:text-field-foreground'
            "
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
