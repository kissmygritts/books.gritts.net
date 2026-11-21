<script setup lang="ts">
// The year in numbers: big light figures in a loose grid, lots of air.
defineProps<{ label: string }>()
</script>

<template>
  <div class="@container">
    <dl :aria-label="label" class="grid max-w-225 gap-x-24 gap-y-16 @xl:grid-cols-2">
      <slot />
    </dl>
  </div>
</template>
