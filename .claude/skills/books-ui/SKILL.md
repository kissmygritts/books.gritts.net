---
name: books-ui
description: Build or modify books.gritts.net UI — pages, components, charts, layout, styling, copy. Use whenever adding a page, panel, chart or component, restyling existing UI, writing user-facing strings, choosing a container, badge or color, or touching tokens. Fires on "build a page for X", "add a panel/chart for Y", "show the shelf/nightstand/goal", "style this", "/books-ui", and on edits under `app/pages/`, `app/components/`, `app/layouts/` or `app/assets/css/main.css`.
---

# books-ui

books.gritts.net is a **reading ledger**: one person's books read and to read,
rendered from the frontmatter the vault's `sync-site.ts` writes. The look is
the private Reading Ledger's (vault `.claude/skills/book/ledger/template.html`),
already approved, now made into a system. It drifts when panels get added
without referring back to it. This is the rulebook; `/styleguide` is the
living visual reference. **Prefer the styleguide over re-deriving styles.**

## The three anchors (DRAFT, for the owner to edit)

1. **The books are the content.** Title, author and cover lead every list and
   card. Chrome, charts and counts serve the books; nothing upstages a title.
   A book is shown by `<BookRow>` / `<BookCover>`, never as a bare string in a
   chart tooltip alone.
2. **Measured, not decorated.** Every figure carries its unit or scale:
   `310 pages`, `23 books`, `6/8`, `pub 1994`, `39 %`. Ratings are the
   owner's **1–8 scale**, shown as `/8`, never rescaled to stars or 5 or 10.
   All numbers are `tabular-nums`. Charts are plain SVG marks on flat panels:
   no gradients, glows, 3D, or decorative illustration.
3. **Calm and dense.** One reading column (`max-w-ledger`, 1040px), panels on
   a quiet desk, hairline rules, small type for data and default size for
   prose. Color is information (the goal pair, place, audiobook, state),
   never ornament. Every frontmatter field is public, including
   `white_male_author`, to-read and abandoned books; note bodies never are.

If a choice fights an anchor, raise it in chat before building.

## Token cheat sheet

Semantic roles only, defined in `app/assets/css/main.css` (shadcn/ui model,
oklch, mapped through `@theme inline`). Light and dark follow the system;
`data-theme="light|dark"` on an element forces a subtree. **Never** raw palette
(`bg-zinc-*`, `text-blue-600`), arbitrary values (`text-[11px]`, `w-[112px]`,
`bg-[#fff]`) or arbitrary variants (`[&>svg]:…`, `data-[x=y]:…`). SVG
attributes (`x`, `width`, `r`, `viewBox`) and CSS-var `style` are the only
exceptions. **Never `dark:`**: tokens already carry both themes.

`main.css` is authoritative; this table is curated usage guidance. If it
names something `main.css` no longer defines, fix the table.

| Surface | Token | Notes |
|---|---|---|
| Page / desk | `bg-background` | Set by the layout. |
| Panel / tile | `bg-card` + `ring-1 ring-edge` | The ledger's surface + ring shadow. |
| Track / placeholder | `bg-muted` | Empty meter, cover fallback, chart track. |
| Hover fill | `bg-accent` (`/45` on rows) | |
| Selected pill | `bg-primary text-primary-foreground` | Primary is **ink**, not a brand hue. Used for the active year. |
| Title / figure text | `text-foreground` | |
| Secondary text | `text-muted-foreground` | Authors, subtitles, meta, the "print" series. |
| Labels, units, notes | `text-faint` | Eyebrows, axis ticks, units after figures. Never for prose. |
| Control / chip edge | `border-border` | Default; `border-dashed` for empty states. |
| Hairline | `border-rule`, `bg-rule` | Between rows, chart gridlines, stat dividers. |
| Focus | `outline-ring` | Global `:focus-visible`; don't restyle. |
| Goal met / reading | `text-success`, `bg-success/12` | |
| Goal missed / abandoned | `text-destructive`, `bg-destructive/12` | |
| **Goal pair** | `bg-other` / `bg-wm` | Everyone else / white men. Reserved for the author tag. |
| Not tagged / not recorded | `bg-untagged` | `white_male_author: null`, `audible: null`. |
| Place | `bg-place` | Where it was set; map ramp is `color-mix` of place into muted. |
| Audiobook | `text-audiobook`, `bg-audiobook` | `audible: true`. Print is `muted-foreground`. |
| Chart series | `chart-1…5` | Aliases: other, wm, place, audiobook, muted-foreground. |

