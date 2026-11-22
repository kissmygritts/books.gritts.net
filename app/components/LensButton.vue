<script setup lang="ts">
// The legend's switch, underlined like the year filter: a refresh icon and the current
// lens's name. A click moves to the next lens (app/lib/lens.ts).
import { RefreshCw } from '@lucide/vue'
import { type LensId, lensById, nextLens } from '@/lib/lens'

const model = defineModel<LensId>({ required: true })
const name = computed(() => lensById(model.value)?.name ?? '')
const next = computed(() => nextLens(model.value))
</script>

<template>
  <button
    type="button"
    class="flex cursor-pointer items-center gap-1.5 border-current border-b py-0.5 outline-none focus-visible:border-b-2 focus-visible:pb-px"
    :aria-label="`Dots show: ${name}. Switch to ${next.name}.`"
    :title="`Switch to ${next.name}`"
    @click="model = next.id"
  >
    <RefreshCw class="size-3.5" aria-hidden="true" />{{ name }}
  </button>
</template>
