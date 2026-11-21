<script setup lang="ts">
// Floating page menu, lower right. The blobs merge through an SVG "goo"
// filter (blur, then a hard alpha threshold); SourceGraphic is composited
// back on top so the icons stay crisp. Items stack straight up.
import { House, LayoutDashboard, Library, Plus } from '@lucide/vue'
import { onClickOutside, onKeyStroke } from '@vueuse/core'

const GAP = 88 // px from the toggle to the first item
const STEP = 68 // px between items
const LINKS = [
	{ to: '/', label: 'Home', icon: House },
	{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
	{ to: '/books', label: 'All books', icon: Library },
].map((l, i) => ({ ...l, x: '0px', y: `${-(GAP + i * STEP)}px` }))

const open = ref(false)
const root = useTemplateRef<HTMLElement>('root')
const route = useRoute()

watch(() => route.path, () => (open.value = false))
onClickOutside(root, () => (open.value = false))
onKeyStroke('Escape', () => (open.value = false))
</script>

<template>
  <div ref="root" class="gooey" :class="{ open }">
    <svg width="0" height="0" class="absolute" aria-hidden="true" focusable="false">
      <filter id="goo">
        <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
        <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" result="goo" />
        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
      </filter>
    </svg>

    <nav id="gooey-items" aria-label="Pages" :inert="!open">
      <NuxtLink
        v-for="(l, i) in LINKS"
        :key="l.to"
        :to="l.to"
        :aria-label="l.label"
        :aria-current="route.path === l.to ? 'page' : undefined"
        class="blob item"
        :style="{ '--x': l.x, '--y': l.y, '--i': i }"
      >
        <component :is="l.icon" class="size-5" :stroke-width="1.75" />
      </NuxtLink>
    </nav>

    <button
      type="button"
      class="blob toggle"
      :aria-expanded="open"
      aria-controls="gooey-items"
      :aria-label="open ? 'Close menu' : 'Open menu'"
      @click="open = !open"
    >
      <Plus class="icon size-6" :stroke-width="1.75" />
    </button>
  </div>
</template>

<style scoped>
.gooey {
  --size: 3.5rem;
  --item: 3rem;
  position: fixed;
  right: max(1rem, env(safe-area-inset-right));
  bottom: max(1rem, env(safe-area-inset-bottom));
  z-index: 50;
  /* Big enough that the filter region holds the whole fan. */
  width: 6rem;
  height: 19rem;
  pointer-events: none;
  filter: url(#goo);
  /* Blobs are the surface's ink (currentColor: white on the field, the
     page ink on /books); icons are knocked out in the ground color. */
  --ground: var(--background);
}

.blob {
  position: absolute;
  display: grid;
  place-items: center;
  border-radius: 9999px;
  background: currentColor;
  pointer-events: auto;
}

.blob:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}

.blob > svg {
  color: var(--ground);
}

.toggle {
  right: 0;
  bottom: 0;
  width: var(--size);
  height: var(--size);
  cursor: pointer;
}

.toggle .icon {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.open .toggle .icon {
  transform: rotate(135deg);
}

.item {
  right: calc((var(--size) - var(--item)) / 2);
  bottom: calc((var(--size) - var(--item)) / 2);
  width: var(--item);
  height: var(--item);
  text-decoration: none;
  transform: translate(0, 0) scale(0.6);
  transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
  transition-delay: calc((2 - var(--i)) * 40ms);
}

.open .item {
  transform: translate(var(--x), var(--y)) scale(1);
  transition-delay: calc(var(--i) * 60ms);
}

.item[aria-current="page"] {
  outline: 1.5px solid var(--ground);
  outline-offset: -5px;
}

@media (prefers-reduced-motion: reduce) {
  .item,
  .toggle .icon {
    transition-duration: 0.01ms;
    transition-delay: 0s;
  }
}
</style>

<style>
/* Unscoped: Vue's scoped :global() drops the rest of the selector. */
body.bg-field .gooey {
  --ground: var(--field);
}
</style>
