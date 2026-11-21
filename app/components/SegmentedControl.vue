<script setup lang="ts" generic="T extends string">
// A small pill switch in a panel head: Author / Format, US / World, a sort
// key. Pressing the active option emits `repeat` (the shelf flips its sort).
import { ToggleGroupItem, ToggleGroupRoot } from 'reka-ui'

defineProps<{ options: { value: T; label: string }[]; label: string }>()
const model = defineModel<T>({ required: true })
const emit = defineEmits<{ repeat: [] }>()

function pick(v: unknown) {
	if (typeof v === 'string' && v) model.value = v as T
	else emit('repeat')
}
</script>

<template>
  <ToggleGroupRoot
    type="single"
    :model-value="model"
    :aria-label="label"
    class="inline-flex flex-wrap rounded-full bg-muted p-0.5"
    @update:model-value="pick"
  >
    <ToggleGroupItem
      v-for="o in options"
      :key="o.value"
      :value="o.value"
      class="inline-flex cursor-pointer items-center gap-1 rounded-full px-2.75 py-1 font-medium text-muted-foreground text-xs transition-colors hover:text-foreground aria-pressed:bg-card aria-pressed:text-foreground aria-pressed:ring-1 aria-pressed:ring-edge"
    >
      {{ o.label }}
      <slot name="suffix" :option="o" :active="o.value === model" />
    </ToggleGroupItem>
  </ToggleGroupRoot>
</template>
