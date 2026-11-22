<script setup lang="ts">
// The dot key: the lens switch, then what solid, ring and pip mean under
// the current lens. Home legend and under each dashboard year filter.
const { id, lens } = useLens()
</script>

<template>
  <div class="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
    <LensButton v-model="id" />
    <ul class="flex flex-wrap gap-x-5 gap-y-2" aria-hidden="true">
      <li class="flex items-center gap-2"><BookDot tag="other" size="sm" />{{ lens.label.other }}</li>
      <li class="flex items-center gap-2"><BookDot tag="wm" size="sm" />{{ lens.label.wm }}</li>
      <li class="flex items-center gap-2"><BookDot tag="untagged" size="sm" />{{ lens.label.untagged }}</li>
    </ul>
  </div>
</template>