**Hard rules:** fonts via `font-display` / `font-sans` / `font-mono` only;
every number `tabular-nums`; never a bare number; a new color or size is
**promoted in `main.css` first** (`:root`, both dark blocks, and
`@theme inline`), added to `/styleguide`, then used.

## Typography & casing

Bricolage Grotesque (`font-display`) for titles, panel headings and big
figures. IBM Plex Sans (`font-sans`) for everything read. IBM Plex Mono
(`font-mono`) for data. Sizes are tokens from the ledger's scale:

| Token | Size | For |
|---|---|---|
| `text-title` | 28–40px fluid | Page `<h1>` only (via `<PageHeader>`). |
| `text-figure` | 44–72px fluid | The goal's two tallies. |
| `text-stat` | 30px | Stat tile figures. |
| `text-heading` | 17px | Panel `<h2>` (via `<Panel>`). |
| *(none)* | 15px | **Prose. Body size is the default; write no size class.** |
| `text-meta` | 13px | Authors, subtitles, chips, legends. |
| `text-xs` | 12px | Mono data, spec lines, panel notes. |
| `text-label` | 11px | Eyebrows, column heads, axis ticks. |

Casing depends on the kind of string:

- **Sentence case**: page and panel titles (`The shelf`, `Books finished by
  month`), prose, legends, badges, empty-state copy.
- **UPPERCASE, `tracking-label`, semibold, faint**: eyebrows, stat labels,
  column heads, group heads (`READING · 2`). Use `<Eyebrow>`; write the text in
  normal case, the component uppercases it.
- **lowercase mono**: dates (`2025-10-15`, ISO always), counts with units in
  spec lines (`310 pages`, `pub 1994`, `started 2026-11-18`), `unrated`.
- **Book titles and author names exactly as the vault spells them.** Never
  re-case, never truncate without `truncate` + the full text available.

## Container vocabulary: four roles

Ask: *is this a book, a figure, a set of figures, or page chrome?*

- **Panel** (`<Panel title note?>`): `rounded-xl bg-card p-5 ring-1 ring-edge`.
  Every ledger section (goal, charts, shelf, nightstand) is one panel. Two
  panels side by side: `grid gap-5 md:grid-cols-2`.
- **Stat grid** (`<StatGrid>` of `<StatTile>`): the year in numbers. The
  `gap-px` over `bg-rule` draws the dividers; never hand-roll tile borders.
- **Book row** (`<BookRow>`): one book inside a panel, cover + title + author
  + spec line, hairline between rows. Lists of books are stacks of rows.
- **No card**: `<PageHeader>` and the year filter are unframed chrome.

Don't invent a card weight (a `bg-card p-3` "mini panel", a shadowed book
card). If the four don't cover it, raise it first.

## Mandatory primitives: use these, don't hand-roll

| Need | Use | Don't |
|---|---|---|
| Page title | `<PageHeader eyebrow title subtitle?>` + `#actions` | a hand-rolled `<header>` / `<h1>` |
| Kicker / label | `<Eyebrow>` | inline `uppercase tracking-…` spans |
| Section | `<Panel title note?>` + `#head` / `#aside` | `rounded-xl bg-card …` by hand |
| Figures | `<StatTile label value unit>` in `<StatGrid>` | a big number in a div |
| Book status | `<StatusBadge status>` | mapping status → classes inline |
| Rating | `<RatingBadge :rating>` (dots + `6/8`) | stars, `6`, `★★★` |
| Generic chip | `<Badge variant>` (shadcn, `components/ui`) | `rounded-full px-2 …` |
| Author tag | `<AuthorTag :value="white_male_author">` | a colored dot + label by hand |
| Legend key | `<Swatch tone>` | `size-2.5 bg-…` spans |
| Metadata line | `<SpecLine :items>` (nullish items drop out) | mono spans joined with `·` |
| Cover | `<BookCover :src :title size>` (reka-ui Avatar; initials fallback) | a bare `<img>` |
| A book in a list | `<BookRow :book>` | title/author markup per page |
| Nothing to show | `<EmptyState title>` + prose slot | a centered grey sentence |
| Divider | `<Separator>` (shadcn, `bg-rule`) | `<hr>` |
| Year scope | `<YearFilter v-model :years>` (reka ToggleGroup) | hand-rolled pill buttons |
| Mode / sort switch | `<SegmentedControl v-model :options label>` | tabs by hand |
| Legend | `<Legend :items>` (swatch + label + count) | swatch spans in a flex row |
| Column chart | `<ChartColumns :columns :series label>` | divs with heights |
| Bar list | `<ChartBars :rows>` (label, track, count, avg) | grid rows by hand |
| Bar width | `w-share` + `:style="{ '--share': '40%' }"` | `w-[40%]`, inline `width:` |
| Tooltip on an HTML row | `<ChartTip :tip>` (reka Tooltip) | `title=` for data |
| Tooltip on SVG marks | `<ChartHover :tip :anchor>` around the `<svg>` | `<ChartTip>` inside `<svg>` |

