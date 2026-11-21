<script setup lang="ts">
import type { Book } from '@/lib/book'
import type { BarRow, Column } from '@/lib/chart'
import type { LedgerYear } from '@/lib/ledger'

definePageMeta({ layout: false })
useHead({ title: 'Styleguide · Books' })

const surfaces = [
	{ cls: 'bg-background', name: 'background', role: 'Page / desk' },
	{ cls: 'bg-card', name: 'card', role: 'Panels, stat tiles' },
	{ cls: 'bg-muted', name: 'muted', role: 'Tracks, cover placeholder' },
	{ cls: 'bg-accent', name: 'accent', role: 'Hover fill' },
	{ cls: 'bg-primary', name: 'primary', role: 'Selected pill (ink)' },
]
const inks = [
	{ cls: 'bg-foreground', name: 'foreground', role: 'Titles, figures' },
	{
		cls: 'bg-muted-foreground',
		name: 'muted-foreground',
		role: 'Authors, meta, print',
	},
	{ cls: 'bg-faint', name: 'faint', role: 'Labels, units, notes' },
]
const lines = [
	{ cls: 'bg-border', name: 'border', role: 'Controls, chips, dashed empty' },
	{
		cls: 'bg-rule',
		name: 'rule',
		role: 'Row hairlines, stat dividers, gridlines',
	},
	{ cls: 'bg-edge', name: 'edge', role: 'Panel ring' },
	{ cls: 'bg-ring', name: 'ring', role: 'Focus outline' },
]
const states = [
	{ cls: 'bg-success', name: 'success', role: 'Goal met, reading' },
	{
		cls: 'bg-destructive',
		name: 'destructive',
		role: 'Goal missed, abandoned',
	},
]
const domain = [
	{ cls: 'bg-other', name: 'other', role: 'Everyone else (goal)' },
	{ cls: 'bg-wm', name: 'wm', role: 'White men (goal)' },
	{ cls: 'bg-untagged', name: 'untagged', role: 'Not tagged, not recorded' },
	{ cls: 'bg-place', name: 'place', role: 'Where it was set' },
	{ cls: 'bg-audiobook', name: 'audiobook', role: 'Audiobook format' },
]
const charts = [
	{ cls: 'bg-chart-1', name: 'chart-1', role: '= other' },
	{ cls: 'bg-chart-2', name: 'chart-2', role: '= wm' },
	{ cls: 'bg-chart-3', name: 'chart-3', role: '= place' },
	{ cls: 'bg-chart-4', name: 'chart-4', role: '= audiobook' },
	{ cls: 'bg-chart-5', name: 'chart-5', role: '= muted-foreground' },
]
const groups = [
	{ label: 'Surfaces', items: surfaces },
	{ label: 'Ink', items: inks },
	{ label: 'Lines', items: lines },
	{ label: 'State', items: states },
	{ label: 'Domain', items: domain },
	{ label: 'Chart', items: charts },
]

