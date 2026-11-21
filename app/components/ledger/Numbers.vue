<script setup lang="ts">
// The year in numbers.
import type { YearStats } from '@/lib/ledger'

defineProps<{ stats: YearStats }>()
</script>

<template>
  <StatGrid label="The year in numbers">
    <StatTile label="Books" :value="stats.books" unit="books" />
    <StatTile label="Pages" :value="stats.pages" unit="pages" />
    <StatTile label="Average rating" :value="stats.avgRating" unit="/ 8" />
    <StatTile label="Median days per book" :value="stats.medianDays" unit="days" />
  </StatGrid>
</template>
