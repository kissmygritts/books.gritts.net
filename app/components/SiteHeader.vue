<script setup lang="ts">
// The wordmark and the page links, one row over every page. Ink is
// currentColor, so it reads on the field and on the page surface.
const LINKS = [
	{ to: '/dashboard', label: 'Dashboard' },
	{ to: '/books', label: 'Books' },
]
const route = useRoute()
</script>

<template>
  <header class="absolute inset-x-0 top-0 z-10">
    <div class="mx-auto flex max-w-ledger items-baseline justify-between gap-4 px-4 pt-7 sm:px-8 lg:px-14">
      <NuxtLink to="/" class="whitespace-nowrap font-medium text-heading no-underline">
        Gritts Books
      </NuxtLink>
      <nav aria-label="Pages" class="flex gap-4.5 sm:gap-7">
        <NuxtLink
          v-for="l in LINKS"
          :key="l.to"
          :to="l.to"
          :aria-current="route.path === l.to ? 'page' : undefined"
          :class="['no-underline', route.path === l.to ? 'font-medium' : 'font-normal']"
        >
          {{ l.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
