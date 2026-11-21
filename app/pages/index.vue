<script setup lang="ts">
// Home: every finished book as a dot, in the order finished.
import { byFinishAsc } from '@/lib/derive'

useHead({ bodyAttrs: { class: 'bg-field text-field-foreground' } })

const { finished } = await useLedger()
const books = computed(() => [...finished.value].sort(byFinishAsc))
</script>

<template>
  <DotGrid :books="books" />
</template>
