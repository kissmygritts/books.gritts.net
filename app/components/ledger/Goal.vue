<script setup lang="ts">
// The yearly goal: more books by everyone else than by white men.
import { Check, Minus, X } from '@lucide/vue'
import type { BadgeVariants } from '@/components/ui/badge'
import { AUTHOR_TAG_LABEL } from '@/lib/book'
import { TAG_KEYS, type Tally, type Verdict } from '@/lib/ledger'
import { TONE_BG } from '@/lib/tone'

const props = defineProps<{ tally: Tally; verdict: Verdict; total: number }>()

const badge = computed(() => {
	const v = props.verdict
	const variant: BadgeVariants['variant'] =
		v.kind === 'met'
			? 'success'
			: v.kind === 'behind' || v.kind === 'missed'
				? 'destructive'
				: 'secondary'
	const icon =
		v.kind === 'met'
			? Check
			: v.kind === 'behind' || v.kind === 'missed'
				? X
				: v.kind === 'untagged'
					? Minus
					: null
	const text =
		v.kind === 'years'
			? `Goal met in ${v.met} of ${v.of} years`
			: v.kind === 'untagged'
				? 'Not tagged yet'
				: v.kind === 'met'
					? `Goal met · +${v.by}`
					: `${v.kind === 'behind' ? 'Behind' : 'Missed'} by ${v.by}`
	return { variant, icon, text }
})

const tagged = computed(() => props.tally.other + props.tally.wm)
const note = computed(() => {
	const t = props.tally
	let n = tagged.value
		? `${Math.round((t.other / tagged.value) * 100)} % of tagged books are by authors other than white men.`
		: ''
	if (t.untagged)
		n += ` ${t.untagged} ${t.untagged === 1 ? 'book has' : 'books have'} no author tag yet.`
	return n.trim()
})
const share = (n: number) => ({
	'--share': `${(n / (props.total || 1)) * 100}%`,
})
</script>

<template>
  <Panel aria-label="The yearly goal">
    <div class="grid gap-4.5">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="font-display font-semibold text-heading">The yearly goal</h2>
          <p class="text-meta text-muted-foreground">
            More books by everyone else than by white men.
          </p>
        </div>
        <Badge :variant="badge.variant" class="tabular-nums">
          <component :is="badge.icon" v-if="badge.icon" class="size-3.5" aria-hidden="true" />
          {{ badge.text }}
        </Badge>
      </div>

      <div class="flex items-end justify-between gap-3">
        <div class="grid gap-0.5">
          <span class="inline-flex items-center gap-1.5 text-meta text-muted-foreground">
            <Swatch tone="other" />{{ AUTHOR_TAG_LABEL.other }}
          </span>
          <span class="font-display font-heavy text-figure tabular-nums tracking-display">
            {{ tally.other }}<span class="sr-only"> books</span>
          </span>
        </div>
        <span class="pb-2 font-mono text-faint text-meta">vs</span>
        <div class="grid justify-items-end gap-0.5">
          <span class="inline-flex items-center gap-1.5 text-meta text-muted-foreground">
            <Swatch tone="wm" />{{ AUTHOR_TAG_LABEL.wm }}
          </span>
          <span class="font-display font-heavy text-figure tabular-nums tracking-display">
            {{ tally.wm }}<span class="sr-only"> books</span>
          </span>
        </div>
      </div>

      <div class="flex h-3.5 gap-0.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
        <span
          v-for="k in TAG_KEYS.filter((k) => tally[k])"
          :key="k"
          :class="['h-full w-share shrink-0 motion-safe:transition-all', TONE_BG[k]]"
          :style="share(tally[k])"
        />
      </div>
      <p v-if="note" class="text-meta text-muted-foreground tabular-nums">{{ note }}</p>
    </div>
  </Panel>
</template>
