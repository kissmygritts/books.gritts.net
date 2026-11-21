<script setup lang="ts">
withDefaults(defineProps<{ as?: string }>(), { as: 'p' })
</script>

<template>
  <component
    :is="as"
    class="font-semibold text-faint text-label uppercase tracking-label"
  >
    <slot />
  </component>
</template>
