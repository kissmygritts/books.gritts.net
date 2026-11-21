<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <div
    class="grid justify-items-center gap-2 rounded-lg border border-dashed px-6 py-8 text-center"
  >
    <div v-if="$slots.icon" class="text-faint" aria-hidden="true">
      <slot name="icon" />
    </div>
    <p class="font-medium">{{ title }}</p>
    <p v-if="$slots.default" class="max-w-prose text-muted-foreground">
      <slot />
    </p>
    <div v-if="$slots.actions" class="mt-2 flex flex-wrap gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
