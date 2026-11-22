<script setup lang="ts">
// The dot key: the lens switch, then what solid, ring and pip mean under
// the current lens. On home it's one row; on a dashboard page the year
// filter comes in through the slot, sits beside the switch, and the key
// drops to its own row below the controls.
const { id, lens } = useLens()
const slots = defineSlots<{ default?: () => unknown }>()
</script>

<template>
  <div
    class="flex flex-wrap gap-x-5 gap-y-2 text-sm"
    :class="slots.default ? 'flex-col items-start gap-y-3' : 'items-center'"
  >
    <div v-if="slots.default" class="flex flex-wrap items-center gap-x-8 gap-y-3">
      <slot />
      <LensButton v-model="id" />
    </div>
    <LensButton v-else v-model="id" />
    <ul class="flex flex-wrap gap-x-5 gap-y-2" aria-hidden="true">
      <li class="flex items-center gap-2"><BookDot tag="other" size="sm" />{{ lens.label.other }}</li>
      <li class="flex items-center gap-2"><BookDot tag="wm" size="sm" />{{ lens.label.wm }}</li>
      <li class="flex items-center gap-2"><BookDot tag="untagged" size="sm" />{{ lens.label.untagged }}</li>
    </ul>
  </div>
</template>
