<script setup lang="ts">
import { AUTHOR_TAG_LABEL, authorTag } from '@/lib/book'

const props = defineProps<{ value: boolean | null | undefined }>()
const tag = computed(() => authorTag(props.value))
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 whitespace-nowrap text-meta text-muted-foreground"
  >
    <Swatch :tone="tag" />{{ AUTHOR_TAG_LABEL[tag] }}
  </span>
</template>
