<script setup lang="ts">
// The home legend's switch: a hairline pill, a refresh icon and the current
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
    class="-my-1 flex cursor-pointer items-center gap-1.5 rounded-full border-dot border-current px-2.5 py-1 transition-colors hover:bg-current/15 focus-visible:outline-2 focus-visible:outline-current focus-visible:outline-offset-3"
    :aria-label="`Dots show: ${name}. Switch to ${next.name}.`"
    :title="`Switch to ${next.name}`"
    @click="model = next.id"
  >
    <RefreshCw class="size-3.5" aria-hidden="true" />{{ name }}
  </button>
</template>
