<script setup lang="ts">
// Horizontal bar list, after the ledger's `hbars()`: label, a track scaled to
// the longest bar, the count, and optionally the average rating.
import type { BarRow } from '@/lib/chart'
import { formatNumber } from '@/lib/format'
import { TONE_BG } from '@/lib/tone'

const Tip = resolveComponent('ChartTip')

const props = withDefaults(
	defineProps<{
		rows: BarRow[]
		/** Wider label column, for genres and authors. */
		wide?: boolean
		/** Scale bars to this instead of the longest row. */
		max?: number
		empty?: string
	}>(),
	{ empty: 'Nothing recorded.' },
)

const top = computed(
	() => props.max ?? Math.max(1, ...props.rows.map((r) => r.value)),
)
const hasAvg = computed(() => props.rows.some((r) => r.avg !== undefined))
const share = (v: number) => ({ '--share': `${(v / top.value) * 100}%` })
</script>

<template>
  <div class="grid gap-2">
    <template v-for="r in rows" :key="r.key">
      <component :is="r.tip ? Tip : 'div'" v-bind="r.tip ? { tip: r.tip } : {}">
        <div class="flex items-center gap-2.5 text-meta">
          <span
            :class="[
              'shrink-0 truncate text-muted-foreground',
              wide ? 'w-24 sm:w-36' : 'w-28',
            ]"
            :title="r.sub ? `${r.label} (${r.sub})` : r.label"
          >
            {{ r.label }}<span v-if="r.sub" class="text-faint"> {{ r.sub }}</span>
          </span>
          <span class="flex h-3 min-w-0 flex-1 gap-0.5" aria-hidden="true">
            <span
              v-for="(s, i) in r.segments.filter((s) => s.value)"
              :key="i"
              :class="[
                'h-full w-share shrink-0 last:rounded-r-xs motion-safe:transition-all',
                TONE_BG[s.tone],
              ]"
              :style="share(s.value)"
            />
          </span>
          <span class="w-7 shrink-0 text-right font-medium font-mono text-xs tabular-nums">
            {{ formatNumber(r.value) }}
          </span>
          <span
            v-if="hasAvg"
            class="w-8 shrink-0 text-right font-mono text-faint text-xs tabular-nums"
          >
            {{ r.avg ?? '–' }}
          </span>
        </div>
      </component>
    </template>
    <p v-if="!rows.length" class="py-6 text-center text-faint text-meta">
      {{ empty }}
    </p>
  </div>
</template>
