<script setup lang="ts">
const props = defineProps<{
	items: (string | number | null | undefined | false)[]
}>()

const parts = computed(() =>
	props.items.filter(
		(x): x is string | number =>
			x !== null && x !== undefined && x !== false && x !== '',
	),
)
</script>

<template>
  <p
    v-if="parts.length"
    class="flex flex-wrap items-baseline gap-x-1.5 font-mono text-muted-foreground text-xs tabular-nums"
  >
    <template v-for="(p, i) in parts" :key="i">
      <span v-if="i" class="text-faint" aria-hidden="true">·</span>
      <span>{{ p }}</span>
    </template>
  </p>
</template>
