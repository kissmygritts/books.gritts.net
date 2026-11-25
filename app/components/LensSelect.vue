<script setup lang="ts">
// The legend's lens picker, a select styled like the year filter: the
// current lens's name, underlined, opening a list of every lens in
// alphabetical order (app/lib/lens.ts). Only used on the field.
import { ChevronDown } from '@lucide/vue'
import {
	SelectContent,
	SelectItem,
	SelectItemText,
	SelectPortal,
	SelectRoot,
	SelectTrigger,
	SelectValue,
	SelectViewport,
} from 'reka-ui'
import { LENSES, type LensId, lensById } from '@/lib/lens'

const model = defineModel<LensId>({ required: true })
const name = computed(() => lensById(model.value)?.name ?? '')
const options = [...LENSES].sort((a, b) => a.name.localeCompare(b.name))

function pick(v: unknown) {
	if (typeof v === 'string' && lensById(v)) model.value = v as LensId
}
</script>

<template>
  <SelectRoot :model-value="model" @update:model-value="pick">
    <SelectTrigger
      aria-label="Dots show"
      class="flex cursor-pointer items-center gap-3 border-current border-b py-0.5 text-sm outline-none focus-visible:border-b-2 focus-visible:pb-px"
    >
      <SelectValue>{{ name }}</SelectValue>
      <ChevronDown class="size-3.5" aria-hidden="true" />
    </SelectTrigger>
    <SelectPortal>
      <SelectContent
        position="popper"
        side="bottom"
        align="start"
        :side-offset="8"
        :collision-padding="16"
        class="z-50 min-w-36 overflow-hidden rounded-3xl bg-field-card text-field-foreground motion-safe:animate-in motion-safe:fade-in-0"
      >
        <SelectViewport class="max-h-80 p-2">
          <SelectItem
            v-for="l in options"
            :key="l.id"
            :value="l.id"
            class="group flex cursor-pointer select-none items-center gap-2.5 rounded-full px-3 py-1.5 text-meta text-field-foreground/75 outline-none data-highlighted:bg-current/15 data-highlighted:text-field-foreground aria-selected:font-medium aria-selected:text-field-foreground"
          >
            <span
              class="size-1.75 rounded-full border border-current group-aria-selected:bg-current"
              aria-hidden="true"
            />
            <SelectItemText>{{ l.name }}</SelectItemText>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
