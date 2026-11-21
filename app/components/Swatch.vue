<script setup lang="ts">
// Legend key: a 10px rounded square in a domain color.
import { TONE_BG, type Tone } from '@/lib/tone'

export type SwatchTone = Tone

defineProps<{ tone: Tone }>()
</script>

<template>
  <span
    :class="['inline-block size-2.5 shrink-0 rounded-xs', TONE_BG[tone]]"
    aria-hidden="true"
  />
</template>
