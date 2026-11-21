<script setup lang="ts">
// Styleguide only: renders the slot twice, forced light and forced dark.
defineProps<{ title: string }>()
</script>

<template>
  <section class="grid gap-3">
    <h2 class="font-display font-semibold text-heading">{{ title }}</h2>
    <div class="grid gap-4 lg:grid-cols-2">
      <div
        v-for="theme in ['light', 'dark']"
        :key="theme"
        :data-theme="theme"
        class="grid min-w-0 content-start gap-4 rounded-xl p-5 ring-1 ring-edge"
      >
        <Eyebrow>{{ theme }}</Eyebrow>
        <slot />
      </div>
    </div>
  </section>
</template>
