---
name: books-ui
description: Build or modify books.gritts.net UI — pages, components, charts, layout, styling, copy. Use whenever adding a page, panel, chart or component, restyling existing UI, writing user-facing strings, choosing a surface, mark or color, or touching tokens. Fires on "build a page for X", "add a chart for Y", "show the books/goal", "style this", "/books-ui", and on edits under `app/pages/`, `app/components/`, `app/layouts/` or `app/assets/css/main.css`.
---

# books-ui

books.gritts.net is a **reading ledger**: one person's books read and to read,
rendered from the frontmatter the vault's `sync-site.ts` writes. The look was
approved as `prototypes/11-dots.html` (2026-11-21): a flat blue field, white
ink, every book a dot. This is the rulebook; `/styleguide` is the living
visual reference. **Prefer the styleguide over re-deriving styles.**

## The three anchors

1. **Every book is a dot.** One mark carries the whole site: solid for
   everyone else, a ring for a white man, a small pip for untagged
   (`<BookDot>`). Charts are arrangements of dots, one per book, never bars,
   lines or areas. Pointing at a dot names the book.
2. **Quiet, with air.** One chart per dashboard page, a full screen of field
   around it. Home is the dots and one static line under them ("A dot for every book
   I've read."): no other copy, no counts. No
   cards, shadows, gradients, textures or illustration; no skeuomorphism.
3. **Measured.** Ratings are the owner's **1–8 scale**, always shown as `/8`
   or eight circles, never stars or rescaled. The one exception is the
   rating chart's column labels, bare `1` to `8`, because its caption states
   the scale. Every figure in prose carries
   its unit (`310 pages`, `23 books`). Every frontmatter field is public,
   including `white_male_author`, to-read and abandoned; note bodies never
   are.

If a choice fights an anchor, raise it in chat before building.

## Surfaces

Two, and a page uses one:

| Surface | Where | How |
|---|---|---|
| **Field** | `/`, `/dashboard` | `useHead({ bodyAttrs: { class: 'bg-field text-field-foreground' } })`. White ink; every line, dot and focus ring is `currentColor`. |
| **Page** | `/books`, `/styleguide` | The body default: `bg-background text-foreground`. A pale tint of the field with ink in the same hue, desaturated, so it blends with the ground. Derived from `--field-light` / `--field-dark`, so it follows the palette. |

Components draw in `currentColor` (`border-current`, `bg-current`) so they
work on either surface. Reach for a named token only for what the page
surface needs beyond its ink: `border-rule` (row hairlines), `border-border`
(strong rule), `bg-muted` (cover placeholder), `text-muted-foreground`
(counts beside labels).

## Tokens

Defined in `app/assets/css/main.css` (oklch, both themes, mapped through
`@theme inline`). Light and dark follow the system; `data-theme` forces a
subtree. **Never** raw palette (`bg-blue-600`), arbitrary values
(`text-[11px]`, `w-[112px]`) or arbitrary variants (`aria-[x=y]:…`). SVG
attributes and CSS-var `style` (`--cols`, `--per-row`, `--i`) are the only
exceptions. **Never `dark:`**: tokens carry both themes.

| Token | Use |
|---|---|
| `bg-field`, `text-field-foreground` | The field surface. |
| `bg-background`, `text-foreground` | The page surface and its ink. |
| `--page-ground-*`, `--page-ink-*` | The page's ground and ink per theme (`-light`, `-dark`), for the cover dither only. Not utilities. |
| `text-muted-foreground` | Counts beside tab labels. Not for titles. |
| `bg-muted` | Cover placeholder. |
| `border-border` | Table top and header rule. |
| `border-rule` | Hairline between book rows. Also `faint`; never text. |

Custom utilities (in `main.css`): `border-dot` (a dot's 1.5px outline),
`--dot` / `--dot-gap` (the one dot size, on `:root`), `w-dot-grid` + `dot-grid` (the home grid), `w-stack` (a dot
column, `--per-row` wide), `dot-delay` + `animate-dot-in` (the home
entrance), `grid-cols-book` (a book row, columns from a 56rem
container),
`filter-dither` (covers). A new color or size is **promoted in `main.css`
first** (`:root`, both dark blocks, `@theme inline`), added to
`/styleguide`, then used. A page color is derived from the field
(`oklch(from var(--field-light) L calc(c * k) h)`), never a fixed hue, so it
follows the palette.

## Typography

One family: **Outfit** (`font-sans`), light (300) by default. Display sizes
are extralight (200); a book title is 400; emphasis is 500. Never bold.

| Token | Size | For |
|---|---|---|
| `text-title` | 40–88px, 200 | Page and dashboard titles. |
| `text-figure` | 52–120px, 200 | The year in numbers. |
| `text-verdict` | 30–56px, 200 | The goal's verdict; empty chart messages. |
| `text-heading` | 17px, 400 | A book's title in a row. |
| *(none)* | 16px | Prose. Write no size class. |
| `text-sm` | 14px | Captions, year filter, dates and pages in rows. |
| `text-meta` | 13px | Authors, column heads, chart labels, tags. |
| `text-xs` | 12px | `6/8` after rating circles, the audiobook chip. |

**Sentence case everywhere**; no uppercase, no tracked eyebrows, no mono.
Dates read `20 Nov 2026` (`longDate`). Numbers are `tabular-nums`. Book
titles and author names exactly as the vault spells them.

## Primitives: use these, don't hand-roll

| Need | Use |
|---|---|
| Page links | `<GooeyMenu>` (in the layout) |
| A book as a mark | `<BookDot :value="white_male_author" size>` (`grid`, `md`, `sm`) |
| The home grid | `<DotGrid :books>` |
| A dashboard page | `<DashPage id title caption :years v-model:year>`; one chart in the slot |
| Dot columns | `<DotColumns :columns :per-row>` |
| Dot rows | `<DotRows :rows>` |
| A map of where books were set | `<PlaceMap :books :view>` (`us`, `world`) |
| A hovered book in words | `<BookCaption :book>` (a `DashPage` caption does this itself) |
| Figures | `<StatTile value suffix label>` in `<StatGrid>` |
| Year scope | `<YearFilter v-model :years>` |
| Tabs, a sort switch | `<SegmentedControl v-model :options label>` |
| A list of books | `<BookTable :books :status>` |
| Cover | `<BookCover :src :title>` (circle, dithered, initials fallback) |
| Rating | `<RatingBadge :rating>` (eight circles + `6/8`) |
| Author tag | `<AuthorTag :value>` (dot + words) |
| Chip | `<Badge>` (one weight: hairline pill) |
| Nothing to show | `<EmptyState title>` + prose slot |

A dashboard chart is a `components/ledger/*` component that renders a
`<DashPage>` and passes `v-model:year` through. Dots inside `<DotColumns>` /
`<DotRows>` set the page's hovered book via `useHoverBook()`;
the caption shows it, and the chart's `role="img"` aria-label states the
count. A mark that isn't one book (a region on `<PlaceMap>`) has no hover;
its counts live in the aria-label. No tooltips.

## Signature elements: restraint is the rule

- **The dot code.** Solid / ring / pip is the only color statement: the
  goal is read by eye as more solid than ring. Don't spend a fill or a ring
  on anything that isn't a book's author tag.
- **The home grid.** Every finished book, oldest first, about 3:1, reflowing
  on a phone. One entrance animation (`motion-safe:` only), nothing else
  moves.
- **Dithered covers.** Two inks, the page's foreground and background
  (`filter-dither`, following the palette), or white over the card color
  on the field (`ink="field"`).
- **Plain header links**, no arrows or icons; the current page is medium weight.

## Charts

No chart library; dots in flex layouts. Group with the functions in
`app/lib/ledger.ts` (the panel math, ported from the private ledger; **don't
change it** without the owner). Order dots oldest finish first
(`byFinishAsc`). Counts over a column are its label (the dots are the unit);
the aria-label carries the words. A page's caption states the scale and
what's left out (`34 books unrated, not shown.`).

## Before you ship: checklist

- [ ] The page picks a surface; field pages set the body class.
- [ ] No raw palette, arbitrary values or variants, no `dark:`.
- [ ] Every book shown as a mark is a `<BookDot>`; ratings as `/8` (chart axis excepted).
- [ ] Sentence case; no uppercase, no mono; prose has no size class.
- [ ] One chart per dashboard page; caption states scale and omissions.
- [ ] Null fields render as untagged / not recorded / `–`, never vanish.
- [ ] Any new token is in `main.css` (both themes) and on `/styleguide`.
- [ ] Checked in both themes; `npm run lint` and `npm run generate` pass.

## Anti-patterns

- Stars or rescaled ratings.
- Bars, lines, areas or pies: every book is a dot. The one exception is
  `<PlaceMap>`: regions shaded with the ink at an opacity by count, empty
  regions at 10%, every region stroked 1.5px in `field` as a gap, a legend
  of opacity dots. No other color ramp.
- Text on the home page beyond its one static line.
- A second chart on a dashboard page, or a different color per page.
- Cards, shadows, gradients, textures, skeuomorphic touches.
- Uppercase eyebrows, monospace labels, meta joined with middle dots.
- Hiding to-read, abandoned or the author tag.

## Canonical references

- `/styleguide` (`app/pages/styleguide.vue`): every token and primitive,
  both themes, both surfaces. **Read first.**
- `prototypes/11-dots.html`: the approved prototype.
- `app/assets/css/main.css`: tokens, type scale, utilities.
- `app/lib/book.ts` (the `Book` shape, `RATING_MAX`, tag labels),
  `app/lib/derive.ts` (derived fields, sort helpers), `app/lib/format.ts`
  (`plural`, `longDate`, `authorList`), `app/lib/ledger.ts` (panel math).
