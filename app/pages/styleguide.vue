<script setup lang="ts">
// Every token and primitive, both themes, both surfaces. The rules are in
// .claude/skills/books-ui/SKILL.md.
import type { BookStatus } from '@/lib/book'
import { LENSES, midSentence } from '@/lib/lens'
import { PALETTES } from '@/lib/palette'

useHead({ title: 'Styleguide' })

const { all, finished, years, currentYear } = await useLedger()

const page = [
	{
		cls: 'bg-background',
		name: 'background',
		role: 'The page surface (/books)',
	},
	{ cls: 'bg-muted', name: 'muted', role: 'Cover placeholder' },
	{
		cls: 'bg-foreground',
		name: 'foreground',
		role: 'Ink: titles, rules, dots',
	},
	{
		cls: 'bg-muted-foreground',
		name: 'muted-foreground',
		role: 'Counts beside labels',
	},
	{ cls: 'bg-faint', name: 'faint', role: 'Same value as rule; never text' },
	{ cls: 'bg-border', name: 'border', role: 'Strong rule: table top, header' },
	{ cls: 'bg-rule', name: 'rule', role: 'Hairline between rows' },
]
const field = [
	{ cls: 'bg-field', name: 'field', role: 'The ground of / and /dashboard' },
	{
		cls: 'bg-field-card',
		name: 'field-card',
		role: 'The book card: the field’s other shade',
	},
	{
		cls: 'bg-field-foreground',
		name: 'field-foreground',
		role: 'Ink on the field',
	},
]
const type = [
	{
		cls: 'font-extralight text-title tracking-display',
		name: 'text-title',
		note: '40–88px, 200',
	},
	{
		cls: 'font-extralight text-figure tracking-display tabular-nums',
		name: 'text-figure',
		note: '52–120px, 200',
	},
	{
		cls: 'font-extralight text-verdict',
		name: 'text-verdict',
		note: '30–56px, 200',
	},
	{ cls: 'font-normal text-heading', name: 'text-heading', note: '17px, 400' },
	{ cls: '', name: '(body)', note: '16px, 300' },
	{ cls: 'text-sm', name: 'text-sm', note: '14px' },
	{ cls: 'text-meta', name: 'text-meta', note: '13px' },
	{ cls: 'text-xs', name: 'text-xs', note: '12px' },
]

const sgYear = useLedgerYear(years, currentYear)
const sgStatus = ref<BookStatus>('read')
// The palette swatches: the one the menu picked (no attribute, so it
// inherits from <html>), then every palette fixed by its own attribute.
const swatches = [{ id: 'current', label: 'Current' }, ...PALETTES]
const sample = computed(() => finished.value.slice(0, 18))
const mapBooks = computed(() =>
	finished.value.filter((b) => b.regions.length).slice(0, 24),
)
const tableBooks = computed(() => [
	...finished.value.filter((b) => b.audible).slice(0, 1),
	...finished.value.filter((b) => b.white_male_author === true).slice(0, 1),
	...all.value
		.filter((b) => b.status === 'read' && b.white_male_author == null)
		.slice(0, 1),
])
const rows = computed(() => [
	{
		key: 'a',
		label: 'Everyone else',
		sub: '6 books',
		books: sample.value
			.filter((b) => b.white_male_author === false)
			.slice(0, 6),
	},
	{
		key: 'b',
		label: 'White men',
		sub: '6 books',
		books: sample.value.filter((b) => b.white_male_author === true).slice(0, 6),
	},
])
const columns = computed(() =>
	['Jan', 'Feb', 'Mar', 'Apr'].map((m, i) => ({
		key: m,
		label: m,
		name: `${m} 2026`,
		books: sample.value.slice(i * 3, i * 3 + ([3, 5, 2, 4][i] ?? 0)),
	})),
)
</script>