// Mock ledger controls and charts.
const sgYear = ref<LedgerYear>(2026)
const sgMode = ref<'tag' | 'format'>('tag')
const sgCols: Column[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(
	(m, i) => ({
		key: m,
		label: m,
		current: i === 4,
		parts: {
			other: [2, 1, 3, 4, 2, 0][i] ?? 0,
			wm: [1, 2, 0, 2, 1, 0][i] ?? 0,
			untagged: i === 3 ? 1 : 0,
		},
		aria: `${m} 2026`,
		tip: {
			title: `${m} 2026`,
			meta: ['3 books', '912 pp'],
			books: ['Permutation City'],
		},
	}),
)
const sgBars: BarRow[] = [
	{
		key: 'sf',
		label: 'science fiction',
		segments: [
			{ tone: 'other', value: 6 },
			{ tone: 'wm', value: 3 },
		],
		value: 9,
		avg: '5.4',
	},
	{
		key: 'west',
		label: 'western americana',
		segments: [
			{ tone: 'wm', value: 4 },
			{ tone: 'untagged', value: 1 },
		],
		value: 5,
		avg: '5.6',
	},
	{
		key: 'ai',
		label: 'ai',
		segments: [{ tone: 'other', value: 2 }],
		value: 2,
		avg: null,
	},
]
const sgPlaces: BarRow[] = [
	{
		key: 'ca',
		label: 'California',
		sub: 'Monterey',
		segments: [{ tone: 'place', value: 7 }],
		value: 7,
	},
	{
		key: 'mt',
		label: 'Montana',
		segments: [{ tone: 'place', value: 3 }],
		value: 3,
	},
]

// Mock shelf. Illustrative records shaped like sync-site.ts output.
const books: Book[] = [
	{
		title: 'On the Calculation of Volume I',
		slug: 'on-the-calculation-of-volume-i',
		status: 'read',
		author: ['Solvej Balle'],
		pages: 172,
		publication_year: 2020,
		finished_at: '2026-11-20',
		rating: 6,
		audible: false,
		white_male_author: false,
		series: ['On the Calculation of Volume'],
		series_number: 1,
	},
	{
		title: 'Permutation City',
		slug: 'permutation-city',
		status: 'read',
		author: ['Greg Egan'],
		cover_image:
			'https://upload.wikimedia.org/wikipedia/en/f/fe/PermutationCity%281stEd%29.jpg',
		pages: 310,
		publication_year: 1994,
		started_at: '2025-10-05',
		finished_at: '2025-10-15',
		rating: 5,
		audible: true,
		white_male_author: true,
	},
	{
		title: 'A Book With No Rating Yet',
		slug: 'a-book-with-no-rating-yet',
		status: 'read',
		author: ['Placeholder Author'],
		finished_at: '2025-08-02',
		pages: 1,
		white_male_author: null,
	},
	{
		title: 'The Currently Open One',
		slug: 'the-currently-open-one',
		status: 'reading',
		author: ['Another Author', 'Co Author'],
		started_at: '2026-11-18',
		pages: 412,
		audible: true,
		white_male_author: false,
	},
	{ title: 'Someday Maybe', slug: 'someday-maybe', status: 'to-read' },
	{
		title: 'Put Down Halfway',
		slug: 'put-down-halfway',
		status: 'abandoned',
		author: ['Third Author'],
		pages: 288,
		publication_year: 2011,
		white_male_author: true,
	},
]
</script>

<template>
  <main class="mx-auto grid max-w-7xl gap-10 px-5 pt-7 pb-14 max-sm:px-4">
    <PageHeader
      eyebrow="books-ui"
      title="Styleguide"
      subtitle="Every token and primitive, forced light and forced dark. The page itself follows the system."
    />

    <StyleguideThemePair title="Color tokens">
      <div v-for="g in groups" :key="g.label" class="grid gap-2">
        <Eyebrow>{{ g.label }}</Eyebrow>
        <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <div
            v-for="t in g.items"
            :key="t.name"
            class="flex items-center gap-2.5 rounded-lg bg-card p-2 ring-1 ring-edge"
          >
            <span :class="['size-8 shrink-0 rounded-md ring-1 ring-edge', t.cls]" />
            <span class="grid min-w-0">
              <span class="truncate font-mono text-xs">{{ t.name }}</span>
              <span class="truncate text-faint text-xs">{{ t.role }}</span>
            </span>
          </div>
        </div>
      </div>
    </StyleguideThemePair>

    <StyleguideThemePair title="Typography">
      <div class="grid gap-4 rounded-xl bg-card p-5 ring-1 ring-edge">
        <div>
          <Eyebrow>Title · display 750</Eyebrow>
          <p class="font-display font-heavy text-title tracking-display">Reading ledger</p>
        </div>
        <div>
          <Eyebrow>Figure · display 750</Eyebrow>
          <p class="font-display font-heavy text-figure tabular-nums tracking-display">23</p>
        </div>
        <div>
          <Eyebrow>Heading · display 600</Eyebrow>
          <p class="font-display font-semibold text-heading">Books finished by month</p>
        </div>
        <div>
          <Eyebrow>Body · Plex Sans, no size class</Eyebrow>
          <p>More books by everyone else than by white men. Prose never carries a size modifier.</p>
        </div>
        <div>
          <Eyebrow>Meta · text-meta</Eyebrow>
          <p class="text-meta text-muted-foreground">Greg Egan, Ted Chiang</p>
        </div>
        <div>
          <Eyebrow>Data · Plex Mono, tabular</Eyebrow>
          <p class="font-mono text-xs tabular-nums">2025-10-15 · 310 pages · 5/8</p>
        </div>
      </div>
    </StyleguideThemePair>

    <StyleguideThemePair title="Page header">
      <PageHeader
        eyebrow="kissmygritts · books"
        title="Reading ledger "
        subtitle="As of 2026-11-21 · 243 books"
      >
        <template #title-suffix>
          <span class="text-faint tabular-nums">2026</span>
        </template>
        <template #actions>
          <Badge variant="default" class="font-mono tabular-nums">2026</Badge>
          <Badge variant="outline" class="font-mono tabular-nums">2025</Badge>
        </template>
      </PageHeader>
    </StyleguideThemePair>

    <StyleguideThemePair title="Stat grid · the year in numbers">
      <StatGrid label="The year in numbers">
        <StatTile label="Books" :value="23" unit="books" />
        <StatTile label="Pages" :value="7412" unit="pages" />
        <StatTile label="Avg rating" value="5.4" unit="/ 8" />
        <StatTile label="Audiobook" :value="39" unit="%" note="9 of 23 books" />
      </StatGrid>
      <StatGrid :cols="2">
        <StatTile label="Avg length" :value="322" unit="pages" />
        <StatTile label="Not recorded" :value="null" unit="pages" />
      </StatGrid>
    </StyleguideThemePair>

    <StyleguideThemePair title="Badges">
      <div class="flex flex-wrap gap-2">
        <StatusBadge status="read" />
        <StatusBadge status="reading" />
        <StatusBadge status="to-read" />
        <StatusBadge status="abandoned" />
      </div>
      <div class="grid gap-2">
        <RatingBadge v-for="r in [8, 6, 3, 1]" :key="r" :rating="r" />
        <RatingBadge :rating="null" />
      </div>
      <div class="flex flex-wrap gap-x-4 gap-y-2">
        <AuthorTag :value="false" />
        <AuthorTag :value="true" />
        <AuthorTag :value="null" />
      </div>
      <div class="flex flex-wrap gap-x-4 gap-y-2 text-meta text-muted-foreground">
        <span class="inline-flex items-center gap-1.5"><Swatch tone="place" />Place</span>
        <span class="inline-flex items-center gap-1.5"><Swatch tone="audiobook" />Audiobook</span>
        <span class="inline-flex items-center gap-1.5"><Swatch tone="print" />Print</span>
      </div>
    </StyleguideThemePair>

    <StyleguideThemePair title="Site nav · year filter · segmented control · legend">
      <SiteNav />
      <YearFilter v-model="sgYear" :years="[2026, 2025, 2024, 2018]" />
      <SegmentedControl
        v-model="sgMode"
        label="Color by"
        :options="[
          { value: 'tag', label: 'Author' },
          { value: 'format', label: 'Format' },
        ]"
      />
      <Legend
        :items="[
          { tone: 'other', label: 'Everyone else', value: 25 },
          { tone: 'wm', label: 'White men', value: 29 },
          { tone: 'untagged', label: 'Not tagged', value: 0 },
        ]"
      />
    </StyleguideThemePair>

    <StyleguideThemePair title="Charts · columns, bars, meter (w-share)">
      <Panel title="Books finished by month" note="books">
        <ChartColumns
          :columns="sgCols"
          :series="[
            { key: 'other', tone: 'other' },
            { key: 'wm', tone: 'wm' },
            { key: 'untagged', tone: 'untagged' },
          ]"
          :height="140"
          label="Books finished by month"
        />
      </Panel>
      <Panel title="What it was" note="books · avg /8">
        <ChartBars :rows="sgBars" wide />
      </Panel>
      <Panel title="Where it was set" note="books">
        <ChartBars :rows="sgPlaces" />
      </Panel>
      <div class="flex h-3.5 gap-0.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
        <span class="h-full w-share bg-other" :style="{ '--share': '46%' }" />
        <span class="h-full w-share bg-wm" :style="{ '--share': '54%' }" />
      </div>
      <p class="font-mono text-faint text-xs">
        w-share: width from a --share CSS var set in style; the only way to size a bar.
      </p>
    </StyleguideThemePair>

    <StyleguideThemePair title="Spec line">
      <SpecLine :items="['2025-10-15', '310 pages', 'pub 1994', 'isbn 9781922240088']" />
      <SpecLine :items="['started 2026-11-18', null, '412 pages']" />
    </StyleguideThemePair>

    <StyleguideThemePair title="Covers">
      <div class="flex flex-wrap items-end gap-4">
        <BookCover :src="books[1]?.cover_image" title="Permutation City" size="lg" />
        <BookCover :src="books[1]?.cover_image" title="Permutation City" size="md" />
        <BookCover :src="books[1]?.cover_image" title="Permutation City" size="sm" />
        <BookCover title="On the Calculation of Volume I" size="lg" />
        <BookCover title="The Left Hand of Darkness" size="md" />
        <BookCover title="Someday Maybe" size="sm" />
      </div>
    </StyleguideThemePair>

    <StyleguideThemePair title="Panel · mock shelf">
      <Panel title="The shelf" note="6 books · newest finish first">
        <BookRow v-for="b in books" :key="b.slug" :book="b" />
      </Panel>
    </StyleguideThemePair>

    <StyleguideThemePair title="Empty state">
      <Panel title="On the nightstand">
        <EmptyState title="Nothing on the nightstand">
          No book is marked reading right now.
        </EmptyState>
      </Panel>
    </StyleguideThemePair>
  </main>
</template>
