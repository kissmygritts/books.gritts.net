<script setup lang="ts">
// One dashboard page: a full-height stretch of the field holding one chart,
// its title, the year filter, and a caption that turns into the hovered
// book. `legend` puts the dot key and lens switch under the year filter.
import type { LedgerYear } from '@/lib/ledger'

defineProps<{ id: string; title: string; caption: string; years: number[]; legend?: boolean }>()
const year = defineModel<LedgerYear>('year', { required: true })
const hovered = provideHoverBook()
</script>

<template>
  <section :id="id" :aria-labelledby="`${id}-h`" class="flex min-h-svh snap-start snap-always flex-col">
    <div
      class="mx-auto flex w-full min-w-0 max-w-ledger flex-1 flex-col px-4 py-24 sm:px-8 lg:px-14 lg:py-44"
    >
      <div class="grid justify-items-start gap-4">
        <h2 :id="`${id}-h`" class="font-extralight text-title tracking-display">{{ title }}</h2>
        <YearFilter v-model="year" :years="years" />
        <DotLegend v-if="legend" />
      </div>
      <div
        class="flex min-w-0 flex-1 flex-col justify-center py-10 sm:py-24"
        @mouseleave="hovered = null"
      >
        <slot />
      </div>
      <p class="min-h-12 max-w-prose border-current border-t pt-3 text-sm" aria-live="polite">
        <BookCaption v-if="hovered" :book="hovered" />
        <template v-else>{{ caption }}</template>
      </p>
    </div>
  </section>
</template>