<template>
  <div class="mx-auto grid max-w-ledger gap-14 px-4 pt-30 pb-24 sm:px-8 lg:px-14">
    <div class="grid gap-3">
      <h1 class="font-extralight text-title tracking-display">Styleguide</h1>
      <p class="max-w-prose">
        Two surfaces: the field of the home page and dashboard, and the pale
        page of Books, tinted from the field. One family, Outfit. One mark, the dot: solid
        for everyone else, a ring for a white man, a pip for untagged. On home and the
        dashboard a lens can swap the field the dots read.
      </p>
    </div>

    <StyleguideThemePair title="Page surface tokens">
      <ul class="grid gap-2 sm:grid-cols-2">
        <li v-for="t in page" :key="t.name" class="flex items-center gap-3">
          <span :class="['size-8 shrink-0 rounded-full border border-rule', t.cls]" />
          <span class="text-meta"><span class="font-medium">{{ t.name }}</span><br />{{ t.role }}</span>
        </li>
      </ul>
    </StyleguideThemePair>

    <StyleguideThemePair title="Field tokens" field>
      <ul class="grid gap-2 sm:grid-cols-2">
        <li v-for="t in field" :key="t.name" class="flex items-center gap-3">
          <span :class="['size-8 shrink-0 rounded-full border border-current', t.cls]" />
          <span class="text-meta"><span class="font-medium">{{ t.name }}</span><br />{{ t.role }}</span>
        </li>
      </ul>
    </StyleguideThemePair>

    <section class="grid gap-4">
      <h2 class="font-normal text-heading">Field palettes</h2>
      <p class="max-w-prose">
        The field's hue, one per viewer, cycled from the menu. Light, then
        dark: the field, then the page it tints (ground and ink, from
        --page-ground-* / --page-ink-*), which covers dither to. Current
        follows the menu; the rest are fixed.
      </p>
      <ul class="flex flex-wrap gap-6 border-border border-t pt-4">
        <li v-for="p in swatches" :key="p.id" class="grid justify-items-center gap-2">
          <span class="flex">
            <span
              v-for="theme in ['light', 'dark']"
              :key="theme"
              :data-palette="p.id === 'current' ? undefined : p.id"
              :data-theme="theme"
              class="size-8 bg-field first:rounded-l-full last:rounded-r-full"
            />
          </span>
          <span class="flex">
            <span
              v-for="theme in ['light', 'dark']"
              :key="theme"
              :data-palette="p.id === 'current' ? undefined : p.id"
              :data-theme="theme"
              class="flex size-8 items-center justify-center border border-rule first:rounded-l-full last:rounded-r-full"
            >
              <span class="size-3 rounded-full bg-foreground" />
            </span>
          </span>
          <span class="text-meta">{{ p.label }}</span>
        </li>
      </ul>
    </section>

    <section class="grid gap-4">
      <h2 class="font-normal text-heading">Type scale</h2>
      <ul class="grid gap-4 border-border border-t pt-4">
        <li v-for="t in type" :key="t.name" class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-rule border-b pb-4">
          <span :class="t.cls">{{ t.name === 'text-figure' ? '5.5/8' : 'Housekeeping' }}</span>
          <span class="text-meta tabular-nums">{{ t.name }}, {{ t.note }}</span>
        </li>
      </ul>
    </section>

    <StyleguideThemePair title="The dot" field>
      <div class="flex flex-wrap items-center gap-8 text-meta">
        <span class="flex items-center gap-2.5"><BookDot tag="other" />Everyone else</span>
        <span class="flex items-center gap-2.5"><BookDot tag="wm" />White man</span>
        <span class="flex items-center gap-2.5"><BookDot tag="untagged" />Untagged</span>
      </div>
      <div class="flex items-center gap-4 text-meta">
        <div class="dot-grid w-30">
          <BookDot tag="other" size="grid" /><BookDot tag="wm" size="grid" /><BookDot tag="untagged" size="grid" />
        </div>
        grid (home), md (charts), sm (tags)
      </div>
    </StyleguideThemePair>

    <StyleguideThemePair title="Dot lenses" field>
      <DotLegend />
      <ul class="grid gap-1.5 text-meta">
        <li v-for="l in LENSES" :key="l.id">
          {{ l.name }}: solid {{ midSentence(l.label.other) }}, ring {{ midSentence(l.label.wm) }}, pip {{ midSentence(l.label.untagged) }}
        </li>
      </ul>
    </StyleguideThemePair>

    <StyleguideThemePair title="Year filter and caption" field>
      <YearFilter v-model="sgYear" :years="years" />
      <p class="max-w-prose border-current border-t pt-3 text-sm">
        <BookCaption v-if="sample[0]" :book="sample[0]" />
      </p>
    </StyleguideThemePair>

    <StyleguideThemePair title="Year filter on the page">
      <YearFilter v-model="sgYear" :years="years" surface="page" />
    </StyleguideThemePair>

    <StyleguideThemePair title="Dot charts" field>
      <DotColumns :columns="columns" :per-row="2" />
      <DotRows :rows="rows" />
      <p class="font-extralight text-verdict">No page counts recorded.</p>
    </StyleguideThemePair>

    <StyleguideThemePair title="Book card" field>
      <BookCard v-if="tableBooks[0]" :book="tableBooks[0]" />
      <p class="max-w-prose text-meta">
        Opens over a dot: after a beat on hover, at once on a click, tap or
        arrow key. The field color, inked in white (cover too, via
        filter-dither-field), so it follows the palette. No border or shadow.
      </p>
    </StyleguideThemePair>

    <StyleguideThemePair title="Map" field>
      <PlaceMap :books="mapBooks" view="us" />
      <p class="max-w-prose text-meta">
        Regions shaded with the ink, more opaque for more books; empty regions
        are the ink at 10%; field-colored gaps split them all. No hover; the
        counts are in the aria-label.
      </p>
    </StyleguideThemePair>

    <StyleguideThemePair title="Figures" field>
      <StatGrid label="Sample figures">
        <StatTile :value="57" label="books finished in 2026" />
        <StatTile value="5.5" suffix="/8" label="average rating, from 50 rated books" />
      </StatGrid>
    </StyleguideThemePair>

    <StyleguideThemePair title="Book rows">
      <SegmentedControl
        v-model="sgStatus"
        label="List"
        :options="[
          { value: 'read', label: 'Finished', count: 213 },
          { value: 'reading', label: 'Reading', count: 2 },
        ]"
      />
      <BookTable :books="tableBooks" status="read" />
      <div class="flex flex-wrap items-center gap-5">
        <BookCover :src="tableBooks[0]?.cover_image" :title="tableBooks[0]?.title ?? ''" />
        <BookCover title="No Cover Here" />
        <RatingBadge :rating="6" />
        <RatingBadge :rating="null" />
        <AuthorTag :value="false" />
        <Badge>Audiobook</Badge>
      </div>
      <EmptyState title="No books here">Pick another year or list above.</EmptyState>
    </StyleguideThemePair>
  </div>
</template>