New primitives follow `components/ui/badge`: reka-ui underneath when it has
the behavior, `cva` variants for shape, `cn()` for merging.

## Signature elements: restraint is the rule

- **The goal pair.** `other` (blue) vs `wm` (orange) is the site's one
  recurring color statement: the tally, the meter, the author tag, stacked
  columns. Don't spend those two hues on anything else.
- **Rating dots.** Eight dots, filled to the rating, then `n/8`. The scale is
  always visible.
- **Swatches.** 10px rounded squares key every color in a legend; legends
  sit in the panel head.
- **Display figures.** Bricolage at heavy weight for the page title and the
  goal tallies only.

No textures, gradients, illustrations or decorative icons. Lucide icons only
where they carry meaning (status, audiobook, reading now / up next).

## Charts

Hand-built SVG Vue components (d3-array for binning, d3-geo + topojson-client
for maps; npm, never a CDN). Marks fill with token classes (`fill-other`,
`fill-chart-3`) or `var(--…)`; gridlines `stroke-rule`, baseline
`stroke-border`, tick text `fill-faint` mono `text-label` `tabular-nums`.
Panel math lives in `app/lib/ledger.ts`, ported from the ledger's JS; keep
it in step so numbers match the private ledger. Hover content is a
`ChartTip` object (title · meta, lines, book titles up to 12). A reka Portal
declared inside `<svg>` mounts in the SVG namespace and renders nothing, so
SVG charts use one controlled `<ChartHover>` anchored to the hovered mark.
Every chart sits in a `<Panel>` with its scale in `note` (`your 1–8 scale`,
`by decade`), a legend of `<Swatch>`es, and an accessible label
(`role="img"` + `aria-label` stating the numbers). Motion only under
`motion-safe:`.

## Before you ship: checklist

- [ ] Page opens with `<PageHeader>`; sentence-case title.
- [ ] No raw palette, no arbitrary values or variants, no `dark:`.
- [ ] Every number `tabular-nums` with a unit or scale; ratings as `/8`.
- [ ] Prose has no size class; data uses the token sizes.
- [ ] Casing: sentence case titles, UPPERCASE eyebrows, lowercase mono data,
      titles and authors as written.
- [ ] Container is panel / stat grid / book row / no card.
- [ ] Primitives used instead of hand-rolled markup.
- [ ] Goal colors only for the author tag; null fields render as
      untagged / not recorded / `–`, never crash or vanish silently.
- [ ] Any new token is in `main.css` (both themes) and on `/styleguide`.
- [ ] Checked against `/styleguide` in both themes; `npm run lint` and
      `npm run generate` pass.

## Anti-patterns

- **Stars or rescaled ratings.** The scale is 1–8.
- **Bare numbers.** `310` → `310 pages`; `23` → `23 books`.
- **Raw palette / arbitrary values.** Promote a token first.
- **Spending the goal pair on decoration** (blue links, orange buttons).
- **A new card weight** or drop shadows on panels.
- **Rendering note bodies** or anything not in the synced frontmatter.
- **Hiding to-read / abandoned books or the author tag.** All public.
- **Charts from a CDN or a chart library.** Hand-built SVG.

## Canonical references

- `/styleguide` (`app/pages/styleguide.vue`): every token and primitive, both
  themes, mock shelf and stat grid. **Read first.**
- `app/assets/css/main.css`: tokens, type scale, ledger → token mapping.
- `app/components/`: the primitives; `components/ui/badge` is the pattern.
- `app/lib/book.ts`: the `Book` shape (the sync-site.ts data contract),
  `RATING_MAX`, author-tag helpers. `app/lib/derive.ts`: ledger.py's derived
  fields (`splitPlaces`, lowercase `genres`, `wikipediaUrl`) and sort helpers.
  `app/lib/format.ts`: number formatting.
- Vault `.claude/skills/book/ledger/template.html`: the approved look and the
  feature target for every panel.
