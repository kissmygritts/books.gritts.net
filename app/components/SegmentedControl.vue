<script setup lang="ts" generic="T extends string">
// A row of text tabs, the picked one underlined: the status on /books, the
// sort on a phone. Pressing the picked option again emits `repeat` (the
// sort flips direction).
import { ToggleGroupItem, ToggleGroupRoot } from 'reka-ui'

defineProps<{
	options: { value: T; label: string; count?: number }[]
	label: string
}>()
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
    class="flex flex-wrap gap-x-7 gap-y-1.5"
    @update:model-value="pick"
  >
    <ToggleGroupItem
      v-for="o in options"
      :key="o.value"
      :value="o.value"
      class="flex items-baseline gap-1.75 border-transparent border-b py-1 aria-pressed:border-current aria-pressed:font-medium"
    >
      {{ o.label }}
      <span v-if="o.count != null" class="text-meta text-muted-foreground tabular-nums">{{ o.count }}</span>
      <slot name="suffix" :option="o" :active="o.value === model" />
    </ToggleGroupItem>
  </ToggleGroupRoot>
</template>
