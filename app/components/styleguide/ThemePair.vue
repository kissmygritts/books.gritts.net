<script setup lang="ts">
// Styleguide only: renders the slot twice, forced light and forced dark.
// `field` paints both on the field instead of the page surface.
defineProps<{ title: string; field?: boolean }>()
</script>

<template>
  <section class="grid gap-4">
    <h2 class="font-normal text-heading">{{ title }}</h2>
    <div class="grid gap-4 lg:grid-cols-2">
      <div
        v-for="theme in ['light', 'dark']"
        :key="theme"
        :data-theme="theme"
        :class="[
          'grid min-w-0 content-start gap-5 border border-rule p-5',
          field && 'bg-field text-field-foreground',
        ]"
      >
        <p class="text-meta">{{ theme }}</p>
        <slot />
      </div>
    </div>
  </section>
</template>
