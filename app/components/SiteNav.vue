<script setup lang="ts">
// Page links, upper right: plain words, the current page medium weight,
// then the palette button. Ink is currentColor, so it works on either surface.
// Fixed on the sparse field of `/`; at the top of the page elsewhere, where
// rows would scroll under it.
import { Palette } from '@lucide/vue'

const LINKS = [
	{ to: '/', label: 'Home' },
	{ to: '/books', label: 'Books' },
]
const route = useRoute()
const { label, next } = usePalette()
</script>

<template>
  <nav
    aria-label="Site"
    :class="route.path === '/' ? 'fixed' : 'absolute'"
    class="top-4 right-4 z-50 flex items-center gap-5 text-sm sm:top-6 sm:right-8 lg:right-14"
  >
    <NuxtLink
      v-for="l in LINKS"
      :key="l.to"
      :to="l.to"
      :aria-current="route.path === l.to ? 'page' : undefined"
      class="underline-offset-4 hover:underline"
      :class="route.path === l.to && 'font-medium'"
    >
      {{ l.label }}
    </NuxtLink>
    <button
      type="button"
      class="grid size-6 cursor-pointer place-items-center rounded-full opacity-80 hover:opacity-100"
      :aria-label="`Color: ${label}. Next color`"
      :title="`Color: ${label}`"
      @click="next"
    >
      <Palette class="size-4" :stroke-width="1.75" />
    </button>
  </nav>
</template>
