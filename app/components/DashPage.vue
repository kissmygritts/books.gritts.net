<script setup lang="ts">
// One dashboard page: a full-height stretch of the field holding one chart,
// its title, the year filter, and a static caption. `legend` puts the lens picker beside the year filter and the dot key below them.
import type { LedgerYear } from '@/lib/ledger'

defineProps<{ id: string; title: string; caption: string; years: number[]; legend?: boolean }>()
const year = defineModel<LedgerYear>('year', { required: true })
</script>

<template>
  <section :id="id" :aria-labelledby="`${id}-h`" class="flex min-h-svh snap-start snap-always flex-col">
    <div
      class="mx-auto flex w-full min-w-0 max-w-ledger flex-1 flex-col px-4 py-24 sm:px-8 lg:px-14 lg:py-44"
    >
      <div class="grid justify-items-start gap-4">
        <h2 :id="`${id}-h`" class="font-extralight text-title tracking-display">{{ title }}</h2>
        <DotLegend v-if="legend">
          <YearFilter v-model="year" :years="years" />
        </DotLegend>
        <YearFilter v-else v-model="year" :years="years" />
      </div>
      <div class="flex min-w-0 flex-1 flex-col justify-center py-10 sm:py-24">
        <slot />
      </div>
      <p class="min-h-12 max-w-prose border-current border-t pt-3 text-sm">{{ caption }}</p>
    </div>
  </section>
</template>
