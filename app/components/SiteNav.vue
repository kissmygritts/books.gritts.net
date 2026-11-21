<script setup lang="ts">
// Page switch in the header: the books (`/`) and the dashboard. Same pill as
// the year filter; the current page is the pressed one.
import { cn } from '@/lib/utils'

const LINKS = [
	{ to: '/', label: 'Books' },
	{ to: '/dashboard', label: 'Dashboard' },
]
const route = useRoute()
</script>

<template>
  <nav aria-label="Pages" class="flex flex-wrap gap-1.5">
    <NuxtLink
      v-for="l in LINKS"
      :key="l.to"
      :to="l.to"
      :class="
        cn(
          'rounded-full border px-2.75 py-1.25 font-medium text-meta leading-none transition-colors',
          route.path === l.to
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground',
        )
      "
    >
      {{ l.label }}
    </NuxtLink>
  </nav>
</template>
