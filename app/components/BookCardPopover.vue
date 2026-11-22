<script setup lang="ts">
// Floats a <BookCard> over the dot `card.anchor` (see useBookCard). Focus
// stays where it was, so arrow keys keep stepping through the dots.
import { PopoverAnchor, PopoverContent, PopoverPortal, PopoverRoot } from 'reka-ui'
import type { BookCard } from '@/composables/useBookCard'

defineProps<{ card: BookCard }>()
</script>

<template>
  <PopoverRoot :open="!!card.item.value" @update:open="(v) => v || card.close()">
    <PopoverAnchor :reference="card.anchor.value ?? undefined" class="hidden" />
    <PopoverPortal>
      <PopoverContent
        v-if="card.item.value"
        side="top"
        :side-offset="10"
        :collision-padding="16"
        :aria-label="card.item.value.title"
        class="z-50 motion-safe:animate-in motion-safe:fade-in-0"
        @open-auto-focus.prevent
        @close-auto-focus.prevent
        @pointerenter="card.keep()"
        @pointerleave="(e: PointerEvent) => e.pointerType === 'mouse' && card.hide()"
      >
        <BookCard :book="card.item.value" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
