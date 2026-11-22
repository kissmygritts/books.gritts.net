<script setup lang="ts">
// Home: every finished book as a dot, newest finish first.
import { byFinishDesc } from '@/lib/derive'

useHead({ bodyAttrs: { class: 'bg-field text-field-foreground' } })

const { finished } = await useLedger()
const books = computed(() => [...finished.value].sort(byFinishDesc))
</script>

<template>
  <DotGrid :books="books" />
</template>
