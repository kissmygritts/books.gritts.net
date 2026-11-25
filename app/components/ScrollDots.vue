<script setup lang="ts">
// Section dots on the right edge of home: the grid, then one per <DashPage>,
// between an up and a down button that step to the neighbouring section; the
// one crossing the middle of the viewport marked. Sections are found in
// <main> after mount, so a new page needs no registration.
import { ChevronDown, ChevronUp } from '@lucide/vue'

type Section = { id: string; title: string }

const sections = ref<Section[]>([])
const active = ref<string | null>(null)
let observer: IntersectionObserver | undefined

onMounted(() => {
	const els = [...document.querySelectorAll<HTMLElement>('main section[id]')]
	sections.value = els.map((el) => ({
		id: el.id,
		title: el.querySelector('h1, h2')?.textContent?.trim() ?? el.id,
	}))
	observer = new IntersectionObserver(
		(entries) => {
			for (const e of entries) if (e.isIntersecting) active.value = e.target.id
		},
		{ rootMargin: '-50% 0px -50% 0px' },
	)
	for (const el of els) observer.observe(el)
})
onBeforeUnmount(() => observer?.disconnect())

// The section before or after the current one, for the arrow buttons.
const index = computed(() => sections.value.findIndex((s) => s.id === active.value))
const prev = computed(() => sections.value[index.value - 1])
const next = computed(() => sections.value[Math.max(0, index.value + 1)])

function go(id: string) {
	const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
	document
		.getElementById(id)
		?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
	history.replaceState(history.state, '', `#${id}`)
}
</script>

<template>
  <nav
    v-if="sections.length"
    aria-label="Sections"
    class="fixed top-1/2 right-2 z-10 hidden -translate-y-1/2 flex-col items-center sm:flex lg:right-4"
  >
    <button
      type="button"
      class="mb-1 grid size-6 cursor-pointer place-items-center rounded-full disabled:cursor-default disabled:opacity-20"
      :class="prev && 'opacity-60 hover:opacity-100'"
      :disabled="!prev"
      :aria-label="prev ? `Previous: ${prev.title}` : 'Previous section'"
      :title="prev?.title"
      @click="prev && go(prev.id)"
    >
      <ChevronUp class="size-4" :stroke-width="1.75" />
    </button>
    <a
      v-for="s in sections"
      :key="s.id"
      :href="`#${s.id}`"
      :aria-label="s.title"
      :title="s.title"
      :aria-current="active === s.id ? 'location' : undefined"
      class="group grid size-6 place-items-center rounded-full"
      @click.prevent="go(s.id)"
    >
      <span
        class="size-1.5 rounded-full bg-current transition motion-reduce:transition-none"
        :class="active === s.id ? 'scale-150' : 'opacity-40 group-hover:opacity-80'"
      />
    </a>
    <button
      type="button"
      class="mt-1 grid size-6 cursor-pointer place-items-center rounded-full disabled:cursor-default disabled:opacity-20"
      :class="next && 'opacity-60 hover:opacity-100'"
      :disabled="!next"
      :aria-label="next ? `Next: ${next.title}` : 'Next section'"
      :title="next?.title"
      @click="next && go(next.id)"
    >
      <ChevronDown class="size-4" :stroke-width="1.75" />
    </button>
  </nav>
</template>
