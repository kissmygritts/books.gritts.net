<script setup lang="ts">
// A book's goal tag: its dot, then the words.
import { AUTHOR_TAG_SINGLE, authorTag } from '@/lib/book'

const props = defineProps<{ value: boolean | null | undefined }>()
const tag = computed(() => authorTag(props.value))
</script>

<template>
  <span class="inline-flex items-center gap-1.75 whitespace-nowrap text-meta">
    <BookDot :tag="tag" size="sm" />{{ AUTHOR_TAG_SINGLE[tag] }}
  </span>
</template>
