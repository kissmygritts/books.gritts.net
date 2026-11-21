<script setup lang="ts">
// Nothing to show: say so, then say what to do.
defineProps<{ title: string }>()
</script>

<template>
  <div class="py-6">
    <p class="font-normal">{{ title }}</p>
    <p v-if="$slots.default" class="max-w-prose text-muted-foreground">
      <slot />
    </p>
  </div>
</template>
