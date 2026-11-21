<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
	title?: string
	/** Short scale or scope note shown at the head's right, e.g. "your 1–8 scale". */
	note?: string
	class?: HTMLAttributes['class']
}>()

const headingId = useId()
</script>

<template>
  <section
    :aria-labelledby="title ? headingId : undefined"
    :class="cn('min-w-0 rounded-xl bg-card p-5 text-card-foreground ring-1 ring-edge', props.class)"
  >
    <div
      v-if="title || $slots.head"
      class="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1"
    >
      <div class="flex flex-wrap items-center gap-x-3.5 gap-y-2">
        <h2 :id="headingId" class="font-display font-semibold text-heading">
          {{ title }}
        </h2>
        <slot name="head" />
      </div>
      <slot name="aside">
        <span v-if="note" class="text-faint text-xs">{{ note }}</span>
      </slot>
    </div>
    <slot />
  </section>
</template>
