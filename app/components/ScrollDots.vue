<script setup lang="ts">
// Section dots on the right edge of the dashboard: one per <DashPage>, the
// one crossing the middle of the viewport marked. Sections are found in
// <main> after mount, so a new page needs no registration.
type Section = { id: string; title: string }

const sections = ref<Section[]>([])
const active = ref<string | null>(null)
let observer: IntersectionObserver | undefined

onMounted(() => {
	const els = [...document.querySelectorAll<HTMLElement>('main section[id]')]
	sections.value = els.map((el) => ({
		id: el.id,
		title: el.querySelector('h2')?.textContent?.trim() ?? el.id,
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
    class="fixed top-1/2 right-2 z-10 hidden -translate-y-1/2 flex-col sm:flex lg:right-4"
  >
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
  </nav>
</template>
