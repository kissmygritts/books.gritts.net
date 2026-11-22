<script setup lang="ts">
// Floats a <PlaceCard> over the map region `card.anchor`, with the book
// card's rules (see usePopupCard).
import { PopoverAnchor, PopoverContent, PopoverPortal, PopoverRoot } from 'reka-ui'
import type { Place } from '@/components/PlaceCard.vue'
import type { PopupCard } from '@/composables/useBookCard'

defineProps<{ card: PopupCard<Place> }>()
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
        :aria-label="card.item.value.name"
        class="z-50 motion-safe:animate-in motion-safe:fade-in-0"
        @open-auto-focus.prevent
        @close-auto-focus.prevent
        @pointerenter="card.keep()"
        @pointerleave="(e: PointerEvent) => e.pointerType === 'mouse' && card.hide()"
      >
        <PlaceCard :place="card.item.value" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
