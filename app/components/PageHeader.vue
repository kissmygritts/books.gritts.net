<script setup lang="ts">
defineProps<{ eyebrow?: string; title: string; subtitle?: string }>()
</script>

<template>
  <header class="flex flex-wrap items-end justify-between gap-x-6 gap-y-3.5">
    <div class="grid gap-1">
      <Eyebrow v-if="eyebrow">{{ eyebrow }}</Eyebrow>
      <h1 class="font-display font-heavy text-title tracking-display">
        {{ title }}<slot name="title-suffix" />
      </h1>
      <p
        v-if="subtitle || $slots.subtitle"
        class="text-meta text-muted-foreground"
      >
        <slot name="subtitle">{{ subtitle }}</slot>
      </p>
    </div>
    <div v-if="$slots.actions" class="flex flex-wrap gap-1.5">
      <slot name="actions" />
    </div>
  </header>
</template>
